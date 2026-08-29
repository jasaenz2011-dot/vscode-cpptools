"""Lesson Writer Agent -- pack the context, draft the lesson, repair on demand."""

from __future__ import annotations

import re
from typing import Any

from .. import prompts
from ..contextpack import ContextPacker, PackedContext
from ..models import LessonRequest, Violation
from ..retrieval import Hit
from ..schemas import HUNTER_STEPS, LESSON_SCHEMA, schema_example
from ..util import get_logger, truncate_words
from .base import Agent
from .curriculum_mapper import MappingResult
from .standards_agent import StandardsPack

log = get_logger("dlg.agents.writer")

SCAFFOLD_NOTE = (
    "This draft was assembled without a language model. Standards, pacing, and the "
    "referenced district materials are real and verbatim; the sections left blank are the "
    "ones that need a model. Start Ollama (or set an API key) and regenerate to fill them."
)

# Share of the period each Hunter step gets in the scaffold. A teacher will
# move these; they exist so the minutes total the period from the start.
_STEP_SHARE = {
    "purpose": 0.05,
    "anticipatory_set": 0.10,
    "input": 0.15,
    "modeling": 0.20,
    "guided_practice": 0.20,
    "checking_for_understanding": 0.10,
    "independent_practice": 0.15,
    "closure": 0.05,
}


class LessonWriter(Agent):
    name = "lesson-writer"
    schema = LESSON_SCHEMA
    system_prompt = "lesson_writer.system"
    user_prompt = "lesson_writer.user"

    # ------------------------------------------------------------------
    def build_context(
        self, request: LessonRequest, mapping: MappingResult, pack: StandardsPack
    ) -> PackedContext:
        packer = ContextPacker(self.config.input_budget_tokens)

        packer.add("Standards in scope for this lesson", pack.to_block(), priority=0, pinned=True)

        if mapping.unit:
            packer.add(
                "Active unit from the scope and sequence",
                _unit_block(mapping),
                priority=1,
                pinned=True,
            )

        notes = [*mapping.notes, *pack.notes]
        if notes:
            packer.add("Gaps in the district documents", "\n".join(f"- {n}" for n in notes), priority=5)

        support = _render_hits(pack.support, limit=6)
        if support:
            packer.add("District materials that reference these standards", support, priority=20)

        extra = self._extra_context(request, mapping, pack)
        if extra:
            packer.add("Other retrieved district content", extra, priority=30)

        return packer.pack()

    def _extra_context(
        self, request: LessonRequest, mapping: MappingResult, pack: StandardsPack
    ) -> str:
        if not self.retriever:
            return ""
        seen = {hit.chunk.chunk_id for hit in pack.support}
        query_parts = [request.subject, f"grade {request.grade}"]
        if mapping.unit:
            query_parts += [mapping.unit.unit_name, mapping.unit.focus]
        query_parts += [standard.text for standard in pack.standards[:2]]
        hits = self.retriever.search(
            " ".join(part for part in query_parts if part),
            k=self.config.top_k,
            grade=request.grade,
            subject=request.subject,
            boost_codes=[standard.code for standard in pack.standards],
        )
        fresh = [hit for hit in hits if hit.chunk.chunk_id not in seen]
        return _render_hits(fresh, limit=6)

    # ------------------------------------------------------------------
    def run(
        self, request: LessonRequest, mapping: MappingResult, pack: StandardsPack
    ) -> tuple[dict[str, Any], PackedContext]:
        packed = self.build_context(request, mapping, pack)

        if self.offline:
            return self.scaffold(request, mapping, pack), packed

        system = prompts.render(
            self.system_prompt,
            district=self.config.district_name,
            duration=request.duration_minutes,
            grade=request.grade,
            schema=schema_example(self.schema),
        )
        user = prompts.render(
            self.user_prompt,
            duration=request.duration_minutes,
            grade=request.grade,
            subject=request.subject,
            unit=mapping.unit.label() if mapping.unit else "(not specified in the pacing guide)",
            lesson_number=request.lesson_number,
            class_profile=_class_profile(request),
            context=packed.text,
        )
        document = self.complete_json(system, user, self.schema)
        return document, packed

    # ------------------------------------------------------------------
    def repair(
        self,
        document: dict[str, Any],
        violations: list[Violation],
        pack: StandardsPack,
        request: LessonRequest,
    ) -> dict[str, Any]:
        """Send back only the failures, not the whole context, and ask for a fix."""
        import json

        system = prompts.render(
            self.system_prompt,
            district=self.config.district_name,
            duration=request.duration_minutes,
            grade=request.grade,
            schema=schema_example(self.schema),
        )
        allowed = "\n".join(f"- {s.code}: {s.text}" for s in pack.standards) or "(none resolved)"
        user = prompts.render(
            "repair.user",
            violations="\n".join(f"- {v.message} {v.hint}".strip() for v in violations),
            allowed_codes=allowed,
            draft=json.dumps(document, ensure_ascii=False, indent=2),
        )
        return self.complete_json(system, user, self.schema)

    # ------------------------------------------------------------------
    def scaffold(
        self, request: LessonRequest, mapping: MappingResult, pack: StandardsPack
    ) -> dict[str, Any]:
        """Assemble a grounded draft with no model involved.

        Everything here is a mechanical transform of district text: the
        objective is the standard's own wording turned student-facing, and each
        phase carries real excerpts from the district materials that reference
        the standard. Nothing is invented, and the generative sections are left
        empty for the validator to flag.
        """
        primary = pack.standards[0] if pack.standards else None
        unit_label = mapping.unit.label() if mapping.unit else f"Grade {request.grade} {request.subject}"
        excerpts = _phase_excerpts(pack.support, len(HUNTER_STEPS))

        hunter: dict[str, Any] = {}
        allocated = 0
        for index, (step, _label) in enumerate(HUNTER_STEPS):
            if index == len(HUNTER_STEPS) - 1:
                minutes = max(1, request.duration_minutes - allocated)
            else:
                minutes = max(2, round(request.duration_minutes * _STEP_SHARE[step]))
                allocated += minutes
            hunter[step] = {
                "minutes": minutes,
                "teacher_moves": excerpts[index] if index < len(excerpts) else [],
                "student_actions": [],
                "questions": [],
                "look_fors": [],
            }

        return {
            "title": f"{unit_label} - Lesson {request.lesson_number}",
            "grade": request.grade,
            "subject": request.subject,
            "standards": [
                {
                    "code": standard.code,
                    "text": standard.text,
                    "emphasis": "primary focus" if index == 0 else "supporting",
                }
                for index, standard in enumerate(pack.standards)
            ],
            "objective": {
                "student_friendly": _objective_from_standard(primary.text) if primary else "",
                "mastery_evidence": "",
            },
            # The district's own vocabulary column, when the pacing guide has one.
            "academic_vocabulary": _vocabulary_from_unit(mapping),
            "hunter": hunter,
            "materials": _materials_from_unit(mapping),
            "manipulatives": _manipulatives_from_unit(mapping),
            "differentiation": {
                "below_level": [], "on_level": [], "above_level": [], "special_education": [],
            },
            "ell_support": {
                "language_load": "",
                "concept_gap": "",
                "motion_movie": {"scene": "", "move": "", "freeze_frame": "", "talk_back": ""},
                "thinking_stems": [],
            },
            "timing_overview": [
                {"segment": label, "minutes": hunter[step]["minutes"]}
                for step, label in HUNTER_STEPS
            ],
            "student_pages": [],
            "exit_ticket": {
                "minutes": 10,
                "teks_posted": [s.code for s in pack.standards],
                "items": [],
                "constructed_item": {
                    "prompt": "", "exemplar_model": "", "exemplar_equation": "",
                    "exemplar_justification": "",
                    "scoring": {"zero": "", "one": "", "two": ""},
                },
                "success_line": "",
            },
            "teacher_notes": SCAFFOLD_NOTE,
        }


# ----------------------------------------------------------------------
def _unit_block(mapping: MappingResult) -> str:
    unit = mapping.unit
    if unit is None:
        return ""
    lines = [f"{unit.label()} (grade {unit.grade} {unit.subject})"]
    if unit.weeks:
        lines.append(f"Window: {unit.weeks}")
    if unit.start_date or unit.end_date:
        lines.append(f"Dates: {unit.start_date} to {unit.end_date}".strip())
    if unit.days:
        lines.append(f"Instructional days: {unit.days}")
    if unit.focus:
        lines.append(f"Unit focus: {unit.focus}")
    if unit.assessments:
        lines.append(f"Unit assessment: {unit.assessments}")
    if unit.resources:
        lines.append(f"District resources: {unit.resources}")
    if unit.standard_codes:
        lines.append(f"Standards taught in this unit: {', '.join(unit.standard_codes)}")
    if mapping.rationale:
        lines.append(f"Why this unit: {mapping.rationale}")
    lines.append(f"Source: {unit.source_path} ({unit.locator})")
    return "\n".join(lines)


def _render_hits(hits: list[Hit], limit: int = 6) -> str:
    blocks: list[str] = []
    for hit in hits[:limit]:
        chunk = hit.chunk
        blocks.append(f"[{chunk.citation()}]\n{chunk.text}")
    return "\n\n".join(blocks)


def _class_profile(request: LessonRequest) -> str:
    if not request.student_notes.strip():
        return ""
    return f"Class profile the teacher provided: {request.student_notes.strip()}"


def _objective_from_standard(text: str) -> str:
    """Turn "represent and solve ..." into "I can represent and solve ..."."""
    cleaned = re.sub(r"^\s*(?:the student is expected to|students will be able to|students will)\s+",
                     "", (text or "").strip(), flags=re.IGNORECASE)
    cleaned = cleaned.rstrip(".;")
    if not cleaned:
        return ""
    first = truncate_words(cleaned, 35)
    return f"I can {first[0].lower()}{first[1:]}"


def _materials_from_unit(mapping: MappingResult) -> list[str]:
    if not mapping.unit or not mapping.unit.resources:
        return []
    return [item.strip() for item in re.split(r"[;,\n]+", mapping.unit.resources) if item.strip()]


def _manipulatives_from_unit(mapping: MappingResult) -> list[str]:
    """The district's "Recommended Manipulatives" column, when it has one."""
    if not mapping.unit:
        return []
    return [
        item.strip()
        for item in re.split(r"[;,\n]+", mapping.unit.resources or "")
        if item.strip()
    ]


def _vocabulary_from_unit(mapping: MappingResult) -> list[dict[str, str]]:
    """Seed the vocabulary list from the pacing guide's own column.

    Definitions are left blank: the district named the terms, but nobody has
    written the student-friendly wording yet, and inventing it here would hide
    that gap from the validator.
    """
    if not mapping.unit or not mapping.unit.vocabulary:
        return []
    terms = [
        term.strip()
        for term in re.split(r"[;,\n]+", mapping.unit.vocabulary)
        if term.strip() and len(term.strip()) < 40
    ]
    return [
        {"term": term, "student_definition": "", "cognate": "", "gesture_or_object": ""}
        for term in terms[:8]
    ]


def _phase_excerpts(hits: list[Hit], phases: int) -> list[list[str]]:
    """Deal the retrieved district excerpts across the lesson steps, round-robin.

    Resource and assessment material is what a teacher can actually build from,
    so pacing tables are used only to fill gaps, and no single file is allowed
    to supply more than two excerpts.
    """
    preferred = [hit for hit in hits if hit.chunk.kind in {"resource", "assessment", "unknown"}]
    remainder = [hit for hit in hits if hit not in preferred]

    buckets: list[list[str]] = [[] for _ in range(phases)]
    per_document: dict[str, int] = {}
    index = 0
    for hit in [*preferred, *remainder]:
        chunk = hit.chunk
        if per_document.get(chunk.path, 0) >= 2:
            continue
        per_document[chunk.path] = per_document.get(chunk.path, 0) + 1
        excerpt = truncate_words(chunk.text.replace("\n", " "), 45)
        buckets[index % phases].append(f"District material to draw on -- {chunk.citation()}: {excerpt}")
        index += 1
        if index >= phases * 2:
            break
    return buckets

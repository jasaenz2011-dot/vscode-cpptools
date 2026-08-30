"""Intervention Writer Agent -- small-group materials for an unmastered standard.

Shares the context-packing machinery with :class:`LessonWriter` but targets a
narrower job: one standard, its prerequisite, a diagnostic that separates
causes, and a probe that measures whether the gap closed.
"""

from __future__ import annotations

from typing import Any

from .. import prompts
from ..models import LessonRequest
from ..schemas import INTERVENTION_SCHEMA, schema_example
from .curriculum_mapper import MappingResult
from .lesson_writer import SCAFFOLD_NOTE, LessonWriter, _phase_excerpts
from .standards_agent import StandardsPack

TIER_GUIDANCE = {
    "tier2": (
        "a group of 3-5 students, 20-30 minutes, three times a week, in addition to -- never "
        "instead of -- core instruction. Go back one grade level for the prerequisite."
    ),
    "tier3": (
        "one or two students, about 30 minutes daily, the most intensive support the campus "
        "offers. Expect the missing prerequisite to be two or more grade levels back, and keep "
        "the number of items small so there is time to talk through thinking."
    ),
    "core": (
        "a small group pulled during core instruction, about 20 minutes, while the rest of the "
        "class works independently."
    ),
}


class InterventionWriter(LessonWriter):
    name = "intervention-writer"
    schema = INTERVENTION_SCHEMA
    system_prompt = "intervention_writer.system"
    user_prompt = "intervention_writer.user"

    def run(
        self, request: LessonRequest, mapping: MappingResult, pack: StandardsPack
    ) -> tuple[dict[str, Any], Any]:
        packed = self.build_context(request, mapping, pack)

        if self.offline:
            return self.scaffold(request, mapping, pack), packed

        tier = request.tier if request.tier in TIER_GUIDANCE else "tier2"
        system = prompts.render(
            self.system_prompt,
            district=self.config.district_name,
            tier=tier,
            tier_minutes=max(8, request.duration_minutes // 3),
            tier_guidance=TIER_GUIDANCE[tier],
            schema=schema_example(self.schema),
        )
        user = prompts.render(
            self.user_prompt,
            tier=tier,
            grade=request.grade,
            subject=request.subject,
            duration=request.duration_minutes,
            unit=mapping.unit.label() if mapping.unit else "(not specified in the pacing guide)",
            class_profile=(
                f"Class profile the teacher provided: {request.student_notes.strip()}"
                if request.student_notes.strip() else ""
            ),
            context=packed.text,
        )
        document = self.complete_json(system, user, self.schema)
        return document, packed

    def repair(self, document, violations, pack, request):  # type: ignore[override]
        import json

        tier = request.tier if request.tier in TIER_GUIDANCE else "tier2"
        system = prompts.render(
            self.system_prompt,
            district=self.config.district_name,
            tier=tier,
            tier_minutes=max(8, request.duration_minutes // 3),
            tier_guidance=TIER_GUIDANCE[tier],
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

    def scaffold(
        self, request: LessonRequest, mapping: MappingResult, pack: StandardsPack
    ) -> dict[str, Any]:
        primary = pack.standards[0] if pack.standards else None
        excerpts = _phase_excerpts(pack.support, 2)
        script = [line for bucket in excerpts for line in bucket][:6]

        return {
            "title": (
                f"{request.tier.upper()} intervention - grade {request.grade} {request.subject}"
                + (f" - {primary.code}" if primary else "")
            ),
            "target_standards": [
                {"code": standard.code, "text": standard.text} for standard in pack.standards[:2]
            ],
            "prerequisite_skill": "",
            "why_students_struggle": "",
            "diagnostic": {"directions": "", "items": []},
            "mini_lesson": {
                "minutes": max(8, request.duration_minutes // 3),
                "teacher_script": script,
                "model_problem": "",
                "visual_or_manipulative": "",
            },
            "guided_practice": {"directions": "", "items": []},
            "independent_practice": {"directions": "", "items": []},
            "progress_monitoring": {
                "probe": "", "answer_key": "", "mastery_criteria": "",
                "cadence": "Three sessions per week" if request.tier == "tier2" else "Daily",
            },
            "family_note": "",
            "teacher_notes": SCAFFOLD_NOTE,
        }

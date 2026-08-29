"""Validator -- the layer that makes "standards-aligned" a checkable claim.

Alignment is not a thing a model can assert about its own output. So the draft
is checked against the district's own files and against the district's
instructional standard, and anything that fails is either repaired
deterministically or fed back to the writer as a specific correction.

The lesson rules implement the standard's own quality gate:

    All 8 Hunter steps present?
    Student page exists for every activity named?
    Ticket actually STAAR-flavored, with a key?
    Questions require thinking past recall?
    Vocab lives in the plan AND on the kid page?
    Teacher can print tonight and teach tomorrow?

:func:`apply_deterministic_fixes` runs first and handles what does not need a
model: it overwrites cited standard text with the district's exact wording and
removes standards the district does not have. Only what is left goes back to
the model.
"""

from __future__ import annotations

import re
from typing import Any

from ..models import LessonRequest, ValidationReport
from ..schemas import (
    EVERYDAY_MANIPULATIVES,
    HIGH_ORDER_MARKERS,
    HUNTER_STEPS,
    INTERVENTION_REQUIRED,
    LESSON_REQUIRED,
    LOW_ORDER_STEMS,
    VOCAB_BEARING_STEPS,
    get,
    step_text,
)
from ..util import find_strict_codes, normalize_code, normalize_for_match, walk_strings
from .base import Agent
from .standards_agent import StandardsPack

PLACEHOLDER_PATTERNS = (
    r"\bTBD\b", r"\bTODO\b", r"\bN/?A\b(?!\w)", r"\blorem ipsum\b",
    r"\[insert[^\]]*\]", r"\[your[^\]]*\]", r"<[a-z_ ]{3,20}>",
    r"\badd (?:more|your)\b", r"\bfill in\b", r"\bexample here\b",
    r"\bplaceholder\b", r"\bcoming soon\b", r"\bxxx+\b",
)
_PLACEHOLDER_RE = re.compile("|".join(PLACEHOLDER_PATTERNS), re.IGNORECASE)

_LOW_ORDER_RE = re.compile(r"^\s*(?:%s)\b" % "|".join(LOW_ORDER_STEMS), re.IGNORECASE)

_STUDENT_FACING = (
    "objective.student_friendly",
    "exit_ticket.success_line",
    "family_note",
)

_ELL_SIGNALS = ("ell", "emergent bilingual", "eb ", "newcomer", "multilingual",
                "esl", "bilingual", "lep", "spanish")


class Validator(Agent):
    name = "validator"

    def run(
        self,
        document: dict[str, Any],
        request: LessonRequest,
        pack: StandardsPack,
    ) -> ValidationReport:
        report = ValidationReport()
        intervention = request.material == "intervention"

        self._check_required(document, report, intervention)
        self._check_standards_grounded(document, report, pack, intervention)
        self._check_invented_codes(document, report, pack)
        self._check_placeholders(document, report)
        self._check_citations(document, report)
        self._check_sentence_length(document, report)

        if intervention:
            self._check_intervention_answer_keys(document, report)
            self._check_intervention_specifics(document, report)
        else:
            self._check_hunter_complete(document, report)
            self._check_duration(document, report, request)
            self._check_objective(document, report)
            self._check_vocabulary(document, report)
            self._check_high_order(document, report)
            self._check_student_pages(document, report)
            self._check_exit_ticket(document, report)
            self._check_manipulatives(document, report, request)
            self._check_ell_support(document, report, request)

        return report

    # ------------------------------------------------------------------
    # Shared checks
    # ------------------------------------------------------------------
    def _check_required(self, doc: dict[str, Any], report: ValidationReport, intervention: bool) -> None:
        report.checked.append("required_sections")
        required = INTERVENTION_REQUIRED if intervention else LESSON_REQUIRED
        for field in required:
            value = get(doc, field)
            if value is None or (isinstance(value, (str, list, dict)) and not value):
                report.add(
                    "required_sections", "error",
                    f"`{field}` is empty.",
                    f"Write real content for `{field}`.",
                )

    def _check_standards_grounded(
        self, doc: dict[str, Any], report: ValidationReport, pack: StandardsPack, intervention: bool
    ) -> None:
        report.checked.append("standards_grounded")
        report.checked.append("verbatim_standards")
        key = "target_standards" if intervention else "standards"
        cited = doc.get(key) or []
        allowed = pack.allowed_code_keys()
        by_key = {normalize_code(s.code): s for s in pack.standards}

        if not cited and allowed:
            report.add(
                "standards_grounded", "error",
                f"`{key}` is empty even though the unit lists standards.",
                "Cite at least the primary standard for this lesson.",
            )

        for entry in cited:
            if not isinstance(entry, dict):
                continue
            code = str(entry.get("code", "")).strip()
            code_key = normalize_code(code)
            if not code_key:
                report.add("standards_grounded", "error", "A cited standard has no code.")
                continue
            if allowed and code_key not in allowed:
                report.add(
                    "standards_grounded", "error",
                    f"{code} is not a standard in any of this district's documents.",
                    "Use only the codes listed under 'Standards in scope'.",
                )
                continue
            source = by_key.get(code_key)
            if source and normalize_for_match(str(entry.get("text", ""))) != normalize_for_match(source.text):
                report.add(
                    "verbatim_standards", "warning",
                    f"The text shown for {code} was rewritten rather than copied.",
                    "Replace it with the district's exact wording.",
                )

    def _check_invented_codes(
        self, doc: dict[str, Any], report: ValidationReport, pack: StandardsPack
    ) -> None:
        """A code the district has never used is a hallucination and an error.
        A real code from a neighbouring unit is a scope question -- quoting a
        prerequisite is often right -- so that is a warning."""
        report.checked.append("no_invented_codes")
        in_scope = pack.allowed_code_keys()
        if not in_scope:
            return
        in_district = set(self.store.standards_by_code()) if self.store else set()
        in_scope = in_scope | {
            normalize_code(code)
            for standard in pack.standards
            for code in find_strict_codes(standard.text)
        }

        seen: set[str] = set()
        for path, text in walk_strings(doc):
            if path.startswith("_provenance"):
                continue
            for code in find_strict_codes(text):
                code_key = normalize_code(code)
                if code_key in in_scope or code_key in seen:
                    continue
                seen.add(code_key)
                if code_key in in_district:
                    report.add(
                        "no_invented_codes", "warning",
                        f"{code} is a real district standard but is outside this lesson's scope "
                        f"(cited in `{path}`).",
                    )
                else:
                    report.add(
                        "no_invented_codes", "error",
                        f"{code} appears in `{path}` but is not a standard in any district document.",
                        "Remove it, or replace it with a code from the allowed list.",
                    )

    def _check_placeholders(self, doc: dict[str, Any], report: ValidationReport) -> None:
        report.checked.append("no_placeholders")
        for path, text in walk_strings(doc):
            if path.startswith("_provenance"):
                continue
            match = _PLACEHOLDER_RE.search(text)
            if match:
                report.add(
                    "no_placeholders", "error",
                    f"`{path}` still contains placeholder text ({match.group(0)!r}).",
                    "Replace it with the real content a teacher would use.",
                )

    def _check_citations(self, doc: dict[str, Any], report: ValidationReport) -> None:
        report.checked.append("citations_resolve")
        if self.store is None:
            return
        known = {document.path for document in self.store.documents}
        if not known:
            return
        for path, text in walk_strings(doc):
            for candidate in re.findall(
                r"(?:source|see|from):\s*([^\n,;]+\.(?:pdf|csv|xlsx|docx|md))", text, re.I
            ):
                if candidate.strip() not in known:
                    report.add(
                        "citations_resolve", "warning",
                        f"`{path}` cites {candidate.strip()!r}, which is not a file in the corpus.",
                    )

    def _check_sentence_length(self, doc: dict[str, Any], report: ValidationReport) -> None:
        report.checked.append("sentence_length")
        for field in _STUDENT_FACING:
            value = get(doc, field)
            texts = value if isinstance(value, list) else [value]
            for text in texts:
                if not isinstance(text, str) or not text.strip():
                    continue
                sentences = [s for s in re.split(r"[.!?]+", text) if s.strip()]
                if not sentences:
                    continue
                longest = max(len(s.split()) for s in sentences)
                if longest > 28:
                    report.add(
                        "sentence_length", "warning",
                        f"`{field}` has a {longest}-word sentence; students will lose the thread.",
                    )

    # ------------------------------------------------------------------
    # Part A -- the Hunter lesson
    # ------------------------------------------------------------------
    def _check_hunter_complete(self, doc: dict[str, Any], report: ValidationReport) -> None:
        """All eight steps, never skipped and never merged."""
        report.checked.append("hunter_complete")
        for step, label in HUNTER_STEPS:
            node = get(doc, f"hunter.{step}")
            if not isinstance(node, dict) or not (node.get("teacher_moves") or []):
                report.add(
                    "hunter_complete", "error",
                    f"Hunter step {label} has no teacher moves.",
                    "Write what the teacher actually says and does in this step.",
                )

    def _check_duration(
        self, doc: dict[str, Any], report: ValidationReport, request: LessonRequest
    ) -> None:
        report.checked.append("duration_sum")
        total = 0
        for step, _ in HUNTER_STEPS:
            node = get(doc, f"hunter.{step}") or {}
            if isinstance(node, dict):
                total += int(node.get("minutes") or 0)
        target = request.duration_minutes
        tolerance = self.config.duration_tolerance_minutes
        if total == 0:
            report.add("duration_sum", "error", "No Hunter step has a time allocation.")
        elif abs(total - target) > tolerance:
            report.add(
                "duration_sum", "error",
                f"Hunter step minutes total {total} but the lesson is {target} minutes.",
                f"Adjust the minutes so they sum to exactly {target}.",
            )

    def _check_objective(self, doc: dict[str, Any], report: ValidationReport) -> None:
        report.checked.append("objective_form")
        objective = str(get(doc, "objective.student_friendly") or "").strip()
        if objective and not objective.lower().startswith(("i can", "i will", "we can")):
            report.add(
                "objective_form", "warning",
                'The objective is not student-facing ("I can ...").',
            )
        if not str(get(doc, "objective.mastery_evidence") or "").strip():
            report.add(
                "objective_form", "error",
                "The objective does not say how mastery will be shown.",
            )

    def _check_vocabulary(self, doc: dict[str, Any], report: ValidationReport) -> None:
        """4-8 terms, defined, and actually used in the teaching steps."""
        report.checked.append("vocabulary_bounds")
        report.checked.append("vocabulary_woven")
        terms = [t for t in (doc.get("academic_vocabulary") or []) if isinstance(t, dict)]

        if terms and not 4 <= len(terms) <= 8:
            report.add(
                "vocabulary_bounds", "error",
                f"{len(terms)} academic vocabulary terms; the standard is 4-8.",
            )
        for index, term in enumerate(terms):
            if term.get("term") and not str(term.get("student_definition", "")).strip():
                report.add(
                    "vocabulary_bounds", "warning",
                    f"`academic_vocabulary[{index}]` ({term.get('term')}) has no "
                    "student-friendly definition.",
                )

        woven = " ".join(step_text(doc, step) for step in VOCAB_BEARING_STEPS).lower()
        pages = " ".join(text for _, text in walk_strings(doc.get("student_pages") or [])).lower()
        for term in terms:
            name = str(term.get("term", "")).strip().lower()
            if not name:
                continue
            if name not in woven:
                report.add(
                    "vocabulary_woven", "error",
                    f'"{term.get("term")}" is listed but never used in Input, Modeling, '
                    "Guided Practice or CFU.",
                    "Vocabulary that appears only in a list has not been taught.",
                )
            elif name not in pages:
                report.add(
                    "vocabulary_woven", "warning",
                    f'"{term.get("term")}" does not appear on any student page.',
                )

    def _check_high_order(self, doc: dict[str, Any], report: ValidationReport) -> None:
        """Bare recall stems are banned unless a deeper demand is attached."""
        report.checked.append("high_order_questions")
        for step, label in HUNTER_STEPS:
            node = get(doc, f"hunter.{step}") or {}
            for index, question in enumerate(node.get("questions") or []):
                text = str(question).strip()
                if not text or not _LOW_ORDER_RE.match(text):
                    continue
                lowered = text.lower()
                if any(marker in lowered for marker in HIGH_ORDER_MARKERS):
                    continue
                if len(text.split()) > 14:
                    continue      # a long question usually carries its own demand
                report.add(
                    "high_order_questions", "error",
                    f"{label} question {index + 1} is bare recall: {text!r}",
                    "Attach a reasoning demand -- explain, justify, compare, "
                    "represent, or 'how do you know'.",
                )

    def _check_manipulatives(
        self, doc: dict[str, Any], report: ValidationReport, request: LessonRequest
    ) -> None:
        report.checked.append("manipulatives")
        if "math" not in (request.subject or "").lower():
            return
        items = [str(m).strip() for m in (doc.get("manipulatives") or []) if str(m).strip()]
        if not items:
            report.add(
                "manipulatives", "error",
                "A math lesson lists no manipulatives; the standard requires them every day.",
                "Name everyday objects: coins, bottle caps, beans, paper plates, egg cartons.",
            )
            return
        blob = " ".join(items).lower()
        if not any(obj in blob for obj in EVERYDAY_MANIPULATIVES):
            report.add(
                "manipulatives", "warning",
                "No everyday object among the manipulatives; reach for those first.",
            )

    def _check_ell_support(
        self, doc: dict[str, Any], report: ValidationReport, request: LessonRequest
    ) -> None:
        report.checked.append("ell_support")
        profile = (request.student_notes or "").lower()
        if not any(signal in profile for signal in _ELL_SIGNALS):
            return
        for field, label in (
            ("ell_support.language_load", "language load"),
            ("ell_support.concept_gap", "concept gap"),
        ):
            if not str(get(doc, field) or "").strip():
                report.add(
                    "ell_support", "error",
                    f"The class includes multilingual learners but the {label} is not diagnosed.",
                    "Diagnose language load and concept gap separately.",
                )
        for beat in ("scene", "move", "freeze_frame", "talk_back"):
            if not str(get(doc, f"ell_support.motion_movie.{beat}") or "").strip():
                report.add(
                    "ell_support", "error",
                    f"The motion movie is missing its {beat.replace('_', ' ')} beat.",
                )

    # ------------------------------------------------------------------
    # Part B -- student pages
    # ------------------------------------------------------------------
    def _check_student_pages(self, doc: dict[str, Any], report: ValidationReport) -> None:
        report.checked.append("student_pages")
        pages = [p for p in (doc.get("student_pages") or []) if isinstance(p, dict)]
        if not pages:
            report.add(
                "student_pages", "error",
                "No student pages. A teacher plan on its own is incomplete.",
                "Add a page for every activity named in Guided or Independent Practice.",
            )
            return

        for index, page in enumerate(pages):
            label = page.get("title") or f"student_pages[{index}]"
            if not str(page.get("because_line", "")).strip():
                report.add(
                    "student_pages", "error",
                    f'"{label}" has no because / justify line.',
                    "Students must explain their reasoning, not fill in a blank.",
                )
            if not str(page.get("evidence_space", "")).strip():
                report.add(
                    "student_pages", "error",
                    f'"{label}" gives students no space for evidence.',
                    "Say what goes there: a diagram, a table, a labeled drawing, an equation.",
                )
            if not (page.get("vocabulary_or_stems") or []):
                report.add(
                    "student_pages", "warning",
                    f'"{label}" carries no vocabulary or sentence stems.',
                )
            for item_index, item in enumerate(page.get("items") or []):
                if isinstance(item, dict) and item.get("prompt") and not str(
                    item.get("answer", "")
                ).strip():
                    report.add(
                        "student_pages", "error",
                        f'"{label}" item {item_index + 1} has no answer in the teacher key.',
                    )

        # Every practice activity named should have somewhere for students to write.
        named = len([
            move for step in ("guided_practice", "independent_practice")
            for move in (get(doc, f"hunter.{step}") or {}).get("teacher_moves", [])
        ])
        if named and not pages:
            report.add("student_pages", "error", "Practice activities are named but no page exists.")

    # ------------------------------------------------------------------
    # Part C -- the STAAR-level exit ticket
    # ------------------------------------------------------------------
    def _check_exit_ticket(self, doc: dict[str, Any], report: ValidationReport) -> None:
        report.checked.append("exit_ticket_staar")
        ticket = doc.get("exit_ticket") or {}
        items = [i for i in (ticket.get("items") or []) if isinstance(i, dict)]

        if len(items) < 2:
            report.add(
                "exit_ticket_staar", "error",
                f"The exit ticket has {len(items)} STAAR-style item(s); at least 2 are required.",
            )
        for index, item in enumerate(items):
            if not str(item.get("answer", "")).strip():
                report.add(
                    "exit_ticket_staar", "error",
                    f"Exit ticket item {index + 1} has no answer key.",
                )
            choices = [c for c in (item.get("choices") or []) if str(c).strip()]
            if choices and len(choices) < 3:
                report.add(
                    "exit_ticket_staar", "warning",
                    f"Exit ticket item {index + 1} has only {len(choices)} choices.",
                )
            if choices and not str(item.get("distractor_rationale", "")).strip():
                report.add(
                    "exit_ticket_staar", "warning",
                    f"Item {index + 1} does not say what its wrong answers reveal.",
                    "Distractors must expose real misconceptions.",
                )

        constructed = ticket.get("constructed_item") or {}
        if not str(constructed.get("prompt", "")).strip():
            report.add(
                "exit_ticket_staar", "error",
                "The ticket has no constructed item requiring a model, answer and justification.",
            )
        else:
            for field, label in (
                ("exemplar_model", "model"),
                ("exemplar_justification", "justification"),
            ):
                if not str(constructed.get(field, "")).strip():
                    report.add(
                        "exit_ticket_staar", "error",
                        f"The constructed item has no exemplar {label}.",
                    )
            scoring = constructed.get("scoring") or {}
            missing = [k for k in ("zero", "one", "two") if not str(scoring.get(k, "")).strip()]
            if missing:
                report.add(
                    "exit_ticket_staar", "error",
                    f"The constructed item is missing scoring notes for {', '.join(missing)}.",
                )

        if not (ticket.get("teks_posted") or []):
            report.add(
                "exit_ticket_staar", "warning",
                "The exit ticket does not post the TEKS it assesses.",
            )

    # ------------------------------------------------------------------
    # Intervention packets
    # ------------------------------------------------------------------
    def _check_intervention_answer_keys(self, doc: dict[str, Any], report: ValidationReport) -> None:
        report.checked.append("answer_keys")
        for section in ("diagnostic", "guided_practice", "independent_practice"):
            for index, item in enumerate(get(doc, f"{section}.items") or []):
                if not isinstance(item, dict):
                    continue
                if item.get("prompt") and not str(item.get("answer", "")).strip():
                    report.add(
                        "answer_keys", "error",
                        f"`{section}.items[{index}]` has a prompt but no answer.",
                        "Every item a student answers needs a key.",
                    )
        if get(doc, "progress_monitoring.probe") and not str(
            get(doc, "progress_monitoring.answer_key") or ""
        ).strip():
            report.add("answer_keys", "error", "The progress-monitoring probe has no answer key.")

    def _check_intervention_specifics(self, doc: dict[str, Any], report: ValidationReport) -> None:
        report.checked.append("distinct_diagnostics")
        reasons = [
            normalize_for_match(str(item.get("misconception_if_wrong", "")))
            for item in (get(doc, "diagnostic.items") or []) if isinstance(item, dict)
        ]
        reasons = [reason for reason in reasons if reason]
        if reasons and len(set(reasons)) < len(reasons):
            report.add(
                "distinct_diagnostics", "warning",
                "Two diagnostic items map to the same misconception, so they cannot tell "
                "causes apart.",
            )

        report.checked.append("mastery_criteria")
        criteria = str(get(doc, "progress_monitoring.mastery_criteria") or "")
        if criteria and not re.search(r"\d", criteria):
            report.add(
                "mastery_criteria", "warning",
                "Mastery criteria are not numeric, so progress cannot be measured.",
            )


# ----------------------------------------------------------------------
def apply_deterministic_fixes(
    document: dict[str, Any],
    pack: StandardsPack,
    intervention: bool,
    store: Any = None,
    grade: str = "",
    subject: str = "",
) -> list[str]:
    """Repair what does not need a model. Returns a list of what changed.

    Restoring verbatim standard text here rather than asking the model to try
    again is the difference between a system that is aligned and one that is
    usually aligned.

    A cited code that the district really has, but that the mapper did not put
    in scope, is adopted into the pack rather than deleted -- the writer may
    have had a good reason, and the text is still verbatim district wording.
    """
    changes: list[str] = []
    key = "target_standards" if intervention else "standards"
    by_key = {normalize_code(s.code): s for s in pack.standards}
    district = store.standards_by_code(grade, subject) if store is not None else {}
    cited = document.get(key) or []
    if not isinstance(cited, list):
        return changes

    kept: list[dict[str, Any]] = []
    for entry in cited:
        if not isinstance(entry, dict):
            continue
        code_key = normalize_code(str(entry.get("code", "")))
        source = by_key.get(code_key)
        if source is None and code_key in district:
            source = district[code_key]
            pack.standards.append(source)
            by_key[code_key] = source
            changes.append(f"adopted {source.code}, a district standard the writer added")
        if source is None:
            if by_key:  # only drop when we actually have an allow-list
                changes.append(f"removed unrecognized standard {entry.get('code')!r}")
                continue
            kept.append(entry)
            continue
        if normalize_for_match(str(entry.get("text", ""))) != normalize_for_match(source.text):
            changes.append(f"restored district wording for {source.code}")
        entry["code"] = source.code
        entry["text"] = source.text
        kept.append(entry)

    if not kept and pack.standards:
        kept = [
            {"code": s.code, "text": s.text, **({"emphasis": "primary focus"} if not intervention else {})}
            for s in pack.standards[:3]
        ]
        changes.append("inserted the unit's standards, which the draft omitted")

    document[key] = kept

    # The ticket must post the TEKS it assesses; that is a copy, not a judgement.
    if not intervention and isinstance(document.get("exit_ticket"), dict):
        ticket = document["exit_ticket"]
        if not (ticket.get("teks_posted") or []) and kept:
            ticket["teks_posted"] = [entry["code"] for entry in kept]
            changes.append("posted the lesson's TEKS on the exit ticket")

    return changes

"""Validator -- the layer that makes "standards-aligned" a checkable claim.

Alignment is not a thing a model can assert about its own output. So the draft
is checked against the district's own files, and anything that fails is either
repaired deterministically or fed back to the writer as a specific correction.

Rules that raise an **error** (generation is retried):

``standards_grounded``   every cited code resolves to a district standard
``no_invented_codes``    no standard-shaped code appears anywhere else in the doc
``required_sections``    the sections a teacher cannot teach without are filled
``duration_sum``         phase minutes add up to the requested lesson length
``answer_keys``          every assessment item has a key
``no_placeholders``      no "TBD", "[insert ...]", or template debris survives

Rules that raise a **warning** (surfaced, not retried):

``verbatim_standards``   standard text matches the district wording exactly
``phase_coverage`` ``objective_form`` ``vocabulary_bounds``
``citations_resolve`` ``sentence_length`` ``distinct_diagnostics``
``mastery_criteria``

:func:`apply_deterministic_fixes` runs first and handles what does not need a
model: it overwrites cited standard text with the district's exact wording and
removes standards the district does not have. Only what is left goes back to
the model.
"""

from __future__ import annotations

import re
from typing import Any

from ..models import LessonRequest, ValidationReport
from ..schemas import FIVE_E_PHASES, INTERVENTION_REQUIRED, LESSON_REQUIRED, get
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

# Student-facing prose the sentence-length check applies to.
_STUDENT_FACING = (
    "learning_objective", "essential_question", "success_criteria",
    "exit_ticket.prompt", "family_note",
)


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
        self._check_answer_keys(document, report, intervention)
        self._check_citations(document, report)
        self._check_sentence_length(document, report)

        if intervention:
            self._check_intervention_specifics(document, report)
        else:
            self._check_duration(document, report, request)
            self._check_phases(document, report)
            self._check_objective_form(document, report)
            self._check_vocabulary(document, report)

        return report

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
                # apply_deterministic_fixes has already promoted real-but-out-of-scope
                # codes into the pack, so anything still unknown here is invented.
                report.add(
                    "standards_grounded", "error",
                    f"{code} is not a standard in any of this district's documents.",
                    "Use only the codes listed under 'Standards in scope'.",
                )
                continue
            source = by_key.get(code_key)
            if source and normalize_for_match(str(entry.get("text", ""))) != normalize_for_match(source.text):
                # In the normal pipeline apply_deterministic_fixes has already
                # put the district wording back, and the substitution shows up
                # under "automatic_fixes". This fires when the validator is run
                # on its own -- reviewing a document someone else produced.
                report.add(
                    "verbatim_standards", "warning",
                    f"The text shown for {code} was rewritten rather than copied.",
                    "Replace it with the district's exact wording.",
                )

    def _check_invented_codes(
        self, doc: dict[str, Any], report: ValidationReport, pack: StandardsPack
    ) -> None:
        """Separate the two failures that look alike.

        A code the district has never heard of is a hallucination and an error.
        A real district code from a neighbouring unit is a scope question, not a
        fabrication -- quoting one while explaining a prerequisite is often
        exactly right -- so that is a warning.
        """
        report.checked.append("no_invented_codes")
        in_scope = pack.allowed_code_keys()
        if not in_scope:
            return
        in_district = set(self.store.standards_by_code()) if self.store else set()
        # Codes quoted inside the district's own standard text are legitimate.
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
            match = _PLACEHOLDER_RE.search(text)
            if match:
                report.add(
                    "no_placeholders", "error",
                    f"`{path}` still contains placeholder text ({match.group(0)!r}).",
                    "Replace it with the real content a teacher would use.",
                )

    def _check_answer_keys(
        self, doc: dict[str, Any], report: ValidationReport, intervention: bool
    ) -> None:
        report.checked.append("answer_keys")
        if intervention:
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
            return

        if doc.get("exit_ticket", {}).get("prompt") and not str(
            doc.get("exit_ticket", {}).get("answer_key", "")
        ).strip():
            report.add(
                "answer_keys", "error",
                "The exit ticket has a prompt but no answer key.",
                "Write the answer a proficient student would give.",
            )
        assessment = doc.get("formative_assessment") or {}
        if assessment.get("task") and not str(assessment.get("exemplar_response", "")).strip():
            report.add(
                "answer_keys", "error",
                "The formative assessment task has no exemplar response.",
            )

    def _check_duration(
        self, doc: dict[str, Any], report: ValidationReport, request: LessonRequest
    ) -> None:
        report.checked.append("duration_sum")
        flow = doc.get("lesson_flow") or []
        total = sum(int(phase.get("minutes") or 0) for phase in flow if isinstance(phase, dict))
        target = request.duration_minutes
        tolerance = self.config.duration_tolerance_minutes
        if total == 0:
            report.add("duration_sum", "error", "No lesson phase has a time allocation.")
        elif abs(total - target) > tolerance:
            report.add(
                "duration_sum", "error",
                f"Phase minutes total {total} but the lesson is {target} minutes.",
                f"Adjust the phase minutes so they sum to exactly {target}.",
            )

    def _check_phases(self, doc: dict[str, Any], report: ValidationReport) -> None:
        report.checked.append("phase_coverage")
        present = {
            str(phase.get("phase", "")).strip().lower()
            for phase in (doc.get("lesson_flow") or [])
            if isinstance(phase, dict)
        }
        missing = [phase for phase in FIVE_E_PHASES if phase.lower() not in present]
        if missing and len(missing) < len(FIVE_E_PHASES):
            report.add(
                "phase_coverage", "warning",
                f"Lesson flow is missing the {', '.join(missing)} phase(s).",
            )

    def _check_objective_form(self, doc: dict[str, Any], report: ValidationReport) -> None:
        report.checked.append("objective_form")
        objective = str(doc.get("learning_objective", "")).strip()
        if objective and not objective.lower().startswith(("i can", "i will", "students will")):
            report.add(
                "objective_form", "warning",
                "The learning objective is not written student-facing (\"I can ...\").",
            )

    def _check_vocabulary(self, doc: dict[str, Any], report: ValidationReport) -> None:
        report.checked.append("vocabulary_bounds")
        terms = doc.get("vocabulary") or []
        if len(terms) > 10:
            report.add(
                "vocabulary_bounds", "warning",
                f"{len(terms)} vocabulary terms is a lot for one lesson; 3-6 is usual.",
            )
        for index, term in enumerate(terms):
            if isinstance(term, dict) and term.get("term") and not str(
                term.get("student_friendly_definition", "")
            ).strip():
                report.add(
                    "vocabulary_bounds", "warning",
                    f"`vocabulary[{index}]` ({term.get('term')}) has no student-friendly definition.",
                )

    def _check_citations(self, doc: dict[str, Any], report: ValidationReport) -> None:
        report.checked.append("citations_resolve")
        if self.store is None:
            return
        known = {document.path for document in self.store.documents}
        if not known:
            return
        for path, text in walk_strings(doc):
            for candidate in re.findall(r"(?:source|see|from):\s*([^\n,;]+\.(?:pdf|csv|xlsx|docx|md))", text, re.I):
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

    def _check_intervention_specifics(self, doc: dict[str, Any], report: ValidationReport) -> None:
        report.checked.append("distinct_diagnostics")
        reasons = [
            normalize_for_match(str(item.get("misconception_if_wrong", "")))
            for item in (get(doc, "diagnostic.items") or [])
            if isinstance(item, dict)
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
    district = store.standards_by_code() if store is not None else {}
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

    # If the model cited nothing usable, fall back to the resolved pack.
    if not kept and pack.standards:
        kept = [
            {"code": s.code, "text": s.text, **({"emphasis": "primary focus"} if not intervention else {})}
            for s in pack.standards[:3]
        ]
        changes.append("inserted the unit's standards, which the draft omitted")

    document[key] = kept
    return changes

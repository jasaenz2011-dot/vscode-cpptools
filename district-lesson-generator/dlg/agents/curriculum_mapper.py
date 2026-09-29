"""Curriculum Mapping Agent -- which unit, and which standards for this lesson.

Deterministic first, model second. Matching a week number against a pacing
window is arithmetic, and arithmetic should not be delegated to an 8B model. The
model is consulted only when several units genuinely remain in contention, and
even then it must choose from an enumerated list.
"""

from __future__ import annotations

import datetime as _dt
import re
from dataclasses import dataclass, field

from .. import prompts
from ..models import LessonRequest, PacingUnit
from ..util import dedupe, get_logger, grade_key, normalize_code, subject_key, truncate_words
from .base import Agent, AgentError

log = get_logger("dlg.agents.mapper")

_DATE_FORMATS = ("%Y-%m-%d", "%m/%d/%Y", "%m/%d/%y", "%b %d %Y", "%B %d %Y", "%b %d", "%B %d")


@dataclass
class MappingResult:
    unit: PacingUnit | None
    primary_standards: list[str] = field(default_factory=list)
    supporting_standards: list[str] = field(default_factory=list)
    rationale: str = ""
    candidates: list[PacingUnit] = field(default_factory=list)
    notes: list[str] = field(default_factory=list)

    @property
    def all_codes(self) -> list[str]:
        return dedupe([*self.primary_standards, *self.supporting_standards])


class CurriculumMapper(Agent):
    name = "curriculum-mapper"

    MAX_PRIMARY = 1
    MAX_SUPPORTING = 2

    def run(self, request: LessonRequest) -> MappingResult:
        if self.store is None:
            raise AgentError("curriculum mapper needs an index")

        units = self.store.units_for(request.grade, request.subject)
        notes: list[str] = []

        if not units:
            notes.append(
                f"No scope and sequence rows found for grade {request.grade} "
                f"{request.subject}. Falling back to standards matched by grade and subject."
            )
            return MappingResult(
                unit=None,
                primary_standards=self._fallback_standards(request)[: self.MAX_PRIMARY],
                supporting_standards=self._fallback_standards(request)[
                    self.MAX_PRIMARY : self.MAX_PRIMARY + self.MAX_SUPPORTING
                ],
                rationale="No pacing document covered this grade and subject.",
                notes=notes,
            )

        candidates = self._narrow(units, request, notes)
        unit = candidates[0] if len(candidates) == 1 else None
        rationale = ""

        if unit is None:
            if not self.offline and len(candidates) > 1:
                unit, rationale = self._ask_model(request, candidates)
            if unit is None:
                unit = candidates[0]
                rationale = rationale or (
                    f"Several units matched; took the earliest by sequence ({unit.label()})."
                )
        else:
            rationale = f"Matched {unit.label()} in the scope and sequence."

        primary, supporting = self._standards_for_lesson(unit, request)
        if request.focus_standards:
            primary = request.focus_standards[: self.MAX_PRIMARY]
            supporting = request.focus_standards[self.MAX_PRIMARY :][: self.MAX_SUPPORTING]
            rationale += " Standards were overridden by the request."

        if not primary and not supporting:
            notes.append(
                f"{unit.label()} lists no standard codes in the pacing document; "
                "the lesson will be grounded on retrieved context only."
            )

        return MappingResult(
            unit=unit,
            primary_standards=primary,
            supporting_standards=supporting,
            rationale=rationale.strip(),
            candidates=candidates,
            notes=notes,
        )

    # ------------------------------------------------------------------
    def _narrow(
        self, units: list[PacingUnit], request: LessonRequest, notes: list[str]
    ) -> list[PacingUnit]:
        if request.unit:
            matched = [u for u in units if self._unit_matches(u, request.unit)]
            if matched:
                return matched
            notes.append(f"No unit matched {request.unit!r}; considering the whole year.")

        if request.week:
            matched = [u for u in units if self._window_contains(u, request.week)]
            if matched:
                return matched
            notes.append(
                f"No pacing window contained {request.week!r}; considering the whole year."
            )
        return units

    @staticmethod
    def _unit_matches(unit: PacingUnit, wanted: str) -> bool:
        wanted = wanted.strip().lower()
        if not wanted:
            return False
        # A number means the unit number and nothing else. Falling through to a
        # substring search makes "7" match "Covey's 7 Habits".
        number = re.fullmatch(r"(?:unit\s*)?(\d+)", wanted)
        if number:
            return unit.sequence == int(number.group(1))
        name = unit.unit_name.lower()
        return wanted == name or wanted in name

    @classmethod
    def _window_contains(cls, unit: PacingUnit, when: str) -> bool:
        when = when.strip()
        if not when:
            return False

        target_date = _parse_date(when)
        if target_date:
            start, end = _parse_date(unit.start_date), _parse_date(unit.end_date)
            if start and end:
                return start <= target_date <= end
            if start:
                return target_date >= start

        week_number = _parse_week_number(when)
        if week_number is not None:
            for low, high in _week_ranges(unit.weeks):
                if low <= week_number <= high:
                    return True
        return False

    # ------------------------------------------------------------------
    def _standards_for_lesson(
        self, unit: PacingUnit, request: LessonRequest
    ) -> tuple[list[str], list[str]]:
        """Spread a unit's standards across its lessons instead of dumping all
        of them into every one -- the single most common failure of naive
        curriculum generators."""
        codes = [code for code in unit.standard_codes if normalize_code(code)]
        if not codes:
            return [], []

        index = max(0, request.lesson_number - 1) % len(codes)
        primary = [codes[index]]
        supporting = [codes[(index + offset) % len(codes)] for offset in (1, 2)]
        supporting = [code for code in dedupe(supporting) if code not in primary]
        return primary, supporting[: self.MAX_SUPPORTING]

    def _fallback_standards(self, request: LessonRequest) -> list[str]:
        if self.store is None:
            return []
        want_grade, want_subject = grade_key(request.grade), subject_key(request.subject)
        matches = [
            standard for standard in self.store.standards
            if (not want_grade or grade_key(standard.grade) == want_grade)
            and (not want_subject or subject_key(standard.subject) == want_subject)
        ]
        return [standard.code for standard in matches]

    # ------------------------------------------------------------------
    def _ask_model(
        self, request: LessonRequest, candidates: list[PacingUnit]
    ) -> tuple[PacingUnit | None, str]:
        listing = "\n".join(
            f"- unit_id={unit.unit_id} | seq={unit.sequence} | {unit.unit_name} | "
            f"window={unit.weeks or unit.start_date or 'n/a'} | "
            f"standards={', '.join(unit.standard_codes) or 'none listed'} | "
            f"focus={truncate_words(unit.focus, 30) or 'n/a'}"
            for unit in candidates[:15]
        )
        when = ""
        if request.week:
            when = f"They said the week/date is: {request.week}."
        elif request.unit:
            when = f"They named the unit: {request.unit}."

        system = prompts.render("curriculum_mapper.system", district=self.config.district_name)
        user = prompts.render(
            "curriculum_mapper.user",
            grade=request.grade,
            subject=request.subject,
            lesson_number=request.lesson_number,
            when=when,
            candidates=listing,
        )
        schema = {
            "unit_id": "str",
            "primary_standards": ["str"],
            "supporting_standards": ["str"],
            "rationale": "str",
        }
        try:
            choice = self.complete_json(system, user, schema, max_tokens=400, attempts=2)
        except AgentError as exc:
            log.warning("mapper fell back to deterministic choice: %s", exc)
            return None, ""

        by_id = {unit.unit_id: unit for unit in candidates}
        unit = by_id.get(str(choice.get("unit_id", "")).strip())
        if unit is None:
            return None, ""
        return unit, str(choice.get("rationale", "")).strip()


# ----------------------------------------------------------------------
def _parse_date(value: str) -> _dt.date | None:
    value = (value or "").strip()
    if not value:
        return None
    for fmt in _DATE_FORMATS:
        try:
            parsed = _dt.datetime.strptime(value, fmt).date()
        except ValueError:
            continue
        if "%Y" not in fmt and "%y" not in fmt:
            parsed = parsed.replace(year=_dt.date.today().year)
        return parsed
    return None


def _parse_week_number(value: str) -> int | None:
    match = re.search(r"(?:week\s*)?(\d{1,2})", (value or "").lower())
    return int(match.group(1)) if match else None


def _week_ranges(weeks: str) -> list[tuple[int, int]]:
    """Parse ``Weeks 1-3``, ``Week 4``, ``1,2,5`` into inclusive ranges."""
    text = (weeks or "").lower()
    ranges: list[tuple[int, int]] = []
    consumed: list[tuple[int, int]] = []

    for match in re.finditer(r"(\d{1,2})\s*(?:-|–|to|through)\s*(\d{1,2})", text):
        low, high = int(match.group(1)), int(match.group(2))
        ranges.append((min(low, high), max(low, high)))
        consumed.append(match.span())

    for match in re.finditer(r"\d{1,2}", text):
        if any(start <= match.start() < end for start, end in consumed):
            continue
        number = int(match.group(0))
        if not any(low <= number <= high for low, high in ranges):
            ranges.append((number, number))
    return ranges

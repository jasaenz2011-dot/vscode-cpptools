"""Week glance -- one overview page for a multi-day unit.

The instructional standard says a multi-day unit is one complete Hunter lesson
per day *plus* a one-page week glance. This module is the glance: the sheet a
teacher pins above the desk and a walkthrough observer reads in ten seconds.

Each day row carries its own Part D media brief, because the media is what a
teacher has to queue up the night before. NotebookLM packs sit at unit level and
days point at them by id: a narrated explainer is grounded on a *concept*, so
the 8.6C video serves both days that teach 8.6C. The sim, the shot list and the
motion movie are per day, since those change with the day's work.
"""

from __future__ import annotations

from dataclasses import asdict, dataclass, field
from typing import Any

from .models import PacingUnit, ValidationReport
from .schemas import (
    GEMINI_CONTROL_MARKERS,
    GEMINI_MISCONCEPTION_MARKERS,
    NOTEBOOK_PACK_MAX_WORDS,
    NOTEBOOK_PACK_MIN_WORDS,
    VEO_MIN_SHOTS,
    VEO_PURPOSES,
    VEO_SECONDS_RANGE,
)
from .util import find_strict_codes, normalize_code


@dataclass
class WeekDay:
    """One column of the glance."""

    day: int
    topic: str
    focus_standards: list[str] = field(default_factory=list)
    spiraled_standards: list[str] = field(default_factory=list)
    lesson_focus: str = ""
    ticket_focus: str = ""
    materials: list[str] = field(default_factory=list)
    notebooklm_pack_id: str = ""
    part_d: dict[str, Any] = field(default_factory=dict)
    package: str = ""          # path of the full A+B+C+D package, once authored

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


@dataclass
class WeekGlance:
    unit: str
    grade: str
    subject: str
    days_total: int
    source: str = ""
    standards: list[dict[str, str]] = field(default_factory=list)
    days: list[WeekDay] = field(default_factory=list)
    notebooklm_packs: list[dict[str, str]] = field(default_factory=list)
    spiral_review: str = ""
    assessment_plan: str = ""
    teacher_notes: str = ""

    def to_dict(self) -> dict[str, Any]:
        data = asdict(self)
        data["days"] = [d.to_dict() for d in self.days]
        return data

    def pack_ids(self) -> set[str]:
        return {str(p.get("pack_id", "")) for p in self.notebooklm_packs if p.get("pack_id")}

    def allowed_codes(self) -> set[str]:
        return {normalize_code(s.get("code", "")) for s in self.standards if s.get("code")}


# ----------------------------------------------------------------------
def plan_schedule(
    codes: list[str], days_total: int, introduce_on: dict[int, str] | None = None
) -> list[tuple[list[str], list[str]]]:
    """Map each day to (focus, spiraled) standard codes.

    ``introduce_on`` pins a standard to the day it is introduced, e.g.
    ``{1: "8.6C", 3: "8.7C", 5: "8.7D"}``. A standard stays in focus until the
    next one is introduced, and every standard already introduced spirals
    forward. The last day carries all of them for review.
    """
    if not codes or days_total < 1:
        return [([], []) for _ in range(max(0, days_total))]

    introduce_on = dict(introduce_on or {})
    if not introduce_on:
        # Spread the codes evenly across the unit when no schedule is pinned.
        step = max(1, days_total // max(1, len(codes)))
        introduce_on = {1 + index * step: code for index, code in enumerate(codes)}

    schedule: list[tuple[list[str], list[str]]] = []
    current = ""
    introduced: list[str] = []
    for day in range(1, days_total + 1):
        if day in introduce_on:
            current = introduce_on[day]
            if current not in introduced:
                introduced.append(current)
        focus = [current] if current else []
        spiraled = [code for code in introduced if code not in focus]
        if day == days_total and len(introduced) > 1:
            focus, spiraled = list(introduced), []
        schedule.append((focus, spiraled))
    return schedule


def scaffold_week(
    unit: PacingUnit, days_total: int = 0, introduce_on: dict[int, str] | None = None
) -> WeekGlance:
    """Build the skeleton of a glance from the pacing guide alone.

    No model is involved. Topics, standards and the day count come from the
    district's own row; Part D is left empty for the writer, and the validator
    reports every day that still needs one.
    """
    days_total = days_total or unit.days or len(unit.standard_codes) or 1
    schedule = plan_schedule(unit.standard_codes, days_total, introduce_on)
    return WeekGlance(
        unit=unit.label(),
        grade=unit.grade,
        subject=unit.subject,
        days_total=days_total,
        source=f"{unit.source_path} | {unit.locator}",
        standards=[{"code": code, "text": ""} for code in unit.standard_codes],
        days=[
            WeekDay(day=index + 1, topic="", focus_standards=focus, spiraled_standards=spiraled)
            for index, (focus, spiraled) in enumerate(schedule)
        ],
        assessment_plan=unit.assessments,
    )


# ----------------------------------------------------------------------
def validate_week(glance: WeekGlance, config: Any = None) -> ValidationReport:
    """Gate the glance itself. Each day's full package is gated separately."""
    report = ValidationReport()
    report.checked.extend([
        "WEEK_DAY_COUNT", "WEEK_STANDARD_SCHEDULE", "WEEK_MISSING_PART_D",
        "WEEK_PACK_COVERAGE", "WEEK_TEKS_DRIFT",
    ])

    if len(glance.days) != glance.days_total:
        report.add(
            "WEEK_DAY_COUNT", "error",
            f"{len(glance.days)} day rows for a {glance.days_total}-day unit.",
        )
    if not glance.days:
        return report

    numbers = [d.day for d in glance.days]
    if numbers != list(range(1, len(glance.days) + 1)):
        report.add("WEEK_DAY_COUNT", "error", f"Day numbers are not 1..n: {numbers}.")

    allowed = glance.allowed_codes()
    covered: set[str] = set()

    for day in glance.days:
        label = f"Day {day.day}"
        if not day.topic.strip():
            report.add("WEEK_STANDARD_SCHEDULE", "error", f"{label} has no topic.")
        if not day.focus_standards:
            report.add(
                "WEEK_STANDARD_SCHEDULE", "error",
                f"{label} has no focus standard.",
            )
        for code in [*day.focus_standards, *day.spiraled_standards]:
            key = normalize_code(code)
            covered.add(key)
            if allowed and key not in allowed:
                report.add(
                    "WEEK_STANDARD_SCHEDULE", "error",
                    f"{label} cites {code}, which is not in this unit.",
                )
        if not day.ticket_focus.strip():
            report.add(
                "WEEK_STANDARD_SCHEDULE", "warning",
                f"{label} does not say what its exit ticket measures.",
            )
        _validate_day_media(day, glance, report)

    missing = allowed - covered
    if missing:
        report.add(
            "WEEK_STANDARD_SCHEDULE", "error",
            f"The unit lists {len(allowed)} standards but "
            f"{len(missing)} never appear on any day.",
        )

    _validate_packs(glance, report)
    return report


def _validate_day_media(day: WeekDay, glance: WeekGlance, report: ValidationReport) -> None:
    label = f"Day {day.day}"
    part_d = day.part_d or {}
    if not part_d:
        report.add(
            "WEEK_MISSING_PART_D", "error",
            f"{label} has no Part D media brief.",
            "Every day carries its own simulation, shot list and motion movie.",
        )
        return

    if not str(part_d.get("concept_one_liner", "")).strip():
        report.add("WEEK_MISSING_PART_D", "error", f"{label} Part D has no concept one-liner.")

    movie = part_d.get("motion_movie") or {}
    for beat in ("scene", "move", "freeze_frame", "talk_back"):
        if not str(movie.get(beat, "")).strip():
            report.add(
                "WEEK_MISSING_PART_D", "error",
                f"{label} motion movie is missing its {beat.replace('_', ' ')} beat.",
            )

    prompt = str(part_d.get("gemini_sim_prompt", "") or "")
    lowered = prompt.lower()
    if not prompt.strip():
        report.add("WEEK_MISSING_PART_D", "error", f"{label} has no Gemini simulation prompt.")
    else:
        if not any(marker in lowered for marker in GEMINI_CONTROL_MARKERS):
            report.add(
                "WEEK_MISSING_PART_D", "error",
                f"{label} simulation names nothing the student can manipulate.",
            )
        listed = [m for m in (part_d.get("misconceptions_to_show") or []) if str(m).strip()]
        if not listed and not any(m in lowered for m in GEMINI_MISCONCEPTION_MARKERS):
            report.add(
                "WEEK_MISSING_PART_D", "error",
                f"{label} simulation names no misconception to expose.",
            )

    shots = [s for s in (part_d.get("veo_shot_list") or []) if isinstance(s, dict)]
    if len(shots) < VEO_MIN_SHOTS:
        report.add(
            "WEEK_MISSING_PART_D", "error",
            f"{label} has {len(shots)} Veo shot(s); at least {VEO_MIN_SHOTS} are required.",
        )
    low, high = VEO_SECONDS_RANGE
    for shot in shots:
        shot_label = shot.get("shot_id") or "shot"
        if not str(shot.get("prompt", "")).strip():
            report.add("WEEK_MISSING_PART_D", "error", f"{label} {shot_label} has no prompt.")
        purpose = str(shot.get("purpose", "")).strip().lower()
        if purpose and purpose not in VEO_PURPOSES:
            report.add(
                "WEEK_MISSING_PART_D", "warning",
                f"{label} {shot_label} purpose {purpose!r} is off-list.",
            )
        seconds = int(shot.get("seconds") or 0)
        if seconds and not low <= seconds <= high:
            report.add(
                "WEEK_MISSING_PART_D", "warning",
                f"{label} {shot_label} runs {seconds}s; shots are {low}-{high} seconds.",
            )

    use = part_d.get("classroom_use") or {}
    if not str(use.get("when_in_hunter", "")).strip():
        report.add(
            "WEEK_MISSING_PART_D", "warning",
            f"{label} does not say where the visual lands in the Hunter day.",
        )

    # Media may cite only what this unit teaches.
    allowed = glance.allowed_codes()
    if allowed:
        for text in _strings(part_d):
            for code in find_strict_codes(text):
                if normalize_code(code) not in allowed:
                    report.add(
                        "WEEK_TEKS_DRIFT", "error",
                        f"{label} media cites {code}, which this unit does not teach.",
                    )

    if day.notebooklm_pack_id and day.notebooklm_pack_id not in glance.pack_ids():
        report.add(
            "WEEK_PACK_COVERAGE", "error",
            f"{label} points at NotebookLM pack {day.notebooklm_pack_id!r}, which does not exist.",
        )
    if not day.notebooklm_pack_id:
        report.add(
            "WEEK_PACK_COVERAGE", "error",
            f"{label} names no NotebookLM pack.",
            "A day may share a pack with another day teaching the same standard, "
            "but it must point at one.",
        )


def _validate_packs(glance: WeekGlance, report: ValidationReport) -> None:
    """Every introduced standard needs a pack, and every pack needs substance."""
    if not glance.notebooklm_packs:
        report.add("WEEK_PACK_COVERAGE", "error", "The week has no NotebookLM source packs.")
        return

    used = {d.notebooklm_pack_id for d in glance.days if d.notebooklm_pack_id}
    for entry in glance.notebooklm_packs:
        pack_id = str(entry.get("pack_id", "")) or "(unnamed)"
        source = str(entry.get("source_doc_markdown", "") or "")
        words = len(source.split())
        if words < NOTEBOOK_PACK_MIN_WORDS:
            report.add(
                "WEEK_PACK_COVERAGE", "error",
                f"Pack {pack_id} is {words} words; the floor is {NOTEBOOK_PACK_MIN_WORDS}.",
            )
        elif words > NOTEBOOK_PACK_MAX_WORDS:
            report.add(
                "WEEK_PACK_COVERAGE", "warning",
                f"Pack {pack_id} is {words} words; over {NOTEBOOK_PACK_MAX_WORDS} it rambles.",
            )
        if source and not re_has_worked_example(source):
            report.add(
                "WEEK_PACK_COVERAGE", "error",
                f"Pack {pack_id} has no fully worked example with numbers.",
            )
        if pack_id not in used:
            report.add(
                "WEEK_PACK_COVERAGE", "warning",
                f"Pack {pack_id} is never used by any day.",
            )

    # Each standard that is ever a focus must be served by some pack.
    focused = {normalize_code(c) for d in glance.days for c in d.focus_standards}
    served = {
        normalize_code(code)
        for entry in glance.notebooklm_packs
        for code in find_strict_codes(str(entry.get("teks_block", "")))
    }
    for code in sorted(focused - served):
        report.add(
            "WEEK_PACK_COVERAGE", "error",
            f"No NotebookLM pack covers {code}, which is a focus standard this week.",
        )


def re_has_worked_example(source: str) -> bool:
    import re

    return bool(
        len(re.findall(r"\d", source)) >= 8
        and re.search(r"worked example|example:|step 1", source, re.IGNORECASE)
    )


def _strings(node: Any) -> list[str]:
    out: list[str] = []
    if isinstance(node, str):
        out.append(node)
    elif isinstance(node, dict):
        for value in node.values():
            out.extend(_strings(value))
    elif isinstance(node, (list, tuple)):
        for value in node:
            out.extend(_strings(value))
    return out

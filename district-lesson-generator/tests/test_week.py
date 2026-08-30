"""The week glance: schedule, per-day media, and shared source packs."""

from __future__ import annotations

import json
import re
import unittest

from helpers import ROOT  # noqa: E402

from dlg.models import PacingUnit
from dlg.week import WeekDay, WeekGlance, plan_schedule, scaffold_week, validate_week

FIXTURE = ROOT / "tests" / "fixtures" / "gold_grade8_unit10_week.json"

UNIT = PacingUnit(
    unit_id="u10", grade="8", subject="math", unit_name="Pythagorean Theorem",
    sequence=10, days=7, standard_codes=["8.6C", "8.7C", "8.7D"],
    source_path="8th Grade Math Pacing_S&S 26-27.xlsx", locator="Scope & Sequence, row 15",
)


class TestSchedule(unittest.TestCase):
    def test_pinned_introduction_days(self) -> None:
        schedule = plan_schedule(["8.6C", "8.7C", "8.7D"], 7, {1: "8.6C", 3: "8.7C", 5: "8.7D"})
        focus = [f for f, _ in schedule]
        self.assertEqual(focus[0], ["8.6C"])
        self.assertEqual(focus[1], ["8.6C"])
        self.assertEqual(focus[2], ["8.7C"])
        self.assertEqual(focus[3], ["8.7C"])
        self.assertEqual(focus[4], ["8.7D"])
        self.assertEqual(focus[5], ["8.7D"])

    def test_standards_spiral_forward_once_introduced(self) -> None:
        schedule = plan_schedule(["8.6C", "8.7C", "8.7D"], 7, {1: "8.6C", 3: "8.7C", 5: "8.7D"})
        self.assertEqual(schedule[2][1], ["8.6C"])            # day 3 spirals 8.6C
        self.assertEqual(schedule[4][1], ["8.6C", "8.7C"])    # day 5 spirals both

    def test_last_day_reviews_everything(self) -> None:
        schedule = plan_schedule(["8.6C", "8.7C", "8.7D"], 7, {1: "8.6C", 3: "8.7C", 5: "8.7D"})
        self.assertEqual(schedule[-1][0], ["8.6C", "8.7C", "8.7D"])

    def test_unpinned_schedule_spreads_the_codes(self) -> None:
        focus = [f for f, _ in plan_schedule(["A.1A", "A.2B"], 4)]
        self.assertEqual(focus[0], ["A.1A"])
        self.assertIn("A.2B", focus[2])

    def test_scaffold_takes_the_day_count_from_the_pacing_guide(self) -> None:
        glance = scaffold_week(UNIT)
        self.assertEqual(glance.days_total, 7)
        self.assertEqual(len(glance.days), 7)
        self.assertIn("row 15", glance.source)


class TestWeekValidation(unittest.TestCase):
    """A scaffolded glance is deliberately incomplete; the gate must say so."""

    def test_scaffold_alone_fails_until_media_is_written(self) -> None:
        report = validate_week(scaffold_week(UNIT, 7, {1: "8.6C", 3: "8.7C", 5: "8.7D"}))
        rules = {v.rule for v in report.errors}
        self.assertIn("WEEK_MISSING_PART_D", rules)
        self.assertIn("WEEK_PACK_COVERAGE", rules)

    def test_a_day_with_no_part_d_is_an_error(self) -> None:
        glance = _load_fixture()
        glance.days[3].part_d = {}
        self.assertIn("WEEK_MISSING_PART_D", {v.rule for v in validate_week(glance).errors})

    def test_a_day_with_too_few_shots_is_an_error(self) -> None:
        glance = _load_fixture()
        glance.days[0].part_d["veo_shot_list"] = glance.days[0].part_d["veo_shot_list"][:2]
        self.assertIn("WEEK_MISSING_PART_D", {v.rule for v in validate_week(glance).errors})

    def test_media_citing_another_units_code_is_drift(self) -> None:
        glance = _load_fixture()
        glance.days[0].part_d["concept_one_liner"] += " Previews 8.10C transformations."
        self.assertIn("WEEK_TEKS_DRIFT", {v.rule for v in validate_week(glance).errors})

    def test_a_day_pointing_at_a_missing_pack_is_an_error(self) -> None:
        glance = _load_fixture()
        glance.days[2].notebooklm_pack_id = "PACK-DOES-NOT-EXIST"
        self.assertIn("WEEK_PACK_COVERAGE", {v.rule for v in validate_week(glance).errors})

    def test_a_focus_standard_with_no_pack_is_an_error(self) -> None:
        glance = _load_fixture()
        glance.notebooklm_packs = [p for p in glance.notebooklm_packs
                                   if p["pack_id"] != "PACK-8.7D"]
        for day in glance.days:
            if day.notebooklm_pack_id == "PACK-8.7D":
                day.notebooklm_pack_id = "PACK-8.6C"
        self.assertIn("WEEK_PACK_COVERAGE", {v.rule for v in validate_week(glance).errors})

    def test_a_thin_pack_is_an_error(self) -> None:
        glance = _load_fixture()
        glance.notebooklm_packs[0]["source_doc_markdown"] = "Too short."
        self.assertIn("WEEK_PACK_COVERAGE", {v.rule for v in validate_week(glance).errors})

    def test_a_day_outside_the_units_standards_is_an_error(self) -> None:
        glance = _load_fixture()
        glance.days[1].focus_standards = ["8.10A"]
        self.assertIn("WEEK_STANDARD_SCHEDULE", {v.rule for v in validate_week(glance).errors})

    def test_wrong_day_count_is_an_error(self) -> None:
        glance = _load_fixture()
        glance.days = glance.days[:5]
        self.assertIn("WEEK_DAY_COUNT", {v.rule for v in validate_week(glance).errors})


class TestGoldWeek(unittest.TestCase):
    """The committed Unit 10 week, as specified: 7 days, 1-2 / 3-4 / 5-6 / 7."""

    @classmethod
    def setUpClass(cls) -> None:
        cls.glance = _load_fixture()
        cls.blob = FIXTURE.read_text(encoding="utf-8")

    def test_the_week_is_green(self) -> None:
        report = validate_week(self.glance)
        self.assertTrue(report.ok, [str(v) for v in report.errors])

    def test_seven_days_from_row_fifteen(self) -> None:
        self.assertEqual(len(self.glance.days), 7)
        self.assertEqual(self.glance.days_total, 7)
        self.assertIn("row 15", self.glance.source)

    def test_the_requested_schedule(self) -> None:
        focus = {d.day: d.focus_standards for d in self.glance.days}
        self.assertEqual(focus[1], ["8.6C"])
        self.assertEqual(focus[2], ["8.6C"])
        self.assertEqual(focus[3], ["8.7C"])
        self.assertEqual(focus[5], ["8.7D"])
        self.assertEqual(focus[7], ["8.6C", "8.7C", "8.7D"])

    def test_every_day_has_part_d(self) -> None:
        for day in self.glance.days:
            with self.subTest(day=day.day):
                self.assertTrue(day.part_d.get("gemini_sim_prompt", "").strip())
                self.assertGreaterEqual(len(day.part_d.get("veo_shot_list", [])), 3)
                self.assertTrue(day.part_d.get("concept_one_liner", "").strip())
                for beat in ("scene", "move", "freeze_frame", "talk_back"):
                    self.assertTrue(day.part_d["motion_movie"][beat].strip())

    def test_no_unit_fifteen_codes_anywhere(self) -> None:
        self.assertEqual(re.findall(r"8\.10[A-C]", self.blob), [])

    def test_only_unit_ten_codes_appear(self) -> None:
        cited = set(re.findall(r"\b8\.\d+[A-Z]\b", self.blob))
        self.assertTrue(cited <= {"8.6C", "8.7C", "8.7D"}, f"unexpected: {cited}")

    def test_three_packs_one_per_standard_each_over_the_floor(self) -> None:
        packs = {p["pack_id"]: p for p in self.glance.notebooklm_packs}
        self.assertEqual(set(packs), {"PACK-8.6C", "PACK-8.7C", "PACK-8.7D"})
        for pack_id, entry in packs.items():
            with self.subTest(pack=pack_id):
                self.assertGreaterEqual(len(entry["source_doc_markdown"].split()), 800)
                self.assertIn("VIDEO STEERING", entry["source_doc_markdown"])

    def test_days_teaching_a_standard_share_its_pack(self) -> None:
        by_day = {d.day: d.notebooklm_pack_id for d in self.glance.days}
        self.assertEqual(by_day[1], by_day[2], "both 8.6C days share one pack")
        self.assertEqual(by_day[3], by_day[4], "both 8.7C days share one pack")
        self.assertEqual(by_day[5], by_day[6], "both 8.7D days share one pack")

    def test_day_one_links_to_its_full_package(self) -> None:
        self.assertIn("day1", self.glance.days[0].package)

    def test_every_day_says_where_the_visual_lands(self) -> None:
        for day in self.glance.days:
            with self.subTest(day=day.day):
                use = day.part_d["classroom_use"]
                self.assertTrue(use["when_in_hunter"].strip())
                self.assertTrue(use["teacher_move_after"].strip())


def _load_fixture() -> WeekGlance:
    data = json.loads(FIXTURE.read_text(encoding="utf-8"))
    days = [WeekDay(**d) for d in data.pop("days")]
    return WeekGlance(days=days, **data)


if __name__ == "__main__":
    unittest.main()

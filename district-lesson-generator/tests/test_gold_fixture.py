"""The gold fixture: Grade 8 Math, Unit 10, Day 1, 8.6C focus.

Guards the properties the media addendum called out by name, so a later change
to retrieval, the schema or the gate cannot quietly rot the reference package.

The fixture is a committed artifact rather than a generated one, so this suite
runs without the district corpus present.
"""

from __future__ import annotations

import json
import re
import unittest
from pathlib import Path

from helpers import ROOT  # noqa: E402

from dlg.schemas import HUNTER_STEPS, NOTEBOOK_PACK_MAX_WORDS, NOTEBOOK_PACK_MIN_WORDS, VEO_MIN_SHOTS

FIXTURE = ROOT / "tests" / "fixtures" / "gold_grade8_unit10_day1.json"


class TestGoldFixture(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.doc = json.loads(FIXTURE.read_text(encoding="utf-8"))
        cls.blob = json.dumps(cls.doc)

    # -- retrieval fidelity -------------------------------------------
    def test_standards_are_unit_tens_and_district_worded(self) -> None:
        by_code = {s["code"]: s["text"] for s in self.doc["standards"]}
        self.assertIn("8.6C", by_code)
        self.assertEqual(
            by_code["8.6C"], "Use models and diagrams to explain the Pythagorean theorem"
        )

    def test_no_unit_fifteen_transformation_codes_leak_in(self) -> None:
        """Row 20 is Unit 15. It must never appear in a Unit 10 package."""
        self.assertEqual(re.findall(r"8\.10[A-C]", self.blob), [])

    def test_only_unit_ten_codes_are_cited_anywhere(self) -> None:
        cited = set(re.findall(r"\b8\.\d+[A-Z]\b", self.blob))
        self.assertTrue(cited <= {"8.6C", "8.7C", "8.7D"}, f"unexpected codes: {cited}")

    def test_provenance_names_the_source_row(self) -> None:
        self.assertIn("row 15", self.doc["_provenance"]["unit_source"])

    # -- Parts A, B, C -------------------------------------------------
    def test_all_eight_hunter_steps_with_minutes_totalling_the_period(self) -> None:
        self.assertEqual(len(self.doc["hunter"]), len(HUNTER_STEPS))
        for step, label in HUNTER_STEPS:
            with self.subTest(step=label):
                self.assertTrue(self.doc["hunter"][step]["teacher_moves"])
        self.assertEqual(sum(s["minutes"] for s in self.doc["hunter"].values()), 55)

    def test_student_pages_carry_evidence_and_a_because_line(self) -> None:
        self.assertGreaterEqual(len(self.doc["student_pages"]), 1)
        for page in self.doc["student_pages"]:
            self.assertTrue(page["evidence_space"].strip())
            self.assertTrue(page["because_line"].strip())
            for item in page["items"]:
                self.assertTrue(item["answer"].strip())

    def test_ticket_has_staar_items_and_a_constructed_item_with_a_rubric(self) -> None:
        ticket = self.doc["exit_ticket"]
        self.assertGreaterEqual(len(ticket["items"]), 2)
        for item in ticket["items"]:
            self.assertTrue(item["answer"].strip())
            self.assertTrue(item["distractor_rationale"].strip())
        constructed = ticket["constructed_item"]
        self.assertTrue(constructed["exemplar_model"].strip())
        self.assertTrue(constructed["exemplar_justification"].strip())
        for band in ("zero", "one", "two"):
            self.assertTrue(constructed["scoring"][band].strip())

    # -- Part D --------------------------------------------------------
    def test_gemini_prompt_is_a_model_not_a_calculator(self) -> None:
        """8.6C is explained with area. A prompt that only computes fails."""
        prompt = self.doc["part_d"]["gemini_sim_prompt"].lower()
        self.assertIn("square", prompt)
        self.assertIn("area", prompt)
        self.assertTrue(any(w in prompt for w in ("draggable", "slider")))
        self.assertIn("misconception", prompt)

    def test_gemini_prompt_leaves_no_unfilled_brackets(self) -> None:
        self.assertEqual(re.findall(r"\{[a-z_ ]+\}", self.doc["part_d"]["gemini_sim_prompt"]), [])

    def test_notebook_pack_is_within_range_and_has_a_worked_example(self) -> None:
        pack = self.doc["part_d"]["notebooklm_source_pack"]["source_doc_markdown"]
        words = len(pack.split())
        self.assertGreaterEqual(words, NOTEBOOK_PACK_MIN_WORDS)
        self.assertLessEqual(words, NOTEBOOK_PACK_MAX_WORDS)
        self.assertIn("VIDEO STEERING", pack)
        self.assertRegex(pack, r"(?i)worked example")
        self.assertIn("9 + 16 = 25", pack)

    def test_veo_shots_meet_the_floor_and_use_allowed_purposes(self) -> None:
        from dlg.schemas import VEO_PURPOSES

        shots = self.doc["part_d"]["veo_shot_list"]
        self.assertGreaterEqual(len(shots), VEO_MIN_SHOTS)
        for shot in shots:
            with self.subTest(shot=shot["shot_id"]):
                self.assertIn(shot["purpose"], VEO_PURPOSES)
                self.assertTrue(3 <= shot["seconds"] <= 8)
                self.assertTrue(shot["prompt"].strip())

    def test_veo_shots_stay_classroom_safe(self) -> None:
        """No real student faces, no logos, no drone-over-the-city."""
        for shot in self.doc["part_d"]["veo_shot_list"]:
            lowered = shot["prompt"].lower()
            for banned in ("student's face", "children smiling", "school logo", "drone over"):
                with self.subTest(shot=shot["shot_id"], banned=banned):
                    self.assertNotIn(banned, lowered)

    def test_media_lands_somewhere_in_the_hunter_day(self) -> None:
        use = self.doc["part_d"]["classroom_use"]
        self.assertTrue(use["when_in_hunter"].strip())
        self.assertTrue(use["teacher_move_after"].strip())
        self.assertGreater(use["minutes"], 0)


if __name__ == "__main__":
    unittest.main()

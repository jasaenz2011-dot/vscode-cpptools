"""Layer 2: mapping, standards resolution, and validation rules."""

from __future__ import annotations

import unittest

from helpers import FakeClient, make_project  # noqa: E402

from dlg.agents import CurriculumMapper, StandardsAgent, Validator
from dlg.agents.curriculum_mapper import _week_ranges
from dlg.agents.validator import apply_deterministic_fixes
from dlg.embeddings import HashingEmbedder
from dlg.llm import OfflineClient
from dlg.models import LessonRequest
from dlg.retrieval import Retriever


def _agents(config, store):
    retriever = Retriever(store, HashingEmbedder(store.meta.embed_dim))
    common = dict(config=config, client=OfflineClient(), store=store, retriever=retriever)
    return (
        CurriculumMapper(**common),
        StandardsAgent(**common),
        Validator(**common),
    )


class TestWeekParsing(unittest.TestCase):
    def test_ranges(self) -> None:
        self.assertEqual(_week_ranges("Weeks 8-11"), [(8, 11)])
        self.assertEqual(_week_ranges("Week 4"), [(4, 4)])
        self.assertEqual(sorted(_week_ranges("1, 2, 5")), [(1, 1), (2, 2), (5, 5)])

    def test_numbers_inside_a_range_are_not_double_counted(self) -> None:
        self.assertEqual(_week_ranges("Weeks 12-14"), [(12, 14)])


class TestCurriculumMapper(unittest.TestCase):
    def setUp(self) -> None:
        self.config, self.store, _ = make_project()
        self.mapper, _, _ = _agents(self.config, self.store)

    def test_week_selects_the_unit_whose_window_contains_it(self) -> None:
        result = self.mapper.run(LessonRequest(grade="5", subject="math", week="9"))
        self.assertIsNotNone(result.unit)
        self.assertEqual(result.unit.sequence, 3)
        self.assertIn("Fractions", result.unit.unit_name)

    def test_unit_number_selects_directly(self) -> None:
        result = self.mapper.run(LessonRequest(grade="5", subject="math", unit="6"))
        self.assertEqual(result.unit.unit_name, "Geometry and Measurement")

    def test_unit_name_substring_selects(self) -> None:
        result = self.mapper.run(LessonRequest(grade="5", subject="math", unit="data"))
        self.assertEqual(result.unit.sequence, 7)

    def test_standards_are_spread_across_lessons_not_dumped_on_each(self) -> None:
        first = self.mapper.run(LessonRequest(grade="5", subject="math", unit="1", lesson_number=1))
        second = self.mapper.run(LessonRequest(grade="5", subject="math", unit="1", lesson_number=2))
        self.assertEqual(len(first.primary_standards), 1)
        self.assertNotEqual(first.primary_standards, second.primary_standards)
        self.assertLessEqual(len(first.all_codes), 3)

    def test_focus_standards_override_the_pacing_guide(self) -> None:
        result = self.mapper.run(
            LessonRequest(grade="5", subject="math", unit="1", focus_standards=["5.9C"])
        )
        self.assertEqual(result.primary_standards, ["5.9C"])

    def test_unknown_grade_reports_a_note_instead_of_failing(self) -> None:
        result = self.mapper.run(LessonRequest(grade="11", subject="math"))
        self.assertIsNone(result.unit)
        self.assertTrue(result.notes)

    def test_unmatched_week_widens_instead_of_returning_nothing(self) -> None:
        result = self.mapper.run(LessonRequest(grade="5", subject="math", week="99"))
        self.assertIsNotNone(result.unit)
        self.assertTrue(any("No pacing window" in note for note in result.notes))


class TestStandardsAgent(unittest.TestCase):
    def setUp(self) -> None:
        self.config, self.store, _ = make_project()
        _, self.standards, _ = _agents(self.config, self.store)

    def test_resolves_codes_to_verbatim_district_text(self) -> None:
        pack = self.standards.run(["5.3K"], grade="5", subject="math")
        self.assertEqual(pack.standards[0].code, "5.3K")
        self.assertIn("positive rational numbers", pack.standards[0].text)
        self.assertIn("sample_standards_grade5_math.csv", pack.standards[0].source_path)

    def test_unknown_code_is_reported_not_invented(self) -> None:
        pack = self.standards.run(["9.99Z"], grade="5", subject="math")
        self.assertEqual(pack.missing, ["9.99Z"])
        self.assertEqual(pack.standards, [])
        self.assertTrue(any("Not found" in note for note in pack.notes))

    def test_block_carries_provenance_for_the_prompt(self) -> None:
        block = self.standards.run(["5.3H"], grade="5", subject="math").to_block()
        self.assertIn("5.3H", block)
        self.assertIn("source:", block)

    def test_recovers_a_code_from_prose_when_no_table_exists(self) -> None:
        files = {
            "grade5_math_standards.md": (
                "Grade 5 mathematics standards\n\n"
                "5.7A solve problems by calculating conversions within a measurement system\n"
            )
        }
        config, store, _ = make_project(files)
        _, agent, _ = _agents(config, store)
        pack = agent.run(["5.7A"], grade="5", subject="math")
        self.assertEqual(pack.standards[0].code, "5.7A")
        self.assertIn("conversions", pack.standards[0].text)


class TestValidator(unittest.TestCase):
    def setUp(self) -> None:
        self.config, self.store, _ = make_project()
        _, self.standards, self.validator = _agents(self.config, self.store)
        self.pack = self.standards.run(["5.3H", "5.3K"], grade="5", subject="math")
        self.request = LessonRequest(grade="5", subject="math", duration_minutes=60)

    def _document(self, **overrides) -> dict:
        document = {
            "title": "Adding Fractions",
            "essential_question": "How do we add fractions with unlike denominators?",
            "learning_objective": "I can add fractions with unlike denominators.",
            "language_objective": "I can explain my model using the word denominator.",
            "success_criteria": ["I can rename fractions using a common denominator."],
            "standards": [
                {"code": s.code, "text": s.text, "emphasis": "primary focus"}
                for s in self.pack.standards
            ],
            "vocabulary": [{"term": "denominator", "student_friendly_definition":
                            "the number of equal parts in one whole", "spanish_cognate": "denominador"}],
            "materials": ["fraction tiles"],
            "prior_knowledge": "Students can name equivalent fractions.",
            "misconceptions": [{"misconception": "adding denominators",
                                "teacher_response": "model with fraction tiles"}],
            "lesson_flow": [
                {"phase": phase, "minutes": minutes, "teacher_moves": ["ask a question"],
                 "student_actions": ["build a model"], "check_for_understanding": "show me"}
                for phase, minutes in
                [("Engage", 10), ("Explore", 15), ("Explain", 15), ("Elaborate", 12), ("Evaluate", 8)]
            ],
            "differentiation": {"tier2_support": ["use tiles"], "emergent_bilingual": ["stems"],
                                "special_education": ["reduce items"], "extension": ["three addends"]},
            "formative_assessment": {"task": "Solve 1/2 + 1/3.", "exemplar_response": "5/6",
                                     "scoring_notes": "look for a common denominator"},
            "exit_ticket": {"prompt": "Add 1/4 + 1/3.", "answer_key": "7/12"},
            "independent_practice": "Textbook page 214, problems 1-8.",
            "teacher_notes": "Fraction tiles are in the cabinet.",
        }
        document.update(overrides)
        return document

    def test_a_good_lesson_passes(self) -> None:
        report = self.validator.run(self._document(), self.request, self.pack)
        self.assertTrue(report.ok, [str(v) for v in report.errors])

    def test_invented_code_is_an_error(self) -> None:
        document = self._document(teacher_notes="This also covers 9.99Z from the guide.")
        report = self.validator.run(document, self.request, self.pack)
        self.assertFalse(report.ok)
        self.assertTrue(any(v.rule == "no_invented_codes" for v in report.errors))

    def test_real_district_code_out_of_scope_is_only_a_warning(self) -> None:
        document = self._document(prior_knowledge="Builds on 5.2A from Unit 1.")
        report = self.validator.run(document, self.request, self.pack)
        self.assertTrue(report.ok, [str(v) for v in report.errors])
        self.assertTrue(any(v.rule == "no_invented_codes" for v in report.warnings))

    def test_decimals_in_math_content_are_not_flagged(self) -> None:
        document = self._document(independent_practice="Compare 3.5 and 3.25, then round 7.849.")
        report = self.validator.run(document, self.request, self.pack)
        self.assertTrue(report.ok, [str(v) for v in report.errors])

    def test_minutes_that_do_not_add_up_are_an_error(self) -> None:
        flow = self._document()["lesson_flow"]
        flow[0]["minutes"] = 40
        report = self.validator.run(self._document(lesson_flow=flow), self.request, self.pack)
        self.assertTrue(any(v.rule == "duration_sum" for v in report.errors))

    def test_placeholders_are_an_error(self) -> None:
        document = self._document(exit_ticket={"prompt": "TBD", "answer_key": "TBD"})
        report = self.validator.run(document, self.request, self.pack)
        self.assertTrue(any(v.rule == "no_placeholders" for v in report.errors))

    def test_missing_answer_key_is_an_error(self) -> None:
        document = self._document(exit_ticket={"prompt": "Add 1/4 + 1/3.", "answer_key": ""})
        report = self.validator.run(document, self.request, self.pack)
        self.assertTrue(any(v.rule == "answer_keys" for v in report.errors))

    def test_objective_not_student_facing_is_a_warning_only(self) -> None:
        document = self._document(learning_objective="Add fractions with unlike denominators.")
        report = self.validator.run(document, self.request, self.pack)
        self.assertTrue(report.ok)
        self.assertTrue(any(v.rule == "objective_form" for v in report.warnings))


class TestDeterministicFixes(unittest.TestCase):
    def setUp(self) -> None:
        self.config, self.store, _ = make_project()
        _, self.standards, _ = _agents(self.config, self.store)
        self.pack = self.standards.run(["5.3H"], grade="5", subject="math")

    def test_paraphrased_standard_text_is_restored_verbatim(self) -> None:
        document = {"standards": [{"code": "5.3H", "text": "Add and subtract fractions.",
                                   "emphasis": "primary focus"}]}
        changes = apply_deterministic_fixes(document, self.pack, False, self.store)
        self.assertEqual(document["standards"][0]["text"], self.pack.standards[0].text)
        self.assertTrue(any("restored" in change for change in changes))

    def test_invented_standard_is_removed(self) -> None:
        document = {"standards": [
            {"code": "5.3H", "text": self.pack.standards[0].text, "emphasis": "primary focus"},
            {"code": "9.99Z", "text": "made up", "emphasis": "supporting"},
        ]}
        changes = apply_deterministic_fixes(document, self.pack, False, self.store)
        self.assertEqual([e["code"] for e in document["standards"]], ["5.3H"])
        self.assertTrue(any("removed" in change for change in changes))

    def test_real_but_out_of_scope_standard_is_adopted_not_deleted(self) -> None:
        document = {"standards": [{"code": "5.2A", "text": "wrong wording", "emphasis": "supporting"}]}
        apply_deterministic_fixes(document, self.pack, False, self.store)
        codes = [entry["code"] for entry in document["standards"]]
        self.assertIn("5.2A", codes)
        self.assertIn("expanded notation", document["standards"][0]["text"])

    def test_an_empty_standards_block_is_backfilled(self) -> None:
        document = {"standards": []}
        apply_deterministic_fixes(document, self.pack, False, self.store)
        self.assertEqual(document["standards"][0]["code"], "5.3H")


class TestFakeClientContract(unittest.TestCase):
    def test_scripted_client_records_calls(self) -> None:
        client = FakeClient(['{"ok": true}'])
        self.assertEqual(client.complete("sys", "user"), '{"ok": true}')
        self.assertEqual(len(client.calls), 1)


if __name__ == "__main__":
    unittest.main()

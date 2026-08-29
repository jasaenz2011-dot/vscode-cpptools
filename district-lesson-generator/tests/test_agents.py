"""Layer 2: mapping, standards resolution, and validation rules."""

from __future__ import annotations

import unittest

from helpers import FakeClient, hunter_lesson, make_project  # noqa: E402

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
        document = hunter_lesson([(s.code, s.text) for s in self.pack.standards])
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
        document = self._document(teacher_notes="Builds on 5.2A from Unit 1.")
        report = self.validator.run(document, self.request, self.pack)
        self.assertTrue(report.ok, [str(v) for v in report.errors])
        self.assertTrue(any(v.rule == "no_invented_codes" for v in report.warnings))

    def test_decimals_in_math_content_are_not_flagged(self) -> None:
        document = self._document(teacher_notes="Compare 3.5 and 3.25, then round 7.849.")
        report = self.validator.run(document, self.request, self.pack)
        self.assertTrue(report.ok, [str(v) for v in report.errors])

    def test_minutes_that_do_not_add_up_are_an_error(self) -> None:
        hunter = self._document()["hunter"]
        hunter["modeling"]["minutes"] = 40
        report = self.validator.run(self._document(hunter=hunter), self.request, self.pack)
        self.assertTrue(any(v.rule == "duration_sum" for v in report.errors))

    def test_placeholders_are_an_error(self) -> None:
        document = self._document(teacher_notes="TBD")
        report = self.validator.run(document, self.request, self.pack)
        self.assertTrue(any(v.rule == "no_placeholders" for v in report.errors))

    def test_exit_ticket_item_without_a_key_is_an_error(self) -> None:
        document = self._document()
        document["exit_ticket"]["items"][0]["answer"] = ""
        report = self.validator.run(document, self.request, self.pack)
        self.assertTrue(any(v.rule == "exit_ticket_staar" for v in report.errors))

    def test_objective_not_student_facing_is_a_warning_only(self) -> None:
        document = self._document()
        document["objective"]["student_friendly"] = "Add fractions with unlike denominators."
        report = self.validator.run(document, self.request, self.pack)
        self.assertTrue(report.ok, [str(v) for v in report.errors])
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


class TestInstructionalStandard(unittest.TestCase):
    """The district's quality gate, made executable.

    All 8 Hunter steps? A student page per activity? A real STAAR ticket with a
    key? Questions past recall? Vocab in the plan AND on the kid page?
    """

    def setUp(self) -> None:
        self.config, self.store, _ = make_project()
        _, self.standards, self.validator = _agents(self.config, self.store)
        self.pack = self.standards.run(["5.3H", "5.3K"], grade="5", subject="math")
        self.request = LessonRequest(grade="5", subject="math", duration_minutes=60)

    def _doc(self, **overrides) -> dict:
        document = hunter_lesson([(s.code, s.text) for s in self.pack.standards])
        document.update(overrides)
        return document

    def _run(self, document, request=None):
        return self.validator.run(document, request or self.request, self.pack)

    def _rules(self, report) -> set[str]:
        return {v.rule for v in report.errors}

    # -- Part A --------------------------------------------------------
    def test_a_skipped_hunter_step_is_an_error(self) -> None:
        document = self._doc()
        document["hunter"]["modeling"]["teacher_moves"] = []
        self.assertIn("hunter_complete", self._rules(self._run(document)))

    def test_every_hunter_step_is_required(self) -> None:
        for step in ("purpose", "anticipatory_set", "input", "modeling", "guided_practice",
                     "checking_for_understanding", "independent_practice", "closure"):
            document = self._doc()
            document["hunter"][step]["teacher_moves"] = []
            with self.subTest(step=step):
                self.assertIn("hunter_complete", self._rules(self._run(document)))

    def test_objective_must_say_how_mastery_is_shown(self) -> None:
        document = self._doc()
        document["objective"]["mastery_evidence"] = ""
        self.assertIn("objective_form", self._rules(self._run(document)))

    def test_vocabulary_outside_four_to_eight_is_an_error(self) -> None:
        document = self._doc()
        document["academic_vocabulary"] = document["academic_vocabulary"][:2]
        self.assertIn("vocabulary_bounds", self._rules(self._run(document)))

    def test_vocabulary_listed_but_never_taught_is_an_error(self) -> None:
        """A term that appears only in the list at the top has not been taught."""
        document = self._doc()
        document["academic_vocabulary"].append(
            {"term": "numerator", "student_definition": "the top number",
             "cognate": "numerador", "gesture_or_object": "point to the top"}
        )
        self.assertIn("vocabulary_woven", self._rules(self._run(document)))

    def test_bare_recall_question_is_an_error(self) -> None:
        document = self._doc()
        document["hunter"]["checking_for_understanding"]["questions"] = ["What is a denominator?"]
        self.assertIn("high_order_questions", self._rules(self._run(document)))

    def test_causal_why_question_is_not_bare_recall(self) -> None:
        """Regression: "Why would joining pieces of different sizes give us the
        wrong amount?" is a mechanism question, and was wrongly rejected."""
        document = self._doc()
        document["hunter"]["purpose"]["questions"] = [
            "Why would joining pieces of different sizes give us the wrong amount?"
        ]
        self.assertNotIn("high_order_questions", self._rules(self._run(document)))

    def test_short_bare_recall_is_still_caught(self) -> None:
        for question in ("What is a denominator?", "Define equivalent fraction.",
                         "Name the numerator."):
            document = self._doc()
            document["hunter"]["input"]["questions"] = [question]
            with self.subTest(question=question):
                self.assertIn("high_order_questions", self._rules(self._run(document)))

    def test_recall_stem_with_a_reasoning_demand_passes(self) -> None:
        document = self._doc()
        document["hunter"]["checking_for_understanding"]["questions"] = [
            "What does the denominator tell us, and how do you know your pieces are equal?"
        ]
        self.assertNotIn("high_order_questions", self._rules(self._run(document)))

    def test_math_without_manipulatives_is_an_error(self) -> None:
        document = self._doc(manipulatives=[])
        self.assertIn("manipulatives", self._rules(self._run(document)))

    def test_reading_lesson_does_not_require_manipulatives(self) -> None:
        request = LessonRequest(grade="5", subject="ela", duration_minutes=60)
        document = self._doc(manipulatives=[])
        self.assertNotIn("manipulatives", self._rules(self._run(document, request)))

    # -- Part B --------------------------------------------------------
    def test_missing_student_pages_is_an_error(self) -> None:
        document = self._doc(student_pages=[])
        self.assertIn("student_pages", self._rules(self._run(document)))

    def test_student_page_without_a_because_line_is_an_error(self) -> None:
        document = self._doc()
        document["student_pages"][0]["because_line"] = ""
        self.assertIn("student_pages", self._rules(self._run(document)))

    def test_student_page_without_evidence_space_is_an_error(self) -> None:
        document = self._doc()
        document["student_pages"][0]["evidence_space"] = ""
        self.assertIn("student_pages", self._rules(self._run(document)))

    def test_student_page_item_needs_a_teacher_key(self) -> None:
        document = self._doc()
        document["student_pages"][0]["items"][0]["answer"] = ""
        self.assertIn("student_pages", self._rules(self._run(document)))

    # -- Part C --------------------------------------------------------
    def test_one_item_ticket_is_an_error(self) -> None:
        document = self._doc()
        document["exit_ticket"]["items"] = document["exit_ticket"]["items"][:1]
        self.assertIn("exit_ticket_staar", self._rules(self._run(document)))

    def test_ticket_without_a_constructed_item_is_an_error(self) -> None:
        document = self._doc()
        document["exit_ticket"]["constructed_item"]["prompt"] = ""
        self.assertIn("exit_ticket_staar", self._rules(self._run(document)))

    def test_constructed_item_needs_model_and_justification(self) -> None:
        for field in ("exemplar_model", "exemplar_justification"):
            document = self._doc()
            document["exit_ticket"]["constructed_item"][field] = ""
            with self.subTest(field=field):
                self.assertIn("exit_ticket_staar", self._rules(self._run(document)))

    def test_constructed_item_needs_the_full_scoring_rubric(self) -> None:
        document = self._doc()
        document["exit_ticket"]["constructed_item"]["scoring"]["two"] = ""
        self.assertIn("exit_ticket_staar", self._rules(self._run(document)))

    def test_success_line_is_required(self) -> None:
        document = self._doc()
        document["exit_ticket"]["success_line"] = ""
        self.assertIn("required_sections", self._rules(self._run(document)))

    def test_ticket_teks_are_posted_automatically(self) -> None:
        from dlg.agents.validator import apply_deterministic_fixes as fix

        document = self._doc()
        document["exit_ticket"]["teks_posted"] = []
        changes = fix(document, self.pack, False, self.store, "5", "math")
        self.assertEqual(document["exit_ticket"]["teks_posted"], ["5.3H", "5.3K"])
        self.assertTrue(any("posted the lesson's TEKS" in c for c in changes))

    # -- Multilingual learners ----------------------------------------
    def test_ell_class_requires_language_load_and_concept_gap(self) -> None:
        request = LessonRequest(grade="5", subject="math", duration_minutes=60,
                                student_notes="6 emergent bilingual students")
        document = self._doc()
        document["ell_support"]["language_load"] = ""
        document["ell_support"]["concept_gap"] = ""
        rules = self._rules(self._run(document, request))
        self.assertIn("ell_support", rules)

    def test_ell_class_requires_all_four_motion_movie_beats(self) -> None:
        request = LessonRequest(grade="5", subject="math", duration_minutes=60,
                                student_notes="newcomers in third period")
        document = self._doc()
        document["ell_support"]["motion_movie"]["freeze_frame"] = ""
        self.assertIn("ell_support", self._rules(self._run(document, request)))

    def test_class_without_multilingual_learners_is_not_penalised(self) -> None:
        document = self._doc()
        document["ell_support"]["language_load"] = ""
        self.assertNotIn("ell_support", self._rules(self._run(document)))

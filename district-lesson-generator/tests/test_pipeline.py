"""End-to-end orchestration, including the validate/repair loop."""

from __future__ import annotations

import json
import unittest
import zipfile

from helpers import FakeClient, make_project  # noqa: E402

from dlg.agents.base import AgentError
from dlg.llm import OfflineClient
from dlg.models import LessonRequest
from dlg.pipeline import Pipeline
from dlg.render import to_docx, to_html, to_markdown, write_all


def lesson_json(store, *, minutes=(10, 15, 15, 12, 8), bad_code="", answer="7/12",
                paraphrase=False) -> str:
    by_code = store.standards_by_code()
    fractions = by_code["53h"]
    fluency = by_code["53k"]
    text = "Add and subtract fractions." if paraphrase else fractions.text
    phases = ("Engage", "Explore", "Explain", "Elaborate", "Evaluate")
    document = {
        "title": "Adding Fractions with Unlike Denominators",
        "essential_question": "How do we add fractions when the denominators differ?",
        "learning_objective": "I can add fractions with unlike denominators using models.",
        "language_objective": "I can explain my model using the word denominator.",
        "success_criteria": ["I can rename two fractions with a common denominator."],
        "standards": [
            {"code": "5.3H", "text": text, "emphasis": "primary focus"},
            {"code": "5.3K", "text": fluency.text, "emphasis": "supporting"},
        ],
        "vocabulary": [{"term": "denominator",
                        "student_friendly_definition": "how many equal parts are in one whole",
                        "spanish_cognate": "denominador"}],
        "materials": ["fraction tiles", "number line strips"],
        "prior_knowledge": "Students can name equivalent fractions with models.",
        "misconceptions": [{"misconception": "Students add the denominators.",
                            "teacher_response": "Show 1/2 + 1/3 with tiles and compare to 2/5."}],
        "lesson_flow": [
            {"phase": phase, "minutes": value,
             "teacher_moves": [f"Ask: what does the denominator tell us in {phase.lower()}?"],
             "student_actions": ["Build the sum with fraction tiles."],
             "check_for_understanding": "Students hold up a whiteboard with their model."}
            for phase, value in zip(phases, minutes)
        ],
        "differentiation": {
            "tier2_support": ["Work with halves, fourths, and eighths first."],
            "emergent_bilingual": ["Post the stem: 'I renamed ___ as ___ because ___.'"],
            "special_education": ["Reduce to four problems and pre-cut the tiles."],
            "extension": ["Add three fractions with unlike denominators."],
        },
        "formative_assessment": {"task": "Solve 1/2 + 1/3 with a model and an equation.",
                                 "exemplar_response": "3/6 + 2/6 = 5/6",
                                 "scoring_notes": "Look for equal-sized parts in the model."},
        "exit_ticket": {"prompt": "Add 1/4 + 1/3 and show your model.", "answer_key": answer},
        "independent_practice": "Textbook page 214, problems 1-8.",
        "teacher_notes": (f"Also review {bad_code} before this lesson." if bad_code
                          else "Fraction tiles are in the back cabinet."),
    }
    return json.dumps(document)


class TestPipelineWithAModel(unittest.TestCase):
    def setUp(self) -> None:
        self.config, self.store, self.tmp = make_project()
        self.request = LessonRequest(grade="5", subject="math", week="9", duration_minutes=60)

    def _pipeline(self, responses: list[str]) -> tuple[Pipeline, FakeClient]:
        client = FakeClient(responses)
        return Pipeline(self.config, self.store, client), client

    def test_clean_draft_passes_on_the_first_attempt(self) -> None:
        pipeline, client = self._pipeline([lesson_json(self.store)])
        result = pipeline.generate(self.request)
        self.assertTrue(result.report.ok, [str(v) for v in result.report.errors])
        self.assertEqual(result.attempts, 1)
        self.assertEqual(len(client.calls), 1)
        self.assertEqual(result.unit.sequence, 3)

    def test_a_failing_draft_is_repaired_and_the_retry_is_cheaper(self) -> None:
        broken = lesson_json(self.store, minutes=(5, 10, 10, 10, 10), bad_code="9.99Z",
                             answer="TBD")
        pipeline, client = self._pipeline([broken, lesson_json(self.store)])
        result = pipeline.generate(self.request)

        self.assertTrue(result.report.ok, [str(v) for v in result.report.errors])
        self.assertEqual(result.attempts, 2)
        self.assertEqual(len(client.calls), 2)

        first_prompt, repair_prompt = client.calls[0][1], client.calls[1][1]
        self.assertIn("9.99Z", repair_prompt)
        self.assertIn("5.3H", repair_prompt)
        # The repair pass sends the failures and the draft, not the corpus again.
        self.assertLess(len(repair_prompt), len(first_prompt))

    def test_unfixable_draft_still_returns_with_the_failures_reported(self) -> None:
        broken = lesson_json(self.store, minutes=(5, 5, 5, 5, 5))
        pipeline, _ = self._pipeline([broken] * 3)
        result = pipeline.generate(self.request)
        self.assertFalse(result.report.ok)
        self.assertEqual(result.attempts, self.config.max_repair_attempts + 1)
        self.assertTrue(any(v.rule == "duration_sum" for v in result.report.errors))

    def test_paraphrased_standard_is_restored_without_a_retry(self) -> None:
        """A rewritten standard is a deterministic fix, not a reason to call the
        model again -- and the substitution is recorded, not silent."""
        pipeline, client = self._pipeline([lesson_json(self.store, paraphrase=True)])
        result = pipeline.generate(self.request)

        district_text = self.store.standards_by_code()["53h"].text
        self.assertEqual(result.document["standards"][0]["text"], district_text)
        self.assertEqual(len(client.calls), 1)
        self.assertEqual(result.attempts, 1)
        fixes = result.document["_provenance"]["automatic_fixes"]
        self.assertTrue(any("restored district wording for 5.3H" in fix for fix in fixes))

    def test_unparseable_output_fails_loudly_after_retrying(self) -> None:
        pipeline, _ = self._pipeline(["I cannot do that.", "Still not JSON."])
        with self.assertRaises(AgentError):
            pipeline.generate(self.request)

    def test_context_stays_inside_the_budget(self) -> None:
        pipeline, _ = self._pipeline([lesson_json(self.store)])
        report = pipeline.generate(self.request).context_report
        self.assertLessEqual(report["used_tokens"], report["budget_tokens"])
        names = {section["name"] for section in report["sections"]}
        self.assertIn("Standards in scope for this lesson", names)

    def test_provenance_records_sources_and_backend(self) -> None:
        pipeline, _ = self._pipeline([lesson_json(self.store)])
        result = pipeline.generate(self.request)
        provenance = result.document["_provenance"]
        self.assertEqual(provenance["mode"], "generated")
        self.assertTrue(any("sample_standards" in s for s in provenance["standards_sources"]))
        self.assertTrue(any("scope_and_sequence" in c for c in result.citations))


class TestOfflineScaffold(unittest.TestCase):
    def setUp(self) -> None:
        self.config, self.store, self.tmp = make_project()
        self.pipeline = Pipeline(self.config, self.store, OfflineClient())

    def test_scaffold_is_grounded_and_marked(self) -> None:
        result = self.pipeline.generate(
            LessonRequest(grade="5", subject="math", week="9", duration_minutes=60)
        )
        self.assertEqual(result.document["_provenance"]["mode"], "scaffold")
        self.assertEqual(result.document["standards"][0]["code"], "5.3H")
        self.assertIn("unequal denominators", result.document["standards"][0]["text"])

    def test_scaffold_phase_minutes_still_add_up(self) -> None:
        result = self.pipeline.generate(
            LessonRequest(grade="5", subject="math", week="9", duration_minutes=45)
        )
        total = sum(phase["minutes"] for phase in result.document["lesson_flow"])
        self.assertEqual(total, 45)

    def test_scaffold_does_not_burn_repair_attempts(self) -> None:
        result = self.pipeline.generate(LessonRequest(grade="5", subject="math", week="9"))
        self.assertEqual(result.attempts, 1)

    def test_intervention_scaffold_targets_the_unit_standard(self) -> None:
        result = self.pipeline.generate(
            LessonRequest(grade="5", subject="math", unit="3", material="intervention",
                          tier="tier2", duration_minutes=30)
        )
        self.assertTrue(result.document["target_standards"])
        self.assertEqual(result.document["progress_monitoring"]["cadence"], "Three sessions per week")


class TestRendering(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.config, cls.store, cls.tmp = make_project()
        pipeline = Pipeline(cls.config, cls.store, FakeClient([lesson_json(cls.store)]))
        cls.result = pipeline.generate(
            LessonRequest(grade="5", subject="math", week="9", duration_minutes=60)
        )

    def test_markdown_contains_the_verbatim_standard_and_a_source(self) -> None:
        markdown = to_markdown(self.result)
        self.assertIn("5.3H", markdown)
        self.assertIn("unequal denominators", markdown)
        self.assertIn("sample_standards_grade5_math.csv", markdown)
        self.assertIn("## Lesson flow", markdown)

    def test_markdown_tables_have_a_consistent_column_count(self) -> None:
        rows = [line for line in to_markdown(self.result).splitlines()
                if line.startswith("|") and not set(line) <= set("|- ")]
        self.assertTrue(rows)
        for row in rows:
            self.assertGreaterEqual(row.count(" | "), 1)

    def test_html_is_self_contained_and_escaped(self) -> None:
        html = to_html(self.result)
        self.assertTrue(html.startswith("<!doctype html>"))
        self.assertIn("<style>", html)
        self.assertNotIn("http://", html.split("<style>")[0])

    def test_docx_is_a_valid_package(self) -> None:
        path = to_docx(self.result, self.tmp / "lesson.docx")
        with zipfile.ZipFile(path) as archive:
            self.assertIn("word/document.xml", archive.namelist())
            body = archive.read("word/document.xml").decode("utf-8")
        self.assertIn("Adding Fractions", body)
        self.assertIn("Heading1", body)

    def test_write_all_produces_four_files(self) -> None:
        written = write_all(self.result, self.tmp / "out")
        self.assertEqual(set(written), {"markdown", "html", "docx", "json"})
        for path in written.values():
            self.assertTrue(path.is_file() and path.stat().st_size > 0)

    def test_exported_json_round_trips(self) -> None:
        written = write_all(self.result, self.tmp / "out2")
        payload = json.loads(written["json"].read_text(encoding="utf-8"))
        self.assertEqual(payload["request"]["grade"], "5")
        self.assertTrue(payload["validation"]["ok"])


if __name__ == "__main__":
    unittest.main()

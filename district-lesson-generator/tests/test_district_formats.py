"""Regression tests for real district file shapes.

Every case here was found by running the ingester against an actual K-8
district's 2026-27 scope-and-sequence export (42 spreadsheets, Math / ELAR /
Science / Social Studies / CTE). Each one silently produced wrong output before
the fix, which is exactly the class of bug a sample corpus never surfaces.

No district data is committed: the fixtures rebuild the *shape* of those files.
"""

from __future__ import annotations

import shutil
import tempfile
import unittest
from pathlib import Path

from helpers import write_xlsx  # noqa: E402

from dlg import loaders, parsers
from dlg.models import Document
from dlg.retrieval import Store

# The real layout: a title banner, a copyright line, a merged date row, then the
# header on row 3, then a sub-header row, then data. The TEKS column carries the
# codes *and* the district's own wording for each one.
DISTRICT_SHEET = [
    ["★ SCOPE AND SEQUENCE 2026-2027 ★", "", "", "", "", ""],
    ["5th Grade Math Scope and Sequence", "", "", "", "", ""],
    ["Duration", "Unit", "Topic of Study", "Recommended Manipulatives", "TEKS",
     "Academic Vocabulary"],
    ["", "", "", "", "", "New to Grade Level"],
    ["8 days", "First 8 Days", "Covey's 7 Habits\n\nLaunch into Grade 5",
     "Base-ten blocks\nCounters", "Explore 1-Be Curious\nExplore 2-Communicate", "Habit 1"],
    ["6 days", "1.0", "Multiplication and\nDivision Algorithms", "UPS-Check",
     "5.3B Multiply with fluency a three-digit number by a two-digit number using the "
     "standard algorithm.\n5.3C Solve with proficiency for quotients of up to a four-digit "
     "dividend by a two-digit divisor.",
     "partial quotient\nremainder"],
    ["8 days", "7.0", "Add and Subtract\nFractions", "Fraction strips",
     "5.3H Represent and solve addition and subtraction of fractions with unequal "
     "denominators.\n5.3K Add and subtract positive rational numbers fluently.",
     "common denominator"],
]


def _load(tmp: Path, filename: str = "5th Grade Math Pacing_S&S 26-27.xlsx"):
    path = write_xlsx(tmp / filename, {"Scope & Sequence": DISTRICT_SHEET})
    loaded = loaders.load(path)
    grade, subject = parsers.infer_grade_subject(path, loaded)
    doc = Document(doc_id="d", path=path.name, title=path.stem,
                   kind=parsers.classify(path, loaded),
                   meta={"grade": grade, "subject": subject})
    return path, loaded, doc


class TestRealDistrictSpreadsheet(unittest.TestCase):
    def setUp(self) -> None:
        self.tmp = Path(tempfile.mkdtemp(prefix="dlg-fmt-"))

    def tearDown(self) -> None:
        shutil.rmtree(self.tmp, ignore_errors=True)

    def test_header_below_a_title_banner_is_found(self) -> None:
        """The header sits on row 3. Assuming row 0 parsed zero units."""
        _, loaded, doc = _load(self.tmp)
        units = parsers.extract_pacing_units(doc, loaded)
        self.assertEqual(len(units), 3)
        self.assertIn("Multiplication and Division Algorithms",
                      [u.unit_name for u in units])

    def test_columns_map_to_the_right_fields(self) -> None:
        _, loaded, doc = _load(self.tmp)
        unit = next(u for u in parsers.extract_pacing_units(doc, loaded) if u.sequence == 1)
        self.assertEqual(unit.days, 6)                      # "Duration" -> days
        self.assertEqual(unit.resources, "UPS-Check")       # "Recommended Manipulatives"
        self.assertIn("partial quotient", unit.vocabulary)  # "Academic Vocabulary"
        self.assertEqual(unit.standard_codes, ["5.3B", "5.3C"])

    def test_packed_teks_cell_yields_verbatim_standards(self) -> None:
        """Several standards share one cell, code then text, and the district's
        wording has to survive intact."""
        _, loaded, doc = _load(self.tmp)
        standards = {s.code: s.text for s in parsers.extract_standards(doc, loaded)}
        self.assertIn("5.3B", standards)
        self.assertIn("5.3K", standards)
        self.assertEqual(
            standards["5.3K"], "Add and subtract positive rational numbers fluently"
        )
        # The text of 5.3B must not run on into 5.3C.
        self.assertNotIn("quotients", standards["5.3B"])

    def test_prose_fragments_never_become_standard_codes(self) -> None:
        _, loaded, doc = _load(self.tmp)
        for unit in parsers.extract_pacing_units(doc, loaded):
            for code in unit.standard_codes:
                self.assertLessEqual(len(code), 12, f"{code!r} is prose, not a code")

    def test_named_launch_block_does_not_take_unit_ones_number(self) -> None:
        _, loaded, doc = _load(self.tmp)
        units = parsers.extract_pacing_units(doc, loaded)
        by_name = {u.unit_name.split("\n")[0]: u.sequence for u in units}
        self.assertEqual(by_name["Covey's 7 Habits Launch into Grade 5"], 0)
        sequences = [u.sequence for u in units]
        self.assertEqual(len(sequences), len(set(sequences)), "unit numbers collided")

    def test_a_data_row_is_not_mistaken_for_a_header(self) -> None:
        """Permissive alias matching used to match a row of prose, which
        classified a pacing sheet as a standards table."""
        _, loaded, doc = _load(self.tmp)
        self.assertEqual(doc.kind, "pacing")

    def test_xlsx_numerics_arriving_as_floats(self) -> None:
        _, loaded, doc = _load(self.tmp)
        self.assertEqual(
            sorted(u.sequence for u in parsers.extract_pacing_units(doc, loaded)), [0, 1, 7]
        )


class TestGradeDetection(unittest.TestCase):
    """Districts name files every possible way round."""

    def setUp(self) -> None:
        self.tmp = Path(tempfile.mkdtemp(prefix="dlg-grade-"))

    def tearDown(self) -> None:
        shutil.rmtree(self.tmp, ignore_errors=True)

    def _grade(self, filename: str) -> str:
        path, loaded, _ = _load(self.tmp, filename)
        return parsers.infer_grade_subject(path, loaded)[0]

    def test_ordinal_before_the_word_grade(self) -> None:
        self.assertEqual(self._grade("5th Grade Math Pacing_S&S 26-27.xlsx"), "5")
        self.assertEqual(self._grade("1st Grade Math Pacing_S&S 2026-2027.xlsx"), "1")
        self.assertEqual(self._grade("3rd Grade Math Pacing_S&S 26-27.xlsx"), "3")

    def test_grade_before_the_number(self) -> None:
        self.assertEqual(self._grade("grade5_math_scope.xlsx"), "5")
        self.assertEqual(self._grade("Grade 8 Math.xlsx"), "8")

    def test_kindergarten_spellings(self) -> None:
        self.assertEqual(self._grade("Kinder Math Pacing_S&S 26-27.xlsx"), "K")
        self.assertEqual(self._grade("Kindergarten Math Pacing_S&S 2026-2027.xlsx"), "K")

    def test_course_named_files_still_find_a_grade(self) -> None:
        self.assertEqual(self._grade("Algebra I (8th-VT) 26-27 Pacing_S&S.xlsx"), "8")


class TestCrossSubjectCodes(unittest.TestCase):
    """TEKS codes are only unique within a subject: 3.4A is a real code in both
    grade 3 math and grade 3 science."""

    def setUp(self) -> None:
        self.tmp = Path(tempfile.mkdtemp(prefix="dlg-subj-"))
        self.store = Store(self.tmp / "index")
        from dlg.models import Standard

        self.store.standards = [
            Standard(code="3.4A", text="Solve one-step and two-step addition problems",
                     grade="3", subject="math", source_path="3rd Grade Math.xlsx"),
            Standard(code="3.4A", text="Recurring themes and concepts in science",
                     grade="3", subject="science", source_path="3rd Grade Science.xlsx"),
        ]

    def tearDown(self) -> None:
        shutil.rmtree(self.tmp, ignore_errors=True)

    def test_lookup_respects_subject(self) -> None:
        math, _ = self.store.lookup_standards(["3.4A"], "3", "math")
        science, _ = self.store.lookup_standards(["3.4A"], "3", "science")
        self.assertIn("addition", math[0].text)
        self.assertIn("science", science[0].text)

    def test_unfiltered_lookup_still_resolves(self) -> None:
        found, missing = self.store.lookup_standards(["3.4A"])
        self.assertEqual(len(found), 1)
        self.assertEqual(missing, [])

    def test_unknown_code_is_still_missing(self) -> None:
        _, missing = self.store.lookup_standards(["9.99Z"], "3", "math")
        self.assertEqual(missing, ["9.99Z"])


TEA_DOCUMENT = """Texas Essential Knowledge and Skills (TEKS)

Grades 5-8 | Mathematics, Science, Social Studies, English Language Arts and Reading

Grade 5

Mathematics

(b) Knowledge and skills.

(3) Number and operations. The student applies mathematical process standards to
develop and use strategies. The student is expected to:

(K) add and subtract positive rational numbers fluently; and

(L) divide whole numbers by unit fractions and unit fractions by whole numbers

Science

(b) Knowledge and skills.

(4) Scientific investigation and reasoning. The student is expected to:

(A) demonstrate safe practices during laboratory and outdoor investigations

Grade 8

Mathematics

(b) Knowledge and skills.

(10) Two-dimensional shapes. The student is expected to:

(C) explain the effect of translations and reflections over the x- or y-axis
"""


class TestOfficialTeksDocument(unittest.TestCase):
    """The published TEKS never write the code out: "(K)" under "(3)" in
    "Grade 5 / Mathematics" is 5.3K. A plain code scan finds nothing at all."""

    def _standards(self):
        doc = Document(doc_id="d", path="Texas_TEKS_Grades5-8.docx", title="teks",
                       kind="standards")
        return {(s.code, s.subject): s for s in
                parsers.standards_from_tea_document(doc, TEA_DOCUMENT)}

    def test_document_is_recognised(self) -> None:
        self.assertTrue(parsers.looks_like_tea_document(TEA_DOCUMENT))
        self.assertFalse(parsers.looks_like_tea_document("An ordinary resource list."))

    def test_codes_are_composed_from_the_hierarchy(self) -> None:
        standards = self._standards()
        self.assertIn(("5.3K", "math"), standards)
        self.assertIn(("5.3L", "math"), standards)
        self.assertIn(("8.10C", "math"), standards)

    def test_subject_switches_within_a_grade(self) -> None:
        standards = self._standards()
        self.assertIn(("5.4A", "science"), standards)
        self.assertIn("safe practices", standards[("5.4A", "science")].text)

    def test_list_punctuation_is_not_part_of_the_standard(self) -> None:
        text = self._standards()[("5.3K", "math")].text
        self.assertEqual(text, "add and subtract positive rational numbers fluently")

    def test_wrapped_text_is_joined(self) -> None:
        standards = self._standards()
        self.assertIn("unit fractions by whole numbers", standards[("5.3L", "math")].text)

    def test_grade_resets_the_knowledge_number(self) -> None:
        """Grade 8's "(10)" must not inherit grade 5's numbering."""
        standards = self._standards()
        self.assertNotIn(("5.10C", "math"), standards)


class TestUnitSelection(unittest.TestCase):
    def test_a_number_means_the_unit_number_not_a_name_substring(self) -> None:
        """`--unit 7` used to match "Covey's 7 Habits" instead of unit 7."""
        from dlg.agents.curriculum_mapper import CurriculumMapper
        from dlg.models import PacingUnit

        launch = PacingUnit(unit_id="a", grade="5", subject="math",
                            unit_name="Covey's 7 Habits Launch into Grade 5", sequence=0)
        unit7 = PacingUnit(unit_id="b", grade="5", subject="math",
                           unit_name="Add and Subtract Fractions", sequence=7)

        self.assertFalse(CurriculumMapper._unit_matches(launch, "7"))
        self.assertTrue(CurriculumMapper._unit_matches(unit7, "7"))
        self.assertTrue(CurriculumMapper._unit_matches(unit7, "unit 7"))
        self.assertTrue(CurriculumMapper._unit_matches(unit7, "fractions"))


if __name__ == "__main__":
    unittest.main()

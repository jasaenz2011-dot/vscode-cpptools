"""Layer 1: loaders, chunking, parsers, and the PDF fallback."""

from __future__ import annotations

import shutil
import unittest
import zlib
from pathlib import Path

from helpers import make_project  # noqa: E402

from dlg import loaders, parsers, pdftext
from dlg.chunking import chunk_document
from dlg.loaders import Loaded, Table
from dlg.models import Document
from dlg.util import find_standard_codes, find_strict_codes, grade_key, subject_key


class TestLoaders(unittest.TestCase):
    def setUp(self) -> None:
        self.tmp = Path(__file__).parent / "_tmp_loaders"
        self.tmp.mkdir(exist_ok=True)

    def tearDown(self) -> None:
        shutil.rmtree(self.tmp, ignore_errors=True)

    def test_csv_becomes_a_table_with_records(self) -> None:
        path = self.tmp / "units.csv"
        path.write_text("Unit,Weeks,TEKS\nFractions,1-3,5.3H\n", encoding="utf-8")
        loaded = loaders.load(path)
        self.assertEqual(len(loaded.tables), 1)
        self.assertEqual(loaded.tables[0].records()[0]["Weeks"], "1-3")

    def test_semicolon_delimiter_is_sniffed(self) -> None:
        path = self.tmp / "units.csv"
        path.write_text("Unit;Weeks\nFractions;1-3\n", encoding="utf-8")
        table = loaders.load(path).tables[0]
        self.assertEqual(table.header, ["Unit", "Weeks"])

    def test_html_tags_are_stripped(self) -> None:
        path = self.tmp / "page.html"
        path.write_text("<html><head><style>x{}</style></head><body><p>Hello</p></body></html>",
                        encoding="utf-8")
        self.assertIn("Hello", loaders.load(path).text)
        self.assertNotIn("x{}", loaders.load(path).text)

    def test_unreadable_file_reports_instead_of_raising(self) -> None:
        path = self.tmp / "broken.docx"
        path.write_bytes(b"not a zip file")
        loaded = loaders.load(path)
        self.assertTrue(loaded.warnings)


class TestPdfFallback(unittest.TestCase):
    """The built-in extractor must handle a real (if minimal) PDF."""

    @staticmethod
    def _make_pdf(lines: list[str], compress: bool) -> bytes:
        content = b"BT /F1 12 Tf 72 720 Td\n" + b"\n".join(
            b"(" + line.encode("latin-1") + b") Tj T*" for line in lines
        ) + b"\nET"
        stream = zlib.compress(content) if compress else content
        filter_entry = b"/Filter /FlateDecode " if compress else b""

        objects = [
            b"<< /Type /Catalog /Pages 2 0 R >>",
            b"<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
            b"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >>",
            b"<< " + filter_entry + b"/Length " + str(len(stream)).encode() + b" >>\nstream\n"
            + stream + b"\nendstream",
        ]
        out = bytearray(b"%PDF-1.4\n")
        for number, body in enumerate(objects, start=1):
            out += f"{number} 0 obj\n".encode() + body + b"\nendobj\n"
        out += b"trailer\n<< /Size 5 /Root 1 0 R >>\n%%EOF\n"
        return bytes(out)

    def test_uncompressed_stream(self) -> None:
        result = pdftext.extract(self._make_pdf(["Unit 3: Fractions", "TEKS 5.3H"], compress=False))
        self.assertIn("Unit 3: Fractions", result.text)
        self.assertIn("5.3H", result.text)

    def test_flate_compressed_stream(self) -> None:
        result = pdftext.extract(self._make_pdf(["Weeks 8-11", "5.3K"], compress=True))
        self.assertIn("Weeks 8-11", result.text)
        self.assertEqual(result.page_count, 1)

    def test_escapes_and_parentheses(self) -> None:
        result = pdftext.extract(self._make_pdf([r"a \(b\) c", r"tab\tsep"], compress=False))
        self.assertIn("a (b) c", result.text)

    def test_empty_pdf_reports_low_confidence(self) -> None:
        result = pdftext.extract(b"%PDF-1.4\ntrailer\n%%EOF")
        self.assertFalse(result.usable)


class TestChunking(unittest.TestCase):
    def _doc(self) -> Document:
        return Document(doc_id="d1", path="units.csv", title="units", kind="pacing")

    def test_table_chunks_repeat_the_header(self) -> None:
        rows = [["Unit", "Weeks"]] + [[f"Unit {n}", f"{n}"] for n in range(1, 40)]
        loaded = Loaded(tables=[Table(name="units", rows=rows)])
        chunks = chunk_document(self._doc(), loaded, chunk_tokens=40, overlap_tokens=0)
        self.assertGreater(len(chunks), 1)
        for chunk in chunks:
            self.assertTrue(chunk.text.startswith("Unit | Weeks"))

    def test_table_locator_names_the_rows(self) -> None:
        rows = [["Unit", "Weeks"], ["Fractions", "1-3"]]
        chunks = chunk_document(self._doc(), Loaded(tables=[Table("units", rows)]), 200, 0)
        self.assertEqual(chunks[0].locator, "units, row 2")

    def test_prose_chunks_do_not_duplicate_the_tail(self) -> None:
        blocks = [f"Paragraph {n}. " + "word " * 40 for n in range(12)]
        loaded = Loaded(text="\n\n".join(blocks))
        chunks = chunk_document(self._doc(), loaded, chunk_tokens=120, overlap_tokens=20)
        self.assertGreater(len(chunks), 1)
        self.assertNotEqual(chunks[-1].text, chunks[-2].text)

    def test_pages_become_page_locators(self) -> None:
        loaded = Loaded(text="a\n\nb", pages=["page one text", "page two text"])
        chunks = chunk_document(self._doc(), loaded, 200, 0)
        self.assertEqual([chunk.locator for chunk in chunks], ["p. 1", "p. 2"])

    def test_chunk_ids_are_stable_across_runs(self) -> None:
        loaded = Loaded(text="Some district guidance about fractions.")
        first = chunk_document(self._doc(), loaded, 200, 0)
        second = chunk_document(self._doc(), loaded, 200, 0)
        self.assertEqual([c.chunk_id for c in first], [c.chunk_id for c in second])


class TestParsers(unittest.TestCase):
    def test_standards_table_with_unusual_headers(self) -> None:
        rows = [
            ["Student Expectation Code", "Grade Level", "Content Area", "Expectation Text"],
            ["5.3K", "Grade 5", "Mathematics", "add and subtract positive rational numbers fluently"],
        ]
        doc = Document(doc_id="d", path="s.csv", title="s", kind="standards")
        standards = parsers.extract_standards(doc, Loaded(tables=[Table("s", rows)]))
        self.assertEqual(len(standards), 1)
        self.assertEqual(standards[0].code, "5.3K")
        self.assertEqual(standards[0].grade, "5")
        self.assertEqual(standards[0].subject, "math")

    def test_standards_from_prose_when_there_is_no_table(self) -> None:
        text = (
            "5.3H represent and solve addition and subtraction of fractions\n"
            "with unequal denominators referring to the same whole\n\n"
            "5.3K add and subtract positive rational numbers fluently\n"
        )
        doc = Document(doc_id="d", path="s.pdf", title="s", kind="standards")
        standards = parsers.extract_standards(doc, Loaded(text=text))
        codes = sorted(standard.code for standard in standards)
        self.assertEqual(codes, ["5.3H", "5.3K"])
        wrapped = next(s for s in standards if s.code == "5.3H")
        self.assertIn("same whole", wrapped.text)

    def test_pacing_rows_carry_codes_and_window(self) -> None:
        rows = [
            ["Unit #", "Unit Name", "Weeks", "TEKS", "Grade", "Subject"],
            ["3", "Fractions", "Weeks 8-11", "5.3H, 5.3K", "5", "Math"],
        ]
        doc = Document(doc_id="d", path="p.csv", title="p", kind="pacing")
        units = parsers.extract_pacing_units(doc, Loaded(tables=[Table("p", rows)]))
        self.assertEqual(len(units), 1)
        self.assertEqual(units[0].sequence, 3)
        self.assertEqual(units[0].standard_codes, ["5.3H", "5.3K"])
        self.assertEqual(units[0].weeks, "Weeks 8-11")

    def test_classification_prefers_table_shape_over_filename(self) -> None:
        rows = [["Code", "Standard Text"], ["5.3K", "add and subtract fluently"]]
        loaded = Loaded(tables=[Table("x", rows)])
        self.assertEqual(parsers.classify(Path("pacing_guide.csv"), loaded), "standards")

    def test_grade_and_subject_inferred_from_filename(self) -> None:
        grade, subject = parsers.infer_grade_subject(
            Path("scope_grade5_math.csv"), Loaded(text="")
        )
        self.assertEqual((grade, subject), ("5", "math"))


class TestCodeMatching(unittest.TestCase):
    def test_decimals_are_not_mistaken_for_codes(self) -> None:
        text = "Students add 3.5 and 2.25 to get 5.75."
        self.assertEqual(find_strict_codes(text), [])

    def test_real_code_shapes_are_recognised(self) -> None:
        found = find_strict_codes("Covers 5.3(K), 5.3H, RL.5.1 and 112.16.3 this week.")
        self.assertEqual(len(found), 4)

    def test_permissive_matcher_still_finds_bare_codes(self) -> None:
        self.assertIn("5.3", find_standard_codes("TEKS 5.3 is the focus"))

    def test_grade_and_subject_normalization(self) -> None:
        self.assertEqual(grade_key("Grade 05"), "5")
        self.assertEqual(grade_key("Kindergarten"), "K")
        self.assertEqual(subject_key("English Language Arts"), "ela")


class TestIngestEndToEnd(unittest.TestCase):
    def test_sample_corpus_produces_standards_and_units(self) -> None:
        _, store, _ = make_project()
        self.assertGreaterEqual(len(store.standards), 20)
        self.assertEqual(len(store.units_for("5", "math")), 8)
        self.assertIn("5", store.known_grades())
        self.assertIn("math", store.known_subjects())

    def test_reingest_is_skipped_when_nothing_changed(self) -> None:
        from dlg.ingest import ingest

        config, _, _ = make_project()
        report = ingest(config, force=False)
        self.assertTrue(report.skipped_rebuild)


if __name__ == "__main__":
    unittest.main()

"""Layer 1d/2: index persistence, hybrid retrieval, and context budgeting."""

from __future__ import annotations

import unittest

from helpers import make_project  # noqa: E402

from dlg.contextpack import ContextOverflow, ContextPacker
from dlg.embeddings import HashingEmbedder
from dlg.jsonio import JSONRecoveryError, coerce, parse_json
from dlg.retrieval import BM25, Retriever, Store
from dlg.util import estimate_tokens, tokenize


class TestBM25(unittest.TestCase):
    def test_ranks_the_document_containing_the_term(self) -> None:
        corpus = [
            tokenize("fractions with unequal denominators"),
            tokenize("volume of a rectangular prism"),
            tokenize("classify two dimensional figures"),
        ]
        scores = BM25(corpus).scores(tokenize("denominators"))
        self.assertEqual(max(scores, key=scores.get), 0)

    def test_absent_term_scores_nothing(self) -> None:
        self.assertEqual(BM25([tokenize("alpha beta")]).scores(tokenize("gamma")), {})


class TestHashingEmbedder(unittest.TestCase):
    def test_vectors_are_deterministic_and_normalized(self) -> None:
        embedder = HashingEmbedder(128)
        first, second = embedder.embed(["adding fractions", "adding fractions"])
        self.assertEqual(first, second)
        self.assertAlmostEqual(sum(value * value for value in first), 1.0, places=5)

    def test_similar_text_scores_higher_than_unrelated_text(self) -> None:
        embedder = HashingEmbedder(512)
        query, near, far = embedder.embed([
            "add and subtract fractions with unlike denominators",
            "adding fractions with unequal denominators",
            "define income tax and payroll tax",
        ])
        dot = lambda a, b: sum(x * y for x, y in zip(a, b))  # noqa: E731
        self.assertGreater(dot(query, near), dot(query, far))


class TestStore(unittest.TestCase):
    def test_round_trip_preserves_everything(self) -> None:
        config, store, _ = make_project()
        reloaded = Store.load(config.index_path)
        self.assertEqual(len(reloaded.chunks), len(store.chunks))
        self.assertEqual(len(reloaded.standards), len(store.standards))
        self.assertEqual(reloaded.vectors[0][:4], store.vectors[0][:4])

    def test_lookup_reports_missing_codes(self) -> None:
        _, store, _ = make_project()
        found, missing = store.lookup_standards(["5.3K", "9.99Z"])
        self.assertEqual([s.code for s in found], ["5.3K"])
        self.assertEqual(missing, ["9.99Z"])

    def test_lookup_is_insensitive_to_code_formatting(self) -> None:
        _, store, _ = make_project()
        found, missing = store.lookup_standards(["5.3(k)", "5.3 K"])
        self.assertEqual(len(found), 1)   # both spellings resolve to one standard
        self.assertEqual(missing, [])


class TestRetriever(unittest.TestCase):
    def test_standard_code_query_finds_the_standards_file(self) -> None:
        _, store, _ = make_project()
        retriever = Retriever(store, HashingEmbedder(store.meta.embed_dim))
        hits = retriever.search("5.3K add and subtract positive rational numbers", k=5)
        self.assertTrue(hits)
        self.assertIn("5.3K", hits[0].chunk.text)

    def test_wrong_grade_is_penalised(self) -> None:
        files = {
            "grade5_math_resources.md": "Grade 5 math: adding fractions with unlike denominators.",
            "grade2_math_resources.md": "Grade 2 math: adding fractions with unlike denominators.",
        }
        _, store, _ = make_project(files)
        retriever = Retriever(store, HashingEmbedder(store.meta.embed_dim))
        hits = retriever.search("adding fractions", k=5, grade="5", subject="math")
        self.assertIn("grade5", hits[0].chunk.path)

    def test_empty_result_falls_back_when_a_kind_filter_matches_nothing(self) -> None:
        _, store, _ = make_project()
        retriever = Retriever(store, HashingEmbedder(store.meta.embed_dim))
        hits = retriever.search("fractions", k=3, kinds=("nonexistent-kind",))
        self.assertTrue(hits)


class TestContextPacker(unittest.TestCase):
    def test_pinned_sections_survive_and_trimmable_ones_are_cut(self) -> None:
        packer = ContextPacker(budget_tokens=260)
        standards = "STANDARD TEXT. " * 20
        packer.add("Standards", standards, priority=0, pinned=True)
        packer.add("Resources", "filler paragraph. " * 400, priority=20)
        packed = packer.pack()

        self.assertIn("STANDARD TEXT.", packed.text)
        self.assertLessEqual(packed.used, packed.budget)
        resources = next(s for s in packed.sections if s.name == "Resources")
        self.assertTrue(resources.was_trimmed)

    def test_priority_decides_who_gets_cut(self) -> None:
        packer = ContextPacker(budget_tokens=120)
        packer.add("Important", "alpha. " * 40, priority=1)
        packer.add("Optional", "omega. " * 200, priority=90)
        packed = packer.pack()
        self.assertIn("alpha.", packed.text)
        optional = [s for s in packed.sections if s.name == "Optional"]
        self.assertTrue(not optional or optional[0].was_trimmed)

    def test_oversized_pinned_content_is_an_explicit_error(self) -> None:
        packer = ContextPacker(budget_tokens=100)
        packer.add("Standards", "word " * 4000, priority=0, pinned=True)
        with self.assertRaises(ContextOverflow) as caught:
            packer.pack()
        self.assertIn("context_tokens", str(caught.exception))

    def test_report_accounts_for_every_section(self) -> None:
        packer = ContextPacker(budget_tokens=4000)
        packer.add("A", "alpha " * 50, priority=0, pinned=True)
        packer.add("B", "beta " * 50, priority=10)
        report = packer.pack().report()
        self.assertEqual({s["name"] for s in report["sections"]}, {"A", "B"})
        self.assertEqual(report["dropped"], [])


class TestJsonRecovery(unittest.TestCase):
    def test_plain_object(self) -> None:
        self.assertEqual(parse_json('{"a": 1}'), {"a": 1})

    def test_markdown_fence(self) -> None:
        self.assertEqual(parse_json('Here you go:\n```json\n{"a": 1}\n```\n'), {"a": 1})

    def test_preamble_and_trailing_commentary(self) -> None:
        raw = 'Sure! {"a": [1, 2]} Let me know if you need changes.'
        self.assertEqual(parse_json(raw), {"a": [1, 2]})

    def test_trailing_comma_and_smart_quotes(self) -> None:
        self.assertEqual(parse_json('{“a”: 1,}'), {"a": 1})

    def test_truncated_output_is_closed(self) -> None:
        raw = '{"title": "Fractions", "steps": ["one", "two"'
        recovered = parse_json(raw)
        self.assertEqual(recovered["title"], "Fractions")

    def test_braces_inside_strings_do_not_confuse_the_scanner(self) -> None:
        self.assertEqual(parse_json('{"a": "use { and } here"}')["a"], "use { and } here")

    def test_total_failure_raises(self) -> None:
        with self.assertRaises(JSONRecoveryError):
            parse_json("I am not able to produce JSON.")


class TestCoerce(unittest.TestCase):
    def test_missing_keys_get_typed_defaults(self) -> None:
        shaped = coerce({}, {"title": "str", "minutes": "int", "items": ["str"]})
        self.assertEqual(shaped, {"title": "", "minutes": 0, "items": []})

    def test_string_where_a_list_was_asked_for_is_split(self) -> None:
        shaped = coerce({"items": "one; two; three"}, {"items": ["str"]})
        self.assertEqual(shaped["items"], ["one", "two", "three"])

    def test_minutes_written_as_text(self) -> None:
        self.assertEqual(coerce({"minutes": "about 15 min"}, {"minutes": "int"})["minutes"], 15)

    def test_nested_objects_are_filled(self) -> None:
        shaped = coerce({"exit": {}}, {"exit": {"prompt": "str", "answer_key": "str"}})
        self.assertEqual(shaped["exit"], {"prompt": "", "answer_key": ""})


class TestTokenEstimate(unittest.TestCase):
    def test_estimate_scales_with_length(self) -> None:
        self.assertEqual(estimate_tokens(""), 0)
        self.assertLess(estimate_tokens("a" * 40), estimate_tokens("a" * 400))


if __name__ == "__main__":
    unittest.main()

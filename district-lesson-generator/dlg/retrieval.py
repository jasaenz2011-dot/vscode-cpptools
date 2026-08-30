"""Layer 1d -- the index and the hybrid retriever.

Two signals, fused:

* **BM25** over word tokens. Lexical matching is not a poor cousin here: a
  standard code like ``5.3(K)`` is an exact string, and exact strings are what
  BM25 is best at. Getting the right code matters more than getting a
  thematically similar paragraph.
* **Cosine similarity** over embeddings, which finds the resource that talks
  about "comparing fractions" when the unit says "rational number reasoning".

Grade and subject act as soft filters -- they reorder rather than delete, and
the retriever falls back to the unfiltered pool if a filter empties it, so a
mislabelled district file degrades results instead of returning nothing.

The store is a directory of plain files (JSON + a float32 blob). No database
server, no daemon; copy the folder and the index travels with it.
"""

from __future__ import annotations

import array
import json
import math
from collections import Counter
from dataclasses import dataclass, field, fields
from pathlib import Path
from typing import Any, Iterable, Sequence

from .models import Chunk, Document, PacingUnit, Standard
from .util import get_logger, grade_key, normalize_code, subject_key, tokenize

log = get_logger("dlg.retrieval")

INDEX_VERSION = 1


# --------------------------------------------------------------------------
# BM25
# --------------------------------------------------------------------------
class BM25:
    """Okapi BM25 over a fixed collection of documents."""

    def __init__(self, corpus_tokens: Sequence[Sequence[str]], k1: float = 1.5, b: float = 0.75) -> None:
        self.k1 = k1
        self.b = b
        self.doc_count = len(corpus_tokens)
        self.doc_len = [len(tokens) for tokens in corpus_tokens]
        self.avg_len = (sum(self.doc_len) / self.doc_count) if self.doc_count else 0.0
        self.term_freqs: list[dict[str, int]] = [dict(Counter(tokens)) for tokens in corpus_tokens]
        self.postings: dict[str, list[int]] = {}
        for index, freqs in enumerate(self.term_freqs):
            for term in freqs:
                self.postings.setdefault(term, []).append(index)
        self.idf = {
            term: math.log(1 + (self.doc_count - len(docs) + 0.5) / (len(docs) + 0.5))
            for term, docs in self.postings.items()
        }

    def scores(self, query_tokens: Sequence[str]) -> dict[int, float]:
        out: dict[int, float] = {}
        if not self.doc_count or not self.avg_len:
            return out
        for term in set(query_tokens):
            docs = self.postings.get(term)
            if not docs:
                continue
            idf = self.idf.get(term, 0.0)
            for index in docs:
                freq = self.term_freqs[index][term]
                length_norm = 1 - self.b + self.b * (self.doc_len[index] / self.avg_len)
                score = idf * (freq * (self.k1 + 1)) / (freq + self.k1 * length_norm)
                out[index] = out.get(index, 0.0) + score
        return out


# --------------------------------------------------------------------------
# Store
# --------------------------------------------------------------------------
@dataclass
class IndexMeta:
    version: int = INDEX_VERSION
    embed_backend: str = ""
    embed_dim: int = 0
    chunk_tokens: int = 0
    built_at: str = ""
    doc_count: int = 0
    chunk_count: int = 0
    fingerprint: str = ""
    warnings: list[str] = field(default_factory=list)

    def to_dict(self) -> dict[str, Any]:
        return self.__dict__.copy()

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> "IndexMeta":
        known = {f.name for f in fields(cls)}
        return cls(**{k: v for k, v in data.items() if k in known})


class Store:
    """On-disk index: documents, chunks, vectors, standards, pacing units."""

    def __init__(self, path: str | Path) -> None:
        self.path = Path(path)
        self.meta = IndexMeta()
        self.documents: list[Document] = []
        self.chunks: list[Chunk] = []
        self.vectors: list[list[float]] = []
        self.standards: list[Standard] = []
        self.units: list[PacingUnit] = []

    # -- persistence --------------------------------------------------
    def save(self) -> None:
        self.path.mkdir(parents=True, exist_ok=True)
        self.meta.doc_count = len(self.documents)
        self.meta.chunk_count = len(self.chunks)
        (self.path / "meta.json").write_text(
            json.dumps(self.meta.to_dict(), indent=2), encoding="utf-8"
        )
        (self.path / "documents.json").write_text(
            json.dumps([d.to_dict() for d in self.documents], indent=2, ensure_ascii=False),
            encoding="utf-8",
        )
        with (self.path / "chunks.jsonl").open("w", encoding="utf-8") as handle:
            for chunk in self.chunks:
                handle.write(json.dumps(chunk.to_dict(), ensure_ascii=False) + "\n")
        (self.path / "standards.json").write_text(
            json.dumps([s.to_dict() for s in self.standards], indent=2, ensure_ascii=False),
            encoding="utf-8",
        )
        (self.path / "pacing.json").write_text(
            json.dumps([u.to_dict() for u in self.units], indent=2, ensure_ascii=False),
            encoding="utf-8",
        )
        blob = array.array("f")
        for vector in self.vectors:
            blob.extend(vector)
        (self.path / "vectors.f32").write_bytes(blob.tobytes())

    @classmethod
    def load(cls, path: str | Path) -> "Store":
        store = cls(path)
        meta_file = store.path / "meta.json"
        if not meta_file.is_file():
            raise FileNotFoundError(
                f"No index at {store.path}. Run `dlg ingest` first."
            )
        store.meta = IndexMeta.from_dict(json.loads(meta_file.read_text(encoding="utf-8")))
        store.documents = [
            Document(**data)
            for data in json.loads((store.path / "documents.json").read_text(encoding="utf-8"))
        ]
        chunks_file = store.path / "chunks.jsonl"
        store.chunks = [
            Chunk.from_dict(json.loads(line))
            for line in chunks_file.read_text(encoding="utf-8").splitlines()
            if line.strip()
        ]
        store.standards = [
            Standard.from_dict(data)
            for data in json.loads((store.path / "standards.json").read_text(encoding="utf-8"))
        ]
        store.units = [
            PacingUnit.from_dict(data)
            for data in json.loads((store.path / "pacing.json").read_text(encoding="utf-8"))
        ]
        vector_file = store.path / "vectors.f32"
        dim = store.meta.embed_dim
        if vector_file.is_file() and dim:
            blob = array.array("f")
            blob.frombytes(vector_file.read_bytes())
            store.vectors = [
                list(blob[i : i + dim]) for i in range(0, len(blob), dim)
            ]
        return store

    # -- lookups ------------------------------------------------------
    def standards_by_code(self, grade: str = "", subject: str = "") -> dict[str, Standard]:
        """Code -> standard, optionally narrowed to one grade and subject.

        Codes are only unique *within* a subject: TEKS 3.4A exists in both
        grade 3 math and grade 3 science. Keying on the code alone lets one
        subject silently overwrite the other, which is how a science standard
        ends up in a math lesson. Callers that know the grade and subject
        should say so.
        """
        want_grade, want_subject = grade_key(grade), subject_key(subject)
        table: dict[str, Standard] = {}
        for standard in self.standards:
            key = normalize_code(standard.code)
            if not key:
                continue
            if want_grade and standard.grade and grade_key(standard.grade) != want_grade:
                continue
            if want_subject and standard.subject and subject_key(standard.subject) != want_subject:
                continue
            existing = table.get(key)
            # Prefer the fullest wording when a code appears more than once.
            if existing is None or len(standard.text) > len(existing.text):
                table[key] = standard
        return table

    def lookup_standards(
        self, codes: Iterable[str], grade: str = "", subject: str = ""
    ) -> tuple[list[Standard], list[str]]:
        """Resolve codes to verbatim standards. Returns (found, missing).

        Tried most specific first: this grade and subject, then this subject at
        any grade, then anything in the district.
        """
        tables = [
            self.standards_by_code(grade, subject),
            self.standards_by_code("", subject),
            self.standards_by_code(),
        ]
        found: list[Standard] = []
        missing: list[str] = []
        seen: set[str] = set()
        for code in codes:
            key = normalize_code(code)
            if not key or key in seen:
                continue
            seen.add(key)
            for table in tables:
                standard = table.get(key)
                if standard:
                    found.append(standard)
                    break
            else:
                missing.append(code)
        return found, missing

    def units_for(self, grade: str, subject: str) -> list[PacingUnit]:
        want_grade, want_subject = grade_key(grade), subject_key(subject)
        matches = [
            unit for unit in self.units
            if (not want_grade or grade_key(unit.grade) == want_grade)
            and (not want_subject or subject_key(unit.subject) == want_subject)
        ]
        return sorted(matches, key=lambda u: (u.sequence, u.unit_name))

    def known_grades(self) -> list[str]:
        grades = {grade_key(u.grade) for u in self.units if u.grade}
        grades |= {grade_key(s.grade) for s in self.standards if s.grade}
        ordered = sorted(g for g in grades if g)
        rank = {"PK": -2, "K": -1}
        return sorted(ordered, key=lambda g: rank.get(g, int(g) if g.isdigit() else 99))

    def known_subjects(self) -> list[str]:
        subjects = {subject_key(u.subject) for u in self.units if u.subject}
        subjects |= {subject_key(s.subject) for s in self.standards if s.subject}
        return sorted(s for s in subjects if s)


# --------------------------------------------------------------------------
# Retriever
# --------------------------------------------------------------------------
@dataclass
class Hit:
    chunk: Chunk
    score: float
    lexical: float = 0.0
    vector: float = 0.0
    reasons: list[str] = field(default_factory=list)


class Retriever:
    """Hybrid lexical + vector search over a :class:`Store`."""

    KIND_BOOST = {"standards": 0.10, "pacing": 0.08, "resource": 0.02, "assessment": 0.02}

    def __init__(self, store: Store, embedder: Any = None,
                 lexical_weight: float = 0.6, vector_weight: float = 0.4) -> None:
        self.store = store
        self.embedder = embedder
        self.lexical_weight = lexical_weight
        self.vector_weight = vector_weight if (embedder and store.vectors) else 0.0
        if self.vector_weight == 0.0:
            self.lexical_weight = 1.0
        self._bm25 = BM25([tokenize(chunk.text) for chunk in store.chunks])

    def search(
        self,
        query: str,
        k: int = 12,
        grade: str = "",
        subject: str = "",
        kinds: Sequence[str] | None = None,
        boost_codes: Sequence[str] | None = None,
    ) -> list[Hit]:
        chunks = self.store.chunks
        if not chunks:
            return []

        lexical = self._bm25.scores(tokenize(query))
        lexical_max = max(lexical.values(), default=0.0) or 1.0

        vector_scores: dict[int, float] = {}
        if self.vector_weight > 0.0:
            try:
                query_vector = self.embedder.embed([query])[0]
                vector_scores = self._cosine_all(query_vector)
            except Exception as exc:  # embedding backend went away mid-session
                log.warning("vector search unavailable (%s); using lexical only", exc)
                self.vector_weight = 0.0
                self.lexical_weight = 1.0

        want_grade, want_subject = grade_key(grade), subject_key(subject)
        boost_keys = {normalize_code(code) for code in (boost_codes or []) if normalize_code(code)}
        kind_filter = set(kinds or [])

        hits: list[Hit] = []
        for index, chunk in enumerate(chunks):
            if kind_filter and chunk.kind not in kind_filter:
                continue
            lex = lexical.get(index, 0.0) / lexical_max
            vec = max(0.0, vector_scores.get(index, 0.0))
            score = self.lexical_weight * lex + self.vector_weight * vec
            reasons: list[str] = []

            if want_grade and grade_key(chunk.grade) == want_grade:
                score += 0.12
                reasons.append("grade match")
            elif want_grade and chunk.grade and grade_key(chunk.grade) != want_grade:
                score -= 0.20
                reasons.append("other grade")

            if want_subject and subject_key(chunk.subject) == want_subject:
                score += 0.10
                reasons.append("subject match")
            elif want_subject and chunk.subject and subject_key(chunk.subject) != want_subject:
                score -= 0.15
                reasons.append("other subject")

            if boost_keys:
                overlap = boost_keys & {normalize_code(c) for c in chunk.codes}
                if overlap:
                    score += min(0.35, 0.12 * len(overlap))
                    reasons.append(f"cites {len(overlap)} target standard(s)")

            score += self.KIND_BOOST.get(chunk.kind, 0.0)
            if score > 0:
                hits.append(Hit(chunk=chunk, score=score, lexical=lex, vector=vec, reasons=reasons))

        hits.sort(key=lambda hit: hit.score, reverse=True)
        if not hits and kind_filter:
            return self.search(query, k, grade, subject, kinds=None, boost_codes=boost_codes)
        return hits[:k]

    def _cosine_all(self, query_vector: Sequence[float]) -> dict[int, float]:
        vectors = self.store.vectors
        if not vectors:
            return {}
        try:  # numpy is a speedup, never a requirement
            import numpy as np

            matrix = np.asarray(vectors, dtype="float32")
            query = np.asarray(query_vector, dtype="float32")
            if matrix.shape[1] != query.shape[0]:
                return {}
            sims = matrix @ query
            return {i: float(value) for i, value in enumerate(sims)}
        except ImportError:
            pass
        dim = len(query_vector)
        out: dict[int, float] = {}
        for index, vector in enumerate(vectors):
            if len(vector) != dim:
                continue
            out[index] = sum(a * b for a, b in zip(vector, query_vector))
        return out

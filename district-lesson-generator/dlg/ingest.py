"""Layer 1 entry point -- build the index from a folder of district files.

Drop the district's scope and sequence, standards export, and resource library
into ``corpus/`` (subfolders welcome) and run ``dlg ingest``. The result is a
self-contained index directory that every later step reads.

Re-running is cheap: the corpus fingerprint (paths, sizes, mtimes) plus the
embedding backend is recorded in the index, and an unchanged corpus is skipped
unless ``force=True``.
"""

from __future__ import annotations

import datetime as _dt
from dataclasses import dataclass, field
from pathlib import Path

from . import loaders, parsers
from .chunking import chunk_document
from .config import Config
from .embeddings import get_embedder
from .models import Document
from .retrieval import INDEX_VERSION, IndexMeta, Store
from .util import clean_text, get_logger, stable_id

log = get_logger("dlg.ingest")

SKIP_DIRS = {".git", ".dlg_index", "__pycache__", "node_modules", ".venv", "venv", "output"}


@dataclass
class IngestReport:
    files_seen: int = 0
    files_indexed: int = 0
    files_skipped: list[tuple[str, str]] = field(default_factory=list)
    chunks: int = 0
    standards: int = 0
    units: int = 0
    by_kind: dict[str, int] = field(default_factory=dict)
    warnings: list[str] = field(default_factory=list)
    skipped_rebuild: bool = False
    embed_backend: str = ""

    def summary(self) -> str:
        if self.skipped_rebuild:
            return (
                f"Index already current: {self.files_indexed} files, {self.chunks} chunks, "
                f"{self.standards} standards, {self.units} pacing units."
            )
        kinds = ", ".join(f"{k}={v}" for k, v in sorted(self.by_kind.items())) or "none"
        lines = [
            f"Indexed {self.files_indexed}/{self.files_seen} files ({kinds})",
            f"  chunks={self.chunks}  standards={self.standards}  pacing units={self.units}",
            f"  embeddings: {self.embed_backend}",
        ]
        for path, reason in self.files_skipped:
            lines.append(f"  skipped {path}: {reason}")
        for warning in self.warnings:
            lines.append(f"  warning: {warning}")
        return "\n".join(lines)


def corpus_files(corpus_dir: Path) -> list[Path]:
    if not corpus_dir.is_dir():
        return []
    out: list[Path] = []
    for path in sorted(corpus_dir.rglob("*")):
        if not path.is_file() or path.name.startswith("."):
            continue
        if any(part in SKIP_DIRS for part in path.parts):
            continue
        out.append(path)
    return out


def fingerprint(files: list[Path]) -> str:
    parts = [f"{path}:{path.stat().st_size}:{int(path.stat().st_mtime)}" for path in files]
    return stable_id(*parts)


def ingest(config: Config, force: bool = False) -> IngestReport:
    corpus_dir = config.corpus_path
    report = IngestReport()
    files = corpus_files(corpus_dir)
    report.files_seen = len(files)

    if not files:
        report.warnings.append(
            f"no files found in {corpus_dir} -- add your scope and sequence, standards "
            "export, and resource documents there"
        )

    embedder = get_embedder(
        config.embed_backend, config.embed_model, config.llm_base_url, config.embed_dim
    )
    current_fingerprint = fingerprint(files)

    if not force:
        existing = _try_load(config.index_path)
        if (
            existing
            and existing.meta.version == INDEX_VERSION
            and existing.meta.built_at
            and existing.meta.embed_backend == embedder.name
            and existing.meta.fingerprint == current_fingerprint
        ):
            report.skipped_rebuild = True
            report.files_indexed = existing.meta.doc_count
            report.chunks = existing.meta.chunk_count
            report.standards = len(existing.standards)
            report.units = len(existing.units)
            report.embed_backend = existing.meta.embed_backend
            return report

    store = Store(config.index_path)
    for path in files:
        if not loaders.is_supported(path):
            report.files_skipped.append((_rel(path, corpus_dir), f"unsupported type {path.suffix}"))
            continue

        loaded = loaders.load(path)
        if not loaded.text.strip() and not loaded.tables:
            reason = loaded.warnings[0] if loaded.warnings else "no extractable text"
            report.files_skipped.append((_rel(path, corpus_dir), reason))
            continue
        for warning in loaded.warnings:
            report.warnings.append(f"{_rel(path, corpus_dir)}: {warning}")

        rel = _rel(path, corpus_dir)
        kind = parsers.classify(path, loaded)
        grade, subject = parsers.infer_grade_subject(path, loaded)
        document = Document(
            doc_id=stable_id(rel),
            path=rel,
            title=clean_text(path.stem.replace("_", " ").replace("-", " ")),
            kind=kind,
            pages=len(loaded.pages),
            meta={"grade": grade, "subject": subject, **loaded.meta},
        )
        store.documents.append(document)
        report.by_kind[kind] = report.by_kind.get(kind, 0) + 1
        report.files_indexed += 1

        chunks = chunk_document(document, loaded, config.chunk_tokens, config.chunk_overlap_tokens)
        store.chunks.extend(chunks)

        if kind == "pacing":
            store.units.extend(parsers.extract_pacing_units(document, loaded))
        # Always look for standards, whatever the file was classified as. A scope
        # and sequence carries the standards' own wording in its TEKS column, and
        # resource and assessment files often embed a standards table -- skipping
        # them leaves the district with codes it cannot resolve to text.
        store.standards.extend(parsers.extract_standards(document, loaded))

    store.standards = parsers.dedupe_standards(store.standards)

    if store.chunks:
        vectors = embedder.embed([chunk.text for chunk in store.chunks])
        store.vectors = vectors
        dim = len(vectors[0]) if vectors else 0
    else:
        store.vectors, dim = [], 0

    store.meta = IndexMeta(
        version=INDEX_VERSION,
        embed_backend=embedder.name,
        embed_dim=dim,
        chunk_tokens=config.chunk_tokens,
        built_at=_dt.datetime.now().isoformat(timespec="seconds"),
        doc_count=len(store.documents),
        chunk_count=len(store.chunks),
        fingerprint=current_fingerprint,
        warnings=report.warnings[:20],
    )
    store.save()

    report.chunks = len(store.chunks)
    report.standards = len(store.standards)
    report.units = len(store.units)
    report.embed_backend = embedder.name

    if store.documents and not store.standards:
        report.warnings.append(
            "no standards were parsed -- alignment checking will be limited. Export your "
            "standards as a CSV with 'code' and 'text' columns for best results."
        )
    if store.documents and not store.units:
        report.warnings.append(
            "no scope and sequence rows were parsed -- add a CSV/XLSX with 'unit', 'weeks', "
            "and 'standards' columns so the curriculum mapper can pick the active unit."
        )
    return report


def _try_load(path: Path) -> Store | None:
    try:
        return Store.load(path)
    except Exception:
        return None


def _rel(path: Path, root: Path) -> str:
    try:
        return str(path.relative_to(root))
    except ValueError:
        return str(path)

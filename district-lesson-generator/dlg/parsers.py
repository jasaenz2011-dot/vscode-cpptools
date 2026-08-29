"""Layer 1c -- pull structured records out of district documents.

Two record types matter enough to be parsed rather than merely embedded:

``Standard``    the verbatim text of a student expectation, keyed by its code.
``PacingUnit``  one row of the scope and sequence: grade, subject, unit, window,
                and the standard codes taught in it.

Districts never agree on column names, so headers are matched against alias
sets and then by substring, and prose documents get a line-oriented fallback.
Everything extracted keeps a ``source_path`` and ``locator`` for citation.
"""

from __future__ import annotations

import re
from pathlib import Path

from .loaders import Loaded, Table
from .models import Document, PacingUnit, Standard
from .util import (
    clean_text,
    find_standard_codes,
    grade_key,
    normalize_code,
    stable_id,
    subject_key,
)

# --------------------------------------------------------------------------
# Header alias tables
# --------------------------------------------------------------------------
STANDARD_COLUMNS: dict[str, tuple[str, ...]] = {
    "code": ("code", "standard code", "teks", "teks code", "standard id", "se", "se code",
             "student expectation code", "expectation code", "standard", "id"),
    "text": ("text", "standard text", "description", "student expectation", "se text",
             "expectation", "expectation text", "statement", "knowledge and skills",
             "standard description", "breakout"),
    "grade": ("grade", "grade level", "gr", "grade band"),
    "subject": ("subject", "content area", "course", "discipline", "content"),
    "strand": ("strand", "reporting category", "domain", "category", "cluster", "topic"),
    "level": ("level", "type", "designation", "readiness", "readiness supporting",
              "readiness or supporting", "importance", "process"),
}

PACING_COLUMNS: dict[str, tuple[str, ...]] = {
    "sequence": ("unit number", "unit no", "unit num", "unit", "seq", "sequence", "order", "no"),
    "unit_name": ("unit name", "unit title", "title", "unit", "topic", "module", "bundle",
                  "instructional unit"),
    "grade": ("grade", "grade level", "gr"),
    "subject": ("subject", "content area", "course", "discipline", "content"),
    "weeks": ("weeks", "week", "timeline", "time frame", "timeframe", "pacing", "duration",
              "window", "grading period", "six weeks", "nine weeks"),
    "start_date": ("start date", "begin date", "start", "from"),
    "end_date": ("end date", "finish date", "end", "to"),
    "days": ("days", "instructional days", "number of days", "days of instruction", "class days"),
    "standard_codes": ("standards", "teks", "standard codes", "aligned standards",
                       "teks covered", "student expectations", "ses", "se", "codes"),
    "focus": ("focus", "description", "big idea", "big ideas", "concepts", "essential question",
              "essential questions", "learning outcomes", "unit overview", "overview"),
    "assessments": ("assessment", "assessments", "common assessment", "cba", "checkpoint",
                    "evidence of learning", "assessment plan"),
    "resources": ("resources", "materials", "resource", "curriculum resources", "adopted resource"),
}

_FILENAME_KIND_HINTS: tuple[tuple[str, str], ...] = (
    ("scope", "pacing"), ("sequence", "pacing"), ("pacing", "pacing"),
    ("year at a glance", "pacing"), ("yag", "pacing"), ("curriculum map", "pacing"),
    ("standard", "standards"), ("teks", "standards"), ("ccss", "standards"),
    ("essential knowledge", "standards"),
    ("assessment", "assessment"), ("cba", "assessment"), ("benchmark", "assessment"),
    ("resource", "resource"), ("material", "resource"), ("library", "resource"),
    ("intervention", "resource"), ("supplement", "resource"),
)

_SUBJECT_HINTS = ("math", "mathematics", "ela", "english", "reading", "science",
                  "social studies", "history", "writing")

_GRADE_IN_NAME_RE = re.compile(r"(?:grade[_\s-]*|gr[_\s-]*|g)(\d{1,2}|k)\b", re.IGNORECASE)
_LINE_STANDARD_RE = re.compile(
    r"^\s*(?P<code>(?:[A-Z]{1,6}\.)?\d{1,3}(?:\.\d{1,3})+(?:\s*\(?[A-Za-z]\)?)?)"
    r"\s*[).:\-–]?\s+(?P<text>\S.*)$"
)


# --------------------------------------------------------------------------
# Classification
# --------------------------------------------------------------------------
def classify(path: Path, loaded: Loaded) -> str:
    """Decide what kind of district document this is."""
    name = f"{path.parent.name} {path.stem}".lower().replace("_", " ").replace("-", " ")
    for needle, kind in _FILENAME_KIND_HINTS:
        if needle in name:
            # A table's shape overrides a filename hint when they disagree.
            table_kind = _kind_from_tables(loaded.tables)
            return table_kind or kind

    table_kind = _kind_from_tables(loaded.tables)
    if table_kind:
        return table_kind

    text = loaded.text or ""
    if not text.strip():
        return "unknown"
    code_density = len(find_standard_codes(text)) / max(1, len(text.split()) / 100)
    if code_density > 2.0:
        return "standards"
    if re.search(r"\bunit\s*\d", text, re.IGNORECASE) and re.search(
        r"\bweeks?\b|\bgrading period\b|\bsix weeks\b", text, re.IGNORECASE
    ):
        return "pacing"
    return "resource"


def _kind_from_tables(tables: list[Table]) -> str:
    for table in tables:
        mapping = _map_columns(table.header, STANDARD_COLUMNS)
        if "code" in mapping and "text" in mapping:
            return "standards"
        mapping = _map_columns(table.header, PACING_COLUMNS)
        if "unit_name" in mapping and (
            "weeks" in mapping or "standard_codes" in mapping or "days" in mapping
        ):
            return "pacing"
    return ""


def infer_grade_subject(path: Path, loaded: Loaded) -> tuple[str, str]:
    """Best-effort grade/subject for a whole file, used as a fallback for rows."""
    haystack = f"{path.parent.name} {path.stem}".lower().replace("_", " ").replace("-", " ")
    grade = ""
    match = _GRADE_IN_NAME_RE.search(haystack)
    if match:
        grade = grade_key(match.group(1))
    subject = ""
    for hint in _SUBJECT_HINTS:
        if hint in haystack:
            subject = subject_key(hint)
            break
    if not (grade and subject):
        head = " ".join((loaded.text or "").split()[:150]).lower()
        if not grade:
            match = _GRADE_IN_NAME_RE.search(head)
            if match:
                grade = grade_key(match.group(1))
        if not subject:
            for hint in _SUBJECT_HINTS:
                if hint in head:
                    subject = subject_key(hint)
                    break
    return grade, subject


# --------------------------------------------------------------------------
# Column mapping
# --------------------------------------------------------------------------
def _normalize_header(cell: str) -> str:
    return " ".join(re.sub(r"[^a-z0-9]+", " ", (cell or "").lower()).split())


def _map_columns(header: list[str], aliases: dict[str, tuple[str, ...]]) -> dict[str, int]:
    """Map logical field -> column index. Exact alias wins over substring."""
    normalized = [_normalize_header(cell) for cell in header]
    mapping: dict[str, int] = {}
    used: set[int] = set()

    for field, options in aliases.items():
        for option in options:
            for index, cell in enumerate(normalized):
                if index in used or not cell:
                    continue
                if cell == option:
                    mapping[field] = index
                    used.add(index)
                    break
            if field in mapping:
                break

    for field, options in aliases.items():
        if field in mapping:
            continue
        for option in options:
            for index, cell in enumerate(normalized):
                if index in used or not cell:
                    continue
                if option in cell or cell in option:
                    mapping[field] = index
                    used.add(index)
                    break
            if field in mapping:
                break
    return mapping


def _cell(row: list[str], mapping: dict[str, int], field: str) -> str:
    index = mapping.get(field)
    if index is None or index >= len(row):
        return ""
    return clean_text(row[index])


# --------------------------------------------------------------------------
# Standards
# --------------------------------------------------------------------------
def extract_standards(doc: Document, loaded: Loaded) -> list[Standard]:
    """Extract standards from tables first, then from prose."""
    default_grade = str(doc.meta.get("grade", ""))
    default_subject = str(doc.meta.get("subject", ""))
    out: list[Standard] = []

    for table in loaded.tables:
        mapping = _map_columns(table.header, STANDARD_COLUMNS)
        if "code" not in mapping or "text" not in mapping:
            continue
        for row_no, row in enumerate(table.rows[1:], start=2):
            code = _cell(row, mapping, "code")
            text = _cell(row, mapping, "text")
            if not code or not text or not normalize_code(code):
                continue
            out.append(
                Standard(
                    code=code.strip(),
                    text=text.strip(),
                    grade=grade_key(_cell(row, mapping, "grade")) or default_grade,
                    subject=subject_key(_cell(row, mapping, "subject")) or default_subject,
                    strand=_cell(row, mapping, "strand"),
                    level=_cell(row, mapping, "level"),
                    source_path=doc.path,
                    locator=f"{table.name}, row {row_no}",
                )
            )

    if not out:
        out.extend(_standards_from_prose(doc, loaded, default_grade, default_subject))
    return dedupe_standards(out)


def _standards_from_prose(
    doc: Document, loaded: Loaded, default_grade: str, default_subject: str
) -> list[Standard]:
    sources: list[tuple[str, str]] = (
        [(f"p. {n}", page) for n, page in enumerate(loaded.pages, start=1)]
        if loaded.pages
        else [("", loaded.text or "")]
    )
    out: list[Standard] = []
    for locator, text in sources:
        current: Standard | None = None
        for line in (text or "").split("\n"):
            stripped = line.strip()
            if not stripped:
                current = None
                continue
            match = _LINE_STANDARD_RE.match(stripped)
            if match and len(match.group("text").split()) >= 3:
                current = Standard(
                    code=match.group("code").strip(),
                    text=match.group("text").strip(),
                    grade=default_grade,
                    subject=default_subject,
                    source_path=doc.path,
                    locator=locator,
                )
                out.append(current)
            elif current is not None and len(current.text.split()) < 90 and stripped[0].islower():
                # Wrapped continuation of the previous expectation.
                current.text = f"{current.text} {stripped}"
    return out


def dedupe_standards(standards: list[Standard]) -> list[Standard]:
    """Keep one record per (code, grade, subject) -- the longest text wins."""
    best: dict[tuple[str, str, str], Standard] = {}
    for standard in standards:
        key = (normalize_code(standard.code), standard.grade, standard.subject)
        existing = best.get(key)
        if existing is None or len(standard.text) > len(existing.text):
            best[key] = standard
    return list(best.values())


# --------------------------------------------------------------------------
# Pacing / scope and sequence
# --------------------------------------------------------------------------
def extract_pacing_units(doc: Document, loaded: Loaded) -> list[PacingUnit]:
    default_grade = str(doc.meta.get("grade", ""))
    default_subject = str(doc.meta.get("subject", ""))
    out: list[PacingUnit] = []

    for table in loaded.tables:
        mapping = _map_columns(table.header, PACING_COLUMNS)
        if "unit_name" not in mapping:
            continue
        for row_no, row in enumerate(table.rows[1:], start=2):
            unit_name = _cell(row, mapping, "unit_name")
            if not unit_name:
                continue
            codes = _split_codes(_cell(row, mapping, "standard_codes"))
            if not codes:
                codes = find_standard_codes(" ".join(row))
            grade = grade_key(_cell(row, mapping, "grade")) or default_grade
            subject = subject_key(_cell(row, mapping, "subject")) or default_subject
            out.append(
                PacingUnit(
                    unit_id=stable_id(doc.path, table.name, row_no, unit_name),
                    grade=grade,
                    subject=subject,
                    unit_name=unit_name,
                    sequence=_to_int(_cell(row, mapping, "sequence")) or (len(out) + 1),
                    weeks=_cell(row, mapping, "weeks"),
                    start_date=_cell(row, mapping, "start_date"),
                    end_date=_cell(row, mapping, "end_date"),
                    days=_to_int(_cell(row, mapping, "days")),
                    standard_codes=codes,
                    focus=_cell(row, mapping, "focus"),
                    assessments=_cell(row, mapping, "assessments"),
                    resources=_cell(row, mapping, "resources"),
                    source_path=doc.path,
                    locator=f"{table.name}, row {row_no}",
                )
            )
    return out


def _split_codes(value: str) -> list[str]:
    if not value:
        return []
    parts = re.split(r"[,;/\n]+|\s{2,}", value)
    codes: list[str] = []
    seen: set[str] = set()
    for part in parts:
        for code in find_standard_codes(part) or ([part.strip()] if part.strip() else []):
            key = normalize_code(code)
            if key and key not in seen:
                seen.add(key)
                codes.append(code.strip())
    return codes


def _to_int(value: str) -> int:
    match = re.search(r"\d+", value or "")
    return int(match.group(0)) if match else 0

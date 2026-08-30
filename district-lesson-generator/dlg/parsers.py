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
    STRICT_CODE_RE,
    clean_text,
    find_standard_codes,
    grade_key,
    normalize_code,
    stable_id,
    subject_key,
    truncate_words,
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
    "unit_name": ("topic of study", "unit name", "unit title", "title", "unit", "topic", "module",
                  "bundle", "instructional unit"),
    "grade": ("grade", "grade level", "gr"),
    "subject": ("subject", "content area", "course", "discipline", "content"),
    # "duration" belongs to days, not weeks: districts that publish a Duration column
    # overwhelmingly fill it with "8 days", and _to_int reads the number either way.
    "days": ("days", "duration", "instructional days", "number of days", "days of instruction",
             "class days"),
    "weeks": ("weeks", "week", "timeline", "time frame", "timeframe", "pacing",
              "window", "grading period", "six weeks", "nine weeks"),
    "start_date": ("start date", "begin date", "start", "from"),
    "end_date": ("end date", "finish date", "end", "to"),
    "standard_codes": ("teks", "standards", "standard codes", "aligned standards",
                       "teks covered", "student expectations", "ses", "se", "codes"),
    "focus": ("focus", "description", "big idea", "big ideas", "concepts", "essential question",
              "essential questions", "learning outcomes", "unit overview", "overview"),
    "assessments": ("assessment", "assessments", "common assessment", "cba", "checkpoint",
                    "evidence of learning", "assessment plan"),
    "resources": ("recommended manipulatives", "manipulatives", "resources", "materials",
                  "resource", "curriculum resources", "adopted resource"),
    "vocabulary": ("academic vocabulary", "vocabulary", "key vocabulary", "terms"),
}

# How far down a sheet to look for the real header row. District spreadsheets
# routinely open with a title banner, a copyright line, and a blank row before
# the columns start, so assuming row 0 finds nothing at all.
MAX_HEADER_SCAN = 12

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

# Districts name files every possible way round: "grade5", "Grade 5", "5th Grade",
# "Kinder", "Kindergarten", "Algebra I (8th-VT)". All of these have to land on a
# grade, or every unit in the file indexes with no grade and never matches a request.
_GRADE_PATTERNS = (
    re.compile(r"\bkinder(?:garten)?\b", re.IGNORECASE),                  # -> K
    re.compile(r"\bpre[-\s]?k\b", re.IGNORECASE),                         # -> PK
    re.compile(r"(\d{1,2})\s*(?:st|nd|rd|th)\b", re.IGNORECASE),          # 5th Grade
    re.compile(r"\bgrades?[_\s-]*(\d{1,2}|k)\b", re.IGNORECASE),          # Grade 5 / grade_5
    re.compile(r"\bgr[_\s-]*(\d{1,2}|k)\b", re.IGNORECASE),               # gr5
    re.compile(r"\bg(\d{1,2})\b", re.IGNORECASE),                         # g5
)
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
    """Score both readings of every sheet and take the strongest.

    A scope-and-sequence sheet can look weakly like a standards table, so
    returning on the first match picks whichever was checked first rather than
    whichever fits better.
    """
    best_kind, best_score = "", 0
    for table in tables:
        index, mapping = locate_header(table, STANDARD_COLUMNS, ("code", "text"))
        if index >= 0 and len(mapping) > best_score:
            best_kind, best_score = "standards", len(mapping)

        index, mapping = locate_header(table, PACING_COLUMNS, ("unit_name",))
        if index >= 0 and (
            "weeks" in mapping or "standard_codes" in mapping or "days" in mapping
        ):
            if len(mapping) > best_score:
                best_kind, best_score = "pacing", len(mapping)
    return best_kind


def infer_grade_subject(path: Path, loaded: Loaded) -> tuple[str, str]:
    """Best-effort grade/subject for a whole file, used as a fallback for rows."""
    haystack = f"{path.parent.name} {path.stem}".lower().replace("_", " ").replace("-", " ")
    grade = _grade_from_text(haystack)
    subject = ""
    for hint in _SUBJECT_HINTS:
        if hint in haystack:
            subject = subject_key(hint)
            break
    if not (grade and subject):
        head = " ".join((loaded.text or "").split()[:150]).lower()
        grade = grade or _grade_from_text(head)
        if not subject:
            for hint in _SUBJECT_HINTS:
                if hint in head:
                    subject = subject_key(hint)
                    break
    return grade, subject


def _grade_from_text(text: str) -> str:
    for index, pattern in enumerate(_GRADE_PATTERNS):
        match = pattern.search(text)
        if not match:
            continue
        if index == 0:
            return "K"
        if index == 1:
            return "PK"
        return grade_key(match.group(1))
    return ""


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


def locate_header(
    table: Table, aliases: dict[str, tuple[str, ...]], required: tuple[str, ...]
) -> tuple[int, dict[str, int]]:
    """Find the row that is actually the header, and its column mapping.

    Returns ``(-1, {})`` when no row in range carries the required fields. Real
    district exports put a title, a copyright line, and sometimes a merged
    banner above the columns, so the header is rarely row 0.
    """
    best_index, best_mapping, best_score = -1, {}, 0
    for index, row in enumerate(table.rows[:MAX_HEADER_SCAN]):
        if not _is_header_row(row):
            continue
        mapping = _map_columns(row, aliases)
        if not all(field in mapping for field in required):
            continue
        # Prefer the richest header, and on a tie the earliest one.
        if len(mapping) > best_score:
            best_index, best_mapping, best_score = index, mapping, len(mapping)
    return best_index, best_mapping


def _is_header_row(row: list[str]) -> bool:
    """Reject data rows that alias matching would otherwise mistake for headers.

    Substring matching is permissive by design -- it has to be, to cope with
    "Student Expectation Code" -- which means a row of prose can accidentally
    satisfy any alias set. Column headings are short labels, they do not run to
    paragraphs, and they never contain a standard code.
    """
    cells = [cell.strip() for cell in row if cell and cell.strip()]
    if len(cells) < 2:
        return False
    for cell in cells:
        if len(cell) > 60 or len(cell.split()) > 6:
            return False
        if STRICT_CODE_RE.search(cell):
            return False
    return True


def split_code_text_pairs(cell: str) -> list[tuple[str, str]]:
    """Split a packed standards cell into ``(code, text)`` pairs.

    District scope-and-sequence sheets put several standards in one cell::

        5.3B Multiply with fluency a three-digit number by a two-digit number...
        5.3C Solve with proficiency for quotients of up to a four-digit dividend...

    The strict code pattern is used deliberately, so a decimal inside the
    standard's own text ("to the hundredths") never starts a new record.
    """
    cell = (cell or "").strip()
    if not cell:
        return []
    matches = list(STRICT_CODE_RE.finditer(cell))
    pairs: list[tuple[str, str]] = []
    for position, match in enumerate(matches):
        start = match.end()
        end = matches[position + 1].start() if position + 1 < len(matches) else len(cell)
        text = " ".join(cell[start:end].split()).strip(" .;:-–—")
        if len(text.split()) >= 3:
            pairs.append((match.group(0).strip(), text))
    return pairs


def _cell(row: list[str], mapping: dict[str, int], field: str) -> str:
    index = mapping.get(field)
    if index is None or index >= len(row):
        return ""
    return clean_text(row[index])


def _sequence_from_cell(value: str, fallback: int) -> int:
    """Only a cell that is genuinely a number is a unit number.

    "First 8 Days" is a unit name, not unit 8 -- reading a digit out of it
    silently reorders the whole year.
    """
    cleaned = (value or "").strip()
    if not cleaned:
        return fallback
    cleaned = re.sub(r"^(?:unit|module)\s*", "", cleaned, flags=re.IGNORECASE).strip()
    cleaned = re.sub(r"\.0+$", "", cleaned)          # xlsx numerics arrive as "3.0"
    if cleaned.isdigit():
        return int(cleaned)
    # A named block such as "First 8 Days" precedes unit 1; giving it a
    # positional number would collide with the real unit 1.
    return 0


# --------------------------------------------------------------------------
# Standards
# --------------------------------------------------------------------------
def extract_standards(doc: Document, loaded: Loaded) -> list[Standard]:
    """Extract standards from tables first, then from prose."""
    default_grade = str(doc.meta.get("grade", ""))
    default_subject = str(doc.meta.get("subject", ""))
    out: list[Standard] = []

    for table in loaded.tables:
        header_index, mapping = locate_header(table, STANDARD_COLUMNS, ("code", "text"))
        if header_index < 0:
            continue
        for row_no, row in enumerate(table.rows[header_index + 1 :], start=header_index + 2):
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

    # A scope and sequence usually carries the standards' own wording inside its
    # TEKS column. That is the district's text, so mine it rather than leaving
    # the codes unresolved.
    out.extend(_standards_from_code_column(doc, loaded, default_grade, default_subject))

    # A published TEKS document states the standards authoritatively but never
    # writes their codes; those have to be composed from its structure.
    if looks_like_tea_document(loaded.text):
        out.extend(standards_from_tea_document(doc, loaded.text, default_subject))

    if not out:
        out.extend(_standards_from_prose(doc, loaded, default_grade, default_subject))
    return dedupe_standards(out)


def _standards_from_code_column(
    doc: Document, loaded: Loaded, default_grade: str, default_subject: str
) -> list[Standard]:
    """Pull ``(code, text)`` pairs out of a pacing sheet's standards column."""
    out: list[Standard] = []
    for table in loaded.tables:
        header_index, mapping = locate_header(table, PACING_COLUMNS, ("standard_codes",))
        if header_index < 0:
            continue
        for row_no, row in enumerate(table.rows[header_index + 1 :], start=header_index + 2):
            cell = _cell(row, mapping, "standard_codes")
            grade = grade_key(_cell(row, mapping, "grade")) or default_grade
            subject = subject_key(_cell(row, mapping, "subject")) or default_subject
            for code, text in split_code_text_pairs(cell):
                out.append(
                    Standard(
                        code=code,
                        text=text,
                        grade=grade,
                        subject=subject,
                        source_path=doc.path,
                        locator=f"{table.name}, row {row_no}",
                    )
                )
    return out


# --- Official TEA-style standards documents -------------------------------
# The published TEKS are hierarchical prose in which the code is never written
# out. "(A) apply mathematics to problems..." under "(1) Mathematical process
# standards" in "Grade 5 / Mathematics" *is* TEKS 5.1A. The code has to be
# composed from the document's structure, which is why a plain code scan finds
# nothing in the state's own file.
_TEA_GRADE_RE = re.compile(r"^Grade\s+(\d{1,2})\b|^(Kindergarten)\b", re.IGNORECASE)
_TEA_KNOWLEDGE_RE = re.compile(r"^\((\d{1,2})\)\s+(.*)")
_TEA_EXPECTATION_RE = re.compile(r"^\(([A-Z])\)\s+(.*)")
_TEA_SUBSECTION_RE = re.compile(r"^\([a-z]\)\s")
_TEA_SUBJECT_HEADINGS = {
    "mathematics": "math",
    "science": "science",
    "social studies": "social studies",
    "english language arts and reading": "ela",
    "english language arts": "ela",
}


def looks_like_tea_document(text: str) -> bool:
    head = (text or "")[:4000].lower()
    return "the student is expected to" in head and "knowledge and skills" in head


def standards_from_tea_document(
    doc: Document, text: str, default_subject: str = ""
) -> list[Standard]:
    """Compose standards from a published TEKS document's hierarchy."""
    grade = ""
    subject = default_subject
    knowledge = ""
    strand = ""
    out: list[Standard] = []
    current: Standard | None = None

    for raw in (text or "").split("\n"):
        line = raw.strip()
        if not line:
            continue

        grade_match = _TEA_GRADE_RE.match(line)
        if grade_match and len(line.split()) <= 3:
            grade = "K" if grade_match.group(2) else grade_key(grade_match.group(1))
            knowledge, current = "", None
            continue

        heading = _TEA_SUBJECT_HEADINGS.get(line.lower().strip(" .:"))
        if heading:
            subject, knowledge, current = heading, "", None
            continue

        if _TEA_SUBSECTION_RE.match(line):     # "(b) Knowledge and skills."
            current = None
            continue

        knowledge_match = _TEA_KNOWLEDGE_RE.match(line)
        if knowledge_match:
            knowledge = knowledge_match.group(1)
            strand = " ".join(knowledge_match.group(2).split())
            current = None
            continue

        expectation = _TEA_EXPECTATION_RE.match(line)
        if expectation and grade and knowledge:
            current = Standard(
                code=f"{grade}.{knowledge}{expectation.group(1)}",
                text=" ".join(expectation.group(2).split()),
                grade=grade,
                subject=subject,
                strand=truncate_words(strand, 12),
                source_path=doc.path,
                locator="",
            )
            out.append(current)
            continue

        # A wrapped continuation of the expectation currently being read.
        if current is not None:
            current.text = " ".join(f"{current.text} {line}".split())

    for standard in out:
        # Items in the published list end "...; and" / "...; or" where they run
        # into the next expectation. That is list punctuation, not the standard.
        standard.text = re.sub(
            r"[;,]?\s+(?:and|or)$", "", standard.text.rstrip(" ;.")
        ).rstrip(" ;.,")
    return [s for s in out if len(s.text.split()) >= 3]


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
        header_index, mapping = locate_header(table, PACING_COLUMNS, ("unit_name",))
        if header_index < 0:
            continue
        for row_no, row in enumerate(table.rows[header_index + 1 :], start=header_index + 2):
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
                    unit_name=" ".join(unit_name.split()),
                    sequence=_sequence_from_cell(_cell(row, mapping, "sequence"), len(out) + 1),
                    weeks=_cell(row, mapping, "weeks"),
                    start_date=_cell(row, mapping, "start_date"),
                    end_date=_cell(row, mapping, "end_date"),
                    days=_to_int(_cell(row, mapping, "days")),
                    standard_codes=codes,
                    focus=_cell(row, mapping, "focus"),
                    assessments=_cell(row, mapping, "assessments"),
                    resources=_cell(row, mapping, "resources"),
                    vocabulary=_cell(row, mapping, "vocabulary"),
                    source_path=doc.path,
                    locator=f"{table.name}, row {row_no}",
                )
            )
    return out


def _split_codes(value: str) -> list[str]:
    """Codes listed in a standards cell.

    A district's TEKS column often holds the standards' full text as well as
    their codes, so anything that is not code-shaped must be dropped -- treating
    a leftover fragment as a code puts "of 10" in the lesson's standards list.
    """
    if not value:
        return []
    codes: list[str] = []
    seen: set[str] = set()
    for code in find_standard_codes(value):
        key = normalize_code(code)
        if key and key not in seen:
            seen.add(key)
            codes.append(code.strip())
    if codes:
        return codes

    # Nothing matched the code shape: accept only short, digit-bearing tokens
    # (a district using a private code scheme), never sentences.
    for part in re.split(r"[,;/\n]+|\s{2,}", value):
        part = part.strip()
        key = normalize_code(part)
        if part and len(part) <= 12 and any(ch.isdigit() for ch in part) and key not in seen:
            seen.add(key)
            codes.append(part)
    return codes


def _to_int(value: str) -> int:
    match = re.search(r"\d+", value or "")
    return int(match.group(0)) if match else 0

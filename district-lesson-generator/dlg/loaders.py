"""Layer 1a -- read district files into text and tables, using only stdlib.

Supported out of the box: ``.txt`` ``.md`` ``.csv`` ``.tsv`` ``.json`` ``.html``
``.docx`` ``.xlsx`` ``.pdf``.

Tabular sources keep their rows (``Loaded.tables``) as well as a flattened text
rendering, because a scope and sequence is only trustworthy when it is read as
records, not as prose. :mod:`dlg.parsers` consumes those rows.
"""

from __future__ import annotations

import csv
import io
import json
import re
import zipfile
from dataclasses import dataclass, field
from html.parser import HTMLParser
from pathlib import Path
from typing import Any

from . import pdftext
from .util import clean_text, get_logger

log = get_logger("dlg.loaders")

TEXT_SUFFIXES = {".txt", ".md", ".markdown", ".rst", ".text"}
TABLE_SUFFIXES = {".csv", ".tsv"}
SUPPORTED_SUFFIXES = TEXT_SUFFIXES | TABLE_SUFFIXES | {
    ".json", ".html", ".htm", ".docx", ".xlsx", ".xlsm", ".pdf",
}

_NS_W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
_NS_S = "{http://schemas.openxmlformats.org/spreadsheetml/2006/main}"
_NS_REL = "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}"


@dataclass
class Table:
    name: str
    rows: list[list[str]] = field(default_factory=list)

    @property
    def header(self) -> list[str]:
        return self.rows[0] if self.rows else []

    def records(self) -> list[dict[str, str]]:
        """Rows as dicts keyed by the header row (blank headers get positions)."""
        if len(self.rows) < 2:
            return []
        header = [h.strip() or f"col{i}" for i, h in enumerate(self.header)]
        out: list[dict[str, str]] = []
        for row in self.rows[1:]:
            if not any(cell.strip() for cell in row):
                continue
            record = {header[i]: (row[i] if i < len(row) else "") for i in range(len(header))}
            out.append(record)
        return out

    def to_text(self) -> str:
        return "\n".join(" | ".join(cell.strip() for cell in row) for row in self.rows)


@dataclass
class Loaded:
    text: str = ""
    pages: list[str] = field(default_factory=list)
    tables: list[Table] = field(default_factory=list)
    meta: dict[str, Any] = field(default_factory=dict)
    warnings: list[str] = field(default_factory=list)


def is_supported(path: Path) -> bool:
    return path.suffix.lower() in SUPPORTED_SUFFIXES


def load(path: Path) -> Loaded:
    """Read one file. Never raises for content problems -- reports warnings."""
    suffix = path.suffix.lower()
    try:
        if suffix in TEXT_SUFFIXES:
            return _load_text(path)
        if suffix in TABLE_SUFFIXES:
            return _load_delimited(path)
        if suffix == ".json":
            return _load_json(path)
        if suffix in {".html", ".htm"}:
            return _load_html(path)
        if suffix == ".docx":
            return _load_docx(path)
        if suffix in {".xlsx", ".xlsm"}:
            return _load_xlsx(path)
        if suffix == ".pdf":
            return _load_pdf(path)
    except Exception as exc:  # pragma: no cover - defensive, per-file isolation
        log.warning("could not read %s: %s", path, exc)
        return Loaded(warnings=[f"unreadable: {exc}"])
    return Loaded(warnings=[f"unsupported file type: {suffix}"])


# --------------------------------------------------------------------------
def _read_bytes(path: Path) -> bytes:
    return path.read_bytes()


def _decode_text(raw: bytes) -> str:
    for encoding in ("utf-8-sig", "utf-8", "cp1252", "latin-1"):
        try:
            return raw.decode(encoding)
        except UnicodeDecodeError:
            continue
    return raw.decode("utf-8", errors="replace")


def _load_text(path: Path) -> Loaded:
    return Loaded(text=clean_text(_decode_text(_read_bytes(path))))


def _load_delimited(path: Path) -> Loaded:
    raw = _decode_text(_read_bytes(path))
    delimiter = "\t" if path.suffix.lower() == ".tsv" else _sniff_delimiter(raw)
    rows = [list(row) for row in csv.reader(io.StringIO(raw), delimiter=delimiter)]
    rows = [row for row in rows if any(cell.strip() for cell in row)]
    table = Table(name=path.stem, rows=rows)
    return Loaded(text=clean_text(table.to_text()), tables=[table])


def _sniff_delimiter(sample: str) -> str:
    head = "\n".join(sample.splitlines()[:10])
    try:
        return csv.Sniffer().sniff(head, delimiters=",;\t|").delimiter
    except csv.Error:
        return ","


def _load_json(path: Path) -> Loaded:
    data = json.loads(_decode_text(_read_bytes(path)))
    tables: list[Table] = []
    if isinstance(data, list) and data and all(isinstance(item, dict) for item in data):
        header = list({key: None for item in data for key in item}.keys())
        rows = [header] + [[str(item.get(key, "")) for key in header] for item in data]
        tables.append(Table(name=path.stem, rows=rows))
    text = tables[0].to_text() if tables else json.dumps(data, indent=2, ensure_ascii=False)
    return Loaded(text=clean_text(text), tables=tables)


class _HTMLText(HTMLParser):
    SKIP = {"script", "style", "head"}
    BLOCK = {"p", "div", "br", "li", "tr", "h1", "h2", "h3", "h4", "h5", "h6", "table"}

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.parts: list[str] = []
        self._skip_depth = 0

    def handle_starttag(self, tag: str, attrs: Any) -> None:
        if tag in self.SKIP:
            self._skip_depth += 1
        elif tag in self.BLOCK:
            self.parts.append("\n")
        elif tag in {"td", "th"}:
            self.parts.append(" | ")

    def handle_endtag(self, tag: str) -> None:
        if tag in self.SKIP and self._skip_depth:
            self._skip_depth -= 1
        elif tag in self.BLOCK:
            self.parts.append("\n")

    def handle_data(self, data: str) -> None:
        if not self._skip_depth and data.strip():
            self.parts.append(data)


def _load_html(path: Path) -> Loaded:
    parser = _HTMLText()
    parser.feed(_decode_text(_read_bytes(path)))
    return Loaded(text=clean_text("".join(parser.parts)))


def _load_docx(path: Path) -> Loaded:
    import xml.etree.ElementTree as ET

    with zipfile.ZipFile(path) as archive:
        xml = archive.read("word/document.xml")
    root = ET.fromstring(xml)
    body = root.find(f"{_NS_W}body")
    if body is None:
        return Loaded(warnings=["docx has no body"])

    blocks: list[str] = []
    tables: list[Table] = []
    for element in body:
        if element.tag == f"{_NS_W}p":
            text = _docx_paragraph_text(element)
            if text.strip():
                blocks.append(text)
        elif element.tag == f"{_NS_W}tbl":
            rows: list[list[str]] = []
            for row in element.findall(f"{_NS_W}tr"):
                cells = [
                    " ".join(
                        _docx_paragraph_text(p)
                        for p in cell.findall(f"{_NS_W}p")
                    ).strip()
                    for cell in row.findall(f"{_NS_W}tc")
                ]
                if any(cells):
                    rows.append(cells)
            if rows:
                table = Table(name=f"{path.stem}-table{len(tables) + 1}", rows=rows)
                tables.append(table)
                blocks.append(table.to_text())
    return Loaded(text=clean_text("\n\n".join(blocks)), tables=tables)


def _docx_paragraph_text(paragraph: Any) -> str:
    parts: list[str] = []
    for node in paragraph.iter():
        if node.tag == f"{_NS_W}t" and node.text:
            parts.append(node.text)
        elif node.tag == f"{_NS_W}tab":
            parts.append("\t")
        elif node.tag in (f"{_NS_W}br", f"{_NS_W}cr"):
            parts.append("\n")
    return "".join(parts)


def _load_xlsx(path: Path) -> Loaded:
    import xml.etree.ElementTree as ET

    with zipfile.ZipFile(path) as archive:
        names = set(archive.namelist())
        shared: list[str] = []
        if "xl/sharedStrings.xml" in names:
            shared_root = ET.fromstring(archive.read("xl/sharedStrings.xml"))
            for si in shared_root.findall(f"{_NS_S}si"):
                shared.append("".join(t.text or "" for t in si.iter(f"{_NS_S}t")))

        sheets = _xlsx_sheet_map(archive, names)
        tables: list[Table] = []
        for sheet_name, target in sheets:
            if target not in names:
                continue
            rows = _xlsx_rows(ET.fromstring(archive.read(target)), shared)
            if rows:
                tables.append(Table(name=sheet_name, rows=rows))

    text = "\n\n".join(f"## {t.name}\n{t.to_text()}" for t in tables)
    return Loaded(text=clean_text(text), tables=tables)


def _xlsx_sheet_map(archive: zipfile.ZipFile, names: set[str]) -> list[tuple[str, str]]:
    import xml.etree.ElementTree as ET

    if "xl/workbook.xml" not in names:
        return [(n.rsplit("/", 1)[-1], n) for n in sorted(names) if n.startswith("xl/worksheets/")]

    rels: dict[str, str] = {}
    if "xl/_rels/workbook.xml.rels" in names:
        rel_root = ET.fromstring(archive.read("xl/_rels/workbook.xml.rels"))
        for rel in rel_root:
            rid = rel.attrib.get("Id", "")
            target = rel.attrib.get("Target", "")
            if target.startswith("/"):
                target = target[1:]
            elif not target.startswith("xl/"):
                target = f"xl/{target}"
            rels[rid] = target

    workbook = ET.fromstring(archive.read("xl/workbook.xml"))
    out: list[tuple[str, str]] = []
    for sheet in workbook.iter(f"{_NS_S}sheet"):
        name = sheet.attrib.get("name", "sheet")
        rid = sheet.attrib.get(f"{_NS_REL}id", "")
        target = rels.get(rid)
        if target:
            out.append((name, target))
    return out


def _xlsx_rows(sheet_root: Any, shared: list[str]) -> list[list[str]]:
    rows: list[list[str]] = []
    for row in sheet_root.iter(f"{_NS_S}row"):
        cells: dict[int, str] = {}
        for cell in row.findall(f"{_NS_S}c"):
            index = _column_index(cell.attrib.get("r", ""))
            cell_type = cell.attrib.get("t", "")
            if cell_type == "inlineStr":
                value = "".join(t.text or "" for t in cell.iter(f"{_NS_S}t"))
            else:
                v = cell.find(f"{_NS_S}v")
                value = v.text or "" if v is not None else ""
                if cell_type == "s" and value.isdigit():
                    idx = int(value)
                    value = shared[idx] if idx < len(shared) else ""
            if value:
                cells[index] = value.strip()
        if cells:
            width = max(cells) + 1
            rows.append([cells.get(i, "") for i in range(width)])
    # Normalize ragged rows so header alignment holds.
    width = max((len(r) for r in rows), default=0)
    return [r + [""] * (width - len(r)) for r in rows]


def _column_index(ref: str) -> int:
    letters = re.match(r"[A-Za-z]+", ref or "")
    if not letters:
        return 0
    index = 0
    for char in letters.group(0).upper():
        index = index * 26 + (ord(char) - 64)
    return index - 1


def _load_pdf(path: Path) -> Loaded:
    result = pdftext.extract(_read_bytes(path))
    warnings: list[str] = []
    if not result.text.strip():
        warnings.append(
            "no extractable text (likely a scanned PDF) -- export it as CSV/DOCX, "
            "or install pypdf and an OCR step"
        )
    elif not result.usable:
        warnings.append(
            f"low-confidence text extraction ({result.confidence:.0%}) with the built-in "
            "PDF reader -- install pypdf for better results"
        )
    return Loaded(
        text=clean_text(result.text),
        pages=[clean_text(p) for p in result.pages],
        meta={"pdf_engine": result.engine, "pdf_confidence": round(result.confidence, 3)},
        warnings=warnings,
    )

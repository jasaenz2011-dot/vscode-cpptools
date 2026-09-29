"""Best-effort PDF text extraction with no third-party dependencies.

District pacing guides arrive as PDFs, and a teacher should not have to install
a toolchain before the system will read them. If ``pypdf`` or ``pdfplumber`` is
available we use it, because they handle far more of the format. Otherwise this
module parses the file directly: it walks the object table, inflates content
streams with :mod:`zlib`, and replays the text-showing operators.

What this fallback handles: uncompressed and Flate-compressed content streams,
cross-reference streams, literal and hex strings, ``Tj``/``TJ``/``'``/``"``,
and page ordering via the page tree.

What it does not handle: scanned images (no OCR), encrypted files, and CID
fonts with custom encodings. Those return a low ``confidence`` score, and
:func:`extract` reports it so ingestion can warn instead of silently indexing
mojibake.
"""

from __future__ import annotations

import re
import zlib
from dataclasses import dataclass, field

_OBJ_RE = re.compile(rb"(\d+)\s+(\d+)\s+obj\b(.*?)\bendobj\b", re.DOTALL)
_STREAM_RE = re.compile(rb"stream\r?\n?(.*?)\r?\n?endstream", re.DOTALL)
_KIDS_RE = re.compile(rb"/Kids\s*\[(.*?)\]", re.DOTALL)
_REF_RE = re.compile(rb"(\d+)\s+\d+\s+R")
_CONTENTS_RE = re.compile(rb"/Contents\s+(?:(\d+)\s+\d+\s+R|\[(.*?)\])", re.DOTALL)

# Printable-ratio below this means we probably decoded a CID font as Latin-1.
_MIN_CONFIDENCE = 0.55


@dataclass
class PdfExtraction:
    text: str = ""
    pages: list[str] = field(default_factory=list)
    page_count: int = 0
    confidence: float = 0.0
    engine: str = "builtin"

    @property
    def usable(self) -> bool:
        return bool(self.text.strip()) and self.confidence >= _MIN_CONFIDENCE


def extract(data: bytes) -> PdfExtraction:
    """Extract text from PDF bytes, preferring a real library when installed."""
    for loader in (_extract_with_pypdf, _extract_with_pdfplumber):
        result = loader(data)
        if result is not None:
            return result
    return _extract_builtin(data)


# --------------------------------------------------------------------------
# Optional accelerators
# --------------------------------------------------------------------------
def _extract_with_pypdf(data: bytes) -> PdfExtraction | None:
    try:
        import io

        from pypdf import PdfReader  # type: ignore
    except Exception:
        return None
    try:
        reader = PdfReader(io.BytesIO(data))
        pages = [(page.extract_text() or "") for page in reader.pages]
    except Exception:
        return None
    text = "\n\n".join(pages)
    return PdfExtraction(text, pages, len(pages), _confidence(text), "pypdf")


def _extract_with_pdfplumber(data: bytes) -> PdfExtraction | None:
    try:
        import io

        import pdfplumber  # type: ignore
    except Exception:
        return None
    try:
        with pdfplumber.open(io.BytesIO(data)) as pdf:
            pages = [(page.extract_text() or "") for page in pdf.pages]
    except Exception:
        return None
    text = "\n\n".join(pages)
    return PdfExtraction(text, pages, len(pages), _confidence(text), "pdfplumber")


# --------------------------------------------------------------------------
# Built-in parser
# --------------------------------------------------------------------------
def _extract_builtin(data: bytes) -> PdfExtraction:
    objects = _parse_objects(data)
    page_numbers = _page_order(objects)

    pages: list[str] = []
    for objnum in page_numbers:
        body, _ = objects[objnum]
        content = b"".join(
            _stream_bytes(objects, ref) for ref in _content_refs(body)
        )
        pages.append(_text_from_content(content))

    if not pages:
        # No usable page tree: fall back to every stream that looks like content.
        for objnum, (body, raw) in sorted(objects.items()):
            if raw is None:
                continue
            content = _inflate(body, raw)
            if b"BT" in content and (b"Tj" in content or b"TJ" in content):
                pages.append(_text_from_content(content))

    pages = [p for p in pages]
    text = "\n\n".join(p for p in pages if p.strip())
    declared = len(re.findall(rb"/Type\s*/Page\b(?!s)", data))
    return PdfExtraction(
        text=text,
        pages=pages,
        page_count=max(len(pages), declared),
        confidence=_confidence(text),
        engine="builtin",
    )


def _parse_objects(data: bytes) -> dict[int, tuple[bytes, bytes | None]]:
    """Map object number -> (dictionary/body bytes, raw stream bytes or None)."""
    objects: dict[int, tuple[bytes, bytes | None]] = {}
    for match in _OBJ_RE.finditer(data):
        objnum = int(match.group(1))
        body = match.group(3)
        stream_match = _STREAM_RE.search(body)
        raw = stream_match.group(1) if stream_match else None
        header = body[: stream_match.start()] if stream_match else body
        objects[objnum] = (header, raw)
    return objects


def _page_order(objects: dict[int, tuple[bytes, bytes | None]]) -> list[int]:
    """Page object numbers in reading order, from the /Kids tree when present."""
    page_objs = {
        num for num, (body, _) in objects.items()
        if re.search(rb"/Type\s*/Page\b(?!s)", body)
    }
    if not page_objs:
        return []

    ordered: list[int] = []
    seen: set[int] = set()

    def walk(objnum: int, depth: int = 0) -> None:
        if depth > 32 or objnum in seen:
            return
        seen.add(objnum)
        body, _ = objects.get(objnum, (b"", None))
        kids = _KIDS_RE.search(body)
        if kids:
            for ref in _REF_RE.finditer(kids.group(1)):
                walk(int(ref.group(1)), depth + 1)
        elif objnum in page_objs:
            ordered.append(objnum)

    roots = [
        num for num, (body, _) in objects.items()
        if re.search(rb"/Type\s*/Pages\b", body) and b"/Parent" not in body
    ]
    for root in sorted(roots):
        walk(root)

    # Anything the tree walk missed (damaged trees are common) goes on the end.
    for num in sorted(page_objs - set(ordered)):
        ordered.append(num)
    return ordered


def _content_refs(page_body: bytes) -> list[int]:
    match = _CONTENTS_RE.search(page_body)
    if not match:
        return []
    if match.group(1):
        return [int(match.group(1))]
    return [int(ref.group(1)) for ref in _REF_RE.finditer(match.group(2) or b"")]


def _stream_bytes(objects: dict[int, tuple[bytes, bytes | None]], objnum: int) -> bytes:
    body, raw = objects.get(objnum, (b"", None))
    if raw is None:
        return b""
    return _inflate(body, raw)


def _inflate(header: bytes, raw: bytes) -> bytes:
    if b"/FlateDecode" not in header:
        return raw
    for candidate in (raw, raw.strip()):
        try:
            return zlib.decompress(candidate)
        except zlib.error:
            try:
                # Truncated streams are common; salvage what inflates.
                return zlib.decompressobj().decompress(candidate)
            except zlib.error:
                continue
    return b""


# --------------------------------------------------------------------------
# Content stream -> text
# --------------------------------------------------------------------------
def _text_from_content(content: bytes) -> str:
    if not content:
        return ""
    out: list[str] = []
    i = 0
    length = len(content)
    pending: list[str] = []   # strings collected inside a TJ array

    while i < length:
        char = content[i : i + 1]

        if char == b"(":
            literal, i = _read_literal(content, i)
            pending.append(literal)
            continue

        if char == b"<" and content[i : i + 2] != b"<<":
            hexed, i = _read_hex(content, i)
            pending.append(hexed)
            continue

        if char == b"<" and content[i : i + 2] == b"<<":
            # Inline dictionary (e.g. BDC properties) - skip it wholesale.
            depth, i = 0, i
            while i < length:
                if content[i : i + 2] == b"<<":
                    depth += 1
                    i += 2
                elif content[i : i + 2] == b">>":
                    depth -= 1
                    i += 2
                    if depth <= 0:
                        break
                else:
                    i += 1
            continue

        if char == b"]":
            i += 1
            continue

        if char == b"[":
            i += 1
            continue

        # Operator or number token. When no token is found, _read_token reports
        # where scanning should resume -- which may be a delimiter this loop
        # handles itself, so resume there rather than stepping past it.
        token, next_i = _read_token(content, i)
        if not token:
            i = next_i if next_i > i else i + 1
            continue
        i = next_i

        if token in (b"Tj", b"TJ", b"'", b'"'):
            out.append("".join(pending))
            pending = []
            if token in (b"'", b'"'):
                out.append("\n")
        elif token in (b"Td", b"TD", b"T*", b"ET"):
            if pending:
                out.append("".join(pending))
                pending = []
            out.append("\n")
        elif token == b"BT":
            pending = []

    if pending:
        out.append("".join(pending))

    text = "".join(out)
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return "\n".join(line.strip() for line in text.split("\n")).strip()


def _read_literal(content: bytes, start: int) -> tuple[str, int]:
    """Read a ``( ... )`` string, honouring escapes and nested parentheses."""
    i = start + 1
    depth = 1
    buf = bytearray()
    length = len(content)
    while i < length:
        byte = content[i : i + 1]
        if byte == b"\\":
            nxt = content[i + 1 : i + 2]
            simple = {
                b"n": b"\n", b"r": b"\r", b"t": b"\t", b"b": b"\b",
                b"f": b"\f", b"(": b"(", b")": b")", b"\\": b"\\",
            }
            if nxt in simple:
                buf += simple[nxt]
                i += 2
                continue
            if nxt.isdigit():
                octal = content[i + 1 : i + 4]
                digits = bytes(c for c in octal if 48 <= c <= 55)
                if digits:
                    buf.append(int(digits, 8) & 0xFF)
                    i += 1 + len(digits)
                    continue
            if nxt in (b"\n", b"\r"):     # line continuation
                i += 2
                continue
            i += 2
            continue
        if byte == b"(":
            depth += 1
            buf += byte
        elif byte == b")":
            depth -= 1
            if depth == 0:
                i += 1
                break
            buf += byte
        else:
            buf += byte
        i += 1
    return _decode(bytes(buf)), i


def _read_hex(content: bytes, start: int) -> tuple[str, int]:
    end = content.find(b">", start)
    if end == -1:
        return "", len(content)
    digits = re.sub(rb"[^0-9A-Fa-f]", b"", content[start + 1 : end])
    if len(digits) % 2:
        digits += b"0"
    try:
        raw = bytes.fromhex(digits.decode("ascii"))
    except ValueError:
        return "", end + 1
    # Two-byte sequences with a zero high byte are almost always UTF-16-ish CID
    # output for Latin text; strip the padding rather than emit NULs.
    if len(raw) >= 2 and raw[0::2].count(0) > len(raw) // 4:
        raw = raw[1::2]
    return _decode(raw), end + 1


def _read_token(content: bytes, start: int) -> tuple[bytes, int]:
    i = start
    length = len(content)
    while i < length and content[i : i + 1] in b" \t\r\n":
        i += 1
    begin = i
    while i < length and content[i : i + 1] not in b" \t\r\n[]<>(){}/":
        i += 1
    if i == begin:
        return b"", start + 1
    return content[begin:i], i


def _decode(raw: bytes) -> str:
    try:
        return raw.decode("cp1252")
    except (UnicodeDecodeError, LookupError):
        return raw.decode("latin-1", errors="replace")


def _confidence(text: str) -> float:
    """Fraction of characters that are plausible document text."""
    if not text:
        return 0.0
    good = sum(1 for ch in text if ch.isalnum() or ch.isspace() or ch in ".,;:'\"()-/&%$#!?*+=[]{}<>|@_~`^")
    return good / len(text)

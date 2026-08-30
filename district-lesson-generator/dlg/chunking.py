"""Layer 1b -- turn loaded files into retrievable, citable chunks.

Chunking is structure-aware rather than a blind character split:

* Tables are chunked by whole records with the header repeated, so a scope and
  sequence row is never cut in half and every chunk stays self-describing.
* PDF pages are chunked within page boundaries so the citation can say "p. 7".
* Prose is packed to a token budget on paragraph boundaries, with overlap.

Every chunk carries a locator, which is what makes the generated lesson's
citations resolvable back to the district's own file.
"""

from __future__ import annotations

from .loaders import Loaded, Table
from .models import Chunk, Document
from .util import estimate_tokens, find_standard_codes, stable_id


def chunk_document(
    doc: Document,
    loaded: Loaded,
    chunk_tokens: int = 320,
    overlap_tokens: int = 64,
) -> list[Chunk]:
    chunks: list[Chunk] = []

    for table in loaded.tables:
        chunks.extend(_chunk_table(doc, table, chunk_tokens))

    if loaded.pages:
        for page_no, page_text in enumerate(loaded.pages, start=1):
            chunks.extend(
                _chunk_prose(doc, page_text, chunk_tokens, overlap_tokens, f"p. {page_no}")
            )
    elif not loaded.tables:
        chunks.extend(_chunk_prose(doc, loaded.text, chunk_tokens, overlap_tokens, ""))

    for ordinal, chunk in enumerate(chunks):
        chunk.ordinal = ordinal
        chunk.chunk_id = stable_id(doc.doc_id, ordinal, chunk.text[:120])
    return chunks


def _chunk_table(doc: Document, table: Table, chunk_tokens: int) -> list[Chunk]:
    if not table.rows:
        return []
    header = table.rows[0]
    header_line = " | ".join(cell.strip() for cell in header)
    header_cost = estimate_tokens(header_line)
    body = table.rows[1:]
    if not body:
        return [_make_chunk(doc, header_line, table.name)]

    chunks: list[Chunk] = []
    buffer: list[str] = []
    first_row = 2                      # 1-based, header is row 1
    running = header_cost

    for offset, row in enumerate(body):
        line = " | ".join(cell.strip() for cell in row)
        cost = estimate_tokens(line)
        if buffer and running + cost > chunk_tokens:
            last_row = first_row + len(buffer) - 1
            chunks.append(
                _make_chunk(
                    doc,
                    "\n".join([header_line, *buffer]),
                    _row_locator(table.name, first_row, last_row),
                )
            )
            first_row = first_row + len(buffer)
            buffer = []
            running = header_cost
        buffer.append(line)
        running += cost

    if buffer:
        last_row = first_row + len(buffer) - 1
        chunks.append(
            _make_chunk(
                doc,
                "\n".join([header_line, *buffer]),
                _row_locator(table.name, first_row, last_row),
            )
        )
    return chunks


def _row_locator(table_name: str, first_row: int, last_row: int) -> str:
    if first_row == last_row:
        return f"{table_name}, row {first_row}"
    return f"{table_name}, rows {first_row}-{last_row}"


def _chunk_prose(
    doc: Document,
    text: str,
    chunk_tokens: int,
    overlap_tokens: int,
    locator_prefix: str,
) -> list[Chunk]:
    text = (text or "").strip()
    if not text:
        return []

    blocks = [block.strip() for block in text.split("\n\n") if block.strip()]
    chunks: list[Chunk] = []
    buffer: list[str] = []
    running = 0

    def emit(carry_overlap: bool) -> None:
        """Emit the buffer; optionally keep a tail so chunks overlap."""
        nonlocal buffer, running
        if not buffer:
            return
        part = len(chunks) + 1
        if locator_prefix:
            locator = locator_prefix if part == 1 else f"{locator_prefix} (cont. {part})"
        else:
            locator = f"part {part}"
        chunks.append(_make_chunk(doc, "\n\n".join(buffer), locator))
        if not carry_overlap or overlap_tokens <= 0:
            buffer, running = [], 0
            return
        tail: list[str] = []
        cost = 0
        for block in reversed(buffer):
            block_cost = estimate_tokens(block)
            if cost + block_cost > overlap_tokens:
                break          # a block too big to be overlap is simply not carried
            tail.insert(0, block)
            cost += block_cost
        buffer, running = tail, cost

    for block in blocks:
        for piece in _split_oversized(block, chunk_tokens):
            cost = estimate_tokens(piece)
            if buffer and running + cost > chunk_tokens:
                emit(carry_overlap=True)
            buffer.append(piece)
            running += cost

    emit(carry_overlap=False)
    return chunks


def _split_oversized(block: str, chunk_tokens: int) -> list[str]:
    """Break a single paragraph that exceeds the budget on sentence boundaries."""
    if estimate_tokens(block) <= chunk_tokens:
        return [block]
    sentences = block.replace("? ", "?\x00").replace("! ", "!\x00").replace(". ", ".\x00").split("\x00")
    pieces: list[str] = []
    buffer: list[str] = []
    running = 0
    for sentence in sentences:
        cost = estimate_tokens(sentence)
        if buffer and running + cost > chunk_tokens:
            pieces.append(" ".join(buffer))
            buffer, running = [], 0
        buffer.append(sentence)
        running += cost
    if buffer:
        pieces.append(" ".join(buffer))
    return pieces


def _make_chunk(doc: Document, text: str, locator: str) -> Chunk:
    return Chunk(
        chunk_id="",
        doc_id=doc.doc_id,
        path=doc.path,
        kind=doc.kind,
        ordinal=0,
        text=text,
        locator=locator,
        grade=str(doc.meta.get("grade", "")),
        subject=str(doc.meta.get("subject", "")),
        codes=find_standard_codes(text),
    )

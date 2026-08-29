"""Shared test fixtures: a throwaway project and a scripted model backend."""

from __future__ import annotations

import logging
import shutil
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from dlg.config import Config          # noqa: E402
from dlg.ingest import ingest          # noqa: E402
from dlg.retrieval import Store        # noqa: E402
from dlg.util import get_logger        # noqa: E402

SAMPLES = ROOT / "samples" / "corpus"

# The tests deliberately exercise the unhappy paths (unreadable files, repair
# passes, unparseable model output). Those log lines are the system working, so
# quiet them here rather than in the library.
get_logger().setLevel(logging.ERROR)


class FakeClient:
    """A model backend that replays scripted responses."""

    kind = "fake"
    model = "fake-model"

    def __init__(self, responses: list[str]) -> None:
        self.responses = list(responses)
        self.calls: list[tuple[str, str]] = []

    def describe(self) -> str:
        return "scripted test backend"

    def complete(self, system: str, user: str, **kwargs: object) -> str:
        self.calls.append((system, user))
        if not self.responses:
            raise AssertionError("FakeClient ran out of scripted responses")
        return self.responses.pop(0)


_CT = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
{sheet_overrides}
</Types>"""

_ROOT_RELS = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>"""


def write_xlsx(path: Path, sheets: dict[str, list[list[str]]]) -> Path:
    """Write a minimal but valid .xlsx, so tests can mirror real district layouts.

    Uses inline strings rather than a shared-string table -- fewer parts to get
    wrong, and the loader handles both.
    """
    import zipfile
    from xml.sax.saxutils import escape

    names = list(sheets)
    overrides = "\n".join(
        f'<Override PartName="/xl/worksheets/sheet{i}.xml" '
        'ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>'
        for i in range(1, len(names) + 1)
    )
    sheet_tags = "".join(
        f'<sheet name="{escape(name)}" sheetId="{i}" r:id="rId{i}"/>'
        for i, name in enumerate(names, start=1)
    )
    rel_tags = "".join(
        f'<Relationship Id="rId{i}" '
        'Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" '
        f'Target="worksheets/sheet{i}.xml"/>'
        for i in range(1, len(names) + 1)
    )

    def column(index: int) -> str:
        label = ""
        index += 1
        while index:
            index, rem = divmod(index - 1, 26)
            label = chr(65 + rem) + label
        return label

    path.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(path, "w", zipfile.ZIP_DEFLATED) as archive:
        archive.writestr("[Content_Types].xml", _CT.format(sheet_overrides=overrides))
        archive.writestr("_rels/.rels", _ROOT_RELS)
        archive.writestr(
            "xl/workbook.xml",
            '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" '
            'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">'
            f"<sheets>{sheet_tags}</sheets></workbook>",
        )
        archive.writestr(
            "xl/_rels/workbook.xml.rels",
            '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
            f"{rel_tags}</Relationships>",
        )
        for number, name in enumerate(names, start=1):
            body = ""
            for row_index, row in enumerate(sheets[name], start=1):
                cells = "".join(
                    f'<c r="{column(col)}{row_index}" t="inlineStr">'
                    f"<is><t xml:space=\"preserve\">{escape(str(value))}</t></is></c>"
                    for col, value in enumerate(row) if str(value) != ""
                )
                body += f'<row r="{row_index}">{cells}</row>'
            archive.writestr(
                f"xl/worksheets/sheet{number}.xml",
                '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
                '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'
                f"<sheetData>{body}</sheetData></worksheet>",
            )
    return path


def make_project(files: dict[str, str] | None = None) -> tuple[Config, Store, Path]:
    """Build a temp project. With no ``files``, the sample corpus is used."""
    tmp = Path(tempfile.mkdtemp(prefix="dlg-test-"))
    corpus = tmp / "corpus"
    corpus.mkdir(parents=True)

    if files is None:
        for source in SAMPLES.iterdir():
            if source.is_file():
                shutil.copy2(source, corpus / source.name)
    else:
        for name, content in files.items():
            path = corpus / name
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(content, encoding="utf-8")

    config = Config.load(tmp, {"embed_backend": "hashing", "llm_backend": "offline"})
    ingest(config, force=True)
    return config, Store.load(config.index_path), tmp

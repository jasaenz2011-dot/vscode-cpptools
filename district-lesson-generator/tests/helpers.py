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


_HUNTER_MINUTES = {
    "purpose": 3, "anticipatory_set": 6, "input": 9, "modeling": 12,
    "guided_practice": 12, "checking_for_understanding": 6,
    "independent_practice": 9, "closure": 3,
}

# Terms appear in the teaching steps AND on the student page, as the standard
# requires -- a fixture that skipped that would fail vocabulary_woven.
_VOCAB = ("denominator", "equivalent", "benchmark", "sum")


def hunter_lesson(
    standards: list[tuple[str, str]],
    *,
    minutes: dict[str, int] | None = None,
    bad_code: str = "",
    answer: str = "7/12",
    student_pages: bool = True,
) -> dict:
    """A complete, valid three-part package for tests to mutate."""
    minutes = minutes or _HUNTER_MINUTES
    woven = (
        "Name the denominator, then find an equivalent fraction using a benchmark "
        "so the sum is exact."
    )
    step = lambda extra="": {  # noqa: E731
        "minutes": 0,
        "teacher_moves": [f"{woven} {extra}".strip()],
        "student_actions": ["Build the sum with fraction strips."],
        "questions": ["Explain how you know the denominator makes the pieces equal."],
        "look_fors": ["Equal-sized parts in the model."],
    }
    hunter = {}
    for name, value in minutes.items():
        node = step()
        node["minutes"] = value
        hunter[name] = node

    return {
        "title": "Adding Fractions with Unlike Denominators",
        "grade": "5",
        "subject": "math",
        "standards": [
            {"code": code, "text": text, "emphasis": "primary focus" if i == 0 else "supporting"}
            for i, (code, text) in enumerate(standards)
        ],
        "objective": {
            "student_friendly": "I can add fractions with unlike denominators using a model.",
            "mastery_evidence": "I rename both fractions and justify the sum on the exit ticket.",
        },
        "academic_vocabulary": [
            {"term": term, "student_definition": f"what {term} means in kid words",
             "cognate": "", "gesture_or_object": "fraction strips"}
            for term in _VOCAB
        ],
        "hunter": hunter,
        "materials": ["fraction strips", "number line strips"],
        "manipulatives": ["paper plates cut into halves and thirds", "beans"],
        "differentiation": {
            "below_level": ["Start with halves, fourths and eighths."],
            "on_level": ["Use thirds and sixths."],
            "above_level": ["Add three fractions."],
            "special_education": ["Pre-cut the strips; reduce to four problems."],
        },
        "ell_support": {
            "language_load": "'of' in fractions reads as multiplication, not possession.",
            "concept_gap": "Part-whole meaning of the denominator is not yet stable.",
            "motion_movie": {
                "scene": "Paper plates are one whole each.",
                "move": "Fold one plate into halves and one into thirds, then cover.",
                "freeze_frame": "The moment both plates show sixths.",
                "talk_back": "'I renamed ___ as ___ because ___.'",
            },
            "thinking_stems": ["I renamed ___ as ___ because ___."],
        },
        "timing_overview": [{"segment": k, "minutes": v} for k, v in minutes.items()],
        "student_pages": ([
            {
                "title": "Renaming to a Common Denominator",
                "directions": "Fold, cover, then write the equation you see.",
                "vocabulary_or_stems": list(_VOCAB) + ["I renamed ___ because ___."],
                "evidence_space": "Draw the two plates and label the equivalent sum.",
                "items": [
                    {"prompt": "Add 1/2 + 1/3 with your model.", "answer": "5/6"},
                    {"prompt": "Add 1/4 + 1/3 with your model.", "answer": "7/12"},
                ],
                "because_line": "I know my answer is correct because ___.",
            }
        ] if student_pages else []),
        "exit_ticket": {
            "minutes": 9,
            "teks_posted": [code for code, _ in standards],
            "items": [
                {
                    "prompt": "Which model shows 1/2 + 1/3 renamed correctly?",
                    "choices": ["Sixths, 5 shaded", "Fifths, 2 shaded", "Sixths, 2 shaded",
                                "Thirds, 1 shaded"],
                    "answer": "Sixths, 5 shaded",
                    "distractor_rationale": "Fifths shows adding denominators.",
                },
                {
                    "prompt": "Compare 1/2 + 1/4 to one whole. Justify your choice.",
                    "choices": ["Less than 1", "Equal to 1", "Greater than 1", "Cannot tell"],
                    "answer": "Less than 1",
                    "distractor_rationale": "'Equal to 1' means benchmark reasoning is missing.",
                },
            ],
            "constructed_item": {
                "prompt": "Mia ate 1/3 of a pizza and Sam ate 1/4. How much did they eat?",
                "exemplar_model": "One whole partitioned into twelfths, 4 and 3 shaded.",
                "exemplar_equation": "1/3 + 1/4 = 4/12 + 3/12 = 7/12",
                "exemplar_justification": "Twelfths let both pieces be the same size.",
                "scoring": {
                    "zero": "Blank, or adds denominators.",
                    "one": f"Answer {answer} with no model, or a model with no answer.",
                    "two": "Model, answer and justification all present.",
                },
            },
            "success_line": "I can rename fractions and justify my sum.",
        },
        "teacher_notes": (f"Also review {bad_code} first." if bad_code
                          else "Fraction strips are in the back cabinet."),
    }


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

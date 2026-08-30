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


VIDEO_STEERING = (
    "VIDEO STEERING: Cinematic classroom explainer, 3-6 minutes, no background music "
    "louder than the voice, on-screen labels for every academic vocabulary word the first "
    "time it is spoken, freeze on the model before any formula appears."
)


def notebook_pack_markdown() -> str:
    """A NotebookLM source pack that clears the 800-word floor honestly.

    Written out rather than padded: NotebookLM narrates only what it is given,
    so a fixture that games the word count would not prove the rule works.
    """
    return "\n\n".join([
        VIDEO_STEERING,
        "# Adding Fractions with Unequal Denominators",
        "Grade 5 Mathematics. Posted TEKS 5.3H, represent and solve addition and "
        "subtraction of fractions with unequal denominators referring to the same whole "
        "using objects and pictorial models and properties of operations, and 5.3K, add "
        "and subtract positive rational numbers fluently.",
        "## Objective and mastery",
        "Students will add and subtract fractions whose denominators differ by renaming "
        "both fractions so the pieces are the same size, and they will prove the result "
        "with a model rather than asserting it. Mastery is shown when a student builds a "
        "model, writes the matching equation, and explains why the pieces had to be equal "
        "before they could be counted together. A correct number with no model is not yet "
        "mastery, because the number can come from a memorized procedure the student "
        "cannot defend or repair when it goes wrong.",
        "## The motion movie, in four beats",
        "Scene. Two identical paper plates sit on the document camera. Each plate is one "
        "whole. Nothing is shaded yet, and the class agrees out loud that the plates are "
        "the same size, because the whole matters more than anything else today.",
        "Move. One plate is folded into halves and shaded to show one half. The second "
        "plate is folded into thirds and shaded to show one third. The two shaded pieces "
        "are slid toward each other. They do not line up. The teacher keeps folding: the "
        "halves plate is folded again into sixths, and the thirds plate is folded again "
        "into sixths, saying the same amount, a new name, on every fold.",
        "Freeze frame. Both plates are held up at the moment they both show sixths. One "
        "half now reads three sixths. One third now reads two sixths. This is the picture "
        "that becomes the written line, and the narrator should hold here before any "
        "symbol appears on screen.",
        "Talk-back. A student says, I renamed one half as three sixths because the pieces "
        "had to be the same size.",
        "## Worked example",
        "Example: add one half and one third. Step 1, name the denominators. One half has "
        "a denominator of 2, meaning the whole was cut into 2 equal parts. One third has a "
        "denominator of 3. Step 2, find a size that works for both. Folding halves again "
        "gives fourths, then sixths. Folding thirds again gives sixths. Sixths is the "
        "first size both plates can make, so 6 is the common denominator. Step 3, rename. "
        "One half becomes 3 sixths, because 1 times 3 is 3 and 2 times 3 is 6. One third "
        "becomes 2 sixths, because 1 times 2 is 2 and 3 times 2 is 6. Step 4, join the "
        "pieces. 3 sixths plus 2 sixths is 5 sixths, because there are now 5 pieces and "
        "each piece is one sixth of the whole. The equation reads 1/2 + 1/3 = 3/6 + 2/6 = "
        "5/6. Step 5, check against a benchmark. One half of the plate would be 3 sixths, "
        "and 5 sixths is more than that, so a sum a little under one whole is reasonable.",
        "The diagram shows two circles side by side. Each is divided into six equal "
        "wedges. The left circle has three wedges shaded and is labeled one half equals "
        "three sixths. The right circle has two wedges shaded and is labeled one third "
        "equals two sixths. Beneath both, a third circle shows five of six wedges shaded, "
        "labeled five sixths.",
        "## The misconception this kills",
        "The wrong idea is that one half plus one third is two fifths. It comes from "
        "treating the denominator as a counting number instead of the size of the piece, "
        "so the student adds the tops and adds the bottoms. The visual kills it because "
        "two fifths is visibly smaller than one half, while the real answer is visibly "
        "larger than one half. A student who has seen the plates cannot hold on to two "
        "fifths, because the picture contradicts it immediately and without argument.",
        "## Talk-back and an acceptable answer",
        "Stem: I renamed ___ as ___ because ___. An acceptable answer is, I renamed one "
        "third as two sixths because the pieces had to be the same size before I could "
        "count them together. A student who says, I multiplied by two, has described the "
        "move but not the reason, and the narrator should model the reason.",
        "## One STAAR-flavored check",
        "Which model shows one half plus one third renamed so the pieces are the same "
        "size? Choice A shows two plates in sixths with three shaded and two shaded, and "
        "it is correct. Choice B shows one plate in fifths with two shaded, which is the "
        "student who added both denominators. Choice C shows two plates in sixths with one "
        "shaded and one shaded, which is the student who renamed the denominator but "
        "forgot to rename the numerator. Choice D shows one plate in halves and one in "
        "thirds with one shaded each, which is the student who never renamed at all.",
        "## Closing line",
        "You cannot add the pieces until the pieces are the same size.",
    ])


def media_brief() -> dict:
    """A Part D brief that clears the gate: control, misconception, pack, shots."""
    return {
        "concept_one_liner": "Fractions can only be joined once both wholes are cut into "
                             "the same size pieces.",
        "motion_movie": {
            "scene": "Two identical paper plates, each one whole pizza.",
            "move": "Fold one plate into halves and one into thirds, then keep folding "
                    "both until the fold lines match at sixths.",
            "freeze_frame": "The moment both plates show sixths: 1/2 reads 3/6 and 1/3 "
                            "reads 2/6.",
            "talk_back": "I renamed ___ as ___ because the pieces had to be the same size.",
        },
        "misconceptions_to_show": [
            "Adding both denominators: 1/2 + 1/3 = 2/5.",
            "Renaming the denominator but leaving the numerator alone: 1/2 becomes 1/6.",
            "Treating unequal pieces as countable without renaming at all.",
        ],
        "gemini_sim_prompt": (
            "You are building an interactive teaching simulation inside this chat / Canvas.\n\n"
            "AUDIENCE: Grade 5 Mathematics. TEKS 5.3H and 5.3K.\n"
            "GOAL: Students must SEE that fractions can only be joined once both wholes are "
            "cut into the same size pieces. They must not only compute.\n\n"
            "REQUIRED CONTROLS\n"
            "- A slider for each denominator, so the student can drag halves to sixths and "
            "watch the fold lines change.\n"
            "- Draggable shaded wedges the student can slide from one plate onto the other.\n"
            "- Live labels using the vocabulary: denominator, equivalent fraction, common "
            "denominator, benchmark fraction, sum, difference.\n"
            "- A talk-back stem on screen: \"I renamed ___ as ___ because the pieces had to "
            "be the same size.\"\n"
            "- A misconception mode that can display 1/2 + 1/3 = 2/5 so the class can see "
            "the area is wrong.\n\n"
            "REQUIRED VISUAL\n"
            "- Two circles as area models, each one whole, divided into equal wedges.\n"
            "- The shaded area of each fraction stays constant as the denominator slider "
            "moves, so renaming visibly changes the name and not the amount.\n"
            "- An equation bar that updates to 1/2 + 1/3 = 3/6 + 2/6 = 5/6.\n"
            "- A benchmark line at one half the student can compare the sum against.\n\n"
            "CONSTRAINTS\n"
            "- Fifth-grade readable. No clutter.\n"
            "- Do not invent extra TEKS.\n"
            "- Start on halves and thirds so the first common denominator is 6.\n"
            "- If you cannot animate the folds, say so and show the two area models "
            "side by side. Do not ship a calculator that only prints the answer.\n\n"
            "Walk me through the first interaction as if I am the teacher on a document camera."
        ),
        "notebooklm_source_pack": {
            "title": "Adding Fractions with Unequal Denominators",
            "audience": "Grade 5 Mathematics",
            "teks_block": "5.3H represent and solve addition and subtraction of fractions "
                          "with unequal denominators; 5.3K add and subtract positive "
                          "rational numbers fluently",
            "source_doc_markdown": notebook_pack_markdown(),
        },
        "veo_shot_list": [
            {"shot_id": "V1", "seconds": 6, "purpose": "hook",
             "prompt": "Top-down on butcher paper. Two identical paper plates rest side by "
                       "side. One folds into halves, one into thirds. Slow push-in. No people."},
            {"shot_id": "V2", "seconds": 6, "purpose": "misconception",
             "prompt": "Top-down. A shaded half and a shaded third slide together and refuse "
                       "to line up. A ghosted 2/5 label fades in and then dissolves. Static camera."},
            {"shot_id": "V3", "seconds": 5, "purpose": "freeze",
             "prompt": "Top-down. Both plates fold again until every wedge matches at sixths. "
                       "The camera holds still on the matched fold lines. No text."},
            {"shot_id": "V4", "seconds": 6, "purpose": "model",
             "prompt": "Top-down. Three wedges and two wedges slide into one plate, filling "
                       "five of six. Slow rise to overhead. No people."},
        ],
        "classroom_use": {
            "when_in_hunter": "Explain",
            "minutes": 8,
            "grouping": "whole group on board",
            "teacher_move_after": "The slider changed the name and not the amount. Explain "
                                  "how you know the shaded area never grew.",
        },
    }


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
    # The standard requires closure to hand students to the ticket.
    hunter["closure"]["teacher_moves"] = [
        f"{woven} Then tell students the exit ticket asks them to prove it with a model."
    ]

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
        "part_d": media_brief(),
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

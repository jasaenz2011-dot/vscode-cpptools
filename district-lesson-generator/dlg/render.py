"""Layer 3a -- turn a generated document into something printable.

One structural pass builds an intermediate block list; Markdown, HTML, and
Word all render from it, so the three exports cannot drift apart. The ``.docx``
writer emits Office Open XML directly with :mod:`zipfile`, which means Word
output works with nothing installed.
"""

from __future__ import annotations

import html as _html
import zipfile
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

from .models import GenerationResult
from .schemas import HUNTER_STEPS, get
from .util import slugify

# ----------------------------------------------------------------------
@dataclass
class Block:
    kind: str                       # h1 h2 h3 p kv ul table note hr
    text: str = ""
    label: str = ""
    items: list[str] = field(default_factory=list)
    header: list[str] = field(default_factory=list)
    rows: list[list[str]] = field(default_factory=list)
    tone: str = "info"              # note blocks: info | warn


def blocks_for(result: GenerationResult) -> list[Block]:
    intervention = result.request.material == "intervention"
    builder = _intervention_blocks if intervention else _lesson_blocks
    blocks = builder(result)
    blocks.extend(_provenance_blocks(result))
    return blocks


# ----------------------------------------------------------------------
def _header_blocks(result: GenerationResult, title: str) -> list[Block]:
    request = result.request
    provenance = result.document.get("_provenance", {})
    subtitle = " | ".join(
        part for part in (
            provenance.get("district", ""),
            f"Grade {request.grade} {request.subject.title()}",
            result.unit.label() if result.unit else "",
            f"{request.duration_minutes} minutes",
        ) if part
    )
    blocks = [Block("h1", title or "Lesson"), Block("p", subtitle)]

    if provenance.get("mode") == "scaffold":
        blocks.append(Block(
            "note",
            "Assembled from district documents without a language model. Standards, pacing, "
            "and the referenced materials are verbatim; the empty sections are the ones a "
            "model would write. Start Ollama or set an API key, then regenerate.",
            tone="warn",
        ))
    errors = result.report.errors
    if errors:
        shown = "; ".join(violation.message for violation in errors[:4])
        if len(errors) > 4:
            shown += f" (+{len(errors) - 4} more, listed at the end)"
        blocks.append(Block("note", f"Checks not passing: {shown}", tone="warn"))
    return blocks


def _lesson_blocks(result: GenerationResult) -> list[Block]:
    """The three-part package: Hunter lesson, student pages, exit ticket."""
    doc = result.document
    blocks = _header_blocks(result, str(doc.get("title", "")))

    blocks.append(Block("h2", "Part A — Madeline Hunter lesson"))

    standard_rows = [
        [str(entry.get("code", "")), str(entry.get("text", "")), str(entry.get("emphasis", ""))]
        for entry in doc.get("standards", [])
        if isinstance(entry, dict)
    ]
    blocks.append(Block("h3", "TEKS"))
    if standard_rows:
        blocks.append(Block("table", header=["Code", "District wording (verbatim)", "Emphasis"],
                            rows=standard_rows))
    else:
        blocks.append(Block("p", "No standards were resolved from district documents."))

    blocks.append(Block("h3", "Objective"))
    blocks.append(Block("kv", label="Students will say",
                        text=_or_blank(get(doc, "objective.student_friendly"))))
    blocks.append(Block("kv", label="Mastery is shown by",
                        text=_or_blank(get(doc, "objective.mastery_evidence"))))

    vocabulary = [v for v in (doc.get("academic_vocabulary") or []) if isinstance(v, dict)]
    if vocabulary:
        blocks.append(Block("h3", "Academic vocabulary"))
        blocks.append(Block(
            "table",
            header=["Term", "Student-friendly definition", "Cognate", "Gesture / object"],
            rows=[
                [str(v.get("term", "")), str(v.get("student_definition", "")),
                 str(v.get("cognate", "")), str(v.get("gesture_or_object", ""))]
                for v in vocabulary
            ],
        ))

    for number, (step, label) in enumerate(HUNTER_STEPS, start=1):
        node = get(doc, f"hunter.{step}") or {}
        minutes = node.get("minutes") or 0
        blocks.append(Block("h3", f"({number}) {label} — {minutes} min"))
        for key, heading in (
            ("teacher_moves", "Teacher"),
            ("student_actions", "Students"),
            ("questions", "Questions"),
            ("look_fors", "Look for"),
        ):
            items = [str(item) for item in (node.get(key) or []) if str(item).strip()]
            if items:
                blocks.append(Block("kv", label=heading, text=""))
                blocks.append(Block("ul", items=items))

    for key, label in (("materials", "Materials"), ("manipulatives", "Manipulatives")):
        items = [str(item) for item in (doc.get(key) or []) if str(item).strip()]
        if items:
            blocks.append(Block("h3", label))
            blocks.append(Block("ul", items=items))

    differentiation = doc.get("differentiation") or {}
    if any(differentiation.values()):
        blocks.append(Block("h3", "Differentiation notes"))
        for key, label in (
            ("below_level", "Needs more support"),
            ("on_level", "On level"),
            ("above_level", "Extension"),
            ("special_education", "Accommodations and modifications"),
        ):
            items = differentiation.get(key) or []
            if items:
                blocks.append(Block("kv", label=label, text=""))
                blocks.append(Block("ul", items=[str(item) for item in items]))

    blocks.extend(_ell_blocks(doc))

    timing = [t for t in (doc.get("timing_overview") or []) if isinstance(t, dict)]
    if timing:
        blocks.append(Block("h3", "Timing overview"))
        blocks.append(Block(
            "table", header=["Segment", "Minutes"],
            rows=[[str(t.get("segment", "")), str(t.get("minutes", ""))] for t in timing],
        ))

    blocks.extend(_student_page_blocks(doc))
    blocks.extend(_exit_ticket_blocks(doc))
    blocks.extend(_media_brief_blocks(doc))

    if doc.get("teacher_notes"):
        blocks.append(Block("h2", "Teacher notes"))
        blocks.append(Block("p", str(doc["teacher_notes"])))
    return blocks


def _ell_blocks(doc: dict[str, Any]) -> list[Block]:
    ell = doc.get("ell_support") or {}
    movie = ell.get("motion_movie") or {}
    if not any([ell.get("language_load"), ell.get("concept_gap"), any(movie.values())]):
        return []

    blocks = [Block("h3", "Multilingual learners")]
    blocks.append(Block("kv", label="Language load", text=_or_blank(ell.get("language_load"))))
    blocks.append(Block("kv", label="Concept gap", text=_or_blank(ell.get("concept_gap"))))
    if any(movie.values()):
        blocks.append(Block(
            "table",
            header=["Beat", "What happens"],
            rows=[
                ["1. Scene", str(movie.get("scene", ""))],
                ["2. Move", str(movie.get("move", ""))],
                ["3. Freeze frame", str(movie.get("freeze_frame", ""))],
                ["4. Talk-back", str(movie.get("talk_back", ""))],
            ],
        ))
    stems = [str(s) for s in (ell.get("thinking_stems") or []) if str(s).strip()]
    if stems:
        blocks.append(Block("kv", label="Thinking stems", text=""))
        blocks.append(Block("ul", items=stems))
    return blocks


def _student_page_blocks(doc: dict[str, Any]) -> list[Block]:
    pages = [p for p in (doc.get("student_pages") or []) if isinstance(p, dict)]
    blocks = [Block("h2", "Part B — Student pages")]
    if not pages:
        blocks.append(Block("note", "No student pages were produced. The package is incomplete "
                                    "without them.", tone="warn"))
        return blocks

    for index, page in enumerate(pages, start=1):
        blocks.append(Block("h3", f"{page.get('title') or f'Student page {index}'}"))
        blocks.append(Block("kv", label="Name", text="__________________________    Date: __________"))
        if page.get("directions"):
            blocks.append(Block("p", str(page["directions"])))
        stems = [str(s) for s in (page.get("vocabulary_or_stems") or []) if str(s).strip()]
        if stems:
            blocks.append(Block("kv", label="Word bank / sentence stems", text=""))
            blocks.append(Block("ul", items=stems))
        if page.get("evidence_space"):
            blocks.append(Block("kv", label="Show your thinking here",
                                text=str(page["evidence_space"])))
        items = [i for i in (page.get("items") or []) if isinstance(i, dict)]
        if items:
            blocks.append(Block(
                "table",
                header=["#", "Task", "Teacher key"],
                rows=[[str(n), str(i.get("prompt", "")), str(i.get("answer", ""))]
                      for n, i in enumerate(items, start=1)],
            ))
        if page.get("because_line"):
            blocks.append(Block("kv", label="Because", text=str(page["because_line"])))
    return blocks


def _exit_ticket_blocks(doc: dict[str, Any]) -> list[Block]:
    ticket = doc.get("exit_ticket") or {}
    minutes = ticket.get("minutes") or 0
    blocks = [Block("h2", f"Part C — Exit ticket ({minutes} min)")]

    posted = [str(code) for code in (ticket.get("teks_posted") or []) if str(code).strip()]
    blocks.append(Block("kv", label="TEKS", text=", ".join(posted) if posted else "--"))
    blocks.append(Block("kv", label="Name", text="__________________________    Date: __________"))

    items = [i for i in (ticket.get("items") or []) if isinstance(i, dict)]
    for number, item in enumerate(items, start=1):
        blocks.append(Block("kv", label=f"{number}", text=str(item.get("prompt", ""))))
        choices = [str(c) for c in (item.get("choices") or []) if str(c).strip()]
        if choices:
            blocks.append(Block("ul", items=choices))

    constructed = ticket.get("constructed_item") or {}
    if constructed.get("prompt"):
        blocks.append(Block("kv", label=f"{len(items) + 1}", text=str(constructed["prompt"])))
        blocks.append(Block("p", "Show a model, give your answer, and explain how you know."))

    if ticket.get("success_line"):
        blocks.append(Block("note", str(ticket["success_line"])))

    # --- teacher key ---------------------------------------------------
    blocks.append(Block("h3", "Answer key (teacher)"))
    if items:
        blocks.append(Block(
            "table",
            header=["#", "Answer", "What a wrong answer reveals"],
            rows=[[str(n), str(i.get("answer", "")), str(i.get("distractor_rationale", ""))]
                  for n, i in enumerate(items, start=1)],
        ))
    if constructed.get("prompt"):
        blocks.append(Block("kv", label="Exemplar model", text=_or_blank(constructed.get("exemplar_model"))))
        blocks.append(Block("kv", label="Exemplar equation",
                            text=_or_blank(constructed.get("exemplar_equation"))))
        blocks.append(Block("kv", label="Exemplar justification",
                            text=_or_blank(constructed.get("exemplar_justification"))))
        scoring = constructed.get("scoring") or {}
        blocks.append(Block(
            "table",
            header=["Score", "Criteria"],
            rows=[
                ["0", str(scoring.get("zero", ""))],
                ["1", str(scoring.get("one", ""))],
                ["2", str(scoring.get("two", ""))],
            ],
        ))
    return blocks


def _intervention_blocks(result: GenerationResult) -> list[Block]:
    doc = result.document
    blocks = _header_blocks(result, str(doc.get("title", "")))

    blocks.append(Block("h2", "Target standards"))
    rows = [
        [str(entry.get("code", "")), str(entry.get("text", ""))]
        for entry in doc.get("target_standards", []) if isinstance(entry, dict)
    ]
    if rows:
        blocks.append(Block("table", header=["Code", "District wording (verbatim)"], rows=rows))

    blocks.append(Block("kv", label="Prerequisite skill", text=_or_blank(doc.get("prerequisite_skill"))))
    blocks.append(Block("kv", label="Why students struggle", text=_or_blank(doc.get("why_students_struggle"))))

    blocks.append(Block("h2", "Diagnostic"))
    blocks.append(Block("p", _or_blank(get(doc, "diagnostic.directions"))))
    diagnostic_rows = [
        [str(item.get("prompt", "")), str(item.get("answer", "")),
         str(item.get("misconception_if_wrong", ""))]
        for item in (get(doc, "diagnostic.items") or []) if isinstance(item, dict)
    ]
    if diagnostic_rows:
        blocks.append(Block("table",
                            header=["Item", "Answer", "If wrong, the student likely..."],
                            rows=diagnostic_rows))

    blocks.append(Block("h2", f"Mini-lesson ({get(doc, 'mini_lesson.minutes') or 0} min)"))
    script = get(doc, "mini_lesson.teacher_script") or []
    if script:
        blocks.append(Block("ul", items=[str(line) for line in script]))
    blocks.append(Block("kv", label="Model problem", text=_or_blank(get(doc, "mini_lesson.model_problem"))))
    blocks.append(Block("kv", label="Visual or manipulative",
                        text=_or_blank(get(doc, "mini_lesson.visual_or_manipulative"))))

    for section, title, columns in (
        ("guided_practice", "Guided practice", ["Item", "Answer", "Scaffold if the student stalls"]),
        ("independent_practice", "Independent practice", ["Item", "Answer"]),
    ):
        items = get(doc, f"{section}.items") or []
        blocks.append(Block("h2", title))
        directions = _or_blank(get(doc, f"{section}.directions"))
        if directions:
            blocks.append(Block("p", directions))
        if items:
            rows = []
            for item in items:
                if not isinstance(item, dict):
                    continue
                row = [str(item.get("prompt", "")), str(item.get("answer", ""))]
                if len(columns) == 3:
                    row.append(str(item.get("scaffold", "")))
                rows.append(row)
            if rows:
                blocks.append(Block("table", header=columns, rows=rows))

    blocks.append(Block("h2", "Progress monitoring"))
    for label, key in (
        ("Probe", "progress_monitoring.probe"),
        ("Answer key", "progress_monitoring.answer_key"),
        ("Mastery criteria", "progress_monitoring.mastery_criteria"),
        ("Cadence", "progress_monitoring.cadence"),
    ):
        blocks.append(Block("kv", label=label, text=_or_blank(get(doc, key))))

    if doc.get("family_note"):
        blocks.append(Block("h2", "Note for families"))
        blocks.append(Block("p", str(doc["family_note"])))
    if doc.get("teacher_notes"):
        blocks.append(Block("h2", "Teacher notes"))
        blocks.append(Block("p", str(doc["teacher_notes"])))
    return blocks


def _media_brief_blocks(doc: dict[str, Any]) -> list[Block]:
    """Part D, laid out so a teacher can copy each prompt into its engine."""
    part_d = doc.get("part_d") or {}
    blocks = [Block("h2", "Part D — Media brief")]
    if not part_d:
        blocks.append(Block("note", "No media brief was produced. The package is incomplete "
                                    "without one.", tone="warn"))
        return blocks

    blocks.append(Block("kv", label="Students must see",
                        text=_or_blank(part_d.get("concept_one_liner"))))

    movie = part_d.get("motion_movie") or {}
    if any(movie.values()):
        blocks.append(Block("h3", "Motion movie"))
        blocks.append(Block(
            "table", header=["Beat", "What happens"],
            rows=[
                ["1. Scene", str(movie.get("scene", ""))],
                ["2. Move", str(movie.get("move", ""))],
                ["3. Freeze frame", str(movie.get("freeze_frame", ""))],
                ["4. Talk-back", str(movie.get("talk_back", ""))],
            ],
        ))

    misconceptions = [str(m) for m in (part_d.get("misconceptions_to_show") or []) if str(m).strip()]
    if misconceptions:
        blocks.append(Block("h3", "Misconceptions the visual must expose"))
        blocks.append(Block("ul", items=misconceptions))

    use = part_d.get("classroom_use") or {}
    if any(use.values()):
        blocks.append(Block("h3", "Where it lands"))
        blocks.append(Block("kv", label="Hunter step", text=_or_blank(use.get("when_in_hunter"))))
        blocks.append(Block("kv", label="Minutes", text=str(use.get("minutes") or "--")))
        blocks.append(Block("kv", label="Grouping", text=_or_blank(use.get("grouping"))))
        blocks.append(Block("kv", label="Ask when it pauses",
                            text=_or_blank(use.get("teacher_move_after"))))

    if part_d.get("gemini_sim_prompt"):
        blocks.append(Block("h3", "Paste into Gemini (interactive simulation)"))
        blocks.append(Block("p", str(part_d["gemini_sim_prompt"])))

    pack = part_d.get("notebooklm_source_pack") or {}
    if pack.get("source_doc_markdown"):
        words = len(str(pack["source_doc_markdown"]).split())
        blocks.append(Block("h3", f"Paste into NotebookLM (source pack, {words} words)"))
        blocks.append(Block("kv", label="Title", text=_or_blank(pack.get("title"))))
        blocks.append(Block("kv", label="Audience", text=_or_blank(pack.get("audience"))))
        blocks.append(Block("kv", label="TEKS", text=_or_blank(pack.get("teks_block"))))
        blocks.append(Block("p", str(pack["source_doc_markdown"])))

    shots = [s for s in (part_d.get("veo_shot_list") or []) if isinstance(s, dict)]
    if shots:
        blocks.append(Block("h3", "Paste into Veo (shot list)"))
        blocks.append(Block(
            "table",
            header=["Shot", "Sec", "Purpose", "Prompt"],
            rows=[[str(s.get("shot_id", "")), str(s.get("seconds", "")),
                   str(s.get("purpose", "")), str(s.get("prompt", ""))] for s in shots],
        ))
    return blocks


def _provenance_blocks(result: GenerationResult) -> list[Block]:
    provenance = result.document.get("_provenance", {})
    blocks = [Block("hr"), Block("h2", "Provenance and checks")]

    blocks.append(Block("kv", label="Generated by", text=provenance.get("backend", "")))
    if provenance.get("unit_source"):
        blocks.append(Block("kv", label="Pacing source", text=provenance["unit_source"]))
    if result.citations:
        blocks.append(Block("h3", "District sources used"))
        blocks.append(Block("ul", items=result.citations))

    checks = result.report
    status = "all checks passed" if checks.ok else f"{len(checks.errors)} check(s) not passing"
    blocks.append(Block("kv", label="Validation", text=f"{status} ({len(checks.checked)} run)"))
    if checks.errors:
        blocks.append(Block("ul", items=[str(v) for v in checks.errors]))
    if checks.warnings:
        blocks.append(Block("h3", "Warnings"))
        blocks.append(Block("ul", items=[str(v) for v in checks.warnings]))
    if provenance.get("automatic_fixes"):
        blocks.append(Block("h3", "Applied automatically"))
        blocks.append(Block("ul", items=list(provenance["automatic_fixes"])))
    if provenance.get("notes"):
        blocks.append(Block("h3", "Notes on the source documents"))
        blocks.append(Block("ul", items=list(provenance["notes"])))
    return blocks


def _or_blank(value: Any) -> str:
    text = "" if value is None else str(value).strip()
    return text or "--"


# ----------------------------------------------------------------------
# Markdown
# ----------------------------------------------------------------------
def to_markdown(result: GenerationResult) -> str:
    return to_markdown_blocks(blocks_for(result))


def to_markdown_blocks(blocks: list[Block]) -> str:
    """Render a block list as Markdown. Shared with the week glance."""
    lines: list[str] = []
    for block in blocks:
        if block.kind == "h1":
            lines += [f"# {block.text}", ""]
        elif block.kind == "h2":
            lines += ["", f"## {block.text}", ""]
        elif block.kind == "h3":
            lines += [f"### {block.text}", ""]
        elif block.kind == "p":
            if block.text.strip():
                lines += [block.text, ""]
        elif block.kind == "kv":
            lines += [f"**{block.label}:** {block.text}".rstrip(), ""]
        elif block.kind == "ul":
            lines += [f"- {item}" for item in block.items] + [""]
        elif block.kind == "table":
            lines += _markdown_table(block.header, block.rows) + [""]
        elif block.kind == "note":
            prefix = "!!" if block.tone == "warn" else "!"
            lines += [f"> {prefix} {block.text}", ""]
        elif block.kind == "hr":
            lines += ["---", ""]
    text = "\n".join(lines)
    while "\n\n\n" in text:
        text = text.replace("\n\n\n", "\n\n")
    return text.strip() + "\n"


def _markdown_table(header: list[str], rows: list[list[str]]) -> list[str]:
    if not header:
        return []
    escape = lambda cell: str(cell).replace("|", "\\|").replace("\n", "<br>")  # noqa: E731
    out = ["| " + " | ".join(escape(h) for h in header) + " |",
           "|" + "|".join("---" for _ in header) + "|"]
    for row in rows:
        padded = list(row) + [""] * (len(header) - len(row))
        out.append("| " + " | ".join(escape(cell) for cell in padded[: len(header)]) + " |")
    return out


# ----------------------------------------------------------------------
# HTML
# ----------------------------------------------------------------------
_CSS = """
:root { color-scheme: light; }
* { box-sizing: border-box; }
body { margin: 0; padding: 2.5rem 1.5rem; background: #f6f6f4; color: #1a1a1a;
       font: 16px/1.6 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
main { max-width: 52rem; margin: 0 auto; background: #fff; padding: 2.5rem 3rem 3rem;
       border: 1px solid #e2e2dd; border-radius: 6px; }
h1 { font-size: 1.85rem; margin: 0 0 .35rem; letter-spacing: -.01em; }
h2 { font-size: 1.2rem; margin: 2rem 0 .6rem; padding-bottom: .3rem; border-bottom: 2px solid #e2e2dd; }
h3 { font-size: 1rem; margin: 1.3rem 0 .4rem; color: #3a3a38; }
p { margin: .5rem 0; }
.subtitle { color: #6b6b66; margin-bottom: 1.2rem; }
.kv { margin: .4rem 0; }
.kv b { color: #3a3a38; }
ul { margin: .4rem 0 .8rem; padding-left: 1.3rem; }
li { margin: .25rem 0; }
table { border-collapse: collapse; width: 100%; margin: .6rem 0 1rem; font-size: .93rem; }
th, td { border: 1px solid #ddddd6; padding: .5rem .6rem; text-align: left; vertical-align: top; }
th { background: #f0f0ec; font-weight: 600; }
.note { padding: .8rem 1rem; border-radius: 4px; margin: 1rem 0; font-size: .95rem; }
.note.info { background: #eef4fb; border-left: 4px solid #4a7fb5; }
.note.warn { background: #fdf3e7; border-left: 4px solid #d08b2c; }
hr { border: none; border-top: 1px solid #e2e2dd; margin: 2.5rem 0 1rem; }
@media print {
  body { background: #fff; padding: 0; }
  main { border: none; padding: 0; max-width: none; }
  h2 { break-after: avoid; } tr { break-inside: avoid; }
}
"""


def to_html(result: GenerationResult) -> str:
    return to_html_blocks(blocks_for(result), str(result.document.get("title") or "Lesson"))


def to_html_blocks(blocks: list[Block], title: str = "Lesson") -> str:
    """Render a block list as a self-contained printable page."""
    parts: list[str] = []
    first_paragraph = True
    for block in blocks:
        if block.kind == "h1":
            parts.append(f"<h1>{_esc(block.text)}</h1>")
        elif block.kind == "h2":
            parts.append(f"<h2>{_esc(block.text)}</h2>")
        elif block.kind == "h3":
            parts.append(f"<h3>{_esc(block.text)}</h3>")
        elif block.kind == "p":
            if block.text.strip():
                css = ' class="subtitle"' if first_paragraph else ""
                parts.append(f"<p{css}>{_esc(block.text)}</p>")
                first_paragraph = False
        elif block.kind == "kv":
            value = f" {_esc(block.text)}" if block.text else ""
            parts.append(f'<p class="kv"><b>{_esc(block.label)}:</b>{value}</p>')
        elif block.kind == "ul":
            items = "".join(f"<li>{_esc(item)}</li>" for item in block.items)
            parts.append(f"<ul>{items}</ul>")
        elif block.kind == "table":
            parts.append(_html_table(block.header, block.rows))
        elif block.kind == "note":
            parts.append(f'<div class="note {block.tone}">{_esc(block.text)}</div>')
        elif block.kind == "hr":
            parts.append("<hr>")
    body = "\n".join(parts)
    return (
        "<!doctype html>\n<html lang=\"en\">\n<head>\n<meta charset=\"utf-8\">\n"
        "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n"
        f"<title>{_esc(title)}</title>\n<style>{_CSS}</style>\n</head>\n"
        f"<body>\n<main>\n{body}\n</main>\n</body>\n</html>\n"
    )


def _html_table(header: list[str], rows: list[list[str]]) -> str:
    head = "".join(f"<th>{_esc(cell)}</th>" for cell in header)
    body = ""
    for row in rows:
        padded = list(row) + [""] * (len(header) - len(row))
        body += "<tr>" + "".join(f"<td>{_esc(cell)}</td>" for cell in padded[: len(header)]) + "</tr>"
    return f"<table><thead><tr>{head}</tr></thead><tbody>{body}</tbody></table>"


def _esc(value: Any) -> str:
    return _html.escape(str(value), quote=False).replace("\n", "<br>")


# ----------------------------------------------------------------------
# Word (.docx) -- Office Open XML written directly
# ----------------------------------------------------------------------
_CONTENT_TYPES = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
</Types>"""

_ROOT_RELS = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>"""

_DOC_RELS = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>"""

_STYLES = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/>
<w:pPr><w:spacing w:after="120"/></w:pPr>
<w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/><w:sz w:val="22"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:basedOn w:val="Normal"/>
<w:pPr><w:spacing w:before="240" w:after="120"/><w:outlineLvl w:val="0"/></w:pPr>
<w:rPr><w:b/><w:sz w:val="36"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Heading2"><w:name w:val="heading 2"/><w:basedOn w:val="Normal"/>
<w:pPr><w:spacing w:before="240" w:after="100"/><w:outlineLvl w:val="1"/></w:pPr>
<w:rPr><w:b/><w:sz w:val="28"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Heading3"><w:name w:val="heading 3"/><w:basedOn w:val="Normal"/>
<w:pPr><w:spacing w:before="180" w:after="80"/><w:outlineLvl w:val="2"/></w:pPr>
<w:rPr><w:b/><w:sz w:val="24"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="ListBullet"><w:name w:val="List Bullet"/><w:basedOn w:val="Normal"/>
<w:pPr><w:ind w:left="440" w:hanging="220"/><w:spacing w:after="60"/></w:pPr></w:style>
</w:styles>"""


def to_docx(result: GenerationResult, path: str | Path) -> Path:
    return to_docx_blocks(blocks_for(result), path)


def to_docx_blocks(blocks: list[Block], path: str | Path) -> Path:
    """Write a block list as Office Open XML. Shared with the week glance."""
    target = Path(path)
    target.parent.mkdir(parents=True, exist_ok=True)
    body = "".join(_docx_block(block) for block in blocks)
    document = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">'
        f"<w:body>{body}"
        '<w:sectPr><w:pgSz w:w="12240" w:h="15840"/>'
        '<w:pgMar w:top="1080" w:right="1080" w:bottom="1080" w:left="1080"/></w:sectPr>'
        "</w:body></w:document>"
    )
    with zipfile.ZipFile(target, "w", zipfile.ZIP_DEFLATED) as archive:
        archive.writestr("[Content_Types].xml", _CONTENT_TYPES)
        archive.writestr("_rels/.rels", _ROOT_RELS)
        archive.writestr("word/_rels/document.xml.rels", _DOC_RELS)
        archive.writestr("word/styles.xml", _STYLES)
        archive.writestr("word/document.xml", document)
    return target


def _docx_block(block: Block) -> str:
    if block.kind in {"h1", "h2", "h3"}:
        style = {"h1": "Heading1", "h2": "Heading2", "h3": "Heading3"}[block.kind]
        return _docx_paragraph(block.text, style=style)
    if block.kind == "p":
        return _docx_paragraph(block.text) if block.text.strip() else ""
    if block.kind == "kv":
        return _docx_paragraph_runs([(f"{block.label}: ", True), (block.text, False)])
    if block.kind == "ul":
        return "".join(_docx_paragraph(f"\u2022  {item}", style="ListBullet") for item in block.items)
    if block.kind == "note":
        return _docx_paragraph_runs([("Note: ", True), (block.text, False)])
    if block.kind == "table":
        return _docx_table(block.header, block.rows)
    if block.kind == "hr":
        return _docx_paragraph("")
    return ""


def _docx_paragraph(text: str, style: str = "") -> str:
    return _docx_paragraph_runs([(text, False)], style)


def _docx_paragraph_runs(runs: list[tuple[str, bool]], style: str = "") -> str:
    properties = f'<w:pPr><w:pStyle w:val="{style}"/></w:pPr>' if style else ""
    body = ""
    for text, bold in runs:
        if not text:
            continue
        run_props = "<w:rPr><w:b/></w:rPr>" if bold else ""
        for index, line in enumerate(str(text).split("\n")):
            if index:
                body += "<w:r><w:br/></w:r>"
            body += f'<w:r>{run_props}<w:t xml:space="preserve">{_xml(line)}</w:t></w:r>'
    return f"<w:p>{properties}{body}</w:p>"


def _docx_table(header: list[str], rows: list[list[str]]) -> str:
    borders = (
        "<w:tblBorders>"
        + "".join(
            f'<w:{edge} w:val="single" w:sz="4" w:color="CCCCCC"/>'
            for edge in ("top", "left", "bottom", "right", "insideH", "insideV")
        )
        + "</w:tblBorders>"
    )
    properties = f'<w:tblPr><w:tblW w:w="5000" w:type="pct"/>{borders}</w:tblPr>'

    def row_xml(cells: list[str], bold: bool) -> str:
        out = "<w:tr>"
        for cell in cells:
            out += (
                '<w:tc><w:tcPr><w:tcW w:w="0" w:type="auto"/></w:tcPr>'
                + _docx_paragraph_runs([(cell, bold)])
                + "</w:tc>"
            )
        return out + "</w:tr>"

    body = row_xml(header, True)
    for row in rows:
        padded = list(row) + [""] * (len(header) - len(row))
        body += row_xml(padded[: len(header)], False)
    return f"<w:tbl>{properties}{body}</w:tbl>"


def _xml(text: str) -> str:
    return (
        str(text)
        .replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
        .replace('"', "&quot;")
    )


# ----------------------------------------------------------------------
def suggested_filename(result: GenerationResult) -> str:
    request = result.request
    parts = [
        f"grade{request.grade}",
        request.subject,
        result.unit.unit_name if result.unit else "",
        request.material if request.material != "lesson" else f"lesson{request.lesson_number}",
    ]
    return slugify("-".join(part for part in parts if part), max_len=80)


def write_all(result: GenerationResult, output_dir: str | Path, stem: str = "") -> dict[str, Path]:
    """Write markdown, HTML, Word, and the raw JSON side by side."""
    import json

    directory = Path(output_dir)
    directory.mkdir(parents=True, exist_ok=True)
    stem = stem or suggested_filename(result)

    written: dict[str, Path] = {}
    markdown_path = directory / f"{stem}.md"
    markdown_path.write_text(to_markdown(result), encoding="utf-8")
    written["markdown"] = markdown_path

    html_path = directory / f"{stem}.html"
    html_path.write_text(to_html(result), encoding="utf-8")
    written["html"] = html_path

    written["docx"] = to_docx(result, directory / f"{stem}.docx")

    json_path = directory / f"{stem}.json"
    json_path.write_text(
        json.dumps(result.to_dict(), indent=2, ensure_ascii=False, default=str), encoding="utf-8"
    )
    written["json"] = json_path
    return written

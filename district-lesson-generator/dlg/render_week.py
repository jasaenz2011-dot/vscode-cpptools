"""Render a :class:`dlg.week.WeekGlance` as the one-page overview.

Same block model as :mod:`dlg.render`, so Markdown, HTML and Word all come out
of one structural pass. The overview table is the page a teacher pins up; the
per-day media briefs follow it, one printable block each.
"""

from __future__ import annotations

from pathlib import Path
from typing import Any

from .render import Block, _or_blank, to_docx_blocks, to_html_blocks, to_markdown_blocks
from .week import WeekGlance


def week_blocks(glance: WeekGlance) -> list[Block]:
    blocks: list[Block] = [
        Block("h1", f"{glance.unit} — week at a glance"),
        Block("p", f"Grade {glance.grade} {glance.subject.title()} · "
                   f"{glance.days_total} instructional days"),
    ]
    if glance.source:
        blocks.append(Block("kv", label="Source", text=glance.source))

    if glance.standards:
        blocks.append(Block("h2", "Standards this unit"))
        blocks.append(Block(
            "table", header=["Code", "District wording (verbatim)"],
            rows=[[s.get("code", ""), s.get("text", "")] for s in glance.standards],
        ))

    # --- the overview page itself -------------------------------------
    blocks.append(Block("h2", "The week"))
    blocks.append(Block(
        "table",
        header=["Day", "Topic", "Focus", "Spiraled", "Exit ticket measures", "Visual"],
        rows=[
            [
                str(day.day),
                day.topic,
                ", ".join(day.focus_standards),
                ", ".join(day.spiraled_standards) or "—",
                day.ticket_focus,
                (day.part_d.get("classroom_use") or {}).get("when_in_hunter", "—"),
            ]
            for day in glance.days
        ],
    ))

    if glance.spiral_review:
        blocks.append(Block("kv", label="Spiral review", text=glance.spiral_review))
    if glance.assessment_plan:
        blocks.append(Block("kv", label="Assessment", text=glance.assessment_plan))

    # --- per-day media briefs -----------------------------------------
    blocks.append(Block("h2", "Media briefs by day"))
    for day in glance.days:
        part_d = day.part_d or {}
        use = part_d.get("classroom_use") or {}
        blocks.append(Block("h3", f"Day {day.day} — {day.topic}"))
        blocks.append(Block("kv", label="Focus", text=", ".join(day.focus_standards) or "—"))
        blocks.append(Block("kv", label="Students must see",
                            text=_or_blank(part_d.get("concept_one_liner"))))

        movie = part_d.get("motion_movie") or {}
        if any(movie.values()):
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
            blocks.append(Block("kv", label="Misconceptions to expose", text=""))
            blocks.append(Block("ul", items=misconceptions))

        blocks.append(Block(
            "kv", label="Where it lands",
            text=f"{use.get('when_in_hunter', '—')} · {use.get('minutes', '—')} min · "
                 f"{use.get('grouping', '—')}",
        ))
        if use.get("teacher_move_after"):
            blocks.append(Block("kv", label="Ask when it pauses", text=str(use["teacher_move_after"])))
        if day.notebooklm_pack_id:
            blocks.append(Block("kv", label="NotebookLM pack", text=day.notebooklm_pack_id))

        if part_d.get("gemini_sim_prompt"):
            blocks.append(Block("kv", label="Paste into Gemini", text=""))
            blocks.append(Block("p", str(part_d["gemini_sim_prompt"])))

        shots = [s for s in (part_d.get("veo_shot_list") or []) if isinstance(s, dict)]
        if shots:
            blocks.append(Block(
                "table", header=["Shot", "Sec", "Purpose", "Veo prompt"],
                rows=[[str(s.get("shot_id", "")), str(s.get("seconds", "")),
                       str(s.get("purpose", "")), str(s.get("prompt", ""))] for s in shots],
            ))

    # --- the shared source packs --------------------------------------
    if glance.notebooklm_packs:
        blocks.append(Block("h2", "NotebookLM source packs"))
        blocks.append(Block(
            "p",
            "A narrated explainer is grounded on a concept, not a calendar day, so days "
            "teaching the same standard share a pack.",
        ))
        for entry in glance.notebooklm_packs:
            words = len(str(entry.get("source_doc_markdown", "")).split())
            blocks.append(Block("h3", f"{entry.get('pack_id', '')} — {entry.get('title', '')} "
                                      f"({words} words)"))
            blocks.append(Block("kv", label="TEKS", text=_or_blank(entry.get("teks_block"))))
            blocks.append(Block("p", str(entry.get("source_doc_markdown", ""))))

    if glance.teacher_notes:
        blocks.append(Block("h2", "Teacher notes"))
        blocks.append(Block("p", glance.teacher_notes))
    return blocks


def week_to_markdown(glance: WeekGlance) -> str:
    return to_markdown_blocks(week_blocks(glance))


def week_to_html(glance: WeekGlance) -> str:
    return to_html_blocks(week_blocks(glance), f"{glance.unit} — week at a glance")


def write_week(glance: WeekGlance, output_dir: str | Path, stem: str = "") -> dict[str, Path]:
    """Write the glance as Markdown, HTML, Word and JSON."""
    import json

    from .util import slugify

    directory = Path(output_dir)
    directory.mkdir(parents=True, exist_ok=True)
    stem = stem or slugify(f"grade{glance.grade}-{glance.subject}-{glance.unit}-week")

    blocks = week_blocks(glance)
    written: dict[str, Path] = {}

    markdown_path = directory / f"{stem}.md"
    markdown_path.write_text(to_markdown_blocks(blocks), encoding="utf-8")
    written["markdown"] = markdown_path

    html_path = directory / f"{stem}.html"
    html_path.write_text(
        to_html_blocks(blocks, f"{glance.unit} — week at a glance"), encoding="utf-8"
    )
    written["html"] = html_path

    written["docx"] = to_docx_blocks(blocks, directory / f"{stem}.docx")

    json_path = directory / f"{stem}.json"
    json_path.write_text(
        json.dumps(glance.to_dict(), indent=2, ensure_ascii=False), encoding="utf-8"
    )
    written["json"] = json_path
    return written

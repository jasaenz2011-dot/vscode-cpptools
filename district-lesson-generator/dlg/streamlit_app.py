"""Optional Streamlit interface -- the same pipeline, a nicer widget set.

    pip install streamlit
    streamlit run dlg/streamlit_app.py

The built-in ``dlg serve`` interface does the same job with no install, so this
file is a convenience for people who already work in Streamlit, not a
dependency of the system.
"""

from __future__ import annotations

import sys
from pathlib import Path

if __package__ in (None, ""):  # allow `streamlit run dlg/streamlit_app.py`
    sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from dlg.config import Config                     # noqa: E402
from dlg.models import LessonRequest              # noqa: E402
from dlg.pipeline import Pipeline                 # noqa: E402
from dlg.render import suggested_filename, to_html, to_markdown, to_docx  # noqa: E402


def main() -> None:
    import streamlit as st

    st.set_page_config(page_title="District Lesson Generator", page_icon="📚", layout="centered")

    config = Config.load(".")
    try:
        pipeline = _pipeline(config)
    except FileNotFoundError as exc:
        st.error(f"{exc}\n\nRun `dlg ingest` first.")
        return

    info = pipeline.info()
    st.title(f"{config.district_name} lesson generator")
    st.caption(
        f"{info.documents} district documents · {info.standards} standards · "
        f"{info.units} scope-and-sequence units · model: {info.backend}"
    )

    left, right = st.columns(2)
    grade = left.selectbox("Grade", info.grades or [str(n) for n in range(1, 13)])
    subject = right.selectbox("Subject", info.subjects or ["math", "ela", "science"])

    units = pipeline.store.units_for(grade, subject)
    unit_labels = ["(let the curriculum mapper decide)"] + [unit.label() for unit in units]
    chosen = st.selectbox("Unit", unit_labels)
    unit = "" if chosen == unit_labels[0] else chosen

    left, right = st.columns(2)
    week = left.text_input("Week or date (optional)", placeholder="6  or  2026-10-05")
    lesson_number = right.number_input("Lesson number in unit", min_value=1, value=1, step=1)

    left, right = st.columns(2)
    minutes = left.number_input("Minutes", min_value=10, max_value=180, value=60, step=5)
    material = right.selectbox("Material", ["lesson", "intervention"],
                               format_func=lambda v: "Core lesson" if v == "lesson" else "Intervention packet")
    tier = st.selectbox("Intensity", ["core", "tier2", "tier3"]) if material == "intervention" else "core"
    notes = st.text_area("Anything about this class (optional)",
                         placeholder="6 emergent bilingual students, 3 with IEPs, 45-minute block")

    if not st.button("Generate", type="primary"):
        return

    request = LessonRequest(
        grade=grade, subject=subject, unit=unit, week=week,
        lesson_number=int(lesson_number), duration_minutes=int(minutes),
        material=material, tier=tier, student_notes=notes,
    )
    with st.spinner("Mapping the unit, resolving standards, drafting, and checking alignment..."):
        result = pipeline.generate(request)

    context = result.context_report
    st.caption(
        f"{result.attempts} pass(es) · context {context.get('used_tokens')}/"
        f"{context.get('budget_tokens')} tokens · {len(result.report.checked)} checks run"
    )
    for violation in result.report.errors:
        st.warning(str(violation))
    for violation in result.report.warnings:
        st.info(str(violation))

    stem = suggested_filename(result)
    markdown = to_markdown(result)
    docx_path = to_docx(result, Path(config.output_path) / f"{stem}.docx")

    columns = st.columns(3)
    columns[0].download_button("Markdown", markdown, file_name=f"{stem}.md")
    columns[1].download_button("HTML", to_html(result), file_name=f"{stem}.html")
    columns[2].download_button(
        "Word", docx_path.read_bytes(), file_name=f"{stem}.docx",
        mime="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    )

    st.markdown("---")
    st.markdown(markdown)


def _pipeline(config: Config) -> Pipeline:
    import streamlit as st

    @st.cache_resource(show_spinner="Loading the district index...")
    def build(root: str) -> Pipeline:
        return Pipeline(Config.load(root))

    return build(config.root)


if __name__ == "__main__":
    main()

"""Layer 3c -- the click-a-grade local interface.

A single-file web app on :mod:`http.server`, so it runs with nothing installed
and nothing leaves the machine. Pick a grade, a subject, and a week; press the
button; get a lesson with download links for Markdown, Word, HTML, and JSON.

Generation is synchronous. On a local 8B model a lesson takes roughly 20-60
seconds, and this is a single-teacher tool, so a spinner and one blocking
request is the honest design rather than a job queue that adds moving parts.
(A Streamlit version of the same interface is in ``dlg/streamlit_app.py`` for
anyone who prefers it.)
"""

from __future__ import annotations

import html
import json
import traceback
import urllib.parse
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from .config import Config
from .models import LessonRequest
from .pipeline import Pipeline
from .render import suggested_filename, to_html, write_all
from .util import get_logger

log = get_logger("dlg.server")

_PAGE_CSS = """
:root { color-scheme: light; }
* { box-sizing: border-box; }
body { margin:0; padding:2rem 1rem 4rem; background:#f6f6f4; color:#1a1a1a;
  font:16px/1.55 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
main { max-width:46rem; margin:0 auto; }
header h1 { font-size:1.5rem; margin:0 0 .2rem; }
header p { color:#6b6b66; margin:0 0 1.5rem; }
.card { background:#fff; border:1px solid #e2e2dd; border-radius:6px; padding:1.5rem; margin-bottom:1.25rem; }
.grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(11rem,1fr)); gap:1rem; }
label { display:block; font-size:.85rem; font-weight:600; color:#3a3a38; margin-bottom:.3rem; }
input, select, textarea { width:100%; padding:.5rem .6rem; font:inherit; font-size:.95rem;
  border:1px solid #ccccc4; border-radius:4px; background:#fff; }
textarea { min-height:4.5rem; resize:vertical; }
button { margin-top:1.25rem; padding:.65rem 1.4rem; font:inherit; font-weight:600; color:#fff;
  background:#1f6f4a; border:none; border-radius:4px; cursor:pointer; }
button:hover { background:#195c3d; }
button[disabled] { background:#8ba99a; cursor:progress; }
.meta { font-size:.85rem; color:#6b6b66; }
.meta code { background:#f0f0ec; padding:.1rem .3rem; border-radius:3px; }
.downloads a { display:inline-block; margin:0 .6rem .5rem 0; padding:.35rem .7rem; font-size:.9rem;
  background:#f0f0ec; border:1px solid #ddddd6; border-radius:4px; color:#1a1a1a; text-decoration:none; }
.downloads a:hover { background:#e6e6e0; }
.issue { background:#fdf3e7; border-left:4px solid #d08b2c; padding:.7rem 1rem; margin:.5rem 0;
  border-radius:4px; font-size:.92rem; }
.error { background:#fbeeee; border-left:4px solid #b54a4a; padding:.9rem 1rem; border-radius:4px; }
iframe { width:100%; height:70vh; border:1px solid #e2e2dd; border-radius:6px; background:#fff; }
.spinner { display:none; margin-top:1rem; color:#6b6b66; font-size:.9rem; }
form.busy .spinner { display:block; }
"""

_FORM_SCRIPT = """
<script>
document.querySelector('form').addEventListener('submit', function (event) {
  event.target.classList.add('busy');
  var button = event.target.querySelector('button');
  button.disabled = true;
  button.textContent = 'Generating...';
});
</script>
"""


def _page(title: str, body: str) -> bytes:
    return (
        "<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\">"
        "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">"
        f"<title>{html.escape(title)}</title><style>{_PAGE_CSS}</style></head>"
        f"<body><main>{body}</main></body></html>"
    ).encode("utf-8")


def _options(values: list[str], selected: str = "", blank: str = "") -> str:
    out = f'<option value="">{html.escape(blank)}</option>' if blank else ""
    for value in values:
        mark = " selected" if value == selected else ""
        out += f'<option value="{html.escape(value)}"{mark}>{html.escape(value)}</option>'
    return out


class Handler(BaseHTTPRequestHandler):
    config: Config
    pipeline: Pipeline

    server_version = "dlg"

    def log_message(self, fmt: str, *args: object) -> None:  # quieter default logging
        log.info("%s - %s", self.address_string(), fmt % args)

    # -- routing ------------------------------------------------------
    def do_GET(self) -> None:  # noqa: N802
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path == "/":
            self._send(200, _page("District Lesson Generator", self._form()), "text/html")
        elif parsed.path == "/api/units":
            query = urllib.parse.parse_qs(parsed.query)
            units = self.pipeline.store.units_for(
                (query.get("grade") or [""])[0], (query.get("subject") or [""])[0]
            )
            payload = [
                {"unit_id": u.unit_id, "label": u.label(), "weeks": u.weeks,
                 "standards": u.standard_codes}
                for u in units
            ]
            self._send(200, json.dumps(payload).encode("utf-8"), "application/json")
        elif parsed.path.startswith("/download/"):
            self._serve_download(parsed.path[len("/download/"):])
        else:
            self._send(404, _page("Not found", "<p>Not found.</p>"), "text/html")

    def do_POST(self) -> None:  # noqa: N802
        if urllib.parse.urlparse(self.path).path != "/generate":
            self._send(404, _page("Not found", "<p>Not found.</p>"), "text/html")
            return
        length = int(self.headers.get("Content-Length") or 0)
        form = urllib.parse.parse_qs(self.rfile.read(length).decode("utf-8"))

        def field(name: str, default: str = "") -> str:
            return (form.get(name) or [default])[0].strip()

        request = LessonRequest(
            grade=field("grade"),
            subject=field("subject"),
            unit=field("unit"),
            week=field("week"),
            lesson_number=int(field("lesson", "1") or 1),
            duration_minutes=int(field("minutes", "60") or 60),
            material=field("material", "lesson"),
            tier=field("tier", "core"),
            student_notes=field("notes"),
        )
        try:
            result = self.pipeline.generate(request)
        except Exception as exc:  # surfaced to the teacher, not swallowed
            log.error("generation failed: %s", traceback.format_exc())
            body = (
                self._form(request)
                + f'<div class="card error"><b>Generation failed.</b><br>{html.escape(str(exc))}</div>'
            )
            self._send(500, _page("Generation failed", body), "text/html")
            return

        stem = suggested_filename(result)
        written = write_all(result, self.config.output_path, stem)
        self._send(200, _page(f"Lesson - {stem}", self._result(result, stem, written)), "text/html")

    # -- views --------------------------------------------------------
    def _form(self, request: LessonRequest | None = None) -> str:
        info = self.pipeline.info()
        grades = info.grades or [str(n) for n in range(1, 13)]
        subjects = info.subjects or ["math", "ela", "science", "social studies"]
        current = request or LessonRequest(grade="", subject="")

        return f"""
<header>
  <h1>{html.escape(self.config.district_name)} lesson generator</h1>
  <p>Grounded in {info.documents} district documents &middot; {info.standards} standards
     &middot; {info.units} scope-and-sequence units</p>
</header>
<form class="card" method="post" action="/generate">
  <div class="grid">
    <div>
      <label for="grade">Grade</label>
      <select id="grade" name="grade" required>{_options(grades, current.grade, "Select")}</select>
    </div>
    <div>
      <label for="subject">Subject</label>
      <select id="subject" name="subject" required>{_options(subjects, current.subject, "Select")}</select>
    </div>
    <div>
      <label for="week">Week or date <span class="meta">(optional)</span></label>
      <input id="week" name="week" value="{html.escape(current.week)}" placeholder="e.g. 6 or 2026-10-05">
    </div>
    <div>
      <label for="unit">Unit <span class="meta">(optional)</span></label>
      <input id="unit" name="unit" value="{html.escape(current.unit)}" placeholder="name or number">
    </div>
    <div>
      <label for="lesson">Lesson number in unit</label>
      <input id="lesson" name="lesson" type="number" min="1" value="{current.lesson_number}">
    </div>
    <div>
      <label for="minutes">Minutes</label>
      <input id="minutes" name="minutes" type="number" min="10" step="5" value="{current.duration_minutes}">
    </div>
    <div>
      <label for="material">Material</label>
      <select id="material" name="material">
        <option value="lesson">Core lesson</option>
        <option value="intervention">Intervention packet</option>
      </select>
    </div>
    <div>
      <label for="tier">Intensity</label>
      <select id="tier" name="tier">
        <option value="core">Core / whole class</option>
        <option value="tier2">Tier 2 small group</option>
        <option value="tier3">Tier 3 intensive</option>
      </select>
    </div>
  </div>
  <div style="margin-top:1rem">
    <label for="notes">Anything about this class <span class="meta">(optional)</span></label>
    <textarea id="notes" name="notes"
      placeholder="e.g. 6 emergent bilingual students, 3 with IEPs, 45-minute block">{html.escape(current.student_notes)}</textarea>
  </div>
  <button type="submit">Generate</button>
  <div class="spinner">Working. A local model usually takes 20-60 seconds.</div>
</form>
<div class="card meta">
  <b>Model:</b> {html.escape(info.backend)}<br>
  <b>Embeddings:</b> {html.escape(info.embeddings)}<br>
  <b>Index:</b> {info.chunks} chunks from {info.documents} files.
  Re-run <code>dlg ingest</code> after you add documents.
</div>
{_FORM_SCRIPT}
"""

    def _result(self, result, stem: str, written: dict[str, Path]) -> str:
        report = result.report
        context = result.context_report
        issues = "".join(
            f'<div class="issue">{html.escape(str(violation))}</div>'
            for violation in report.violations
        )
        links = "".join(
            f'<a href="/download/{urllib.parse.quote(path.name)}">{label}</a>'
            for label, path in written.items()
        )
        preview = to_html(result).replace("</", "<\\/")
        return f"""
<header>
  <h1>{html.escape(str(result.document.get('title', 'Lesson')))}</h1>
  <p><a href="/">&larr; generate another</a></p>
</header>
<div class="card">
  <div class="downloads">{links}</div>
  <p class="meta">
    {html.escape(result.backend)} &middot; {result.attempts} pass(es) &middot;
    context {context.get('used_tokens')}/{context.get('budget_tokens')} tokens &middot;
    {len(report.checked)} checks run, {len(report.errors)} not passing
  </p>
  {issues}
</div>
<div class="card">
  <iframe srcdoc="{html.escape(preview, quote=True)}" title="Lesson preview"></iframe>
</div>
"""

    # -- helpers ------------------------------------------------------
    def _serve_download(self, name: str) -> None:
        safe = Path(urllib.parse.unquote(name)).name
        path = self.config.output_path / safe
        if not path.is_file():
            self._send(404, b"not found", "text/plain")
            return
        types = {
            ".md": "text/markdown; charset=utf-8",
            ".html": "text/html; charset=utf-8",
            ".json": "application/json; charset=utf-8",
            ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        }
        content_type = types.get(path.suffix, "application/octet-stream")
        data = path.read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(data)))
        self.send_header("Content-Disposition", f'attachment; filename="{safe}"')
        self.end_headers()
        self.wfile.write(data)

    def _send(self, status: int, body: bytes, content_type: str) -> None:
        self.send_response(status)
        self.send_header("Content-Type", f"{content_type}; charset=utf-8"
                         if "charset" not in content_type else content_type)
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


def serve(config: Config, host: str = "127.0.0.1", port: int = 8765) -> None:
    pipeline = Pipeline(config)
    Handler.config = config
    Handler.pipeline = pipeline
    config.output_path.mkdir(parents=True, exist_ok=True)

    server = ThreadingHTTPServer((host, port), Handler)
    info = pipeline.info()
    print(f"District Lesson Generator -> http://{host}:{port}")
    print(f"  model:      {info.backend}")
    print(f"  index:      {info.documents} documents, {info.chunks} chunks")
    print(f"  grades:     {', '.join(info.grades) or 'none detected'}")
    print("  Ctrl-C to stop.")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nstopped.")
    finally:
        server.server_close()

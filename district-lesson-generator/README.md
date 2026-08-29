# District Lesson Generator

A local-first system that turns **your district's own** scope and sequence,
standards export, and resource library into standards-aligned lesson plans and
intervention materials.

Pick a grade and a subject. Get a **complete printable package** — cited to the
exact row of your pacing guide, quoting your standards verbatim, and telling you
which of its own quality checks it failed.

Every output has three parts, enforced by the validator, never optional:

- **Part A** — a full Madeline Hunter lesson, all 8 steps, never skipped or merged
- **Part B** — student pages the children actually write on
- **Part C** — a STAAR-level exit ticket with a teacher answer key

Nothing leaves the machine. Nothing is required beyond Python 3.9+.

```
corpus/                              output/
├── scope_and_sequence.xlsx          ├── grade5-math-fractions-lesson1.md
├── teks_grade5_math.csv    ──dlg──▶ ├── ...html   (print-ready)
├── resource_library.pdf             ├── ...docx   (Word, opens anywhere)
└── intervention_menu.docx           └── ...json   (the structured record)
```

---

## Quick start

```bash
cd district-lesson-generator

python3 -m dlg init        # creates dlg.config.json, corpus/, output/
python3 -m dlg ingest      # reads corpus/, builds the index
python3 -m dlg serve       # http://127.0.0.1:8765 -- click a grade, get a lesson
```

`init` seeds `corpus/` with a small sample so you can see the whole thing work
before you touch real files. **Replace those samples with your district's
documents** — they are illustrative, not an official standards export.

Prefer the command line?

```bash
python3 -m dlg generate --grade 5 --subject math --week 9
python3 -m dlg generate --grade 5 --subject math --unit 3 \
        --material intervention --tier tier2 --minutes 30
```

### Adding a local model

Everything above runs with no model at all, in **scaffold mode**: real
standards, real pacing, and real district excerpts laid into the 8-step Hunter
frame, with the generative sections left blank and every one of them flagged by
the quality gate. To fill them in:

```bash
# https://ollama.com
ollama pull llama3.1:8b        # the writer
ollama pull nomic-embed-text   # better retrieval than the built-in fallback

python3 -m dlg ingest --force  # re-embed with the new model
python3 -m dlg generate --grade 5 --subject math --week 9
```

`dlg` finds Ollama on its own. `python3 -m dlg doctor` says what it found.

---

## Feeding it your documents

Drop files anywhere under `corpus/` — subfolders are fine — and run
`dlg ingest`. Supported: `.csv` `.tsv` `.xlsx` `.docx` `.pdf` `.md` `.txt`
`.html` `.json`.

Files are classified automatically, but the parse quality depends on shape:

| What you have | Best format | Columns it looks for |
|---|---|---|
| Scope and sequence | CSV or XLSX | unit, weeks, grade, subject, standards, focus, assessment, resources |
| Standards export | CSV or XLSX | code, text (plus grade, subject, strand, level) |
| Resource library, routines, intervention menu | anything | — indexed as prose |

Column names are matched loosely: `Student Expectation Code`, `TEKS`, `Standard
ID`, and `Code` all resolve to the same field. A PDF pacing guide works, but a
spreadsheet parses into clean rows and produces better citations.

### What it copes with in real exports

Validated against a K–8 district's full 2026-27 scope and sequence — 42
spreadsheets across Math, ELAR, Science, Social Studies, CTE and Algebra I,
plus the state's published standards — which parsed to 624 units and 1,640
standards in about six seconds:

- **Headers that are not on the first row.** A title banner, a copyright line
  and a merged date row above the real header are normal; the header is found
  by scanning, and rows of prose are rejected as candidates.
- **Standards packed into one cell.** A `TEKS` column reading
  `5.3B Multiply with fluency… 5.3C Solve with proficiency…` is split back into
  separate standards, each keeping the district's exact wording — so a scope
  and sequence doubles as a standards source and the codes resolve to real text.
- **Every filename convention.** `5th Grade Math`, `grade5_math`, `Kinder`,
  `Kindergarten`, `Algebra I (8th-VT)` all resolve to a grade.
- **Published standards documents, where the code is never written down.** In
  the official TEKS, `(K)` under knowledge-and-skills `(3)` in Grade 5
  Mathematics *is* `5.3K` — a plain code scan finds nothing. Codes are composed
  from the document's hierarchy, giving authoritative wording for every
  standard.
- **Codes that repeat across subjects.** TEKS `8.10C` is a genuinely different
  standard in math, science, social studies *and* ELA; lookups are grade- and
  subject-aware so one cannot be served in the other's place.
- **Spreadsheet noise.** Unit numbers arriving as `3.0`, named blocks such as
  `First 8 Days` that precede unit 1, and `Duration` columns holding `"8 days"`.

Every record cites its file, sheet and row, so check what it understood before
you trust it:

```bash
python3 -m dlg status                          # counts, grades, subjects, warnings
python3 -m dlg units --grade 5 --subject math  # every unit it parsed
python3 -m dlg standards 5.3H 5.3K             # verbatim text + where it came from
python3 -m dlg search "adding fractions"       # what retrieval actually returns
```

---

## The instructional standard is enforced, not suggested

Prompt wording alone does not stop a model from handing back a tidy outline with
no student pages. So the district's own quality gate runs as code on every
draft, and a failure sends the draft back to the model:

| Check | Fails when |
|---|---|
| `hunter_complete` | any of the 8 steps has no teacher moves |
| `duration_sum` | step minutes do not total the period |
| `objective_form` | the objective does not say how mastery is shown |
| `vocabulary_bounds` | fewer than 4 or more than 8 terms |
| `vocabulary_woven` | a term is listed but never used in Input, Modeling, Guided Practice or CFU |
| `high_order_questions` | a question is a bare *who / what / define / show* with no reasoning demand |
| `manipulatives` | a math lesson names none (everyday objects preferred) |
| `student_pages` | no page, or a page with no evidence space, no because line, or an unkeyed item |
| `exit_ticket_staar` | fewer than 2 STAAR-style items, no constructed item, or a missing model / justification / 0-1-2 rubric |
| `ell_support` | the class has multilingual learners but language load and concept gap are not diagnosed separately, or a motion-movie beat is missing |

Vocabulary has to appear **in the plan and on the kid page**. A "3-2-1
reflection" cannot stand in for the exit ticket. A teacher plan with no student
pages is reported as incomplete rather than quietly shipped.

## The two problems this design is actually about

### 1. Making a small local model respect the standards

A model asked to "align to 5.3H" will produce something *plausible*. Plausible
is the failure mode: a lesson that cites a code the district does not use, or
paraphrases a standard into something subtly different, looks exactly like a
correct one.

Four mechanisms, in order of how much work they do:

1. **Standard text is never generated.** It is looked up in your files and
   injected verbatim. If the model rewrites it, the district wording is put
   back deterministically — no retry, no negotiation.
2. **The allowed code list is closed.** Every standard-shaped token in the
   output is checked against your corpus. A code your district has never used
   is an error. A real code from a neighbouring unit is a warning, because
   quoting a prerequisite is often correct.
3. **Structural checks a model cannot talk its way past**: phase minutes must
   sum to the lesson length, every assessment item must have an answer key, no
   placeholder text survives, required sections must be non-empty.
4. **A bounded repair loop.** Failures — and only the failures, plus the
   allowed codes and the draft — go back to the model. The retry is a fraction
   of the first call's size and cannot wander onto new material.

Anything still failing is printed and stamped into the document. The system
does not claim alignment it did not verify.

Decimal numbers are not mistaken for standard codes: the validator uses a
strict pattern (`5.3K`, `5.3(K)`, `RL.5.1`, `112.16.3`) so a fifth-grade lesson
can say "compare 3.5 and 3.25" without tripping an alarm.

### 2. Making it fit in an 8k context window

Retrieve-top-k-and-concatenate fails in the worst possible way here: it
truncates the standards, and a truncated standard yields an *almost* aligned
lesson.

So context is packed by priority under an explicit contract:

| Section | Priority | Trimmable |
|---|---|---|
| Verbatim standards in scope | 0 | **never** |
| Active pacing row | 1 | **never** |
| Gaps found in the district documents | 5 | yes |
| Materials citing these standards | 20 | yes |
| Other retrieved district content | 30 | yes |

Pinned content that does not fit raises an error naming the fix (narrow the
standards, or raise `context_tokens`) instead of silently cutting. Trimming
happens at paragraph, then line, then word boundaries, and every generation
reports what it used and what it dropped:

```
context 3143/4692 tokens [Standards in scope=214 Active unit=139 Materials=1204* ...]
```

The other half of the budget problem is upstream: the Curriculum Mapping Agent
spreads a unit's standards **across** its lessons rather than dumping all eight
into every one. A 60-minute lesson gets one primary standard and at most two
supporting ones.

---

## How it is put together

Three layers, each usable on its own.

**1. Ingestion and context** — `loaders.py` `pdftext.py` `chunking.py`
`parsers.py` `ingest.py` `embeddings.py` `retrieval.py`

Reads your files (including a from-scratch PDF text extractor), classifies each
one, chunks structure-aware (table rows stay whole and keep their header; PDF
pages keep page numbers), extracts `Standard` and `PacingUnit` records, and
builds a hybrid index. Retrieval fuses **BM25** with **cosine similarity** —
lexical matching is not a fallback here, it is what finds `5.3(K)` exactly.

**2. Agent orchestration** — `agents/` `contextpack.py` `pipeline.py` `llm.py`

| Agent | Job | Calls a model? |
|---|---|---|
| `CurriculumMapper` | which unit, which standards for *this* lesson | only to break a genuine tie |
| `StandardsAgent` | resolve codes to verbatim district text | never |
| `LessonWriter` | draft the lesson from packed context | yes |
| `InterventionWriter` | diagnostic, mini-lesson, probe | yes |
| `Validator` | check the draft against your files | never |

Deterministic work stays deterministic. Matching a week number to a pacing
window is arithmetic, and arithmetic is not delegated to an 8B model.

**3. Interface and output** — `cli.py` `server.py` `streamlit_app.py` `render.py`

One structural pass feeds Markdown, print-ready HTML, and Word. The `.docx`
writer emits Office Open XML directly, so Word output needs nothing installed.

Full detail, including the validation rule table and prompt design notes, is in
[ARCHITECTURE.md](ARCHITECTURE.md).

---

## Configuration

`dlg.config.json` in the project root; every key also reads from
`DLG_<KEY>` in the environment. The defaults work offline.

```jsonc
{
  "district_name": "Riverside ISD",
  "standards_framework": "TEKS",

  "llm_backend": "auto",              // auto | ollama | openai | anthropic | offline
  "llm_model": "llama3.1:8b",
  "llm_base_url": "http://localhost:11434",

  "context_tokens": 8192,             // your model's window
  "max_output_tokens": 2600,
  "max_repair_attempts": 2,

  "embed_backend": "auto",            // auto | ollama | sentence | hashing
  "top_k": 12,
  "lexical_weight": 0.6,              // BM25 vs. embeddings
  "vector_weight": 0.4
}
```

Backends: `ollama` (Llama 3, Mistral, Qwen), `openai` (LM Studio, llama.cpp,
vLLM, TGI — anything speaking `/v1/chat/completions`), `anthropic` (set
`ANTHROPIC_API_KEY`), `offline` (scaffold, no model).

### Changing the voice of the output

The agent prompts are Markdown files in `dlg/prompts/`, loaded at runtime. A
curriculum director can edit `lesson_writer.system.md` to match district
language — required lesson components, the instructional frame, the tone of the
family note — without touching Python.

---

## Optional extras

Nothing here is required; each is detected at runtime.

```bash
pip install -r requirements-optional.txt
```

| Package | What it improves |
|---|---|
| `pypdf` | PDF extraction on complex layouts (the built-in reader handles ordinary text PDFs) |
| `numpy` | faster vector search on large corpora |
| `streamlit` | `streamlit run dlg/streamlit_app.py` as an alternative UI |
| `sentence-transformers` | local embeddings without Ollama |

---

## Tests

```bash
python3 -m unittest discover -s tests -t tests
```

137 tests, no network, no model, no third-party packages. They cover the PDF
extractor (against PDFs built byte by byte in the test), column-alias parsing,
chunk boundaries, JSON recovery from malformed model output, the context
budget, every validation rule, and the full repair loop against a scripted
model backend.

`tests/test_district_formats.py` is the regression suite for real exports.
Every case in it is a bug found by running against an actual district's files
and reproduced from a rebuilt fixture — no district data is committed.

---

## What this does not do

- **No OCR.** A scanned PDF indexes as nothing; the ingest report says so.
  Export those pages as text, or add an OCR step upstream.
- **It does not know your standards.** It knows what is in `corpus/`. A
  standard you did not give it does not exist, by design.
- **Alignment checking is structural, not pedagogical.** It verifies that the
  lesson cites your standards, uses your wording, allocates its time, and keys
  its assessments. It cannot tell you the task is at the right depth of
  knowledge. A teacher still reads it before teaching it.
- **The offline scaffold is not a lesson.** It is grounded scaffolding with the
  generative sections marked empty.

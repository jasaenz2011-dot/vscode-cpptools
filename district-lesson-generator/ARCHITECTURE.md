# Architecture

How the three layers fit together, and why each non-obvious choice was made.

```
                     corpus/  (your district's files, untouched)
                        │
┌───────────────────────▼────────────────────────────────────────────────┐
│ LAYER 1  INGESTION & CONTEXT                                           │
│                                                                        │
│  loaders.py ──▶ Loaded(text, pages, tables)                            │
│    csv/tsv · xlsx · docx · pdf · md · txt · html · json                │
│    pdftext.py: zlib-inflated content streams, page tree, Tj/TJ replay  │
│                                                                        │
│  parsers.py ──▶ classify() ──▶ standards | pacing | resource |         │
│                                assessment | unknown                    │
│              ──▶ Standard(code, text, grade, subject, source, locator) │
│              ──▶ PacingUnit(unit, weeks, days, codes, focus, ...)      │
│                                                                        │
│  chunking.py ──▶ Chunk(text, locator, codes, grade, subject)           │
│    table rows stay whole, header repeated · PDF pages keep "p. 7"      │
│                                                                        │
│  embeddings.py + retrieval.py ──▶ Store  (JSON + float32 blob)         │
│    BM25  ⊕  cosine  ⊕  grade/subject/code boosts                       │
└───────────────────────┬────────────────────────────────────────────────┘
                        │
┌───────────────────────▼────────────────────────────────────────────────┐
│ LAYER 2  AGENT ORCHESTRATION            pipeline.py                    │
│                                                                        │
│  CurriculumMapper   which unit? which standards for THIS lesson?       │
│         │           deterministic; model only breaks real ties         │
│         ▼                                                              │
│  StandardsAgent     codes ──▶ verbatim district text (never a model)   │
│         │                                                              │
│         ▼                                                              │
│  ContextPacker      pinned vs. trimmable, under an explicit budget     │
│         │                                                              │
│         ▼                                                              │
│  LessonWriter / InterventionWriter        ──▶ draft JSON               │
│         │                                                              │
│         ▼                                                              │
│  apply_deterministic_fixes   restore verbatim text, drop invented      │
│         │                                                              │
│         ▼                                                              │
│  Validator ──── errors? ────▶ writer.repair(failures only) ──┐         │
│         │                          (bounded, shrinking)  ◀───┘         │
│         ▼ ok / exhausted                                               │
│  GenerationResult(document, standards, report, citations, context)     │
└───────────────────────┬────────────────────────────────────────────────┘
                        │
┌───────────────────────▼────────────────────────────────────────────────┐
│ LAYER 3  INTERFACE & OUTPUT                                            │
│  render.py: one block list ──▶ Markdown · HTML · .docx (raw OOXML)     │
│  cli.py (dlg …) · server.py (stdlib web UI) · streamlit_app.py         │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Layer 1 decisions

### Why a PDF reader instead of a dependency

A teacher should not need a toolchain before the system will read the pacing
guide their district emailed them. `pdftext.py` uses `pypdf` or `pdfplumber`
when installed and otherwise parses the file itself: object table, page tree,
`zlib`-inflated content streams, and a replay of the text-showing operators
(`Tj`, `TJ`, `'`, `"`) with literal-string escapes and hex strings.

It reports a **confidence** score — the fraction of characters that look like
document text — so a CID-font or scanned PDF surfaces as a warning during
ingest rather than as silent mojibake in the index.

### Why chunking is structure-aware

A scope and sequence is a table of records. Splitting it every 320 tokens cuts
"Unit 3 | Weeks 8-11 | 5.3H, 5.3K" in half and produces chunks that mean
nothing on their own. So:

- **Tables** chunk by whole rows with the header repeated in every chunk. The
  locator is `sheet, rows 5-8`, which is a citation a teacher can check.
- **PDF pages** chunk within page boundaries. The locator is `p. 7`.
- **Prose** packs to the budget on paragraph boundaries with overlap, and an
  oversized paragraph splits on sentences.

### Why hybrid retrieval, weighted toward lexical

The default is 0.6 lexical / 0.4 vector, which looks backwards until you
consider the query. Half of what this system retrieves is keyed by a standard
code — `5.3(K)` — and a code is an exact string. Embeddings are good at "this
paragraph is about comparing fractions" and bad at "this is expectation K, not
J". BM25 is the opposite. Both are needed; neither is decorative.

Grade and subject act as **soft** filters (+0.12 / −0.20 on the fused score)
rather than hard ones, and a filter that empties the pool falls back to the
unfiltered pool. A mislabelled district file then degrades results instead of
returning nothing.

### The offline embedder

With no Ollama and no `sentence-transformers`, `HashingEmbedder` vectorizes
with the hashing trick over words plus character 4-grams, signed to reduce
collision bias, L2-normalized. It is not semantic — it approximates lexical
similarity in fixed width — which is precisely why it is fused with BM25 rather
than trusted alone. The index records which backend built it and refuses to mix
vector spaces.

---

## Layer 2 decisions

### Deterministic first

`CurriculumMapper` matches `--week 9` against `Weeks 8-11` with integer range
parsing, and `--unit 6` against the sequence number. It consults the model
**only** when several units genuinely remain in contention, and even then it
must choose a `unit_id` from an enumerated list. Its answer is checked against
that list before use.

`StandardsAgent` never calls a model at all. When a code misses the parsed
standards table it searches the raw chunks for the code followed by its text —
recovering a standard from a PDF the table parser could not handle beats
telling a teacher their standard does not exist. Recovered standards are
labelled as such in the notes.

### Spreading standards across lessons

A unit lists eight standards. The naive system puts all eight in every lesson,
which is how generated curricula end up shallow. `_standards_for_lesson`
indexes into the unit's code list by lesson number: lesson 1 gets code 1 as
primary, lesson 2 gets code 2, each with at most two supporting codes.

### The context contract

`ContextPacker` sorts sections by priority, guarantees pinned sections in full,
trims the rest to fit, and returns a report of exactly what was used and
dropped. Pinned content that cannot fit raises `ContextOverflow` with the
remedy in the message. The budget itself is derived, not guessed:

```
input_budget = context_tokens − max_output_tokens − prompt_reserve_tokens
             = 8192 − 2600 − 900 = 4692
```

### Validation rules

| Rule | Severity | What it checks |
|---|---|---|
| `required_sections` | error | the sections a teacher cannot teach without are filled |
| `standards_grounded` | error | every cited code resolves to a district standard |
| `no_invented_codes` | error | no standard-shaped code is unknown to the district |
| `no_invented_codes` | warning | a real district code cited outside this lesson's scope |
| `no_placeholders` | error | no `TBD`, `[insert ...]`, or template debris |
| `hunter_complete` | error | all 8 Hunter steps carry teacher moves |
| `duration_sum` | error | step minutes total the period (±5) |
| `objective_form` | error | the objective states how mastery is shown |
| `vocabulary_bounds` | error | 4-8 academic vocabulary terms |
| `vocabulary_woven` | error | each term is used in Input, Modeling, Guided Practice or CFU |
| `high_order_questions` | error | no bare recall stem without a reasoning demand |
| `manipulatives` | error | a math lesson names manipulatives |
| `student_pages` | error | a page exists, with evidence space, a because line, and keys |
| `exit_ticket_staar` | error | 2+ STAAR items, a constructed item, model + justification + 0/1/2 rubric |
| `ell_support` | error | language load and concept gap diagnosed separately, all 4 motion-movie beats |
| `verbatim_standards` | warning | standard text matches district wording |
| `objective_form` | warning | the objective is student-facing |
| `citations_resolve` | warning | cited filenames exist in the corpus |
| `sentence_length` | warning | student-facing text has no 28-word sentences |
| `distinct_diagnostics` | warning | intervention items separate different causes |
| `mastery_criteria` | warning | progress criteria are numeric |

Two failures look alike and are deliberately separated. A code the district has
never used is a **hallucination** and an error. A real district code from a
neighbouring unit is a **scope** question and a warning — quoting a
prerequisite while explaining what students need first is often exactly right.

### Repair economics

The first call carries the packed context (~4700 tokens). The repair call
carries only the failed checks, the allowed codes, and the draft — typically a
third of the size. It cannot introduce new material because it was never shown
any. Attempts are capped by `max_repair_attempts` (default 2), after which the
document is returned **with its failures listed** rather than silently accepted.
This is asserted in `tests/test_pipeline.py`.

### Why an offline scaffold exists

`OfflineClient` makes the whole pipeline runnable with no model: the writers
assemble a draft by mechanical transform of district text (the objective is the
standard's own wording turned student-facing; each Hunter step carries real
excerpts from materials that cite the standard) and leave the genuinely
generative fields empty. The validator then flags those fields honestly. This
keeps the system demonstrable, testable, and truthful about what it did.

---

## Layer 3 decisions

`render.py` builds one intermediate block list (`h1` `h2` `h3` `p` `kv` `ul`
`table` `note` `hr`) and renders Markdown, HTML, and Word from it, so the three
exports cannot drift apart.

The `.docx` writer emits Office Open XML directly with `zipfile`:
`[Content_Types].xml`, the two relationship parts, a minimal `styles.xml` with
Heading1–3, and `document.xml`. Bullets are indented paragraphs with a literal
`•` rather than a numbering part, which keeps the package small and valid.

`server.py` is `http.server` with three routes (`/`, `/generate`,
`/download/…`) and a JSON endpoint for unit lookup. Generation is synchronous:
this is a single-teacher local tool, and a spinner plus one blocking request is
more honest than a job queue that adds failure modes.

Every export carries a `_provenance` block: the district, the unit and its
source row, the standards sources, the backend, the mode (`generated` or
`scaffold`), the automatic fixes applied, unresolved codes, and any checks
still failing. A printed lesson can be traced back to the file and row it came
from.

---

## Extending it

**Change the voice** — edit `dlg/prompts/*.md`. Loaded at runtime;
`{{placeholders}}` are filled by `prompts.render`.

**Change the lesson shape** — edit `LESSON_SCHEMA` in `schemas.py`. It is both
the coercion spec and the example shown to the model, so the two cannot drift.
Add the field to `render.py`'s block builder and, if it must be filled, to
`LESSON_REQUIRED`.

**Add a check** — add a `_check_*` method to `Validator` and call it from
`run()`. Errors drive the repair loop; warnings are reported.

**Add an agent** — subclass `Agent`, use `self.complete_json(system, user,
schema)` for shape-safe model calls, and wire it into `Pipeline`.

**Add a backend** — implement `describe()` and `complete()`; register it in
`llm.get_client`.

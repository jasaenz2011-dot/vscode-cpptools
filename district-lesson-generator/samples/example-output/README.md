# Example output

Produced by:

```bash
python3 -m dlg generate --grade 5 --subject math --week 9
```

against the sample corpus in `../corpus/`, on a machine with **no language
model installed** — so this is the system in **scaffold mode**.

That is the honest floor of what it produces, and it is worth reading as such:

- The **standards are verbatim** from `sample_standards_grade5_math.csv`, with
  the file and row cited.
- The **unit was selected by matching week 9 against `Weeks 8-11`** in the
  scope and sequence, not guessed.
- The **learning objective is a mechanical transform** of the standard's own
  wording into "I can …" form.
- The **5E phases carry real excerpts** from the district resource library,
  each with its source.
- The **empty sections are marked empty**, and the "Provenance and checks"
  section at the bottom lists exactly which checks are failing and why.

With Ollama running (`ollama pull llama3.1:8b`), the same command fills the
blank sections — misconceptions, teacher moves, the exit ticket and its answer
key, differentiation — and the same validator then checks that output against
the same district files, retrying the model on anything that fails.

The `.docx` and `.json` exports are omitted here to keep the repository small;
`write_all` produces all four formats side by side.

The draft below failed the district's alignment checks. Fix it.

# FAILED CHECKS

{{violations}}

# ALLOWED STANDARD CODES

You may cite these and only these. Any other code is an error:

{{allowed_codes}}

# DRAFT TO FIX

{{draft}}

# YOUR TASK

Return the **complete corrected JSON object** -- every key, not a patch and not
a diff. Fix exactly what the failed checks name and change nothing else.

Rules that still apply:
- Standard codes and standard text are copied verbatim from the allowed list.
- No placeholders. If a check says a section is empty, write real content for
  it, not a promise to write it later.
- Return one JSON object and nothing else.

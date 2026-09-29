# Integrated Decision Logic — Cross-Module Arbitration

**Status:** Synthesis layer. Binding where it states a precedence or a defect; advisory where it recommends.
**Covers:** modules `01`–`05` as they stand at the end of the research pass.
**Read after:** `00-shared-conventions.md`.

---

## 1. What this document adds

The five research modules were written in parallel by agents that could not see each other's work in progress. Each is internally coherent. This document handles what none of them could:

- **defects created by the seams between modules** — where two modules agree in substance but disagree in notation, which is more dangerous than open disagreement
- **a single precedence order**, so an implementer facing two applicable rules knows which one governs
- **the union do-not-flag list**, which `00-shared-conventions.md` §11.3 declares binding but which no module assembles
- **one shared offer budget**, since four modules independently propose prompts and only one proposes a cap
- **registers** of quarantined evidence, open questions requiring a human, and audit results

Module `03` Part F already arbitrates six tensions involving itself. This document does not repeat that work; it references it and adds what a whole-corpus view sees.

---

## 2. Defect register — fix before implementation

### D-1 — Module `01`'s age bands are offset by one from every other module. **Severity: high.**

This is the most consequential finding in the synthesis.

| Ages | Grades | `00`, `03`, `05` | Module `01` |
|---|---|---|---|
| 5–6 | K–1 | **B1** | **B0** |
| 7–8 | 2–3 | **B2** | **B1** |
| 9–10 | 4–5 | **B3** | **B2** |
| 11–12 | 6–7 | **B4** | **B3** |
| 13–14 | 8–9 | **B5** | **B4** |

Module `01` is zero-indexed; the governing conventions and every other module are one-indexed. **Module `01`'s `Bn` is everyone else's `B(n+1)`.**

**This has already caused a real divergence.** Module `01` `R2.1s` says *do not build genre/audience-adaptation features for B0–B1* — in its own numbering, through **grade 3** — and introduce genre play from **B2**, meaning **grades 4–5**. Module `03` `P-A3` implements what it believed was that recommendation, turning genre prompts off by default at *"B1 (K–1)"* — in conventions numbering, **K–1 only**. Module `03`'s Part F.3 explicitly says it is resolving toward module `01`, and in substance it is; the notation defeated it.

The result: **genre-derived prompting is ON by default for grades 2–3 under module `03`, and OFF for grades 2–3 under module `01`.** That is a two-band divergence landing on the bottom of the stated target audience.

**Resolution:** renumber module `01` to the `00` taxonomy (B0→B1, B1→B2, B2→B3, B3→B4, B4→B5) — the conventions are governing and four modules already conform. Every band reference in module `01`'s prompt library, do-not-flag list, and introduction schedule shifts with it. Then re-decide `P-A3` deliberately: module `01`'s evidence (`A1-C107`) supports the more conservative default, and under §9's default stance the conservative reading should win pending usability testing.

**Do not renumber by find-and-replace.** Module `01`'s band labels appear inside claim text, prompt tables, and quoted source ranges; a blind substitution would corrupt the source-range citations that make the mapping auditable.

### D-2 — Two vocabularies for the same provenance fact. **Severity: low, already documented.**

Modules `01`, `03`, `04` mark retrieval provenance per-claim as `[SNIPPET]`; modules `02`, `05` declare it blanket-wise as `[SECONDARY-SOURCED]`. Reconciled in `00-shared-conventions.md` §2. No action needed beyond not misreading an unmarked claim in `02`/`05` as better-verified.

### D-3 — Module `02` skips claim `A2-C41`. **Severity: cosmetic.**

Never defined, never referenced. Leave the numbering alone rather than renumbering 49 downstream claims and breaking cross-module citations.

---

## 3. Precedence order

When two rules both apply and conflict, resolve in this order. Stop at the first rule that decides.

**P0 — The four commitments** (`00` §11) override everything, including rules in this document.

**P1 — Prohibitions beat permissions.** A "never" beats a "should." Module `04`'s never-say list and `A14.2`, module `05`'s four assessment prohibitions and metric blacklist and non-ranking invariant R, module `03`'s `P-A4`/`P-B2`/`P-C1` are all absolute. No scaffolding benefit unlocks them.

**P2 — Domain ownership.** Each module governs its own domain regardless of what another module says in passing:

| Domain | Governing module |
|---|---|
| What may be stored, measured, displayed to educators, or retained | `05` |
| Whether and when the tool speaks; offer budgets; feedback wording; vocabulary support | `04` |
| Developmental defaults, expected complexity, what must never be flagged | `01` |
| Which structures may be suggested and how they are framed | `02` |
| Which genre prompts are eligible and how they are worded | `03` |

**P3 — The more conservative option wins.** Where P0–P2 leave a genuine tie, take the option that speaks less, stores less, measures less, and asserts less (`00` §9).

**P4 — Ownership is the final tie-breaker.** If a pedagogical benefit still conflicts with the child's ownership of their character, ownership wins (`00` §9).

> **Worked example.** Module `03` wants to offer a mystery prompt; module `04`'s budget is exhausted. P1 does not apply (no prohibition). P2 gives budget to `04`. The prompt is not offered. This is Part F.1's conclusion, reached independently — a good sign the ordering is right.

---

## 4. The union do-not-flag list

`00` §11.3 declares the union of module do-not-flag lists binding. Assembled here for the first time. **Nothing on this list may trigger a suggestion, correction, score, nudge, badge, or educator-facing "area for growth."**

### Never flag, at any age

| Do not flag | Source |
|---|---|
| "And then… and then…" chaining | `01` §3.5 (`A1-C15`, `A1-C16`) |
| A short story | `01` §3.5 (`A1-C61`, `A1-C68`) |
| A flat character (one dominant trait) | `01` §3.5, `03` `P-C9` (`A1-C47`, `A1-C52`, `A3-C24`, `A3-C31`) |
| A static character who does not change | `01` §3.5, `03` `P-C9` (`A1-C47`, `A1-C52`, `A3-C24`) |
| An animal, anthropomorphic, or fantastical character | `01` §3.5 (`A1-C62`, `A1-C46`) |
| A multi-episode, multi-anecdote, or "wandering" shape | `01` §3.5 (`A1-C79`, `A1-C82`, `A1-C83`) |
| A story ending at the high point with no resolution | `01` §3.5, `02` `AI-2` (`A1-C06`, `A1-C31`) |
| Spelling, punctuation, dialogue punctuation, capitalisation | `01` §3.5 (`A1-C69`, `A1-C70`) |
| Non-English or mixed-language content | `01` §3.5, `04` (`A1-C95`, `A1-C98`, `A4-C128`) |
| Repetition, sound words, direct address, exclamation | `01` §3.5 (`A1-C81`, `A1-C83`, `A1-C12`) |
| A villain who does one nice thing | `01` §3.5 (`A1-C50`) |
| A story that is "true" rather than invented | `01` §3.5 (`A1-C83`) |
| A purely good hero or purely evil villain | `03` `P-C9` (`A3-C24`, `A3-C31`, `A3-C46`) |
| A chosen-one, prophecy, orphan, or dark-lord character | `03` `P-C9` (`A3-C07`) |
| A character strongly resembling one from a book, show, or game | `03` `P-C9` (`A3-C15`, `A3-C16`) |
| Absence of any OPTIONAL TROPE from any genre table | `03` `P-C9` (`P-B1`, `P-B2`) |
| A story that doesn't match its selected genre | `03` `P-C9` (`P-A1`, `P-B10`) |
| Two or more genres selected at once | `03` `P-C9` (`A3-C18`, `P-B10`) |
| A fable with no moral, a mystery with no solution, a fantasy with no magic | `03` `P-C9` (`P-B2`) |
| Magic with no rules or cost; technology with no explanation | `03` `P-C9` (`A3-C22`, `A3-C29`, `A3-C30`) |
| Contradictions between a character's appearances across episodes | `05` (must not flag, warn, error, highlight, score, or report) |

### Additionally never flag at ages 5–8 (conventions B1–B2, module `01`'s B0–B1)

No stated reasons for actions · no internal states · telling rather than showing · ambiguous pronouns (ages 5–6 only) · no evaluative language · goal achieved on first attempt · only one character · no genre differentiation.

### Additionally never flag at ages 9–10 (conventions B3, module `01`'s B2)

No nested mental states · no character arc · no internal contradiction.

### Ages 11–14

The lists above continue **in full**, minus the ambiguous-pronoun exemption. **Nothing new becomes flaggable at any age.** The single mechanical issue that may ever be raised from age 7 upward is an ambiguous pronoun that genuinely blocks a reader — once per draft, phrased as a reader's question (`01` `R2.1h`).

> Band labels above are stated in **ages**, deliberately, to survive defect D-1 either way it is resolved.

---

## 5. One shared offer budget

Four modules propose prompts. One proposes a cap. **The cap is global.**

```
GLOBAL, across modules 01, 02, 03, 04 combined — not per module:
    unrequested offers  ≤ 3 per character        (04 E.3.1)
    unrequested offers  ≤ 5 per session          (04 E.3.1)
    child content since last offer > 0           (04 E.3.1)
    auto-inserted text  = 0, always, no exception (04; 03 F.1 declines to seek one)
```

Genre selection, structure recommendation, and developmental prompting are **filters on which prompts are eligible** — never licences to offer more. Module `03` F.1 reaches this conclusion for itself; it binds modules `01` and `02` equally, which neither states.

**Default state is silence** (`04` `A9.1`). The tool speaks only on explicit request, an explicit stuck affordance, or a child-declared completed goal with opt-in. Never on idle timers, field blur, keystroke pauses, session start, or encouragement schedules.

---

## 6. The prohibition set — build these first

These are cheaper to implement than any scaffold and they constrain every scaffold. Build them as enforced invariants, not as guidance in a prompt.

```
ASSERT no code path computes:
    genre_conformance · trope_count · originality · cliché_flag
    completeness · archetype_label · creativity_score
    character_quality_score                        (03 E.2; 05 P1; 05 blacklist)

ASSERT no offer is generated because something is ABSENT
    Offers derive from what the child HAS written,
    never from a diff against a template.           (03 P-B2)

ASSERT suggestion.type ∈ {question, dimension, child_prior_content,
                          structural_reminder}
       suggestion.type ∉ {trait, name, motivation, backstory,
                          dialogue, description}    (04 A14.2)

ASSERT no ranking of children on creative work,
       including disguised orderings: sorting, "top N",
       badges, colour-coded rosters                 (05 invariant R)

ASSERT nothing reaches an adult that is hidden from the child   (05 C-family)
```

**On `A14.2` and genre scaffolds — a predicted conflict that did not occur.** Module `04` forbids suggesting traits; module `03` was asked for a genre → character-scaffold mapping, which sounds like trait suggestion. Module `03` resolved it independently by phrasing every convention prompt as a *question* — "What does your character notice that others miss?" rather than "your detective is observant" — and by `P-A5`, which mandates functional language ("someone who helps them") over personality language ("the Mentor archetype"). The mapping is compliant as written. Preserve this property under edit: **a genre prompt that names a trait is a regression, not a refinement.**

---

## 7. Conflict register

### Resolved

| ID | Conflict | Resolution |
|---|---|---|
| `03` F.1 | Genre prompts vs. offer budget | `04` wins outright; genre consumes the shared budget (§5 here) |
| `03` F.2 | Genre canon vs. `05`'s archetype-classification ban | Direction of application: outward to filter offers, never inward to label. `05` wins every storage question |
| `03` F.3 | Genre features at K–1 | Resolved toward `01` in substance — **but see defect D-1**, which changed what "toward `01`" means |
| §6 here | `A14.2` vs. genre scaffolds | No conflict; `03` phrases prompts as questions and uses functional role language |

### Open — needs a decision

| ID | Conflict | Who decides |
|---|---|---|
| D-1 | Band numbering offset, and the grades 2–3 genre-prompt default that follows from it | Knowledge-base owner, then module `01` and `03` owners |
| `03` F.4 | `02`'s structure recommender scores by genre affinity; `03` warns this can steer children into Western conflict-centred shapes. Proposal: generalise `02`'s equal-weight rule from the hero's journey to **every** genre-driven recommendation | Module `02`'s owner |
| `03` F.5 | Recreational-fear evidence vs. platform duty of care. Part D's spooky boundaries are DESIGN DECISIONs, not findings | **Qualified child-development and safeguarding professionals, plus educators, before launch.** Not resolvable inside this knowledge base |

---

## 8. Quarantine register

Evidence that must not leave the organisation in any form.

**Q-1 — The SRSD / strategy-instruction effect-size cluster.** Retrieved sources attribute **at least seven different values** across two independent research sessions: module `04` `A4-C21` documents 1.17, 1.02 and 0.68 attributed to the same 2012 citation; module `03` `A3-C03` adds 1.04, 0.72 and 0.59, plus a text-structure figure of 0.59 that collides numerically with one of them. Nobody could open a source to adjudicate.

**Rule:** no number from this cluster may appear in any external document, funding application, marketing page, or district-facing material. Internal use is limited to the qualitative conclusion the values agree on — *strategy instruction is among the better-supported writing interventions* — never a magnitude. `A4-C21`'s table should be amended to include module `03`'s figures, per F.6.

**Q-2 — Module `05` `A5-C31`**, an orphan list of automated-scoring effect sizes with no resolvable attribution. Flagged by its own module so it is not recycled. Same rule: quarantined.

**Q-3 — Every numeric claim in the knowledge base**, by default, under `00` §2. Q-1 and Q-2 are the cases where retrieval actively produced *contradictions*; they are not the only unverified numbers, merely the proven-unreliable ones.

---

## 9. Human-decision register

Items no amount of further research resolves. Each needs a named owner before launch.

| # | Decision | Required reviewer |
|---|---|---|
| H-1 | Spooky/horror content boundaries (`03` Part D, F.5) | Child-development and safeguarding professionals; educators |
| H-2 | Every privacy, consent, retention, and data-use rule (`05` Part E) | Qualified attorney, per jurisdiction. The module is explicitly **not legal advice** and its author could not open a single primary regulatory text |
| H-3 | Whether child-created content may ever train models (`05` `P-15` defaults to no) | Legal plus organisational policy |
| H-4 | Standards-alignment claims (`05` C.2.1) | Curriculum specialist. "Aligned to" and "assessed against" are different claims with different exposure |
| H-5 | D-1's band renumbering and the grades 2–3 genre default | Knowledge-base owner |
| H-6 | Whether to accept the knowledge base at snippet provenance or fund a verification pass | Product owner. See §10 |

---

## 10. Audit results

Run across all five modules at synthesis time.

| Check | Result |
|---|---|
| Claim-ID contiguity | `01` 1–116 ✓ · `02` 1–90 with 41 skipped · `03` 1–60 ✓ · `04` 1–137 ✓ · `05` 1–164 ✓ |
| Dangling claim references | **None.** No product rule in any module cites a claim ID that does not exist |
| Cross-module citations resolve | ✓ — module `03`'s 7 sibling references all verified present |
| Required closing sections | Present in all five modules |
| Research/product separation | Maintained throughout; no blended sections found |
| Provenance disclosure | Present and prominent in all five module headers |
| **Total claims** | **566** |

**What a verification pass would cost.** The single highest-value follow-up is not more research — it is re-verifying existing claims against primary sources from an unrestricted network. Priority order: (1) Q-1 and Q-2 quarantined numbers; (2) every claim module `05` uses for a privacy or standards statement; (3) the `[UNVERIFIED]` register across all modules; (4) numeric claims used to set any default. This requires network access, not additional searching.

---

## 11. Recommended build order

1. **The prohibition set (§6)** as enforced invariants with tests. They are cheap, they constrain everything downstream, and retrofitting them is expensive.
2. **The union do-not-flag list (§4)** as a filter every candidate suggestion passes through before rendering.
3. **The shared offer budget (§5)** as a single global counter — not per-module counters that sum to more than the cap.
4. **Silence by default.** Ship the tool that says nothing before the tool that says something.
5. **Genre and structure filters**, which only narrow what §§2–4 already permit.
6. **Educator surfaces last**, and only after H-2 clears.

> The ordering is deliberate: every layer constrains the next. A team that builds scaffolds first and prohibitions later will find the prohibitions expensive and will be tempted to weaken them.

---

## 12. What this document does not do

- It does not resolve `03` F.5, H-1, or H-2. Those need people with qualifications no research pass substitutes for.
- It does not verify any claim. It audits *structure and consistency*, not truth. Every provenance caveat in `00` §2 applies to everything above.
- It does not decide D-1. It establishes that the defect exists, that it has already produced a two-band divergence, and which resolution the conventions imply.

# Character Studio Research Knowledge Base

An evidence-grounded, implementation-ready knowledge base for **Character Studio** — the AI-assisted character creation and storytelling tool embedded in the Episode Page Portal on the **Grapevine** platform, for children in **grades 2–8**.

The purpose of this knowledge base is not to summarize research. It is to **convert reliable research into explicit rules, constraints, recommendations, and decision logic** that a product-development team can implement.

---

## Start here

**Read [`00-shared-conventions.md`](./00-shared-conventions.md) first.** It defines the evidence tiers, claim-ID scheme, age taxonomy, and the separation contract that every module follows. Reading a module without it will cause you to over-trust some claims and under-trust others.

> ### ⚠️ Provenance ceiling
>
> This knowledge base was researched behind an egress policy that **blocked full-text retrieval from every scholarly and governmental host** — ERIC, PubMed, IES, the FTC, the Dept. of Education, SAGE, the standards sites, even Wikipedia. Web *search* worked; web *fetch* did not.
>
> **No contributor read a source document end to end.** Every claim came from search-result synthesis. Modules `01`, `03` and `04` mark this per-claim as `[SNIPPET]`; modules `02` and `05` declare it blanket-wise in their headers as `[SECONDARY-SOURCED]` at the retrieval level. Same fact, two vocabularies — an unmarked claim in `02` or `05` was **not** verified more deeply.
>
> This is fine for shaping internal product defaults and choosing what to prototype. It is **not** sufficient for any number you put in front of a district, funder, parent, or marketing page, and **not** sufficient for any compliance or child-safety decision. Re-verify against primary sources first. See `00-shared-conventions.md` §2 for the full permitted/forbidden table.
>
> The knowledge base is research-*informed* at snippet provenance — not "research-backed" without qualification.

---

## Modules

| # | Module | Covers | Claim prefix |
|---|---|---|---|
| 00 | [Shared conventions](./00-shared-conventions.md) | Evidence tiers, age taxonomy, traceability rules, cross-cutting commitments | — |
| 01 | [Developmental storytelling milestones](./01-developmental-storytelling-milestones.md) | Narrative development ages ~5–14; story grammar, causal coherence, perspective-taking, revision and planning ability; how children develop original characters over time | `A1-` |
| 02 | [Narrative arc & story structure](./02-narrative-arc-and-story-structure.md) | Beginning-middle-end, story grammar, three-act, Freytag, hero's journey, quest, circular, episodic, kishōtenketsu, problem-solution, and other culturally significant structures | `A2-` |
| 03 | [Genre tropes & conventions](./03-genre-tropes-and-conventions.md) | Fantasy, adventure, mystery, realistic fiction, sci-fi, fable, folktale, fairy tale, humor, age-appropriate spooky/horror, hybrids — and how characters function inside each | `A3-` |
| 04 | [Scaffolding, literacy, vocabulary & differentiation](./04-scaffolding-literacy-vocabulary-differentiation.md) | Instructional scaffolding for creative writing, literacy development through character work, character/emotion vocabulary and language complexity, differentiation and accessibility | `A4-` |
| 05 | [Educator analytics, assessment & episode integration](./05-educator-analytics-assessment-and-episode-integration.md) | Assessment of narrative writing, dashboards and learning analytics, standards alignment, character persistence across episodes, child data privacy and safety | `A5-` |
| 90 | [**Integrated decision logic**](./90-integrated-decision-logic.md) | Cross-module arbitration: precedence order, the union do-not-flag list, the shared offer budget, the prohibition set, defect register, quarantined evidence, and what needs a human decision | — |

**566 claims** across the five research modules, all traceable.

> **Implementers: read `90-integrated-decision-logic.md` before writing code.** It carries one high-severity defect (module `01`'s age bands are offset by one from every other module, which has already produced a two-band divergence in genre-prompt defaults for grades 2–3) and the build order that keeps the prohibitions cheap.

---

## How to read a module

Every module splits each topic into two sections that are never blended:

- **`WHAT RESEARCH SAYS`** — descriptive, cited, evidence-tiered. No product recommendations.
- **`WHAT CHARACTER STUDIO SHOULD DO`** — prescriptive and implementable. Every rule cites the claim IDs supporting it and states its own confidence.

This separation is deliberate. It prevents design preferences from quietly inheriting the authority of research they aren't actually based on.

### Labels you will see

- `[E1]`–`[E6]` — evidence tier (empirical → theoretical → standard → practice → commercial → contested). See `00-shared-conventions.md` §3.
- `[UNVERIFIED]` — no reliable source located after search. **Must not drive any product behavior.** These are a work queue, not a conclusion.
- `[SECONDARY-SOURCED]` — confirmed only via a source describing the original, which is what's cited.
- `[SNIPPET]` — retrieved only as search-result synthesis, never read in full. Applies *in addition* to a tier, and applies to essentially every claim here. See the provenance ceiling above.
- **DESIGN DECISION** — a threshold or value chosen for usability/engineering reasons, *not* derived from evidence. Freely tunable.
- `A3-C14` — a claim ID. Product rules cite these so any behavior can be traced back to its evidence.

---

## The four commitments

These override any individual rule that conflicts with them:

1. **No single correct story shape.** Western conflict-centered narrative is not the definition of a story. Circular, episodic, and non-conflict-centered forms are valid outputs, not errors.
2. **No incorrect characters.** Absence of a conventional trope is never a defect. The tool must never imply a child built a character "wrong."
3. **Developmentally normal simplification is not error.** Flat characters and external-only traits are expected at several ages. Each module carries a *do-not-flag* list; their union is binding.
4. **Support without stigma.** Differentiation is never visible as a label, level, or peer comparison.

Underlying all four: **when pedagogical benefit conflicts with the child's ownership of their character, ownership wins.**

---

## Age bands

| Band | Ages | Grades |
|---|---|---|
| B1 | 5–6 | K–1 |
| B2 | 7–8 | 2–3 |
| B3 | 9–10 | 4–5 |
| B4 | 11–12 | 6–7 |
| B5 | 13–14 | 8–9 |

Bands are **soft defaults, never gates.** No feature may be locked on age alone; observed child output takes precedence over band defaults; within-band variation routinely exceeds between-band differences.

---

## Limitations of this knowledge base

Stated plainly, because they matter for how the material is used:

- **No source was read in full.** See the provenance ceiling above. Numeric claims in particular are snippet-level and several modules document *conflicting* figures attributed to the same citation — left unresolved deliberately, because a conflict you can't adjudicate should be reported, not silently reconciled.
- **Nothing here has been tested in Character Studio.** Every product rule is an informed hypothesis requiring usability testing and educator review.
- **Research coverage is uneven.** Some areas rest on robust empirical work; others on professional practice or contested claims. The tier labels tell you which.
- **The evidence base skews.** Underrepresented populations are named per module. Findings drawn largely from one linguistic and cultural context are flagged rather than generalized.
- **Module 05 is not legal advice.** Privacy and compliance content requires review by a qualified attorney before any implementation decision.
- **Vocabulary and differentiation were folded into module 04** rather than receiving a dedicated module. Treat that module as a strong foundation on those two topics rather than an exhaustive treatment.

---

## Contributing

1. Adding a product rule requires either a claim ID or a **DESIGN DECISION** flag. No exceptions.
2. Before editing a claim, grep its ID across all modules — product rules depend on it.
3. Never add a citation you have not retrieved. `[UNVERIFIED]` is always the correct answer to "I think there's a study about this."
4. Foundational is not settled. Any added foundational citation must be checked for subsequent critique.

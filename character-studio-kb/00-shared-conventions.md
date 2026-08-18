# Character Studio Knowledge Base — Shared Conventions

**Status:** Governing document. Every module in this knowledge base conforms to the rules below.
**Applies to:** Character Studio, the AI-assisted character creation and storytelling tool in the Episode Page Portal on the Grapevine platform.
**Primary audience:** Grades 2–8. Bands for K–1 and Grade 9 are included where research supports them, because real classrooms are not grade-pure.

This document defines *how* the knowledge base is written and *how it must be read*. It contains no research claims of its own.

---

## 1. What this knowledge base is — and is not

**It is** a translation layer: reliable research converted into explicit rules, constraints, recommendations and decision logic that a product team can implement.

**It is not:**

- a literature review (summarizing is explicitly not the goal)
- a source of legal, clinical, or diagnostic authority
- a mandate that Character Studio must implement every rule proposed here
- evidence that any recommendation has been tested *in Character Studio*

Every product rule in this knowledge base is a **proposal traced to evidence**, not a validated feature. Nothing here has been A/B tested with real children on this platform. Treat the rules as informed starting hypotheses that still require usability testing, educator review, and — for anything touching data, privacy, or child safety — qualified legal review.

---

## 2. Citation integrity rules (non-negotiable)

These rules bind every contributing agent and every future editor.

1. **No invented sources.** Citations, DOIs, titles, author names, years, quotations, sample sizes, findings, and effect sizes are never invented, approximated, reconstructed, or "filled in" from memory.
2. **Retrieved or not stated.** If a source was not actually retrieved while writing, its content is not stated as fact.
3. **`[UNVERIFIED]` is a success state.** When a reliable primary or authoritative source cannot be located after reasonable search, the claim is marked `[UNVERIFIED]` and the attempted search is noted. An honest gap is more valuable than a confident guess.
4. **`[SECONDARY-SOURCED]` for second-hand confirmation.** Where a work is known only through a review or summary that describes it, the citation is to *what was actually read*, marked accordingly. A summary describing a study is not the study.
5. **Numbers are the highest-risk category.** Effect sizes, sample sizes, and percentages are stated only when read directly in a retrieved source, with that source named. Secondary sources frequently misreport these.

**Why this matters here specifically:** several of this knowledge base's domains — narrative-structure models, genre tropes, writing-instruction meta-analyses, children's data-privacy law — are surrounded by large volumes of confident, uncited, and frequently wrong internet content. The tiering system below exists to keep that material usable without letting it masquerade as evidence.

---

## 3. Evidence tiers

Every substantive claim carries exactly one tier label.

| Tier | Meaning | How much weight a product decision may put on it |
|---|---|---|
| `[E1]` | Empirical finding — primary study, systematic review, meta-analysis | Highest. Can justify a default behavior. |
| `[E2]` | Theoretical framework or model | Can justify structure and vocabulary, not efficacy claims. |
| `[E3]` | Educational standard, curriculum framework, or regulatory/legal source | Authoritative for compliance and alignment; not evidence of what works. |
| `[E4]` | Established instructional practice / professional consensus | Reasonable default when E1 is absent; must be labelled as practice, not proof. |
| `[E5]` | Commercial or proprietary system | Useful as prior art. Never evidence. Vendor claims are marketing until independently verified. |
| `[E6]` | Emerging or contested claim | May inform exploration. Must not drive a default behavior. |
| `[UNVERIFIED]` | Could not be confirmed | Must not drive any behavior. Flagged for follow-up. |

**Tier is not quality.** An `[E4]` professional consensus may be excellent guidance; an `[E1]` study may be small, dated, or non-replicated. Tier records *what kind of thing the claim is*, so readers can weigh it appropriately. Module-level limitations sections carry the quality caveats.

---

## 4. Claim IDs and traceability

Every substantive research claim is numbered by module:

```
A1-C07   → Agent/module 1, claim 7
A4-C22   → Agent/module 4, claim 22
```

Every product rule cites the claim IDs supporting it, plus its own confidence. A product rule with no claim IDs behind it is either a **DESIGN DECISION** (see §6) or a defect in this knowledge base.

This makes the knowledge base auditable in both directions:

- *"Why does the tool behave this way?"* → follow the rule to its claim IDs to its sources.
- *"This 1979 finding was superseded."* → find every rule citing that claim ID and revisit it.

---

## 5. The separation contract

Every topic area is split into two explicitly labelled sections that are **never blended**:

### `## WHAT RESEARCH SAYS`
Descriptive. Cited. Tiered. Reports what the evidence base actually contains, including disagreement and gaps. Contains no product recommendations.

### `## WHAT CHARACTER STUDIO SHOULD DO`
Prescriptive. Implementable. Every rule cites claim IDs and states confidence. Contains no new factual claims about research.

**Rationale:** the most common failure mode in ed-tech design documents is a paragraph that begins as a research finding and ends as a feature requirement, so that a design preference inherits the authority of evidence it does not actually have. The split makes that impossible to do accidentally.

---

## 6. DESIGN DECISION flags

Product rules frequently need thresholds that research does not supply — how many suggestions before the tool goes quiet, how long a prompt may be, how many traits a character card holds.

Any such value is labelled **DESIGN DECISION** and is understood to be:

- chosen for usability or engineering reasons, not derived from evidence
- freely changeable without contradicting the research
- a candidate for empirical tuning once the product has real usage data

A number without either a claim ID or a DESIGN DECISION flag is a defect.

---

## 7. Shared age taxonomy

All findings normalize into these bands:

| Band | Ages | Grades |
|---|---|---|
| B1 | 5–6 | K–1 |
| B2 | 7–8 | 2–3 |
| B3 | 9–10 | 4–5 |
| B4 | 11–12 | 6–7 |
| B5 | 13–14 | 8–9 |

**Mapping rule:** cite the source's own age or grade range first, then map it to a band. Never silently restate a source's range as a band.

### Anti-gating rules (binding on all product logic)

1. **Age is a prior, not a gate.** Bands set *defaults*, never *limits*. No Character Studio feature may be locked or withheld on the basis of age band alone.
2. **Observed output beats age.** Where the tool can observe what a child actually produces, that evidence takes precedence over the band default. A 7-year-old writing richly motivated characters gets the richer scaffolds.
3. **Within-band variance is the norm.** Individual variation inside any band routinely exceeds the average difference between adjacent bands. Modules report this variance wherever sources describe it.
4. **Typical ≠ required.** A developmental pattern describes what is common, not what is correct. A child whose narrative does not match the band pattern is not behind, and the tool must never imply it.
5. **No visible labelling.** Whatever band or support level the system infers internally, it is never displayed to the child as a category, level, or rank.

---

## 8. Default stance under uncertainty

Where evidence is thin, mixed, or context-dependent, the product default is **neutrality or gentle optionality — never prescription.**

In practice:

- offer, don't require
- suggest alternatives, don't correct
- make the "no thanks / my own way" path always available and never penalized
- prefer silence over a weakly-grounded intervention
- for analytics specifically: prefer *not measuring* over surfacing a weak metric

**Corollary — the child's authorship is the tie-breaker.** When a plausible pedagogical benefit conflicts with the child's ownership of their own character, ownership wins. A character the tool talked a child out of is a worse outcome than an unpolished character the child meant.

---

## 9. Required closing sections

Every module ends with:

- **Limitations & disagreements in the evidence base**
- **Cultural assumptions embedded in the research**
- **Accessibility considerations** — neurodivergent learners, developmental language disorder, multilingual and emergent bilingual learners
- **Populations underrepresented in the evidence**
- **Open questions**
- **Source list** — only sources actually retrieved, each with URL and the role it played

These are not appendices. A module without them is incomplete, because the boundaries of the evidence are part of the evidence.

---

## 10. Cross-cutting commitments

Four commitments bind all modules and override any individual rule that conflicts with them.

**10.1 No single correct story shape.** Character Studio must not treat Western conflict-centered narrative as the definition of a story. Circular, episodic, non-conflict-centered, and culturally-specific narrative forms are valid outputs, not errors to be corrected.

**10.2 No incorrect characters.** Absence of a conventional trope is never a defect. The tool must never imply a child has built a character "wrong."

**10.3 Developmentally normal simplification is not error.** Flat characters, external-only traits, and unresolved motivation are expected at several bands. Each module maintains an explicit *do-not-flag* list; the union of those lists is binding.

**10.4 Support without stigma.** Differentiation and accessibility support are offered in ways that never visibly categorize a child. No child sees a label, a level, or a comparison to peers on creative work.

---

## 11. Module index

| Module | Scope | Claim prefix |
|---|---|---|
| `01` | Developmental storytelling milestones (ages ~5–14), character development over time | `A1-` |
| `02` | Narrative arc and story structure models, cross-cultural | `A2-` |
| `03` | Genre conventions, tropes, and character function within genre | `A3-` |
| `04` | Instructional scaffolding, literacy development, vocabulary, differentiation & accessibility | `A4-` |
| `05` | Educator analytics, assessment, standards alignment, episode integration, child data privacy | `A5-` |

**Known coverage note:** vocabulary/language complexity and differentiation were folded into module `04` rather than receiving a dedicated module. They are treated as full parts within that module, but a reader wanting maximum depth on either should treat `04` as a strong foundation rather than an exhaustive treatment.

---

## 12. Maintenance rules

1. **Sources rot.** Every claim carries a retrieval context. Re-verify before relying on a claim for a high-stakes decision.
2. **`[UNVERIFIED]` items are a work queue,** not permanent state. They are the highest-value targets for a follow-up research pass.
3. **Foundational ≠ settled.** Where modules cite foundational work, they also cite later refinements and critiques. Any future edit that adds a foundational citation must check for subsequent challenge to it.
4. **Adding a product rule requires a claim ID or a DESIGN DECISION flag.** No exceptions.
5. **Changing a claim requires checking its dependents.** Grep the claim ID across all modules before editing it.

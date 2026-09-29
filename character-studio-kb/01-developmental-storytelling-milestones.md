# Agent 1 — Developmental Storytelling Milestones (Ages ~5–14), with Emphasis on Character

**Knowledge base for Character Studio (Episode Page Portal, Grapevine platform)**

---

## Scope, method, and how to read this document

**Date of research session:** 2026-08-18
**Searches actually run this session:** 82 successful `WebSearch` queries.
**Full-text retrievals attempted:** 10 `WebFetch` calls — **all 10 were blocked by this session's network egress policy** (`files.eric.ed.gov`, `pubs.asha.org`, `pubmed.ncbi.nlm.nih.gov`, `pmc.ncbi.nlm.nih.gov`, `www.frontiersin.org`, `www.tandfonline.com`, `en.wikipedia.org`, `www.corestandards.org`, `conductscience.com`, `www.google.com`). WebFetch was subsequently confirmed to be non-functional for every domain tried, including general-purpose ones.

### What this means for how much you should trust each claim

This is the single most important caveat in this document, and it applies to **every** citation below.

Because full-text and abstract retrieval were blocked, **all evidence in this document was retrieved at search-result level**: page titles, URLs, and the search tool's synthesis of the retrieved pages. I did not read a single source document end-to-end. I therefore add a fourth marker beyond the required evidence tiers:

- **`[SNIPPET]`** — This claim, including any number in it, comes from the search tool's synthesis of retrieved pages rather than from a source document I read myself. I could not independently confirm that the number was correctly attributed to the study named. **Treat every `[SNIPPET]` number as approximately-right-but-verify-before-citing-externally.**

Claims where I have the study title, authors, journal, and year visible directly in a returned result title/URL are more reliable than claims where only the synthesis carried the detail. I have flagged the difference.

**Practical instruction for the product team:** any claim marked `[SNIPPET]` that you intend to put in front of a customer, a school district, or a funder must be re-verified against the primary source. Claims used only to shape internal product defaults can be used as-is, because the default stance of this document under uncertainty is neutrality (see below).

### Evidence tiers used

| Tier | Meaning |
|---|---|
| `[E1]` | Empirical finding (primary study, systematic review, meta-analysis) |
| `[E2]` | Theoretical framework / model |
| `[E3]` | Educational standard or curriculum framework |
| `[E4]` | Established instructional practice / professional consensus |
| `[E5]` | Commercial or proprietary system |
| `[E6]` | Emerging or contested claim |
| `[UNVERIFIED]` | Could not confirm this session; what I searched for is stated |
| `[SECONDARY-SOURCED]` | I read a source describing an older work I could not access; the citation is to what I read |
| `[SNIPPET]` | Retrieved only as search-tool synthesis (see above) — applies in addition to a tier |

### Claim IDs

Every substantive research claim is numbered `A1-Cnn`. Product rules cite the claim IDs they rest on.

### Strict separation

Every topic area has two clearly labelled parts: `## WHAT RESEARCH SAYS` (descriptive) and `## WHAT CHARACTER STUDIO SHOULD DO` (prescriptive). They are never blended. Product rules carry their own confidence level, which is **never higher** than the evidence beneath them.

### Shared age taxonomy

| Band | Ages | Grades |
|---|---|---|
| **B0** | 5–6 | K–1 (peripheral awareness) |
| **B1** | 7–8 | 2–3 |
| **B2** | 9–10 | 4–5 |
| **B3** | 11–12 | 6–7 |
| **B4** | 13–14 | 8–9 |

Each finding is reported with **the source's own age range first**, then mapped into these bands.

> **Bands are soft defaults, never gates.** Chronological age alone does not determine narrative ability. Within-band variance in this literature is consistently large — in one of the few studies that decomposed it, variance in narrative macrostructure scores was driven **primarily by child-level differences**, with minimal variance attributable to classroom or school (`A1-C14`). Character Studio must therefore route on **observed child output**, using age band only as a prior. Every scaffold rule in Part 3 is written to be overridden by observed behavior.

### Default stance under uncertainty

Where evidence is thin, mixed, or context-dependent, **the product recommendation defaults to neutrality or gentle optionality rather than prescription.** This is stated explicitly at each point where it applies. In practice this means: offer, don't require; suggest once, don't repeat; describe, don't score; and when in doubt, stay silent.

### Design decisions vs. research findings

Numeric thresholds in Part 3 that a developer can implement are mostly **not** in the research. Research gives direction (e.g. "internal state language increases with age"); it does not give "flag if fewer than 2 internal state words per 100 words." Every such number is explicitly labelled **`DESIGN DECISION`** and is a usability starting point to be A/B tested, not a finding.

### How to read the document

- **Part 1** — Foundations: the story-grammar tradition, its critics, and what survived.
- **Part 2** — Topic areas, each with research → product logic.
- **Part 3** — Consolidated implementable decision logic (prompt library, complexity envelopes, feedback thresholds, do-not-flag list, scaffold escalation).
- **Part 4** — Limitations, cultural assumptions, accessibility, underrepresented populations, open questions.
- **Part 5** — Source list.

---
---

# PART 1 — FOUNDATIONS: THE STORY-GRAMMAR TRADITION AND ITS CRITICS

## WHAT RESEARCH SAYS

### 1.1 The two foundational models

**`A1-C01`** `[E2]` `[SNIPPET]` Stein & Glenn's story grammar (published as *An Analysis of Story Comprehension in Elementary School Children*, in *New Directions in Discourse Processing*; an earlier version is archived as ERIC ED121474, 1975) proposes that a well-formed narrative is organized around an internalized **story schema**. Narrative macrostructure is defined as a **setting plus one or more episodes**, each episode consisting of an **initiating event** (an incident that motivates action by the main character), a **goal**, an **attempt** (goal-directed action), and a **consequence/outcome** related to the initiating event and the actions.
*Retrieved via:* ERIC record ED121474; Semantic Scholar record; ResearchGate records.
*Caveat:* the frequently repeated methodological detail that the study tested **48 children aged 6 and 10** who listened to and retold an unfamiliar folktale, recalling after a 20-second filled delay and again after one week, reached me through a *secondary* source (an ERIC-hosted paper on narrative instruction in elementary classrooms). **`[SECONDARY-SOURCED]`** — do not cite the sample size to Stein & Glenn directly without checking the original.

**`A1-C02`** `[E2]` Mandler & Johnson (1977), *Remembrance of things parsed: Story structure and recall*, **Cognitive Psychology, 9, 111–151**, doi 10.1016/0010-0285(77)90006-8, presented a tree-structure analysis of simple stories expressed as a **grammar of rewrite rules** defining units and their relationships, plus transformational rules mapping underlying to surface structure. The analysis was tested against Bartlett's *War of the Ghosts* protocols and then against a developmental recall study. `[SNIPPET]` The conclusion reported is that **both children and adults are sensitive to story structure, but story schemata differ at different points in development**, producing qualitative differences in recall.
*This citation is high-confidence:* journal, volume, page range and DOI all appeared in returned result metadata.

**`A1-C03`** `[E2]` `[SNIPPET]` Applebee (1978), *The Child's Concept of Story: Ages Two to Seventeen* (University of Chicago Press; ERIC ED155707) characterizes children's narrative development through stages organized around two abilities: **centring** (holding focus on a topic) and **chaining** (sequencing action). The commonly reproduced stage sequence is *heaps → sequences → primitive narratives → unfocused chains → focused chains → true narratives*. Search results consistently described the model as "six developmental levels" while one described "five stages," and the framework is described as **most appropriate for roughly ages 2–6**.
*Caveat:* I could not retrieve the primary text. Every description of the stage list I obtained came from teaching materials, flashcard sites, clinical handouts and a ResearchGate table reproducing "Applebee's (1978) developmental stages for narratives." Treat the stage *labels* as `[E4]` professional convention rather than as verified quotation from Applebee.

**`A1-C04`** `[E4]` `[SNIPPET]` Within the clinical/SLP tradition, **chain narratives** are described as containing four story grammar elements (initiating event; plan or character motivation; attempt/action; result/consequence) around a central theme with cause-effect or temporal relations, but with a **weak plot that does not build on character motivations**. **True narratives** are described as adding a fifth element — **resolution of the problem** — plus a central theme, character, plot, and the motivations behind characters' actions. A frequently repeated professional benchmark is that **by first grade, children with typical language development produce at least chain narratives, if not true narratives** (maps to **B0→B1 boundary**).
*Source type:* clinical handouts and parent-center materials, not primary research. `[E4]`, not `[E1]`.

**`A1-C05`** `[E4]` `[SNIPPET]` A parallel and widely used clinical staging (attributed to Westby) runs: **descriptive sequence** (before 4) → **action sequence** (before 4) → **reactive sequence** (~4–5; causality signalled by *because*, *so*) → **abbreviated sequence** (character goals/intentions plus causality) → **complete episode** (true narrative, temporally related statements around a central topic) → **complex / elaborated episodes** (**9+ years**: obstacles to attempts, multiple sequential episodes, or embedded episodes). Maps: elaborated/embedded episodes onset ≈ **B2 (ages 9–10)**.
*Source type:* clinical handouts, publisher blogs, an SLP conference PDF. `[E4]`.

### 1.2 The high-point / evaluative tradition (a genuinely different lens)

**`A1-C06`** `[E2]` `[SNIPPET]` McCabe & Peterson's **high point analysis** examines narrative macrostructure along a developmental continuum described in returned results as progressing **Two-Events → Leap-Frog → End-at-High-Point → Classic Narrative**, with "children aged 6 and older" building the story up to a climax. The **complicating action** constitutes the story's point or "high point" and carries the story's reportability/tellability. Related retrieved claims: children use evaluative devices in personal narratives from about age 2; young children's narratives contain proportionally **more referential information (event actions, background) than evaluative information**; and **inclusion of resolutions increases with age between 4 and 5**.
*Retrieved via:* Frontiers in Psychology article on narrative elaboration after storybook vs. video; a Southern Illinois University Edwardsville conference page; a *Topics in Language Disorders* 28(2), 162–177 PDF on personal narratives; the CHILDES Peterson/McCabe corpus page.
*Why this matters for Character Studio:* high-point analysis rewards **emotional pointedness and evaluation**, whereas story grammar rewards **structural completeness**. A child can score well on one and poorly on the other. A tool that only implements story grammar systematically under-credits expressive, performance-oriented storytelling.

**`A1-C07`** `[E1]` `[SNIPPET]` Bamberg & Damrad-Frye (1991), *On the ability to provide evaluative comments: further explorations of children's narrative competencies*, **Journal of Child Language** (PubMed 1761620), elicited narratives with a 24-picture wordless book from three groups: **5-year-olds, 9-year-olds, and college-age adults** (maps **B0**, **B2**, adult). Reported: an increase with age in the frequency of **five types of evaluation beyond what story length alone would predict** — reference to thoughts and emotions, character dialogue, hedges (e.g. *seems like*), negative qualifiers, and causal connectors. **Reference to thoughts and emotions was used more frequently than the other types by the two older groups.** The authors' interpretation as reported: young children make limited use of evaluative clauses because they are **less able to adopt a global perspective on the narrative**.

### 1.3 The critiques — foundational models are *not* uncontested

**`A1-C08`** `[E2]`/`[E6]` `[SNIPPET]` Black & Wilensky (1979), *An Evaluation of Story Grammars*, **Cognitive Science, 3(3)** (Wiley, doi 10.1207/s15516709cog0303_2), argued story grammars are an unproductive approach on three grounds: (a) **formal inadequacy** — most are context-free rewrite rules, known to be inadequate even for sentence grammars; (b) **empirical inadequacy** — there are stories that do not follow story grammars and non-stories that do; (c) **as comprehension models** they add nothing to semantic/content-oriented models.

**`A1-C09`** `[E2]` `[SNIPPET]` The critique was itself heavily contested. Retrieved rebuttals include Mandler & Johnson, *On throwing out the baby with the bathwater: A reply to Black and Wilensky's evaluation of story grammars* (ScienceDirect S0364021380800061); Rumelhart, *On Evaluating Story Grammars* (Semantic Scholar); and *A Re-Evaluation of Story Grammars*, **Cognitive Science, 1981**, doi 10.1111/j.1551-6708.1981.tb00868.x. Reported counter-arguments: Black & Wilensky asserted but did not demonstrate that discontinuous elements occur in the relevant domain; did not present adequate evidence that acceptable stories fall outside existing grammars or that grammars accept non-stories such as procedures; and took an unduly narrow view by claiming people understand only story *content* and hold no useful knowledge of story *structure*.
**Net position for the product:** story grammar is best treated as a **useful descriptive and instructional scaffold with contested status as a cognitive theory**. It is defensible as a teaching frame; it is not defensible as a claim about how children's minds necessarily work.

**`A1-C10`** `[E6]` `[SNIPPET]` Stage models of narrative development have questionable empirical validation as *stages*. A retrieved framing (associated with the Khan et al. JSLHR work, `A1-C13`) notes that although prior theoretical and empirical work references broad stages of narrative development, **there is considerable variation in how story structure has been defined and assessed across studies**, motivating work that tests the *unidimensionality* of story-structure items and examines **age-related progressions on individual story-structure components** rather than on stages as wholes. A separate retrieved source (Frontiers in Psychology, *When all children comprehend: increasing the external validity of narrative comprehension development research*) argues that prior research emphasized internal and predictive validity, **limiting generalizability**.
**Product implication:** measure and scaffold **individual components** (does a goal appear? is there a consequence?), not **stage membership**. Never tell a child or teacher that a child "is at stage 3."

**`A1-C11`** `[E6]` `[SNIPPET]` Whether narrative **macrostructure** reliably differentiates typically developing children from children with developmental language disorder is **actively disputed**; retrieved sources describe conflicting results, attributed in part to methodological differences — **especially whether a story retell or a story generation task was used**, with story generation being the more difficult task. See also `A1-C60`.

**`A1-C12`** `[E6]` `[SNIPPET]` Retrieved critique holds that important aspects of communicative competence — **narrative engagement, audience awareness, and emotional understanding conveyed through prosodic cues** — are **not captured by traditional story grammar analysis**, and that a stylistic framework recognizing both structural competence *and* expressiveness permits a more culturally responsive interpretation of children's storytelling. Retrieved from an OhioLINK doctoral dissertation on storytelling elements and cultural variation, plus a ResearchGate cross-cultural narratology paper arguing traditional narratological approaches carry **inherent Eurocentric biases**.
*Confidence: low-to-moderate.* These are argumentative/theoretical positions from sources I could only see in synthesis. They are directionally consistent with the empirical cultural work in §2.14, which is stronger.

### 1.4 The one large modern component-level study I could identify

**`A1-C13`** `[E1]` `[SNIPPET]` Khan, Gugiu, Justice, Bowles, Skibbe & Piasta (2016), *Age-Related Progressions in Story Structure in Young Children's Narratives*, **Journal of Speech, Language, and Hearing Research** (December 2016), doi 10.1044/2016_JSLHR-L-15-0275, PMID 27930767. **n = 386**, mean age **4.8 years**, ages **3–6** (maps **pre-B0 → B0**), drawn from the Narrative Assessment Protocol study. Examined age-related progressions on **individual story-structure components** across 3-, 4-, 5- and 6-year-olds. Reported conclusion: **children are actively acquiring narrative skills between 3 and 6 years of age.**
*Note:* this is the age range *below* Character Studio's core audience. It matters mainly as evidence that by the time children arrive in grade 2, the *acquisition* of basic structure is well underway but not complete.

**`A1-C14`** `[E1]` `[SNIPPET]` A Frontiers in Education study of **early narrative macrostructure in kindergarten through second grade in Appalachian schools** (feduc.2026.1848759) recruited **435 participants from eight public elementary schools in West Virginia** (maps **B0–B1**). Reported findings: narrative macrostructure shows measurable growth during early elementary years, but **mastery of the core basic episode elements required for coherent storytelling develops more gradually** than overall growth suggests; and **variability in macrostructure scores was driven primarily by child-level differences, with minimal variance attributable to classroom or school context.**
**This is the single most product-relevant statistical claim in the document:** it is direct evidence that individual variation dominates, which is why Character Studio must route on output, not age.

---

## WHAT CHARACTER STUDIO SHOULD DO

### Rules from Part 1

**`R1.1` — Use story grammar as an internal *representation*, never as a visible *verdict*.**
*Basis:* `A1-C01`, `A1-C02`, `A1-C08`, `A1-C09`, `A1-C10`. *Confidence: high.*
Character Studio may internally tag which of {character, setting, initiating event, internal response, goal/plan, attempt/action, consequence, resolution} are present in a child's story. It must **never** display a completeness score, a stage label, a percentage, or a "your story is missing X of 7 elements" readout to a child. The model is contested as cognitive theory (`A1-C08`) and stage membership is not well validated (`A1-C10`); presenting it as a verdict overstates the evidence and converts a teaching scaffold into a judgment.

**`R1.2` — Component-level, never stage-level.**
*Basis:* `A1-C10`. *Confidence: high.*
All internal telemetry, all teacher-facing views, and all suggestion triggers operate on **individual components**. No data model field should be named `narrativeStage`. If a teacher-facing view is built, it shows component presence over time, not a stage.

**`R1.3` — Implement a second, parallel "expressiveness" lane alongside the structure lane.**
*Basis:* `A1-C06`, `A1-C07`, `A1-C12`. *Confidence: moderate* (the high-point tradition is well established `[E2]`, but the specific continuum labels are `[SNIPPET]`).
Track and celebrate: emotional pointedness, character dialogue, hedges, intensifiers, direct address to the reader, and "the moment everything changed." A child whose story is structurally thin but emotionally vivid must be able to receive positive, specific recognition from the tool. Concretely: the suggestion engine draws from **two pools** — a structure pool and an expressiveness pool — and when the structure pool would fire, the system checks whether the expressiveness signal is strong; if it is, it praises from the expressiveness pool instead of prompting from the structure pool at least 50% of the time (**DESIGN DECISION**, ratio to be tuned).

**`R1.4` — Age band sets the *prior*; observed output sets the *behavior*.**
*Basis:* `A1-C14`. *Confidence: high* — this rests on the strongest variance-decomposition claim retrieved.
Pseudo-rule:

```
scaffoldLevel = f(observedOutput)          // primary
initialScaffoldLevel = g(ageBand)          // prior, used only for the first 1–2 sessions
// After 2 completed character creations, ageBand must contribute
// no more than a tie-break to scaffoldLevel.
```

**`R1.5` — Under uncertainty, default to describing rather than evaluating.**
*Basis:* default stance; supported by `A1-C11`, `A1-C12`. *Confidence: high (policy, not finding).*
When Character Studio is unsure whether something is a developmental gap or a stylistic choice, it says what it noticed ("Your character says a lot out loud — I can hear her voice") rather than what is missing.

---
---

# PART 2 — TOPIC AREAS

---

## 2.1 Event sequencing and temporal language

### WHAT RESEARCH SAYS

**`A1-C15`** `[E1]` `[SNIPPET]` Connectives are acquired in a broadly consistent order: **additive relations first (*and*), followed by temporal, causal, and adversative relations.** Retrieved from Frontiers in Psychology, *Comprehension of Connectives: Development Across Primary School Age and Influencing Factors* (fpsyg.2020.00814).

**`A1-C16`** `[E1]` `[SNIPPET]` **Production precedes comprehension for temporal connectives by a wide margin.** Children produce a range of connectives by about age 5 and produce temporal connectives from around age 3, but have difficulty on tasks assessing *comprehension* of these connectives **up to at least 12 years of age** (maps: production ≈ pre-**B0**; secure comprehension extends past **B3**). Retrieved from the Frontiers connectives paper and *Context and strategy in acquiring temporal connectives*, **Journal of Psycholinguistic Research** (Springer, doi 10.1007/BF01072000).

**`A1-C17`** `[E1]` `[SNIPPET]` **"Before" is mastered earlier than "after"** in 3- to 5-year-olds, attributed to semantic complexity (*before* points to the prior event; *after* does not). Even **12-year-olds** show difficulty when the connective implies an order of propositions reversed relative to chronological event order.

**`A1-C18`** `[E1]` `[SNIPPET]` Children's comprehension is most accurate when **clause presentation order matches chronological event order** — children rely on natural event order. Retrieved from *Young Children's Comprehension of Temporal Relations in Complex Sentences: The Influence of Memory on Performance*, **Child Development, 86(6), 1922** (Oxford Academic) and the associated PMC-indexed processing study.

**`A1-C19`** `[E1]` `[SNIPPET]` Crosslinguistically, Berman & Slobin (1994), *Relating Events in Narrative: A Crosslinguistic Developmental Study* (Routledge/Erlbaum; ISBN 9781138984912), analysed **more than 250 texts from children and adults speaking five languages (English, German, Spanish, Hebrew, Turkish)**, all elicited with the same wordless picture book (*Frog, Where Are You?*, Mercer Mayer), across preschool, school-age and adult participants. The work addresses how **structural properties and rhetorical preferences of the native language shape narrative abilities across development**, alongside possibly universal patterns in the developing ability to create globally organized narratives.

### WHAT CHARACTER STUDIO SHOULD DO

**`R2.1a` — Never correct a child's use of "and then" as a connective.**
*Basis:* `A1-C15`, `A1-C16`. *Confidence: high.*
Additive chaining is the earliest and most robust connective strategy and remains a legitimate stylistic choice at every age. "And then… and then…" is on the **do-not-flag list** (Part 3, §3.5) for all bands.

**`R2.2a` — Offer temporal variety as *vocabulary enrichment*, not as error repair, and only from B2 upward.**
*Basis:* `A1-C15`, `A1-C16`, `A1-C17`. *Confidence: moderate.*
```
IF band >= B2 (ages 9–10)
AND story contains >= 5 consecutive event clauses joined only by "and"/"and then"
AND child has not dismissed a temporal-variety suggestion in this session
THEN offer ONCE, phrased additively:
     "Want a few other ways to move time along? (meanwhile, later that day, just before)"
ELSE stay silent.
```
The threshold of **5 consecutive clauses** is a **DESIGN DECISION**, not a research finding.

**`R2.3a` — Do not ask children to write events out of chronological order, and do not "improve" a story by reordering it.**
*Basis:* `A1-C17`, `A1-C18`. *Confidence: moderate-high.*
Non-chronological presentation (flashback, *in medias res*) taxes comprehension into adolescence. Character Studio may **offer** flashback as an optional advanced move at **B3–B4**, framed as a craft experiment, and must never auto-restructure a child's event order.

**`R2.4a` — Treat temporal-connective errors in multilingual writers as a language-transfer signal, not a narrative-ability signal.**
*Basis:* `A1-C19`. *Confidence: moderate.*
See §2.16.

---

## 2.2 Causal coherence

### WHAT RESEARCH SAYS

**`A1-C20`** `[E1]` `[SNIPPET]` The ability to use and understand causal connections in narrative **begins around age 4 and continues improving through ages 10–11** (maps **pre-B0 → B2**). Retrieved from a University of Louisville dissertation on young children's use of causal connections during storytelling and from *A profile of causal development amongst ten-year-olds: Implications for reading and writing*, **Reading and Writing** (Springer, doi 10.1007/BF00404001).

**`A1-C21`** `[E1]` `[SNIPPET]` A directly age-contrastive finding: **six-year-olds'** stories showed significantly more structured patterns based on a **temporal sequence of events, though still relatively static**, whereas **eight-year-olds'** stories were mostly structured and contained **descriptions of characters' thoughts and feelings, appropriate relations among them, and causal relations** (maps **B0 → B1**). Retrieved from Sah, *The Development of Coherence in Narratives: Causal Relations* (ACL Anthology Y13-1015) and the associated ResearchGate record.
**This is one of the most directly product-relevant claims in the document:** the shift from *static sequence* to *causally-and-psychologically related sequence* is reported as occurring across the **6 → 8** window, i.e. right at the **B0/B1 boundary**, which is Character Studio's entry point.

**`A1-C22`** `[E1]` `[SNIPPET]` Typically developing children are reported to begin producing **more complex, detailed, and structurally coherent narratives around ages 9–10** (maps **B2**).

**`A1-C23`** `[E2]` `[SNIPPET]` Coherence measures in this tradition include reference to story components plus **four types of causal relation: psychological, motivational, enabling, and physical.** This four-way distinction is useful for product instrumentation because *motivational* and *psychological* causality are exactly the character-centric kinds.

**`A1-C24`** `[E1]` `[SNIPPET]` Narrative causal understanding is related to school skills including **reading comprehension and memory**; the developmental trend is explained as an increase in **narrative knowledge** — children learn more about what narratives require as they get older. (Relevant because it supports an instructional, not maturational, framing: knowledge can be taught.)

### WHAT CHARACTER STUDIO SHOULD DO

**`R2.1b` — "Why?" is the highest-yield single prompt in the product, and it should be band-gated in *phrasing*, not in *availability*.**
*Basis:* `A1-C20`, `A1-C21`, `A1-C23`, `A1-C24`. *Confidence: high.*
Causal reasoning is developing from age 4 and is teachable (`A1-C24`), so a "why" prompt is appropriate at every band; only its wording changes.

| Band | "Why" prompt phrasing |
|---|---|
| B0 (5–6) | "What happened next because of that?" (enabling causality; concrete) |
| B1 (7–8) | "Why did she do that?" (motivational causality — newly available per `A1-C21`) |
| B2 (9–10) | "What made him decide to do that, even though it was risky?" |
| B3 (11–12) | "What does she *want* that makes this the only thing she could do?" |
| B4 (13–14) | "What does he believe about himself that makes this choice make sense to him?" |

**`R2.2b` — Do not expect or prompt for psychological causality before B1.**
*Basis:* `A1-C21`. *Confidence: moderate.*
At **B0**, static temporal sequencing is developmentally expected. A B0 story that is a chain of events with no stated reasons is **not** deficient and must not be flagged.

**`R2.3b` — Instrument causality by type, and report only the character-relevant types.**
*Basis:* `A1-C23`. *Confidence: moderate (the four-type taxonomy is `[SNIPPET]`).*
```
causalSignals = {
  physical:      count of physical cause markers,
  enabling:      count of enabling-condition markers,
  motivational:  count of goal/desire-driven cause markers,   // character-relevant
  psychological: count of belief/emotion-driven cause markers // character-relevant
}
// Suggestion engine reads ONLY motivational + psychological.
// physical/enabling are logged for research, never surfaced.
```

---

## 2.3 Character goals and motivation

### WHAT RESEARCH SAYS

**`A1-C25`** `[E1]` `[SNIPPET]` Trabasso & Nickels (1992), *The development of goals plans of action in the narration of picture stories*, **Discourse Processes, 15(3), 249–…**, doi 10.1080/01638539209544812. Reported: **9-year-olds and adults narrate according to a hierarchical goal plan of action**, with striking developmental differences from age 3 to 5; **3-year-olds described states and neutral outcomes unrelated to the central theme**. (Maps: hierarchical goal-plan narration established by **B2**.)
*Citation confidence:* the full citation string (journal, volume, issue, year, DOI) appeared in a returned Google Scholar lookup URL. The findings are `[SNIPPET]`.

**`A1-C26`** `[E2]` `[SNIPPET]` Trabasso's causal network model specifies **goal-directed action plans including goals, attempts, goal failures and reinstatements, and ultimate successes** — i.e. *failure and re-attempt* is a formal part of the model, not an optional flourish. Retrieved via Trabasso & Wiley, *Goal Plans of Action and Inferences During Comprehension of Narratives*.

**`A1-C27`** `[E1]` `[SNIPPET]` Including a **positive or negative protagonist goal** (versus a "neutral" goal) produced **qualitatively different and better inferential comprehension** as measured by probe questions. Retrieved via *Goals, inferential comprehension, and recall of stories by children*, **Discourse Processes, 1(4)**, doi 10.1080/01638537809544444.
**Product reading:** a character who *wants something specific* makes the whole story more comprehensible. Goal specification is the highest-leverage character field.

**`A1-C28`** `[E1]` `[SNIPPET]` **"52% of kindergarten stories assessed as 'goal-based'"** — young children predominantly achieve narrative coherence through goal-directed activities of a **single protagonist**.
*Flag:* this figure appeared in the search synthesis without a clearly attributable source among the returned results. **Treat as `[SNIPPET]` and low confidence.** What is safer to carry forward is the qualitative half: coherence at **B0** typically runs through **one** protagonist's goal.

**`A1-C29`** `[E4]` `[SNIPPET]` A widely repeated clinical benchmark: **between ages 7 and 9, children's stories contain complete episodes that include internal goals, motivation, and reactions of characters** (maps **B1 → B2**). Surfaced in association with Nippold's later-language-development work but not attributable by me to a specific page. Treat as professional consensus, not primary finding.

**`A1-C30`** `[E4]` `[SNIPPET]` Frequently cited clinical benchmarks: **abbreviated/incomplete episodes** (character goal referred to but not how it was achieved) appear around **6–7 years**; **complete episodes** are produced by **approximately 60% of 8-year-olds** and typically appear around **8–9 years**; and **"true narratives" emerge at 6–7 years**.
*Flag:* the 60% figure came from a synthesis over clinical/professional pages (an SLP blog, a publisher blog, a conference handout), **not** from a primary study I could identify. **`[E4]` `[SNIPPET]`, low confidence on the number.** The directional claim — complete episodes are a **B1-to-B2** achievement, not a B1 entry expectation — is better supported and is what the product should use.

### WHAT CHARACTER STUDIO SHOULD DO

**`R2.1c` — "What does your character want?" is the anchor question of the entire product.**
*Basis:* `A1-C25`, `A1-C27`, `A1-C28`. *Confidence: high.*
Goal specification improves narrative comprehensibility (`A1-C27`) and is the organizing spine of coherence from the earliest band (`A1-C28`). It should be asked **first**, before traits, appearance, or backstory, in every band.

**`R2.2c` — One protagonist goal is the default at B0–B1. Do not invite goal multiplicity early.**
*Basis:* `A1-C25`, `A1-C28`. *Confidence: moderate.*
```
IF band <= B1: characterGoalSlots = 1
IF band == B2: characterGoalSlots = 1, optional "and what gets in the way?" slot
IF band >= B3: characterGoalSlots = 1 primary + optional 1 conflicting internal want
```
Slot counts are a **DESIGN DECISION**.

**`R2.3c` — Introduce *goal failure and re-attempt* as an explicit, teachable move at B2.**
*Basis:* `A1-C26`, `A1-C29`, `A1-C30`. *Confidence: moderate.*
Failure/reinstatement is formally part of the goal-plan model (`A1-C26`) and complete episodes consolidate across 8–9 (`A1-C30`). Prompt at B2: *"Did it work the first time? What happened when it didn't?"* Do **not** prompt for this at B0–B1, where an attempt-then-success story is developmentally expected.

**`R2.4c` — Prefer a *specific* goal over a *grand* goal at every age, and say so.**
*Basis:* `A1-C27`. *Confidence: moderate.*
When a child writes "she wants to be happy" or "he wants to save the world," Character Studio may offer once: *"What's one thing she could get today that would show us she's getting there?"* This is framed as adding, never as fixing.

---

## 2.4 Conflict and resolution

### WHAT RESEARCH SAYS

**`A1-C31`** `[E1]` `[SNIPPET]` Inclusion of **resolutions** in children's personal narratives increases with age **between 4 and 5 years**, while complicating actions are present at all ages (from the high-point tradition, `A1-C06`). Maps: complicating action early; resolution later and less reliably.

**`A1-C32`** `[E5]`/`[E4]` The **Narrative Scoring Scheme (NSS)** used with SALT Software treats **Conflict/Resolution** as one of seven scored categories, alongside Introduction, Character Development, Mental States, Referencing, Cohesion, and Conclusion. Scored 0–5, where **5 = proficient, 3 = emerging/inconsistent, 1 = minimal/immature**, with 2 and 4 requiring scorer judgement. `[SNIPPET]` The NSS derives from a *Rubric for Completing a Story Grammar Analysis* developed by the Madison Metropolitan School District SALT working group in 1998, following Stein & Glenn (1979; 1982). A Narrative Story Retell reference database covers **grades P–6**.
*Retrieved via:* saltsoftware.com scoring guide PDFs and course files; PaTTAN-hosted copy of the NSS scoring guide; and *Properties of the Narrative Scoring Scheme Using Narrative Retells in Young School-Age Children*, **American Journal of Speech-Language Pathology**, doi 10.1044/1058-0360(2009/08-0024).
**Why this matters:** the NSS is the closest thing in the retrieved literature to a **ready-made, field-tested, seven-dimension rubric that already separates "Character Development" from "Mental States"** — precisely the two dimensions Character Studio needs. It is a commercial system `[E5]`, so it is a design reference, not evidence.

**`A1-C33`** `[E5]`/`[E4]` The **MISL** (Monitoring Indicators of Scholarly Language; Gillam, Gillam, Fargo, Olszewski & Segura, 2017, **Communication Disorders Quarterly, 38(2), 96–106**) scores a macrostructure subscale of **seven story elements: character, setting, initiating event, internal response, plan, action, consequence.** `[SNIPPET]` Each element is scored **0 = absent, 1 = emerging, 2 = present/mastered, 3 = elaborated**, giving a total instrument range of **0–39** across macro- and microstructure. Critically, **scores are awarded based on how elements are causally/temporally related, not on how many times an element appears.**
*Retrieved via:* SAGE record (doi 10.1177/1525740116651442); a Utah State University-hosted PDF of the 2022 Frontiers in Education MISL paper (feduc.2022.918127); PaTTAN-hosted MISL supplemental materials; an NCUR undergraduate research proceedings PDF.

**`A1-C34`** `[E5]`/`[E1]` The **Index of Narrative Complexity (INC)** (Petersen, Gillam & Gillam, 2008, **Topics in Language Disorders, 28, 115–130**) is a criterion-referenced progress-monitoring system for macro- and microstructure in school-age children, with scales including **character and setting**. `[SNIPPET]` Reported preliminary properties: scorable consistently, yields similar scores across **five elicitation formats**, is **sensitive to change after intervention**, and **correlates highly with the Test of Narrative Language**.

### WHAT CHARACTER STUDIO SHOULD DO

**`R2.1d` — Model Character Studio's internal character schema on the MISL/NSS element set, because it is field-tested and already character-aware.**
*Basis:* `A1-C32`, `A1-C33`, `A1-C34`. *Confidence: moderate — these are `[E5]` commercial instruments, adopted as design references, not as evidence that this schema is developmentally correct.*
Recommended internal fields, mapped from MISL: `character`, `setting`, `initiatingEvent`, `internalResponse`, `plan`, `action`, `consequence`. Recommended internal quality dimensions, mapped from NSS: `introduction`, `characterDevelopment`, `mentalStates`, `referencing`, `conflictResolution`, `cohesion`, `conclusion`.

**`R2.2d` — Score relational quality, not element counts.**
*Basis:* `A1-C33`. *Confidence: moderate-high.*
This is the most transferable single lesson from MISL. A story mentioning "goal" nine times is not better than one mentioning it once and connecting it causally to the consequence. Any internal quality signal must be computed on **whether elements are causally/temporally linked**, never on frequency.

**`R2.3d` — Use a 4-point absent/emerging/present/elaborated internal scale, and surface only the *top* of the child's profile.**
*Basis:* `A1-C33`. *Confidence: moderate.*
Internally: 0–3 per element. Externally to the child: name **one element they scored highest on**, in plain words. Never name a 0.

**`R2.4d` — Do not require a resolution below B2.**
*Basis:* `A1-C31`, `A1-C30`, `A1-C21`. *Confidence: moderate.*
Resolution is the least reliable element developmentally. A B0–B1 story that stops at the high point is a legitimate narrative shape (`A1-C06`) and belongs on the **do-not-flag list**.

---

## 2.5 Perspective-taking and theory-of-mind demands in narrative

### WHAT RESEARCH SAYS

**`A1-C35`** `[E1]` `[SNIPPET]` **First-order false belief** understanding is achieved around **age 4**. **Second-order false belief (SOFB)** — a belief about another's belief — is "usually achieved between **7 and 9 years**," with success emerging around **5–6** on simplified tasks, roughly **65% success at age 7**, and **~100% accuracy by age 11**. Method of assessment materially changes the estimates.
*Retrieved via:* Frontiers in Psychology, *Desires and beliefs: the development of second-order Theory of Mind reasoning in preschoolers and in school-age children* (fpsyg.2025.1525368); a J-STAGE *Psychologia* article on young children's understanding of second-order mental states; Frontiers in Communication, *Expressive syntax matters for second-order false belief* (fcomm.2024.1401576); PLOS ONE, *Syntactic Recursion Facilitates and Working Memory Predicts Recursive Theory of Mind* (doi 10.1371/journal.pone.0169510).
*Confidence note:* the specific percentages (65% at 7; 100% by 11) came from the synthesis across several of these pages and **could not be attributed to one study**. `[SNIPPET]`, moderate-low confidence on the numbers; **high confidence on the range 7–9 with wide method-dependence.**

**`A1-C36`** `[E1]` `[SNIPPET]` Both **language and executive function**, particularly **working memory capacity**, relate positively to second-order task performance. Recursive ToM is facilitated by syntactic recursion.
**Product reading:** a child who *can* reason about nested beliefs may still fail to *write* them, because writing them requires holding a recursive structure while transcribing. This is a load problem, not a comprehension problem — see `R2.3e`.

**`A1-C37`** `[E1]` `[SNIPPET]` **By age five, children can consider the mental perspective of a character in a simple story, whereas younger children focus more on the character's physical state.** Theory of mind enables children to infer characters' perspectives, motivations and emotions, enriching narrative understanding.
**Maps: the physical → mental shift in how children attend to characters lands at roughly the B0 entry point.** This is the developmental root of the "external traits → internal traits" progression in §2.7.

**`A1-C38`** `[E1]` `[SNIPPET]` A study of **86 typically developing children and adolescents aged 7–14** (maps **B1–B4**) collected **six autobiographical memories and five fictional stories** each and found that **narrative coherence and mentalizing complexity were associated with each other in both genres, and each measure was associated across genres**. Higher coherence and mentalizing on autobiographical memories specifically related to **better teacher-reported social-emotional reciprocity**.
*Retrieved via:* ScienceDirect S0885201424000698 (*Cognitive Development*, 2024) and the University of Copenhagen research portal record.
**Product reading — important:** narrative coherence and mentalizing **generalize across fictional and personal genres in this age range.** A child's fictional character work is therefore informative about, and trainable alongside, their personal narrative skill. It also means Character Studio does *not* need to collect personal narratives to support this development; fiction is sufficient.

**`A1-C39`** `[E1]` `[SNIPPET]` "In junior high school, a social dimension is added to stories with thematized interpersonal relations, accompanying an increased mind-making." (Maps **B3–B4**.) Sourced from the synthesis over ToM/narrative results; **not attributable to a specific retrieved study.** `[SNIPPET]`, low confidence — but consistent with `A1-C38` and `A1-C55`.

**`A1-C40`** `[UNVERIFIED]` I could not locate a meta-analysis specifically quantifying the **theory of mind → narrative production** relationship. A returned result mentioned a pre-registered meta-analysis of **53 studies / 12,347 participants aged 2.5–17** but on **theory of mind and *academic achievement***, not narrative production. I did not verify it and do not cite it as a narrative finding. *Searched for:* "theory of mind narrative production children meta-analysis relation storytelling perspective taking."

### WHAT CHARACTER STUDIO SHOULD DO

**`R2.1e` — Gate *nested* mental states (A thinks that B thinks…) to B2 and above, and never as a requirement.**
*Basis:* `A1-C35`, `A1-C36`. *Confidence: moderate-high on direction; low on exact age, because the literature's own estimates move by years depending on task.*
```
IF band <= B1: DO NOT prompt for second-order mental states.
               DO NOT flag their absence. Ever.
IF band == B2: MAY offer once, as an optional craft card:
               "Does anyone in your story believe something that isn't true?"
IF band >= B3: MAY offer misunderstanding/secret/dramatic-irony prompts freely,
               still as options, never as requirements.
```

**`R2.2e` — Single-perspective mental states (A feels X) are appropriate from B0.**
*Basis:* `A1-C37`. *Confidence: moderate-high.*
"How does she feel about that?" is safe and useful at every band. It is the nested case that is gated.

**`R2.3e` — When a child *can* reason about a complex mental state but can't get it onto the page, reduce transcription load rather than simplifying the idea.**
*Basis:* `A1-C36`, plus §2.12 on transcription. *Confidence: moderate.*
Offer voice capture, sentence frames, or a "say it to me and I'll hold it for you" note field — **not** a simpler prompt. Simplifying the prompt in response to a transcription bottleneck is a design error that misdiagnoses load as ability.

**`R2.4e` — Do not treat fictional character work as a lesser substitute for personal narrative.**
*Basis:* `A1-C38`. *Confidence: moderate.*
Coherence and mentalizing generalize across genres at 7–14. Character Studio's fiction-first design is developmentally defensible on this evidence and should be described that way to educators.

---

## 2.6 Internal state language / mental state talk

### WHAT RESEARCH SAYS

**`A1-C41`** `[E1]` `[SNIPPET]` Personal narratives told by **five-year-olds** included **more cognitive states and more narrativized speech** than those told by **three- and four-year-olds**. Retrieved via *Developmental differences in reported speech and internal state language in preschoolers' personal narratives*, **Journal of Child Language** (Cambridge Core). Maps: pre-**B0** → **B0**.

**`A1-C42`** `[E1]` `[SNIPPET]` Scores for mental state verb use **increase with age from early childhood into elementary school**, demonstrating **prolonged development** — i.e. this is not a skill that completes in the preschool years. The **first years of primary school** are described as an important transition in narrative competence and mental state talk, with children developing the ability to **coordinate mental state talk and narrative structure** as an effect of **both age and schooling**. Retrieved via *The influence of narrative competence on mental state talk in kindergarten and primary school children* (PubMed 31271230).
**Product reading:** "coordinate mental state talk *and* narrative structure" is the key phrase. Children may have either separately before they can run both at once. Prompting for both simultaneously at **B0–B1** may exceed capacity.

**`A1-C43`** `[E1]` `[SNIPPET]` Order of emergence within internal state vocabulary: children begin with words referencing **emotions, intentions and compulsions**; **cognition words** appear later, shortly before preschool entry. So *feel/want* precede *think/know/believe*.

**`A1-C44`** `[E1]` `[SNIPPET]` Internal state term use is culturally and linguistically variable. Retrieved: *The Influence of Age and Cultural Context on Internal State Terms Production in Luganda-Speaking Children's Narratives* (Uziel, Oriikiriza, Tselekidou & Gagarina, 2025, SAGE, doi 10.1177/01427237251364965); and *Internal State Terms in the Narratives of Bilingual Children With Developmental Language Disorder: The Role of Microstructure and Macrostructure*, **LSHSS** (doi 10.1044/2024_LSHSS-23-00170).

**`A1-C45`** `[E1]` `[SNIPPET]` Longobardi, Spataro, Renna & Rossi-Arnaud (2014), *Comparing fictional, personal, and hypothetical narratives in primary school: story grammar and mental state language*, **European Journal of Psychology of Education** (doi 10.1007/s10212-013-0197-y; ERIC EJ1036501). **150 children in grades 3, 4 and 5** (maps **B1–B2**) wrote fictional, personal and hypothetical stories. Reported: children were **better able to write fictional and hypothetical than personal stories**, both on total number of narrative categories and on the **percentage of stories including at least one complete episode**; the three tasks were clearly differentiated on narrative categories and mental state language; and **use of mental state words correlated with frequency of subordinate propositions and number of narrative categories**.
**This is a strong, directly applicable finding for a fiction-first product:** in grades 3–5, *invented* stories were structurally stronger than *personal* ones. Fiction is not the harder task at this age; it is the easier one.

**`A1-C46`** `[E1]` `[SNIPPET]` *The influence of story character realism and theme on protagonists' internal states and dialogue in children's retells* (**Cognitive Development**, 2024, S0885201424000431; Lancaster eprints 220368), with **3- to 7-year-olds** (maps **pre-B0 → B1**): **older children included more internal state references and dialogue in their retells than younger children**; and children retelling a prosocial story with **human** protagonists included **more socio-relational language** than those retelling a busy-themed story with humans — an advantage **not** found for stories with **animal** protagonists. Related retrieved claim: stories with fantastical protagonists are associated with poorer social learning than those with human protagonists; **animal characters appear to elicit less robust representations of social ideas.**
*Confidence caveat:* these are **retell/comprehension** studies about children's responses to *given* stories, **not** studies of children's *own* invented characters. Do not over-transfer.

### WHAT CHARACTER STUDIO SHOULD DO

**`R2.1f` — Sequence internal-state prompts as feel/want → think/know → believe-about-belief.**
*Basis:* `A1-C43`, `A1-C35`. *Confidence: moderate.*

| Band | Internal-state prompt tier |
|---|---|
| B0 (5–6) | feelings and wants only: "How does she feel?" "What does she want?" |
| B1 (7–8) | + simple cognition: "What is he thinking right then?" |
| B2 (9–10) | + knowledge/ignorance: "What does she know that nobody else knows?" |
| B3 (11–12) | + belief and self-belief: "What does he believe about himself?" |
| B4 (13–14) | + belief about others' beliefs, contradiction between belief and behavior |

**`R2.2f` — Do not prompt for structure and interiority in the same turn at B0–B1.**
*Basis:* `A1-C42`. *Confidence: moderate.*
Coordination of mental state talk with narrative structure is itself the developing skill in early primary. Alternate turns:
```
IF band <= B1:
   prompt turns alternate: [structure] -> [interiority] -> [structure] -> ...
   NEVER: "What happened next, and how did she feel about it, and why did she decide to?"
```

**`R2.3f` — Never flag low internal-state density as a deficiency. Treat it as an *invitation slot*.**
*Basis:* `A1-C41`, `A1-C42`, `A1-C44`. *Confidence: high.*
Internal state language develops over an extended period and varies by language and culture (`A1-C44`). A story low in mental state words may reflect band, language background, or genre preference. The tool may **offer** one interiority prompt; it may **never** report low interiority.

**`R2.4f` — Lean into fiction. Do not push children toward personal narrative for "authenticity."**
*Basis:* `A1-C45`. *Confidence: moderate-high.*
In grades 3–5, invented and hypothetical stories were structurally *stronger* than personal ones. Character Studio should not include prompts of the form "write about a time this really happened to you" as a scaffold toward better structure; the evidence points the other way.

**`R2.5f` — Do not steer children away from animal or fantastical characters.**
*Basis:* `A1-C46`, plus `A1-C61`. *Confidence: low — this is where the default-to-neutrality stance applies most sharply.*
The realism finding concerns **children's uptake of social content from stories they are told**, not the developmental value of characters they invent. Children also independently *prefer* animal characters (`A1-C61`). Character Studio should be **neutral** on character species. If the platform ever wants to nudge toward human characters for socio-relational language, that must be run as an experiment and reported as such — the current evidence does not license it.

---

## 2.7 How children develop original characters over time: flat → round, static → dynamic, external → internal

This is Character Studio's central question, and it is the area where the retrieved evidence is **weakest and most indirect**. I found no study of children's *invented characters* tracked for roundness or dynamism. What exists is (a) a large literature on children's *person perception* and *trait understanding*, which is about how children conceive of people generally, and (b) craft literature about flat/round/static/dynamic, which is not developmental research. I report both and mark the gap plainly.

### WHAT RESEARCH SAYS

**`A1-C47`** `[E2]`/`[E4]` `[SNIPPET]` The **flat/round** and **static/dynamic** distinctions are craft categories, not developmental constructs: *flat* = simple, usually one trait; *round* = a fully formed person with goals, motivations, interests, fears, secrets, hopes and personality traits; *static* = does not develop across the story; *dynamic* = changes, usually sparked by responses to conflict. Retrieved only from **craft and teaching sites** (MasterClass, Scribophile, Jenna Moreci, Now Novel, Essentials in Writing, Write-Right, Medium). **`[E4]` at best, and arguably `[E6]` as applied to children.**
**Crucially:** the same sources note that **flat characters remain effective in fables, fairy tales and children's fiction**, and that stories aimed at children "don't need to go into as much depth regarding the psychology of the character." One cited example is a picture book with a **flat but dynamic** protagonist. So even in craft terms, flat ≠ bad.

**`A1-C48`** `[E1]` `[SNIPPET]` Livesley & Bromley (1973), *Person Perception in Childhood and Adolescence* (ERIC ED087571; Nova Southeastern University-hosted PDF). Reported: a **steady increase in the number of "central" descriptors used from ages 7 to 10** (maps **B1 → B2**), with **age having the biggest effect on both the proportion and number of central descriptors**; older participants used more **inference-based central descriptors about personality or psychological traits**; and a **decrease with age in superficial and unrelated descriptors**. Also reported: **girls used more central/psychological statements than boys**; females used more central descriptors but not a higher *proportion*.

**`A1-C49`** `[E1]` `[SNIPPET]` A companion generalization from the same retrieval: **children younger than 7 or 8 typically refer to external features (hair color, possessions) rather than internal, stable traits (friendly, outgoing, smart).** Maps: the external → internal shift in describing people lands at roughly the **B0/B1 boundary**, consolidating through **B2**.
**This is the strongest available anchor for the "external → internal traits" progression.** Note it is about describing *real people*, not about inventing characters. The transfer is an inference, and I mark it as such below.

**`A1-C50`** `[E1]` `[SNIPPET]` Trait understanding develops earlier than the person-perception literature alone suggests, but consolidates late:
- **4- and 5-year-olds** can infer trait labels from behaviors and understand traits as **predictive and stable over time**.
- **From age 5**, children make different emotion predictions about the same situation for actors with different traits — i.e. they appreciate **traits as psychological causes**.
- Trait attribution is **limited in early childhood and develops gradually over the elementary school years**, with **more robust trait attribution emerging around 7–8 years**.
- **By age 7**, children capitalize on trait inferences in partner choice.
- **4-, 5-, and 7-year-olds can predict behaviors from trait labels but not from past behaviors.**
- **3- to 7-year-olds weight prior negative and positive behaviors differently**: they require several negative occasions before labeling someone "mean," but a **single positive event suffices** for "nice."
*Retrieved via:* PubMed 9597366 (*The development of bases for trait attribution: children's understanding of traits as causal mechanisms based on desire*); PubMed 17883447 (*Components of young children's trait understanding: behavior-to-trait inferences and trait-to-behavior predictions*); **Child Development**, *Children's Trait Inference and Partner Choice in a Cooperative Game*, doi 10.1111/cdev.14247; ScienceDirect S0885201421000149 (*Traits or circumstances? Children's explanations of positive and negative behavioral outcomes*); ScienceDirect S0885201420301295 (*Children's and adults' beliefs about the stability of traits from infancy to adulthood*).

**`A1-C51`** `[E5]`/`[E4]` `[SNIPPET]` The NSS **Character Development** category exists as a distinct scored dimension, and the retrieved scoring-guide fragments indicate that **low performance indicators include: characters necessary for advancing the plot are not present; no use of mental state words to develop characters; excessive use of pronouns; and no verbal clarifiers used.** I could **not** retrieve the full proficient/emerging/minimal descriptors distinguishing main from secondary characters — the scoring-guide PDFs were among the blocked fetches.
`[UNVERIFIED]` for the complete rubric text. *Searched for:* "SALT Narrative Scoring Scheme character development proficient emerging minimal scoring criteria main characters secondary."

**`A1-C52`** `[UNVERIFIED]` **I could not find any empirical study tracking the development of *roundness* or *dynamism* in characters that children invent**, at any age. *Searched for:* "children's fiction writing character development flat static dynamic elementary students research"; "children's original fictional stories characterization empirical study writing quality character portrayal grade level"; "narrative development grade 8 9 adolescents fiction writing character motivation complexity teacher expectations research." All three returned craft/teaching content or adjacent narrative-structure studies, not the target. **This is a real hole in the evidence base and should be treated as an open research question (Part 4).**

**`A1-C53`** `[E1]` `[SNIPPET]` The closest empirical proxy for character *elaboration* in children's own stories is Ukrainetz et al., *The Development of Expressive Elaboration in Fictional Narratives* — see `A1-C57`, which found that **orientations (characters' names and contextual information) were markedly richer at ages 10–12 than at 5–6.**

### WHAT CHARACTER STUDIO SHOULD DO

> **This section carries the document's largest inference gap.** Every rule below rests on transferring findings about *how children perceive real people* to *how children invent characters*. That transfer is plausible and is the best available basis, but it is **not established**. Confidence levels are set accordingly, and the default stance — offer, don't require — governs throughout.

**`R2.1g` — Expected character complexity by band (what "good for this age" looks like).**
*Basis:* `A1-C48`, `A1-C49`, `A1-C50`, `A1-C53`, `A1-C21`, `A1-C43`. *Confidence: moderate for B0–B2 (person-perception evidence is reasonably strong and age-graded); low for B3–B4 (extrapolated).*

| Band | Typical, developmentally appropriate character | Emerging edge to *invite*, not require | Do **not** expect |
|---|---|---|---|
| **B0** (5–6, K–1) | Named character defined by **external features and actions** (looks, what they do, what they have); one want; feelings named simply (happy/sad/scared) | One feeling word tied to one event | Traits as causes; change over time; contradiction |
| **B1** (7–8, gr 2–3) | External features **plus 1–2 stable trait labels** ("she's brave," "he's mean"); a want; simple thoughts | Linking a trait to a behavior ("she's brave, so she…") | Traits inferred from *past behavior*; internal contradiction; arcs |
| **B2** (9–10, gr 4–5) | Trait labels used **as psychological causes**; interiority present; knows/doesn't-know distinctions; goal with an obstacle | One thing the character **learns or realizes**; a secret; a reason behind the trait | Sustained multi-episode arcs; unreliable perspective |
| **B3** (11–12, gr 6–7) | Motivation stated or implied; character responds to conflict; interpersonal relations thematized | **Contradiction** ("brave about X, terrified of Y"); change across the story; backstory that explains a want | Fully controlled dramatic irony; deliberate subtext |
| **B4** (13–14, gr 8–9) | Character with a want, a flaw, and a relationship that pressures both; some reflection | A belief the character holds about themselves that the story tests; deliberate change over time; a second character whose view differs | Publishable-level control; consistency across long works |

**`R2.2g` — Introduce advanced character concepts on this schedule, always as optional "craft cards," never as required fields.**
*Basis:* `A1-C49`, `A1-C50`, `A1-C35`, `A1-C21`, `A1-C39`. *Confidence: low-moderate.*

| Concept | Earliest **offer** | Never **require** before | Rationale |
|---|---|---|---|
| Feelings | B0 | — | Emotion words precede cognition words (`A1-C43`) |
| Wants / goals | B0 | — | Goal anchors coherence from earliest band (`A1-C28`) |
| Stable trait labels | B1 | B2 | Robust trait attribution ~7–8 (`A1-C50`) |
| Trait → behavior causation | B1 (late) | B2 | Trait-to-behavior prediction available before behavior-to-trait inference (`A1-C50`) |
| Behavior → trait inference (show don't tell) | B2 | B3 | 4–7-year-olds could *not* predict behavior from past behaviors (`A1-C50`) |
| Internal contradiction | B3 | never require | No evidence base; craft construct only (`A1-C47`, `A1-C52`) |
| Change over time / arc | B3 | never require | No developmental evidence (`A1-C52`); craft construct |
| Belief-about-belief / dramatic irony | B3 | never require | SOFB consolidates 7–9 but written control is later and unmeasured (`A1-C35`) |

**`R2.3g` — "Show, don't tell" must not be taught before B2, and must never be enforced.**
*Basis:* `A1-C50`. *Confidence: moderate — this is one of the more defensible inferences here.*
"Show, don't tell" asks the reader to infer a trait from behavior. But children aged 4–7 **can predict behavior from trait labels and cannot infer traits from past behaviors** (`A1-C50`). Asking a B0–B1 child to replace "she was brave" with a scene demonstrating bravery is asking them to perform an inference direction they have not yet consolidated. **Telling is developmentally correct at B0–B1.** At B2+ it may be offered as an experiment ("Want to try showing us she's brave instead of saying it?"), and even then never as a correction.

**`R2.4g` — Flat and static characters are on the do-not-flag list at every band.**
*Basis:* `A1-C47`, `A1-C52`. *Confidence: high as policy; the underlying claim that flatness is *appropriate* in children's fiction is `[E4]` craft consensus.*
There is **no empirical basis** for treating a flat or static character as a developmental problem at any age in Character Studio's range. Flatness is a legitimate genre convention (fable, fairy tale, adventure) and a legitimate craft choice. The product may **offer** roundness; it may **never** describe flatness as a shortcoming.

**`R2.5g` — Collect the trait-to-cause link, not the trait list.**
*Basis:* `A1-C50` (traits as psychological causes from ~5, robust ~7–8), `A1-C33` (relational quality over counts). *Confidence: moderate.*
A character sheet that harvests eight adjectives produces a flat character with a big word count. One that asks "she's brave — when does that get her into trouble?" produces causality. **Design the character sheet so that every trait field has an adjacent "and so…" field**, unlocked from B1 and optional throughout.

**`R2.6g` — Do not import the "one positive act = nice, many negative acts = mean" asymmetry into feedback about *villains*.**
*Basis:* `A1-C50`. *Confidence: low; flagged because it is a plausible product trap.*
3–7-year-olds apply a positivity bias in trait attribution. A B0–B1 child's "bad guy" who does one nice thing may still read to them as bad. Character Studio should not tell young children their villain is "inconsistent."

---

## 2.8 Narrative cohesion: referential cohesion, pronoun use, character reference

### WHAT RESEARCH SAYS

**`A1-C54`** `[E1]` `[SNIPPET]` Children develop the ability to attach clauses cohesively **beginning at age 5 and continuing through age 10**, with **stabilization between ages 8 and 12** (maps **B0 → B2**, stabilizing **B1–B3**).

**`A1-C55`** `[E1]` `[SNIPPET]` Referential functions differ sharply in difficulty: **maintenance is easiest; reintroduction is harder than introduction.** Children show a **priority in acquiring forms for character maintenance over character introduction**, and are **sensitive to referential forms by age 4**, using definite nominals for reintroduction and pronouns for maintenance. Monolingual Swedish-speaking children aged **4–7** are sensitive to the same discourse factors as adults when choosing referring expressions for reintroduction and maintenance in oral narratives.
*Retrieved via:* ScienceDirect S0378216616301497 (*Referential cohesion in Swedish preschool children's narratives*); ERIC EJ1078697 (*Keeping Track of Characters: Factors Affecting Referential Adequacy in Children's Narratives*, **First Language**, 2014); an Academia.edu record of *Character reference in young children's narratives: A crosslinguistic comparison of English, Greek, and Turkish*; a University of Alberta thesis, *Exploring Ambiguity Within Children's Narratives* (King).

**`A1-C56`** `[E1]` `[SNIPPET]` **Children overuse pronouns, including pronouns that are unrecoverable by a naïve listener.** This is described as a general developmental characteristic, not a disorder marker. Related: **excessive use of pronouns** is listed among low-performance indicators for NSS Character Development (`A1-C51`), and children with ADHD produce narratives with **more ambiguous references** (`A1-C112`), and older autistic children show differences in **referential establishment but not cohesion** (retrieved title: *Analysis of Noun Phrase Ambiguity in Narratives Reveals Differences in Referential Establishment But Not Cohesion for Older Autistic Children*, **JSLHR**, doi 10.1044/2023_JSLHR-22-00630).

### WHAT CHARACTER STUDIO SHOULD DO

**`R2.1h` — Ambiguous pronouns are the *one* mechanical issue worth surfacing, and only as a reader-experience question.**
*Basis:* `A1-C55`, `A1-C56`. *Confidence: moderate.*
Unrecoverable pronouns genuinely impair a reader, which is a communicative fact a child can act on — unlike, say, sentence length. But because pronoun overuse is **developmentally normal** (`A1-C56`), it must be raised as a reader question, never as an error:
> "I lost track of who 'she' is here — is that Mira or her sister?"

```
IF pronoun has >= 2 candidate antecedents within the preceding 3 sentences
AND ambiguityCount in this draft >= 3          // DESIGN DECISION
AND band >= B1
THEN raise ONE instance, as a reader question, at the point of confusion.
     Do not raise a second instance in the same draft.
NEVER auto-replace a pronoun with a name.
```
The threshold of 3 and the window of 3 sentences are **DESIGN DECISIONS**.

**`R2.2h` — Support character *reintroduction* specifically; it is the hardest referential move.**
*Basis:* `A1-C55`. *Confidence: moderate-high — the maintenance-easier-than-reintroduction ordering was consistent across retrieved sources.*
Product feature: a persistent, always-visible **cast list** in the Episode Page Portal showing each character's name and a one-line tag. This offloads the reintroduction problem structurally instead of correcting it after the fact. This is the single highest-value accessibility feature in this document (see §4.3).

**`R2.3h` — Do not flag pronoun ambiguity below B1, and reduce the threshold's sensitivity for multilingual and neurodivergent writers.**
*Basis:* `A1-C54`, `A1-C56`, `A1-C112`, plus §4.3. *Confidence: moderate.*
Cohesive clause attachment is still developing to age 10 and stabilizes as late as 12. Ambiguous reference is also a known correlate of ADHD and of autistic referential establishment — flagging it aggressively would systematically over-target those children.

---

## 2.9 Dialogue

### WHAT RESEARCH SAYS

**`A1-C57`** `[E1]` `[SNIPPET]` **Character dialogue is one of the five evaluative devices that increase with age beyond what story length predicts**, in Bamberg & Damrad-Frye's comparison of 5-year-olds, 9-year-olds and adults (`A1-C07`). Maps: dialogue as an *evaluative* device grows across **B0 → B2**.

**`A1-C58`** `[E1]` `[SNIPPET]` **Older children (within a 3–7 range) included more internal state references *and dialogue* in their retells than younger children** (`A1-C46`).

**`A1-C59`** `[E3]` `[SNIPPET]` **Dialogue is an explicit curriculum expectation from grade 3.** Common Core W.3 progression as retrieved:
- **Grade 3** — write narratives about real or imagined experiences or events; **introduce a narrator and/or characters**; include **dialogue and details about actions, thoughts, and feelings**; use temporal transition words; provide closure.
- **Grade 4** — events unfold naturally; **sensory details**; a variety of temporal transitional words and phrases; conclusion that follows from the events.
- **Grade 5** — use narrative techniques such as **dialogue, description, and pacing** to develop experiences and events **or show the responses of characters to situations**.
- **Grade 7** — narrative techniques such as **dialogue, pacing, and description** to develop experiences, events, **and/or characters**.
- **Grade 8** — adds **reflection**.
- **Grades 9–10 and 11–12** — add **multiple plot lines**.
*Retrieved via:* thecorestandards.org grade 5 and grade 11–12 pages; a Smithsonian Learning Lab standards page for CCSS.ELA-Literacy.W.8.3b.
`[UNVERIFIED]` for **grade 2** and **grade 6** exact wording — the corestandards fetch was blocked and neither grade appeared verbatim in returned results. *Searched for:* "Common Core State Standards writing narrative W.3 grade 2 3 4 5 6 7 8 narrative techniques dialogue description pacing."

**`A1-C60`** `[E4]`/`[E6]` `[SNIPPET]` Retrieved claims about dialogue in children's writing: **stories written for children contain far more direct speech quotations than indirect speech reports**; and **adults use more varied speech-act verbs in writing, while children exhibit greater challenges framing quotes.** Sources were teaching-resource sites (Twinkl, Open University OpenLearn, sofatutor) plus an Academia.edu record of *Speech about speech. A developmental study on form and function of direct and indirect speech*. **`[E4]` at best.** I could **not** find frequency-by-grade data for dialogue in children's own writing. `[UNVERIFIED]` for grade-level frequency norms. *Searched for:* "dialogue direct speech in children's written narratives development frequency grade quoted speech."

### WHAT CHARACTER STUDIO SHOULD DO

**`R2.1i` — Dialogue is a *character-revelation tool*, and should be introduced that way from B1, ahead of the punctuation.**
*Basis:* `A1-C57`, `A1-C58`, `A1-C59`. *Confidence: moderate-high.*
Dialogue is an evaluative/expressive device (`A1-C57`) before it is a mechanical skill. Prompt: *"What's one thing only your character would say?"* — available from **B1** (grade 2–3), matching the grade-3 curriculum onset (`A1-C59`) without waiting for it.

**`R2.2i` — Never correct dialogue punctuation inside the creation flow.**
*Basis:* default stance; `A1-C60` (`[E4]` only); §2.12 on transcription load. *Confidence: high as policy.*
Quotation marks, comma placement and paragraphing on speaker change are **transcription-layer** concerns. Correcting them mid-composition spends the child's limited processing capacity on surface form (see `A1-C71`, `A1-C73`). If the platform must support mechanics, put them in a separate, opt-in "polish" pass after the character/story is complete.

**`R2.3i` — Accept unmarked and loosely marked dialogue as dialogue.**
*Basis:* `A1-C60`. *Confidence: moderate.*
The parser must recognise `She said stop it` and `"stop it!" she yelled` and `Mira - stop it!` as dialogue for internal signal purposes. A child who cannot punctuate speech is still writing speech.

**`R2.4i` — Align the *offer* schedule to the standards, but never gate on them.**
*Basis:* `A1-C59` `[E3]`. *Confidence: high for the standards themselves; the alignment is a product choice.*

| Band | Grade | Standards-aligned narrative technique to make prominent |
|---|---|---|
| B1 | 2–3 | narrator and/or characters; dialogue; actions, thoughts, feelings; temporal words; closure |
| B2 | 4–5 | events unfolding naturally; sensory detail; varied transitions; **pacing**; character responses to situations |
| B3 | 6–7 | dialogue + pacing + description to develop **characters** |
| B4 | 8–9 | + **reflection**; (grade 9) + **multiple plot lines** |

---

## 2.10 Descriptive elaboration / expressive elaboration

### WHAT RESEARCH SAYS

**`A1-C61`** `[E1]` `[SNIPPET]` Ukrainetz et al., *The Development of Expressive Elaboration in Fictional Narratives*. Narratives were elicited with a **short picture sequence of a likely life event** from **293 children aged 5 to 12** (maps **B0 → B3**). Expressive elaboration ("artfulness") was coded in **three categories comprising 13 types**:
- **Appendages** — signal the beginning, middle and end of the story;
- **Orientations** — provide **setting and character information**;
- **Evaluations** — impart emphasis or meaning to part of the story.

Reported results, by three age clusters (**5–6, 7–9, 10–12** — mapping cleanly to **B0, B1, B2–B3**): the 13 types showed **diverse patterns of acquisition in presence, frequency and developmental change**; narratives were **richer in orientations (characters' names and contextual information) at 10–12 than at 5–6**; **evaluations were present in almost all stories told by 10–12-year-olds**; and there was a **significant age effect for expressive elaboration with narrative length controlled** — i.e. older children were not simply writing more.
*Retrieved via:* ResearchGate record 7299403; Academia.edu record 18013545; a Montclair State University research-portal fingerprint page. A companion study exists for children with SLI: *The Expressive Elaboration of Imaginative Narratives by Children With Specific Language Impairment*, **JSLHR**, doi 10.1044/1092-4388(2009/07-0133).
**This is the single best-fitting study in the retrieved set for Character Studio's "descriptive elaboration" question**, because its **Orientations** category is literally *character and setting information*, tracked across exactly the product's age range.

**`A1-C62`** `[E1]` `[SNIPPET]` Elementary students' own stated criteria for a good story centre on **characters and plot**: **characters that were animals, good-hearted, and/or funny**, plus **action and adventure**, made storybooks their favourites; **no action, boring, unsolved problems, being short, or unknown words and expressions** made them least favourite. Retrieved via ERIC EJ1308657 (*Value of Children's Literature and Students' Opinions…*). `[E1]` but a small opinion study; **low confidence.**

### WHAT CHARACTER STUDIO SHOULD DO

**`R2.1j` — Instrument elaboration using the Appendages / Orientations / Evaluations triad, and treat *Orientations* as the character-studio-native metric.**
*Basis:* `A1-C61`. *Confidence: moderate-high — this is the best-matched study retrieved.*
```
elaborationSignals = {
  appendages:   story-boundary markers ("Once...", "The end", "and that's how..."),
  orientations: character names, appearance, relationships, place, time,   // PRIMARY
  evaluations:  emphasis, intensifiers, exclamations, asides to reader
}
```
Character Studio's "how developed is this character" signal should be **orientations density plus the trait→cause links from `R2.5g`**, not word count.

**`R2.2j` — Control for length when judging elaboration.**
*Basis:* `A1-C61` (age effect held with length controlled). *Confidence: high.*
Never treat a longer story as a more elaborated one. All elaboration signals must be **rate-based** (per 100 words), never raw counts. This single rule prevents the most likely failure mode of an AI writing tool: rewarding volume.

**`R2.3j` — Expect and celebrate character *naming and contextual detail* as the B2–B3 growth edge.**
*Basis:* `A1-C61`. *Confidence: moderate.*
Orientation richness is what most distinguishes 10–12-year-olds from 5–6-year-olds. Prompts at **B2–B3**: *"Where does she live, and what does that tell us about her?"* *"Who else is in her life?"*

**`R2.4j` — Do not require evaluations below B2; expect them near-universally at B2–B3.**
*Basis:* `A1-C61` (evaluations in almost all 10–12 stories), `A1-C07`. *Confidence: moderate.*
```
IF band <= B1 AND evaluations == 0: stay silent. Normal.
IF band >= B2 AND evaluations == 0 over 2+ completed pieces:
   offer ONE expressiveness invitation, e.g.
   "Want to tell us how you feel about what she just did?"
```

**`R2.5j` — Respect children's own story values: action, humour, and characters they like.**
*Basis:* `A1-C62`. *Confidence: low (small opinion study), but the direction is unsurprising and low-risk.*
Prompt libraries should include humour and action prompts of equal prominence to interiority prompts. A tool that only ever asks "how does she feel?" is optimising for one research tradition against children's stated preferences.

---

## 2.11 Narrative length and complexity (microstructure)

### WHAT RESEARCH SAYS

**`A1-C63`** `[E1]`/`[E5]` `[SNIPPET]` Justice, Bowles et al. (2006), *The Index of Narrative Microstructure: A Clinical Tool for Analyzing School-Age Children's Narrative Performances*, **American Journal of Speech-Language Pathology**, doi 10.1044/1058-0360(2006/017). Narrative samples from **250 children aged 5–12** (maps **B0 → B3**) using a **single-picture elicitation context**, transcribed and segmented into **T-units**. Measures scored: **total number of words (TNW), number of different words (NDW), number of T-units, mean length of T-unit in words, number of complex T-units, number of coordinating conjunctions (COORD), number of subordinating conjunctions (SUBORD), proportion of complex T-units.** These reduce to two factors — **productivity** (word output, lexical diversity, T-unit output) and **complexity** (syntactic organization) — with **age- and grade-based reference values** provided. A follow-up exists: *The utility of school-age narrative microstructure indices: INMIS and the proportion of restricted utterances* (PubMed 19498016).
**The actual normative values by grade were not retrievable** — the ASHA fetch was blocked and the numbers did not appear in search results. `[UNVERIFIED]` for the norms table. *Searched for:* "Justice 2006 Index of Narrative Microstructure INMIS values by grade total number of words different words coordinating subordinating conjunctions."

**`A1-C64`** `[E1]` `[SNIPPET]` A study of written narrative samples across **grades 1 through 8** (maps **B1 → B4**) found **an upward trend in lexical measures across grades and a decrease in the proportion of errors**; written language sample measures correlated significantly with standardized language and literacy assessments; and **the proportion of errors explained more unique variance than lexical measures**. Retrieved as *Grade Level Expectations in Lexical Measures and Accuracy of Written Narrative Samples* (PMC6818509). **Specific grade-level values were not retrievable** — `[UNVERIFIED]` for the actual expectation tables.

**`A1-C65`** `[E1]` `[SNIPPET]` Genre affects syntactic complexity more than age does in some comparisons: **mean length of T-unit and use of all types of subordinate clauses were substantially greater in the expository genre than in the conversational genre for all three groups**, in Nippold, Mansfield, Billow & Tomblin (2008), *Expository Discourse in Adolescents With Language Impairments: Examining Syntactic Development*, **AJSLP**, doi 10.1044/1058-0360(2008/07-0049). Also reported: **subordinate clause production is age-dependent for adolescent writers, but this relationship is also related to genre**; and **compound and complex sentence use continues developing through adolescence into adulthood**.
**Product reading:** never benchmark a child's sentence complexity in *narrative* against numbers derived from *expository* writing, and never treat lower complexity in a story as lower ability.

**`A1-C66`** `[E1]` `[SNIPPET]` **Greater productivity and complexity were found among older children than younger children**, particularly for fictional and informational discourse; and **children produced longer discourse and used a greater diversity of words for their fictional stories** than for informational or procedural discourse. Retrieved via *Sharing Stories Versus Explaining Facts: Comparing African American Children's Microstructure Performance Across Fictional Narrative, Informational, and Procedural Discourse*, **JSLHR**, doi 10.1044/2024_JSLHR-23-00579.
**Product reading:** fiction elicits children's *longest and most lexically diverse* language. This is a strong argument for a fiction-first product.

**`A1-C67`** `[E1]` `[SNIPPET]` Reported sample-length observations: children produced **between 12 and 77 utterances** in one school-age study; another corpus averaged **about 35 utterances per child**. These are elicitation-specific and are **not norms.**

**`A1-C68`** `[UNVERIFIED]` **I could not obtain mean-length-of-T-unit or words-per-narrative norms by grade.** *Searched for:* "narrative length norms total number of words T-units by grade oral narrative typically developing children benchmarks" and "mean length of T-unit by age children adolescents norms words per T-unit written narrative grade 4 8 12." Returned results consistently pointed to SALT reference databases, Leadholm & Miller MLU norms, and the INMIS tables — none of which were retrievable. **Do not let anyone put a words-per-story target into Character Studio citing this document.**

### WHAT CHARACTER STUDIO SHOULD DO

**`R2.1k` — Character Studio must not display, imply, or reward a length target.**
*Basis:* `A1-C61` (age effect held with length controlled), `A1-C64`, `A1-C68`. *Confidence: high.*
No word-count goals, no progress bars keyed to length, no "you're almost at 100 words!" No length-based praise. There are no defensible norms in the retrieved evidence, and the one study that controlled for length found the developmental signal was **not** length.

**`R2.2k` — Use rate-based microstructure signals internally only, and only for scaffold routing.**
*Basis:* `A1-C63`, `A1-C66`. *Confidence: moderate.*
```
// internal only — never surfaced to child or teacher as a score
micro = {
  lexicalDiversity: NDW / TNW,
  subordinationRate: SUBORD / T-units,
  coordinationRate:  COORD / T-units
}
// used ONLY to pick prompt register (simpler vs. richer phrasing),
// NEVER to trigger a correction or a quality judgement.
```

**`R2.3k` — Never compare a story's syntax to expository benchmarks.**
*Basis:* `A1-C65`. *Confidence: high.*
If the Grapevine platform reports writing metrics across activity types, narrative and expository metrics must be reported in separate lanes with separate baselines.

**`R2.4k` — Expect fiction to produce a child's *best* language, and set the product's expectations accordingly.**
*Basis:* `A1-C66`, `A1-C45`. *Confidence: moderate-high.*
If a child's Character Studio output looks weaker than their classroom writing, the first hypothesis should be a **tool problem** (interface friction, prompt mismatch, transcription load) — not a child problem.

---

## 2.12 Oral vs. written narrative, and transcription load

### WHAT RESEARCH SAYS

**`A1-C69`** `[E1]` `[SNIPPET]` Torkildsen et al. (2015), *The dynamics of narrative writing in primary grade children: writing process factors predict story quality*, **Reading and Writing**, doi 10.1007/s11145-015-9618-4 (PMC4761367). **Third-grade** children (maps **B1**) wrote narratives with **keystroke logging**. Reported: **most children spontaneously made local online revisions while writing, but few revised previously written text**; children with good reading and spelling made more online revisions; **two process factors — transcription fluency and online revision activity — explained variance in narrative macrostructural quality and story length**; and **spelling was the only factor making a unique contribution to explaining variance in the writing process factors.**

**`A1-C70`** `[E1]` `[SNIPPET]` Skar, Graham, Lei, Aasen, Byberg Johansen & Kvistad, *Handwriting fluency and the quality of primary grade students' writing*, **Reading and Writing**, doi 10.1007/s11145-021-10185-y. Sample reported as **2,596 girls and 2,354 boys**. **Handwriting fluency accounted for a statistically significant 7.4% of the variance in the writing quality of primary grade students.** Related retrieved claims: transcription in young writers is **so demanding that it constrains higher-level processes such as planning and revision**; handwriting speed correlates highly with text length and composition quality in time-limited tasks; and when transcription is accurate, rapid and effortless, **attention and working memory can be reallocated to meaning-related processes**.

**`A1-C71`** `[E1]` `[SNIPPET]` Modality changes what you see: **less group difference was found in the written modality relative to the oral modality** in one comparison of children with and without DLD; and **transcription skills and executive functions were key predictors of productivity, while both transcription and oral narrative competence contributed to writing quality**, with **syntactic complexity primarily influenced by oral narrative competence and executive functions.** Retrieved via a SAGE study of Mandarin-speaking school-age children (doi 10.1177/02656590241250257), a Taylor & Francis study comparing young children's oral and written story retelling (doi 10.1080/2050571X.2024.2357450), and a PMC longitudinal study of pathways to text generation.

**`A1-C72`** `[E1]` `[SNIPPET]` **Word processing has a small but significant benefit.** Bangert-Drowns (1993), *The Word Processor as an Instructional Tool: A Meta-Analysis of Word Processing in Writing Instruction*, **Review of Educational Research** (SAGE, doi 10.3102/00346543063001069): **ES = 0.27 for quality, ES = 0.52 for quantity**, across elementary, high-school and college students, with **weaker writers improving most**.
*Confidence note:* the effect sizes came from the search synthesis quoting a later paper's description of Bangert-Drowns. `[SNIPPET]`; treat as approximately right.

**`A1-C73`** `[E1]` `[SNIPPET]` **Digital storytelling** interventions have been reported to improve **ideas, organization, word choice, sentence fluency and conventions**, and to improve **story elements and word counts**; and a first-grade comparison of handwriting on paper versus typing on a digital tablet with **text-to-speech read-back** reported improvement in **text length, syntactic accuracy and complexity, and narrative sophistication**. Retrieved via IEJEE (*The effect of digital storytelling in improving the third graders' writing skills*), ScienceDirect S0360131523000325 (*Writing by hand or digitally in first grade*), and ScienceDirect S0360131515300889.
*Confidence: low-moderate.* Digital-storytelling studies are small and heterogeneous; the direction is favourable but the magnitude is not established here.

### WHAT CHARACTER STUDIO SHOULD DO

**`R2.1l` — Treat transcription as the primary suspect whenever output is thin.**
*Basis:* `A1-C69`, `A1-C70`, `A1-C71`. *Confidence: high — this is among the best-supported claims in the document.*
Handwriting fluency alone accounted for ~7.4% of writing quality variance (`A1-C70`), and transcription constrains planning and revision (`A1-C70`, `A1-C71`).
```
IF output is short OR structurally thin
THEN before offering any narrative-structure scaffold,
     offer a transcription-load reduction:
       - voice/dictation capture
       - sentence starters
       - "tell me and I'll write it down" mode
       - accept fragments and fix nothing
IF output improves under reduced transcription load
THEN the constraint was transcription, NOT narrative ability.
     Do NOT lower the narrative scaffold level.  // critical
```

**`R2.2l` — Separate composing from correcting, structurally, in the UI.**
*Basis:* `A1-C69`, `A1-C70`. *Confidence: high.*
No spelling, grammar, or punctuation intervention during composition at any band. Mechanics live in an explicitly separate, optional, post-composition pass. Note that spelling was the single factor uniquely predicting writing-process quality (`A1-C69`) — which is an argument for *teaching* spelling elsewhere, not for interrupting composition with it.

**`R2.3l` — Support online (in-the-moment) revision; do not push whole-text revision at B1.**
*Basis:* `A1-C69`. *Confidence: moderate-high.*
Third graders revise locally as they write but rarely revisit earlier text. Character Studio should make local editing frictionless (easy backspace, easy word swap, no modal interruptions) and should **not** introduce "now go back and revise your whole story" workflows before **B2**. See §2.13.

**`R2.4l` — Offer read-back (text-to-speech) as a first-class feature.**
*Basis:* `A1-C73`. *Confidence: low-moderate.*
Framed as optional and useful, not remedial. Flagged as low confidence: the supporting studies are small.

**`R2.5l` — Keep oral and written character work interchangeable.**
*Basis:* `A1-C71`, `A1-C38`. *Confidence: moderate.*
Oral narrative competence contributes to written quality and syntactic complexity. A child who describes their character aloud has done real character work; the tool should capture it as such, not treat it as a warm-up.

---

## 2.13 Planning and revision

### WHAT RESEARCH SAYS

**`A1-C74`** `[E2]` `[SNIPPET]` Scardamalia & Bereiter (1987), *Knowledge Telling and Knowledge Transforming in Written Composition*, in S. Rosenberg (Ed.), *Advances in Applied Psycholinguistics, Vol. 2* (Cambridge University Press, pp. 142–175). **Knowledge telling**: a linear retrieval-and-transcribe process cued by genre and topic. **Knowledge transforming**: a dialectic between a **content problem space** and a **rhetorical problem space**. **Novice writers, lacking the metacognitive skills to traverse the knowledge-transforming model, default to knowledge-telling.**

**`A1-C75`** `[E1]` `[SNIPPET]` *Kinds of knowledge-telling: Modeling early writing development*, **Journal of Writing Research** (jowr.org/jowr/article/view/723): young writers composing expository themes from their own knowledge use one of **three strategies — flexible-focus, fixed-topic, or topic-elaboration** — all of which are **kinds of knowledge-telling**, and these **three strategies have distinct developmental trajectories from grades one through nine** (maps **B0 → B4**).
**Product reading:** knowledge-telling is not one undifferentiated novice state; it has internal structure and a long trajectory across the whole of Character Studio's range. Expecting knowledge-transforming from a grade-6 writer is not supported.

**`A1-C76`** `[E1]` `[SNIPPET]` Revision development, from *How to make it easier for children to revise their writing: A study of text revision from 3rd to 5th grades* (Academia.edu 53935031) plus related retrievals:
- **Surface-level revisions predominate** among elementary children; reported as **10.72% focused on spelling and punctuation vs. 7.10% on deeper meaning alterations.**
- **Third graders tend to focus on formal revisions like spelling; fourth and fifth graders engage more in meaning revisions.**
- With development, **surface revisions decrease while meaning revisions grow.**
- **Delaying revision increased total revisions by 28%**, allowing deeper rather than superficial corrections; **explicit revision instruction plus delay** enhanced revision effectiveness.
- **Merely requiring students to revise, or to spend more time revising, does not necessarily improve writing; direct teacher intervention does.**
*Confidence caveat:* the percentages (10.72 / 7.10 / 28) came from the search synthesis over a paper I could not read. `[SNIPPET]`, **low confidence on the numbers, moderate on the direction** (surface→meaning shift across grades 3–5, i.e. **B1 → B2**).

**`A1-C77`** `[E1]` `[SNIPPET]` **Planning support helps.** Retrieved: an intervention combining a **graphic organizer with storytelling** produced a positive effect on **story writing quality and attitude toward writing** among **third graders with German as a second language** (**European Journal of Psychology of Education**, doi 10.1007/s10212-024-00908-4). Broader retrieved statements (from teaching-practice sources, `[E4]`): using a graphic organizer as a prewriting activity helps students produce a **more coherent and focused text**; young students who can think of stories often **struggle to independently plan and organize** them.
*Note:* the graphic-organizer-improves-writing claim is well attested as `[E4]` practice; the one `[E1]` study I retrieved is specific to L2 third-graders.

**`A1-C78`** `[E1]` `[SNIPPET]` **SRSD (Self-Regulated Strategy Development)** — explicit strategy instruction incorporating planning and self-regulation — carries the largest effect sizes in the retrieved writing-instruction literature:
- **ES = 1.17** for SRSD as the most effective approach in a meta-analysis of writing instruction in the elementary grades;
- **ES = 0.68** for elementary writing in another meta-analysis reviewing **115 experiments**;
- component effects reported for story writing: **quality ES 1.47, elements ES 1.87, story grammar ES 3.52**, with a **statistically smaller effect on writing length than on quality and elements**;
- effect sizes in SRSD research reported as commonly exceeding **0.85**, and ranging **1.0–2.55** across writing and affective outcomes;
- effective across research teams, methodologies, genres (narrative and persuasive), and students with learning disabilities and emotional/behavioral disorders.
*Retrieved via:* an Academia.edu copy of *A meta-analysis of writing instruction for students in the elementary grades* (Graham et al.); srsdonline.org research page; IES blog on SRSD; **Reading and Writing** papers on SRSD long-term effects (doi 10.1007/s11145-025-10721-0) and on SRSD for English writing (doi 10.1007/s11145-022-10297-z).
*Confidence caveat:* these figures come from several sources at once and **could not be individually attributed**. `[SNIPPET]`. The pattern — **SRSD is large, and larger for structure than for length** — is the reliable takeaway. The ES 3.52 figure in particular should not be quoted externally without verification.

### WHAT CHARACTER STUDIO SHOULD DO

**`R2.1m` — Character Studio *is* a planning scaffold. Position it that way.**
*Basis:* `A1-C74`, `A1-C75`, `A1-C77`, `A1-C78`. *Confidence: high.*
Character creation before drafting is prewriting. This is the strongest evidence-backed role available to the product: planning support and explicit strategy instruction produce the largest writing effects in the retrieved literature (`A1-C78`), and children struggle to plan independently (`A1-C77`).

**`R2.2m` — Expect knowledge-telling across the whole K–9 range and design for it.**
*Basis:* `A1-C74`, `A1-C75`. *Confidence: moderate-high.*
Do not build features that assume a child is weighing rhetorical goals against content ("who is your audience and how will that change your character?") before **B4**, and even then as an option. At B0–B3, "tell me more about her" is the developmentally matched move.

**`R2.3m` — Revision, by band.**
*Basis:* `A1-C76`, `A1-C69`. *Confidence: moderate.*

| Band | Revision behavior to support | Do **not** |
|---|---|---|
| B0 (5–6) | Adding on ("what else?") | Ask them to change what exists |
| B1 (7–8) | Local online edits; adding a detail | Ask for whole-text meaning revision; surface-correct |
| B2 (9–10) | First meaning revisions: add / delete / move | Require surface accuracy as the price of revising |
| B3 (11–12) | Targeted revision of one element by choice | Open-ended "make it better" |
| B4 (13–14) | Goal-directed revision against a self-set intention | Automated rewriting |

**`R2.4m` — Insert a deliberate delay before inviting revision.**
*Basis:* `A1-C76` (delay increased total revisions and deepened them). *Confidence: low-moderate — the 28% figure is `[SNIPPET]`; the direction is plausible and low-risk.*
```
IF child completes a character or a draft
THEN do NOT offer revision in the same session.
     Offer revision at the START of the next session,
     with a specific focus, not "make it better".
```
"Next session" is a **DESIGN DECISION** operationalisation of "delay."

**`R2.5m` — Never auto-revise, and never offer whole-text rewriting.**
*Basis:* `A1-C76` (direct instruction helps; merely requiring revision does not), `A1-C78` (SRSD works by teaching a strategy the child executes). *Confidence: high.*
The evidence supports **teaching a revision move**, not performing it. An AI that rewrites the child's text removes the exact activity the evidence says produces gains.

---

## 2.14 Cultural variation in narrative — and what it means for a "correct" story shape

This section carries the document's most serious warning about the rest of the document.

### WHAT RESEARCH SAYS

**`A1-C79`** `[E1]` `[SNIPPET]` Michaels, *"Sharing time": Children's narrative styles and differential access to literacy*, **Language in Society** (Cambridge Core). In classroom sharing time, African American first-graders tended to produce narratives that cohered **not around a single topic but around a series of loosely and often unclearly related episodes**, which Michaels termed **topic-associating**, in contrast to the **topic-centered** narratives of the Anglo children. **Topic-centered** narratives are tightly organized around a single event or object; **topic-associating** narratives are organized around multiple anecdotes, linked by **subtle changes in tempo or intonation**.
**Reported consequence:** as early as **Grade 1, teachers preferred listening to White children producing topic-centered narratives over Black students producing topic-associating narratives**, and sociocultural mismatch between a teacher's expected discourse practices and a student's can produce feedback that **inhibits the child's discourse and limits learning opportunities.**

**`A1-C80`** `[E6]` `[SNIPPET]` **Michaels' finding has not been universally replicated.** A retrieved statement holds that other research found **more African-American students employing topic-centered than topic-associating stories.** Also retrieved: Hyon & Sulzby, *African American Kindergartners' Spoken Narratives: Topic Associating and Topic Centered Styles*, **Linguistics and Education**, 1994 (ERIC EJ497723; U. Michigan Deep Blue).
**This matters:** the topic-associating/topic-centered contrast should be held as **a real and important possibility, not as a property of a group.** Treating it as a group property is itself a stereotype.

**`A1-C81`** `[E1]`/`[E2]` `[SNIPPET]` Champion (2003), *Understanding storytelling among African American children: A journey from Africa to America*, describes African American children's use of a **topic-associating approach** (noted as similar to patterns described for Native American children), **call–response** interaction in which the narrator produces a story with interspersed "calls" from the listener, and **a wide range of paralinguistic devices to engage the audience.** Also retrieved: Nichols (1989) documented, in upper-elementary African American children's **fictional** narratives, **characters' quotations and a strong interactional component between audience and narrator**, consistent with a **narrative-as-performance** style. `[SECONDARY-SOURCED]` — I read descriptions of Champion and Nichols, not the originals.

**`A1-C82`** `[E1]` `[SNIPPET]` Minami & McCabe, *Haiku as a discourse regulation device: A stanza analysis of Japanese children's personal narratives*, **Language in Society**. Conversational narratives from **17 Japanese children aged 5–9** (maps **B0–B2**) analysed by stanza. Three features: narratives are **exceptionally succinct**; they are usually **free-standing collections of three experiences**; and **stanzas almost always consist of three lines**. **59% of Japanese children's narratives consisted of succinct three-verse stanzas**, versus American narratives described as **lengthy monologues**. Children and adults both averaged three verses per stanza and told about multiple experiences; children told sequentially while adults emphasized non-sequential information.
**Product reading:** a Japanese-heritage child's succinct, multi-experience narrative would be scored as *short, unfocused and incomplete* by a story-grammar rubric. It is neither.

**`A1-C83`** `[E1]`/`[E2]` `[SNIPPET]` Heath (1983), *Ways with Words: Language, Life and Work in Communities and Classrooms* (Cambridge University Press). Two working-class communities a few miles apart:
- **Roadville** (white, textile-mill): storytelling emphasizes **correctness, detail and chronology**, reinforced by church-related practice; the community's expectation of **true accounts** conflicts with the **fairytales and imaginative stories** of preschools.
- **Trackton** (African American): **fictionalization is allowed and encouraged** ("talking junk"); good storytellers are valued; children are **talked to rather than read to** and are taught to be **creative storytellers who tie what they say to the ongoing conversation**.
- Both differ from the "townspeople" mainstream pattern that **holds power in schools and workplaces**.
**Product reading — direct and uncomfortable:** a Roadville-style child may resist invented characters as untrue. A Trackton-style child may produce a brilliant, audience-responsive, conversationally-embedded story that a solo-composition tool cannot see at all.

**`A1-C84`** `[E1]`/`[E2]` `[SNIPPET]` McCabe's work on Spanish-language narration (*Spanish-Language Narration and Literacy: Culture, Cognition and Emotion*, Cambridge University Press, ISBN 9780521710046) covers speakers of Costa Rican, Dominican, Ecuadorian, Mexican, Peruvian, Puerto Rican, Venezuelan and Spanish-English bilingual backgrounds, with chapters on **evaluation and temporality "beyond chronicity"** and on **internal-state references in Spanish-speaking mother-child narratives**. Reported: **"Spanish-speaking children are sometimes misinterpreted when they are actually producing narratives that are typical and appropriate in Peru or Guatemala or the Dominican Republic."** A related retrieved claim describes a Mexican-heritage American developmental sequence progressing to **predominantly classic narrative structure by age 6**. Silva & McCabe (1996) is cited as *Vignettes of the continuous and family ties: Some Latino American traditions*, in McCabe's *Chameleon Readers*. `[SECONDARY-SOURCED]`.

**`A1-C85`** `[E1]` `[SNIPPET]` Cross-national baseline: Westerveld et al., *Global TALES feasibility study: Personal narratives in 10-year-old children around the world*, **PLOS ONE** (doi 10.1371/journal.pone.0273114; PMID 35969581; a correction exists). **249 ten-year-old children from 10 countries speaking 8 languages** (maps **B2**), six scripted prompts (**excited, worried, annoyed, proud, problem situation, something important**). Reported: the protocol elicited discourse from **all** children, with **evident individual variability**; **children around the world share many commonalities in topics of conversation**; researcher feedback was generally positive though **several translation issues were noted.**

**`A1-C86`** `[E1]` `[SNIPPET]` Within-group grade effects can be absent where you would expect them. *Structural and dialectal characteristics of the fictional and personal narratives of school-age African American children* (PMC3988833; PubMed 23633645): **43 children in Grades 2–5** (maps **B1–B2**) produced a fictional narrative (wordless-book elicitation) and a personal narrative (story prompt). Reported: **no grade-related differences in macrostructure, microstructure, or dialect density**; **statistically significant differences between the two narrative types for both macrostructure and microstructure but not for dialect density**; and the authors note that **culture-fair methods are scarce** for this population.
**Product reading:** a grade-indexed expectation curve failed to appear in this sample. That is direct evidence against grade-gated scaffolding.

**`A1-C87`** `[E6]` `[SNIPPET]` Retrieved argumentative positions: traditional narratological approaches carry **inherent Eurocentric biases**, with calls for a more inclusive global perspective; **hierarchical Scene-Beat narrative models introduce Western biases**, and some computational systems deliberately **avoid enforcing specific story grammars** in favour of character arcs, suspense and audience expectation; and integrating Indigenous methodologies with Aboriginal storytelling/yarning enables more culturally responsive co-construction (**The Australian Journal of Indigenous Education**). See also `A1-C12`. **`[E6]`, low-to-moderate confidence** — these are position papers seen only in synthesis, but they converge with the stronger empirical work above.

### WHAT CHARACTER STUDIO SHOULD DO

**`R2.1n` — Character Studio must never tell a child their story is unfocused, off-topic, wandering, or missing a point.**
*Basis:* `A1-C79`, `A1-C80`, `A1-C81`, `A1-C82`, `A1-C83`. *Confidence: high.*
Every one of those judgments is exactly what the mismatch literature documents as culturally biased teacher feedback with measurable consequences (`A1-C79`). This is an **absolute prohibition**, not a threshold. Add these to the hard-blocked feedback vocabulary:
```
BLOCKED_FEEDBACK_CONCEPTS = [
  "off topic", "unfocused", "wandering", "rambling", "stick to one idea",
  "your story doesn't have a point", "too many things happening",
  "get to the point", "this doesn't belong here", "too short"
]
```

**`R2.2n` — Support multi-anecdote and multi-experience story shapes as first-class structures.**
*Basis:* `A1-C79`, `A1-C82`. *Confidence: moderate-high.*
Provide a template alongside the single-episode one: *"Three things about my character"* / *"Three times this happened."* Do not label it as simpler or as a stepping stone. Japanese children's three-verse structure (`A1-C82`) and topic-associating structure (`A1-C79`) are both well-formed under this template and ill-formed under a single-episode template.

**`R2.3n` — Support performance and audience-address as valued moves.**
*Basis:* `A1-C81`, `A1-C83`, `A1-C12`, `A1-C87`. *Confidence: moderate.*
Direct address ("y'all won't believe this"), asides, sound words, repetition-for-effect, and dialogue-heavy telling must be recognised by the expressiveness lane (`R1.3`) as strengths — not stripped, not flagged, not "tightened."

**`R2.4n` — Do not require invention. Offer a "true story" path with equal status.**
*Basis:* `A1-C83` (Roadville/preschool conflict over true accounts). *Confidence: moderate.*
Some children's home narrative norms treat fictionalizing as a violation. A child who wants their character to be a real person, or a story to be something that really happened, must have a fully supported path. Note the tension with `R2.4f` (fiction is structurally easier at grades 3–5): the resolution is **offer both, default to neither, never push.**

**`R2.5n` — Do not use grade or age as a gate for cultural-linguistic-minority children in particular.**
*Basis:* `A1-C86`, `A1-C14`. *Confidence: moderate.*
Grade-related differences did not appear in a grades-2–5 African American sample (`A1-C86`), and child-level variance dominated in an Appalachian K–2 sample (`A1-C14`). Grade-gated scaffolding is not merely imprecise; in these samples it has no observed basis.

**`R2.6n` — If any per-culture default is ever proposed, refuse it.**
*Basis:* `A1-C80`. *Confidence: high (policy).*
The Michaels finding was not universally replicated. Character Studio must never branch prompting on inferred race, ethnicity, home language or country. Branch on **observed story shape** only.

---

## 2.15 What actually works: intervention, feedback, and scaffolding evidence

### WHAT RESEARCH SAYS

**`A1-C88`** `[E1]` Pico, Prickett, Foster, Skiba et al. (2021), *Interventions Designed to Improve Narrative Language in School-Age Children: A Systematic Review With Meta-Analyses*, **Language, Speech, and Hearing Services in Schools**, doi 10.1044/2021_LSHSS-20-00160. `[SNIPPET]` **Meta-analyses of 26 studies** of preschool and elementary-age children in the United States indicated overall positive intervention effects: **d = 0.51 and 0.54 in group-design studies, and d = 1.24 in single-case-design studies.** Common characteristics across effective interventions: **manualized curricula; opportunities to produce narrative language; verbal and visual supports; direct instruction of story grammar; and use of authentic children's literature.**
**This is the most directly actionable finding in the document for feature prioritisation.** Four of the five common characteristics are implementable in software.

**`A1-C89`** `[E1]` `[SNIPPET]` Graham, Hebert & Harris (2015), *Formative Assessment and Writing: A Meta-Analysis*, **The Elementary School Journal, 115(4)** (doi 10.1086/681947). Feedback about writing from different sources yielded average weighted effect sizes of: **adults 0.87, peers 0.58, self 0.62, computers 0.38.** Assessment overall had an average weighted ES of **0.42**, with **86% of studies yielding a positive effect**. In a separate meta-analysis for grades 4–6, feedback yielded **ES 0.88**. Reported non-effects: **teachers' monitoring of students' writing progress, and implementation of the 6+1 Trait Writing model, did not meaningfully enhance writing.**
**Product reading — sobering and important:** **computer-delivered feedback had the *smallest* effect of the four sources (0.38 vs 0.87 for adults).** Character Studio is a computer feedback source. The evidence says it should be **modest about its own feedback and should route toward adult and peer feedback wherever the platform allows.**

**`A1-C90`** `[E2]`/`[E4]` `[SNIPPET]` Wood, Bruner & Ross (1976), *The role of tutoring in problem solving*, **Journal of Child Psychology and Psychiatry, 17, 89–100**, defined scaffolding as a process enabling a learner to achieve what would be beyond unassisted effort, and proposed **six scaffolding functions**: **recruitment** (gain interest); **reduction in degrees of freedom** (simplify to match current competence); **direction maintenance** (keep on task); **marking critical features** (feedback on important features and incorrect steps); **frustration control** (reduce stress without creating dependence on emotional support); **demonstration** (model portions the learner cannot yet do). A four-decade review (ScienceDirect S0883035518306219) identifies three tenets: **intersubjectivity, contingent support, and release of responsibility to the learner**, with the process requiring **graduated assistance or hints, deliberately withholding direct answers to keep the learner in control of the task.**

**`A1-C91`** `[E1]` `[SNIPPET]` Story grammar instruction has demonstrated effects on specific outcomes: **story grammar intervention improved the quality of narrative summaries in fourth graders**, with better summaries from easier text (*The impact of story grammar instruction and text difficulty on students' skill in summarizing narratives*, **Written Language & Literacy**, doi 10.1075/wll.00032.hel); and a group intervention teaching story grammar components to **24 children with language learning difficulties** produced significant improvement in **number of T-units and use of story grammar components** (*Teaching story grammar components to increase oral narrative ability: A group intervention study*, **Child Language Teaching and Therapy**, 2012; ERIC EJ984144).

**`A1-C92`** `[E1]` `[SNIPPET]` Elicitation format matters and is partly interchangeable: the **INC yielded similar scores across five elicitation formats** (`A1-C34`). But task type matters for difficulty: **story generation is the more difficult task** relative to retell (`A1-C11`), and retell/generation findings diverge by population — school-age children with language impairment produced **shorter** narratives than peers on retell but, on generation, produced narratives **equal in length but containing more extraneous information.** In some typically developing samples, **narrative productivity was quantitatively higher in retelling than in generation.** Retrieved partly via Frontiers in Communication, *Age and task type effects on comprehension and production of narrative macrostructure: storytelling and retelling by Swedish-speaking children aged 6 and 8* (fcomm.2023.1252260).

**`A1-C93`** `[E1]`/`[E4]` `[SNIPPET]` **Well-framed open-ended prompts, including those that reuse details the child provided as cues, elicit narrative accounts from children of all ages**, and such information is more likely to be accurate — a finding from the investigative-interviewing literature (*Enhancing children's narratives in investigative interviews*, PubMed 11197041). Recommended continuers include **"Tell me more," "Keep going."** Also retrieved: typically developing children showed **higher quantity and quality of language in a story retell in response to an animated video than after viewing the same images as static pictures** (*Young children's narrative retell in response to static and animated stories*, **IJLCD**, doi 10.1111/1460-6984.12523).
*Caveat:* the investigative-interviewing evidence is about **accuracy of recall**, not creative composition. The transfer to fiction is an inference.

### WHAT CHARACTER STUDIO SHOULD DO

**`R2.1o` — Build the four software-implementable ingredients of effective narrative intervention, and skip the fifth only reluctantly.**
*Basis:* `A1-C88`. *Confidence: high — this is the cleanest feature-priority evidence in the document.*

| Ingredient (from `A1-C88`) | Character Studio implementation |
|---|---|
| Manualized curriculum | A fixed, sequenced set of character-creation moves per band — not free-form chat |
| Opportunities to produce narrative language | The child writes/speaks a lot; the AI writes little |
| **Verbal and visual supports** | Icons/cards for character elements; spoken prompts; a visible cast list |
| **Direct instruction of story grammar** | Explicit, named, teachable moves ("this is called the character's *goal*") |
| Authentic children's literature | Worked examples from real books, if licensing allows; otherwise, a gap to note |

Note the tension with `R1.1`: story grammar should be *taught explicitly* (`A1-C88`) while never being used as a *verdict* (`A1-C08`). Both are satisfiable: teach the vocabulary, withhold the scorecard.

**`R2.2o` — Calibrate the product's self-belief to ES 0.38, and route to humans.**
*Basis:* `A1-C89`. *Confidence: high.*
Computer feedback effect (0.38) is under half the adult feedback effect (0.87). Concrete implications:
- Do not position Character Studio as a replacement for teacher feedback.
- Build affordances for **sharing a character with a teacher or peer** and for **peer response** (peer ES 0.58 — higher than computer).
- Build **self-assessment** supports (self ES 0.62 — also higher than computer): e.g. "which part of your character do you like best?" This is a **cheap, higher-yield** feature than more AI suggestions.
- Do **not** implement a 6+1-Trait-style multi-trait scoring display (`A1-C89`: no meaningful effect).

**`R2.3o` — Implement Wood/Bruner/Ross's six functions explicitly, and name which function each intervention serves.**
*Basis:* `A1-C90`. *Confidence: moderate-high (`[E2]`/`[E4]`, foundational and widely adopted).*
```
scaffoldAction.function ∈ {
  RECRUIT,            // spark interest — safe at all bands, no gating
  REDUCE_FREEDOM,     // narrow the choice space — use when child is stuck
  MAINTAIN_DIRECTION, // gentle "and then?" — safe at all bands
  MARK_FEATURES,      // name what matters — the ONLY function that resembles feedback
  CONTROL_FRUSTRATION,// reduce stress WITHOUT creating dependence
  DEMONSTRATE         // model a move — LAST resort, see R2.4o
}
```
Every prompt in the library must be tagged with its function. This makes the "am I helping or taking over?" question auditable.

**`R2.4o` — Withhold direct answers. Never generate the child's character content.**
*Basis:* `A1-C90` ("deliberately withholding direct answers in order to keep the student in control of the task"; "release of responsibility to the learner"); `A1-C88` ("opportunities to produce narrative language"). *Confidence: high.*
The `DEMONSTRATE` function is legitimate but must model **the move on a different, generic example**, never on the child's own character. Hard rule:
```
NEVER: write a trait, a name, a backstory, a line of dialogue, or a plot event
       INTO the child's character/story.
ALLOWED: show a worked example about an unrelated example character;
         offer a menu of question types;
         reflect back what the child already wrote.
```

**`R2.5o` — Use graduated hints: the smallest sufficient nudge, then stop.**
*Basis:* `A1-C90`. *Confidence: high.*
```
hintLadder = [
  L0: silence (default),
  L1: MAINTAIN_DIRECTION  — "and then?" / "tell me more"
  L2: RECRUIT             — an open, interest-led question
  L3: MARK_FEATURES       — name the element ("what does she want?")
  L4: REDUCE_FREEDOM      — a 2–3 option menu
  L5: DEMONSTRATE         — worked example on a DIFFERENT character
]
// Advance one rung only after a full unproductive turn.
// Descend immediately on any productive turn. See R3.4.
```

**`R2.6o` — Use open-ended prompts and reuse the child's own words.**
*Basis:* `A1-C93`. *Confidence: moderate.*
Prompts must be built from the child's own content ("You said Mira has a stolen compass — who did she take it from?") rather than generic slot-filling. This also enforces `R2.4o`, because a prompt built from the child's words cannot introduce new content.

**`R2.7o` — Do not assume a retell warm-up is easier than invention, or vice versa.**
*Basis:* `A1-C92`. *Confidence: moderate — findings are genuinely mixed.*
Default to neutrality: offer both an "invent a character" and a "retell/remix a character from a story you know" entry point, without labelling either as the easier one.

---

## 2.16 Multilingual and emergent bilingual learners

### WHAT RESEARCH SAYS

**`A1-C94`** `[E1]`/`[E5]` `[SNIPPET]` **MAIN** (Multilingual Assessment Instrument for Narratives; main.leibniz-zas.de) contains **four parallel stories, each a carefully designed six-picture sequence**, controlled for cognitive and linguistic complexity, parallelism in macro- and microstructure, cultural appropriateness and robustness, suitable for children **aged 3 to 10** (maps **pre-B0 → B2**), supporting **Model Story, Retelling and Telling** elicitation modes and assessment of **several languages in the same child**. Developed through piloting with **more than 550 monolingual and bilingual children aged 3–10 across 15 languages and language combinations**; adaptations have generated data from **over 60 countries**. Reported: narrative skills including structure and comprehension **improve significantly with age, particularly from 4 to 7**; **all micro- and macrostructure measures increased with age except structural complexity.**

**`A1-C95`** `[E1]` `[SNIPPET]` **Macrostructure is substantially shared across a bilingual child's two languages, with variation in subcomponents.** Retrieved: *Bilingual Children Demonstrate Variation Within Shared Narrative Macrostructure* (PMC11567087) — children showed **comparable use of overall macrostructure across languages**, alongside **variation in which macrostructure subcomponents they used by language of elicitation**; *Are Narrative Macrostructure Skills Shared in Bilingual Children's Two Languages, and What Predicts Them?* (**LSHSS**, doi 10.1044/2025_LSHSS-25-00049); and a longitudinal factor-structure study reporting **cross-language transfer from L1 to L2 on narrative complexity**.

**`A1-C96`** `[E1]` `[SNIPPET]` *English Narrative Macrostructure Development of Spanish–English Bilingual Children From Preschool to First Grade* (PMC8702841; PubMed 33999697) followed **seven macrostructure features** in English narratives **from the beginning of preschool to the end of first grade** (maps **pre-B0 → B0**). Growth curve models revealed that **production of all seven narrative features grew over the four years**, and that **individual macrostructure features were susceptible to the effects of the timing of English exposure.** Also retrieved: *Language Proficiency and Narrative Macrostructure in Spanish–English Bilingual Children*, **AJSLP**, doi 10.1044/2025_AJSLP-25-00142, examining **children aged 5–7**.

**`A1-C97`** `[E1]` `[SNIPPET]` **Internal state term production varies with language and cultural context** (`A1-C44`), and internal state terms in bilingual children with DLD interact with both microstructure and macrostructure (**LSHSS**, doi 10.1044/2024_LSHSS-23-00170).

**`A1-C98`** `[E4]` `[SNIPPET]` **Translanguaging** practice recommendations retrieved from practitioner and academic sources: translanguaging lets emergent bilinguals **use all their languages flexibly to make meaning**, unlike translation; recommended moves include **encouraging students to describe content in their home language before presenting it in English**, **story circles where students share family and cultural narratives in any language**, and **providing texts in home languages alongside English**. Retrieved via *Storytelling in a Bilingual Classroom Through the Lens of Epistemic Diversity and Translanguaging* (**International Journal of Applied Linguistics**, doi 10.1111/ijal.12714), the Iowa Reading Research Center, Lexia, and Brookes.
`[E4]`, not `[E1]` — these are practice recommendations, not effect estimates.

### WHAT CHARACTER STUDIO SHOULD DO

**`R2.1p` — Accept character work in any language, at any point, including mid-sentence.**
*Basis:* `A1-C95`, `A1-C98`. *Confidence: moderate-high.*
Macrostructure is largely shared across a bilingual child's languages (`A1-C95`), so a character developed partly in Spanish is the same character work. The editor must not auto-translate, auto-correct, or flag non-English text. Character notes fields especially should be language-agnostic.

**`R2.2p` — Never route scaffold level on English surface features.**
*Basis:* `A1-C95`, `A1-C96`, `A1-C97`. *Confidence: high.*
```
FORBIDDEN as scaffold-routing inputs:
  - grammatical error rate
  - lexical diversity in English
  - sentence length
  - spelling accuracy
ALLOWED:
  - presence of macrostructure elements (shared across languages)
  - causal/temporal linking of elements
  - goal specification
```
Microstructure in English reflects English exposure timing (`A1-C96`); macrostructure reflects narrative competence (`A1-C95`). Route on the latter only.

**`R2.3p` — Offer a "tell it in your language first" path.**
*Basis:* `A1-C98`. *Confidence: low-moderate (`[E4]` practice consensus).*
An explicit, non-remedial option: describe the character in the home language, then (optionally) write it in English. Framed as a strategy, not a support.

**`R2.4p` — Do not read low internal-state-term density as low interiority for multilingual writers.**
*Basis:* `A1-C97`, `A1-C44`. *Confidence: moderate.*
Internal state term use varies by language and culture. This is already covered by `R2.3f` (never flag low interiority) but is worth stating twice because it is the most likely place for a well-intentioned AI tool to systematically mis-serve emergent bilinguals.

---

## 2.17 What is known about AI-assisted storytelling with children

### WHAT RESEARCH SAYS

This literature is **early, small-sample, and HCI-methodological rather than developmental**. It is `[E6]` throughout.

**`A1-C99`** `[E6]` `[SNIPPET]` *StoryPrompt: Exploring the Design Space of an AI-Empowered Creative Storytelling System for Elementary Children*, **CHI 2024 Extended Abstracts**, doi 10.1145/3613905.3651118. Formative research with **three elementary teachers and 18 children**. Reported: **AI-generated words were effective at triggering children's problem-solving and reflective moments**, while **AI-generated images were limited in accurately representing children's storytelling ideas.** A follow-up: *From Words to Wonder: Designing and Evaluating an AI-Empowered Creative Storytelling System for Elementary Children*, **CHI 2025**, doi 10.1145/3706598.3713478.
**Product reading:** **words prompt thinking; images override it.** An image generated from a child's character description can replace the child's mental image rather than extend it.

**`A1-C100`** `[E6]` `[SNIPPET]` *Mathemyths: Leveraging Large Language Models to Teach Mathematical Language through Child-AI Co-Creative Storytelling* (arXiv 2402.01927). Reported **potential benefits of child-AI co-creative storytelling for enhancing children's creativity**, but also that **some children found certain AI-generated questions challenging to answer, with a notably higher rate of uncertainty in responses to AI-generated questions compared to those posed by a human partner.**
**Product reading:** AI-authored questions are harder for children to answer than the same questions from a person. Prompts must be simpler and more concrete than an adult would need to make them.

**`A1-C101`** `[E6]` `[SNIPPET]` *Empowering Children's AI Literacy Through Co-Creating Stories with LLM*, **IDC 2025**, doi 10.1145/3713043.3731520. Reported: **children envision generative AI as a companion providing guidance, a collaborator working alongside them, and a task automator, but also express fears about overreliance, particularly in academic settings.**

**`A1-C102`** `[E6]` `[SNIPPET]` A retrieved statement that "an evaluation experiment conducted on **21 fifth graders** showed an improvement in the children's creative ability" following an interactive storytelling system. **Source not individually attributable among returned results; n = 21 with no control described. Very low confidence — do not cite.**

**`A1-C103`** `[E6]` `[SNIPPET]` Retrieved from an arXiv preprint on LLM-generated narrative: **AI-generated stories favour stability over change, showing homogeneity and cultural stereotyping** (arXiv 2507.22445, on gpt-4o-mini). Related: some computational narrative systems deliberately avoid enforcing specific story grammars to avoid Western bias (`A1-C87`).
**Product reading:** a generative model left to suggest character content will tend toward stereotyped and static characters — the exact opposite of the "round, dynamic" direction the product wants — and toward cultural homogenisation. This is an independent argument for `R2.4o` (never generate the child's content).

### WHAT CHARACTER STUDIO SHOULD DO

**`R2.1q` — Prefer word/question prompts over image generation in the character-creation loop.**
*Basis:* `A1-C99`. *Confidence: low-moderate (single formative study).*
If character portraits are offered, generate them **after** the child has described the character in words, present them as **one interpretation among many**, and always offer "that's not her" with an easy path back to words. Never lead with an image.

**`R2.2q` — Write prompts simpler than you think you need to.**
*Basis:* `A1-C100`. *Confidence: low-moderate.*
Children showed measurably more uncertainty answering AI-posed questions than human-posed ones. Practical rules: one question per turn; concrete nouns; no compound questions; no metacognitive framing ("think about how you might…"); always an easy out ("not sure yet" must be a first-class answer that does not re-prompt).

**`R2.3q` — Design against overreliance explicitly, and tell children you are doing so.**
*Basis:* `A1-C101`, `A1-C90` (release of responsibility). *Confidence: moderate.*
Children themselves name overreliance as a fear. Concrete: a visible "this is yours" framing; no auto-complete of character fields; a session summary that reflects **what the child made**, not what the tool suggested.

**`R2.4q` — Treat the model's own tendencies as a bias to counteract, not a resource to exploit.**
*Basis:* `A1-C103`, `A1-C87`. *Confidence: low-moderate (preprint evidence).*
If any generative suggestion surface exists at all, audit its outputs for stereotyping and for static characters. Given `R2.4o` already forbids generating the child's content, this is mostly a constraint on example characters and on prompt phrasing.

---

## 2.18 Motivation, engagement, and why the tool must be careful

### WHAT RESEARCH SAYS

**`A1-C104`** `[E1]`/`[E4]` `[SNIPPET]` **Choice and autonomy support writing motivation via self-efficacy.** Retrieved: greater choice in writing tasks matters for motivation because increased autonomy generates greater self-efficacy, with a strong correlation between choice and self-efficacy; granting autonomy to select topics aligned with personal interests raises engagement. A systematic review of K–5 students' self-reports (*The ABCs of writing motivation*, **Frontiers in Education**, feduc.2024.1396484) identifies **four clusters of necessary conditions**: nurturing positive self-beliefs; fostering engagement through authentic writing tasks; a supportive context encouraging positive teacher–student interactions and peer collaboration; and a positive environment instilling autonomy and positive attitudes. Also retrieved: *The association between writing motivation and performance among primary school students: considering the role of self-efficacy*, **Humanities and Social Sciences Communications** (doi 10.1038/s41599-024-04298-2).

**`A1-C105`** `[E1]` `[SNIPPET]` Emotional/affective outcomes are part of what effective writing instruction moves: SRSD effect sizes are reported across **writing and affective outcome measures** (`A1-C78`), and the graphic-organizer-plus-storytelling intervention improved **attitude toward writing** alongside quality (`A1-C77`).

**`A1-C106`** `[UNVERIFIED]` I could not retrieve evidence on **negative effects of over-correction on young writers' motivation or writing anxiety** — the search budget was exhausted before this query ran. *Intended search:* "corrective feedback young writers motivation anxiety negative effects too much correction elementary writing research." **The do-not-flag list in Part 3 is therefore justified on developmental-normativity and cultural-bias grounds (`A1-C79`, `A1-C47`, `A1-C56`), not on motivational-harm evidence.** Do not claim motivational harm as the rationale.

### WHAT CHARACTER STUDIO SHOULD DO

**`R2.1r` — Maximise choice at every decision point.**
*Basis:* `A1-C104`. *Confidence: moderate-high.*
Every prompt should be skippable; every template optional; every suggestion dismissible with one action; character type, genre, and topic entirely the child's. The manualized-curriculum recommendation (`R2.1o`) applies to the **sequence of moves offered**, not to the content of the character.

**`R2.2r` — Track and protect affect, not just output.**
*Basis:* `A1-C105`, `A1-C104`. *Confidence: moderate.*
If a child dismisses suggestions repeatedly, abandons sessions, or stops writing after feedback, the correct response is **fewer interventions**, not different ones. See `R3.4` de-escalation.

---

## 2.19 Genre knowledge, and the assessment instruments worth knowing

### WHAT RESEARCH SAYS

**`A1-C107`** `[E1]` `[SNIPPET]` *Narrative skills and genre knowledge: Ways of telling in the primary school grades*, **Applied Psycholinguistics** (Cambridge Core). Children in **grades K–2** (maps **B0–B1**) watched a shortened silent film (*The Red Balloon*) and performed **three narrative tasks**: on-line narration of a 3-minute segment; recounting events **as a news report**; and recounting events **as an embellished story**. Reported finding: **very subtle distinctions between the texts produced for the three genre tasks**, leading to the conclusion that **primary grade children have only nascent ability to apply their genre knowledge to school language tasks.**
**Product reading:** at **B0–B1**, asking a child to write "in the style of" something, or to adjust their telling for a purpose or audience, will mostly not change what they produce. This is not non-compliance; it is a genre-differentiation ability that has not yet developed.

**`A1-C108`** `[E5]` `[SNIPPET]` **Test of Narrative Language–Second Edition (TNL-2)**, Gillam & Pearson, PRO-ED. Normed for ages **4;0 through 15;11** — a range that spans Character Studio's entire audience. Six tasks: **comprehension and production for each of three narrative types — scripts, personal narratives, and fictional narratives.** Administration ~15–20 minutes individually. Normative data collected **2013–2015**, described as representative of the US population. `[E5]` commercial instrument.
**Product relevance:** the TNL-2's three-way split (script / personal / fictional) is a useful reminder that "narrative" is not one thing, and that fictional narrative is a distinct, separately-normed competence.

**`A1-C109`** `[E1]` `[SNIPPET]` **Narrative predicts later literacy, over long intervals.** Retrieved: *Linguistic comprehension and narrative skills predict reading ability: A 9-year longitudinal study*, **British Journal of Educational Psychology** (doi 10.1111/bjep.12353) — linguistic comprehension and narrative skills at **age 5** made unique and direct contributions to reading comprehension and reading achievement after accounting for general cognitive ability, memory, phonological skills and mother's education. Also: *From infancy to adolescence: The longitudinal links between vocabulary, early literacy skills, oral narrative, and reading comprehension* (ScienceDirect S088520141730237X) — **oral narrative skills at school entry related to reading comprehension at age 16**. Related retrieved statements: **early use of macrostructure in story retelling was linked to later decoding of real words, reading comprehension, and written language, while microstructure use predicted decoding of pseudowords**; and the effect of early oral language on reading **strengthens in later primary years** as reading demands shift from decoding to comprehension.

### WHAT CHARACTER STUDIO SHOULD DO

**`R2.1s` — Do not build genre/audience-adaptation features for B0–B1.**
*Basis:* `A1-C107`. *Confidence: moderate-high.*
"Write it as a news report," "write it for a younger reader," "make it spooky" will produce little differentiation before roughly grade 3. Introduce genre play as an option from **B2**, and expect real control only at **B3–B4** (consistent with the Common Core progression, `A1-C59`, where reflection arrives at grade 8 and multiple plot lines at grade 9).

**`R2.2s` — Keep fictional character work distinct from personal-narrative and script work in the data model.**
*Basis:* `A1-C108`, `A1-C45`. *Confidence: moderate.*
They are separately normed competences (`A1-C108`) and children perform differently across them (`A1-C45`). Do not aggregate them into one "narrative skill" number.

**`R2.3s` — Frame the product's value proposition on macrostructure, not on output polish.**
*Basis:* `A1-C109`, `A1-C88`. *Confidence: moderate-high.*
The longitudinal literacy links run through **narrative macrostructure and oral narrative competence**, not through spelling or sentence length. This is the defensible educational claim Character Studio can make to schools: it supports the structural and character-reasoning dimensions of narrative that predict later reading comprehension. (Note: these are correlational/longitudinal findings, so the claim must be "supports the skills that predict," not "improves reading.")

---
---

# PART 3 — CONSOLIDATED IMPLEMENTABLE DECISION LOGIC

> Everything in this part is **prescriptive product logic**. Research support is cited by claim ID; anything numeric that is not in the research is marked **`DESIGN DECISION`**.

## 3.1 Character complexity envelopes — "what good looks like" per band

See the full table at **`R2.1g`**. Summary spine:

| Band | The character is defined by… | The one growth edge to invite |
|---|---|---|
| **B0** (5–6, K–1) | looks, actions, possessions; one want; simple feelings | link one feeling to one event |
| **B1** (7–8, gr 2–3) | + 1–2 stable trait labels; simple thoughts | link a trait to a behavior |
| **B2** (9–10, gr 4–5) | + traits as causes; knows/doesn't-know; goal with an obstacle | one thing the character learns |
| **B3** (11–12, gr 6–7) | + motivation; response to conflict; relationships | a contradiction, or change over the story |
| **B4** (13–14, gr 8–9) | + a want, a flaw, and a relationship pressuring both | a self-belief the story tests |

*Basis:* `A1-C48`, `A1-C49`, `A1-C50`, `A1-C53`, `A1-C61`, `A1-C21`, `A1-C43`, `A1-C35`, `A1-C39`. *Confidence: moderate for B0–B2; low for B3–B4 (extrapolated; see `A1-C52` — no direct evidence exists on children's invented-character development).*

## 3.2 Prompt library, by band and by scaffolding function

Every prompt is tagged with a Wood/Bruner/Ross function (`R2.3o`). Prompts marked **†** are the band's *anchor* prompt and should be asked first.

### B0 (ages 5–6, grades K–1) — *peripheral audience*
| Function | Prompt |
|---|---|
| RECRUIT | "Who is this story about?" |
| MARK_FEATURES † | "What does she want?" (`R2.1c`) |
| MAINTAIN_DIRECTION | "And then what happened?" |
| MARK_FEATURES | "How does he feel?" (feelings only — `R2.1f`) |
| REDUCE_FREEDOM | "Is she brave, or funny, or shy? Or something else?" |
| CONTROL_FRUSTRATION | "Want to tell me out loud and I'll hold onto it?" (`R2.1l`) |

### B1 (ages 7–8, grades 2–3)
| Function | Prompt |
|---|---|
| MARK_FEATURES † | "What does your character want more than anything?" |
| MARK_FEATURES | "Why did she do that?" (motivational causality now available — `A1-C21`) |
| MARK_FEATURES | "What is he thinking right then?" |
| MARK_FEATURES | "What's one thing only your character would say?" (dialogue — `R2.1i`) |
| RECRUIT | "What's the funniest thing about her?" (`R2.5j`) |
| MAINTAIN_DIRECTION | "Tell me more." / "Keep going." (`A1-C93`) |

### B2 (ages 9–10, grades 4–5)
| Function | Prompt |
|---|---|
| MARK_FEATURES † | "What does she want, and what's standing in the way?" |
| MARK_FEATURES | "Did it work the first time? What happened when it didn't?" (goal failure — `R2.3c`) |
| MARK_FEATURES | "What does she know that nobody else knows?" |
| MARK_FEATURES | "Where does she live, and what does that tell us about her?" (orientations — `R2.3j`) |
| REDUCE_FREEDOM | "Want to try showing us she's brave instead of saying it?" (offer only — `R2.3g`) |
| RECRUIT | "Does anyone in your story believe something that isn't true?" (optional SOFB — `R2.1e`) |

### B3 (ages 11–12, grades 6–7)
| Function | Prompt |
|---|---|
| MARK_FEATURES † | "What does she want that she can't admit she wants?" |
| MARK_FEATURES | "She's brave about one thing — what is she scared of?" (contradiction) |
| MARK_FEATURES | "What happened before this story started that made her this way?" |
| MARK_FEATURES | "Who does she change because of, and how?" |
| RECRUIT | "Who in this story would tell it completely differently?" |

### B4 (ages 13–14, grades 8–9)
| Function | Prompt |
|---|---|
| MARK_FEATURES † | "What does he believe about himself that this story is going to test?" |
| MARK_FEATURES | "What's the choice only this character would make?" |
| MARK_FEATURES | "What does she do that contradicts what she says?" |
| MARK_FEATURES | "Looking back, what does he understand now that he didn't?" (reflection — grade 8 standard, `A1-C59`) |
| RECRUIT | "What would break her?" |

**Construction rules for all prompts** (`R2.6o`, `R2.2q`):
1. One question per turn. No compound questions.
2. Reuse the child's own nouns and names.
3. Concrete over abstract; no metacognitive framing.
4. "Not sure yet" is always a valid answer and must not trigger a follow-up.
5. Never introduce a name, trait, event, or line of dialogue the child did not write.

## 3.3 Feedback thresholds — when to speak and when to stay silent

**Default state is silence.** The product's own feedback channel has the weakest evidence of the four sources (`A1-C89`: computer ES 0.38 vs adult 0.87).

```
// ---- GLOBAL RATE LIMITS (all DESIGN DECISION) ----
maxInterventionsPerSession        = 3
minChildTurnsBetweenInterventions = 2
maxInterventionsPerStoryElement   = 1     // never repeat a dismissed suggestion
cooldownAfterDismissal            = rest of session

// ---- SPEAK ONLY IF ALL OF THESE HOLD ----
function shouldIntervene(state):
    if state.childIsActivelyWriting: return false        // never interrupt composition
    if state.interventionsThisSession >= 3: return false
    if state.turnsSinceLastIntervention < 2: return false
    if state.lastSuggestionDismissed: return false
    if state.targetElement in DO_NOT_FLAG[state.band]: return false
    if state.signalIsMechanical: return false            // R2.2i, R2.2l
    return true

// ---- WHAT TO SAY, IN PRIORITY ORDER ----
// 1. Recognition of something the child did (expressiveness lane first — R1.3)
// 2. A question built from the child's own words (R2.6o)
// 3. A menu of 2–3 options
// 4. A worked example on a DIFFERENT character (last resort — R2.4o)
```

**Silence is mandatory (not merely default) when:**
- the child is mid-composition (`R2.2l`);
- the observation concerns spelling, punctuation, grammar, or length (`R2.1k`, `R2.2i`, `R2.2l`);
- the target is on the band's do-not-flag list (§3.5);
- the child has dismissed a suggestion this session (`R2.2r`);
- the child's engagement signals are declining — abandonment, shortening turns, repeated dismissal (`R2.2r`).

**Recognition:suggestion ratio.** At least **2 recognitions for every 1 suggestion** (**DESIGN DECISION**), with recognitions drawn preferentially from the expressiveness lane (`R1.3`).

## 3.4 Scaffold escalation and de-escalation — routed on output, not age

```
// scaffoldLevel ∈ {0,1,2,3,4,5}  ==  hintLadder rungs from R2.5o
// L0 silence · L1 maintain direction · L2 recruit · L3 mark features
// L4 reduce freedom · L5 demonstrate (different character)

initialise:
    scaffoldLevel = defaultForBand(band)      // B0:3  B1:2  B2:1  B3:1  B4:0   [DESIGN DECISION]
    // this prior decays to irrelevance after 2 completed character creations (R1.4)

ESCALATE by exactly one rung when ALL hold:
    - child produced no new content for 2 consecutive turns
    - child has not dismissed a suggestion this session
    - child has not typed a "stuck" signal that a lower rung already addressed

DE-ESCALATE by one rung IMMEDIATELY when ANY holds:
    - child produced new content without prompting
    - child dismissed the last suggestion
    - child answered a prompt with more than a minimal response
    - child began a new element on their own initiative

HARD DE-ESCALATE to L0 (silence for the rest of the session) when ANY holds:
    - child dismissed 2 suggestions
    - child's turn length has decreased for 3 consecutive turns
    - child navigated away and returned twice
    - child explicitly asks the tool to stop
```

**Asymmetry is deliberate:** escalation is slow (2 unproductive turns), de-escalation is immediate. This implements "release of responsibility to the learner" (`A1-C90`) and guards against overreliance, which children themselves flag as a concern (`A1-C101`).

**Cross-band override:** if a child at any band is producing content matching a higher band's envelope (§3.1), raise their **prompt register** to that band and lower their **scaffold level** accordingly. Age band never caps what a child is offered (`R1.4`, `A1-C14`, `A1-C86`).

## 3.5 The do-not-flag list

> Nothing on this list may trigger a suggestion, a correction, a score, a nudge, or a teacher-facing "area for growth." These are **developmentally normal, culturally legitimate, or both.**

### Never flag, at ANY band

| Do not flag | Because |
|---|---|
| "And then… and then…" chaining | Additive connectives are acquired first and remain a valid style (`A1-C15`, `A1-C16`) |
| Story is short | No defensible length norms retrieved; age effects hold with length controlled (`A1-C61`, `A1-C68`) |
| Flat character (one dominant trait) | Legitimate in children's fiction and in fable/fairy-tale genre; no evidence flatness is a developmental problem (`A1-C47`, `A1-C52`) |
| Static character (does not change) | Same (`A1-C47`, `A1-C52`) |
| Animal, anthropomorphic, or fantastical character | Children's own stated preference; realism evidence concerns *given* stories, not invented ones (`A1-C62`, `A1-C46`) |
| Multi-anecdote / multi-episode / "wandering" shape | Topic-associating and three-verse structures are well-formed; flagging replicates documented biased feedback (`A1-C79`, `A1-C82`, `A1-C83`) |
| Story ends at the high point with no resolution | A recognised narrative shape; resolution is the least reliable element developmentally (`A1-C06`, `A1-C31`) |
| Spelling, punctuation, dialogue punctuation, capitalisation | Transcription load competes with composition (`A1-C69`, `A1-C70`) |
| Non-English or mixed-language content | Macrostructure is shared across a bilingual child's languages (`A1-C95`, `A1-C98`) |
| Repetition, sound words, direct address to reader, exclamation | Performance/expressive devices, valued in several narrative traditions (`A1-C81`, `A1-C83`, `A1-C12`) |
| A villain who does one nice thing | Young children apply a positivity asymmetry in trait attribution (`A1-C50`) |
| A story that is "true" rather than invented | Home narrative norms vary on fictionalizing (`A1-C83`) |

### Additionally, never flag at B0 (5–6) and B1 (7–8)

| Do not flag | Because |
|---|---|
| No stated reasons for character actions | Psychological/motivational causality emerges across 6→8 (`A1-C21`) |
| No internal states / no "how she felt" | Mental state talk develops over an extended period; coordinating it with structure is the developing skill (`A1-C42`) |
| Telling rather than showing ("she was brave") | Behavior→trait inference is not consolidated before ~7–8; telling is the correct direction at this age (`A1-C50`, `R2.3g`) |
| Ambiguous pronouns (B0 only) | Cohesive clause attachment develops to age 10, stabilises 8–12 (`A1-C54`, `A1-C56`) |
| No evaluative/emphasis language | Evaluations become near-universal only at 10–12 (`A1-C61`) |
| Goal achieved on the first attempt | Goal failure/reinstatement is a B2 move (`A1-C26`, `A1-C30`) |
| Only one character | Coherence at this age typically runs through a single protagonist (`A1-C28`) |
| No genre/audience differentiation | Genre knowledge is only nascent in K–2 (`A1-C107`) |

### Additionally, never flag at B2 (9–10)
| Do not flag | Because |
|---|---|
| No nested mental states (A thinks B thinks) | SOFB consolidates 7–9 with wide method-dependence; written control is later and unmeasured (`A1-C35`) |
| No character change / arc | No developmental evidence exists for arcs in children's invented characters (`A1-C52`) |
| No internal contradiction | Same (`A1-C52`) |

### At B3 (11–12) and B4 (13–14)
The list above continues to apply **in full**, minus the ambiguous-pronoun exemption. Nothing new is added to the flaggable set. The only mechanical issue that may ever be raised at any band from B1 upward is **an ambiguous pronoun that genuinely blocks a reader**, once per draft, phrased as a reader question (`R2.1h`).

## 3.6 Introduction schedule for advanced character concepts

Full table at **`R2.2g`**. The governing rule: **"earliest offer" is a permission, never a requirement, and "never require" means never — not "require later."**

## 3.7 Master pseudo-code

```
on childProducesContent(text, child):

    // 1. Parse into MISL-derived elements (R2.1d), relationally scored (R2.2d)
    elements = extractElements(text)            // character, setting, initiatingEvent,
                                                // internalResponse, plan, action, consequence
    relations = extractCausalTemporalLinks(elements)
    scores    = scoreRelationally(elements, relations)   // 0..3 per element

    // 2. Parse expressiveness lane in parallel (R1.3)
    expressive = { appendages, orientations, evaluations,
                   dialogue, performanceMarkers }        // rate-based (R2.2j)

    // 3. Route scaffold on OUTPUT (R1.4, R3.4)
    observedEnvelope = matchEnvelope(scores, expressive)
    scaffoldLevel    = updateScaffold(observedEnvelope, engagementSignals)

    // 4. Decide whether to speak at all — default silence (§3.3)
    if not shouldIntervene(state): return SILENCE

    // 5. Prefer recognition, and prefer the expressiveness lane (R1.3, §3.3)
    if expressive.isStrong and recognitionsThisSession < 2*suggestionsThisSession:
        return recognise(expressive.strongest, child.ownWords)

    // 6. Choose target — must survive the do-not-flag filter (§3.5)
    candidates = growthEdgesFor(observedEnvelope.band)
    candidates = candidates.filter(c => c not in DO_NOT_FLAG[child.band])
    candidates = candidates.filter(c => c not dismissedThisSession)
    if candidates.isEmpty: return SILENCE

    // 7. Emit ONE prompt at the current hint rung, built from the child's words
    return promptLibrary[child.band][scaffoldLevel]
             .selectFor(candidates.first)
             .instantiateWith(child.ownWords)          // R2.6o
             // MUST NOT contain new character content — R2.4o
```

---
---

# PART 4 — LIMITATIONS, ASSUMPTIONS, ACCESSIBILITY, GAPS, OPEN QUESTIONS

## 4.1 Limitations and disagreements in the evidence base

### 4.1.1 Limitations of *this document* (methodological, and severe)

1. **No full-text access.** All 10 attempted `WebFetch` retrievals were blocked by egress policy. Every claim rests on the search tool's synthesis of retrieved pages. I read **zero** source documents end-to-end.
2. **Numbers are the weakest part.** Effect sizes, sample sizes and percentages reached me through synthesis and could frequently not be attributed to a specific returned page. The figures I would most caution against quoting externally without verification: the **SRSD ES 3.52 for story grammar** (`A1-C78`), the **60% of 8-year-olds producing complete episodes** (`A1-C30`), the **52% of goal-based kindergarten stories** (`A1-C28`), the **10.72% / 7.10% / 28%** revision figures (`A1-C76`), and the **65% / 100% second-order false belief** rates (`A1-C35`).
3. **Search budget exhausted.** The session-wide cap was reached after 82 queries, leaving three intended searches unrun (over-scaffolding/AI overreliance and child ownership; corrective feedback and writing motivation/anxiety; K–1 narrative expectations in detail). `A1-C106` records the most consequential of these gaps.
4. **Recency skew.** Search surfaces recent, open-access, and heavily-indexed work. The 1970s–1990s foundational literature (Stein & Glenn, Applebee, Trabasso, Michaels, Heath, Bamberg) is present mostly as **citations and secondary description**, not as retrieved content. Foundational claims in this document are therefore systematically weaker than they look.
5. **Clinical/SLP overrepresentation.** Much of what is retrievable on school-age narrative comes from speech-language pathology, which is oriented toward **identifying difference from a norm**. That framing is the opposite of what Character Studio needs. I have tried to counter-weight it, but the tilt is in the source pool.

### 4.1.2 Genuine disagreements *within* the field

| Disagreement | Positions | How this document resolves it |
|---|---|---|
| Is story grammar a real cognitive structure? | Yes (`A1-C01`, `A1-C02`, `A1-C09`) vs. no, it's an artefact of content understanding (`A1-C08`) | Use as instructional scaffold and internal representation; never as a verdict (`R1.1`) |
| Are narrative stages real stages? | Stage models are conventional (`A1-C03`, `A1-C05`) vs. definitions vary and unidimensionality is questionable (`A1-C10`) | Component-level only; no stage labels anywhere (`R1.2`) |
| Does macrostructure differentiate TD from DLD? | Conflicting results, attributed partly to retell-vs-generation task differences (`A1-C11`, `A1-C110`) | Do not use macrostructure as a screening signal at all |
| Is retell or generation easier? | Retell usually described as easier; some TD samples show higher productivity in retell; LI children show the opposite pattern (`A1-C92`) | Offer both, label neither as easier (`R2.7o`) |
| Do topic-associating narratives characterise a group? | Michaels' finding vs. non-replication (`A1-C79`, `A1-C80`) | Support the *shape*; never branch on group membership (`R2.6n`) |
| Do human vs. animal characters matter developmentally? | Human protagonists elicited more socio-relational language in retells (`A1-C46`) vs. children prefer animal characters (`A1-C62`), and the finding concerns given stories, not invented ones | Neutrality; no steering (`R2.5f`) |
| Does the age band or the individual determine ability? | Age-graded progressions are widely reported vs. child-level variance dominates (`A1-C14`) and grade effects were absent in one sample (`A1-C86`) | Route on output; band is a decaying prior (`R1.4`) |

### 4.1.3 Where the evidence is thin enough that neutrality is the only defensible stance

Explicitly invoking the default stance: on **character species**, **fiction vs. true stories**, **image generation**, **retell vs. generation**, and **anything about character arcs, roundness, or dynamism in children's own invented characters** (`A1-C52`), the evidence does not support a product prescription. Character Studio should **offer options and default to neither.**

## 4.2 Cultural assumptions embedded in this research

These are assumptions built into the *instruments and constructs* this document is made of. They are not incidental.

*(These are assumptions, not claims, so they carry no `A1-C` number; each is traced to the claims that evidence it.)*

1. **A story has one topic, one protagonist, and one problem.** Story grammar (`A1-C01`), the NSS (`A1-C32`), the MISL (`A1-C33`) and the INC (`A1-C34`) all encode this. Topic-associating narratives (`A1-C79`), Japanese three-verse multi-experience narratives (`A1-C82`) and Trackton's conversationally-embedded telling (`A1-C83`) violate it while being perfectly competent.
2. **Longer and more elaborated is better.** Most microstructure measures are productivity measures (`A1-C63`). Japanese children's narratives were **exceptionally succinct by design** (`A1-C82`). Succinctness is scored as deficit by these instruments.
3. **Narrative is a solo, decontextualised performance.** Call-and-response and audience interaction (`A1-C81`) are constitutive of the narrative in some traditions and invisible to — or scored against — a solo-composition tool.
4. **Explicitness is a virtue; the listener should need no shared knowledge.** Referential adequacy measures (`A1-C55`, `A1-C56`) assume a naïve listener. Traditions that assume shared context score as ambiguous.
5. **Invention is valued over accuracy.** School literacy expects imaginative stories; Roadville's norms expected **true accounts** and treated fictionalizing as a violation (`A1-C83`).
6. **Interiority is the mark of a developed character.** Internal state language is culturally and linguistically variable (`A1-C44`, `A1-C97`). "Round character = lots of stated inner life" is a specific literary tradition, not a universal.
7. **The evaluated endpoint is a Labovian "classic narrative" — orientation, complicating action, high point, resolution, coda.** High-point analysis (`A1-C06`) treats this as the developmental terminus. It is one culture's story shape.
8. **English monolingual production is the reference case.** Norms (`A1-C63`, `A1-C64`) are English; MAIN (`A1-C94`) and Global TALES (`A1-C85`) are corrective efforts and are recent and comparatively small.
9. **Structural competence is separable from and prior to expressiveness.** Retrieved critique argues the opposite: engagement, audience awareness and prosodic emotional signalling are competence too, and are invisible to story grammar (`A1-C12`, `A1-C87`).

**Product consequence:** every one of these assumptions is baked into the internal representation `R2.1d` recommends. That is acceptable **only** because the representation is never surfaced as a verdict (`R1.1`) and because the do-not-flag list (§3.5) specifically exempts the shapes these assumptions would mis-score.

## 4.3 Accessibility considerations

### 4.3.1 Developmental Language Disorder (DLD)

**`A1-C110`** `[E1]` `[SNIPPET]` *Investigating Narrative Performance in Children With Developmental Language Disorder: A Systematic Review and Meta-Analysis*, **JSLHR**, doi 10.1044/2022_JSLHR-22-00017. **37 studies published 1987–2019, 382 effect sizes.** Children with DLD showed decreased narrative performance relative to TD peers, **overall average effect −0.82 SD, 95% CI [−0.99, −0.66]**. Across model specifications, **grammatical accuracy (microstructure) and story grammar (macrostructure) yielded the most consistent evidence of group differences.** A separate retrieved study reported children with DLD performing more weakly on **six of seven story grammar elements**. Intervention effects for this population were reported as **moderate-to-large for macrostructure (d = 0.67 to 1.57)** and **noneffect-to-large for microstructure (d = −1.08 to 1.53)**.

**Implications:**
- Character Studio will encounter children whose narrative output sits ~0.8 SD below peers. The product must be usable and rewarding for them, which the do-not-flag list and the silence-by-default posture largely secure.
- **Macrostructure intervention works** for this group (d up to 1.57). The explicit, named, teachable story-grammar moves recommended in `R2.1o` are exactly the active ingredient.
- **Do not use the tool as a screener.** Macrostructure's diagnostic value is disputed (`A1-C11`) and task type moves the result (`A1-C92`).

### 4.3.2 Autistic learners

**`A1-C111`** `[E1]` `[SNIPPET]` *Narratives of children with high-functioning autism spectrum disorder: A meta-analysis* (ScienceDirect S0891422216302049), **24 studies**, analysing microstructure, macrostructure and internal state language. Reported group differences on **number of words, number of different words, number of utterances, mean length of T-units, syntactic complexity, coherence, cohesive adequacy, and internal state language**, plus pragmatic measures including story organization, inclusion of relevant information, referencing and mental state language. **Considerable variation among studies; not all show weaknesses.** Related: reduced global coherence, atypical referential choices, and variable internal state language use; and differences in **referential establishment but not cohesion** for older autistic children (**JSLHR**, doi 10.1044/2023_JSLHR-22-00630). Narrative profiles differ by **verbal skill level**, and retell vs. generation distinguishes profiles (ScienceDirect S002199242500098X).

**`A1-C115`** `[E4]` `[SNIPPET]` Neurodiversity-affirming practice guidance retrieved (SAGE scoping review doi 10.1177/27546330251357479; ASHA Perspectives, *A Primer on Neurodiversity-Affirming Speech and Language Services for Autistic Individuals*, doi 10.1044/2023_PERSP-23-00106): shift focus **from normalising behaviours to acceptance and inclusion**; adapt the environment rather than the child; use **child-centred, interest-led** approaches; **prioritise authentic interaction over interventions disguised as games**; build on the learner's own preferred topics.

**Implications:**
- **Interest-led is not a nicety, it is the recommended practice** (`A1-C115`). Character Studio's autonomy-maximising posture (`R2.1r`) is aligned; extend it by letting a child bring a special-interest domain wholesale into character creation without the tool redirecting.
- **Internal state language is a difference, not a target.** `R2.3f` (never flag low interiority) protects autistic writers specifically. Prompting repeatedly for feelings is the single most likely way this product would harm autistic children.
- **Referential establishment** (introducing a character clearly) is the one place where support is well-motivated — and the right support is the **structural cast list** (`R2.2h`), not correction.
- **Do not disguise assessment as play.** If the product measures anything, be transparent that it does.

### 4.3.3 ADHD

**`A1-C112`** `[E1]` `[SNIPPET]` Jepsen et al. (2025), *The association between attention-deficit/hyperactivity disorder and narrative language: What is the role of executive function?*, **JCPP Advances**, doi 10.1002/jcv2.70007 (PubMed 41395334). **ADHD n = 46, neurotypical comparison n = 40, ages 7–11** (maps **B1–B2**). Children with ADHD produced narratives with **more ambiguous references, less overall coherency, and more morpho-syntactic errors**. Notably, **executive function did not mediate the association**, contrary to hypothesis.

**Implications:**
- Ambiguous reference is a **known correlate of ADHD**. An aggressive pronoun-ambiguity flag would systematically over-target these children. Hence the strict rate limit in `R2.1h` (one instance per draft, phrased as a reader question) and the exemption at B0.
- Because EF did not mediate, "reduce cognitive load and coherence will follow" is **not** supported for this group. Structural supports (cast list, visible goal) are still reasonable; do not promise they fix coherence.

### 4.3.4 Executive function and working memory generally

**`A1-C113`** `[E1]` `[SNIPPET]` Scionti, Zampini & Marzocchi (2023), *The Relationship between Narrative Skills and Executive Functions across Childhood: A Systematic Review and Meta-Analysis*, **Children, 10(8), 1391**, doi 10.3390/children10081391. **30 studies, 285 effect sizes.** Executive functions and narrative competence are **weakly associated (r = 0.236, p < 0.001)**, and **this association decreases with age (b(267) = −0.0144, p = 0.001)**. Skills are more associated in **preschool and early elementary**, becoming **more independent after seven years old**. Between ages 3 and 7 the association is **stronger in atypically developing children and for macrostructural narrative competence**.

**`A1-C114`** `[E1]` `[SNIPPET]` *The Relationship between Executive Functions and Language Production in 5–6-Year-Old Children: Insights from Working Memory and Storytelling*, **Behavioral Sciences, 10(2), 52** (MDPI). **269 children aged 5–6** (maps **B0**), assessed on visual and verbal working memory with story retelling and story creation tasks. Significant relationships between both WM components and global macrostructure indicators (semantic completeness, semantic adequacy, programming, narrative structure) and microstructure indicators (grammatical accuracy, number of syntagmas), **systematically stronger for verbal than visual working memory.**

**Implications:**
- The EF–narrative association is **weak (r ≈ 0.24) and weakens with age** (`A1-C113`). Do not build the product on an EF-support theory; the relationship does not carry that weight.
- Working memory matters most at **B0** and for **verbal** WM (`A1-C114`). Load-reduction features (cast list, visible goal, read-back, dictation) are best justified for the youngest band and for transcription (`A1-C70`), not as a general theory.

### 4.3.5 Cross-cutting accessibility features, ranked by evidential support

| Feature | Justification | Confidence |
|---|---|---|
| Dictation / voice capture | Transcription constrains composition; ~7.4% of quality variance from handwriting fluency alone (`A1-C70`, `A1-C69`) | High |
| Persistent visible cast list | Reintroduction is the hardest referential move (`A1-C55`); helps ADHD (`A1-C112`) and autistic (`A1-C111`) referential establishment | Moderate-high |
| No mechanics correction during composition | `A1-C69`, `A1-C70` | High |
| Text-to-speech read-back | `A1-C73` | Low-moderate |
| Home-language input accepted anywhere | `A1-C95`, `A1-C98` | Moderate |
| Sentence frames / starters (optional) | Reduction in degrees of freedom (`A1-C90`); graphic organizer evidence (`A1-C77`) | Moderate |
| Skippable everything | Autonomy → self-efficacy (`A1-C104`); neurodiversity-affirming practice (`A1-C115`) | Moderate |

## 4.4 Populations underrepresented in the evidence base

1. **Grades 6–9 (B3, B4).** The overwhelming majority of retrievable narrative-development research concerns ages 3–10. The single study spanning 7–14 (`A1-C38`, n=86) and the Common Core standards (`A1-C59`) are nearly the whole basis for B3–B4 in this document. **The oldest half of Character Studio's audience is the least evidenced.**
2. **Children inventing their own characters, at any age.** `A1-C52`. Nearly all narrative research uses **elicited retells or picture-prompted generation**, not free invention. Character Studio's core activity is the least studied one.
3. **Indigenous and Native American children.** Referenced only as a comparison in `A1-C81` and via an Australian Indigenous education methodology paper (`A1-C87`). No primary developmental data retrieved.
4. **Multilingual children beyond Spanish–English.** `A1-C96` and most bilingual work is Spanish–English. MAIN (`A1-C94`) is the corrective, and Global TALES (`A1-C85`) covers 10 countries / 8 languages with n=249 — small for its ambition.
5. **Rural and Appalachian children.** `A1-C14` is explicitly framed as filling this gap, which implies the gap.
6. **Children with co-occurring profiles** (e.g. autistic + emergent bilingual; DLD + ADHD). One retrieved title addresses bilingual autistic children vs. bilingual DLD vs. TD (**Applied Psycholinguistics**), but this intersection is thin.
7. **Deaf and hard-of-hearing children.** One retrieved title (*Story Generation and Narrative Retells in Children Who Are Hard of Hearing and Hearing Children*, **JSLHR**, doi 10.1044/2023_JSLHR-23-00084) and one on hearing-impaired children and SOFB syntax. Not enough to write rules from.
8. **Gender.** `A1-C116` below. The evidence is real but shallow and mostly about emotion talk.

**`A1-C116`** `[E1]` `[SNIPPET]` Retrieved gender findings: **girls talked more about emotional aspects of experiences than boys and used more emotion words, emotion explanations and emotion labels**; **adolescent females provided more elaborated and more emotional narratives than males**; **boys told more stories reflecting a threatening atmosphere while girls told more stories with emotional themes**; and in person description, **girls used more central/psychological statements than boys** (`A1-C48`). Parental socialisation is implicated: **mothers conversed more, talked more about emotional aspects, and used more emotion words than fathers**, and both parents used more emotional utterances discussing sad events with daughters than sons. Retrieved via Tenenbaum et al., **British Journal of Developmental Psychology** (doi 10.1348/2044-835X.002003); *Gender Differences in Parent–Child Emotion Narratives*, **Sex Roles** (doi 10.1023/A:1007091207068); *"I Was Really, Really, Really Mad!"*, **Sex Roles**.

**Product consequence (`R4.1`):** because emotion-talk differences are substantially **socialised** (`A1-C116`), a tool that prompts heavily for feelings will reward an already-advantaged pattern and may read boys' action-and-threat-oriented stories as less developed. **Character Studio must weight action, humour, danger and problem-solving prompts equally with feeling prompts** (`R2.5j`), and must never treat emotion-word density as a quality signal. *Confidence: moderate; this is a bias-mitigation inference, not a finding.*

## 4.5 Open questions

**Directly blocking better product decisions:**
1. **Do children's invented characters become rounder or more dynamic with age, and on what timeline?** No evidence found (`A1-C52`). Everything in `R2.1g` for B3–B4 is extrapolation from person-perception research.
2. **What are the actual narrative-length and microstructure norms by grade?** The INMIS (`A1-C63`) and grade-level lexical expectation tables (`A1-C64`) exist but were not retrievable (`A1-C68`).
3. **Does AI-delivered prompting reach the 0.38 computer-feedback effect, exceed it, or fall below it for creative character work?** `A1-C89` is about writing feedback generally, and predates LLM tools.
4. **Does over-prompting harm motivation or ownership in children?** Unrun search (`A1-C106`). This is the highest-priority follow-up.
5. **What is the right recognition:suggestion ratio, intervention cap, and hint-ladder pacing?** All are `DESIGN DECISION`s in §3.3–3.4 with no evidential basis. These should be the first A/B tests.

**Field-level:**
6. Does character-focused prewriting transfer to narrative quality, and does it transfer to reading comprehension (given `A1-C109`)?
7. Do multi-anecdote/topic-associating templates (`R2.2n`) actually get used, and do they change who succeeds in the tool?
8. Is "show don't tell" instruction harmful, neutral, or helpful before behavior→trait inference consolidates (`A1-C50`, `R2.3g`)?
9. How do children with DLD experience a character-first (rather than plot-first) scaffold, given macrostructure intervention effects up to d=1.57 (`A1-C110`)?
10. Does generated character imagery displace children's own mental imagery, as `A1-C99` suggests?

---
---

# PART 5 — SOURCE LIST

> **Retrieval standard for this list:** every entry below appeared in a `WebSearch` result set during this session (title, URL, and/or synthesised content). **None was retrieved as full text** — all 10 `WebFetch` attempts were blocked. Entries are grouped by role. Where I have a DOI or full citation, it appeared in returned metadata; where I do not, that is stated by its absence.

## 5.1 Foundational story-grammar and narrative-development theory

| Source | URL | Tier | Role |
|---|---|---|---|
| Stein & Glenn, *An Analysis of Story Comprehension in Elementary School Children: A Test of a Schema* (ERIC ED121474, 1975; later in *New Directions in Discourse Processing*) | https://eric.ed.gov/?id=ED121474 · https://www.semanticscholar.org/paper/An-Analysis-of-Story-Comprehension-in-Elementary-A-Stein-Glenn/926ec4530e6cde1eabd9f1c71f9f30880ab62bdc | E2 | `A1-C01` — origin of the setting+episode macrostructure used by NSS, MISL, INC |
| Mandler & Johnson (1977), *Remembrance of things parsed: Story structure and recall*, Cognitive Psychology 9, 111–151, doi 10.1016/0010-0285(77)90006-8 | https://www.sciencedirect.com/science/article/abs/pii/0010028577900068 · https://scholar.google.com/scholar_lookup?title=Remembrance+of+things+parsed... | E2 | `A1-C02` — developmental differences in story schemata |
| Applebee (1978), *The Child's Concept of Story: Ages Two to Seventeen* (ERIC ED155707) | https://eric.ed.gov/?id=ED155707 · https://archive.org/details/childsconceptofs0000appl_i5o9 | E2 | `A1-C03` — centring/chaining stage model (retrieved only via secondary descriptions) |
| Black & Wilensky (1979), *An Evaluation of Story Grammars*, Cognitive Science 3(3), doi 10.1207/s15516709cog0303_2 | https://onlinelibrary.wiley.com/doi/abs/10.1207/s15516709cog0303_2 | E2/E6 | `A1-C08` — the central critique of story grammar |
| Mandler & Johnson, *On throwing out the baby with the bathwater: A reply to Black and Wilensky* | https://www.sciencedirect.com/science/article/abs/pii/S0364021380800061 | E2 | `A1-C09` — rebuttal |
| *A Re-Evaluation of Story Grammars*, Cognitive Science (1981), doi 10.1111/j.1551-6708.1981.tb00868.x | https://onlinelibrary.wiley.com/doi/pdf/10.1111/j.1551-6708.1981.tb00868.x | E2 | `A1-C09` — rebuttal |
| Rumelhart, *On Evaluating Story Grammars* | https://www.semanticscholar.org/paper/On-Evaluating-Story-Grammars-Rumelhart/de5496ec63ed0cec52897098769e5a78e21b2f9d | E2 | `A1-C09` |
| Berman & Slobin (1994), *Relating Events in Narrative: A Crosslinguistic Developmental Study* | https://www.routledge.com/Relating-Events-in-Narrative-A-Crosslinguistic-Developmental-Study/Berman-Slobin/p/book/9781138984912 · https://searchworks.stanford.edu/view/2856911 | E1/E2 | `A1-C19` — frog-story crosslinguistic corpus, 5 languages |
| Trabasso & Nickels (1992), *The development of goals plans of action in the narration of picture stories*, Discourse Processes 15(3), doi 10.1080/01638539209544812 | https://scholar.google.com/scholar_lookup?author=Trabasso+T.+&journal=The+development+of+goals+plans+of+action... | E1 | `A1-C25` — hierarchical goal plans by age 9 |
| *Goals, inferential comprehension, and recall of stories by children*, Discourse Processes 1(4), doi 10.1080/01638537809544444 | https://www.tandfonline.com/doi/abs/10.1080/01638537809544444 | E1 | `A1-C27` — goal specification improves comprehension |
| Trabasso & Wiley, *Goal Plans of Action and Inferences During Comprehension of Narratives* | https://www.semanticscholar.org/paper/Goal-Plans-of-Action-and-Inferences-During-of-Trabasso-Wiley/1d23db5735bc5b63fda3ec29281eab295ede09db | E2 | `A1-C26` — goal failure/reinstatement in the causal network model |
| Bamberg & Damrad-Frye (1991), *On the ability to provide evaluative comments*, J. Child Language (PubMed 1761620) | https://www.cambridge.org/core/journals/journal-of-child-language/article/abs/on-the-ability-to-provide-evaluative-comments-further-explorations-of-childrens-narrative-competencies/C5BBB133CB3648CFE0686A481A7EED4A | E1 | `A1-C07`, `A1-C57` — five evaluative devices, ages 5/9/adult |
| Scardamalia & Bereiter (1987), *Knowledge Telling and Knowledge Transforming in Written Composition* | https://www.scirp.org/reference/referencespapers?referenceid=3132940 | E2 | `A1-C74` — knowledge-telling default in novice writers |
| *Kinds of knowledge-telling: Modeling early writing development*, J. Writing Research | https://www.jowr.org/jowr/article/view/723 | E1 | `A1-C75` — three knowledge-telling strategies, grades 1–9 |
| Wood, Bruner & Ross (1976), *The role of tutoring in problem solving*, JCPP 17, 89–100 | https://sachafund.wordpress.com/wp-content/uploads/2018/10/wood_et_al-1976-journal_of_child_psychology_and_psychiatry.pdf · https://www.scirp.org/reference/referencespapers?referenceid=1412344 | E2/E4 | `A1-C90` — six scaffolding functions; graduated assistance |
| *Scaffolding research: Taking stock at the four-decade mark* | https://www.sciencedirect.com/science/article/abs/pii/S0883035518306219 | E2 | `A1-C90` — intersubjectivity, contingency, release of responsibility |

## 5.2 Modern empirical narrative development

| Source | URL | Tier | Role |
|---|---|---|---|
| Khan, Gugiu, Justice, Bowles, Skibbe & Piasta (2016), *Age-Related Progressions in Story Structure in Young Children's Narratives*, JSLHR, doi 10.1044/2016_JSLHR-L-15-0275 | https://pubs.asha.org/doi/abs/10.1044/2016_JSLHR-L-15-0275 · https://pubmed.ncbi.nlm.nih.gov/27930767/ | E1 | `A1-C13` — n=386, ages 3–6, component-level progressions |
| *Early development of narrative macrostructure in kindergarten through second grade in Appalachian schools*, Frontiers in Education | https://www.frontiersin.org/journals/education/articles/10.3389/feduc.2026.1848759/full | E1 | `A1-C14` — n=435; **child-level variance dominates** |
| Sah, *The Development of Coherence in Narratives: Causal Relations* | https://aclanthology.org/Y13-1015.pdf | E1 | `A1-C21` — 6-year-olds static/temporal vs 8-year-olds causal + thoughts/feelings |
| *A profile of causal development amongst ten-year-olds*, Reading and Writing, doi 10.1007/BF00404001 | https://link.springer.com/article/10.1007/BF00404001 | E1 | `A1-C20` |
| *Comprehension of Connectives: Development Across Primary School Age*, Frontiers in Psychology | https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2020.00814/full | E1 | `A1-C15`, `A1-C16` |
| *Context and strategy in acquiring temporal connectives*, J. Psycholinguistic Research, doi 10.1007/BF01072000 | https://link.springer.com/article/10.1007/BF01072000 | E1 | `A1-C16`, `A1-C17` |
| *Young Children's Comprehension of Temporal Relations in Complex Sentences*, Child Development 86(6), 1922 | https://academic.oup.com/chidev/article/86/6/1922/8264148 | E1 | `A1-C18` |
| Ukrainetz et al., *The Development of Expressive Elaboration in Fictional Narratives* | https://www.researchgate.net/publication/7299403_The_Development_of_Expressive_Elaboration_in_Fictional_Narratives · https://www.academia.edu/18013545 | E1 | `A1-C61` — **n=293, ages 5–12; appendages/orientations/evaluations** |
| Longobardi, Spataro, Renna & Rossi-Arnaud (2014), *Comparing fictional, personal, and hypothetical narratives in primary school*, EJPE, doi 10.1007/s10212-013-0197-y (ERIC EJ1036501) | https://link.springer.com/article/10.1007/s10212-013-0197-y | E1 | `A1-C45` — n=150 grades 3–5; **fiction structurally stronger than personal** |
| *Narrative skills and genre knowledge: Ways of telling in the primary school grades*, Applied Psycholinguistics | https://www.cambridge.org/core/journals/applied-psycholinguistics/article/abs/narrative-skills-and-genre-knowledge-ways-of-telling-in-the-primary-school-grades/0B3CC7DF89C69ACEA9B450DAC34D6ACB | E1 | `A1-C107` — nascent genre differentiation K–2 |
| *Narrative coherence and mentalizing complexity are associated in fictive storytelling and autobiographical memories*, Cognitive Development (2024) | https://www.sciencedirect.com/science/article/pii/S0885201424000698 · https://researchprofiles.ku.dk/en/publications/narrative-coherence-and-mentalizing-complexity-are-associated-in- | E1 | `A1-C38` — n=86, ages 7–14, **cross-genre generalisation** |
| *The influence of story character realism and theme on protagonists' internal states and dialogue in children's retells*, Cognitive Development (2024) | https://www.sciencedirect.com/science/article/pii/S0885201424000431 · https://eprints.lancs.ac.uk/id/eprint/220368/11/Internal_States_and_Dialogue_May_2024.pdf | E1 | `A1-C46`, `A1-C58` |
| *Children's Narrative Retells: The Influence of Character Realism and Storybook Theme on Central and Peripheral Detail*, doi 10.1080/10409289.2024.2303908 | https://www.tandfonline.com/doi/full/10.1080/10409289.2024.2303908 | E1 | `A1-C46` context |
| *Age and task type effects on comprehension and production of narrative macrostructure… Swedish-speaking children aged 6 and 8*, Frontiers in Communication | https://www.frontiersin.org/journals/communication/articles/10.3389/fcomm.2023.1252260/full | E1 | `A1-C92` |
| *Children's Narrative Elaboration After Reading a Storybook Versus Viewing a Video*, Frontiers in Psychology | https://frontiersin.org/articles/10.3389/fpsyg.2020.569891/full | E1 | `A1-C06` — high-point/evaluation context |
| *Personal Narratives*, Topics in Language Disorders 28(2), 162–177 | https://downloads.lww.com/wolterskluwer_vitalstream_com/journal_library/tld_02718294_2008_28_2_162.pdf | E4 | `A1-C06` — high-point analysis description |
| CHILDES Peterson/McCabe corpus | https://talkbank.org/childes/access/Eng-NA/PetersonMcCabe.html | E1 | `A1-C06` — corpus existence |
| *The development of narrative skills in Turkish-speaking children: A complexity approach*, PLOS ONE | https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0232579 | E1 | crosslinguistic context |

## 5.3 Cohesion, reference, and microstructure

| Source | URL | Tier | Role |
|---|---|---|---|
| *Referential cohesion in Swedish preschool children's narratives* | https://www.sciencedirect.com/science/article/abs/pii/S0378216616301497 | E1 | `A1-C55` |
| *Keeping Track of Characters: Factors Affecting Referential Adequacy in Children's Narratives*, First Language (2014), ERIC EJ1078697 | https://eric.ed.gov/?id=EJ1078697 | E1 | `A1-C55` |
| King, *Exploring Ambiguity Within Children's Narratives* (U. Alberta) | https://ualberta.scholaris.ca/bitstreams/ec570d1e-7908-438e-ae1a-a4be80be68fb/download | E1 | `A1-C56` — pronoun overuse |
| *Character reference in young children's narratives: English, Greek, and Turkish* | https://www.academia.edu/81474731/Character_reference_in_young_childrens_narratives_A_crosslinguistic_comparison_of_English_Greek_and_Turkish | E1 | `A1-C55` |
| *Referential Cohesion in the Narratives of Bilingual and Monolingual Children…*, JSLHR, doi 10.1044/2018_JSLHR-L-18-0054 | https://pubs.asha.org/doi/10.1044/2018_JSLHR-L-18-0054 | E1 | `A1-C55` |
| Justice, Bowles et al. (2006), *The Index of Narrative Microstructure*, AJSLP, doi 10.1044/1058-0360(2006/017) | https://pubs.asha.org/doi/10.1044/1058-0360(2006/017) | E1/E5 | `A1-C63` — n=250, ages 5–12; **norms not retrievable** |
| *The utility of school-age narrative microstructure indices: INMIS and the proportion of restricted utterances* (PubMed 19498016) | https://pubmed.ncbi.nlm.nih.gov/19498016/ | E1 | `A1-C63` |
| *Grade Level Expectations in Lexical Measures and Accuracy of Written Narrative Samples* (PMC6818509) | https://pmc.ncbi.nlm.nih.gov/articles/PMC6818509/ | E1 | `A1-C64` — grades 1–8; **tables not retrievable** |
| Nippold, Mansfield, Billow & Tomblin (2008), *Expository Discourse in Adolescents With Language Impairments*, AJSLP, doi 10.1044/1058-0360(2008/07-0049) | https://pubs.asha.org/doi/10.1044/1058-0360(2008/07-0049) | E1 | `A1-C65` — genre > age for syntactic complexity |
| *Sharing Stories Versus Explaining Facts…*, JSLHR, doi 10.1044/2024_JSLHR-23-00579 | https://pubs.asha.org/doi/10.1044/2024_JSLHR-23-00579 | E1 | `A1-C66` — fiction elicits longest, most diverse language |
| *A corpus-based developmental investigation of linguistic complexity in children's writing* | https://www.sciencedirect.com/science/article/pii/S2666799124000017 | E1 | `A1-C68` context |

## 5.4 Character, traits, person perception, theory of mind

| Source | URL | Tier | Role |
|---|---|---|---|
| Livesley & Bromley (1973), *Person Perception in Childhood and Adolescence* (ERIC ED087571) | https://nsuworks.nova.edu/cgi/viewcontent.cgi?article=1152&context=edp · https://eric.ed.gov/?id=ED087571 | E1 | `A1-C48`, `A1-C49` — **external → internal descriptors, ages 7–10** |
| *The development of bases for trait attribution: children's understanding of traits as causal mechanisms based on desire* (PubMed 9597366) | https://pubmed.ncbi.nlm.nih.gov/9597366/ | E1 | `A1-C50` |
| *Components of young children's trait understanding: behavior-to-trait inferences and trait-to-behavior predictions* (PubMed 17883447) | https://pubmed.ncbi.nlm.nih.gov/17883447/ | E1 | `A1-C50` — **basis for `R2.3g` (no "show don't tell" before B2)** |
| *Children's Trait Inference and Partner Choice in a Cooperative Game*, Child Development, doi 10.1111/cdev.14247 | https://doi.org/10.1111/cdev.14247 | E1 | `A1-C50` |
| *Traits or circumstances? Children's explanations of positive and negative behavioral outcomes* | https://www.sciencedirect.com/science/article/abs/pii/S0885201421000149 | E1 | `A1-C50` — positivity asymmetry |
| *Children's and adults' beliefs about the stability of traits from infancy to adulthood* | https://www.sciencedirect.com/science/article/abs/pii/S0885201420301295 | E1 | `A1-C50` |
| *Desires and beliefs: the development of second-order Theory of Mind reasoning*, Frontiers in Psychology | https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2025.1525368/full | E1 | `A1-C35` |
| *Young children's understanding of second-order mental states*, Psychologia (J-STAGE) | https://www.jstage.jst.go.jp/article/psysoc/50/1/50_1_15/_pdf | E1 | `A1-C35` |
| *Syntactic Recursion Facilitates and Working Memory Predicts Recursive Theory of Mind*, PLOS ONE, doi 10.1371/journal.pone.0169510 | https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0169510 | E1 | `A1-C36` |
| *Expressive syntax matters for second-order false belief*, Frontiers in Communication | https://www.frontiersin.org/journals/communication/articles/10.3389/fcomm.2024.1401576/full | E1 | `A1-C35`, `A1-C36` |
| *Developmental differences in reported speech and internal state language in preschoolers' personal narratives*, J. Child Language | https://www.cambridge.org/core/journals/journal-of-child-language/article/abs/developmental-differences-in-reported-speech-and-internal-state-language-in-preschoolers-personal-narratives/6F84C4B87ECA3492E59C25E50F4E9EF5 | E1 | `A1-C41` |
| *The influence of narrative competence on mental state talk in kindergarten and primary school children* (PubMed 31271230) | https://pubmed.ncbi.nlm.nih.gov/31271230/ | E1 | `A1-C42` — **coordinating mental state talk with structure is the developing skill** |
| Uziel, Oriikiriza, Tselekidou & Gagarina (2025), *…Internal State Terms Production in Luganda-Speaking Children's Narratives*, doi 10.1177/01427237251364965 | https://journals.sagepub.com/doi/10.1177/01427237251364965 | E1 | `A1-C44` — cultural variation in IST |
| *Internal State Terms in the Narratives of Bilingual Children With DLD*, LSHSS, doi 10.1044/2024_LSHSS-23-00170 | https://pubs.asha.org/doi/10.1044/2024_LSHSS-23-00170 | E1 | `A1-C97` |
| Craft/teaching sources on flat/round/static/dynamic (MasterClass, Scribophile, Now Novel, Jenna Moreci, Essentials in Writing) | https://www.masterclass.com/articles/round-vs-flat-characters-in-fiction · https://www.scribophile.com/academy/what-is-a-dynamic-character · https://nownovel.com/static-dynamic-characters/ | E4 | `A1-C47` — **craft consensus only; explicitly notes flat characters work in children's fiction** |

## 5.5 Assessment instruments (design references, not evidence)

| Source | URL | Tier | Role |
|---|---|---|---|
| SALT Narrative Scoring Scheme scoring guide + course materials | https://www.saltsoftware.com/media/wysiwyg/codeaids/NSS_Scoring_Guide.pdf · https://www.saltsoftware.com/coursefiles/1502/NSS_Scoring_Guide.pdf · https://www.saltsoftware.com/training/self-paced-online-training/1502 · https://www.pattan.net/getmedia/bd928581-1383-4968-980e-4ddcb3975d70/NSS%20Scoring%20Guide | E5 | `A1-C32`, `A1-C51` — **7 categories incl. Character Development and Mental States; 0–5 scale** |
| *Properties of the Narrative Scoring Scheme Using Narrative Retells in Young School-Age Children*, AJSLP, doi 10.1044/1058-0360(2009/08-0024) | https://pubs.asha.org/doi/10.1044/1058-0360(2009/08-0024) | E1 | `A1-C32` |
| Gillam, Gillam, Fargo, Olszewski & Segura (2017), *Monitoring Indicators of Scholarly Language*, Comm. Disorders Quarterly 38(2), doi 10.1177/1525740116651442 | https://journals.sagepub.com/doi/10.1177/1525740116651442 · https://cehs.usu.edu/csf/israelsen-augensteinmisl-2022.pdf · https://www.pattan.net/getmedia/9a9652f3-5cae-489d-9e73-22f4c60086d1/misl%20supplemental%20mtrls | E5/E1 | `A1-C33` — **7 macrostructure elements; 0–3 absent/emerging/present/elaborated; relational not count-based** |
| *Monitoring indicators of scholarly language: A progress monitoring tool…*, Frontiers in Education (2022) | https://www.frontiersin.org/journals/education/articles/10.3389/feduc.2022.918127/full | E1 | `A1-C33` |
| Petersen, Gillam & Gillam (2008), *Emerging Procedures in Narrative Assessment: The Index of Narrative Complexity*, Topics in Language Disorders 28, 115–130 | https://digitalcommons.usu.edu/comd_facpub/5 · https://www.semanticscholar.org/paper/a2b7ba8398491c5f851c531a2712075328acbaf6 | E5/E1 | `A1-C34`, `A1-C92` — similar scores across 5 elicitation formats |
| Test of Narrative Language–2 (Gillam & Pearson, PRO-ED) | https://www.proedinc.com/Products/14560/tnl2-test-of-narrative-languagesecond-edition.aspx · https://www.parinc.com/products/TNL-2 | E5 | `A1-C108` — ages 4;0–15;11; script/personal/fictional |
| MAIN — Multilingual Assessment Instrument for Narratives | https://main.leibniz-zas.de/ · https://www.researchgate.net/publication/348461736_MAIN_Multilingual_Assessment_Instrument_for_Narratives_-_Revised | E5/E1 | `A1-C94` |
| Narrative SSS elicitation protocol (WVU) | https://medicine.hsc.wvu.edu/media/369510/narssselicprotocol.pdf | E4 | `A1-C93` — elicitation practice |

## 5.6 Intervention, instruction, feedback, and writing process

| Source | URL | Tier | Role |
|---|---|---|---|
| Pico et al. (2021), *Interventions Designed to Improve Narrative Language in School-Age Children: A Systematic Review With Meta-Analyses*, LSHSS, doi 10.1044/2021_LSHSS-20-00160 | https://pubs.asha.org/doi/10.1044/2021_LSHSS-20-00160 · https://elycenter.com/wp-content/uploads/2023/09/2021_LSHSS-20-00160.pdf · https://asha.figshare.com/articles/journal_contribution/15079173 | E1 | `A1-C88` — **26 studies; d=0.51/0.54 group, 1.24 SCD; five common ingredients** |
| Graham, Hebert & Harris (2015), *Formative Assessment and Writing: A Meta-Analysis*, Elementary School Journal 115(4), doi 10.1086/681947 | https://www.journals.uchicago.edu/doi/10.1086/681947 | E1 | `A1-C89` — **adult 0.87 / peer 0.58 / self 0.62 / computer 0.38** |
| *A Meta-Analysis of Writing Instruction for Students in the Elementary Grades* (Graham et al.) | https://www.researchgate.net/publication/260021418 · https://www.academia.edu/96478546 | E1 | `A1-C78` — SRSD ES 1.17 |
| SRSD research portal; *Long-term effects of an SRSD writing intervention*, Reading and Writing, doi 10.1007/s11145-025-10721-0; *Effectiveness of SRSD on improving English writing*, doi 10.1007/s11145-022-10297-z | https://srsdonline.org/research/ · https://link.springer.com/article/10.1007/s11145-025-10721-0 · https://link.springer.com/article/10.1007/s11145-022-10297-z · https://ies.ed.gov/learn/blog/improving-academic-achievement-through-instruction-self-regulated-strategy-development-science | E1 | `A1-C78` |
| *Automated feedback and writing: a multi-level meta-analysis* (PMC10351274) | https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10351274/ | E1 | `A1-C89` context |
| Torkildsen et al. (2015), *The dynamics of narrative writing in primary grade children*, Reading and Writing, doi 10.1007/s11145-015-9618-4 | https://link.springer.com/article/10.1007/s11145-015-9618-4 · https://pmc.ncbi.nlm.nih.gov/articles/PMC4761367/ | E1 | `A1-C69` — **keystroke logging; local but not global revision in grade 3** |
| Skar, Graham, Lei, Aasen, Byberg Johansen & Kvistad, *Handwriting fluency and the quality of primary grade students' writing*, doi 10.1007/s11145-021-10185-y | https://link.springer.com/article/10.1007/s11145-021-10185-y | E1 | `A1-C70` — **7.4% of quality variance** |
| *How to make it easier for children to revise their writing: text revision from 3rd to 5th grades* | https://www.academia.edu/53935031 | E1 | `A1-C76` — surface → meaning revision shift |
| *The effects of a graphic organizer with storytelling intervention…third graders with German as a second language*, EJPE, doi 10.1007/s10212-024-00908-4 | https://link.springer.com/article/10.1007/s10212-024-00908-4 | E1 | `A1-C77` |
| *The impact of story grammar instruction and text difficulty on students' skill in summarizing narratives*, Written Language & Literacy, doi 10.1075/wll.00032.hel | https://benjamins.com/catalog/wll.00032.hel | E1 | `A1-C91` |
| *Teaching story grammar components to increase oral narrative ability: A group intervention study*, Child Language Teaching and Therapy (ERIC EJ984144) | https://eric.ed.gov/?id=EJ984144 | E1 | `A1-C91` |
| Bangert-Drowns (1993), *The Word Processor as an Instructional Tool: A Meta-Analysis*, RER, doi 10.3102/00346543063001069 | https://journals.sagepub.com/doi/10.3102/00346543063001069 | E1 | `A1-C72` — ES 0.27 quality / 0.52 quantity |
| *Writing by hand or digitally in first grade: Effects on rate of learning to compose text* | https://www.sciencedirect.com/science/article/pii/S0360131523000325 | E1 | `A1-C73` |
| *The effect of digital storytelling in improving the third graders' writing skills*, IEJEE | https://www.iejee.com/index.php/IEJEE/article/view/145 | E1 | `A1-C73` |
| *Enhancing children's narratives in investigative interviews* (PubMed 11197041) | https://pubmed.ncbi.nlm.nih.gov/11197041/ | E1 | `A1-C93` — open-ended prompts, continuers |
| *Young children's narrative retell in response to static and animated stories*, IJLCD, doi 10.1111/1460-6984.12523 | https://onlinelibrary.wiley.com/doi/10.1111/1460-6984.12523 | E1 | `A1-C93` |
| *The ABCs of writing motivation: a systematic review of K–5 students' self-reports*, Frontiers in Education | https://www.frontiersin.org/journals/education/articles/10.3389/feduc.2024.1396484/full | E1 | `A1-C104` |
| *The association between writing motivation and performance among primary school students*, Humanities & Social Sciences Communications, doi 10.1038/s41599-024-04298-2 | https://www.nature.com/articles/s41599-024-04298-2 | E1 | `A1-C104` |

## 5.7 Culture, language, and equity

| Source | URL | Tier | Role |
|---|---|---|---|
| Michaels, *"Sharing time": Children's narrative styles and differential access to literacy*, Language in Society | https://www.cambridge.org/core/journals/language-in-society/article/abs/sharing-time-childrens-narrative-styles-and-differential-access-to-literacy/EC5767FEA4D0837BA2CF0C0E89FAA39C | E1 | `A1-C79` — **topic-associating vs topic-centered; teacher preference effects** |
| Hyon & Sulzby, *African American Kindergartners' Spoken Narratives*, Linguistics and Education (1994), ERIC EJ497723 | https://eric.ed.gov/?id=EJ497723 · https://deepblue.lib.umich.edu/items/c5f55c96-737a-4efa-a105-19fdc07f50ab | E1 | `A1-C80` — replication picture |
| Champion, *"Tell me somethin' good": A description of narrative structures among African American children* | https://www.academia.edu/9900178 | E1 | `A1-C81` |
| *Story Structure in a Sample of African-American Children: Evidence for a Cyclical Story Schema* (ERIC ED410578) | https://eric.ed.gov/?id=ED410578 | E1 | `A1-C81` — alternative schema |
| Minami & McCabe, *Haiku as a discourse regulation device*, Language in Society | https://www.cambridge.org/core/services/aop-cambridge-core/content/view/DC99C0965E72C69AE6C5CAE63BF2CE45/S0047404500016730a.pdf | E1 | `A1-C82` — **17 Japanese children 5–9; 59% three-verse stanzas** |
| Heath (1983), *Ways with Words* (Cambridge University Press) | https://www.cambridge.org/core/books/ways-with-words/A0A2D9156830DDD1823EA4FC5E3226A1 | E1/E2 | `A1-C83` — **Roadville true accounts vs Trackton fictionalization** |
| McCabe (ed.), *Spanish-Language Narration and Literacy: Culture, Cognition and Emotion* (Cambridge) | https://www.cambridge.org/core/books/abs/spanishlanguage-narration-and-literacy/beyond-chronicity-evaluation-and-temporality-in-spanishspeaking-childrens-personal-narratives/B3537C3E41585131782CCA334D05A71F | E1/E2 | `A1-C84` |
| Westerveld et al. (2022), *Global TALES feasibility study*, PLOS ONE, doi 10.1371/journal.pone.0273114 | https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0273114 · https://pubmed.ncbi.nlm.nih.gov/35969581/ | E1 | `A1-C85` — 249 children, 10 countries, 8 languages |
| *Structural and dialectal characteristics of the fictional and personal narratives of school-age African American children* (PubMed 23633645; PMC3988833) | https://pubmed.ncbi.nlm.nih.gov/23633645/ | E1 | `A1-C86` — **43 children grades 2–5; no grade differences** |
| *Perceptions of Black Children's Narrative Language: A Mixed-Methods Study*, LSHSS, doi 10.1044/2020_LSHSS-20-00014 | https://pubs.asha.org/doi/10.1044/2020_LSHSS-20-00014 | E1 | §4.2 context |
| *Bilingual Children Demonstrate Variation Within Shared Narrative Macrostructure* (PMC11567087) | https://pmc.ncbi.nlm.nih.gov/articles/PMC11567087/ | E1 | `A1-C95` |
| *English Narrative Macrostructure Development of Spanish–English Bilingual Children From Preschool to First Grade* (PubMed 33999697; PMC8702841) | https://pubmed.ncbi.nlm.nih.gov/33999697/ | E1 | `A1-C96` |
| *Language Proficiency and Narrative Macrostructure in Spanish–English Bilingual Children*, AJSLP, doi 10.1044/2025_AJSLP-25-00142 | https://pubs.asha.org/doi/10.1044/2025_AJSLP-25-00142 | E1 | `A1-C96` |
| *Are Narrative Macrostructure Skills Shared in Bilingual Children's Two Languages…*, LSHSS, doi 10.1044/2025_LSHSS-25-00049 | https://pubs.asha.org/doi/10.1044/2025_LSHSS-25-00049 | E1 | `A1-C95` |
| *Storytelling in a Bilingual Classroom Through the Lens of Epistemic Diversity and Translanguaging*, IJAL, doi 10.1111/ijal.12714 | https://onlinelibrary.wiley.com/doi/10.1111/ijal.12714 | E4 | `A1-C98` |
| Iowa Reading Research Center, *Embracing Translanguaging in the Classroom with Bilingual Texts* | https://irrc.education.uiowa.edu/blog/2023/02/embracing-translanguaging-classroom-bilingual-texts | E4 | `A1-C98` |
| *Imagining the possibilities of a cross-cultural oral narrative portraiture method*, Australian Journal of Indigenous Education | https://ajie.atsis.uq.edu.au/ajie/article/view/282 | E6 | `A1-C87` |
| *Cross-Cultural Narratology: A Comparative Study of Storytelling Techniques in Eastern and Western Literature* | https://www.researchgate.net/publication/378403246 | E6 | `A1-C87`, `A1-C12` |
| OhioLINK ETD, descriptive analysis of storytelling elements and cultural variation | https://etd.ohiolink.edu/acprod/odb_etd/ws/send_file/send?accession=miami1763142029616744&disposition=inline | E6 | `A1-C12` |
| Tenenbaum et al., *Telling stories: Gender differences in peers' emotion talk and communication style*, BJDP, doi 10.1348/2044-835X.002003 | https://bpspsychub.onlinelibrary.wiley.com/doi/10.1348/2044-835X.002003 | E1 | `A1-C116` |
| *Gender Differences in Parent–Child Emotion Narratives*, Sex Roles, doi 10.1023/A:1007091207068 | https://link.springer.com/article/10.1023/A:1007091207068 | E1 | `A1-C116` |
| *"I Was Really, Really, Really Mad!" Children's Use of Evaluative Devices in Narratives About Emotional Events*, Sex Roles | https://link.springer.com/article/10.1023/A:1015692403932 | E1 | `A1-C116` |

## 5.8 Neurodivergence, DLD, and clinical populations

| Source | URL | Tier | Role |
|---|---|---|---|
| *Investigating Narrative Performance in Children With Developmental Language Disorder: A Systematic Review and Meta-Analysis*, JSLHR, doi 10.1044/2022_JSLHR-22-00017 | https://pubs.asha.org/doi/abs/10.1044/2022_JSLHR-22-00017 | E1 | `A1-C110` — **37 studies, 382 ES, −0.82 SD** |
| *Narrative skills of children with developmental language disorder: retelling in macrostructure*, Frontiers in Education | https://www.frontiersin.org/journals/education/articles/10.3389/feduc.2025.1626433/full | E1 | `A1-C11`, `A1-C110` |
| *Why do children with language impairment have difficulties with narrative macrostructure?* | https://www.sciencedirect.com/science/article/abs/pii/S0891422216300853 | E1 | `A1-C11` |
| *Narratives of children with high-functioning autism spectrum disorder: A meta-analysis* | https://www.sciencedirect.com/science/article/abs/pii/S0891422216302049 | E1 | `A1-C111` — 24 studies |
| *Analysis of Noun Phrase Ambiguity in Narratives… Older Autistic Children*, JSLHR, doi 10.1044/2023_JSLHR-22-00630 | https://pubs.asha.org/doi/10.1044/2023_JSLHR-22-00630 | E1 | `A1-C56`, `A1-C111` |
| *Narrative language in autistic and control children: Differences between story retelling and story generation…* | https://www.sciencedirect.com/science/article/pii/S002199242500098X | E1 | `A1-C111` |
| Jepsen et al. (2025), *The association between ADHD and narrative language: What is the role of executive function?*, JCPP Advances, doi 10.1002/jcv2.70007 | https://acamh.onlinelibrary.wiley.com/doi/full/10.1002/jcv2.70007 · https://pubmed.ncbi.nlm.nih.gov/41395334/ | E1 | `A1-C112` — **n=46+40, ages 7–11; EF did not mediate** |
| Scionti, Zampini & Marzocchi (2023), *The Relationship between Narrative Skills and Executive Functions across Childhood*, Children 10(8), 1391, doi 10.3390/children10081391 | https://pubmed.ncbi.nlm.nih.gov/37628390/ · https://pmc.ncbi.nlm.nih.gov/articles/PMC10453360/ | E1 | `A1-C113` — **30 studies, 285 ES, r=0.236, decreasing with age** |
| *The Relationship between Executive Functions and Language Production in 5–6-Year-Old Children*, Behavioral Sciences 10(2), 52 | https://www.mdpi.com/2076-328X/10/2/52 | E1 | `A1-C114` — n=269 |
| *Promoting Neurodiversity-Affirming Care for Autistic Children: A Scoping Review*, doi 10.1177/27546330251357479 | https://journals.sagepub.com/doi/10.1177/27546330251357479 | E4 | `A1-C115` |
| *A Primer on Neurodiversity-Affirming Speech and Language Services for Autistic Individuals*, ASHA Perspectives, doi 10.1044/2023_PERSP-23-00106 | https://pubs.asha.org/doi/10.1044/2023_PERSP-23-00106 | E4 | `A1-C115` |
| *Story Generation and Narrative Retells in Children Who Are Hard of Hearing and Hearing Children*, JSLHR, doi 10.1044/2023_JSLHR-23-00084 | https://pubs.asha.org/doi/10.1044/2023_JSLHR-23-00084 | E1 | §4.4 |
| *Narrative macrostructure and microstructure profiles of bilingual children with ASD…*, Applied Psycholinguistics | https://www.cambridge.org/core/journals/applied-psycholinguistics/article/70ED0AA930A6BC5B8F87CA058BCA9FAF | E1 | §4.4 |
| *Linguistic comprehension and narrative skills predict reading ability: A 9-year longitudinal study*, BJEP, doi 10.1111/bjep.12353 | https://bpspsychub.onlinelibrary.wiley.com/doi/10.1111/bjep.12353 | E1 | `A1-C109` |
| *From infancy to adolescence: longitudinal links between vocabulary, early literacy, oral narrative, and reading comprehension* | https://www.sciencedirect.com/science/article/abs/pii/S088520141730237X | E1 | `A1-C109` |

## 5.9 AI-assisted storytelling with children

| Source | URL | Tier | Role |
|---|---|---|---|
| *StoryPrompt: Exploring the Design Space of an AI-Empowered Creative Storytelling System for Elementary Children*, CHI EA 2024, doi 10.1145/3613905.3651118 | https://dl.acm.org/doi/10.1145/3613905.3651118 | E6 | `A1-C99` — **words prompt thinking; images constrain it** |
| *From Words to Wonder: Designing and Evaluating an AI-Empowered Creative Storytelling System for Elementary Children*, CHI 2025, doi 10.1145/3706598.3713478 | https://dl.acm.org/doi/10.1145/3706598.3713478 | E6 | `A1-C99` |
| *Mathemyths: Leveraging LLMs to Teach Mathematical Language through Child-AI Co-Creative Storytelling* (arXiv 2402.01927) | https://arxiv.org/pdf/2402.01927 | E6 | `A1-C100` — **higher uncertainty answering AI questions vs human** |
| *Empowering Children's AI Literacy Through Co-Creating Stories with LLM*, IDC 2025, doi 10.1145/3713043.3731520 | https://dl.acm.org/doi/10.1145/3713043.3731520 | E6 | `A1-C101` — companion/collaborator/automator; overreliance fears |
| *AI-generated stories favour stability over change: homogeneity and cultural stereotyping in narratives generated by gpt-4o-mini* (arXiv 2507.22445) | https://arxiv.org/pdf/2507.22445 | E6 | `A1-C103` |

## 5.10 Professional/clinical practice materials (used only as `[E4]`)

| Source | URL | Role |
|---|---|---|
| Super Duper Handy Handouts #350, *Narrative Stages* | https://www.handyhandouts.com/Handout/350/narrative-stages | `A1-C04`, `A1-C05` |
| *Applebee's Narrative Stages* (parent center handout) | https://dvconnectresources.org/dvia-docs/parent_center/work_archives/2019-20/PEC1-Narrative%20DevelopmentByMegan.pdf | `A1-C04` |
| *Supporting the Narrative Development of Young Children* | http://curriculum640essaywriting.weebly.com/uploads/2/3/9/5/23952407/supporting_the_narrative_development_of_young_children.pdf | `A1-C05` |
| Elleseff, *Clinical Assessment of Narratives* (LAVI Institute) | https://www.laviinstitute.com/wp-content/uploads/2020/12/Clinical-Assessments-of-Narratives-in-Speech-Language-Pathology.pdf | `A1-C30` |
| Speechy Musings, narratives topic hub | https://speechymusings.com/topic/narratives/ | `A1-C30` |
| *Narrative Intervention: Principles to Practice*, LSHSS, doi 10.1044/2020_LSHSS-20-00015 | https://pubs.asha.org/doi/10.1044/2020_LSHSS-20-00015 | `A1-C88` context |
| ConductScience, *Narrative Assessment for School-Age SLPs* | https://conductscience.com/speech-therapy/narrative-assessment-school-age-slps | `A1-C11` |
| *Value of Children's Literature and Students' Opinions* (ERIC EJ1308657) | https://files.eric.ed.gov/fulltext/EJ1308657.pdf | `A1-C62` |

## 5.11 Educational standards

| Source | URL | Tier | Role |
|---|---|---|---|
| Common Core State Standards, ELA-Literacy Writing, Grade 5 | https://www.thecorestandards.org/ELA-Literacy/W/5/ · https://www.thecorestandards.org/ELA-Literacy/W/5/3/b/ | E3 | `A1-C59` |
| Common Core State Standards, ELA-Literacy Writing, Grades 11–12 | https://www.thecorestandards.org/ELA-Literacy/W/11-12/ | E3 | `A1-C59` |
| CCSS.ELA-Literacy.W.8.3b (Smithsonian Learning Lab standards page) | https://learninglab.si.edu/standards/CCSS.ELA-Literacy.W.8.3b/1213 | E3 | `A1-C59` — grade 8 adds reflection |

---

## Appendix — Claims explicitly marked `[UNVERIFIED]`

| Claim | What could not be confirmed | What I searched for |
|---|---|---|
| `A1-C40` | Any meta-analysis quantifying theory-of-mind → **narrative production** | "theory of mind narrative production children meta-analysis relation storytelling perspective taking" |
| `A1-C51` | The complete NSS Character Development proficient/emerging/minimal descriptors | "SALT Narrative Scoring Scheme character development proficient emerging minimal scoring criteria main characters secondary" |
| `A1-C52` | **Any** empirical study of roundness/dynamism in characters children invent | 3 separate searches (see claim text) |
| `A1-C59` (partial) | Exact CCSS W.3 wording for **grade 2** and **grade 6** | "Common Core State Standards writing narrative W.3 grade 2 3 4 5 6 7 8…" |
| `A1-C60` | Frequency-by-grade norms for dialogue in children's own writing | "dialogue direct speech in children's written narratives development frequency grade quoted speech" |
| `A1-C63` | The INMIS age/grade norm tables | "Justice 2006 Index of Narrative Microstructure INMIS values by grade…" |
| `A1-C64` | The grade-level lexical expectation tables (grades 1–8) | "Grade Level Expectations in Lexical Measures and Accuracy of Written Narrative Samples…" |
| `A1-C68` | Mean-length-of-T-unit / words-per-narrative norms by grade | 2 searches (see claim text) |
| `A1-C106` | Evidence on over-correction harming young writers' motivation/anxiety | Search budget exhausted before this query ran |
| Interactive-reading meta-analysis effect sizes | Numbers behind *The effects of interactive reading on young children's narrative abilities: a meta-analytic study* (PMC12645831) | "narrative intervention meta-analysis school-age children effect size story grammar Pico Petersen" |

**End of Agent 1 deliverable.**

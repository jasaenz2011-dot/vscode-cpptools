# 02 — Narrative Arc & Story Structure Models
### Knowledge base for Character Studio (Grapevine / Episode Page Portal), grades 2–8

---

## Scope, method, and how to read this document

**Date of research session:** 2026-08-18
**Searches actually run this session:** 57 successful `WebSearch` calls, plus ~12 `WebFetch` attempts.

**CRITICAL METHOD LIMITATION — read before using any claim in this document.**

`WebFetch` was blocked by this environment's network egress policy for **every** domain attempted, including `eric.ed.gov`, `pubs.asha.org`, `pubmed.ncbi.nlm.nih.gov`, `pmc.ncbi.nlm.nih.gov`, `tandfonline.com`, `sciencedirect.com`, `journals.sagepub.com`, `archive.org`, `openalex.org`, `corestandards.org`, `jalt-publications.org`, and `readingrockets.org`. **I could not open a single full paper.** All retrieval was therefore mediated by `WebSearch`, which returns titles, URLs, and a search-engine-generated summary synthesised from the retrieved pages.

Consequences you must respect when using this document:

1. **I did not read any primary paper in full.** Every empirical claim below is sourced from a search-result synthesis of the paper (or of secondary pages describing it). Under this knowledge base's own rules that makes essentially the whole document `[SECONDARY-SOURCED]` at the retrieval level, even where the underlying study is a primary `[E1]` source. I have marked the **evidence tier of the underlying source** (e.g. `[E1]`) and added `[SECONDARY-SOURCED]` where the retrieval channel is the material weakness. Where I have a specific reason to doubt the number or wording, I mark it `[UNVERIFIED]`.
2. **Numbers are especially fragile.** Sample sizes, effect sizes and page ranges below came from search summaries, not from tables I read. Treat every number as requiring re-verification against the paper before it is quoted externally or used to justify a product decision. I have flagged the ones I consider highest-risk.
3. **The search budget was exhausted mid-plan.** Roughly a dozen planned searches were never run — notably on problem–solution structure in early-years narrative writing, Indigenous North American narrative structure beyond Hymes/Toelken, Pacific/Polynesian narrative form beyond Māori pūrākau, South Asian oral narrative beyond the Panchatantra, and Deaf/ASL narrative structure. Those gaps are named in *Open questions*.

**How to read the rest of the document.**

- Every substantive research claim carries an ID `A2-Cnn` and exactly one evidence tier.
- Each structure gets a dossier. Inside each dossier, `## WHAT RESEARCH SAYS` and `## WHAT CHARACTER STUDIO SHOULD DO` are strictly separated. Nothing in a "SHOULD DO" block is a research finding; each cites the claim IDs it leans on and states its own confidence.
- Anything labelled **DESIGN DECISION** is a product judgement I invented for usability. It is *not* a research finding. Every numeric threshold in the implementation logic is a DESIGN DECISION unless explicitly tied to a claim ID.
- Age bands use the shared taxonomy: Ages 5–6 / Grades K–1 · Ages 7–8 / Grades 2–3 · Ages 9–10 / Grades 4–5 · Ages 11–12 / Grades 6–7 · Ages 13–14 / Grades 8–9. I cite each source's own range first, then map. **Age bands are soft defaults, never gates.** Where an age recommendation is instructional convention rather than an empirical finding, I say so in the dossier.

**Evidence tiers used:** `[E1]` empirical · `[E2]` theoretical framework/model · `[E3]` educational standard/curriculum framework · `[E4]` established instructional practice/professional consensus · `[E5]` commercial or proprietary system · `[E6]` emerging or contested · `[UNVERIFIED]`.

**A note on this agent's special caution.** Narrative-structure models are dominated online by writing-advice content. Several models in wide circulation are misattributed or misdescribed. Where the only sources I could reach were writing blogs, I tier them `[E5]`/`[E6]` and say so in the dossier rather than laundering them into apparent scholarship. Kishōtenketsu receives extended provenance treatment for exactly this reason (§12).

---

# PART A — CROSS-CUTTING RESEARCH FOUNDATIONS

These findings constrain *every* structure dossier that follows. Read this part before the dossiers.

## WHAT RESEARCH SAYS

### A.1 Story grammar as a description of children's narrative competence

`A2-C01` `[E2]` `[SECONDARY-SOURCED]` — Stein & Glenn proposed that a well-formed narrative is organised around an internalised **story schema**. The framework is generally reported as comprising: setting, initiating event, internal response, plan, attempt, consequence, and resolution; a widely used six-element reduction is setting, character, initiating event, attempt, consequence, reaction. The originating work is Stein, N. L. & Glenn, C. G. (1979), "An Analysis of Story Comprehension in Elementary School Children," in *New Directions in Discourse Processing*; an earlier 1975 version is indexed as ERIC ED121474.
*Retrieved via:* search synthesis over ERIC, Semantic Scholar, ConductScience and a University at Buffalo history-of-CDS page.

`A2-C02` `[E1]` `[SECONDARY-SOURCED]` `NUMBER AT RISK` — The Stein & Glenn work is described as examining children aged 6 and 10 (reported n = 48), each listening to and retelling an unfamiliar folktale containing the basic story-grammar elements, with recall probed after a short delay and again after one week. **I could not open the paper; treat n = 48 and the exact ages as unverified detail.**

`A2-C03` `[E2]` — Story grammar was proposed as a *descriptive/analytic* schema for how children comprehend and recall stories. It was **not** authored as a prescriptive template for composing fiction. Its migration into writing instruction and into SLP intervention is a later, downstream use.
*Basis:* the framing in every retrieved description is comprehension and recall, not composition.

`A2-C04` `[E1]` `[SECONDARY-SOURCED]` — Adherence to story-grammar elements is reported to commence around age 4; by about age 6 children can typically supply setting information, initiating actions and characters' goals, and may attempt a plot. Children younger than about 8 find it difficult to infer other people's **plans and internal responses**, so their narratives skew toward *what happened* (attempt/action, initiating event, consequence) rather than characters' emotional reactions.
*Mapping to shared taxonomy:* the "under 8" boundary spans Ages 5–6/Grades K–1 and the lower half of Ages 7–8/Grades 2–3. **This is the single most product-relevant developmental finding in this document** — see §A.6 and the character-design rules in Part C.

`A2-C05` `[E1]` `[SECONDARY-SOURCED]` `NUMBER AT RISK` — Khan, K. S., Gugiu, M. R., Justice, L. M., Bowles, R. P., Skibbe, L. E. & Piasta, S. B. (2016), "Age-Related Progressions in Story Structure in Young Children's Narratives," *Journal of Speech, Language, and Hearing Research* 59(6), 1395–1408, examined story-structure knowledge in reportedly 386 children (M ≈ 4.8 years) drawn from the Narrative Assessment Protocol study, testing unidimensionality of story-structure items, item difficulty, and age-related progression across ages 3, 4, 5 and 6. The overall reported picture: children are **actively acquiring** these competencies between 3 and 6.
*Product reading:* story-structure knowledge is **still under construction** at the bottom of Character Studio's range and is best treated as emerging, not established, at Grades K–1 and early Grade 2.

### A.2 Stage models of narrative development

`A2-C06` `[E2]` `[SECONDARY-SOURCED]` — Applebee, A. N. (1978), *The Child's Concept of Story: Ages Two to Seventeen*, University of Chicago Press, describes a progression of narrative organisation: **heaps** (labels/descriptions with no central theme or organisation) → **sequences** (labelling around a central theme, character or setting, but no plot; not necessarily temporal or causal) → **primitive narratives** (central theme plus initiating event, attempt/action and consequence; no true resolution, little motivation) → **chains** (unfocused, then focused: more complex organisation and sequencing around central themes) → **true narratives** (central theme, character and plot; motivation behind actions; logically and/or temporally ordered events; initiating event, plan/motivation, attempt, consequence, resolution).

`A2-C07` `[E2]/[E1]` `[SECONDARY-SOURCED]` — Peterson, C. & McCabe, A. (1983), *Developmental Psycholinguistics: Three Ways of Looking at a Child's Narrative*, Plenum Press, established **high-point analysis** for personal narrative macrostructure. Reported narrative pattern types include **two-event**, **leap-frog** (skipping over events, omitting significant chunks), **end-at-high-point** (builds to a climax then stops without resolution), and **classic** (builds to a high point, dwells there evaluatively, then resolves). "The use of evaluation to mark a high point is the hallmark of a personal narrative."

`A2-C08` `[E1]` `[SECONDARY-SOURCED]` — A developmental study of Chinese children aged 3–6 (published in *Journal of Psycholinguistic Research*, Springer) reported that the most frequent pattern was **two-event at age 3** and **chronological from ages 4 to 6**; the proportions of leap-frog, two-event and one-event patterns decreased with age; and **most Chinese children at age 6 had not yet developed the ability to tell a classic narrative including resolution.**
*Product reading:* "ends without resolving" is a **normal developmental form**, documented across at least two language communities — not an error to correct. This claim is load-bearing for the anti-imposition rules in Part C.

`A2-C09` `[E2]` — Labov, W. & Waletzky, J. (1967), "Narrative Analysis: Oral Versions of Personal Experience," in J. Helm (ed.), *Essays on the Verbal and Visual Arts*, University of Washington Press, 3–38, is the foundational formal framework for oral personal narrative and underpins high-point analysis. Its core move is defining narrative as a specific linguistic technique for recapitulating past experience.
`[UNVERIFIED]` — the canonical six-part labelling usually attributed to this paper (abstract / orientation / complicating action / evaluation / result-or-resolution / coda) was **not** confirmed by anything I retrieved this session. I searched for it explicitly and the returned synthesis did not carry the element list. Do not quote the six labels as Labov & Waletzky's until someone opens the paper.

### A.3 Culture and narrative form — the most important caution in this document

`A2-C10` `[E1]` `[SECONDARY-SOURCED]` — Michaels, S., "'Sharing time': Children's narrative styles and differential access to literacy," *Language in Society* (Cambridge University Press), reported that African American first-graders in a classroom sharing-time activity often produced narratives cohering not around a single topic but around a series of loosely and sometimes unclearly related episodes — a style Michaels named **topic-associating** — in contrast to a **topic-centered** style more common among the Caucasian first-graders studied.

`A2-C11` `[E1]` `[SECONDARY-SOURCED]` — In the same body of work, the (European American) teacher was reported to be better able to help children expand **topic-centered** narratives and to lack the facility to help children elaborate **topic-associating** ones, producing unintentional communicative mismatch. Teachers viewed the African American children's stories as **ill-formed** and treated the children's language as a **deficit**; Michaels' analysis instead treated them as fitting a *different* structure. James Gee extended the analysis to argue the topic-associating structure carries complex literary elements.
*This is the empirical core of Character Studio's anti-imposition stance.* A tool that scores "one clear topic, one clear problem, one clear resolution" as *correct* mechanises exactly the deficit judgement this literature documents.

`A2-C12` `[E1]` `[SECONDARY-SOURCED]` — A related study, "African American kindergartners' spoken narratives: Topic associating and topic centered styles," *Linguistics and Education* (1994; ERIC EJ497723), examines the same stylistic contrast at kindergarten age.

`A2-C13` `[E1]` `[SECONDARY-SOURCED]` — Heath, S. B. (1983), *Ways with Words: Language, Life and Work in Communities and Classrooms*, Cambridge University Press, is a ten-year ethnography (fieldwork reported as 1969–1978) of language socialisation in three communities in the Carolina Piedmont: **Roadville** (white working-class, textile-mill families), **Trackton** (African American working-class), and **Maintown** (the townspeople). Reported finding: "For Roadville, the written word limits alternatives of expression; in Trackton, it opens alternatives," and the townspeople's children acquire the habits of talk associated with written materials — coming to "act like literates before they can read."
*Product reading:* the story habits a child brings are community practices, not aptitude. Different homes hand children genuinely different default story shapes, and school-story shape is one of them, not the neutral baseline.

### A.4 Does teaching structure actually help? (Evidence for the *instructional* premise)

`A2-C14` `[E1]` `[SECONDARY-SOURCED]` `NUMBER AT RISK` — Graham, S., McKeown, D., Kiuhara, S. & Harris, K. R. (2012), "A Meta-Analysis of Writing Instruction for Students in the Elementary Grades," *Journal of Educational Psychology* 104, 879–896. Reported: 115 documents yielded computable effect sizes; average weighted effect sizes were computed for 13 writing interventions tested in at least 4 studies; six interventions explicitly taught writing processes, skills or knowledge, and all but grammar instruction produced statistically significant effects, with **strategy instruction at ES ≈ 1.02**. (A published correction to this meta-analysis exists — see Source list — so the exact figure needs checking against the corrected version.)

`A2-C15` `[E1]` `[SECONDARY-SOURCED]` `NUMBER AT RISK` — Bogaerds-Hazenberg, S. T. M., Evers-Vermeul, J. & van den Bergh, H. (2021), "A Meta-Analysis on the Effects of Text Structure Instruction on Reading Comprehension in the Upper Elementary Grades," *Reading Research Quarterly* 56(3), 435–462, synthesised 44 (quasi-)experimental studies of informational **and narrative** text-structure interventions with students in grades 4–6 in regular school settings. Reported immediate effects were **positive but highly variable by outcome**: comprehension questions Hedges' *g* ≈ 0.25; summarisation *g* ≈ 0.57; recall *g* ≈ 0.37; knowledge about text structure *g* ≈ 0.38.
*Product reading:* teaching structure most reliably improves **the ability to summarise and to talk about structure** — i.e. metacognitive/structural outcomes — and least reliably improves general comprehension question performance. Applied to Character Studio: structure scaffolds are best justified as tools for *planning and talking about* a story, and are **weakly** justified as a route to "better stories."

`A2-C16` `[E1]` `[SECONDARY-SOURCED]` — Petersen, D. B. (2011), "A Systematic Review of Narrative-Based Language Intervention With Children Who Have Language Impairment," *Communication Disorders Quarterly*, identified 9 studies meeting inclusion criteria (published since 1980, preschool and school-age children with language impairment). The majority reported **moderate to large effect sizes for narrative macrostructure**, with lower effect sizes for microstructure. Reported effective components: photographs or books to elicit narratives; **icons or cards that individually represent macrostructural concepts**; and repeated opportunities to tell narratives across sessions. Spencer & Petersen (2020) are reported to emphasise systematic visual materials, immediate feedback, **non-restrictive prompts**, and **progressive fading of scaffolding** to build independence.
*Reported limitation, retrieved:* each study had limited participants, limited experimental control, and considerable variation in procedures and materials.
*Product reading — three directly implementable design principles:* (i) one visible icon per structural slot; (ii) prompts must be non-restrictive; (iii) scaffolding must fade.

`A2-C17` `[E6]` `[SECONDARY-SOURCED]` `NUMBER AT RISK` — A systematic review of reading-comprehension interventions for students with learning disabilities (1985–2005, 15 studies) was reported as finding effect sizes of 0.94 for "visually dependent" reading comprehension and 1.18 for "auditory-language dependent" strategies. **I retrieved this only from a student-run special-education journal summary and could not verify the underlying review, its inclusion criteria, or what those two categories mean.** Do not use these numbers.

### A.5 What structure looks like when measured across languages

`A2-C18` `[E1]` `[SECONDARY-SOURCED]` — The **Multilingual Assessment Instrument for Narratives (MAIN)** was developed with reported piloting across more than 550 monolingual and bilingual children aged 3–10 in 15 languages and language combinations, with stories controlled for cognitive and linguistic complexity, macrostructure/microstructure parallelism, and **cultural appropriateness**. Its macrostructural episode unit is: **Goal – Attempt – Outcome**, plus **internal states** as initiating and resulting events; Attempt and Outcome are the *factual* components, Goal and internal states the *inferred* ones.

`A2-C19` `[E1]` `[SECONDARY-SOURCED]` — Research using MAIN reports that **microstructure is more sensitive to language experience whereas macrostructure remains relatively stable across groups**, and that macrostructure measures were stable across languages and story pairs.
*Product reading — this is the key accessibility finding.* For an emergent bilingual child, weak surface language is **not** evidence of weak story structure. Character Studio must never infer structural ability from sentence-level fluency. See Part D.

`A2-C20` `[E1]` `[SECONDARY-SOURCED]` — Studies of autistic children's narrative production report: fewer actions than typically developing peers; more errors of **global** coherence, with **local** coherence and temporal/causal connectives more similar to comparison groups; more difficulty with macrostructure and with integrating information and making inferences; and particular difficulty with **retelling** fictional narratives. Sources include "Defining the Characteristics of Story Production of Autistic Children: A Multilevel Analysis," *Journal of Autism and Developmental Disorders*, and a scoping review of coherence in autistic people's spoken narratives.
*Caution I am adding, not retrieving:* this literature is framed in deficit terms throughout. The retrieved finding that local coherence and connective use are comparable is as notable as the global-coherence difference, and Character Studio should not treat "global coherence" as a quality bar.

### A.6 What children can actually do, by band (synthesis — read the caveat)

The table below is a **synthesis I constructed** from `A2-C04`, `A2-C05`, `A2-C06`, `A2-C07`, `A2-C08` and the Common Core progression (`A2-C21`). It is a soft default for defaulting UI, **not** a gate, **not** an assessment rubric, and **not** a research finding in itself.

| Band | Typically consolidated | Typically emerging | Should NOT be assumed |
|---|---|---|---|
| Ages 5–6 / K–1 *(peripheral)* | Naming a character; recounting a single event or several loosely linked events; ordering by "and then" | Setting information; initiating event; a stated want | Plans; inferred internal responses; resolution |
| Ages 7–8 / Grades 2–3 | A well-elaborated event or short sequence; details of actions; a sense of closure | Explicit character goals; a problem; simple cause-and-effect chaining; naming feelings | Reliable *inference* of another mind's plan (`A2-C04`); multi-thread plot; falling action |
| Ages 9–10 / Grades 4–5 | Situation + narrator/characters; event sequence that unfolds naturally; dialogue; transitional phrasing | Character motivation as a driver; a genuine turning point; resolution that answers the problem | Subtext; irony; unreliable narration; deliberate structural subversion |
| Ages 11–12 / Grades 6–7 | Goal-driven protagonist; conflict; climax; resolution; character change | Theme; parallel plot lines; deliberate choice *among* structures | Command of formal structural vocabulary without instruction |
| Ages 13–14 / Grades 8–9 | Full conventional arc; structural vocabulary; character arc as an object of design | Structural experimentation; hybrid and non-Western forms used deliberately | Nothing categorically — treat as capable and offer the full palette |

`A2-C21` `[E3]` `[SECONDARY-SOURCED]` — Common Core State Standards, Writing Standard 3 (narrative), retrieved for K–3:
- **K (W.K.3):** use a combination of drawing, dictating and writing to narrate a single event or several loosely linked events, tell about the events in the order in which they occurred, and provide a reaction to what happened.
- **Grade 1 (W.1.3):** recount two or more appropriately sequenced events, include some details regarding what happened, use temporal words to signal event order, and provide some sense of closure.
- **Grade 2 (W.2.3):** recount a well-elaborated event or short sequence of events, include details to describe actions, thoughts and feelings, use temporal words to signal event order, and provide a sense of closure.
- **Grade 3 (W.3.3):** establish a situation and introduce a narrator and/or characters; organise an event sequence that unfolds naturally; use dialogue and descriptions of actions, thoughts and feelings to develop experiences and events or show characters' responses; use temporal words and phrases to signal event order; provide a sense of closure.
`[UNVERIFIED]` — **Grades 4–8 W.3 wording was not retrieved** (corestandards.org was egress-blocked and the search budget ran out). Do not encode grades 4–8 standard text from memory.

*Two things worth noticing in the retrieved K–3 text, because they directly constrain product copy:* the standards say **"a sense of closure,"** not "a resolution"; and they never require **conflict** at any of K–3. Character Studio's early-grade copy should match that vocabulary.

`A2-C22` `[E1]` `[SECONDARY-SOURCED]` — Reported in research on elementary narrative writing: children "often default to merely describing appearance due to a lack of understanding about how to develop more rounded characters"; ability to identify and use story characters' **goals** as coherence cues develops across childhood; and syntactic complexity in upper-elementary narrative writing is predicted by oral grammar, inhibition and planning (executive function).
*Product reading:* the observed default failure mode in child character creation is **appearance-only characters**. That is a specific, addressable target for Character Studio prompts — and it is a *character* problem, not a *structure* problem.

### A.7 Evidence about AI-assisted storytelling with children

`A2-C23` `[E6]` `[SECONDARY-SOURCED]` `PREPRINT` — "Floor Raiser or Ceiling Limiter? Differential Storytelling Outcomes with a Child-Centric GenAI System Across Individual Differences" (arXiv preprint 2606.27067) reports a mixed-methods within-subjects experiment with **N = 40 children in Grades 2–6 (ages 7–12)** comparing a GenAI-assisted condition against a traditional storyboard condition. Reported results: a **floor-raising convergence pattern with the quality gap narrowing by ~83.5%**, driven by both lower-end support **and upper-end constraint**; improvements concentrated in **creativity and richness**, while **coherence and narrative structure remained tied to baseline performance**.
*This is a preprint, single study, small N, and I read only a summary. Treat as a hypothesis, not a finding.*
*Product reading, if it replicates:* an AI story tool may help struggling writers and **constrain strong ones** — and it may not move structure at all. That argues for (i) making structural scaffolding opt-in and fadeable, and (ii) building an explicit "get out of my way" path for confident writers. Both are in Part C.

---

## WHAT CHARACTER STUDIO SHOULD DO (cross-cutting)

**XC-1 — Structure features are planning aids, not quality gates.** *Confidence: moderate.* Supported by `A2-C15` (structure instruction reliably improves summarising and structural knowledge, weakly improves comprehension outcomes) and `A2-C03` (story grammar was descriptive, not prescriptive). No feature may compute or display a "story completeness score," a percentage, or any signal that a story is missing something.

**XC-2 — Never treat absence of resolution as an error below Grade 6.** *Confidence: high.* Supported by `A2-C08` (most 6-year-olds studied had not developed classic narratives with resolution) and `A2-C07` (end-at-high-point is a documented normal type) and `A2-C21` (standards ask for "a sense of closure," not resolution, through Grade 3).

**XC-3 — Never treat topic-associating or multi-strand storytelling as disorganised.** *Confidence: high.* Supported by `A2-C10`, `A2-C11`, `A2-C13`. See the hard prohibitions in Part C (§C.3).

**XC-4 — Under Grade 4, prompt for observable action and stated wants; do not require inferred internal states.** *Confidence: moderate–high.* Supported by `A2-C04` (inferring others' plans and internal responses is difficult before ~8) and `A2-C18` (Goal and internal states are the *inferred* components; Attempt and Outcome the factual ones). Ask "what does your character DO?" before "what does your character FEEL?", and never require the second.

**XC-5 — One icon per structural slot; non-restrictive prompts; scaffolding fades.** *Confidence: moderate.* Directly ported from the reported effective components in `A2-C16`. "Non-restrictive" means the prompt must accept any answer, including a refusal or an off-model answer, without re-asking.

**XC-6 — Never infer structural ability from surface language.** *Confidence: moderate–high.* Supported by `A2-C19` (macrostructure stable across languages; microstructure sensitive to language experience). Spelling, sentence length, vocabulary and grammar must be **excluded inputs** to the structure recommender. This is an implementation constraint, see `REC-INPUT-EXCLUSIONS` in Part C.

**XC-7 — Give strong writers a first-class exit.** *Confidence: low–moderate.* Motivated by `A2-C23`'s reported upper-end constraint effect. The "my own way" path must be visible at the same level as the structure suggestions, not buried behind a "skip" link.

**XC-8 — Target appearance-only characters, not structure, when character work is thin.** *Confidence: moderate.* Supported by `A2-C22`. If a child's character has only physical description, the correct intervention is a *character* prompt (what do they want / what do they refuse to do / who do they answer to), **not** a suggestion to adopt a plot structure.

---

# PART B — STRUCTURE DOSSIERS

Each dossier follows the same shape. **Complexity** is rated on a scale I defined (DESIGN DECISION): *Low* = 2–3 slots, no dependency between slots; *Medium* = 4–6 slots with ordering constraints; *High* = 7+ slots, or slots whose content depends on other slots; *Very high* = requires holding a character-change model across the whole structure.

---

## §1 — Beginning · Middle · End

### WHAT RESEARCH SAYS

`A2-C24` `[E2]` — The beginning/middle/end formulation traces to Aristotle, *Poetics*, Chapter VII, which defines tragedy as "an imitation of an action that is complete, and whole, and of a certain magnitude," and defines a whole as "that which has a beginning, a middle, and an end." Aristotle's definitions are **relational, not positional**: "A beginning is that which does not itself follow anything by causal necessity, but after which something naturally is or comes to be. An end is that which itself naturally follows some other thing, either by necessity, or as a rule, but has nothing following it. A middle is that which follows something as some other thing follows it." He adds that "a well constructed plot… must neither begin nor end at haphazard, but conform to these principles," and discusses **magnitude**: "the longer the story, consistently with its being comprehensible as a whole, the finer it is by reason of its magnitude." *(Verified across several public-domain hosts of the Butcher translation.)*

`A2-C25` `[E2]` — **Provenance correction that matters for the product.** Aristotle's "beginning" is defined by *causal position* (nothing necessitates it) — not by "the part where you introduce the characters." The classroom version of beginning-middle-end is a positional/temporal reading that is not what the source argues. Aristotle also wrote about **tragic drama**, not about children's fiction, and not as a composition template for beginners.

`A2-C26` `[E3]` — Beginning/middle/end is embedded in early-years curriculum as sequencing (`A2-C21`: K–1 "tell about the events in the order in which they occurred"; Grade 1 "two or more appropriately sequenced events… temporal words"). Pie Corbett's Talk for Writing materials introduce **whole-class retelling and understanding of beginning and middle sections in Early Years (3–5)** (`A2-C39`).

**Defining components.** Three ordered slots. No required causal relation in the classroom version; a strict causal relation in Aristotle's.

**Complexity.** Low (3 slots, ordering only).

**Developmental prerequisites.** Ability to sequence two or more events; a temporal connective ("then", "next"). Per `A2-C21` this is already the K–1 expectation.

**Age bands.** Ages 5–6/K–1 onward. *Basis: educational standard (`A2-C21`) plus instructional convention — not an empirical finding that this order is developmentally optimal.*

**Strengths for children's storytelling.** Lowest cognitive load of any structure here. Maps onto a page/screen layout trivially. Compatible with almost every other structure as a container.
**Strengths for character creation — what it demands of a character.** Almost nothing. A character needs only to *persist* across three moments. This is its virtue at the youngest bands: a child can invent a character before deciding anything about that character's wants.

**Limitations.** Says nothing about causality, stakes, or change; a child can satisfy it with three unrelated pictures. Provides no traction on the appearance-only-character failure mode (`A2-C22`).

**Cultural assumptions.** Mild. It assumes linear temporal presentation. Frame narratives (§14), circular stories (§10) and ring composition (§15) all satisfy it only loosely.

**Do NOT impose when:** the child is telling a story that loops, nests, or presents events out of order on purpose; the child is building a character sheet rather than a plot; or the child is producing a topic-associating narrative (`A2-C10`).

**Child-friendly terminology.** Grades 2–3: "the start / what happens / the ending." Grades 4–5: "opening / middle / ending." Grades 6–8: "beginning, middle, end" is already plain.

**Simplified variants.**
- K–1: two slots — "first" and "last."
- Grades 2–3: three slots, each one sentence or one drawing.
- Grades 4–5: three slots plus one optional "the biggest moment" marker placed anywhere the child likes.
- Grades 6–8: present as the *container* other structures sit inside, not as a structure to choose.

### WHAT CHARACTER STUDIO SHOULD DO

**S1-R1.** Beginning-Middle-End is the **only** structure that may be pre-selected by default, and only for Grades K–3. *Cites `A2-C21`, `A2-C24`. Confidence: moderate.* DESIGN DECISION: the grade cutoff.
**S1-R2.** Never label the middle slot "the problem" or "the conflict." Label it neutrally ("what happens"). *Cites `A2-C21` (standards require no conflict at K–3) and `A2-C25`. Confidence: high.*
**S1-R3.** Accept a completed structure with any content in any slot, including empty slots. No slot is required. *Cites `XC-1`, `A2-C16` (non-restrictive prompts). Confidence: high.*
**S1-R4.** At Grades 6–8, do not offer B-M-E as a listed option; it is assumed. Offering it reads as condescension. *DESIGN DECISION. Confidence: low — worth user-testing.*

---

## §2 — Story Grammar

### WHAT RESEARCH SAYS

See `A2-C01`–`A2-C05` in Part A for the primary claims; they are not repeated here.

`A2-C27` `[E4]` `[SECONDARY-SOURCED]` — Story grammar is established practice in reading comprehension instruction and in speech-language pathology. Retrieved framing: students with story-grammar knowledge "are better able to make predictions about a text, recognize what information is crucial for the plot, and recall more about main story elements"; typical instruction teaches identification of protagonists, their goals or problems, the actions, and the outcome. Story mapping and story grammar appear among the strategies investigated in reading-comprehension intervention meta-analyses for students with learning disabilities.

**Defining components.** Setting · character(s) · initiating event · internal response · plan · attempt · consequence · resolution (fuller version); or setting · character · initiating event · attempt · consequence · reaction (six-element version) — `A2-C01`.

**Historical/source context.** Stein & Glenn (1979), as a **schema-theoretic account of comprehension and recall in elementary school children** (`A2-C01`, `A2-C03`). It was never proposed as a writing template. Its use as a composition scaffold and as an intervention target is downstream adaptation — well-supported for intervention purposes (`A2-C16`) but a change of purpose.

**Complexity.** Medium to High (6–7 slots; internal response and plan depend on character mind-modelling).

**Developmental prerequisites.** Sequencing; a named character; a stated want. For the *internal response* and *plan* slots specifically: the capacity to infer another mind's plans, which `A2-C04` reports as difficult before about age 8.

**Age bands.**
- Ages 5–6/K–1: setting, character, initiating event only. *Basis: `A2-C04`, `A2-C05`.*
- Ages 7–8/Grades 2–3: add attempt and consequence. Internal response optional and never required. *Basis: `A2-C04` — the strongest developmental basis of any recommendation in this document.*
- Ages 9–10/Grades 4–5 and up: full set available.

**Strengths for children's storytelling.** The best-evidenced scaffold here for children with language difficulties (`A2-C16`), with concrete implementation guidance (icons per slot, non-restrictive prompts, fading). Slots are answerable independently.
**Strengths for character creation — what it demands of a character.** More than any other structure on this list, story grammar demands an **interior**: a character who *responds* and *plans*. That is its distinctive value for Character Studio (it directly attacks the appearance-only failure mode, `A2-C22`) **and** its distinctive risk (it demands exactly the inference that under-8s find hard, `A2-C04`).

**Limitations.** Goal-directed, single-protagonist, problem-driven by construction. A story with no goal and no problem cannot be represented without appearing incomplete. High slot count invites completion-scoring — which `XC-1` forbids.

**Cultural assumptions.** Substantial. The schema was derived from and validated against Western folktale-shaped stories. `A2-C10`/`A2-C11` document what happens when this shape becomes the classroom standard of well-formedness. `A2-C18` is the important counterweight: the MAIN instrument's Goal–Attempt–Outcome episode was built with explicit attention to cultural appropriateness and reports macrostructural stability across 15 languages (`A2-C19`) — so *some* goal-episode structure travels further than the full Stein & Glenn set does. Do not over-claim in either direction.

**Do NOT impose when:** the child's story has no protagonist goal (slice-of-life, mood pieces, world-building, ensemble stories); the child is producing a topic-associating narrative (`A2-C10`); the child is below Grade 3 and the prompt would require inferring a plan (`A2-C04`); or the tool would need to mark a missing slot to render.

**Child-friendly terminology.** See the master table in Part C §C.4.

**Simplified variants.**
- K–1: "Who? · Where? · What happened?"
- Grades 2–3: "Who · Where · Something happens · They try something · What happens because"
- Grades 4–5: add "How they felt about it" as an **optional** card.
- Grades 6–7: add "Their plan" and "How it ended."
- Grades 8–9: full formal vocabulary, presented as one analytic lens among several.

### WHAT CHARACTER STUDIO SHOULD DO

**S2-R1.** Render each slot as an independent card that can be filled in any order and left blank without visual penalty (no greyed-out, no dashed outline, no "incomplete" affordance). *Cites `A2-C16`, `XC-1`. Confidence: high.*
**S2-R2.** Below Grade 4, the "internal response" and "plan" cards are **hidden by default** and available only if the child opens an "add more" affordance. *Cites `A2-C04`. Confidence: moderate–high.* DESIGN DECISION: the Grade 4 cutoff (`A2-C04` says "younger than 8", which straddles Grade 2–3).
**S2-R3.** Prompt wording must be non-restrictive and action-first below Grade 4: "What does your character do?" not "What is your character's plan?" *Cites `A2-C04`, `A2-C18`, `XC-4`. Confidence: moderate–high.*
**S2-R4.** Scaffolding fades: after a child completes N stories using story-grammar cards, the cards collapse to a single optional "story helper" button. *Cites `A2-C16` (progressive fading). Confidence: moderate.* DESIGN DECISION: N = 3, invented for usability; no research basis for the number.
**S2-R5.** Story grammar must never be the tool's default recommendation for a child whose sample shows topic-associating organisation. *Cites `A2-C10`, `A2-C11`. Confidence: high.* See the hard prohibition `AI-3` in Part C.

---

## §3 — Three-Act Structure

### WHAT RESEARCH SAYS

`A2-C28` `[E5]` `[SECONDARY-SOURCED]` — The three-act paradigm as taught today derives from **Syd Field, *Screenplay: The Foundations of Screenwriting* (1979)**, which described acts as **setup · confrontation · resolution**, separated by **two plot points** — a plot point being an event that "thrusts the plot in a new direction," leading into a new act. Retrieved framing describes Field's 1979 book as the first to outline the three-act paradigm specifically for screenwriting.

`A2-C29` `[E2]` — **Provenance caution.** The very common claim that three-act structure "comes from Aristotle" is not something I could verify. Aristotle's Chapter VII argument (`A2-C24`) is about wholeness and causal position, and defines beginning/middle/end relationally — it does not name three acts, plot points, or act breaks. Retrieved results explicitly noted that they contained no information on whether Field credited or rejected Aristotle. `[UNVERIFIED]` — any lineage claim from Aristotle to Field.

`A2-C30` `[E5]` — Purpose of origin: three-act structure was authored as a **commercial screenwriting tool** — a diagnostic for feature-length film scripts with an implied ~110-page runtime and act-break page targets. It was explicitly prescriptive, but prescriptive *for a specific commercial medium*, not for children's prose.

**Defining components.** Act I setup → Plot Point 1 → Act II confrontation → Plot Point 2 → Act III resolution.

**Complexity.** Medium (3 acts + 2 transition events = 5 slots, with dependency: PP1 must change the direction established in Act I).

**Developmental prerequisites.** A protagonist with a goal; the concept that an event can *redirect* a story (not merely follow it); ability to hold a mid-story escalation.

**Age bands.** Ages 11–12/Grades 6–7 upward as a *named* structure. Below that, its content is better delivered as beginning-middle-end plus "a moment that changes everything." *Basis: instructional convention and the slot-dependency argument above — I found **no** empirical study of three-act structure taught to children. Say so in any internal doc.*

**Strengths for children's storytelling.** Familiar from film and television, so the shape is often already internalised. The "plot point" idea is genuinely useful and is the one part worth teaching early in disguised form.
**Strengths for character creation — what it demands of a character.** A protagonist who can be *changed course* by an external event and who has enough want to sustain a long middle. Act II is the demanding part: it requires a character with a goal strong enough to keep failing at. This makes three-act a poor fit for characters designed around a mood, a world, or a relationship rather than a want.

**Limitations.** Act II is where child writers most often stall — it is the longest and least specified part. The model gives no guidance on character interiority. It is proprietary craft advice (`[E5]`), not a research finding, and should never be presented to a child or a teacher as "how stories work."

**Cultural assumptions.** Heavy. Conflict-centred, protagonist-centred, resolution-requiring, and calibrated to twentieth-century Hollywood feature economics. This is the structure most at risk of doing exactly what this project is trying to avoid.

**Do NOT impose when:** the child is writing short-form (a single scene, a comic strip, a poem-story); the story is episodic (§11) or circular (§10); there is no antagonistic pressure; or the child is under Grade 6 (the Act II gap is where stalling happens).

**Child-friendly terminology.** Grades 4–5: "the setup / the hard part / how it ends." Grades 6–7: "setup, build-up, wrap-up" plus "the moment everything changes." Grades 8–9: formal terms fine.

**Simplified variants.**
- Grades 4–5: two slots plus one marker — "before" / "after" with a "the thing that changed it" card between them.
- Grades 6–7: three acts, with Act II broken into **two** sub-cards ("it gets harder" / "it gets worst") specifically to prevent the Act-II stall. DESIGN DECISION.
- Grades 8–9: full model with plot points named.

### WHAT CHARACTER STUDIO SHOULD DO

**S3-R1.** Never present three-act structure as authoritative or as "the" structure. Attribute it: "a way screenwriters plan movies." *Cites `A2-C28`, `A2-C30`, `A2-C29`. Confidence: high.*
**S3-R2.** Do not surface three-act below Grade 6 unless the child's stated intent is explicitly film/screenplay/movie-script. *Cites the Act-II dependency argument; DESIGN DECISION on the grade. Confidence: low–moderate.*
**S3-R3.** If three-act is chosen, split Act II into two prompts. *DESIGN DECISION, motivated by the observed stall pattern; no retrieved evidence. Confidence: low.*
**S3-R4.** Never repeat the "it comes from Aristotle" lineage in any child-facing or teacher-facing copy. *Cites `A2-C29`. Confidence: high — this is a verified-as-unverifiable claim.*

---

## §4 — Freytag's Pyramid

### WHAT RESEARCH SAYS

`A2-C31` `[E2]` `[SECONDARY-SOURCED]` — Gustav Freytag introduced his model in ***Die Technik des Dramas* (1863)**. The parts retrieved are **introduction · rising movement · climax · falling movement · denouement or catastrophe**. He derived it from analysis of classical Greek and Shakespearean drama, observing a five-act pattern. The standard English text is the MacEwan translation, *Freytag's Technique of the Drama: An Exposition of Dramatic Composition and Art*, translated from the 6th German edition, S. C. Griggs & Company, Chicago, 1895 (public domain in the US; full text is on Internet Archive, which I could not fetch).

`A2-C32` `[E6]` `[SECONDARY-SOURCED]` — **Provenance corrections, all sourced only to writing-craft blogs.** Retrieved claims, tiered low deliberately: (i) the word **"denouement" never appears in Freytag's work, including the original German** — yet it is routinely taught as part of "Freytag's pyramid"; (ii) **"complication"** is likewise not part of Freytag's original structure; (iii) the **flat baseline lines** at the foot of the familiar pyramid diagram were **drawn later by other narrative theorists**, not by Freytag; (iv) Freytag specified an optional post-climax point he called the **"tragic force,"** an event instrumental to the hero's downfall, applicable only to tragedies; (v) the structure as taught today "doesn't actually conform to how the German novelist thought of it."
**I could not verify any of (i)–(v) against Freytag's text or against literary scholarship**, because both Internet Archive and every scholarly host were egress-blocked. Note the internal tension in my own retrieval: `A2-C31`'s summary lists "denouement or catastrophe" as a Freytag part, while `A2-C32` claims "denouement" never appears in Freytag. **Both came from writing-craft sources. At least one is wrong.** Flag this to whoever picks up verification.

`A2-C33` `[E6]` `[SECONDARY-SOURCED]` — Retrieved craft-source claim: Freytag's model describes **tragedy**, and its long falling action sits badly with modern audience expectations of ending at or near the climax.

**Defining components.** Five parts as in `A2-C31`, arranged as a rise and a fall around a central climax.

**Complexity.** Medium–High (5 slots with a required shape — the fall must mirror the rise).

**Developmental prerequisites.** The concept of *tension that increases*, and of *aftermath* — the latter being the genuinely hard part, since it requires narrating events after the exciting bit is over.

**Age bands.** Ages 11–12/Grades 6–7 upward. *Basis: instructional convention. Freytag's pyramid is a staple of middle/high-school ELA in the US. I found no empirical study of teaching it to children, and no basis for claiming an optimal age.*

**Strengths for children's storytelling.** The rise-climax visual is genuinely intuitive and maps onto the "story mountain" (`A2-C39`) that UK primary practice already uses. It gives children a way to talk about *pacing*, which few other models do.
**Strengths for character creation — what it demands of a character.** A protagonist whose situation can **worsen** and then **settle**. Uniquely among the models here, Freytag's falling action asks what a character is like *after*. That is a real character-design prompt and Character Studio can use it: "who is your character once it's over?"

**Limitations.** The falling action is where child writers most often produce nothing — modern story diets end at climax (`A2-C33`). The version taught in schools may not be Freytag's (`A2-C32`). It was built for **tragic five-act drama**, a genre almost no child in this product is writing.

**Cultural assumptions.** Heavy and specific: nineteenth-century German dramatic theory generalising from Greek and Shakespearean tragedy. It encodes a single climax, a single protagonist, and a downward-resolving arc.

**Do NOT impose when:** the story is comic, episodic, circular, or slice-of-life; the child's ending is at the high point (`A2-C07` — a documented normal type, not a flaw); or the child is writing short-form.

**Child-friendly terminology.** "Story mountain" is the best-established child-facing name (`A2-C39`). Grades 4–5: "climb / top / down the other side." Grades 6–7: "build-up, biggest moment, wind-down." Grades 8–9: exposition, rising action, climax, falling action, resolution — **with** the provenance caveat.

**Simplified variants.**
- Grades 2–3: a three-point mountain — "start climbing / top / come down." Attribution to Freytag omitted.
- Grades 4–5: five points, drawn.
- Grades 6–7: five parts named plainly.
- Grades 8–9: formal terms plus an explicit note that the popular diagram differs from Freytag's own (`A2-C32`) — this is a genuinely good critical-thinking moment for this band.

### WHAT CHARACTER STUDIO SHOULD DO

**S4-R1.** Use "story mountain" as the child-facing name below Grade 6 and attach no attribution. *Cites `A2-C39`, `A2-C32`. Confidence: moderate.*
**S4-R2.** Do not assert Freytag's own terminology in child-facing copy until `A2-C32` is verified against the MacEwan text. Use plain-language part names. *Cites `A2-C32` (internally contradictory retrieval). Confidence: high — this is a "we don't know yet" rule.*
**S4-R3.** Make the falling-action slot **optional** at every band, and phrase it as a character question rather than a plot question: "What is your character like afterwards?" *Cites `A2-C33`, `A2-C07`, `A2-C22`. Confidence: moderate.*
**S4-R4.** If a child's draft ends at the climax, the tool says nothing. It does not offer to help "finish." *Cites `A2-C07`, `A2-C08`, `XC-2`. Confidence: high.*

---

## §5 — Hero's Journey / Monomyth

### WHAT RESEARCH SAYS

`A2-C34` `[E2]` `[SECONDARY-SOURCED]` — **Joseph Campbell, *The Hero with a Thousand Faces* (Bollingen Series XVII, 1949)** posits a **monomyth** — a term Campbell borrowed from James Joyce — described as a universal pattern common to heroic tales in every culture. The three main stages retrieved are **Departure** (call to adventure, crossing the threshold), **Initiation** (trials, allies, the abyss) and **Return** (the boon, master of two worlds). Campbell's own formulation, as retrieved: "the standard path of the mythological adventure of the hero is a magnification of the formula represented in the rites of passage: separation — initiation — return."

`A2-C35` `[E6]` `[SECONDARY-SOURCED]` — **Scholarly criticism is substantial and comes from within folklore studies.** Retrieved: folklorists have "dismissed the concept as a non-scholarly approach suffering from source-selection bias"; the universalism is criticised as reductive, imposing a single Indo-European or Western template on myths whose structures and purposes differ significantly; feminist scholars have argued the pattern glorifies violence, aggression and patriarchal social structures.

`A2-C36` `[E6]` `[SECONDARY-SOURCED]` — **Alan Dundes**, in his 2004 Invited Presidential Plenary Address to the American Folklore Society (published in *Journal of American Folklore*, 2005, as "Folkloristics in the Twenty-First Century"), designated Campbell a **non-expert**, outlined source bias in his theories, and criticised media representation of Campbell as an authority on myth. Retrieved quotation attributed to Dundes: **"there is no single idea promulgated by amateurs that have done more harm to serious folklore study than the notion of archetype."** *I retrieved this quotation from secondary pages (a Patheos folklore blog and encyclopedia entries), not from the JAF article. Verify before quoting publicly.*

`A2-C37` `[E2]` — Northup, L. (2006), "Myth-Placed Priorities: Religion and the Study of Myth," *Religious Studies Review* 32(1), 5–10, appears in the critical bibliography on Campbell. `[UNVERIFIED]` — **I retrieved only the citation. I could not retrieve any of its actual arguments.** Do not characterise its content.

`A2-C38` `[E5]` `[SECONDARY-SOURCED]` — **Christopher Vogler** distilled Campbell into a seven-page memo for Disney in 1985, "A Practical Guide to *The Hero with a Thousand Faces*," later expanded into ***The Writer's Journey: Mythic Structure for Writers***, which presents a **twelve-stage** version (Campbell's is generally described as seventeen stages). Its stated aim was "an excellent set of analytical tools" to help executives and screenwriters diagnose struggling narratives — i.e. a **commercial development tool**. Vogler is reported to have been hired as a story consultant on *The Lion King*.

`A2-C42` `[E5]` `[SECONDARY-SOURCED]` — **Dan Harmon's "Story Circle"** (also called "The Embryo") is an eight-step adaptation of the monomyth, deliberately broadened to be less genre-specific: **You · Need · Go · Search · Find · Take · Return · Change**. Retrieved from craft sources only.

`A2-C43` `[E2]` — **Ursula K. Le Guin, "The Carrier Bag Theory of Fiction" (1986)** explicitly confronts the Hero's Journey. Retrieved argument: she disputes that the spear was the earliest human tool, proposing the receptacle instead, and argues fiction should be understood as a **carrier bag** holding diverse experiences rather than as the story of a singular hero's conflict — "before the tool that forces energy outward, we made the tool that brings energy home." She proposes moving "away from the violent power of singular heroes… towards collaboration."
*This is the single best child-appropriate counter-frame available, and Character Studio should use it (see `S5-R4`).*

**Defining components.** 17 stages (Campbell), 12 (Vogler), 8 (Harmon), or 3 macro-stages (departure/initiation/return).

**Complexity.** Very high in the Campbell/Vogler forms; High in Harmon's; Medium if reduced to three macro-stages.

**Developmental prerequisites.** A protagonist who **changes**; the ability to hold that change across a whole story; the concept of an ordinary world versus a special world. The change requirement is what makes this Very High complexity — it is not a slot, it is a through-line.

**Age bands.** Ages 11–12/Grades 6–7 upward for the reduced form; Ages 13–14/Grades 8–9 for the full stage list. *Basis: complexity analysis and instructional convention. I found no empirical study of teaching the hero's journey to children at any age.* Note that the eight-step Harmon form is the most tractable for younger writers, though it is `[E5]` craft advice.

**Strengths for children's storytelling.** Enormous cultural availability — children already know this shape from films and games, so the scaffold has low explanation cost. The departure/return frame gives a genuinely useful sense of shape for adventure and quest genres.
**Strengths for character creation — what it demands of a character.** This is the most character-demanding structure in the document. A hero's-journey slot implies a protagonist who: (a) begins in a defined ordinary state; (b) has an internal lack or need that is **distinct from** their external want; (c) is capable of refusal; (d) can be mentored (which implies a second character with authority); (e) crosses into unfamiliarity; (f) is **transformed** by the end. A character designed for a hero's journey therefore needs at minimum a *want*, a *flaw or lack*, and a *starting world*. Compare §12 (kishōtenketsu) below, which demands almost none of this.

**Limitations.** Singular-protagonist, conflict-centred, transformation-requiring. Ensemble stories, community stories and stories about staying rather than leaving all fit badly. The seventeen/twelve-stage forms are far too long to be usable as a child-facing scaffold.

**Cultural assumptions.** The heaviest in this document, and the criticism is well documented (`A2-C35`, `A2-C36`). The universality claim is contested by folklorists as source-selection bias and Western/Indo-European projection; the gendered critique is separate and also documented. **A tool for children must not present the monomyth as "the universal story."**

**Do NOT impose when:** the protagonist does not leave; the protagonist does not change; the story is about a group rather than an individual; the child's culture or story tradition is being represented and the tool would overwrite its shape (`A2-C35`); the story is short-form; or the child is below Grade 6.

**Child-friendly terminology.** Grades 4–5 (reduced form only): "leaving home / the big test / coming back different." Grades 6–7: "the call, the journey, the return." Grades 8–9: hero's journey / monomyth, taught **with** the criticism.

**Simplified variants.**
- Grades 4–5: three cards — "Where they start" / "What they face" / "How they come back."
- Grades 6–7: five cards — start · call · trial · victory-or-loss · return changed.
- Grades 8–9: Harmon's eight steps or Vogler's twelve, with attribution and with `A2-C35`/`A2-C36` surfaced as a "some scholars disagree" note.

### WHAT CHARACTER STUDIO SHOULD DO

**S5-R1.** **Never** describe the hero's journey as universal, as "the story all cultures tell," or as the pattern underlying all myth. *Cites `A2-C35`, `A2-C36`. Confidence: high. This is a hard prohibition, see `AI-6`.*
**S5-R2.** Attribute it honestly and specifically: "an idea from a writer named Joseph Campbell, later adapted for Hollywood." *Cites `A2-C34`, `A2-C38`. Confidence: high.*
**S5-R3.** Never rank it above other structures in a recommendation list purely because of genre popularity. If it appears, at least one non-conflict-centred structure appears at equal visual weight. *DESIGN DECISION grounded in `A2-C35`. Confidence: moderate.*
**S5-R4.** At Grades 6–9, offer Le Guin's carrier-bag framing as a **peer option**, not a footnote: "some writers think stories don't need a hero at all — they're more like a bag you fill with things that matter." *Cites `A2-C43`. Confidence: moderate. This is the clearest available way to give children a real alternative rather than a disclaimer.*
**S5-R5.** If a child selects hero's journey, the character-design panel must surface *want*, *lack/flaw* and *starting world* fields — and must state that they are optional. *Cites the structure-demands analysis above and `A2-C22`. Confidence: moderate.*

---

## §6 — Quest Structure

### WHAT RESEARCH SAYS

`A2-C44` `[E2]` `[SECONDARY-SOURCED]` — **Northrop Frye, *Anatomy of Criticism* (1957)** organises narrative into four ***mythoi*** mapped to seasons: **Comedy (spring)** moving from confusion to harmony, often ending in marriage or social reintegration; **Romance (summer)**, characterised by a **quest** theme in which the hero descends into subterranean depths and danger and then rises; **Tragedy (autumn)**, the fall of a protagonist; and **Satire/Irony (winter)**, disillusionment. Frye further identifies six phases within each mythos, yielding twenty-four structures. Frye's mythoi are structures of myths which are in turn structures of archetypes.

`A2-C45` `[E6]` `[SECONDARY-SOURCED]` — **Christopher Booker, *The Seven Basic Plots: Why We Tell Stories* (2004)**, a Jungian-influenced analysis reportedly worked on for thirty-four years, proposes seven plots: **overcoming the monster, rags to riches, the quest, voyage and return, comedy, tragedy, rebirth**. Retrieved reception is mixed: positive trade reviews alongside the note that Booker "presents his ideas, many of which dissent from scholarly and critical consensus, confidently." Treat as contested `[E6]`, not as scholarship.

`A2-C46` `[E2]` `[SECONDARY-SOURCED]` — **Vladimir Propp, *Morphology of the Folktale* (1928)** derived **31 functions** and **seven character roles (dramatis personae)** from a corpus reported as about 100 Russian folktales ("wonder tales"). Propp's central methodological move: "The question of what a tale's dramatis personae *do* is an important one… the questions of *who* does it and *how* it is done already fall within the province of accessory study." Functions are defined by what characters do, independently of by whom and in what way. **Scope limitation is explicit in the retrieved framing:** the grammar covers "a restricted corpus of Russian folktales."

**Defining components.** A protagonist; an object of the quest; a journey; obstacles/trials; helpers and opponents; attainment or failure; often a return. Propp's version supplies a much finer-grained function list (villainy/lack → departure → donor → magical agent → struggle → victory → return → recognition, among others).

**Complexity.** Medium (as a plain quest: 4–5 slots) to Very High (Propp's 31 functions).

**Developmental prerequisites.** A concrete goal object; the concept of an obstacle; the ability to chain multiple attempts. Notably, the quest **does not require character transformation**, which makes it substantially easier than the hero's journey.

**Age bands.** Ages 7–8/Grades 2–3 upward in its plain form — a quest is a want plus a journey plus obstacles, which is within reach once story-grammar attempt/consequence is available (`A2-C04`). Propp's full function list: Grades 8–9 and only as an analytic exercise. *Basis: complexity analysis plus `A2-C04`; not an empirical finding.*

**Strengths for children's storytelling.** The most **forgiving goal-driven structure**: obstacles can be added indefinitely, so a child who wants to keep going can, and a child who wants to stop can. It is naturally compatible with episodic structure (§11) — each obstacle is an episode. Propp's *helpers and opponents* give an unusually concrete route into secondary-character creation.
**Strengths for character creation — what it demands of a character.** A quest demands only a **want that can be located in space** and, ideally, a **reason to want it**. It does not demand interiority, transformation, or a flaw. Propp's dramatis personae additionally invite a **cast**: hero, villain, donor, helper, princess/sought-for-person, dispatcher, false hero. For Character Studio this is valuable — it is the structure that most naturally generates *multiple* characters, which is what a character-creation tool wants.

**Limitations.** Can become a list of obstacles with no shape. Propp's model is descriptive of a specific corpus and is misapplied when treated as a universal generator (`A2-C46`). The quest presumes the goal is *outside* the character.

**Cultural assumptions.** Moderate. Quest narratives are widely distributed, but the Frye and Propp formalisations are both European (Frye's seasonal mapping is Northern-Hemisphere-specific; Propp's corpus is Russian). The **object-outside-the-self** premise is a real assumption: stories about returning to, maintaining, or belonging to a place do not fit.

**Do NOT impose when:** the child's story is about staying, tending, or belonging; the goal is internal (understanding, forgiveness, courage); the story is a mood or world piece.

**Child-friendly terminology.** Grades 2–3: "something they really want / the trip / things that get in the way / do they get it?" Grades 4–5: "the goal, the journey, the trouble, the ending." Grades 6–9: quest, trials, allies, obstacle, boon.

**Simplified variants.**
- Grades 2–3: three cards — "What do they want?" / "What's in the way?" / "What happens?"
- Grades 4–5: add a repeatable "another problem" card (this is the episodic hinge).
- Grades 6–7: add helpers and opponents as character slots.
- Grades 8–9: offer Propp's seven roles as an optional cast-builder.

### WHAT CHARACTER STUDIO SHOULD DO

**S6-R1.** Treat quest as the **default goal-driven recommendation below Grade 6**, in preference to three-act or hero's journey. *Cites the complexity/prerequisite analysis, `A2-C04`. Confidence: moderate.* Rationale: it delivers goal-directedness without demanding transformation or act architecture.
**S6-R2.** Make the obstacle card **repeatable with no cap and no minimum**. *DESIGN DECISION. Confidence: moderate.* Rationale: it lets the same structure serve a 3-sentence story and a 30-page one, and it is the natural bridge to episodic.
**S6-R3.** Use Propp's role list as a **character-generation** feature, never as a plot-validation feature — and label it as one folklorist's analysis of Russian folktales, not as universal roles. *Cites `A2-C46`. Confidence: high on the labelling.*
**S6-R4.** Never convert an internal goal into an external object. If a child writes "she wants to be brave," the tool must not suggest "what object represents bravery?" unless the child asks. *DESIGN DECISION grounded in the cultural-assumptions analysis. Confidence: moderate.*

---

## §7 — Todorov's Equilibrium Model

### WHAT RESEARCH SAYS

`A2-C47` `[E2]` `[SECONDARY-SOURCED]` — **Tzvetan Todorov, "The Two Principles of Narrative," *Diacritics* 1(1), 1971, 37–44.** Retrieved account of the actual argument: narrative rests on **two principles — succession and transformation**. Without transformation, stories are mere description of events; without change, they are "boring and repetitious descriptions of everyday occurrence."

`A2-C48` `[E6]` `[SECONDARY-SOURCED]` — **The famous "five stages" version is a downstream popularisation, principally through UK media-studies teaching:** equilibrium → disruption → recognition → repair/resolution → new equilibrium, with the emphasis that the final equilibrium is *not identical* to the first, and that narrative is therefore circular rather than linear.
**Provenance flag — treat with the same caution as Freytag.** My own retrieval is internally inconsistent: one source asserted "the essay claims that all narratives contain the same five formal elements," while the synthesis of the same query noted the core argument "actually centers on these two fundamental principles… rather than prescribing a rigid five-stage model." Every source I reached for the five-stage version was a media-studies revision site, a student blog, or Wikipedia. **I could not read the Diacritics essay.** `[UNVERIFIED]` — whether Todorov enumerated five stages.

**Defining components.** Two principles (Todorov as retrieved); or five stages (popularisation).

**Complexity.** Low–Medium (the five-stage form is 5 slots but each is short; the two-principle form is not a slot structure at all).

**Developmental prerequisites.** The concept of a *normal state* that can be disturbed and re-established. Recognisable to young children — this is the shape of most picture books.

**Age bands.** Ages 7–8/Grades 2–3 upward in simplified form. *Basis: complexity analysis; no empirical study retrieved.*

**Strengths for children's storytelling.** The most useful property for this product: **the ending is a new normal, not a victory.** That gives children a legitimate, named way to end a story without defeating anyone. It also sits comfortably with circular structures (§10) because it is explicitly non-linear in the retrieved framing.
**Strengths for character creation — what it demands of a character.** Very little: a character needs a **normal life** that can be described. That is an unusually gentle and unusually generative character prompt — "what is an ordinary day for your character?" is answerable by a 2nd-grader and produces far more than an appearance list (`A2-C22`).

**Limitations.** "Recognition" and "repair" are abstract. The model tells you nothing about pacing or about how big the disruption should be.

**Cultural assumptions.** Moderate. It presumes a stable baseline order that *ought* to be restored — an implicitly conservative shape. It fits badly with stories in which the point is that the old order should not return.

**Do NOT impose when:** the story has no stable baseline (a story that begins in crisis); the child's ending deliberately refuses restoration.

**Child-friendly terminology.** Grades 2–3: "how things usually are / something messes it up / a new usual." Grades 4–5: "normal / trouble / noticing / fixing / a new normal." Grades 6–9: equilibrium, disruption, new equilibrium.

**Simplified variants.**
- Grades 2–3: three cards — "usually…" / "but then…" / "and now…"
- Grades 4–5: five cards.
- Grades 6–9: five stages, plus the honest note that Todorov's own essay is about succession and transformation (`A2-C47`, `A2-C48`).

### WHAT CHARACTER STUDIO SHOULD DO

**S7-R1.** Use the three-card "usually / but then / and now" form as the **primary alternative** to problem-solution at Grades 2–5. *Cites `A2-C47`, `A2-C48`. Confidence: moderate.* Rationale: it delivers change without requiring conflict or a winner.
**S7-R2.** Use "What is an ordinary day for your character?" as a standard character-creation prompt regardless of chosen structure. *Cites `A2-C22`, `A2-C48`. Confidence: moderate — this is a design inference, not a finding.*
**S7-R3.** Do not attribute the five-stage version to Todorov in any copy until `A2-C48` is resolved. Present it unattributed, or attribute it as "a way media teachers describe stories." *Cites `A2-C48`. Confidence: high.*

---

## §8 — Problem–Solution Structure

### WHAT RESEARCH SAYS

`A2-C49` `[E2]/[E1]` `[SECONDARY-SOURCED]` — **Bonnie Meyer (1975)** is the seminal source for expository text structure. The five structures identified: **description, sequence, comparison, cause–effect, problem–solution.** Meyer's premise is that readers comprehend more readily when they recognise the organising structure and can use it to build their own mental representation. Retrieved: Meyer concluded that some structures make content easier to comprehend and better remembered — the "powerful" ones being **compare/contrast, cause/effect and problem/solution** — while **description and sequence** were much less efficient.
*Important scoping note:* Meyer's taxonomy is about **expository** text. Its transfer to narrative composition is an instructional extension, not a finding.

`A2-C50` `[E4]` `[SECONDARY-SOURCED]` — **"Somebody Wanted But So Then" (SWBST)** is a widely used summarising strategy attributed to **Macon, Bewell & Vogt (1991)**. Elements: Somebody (main character) · Wanted (goal/motivation) · But (problem/conflict) · So (solution) · Then (outcome/resolution). It is used during or after reading, with fiction and nonfiction, and is described as helping students identify main ideas, recognise cause-and-effect, make generalisations and compare points of view.
`[UNVERIFIED]` — **I found no efficacy evidence for SWBST specifically.** The one study surfaced was an Indonesian EEJ article on SWBS and reading comprehension, which I could not retrieve. Treat SWBST as `[E4]` practice, not `[E1]`.

`A2-C51` `[E3]` — Note what the K–3 standards do **not** say: `A2-C21` requires sequencing, detail, temporal words, and "a sense of closure" — never a problem and never a solution. The problem–solution framing of early narrative writing is **instructional convention layered on top of the standards**, not the standards themselves.

**Defining components.** A problem; attempts; a solution. (SWBST adds character and goal at the front and outcome at the back.)

**Complexity.** Low–Medium (3–5 slots).

**Developmental prerequisites.** Recognising a state as *undesirable*; connecting an action to a change in that state. Available early.

**Age bands.** Ages 7–8/Grades 2–3 upward. *Basis: instructional convention (`A2-C50`) and the developmental fit with story-grammar attempt/consequence (`A2-C04`). Not an empirical age finding.*

**Strengths for children's storytelling.** Extremely легко taught, extremely transferable, and the "But" in SWBST is the single most efficient prompt in the whole document for converting an appearance-only character into a character with stakes (`A2-C22`).
**Strengths for character creation — what it demands of a character.** A **want** and something that **thwarts** it. Minimal but pointed. Note that SWBST's "Somebody Wanted" front-half is itself a complete character-creation prompt and can be used *without* the rest.

**Limitations.** This is the structure most likely to **manufacture conflict where the child did not intend any**. It presumes problems have solutions. It maps poorly onto stories about acceptance, wonder, grief, or belonging.

**Cultural assumptions.** Significant and under-discussed. Problem–solution is the shape of Western school literacy, and it is precisely the "topic-centered, one-problem" shape that `A2-C10`/`A2-C11` document being used to judge children's storytelling as deficient. Because it is so easy to teach, it is the structure most likely to be over-applied.

**Do NOT impose when:** the child has not framed anything as a problem; the story is descriptive, atmospheric, celebratory or relational; the child is telling a personal narrative (`A2-C07` — personal narratives are organised around a high point, not a solution); or a story is being told in a topic-associating style.

**Child-friendly terminology.** Grades 2–3: "what goes wrong / how they fix it" — but see `S8-R2`. Grades 4–5: SWBST as a five-word chant. Grades 6–9: problem, complication, resolution.

**Simplified variants.**
- Grades 2–3: two cards — "the trouble" / "what they did."
- Grades 4–5: SWBST, five cards.
- Grades 6–9: problem–solution offered as one of Meyer's five text structures, with the honest note that it is an *expository* taxonomy (`A2-C49`).

### WHAT CHARACTER STUDIO SHOULD DO

**S8-R1.** Use **"Somebody / Wanted"** as a character-creation prompt pair independent of any plot structure. *Cites `A2-C50`, `A2-C22`. Confidence: moderate–high.* This is the highest-leverage, lowest-cost item in this document for a character tool.
**S8-R2.** Never auto-insert a problem. If the child has not named one, the tool must not ask "what goes wrong?" more than once, and must accept "nothing" as a complete answer. *Cites `A2-C16` (non-restrictive prompts), `A2-C10`, `A2-C51`. Confidence: high.*
**S8-R3.** Do not present problem–solution as the default for personal/true stories. Offer the high-point shape instead (§16). *Cites `A2-C07`. Confidence: moderate.*
**S8-R4.** Do not claim evidence for SWBST. Internal docs must carry the `[E4]`/no-efficacy-found flag. *Cites `A2-C50`. Confidence: high.*

---

## §9 — Story Mountain (UK primary practice)

### WHAT RESEARCH SAYS

`A2-C39` `[E4]` `[SECONDARY-SOURCED]` — **Pie Corbett's Talk for Writing** is widely used in UK primary schools. The **story mountain** is introduced as a **planning tool**, appearing in Talk for Writing progression guidance from Early Years (3–5) alongside whole-class retelling and understanding of beginning and middle sections. Talk for Writing's overall pattern is three-tier: **Imitation → Innovation → Independent Application**, with children supported to generate and develop their own ideas, imitate key learning patterns for a text type, and rehearse "the tune of the language" before shared writing.

`A2-C40` `[E4]` — The story mountain is functionally a simplified Freytag pyramid (§4) rendered as a drawable shape. I found **no** empirical evaluation of the story mountain as an isolated tool. Talk for Writing itself is a commercial/professional programme; treat as `[E4]`, and its Imitation→Innovation→Independence progression as `[E4]` practice.

**Defining components.** Opening · build-up · problem/climax · resolution · ending, drawn as a mountain.

**Complexity.** Low–Medium.

**Developmental prerequisites.** Same as beginning-middle-end plus a sense of "biggest moment."

**Age bands.** Ages 5–6/K–1 (as retelling) through Ages 9–10/Grades 4–5. *Basis: the Talk for Writing progression itself (`A2-C39`) — i.e. curriculum convention.*

**Strengths for children's storytelling.** The strongest **visual** metaphor available for pacing, and it is drawable, which matters for a tool with a visual canvas. Talk for Writing's **Imitation → Innovation → Independence** sequence is itself an implementable product pattern and aligns with the "fade the scaffolding" principle in `A2-C16`.
**Strengths for character creation.** Minimal direct demand. The climb implies a character who can be *put under increasing pressure*, but nothing more.

**Limitations.** Inherits Freytag's assumptions (§4). Assumes exactly one peak. The descent is under-supported for the same reason `A2-C33` describes.

**Cultural assumptions.** Same as Freytag's, minus the tragic framing.

**Do NOT impose when:** the story has multiple peaks (episodic, §11); the story has no peak (slice-of-life); or a child's drawing/plan is being used as evidence of quality.

**Child-friendly terminology.** Already child-friendly. Grades 2–3: "climb up / the top / go down." Grades 4–5: "opening, build-up, the big moment, sorting it out, ending."

**Simplified variants.** K–1: two-point hill. Grades 2–3: three-point mountain. Grades 4–5: five-point. Grades 6+: retire it in favour of named structures — DESIGN DECISION.

### WHAT CHARACTER STUDIO SHOULD DO

**S9-R1.** Adopt **Imitation → Innovation → Independent Application** as Character Studio's own scaffolding-fade pattern: model a structure, let the child swap parts of it, then let them build without it. *Cites `A2-C39`, `A2-C16`. Confidence: moderate.*
**S9-R2.** Allow the mountain to have more than one peak, and do not flag multi-peak plans. *Cites `A2-C15`(structure knowledge, not story quality, is what such tools reliably build), §11. Confidence: moderate.* DESIGN DECISION.

---

## §10 — Circular Narrative

### WHAT RESEARCH SAYS

`A2-C52` `[E4]` `[SECONDARY-SOURCED]` — A **circular plot structure** is defined as a narrative in which a story begins and ends in the same or a comparable place — physically (setting), figuratively, or thematically — creating a sense of closure and continuity. Retrieved from an EBSCO research-starter entry and a Salve Regina University children's-literature research guide, i.e. library/reference tier, not empirical research.

`A2-C53` `[E4]` `[SECONDARY-SOURCED]` — In picture books, the first and final scenes function as **mirrors**: comparing the character's outlook and behaviour across them reveals growth, change, or insight gained. Retrieved children's-literature examples: *If You Give a Mouse a Cookie* and *If You Give a Moose a Muffin* (Numeroff & Bond), *Anansi and the Moss-Covered Rock* (Kimmel), *The Mitten* (Brett); the Narnia Chronicles were cited as classic circular narratives in which the children return to their original world.

`A2-C54` `[E2]` — Todorov's model as popularised is explicitly described as circular rather than linear, with the closing equilibrium not identical to the opening one (`A2-C48`) — so circularity is not fringe; it is embedded in a mainstream narratological account.

**Defining components.** An opening state; a departure from it; a return to it that is *comparable but not identical*.

**Complexity.** Low (2 anchor slots plus whatever goes between).

**Developmental prerequisites.** The ability to hold an opening image in mind and reproduce it. **This is developmentally very accessible** — the *If You Give…* books are read to preschoolers.

**Age bands.** Ages 5–6/K–1 upward. *Basis: the picture-book evidence in `A2-C53` is about books read to and by very young children; that is convention plus corpus, not an empirical study of children composing circular stories.*

**Strengths for children's storytelling.** Two enormous product advantages. First, **it supplies an ending for free** — the hardest part of a story for young writers — without requiring resolution, victory, or a solved problem. Second, it is the clearest available **non-conflict-centred** structure that children already recognise from books they know. It is also cyclical rather than linear, which makes it a natural point of contact with the oral traditions in §§17–20.
**Strengths for character creation — what it demands of a character.** A character with a **home state** — a place, routine, or relationship they belong to. It demands *no* goal, *no* flaw, *no* transformation. The mirror property (`A2-C53`) makes it a very efficient character prompt: "show your character in the same place at the start and the end — what's different about them?" That question elicits character change without requiring the child to name an internal state (`A2-C04`).

**Limitations.** Can become genuinely repetitive rather than meaningfully circular. Long circular stories are hard to sustain. Gives no guidance on the middle.

**Cultural assumptions.** Among the lightest here. Circularity does not presume conflict, individual heroism, or restoration-as-victory. It does presume a stable starting point worth returning to.

**Do NOT impose when:** the child's story is deliberately open-ended; the point is that there is no going back.
**And critically: never *correct* a circular story into a linear one.** See `AI-4`.

**Child-friendly terminology.** Grades 2–3: "a story that comes back around" / "ends where it started." Grades 4–5: "circle story," "loop." Grades 6–9: circular structure, framing, mirrored opening and closing.

**Simplified variants.**
- K–3: two cards — "the same place at the start" / "the same place at the end," with an open middle.
- Grades 4–5: add "what's different the second time?"
- Grades 6–9: circular structure as a deliberate choice, with the mirror explicitly designed.

### WHAT CHARACTER STUDIO SHOULD DO

**S10-R1.** Offer circular structure at **every** age band from Grade 2 up, and ensure it appears in the top three recommendations whenever no conflict is detected in the child's sample. *Cites `A2-C52`, `A2-C53`, and the anti-imposition stance from `A2-C10`/`A2-C11`. Confidence: moderate–high.*
**S10-R2.** Use the mirror prompt — "same place, start and end: what changed about your character?" — as the tool's default **character-arc** mechanism below Grade 6, in preference to any transformation vocabulary. *Cites `A2-C53`, `A2-C04`, `A2-C22`. Confidence: moderate.*
**S10-R3.** Hard rule: when a story returns to its opening state, the tool must **never** suggest that the story "doesn't go anywhere," "needs more to happen," or "needs a resolution." *Cites `A2-C52`, `A2-C54`, `XC-2`. Confidence: high. See `AI-4`.*

---

## §11 — Episodic Narrative

### WHAT RESEARCH SAYS

`A2-C55` `[E4]` `[SECONDARY-SOURCED]` — Episodic plot structure organises a narrative into **separate, self-contained episodes** contributing to a whole: the larger story is split into smaller, usually self-contained events or adventures, tied together by a unifying theme or a larger narrative. Scholars contrast **"episodic plot"** with **"climactic plot,"** with each chapter functioning as a dramatic plot of its own — *Anne of Green Gables* is the retrieved example. Retrieved from craft/reference tier (Novlr glossary, Vaia, Fiveable), not from literary scholarship I could open.

`A2-C56` `[E2]` `[SECONDARY-SOURCED]` — The **picaresque** novel is characterised by episodic structure, typically first-person, following a *pícaro* through varied social environments. Retrieved via Britannica. A picaresque novel, a framed collection of tales, or a modern work with vignette-like chapters may all rely on episodic structure while the **cultural purpose differs**.

`A2-C57` `[E4]` `[SECONDARY-SOURCED]` — Episodic structure is explicitly named as a feature of **African oral traditions** — "episodic structures that allow storytellers flexibility to adapt segments based on the occasion" (see §17). This matters: episodic form is not a lesser version of climactic form; in performance traditions it is functional, enabling adaptation to audience and occasion.

**Defining components.** Repeatable self-contained units; a unifying element (character, place, theme); no requirement of escalation between units.

**Complexity.** Low per unit; the whole is as long as the child wants.

**Developmental prerequisites.** Only the ability to write one short complete thing, repeatedly. **This is the lowest-prerequisite structure in the document for producing a lot of story.**

**Age bands.** Ages 5–6/K–1 upward. *Basis: prerequisite analysis. Note that Applebee's "sequences" stage (`A2-C06`) — labelling around a central theme or character with no plot — is structurally episodic, which means episodic writing is a documented natural developmental form, not merely a stylistic option.*

**Strengths for children's storytelling.** It is the structure that **best matches how many children naturally produce narrative** (`A2-C06` sequences; `A2-C10` topic-associating). It scales to any length. It supports collaborative and serialised work — directly relevant to an *Episode* Page Portal. It removes the need to plan an ending in advance.
**Strengths for character creation — what it demands of a character.** Episodic structure is the **most character-favourable structure in this document**, because the unifying element is usually the character themselves. It demands a character who is **interesting enough to watch do things** — i.e. a character with voice, habits, reactions and relationships rather than a goal. For a product called Character Studio, this is arguably the flagship structure: it makes character, not plot, the load-bearing element.

**Limitations.** Can lack cumulative meaning; endings can feel arbitrary. Because it resembles "a list of things that happened," it is the structure most at risk of being *misread by adults* as underdeveloped — the exact error documented in `A2-C11`.

**Cultural assumptions.** Very light, and it is positively attested outside the Western climactic tradition (`A2-C57`).

**Do NOT impose when:** the child is building toward a single climax; the child has explicitly planned a single arc.
**And never *correct* an episodic story into a climactic one.** See `AI-4`.

**Child-friendly terminology.** Grades 2–3: "lots of little stories about the same person." Grades 4–5: "episodes," "chapters that each do their own thing." Grades 6–9: episodic structure, vignettes, serialised narrative.

**Simplified variants.**
- Grades 2–3: a repeatable "another thing that happened" card, unlimited.
- Grades 4–5: episodes plus an optional "something that's the same in every one" theme card.
- Grades 6–9: episodic structure with an optional overarching thread.

### WHAT CHARACTER STUDIO SHOULD DO

**S11-R1.** Treat episodic as a **first-class recommended structure at every band**, not as a fallback. *Cites `A2-C55`, `A2-C57`, `A2-C06`. Confidence: moderate–high.*
**S11-R2.** When the observed sample shows repeated independent scenes with no escalation, the tool must recommend **episodic** and must **not** interpret this as a missing plot. *Cites `A2-C06`, `A2-C10`, `A2-C11`, `A2-C55`. Confidence: high.*
**S11-R3.** Because episodic form makes the character the through-line, pair it automatically with character-depth prompts (voice, habits, what they always do, who they always argue with) rather than plot prompts. *Cites `A2-C22`, `A2-C55`. Confidence: moderate.*
**S11-R4.** Given the Episode Page Portal context, episodic should be the structure with the strongest platform-level support (serialisation, per-episode publishing). *DESIGN DECISION, product-fit reasoning. Confidence: moderate.*

---

## §12 — Kishōtenketsu (起承転結) — EXTENDED PROVENANCE TREATMENT

**Read this section's provenance analysis before using kishōtenketsu anywhere in the product.** English-language description of this structure is unusually unreliable, and the popular framing ("a story structure with no conflict") is the part that is least supported by what I could retrieve.

### WHAT RESEARCH SAYS

**Origin and the actual textual tradition**

`A2-C58` `[E2]` `[SECONDARY-SOURCED]` — Kishōtenketsu (起承転結) is the Japanese reading of a four-part scheme originating in **classical Chinese poetics** as **qǐ chéng zhuǎn hé (起承轉合)**, associated with Tang-dynasty regulated verse and the four-line *jueju* quatrain, in which each line performs one of the four functions. It was formalised in Japan in *shichigon-zekku*, the Japanese form of Chinese four-line poetry.

`A2-C59` `[E2]` `[SECONDARY-SOURCED]` — Glosses retrieved: Japanese 起承転結 as "rise, continuation, turn, tie-up"; Chinese 起承轉合 as "start, receive, turn, combine"; and per-element glosses **qi = 'bringing into being', cheng = 'understanding', zhuan = 'changing', he = 'drawing together'**. The **third element, zhuǎn ("turn"), is described as the most important** — "a poem lived or died on the quality of its turn." A description attributed to **Fan Heng (1272–1330)** characterises the four styles: qi as straight, cheng likened to a mortar, zhuan as change, and he likened to a deep pond or overflowing river prompting reflection on meaning.
*Retrieval caution:* the Fan Heng attribution came from HandWiki/Grokipedia-tier sources. `[UNVERIFIED]` as to Fan Heng specifically.

`A2-C60` `[E2]` `[SECONDARY-SOURCED]` — The scheme migrated from poetry into prose, essay writing, theatre, the four-panel **yonkoma** manga format, and later anime, games and film. In yonkoma the mapping is: **ki** sets the scene, **shō** develops it, **ten** introduces an unforeseen development, **ketsu** shows the effects of the third panel. The first yonkoma is attributed to **Rakuten Kitazawa, 1902**.

**What linguistics research actually says — this is the important part**

`A2-C61` `[E1]` `[SECONDARY-SOURCED]` — **John Hinds (1983)** analysed Japanese newspaper columns (the *Tensei Jingo* column in the *Asahi Shimbun*) and reported the **ki-shō-ten-ketsu** pattern as a highly valued, typical Japanese rhetorical format: **ki** introduces the topic; **shō** develops it; **ten** forms an **abrupt transition or a vaguely related point**; **ketsu** concludes — and the conclusion is described as **not decisive**. Hinds (1990) later classified expository writing in Japanese, Korean, Chinese and Thai as **inductive, deductive, quasi-inductive**.
*Note carefully:* Hinds studied **expository newspaper columns**, not fiction and not children's stories.

`A2-C62` `[E1]` `[SECONDARY-SOURCED]` — **Ryuko Kubota (1997), "A Reevaluation of the Uniqueness of Japanese Written Discourse: Implications for Contrastive Rhetoric," *Written Communication* 14(4), 460–480**, directly challenges the contrastive-rhetoric claims about Japanese prose. Retrieved argument: the characterisation of Japanese expository prose as ki-shō-ten-ketsu, reader-responsible, and inductive-with-sudden-topic-shift — and the associated claim that English readers struggle with Japanese-authored texts because of these "culturally unique conventions" — **can be challenged**. Kubota argues that prior studies **view language and culture as exotic and static rather than dynamic**, and **overgeneralise cultural characteristics from a few specific examples**. She points to **multiple competing interpretations of ki-shō-ten-ketsu offered by composition specialists in Japan**, and to Western linguistic and educational influence on modern Japanese since the mid-19th century.

`A2-C63` `[E1]` `[SECONDARY-SOURCED]` — Premaratne, in the *Electronic Journal of Contemporary Japanese Studies* (vol. 13, iss. 4), reports that while ki-shō-ten-ketsu represents a traditional Japanese rhetorical style, **its application is no longer prevalent in modern Japanese prose, and although it is still introduced to Japanese students in elementary and junior high schools, it is rarely practised.** The same article reports digression as a feature of Japanese writing in both expository prose and opinion discourse.

**What the English-language writing-advice literature says — tiered low deliberately**

`A2-C64` `[E6]` `[SECONDARY-SOURCED]` — The dominant English-language framing is that kishōtenketsu is "a story structure without conflict." Even within the craft literature this is **contested**: retrieved craft sources state that "there have been quite a few misunderstandings about what kishotenketsu actually is… on its way to the West"; that a conflict-less kishōtenketsu story works at short length but "if it's longer than a few pages, it's going to need some form of conflict to be satisfying"; and that the disagreement partly turns on the **definition of conflict** — narrowly as direct opposition between characters or forces (in which case kishōtenketsu does show narrative without it), or broadly as tension, contrast, or the gap between perspectives (in which case kishōtenketsu simply arranges those elements differently). Other retrieved craft claims: "tension isn't the heart of the story… the twist is the high point"; the *ketsu* "doesn't have to be a resolution with problems solved" but "is simply an ending."
**All of `A2-C64` is writing-blog content. None of it is scholarship. I could not find a single peer-reviewed source in this session that describes kishōtenketsu as a conflict-free *fiction* structure.**

`A2-C65` `[UNVERIFIED]` — A reference to research by **Watanabe Masako**, reportedly showing wordless yonkoma manga to Japanese schoolchildren and separately to American children and analysing how differently they constructed explanatory stories, appeared in a PMJS mailing-list thread. **I could not verify the study, its citation, its methods, or its findings.** It would be highly relevant if real; someone should chase it.

**Honest summary of the provenance picture**

Putting `A2-C58`–`A2-C65` together, the defensible position is:
- The **four-part scheme is real, old, and well attested** — as a poetics and composition scheme originating in Chinese quatrain form and used in Japanese writing pedagogy and in yonkoma.
- The **"turn" (ten) is genuinely central** and genuinely distinguishes the shape from rise-climax-resolve models (`A2-C59`, `A2-C60`, `A2-C61`).
- Its **prevalence in modern Japanese prose is contested and probably overstated** (`A2-C62`, `A2-C63`), and treating it as *the* Japanese narrative structure is exactly the essentialising move Kubota criticises.
- The claim that it is **"the non-Western structure that proves stories don't need conflict"** is a **Western writing-community framing** (`A2-C64`), not a scholarly finding. Using it that way risks doing to Japanese narrative what Campbell is criticised for doing to world myth (`A2-C35`) — flattening a tradition into a slogan.

**Defining components.** ki (introduce) · shō (develop) · ten (turn — an unexpected, sometimes only obliquely related development) · ketsu (tie together / conclude, not necessarily resolve).

**Complexity.** Low structurally (4 slots) but **High conceptually** — the *ten* is genuinely difficult, because it must be surprising yet retrospectively coherent.

**Developmental prerequisites.** The ability to produce a surprise that *changes the meaning* of what came before rather than merely adding an event. This is a real cognitive demand and should not be underestimated because the slot count is small.

**Age bands.** Ages 9–10/Grades 4–5 upward for the four-panel comic form; Ages 11–12/Grades 6–7 upward for prose. *Basis: the conceptual demand of the ten, plus the yonkoma precedent. `A2-C63` reports it is introduced in Japanese elementary and junior high schools — the closest thing to an age basis I retrieved, and it concerns composition instruction generally, not fiction.*

**Strengths for children's storytelling.** Very short. Naturally suits four-panel comics, which fits a visual portal well. Provides a legitimate way to write a satisfying story with no antagonist and no problem solved. Rewards observation and wit over escalation.
**Strengths for character creation — what it demands of a character.** This is the sharpest contrast in the document. **A kishōtenketsu slot demands almost nothing of a character.** No goal, no flaw, no transformation, no antagonist. What it needs is a character who is **capable of being surprised, or of being seen differently** — a character with a **perspective** rather than a want. Design implication: when a child picks kishōtenketsu, Character Studio should prompt for *how the character sees things*, *what they notice*, *what they'd never expect* — not for goals and obstacles. Contrast the hero's-journey demands in §5.

**Limitations.** The *ten* is hard to teach and easy to reduce to "a random twist." Long-form use is contested even within the craft literature (`A2-C64`). English-language teaching materials are unreliable.

**Cultural assumptions.** It carries its own — but the greater risk is the **appropriative** one: presenting a Chinese-origin, Japanese-transmitted poetics scheme as "the no-conflict alternative to Western structure" is itself a Western framing (`A2-C62`, `A2-C64`).

**Do NOT impose when:** the child wants a conflict-driven story; the tool would use it as a token "non-Western option"; or copy would need to make a claim about "how Japanese stories work."

**Child-friendly terminology.** Grades 4–5: "set it up / build it / **the turn** / tie it together." Grades 6–7: "introduction, development, turn, conclusion" with the Japanese/Chinese terms shown alongside. Grades 8–9: ki-shō-ten-ketsu with romanised and character forms and a provenance note.

**Simplified variants.**
- Grades 4–5: a **four-panel comic** template. This is the most honest and most developmentally apt form, and it matches the yonkoma lineage (`A2-C60`).
- Grades 6–7: four short prose sections.
- Grades 8–9: full form, with the Kubota caution offered as a genuine critical-reading note.

### WHAT CHARACTER STUDIO SHOULD DO

**S12-R1.** **Never** label kishōtenketsu "the structure without conflict" in child- or teacher-facing copy. Use "the turn" as its identifying feature instead. *Cites `A2-C61`, `A2-C64`. Confidence: high.*
**S12-R2.** **Never** present it as "how Japanese stories work" or as representative of Japanese narrative in general. Attribute it accurately: a four-part scheme from classical Chinese poetry, used in Japanese writing and in four-panel comics. *Cites `A2-C58`, `A2-C62`, `A2-C63`. Confidence: high.*
**S12-R3.** Do not use kishōtenketsu as the tool's answer to "we need a non-Western option." If the product needs non-conflict-centred options, **circular (§10), episodic (§11), equilibrium (§7) and high-point (§16) are all better-evidenced and less appropriative choices.** *Cites `A2-C62`, `A2-C64`, `A2-C52`, `A2-C55`. Confidence: moderate–high. This is an important design correction.*
**S12-R4.** Ship the four-panel comic template as the primary implementation. *Cites `A2-C60`. Confidence: moderate.*
**S12-R5.** When selected, prompt for **perspective**, not goals: "what does your character notice that nobody else does?" *Cites the structure-demands analysis and `A2-C22`. Confidence: moderate — design inference.*
**S12-R6.** Before shipping any kishōtenketsu copy, have it reviewed by someone with Japanese-language literary or educational expertise. *DESIGN DECISION / process rule. Confidence: high that this is warranted, given `A2-C62` and the state of English-language sources.*

---

## §13 — Jo-ha-kyū (序破急)

### WHAT RESEARCH SAYS

`A2-C66` `[E2]` `[SECONDARY-SOURCED]` — **Jo-ha-kyū** is a Japanese aesthetic principle governing the rhythmic and temporal structure of performance in three phases: **jo** (beginning/introduction — slow, unmeasured tempo), **ha** (breaking/development — measured, accelerating), **kyū** (rapid/conclusion — quick and conclusive). It **originated as the three movements of courtly *gagaku***.

`A2-C67` `[E2]` `[SECONDARY-SOURCED]` — **Zeami (c.1363–c.1443)** adapted the gagaku concept into Noh. In his treatise ***Sandō* (The Three Paths)** he describes a five-part (five *dan*) Noh play as the ideal: slow and auspicious in the first part (jo); drama and tension building in the second, third and fourth (ha), with the greatest climax in the **third dan**; rapid conclusion returning to peace and auspiciousness in the fifth (kyū). The principle is **fractal** — it governs the play, the songs and dances within it, individual steps, motions and sounds, and also the ordering of an entire five-play Noh programme. Its aesthetic goal is described as *yūgen*, "dark, mysterious beauty."

**Defining components.** Three tempo phases, applied recursively at every scale.

**Complexity.** Low as three slots; **conceptually distinctive** because it is about **tempo**, not about events.

**Developmental prerequisites.** A sense of pace — slow, faster, fastest. Arguably available very early through music and movement.

**Age bands.** Any band, if presented as pace rather than as Noh dramaturgy. *Basis: my own analysis; no research on teaching jo-ha-kyū to children was retrieved. State this plainly.*

**Strengths for children's storytelling.** It is the only model here that describes **rhythm rather than events**, which means it can be laid over *any* other structure — including episodic and circular — without conflicting with it. Its recursion is genuinely useful: a child can apply it to one scene or the whole story. It gives a legitimate vocabulary for "this bit should feel slow."
**Strengths for character creation — what it demands of a character.** Nothing structurally. But it invites a distinctive character question: *how does this character move through time?* — do they rush, do they linger? That is a character-voice prompt no other model here supplies.

**Limitations.** Abstract. Provides no help with content. Almost entirely absent from English-language children's writing pedagogy, so teachers will have no scaffolding for it.

**Cultural assumptions.** Specific to Japanese performance aesthetics; its climax placement (third of five) differs from Western late-climax expectation, which is itself instructive.

**Do NOT impose when:** the child needs help with *what happens*; or the tool would present it as a plot structure — it is not one.

**Child-friendly terminology.** Grades 2–5: "slow start / speeding up / fast finish." Grades 6–9: jo-ha-kyū, with translation and the note that it comes from Japanese court music and Noh theatre.

**Simplified variants.** All bands: a three-segment **pace slider** applied to whatever structure the child already chose. DESIGN DECISION.

### WHAT CHARACTER STUDIO SHOULD DO

**S13-R1.** Implement jo-ha-kyū as an **optional overlay on any structure**, not as a structure in the recommendation list. *Cites `A2-C66`, `A2-C67`. Confidence: moderate.*
**S13-R2.** Attribute it accurately (gagaku → Zeami/Noh) and do not conflate it with kishōtenketsu — they are different schemes with different origins and different jobs. *Cites `A2-C66`, `A2-C67`, `A2-C58`. Confidence: high.* Conflating the two is a common online error.

---

## §14 — Frame Narrative / Nested (Emboxed) Stories

### WHAT RESEARCH SAYS

`A2-C68` `[E2]` `[SECONDARY-SOURCED]` — The **Panchatantra** is structurally a **frame story**: a narrative introducing characters who in turn tell a series of short stories. The frame recounts **Vishnu Sharma's** commission by a king to educate three inept princes through entertaining tales embedding moral and strategic lessons. It is organised into **five *tantras*** (treatises), each addressing an aspect of ***niti-shastra*** — the science of practical wisdom and political strategy — and works didactically through anthropomorphic animal characters.

`A2-C69` `[E2]` `[SECONDARY-SOURCED]` — Retrieved description of the nesting mechanics: each part contains at least one story, usually more, **'emboxed'** in the main story (the 'frame-story'); "sometimes there is a double emboxment; another story is inserted in an 'emboxed' story. The stories thus operate like a succession of Russian dolls, one narrative opening within another, sometimes three or four deep."

`A2-C70` `[E4]` `[SECONDARY-SOURCED]` — Frame stories are also named as a feature of **African oral traditions**, "connect[ing] multiple tales within a larger narrative" (§17), and the picaresque/framed-collection distinction appears in the episodic literature (`A2-C56`). Frame narrative is therefore a **cross-traditional** form, not a regional one.

**Defining components.** An outer story with a teller and a reason for telling; one or more inner stories; optionally further nesting.

**Complexity.** Medium (2 levels) to High (3–4 levels, per `A2-C69`).

**Developmental prerequisites.** Understanding that a character can *be* a narrator — i.e. holding two narrative levels at once. This is a genuine cognitive step.

**Age bands.** Ages 9–10/Grades 4–5 upward for two levels; Ages 11–12/Grades 6–7 upward for deeper nesting. *Basis: complexity analysis. No empirical study of children composing frame narratives was retrieved — say so.*

**Strengths for children's storytelling.** Solves several practical problems at once: it lets short pieces be collected into something that feels whole; it supports **collaborative and serialised** work (multiple children can each write an inner tale inside a shared frame); and it gives a reason for a story to be told, which is often more motivating than a plot. Directly compatible with episodic (§11).
**Strengths for character creation — what it demands of a character.** Uniquely, frame narrative demands **a character who tells stories** — with a voice, an audience, a motive for telling, and a relationship to the listener. This produces character depth from a completely different direction than goal/obstacle prompts do, and it is very strong for a character-creation product: "who is your character telling this to, and why?"

**Limitations.** Two levels can confuse younger writers and readers. The outer frame can go unresolved. Requires more setup before the "real" story starts.

**Cultural assumptions.** Light — attested in South Asian, African and European traditions (`A2-C68`, `A2-C70`, `A2-C56`). It does presume a storytelling *occasion*, which is a positive: it foregrounds the social situation of telling, which conflict-centred models omit entirely.

**Do NOT impose when:** the child wants to be inside the story immediately; the frame would be decorative rather than meaningful.

**Child-friendly terminology.** Grades 4–5: "a story inside a story" / "someone telling a story." Grades 6–7: "frame story," "the outer story and the inner story." Grades 8–9: frame narrative, embedded/emboxed narrative.

**Simplified variants.**
- Grades 4–5: one frame + one inner story, with a fixed frame prompt ("someone is telling this to someone else — who, and where?").
- Grades 6–7: one frame + several inner stories (the collection form).
- Grades 8–9: multi-level nesting, with the Panchatantra's five-*tantra* organisation as an optional model.

### WHAT CHARACTER STUDIO SHOULD DO

**S14-R1.** Ship frame narrative as the **collaboration primitive**: a shared frame that multiple children contribute inner stories to. *Cites `A2-C68`, `A2-C69`, `A2-C70`. Confidence: moderate — this is a product inference, but the form supports it naturally.*
**S14-R2.** Use "who is your character telling this to, and why?" as a character prompt available regardless of structure. *Cites `A2-C68`, `A2-C22`. Confidence: moderate.*
**S14-R3.** Attribute the Panchatantra accurately if used as an example (Sanskrit, framed, didactic, animal characters, *niti-shastra*); do not present frame narrative as originating in any single tradition. *Cites `A2-C68`, `A2-C70`. Confidence: high.*

---

## §15 — Ring Composition

### WHAT RESEARCH SAYS

`A2-C71` `[E2]` `[SECONDARY-SOURCED]` — **Mary Douglas, *Thinking in Circles: An Essay on Ring Composition*** (Yale University Press). Retrieved definition: ring composition is "a construction of parallelism that must open a theme, develop it, and round it off by bringing the conclusion back to beginning." Crucially, **"the meaning in this form is not at the end as in linear text, but in the middle,"** which is thematically connected to the beginning and the end.

`A2-C72` `[E2]` `[SECONDARY-SOURCED]` — Douglas compares ring composition to **chiasmus**, noted in Finnish oral poetry, Rumi's Persian poems and the Rigveda; both have a form describable as **ABCBA**. The distinction drawn: in a ring composition (unlike a mere chiasm) the **central section reinforces the rhetoric and themes of the outer framework**. Retrieved examples of analysis: the Book of Numbers, Homer's *Iliad*, and Sterne's *Tristram Shandy*.

`A2-C73` `[E6]` `[SECONDARY-SOURCED]` — Following Roman Jakobson, **Douglas believed this composition style to be universal and stored in the structure of the human brain.** Flagging deliberately: this is a strong universality claim of the same type folklorists criticise in Campbell (`A2-C35`). Treat as the author's position, not as established fact.

**Defining components.** Paired elements arranged symmetrically around a **central turning point** that carries the meaning; an ending that returns to the beginning.

**Complexity.** High (requires planning pairs and a centre).

**Developmental prerequisites.** Symmetry as a compositional idea; the ability to plan a middle before writing.

**Age bands.** Ages 11–12/Grades 6–7 upward. *Basis: complexity analysis only. No study of children composing ring structures was retrieved.*

**Strengths for children's storytelling.** Two genuinely distinctive gifts. First, it **relocates the climax to the middle**, which legitimises stories that do not build to a final peak — useful given `A2-C07`'s end-at-high-point and `A2-C08`'s no-resolution patterns. Second, it is **pattern-making**, which is a mode many children (including many neurodivergent children) find more tractable than escalation. It is also the most natural formal home for repetition-based and cyclical oral forms (§§17–20).
**Strengths for character creation — what it demands of a character.** A character who can be shown **twice, differently** — the same trait, place or relationship seen before and after the centre. Like circular structure (§10) but sharper: it asks for deliberate mirrored pairs, which is an excellent concrete character-change device that does not require naming internal states (`A2-C04`).

**Limitations.** Hard to plan; hard to sustain; almost never taught in English-language primary/middle ELA, so no teacher scaffolding exists. Douglas's universality claim is contestable (`A2-C73`).

**Cultural assumptions.** Douglas frames it as universal (`A2-C73`); the safer position is that it is **widely but not universally** attested. It runs directly counter to the late-climax expectation of Western commercial structure.

**Do NOT impose when:** the child is writing short or improvisationally; planning overhead would exceed the story.

**Child-friendly terminology.** Grades 6–7: "a mirror story" / "the important bit is in the middle." Grades 8–9: ring composition, chiasmus, ABCBA.

**Simplified variants.**
- Grades 4–5: a three-part "mirror" — something at the start, the big thing in the middle, the same something changed at the end.
- Grades 6–7: five parts (A-B-C-B-A) with pairing prompts.
- Grades 8–9: full ring, with the Douglas caveat.

### WHAT CHARACTER STUDIO SHOULD DO

**S15-R1.** Offer ring composition specifically as **"the big moment goes in the middle"** — this is its unique selling point and it directly serves children whose stories do not build to a final peak. *Cites `A2-C71`, `A2-C07`, `A2-C08`. Confidence: moderate.*
**S15-R2.** Do not repeat Douglas's universality claim. *Cites `A2-C73`, and by analogy `A2-C35`. Confidence: high.*
**S15-R3.** Implement pairing as a UI affordance (each element gets an optional "mirror" partner) rather than as prose instruction. *DESIGN DECISION. Confidence: moderate.*

---

## §16 — High-Point / Personal-Narrative Structure

### WHAT RESEARCH SAYS

See `A2-C07`, `A2-C08`, `A2-C09` in Part A. Restated for use as a selectable structure:

`A2-C74` `[E1]` `[SECONDARY-SOURCED]` — High-point analysis (Peterson & McCabe, 1983) describes personal-narrative macrostructure with types including **two-event**, **leap-frog**, **end-at-high-point** and **classic**. The hallmark of a personal narrative is **evaluation used to mark a high point** — i.e. the teller signalling *why this bit matters*, not merely reporting what happened. High-point analysis is recommended for analysing the macrostructure of personal narratives specifically.

`A2-C75` `[E1]` `[SECONDARY-SOURCED]` — Cross-linguistic developmental data (`A2-C08`) reports two-event most frequent at 3, chronological from 4–6, decreasing leap-frog/two-event/one-event with age, and most 6-year-olds not yet producing classic narratives with resolution.

**Defining components.** Orientation → events building to a **high point** → **evaluation** dwelling at the high point → optionally, resolution.

**Complexity.** Low–Medium.

**Developmental prerequisites.** The ability to signal significance ("and that was the scariest part"). Available early and is the natural shape of children's true stories.

**Age bands.** Ages 5–6/K–1 upward. *Basis: `A2-C07`/`A2-C08`, which describe this as the observed developmental form of children's personal narrative — this is one of the few age recommendations here with a genuine empirical basis rather than convention.*

**Strengths for children's storytelling.** It matches how children actually tell true stories, so it requires almost no translation. **Ending at the high point is a legitimate completed form**, which removes the single biggest source of false "incompleteness" judgements. It foregrounds *evaluation* — feelings and significance — which is precisely what makes a story feel personal.
**Strengths for character creation — what it demands of a character.** A character with **a stance toward events** — someone for whom something *matters*. Because evaluation is the hallmark (`A2-C74`), this structure naturally elicits the character's judgement and feeling without requiring the child to model another mind's *plan* (`A2-C04`). For grades 2–3 this may be the single best character-depth route in the document.

**Limitations.** Designed for personal/true narrative, not fiction — though the shape transfers. Provides no support for a long middle.

**Cultural assumptions.** Lighter than story grammar's, but Labov/Peterson-McCabe frameworks are still built on English-speaking North American data, and `A2-C10`/`A2-C11` show that even "well-formed personal narrative" is a culturally situated judgement.

**Do NOT impose when:** the child is writing plotted fiction with a goal; or the tool would use "did they include an evaluation?" as a scoring criterion.

**Child-friendly terminology.** Grades 2–3: "the best bit" / "the biggest part" / "tell us why it mattered." Grades 4–5: "the high point." Grades 6–9: high point, evaluation, orientation, coda.

**Simplified variants.**
- Grades 2–3: two cards — "what happened" / "the biggest bit, and why it mattered."
- Grades 4–5: add orientation ("where and when").
- Grades 6–9: full high-point shape, with resolution explicitly optional.

### WHAT CHARACTER STUDIO SHOULD DO

**S16-R1.** Make high-point the **default recommendation for true/personal stories at every band**, in preference to problem–solution or story grammar. *Cites `A2-C07`, `A2-C74`. Confidence: moderate–high.*
**S16-R2.** Treat "ends at the high point" as **complete**. The tool must never offer to help finish such a story unless the child asks. *Cites `A2-C07`, `A2-C08`, `XC-2`. Confidence: high. See `AI-2`.*
**S16-R3.** Use "why did that matter to your character?" as the evaluation prompt — it is the hallmark element (`A2-C74`) and it is a character prompt, not a plot prompt. *Cites `A2-C74`, `A2-C22`. Confidence: moderate.*

---

## §17 — African Oral Storytelling Traditions

**Provenance warning.** My retrieval for this section is the weakest in the document. Every source I reached was tertiary — encyclopedia entries, study-guide sites (Fiveable), and general-interest pages — because the scholarly hosts were egress-blocked and my search budget ran out before I could target specific folklorists (Finnegan, Okpewho, Scheub). **Nothing in §17 should be treated as scholarship, and this section should be re-researched before it informs product copy.** I include it because the alternative — omitting non-Western oral traditions entirely — would itself be a distortion.

### WHAT RESEARCH SAYS

`A2-C76` `[E6]` `[SECONDARY-SOURCED]` `WEAK RETRIEVAL` — Retrieved features of African oral traditions: **call-and-response** segments that turn listeners into active contributors; **frame stories** connecting multiple tales within a larger narrative; and **episodic structures that allow storytellers flexibility to adapt segments based on the occasion**. Many African epics are described as using a **cyclical structure** in which recurring themes and motifs circle back, reinforcing the epic's core messages.

`A2-C77` `[E6]` `[SECONDARY-SOURCED]` — **Dilemma tales** (also "dilemma stories") are described as an African story form intended to provoke discussion, used for both entertainment and instruction. Unlike forms that culminate in firm conclusions, **dilemma stories are open-ended and meant to spark conversation and debate.**

`A2-C78` `[E6]` `[SECONDARY-SOURCED]` `WEAK RETRIEVAL` — Retrieved: the **griot** tradition of West Africa involved historians and storytellers who could recite genealogies of kings and the history of empires; **Anansi** tales of the Ashanti feature a spider who outwits enemies; and a single story could simultaneously encode ecological boundaries, moral expectations, kinship obligations, agricultural knowledge and political warnings.

**Defining components (as retrieved).** Performance with audience participation; episodic and cyclical organisation; frame collection; and — in the dilemma tale — a deliberate **non-resolution** that hands the question to the audience.

**Complexity.** Variable. The dilemma tale is structurally **Low** (situation → dilemma → question) and is by far the most immediately implementable.

**Developmental prerequisites.** For the dilemma tale: the ability to pose a question and hold two defensible sides. Accessible from roughly Grades 3–4.

**Age bands.** Dilemma tale: Ages 9–10/Grades 4–5 upward. Episodic/cyclical forms: any band (see §11). *Basis: my own analysis of the retrieved descriptions. There is no age research here at all.*

**Strengths for children's storytelling.** The **dilemma tale is the most important item in this section for Character Studio**, because it is a named, traditional, non-Western form whose *defining feature is that it does not resolve*. That gives the product a principled, culturally-grounded way to offer "your story doesn't have to end with an answer" — far stronger than the appropriative use of kishōtenketsu criticised in `S12-R3`. Call-and-response and adaptation-to-occasion also model something a digital portal can do literally: stories that invite reader response.
**Strengths for character creation — what it demands of a character.** A dilemma tale demands characters whose **claims are all reasonable** — no villain, because the audience must be able to argue either side. That is a strong and unusual character-design constraint, and a valuable one for a tool trying not to default to heroes and antagonists. The griot and trickster traditions additionally supply character *roles* (the keeper of history; the clever outsider) that are not protagonist/antagonist.

**Limitations.** These are **performance** traditions. Rendering them as a written template loses the audience, the occasion and the adaptation — arguably losing the point. Any implementation should be honest about that.

**Cultural assumptions.** "African oral tradition" is not one thing; it spans an enormous range of languages, peoples and forms. Treating it as a single narrative structure is precisely the essentialising error `A2-C62` criticises for Japanese. **Name specific traditions where possible, not "African storytelling."**

**Do NOT impose when:** the tool cannot name a specific tradition; the child is not being offered the form as a genuine option but as diversity decoration; or the implementation would strip the participatory element and still call it the same thing.

**Child-friendly terminology.** Grades 4–5: "a story that ends with a question" / "you decide" story. Grades 6–9: dilemma tale, call-and-response, cyclical narrative.

**Simplified variants.**
- Grades 4–5: dilemma tale — "set up a situation where two people both have a fair point, then stop and ask the reader."
- Grades 6–9: dilemma tale plus a reader-response affordance in the portal.

### WHAT CHARACTER STUDIO SHOULD DO

**S17-R1.** Ship the **dilemma tale** as a named structure option — "a story that ends with a question for the reader." *Cites `A2-C77`. Confidence: moderate on the form; low on my retrieval quality. Re-verify before shipping.*
**S17-R2.** Never label anything in the product "African story structure." Name the specific form (dilemma tale) and, where the source supports it, the specific tradition. *Cites `A2-C76`–`A2-C78`, and by analogy `A2-C62`. Confidence: high.*
**S17-R3.** Do not ship §17 content without re-research against Finnegan, Okpewho, Scheub or equivalent, and review by someone with relevant expertise. *DESIGN DECISION / process rule. Confidence: high — my retrieval here is not adequate.*
**S17-R4.** If the dilemma tale is used, pair it with the character constraint "everyone in this story should have a fair point." *Cites `A2-C77`. Confidence: moderate.*

---

## §18 — Indigenous North American Oral Narrative (ethnopoetic findings)

**Provenance warning.** As with §17, retrieval here is thin. I reached two genuine scholarly anchors (Hymes, Toelken) but could not open either. There is enormous variation across hundreds of distinct nations and language families, and **no single "Native American narrative structure" exists.** Treat this section as a pointer to two literatures, not as a description of a structure.

### WHAT RESEARCH SAYS

`A2-C79` `[E2]` `[SECONDARY-SOURCED]` — **Dell Hymes** (1927–2009) is the central figure in **ethnopoetics**. Retrieved claims: Native American narratives from valid performances "are organized in terms of **lines, verses, and stanzas**," and "the grouping of lines into verses, and of verses into stanzas, tends to follow, but not exclusively, **the pattern numbers of the culture**." In "Discovering Oral Performance and Measured Verse in American Indian Narrative," Hymes identifies a structural function in the repetition of **initial particles** in Chinook oral narrative — elements corresponding to English "now," "then," "now then," "now again" recurring "in structurally significant roles," constituting "the measuring that makes the material verse." Key works: *"In Vain I Tried to Tell You": Essays in Native American Ethnopoetics*; *Now I Know Only So Far: Essays in Ethnopoetics*.
Summary of the retrieved position: **oral narrative has constraints, and constraints create poetic form.**

`A2-C80` `[E2]` `[SECONDARY-SOURCED]` — **Barre Toelken, "The 'Pretty Languages' of Yellowman: Genre, Mode, and Texture in Navaho Coyote Narratives,"** *Genre* (September 1969), reprinted in Dan Ben-Amos (ed.), *Folklore Genres*, University of Texas Press, 1976. Retrieved contextual fact: there was concern about **playing the Coyote-story tapes at the wrong time of year (e.g. in summer)** — indicating **seasonal restrictions on when certain stories may be told.**
`[UNVERIFIED]` — I could **not** retrieve the specific structural patterns Toelken identified, nor confirm any "pattern of four" claim. I searched for it directly and the results explicitly did not contain it. **Do not state that Indigenous North American narratives use a pattern of four.**

**Defining components.** Not a plot structure at all. What the retrieved research describes is **prosodic and performance structure** — lines, verses, stanzas, repeated initial particles, and culturally specific grouping numbers — plus **protocols governing when and by whom a story may be told**.

**Complexity.** Not comparable to the plot models above; a different axis entirely.

**Developmental prerequisites.** For the transferable element (repetition-as-structure): rhythmic repetition, available very early.

**Age bands.** N/A as a structure. The transferable technique (structural repetition, "and then… and then… and then") is available at all bands.

**Strengths for children's storytelling.** The genuinely portable insight is that **repetition is structure, not filler.** Many children — especially younger and neurodivergent writers — produce heavily repetitive narratives, and this literature supplies a principled reason to treat that as form rather than as immaturity. That is a real product implication.
**Strengths for character creation.** Not applicable directly.

**Limitations and — more importantly — protocols.** `A2-C80` documents that some stories carry **restrictions on when they may be told**. A tool that invites children to "write a Native American style story" would be both inaccurate (there is no single style) and potentially disrespectful of narrative ownership and protocol.

**Cultural assumptions.** The main assumption to interrogate is the product's own: that narrative structures are free-floating templates available for adoption. `A2-C80` is direct evidence that this assumption does not hold universally.

**Do NOT impose — ever, in the following forms:** as a selectable "Native American structure"; as a claim about how Indigenous stories work; or as a template attached to any specific nation without that nation's involvement.

**Child-friendly terminology.** Only the transferable technique should be surfaced, and it should not be ethnically labelled: "saying it again on purpose," "a pattern that repeats."

**Simplified variants.** Offer **"repeating pattern"** as a structure option (three or four repetitions with variation) with **no cultural attribution**, because the technique is genuinely cross-traditional and attribution to a specific tradition would be unsupported by my retrieval.

### WHAT CHARACTER STUDIO SHOULD DO

**S18-R1.** Ship **"repeating pattern"** as a structure option with no ethnic or national attribution. *Cites `A2-C79`. Confidence: moderate.*
**S18-R2.** **Never** offer a "Native American story structure" option, and never claim a pattern-of-four. *Cites `A2-C80`'s `[UNVERIFIED]` status and the no-single-structure point. Confidence: high — this is a hard prohibition.*
**S18-R3.** Treat repetitive child writing as **form**, not deficiency, in every recommender and prompt path. *Cites `A2-C79`, `A2-C06`. Confidence: moderate.*
**S18-R4.** If Grapevine ever wants to represent a specific Indigenous storytelling tradition, that must be done through partnership with that community, not through a structure template. *DESIGN DECISION / process rule grounded in `A2-C80`. Confidence: high.*

---

## §19 — Pūrākau (Māori)

### WHAT RESEARCH SAYS

`A2-C81` `[E2]` `[SECONDARY-SOURCED]` — **Lee, J. (2009), "Decolonising Māori narratives: Pūrākau as a method," *MAI Review* 2(3), 79–91.** Retrieved: pūrākau is "a powerful form of Māori narrative for transmitting knowledge"; Lee describes it as "a form of Māori narrative that originates from oral literature traditions," alongside other forms — **waiata, mōteatea, whakapapa, whaikōrero, whakataukī** — "each with their own categories, style, complex patterns and characteristics as methods of teaching and learning." Lee extends pūrākau toward philosophical thought, epistemological constructs, cultural codes and world views. As a methodology it uses the tree as metaphor: **pū (roots) and rākau (tree)**.

`A2-C82` `[E2]` `[SECONDARY-SOURCED]` — Pūrākau offers a **kaupapa Māori** approach to qualitative narrative inquiry, and the **decolonising process is critical to that approach**. Related: Ware, F., Breheny, M. & Forster, M. (2018), "Kaupapa Kōrero: a Māori cultural approach to narrative inquiry."

**Defining components.** `[UNVERIFIED]` — **I could not retrieve a structural decomposition of pūrākau.** What I retrieved describes it as a *form and epistemology*, not as a slot sequence. This is itself informative: the sources do not present pūrākau as a template.

**Complexity, prerequisites, age bands.** Not assessable from what I retrieved. Do not assign.

**Strengths / limitations for children's storytelling.** Not assessable. What *is* clear from `A2-C81`/`A2-C82` is that pūrākau is embedded in a wider system of Māori narrative forms and in a **decolonising** research stance — meaning that extracting it as a plot template for a commercial tool would run directly against the purpose the cited scholarship gives it.

**Cultural assumptions.** The relevant assumption is the product's, again: that a narrative form can be lifted out of its epistemology and offered as an option. `A2-C82` explicitly frames pūrākau as inseparable from kaupapa Māori.

**Do NOT impose:** Character Studio should **not** ship a "pūrākau" structure option.

### WHAT CHARACTER STUDIO SHOULD DO

**S19-R1.** Do **not** implement pūrākau as a selectable structure. *Cites `A2-C81`, `A2-C82`. Confidence: high.* Rationale: the retrieved scholarship frames it as an epistemology and a decolonising method, not a template; a decontextualised menu item would misrepresent it.
**S19-R2.** Record it in this knowledge base as evidence that **not every documented narrative tradition should become a product feature.** That is a genuine finding for the design team. *Confidence: high.*
**S19-R3.** If Grapevine operates in Aotearoa New Zealand or serves Māori learners, engage appropriately rather than reasoning from this document. *DESIGN DECISION / process rule. Confidence: high.*

---

## §20 — Yarning (Aboriginal and Torres Strait Islander)

### WHAT RESEARCH SAYS

`A2-C83` `[E2]` `[SECONDARY-SOURCED]` — "Yarning/Aboriginal storytelling: towards an understanding of an Indigenous perspective and its implications for research practice," *Contemporary Nurse* 46(1) (also indexed at PubMed 24716757 and JCU ResearchOnline). Retrieved: **yarning is a traditional communication tool involving the sharing of stories and knowledge in a manner that is culturally prescribed, cooperative and respectful**; it is described as a **relational methodology** for transferring Indigenous knowledge, and as a traditional method of imparting knowledge known to Australian Aboriginal Elders.
`[UNVERIFIED]` — **author names.** I retrieved the title and journal but not the authorship. Do not cite authors.

`A2-C84` `[E2]` `[SECONDARY-SOURCED]` — Barlo et al. (2020), "Yarning as protected space: principles and protocols" (Charles Darwin University PDF) — retrieved as a title indicating that yarning carries **protocols** and is framed as a *protected space*.

`A2-C85` `[E6]` `[SECONDARY-SOURCED]` `WEAK RETRIEVAL` — General-interest sources describe Aboriginal knowledge of Country as embedded in stories of the **Dreaming**; that stories teach expectations and proper behaviour and set protocols and responsibilities; and that Elders teach through **yarning circles**. These came from tertiary sources and should not be relied on.

**Defining components.** Not a plot structure. Yarning is a **relational, cooperative practice of exchange** with cultural protocols (`A2-C83`, `A2-C84`).

**Complexity / prerequisites / age bands.** Not applicable as a story template. Do not assign.

**Strengths for children's storytelling.** The transferable idea is **not a structure but an interaction model**: story as cooperative, relational exchange rather than solo composition. That is directly relevant to how a *tool* behaves — it argues for conversational, reciprocal, non-evaluative interaction — and Character Studio can learn from it at the level of interaction design without appropriating the name.
**Strengths for character creation.** Not applicable directly.

**Limitations and protocols.** `A2-C84`'s framing of yarning as a *protected space* with protocols is a direct signal that this is not a template to ship.

**Do NOT impose:** do not ship a "yarning" structure or mode.

### WHAT CHARACTER STUDIO SHOULD DO

**S20-R1.** Do **not** implement yarning as a named product feature or structure. *Cites `A2-C83`, `A2-C84`. Confidence: high.*
**S20-R2.** Take the **interaction lesson** without the name: Character Studio's default conversational stance should be cooperative and reciprocal rather than evaluative — the tool contributes and listens rather than assessing. *Cites `A2-C83`. Confidence: moderate — this is my inference, and it is an inference about tone, not a claim about yarning.*

---

## §21 — Story Spine (improv-derived)

### WHAT RESEARCH SAYS

`A2-C86` `[E5]` `[SECONDARY-SOURCED]` — The **Story Spine** was developed by improviser **Kenn Adams in 1991**, both as a tool for "Play by Play" (a full-length improvised-play structure) **and for teaching storytelling and creative writing to kids in school**. Adams originally called it simply "Once upon a time…"; the name "The Story Spine" was given later by **Kat Koppett**. The sequence: *Once upon a time… Every day… Until one day… And because of that… And because of that… And because of that… Until finally… And ever since then…* (and, in some versions, *And the moral of the story is…*).

`A2-C87` `[E5]` `[SECONDARY-SOURCED]` — It gained wide currency after adoption at **Pixar**, and **Emma Coats** included it as **Rule 4** in her "22 Rules of Storytelling" (retrieved dates vary between 2011 and 2012 across sources — `[UNVERIFIED]` on the year).

**Defining components.** Eight fixed sentence stems, of which the "because of that" stem is repeatable.

**Complexity.** Low to use, Medium to complete well.

**Developmental prerequisites.** Sentence completion and causal chaining ("because"). The causal stem is the real demand — it forbids "and then."

**Age bands.** Ages 7–8/Grades 2–3 upward. *Basis: `A2-C86` states Adams built it partly for teaching storytelling and creative writing to school-age children — this is the designer's stated intent, not evidence of effectiveness. No efficacy evidence was retrieved.* `[UNVERIFIED]` — any claim that the Story Spine improves children's writing.

**Strengths for children's storytelling.** The lowest-friction generative scaffold here: it produces a whole story from sentence stems, which suits a blank-page-averse child. Its **"and because of that"** repetition is the single best available device for teaching **causality over sequence** — the exact distinction between Applebee's *sequences* and *primitive narratives* (`A2-C06`), and between Aristotle's causal beginning and a merely positional one (`A2-C25`).
**Strengths for character creation — what it demands of a character.** "Every day…" is a quietly excellent character prompt — it asks for a **routine**, which yields habit, world and voice rather than appearance (`A2-C22`). It converges with the equilibrium prompt in `S7-R2`.

**Limitations.** It is proprietary craft/improv material `[E5]` with no efficacy evidence. Its fixed stems can produce formulaic output, and the "Until finally… And ever since then…" ending enforces resolution — which conflicts with `XC-2`.

**Cultural assumptions.** Moderate: causal-chain, single-protagonist, resolution-ending. The "moral of the story" variant adds a didactic assumption.

**Do NOT impose when:** the child is writing something non-causal, atmospheric, episodic or circular; or when the enforced ending stems would override a child's chosen non-resolution.

**Child-friendly terminology.** Already child-facing by design.

**Simplified variants.**
- Grades 2–3: four stems — "Once upon a time… / Every day… / Until one day… / And ever since then…"
- Grades 4–5: full eight stems, with "because of that" repeatable.
- Grades 6+: use the stems as a warm-up/unblocking tool rather than as the story plan. DESIGN DECISION.

### WHAT CHARACTER STUDIO SHOULD DO

**S21-R1.** Use the Story Spine as an **unblocking tool** ("stuck? try these openers") rather than as a recommended structure. *Cites `A2-C86`, and the no-efficacy-evidence flag. Confidence: moderate.*
**S21-R2.** Make the final two stems **optional**, so the tool does not force resolution. *Cites `XC-2`, `A2-C07`, `A2-C08`. Confidence: high.*
**S21-R3.** Promote **"Every day…"** into the standard character-creation prompt set. *Cites `A2-C86`, `A2-C22`. Confidence: moderate.*
**S21-R4.** Attribute to Kenn Adams, not to Pixar. *Cites `A2-C86`, `A2-C87`. Confidence: high — the Pixar attribution is the common error.*

---

## §22 — Emotional Arc Shapes (empirical, computational)

### WHAT RESEARCH SAYS

`A2-C88` `[E1]` `[SECONDARY-SOURCED]` `NUMBER AT RISK` — **Reagan, A. J., Mitchell, L., Kiley, D., Danforth, C. M. & Dodds, P. S. (2016), "The emotional arcs of stories are dominated by six basic shapes," *EPJ Data Science* 5:31, DOI 10.1140/epjds/s13688-016-0093-1.** Method as retrieved: sentiment analysis over a filtered subset of **1,327 books** from Project Gutenberg's fiction collection (drawn from ~50,000 digitised books; some sources say ~1,700 stories analysed before filtering), using sliding word windows to score emotional valence across the text, followed by data-mining/clustering to identify recurring shapes.

`A2-C89` `[E1]` `[SECONDARY-SOURCED]` — The six shapes reported: **"Rags to riches"** (steady rise), **"Tragedy"** (steady fall), **"Man in a hole"** (fall then rise), **"Icarus"** (rise then fall), **"Cinderella"** (rise–fall–rise), **"Oedipus"** (fall–rise–fall). Reported as the most downloaded: **Icarus, Oedipus and Man in a hole.**

`A2-C90` `[E2]` `[SECONDARY-SOURCED]` — The work is explicitly framed as taking up **Kurt Vonnegut's** proposal about the similarity of emotional storylines, from a master's thesis reported as rejected by the University of Chicago.

**Defining components.** A **valence trajectory** — not a slot structure. Orthogonal to every plot model above.

**Complexity.** Low to select; the shapes are drawable.

**Developmental prerequisites.** Understanding that a story's *feeling* changes over time. Accessible early — arguably earlier than plot structure, since it requires no goal, no problem and no character interiority.

**Age bands.** Ages 7–8/Grades 2–3 upward as "how the feeling changes." *Basis: my analysis of the prerequisite. The Reagan study is about published adult fiction and says nothing about children.*

**Strengths for children's storytelling.** Three real advantages for this product. (1) It is one of the very few **empirical** results in this whole document — a large corpus, a stated method, a published result. (2) It is **completely orthogonal to conflict**: a child can choose "it gets sadder then happier" without any commitment to a protagonist, goal, or antagonist. (3) It is **drawable**, which fits a visual studio and lets a pre-writing child specify shape before content.
**Strengths for character creation — what it demands of a character.** Only that the character have **feelings that change**. This is the lowest character bar of any model here, and it directly targets the appearance-only failure mode (`A2-C22`) by asking about interior state rather than looks — while, unlike story grammar's *plan* slot, requiring no inference about another mind's intentions (`A2-C04`).

**Limitations.** It describes **published Western fiction in English on Project Gutenberg** — a corpus heavily skewed toward pre-1930 Anglo-American literature. The six shapes are an artefact of that corpus and of sentiment-analysis method; they are not a claim about what stories *should* do. Sentiment analysis over sliding windows is a coarse instrument.

**Cultural assumptions.** Corpus-driven and therefore substantial: Gutenberg's fiction collection is not a neutral sample of human storytelling. **The result should never be presented as "the six shapes of stories."**

**Do NOT impose when:** the child's story is not organised around feeling; or the tool would present the six shapes as exhaustive or prescriptive.

**Child-friendly terminology.** Grades 2–3: "does it get happier or sadder?" — drawn as a line. Grades 4–5: "the feelings line." Grades 6–9: emotional arc, valence; the shape names are fun and memorable but "Icarus"/"Oedipus" need a gloss.

**Simplified variants.**
- Grades 2–3: two-point line — start feeling, end feeling.
- Grades 4–5: draw the line freehand; the tool names the closest of the six without correcting.
- Grades 6–9: the six named shapes, plus free drawing, plus the corpus caveat.

### WHAT CHARACTER STUDIO SHOULD DO

**S22-R1.** Ship a **draw-your-feelings-line** control as a structure-independent overlay. *Cites `A2-C88`, `A2-C89`. Confidence: moderate–high.* This is the best conflict-free planning device in the document with genuine empirical grounding.
**S22-R2.** If the tool names a drawn line as one of the six, it must do so descriptively ("that's a bit like the shape people call 'man in a hole'") and never suggest changing the line to fit. *Cites `A2-C89`, `XC-1`. Confidence: high.*
**S22-R3.** Never present the six as exhaustive or as "the shapes of all stories." Say where they came from: ~1,327 English-language books from Project Gutenberg. *Cites `A2-C88`, and the corpus caveat. Confidence: high.*
**S22-R4.** Use "how does your character feel at the start, and at the end?" as a universal character prompt — it works at every band and requires no mind-reading. *Cites `A2-C89`, `A2-C04`, `A2-C22`. Confidence: moderate.*

---

# PART C — CHARACTER STUDIO BEHAVIOURAL SPECIFICATION

**Everything in Part C is product design.** It is not research. Each rule cites the claim IDs it rests on and states confidence. Every numeric threshold is a **DESIGN DECISION** invented for usability unless it explicitly cites a claim ID for the number itself — and **no number in this document is a research finding about children's writing.**

## C.1 Master comparison table

| # | Structure | Slots | Complexity | Soft default band | Conflict required? | Resolution required? | What it demands of a character | Basis for the age band |
|---|---|---|---|---|---|---|---|---|
| 1 | Beginning–Middle–End | 3 | Low | K–1+ | No | No | Persistence across 3 moments | Standard (`A2-C21`) + convention |
| 2 | Story grammar | 6–7 | Med–High | 2–3+ (partial) | Effectively yes | No | Interior: responds and plans | Empirical (`A2-C04`, `A2-C05`) |
| 3 | Three-act | 5 | Medium | 6–7+ | Yes | Yes | Redirectable; sustained want | Convention only |
| 4 | Freytag's pyramid | 5 | Med–High | 6–7+ | Yes | Yes (falling action) | Can worsen, then settle | Convention only |
| 5 | Hero's journey | 8–17 | Very high | 6–7+ | Yes | Yes | Want + lack + world + transformation | Convention only |
| 6 | Quest | 4–5 | Medium | 2–3+ | Mild (obstacles) | No | A locatable want; a cast | Complexity analysis |
| 7 | Equilibrium (Todorov) | 3–5 | Low–Med | 2–3+ | No | No (new normal) | An ordinary life | Complexity analysis |
| 8 | Problem–solution / SWBST | 3–5 | Low–Med | 2–3+ | Yes | Yes | A want + a thwarting | Convention (`A2-C50`) |
| 9 | Story mountain | 3–5 | Low–Med | K–1 to 4–5 | Mild | Soft | Can be pressured | Curriculum (`A2-C39`) |
| 10 | Circular | 2+ | Low | 2–3+ (K–1 orally) | No | No | A home state | Corpus + convention (`A2-C53`) |
| 11 | Episodic | n | Low per unit | K–1+ | No | No | Voice, habits, watchability | Developmental (`A2-C06`) |
| 12 | Kishōtenketsu | 4 | Low slots / High concept | 4–5+ (comic) | No | No | A perspective; capacity for surprise | Instructional (`A2-C63`) |
| 13 | Jo-ha-kyū | 3 (overlay) | Low | Any | No | No | A tempo | None — my analysis |
| 14 | Frame narrative | 2 levels+ | Med–High | 4–5+ | No | No | A teller with an audience and a motive | Complexity analysis |
| 15 | Ring composition | 5 (ABCBA) | High | 6–7+ | No | No (centre carries it) | Shown twice, differently | Complexity analysis |
| 16 | High point | 3–4 | Low–Med | K–1+ | No | **No** | A stance; things that matter | Empirical (`A2-C07`, `A2-C08`) |
| 17 | Dilemma tale | 3 | Low | 4–5+ | Contested claims | **No — by design** | Everyone has a fair point | None — my analysis |
| 18 | Repeating pattern | n | Low | K–1+ | No | No | Consistency across repeats | Analysis (`A2-C79`) |
| 21 | Story spine | 8 stems | Low | 2–3+ | Mild | Yes (as written) | A routine ("every day…") | Designer intent (`A2-C86`) |
| 22 | Emotional arc | 1 line | Low | 2–3+ | No | No | Feelings that change | None — my analysis |

*(§19 pūrākau and §20 yarning are deliberately absent: they are documented in Part B as traditions the product should **not** convert into structure options — see `S19-R1`, `S20-R1`.)*

**Read the "Conflict required?" and "Resolution required?" columns together.** Ten of the twenty listed structures require neither. That is the empirical answer to "is a conflict-centred story shape the only option?" — no, and the alternatives are not exotic.

## C.2 Structure-recommendation decision procedure

### C.2.0 Inputs and excluded inputs

```
INPUTS:
  age_band          ∈ {K-1, 2-3, 4-5, 6-7, 8-9}     # from account/roster; soft
  stated_intent     ∈ {true_story, made_up_story, comic, poem_story,
                       about_a_character, keep_going_series, unsure, other_freetext}
  genre_choice      ∈ {adventure, mystery, fantasy, funny, scary, everyday,
                       friendship, sports, animals, none_chosen, other_freetext}
  writing_sample    # optional; only if the child has already written something
  child_request     # optional; explicit ask ("I want a plot like a movie")

EXCLUDED INPUTS  (REC-INPUT-EXCLUSIONS — hard constraint)
  ✗ spelling accuracy          ✗ grammatical accuracy
  ✗ sentence length / count    ✗ vocabulary level / lexical diversity
  ✗ handwriting or typing speed
  ✗ home language / EAL-ELL status
  ✗ IEP / diagnosis flags of any kind
  ✗ prior "scores" of any kind
```
*Basis for the exclusions:* `A2-C19` (macrostructure is stable across languages while microstructure tracks language experience — so surface language is not evidence about structure), `A2-C11` (surface-style judgements became deficit judgements), `XC-6`. **Confidence: high.**

### C.2.1 Sample signals (only computed if a sample exists)

All signal thresholds below are **DESIGN DECISIONS**. None is a research finding.

```
sig_named_character   = a proper name or consistent referent recurs ≥2 times
sig_stated_want       = any want/goal verb phrase attributed to a character
sig_obstacle          = any thwart/oppose/prevent relation
sig_closure_marker    = an explicit end signal ("the end", "ever since", "and that's why")
sig_event_count       = count of distinct narrated events
sig_returns_to_open   = final state ≈ opening state (setting, action or phrasing echo)
sig_independent_units = ≥2 units that each stand alone, with no escalation between them
sig_turn_without_conflict = a late reveal that reframes earlier material, with sig_obstacle = false
sig_high_point_end    = evaluative peak occurs in the final ~20% and nothing resolves after it
sig_multi_strand      = ≥2 topics interleaved without a single unifying problem
sig_repetition_form   = ≥3 structurally parallel units
```

### C.2.2 Ranking procedure (pseudo-code)

```
FUNCTION recommend_structures(age_band, stated_intent, genre_choice, sample, child_request):

  # ---- STEP 0: HARD STOPS. Checked first; they can end the procedure. ----
  IF child_request is explicit:
      RETURN [requested_structure] + ["my own way"]        # honour it; do not second-guess
  IF stated_intent == "about_a_character":
      RETURN NO_STRUCTURES
      # Character work does not require a plot structure. Offer character prompts instead.
      # Cites A2-C22, S8-R1. Confidence: moderate-high.
  IF sample exists AND sig_multi_strand:
      RETURN ["episodic", "frame_narrative", "my own way"]   # never story_grammar / problem_solution
      # Cites A2-C10, A2-C11. HARD RULE — see AI-3.
  IF age_band == "K-1":
      RETURN ["beginning_middle_end", "episodic", "my own way"]   # max 2 options at this band

  # ---- STEP 1: candidate pool by band (soft defaults, not gates) ----
  pool = BAND_POOL[age_band]        # see table C.2.3

  # ---- STEP 2: score candidates ----
  FOR each s in pool:
      score[s] = 0
      score[s] += 3  IF intent_affinity(s, stated_intent)
      score[s] += 2  IF genre_affinity(s, genre_choice)
      score[s] += 2  IF sample_affinity(s, signals)      # see C.2.4
      score[s] -= 4  IF s.requires_conflict AND sample exists AND NOT sig_obstacle
      score[s] -= 4  IF s.requires_resolution AND sample exists AND (sig_high_point_end OR NOT sig_closure_marker)
      score[s] -= 2  IF s.complexity_rank > band_complexity_ceiling[age_band]

  # ---- STEP 3: enforce diversity of story shape (anti-monoculture) ----
  ranked = top_3(score)
  IF count(s in ranked WHERE s.requires_conflict) == 3:
      replace lowest-scoring with highest-scoring non-conflict structure
      # DESIGN DECISION. Cites A2-C35, A2-C10, guardrail G-2. Confidence: moderate.

  # ---- STEP 4: always append the exit ----
  RETURN ranked + ["none of these — I'll do it my own way"]
```

### C.2.3 Band pools (soft defaults — a child may open the full list at any band)

| Band | Default pool | Complexity ceiling | Max options shown |
|---|---|---|---|
| K–1 | B-M-E, episodic | Low | 2 |
| 2–3 | B-M-E, episodic, circular, high point, quest, equilibrium, problem–solution, emotional arc, repeating pattern, story spine | Low–Med | 3 |
| 4–5 | + story mountain, story grammar (full), frame narrative, kishōtenketsu (comic), dilemma tale | Medium | 3 |
| 6–7 | + three-act, Freytag, hero's journey, ring composition, kishōtenketsu (prose), jo-ha-kyū overlay | Med–High | 4 |
| 8–9 | all | any | 4 |

*Max-options-shown values are DESIGN DECISIONS (choice-overload management). No research basis.*

### C.2.4 Sample-affinity rules (IF/THEN)

```
IF sig_returns_to_open            THEN boost circular, ring_composition
IF sig_independent_units          THEN boost episodic, frame_narrative, quest
IF sig_turn_without_conflict      THEN boost kishotenketsu, dilemma_tale
IF sig_high_point_end             THEN boost high_point; SUPPRESS three_act, freytag, problem_solution
IF sig_repetition_form            THEN boost repeating_pattern, circular
IF sig_stated_want AND sig_obstacle THEN boost quest, problem_solution, story_grammar
IF sig_named_character AND NOT sig_stated_want THEN
      SUPPRESS all plot structures; SURFACE character prompts instead
      # Cites A2-C22 — the observed gap is character depth, not plot. Confidence: moderate.
IF sig_event_count <= 2 AND age_band in {K-1, 2-3} THEN
      RECOMMEND NOTHING; the story may simply be short and finished
      # Cites A2-C07 two-event is a documented type; A2-C08. Confidence: moderate-high.
```

### C.2.5 The "my own way" path — requirements

1. It is a **peer option**, rendered at the same size, weight and position as the suggestions — never a "skip" link, never greyed, never below a fold. *Cites `A2-C23` (upper-end constraint), `XC-7`.*
2. Choosing it must not trigger a confirmation, a "are you sure?", or a follow-up suggestion.
3. It must be **sticky**: a child who chooses it is not re-prompted for that project, and the tool remembers the preference for future projects until the child changes it. **DESIGN DECISION.**
4. The tool must never re-rank or re-offer structures mid-draft unless the child asks.

## C.3 Anti-imposition rules (HARD — these are prohibitions, not preferences)

These are the rules the product must be tested against. Each is expressed so a developer can write a test for it.

**`AI-1` — No structure suggestion is ever unsolicited during drafting.**
Structure recommendations appear only (a) at project start, or (b) when the child opens the help/structure affordance. The tool must not interrupt writing with a structural suggestion. *Cites `A2-C16` (non-restrictive prompts, fading scaffolds), `A2-C23`. Confidence: high.*

**`AI-2` — Absence of resolution is never flagged, scored, or offered help with.**
No copy may say a story is "unfinished," "needs an ending," "doesn't resolve," or equivalent. Ending at the high point is a complete form. *Cites `A2-C07`, `A2-C08`, `A2-C21` ("a sense of closure", not resolution), `XC-2`. Confidence: high.*

**`AI-3` — Absence of conflict is never treated as a deficiency.**
No copy may say a story "needs a problem," "needs more tension," "needs a villain," or ask "what goes wrong?" more than once per project. `sig_obstacle == false` must never lower a story's standing anywhere in the system, and must never trigger a prompt. *Cites `A2-C10`, `A2-C11`, `A2-C21`, `A2-C43`, `A2-C77`. Confidence: high.*

**`AI-4` — Circular, episodic, repetitive and multi-strand stories are never "corrected."**
Specifically prohibited responses: suggesting a circular story "go somewhere"; suggesting episodes be merged into one plot; suggesting repetition be cut; suggesting a multi-strand story pick one topic. *Cites `A2-C10`, `A2-C11`, `A2-C52`, `A2-C55`, `A2-C79`, `A2-C06`. Confidence: high.* **This is the rule most directly grounded in the evidence base** (`A2-C11` documents the exact harm).

**`AI-5` — No completeness scoring, ever.**
No percentage, no progress ring tied to structural slots, no "3 of 5 parts done," no checkmarks on structure slots, no badge for a "complete" story. Slots may be blank with no visual differentiation. *Cites `XC-1`, `A2-C15`, `A2-C03`. Confidence: high.*

**`AI-6` — No universality claims about any structure.**
Prohibited phrasings include "all stories," "every culture," "the universal story," "how stories work," "the shape of all narrative." Every structure must be attributable to a person, tradition, or corpus. *Cites `A2-C35`, `A2-C36`, `A2-C62`, `A2-C73`, and the corpus caveat on `A2-C88`. Confidence: high.*

**`AI-7` — No structure may be labelled with a broad ethnic, national or racial category.**
Prohibited: "African story structure," "Native American structure," "Asian structure," "Japanese story structure." Name the specific form and its specific origin. *Cites `A2-C62`, `A2-C76`–`A2-C80`. Confidence: high.*

**`AI-8` — Surface language never influences structural recommendation or feedback.**
Enforced by `REC-INPUT-EXCLUSIONS`. A spelling/grammar assist, if it exists, must be a separate subsystem that cannot write to the structure recommender. *Cites `A2-C19`, `XC-6`. Confidence: high.*

**`AI-9` — Traditions documented as protocol-bound are not shipped as templates.**
Pūrākau (§19), yarning (§20) and nation-specific Indigenous North American forms (§18) are excluded from the structure menu. *Cites `A2-C80`, `A2-C81`, `A2-C82`, `A2-C84`. Confidence: high.*

**`AI-10` — Under Grade 4, no prompt may require inferring another character's plan or internal state.**
Such prompts may be *offered* but must be answerable with "I don't know" / skipped with no consequence. *Cites `A2-C04`, `A2-C18`, `XC-4`. Confidence: moderate–high.*

**`AI-11` — Structure choice is reversible and non-binding at all times.**
Changing or abandoning a structure mid-project must not destroy content, must not warn, and must not re-prompt. **DESIGN DECISION.** *Confidence: high that this is right; no research basis.*

## C.4 Child-facing vocabulary mapping

Rule: **use the child-friendly term as the primary label at every band up to 6–7; show the formal term alongside from 6–7 up; never show only the formal term below 8–9.** DESIGN DECISION.

| Formal term | Grades 2–3 | Grades 4–5 | Grades 6–7 | Grades 8–9 |
|---|---|---|---|---|
| Exposition / setup | the start | the setup | setup (exposition) | exposition |
| Rising action | it gets busier | the build-up | rising action | rising action |
| Climax | the biggest bit | the big moment | the climax | climax |
| Falling action | after the big bit | winding down | falling action | falling action |
| Resolution / denouement | how it wraps up | how it ends | resolution | resolution / denouement* |
| Initiating event | something happens | what starts it off | the inciting incident | initiating event |
| Internal response | how they felt | how they reacted inside | internal response | internal response |
| Plan | what they decided to do | their plan | their plan | plan / intention |
| Attempt | what they try | the attempt | the attempt | attempt |
| Consequence | what happens because | the result | consequence | consequence |
| Protagonist | the main character | the main character | protagonist | protagonist |
| Antagonist | who's against them | the opponent | antagonist | antagonist |
| Conflict | the trouble | the problem | conflict | conflict |
| Character arc | how they change | how they change | character arc | character arc |
| Goal / want | what they want | their goal | their goal / motivation | motivation |
| Stakes | why it matters | what they could lose | the stakes | stakes |
| Equilibrium | how things usually are | the normal | equilibrium | equilibrium |
| Disruption | something messes it up | the disruption | disruption | disruption |
| Turn (*ten*) | the surprise | the turn | the turn (*ten*) | *ten* / the turn |
| Frame narrative | a story inside a story | a story inside a story | frame story | frame narrative |
| Episodic | lots of little stories | episodes | episodic | episodic structure |
| Circular | comes back around | circle story | circular structure | circular / mirrored |
| Coda | the last bit that looks back | the wrap-up line | coda | coda |
| High point | the best bit | the high point | high point | high point |
| Evaluation (Labov) | why it mattered | why it mattered | evaluation | evaluation |
| Monomyth | — *(do not use)* | leaving and coming back | the hero's journey | monomyth / hero's journey* |
| Ring composition | mirror story | mirror story | ring composition | ring composition* |
| Emotional arc | the feelings line | the feelings line | emotional arc | emotional arc* |

\* Terms marked with an asterisk must be accompanied by their provenance caveat at Grades 8–9 (see `G-4`): *denouement* — `A2-C32` unresolved; *monomyth* — `A2-C35`/`A2-C36`; *ring composition* — `A2-C73`; *emotional arc* — corpus caveat on `A2-C88`.

**Dashes mean "do not introduce this term at this band"** — not "the child cannot understand it."

## C.5 How structure choice constrains or liberates character design

This is the section the product's character panel should be driven by. When a child picks a structure, the character fields the tool surfaces should change — **and every field remains optional.**

| Structure | Character fields to surface | Fields to suppress | Net effect on the character |
|---|---|---|---|
| Hero's journey | starting world; want; lack/flaw; mentor; what they become | routine; perspective | **Most constraining.** Locks the character into a single transformed individual with an interior deficit. `A2-C34`, `S5-R5` |
| Three-act | want; what redirects them; what they lose | routine; ensemble | Constrains to a sustained goal-holder |
| Freytag | what pressure they're under; what they're like afterwards | goal | Constrains to someone who can decline and settle |
| Story grammar | want; how they react; their plan; what they try | — | Constrains toward interiority — powerful but demands mind-modelling (`A2-C04`) |
| Problem–solution / SWBST | want; what thwarts them | routine; perspective | Constrains to a want plus an opponent |
| Quest | want (locatable); helpers; opponents | interiority | **Liberating on cast:** generates multiple characters (`A2-C46`) |
| Equilibrium | ordinary day; what's normal for them | goal; flaw | **Liberating:** no want required (`S7-R2`) |
| Circular | home state; what's different the second time | goal; antagonist | **Liberating:** change without transformation vocabulary (`S10-R2`) |
| Episodic | voice; habits; what they always do; who they argue with | goal; arc | **Most liberating.** Character *is* the structure (`S11-R3`) |
| Kishōtenketsu | what they notice; what would surprise them; their perspective | goal; flaw; antagonist | **Least demanding.** Perspective, not want (`S12-R5`) |
| Frame narrative | who they're telling it to; why; their voice | goal | **Liberating:** character as teller (`S14-R2`) |
| Ring composition | one trait shown twice, differently | goal | Liberating on arc; constraining on planning |
| High point | what matters to them; their stance | plan | **Liberating:** feeling without mind-modelling (`S16-R3`) |
| Dilemma tale | each character's fair point | villain | **Liberating and unusual:** forbids a villain (`S17-R4`) |
| Emotional arc | feeling at start; feeling at end | everything else | **Least demanding of all** (`S22-R4`) |

**The single most important line in this table:** a hero's-journey slot implies a protagonist with an interior lack who leaves, is tested and returns transformed; a kishōtenketsu slot implies a character who merely has a way of seeing. **Those are not the same character, and the child chose one of them by choosing a structure.** The tool must make that consequence visible rather than silent — see `G-5`.

## C.6 Guardrails against implying a single correct story shape

**`G-1` — No structure is ever the tool's stated preference.** No "recommended," "most popular," "classic," or "best for beginners" badge. Ordering is by fit score only, and the score is never shown. *Cites `AI-6`, `A2-C35`. Confidence: high.*

**`G-2` — Shape diversity in every recommendation set.** Enforced at Step 3 of the ranking procedure: a set of three may not consist entirely of conflict-requiring structures. *DESIGN DECISION grounded in `A2-C10`, `A2-C35`. Confidence: moderate.*

**`G-3` — Every structure carries an attribution string.** One sentence naming who proposed it, when, and for what — including that many were built for adult drama, film or scholarship rather than for children's stories. *Cites `A2-C03`, `A2-C25`, `A2-C30`, `A2-C31`, `A2-C34`, `A2-C38`, `A2-C46`, `A2-C49`, `A2-C58`, `A2-C86`, `A2-C88`. Confidence: high.*

**`G-4` — Contested models carry a contest note at Grades 6–9.** Hero's journey (`A2-C35`, `A2-C36`), Freytag's popular form (`A2-C32`), Todorov's five stages (`A2-C48`), kishōtenketsu's Western framing (`A2-C62`, `A2-C64`), ring composition's universality claim (`A2-C73`), the six emotional arcs' corpus (`A2-C88`). Phrase as "some researchers disagree about this," with one line of what the disagreement is. *Confidence: high.*

**`G-5` — Structure choice must display its character consequence.** When a structure is selected, show one plain sentence: e.g. "This one works best when your character wants something badly and changes by the end — if that's not your character, try another." *Cites §C.5. DESIGN DECISION. Confidence: moderate.*

**`G-6` — The tool never compares one child's structure to another's, and never aggregates structure choice into any visible metric.** *DESIGN DECISION grounded in `A2-C11`. Confidence: high.*

**`G-7` — Teacher/adult-facing views inherit every rule in `AI-1`–`AI-11`.** A teacher dashboard must not surface a completeness or structure-conformance signal that the child-facing product is forbidden from computing. *DESIGN DECISION grounded in `A2-C11` — the documented harm came from an adult's judgement, not from the child's tool. Confidence: high.* **This is easy to get wrong and worth calling out in review.**

**`G-8` — Default under uncertainty is silence.** If the recommender's top score is below a confidence floor, or the sample is short, or signals conflict, the tool recommends **nothing** and offers only "my own way" plus the full list on request. *DESIGN DECISION; threshold invented. Confidence: high on the principle.*

---

# PART D — REQUIRED CLOSING SECTIONS

## D.1 Limitations and disagreements in the evidence base

**D.1.1 The retrieval limitation dominates everything else.** I could not open a single source. Every claim is search-summary-mediated. Before any claim in this document is used in external material, a person with journal access should verify it. The claims I consider highest-risk, in order: `A2-C02` (Stein & Glenn sample), `A2-C17` (LD intervention effect sizes — **do not use**), `A2-C14` (Graham et al. ES 1.02, which has a published correction), `A2-C32` (Freytag provenance, internally contradictory), `A2-C48` (Todorov five stages), `A2-C36` (the Dundes quotation), `A2-C59` (Fan Heng attribution), `A2-C65` (Watanabe Masako, entirely unverified).

**D.1.2 Very little of the structure literature is empirical at all.** Of the twenty-two structures documented, the ones with genuine empirical grounding are: story grammar (`A2-C01`–`A2-C05`), high-point analysis (`A2-C07`, `A2-C08`), and emotional arcs (`A2-C88`). Everything else is `[E2]` theory, `[E4]` practice, `[E5]` commercial craft, or `[E6]` contested. **Three-act, Freytag, hero's journey and story spine — the four most culturally dominant models in this document — have no empirical support as instructional tools for children that I could find.** That asymmetry should shape how confidently the product speaks about them.

**D.1.3 Structure instruction works, but not for the reason people assume.** `A2-C15` reports the largest effects for summarisation (*g* ≈ 0.57) and structure knowledge (*g* ≈ 0.38), and the smallest for comprehension questions (*g* ≈ 0.25). None of those outcomes is "wrote a better story." **I found no meta-analysis showing that teaching narrative structure improves the quality of children's original fiction.** `A2-C14` shows strategy instruction generally is effective for writing, but that is a broader category. This is a genuine gap, and the honest position is that structure scaffolds are justified as *planning and talking* tools, not as quality interventions.

**D.1.4 An unresolved disagreement about story grammar's status.** Story grammar is simultaneously (a) a descriptive account of comprehension (`A2-C03`), (b) an effective intervention target for children with language impairment (`A2-C16`), and (c) an implicit standard of well-formedness that has been documented producing deficit judgements about children whose narratives are organised differently (`A2-C10`, `A2-C11`). All three are supported. The product cannot resolve this tension; it can only refuse to use (b) as a licence for (c).

**D.1.5 Provenance disputes I could not settle.** Freytag's actual parts vs. the taught version (`A2-C31` vs `A2-C32` — my own two retrievals contradict each other). Whether Todorov enumerated five stages (`A2-C48`). Whether three-act derives from Aristotle (`A2-C29` — I found no evidence either way). Whether kishōtenketsu is meaningfully "conflict-free" in fiction (`A2-C64` — contested even within craft sources; no scholarship found). Whether Labov & Waletzky's six-part labelling is theirs (`A2-C09`).

**D.1.6 Universality claims recur and are contested each time.** Campbell (`A2-C34` vs `A2-C35`, `A2-C36`), Douglas on ring composition (`A2-C73`), and — in a different register — the essentialising of Japanese rhetoric (`A2-C62`). The pattern is consistent enough to be a design principle: **treat any claim that a structure is universal as evidence that it is not.**

**D.1.7 Single-study and preprint dependencies.** `A2-C23` (the AI storytelling study) is a small preprint (N = 40) carrying real weight in my Part C reasoning (`XC-7`, `AI-1`). If it does not replicate, those rules lose their empirical footing — though they remain defensible on precautionary grounds.

**D.1.8 Age recommendations are mostly convention.** As the final column of table C.1 shows, only four of the band recommendations rest on empirical developmental data (`A2-C04`, `A2-C05`, `A2-C07`, `A2-C08`, `A2-C06`). The rest are complexity analysis or instructional convention, and I have marked them as such throughout. **No band recommendation in this document should be treated as a readiness threshold.**

## D.2 Cultural assumptions embedded in this research — and in the conventional set of structures

**D.2.1 The conventional teaching set is narrow and coherent in a specific way.** The structures most commonly taught in English-medium schooling — beginning/middle/end, story grammar, story mountain/Freytag, three-act, problem–solution, hero's journey — share a family resemblance: **a single protagonist, with a goal, obstructed, who acts, and whose story ends in resolution.** That is not "story"; it is one well-populated corner of story. `A2-C10`, `A2-C11` and `A2-C13` document what happens when it becomes the criterion of well-formedness.

**D.2.2 Assumptions embedded in that set.**
- *Individualism.* A protagonist, not a community. Ensemble and collective stories fit every model here badly.
- *Conflict as engine.* Change is produced by opposition. Le Guin's carrier-bag critique (`A2-C43`) is the clearest counter-statement.
- *Resolution as completion.* Contradicted developmentally by `A2-C07`/`A2-C08`, culturally by dilemma tales (`A2-C77`), and formally by the *ketsu* (`A2-C61`, described as "not decisive").
- *Linearity.* Contradicted by circular (`A2-C52`), ring (`A2-C71`), cyclical epic (`A2-C76`) and frame (`A2-C69`) forms.
- *Text over performance.* Every structure here is rendered as a plan on a page. `A2-C76` (call-and-response, adaptation to occasion), `A2-C79` (measured verse in performance) and `A2-C83` (yarning as relational exchange) all describe forms whose structure lives in the telling. A writing tool cannot represent that, and should not pretend otherwise.
- *Ownership-free portability.* The assumption that a form can be lifted from its tradition and offered on a menu. `A2-C80` (seasonal restrictions), `A2-C81`/`A2-C82` (pūrākau as epistemology) and `A2-C84` (yarning as protected space) are direct counter-evidence.

**D.2.3 Assumptions embedded in this research base itself.**
- The developmental literature (`A2-C01`–`A2-C08`) is overwhelmingly English-language and North American, with `A2-C08` (Chinese children) a notable exception. MAIN (`A2-C18`, `A2-C19`) is the main genuinely cross-linguistic instrument here.
- The measurement instruments encode the assumption. MAIN's episode unit is Goal–Attempt–Outcome (`A2-C18`) — a goal-directed episode is *definitionally* what gets counted as macrostructure. A story with no goal scores low on macrostructure by construction, which is a property of the instrument, not of the story.
- `A2-C88`'s corpus is Project Gutenberg's English-language fiction — heavily pre-1930 Anglo-American.
- Propp's corpus is ~100 Russian tales (`A2-C46`); Freytag's is Greek and Shakespearean tragedy (`A2-C31`); Frye's seasonal mapping is Northern-Hemisphere (`A2-C44`).
- **This document's own selection is a cultural artefact.** My scope list was Western-structure-heavy by default, my searches were in English, and my non-Western coverage (§§12, 17–20) is thinner and lower-tier than my Western coverage. Readers should treat the *balance* of this document as itself biased, and §17–20's thinness as a finding about my method rather than about those traditions.

**D.2.4 The specific risk this product faces.** A tool that recommends structures will, by default, recommend the well-documented ones — which are the Western conflict-centred ones, because that is where the documentation is. **The recommender must therefore actively counterweight its own evidence base** (`G-2`), or the evidence asymmetry becomes a cultural verdict.

## D.3 Accessibility considerations

**D.3.1 Developmental language disorder (DLD) / language impairment.**
- `A2-C16` is the most directly actionable evidence in this document: narrative intervention shows moderate-to-large effects on **macrostructure** with lower effects on microstructure, and the reported effective components are **visual elicitation, one icon per macrostructural concept, repeated telling opportunities, immediate feedback, non-restrictive prompts, and progressive fading**. Character Studio can implement all six.
- Reported limitation, retrieved: small samples, limited experimental control, high procedural variation across studies (`A2-C16`). Do not overstate.
- **Design consequence:** the icon-per-slot pattern (`XC-5`) should be available to all children, not gated behind a support flag — both because it helps broadly and because gating requires the diagnosis flags that `REC-INPUT-EXCLUSIONS` forbids as recommender inputs.

**D.3.2 Autistic learners.**
- `A2-C20` reports differences concentrated in **global** coherence and macrostructure, with **local coherence and temporal/causal connectives comparable** to non-autistic peers, and particular difficulty with **retelling** fictional narratives.
- **Design consequences:** (i) prefer **generation** over **retelling** as the default task, since retelling is the reported difficulty; (ii) do not use global coherence as any kind of quality signal (`AI-5` already forbids scoring); (iii) **episodic (§11), repeating pattern (§18) and ring composition (§15)** are structures organised by pattern rather than by global causal integration, and should be surfaced, not withheld; (iv) the literature's deficit framing should not be reproduced in product language.
- Note the tension: `A2-C16`'s scaffolds target macrostructure, which is where `A2-C20` locates the difficulty — so the scaffolds are relevant — but `AI-5` forbids treating the difference as a deficit. Both hold: offer the scaffold, never score the outcome.

**D.3.3 Multilingual and emergent bilingual learners.**
- `A2-C19` is decisive here: **macrostructure is relatively stable across languages while microstructure tracks language experience.** A child with limited English surface fluency may have fully intact story structure.
- `A2-C18`: MAIN was built with explicit attention to cultural appropriateness across 15 languages, and offers **telling, retelling and model-story** elicitation modes.
- **Design consequences:** (i) `REC-INPUT-EXCLUSIONS` / `AI-8` — surface language must never reach the recommender; (ii) allow planning in any language, and allow structure slots to be filled in a home language; (iii) allow **oral** capture for structure planning; (iv) never conflate "short sentences" with "simple story."
- `A2-C10`, `A2-C11`, `A2-C13`: for multilingual children who are *also* from communities with different narrative norms, both risks compound.

**D.3.4 Other neurodivergence (ADHD, executive-function differences).**
- `A2-C22` reports that syntactic complexity in upper-elementary narrative writing is predicted by oral grammar, **inhibition and planning** — i.e. executive function.
- **Design consequences:** (i) structures with **low planning overhead** (episodic, high point, emotional arc, story spine, repeating pattern) should be surfaced for children who stall at planning; (ii) high-planning structures (ring composition, hero's journey, frame narrative) should never be defaults; (iii) **oral-first** capture reduces the executive load of composing and transcribing simultaneously; (iv) the repeatable-obstacle pattern in `S6-R2` lets a story grow without a plan.
- `[UNVERIFIED]` — I retrieved **no** research specifically on ADHD and narrative structure, and none on dyslexia and narrative macrostructure. The recommendations above are inferences from `A2-C22` plus general design reasoning, not findings.

**D.3.5 General.** Every accessibility affordance named here should be **universally available**, not flag-gated. That is both a design preference and a consequence of `AI-8`.

## D.4 Populations underrepresented in the evidence

1. **Children in grades 6–9 writing original fiction.** Almost the entire developmental narrative literature I retrieved concerns ages 3–8 (`A2-C04`, `A2-C05`, `A2-C07`, `A2-C08`, `A2-C18`) or is about *reading* comprehension in grades 4–6 (`A2-C15`). The upper half of Character Studio's range is the least evidenced.
2. **Original fiction composition generally.** The literature is dominated by *retelling*, *personal narrative* and *comprehension*. Children inventing characters and stories from nothing — the actual Character Studio task — is thinly covered.
3. **Character creation specifically.** `A2-C22` is nearly the only claim in this document about how children develop characters as opposed to plots. For a product called Character Studio, this is the largest gap in the evidence base.
4. **Non-English-speaking and non-Western children.** `A2-C08` (Chinese) and `A2-C18`/`A2-C19` (MAIN) are the exceptions in an otherwise Anglophone literature.
5. **Indigenous children and children from oral-tradition communities.** `A2-C79`–`A2-C85` are about *traditions*, not about children learning or composing within them.
6. **Deaf and hard-of-hearing children; signing children.** I retrieved nothing. Narrative structure in ASL and other signed languages was on my search plan and was never run.
7. **Children with dyslexia, ADHD, or intellectual disability.** `A2-C16` covers language impairment; the others are absent (`D.3.4`).
8. **Children below grade level and children well above it.** `A2-C23` is the only retrieved study addressing differential effects by ability, and it is a small preprint.
9. **Multilingual children's *fiction* writing** (as opposed to elicited narrative assessment).
10. **Children using AI tools over time.** `A2-C23` is a single session study. Nothing longitudinal exists in what I retrieved.

## D.5 Open questions

**Verification questions (someone with journal access should resolve these first).**
1. What does Freytag's MacEwan translation actually name as the parts, and does "denouement" appear? (`A2-C31` vs `A2-C32` — my retrieval contradicts itself.)
2. Did Todorov enumerate five stages, or is that entirely a media-studies construction? (`A2-C48`.)
3. What are Labov & Waletzky's actual structural categories? (`A2-C09`.)
4. Is the Dundes quotation accurate and in the JAF 2005 text? (`A2-C36`.)
5. What is the corrected effect size in Graham et al. (2012) after the published correction? (`A2-C14`.)
6. Does the Watanabe Masako yonkoma cross-cultural study exist, and what did it find? (`A2-C65`.)
7. What are Common Core W.3 grades 4–8, verbatim? (`A2-C21`.)

**Research questions the evidence base does not answer.**
8. Does teaching narrative structure improve the *quality* of children's original fiction — as opposed to their summarising and structural knowledge? (`D.1.3`.)
9. Does offering a *choice* of structures produce different outcomes than offering one? Nothing retrieved addresses this, and it is the central premise of Part C.
10. At what point does a structure scaffold become a constraint? `A2-C23`'s upper-end constraint finding is the only signal, and it is one small preprint.
11. Do non-conflict-centred structures (circular, episodic, kishōtenketsu, dilemma tale) support sustained writing in children as well as conflict-centred ones do? Entirely unstudied as far as I could find.
12. Does structure choice actually change the characters children create, as §C.5 asserts? §C.5 is reasoned, not evidenced.
13. What do children *themselves* say about structure scaffolds? No child-voice research was retrieved.
14. Is kishōtenketsu usefully teachable to English-speaking children, and what happens when it is? (`A2-C64` is craft opinion only.)
15. How is narrative structure organised in signed languages, and what would that imply for a visual tool?
16. Do the topic-associating/topic-centered findings (`A2-C10`) replicate in contemporary classrooms and in digital writing contexts?

**Product questions this document cannot settle.**
17. Should the structure recommender exist at all? `G-8` and `AI-1` push toward near-silence; a reasonable reading of the evidence is that the strongest defensible feature set is *character prompts* plus *an optional structure library*, with no recommender.
18. Should teachers see structure choice at all? (`G-7`.)

## D.6 Source list — sources actually retrieved in this session

**Retrieval note:** every URL below was returned by a `WebSearch` call in this session and its content reached me through the search engine's summary. **None was opened via `WebFetch` (all blocked).** "Role" states what the source was used for.

### Developmental / empirical
| Source | URL | Role |
|---|---|---|
| Stein & Glenn (1979) — ERIC record ED121474 | https://eric.ed.gov/?id=ED121474 | Citation for `A2-C01`, `A2-C02` (fetch blocked) |
| Stein & Glenn — Semantic Scholar record | https://www.semanticscholar.org/paper/An-Analysis-of-Story-Comprehension-in-Elementary-A-Stein-Glenn/926ec4530e6cde1eabd9f1c71f9f30880ab62bdc | Citation corroboration, `A2-C01` |
| "Story Grammar, aka Stein & Glenn (1979)" — U. at Buffalo history of CDS | https://ubwp.buffalo.edu/history-of-cds/story-grammar-ala-stein-glenn-1979/ | Element list + study description, `A2-C01`, `A2-C02` |
| Khan et al. (2016), JSLHR 59(6) | https://pubs.asha.org/doi/10.1044/2016_JSLHR-L-15-0275 | `A2-C05` |
| Khan et al. (2016) — ERIC full text record | https://files.eric.ed.gov/fulltext/ED613909.pdf | `A2-C05`, `A2-C22` |
| Applebee (1978) — Internet Archive record | https://archive.org/details/childsconceptofs0000appl_i5o9 | `A2-C06` |
| Applebee stages — Handy Handouts 350 | https://www.handyhandouts.com/viewHandout.aspx?hh_number=350&nfp_title=Narrative+Stages | Stage descriptions, `A2-C06` |
| Peterson & McCabe — High Point Analysis chapter | https://link.springer.com/chapter/10.1007/978-1-4757-0608-6_4 | `A2-C07`, `A2-C74` |
| Peterson & McCabe corpus — CHILDES | https://childes.talkbank.org/access/Eng-NA/PetersonMcCabe.html | `A2-C07` |
| "The Story of Narrative Analysis for Young Children" (SIUE) | https://www.siue.edu/~jeharri/ISHA2000.htm | Narrative type labels, `A2-C07` |
| Chinese children 3–6 narrative development, J. Psycholinguistic Research | https://link.springer.com/article/10.1007/s10936-018-9614-3 | `A2-C08`, `A2-C75` |
| Labov & Waletzky (1967) — SCIRP reference record | https://www.scirp.org/reference/referencespapers?referenceid=2851221 | `A2-C09` citation |
| Labov, "Some Further Steps in Narrative Analysis" | https://www.ling.upenn.edu/~wlabov/sfs.html | `A2-C09` context |
| Michaels, "Sharing time," *Language in Society* | https://www.cambridge.org/core/journals/language-in-society/article/abs/sharing-time-childrens-narrative-styles-and-differential-access-to-literacy/EC5767FEA4D0837BA2CF0C0E89FAA39C | `A2-C10`, `A2-C11` |
| African American kindergartners' narratives (1994), ERIC EJ497723 | https://eric.ed.gov/?id=EJ497723 | `A2-C12` |
| African American kindergartners' narratives — Deep Blue record | https://deepblue.lib.umich.edu/items/c5f55c96-737a-4efa-a105-19fdc07f50ab | `A2-C12` |
| Heath (1983), *Ways with Words* — excerpt host | http://compositionawebb.pbworks.com/w/file/fetch/129107370/wayswithwords1.pdf | `A2-C13` |
| Graham, McKeown, Kiuhara & Harris (2012) — ERIC EJ994038 | https://eric.ed.gov/?id=EJ994038 | `A2-C14` |
| Graham et al. (2012) correction record | https://www.researchgate.net/publication/263924784_Meta-analysis_of_writing_instruction_for_students_in_elementary_grades_Correction_to_Graham_et_al_2012 | Existence of correction, `A2-C14` |
| Bogaerds-Hazenberg, Evers-Vermeul & van den Bergh — RRQ | https://ila.onlinelibrary.wiley.com/doi/10.1002/rrq.311 | `A2-C15` |
| Petersen (2011) systematic review | https://journals.sagepub.com/doi/10.1177/1525740109353937 | `A2-C16` |
| Narrative intervention in DLD — systematic review, J. Dev. Phys. Disabil. | https://link.springer.com/article/10.1007/s10882-020-09763-9 | `A2-C16` |
| Petersen et al., narrative intervention with autistic children (PDF) | https://speechandhearingbc.ca/wp-content/uploads/2019/02/Peterson-et-al-Systematic-Individualized-Narrative-Intervention-on-the-Personal-Narratives-of-Children-with-Autism-1.pdf | `A2-C16` |
| ASHA LSHSS, "Narrative Intervention: Principles to Practice" | https://pubs.asha.org/doi/pdf/10.1044/2020_LSHSS-20-00015 | `A2-C16` (fetch blocked) |
| Reading comprehension interventions for students with LD (Lynchburg) | https://digitalshowcase.lynchburg.edu/cgi/viewcontent.cgi?article=1066&context=lc-journal-of-special-education | `A2-C17` — **flagged, do not use** |
| MAIN — instrument description | https://www.researchgate.net/publication/348460070_MAIN_multilingual_assessment_instrument_for_narratives | `A2-C18`, `A2-C19` |
| MAIN Revised | https://www.researchgate.net/publication/348461736_MAIN_Multilingual_Assessment_Instrument_for_Narratives_-_Revised | `A2-C18` |
| Bilingual macrostructure, *J. Child Language* | https://www.cambridge.org/core/journals/journal-of-child-language/article/cognitive-skills-differentially-influence-narrative-macrostructure-in-bilinguals-l1-and-l2/5BA938B312ACC6D2E83A619A2249B3F0 | `A2-C19` |
| Story production of autistic children, JADD | https://link.springer.com/article/10.1007/s10803-023-06096-2 | `A2-C20` |
| Coherence in autistic spoken narrative — scoping review | https://www.sciencedirect.com/science/article/pii/S1750946723000077 | `A2-C20` |
| Narrative abilities of autistic adolescents, *Autism Research* | https://onlinelibrary.wiley.com/doi/10.1002/aur.3272 | `A2-C20` |
| Executive function and narrative syntactic complexity (PMC) | https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5247531/ | `A2-C22` |
| "Floor Raiser or Ceiling Limiter?" (arXiv preprint) | https://arxiv.org/pdf/2606.27067 | `A2-C23` |
| Reagan et al. (2016), EPJ Data Science 5:31 | https://link.springer.com/article/10.1140/epjds/s13688-016-0093-1 | `A2-C88`, `A2-C89` |
| Reagan et al. — author PDF | https://cdanfort.w3.uvm.edu/research/2016-reagan-epj.pdf | `A2-C88` |
| MIT Technology Review on the six arcs | https://www.technologyreview.com/2016/07/06/158961/data-mining-reveals-the-six-basic-emotional-arcs-of-storytelling/ | `A2-C89`, `A2-C90` |

### Structure sources (theory, standards, practice, craft)
| Source | URL | Role | Tier |
|---|---|---|---|
| Aristotle, *Poetics* ch. VII (SparkNotes full text) | https://www.sparknotes.com/philosophy/poetics/full-text/chapter-vii/ | `A2-C24` verbatim | E2 |
| Aristotle, *Poetics* ch. VII (Toronto Metropolitan Pressbooks) | https://pressbooks.library.torontomu.ca/thepoetics/chapter/7/ | `A2-C24` corroboration | E2 |
| Aristotle, *Poetics* ch. VII (monadnock.net) | https://monadnock.net/aristotle/poetics-7.html | `A2-C24` corroboration | E2 |
| Freytag, *Technique of the Drama* (MacEwan tr.) — Internet Archive | https://archive.org/details/freytagstechniqu00frey | `A2-C31` citation (fetch blocked) | E2 |
| Freytag full text (djvu) | https://archive.org/stream/freytagstechniqu00freyuoft/freytagstechniqu00freyuoft_djvu.txt | `A2-C31` (fetch blocked) | E2 |
| Backstage, "What Is Freytag's Pyramid?" | https://www.backstage.com/magazine/article/freytags-pyramid-explained-78290/ | `A2-C31` part names | E5 |
| Mythcreants, "Freytag's Pyramid Is Outdated" | https://mythcreants.com/blog/freytags-pyramid-is-outdated-heres-what-to-do-instead/ | `A2-C32`, `A2-C33` | E6 |
| Reedsy, Freytag's Pyramid | https://blog.reedsy.com/guide/story-structure/freytags-pyramid/ | `A2-C32` context | E5 |
| Storm Writing School, "Freytag's Pyramid Doesn't Deserve the Hate" | https://stormwritingschool.com/freytags-pyramid/ | `A2-C32` counterpoint | E6 |
| Syd Field paradigm (official site) | https://sydfield.com/guest-blog/utilizing-syd-fields-screenwriting-paradigm-to-understand-script-timeline-structureby-natalia-lazarus/ | `A2-C28` | E5 |
| Screenwriting.io, "Who is Syd Field?" | https://screenwriting.io/who-is-syd-field/ | `A2-C28` | E5 |
| Three-act structure (Wikipedia) | https://en.wikipedia.org/wiki/Three-act_structure | `A2-C28` corroboration | E6 |
| Todorov's narrative theory of equilibrium (Wikipedia) | https://en.wikipedia.org/wiki/Todorov's_narrative_theory_of_equilibrium | `A2-C47`, `A2-C48` | E6 |
| Media-studies.com, Todorov | https://media-studies.com/todorov/ | `A2-C48` | E6 |
| Campbell / Joseph Campbell Foundation | https://www.jcf.org/learn/joseph-campbell-heros-journey | `A2-C34` | E2 |
| Hero's journey (Wikipedia) | https://en.wikipedia.org/wiki/Hero's_journey | `A2-C34`, `A2-C35`, `A2-C36` | E6 |
| Big Think, "The 'hero's journey' isn't as universal as you think" | https://bigthink.com/high-culture/monomyth-heros-journey-campbell/ | `A2-C35` | E6 |
| Jorgensen, "Why Folklorists Hate Joseph Campbell's Work" (Patheos) | https://www.patheos.com/blogs/foxyfolklorist/why-folklorists-hate-joseph-campbells-work/ | `A2-C36` | E6 |
| Dundes, "Folkloristics in the Twenty-First Century" (record) | https://www.researchgate.net/publication/236795142_Folkloristics_in_the_Twenty-First_Century_AFS_Invited_Presidential_Plenary_Address_2004 | `A2-C36` citation | E2 |
| Northup, "Myth-Placed Priorities," *Religious Studies Review* | https://onlinelibrary.wiley.com/doi/abs/10.1111/j.1748-0922.2006.00018.x | `A2-C37` citation only | E2 |
| Vogler memo (Studocu host) | https://www.studocu.com/en-us/document/university-of-virginia/intro-to-programming/heros-journey-the-original-memo-by-christopher-vogler/142372316 | `A2-C38` | E5 |
| *The Writer's Journey* (publisher) | https://mwp.com/product/writers-journey-25th-anniversary-edition-mythic-structure-writers/ | `A2-C38` | E5 |
| Reedsy, Dan Harmon Story Circle | https://reedsy.com/blog/guide/story-structure/dan-harmon-story-circle/ | `A2-C42` | E5 |
| Le Guin, "The Carrier Bag Theory of Fiction" (author site) | https://www.ursulakleguin.com/the-carrier-bag-theory-of-fiction | `A2-C43` | E2 |
| Le Guin essay PDF (otherfutures.nl) | https://otherfutures.nl/uploads/documents/le-guin-the-carrier-bag-theory-of-fiction.pdf | `A2-C43` | E2 |
| Propp, *Morphology of the Folktale* — MIT excerpt | https://web.mit.edu/allanmc/www/propp.pdf | `A2-C46` | E2 |
| Propp — Rupkatha review article | https://rupkatha.com/V9/n2/v9n241.pdf | `A2-C46` | E2 |
| Frye — McMaster Frye blog, "Theory of Myths" | https://macblog.mcmaster.ca/fryeblog/critical-method/theory-of-myths.html | `A2-C44` | E2 |
| Booker, *The Seven Basic Plots* (Wikipedia) | https://en.wikipedia.org/wiki/The_Seven_Basic_Plots | `A2-C45` | E6 |
| Meyer text structure — IEJEE / ERIC EJ1070453 | https://files.eric.ed.gov/fulltext/EJ1070453.pdf | `A2-C49` | E1/E2 |
| "Text structure instruction: the research is moving forward" | https://link.springer.com/article/10.1007/s11145-018-9909-7 | `A2-C49` | E1 |
| SWBST — K20 Center strategy page | https://learn.k20center.ou.edu/strategy/2346 | `A2-C50` | E4 |
| CCSS W.K.3 | https://www.thecorestandards.org/ELA-Literacy/W/K/3/ | `A2-C21` | E3 |
| CCSS W.1.3 | https://www.thecorestandards.org/ELA-Literacy/W/1/3/ | `A2-C21` | E3 |
| CCSS W.2.3 | https://www.thecorestandards.org/ELA-Literacy/W/2/3/ | `A2-C21` | E3 |
| CCSS W.3 (grade 3) | https://www.thecorestandards.org/ELA-Literacy/W/3/ | `A2-C21` | E3 |
| Talk for Writing progression guide (Selside CE School) | https://selside.cumbria.sch.uk/wp-content/uploads/2021/09/Progression-of-Grammar-and-Punctuation.pdf | `A2-C39` | E4 |
| Talk for Writing (Foundation Years PDF) | https://foundationyears.org.uk/files/2011/10/Talk_for_writing1.pdf | `A2-C39` | E4 |
| Kenn Adams (Improv Archive) | https://improvarchive.org/people/kenn-adams | `A2-C86` | E5 |
| Story Spine (SessionLab) | https://www.sessionlab.com/methods/story-spine | `A2-C86`, `A2-C87` | E5 |
| Aerogramme Studio, "The Story Spine: Pixar's 4th Rule" | https://www.aerogrammestudio.com/2013/03/22/the-story-spine-pixars-4th-rule-of-storytelling/ | `A2-C87` | E5 |
| Circular plot structure (EBSCO Research Starters) | https://www.ebsco.com/research-starters/literature-and-writing/circular-plot-structure | `A2-C52` | E4 |
| Circular stories (Salve Regina library guide) | https://salve.libguides.com/c.php?g=434935&p=2965221 | `A2-C53` | E4 |
| Words&Pictures, "Picture Book Focus: Circular Stories" | https://www.wordsandpics.org/2023/07/picture-book-focus-super-structure-part.html | `A2-C53` | E4 |
| Episodic structure (Novlr glossary) | https://www.novlr.org/glossary/episodic-structure | `A2-C55` | E4 |
| Episodic narrative (Fiveable) | https://fiveable.me/introduction-to-comparative-literature/key-terms/episodic-narrative | `A2-C55` | E4 |
| Picaresque novel (Britannica) | https://www.britannica.com/art/picaresque-novel | `A2-C56` | E2 |
| Slap Happy Larry, "Shapes of Plots in Children's Literature" | https://www.slaphappylarry.com/types-of-plots-in-childrens-literature/ | `A2-C55` context | E6 |

### Kishōtenketsu, jo-ha-kyū, and contrastive rhetoric
| Source | URL | Role | Tier |
|---|---|---|---|
| Kubota (1997), *Written Communication* 14(4) | https://journals.sagepub.com/doi/10.1177/0741088397014004002 | `A2-C62` | E1 |
| Kubota (1997) — ERIC EJ556810 | https://eric.ed.gov/?id=EJ556810 | `A2-C62` | E1 |
| Mok, "Contrastive Rhetoric and the Japanese Writer of EFL" (JALT) | https://jalt-publications.org/sites/default/files/pdf-article/jj-15.2-art2.pdf | `A2-C61` | E1 |
| Premaratne, "Digression and indirectness in Japanese writing" (ejcjs) | https://www.japanesestudies.org.uk/ejcjs/vol13/iss4/premaratne.html | `A2-C61`, `A2-C63` | E1 |
| Sawaki (2023), Japanese/English rhetorical comparison (author PDF) | https://tomokosawaki.wordpress.com/wp-content/uploads/2024/09/sawaki_2023_japanese_english_rhetorical_comparison.pdf | `A2-C61` context | E1 |
| Kishōtenketsu (HandWiki) | https://handwiki.org/wiki/Social:Kish%C5%8Dtenketsu | `A2-C58`, `A2-C59` | E6 |
| Kishōtenketsu (Wikipedia) | https://en.wikipedia.org/wiki/Kish%C5%8Dtenketsu | `A2-C58`, `A2-C60` | E6 |
| Yonkoma (Wikipedia) | https://en.wikipedia.org/wiki/Yonkoma | `A2-C60` | E6 |
| PMJS mailing list thread on kishōtenketsu | https://groups.google.com/g/pmjs/c/yKGycjiZuhg | `A2-C65` — unverified lead | UNVERIFIED |
| Fawkes, "7 Misconceptions of Kishotenketsu" | https://www.septembercfawkes.com/2026/07/misconceptions-of-kishotenketsu-story-structure.html | `A2-C64` | E6 |
| Fawkes, "Kishotenketsu Story Structure Explained" | https://www.septembercfawkes.com/2026/02/kishotenketsu-story-structure-explained.html | `A2-C64` | E6 |
| Nelson Literary Agency, "Kishōtenketsu and Non-Western Story Structures" | https://nelsonagency.com/2022/01/kishotenketsu-and-non-western-story-structures/ | `A2-C64` | E6 |
| Neumeier, "Kishōtenketsu: Non-Western Story Structure?" | https://www.rachelneumeier.com/2022/02/18/kishotenketsu-non-western-story-structure/ | `A2-C64` | E6 |
| Jo-ha-kyū (Theatre Nohgaku) | https://theatrenohgaku.wordpress.com/2012/08/10/jo-ha-kyu-%E5%BA%8F%E7%A0%B4%E6%80%A5/ | `A2-C66`, `A2-C67` | E2 |
| Noh form (Stanford Noh site) | https://noh.stanford.edu/form | `A2-C67` | E2 |
| Jo-ha-kyū (Wikipedia) | https://en.wikipedia.org/wiki/Jo-ha-ky%C5%AB | `A2-C66`, `A2-C67` | E6 |

### Non-Western and oral-tradition sources
| Source | URL | Role | Tier |
|---|---|---|---|
| Panchatantra (Britannica) | https://www.britannica.com/topic/Panchatantra-Indian-literature | `A2-C68`, `A2-C69` | E2 |
| "Narrative Analysis of Pañcatantra" (IJFMR) | https://www.ijfmr.com/papers/2024/4/24541.pdf | `A2-C68`, `A2-C69` | E2 |
| Katha (storytelling format) — Wikipedia | https://en.wikipedia.org/wiki/Katha_(storytelling_format) | `A2-C68` context | E6 |
| Dilemma story (Wikipedia) | https://en.wikipedia.org/wiki/Dilemma_story | `A2-C77` | E6 |
| African folktales (Fiveable study guide) | https://fiveable.me/world-literature-i/unit-9/african-folktales/study-guide/zCnuTd1QOaGMnf0s | `A2-C76`, `A2-C78` | E6 |
| African oral epics (Fiveable study guide) | https://fiveable.me/world-literature-i/unit-9/african-oral-epics/study-guide/3uODJhi3ua3UKSG1 | `A2-C76` | E6 |
| African Oral Traditions (Afrodeities) | https://www.afrodeities.org/african-oral-traditions | `A2-C78` | E6 |
| Hymes, *"In Vain I Tried to Tell You"* (Google Books record) | https://books.google.com/books/about/In_Vain_I_Tried_to_Tell_You.html?id=QmEEXIWjpgUC | `A2-C79` | E2 |
| Hymes, *Now I Know Only So Far* (record) | https://www.academia.edu/6686690/Now_I_Know_Only_So_Far_Essays_in_Ethnopoetics_Dell_Hymes | `A2-C79` | E2 |
| "Densmore's Ghost" (IUP) — ethnopoetics discussion | https://www.people.iup.edu/sherwood/courses/engl766f05/Docs/densmores-ghost-006.htm | `A2-C79` | E2 |
| Ethnopoetics (Wikipedia) | https://en.wikipedia.org/wiki/Ethnopoetics | `A2-C79` | E6 |
| Toelken, "The 'Pretty Languages' of Yellowman" (USU record) | https://digitalcommons.usu.edu/english_facpub/695 | `A2-C80` | E2 |
| Toelken — De Gruyter chapter record | https://www.degruyterbrill.com/document/doi/10.7560/724150-010/html | `A2-C80` | E2 |
| "The Yellowman Tapes, 1966–1997" (JSTOR record) | https://www.jstor.org/stable/541046 | `A2-C80` seasonal restriction | E2 |
| Lee (2009), "Decolonising Māori narratives: Pūrākau as a method," *MAI Review* | https://journal.mai.ac.nz/system/files/maireview/242-1618-1-PB.pdf | `A2-C81`, `A2-C82` | E2 |
| "Pūrākau: Embracing our Indigenous identity" (thescopes.org) | https://www.thescopes.org/assets/Uploads/Purakau.pdf | `A2-C81` | E2 |
| Ware, Breheny & Forster (2018), "Kaupapa Kōrero" | https://journals.sagepub.com/doi/abs/10.1177/1177180117744810 | `A2-C82` | E2 |
| "Yarning/Aboriginal storytelling," *Contemporary Nurse* 46(1) | https://www.tandfonline.com/doi/abs/10.5172/conu.2013.46.1.13 | `A2-C83` | E2 |
| Same article — JCU ResearchOnline record | https://researchonline.jcu.edu.au/31505/ | `A2-C83` | E2 |
| Barlo et al. (2020), "Yarning as protected space" (CDU) | https://www.cdu.edu.au/files/2024-10/barlo-et-al-2020-yarning-as-protected-space-principles-and-protocols.pdf | `A2-C84` | E2 |
| Australian Aboriginal Storytelling (Australian Storytelling) | https://australianstorytelling.org.au/storytelling-articles/australian-aboriginal-storytelling-helen-mckay | `A2-C85` | E6 |
| Douglas, *Thinking in Circles* (Yale UP) | https://yalebooks.yale.edu/book/9780300167856/thinking-in-circles/ | `A2-C71` | E2 |
| Douglas, *Thinking in Circles* — Bryn Mawr Classical Review | https://bmcr.brynmawr.edu/2007/2007.09.37/ | `A2-C71`, `A2-C72`, `A2-C73` | E2 |
| Douglas review (Academia record) | https://www.academia.edu/114008238/Mary_Douglas_Thinking_in_Circles_An_Essay_on_Ring_Composition | `A2-C72`, `A2-C73` | E2 |

### Sources retrieved but deliberately NOT relied on
Listed for transparency — these appeared in results and were read, but were judged too weak, too commercial, or too far from the claim to support anything: numerous story-structure marketing pages (bibisco, Scrite, Blaze, Loreteller, StorytellingDB, Kindlepreneur, Scribophile, AuthorFlows, Spines, StudioBinder, Boords, Novel Factory, Greenlight Coverage, TCK Publishing, Vaia, Writers Write, Art of Narrative, Helping Writers Become Authors), Grokipedia pages, TV Tropes, Quizlet, SlideShare, Scribd, Study.com, and assorted teacher-blog SWBST pages. Where a claim rests on this tier it is marked `[E5]`/`[E6]` in the body and the specific source is named there.

---

## Appendix — Claim index by tier

- **`[E1]` empirical:** C02, C04, C05, C07, C08, C10, C11, C12, C13, C14, C15, C16, C18, C19, C20, C22, C49 (part), C61, C62, C63, C74, C75, C88, C89
- **`[E2]` theoretical/model:** C01, C03, C06, C09, C24, C25, C29, C31, C34, C37, C43, C44, C46, C47, C49 (part), C54, C56, C58, C59, C60, C66, C67, C68, C69, C71, C72, C79, C80, C81, C82, C83, C84, C90
- **`[E3]` standard/curriculum:** C21, C26 (in §1), C51
- **`[E4]` established practice:** C27, C39, C40, C50, C52, C53, C55, C70
- **`[E5]` commercial/proprietary:** C28, C30, C38, C42, C86, C87
- **`[E6]` emerging/contested:** C17, C32, C33, C35, C36, C45, C48, C64, C73, C76, C77, C78, C85
- **`[UNVERIFIED]` (in whole or in named part):** C09 (six-part labels), C21 (grades 4–8), C29 (Aristotle→Field lineage), C37 (Northup content), C50 (SWBST efficacy), C59 (Fan Heng), C65 (Watanabe Masako), C80 (pattern of four; Toelken's structural findings), C81 (pūrākau components), C83 (authorship), C86/C87 (Story Spine efficacy; Coats year)

*End of document.*

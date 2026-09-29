# Agent 4 — Educational Scaffolding, Literacy Development, Vocabulary & Differentiation

**Knowledge base for Character Studio (Episode Page Portal, Grapevine platform) — grades 2–8, with peripheral awareness of K–1 and grade 9**

---

## Scope, method, and how to read this document

**Date of research session:** 2026-08-18
**Searches actually run this session:** 68 successful `WebSearch` queries.
**Full-text retrievals attempted:** 4 `WebFetch` calls (`ies.ed.gov`, `carnegie.org`, `www.readingrockets.org`, `ceedar.education.ufl.edu`) — **all 4 returned `EGRESS_BLOCKED`**. I then verified directly with `curl` through the session proxy that `files.eric.ed.gov` and `en.wikipedia.org` both fail with `CONNECT tunnel failed, response 403`. Outbound HTTPS to research hosts is blocked by this session's organizational egress policy. This matches what Agent 1 reported in module 01.

### This module covers four parts

This is the largest module in the knowledge base because **vocabulary (Part C) and differentiation/accessibility (Part D) were folded in here** alongside instructional scaffolding (Part A) and literacy development through character work (Part B). Each part gets full treatment: a `## WHAT RESEARCH SAYS` section and a `## WHAT CHARACTER STUDIO SHOULD DO` section. A consolidated cross-cutting product specification appears in **Part E**, which is where the scaffold intensity model, feedback rules, anti-over-scaffolding budget, vocabulary rules, differentiation rules and accessibility requirements are gathered into implementable form.

### The single most important caveat: how much to trust each claim

Because full-text and abstract retrieval were blocked, **every piece of evidence in this document was retrieved at search-result level** — page titles, URLs, and the search tool's synthesis of the pages it retrieved. I did not read a single source document end to end. I therefore use a marker in addition to the required evidence tiers:

- **`[SNIPPET]`** — This claim, including any number in it, comes from the search tool's synthesis of retrieved pages, not from a document I read myself. I could not independently confirm that the number was correctly attributed to the study named.

**This matters more in my scope than in any other module.** Writing-instruction meta-analyses are among the most frequently mis-cited numbers in education. I found direct proof of the problem during this session: three different retrieved pages attributed three *different* headline effect sizes to "Graham et al. (2012)" for SRSD/strategy instruction — 1.17, 1.02, and 0.68 — without reconciling them (see `A4-C21`). Two different pages gave peer-feedback effect sizes of 0.89 and 0.58 for overlapping elementary literatures (`A4-C41`). I have **flagged every such conflict inline rather than silently picking one number.**

**Practical instruction for the product team:** any number in this document that you intend to put in front of a school district, a funder, a parent, or a marketing page **must be re-verified against the primary source**. Numbers used only to shape internal product defaults may be used as-is, because the default stance of this document under uncertainty is neutrality (below).

### Evidence tiers

| Tier | Meaning |
|---|---|
| `[E1]` | Empirical finding (primary study, systematic review, meta-analysis) |
| `[E2]` | Theoretical framework / model |
| `[E3]` | Educational standard or curriculum framework |
| `[E4]` | Established instructional practice / professional consensus |
| `[E5]` | Commercial or proprietary system |
| `[E6]` | Emerging or contested claim |
| `[UNVERIFIED]` | Could not confirm this session; what I searched for is stated |
| `[SECONDARY-SOURCED]` | I retrieved a source *describing* work I could not access; the citation is to what I retrieved |
| `[SNIPPET]` | Retrieved only as search-tool synthesis — applies **in addition** to a tier |

### Claim IDs

Every substantive research claim is numbered `A4-Cnn`. Product rules cite the claim IDs they rest on and carry their own confidence, which is **never higher** than the evidence beneath it.

### Shared age taxonomy

| Band | Ages | Grades |
|---|---|---|
| **B0** | 5–6 | K–1 (peripheral) |
| **B1** | 7–8 | 2–3 |
| **B2** | 9–10 | 4–5 |
| **B3** | 11–12 | 6–7 |
| **B4** | 13–14 | 8–9 |

Each finding is reported with **the source's own range first**, then mapped. **Bands are soft defaults, never gates.** Nothing in this document should be implemented as an age lock. Every routing rule in Part E keys on **observed child output**, with band used only as a weak prior that observed behaviour overrides within a single session.

### Default stance under uncertainty

Where evidence is thin, mixed, or context-dependent, **the product default is neutrality or gentle optionality, never prescription.** Several whole literatures in my scope (differentiation, UDL, AI writing assistance for children) are in exactly this state, and the product rules below reflect that by defaulting to "offer, don't impose" and "stay silent unless asked."

### A note on invented thresholds

This document contains numeric product thresholds (how many suggestions, how long to wait, when to fade). **Almost none of these come from research.** Research does not tell you that a tool should wait 45 seconds before offering help. Every such number is tagged **`DESIGN DECISION`** and is an engineering starting point to be A/B tested, not a finding.

---
---

# PART A — INSTRUCTIONAL SCAFFOLDING FOR CREATIVE / NARRATIVE WRITING

## A.1 — WHAT RESEARCH SAYS: the zone of proximal development and its actual empirical status

**`A4-C01`** `[E2]` `[SNIPPET]` The zone of proximal development (ZPD) is a **theoretical construct**, originating with Vygotsky, describing the distance between what a learner can do unassisted and what they can do with support from a more knowledgeable other. It is routinely presented in educational materials as though it were an empirical finding. It is not; it is a framework.
*Retrieved via:* [Simply Psychology ZPD overview](https://www.simplypsychology.org/zone-of-proximal-development.html), [ScienceDirect topic page](https://www.sciencedirect.com/topics/psychology/zone-of-proximal-development).

**`A4-C02`** `[E6]` `[SNIPPET]` The ZPD faces **serious, named measurement critiques**: it is dynamic and context-dependent, varying by learner, task and situation, which makes it hard to operationalize consistently and raises questions about its empirical reliability and validity. Dynamic assessment attempts to operationalize it but relies heavily on qualitative data and is resource-intensive and subjective.
*Retrieved via:* [Simply Psychology](https://www.simplypsychology.org/zone-of-proximal-development.html), [ScienceDirect topic page](https://www.sciencedirect.com/topics/psychology/zone-of-proximal-development).

**`A4-C03`** `[E6]` `[SNIPPET]` **Scaffolding and the ZPD are not the same thing, and conflating them is a documented error.** A retrieved paper argues explicitly that the assumed equivalence between the two is "at best partial and at worst superficial," that equating them weakens the theory, and that the conflation has trivialized Vygotsky's larger cultural-historical project into a single pedagogical tip.
*Retrieved via:* ["Scaffolding and the zone of proximal development: A problematic relationship"](https://www.academia.edu/108616074/Scaffolding_and_the_zone_of_proximal_development_A_problematic_relationship).

**`A4-C04`** `[E2]` `[SNIPPET]` **Scaffolding has its own, separate origin.** Wood, Bruner and Ross (1976), "The Role of Tutoring in Problem Solving," *Journal of Child Psychology and Psychiatry* 17, 89–100, defined scaffolding as "a process that enables a child or novice to solve a task or achieve a goal that would be beyond his unassisted efforts," and proposed **six tutoring functions**: recruitment (gain interest), reduction in degrees of freedom (simplify to match current competence), direction maintenance (keep the learner on task), marking critical features (feedback on important features and incorrect steps), **frustration control (make the process less stressful while not creating dependence on emotional support)**, and demonstration (model portions the learner cannot yet do).
*Retrieved via:* [Wood, Bruner & Ross 1976 PDF](https://sachafund.wordpress.com/wp-content/uploads/2018/10/wood_et_al-1976-journal_of_child_psychology_and_psychiatry.pdf), [Wiley record](https://acamh.onlinelibrary.wiley.com/doi/10.1111/j.1469-7610.1976.tb00381.x), [article summary](https://laurenmarg.com/2018/12/09/article-summary-wood-et-al-1976-role-of-tutoring-in-problem-solving/).

> The sixth function — *frustration control without creating dependence on emotional support* — is the single most product-relevant line in the entire scaffolding literature for a tool that will be tempted to reassure children constantly. It is in the original 1976 definition.

**`A4-C05`** `[E1]` `[SNIPPET]` Van de Pol, Volman and Beishuizen (2010), "Scaffolding in Teacher–Student Interaction: A Decade of Research," *Educational Psychology Review*, reviewed scaffolding research from 1989–2009 and identified **three defining characteristics: contingency, fading, and transfer of responsibility.** They argue **contingency is the most central** — non-contingent fading and non-contingent transfer of responsibility "can never be called scaffolding."
*Retrieved via:* [Springer record](https://link.springer.com/article/10.1007/s10648-010-9127-6), [ERIC EJ924182](https://eric.ed.gov/?id=EJ924182).

**`A4-C06`** `[E6]` `[SNIPPET]` A named critique of ZPD-based teaching is that it **can produce over-reliance on the more knowledgeable other**: "if scaffolding is not gradually withdrawn, learners may become dependent on external guidance."
*Retrieved via:* [Simply Psychology](https://www.simplypsychology.org/zone-of-proximal-development.html).

## A.1 — WHAT CHARACTER STUDIO SHOULD DO

**Confidence: moderate-high for the design posture, low for any specific parameter.**

**Rule A1.1 — Do not market or internally justify Character Studio as "ZPD-based."** `A4-C01`, `A4-C02`, `A4-C03`. The ZPD is a framework with contested operationalization, not an evidence base. Justify design choices from the scaffolding characteristics that *are* operationalized — contingency, fading, transfer of responsibility (`A4-C05`) — and from the specific intervention literatures in A.7–A.9.

**Rule A1.2 — Contingency is the product's primary obligation.** `A4-C05`. Every support Character Studio offers must be a **response to something the child actually did or did not do**, never a scheduled event. If the system cannot name the observed signal that triggered a support, that support must not fire.

```
IF support_trigger.source == "timer" OR "step_counter" OR "age_band"
   AND support_trigger.observed_child_signal == NULL
THEN do_not_offer_support
```

**Rule A1.3 — Implement all six Wood/Bruner/Ross functions, but implement function 5 as restraint, not reassurance.** `A4-C04`. Map them:

| WBR function | Character Studio implementation |
|---|---|
| Recruitment | Entry point invites; never a required tutorial |
| Reduction in degrees of freedom | Optional scoping of the character task (see A.12 on constraints) |
| Direction maintenance | Gentle "you were working on X" on return; never nagging |
| Marking critical features | Naming what the child *did*, not what is missing (see A.9) |
| **Frustration control** | **Reduce task load, do not add praise.** No emotional-support loop that the child must return to. |
| Demonstration | Optional worked/mentor examples, on request (see A.4) |

**Rule A1.4 — Build dependence detection from day one.** `A4-C06`. Dependence is a named, predicted failure mode of scaffolded systems. The product must instrument for it before it ships, not after. See Part E, the Anti-Over-Scaffolding Budget.

---

## A.2 — WHAT RESEARCH SAYS: gradual release of responsibility, and scaffold fading

**`A4-C07`** `[E2]` `[SNIPPET]` Pearson and Gallagher (1983) proposed the **Gradual Release of Responsibility (GRR)** model with three phases — **modeling, guided practice, independent application** — with the explicit end goal of the student taking "total responsibility for the task." It was influenced by Wood, Bruner and Ross's scaffolding and by Vygotsky.
*Retrieved via:* [Pearson GRR PDF](https://www.researchgate.net/profile/P-Pearson/publication/364236124_Gradual_Release_of_Responsibility_Instructional_Model/links/6679f5591846ca33b84fa007/Gradual-Release-of-Responsibility-Instructional-Model.pdf?origin=scientificContributions), ["The Genesis of the Gradual Release of Responsibility Model"](https://www.researchgate.net/publication/345618608_The_Genesis_of_the_Gradual_Release_of_Responsibility_Model).

**`A4-C08`** `[UNVERIFIED]` **I could not locate a meta-analysis or systematic review evaluating the GRR model as a whole.** Searched: "gradual release of responsibility model evidence base Pearson Gallagher critique." Retrieved sources describe GRR's origins, adaptations and 35-year staying power, and one retrieved review notes there have been "very few publications that have explored the historical and conceptual origins of the GRR model" — but I found no effectiveness synthesis. **GRR should be treated as `[E4]` established practice with a strong theoretical pedigree, not as `[E1]`.**
*Retrieved via:* [Webb et al. 2019, *The Reading Teacher*](https://ila.onlinelibrary.wiley.com/doi/abs/10.1002/trtr.1799).

**`A4-C09`** `[E1]` `[SNIPPET]` **The expertise reversal effect** is a well-replicated finding that instructional techniques highly effective for inexperienced learners **lose effectiveness and can have negative consequences for more experienced learners**. Low-knowledge learners benefit more from studying structured worked examples than from solving problems themselves; as knowledge increases, open-ended problem solving becomes more effective. Kalyuga et al. showed the superiority of worked examples over problem-solving practice *disappeared* as trainees gained experience.
*Retrieved via:* [Kalyuga et al., *Educational Psychologist* 38(1)](https://www.tandfonline.com/doi/abs/10.1207/S15326985EP3801_4), [Springer special issue intro](https://link.springer.com/article/10.1007/s11251-009-9102-0), [Chartered College summary](https://my.chartered.college/impact_article/expertise-reversal-effect-and-its-instructional-implications/).

**`A4-C10`** `[E1]` `[SNIPPET]` **Faded worked examples / completion problems** are the operationalized mechanism for fading. Steps are removed sequentially from worked examples for the learner to complete, until the learner solves independently. Retrieved sources report the fading procedure "fosters learning, at least when near transfer performance is considered," and that "individuals learned most about those principles that were faded." Guidance fading is framed as avoiding redundant information for more experienced learners.
*Retrieved via:* [Renkl et al., "From Studying Examples to Solving Problems: Fading Worked-Out Solution Steps Helps Learning"](https://www.researchgate.net/publication/2398854_From_Studying_Examples_to_Solving_Problems_Fading_Worked-Out_Solution_Steps_Helps_Learning), [Sweller, "The Guidance Fading Effect"](https://cogscisci.wordpress.com/wp-content/uploads/2019/08/sweller-guidance-fading.pdf), ["How Fading Worked Solution Steps Works – A Cognitive Load Perspective"](https://link.springer.com/article/10.1023/B:TRUC.0000021815.74806.f6).

**`A4-C11`** `[E6]` `[SNIPPET]` **AI systems are specifically documented as bad at fading.** A retrieved review states that a critical limitation in AI scaffolding is "the lack of calibrated fading — many AI-based tools fail to gradually reduce support, leading to over-reliance on AI-generated hints rather than fostering independent learning," and that the fading problem is hard for both humans and AI because "generative AI provides implicit scaffolding through its adaptive nature, making it hard to gauge when and how to withdraw support," with over-reliance risking "learned helplessness." One retrieved technical approach fades probabilistically by targeting a correct-response probability of 0.5 and automatically decreasing hint count as estimated ability grows.
*Retrieved via:* [Agentic AI and Pedagogical Best Practice (arXiv preprint)](https://arxiv.org/pdf/2606.04543), ["Probability Based Scaffolding System with Fading"](https://link.springer.com/chapter/10.1007/978-3-319-19773-9_49), [Evidence-Decision-Feedback framework (arXiv preprint)](https://arxiv.org/pdf/2602.01415).
*Tiering note: the fading-failure claim comes from preprints and a literature review, not from an RCT. `[E6]`.*

## A.2 — WHAT CHARACTER STUDIO SHOULD DO

**Confidence: high for "must fade," moderate for the mechanism, low for the parameters.**

**Rule A2.1 — Fading is not optional and must be built in v1, not retrofitted.** `A4-C05`, `A4-C09`, `A4-C10`, `A4-C11`. A system that scaffolds without fading is not scaffolding; it is doing the child's work. AI systems are specifically documented as failing here.

**Rule A2.2 — Fade by removing steps from a worked structure, not by reducing enthusiasm.** `A4-C10`. The unit of fading is a *scaffold element*, not a tone. Concretely, for a character-creation flow:

| Level | What the tool provides |
|---|---|
| L3 (fullest) | A completed example character + the field-by-field structure + optional starters for each field |
| L2 | The field-by-field structure + optional starters for 2 of the fields |
| L1 | The field-by-field structure only, blank |
| L0 | A blank canvas and the child's own prior characters as reference |

Fading = moving L3 → L2 → L1 → L0 by **removing elements**, not by making the same elements less friendly.

**Rule A2.3 — Detect the expertise reversal condition and get out of the way.** `A4-C09`. When a child's output already exceeds what the scaffold would have produced, the scaffold is now a cost, not a benefit.

```
IF child_unprompted_output_on_dimension >= scaffold_target_for_dimension
THEN suppress_scaffold_for_dimension (this session)
     AND lower default level for dimension next session
```

**Rule A2.4 — Never advertise GRR as evidence-based.** `A4-C08`. It is a well-regarded practice model with an unlocated effectiveness synthesis. Say "widely used instructional model," not "research-proven."

---

## A.3 — WHAT RESEARCH SAYS: modeling and think-alouds

**`A4-C12`** `[E4]` `[SNIPPET]` Think-alouds involve the teacher vocalizing internal cognitive processes to make them overt. Retrieved sources describe research support for using think-alouds to reveal cognition during reading and writing, and state that "the use of think-alouds increases student understanding, especially for literary texts and for writing." Modeling with *coping* (a model who visibly struggles and recovers) is part of strategy instruction in writing and is connected to self-regulation.
*Retrieved via:* ["Expert and Coping Models in Writing Instruction and Literacy" (ERIC EJ1303499)](https://files.eric.ed.gov/fulltext/EJ1303499.pdf), [Reading Rockets: Think-alouds](https://www.readingrockets.org/classroom/classroom-strategies/think-alouds), [Shanahan on modeling](https://www.readingrockets.org/blogs/shanahan-on-literacy/does-modeling-have-place-high-quality-literacy-teaching).

**`A4-C13`** `[E4]` `[SNIPPET]` Retrieved sources are explicit that **modeling quality varies and some ways of demonstrating are better than others**: "research is clear that observational learning is valuable and that there are ways teachers can use demonstration more effectively than others." I could not retrieve the specific quality criteria.
*Retrieved via:* [Shanahan on modeling](https://www.readingrockets.org/blogs/shanahan-on-literacy/does-modeling-have-place-high-quality-literacy-teaching).

**`A4-C14`** `[UNVERIFIED]` **I could not locate an effect size for think-alouds specifically in narrative or creative writing with children.** Searched: "think aloud modeling writing instruction teacher demonstration research evidence." Sources are practitioner-oriented or describe think-alouds as a component within larger strategy packages (SRSD). Treat think-aloud as `[E4]` component practice whose effect is not separable from the packages it appears in.

## A.3 — WHAT CHARACTER STUDIO SHOULD DO

**Confidence: moderate. This is established practice with an unlocated independent effect.**

**Rule A3.1 — If Character Studio models, it models the *process*, not the *product*.** `A4-C12`. A think-aloud in a character tool shows *how a decision got made* ("I wanted her to seem brave, so I asked myself what she'd do when she's scared — that's how I got the bit about the dark hallway"), not a finished character the child can copy.

**Rule A3.2 — Prefer a coping model over an expert model.** `A4-C12`. Where the tool demonstrates, the demonstration should visibly include a false start and a recovery. An always-correct demonstration teaches children that competent writers do not struggle.

**Rule A3.3 — Modeling is always opt-in and always exits cleanly.** `A4-C09`, `A4-C13`. Label it plainly ("Want to see how someone else worked this out?"), never auto-play it, and let the child dismiss it in one action without penalty or follow-up.

**Rule A3.4 — Never model *this child's* character.** The tool must not demonstrate on the child's own in-progress work — that is not modeling, that is authorship transfer. Demonstrate on a neutral throwaway character.

---

## A.4 — WHAT RESEARCH SAYS: mentor texts and worked examples

**`A4-C15`** `[E1]` `[SNIPPET]` **Worked examples benefit novices specifically.** "By providing novices with worked examples to study, their attention can be fully devoted to learning how the problem should be solved. Worked examples are considered to be mainly effective for novices' learning" — with the expertise reversal effect (`A4-C09`) describing what happens as knowledge grows.
*Retrieved via:* [Kalyuga et al., *Educational Psychologist* 38(1)](https://www.tandfonline.com/doi/abs/10.1207/S15326985EP3801_4).

**`A4-C16`** `[E4]` `[SECONDARY-SOURCED]` `[SNIPPET]` **Mentor texts** — texts writers study closely to notice what real authors do — are a widely used practice. A retrieved practitioner-research source (the Writing For Pleasure Centre, which conducts its own literature reviews rather than primary studies) states that reading, studying and discussing mentor texts matched to the kind of writing children are being asked to produce "can yield a positive effect of +0.76," and "+0.94" for children with special educational needs, against their stated benchmark that "anything above +0.4" is significant.
*Retrieved via:* [Writing For Pleasure Centre, "Teaching the writing processes to children"](https://writing4pleasure.com/2025/10/08/teaching-the-writing-processes-to-children/), [Writing For Pleasure, "Reading In The Writing Classroom" preview](https://writing4pleasure.com/wp-content/uploads/2023/03/Reading-In-The-Writing-Classroom-PREVIEW.pdf).

> **⚠️ Treat `A4-C16`'s numbers with real caution.** I confirmed this session that this source derives its effect sizes from its own set of 43 literature reviews rather than from a single published meta-analysis (`A4-C17`). I could not trace +0.76 or +0.94 to a named primary study or meta-analysis. **Do not put these numbers in external material.**

**`A4-C17`** `[E4]` `[SECONDARY-SOURCED]` `[SNIPPET]` The Writing For Pleasure framework (Young & Ferguson, 2021, *Writing For Pleasure: Theory, Research & Practice*) is a **synthesis of 43 literature reviews spanning 50+ years**, producing "14 enduring principles," of which the source identifies **goal setting as the most effective practice**. It is a secondary synthesis, not a primary meta-analysis.
*Retrieved via:* [Writing For Pleasure, "What is a Writing For Pleasure pedagogy?"](https://writing4pleasure.com/2022/09/15/what-is-a-writing-for-pleasure-pedagogy/), [Schools Week book review](https://schoolsweek.co.uk/book-review-writing-for-pleasure-by-young-and-ferguson/), [WfP Handbook of Research 2025 PDF](https://writing4pleasure.com/wp-content/uploads/2025/01/The-WfPs-Handbook-Of-Research-On-Teaching-Young-Writers-2025.pdf).

**`A4-C18`** `[E1]` `[SNIPPET]` **Design fixation is real, and — critically — examples affect children and adults in opposite directions.** A retrieved study, "Fixation effect in creative ideas generation: Opposite impacts of example in children and adults," reports that exposure to the same example **constrained adults' ability to propose creative solutions but enhanced children's**; the same example can be "within fixation for adults and outside fixation for children." Separately, design fixation is defined as unintentional conformity to existing ideas that limits ideation, with two named mechanisms — unconscious adherence (copying example features without realizing it, even when inappropriate) and conscious blocking.
*Retrieved via:* [Fixation effect in creative ideas generation, *Thinking Skills and Creativity*](https://www.sciencedirect.com/science/article/abs/pii/S1871187115300353), [Exposure Effects in Design Idea Generation](https://www.researchgate.net/publication/228628432_Exposure_Effects_in_Design_Idea_Generation_Unconscious_Conformity_or_a_Product_of_Sampling_Probability), ["Need something different? Here's what's been done"](https://link.springer.com/article/10.3758/s13421-019-01005-4).

**`A4-C19`** `[E1]` `[SNIPPET]` **Mere example exposure without instructions did not stimulate more creative idea generation.** The instruction accompanying the example matters.
*Retrieved via:* ["Need something different? Here's what's been done: Effects of examples and task instructions on creative idea generation," *Memory & Cognition*](https://link.springer.com/article/10.3758/s13421-019-01005-4).

## A.4 — WHAT CHARACTER STUDIO SHOULD DO

**Confidence: moderate. The direction is well-supported; the magnitudes are not verifiable.**

**Rule A4.1 — Example characters are permitted and probably helpful for children, but the framing instruction is load-bearing.** `A4-C18`, `A4-C19`. Never show an example bare. Always attach a divergence instruction:

> ✅ "Here's a character someone else made. What would you change to make yours nothing like this one?"
> ❌ "Here's a great character example!" *(bare exposure — `A4-C19`)*

**Rule A4.2 — Show examples that are structurally instructive but thematically distant.** `A4-C18`. The unconscious-adherence mechanism means children will copy surface features. Deliberately vary the *surface* (genre, setting, species, tone) across the example set so that what remains constant, and therefore what gets copied, is the *structure* (this character wants something; this character is afraid of something).

**Rule A4.3 — Cap example exposure, and never show more than one at a decision point.** `A4-C18`. **DESIGN DECISION:** at most **one** example per creation step, at most **three** examples per session, and none at all once the child has produced their own content on that dimension.

**Rule A4.4 — Rotate the example pool aggressively and monitor for convergence.** `A4-C18`, and see `A4-C70` on AI homogenization. If a measurable share of children's characters across the platform start resembling the example set, the example set is causing fixation and must be widened. **DESIGN DECISION:** flag for review if inter-character similarity within a cohort rises above its own baseline by any detectable margin — set the specific threshold empirically after launch.

**Rule A4.5 — Never claim a mentor-text effect size externally.** `A4-C16`, `A4-C17`.

---

## A.5 — WHAT RESEARCH SAYS: graphic organizers and planning tools for narrative

**`A4-C20`** `[E1]` `[SNIPPET]` Graphic organizers show positive effects, with the **best-documented evidence being for students with disabilities**. A retrieved three-level meta-analysis of single-case studies covered **47 studies, 184 participants, 5,065 repeated measures**, and found graphic organizers effective for enhancing academic performance among K–12 students with disabilities across multiple domains. A separate retrieved intervention study found positive effects of graphic-organizer-plus-storytelling packages on story-writing quality and attitude toward writing among third graders learning German as a second language (maps to **B1**).
*Retrieved via:* ["Effects of Graphic Organizers on Outcomes for Students with Disabilities: Three-Level Meta-Analysis of Single-Case Studies"](https://www.tandfonline.com/doi/full/10.1080/09362835.2024.2389080), [Springer, graphic organizer + storytelling, third graders](https://link.springer.com/article/10.1007/s10212-024-00908-4).

**`A4-C20b`** `[E1]` `[SNIPPET]` In the reading-comprehension literature, **active construction** of graphic organizers by students (rather than being given completed ones) was a content-related feature that **moderated** the effectiveness of text structure instruction in the upper elementary grades (maps to **B2**).
*Retrieved via:* [Bogaerds-Hazenberg et al., *Reading Research Quarterly*](https://ila.onlinelibrary.wiley.com/doi/10.1002/rrq.311).

## A.5 — WHAT CHARACTER STUDIO SHOULD DO

**Confidence: moderate.**

**Rule A5.1 — A character-planning structure (a "character sheet") is a defensible default, but the child must construct it, not receive it filled.** `A4-C20`, `A4-C20b`. The moderator finding on active construction is the strongest available guidance: an organizer the child fills is a scaffold; an organizer the AI fills is a substitution.

**Rule A5.2 — The structure must be reorderable, skippable, and extendable.** `A4-C20b`. Fixed-slot character sheets impose a template. **Requirements:** every field skippable without a warning; child can add their own field with their own label; child can reorder; child can collapse the whole sheet to a blank page (this is the L0 state in Rule A2.2).

**Rule A5.3 — Do not present the character sheet as a completion task.** No progress bars over character fields, no "3 of 8 complete," no completion celebration. A completion meter converts an optional scaffold into an obligation and will drive children to fill fields with whatever the tool suggests. **DESIGN DECISION**, motivated by `A4-C20b` (construction, not completion, is what moderates effect) and by the help-abuse literature (`A4-C63`).

---

## A.6 — WHAT RESEARCH SAYS: sentence frames, starters and stems

**`A4-C22`** `[E4]` `[SNIPPET]` Sentence frames (a sentence with words removed for the student to complete) and sentence starters (the beginning of a sentence for the student to finish) are **widely used, well-described practices**, particularly for multilingual/EAL learners. Retrieved practitioner and policy sources describe them as lowering the barrier to entry, modeling correct syntax, and letting students "participate in academic conversations and writing before they have full control of academic English," and describe writing frames as modeling genre organization and linking language.
*Retrieved via:* [Colorín Colorado](https://www.colorincolorado.org/teaching-ells/ell-classroom-strategy-library/sentence-frames), [The Bell Foundation, Speaking and Writing Frames](https://www.bell-foundation.org.uk/resources/great-ideas/speaking-and-writing-frames/), [Achieve the Core, ELL Supports for Writing and Discussion](https://achievethecore.org/content/upload/ELL%20Supports%20for%20Writing%20and%20Discussion.pdf), [LINCS/TEAL, Make Use of Frames](https://lincs.ed.gov/state-resources/federal-initiatives/teal/guide/makeuse).

**`A4-C23`** `[UNVERIFIED]` **I could not locate a meta-analysis or effect size for sentence frames/starters as an isolated intervention.** Searched: "sentence frames sentence starters writing scaffold research evidence English learners." Every retrieved source was practitioner guidance, foundation guidance, or government/teacher-resource material — no experimental synthesis. **Sentence frames are `[E4]`, not `[E1]`.** This is a notable gap given how ubiquitous the practice is.

**`A4-C24`** `[E4]` `[SNIPPET]` Retrieved guidance emphasizes **differentiating frame intensity by language level**, including offering a word bank for some students and labelling each blank with the required part of speech for students needing the heaviest support.
*Retrieved via:* [Colorín Colorado](https://www.colorincolorado.org/teaching-ells/ell-classroom-strategy-library/sentence-frames).

**`A4-C25`** `[E1]` `[SNIPPET]` **Sentence combining — a related but distinct sentence-level intervention — does have effect sizes**, unlike frames. Retrieved sources report Hillocks (1986) at an average **0.35** for secondary/postsecondary, Graham & Perin (2007) at an average weighted **0.50** for primary and intermediate grades based on five articles, and more recent studies ranging **0.48–0.84**. Retrieved sources also state sentence combining "has a more positive impact than traditional grammar instruction on sentence construction, writing accuracy and writing quality," and that over 85 studies have been conducted over 50 years.
*Retrieved via:* [Australian Education Research Organisation practice guide](https://www.edresearch.edu.au/guides-resources/practice-guides/sentence-combining), [UVA Intensive Intervention Practice Guide](https://literacy.virginia.edu/sites/g/files/jsddwu1006/files/2022-05/Explicit-Instruction-in-Sentence-Combining.pdf), [Springer, sentence-combining RTI intervention](https://link.springer.com/article/10.1007/s11145-021-10135-8).

## A.6 — WHAT CHARACTER STUDIO SHOULD DO

**Confidence: moderate for offering frames (established practice), low for any dosage.**

**Rule A6.1 — Sentence starters are permitted, but they are the *lowest-value, highest-risk* scaffold in the toolkit and must be the first thing faded.** `A4-C23` (no effect size located), `A4-C18` (fixation), `A4-C70` (homogenization). A starter puts the tool's words at the head of the child's sentence. That is precisely the mechanism by which AI suggestion systems homogenize writing (see A.14).

**Rule A6.2 — Frames must be *openable*, never *fill-in-the-blank-only*.** Every frame must have a visible, equally prominent "write it my own way" affordance. **Never** present a frame as the only input path.

**Rule A6.3 — Offer at most a small number of *contrasting* starters, never a single one.** A single starter is a directive. **DESIGN DECISION: two or three, deliberately divergent** (e.g. one about action, one about feeling, one about a thing the character owns), plus a "none of these" option that is not visually de-emphasized.

**Rule A6.4 — Prefer sentence *combining* over sentence *starting* wherever the goal is craft rather than getting unstuck.** `A4-C25`. Sentence combining acts on words the child already wrote; sentence starters supply words the child did not write. For a tool that must preserve authorship, this distinction is decisive. Character Studio should implement an optional "you wrote two short sentences about her — want to try joining them?" affordance and should treat it as the preferred craft intervention for **B2–B4**.

**Rule A6.5 — Never rewrite the child's sentence to demonstrate combining.** Show the child's own two sentences side by side and let them do the joining. If the child asks explicitly for an example, use a *neutral* pair of sentences, not theirs (consistent with Rule A3.4).

---

## A.7 — WHAT RESEARCH SAYS: strategy instruction and SRSD

**`A4-C21`** `[E1]` `[SNIPPET]` **⚠️ CONFLICTING NUMBERS — READ THIS BEFORE CITING ANY SRSD EFFECT SIZE.** Self-Regulated Strategy Development (SRSD; Harris & Graham) is the most strongly evidenced writing intervention I encountered. However, **three different retrieved sources attributed three different headline effect sizes to "Graham et al. (2012)"**:

| Number retrieved | As described by the retrieved source |
|---|---|
| **1.17** | "a Graham et al. (2012) meta-analysis found SRSD had an effect size of 1.17" |
| **0.68** | "another Graham et al. (2012) meta-analysis reviewing 115 experiments confirmed SRSD's effect size of 0.68 for elementary writing" |
| **1.02 / 0.50** | Graham, McKeown, Kiuhara & Harris (2012), *Journal of Educational Psychology* 104, 879–896, elementary grades: **strategy instruction ES = 1.02**; **adding self-regulation to strategy instruction ES = 0.50** |
| **0.82** | Graham & Perin (2007) *Writing Next*: strategy instruction, average weighted ES **0.82**, adolescents |
| **">.85", "1.0–2.55"** | General SRSD literature characterization: "effect sizes typically large, exceeding .85 in meta-analyses and commonly ranging from 1.0 to 2.55 across writing and affective outcome measures" |

I cannot reconcile these from search-result level. The **most internally coherent reading** is that Graham, McKeown, Kiuhara & Harris (2012) analysed **115 documents** and computed average weighted effect sizes for **13 interventions**, requiring ≥4 studies per intervention, reporting **strategy instruction at 1.02** and **adding self-regulation to strategy instruction at 0.50** — and that the 1.17 and 0.68 figures come from other analyses or from misattribution. **Do not cite an SRSD effect size externally without retrieving the primary paper.**
*Retrieved via:* [IES blog on SRSD](https://ies.ed.gov/learn/blog/improving-academic-achievement-through-instruction-self-regulated-strategy-development-science), [SRSD Online research page](https://srsdonline.org/research/), [ERIC EJ994038 — Graham, McKeown, Kiuhara & Harris 2012](https://eric.ed.gov/?id=EJ994038), [Semantic Scholar record](https://www.semanticscholar.org/paper/A-Meta-Analysis-of-Writing-Instruction-for-Students-Graham-McKeown/e974a61f7f041884911889b217323f77107ab838), [Springer, SRSD English writing last decade](https://link.springer.com/article/10.1007/s11145-022-10297-z).

**`A4-C26`** `[E1]` `[SNIPPET]` **What is robust about SRSD, independent of the exact number:** retrieved sources report it is effective across different research teams, different methodologies, different genres including **narrative** and persuasive, and diverse student populations including students with learning disabilities and emotional/behavioral disorders. Writing outcome type moderates effects: **SRSD has a statistically smaller effect on writing length than on writing quality and writing elements.**
*Retrieved via:* [SRSD Online research page](https://srsdonline.org/research/), [Springer, SRSD English writing](https://link.springer.com/article/10.1007/s11145-022-10297-z).

> The length/quality dissociation in `A4-C26` is directly product-relevant: **it is evidence that the right target is not "more words."**

**`A4-C27`** `[E2]` `[SNIPPET]` SRSD's mechanism is described as promoting self-regulation through a **systematic transition from expert to novice**, in which the novice gradually develops expertise — i.e. fading is intrinsic to the model, not bolted on.
*Retrieved via:* ["Expert and Coping Models in Writing Instruction and Literacy"](https://files.eric.ed.gov/fulltext/EJ1303499.pdf).

**`A4-C28`** `[E1]` `[SNIPPET]` **Grammar instruction is the negative case.** Retrieved sources report Graham & Perin (2007) found isolated/traditional grammar teaching was the **only** practice with a negative impact, at **−0.32** for adolescents, and **−0.41** in the elementary meta-analysis; and that in the 2012 meta-analysis of 115 studies, grammar instruction was the only one of the analysed interventions without a statistically significant effect.
*Retrieved via:* ["A meta-analysis of writing instruction for adolescent students"](https://www.academia.edu/113543898/A_meta_analysis_of_writing_instruction_for_adolescent_students), ["A meta-analysis of writing instruction for students in the elementary grades"](https://www.academia.edu/96478546/A_meta_analysis_of_writing_instruction_for_students_in_the_elementary_grades), [Writing Next report PDF](https://media.carnegie.org/filer_public/3c/f5/3cf58727-34f4-4140-a014-723a00ac56f7/ccny_report_2007_writing.pdf).

**`A4-C29`** `[E3]` `[SNIPPET]` The **IES/WWC practice guide "Teaching Elementary School Students to Be Effective Writers" (NCEE 2012-4058)** makes four recommendations: (1) provide daily time for students to write; (2) teach students to use the writing process for a variety of purposes; (3) teach students to become fluent with handwriting, spelling, sentence construction, typing and word processing; (4) create an engaged community of writers. The guide rates evidence as strong/moderate/minimal per recommendation. **I could not retrieve the individual evidence ratings** — the retrieved pages showed the rating table structure but not the assignments.
*Retrieved via:* [WWC practice guide 17](https://ies.ed.gov/ncee/wwc/practiceguide/17), [ERIC ED533112](https://eric.ed.gov/?id=ED533112), [TTAC Online summary](https://ttaconline.org/Resource/JWHaEa5BS750Jqr66HsB3w/Resource-ies-practice-guide-teaching-elementary-school-students-to-be-effective-writers-2012-wwc---what).

**`A4-C30`** `[E1]` `[SNIPPET]` **Writing Next** (Graham & Perin, 2007, report to Carnegie Corporation of New York, Alliance for Excellent Education) identified **11 elements** of effective adolescent writing instruction, grades 4–12. Retrieved sources name: writing strategies; summarization; collaborative writing; specific product goals; word processing; sentence combining; prewriting; inquiry activities; the process writing approach; study of models; writing for content learning. Retrieved sources also state that **strategy instruction's effects "appear to be more dramatic for lower-achieving writers"** and that the 11 elements, even used together, "do not constitute a full writing curriculum." **I could not retrieve the full effect-size table**; I have only the individual figures noted in `A4-C21`, `A4-C25`, `A4-C28`.
*Retrieved via:* [Writing Next PDF](https://media.carnegie.org/filer_public/3c/f5/3cf58727-34f4-4140-a014-723a00ac56f7/ccny_report_2007_writing.pdf), [AdLit summary](https://www.adlit.org/topics/writing/summary-writing-next), [LINCS/TEAL fact sheet](https://lincs.ed.gov/federal-initiatives/teal/guide/researchbasedwriting).

**`A4-C31`** `[E1]` `[SNIPPET]` **Specific product goals** are a *Writing Next* element and appear repeatedly as high-value. Retrieved description: students are assigned specific, reachable goals for the writing they produce — number of paragraphs, number of supporting details, types of sentences, self-editing steps — set by instructor, student, or collaboratively. A retrieved practitioner-research source claims **process goals at +2.03** and Locke & Latham effect sizes of **.42–.80** for specific rather than general goals in organizational settings.
*Retrieved via:* [Ohio LINK dissertation on goal setting](https://etd.ohiolink.edu/acprod/odb_etd/ws/send_file/send?accession=kent1395826954&disposition=inline), [Writing For Pleasure, "Trust the process: setting process goals"](https://writing4pleasure.com/2023/04/03/trust-the-process-setting-process-goals/), [ERIC ED589978, Student Goal Setting](https://files.eric.ed.gov/fulltext/ED589978.pdf).

> **⚠️ The +2.03 figure in `A4-C31` should be treated as unusable externally.** It comes from the same secondary practitioner synthesis flagged in `A4-C16`/`A4-C17`, and an effect size above 2.0 for a general instructional practice is extraordinary. The Locke & Latham .42–.80 range is from organizational psychology, not children's writing.

## A.7 — WHAT CHARACTER STUDIO SHOULD DO

**Confidence: high for the direction, low for magnitudes.**

**Rule A7.1 — Character Studio should teach a *strategy*, not supply *content*.** `A4-C21`, `A4-C26`, `A4-C30`. This is the single strongest research-to-product mapping in this module. The best-evidenced writing intervention family teaches children a repeatable procedure they internalize and take away. The tool's core loop should be a strategy the child can eventually run without the tool.

**Rule A7.2 — Never optimize for output length.** `A4-C26`. SRSD's effect on length is *smaller* than on quality and elements. A tool that celebrates word counts is optimizing the dimension the evidence says matters least. **Never** display word count as an achievement, never prompt "can you add more?" as a generic nudge, never gate features on length.

**Rule A7.3 — Never implement isolated grammar correction as a writing-improvement feature.** `A4-C28`. This is the one practice in the writing meta-analyses with a *negative* effect on writing quality. Character Studio may offer spelling/mechanics support as an **accessibility** affordance (Part D) — clearly framed as transcription help — but must not present grammar correction as improving the child's writing.

**Rule A7.4 — Support child-set, specific, small goals; never impose them.** `A4-C31`, and see A.11 on autonomy. Implementation: an optional "what do you want to get done today?" with concrete child-authored options ("figure out what she's scared of," "give him a voice"). The tool never assigns a goal. The tool never scores against the goal.

**Rule A7.5 — Route strategy support preferentially to children producing less.** `A4-C30`. Strategy instruction's effects are more dramatic for lower-achieving writers. In the intensity model (Part E) this justifies output-keyed rather than age-keyed routing — but see Rule D-diff on never labelling.

---

## A.8 — WHAT RESEARCH SAYS: the writing process — planning, drafting, revising

**`A4-C32`** `[E2]` `[SNIPPET]` **Transcription constrains composition.** Retrieved sources state that in young/novice writers, handwriting and spelling "drain attentional resources from high-level writing processes fundamental to produce good texts, such as planning ideas or translating them into language," and act "as a constraint on the higher level processes of writing such as planning and revision." A retrieved meta-analysis of K–12 studies reports a **mean standardized effect of 0.49** for the relationship between spelling-test performance and writing quality, and **0.49** for the effect of handwriting fluency.
*Retrieved via:* ["The process-disruption hypothesis"](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9470714/), ["Examining the transcription-writing link"](https://www.sciencedirect.com/science/article/abs/pii/S104160801630262X), ["Examining the contribution of handwriting and spelling to written expression in kindergarten children"](https://pmc.ncbi.nlm.nih.gov/articles/PMC3474373/).

**`A4-C33`** `[E2]` `[SNIPPET]` **Kim's Direct and Indirect Effects model of Writing (DIEW)** specifies that writing draws on transcription, oral language, and **higher-order cognitive skills including reasoning, inferencing and perspective taking**, plus background knowledge and regulation. Retrieved findings: in **Grade 1** (maps to **B0/B1**) transcription skills were *directly* related to writing while vocabulary, grammatical knowledge, working memory and attention were *indirectly* related; in **Grade 3** (maps to **B1**) **inference and spelling were directly related**, working memory contributed both directly and indirectly, and attention, vocabulary and grammatical knowledge contributed indirectly via spelling and inference. In a study of 350 second graders (**B1**), higher-order cognitive skills related *differentially* to three dimensions of written composition, and **reading comprehension was related only to writing quality — not to productivity or correctness.**
*Retrieved via:* [Kim, "Unpacking pathways using DIEW," *Reading and Writing*](https://link.springer.com/article/10.1007/s11145-018-9913-y), [Kim et al., "Expanding DIEW," *Journal of Educational Psychology* 2022 (APA PDF)](https://www.apa.org/pubs/journals/features/edu-edu0000564.pdf), [ERIC EJ1325053](https://eric.ed.gov/?id=EJ1325053&pg=27&q=writing+skills%3A+a+cross+as+class+as+year+index).

**`A4-C34`** `[E1]` `[SNIPPET]` **Young writers revise at the surface, and this is developmental, not a character flaw.** Retrieved findings: young writers "primarily make surface level revisions and these changes generally do not improve the compositions"; **"Younger students focused on mechanical and local problems, while older writers also considered meaning and global problems"**; surface revisions were more frequent than meaning revisions, but this difference "was only significant for younger children, or when revision occurred during writing."
*Retrieved via:* ["How to make it easier for children to revise their writing: A study of text revision from 3rd to 5th grades"](https://www.researchgate.net/publication/12026298_How_to_make_it_easier_for_children_to_revise_their_writing_A_study_of_text_revision_from_3rd_to_5th_grades), [Learning Disabilities: A Contemporary Journal 12(2)](https://files.eric.ed.gov/fulltext/EJ1047458.pdf).

**`A4-C35`** `[E1]` `[SNIPPET]` **Named barriers to children's revision**: young writers "may assume readers will believe their writing is clear and therefore see no need to revise"; "may have difficulties determining what parts of their writing they need to change"; "may lack the skill to make the changes they do detect"; and may have "unclear or ill-defined revision goals."
*Retrieved via:* ["Insights from Instructional Research on Revision with Struggling Writers"](https://www.researchgate.net/publication/284867588_Insights_from_Instructional_Research_on_Revision_with_Struggling_Writers), [ERIC EJ1047458](https://files.eric.ed.gov/fulltext/EJ1047458.pdf).

**`A4-C36`** `[E1]` `[SNIPPET]` **Revision is teachable, and instruction to revise increases revision.** "When children are explicitly taught how to revise via strategies, they are more likely to write effectively," and "children made more revisions when they received specific instructions to revise, whatever the timing of the revision."
*Retrieved via:* ["How to make it easier for children to revise their writing"](https://www.researchgate.net/publication/12026298_How_to_make_it_easier_for_children_to_revise_their_writing_A_study_of_text_revision_from_3rd_to_5th_grades).

**`A4-C37`** `[E4]` `[SNIPPET]` **Drawing supports early composition.** Retrieved sources report early elementary students who drew their ideas before writing in an Artists/Writers workshop increased writing and reading comprehension scores relative to peers, and that struggling early elementary students increased their writing scores. Retrieved multimodality research describes children strategically integrating drawing and writing according to social purpose, with **drawing enabling meanings "less readily conveyed through writing alone."**
*Retrieved via:* ["First Graders Constructing Meaning Through Drawing and Writing" (ERIC EJ1094945)](https://files.eric.ed.gov/fulltext/EJ1094945.pdf), ["Intermodality in practice"](https://www.tandfonline.com/doi/full/10.1080/20004508.2025.2479317?af=R), ["Children's use of drawing as a pre-writing strategy"](https://www.researchgate.net/publication/263173481_Children's_use_of_drawing_as_a_pre-writing_strategy).

**`A4-C38`** `[E4]` `[SNIPPET]` **Teacher–student writing conferences** are described as widely recognized and effective, supporting not only writing quality but "students' self-regulation of the writing process and their beliefs that they can reach writing goals." However, a retrieved source states plainly that "much of what is known about conferencing is derived from teacher testimonials or practitioner publications and the field is lacking empirical research examining the effects of conferencing on student writing outcomes with young primary students."
*Retrieved via:* ["Conferencing: A Catalyst for Developing Children's Writing," *Early Childhood Education Journal*](https://link.springer.com/article/10.1007/s10643-024-01778-7), [REL West, K–6 writing conferences](https://ies.ed.gov/ncee/edlabs/regions/west/Ask/Details/4).

## A.8 — WHAT CHARACTER STUDIO SHOULD DO

**Confidence: high for transcription relief, moderate for revision design.**

**Rule A8.1 — Reducing transcription burden is one of the highest-confidence interventions available to a digital tool.** `A4-C32`, `A4-C33`. Every keystroke a child does not have to fight for is attention returned to character thinking. This justifies (and is the *reason* for) the accessibility requirements in Part D, and it applies to **all** children, not only those with identified needs.

**Rule A8.2 — Do not expect meaning-level revision from B1, and do not treat its absence as failure.** `A4-C34`. For **B1 (7–8)**, surface revision is the developmentally typical behaviour. Character Studio must not display revision prompts that imply the child has done something wrong by not restructuring.

**Rule A8.3 — Where revision is supported, target the four named barriers directly.** `A4-C35`, `A4-C36`:

| Barrier | Character Studio response |
|---|---|
| Assumes reader will understand | Offer a **reader-perspective view** — show the character as a stranger would see it, using only what the child wrote |
| Cannot locate what to change | Let the child choose a *dimension* to revisit ("her voice," "what she wants"), never point at a specific sentence unprompted |
| Lacks skill to make the change | Offer the *strategy*, on request, not the rewrite |
| Unclear revision goals | Support the child in setting one small goal (`A4-C31`, Rule A7.4) |

**Rule A8.4 — Never auto-revise, never offer a rewritten version of the child's text, never diff the child's text against a "better" version.** `A4-C35`, and see A.14. This is the clearest line in the whole document. Revision instruction increases revision (`A4-C36`); revision *substitution* removes the learning entirely.

**Rule A8.5 — Support drawing/visual work as a legitimate first-class composition mode, not a reward.** `A4-C37`. For **B0–B2** especially, allowing the child to draw or select visual elements *before* or *instead of* writing is supported. It must not be positioned as "the fun bit you get after the writing."

**Rule A8.6 — If Character Studio implements anything conference-like, label its evidence honestly internally.** `A4-C38`. Conferencing's evidence base with young primary writers is thin by its own literature's admission.

---

## A.9 — WHAT RESEARCH SAYS: feedback

This is the most consequential area for Character Studio, because a tool that speaks to children *is* a feedback system whether or not it calls itself one.

**`A4-C39`** `[E1]` `[SNIPPET]` **Feedback is not reliably good. Over a third of feedback interventions made performance worse.** Kluger & DeNisi (1996) meta-analysed **607 effect sizes across 23,663 observations**; feedback interventions improved performance on average, but **over one-third decreased performance**. Their Feedback Intervention Theory holds that **effectiveness decreases as attention moves up the hierarchy, away from the task and toward the self.**
*Retrieved via:* [Hebrew University record](https://cris.huji.ac.il/en/publications/the-effects-of-feedback-interventions-on-performance-a-historical/), [Kluger & DeNisi 1996 PDF](https://mrbartonmaths.com/resourcesnew/8.%20Research/Marking%20and%20Feedback/The%20effects%20of%20feedback%20interventions.pdf), [SAGE Encyclopedia entry on FIT](https://methods.sagepub.com/ency/edvol/sage-encyclopedia-of-educational-research-measurement-evaluation/chpt/feedback-intervention-theory).

**`A4-C40`** `[E1]` `[SNIPPET]` Hattie & Timperley (2007), "The Power of Feedback," *Review of Educational Research* 77, 81–112, synthesized **74 meta-analyses** from Hattie's database spanning **7,000+ studies and 13,370 effect sizes**. Retrieved sources report a general feedback effect **between 0.70 and 0.79**, with wide variation by type: **praise, rewards and punishment showed the lowest effects**. Their model defines **four levels**: task, process, self-regulation, and **self**. Retrieved sources state **the first three — task, process, self-regulation — are the beneficial ones**; the **self** level (feedback about personal characteristics of the learner) is the one to avoid.
*Retrieved via:* [Hattie & Timperley 2007 PDF](https://assess.ucr.edu/sites/default/files/2019-02/hattietimperley_2007.pdf), [second PDF copy](https://conselhopedagogico.tecnico.ulisboa.pt/files/sites/32/hattie-and-timperley-2007.pdf), [SAGE record](https://journals.sagepub.com/doi/abs/10.3102/003465430298487), [BERA blog on optimising the levels](https://www.bera.ac.uk/blog/how-to-optimise-the-use-of-hattie-and-timperleys-feedback-levels-for-student-learning).

**`A4-C41`** `[E1]` `[SNIPPET]` **Graham, Hebert & Harris (2015), "Formative Assessment and Writing: A Meta-Analysis," *The Elementary School Journal* 115(4)** — grades 1–8, which is **exactly Character Studio's band** — found feedback on writing enhanced writing quality with average weighted effect sizes of:

| Feedback source | Average weighted ES |
|---|---|
| **Adults** | **0.87** |
| **Self** | **0.62** |
| **Peers** | **0.58** |
| **Computers** | **0.38** |

They also found that **teachers' monitoring of students' writing progress** and **implementation of the 6+1 Trait Writing model** did **not** meaningfully enhance students' writing.
*Retrieved via:* [Journals.uchicago.edu record](https://www.journals.uchicago.edu/doi/10.1086/681947), [ERIC EJ1068976](https://eric.ed.gov/?id=EJ1068976), [UNL DigitalCommons PDF](https://digitalcommons.unl.edu/cgi/viewcontent.cgi?article=1226&context=specedfacpub).

> **This is the most directly applicable finding in the module.** In grades 1–8, **computer-delivered feedback had the lowest effect size of the four sources (0.38), less than half that of adult feedback (0.87).** Character Studio is a computer. Design accordingly: the tool's feedback is the *weakest* of the available channels, so it should be used sparingly and should preferentially **route toward** the stronger channels (self-evaluation at 0.62, peers at 0.58, adults at 0.87) rather than substituting for them.
>
> **⚠️ Number conflict:** a separate retrieved source attributes **peer assistance in writing at ES 0.89** to elementary meta-analytic work, against the 0.58 above for peer feedback in grades 1–8. These may be different constructs (collaborative *writing* vs. peer *feedback*). Do not merge them.
> *Conflicting figure retrieved via:* [Savvas research recap of most effective writing strategies](https://www.savvas.com/resource-center/blogs-and-podcasts/savvas-insights/science-of-reading-research-recap/a-study-on-most-effective-writing-strategies).

**`A4-C42`** `[E1]` `[SNIPPET]` **Mueller & Dweck (1998), "Praise for Intelligence Can Undermine Children's Motivation and Performance," *Journal of Personality and Social Psychology* 75, 33–52.** With **fifth graders** (maps to **B2**), praise for intelligence had more negative consequences than praise for effort: children praised for intelligence cared more about performance goals relative to learning goals, and **after failure** showed **less task persistence, less task enjoyment, more low-ability attributions, and worse task performance** than children praised for effort. They also described intelligence as a fixed trait more than children praised for hard work.
*Retrieved via:* [PubMed 9686450](https://pubmed.ncbi.nlm.nih.gov/9686450/), [UPenn PDF](https://cpb-us-w2.wpmucdn.com/web.sas.upenn.edu/dist/b/398/files/2019/04/1998-04530-003-1sagefw.pdf), [Student Experience Research Network summary](https://studentexperiencenetwork.org/research_library/praise-for-intelligence-can-undermine-childrens-motivation-and-performance/).

**`A4-C43`** `[E6]` `[SNIPPET]` **The person/process praise literature has replication problems and probable cultural moderation.** Retrieved: "a recent study failed to replicate" the finding that person-oriented feedback reduces persistence and intrinsic motivation after failure; and "one recent study did not replicate the experimental finding that process praise increases challenge-seeking and persistence relative to person praise with 9- to 13-year-old students in China, raising questions about the original finding and the role cultural context might play." Retrieved sources also report that **children with low self-esteem are most vulnerable** to the detrimental effects of person praise.
*Retrieved via:* [Haimovitz & Corpus, Reed College PDF](https://www.reed.edu/psychology/motivation/assets/downloads/Haimovitz_Corpus_2011.pdf), [Henderlong & Lepper 2002 review PDF](https://www.reed.edu/psychology/motivation/assets/downloads/Henderlong_Lepper_2002.pdf), ["Effects of praise and 'easy' feedback on children's persistence and self-evaluations"](https://www.sciencedirect.com/science/article/abs/pii/S0022096524001723), ["Wow, you're really smart!"](https://www.tandfonline.com/doi/abs/10.1080/01443410.2024.2396422).

**`A4-C44`** `[E1]` `[SNIPPET]` **Growth mindset interventions have far smaller effects than their popularity implies.** Sisk, Burgoyne, Sun, Taylor & Macnamara (2018), *Psychological Science*: overall **d = 0.08, 95% CI [0.02, 0.14]**. Macnamara & Burgoyne (2023), *Psychological Bulletin*: aggregate effects **d ≈ 0.05–0.10**, substantial publication bias, and "apparent effects of growth mindset interventions on academic achievement are likely attributable to inadequate study design, reporting flaws, and bias," with an insignificant overall effect among studies most closely following best practices. Roughly a third of studies did not report whether the intervention changed mindset at all; of those that did, around half failed to show it did.
*Retrieved via:* [Macnamara & Burgoyne PDF (Case Western)](https://artscimedia.case.edu/wp-content/uploads/sites/141/2020/06/26110416/Macnamara-Burgoyne-2023.pdf), [Macnamara et al. 2022 PDF](https://alexanderpburgoyne.com/wp-content/uploads/2025/02/Macnamara-et-al.-2022-Do-Growth-Mindset-Interventions-Impact-Students-Academic-Achievement.pdf), [Gazmuri et al. 2025, *Review of Education*](https://bera-journals.onlinelibrary.wiley.com/doi/10.1002/rev3.70066).

**`A4-C45`** `[E1]` `[SNIPPET]` **Feedback timing: no clear winner.** Retrieved: both immediate and delayed feedback significantly enhanced outcomes vs. no feedback, with "no substantial differences" between timings in one language-learning study; immediate feedback showed stronger effects on delayed tests in a vocabulary study; **immediate feedback yielded significant effects in affective and cognitive domains while delayed feedback was more effective in fostering willingness to collaborate**, "likely due to the reflective space it provided"; and a medical-education study concluded "Timing's not everything: Immediate and delayed feedback are equally beneficial for performance in formative multiple-choice testing."
*Retrieved via:* [ScienceDirect, immediate vs delayed feedback and FIT](https://www.sciencedirect.com/science/article/abs/pii/S0023969025000396), [Nature HSSC, timing of feedback and retrieval practice](https://www.nature.com/articles/s41599-024-03983-6), [Medical Education, "Timing's not everything"](https://asmepublications.onlinelibrary.wiley.com/doi/full/10.1111/medu.15287), [PMC12702585](https://pmc.ncbi.nlm.nih.gov/articles/PMC12702585/).

**`A4-C46`** `[E1]` `[SNIPPET]` **AI feedback is worse than trained human feedback, but not worthless.** Steiss et al. (2024), "Comparing the quality of human and ChatGPT feedback of students' writing," *Learning and Instruction* — **200 human-generated and 200 AI-generated pieces of formative feedback on the same secondary student essays**. **Human raters outperformed ChatGPT on four of five criteria**; ChatGPT achieved comparable performance only on **criteria alignment**. AI and humans differed in feedback quality depending on essay quality. **Feedback did not vary by language status for either humans or AI.** Authors' framing: generative AI "may still be useful in some contexts, particularly in formative early drafts or instances where a well-trained educator is unavailable."
*Retrieved via:* [ScienceDirect record](https://www.sciencedirect.com/science/article/pii/S0959475224000215), [eScholarship copy](https://escholarship.org/uc/item/6k61v37f), [ASU record](https://asu.elsevierpure.com/en/publications/comparing-the-quality-of-human-and-chatgpt-feedback-of-students-w/).

**`A4-C47`** `[E1]` `[SNIPPET]` **Automated Writing Evaluation meta-analyses report large effects but almost no K–12 evidence.** Retrieved: AWE had "a large positive overall effect on writing quality (g = 0.861)" across **26 primary studies, 2,468 participants, 2010–2022**; a separate meta-analysis reported **g = 0.55** across **20 studies (k = 84; N = 2,828)**. Crucially: **"82.4% of all AWE studies were conducted at the tertiary level, only 15 studies were carried out in K-12 education"**, and AWE "was more effective for post-secondary students than for secondary students."
*Retrieved via:* [ERIC EJ1380424](https://eric.ed.gov/?id=EJ1380424), [PMC10351274, multi-level meta-analysis](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10351274/), [Cambridge ReCALL systematic review](https://www.cambridge.org/core/journals/recall/article/systematic-review-of-aibased-automated-written-feedback-research/28A670C4C7F2F1F30C7EA36EC489F867).

**`A4-C48`** `[E1]` `[SNIPPET]` **6+1 Trait Writing has mixed and contested evidence.** `A4-C41` reports the Graham/Hebert/Harris meta-analysis found 6+1 Trait implementation did **not** meaningfully enhance students' writing. A separate retrieved REL Northwest study of first-year implementation in **74 Oregon elementary schools (102 teachers / 2,230 students treatment; 94 teachers / 1,931 students control)** reported a statistically significant increase in writing scores. Another retrieved analysis states the model "has not been adequately studied using experimental methods." **I found no WWC effectiveness rating for it.**
*Retrieved via:* [Education Northwest 6+1 Trait research](https://educationnorthwest.org/resources/61-trait-writing-research), [ERIC ED527445, impact study](https://files.eric.ed.gov/fulltext/ED527445.pdf), [Reading Rockets, Writing Assessment](https://www.readingrockets.org/topics/writing/articles/writing-assessment).

## A.9 — WHAT CHARACTER STUDIO SHOULD DO

**Confidence: high. This is the best-evidenced product area in the module and the rules are correspondingly firm.**

### Rule A9.1 — The tool's default state is silence.

`A4-C39`, `A4-C41`. Over a third of feedback interventions harm performance, and computer-sourced feedback is the weakest of the four sources measured in exactly this grade band. The burden of proof is on *speaking*, not on staying quiet.

```
default_feedback_state = SILENT

speak IF:
   child_explicitly_requested_feedback
OR child_hit_an_explicit_stuck_affordance
OR child_completed_a_self_declared_goal AND opted_into_acknowledgement

do NOT speak on:
   idle_timer
OR field_blur
OR keystroke_pause
OR session_start
OR "encouragement" schedules
```

### Rule A9.2 — Feedback may address task, process, or self-regulation. It may NEVER address the self.

`A4-C40`, `A4-C39`. This is Hattie & Timperley's level structure plus Kluger & DeNisi's mechanism, and they agree: attention drawn to the self degrades performance.

| Level | Allowed? | Example |
|---|---|---|
| Task | ✅ | "Your character wants to find her brother — that's in there twice." |
| Process | ✅ | "You started with what she's scared of. That's one way in." |
| Self-regulation | ✅ | "Want to check whether she still sounds the way you wanted?" |
| **Self** | ❌ **NEVER** | "You're such a creative writer!" / "You're really good at this." |

### Rule A9.3 — THE NEVER-SAY LIST

Character Studio must **never** emit any of the following. This list is normative and should be implemented as an output filter, not merely as prompt guidance.

**Never say — person/self-level praise** (`A4-C40`, `A4-C42`, `A4-C43`):
- "You're so creative / talented / smart / a natural writer."
- "You're such a good storyteller."
- "You have a real gift for this."
- Any sentence whose subject is the child and whose predicate is a stable trait.

**Never say — evaluative verdicts on the child's character or story** (`A4-C39`):
- "Great character!" / "Amazing!" / "Perfect!" / "I love this!"
- "This is better than your last one." / any cross-work comparison.
- Any rating, score, star, grade, or percentage applied to the child's creative work.

**Never say — comparison to other children** (`A4-C39`, `A4-C42`):
- "Most kids your age..." / "Other writers usually..."
- Any leaderboard, percentile, or peer benchmark.

**Never say — deficit or diagnosis framing** (Part D, `A4-C126`, `A4-C127`, `A4-C132`):
- "You seem to be struggling." / "This looks hard for you."
- "Since writing is tricky for you..." / any statement implying a category.
- Any visible label, badge, or mode name that denotes support level.

**Never say — authorship-claiming or authorship-eroding language** (`A4-C74`, `A4-C75`, `A4-C76`):
- "I made this character for you." / "Here's your character."
- "I fixed that for you." / "I improved this."
- Any presentation of AI text as the child's, or of the child's text as the AI's.

**Never say — pressure, urgency, or shame** (`A4-C04` frustration control):
- "You haven't written anything yet."
- "Don't give up!" / "Come on, you can do it!"
- "You're almost there!" applied to a task the child did not set.

**Never say — unrequested correction of the child's language variety** (Part D, `A4-C126`, `A4-C127`):
- Any flagging of African American English, other English varieties, or L1-influenced constructions as errors in *creative* writing or in *character voice*.

**Never say — growth-mindset slogans presented as fact** (`A4-C44`):
- "Your brain grows when you struggle!" / "Mistakes make your brain stronger!"
- These have d ≈ 0.08 and substantial publication-bias concerns. They are not harmless filler; they are unearned claims delivered to children.

### Rule A9.4 — When the tool does speak, it describes rather than evaluates.

`A4-C39`, `A4-C40`. The safe grammatical form is **second-person, past-tense, specific, about the text**:

> ✅ "You gave her a reason to lie in the second bit."
> ✅ "He's afraid of water at the start and not at the end."
> ❌ "Nice job showing her motivation!"

Description carries information (task-level) without moving attention to the self.

### Rule A9.5 — Prefer routing to a stronger feedback channel over speaking.

`A4-C41`. Adults 0.87 > self 0.62 > peers 0.58 > computers 0.38. When the child wants feedback, the tool's *best* move is often to hand off:

```
IF child_requests_feedback:
   offer, in this order, whichever are available in context:
     1. self-evaluation affordance  (ES 0.62)   e.g. "want to read it as if you'd never met her?"
     2. share-with-a-person path    (ES 0.87)   e.g. teacher/family/peer, per platform policy
     3. tool-generated description  (ES 0.38)   last, smallest, and clearly labelled as the tool's view
```

### Rule A9.6 — Feedback timing is a usability decision, not a research-determined one.

`A4-C45`. The evidence does not favour immediate or delayed. Therefore **let the child choose**, and default to *after the child says they're done with a pass* rather than mid-composition — because mid-composition interruption is a *cognitive load* problem (`A4-C32`), not a feedback-timing problem. **DESIGN DECISION.**

### Rule A9.7 — Never present the tool's feedback as authoritative.

`A4-C46`, `A4-C47`. Trained humans beat ChatGPT on four of five feedback criteria, and the AWE evidence base is 82.4% tertiary with only 15 K-12 studies. The tool must speak provisionally: "Here's one thing I noticed — you decide if it matters." Children over-trust machines (`A4-C77`), which raises the stakes of this phrasing.

### Rule A9.8 — Do not ship a trait rubric scored by the tool.

`A4-C41`, `A4-C48`. The one named commercial writing-trait framework in the meta-analytic record did **not** meaningfully enhance writing in the grades 1–8 meta-analysis. Character Studio may offer trait *language* as a vocabulary for the child's own reflection; it must not score children on traits.

---

## A.10 — WHAT RESEARCH SAYS: peer and collaborative scaffolding

**`A4-C49`** `[E1]` `[SNIPPET]` **Collaborative writing is a *Writing Next* element** — "instructional arrangements in which adolescents work together to plan, draft, revise, and edit their compositions" (`A4-C30`). Retrieved elementary meta-analytic figures: **peer assistance when writing ES 0.89**; a separate figure of **0.51** for students working together on writing; and **0.58** for peer feedback on student writing in grades 1–8 (`A4-C41`). See the conflict note under `A4-C41`.
*Retrieved via:* [Savvas research recap](https://www.savvas.com/resource-center/blogs-and-podcasts/savvas-insights/science-of-reading-research-recap/a-study-on-most-effective-writing-strategies), [ERIC EJ994038](https://eric.ed.gov/?id=EJ994038), [Journals.uchicago.edu](https://www.journals.uchicago.edu/doi/10.1086/681947).

**`A4-C50`** `[E1]` `[SNIPPET]` **Peer feedback works better with training.** A retrieved meta-analysis reports peer feedback **without** prior training at **Hedges' g = .60** and **with** prior training at **g = .74**. Overall peer feedback effects reported include **d = .73** and **g = 0.91** vs. no feedback. Larger effect sizes emerged when students had more time to write and treatments were longer.
*Retrieved via:* [Double-blind meta-analysis of formative peer feedback, *Assessment & Evaluation in Higher Education*](https://www.tandfonline.com/doi/full/10.1080/02602938.2018.1545896), [Vuogan & Li, *TESOL Quarterly*](https://onlinelibrary.wiley.com/doi/abs/10.1002/tesq.3178).
*Note: several of these figures come from higher-education and L2 contexts, not grades 2–8.*

**`A4-C51`** `[E1]` `[SNIPPET]` **Struggling writers need explicit instruction in how to collaborate.** Retrieved: "struggling writers need explicit instruction in how to work effectively on collaborative writing projects in order to enjoy the maximum benefit from them." Also: "the presence of explicit instruction in combination with collaborative writing is positively related to argumentative writing performance and self-efficacy for writing."
*Retrieved via:* [Savvas research recap](https://www.savvas.com/resource-center/blogs-and-podcasts/savvas-insights/science-of-reading-research-recap/a-study-on-most-effective-writing-strategies), [Springer, argumentation in collaboration](https://link.springer.com/article/10.1007/s11145-023-10439-x).

**`A4-C52`** `[E2]` `[SNIPPET]` **Graham's Writer(s)-Within-Community model** (revised version, *Educational Psychologist* 53(4)) frames writing as simultaneously shaped by the writing community (purposes, members, tools, actions, written products, physical and social environments, collective history, and social/cultural/political/institutional/historical forces) and by individual writers (long-term memory resources, production processes, modulators, written product). It proposes that **writing development is a consequence of participation in writing communities.**
*Retrieved via:* [Taylor & Francis record](https://www.tandfonline.com/doi/abs/10.1080/00461520.2018.1481406), [ResearchGate PDF record](https://www.researchgate.net/publication/328082076_A_Revised_Writers-Within-Community_Model_of_Writing).

## A.10 — WHAT CHARACTER STUDIO SHOULD DO

**Confidence: moderate. Effect sizes are inconsistent and partly from non-target populations.**

**Rule A10.1 — Human peers and adults are Character Studio's most valuable feature, and the AI is the least valuable.** `A4-C41`, `A4-C49`, `A4-C52`. The product's ambition should be to be a good *member of a writing community*, not a replacement for one. Concretely: sharing, reading each other's characters, and using a character in someone else's story are higher-value features than better AI suggestions.

**Rule A10.2 — If peer feedback is enabled, train the peers.** `A4-C50`, `A4-C51`. Untrained peer feedback is materially weaker than trained. Training here means: a small, fixed set of child-usable response moves, taught once and available as a reminder — e.g. "say one thing you can picture," "ask one question you still have about them." Never a free-text "rate this character."

**Rule A10.3 — Peer feedback must be constrained to non-evaluative forms.** `A4-C39`, `A4-C42`. The never-say list (Rule A9.3) applies to *peer* utterances too, enforced by the response-move structure: children give **observations and questions**, not verdicts. No stars, no ratings, no "best character" surfacing.

**Rule A10.4 — Do not make collaboration mandatory.** `A4-C51`. Children who find collaboration hard need instruction, not compulsion; and for some children (Part D) a required social step is an access barrier. Solo must remain a full-featured path.

---

## A.11 — WHAT RESEARCH SAYS: motivation, autonomy, choice and ownership

**`A4-C53`** `[E2]` `[SNIPPET]` **Self-Determination Theory** holds that self-determined motivation depends on satisfying three needs — **autonomy, competence, relatedness** — facilitated by need-supportive behaviours from others. Autonomy is "students' ability to make choices and feel ownership of their learning."
*Retrieved via:* [APA, Self-determination theory](https://www.apa.org/research-practice/conduct-research/self-determination-theory), [Guay 2022, *Canadian Journal of School Psychology*](https://journals.sagepub.com/doi/10.1177/08295735211055355), [PMC8935530, meta-analysis of antecedents](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8935530/).

**`A4-C54`** `[E1]` `[SNIPPET]` SDT has been applied specifically to reading and writing motivation in **grades 3–8** — exactly Character Studio's band — via validated Self-Regulation Questionnaires for reading and writing motivation, studying "qualitatively different motives" rather than motivation as a single quantity.
*Retrieved via:* [PMC7399692, "Assessing and Mapping Reading and Writing Motivation in Third to Eight Graders"](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7399692/).

**`A4-C55`** `[E1]` `[SNIPPET]` **Choice of topic is associated with motivation and with specific writing gains.** Retrieved: students are "likely more intrinsically motivated to perform better in writing skills if their teacher allows them to write about a topic of their selection or interest"; "topic attractiveness is a basic motivational source of writing that affects the quality of the written text"; choice let students write about topics "easier, more interesting, and possess greater knowledge"; intrinsically motivated students "most enhanced their writing skills in ideas, vocabulary, and choice of words"; choice associated with **higher fluency**.
*Retrieved via:* [Journal of Writing Research, perceptions of choice](https://www.jowr.org/jowr/article/view/1012), [SAGE Open, effect of topic selection on EFL writing](https://journals.sagepub.com/doi/pdf/10.1177/2158244014547176), [PMC10792553, topic-based interest](https://pmc.ncbi.nlm.nih.gov/articles/PMC10792553/).
*Note: several of these are EFL/university samples. Direction is consistent; magnitude for grades 2–8 is not established here.*

**`A4-C56`** `[E1]` `[SNIPPET]` **Writing self-efficacy declines with age, with middle school as the identified inflection point.** Retrieved: "Elementary students generally had higher writing self-efficacy than older students, with middle school identified as 'the critical juncture at which academic motivation, in this case self-efficacy, decreases'." Also: writing anxiety negatively predicts both writing attitude and writing self-efficacy; writing attitude positively predicts writing self-efficacy.
*Retrieved via:* [Frontiers in Psychology, second graders' writing self-regulation efficacy](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2023.1265785/full), [Springer, Writing Self-Efficacy in Young Children](https://link.springer.com/article/10.1007/s10984-005-7248-5), [ERIC EJ551377, Pajares & Valiante](https://eric.ed.gov/?id=EJ551377).

> Mapped: the decline hits around **B3 (11–12) / grades 6–7**, squarely inside Character Studio's range.

## A.11 — WHAT CHARACTER STUDIO SHOULD DO

**Confidence: moderate-high for the posture; the SDT literature is large but the writing-specific magnitudes are thin.**

**Rule A11.1 — Choice is a first-order design requirement, not a nice-to-have.** `A4-C53`, `A4-C55`. In a character tool this means: the child chooses what kind of character, what matters about them, which dimensions to develop, whether to use any scaffold at all, and when they are finished. The tool never decides a character is incomplete.

**Rule A11.2 — Every scaffold must have a visible, non-penalized decline.** `A4-C53`. "No thanks" must be as prominent as "show me," must not trigger a follow-up, and must be remembered (see Rule E-4 on decline memory).

**Rule A11.3 — Design specifically for the B3 self-efficacy dip.** `A4-C56`. Around grades 6–7 the tool should **reduce**, not increase, evaluative surface area: fewer prompts, no comparisons, more control over privacy of work-in-progress, and stronger emphasis on the child's own goals (`A4-C31`). The intuitive response — more encouragement — is contraindicated by `A4-C40`/`A4-C42`. The evidenced response is more autonomy and less self-directed attention.

**Rule A11.4 — Never gamify creative output.** `A4-C39`, `A4-C40`, `A4-C42`, `A4-C53`. Streaks, points, badges and levels attached to *creative work* are (a) self-level attention, (b) extrinsic controls that SDT predicts undermine autonomous motivation, and (c) unmeasurable against creative quality. Progress mechanics, if any, may attach only to *the child's own declared goals*.

---

## A.12 — WHAT RESEARCH SAYS: constraints vs. open-endedness in children's creativity

**`A4-C57`** `[E1]` `[SNIPPET]` **Constraints generally help, at moderate levels.** Retrieved: "designed constraints generally enhance creative output, particularly when they are moderately restrictive and well-aligned with task demands"; when participants were constrained to a specific theme in alternate-uses generation, "the novelty of their ideas was higher than when the uses were left open-ended"; "the imposition of constraints can facilitate the creative quality of ideas compared to conditions that are more open-ended."
*Retrieved via:* ["The Green Eggs and Ham Hypothesis: How Constraints Facilitate Creativity"](https://www.researchgate.net/publication/301316673_The_Green_Eggs_and_Ham_Hypothesis_How_Constraints_Facilitate_Creativity), ["Creativity from constraints: Theory and applications to education," *Thinking Skills and Creativity*](https://www.sciencedirect.com/science/article/abs/pii/S1871187122001870).

**`A4-C58`** `[E1]` `[SNIPPET]` **There is an optimum, and both ends are bad.** Retrieved: "An absence of constraints can be challenging due to an inability to choose direction, while the introduction of constraints can generatively focus attention and free oneself from being overwhelmed with choice. However, too many constraints can lead to fixation effects on narrower solutions and decreased motivation." Two constraint types are distinguished: **exclusionary** (direct search away from something) and **focusing**; most research addresses focusing constraints.
*Retrieved via:* ["Creativity and Constraint" (U. Michigan Deep Blue)](https://deepblue.lib.umich.edu/bitstream/handle/2027.42/89692/brosso_1.pdf), ["Creativity from constraints"](https://www.sciencedirect.com/science/article/abs/pii/S1871187122001870).

**`A4-C59`** `[UNVERIFIED]` **I could not locate a study establishing the optimal constraint level for children's narrative or character creation specifically.** Searched: "constraints creativity children creative output open-ended versus constrained task research"; "two decades of research on children's creativity development during primary education in relation to task characteristics." The general constraint literature is largely adult and largely non-narrative. **Any specific constraint level Character Studio adopts is a DESIGN DECISION, not a research finding.**

## A.12 — WHAT CHARACTER STUDIO SHOULD DO

**Confidence: moderate for "some constraint is better than none," very low for any specific amount.**

**Rule A12.1 — Offer a constrained entry, but make the constraint the child's choice.** `A4-C57`, `A4-C58`, `A4-C53`. A totally blank canvas is a documented problem ("inability to choose direction"). The resolution that satisfies both literatures: the tool offers a **menu of constraints** and the child picks one, or declines all of them.

> "Want a starting box? Pick one — *a character who can't tell the truth* / *a character who lost something* / *a character everyone gets wrong* / **no box, I've got an idea**."

**Rule A12.2 — Prefer focusing constraints over exclusionary ones for children.** `A4-C58`. Exclusionary constraints ("don't make them a wizard") are less studied and carry a policing tone. Focusing constraints ("they want something they can't have") give direction without prohibition.

**Rule A12.3 — One constraint at a time. Never stack.** `A4-C58` (too many constraints → fixation and decreased motivation). **DESIGN DECISION: maximum one active tool-supplied constraint per character.** The child may add their own without limit.

**Rule A12.4 — Constraints must be droppable mid-task.** `A4-C58`, `A4-C53`. If the child's character drifts out of the constraint, the tool says nothing. The constraint was a launchpad, not a contract.

---

## A.13 — WHAT RESEARCH SAYS: over-scaffolding risks

**`A4-C60`** `[E4]` `[SNIPPET]` **Over-scaffolding is a named, described failure mode with named symptoms.** Retrieved: "Providing too much support can prevent learners from developing problem-solving skills and self-efficacy"; "Over-scaffolding creates a kind of learned helplessness, with clear signs: Students wait for help before trying, rely on your nod of approval, or stop mid-task if you're not near"; "Overscaffolding occurs when teachers provide too much structure, guidance, or intervention and prevent students from engaging in productive struggle"; "If students are constantly prompted, corrected immediately at every moment of uncertainty, or never expected to assume increasing responsibility for their own work, dependency can indeed develop."
*Retrieved via:* [NAESP, "The Consequences of Overscaffolding"](https://www.naesp.org/resource/the-consequences-of-overscaffolding/), [Choice Literacy, "Are You Scaffolding or Rescuing?"](https://choiceliteracy.com/article/are-you-scaffolding-or-rescuing/), [Structural Learning, scaffolding guide](https://www.structural-learning.com/post/scaffolding-in-education-a-teachers-guide).

> **Tiering honesty:** these are practitioner and professional-association sources, not experimental studies. Over-scaffolding is **`[E4]` professional consensus**, well-described but not, in what I could retrieve, experimentally quantified in children's writing. That does not make it safe to ignore — but do not claim it as `[E1]`.

**`A4-C61`** `[E4]` `[SNIPPET]` A retrieved source names the **"minimal hint strategy"**: "giving a small nudge when students ask for help — just enough to keep them thinking, but not enough to solve the problem for them."
*Retrieved via:* [Structural Learning](https://www.structural-learning.com/post/scaffolding-in-education-a-teachers-guide).

**`A4-C62`** `[E6]` `[SNIPPET]` **A counter-argument exists and should be recorded.** A retrieved source argues explicitly that "Explicit Instruction Does Not Cause Learned Helplessness." The over-scaffolding literature should not be used to justify withholding instruction from children who need it.
*Retrieved via:* [Science of Learning, "No, Explicit Instruction Does Not Cause Learned Helplessness"](https://scienceoflearning.substack.com/p/no-explicit-instruction-does-not).

**`A4-C63`** `[E1]` `[SNIPPET]` **In intelligent tutoring systems, help-abuse is measured and it costs learning.** Retrieved: gaming the system is "attempting to succeed in an interactive learning environment by exploiting properties of the system rather than by learning the material"; **"hint abuse"** (Aleven & Koedinger, 2000) means "drilling through hints at high speed to obtain the answer"; **"students who frequently engage in 'gaming the system' learn only 2/3 as much as similar students who do not"**; "help abuse corresponding to skipping hints is negatively correlated with learning"; one retrieved study found **"72% of all student actions represented unproductive help-seeking behavior."**
*Retrieved via:* [Baker, "Gaming the System: A Retrospective Look"](https://learninganalytics.upenn.edu/ryanbaker/PSCS-gaming-v6.pdf), [Baker, Corbett, Roll & Koedinger 2008 PDF](https://pact.cs.cmu.edu/pubs/Baker,Corbett,%20Roll%20&%20Koedinger%2008.pdf), [Aleven et al., "Help Helps, But Only So Much," *IJAIED*](https://link.springer.com/article/10.1007/s40593-015-0089-1).

**`A4-C64`** `[E6]` `[SNIPPET]` **Cognitive offloading to generative AI: the evidence is genuinely split, and both directions are represented in 2025–2026 work.** Retrieved *negative* framing: "Cognitive offloading, where learners delegate cognitive tasks to external tools, may lead to decreased internal cognitive engagement over time, impacting learners' ability to self-regulate and critically engage," with a documented **"metacognitive laziness"** phenomenon. Retrieved *positive* framing: quasi-experimental and conference studies where **deliberately offloading lower-order writing tasks to generative AI produced significantly greater gains in critical thinking** and higher-quality essays in logical coherence, evidence use and originality. Retrieved: Gerlich's 2025 work documenting negative correlations between generative AI usage and critical thinking in knowledge work "went viral."
*Retrieved via:* [Forum for Linguistic Studies, cognitive offload instruction](https://journals.bilpubgroup.com/index.php/fls/article/view/10072), [ACM ICAIE 2025](https://dl.acm.org/doi/10.1145/3768421.3768447), [EPIC, generative AI and future of critical thinking](https://www.epicpeople.org/future-of-critical-thinking/), [arXiv preprint, metacognitive laziness in vocational education](https://arxiv.org/pdf/2512.12306).

**`A4-C65`** `[E6]` `[SNIPPET]` **The MIT Media Lab "Your Brain on ChatGPT" study.** Design: **54 participants across sessions 1–3, 18 completing session 4**, assigned to LLM, search engine, or brain-only conditions for essay writing, with EEG. Retrieved findings: brain-only participants showed "the strongest, most distributed networks," search-engine users moderate, **LLM users the weakest connectivity**; the ChatGPT group "could recall only ~17% of their own text after 24 hours, versus ~46% in brain-only controls"; human graders described many LLM essays as "generic and 'soulless'." The authors frame this as **"cognitive debt."**
*Retrieved via:* [arXiv 2506.08872](https://arxiv.org/abs/2506.08872), [MIT Media Lab project page](https://www.media.mit.edu/projects/your-brain-on-chatgpt/overview/), [brainonllm.com](https://www.brainonllm.com/).

> **⚠️ Tier this honestly. `A4-C65` is `[E6]`.** It is an arXiv preprint with a small sample (54, dropping to 18), adult participants, an essay task rather than creative writing, and EEG connectivity measures whose interpretation is contested. It received extraordinary media attention. **It should inform product caution; it should not be cited as established.**

## A.13 — WHAT CHARACTER STUDIO SHOULD DO

**Confidence: high for building the guard, low for the specific numbers in it.**

**Rule A13.1 — Implement the minimal hint strategy as the default help behaviour.** `A4-C61`, `A4-C63`. The first response to a request for help is always the *smallest* useful move. Escalation happens only on a second explicit request.

**Rule A13.2 — Hints must escalate in *kind*, not merely in *amount*, and must never terminate in the answer.** `A4-C63`. In an ITS, hint chains terminate in the answer, which is exactly what makes hint abuse possible and profitable. In a *creative* tool there is no answer — so the hint ladder must be designed to have **no bottom rung that produces the child's content**.

```
Hint ladder for "I'm stuck on my character":
  H1  Reflect back what they already wrote        ("You've got someone who runs away.")
  H2  Ask one open question                        ("Who from?")
  H3  Offer a dimension, not content               ("Sometimes it helps to think about what they want.")
  H4  Offer 2–3 divergent *questions*              (never 2–3 answers)
  H5  === LADDER ENDS ===  Offer a break, a different character, or a person to talk to.
      There is no H6 that writes the character.
```

**Rule A13.3 — Instrument for help-abuse from launch.** `A4-C63`. Log and monitor: hint-request rate per session; time between hint request and next child-authored keystroke; proportion of final character text that originated as a tool suggestion; and rate of "accept suggestion" with zero subsequent edits. These are the product's dependence telemetry.

**Rule A13.4 — Treat rapid repeated hint requests as a signal to change mode, not to give more hints.** `A4-C63`, `A4-C60`. **DESIGN DECISION:** if a child requests help ≥3 times within a short window with no intervening self-authored content, the tool should stop offering hints and offer something categorically different — switch to drawing, switch characters, take a break, or invite a person. This is a *deliberate* refusal to escalate.

**Rule A13.5 — Do not over-correct into withholding.** `A4-C62`. Children who need explicit support must get it. The anti-over-scaffolding budget (Part E) constrains *unrequested* support and *content substitution*; it must never be implemented as a cap on support a child explicitly asks for and uses productively.

**Rule A13.6 — Assume the cognitive-offloading risk is real for *content*, and possibly beneficial for *transcription*.** `A4-C64`, `A4-C32`. This is the cleanest way to reconcile the split evidence with the transcription literature: offloading *transcription* frees capacity for composition (`A4-C32`, well-evidenced); offloading *ideation and language choice* is precisely what the homogenization and ownership literature says is costly (A.14). **Character Studio should offload keystrokes, never ideas.**

---

## A.14 — WHAT RESEARCH SAYS: children using AI writing assistants

**This is the least mature literature in the module. Almost everything here is `[E6]`, much of it is preprint, and much of it is adult-sample.**

**`A4-C66`** `[E6]` `[SNIPPET]` A CHI 2024 study conducted a workshop with **twelve families (parent–child dyads) with children ages 8–12** (maps to **B1–B3**) and interviewed **sixteen teachers** about generative AI for learning and teaching writing. Findings named: "possible obstacles and concerns regarding **authorship and ownership** issues over writing outputs, challenges examining students' **agency** in learning, and difficulties in controlling bias and hallucinated content." Proposed design implications: "enhancing student agency through **role allocation** and curating AI personas to promote independent writing," and teacher-in-the-loop curation of child–AI interaction.
*Retrieved via:* [ACM CHI 2024, Teachers, Parents, and Students' perspectives](https://dl.acm.org/doi/full/10.1145/3613904.3642438).

**`A4-C67`** `[E6]` `[SNIPPET]` **"Floor Raiser or Ceiling Limiter?"** — a mixed-methods within-subjects experiment with **40 participants from Grades 2–6, ages 7–12** (maps to **B1–B3**), comparing a child-centric GenAI storytelling system against a traditional storyboard condition. Retrieved findings: the GenAI condition produced a **"floor-raising convergence pattern, with the quality gap narrowing by 83.5%, driven by lower-end support and upper-end constraint mechanisms"**; the convergence was **dimension-selective**, "improving creativity and richness while leaving coherence and narrative structure tied to baseline performance"; **younger children more often selected semantically distant keywords while older children preferred semantically closer ones**. The authors propose **"mechanism-contingent scaffolding"** as a design principle.
*Retrieved via:* [arXiv 2606.27067](https://arxiv.org/pdf/2606.27067).

> **This is the most directly on-target study I found for Character Studio, and it is an arXiv preprint.** `[E6]`. But its headline — that GenAI raised the floor *and lowered the ceiling* for children's storytelling — is exactly the risk the product must be designed against. Note also its second finding: whatever benefit appeared was in *creativity and richness*, **not** in coherence or narrative structure.

**`A4-C68`** `[E1]` `[SNIPPET]` **AI writing assistance homogenizes content — measured, replicated across several studies, in adults.** Retrieved: **293 writers** using GPT-4 for short stories produced work rated more novel, more useful and more enjoyable by independent evaluators, **but 10.7% more similar to each other** — described by the researchers as "a social dilemma: writers are individually better off, but collectively a narrower scope of novel content is produced." Also: "In three studies, human writing increased the collective semantic diversity of a group of essays approximately **two to eight times** more than base GPT-4 essays did"; and "AI-assisted stories were **5.0–5.2% more similar** to the original AI-generated prompts than human-only stories were, confirming that the model's suggestions anchored writers toward overlapping regions of idea space."
*Retrieved via:* [Digital Content Next, "Does Generative AI aid or homogenize human creativity?"](https://digitalcontentnext.org/blog/2024/07/23/does-generative-ai-aid-or-homogenize-human-creativity/), ["Homogenizing effect of large language models (LLMs) on creative diversity"](https://www.sciencedirect.com/science/article/pii/S294988212500091X), ["Diverse AI personas can mitigate the homogenization effect"](https://www.sciencedirect.com/science/article/pii/S294988212600040X).

**`A4-C69`** `[E1]` `[SNIPPET]` **The homogenization has a cultural direction.** Retrieved from Cornell: "AI suggestions make writing more generic, Western"; "When Indian participants used AI writing assistance, their text became measurably more similar to American writing — not just in style, but in content choices and cultural framing."
*Retrieved via:* [Cornell Chronicle](https://news.cornell.edu/stories/2025/04/ai-suggestions-make-writing-more-generic-western).

**`A4-C70`** `[E1]` `[SNIPPET]` **Suggestions change what people think, not just what they write, and people do not notice.** "Co-Writing with Opinionated Language Models Affects Users' Views" (CHI 2023): an online experiment with **1,506 participants** writing about whether social media is good for society. Participants using an assistant configured to argue one side "were more likely to argue" that side, and **"interacting with an opinionated language model affects both written opinions and reported attitudes in a subsequent survey considerably."** Critically: **"writers did not notice the AI's influence and felt in full control of their writing."** Related retrieved finding: "Users write significantly more positive sentiment reviews when co-writing with a positively-skewed model."
*Retrieved via:* [ACM CHI 2023](https://dl.acm.org/doi/10.1145/3544548.3581196), [arXiv 2302.00560](https://arxiv.org/abs/2302.00560), [Semantic Scholar record](https://www.semanticscholar.org/paper/Interacting-with-Opinionated-Language-Models-Users%E2%80%99-Bhat/1ea705967f64b306a08b875fce705941586d5444).

> **`A4-C70` is, for my money, the most important single finding in Part A for a children's character tool.** A character-creation tool that suggests traits is an opinionated model about what people are like. The study says users adopt those opinions and believe the ideas were their own. With children, the credulity is higher (`A4-C77`).

**`A4-C71`** `[E6]` `[SNIPPET]` **Writing with AI lowers psychological ownership; prompt length partially rescues it.** Retrieved: "When writing with a chat-based generative AI assistant, psychological ownership can be improved by requiring or encouraging users to write longer prompts"; longer prompts led to higher ownership; **benefits plateaued when prompt length reached 75–100% of the target story length**; two interaction techniques that increased prompt length (press-and-hold on submit; move a slider when submitting a short prompt) raised both prompt length and ownership; **augmenting with AI-generated suggestions for expanding the prompt increased prompt length but did NOT improve ownership.**
*Retrieved via:* [arXiv 2404.03108](https://arxiv.org/pdf/2404.03108), [ACM CUI 2025](https://dl.acm.org/doi/10.1145/3719160.3736608), [arXiv 2507.03670](https://arxiv.org/abs/2507.03670).

> Note the last clause: **AI help with the prompt did not restore ownership.** Ownership tracks the child's own effort, not the volume of text.

**`A4-C72`** `[E6]` `[SNIPPET]` "Who Owns the Text? Design Patterns for Preserving Authorship in AI-Assisted Writing" — **176 participants**, three professional writing tasks, an ownership-aware co-writing editor with sentence-level suggestions. Retrieved findings: **psychological ownership dropped roughly 0.85–1.0 points on a 7-point scale relative to unassisted writing**, "even as cognitive load decreased and quality ratings stayed broadly similar"; **persona coaching did not prevent the ownership decline**; the paper proposes five design patterns, each addressing a specific threat to ownership. Related retrieved finding: "the less a user writes, the less ownership they feel over the final text," and "higher levels of participant influence on text increased one's sense of ownership."
*Retrieved via:* [arXiv 2601.10236](https://arxiv.org/abs/2601.10236), [Moonlight literature review](https://www.themoonlight.io/en/review/who-owns-the-text-design-patterns-for-preserving-authorship-in-ai-assisted-writing).

**`A4-C73`** `[E6]` `[SNIPPET]` **Mixed evidence on AI and children's creativity, with one notable negative neuroimaging preprint.** Retrieved: "while AI has the potential to significantly support creative thinking, there are also negative impacts on creativity and creative confidence"; a study of **5–6-year-olds** (maps to **B0**) found children enjoyed storytelling with ChatGPT, "which provided more frequent positive feedback and open-ended prompts than parents"; and a **bioRxiv preprint** titled "Lower engagement of cognitive control, attention, modulation networks and lower creativity in children while using ChatGPT: an fMRI study."
*Retrieved via:* [ScienceDirect, "How does generative artificial intelligence impact student creativity?"](https://www.sciencedirect.com/science/article/pii/S2713374523000316), [bioRxiv preprint](https://www.biorxiv.org/content/10.1101/2025.11.07.687207.full.pdf), [Frontiers in Robotics and AI, LLM-driven storytelling with a social robot](https://www.frontiersin.org/journals/robotics-and-ai/articles/10.3389/frobt.2024.1457429/full).
*The fMRI item is an unreviewed preprint. `[E6]`, low weight.*

**`A4-C74`** `[E1]` `[SNIPPET]` **Children over-trust AI, and older children over-trust it more.** Retrieved: "Younger children are more susceptible to human-like cues in machines, whereas **older children tend to over-trust machines as informants**"; "children's self-reported epistemic trust in AI increases with age, even as their awareness of its fallibility grows"; **"Most children (82%) recognized that the AI could make mistakes, with this judgment more common among eight-year-olds (94%) than six-year-olds (69%)"**; and "when faced with unfamiliar subject matter, children are more likely to overtrust AI-generated outputs." Also: "Many conversational AI tools are not designed with children's developmental needs in mind, making children particularly susceptible to trusting misleading, inaccurate or unsafe information."
*Retrieved via:* [ScienceDirect, "Who do children trust? AI vs. human recommendations"](https://www.sciencedirect.com/science/article/abs/pii/S0040162526001848), [ACM CHI 2026, child-centred K-AI Trust Scale](https://doi.org/10.1145/3772318.3790765), [Ada Lovelace Institute, "The trust problem"](https://www.adalovelaceinstitute.org/blog/the-trust-problem/), [ScienceDirect, children trust a robot over a human in a selective trust task](https://www.sciencedirect.com/science/article/pii/S0747563224000979).

**`A4-C75`** `[E3]` `[SNIPPET]` The **U.S. Department of Education's May 2023 report, "Artificial Intelligence and the Future of Teaching and Learning: Insights and Recommendations"**, makes seven recommendations, the first of which is to **"adopt 'humans in the loop' as a key criterion for using AI for education"**, with educators, students and families retaining agency over educational decisions, "especially those with high stakes." The report explicitly rejects AI replacing teachers, and names rising risks including bias, privacy, surveillance and misinformation.
*Retrieved via:* [K-12 Dive coverage](https://www.k12dive.com/news/Education-department-AI-schools-guidance/651409/), [EdTech Magazine](https://edtechmagazine.com/k12/article/ai-in-education-new-guidance-from-department-of-education-perfcon), [Panorama Education summary](https://www.panoramaed.com/blog/ai-future-teaching-report).
*A retrieved critique argues the Department "shouldn't treat human in the loop as a silver bullet."* [Center for Data Innovation](https://datainnovation.org/2023/07/the-department-of-education-shouldnt-treat-human-in-the-loop-as-a-silver-bullet-for-ai/).

## A.14 — WHAT CHARACTER STUDIO SHOULD DO

**Confidence: the *direction* of these rules is well-supported; the *magnitudes* are mostly from adult samples and preprints. Where I am uncertain, the rules default to restraint, per the document's stance.**

### Rule A14.1 — Assume Character Studio will homogenize children's characters unless actively engineered not to.

`A4-C67`, `A4-C68`, `A4-C69`. This is not a hypothetical: convergence has been measured repeatedly in adults, and the one child-specific study found an **83.5% narrowing of the quality gap** with dimension-selective gains. Homogenization must be treated as a **primary product risk with a named owner and a measured metric**, not a footnote.

**Required instrumentation:** measure **inter-character semantic similarity within cohorts** over time. If characters produced with tool assistance are measurably more similar to each other than characters produced without, the tool is failing its core purpose. This metric should be tracked from the first release and should be a gate on shipping new suggestion features.

### Rule A14.2 — The tool must never suggest *what a character is like*.

`A4-C70`, `A4-C68`. This is the strongest inference in the module. A tool that offers "shy," "brave," "bookish" as trait options is an opinionated model about human personality, and the evidence says (a) users adopt the model's leanings, (b) content converges, and (c) **users do not notice and feel in full control**. With children, add higher credulity (`A4-C74`).

**Permitted:** the tool may suggest **questions**, **dimensions**, and **the child's own prior words**.
**Forbidden:** the tool may not suggest **traits**, **backstory content**, **names**, **motivations**, **relationships**, or **lines of dialogue** as ready-to-accept content.

```
suggestion.type ∈ {question, dimension, child_prior_content, structural_reminder}   → ALLOWED
suggestion.type ∈ {trait, name, motivation, backstory, dialogue, description}       → BLOCKED
```

> If the product requires trait pickers for gameplay or art-asset reasons, they must be presented as **the platform's fixed vocabulary** (a costume rack), clearly not as *the tool's opinion about this child's character*, and the child's free-text description must always be the primary, first-position, largest input.

### Rule A14.3 — Ownership is protected by the child's effort, not by attribution labels.

`A4-C71`, `A4-C72`. Persona coaching did **not** prevent ownership decline, and AI-assisted prompt expansion increased length without increasing ownership. Ownership tracks *the child's own contribution*. Therefore:

- The child's own words must always be visually dominant over anything the tool produced.
- Anything the tool produced must be **visibly distinguishable until the child rewrites it in their own words** — and rewriting it should be the easy path, not accepting it.
- **DESIGN DECISION:** never allow a character to be "finished" or shareable if the majority of its text originated as tool output. Compute the ratio; if tool-origin text exceeds a defined share, the tool prompts (once, non-judgmentally) for the child to put it in their own words before publishing.

### Rule A14.4 — "Human in the loop" means an actual human, and it must be real, not decorative.

`A4-C75`. A teacher or caregiver visibility path is a policy expectation for AI in US education, and it aligns with `A4-C41` (adult feedback ES 0.87 — the strongest channel). But note the retrieved critique: human-in-the-loop is not a silver bullet. It must be designed so the human can actually see, understand and intervene — not a checkbox.

### Rule A14.5 — Design against child over-trust explicitly.

`A4-C74`. Because children *increasingly* over-trust machines as they get older — precisely across Character Studio's band — the tool must:
- Speak provisionally and own its uncertainty in plain child-appropriate language ("that's just one idea, I don't know your character").
- **Never** claim to know what the child means, wants, or feels.
- Never present tool output as more considered, correct, or "professional" than the child's.
- Consider deliberately visible fallibility (the tool sometimes says "I don't know") — supported directionally by `A4-C74` and by the coping-model finding (`A4-C12`). **DESIGN DECISION.**

### Rule A14.6 — Do not over-claim the harms either.

`A4-C64`, `A4-C65`, `A4-C73`. The cognitive-offloading literature is split; "Your Brain on ChatGPT" is a small adult preprint; the children's fMRI item is unreviewed. Character Studio should be designed cautiously **and should not tell parents, teachers or press that AI writing tools are proven to harm children's brains.** That claim is not supported by what I retrieved.

---
---

# PART B — LITERACY SKILL DEVELOPMENT THROUGH CHARACTER CREATION

> **Read this part with suspicion.** This is the area where educational products overclaim most reliably. My job here is to separate (a) what character work *demonstrably* develops, (b) what is *plausible but unevidenced*, and (c) what is *actively contradicted or contested*. I have marked overclaims explicitly.

## B.1 — WHAT RESEARCH SAYS: the reading–writing connection

**`A4-C76`** `[E1]` `[SNIPPET]` **Graham & Hebert (2011), "Writing to Read: A Meta-Analysis of the Impact of Writing and Writing Instruction on Reading," *Harvard Educational Review* 81(4), 710–744.** Findings as retrieved: writing about material read improves comprehension of it; teaching students how to write improves reading comprehension, reading fluency and word reading; and increasing how much students write enhances reading comprehension. Retrieved effect-size characterization: "moderate-to-strong effects on reading comprehension when students wrote about the texts they read, with effect sizes often hovering between **.27 and above .50** (and in a few subcategories, even higher)." Scope: **grades 1–12**; **81% of the reading-comprehension studies were conducted with students in grades 6 and above**, whereas fluency and word-identification research was almost exclusively in the lower grades.
*Retrieved via:* [Harvard Educational Review record](https://www.harvardeducationalreview.org/content/81/4/710), [ERIC EJ961480](https://eric.ed.gov/?id=EJ961480), [Center on Instruction synopsis](https://www.centeroninstruction.org/files/7%20COI%20Synopsis%20Writing%20to%20Read.pdf), [Carnegie report PDF](https://media.carnegie.org/filer_public/9d/e2/9de20604-a055-42da-bc00-77da949b29d7/ccny_report_2010_writing.pdf).

> **Note the grade skew.** The comprehension evidence is overwhelmingly grade 6+. For **B1 (7–8) and B2 (9–10)** — half of Character Studio's core band — the writing-to-reading-comprehension link is much thinner than the headline suggests.

**`A4-C77`** `[E1]` `[SNIPPET]` **Graham et al. (2018), "Reading for Writing: A Meta-Analysis of the Impact of Reading Interventions on Writing," *Review of Educational Research*.** Scope as retrieved: **k = 54 experiments, 5,018 students** where students were taught how to read; **k = 36 investigations, 3,060 students** where interaction with words or text was increased through reading or observing others read. Retrieved summary: reading interventions "strengthened the writing performance of typically developing students in preschool to Grade 12 with a large effect size," with positive effects on overall writing measures, writing quality and spelling.
*Retrieved via:* [SAGE record](https://journals.sagepub.com/doi/10.3102/0034654317746927), [ResearchGate record](https://www.researchgate.net/publication/321726902_Reading_for_Writing_A_Meta-Analysis_of_the_Impact_of_Reading_Interventions_on_Writing).
*I could not retrieve the specific effect size behind "large."*

**`A4-C78`** `[E1]` `[SNIPPET]` **Bidirectionality is asserted by models but the empirical evidence is mixed, and relations are not uniform.** Retrieved: "the interactive relations hypothesis... suggests the presence of bidirectional relations. **However, empirical evidence on bidirectionality of the relation is mixed.**" And from Kim, Wolters & Lee (2024), *Review of Educational Research*: **"Reading and Writing Relations Are Not Uniform: They Differ by the Linguistic Grain Size, Developmental Phase, and Measurement."**
*Retrieved via:* [Kim, Wolters & Lee, *RER* 2024](https://journals.sagepub.com/doi/full/10.3102/00346543231178830), [ERIC EJ1256539, testing the bidirectional relationship](https://files.eric.ed.gov/fulltext/EJ1256539.pdf).

**`A4-C79`** `[E1]` `[SNIPPET]` **In the DIEW work, reading comprehension related only to writing *quality*, not to productivity or correctness**, in a study of 350 second graders (**B1**) — and reading comprehension *mediated* the relations of discourse oral language and lexical literacy to writing quality (`A4-C33`).
*Retrieved via:* [Kim et al., *Journal of Educational Psychology* 2022 (APA PDF)](https://www.apa.org/pubs/journals/features/edu-edu0000564.pdf).

**`A4-C80`** `[E1]` `[SNIPPET]` **Balanced reading+writing literacy programs: Graham (2018), "Effectiveness of Literacy Programs Balancing Reading and Writing Instruction: A Meta-Analysis," *Reading Research Quarterly*.** Retrieved as a title/record only; **I could not retrieve its effect sizes or conclusions.** `[UNVERIFIED]` for content.
*Retrieved via:* [Wiley record](https://ila.onlinelibrary.wiley.com/doi/10.1002/rrq.194).

## B.2 — WHAT RESEARCH SAYS: inference, character motivation, and mental-state understanding

**`A4-C81`** `[E1]` `[SNIPPET]` **Inference about character mental states is a specific, teachable, and difficulty-prone comprehension skill.** Retrieved: "To make inferences about character motivation, children must understand words and sentences and further connect them with their own knowledge and experience to interpret the motivation and intention of the main character"; "Inferential difficulties mainly concern inferences about mental states (emotions, intentions, thoughts of characters), related to theory of mind difficulties"; and studies of facilitative questioning strategies on **intermediate-grade children's** ability to infer a character's motives found treatment groups increased inferential comprehension, **with below-average readers benefiting most**.
*Retrieved via:* [McMaster & van den Broek, "Promoting inference making"](https://benjamins.com/catalog/swll.15.25mcm), [PMC4555006, making inferences about causality/intentionality/emotions](https://pmc.ncbi.nlm.nih.gov/articles/PMC4555006/), [PMC6681044, inferential comprehension within story grammar](https://pmc.ncbi.nlm.nih.gov/articles/PMC6681044/).

**`A4-C82`** `[E1]` `[SNIPPET]` **Mental-state language and narrative quality co-occur.** Retrieved: "Children's narrative quality (use of elaborate consciousness-based statements in narratives) is significantly related to their performance on false-belief tasks"; "There is a significant relationship between the use of mental state words and narrative quality"; and "Story narratives had significant references to mental states, while descriptive texts included no or very limited mental state lexicon." A retrieved longitudinal study is titled "Theory of Mind development and narrative writing: A longitudinal study."
*Retrieved via:* [Taylor & Francis, "The representation of mental states in young children's writings"](https://www.tandfonline.com/doi/full/10.1080/03004430.2022.2051500), [ResearchGate, ToM development and narrative writing longitudinal](https://www.researchgate.net/publication/330298220_Theory_of_Mind_development_and_narrative_writing_A_longitudinal_study), [ScienceDirect, ToM and narrative comprehension](https://www.sciencedirect.com/science/article/abs/pii/S0022096521000990).

> **These are correlational and co-developmental findings.** They establish that mental-state language and narrative quality travel together. They do **not** establish that writing characters causes theory-of-mind gains.

**`A4-C83`** `[E1]` `[SNIPPET]` **Theory of mind matters more for narrative than informational comprehension.** A retrieved study title states directly: "Theory of mind process is more important for narrative comprehension than for informational text comprehension."
*Retrieved via:* [ScienceDirect, *Journal of Experimental Child Psychology*](https://www.sciencedirect.com/science/article/abs/pii/S0022096521000990).

## B.3 — WHAT RESEARCH SAYS: what character work is *claimed* to develop, and what the evidence actually supports

**`A4-C84`** `[E3]` `[SNIPPET]` **Character analysis is an explicit standards target across Character Studio's whole band.** Common Core Reading: Literature standards as retrieved:

| Standard | Grade | Band | Text |
|---|---|---|---|
| RL.2.3 | 2 | B1 | "Describe how characters in a story respond to major events and challenges" |
| RL.3.3 | 3 | B1 | "Describe characters in a story (e.g., their **traits, motivations, or feelings**) and explain how their actions contribute to the sequence of events" |
| RL.4.3 | 4 | B2 | "Describe in depth a character, setting, or event in a story or drama, drawing on specific details in the text (e.g., a character's **thoughts, words, or actions**)" |
| RL.5.3 | 5 | B2 | "Compare and contrast two or more characters, settings, or events in a story or drama, drawing on specific details" |

*Retrieved via:* [thecorestandards.org RL.3.3](https://www.thecorestandards.org/ELA-Literacy/RL/3/3/), [thecorestandards.org RL Grade 3](https://www.thecorestandards.org/ELA-Literacy/RL/3/), [Connecticut K–5 standards progression PDF](https://portal.ct.gov/-/media/SDE/CT-Core-Standards/2014/06/CCS-ELA_K-5_Standards_Progression.pdf).

**`A4-C85`** `[E3]` `[SNIPPET]` **Common Core Writing standards make character development an explicit narrative-writing target.**

| Standard | Grade | Band | Retrieved text (abridged) |
|---|---|---|---|
| W.3.3 | 3 | B1 | Establish a situation, introduce a narrator and/or characters; organize an event sequence; **use dialogue and descriptions of actions, thoughts, and feelings** to develop experiences and events or show the response of characters; temporal words; sense of closure |
| W.5.3 | 5 | B2 | Effective technique, descriptive details, clear event sequences; **narrative techniques such as dialogue, description, and pacing** to show responses of characters |
| W.7.3 | 7 | B3 | Effective technique, relevant descriptive details, well-structured event sequences; **dialogue, pacing, and description to develop experiences, events, and/or characters** |

*Retrieved via:* [thecorestandards.org W Grade 3](https://www.thecorestandards.org/ELA-Literacy/W/3/), [thecorestandards.org W Grade 7](https://www.thecorestandards.org/ELA-Literacy/W/7/).

### The honest ledger: what character work develops

| Claim a product might make | Evidence status | Verdict |
|---|---|---|
| "Builds narrative writing skill (dialogue, description, characterization)" | `[E3]` — directly named in W.3.3/W.5.3/W.7.3 (`A4-C85`); `[E1]` — SRSD works for narrative (`A4-C26`) | ✅ **Defensible**, if the tool actually teaches technique rather than supplying it |
| "Builds character-trait and emotion vocabulary" | `[E1]` — vocabulary instruction improves vocabulary reliably (`A4-C102`); emotion lexicon develops rapidly across the band (`A4-C104`) | ✅ **Defensible for vocabulary itself.** See the caveat on comprehension transfer below |
| "Builds descriptive language" | `[E1]` — lexical diversity and adjective use grow across the band and correlate with narrative competence (`A4-C107`) | ✅ **Defensible as practice**; no causal evidence located that a character tool moves it |
| "Supports the reading–writing connection" | `[E1]` for the connection generally (`A4-C76`, `A4-C77`), **but** relations are non-uniform (`A4-C78`), bidirectionality is mixed (`A4-C78`), and the comprehension evidence is 81% grade 6+ (`A4-C76`) | ⚠️ **Partly defensible**, with the grade caveat stated |
| "Develops inference skill" | `[E1]` — inference about character motive is teachable via *questioning about text* (`A4-C81`) | ⚠️ **Not demonstrated for character *creation*.** The evidence is about inferring from *given* text, not authoring |
| "Develops theory of mind / perspective-taking" | `[E1]` correlational only (`A4-C82`); the adjacent adult claim has a **failed replication** (`A4-C87`) | ❌ **OVERCLAIM. Do not make this claim.** |
| "Builds empathy" | `[E6]` — one retrieved creative-writing program reports improvement; the flagship reading→ToM effect failed replication (`A4-C86`, `A4-C87`) | ❌ **OVERCLAIM as currently evidenced.** Do not make this claim |
| "Improves reading comprehension" | `[E1]` for *writing about texts read* (`A4-C76`), which is not what a character tool does | ❌ **OVERCLAIM.** Character creation is not writing-about-reading |
| "Transferable creative/critical thinking skills" | `[E1]` — far transfer is "very rare" (`A4-C88`) | ❌ **OVERCLAIM.** Do not make this claim |

**`A4-C86`** `[E6]` `[SNIPPET]` **The empathy claim: one supportive study exists, but the surrounding literature is contested.** Retrieved: "A creative writing program significantly improved empathy in 382 students compared to 191 in the control group"; "instruction in perspective-taking improved inferential comprehension and perspective-taking in students who demonstrated difficulties"; a Cambridge study reported that "Teaching pupils empathy measurably improves their creative abilities" (note the direction: **empathy → creativity**, not writing → empathy).
*Retrieved via:* ["Enhancing Empathy Through a Creative Writing Program in Elementary School"](https://www.academia.edu/45685013/Enhancing_Empathy_Through_a_Creative_Writing_Program_in_Elementary_School), [University of Cambridge news](https://www.cam.ac.uk/research/news/teaching-pupils-empathy-measurably-improves-their-creative-abilities-study-finds), [Boise State, teaching perspective-taking with authentic literature](https://scholarworks.boisestate.edu/cgi/viewcontent.cgi?article=1096&context=literacy_facpubs).

**`A4-C87`** `[E1]` `[SNIPPET]` **The flagship fiction→theory-of-mind finding is in an unresolved replication dispute.** Kidd & Castano (2013) reported that reading literary fiction improves performance on an advanced theory-of-mind test. **Panero et al. (2016) failed to replicate.** Kidd & Castano contested the replication's methods; Panero et al. responded that **"even when Kidd and Castano reanalyzed Panero's data in the way that they argued was most appropriate, they still failed to replicate the pattern of results reported in their original study,"** reaffirming "no support for the claim that literary fiction uniquely and immediately improves theory of mind."
*Retrieved via:* [PubMed 28221090, Panero et al. reply](https://pubmed.ncbi.nlm.nih.gov/28221090/), [PubMed 28221089, Kidd & Castano commentary](https://pubmed.ncbi.nlm.nih.gov/28221089/), [Kidd & Castano 2019, three preregistered replications (SAGE)](https://journals.sagepub.com/doi/abs/10.1177/1948550618775410).

**`A4-C88`** `[E1]` `[SNIPPET]` **Far transfer is rare; this is the general finding that constrains all "builds skills" claims.** Retrieved: "in the psychological literature, near transfers are very common, while far transfers, though much more interesting to study or achieve, are **very rare**"; "Several meta-analyses have suggested that there is little to no evidence for transfer of training from computerised tasks to real-world skills"; "Trying to teach generic-cognitive skills such as critical thinking and problem-solving in isolation will likely result in poor learning outcomes and limited evidence of far-transfer." A named overclaiming pattern: "In some cases, the interventions improved the underlying processes but had no impact on the target skill."
*Retrieved via:* [ScienceDirect, near transfer overview](https://www.sciencedirect.com/topics/psychology/near-transfer), [PMC11560981, no supporting evidence for far transfer to sports performance](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11560981/), [NIFDI, near and far transfer in cognitive training](https://www.nifdi.org/resources/hempenstall-blog/758-near-and-far-transfer-in-cognitive-training.html).

## PART B — WHAT CHARACTER STUDIO SHOULD DO

**Confidence: high for the claim discipline; moderate for the design implications.**

**Rule B.1 — Adopt a claims policy and enforce it in marketing, school-facing material, and in-product copy.** `A4-C86`, `A4-C87`, `A4-C88`.

> **Character Studio may claim:** it gives children practice in narrative writing techniques that appear in state standards for their grade — describing characters through actions, thoughts, feelings and dialogue; and it gives them exposure to and practice with character-trait and emotion vocabulary.
>
> **Character Studio may NOT claim:** that it develops empathy, theory of mind, perspective-taking, social-emotional skills, reading comprehension, critical thinking, or "21st-century skills." It may not claim transfer to any outcome it does not directly measure.

**Rule B.2 — Anchor the product to standards, not to psychology.** `A4-C84`, `A4-C85`. The standards mapping is `[E3]` and defensible; the psychological transfer claims are not. For school buyers, map features to RL.x.3 and W.x.3 and stop there.

**Rule B.3 — The one genuinely evidence-aligned character move is *inference about mental states from evidence*, and it belongs in the reading direction.** `A4-C81`, `A4-C82`, `A4-C83`. If Character Studio wants a literacy feature with real grounding, it is:

> Given a character *someone else* wrote, what can you tell about what they want / feel / fear — **and what in the text tells you that?**

This is inference-from-text-evidence, it is the thing the retrieved intervention research actually improved (`A4-C81`), it is exactly RL.3.3–RL.5.3 (`A4-C84`), and it uses the peer-community structure that has the stronger effect sizes (`A4-C41`, `A4-C52`).

**Rule B.4 — Mental-state language is a legitimate *craft* target, framed as writing craft.** `A4-C82`. Encouraging children to write what a character thinks, knows, believes, wants and fears is supported as narrative craft by the standards (`A4-C85`) and co-occurs with narrative quality (`A4-C82`). Frame it as **"readers can't see inside your character unless you show them,"** not as **"this builds your empathy."**

**Rule B.5 — If the product wants to claim outcomes, it must measure them.** `A4-C88`. The named overclaiming pattern is improving a process without moving the target skill. The only honest route to an outcome claim is measuring the outcome. Absent that, Rule B.1 stands.

---
---

# PART C — VOCABULARY & LANGUAGE COMPLEXITY (CHARACTER-FOCUSED)

## C.1 — WHAT RESEARCH SAYS: vocabulary development trajectories

**`A4-C89`** `[E1]` `[SNIPPET]` **Vocabulary growth estimates vary enormously and the variance is methodological.** Retrieved figures: "roughly three to four thousand words annually throughout primary and secondary school years"; "Nagy & Scott (2000) report that children learn between **2,000–3,000 words per year**"; "others have cited that kids can learn up to **5,000 per year** (Miller & Gildea, 1987)"; "children at peak acquisition add an estimated 2,000–3,000 new word families per year — roughly **7–8 new words per day**"; growth "slows to roughly **1,000–1,500 new word families per year in adolescence**." The retrieved explanation for the spread: estimates depend on receptive vs. expressive measurement, reading/writing vs. oral vocabulary, and word-definition choices.
*Retrieved via:* [Dr. Karen Speech and Language, school-age vocabulary](https://drkarenspeech.com/vocabulary-development-school-age-years/), [PMC4965448, "How Many Words Do We Know?"](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4965448/), [H&V Library, vocabulary gap](https://hv-library.com/research/assessing-addressing-the-vocabulary-gap/).

> **Do not use any of these numbers externally.** They are secondary attributions to primary sources I could not retrieve, and the underlying estimates genuinely disagree by a factor of more than two. What is safe to carry forward is the *shape*: rapid growth across B1–B3, slowing in B4.

**`A4-C90`** `[E1]` `[SNIPPET]` **From roughly age 6 onward, reading is the primary driver of vocabulary growth**, because written text exposes children to far more low-frequency vocabulary than conversation.
*Retrieved via:* [Dr. Karen Speech and Language](https://drkarenspeech.com/vocabulary-development-school-age-years/).

**`A4-C91`** `[E1]` `[SNIPPET]` **Incidental word learning from reading is *low probability* and *strongly ability-dependent*.** Swanborn & de Glopper (1999), "Incidental Word Learning While Reading: A Meta-Analysis," *Review of Educational Research*, meta-analysed **20 experiments** and found students learn around **15% of the unknown words they encounter**. In a related retrieved study of **grade 6** students (**B3**), proportions learned were **.06 for free reading, .08 reading for comprehension, .10 reading to learn about the topic**. Critically: **"Low-ability readers hardly learned any words incidentally; high-ability readers defined up to 27 of every 100 unknown words when reading for text comprehension."**
*Retrieved via:* [SAGE record](https://journals.sagepub.com/doi/abs/10.3102/00346543069003261), [ERIC EJ602665](https://eric.ed.gov/?id=EJ602665), [ResearchGate, Impact of Reading Purpose on Incidental Word Learning](https://www.researchgate.net/publication/229692794_Impact_of_Reading_Purpose_on_Incidental_Word_Learning_From_Context).

> **Product implication of `A4-C91`:** merely *exposing* a child to a word inside the tool is a ~6–15% proposition, and near-zero for the children who most need the word. **Exposure is not instruction.**

## C.2 — WHAT RESEARCH SAYS: tiered vocabulary and vocabulary instruction

**`A4-C92`** `[E4]` `[SNIPPET]` **Beck, McKeown & Kucan's three tiers** are a widely adopted heuristic for word selection: **Tier 1** basic, frequently used, "probably do not need to be taught"; **Tier 2** more challenging, used across disciplines, high-utility — "the main priority for vocabulary instruction"; **Tier 3** limited to specific domains. Their "robust instruction" position is that presenting words in multiple contexts and involving their active use "is more effective than traditional approaches such as providing lists of words and definitions or synonym-antonym pairs."
*Retrieved via:* [Institute for Learning, Robust Vocabulary Instruction](https://www.ifl-news.pitt.edu/2023/01/robust-vocabulary-instruction/), [Achieve the Core, Robust Vocabulary Instruction](https://achievethecore.org/peersandpedagogy/robust-vocabulary-instruction/), [Vocabulary Matters, Word Tiers](https://www.vocabulary-matters.org/word-tiers).

**`A4-C93`** `[UNVERIFIED]` **I could not locate an empirical validation of the three-tier *taxonomy itself*** — i.e. a study showing that selecting words by tier outperforms other selection methods. Searched: "Beck McKeown Kucan three tiers vocabulary robust instruction evidence critique tier 2 words." All retrieved sources describe or apply the framework; none evaluated it. **The tier framework is `[E4]` professional consensus. The *robust instruction* principle (multiple contexts + active use) is better supported (see `A4-C94`).**

**`A4-C94`** `[E1]` `[SNIPPET]` **Elleman et al. (2009), "The Impact of Vocabulary Instruction on Passage-Level Comprehension of School-Age Children: A Meta-Analysis," *Journal of Research on Educational Effectiveness* 2(1)** — **37 studies, pre-K to 12.** Findings as retrieved:

| Outcome | Effect |
|---|---|
| Comprehension, **custom** (researcher-designed) measures | **d = 0.50** |
| Comprehension, **standardized** measures | **d = 0.10** |
| Comprehension for students **with reading difficulties** (custom measures, controlling for method variables) | **d = 1.23** |
| Comprehension for students **without reading problems** (same conditions) | **d = 0.39** |
| Correlation between vocabulary effects and comprehension effects in studies reporting both | **r = 0.43** |

*Retrieved via:* [Taylor & Francis full record](https://www.tandfonline.com/doi/full/10.1080/19345740802539200), [ERIC EJ866970](https://eric.ed.gov/?id=EJ866970).

> **This is the most important vocabulary finding for the product.** Vocabulary instruction reliably improves vocabulary. Its effect on *comprehension* is **d = 0.10 on standardized measures** — near zero — and is **five times larger on measures built around the taught words**. Anyone claiming a vocabulary feature "improves reading" is claiming the 0.50, when the transferable number is the 0.10. And the children who benefit most (d = 1.23) are those with reading difficulties.

**`A4-C95`** `[E1]` `[SNIPPET]` **Morphological instruction works, is small, and only works when embedded and sustained.** Goodwin & Ahn (2010), "A Meta-Analysis of Morphological Interventions," *Annals of Dyslexia* — **17 independent studies, 79 standardized mean-change differences**. Overall literacy achievement **d = 0.33**. By outcome: phonological awareness **0.49**, morphological awareness **0.40**, vocabulary **0.40**, reading comprehension **0.24**, spelling **0.20**. Particularly effective for children with reading, learning or speech/language disabilities, English language learners, and struggling readers. Dosage: **no significant effect for 0–5 or 5–10 hours**; **d = 0.31 for 10–20 hours**; **d = 0.32 for 20+ hours**. Delivery: **d = 0.36 when part of comprehensive instruction; no significant effect in isolation.**
*Retrieved via:* [ERIC EJ905044](https://eric.ed.gov/?id=EJ905044), [ASHA Evidence Map summary](https://apps.asha.org/EvidenceMaps/Articles/ArticleSummary/93cb3843-8a27-4b52-887b-32781be13e92), [ResearchGate PDF](https://www.researchgate.net/profile/Amanda-Goodwin-2/publication/46010226_A_meta-analysis_of_morphological_interventions_Effects_on_literacy_achievement_of_children_with_literacy_difficulties/links/02e7e53208c8340c90000000/A-meta-analysis-of-morphological-interventions-Effects-on-literacy-achievement-of-children-with-literacy-difficulties.pdf).

> **The dosage finding is a warning to any product that sprinkles word-study.** Under 10 hours: no significant effect. In isolation: no significant effect.

## C.3 — WHAT RESEARCH SAYS: emotion and character-trait vocabulary

**`A4-C96`** `[E1]` `[SNIPPET]` **The emotion lexicon roughly doubles every two years between ages 4 and 11.** Retrieved: "Between 4 and 11 years old, the size of the emotional lexicon doubled every 2 years. The older the children, the more emotion words they produced, and with increasing age, children's pattern of emotion word usage converged with adult usage."
*Retrieved via:* [PMC9382957, "Let's Talk About Emotions: the Development of Children's Emotion Vocabulary from 4 to 11 Years of Age"](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9382957/).
*Maps to: **B0 through B3** — the entire Character Studio band except B4.*

**`A4-C97`** `[E1]` `[SNIPPET]` **Order of acquisition is systematic.** Retrieved: over 60% of 2-year-olds knew basic terms such as happy, mad, angry; between 3 and 5 children develop the ability to name basic emotions (joy, sadness, surprise, disgust, anger, fear); **"Emotion terms can be ordered developmentally with respect to their level of difficulty, from basic or common emotions like happy and afraid to more complex ones like touched and bored"**; children comprehend **positive** emotion words earlier than negative and neutral ones; and "During childhood, emotion words are acquired less rapidly than concrete words, but more rapidly than abstract words."
*Retrieved via:* [PMC9382957](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9382957/), [PMC9928212, emotion vocabulary 5–13 years psycholinguistic measure](https://pmc.ncbi.nlm.nih.gov/articles/PMC9928212/), [PMC4672887, Chinese children 2–13](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4672887/), [ScienceDirect, emotion-specific vocabulary 4–9](https://www.sciencedirect.com/science/article/abs/pii/S0022096519304229).

**`A4-C98`** `[E1]/[E5]` `[SNIPPET]` **Emotion-vocabulary curricula exist and report vocabulary gains.** The RULER Approach (Yale) includes a **Feeling Words Curriculum** with six units per grade K–5 focused on emotion vocabulary (frustrated, disappointed, calm, proud), explicitly targeting both academic outcomes (vocabulary, reading comprehension, writing, creativity) and social-emotional competence. A separate retrieved literature-based intervention, "READING and FEELING," with **second and third graders** (**B1**), "revealed significant improvements in emotional vocabulary, explicit emotional knowledge, and recognition of masked feelings."
*Retrieved via:* [ScienceDirect, RULER Feeling Words Curriculum, *Learning and Individual Differences*](https://www.sciencedirect.com/science/article/abs/pii/S1041608010001214), [RULER Approach classroom instruction](https://rulerapproach.org/how-it-works/classroom-instruction/), [PMC4267422, READING and FEELING](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4267422/).
*RULER is a named program with commercial/institutional distribution — tiering it `[E5]` alongside `[E1]` for the specific studies.*

**`A4-C99`** `[E4]` `[SNIPPET]` **Character-trait vocabulary teaching is an established elementary practice with a defined method and no located effect size.** Retrieved practice descriptions: student-friendly trait word lists (one source: 84 positive traits — Active, Admirable, Adventurous, Agreeable, Amiable, Amusing, Brave, Bright, Clever, Compassionate…); teaching **synonym clusters for overused words** (synonyms for "nice": helpful, friendly, kindhearted, compassionate, pleasant; for "mean": rude, thoughtless, impolite, cruel); **word walls organized by synonym or by connotation continuum**; anchor charts; and explicitly teaching trait terms in the context of characters across content areas.
*Retrieved via:* [Reading Rev, implementing character trait vocabulary across the grades](https://readingrev.com/blog/implementing-character-trait-vocabulary-across-the-grades), [Teaching Made Practical, developing character trait vocabulary](https://teachingmadepractical.com/charactertraitvocabulary/), [Vocabulary.com character traits list](https://www.vocabulary.com/lists/33665).
*`[UNVERIFIED]` for effectiveness: I could not locate any experimental evaluation of character-trait vocabulary instruction as such.*

> **The connotation-continuum idea in `A4-C99` is the most product-useful item here**, because it teaches *distinctions between* words rather than substitution *of* words — which is exactly what the synonym-substitution failure mode (`A4-C101`) requires.

## C.4 — WHAT RESEARCH SAYS: descriptive and figurative language development

**`A4-C100`** `[E1]` `[SNIPPET]` **Figurative language develops across the whole Character Studio band, and is not adult-like until late in it.** Retrieved: children can comprehend metaphors as early as ages 3–4; **"In early primary school (ages 4–7), children commonly comprehend metaphors in a rudimentary way, improving considerably by middle primary school (ages 8–10), and becoming consistent by upper primary school (ages 11–12)"**; early metaphor comprehension relies on **perceptual** rather than conceptual similarity; metalinguistic awareness developing around **6–7** enhances metaphor understanding; children learn **idioms as lexical units** rather than by analysing constituents, with comprehension of experience-relevant idioms **beginning by age 9**; adolescence marks increased sophistication in metaphor use and interpretation.
*Retrieved via:* [SAGE, "Developmental Steps in Metaphorical Language Abilities"](https://journals.sagepub.com/doi/abs/10.1177/0023830917746552), [Cambridge, early acquisition of figurative meanings](https://www.cambridge.org/core/journals/language-and-cognition/article/early-acquisition-of-figurative-meanings-in-polysemous-nouns-and-verbs/52CC3BB5CD488EEF31C6FB8AF7A457DB), [PMC10800952, metaphorical comprehension in Chinese children](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10800952/), [Springer, figurative language and narrative writing in high-achieving primary students](https://link.springer.com/article/10.1007/s13384-025-00890-w).

*Mapping:* rudimentary **B0–B1**; considerable improvement **B1–B2**; consistent **B3**; sophisticated **B4**.

**`A4-C101`** `[E1]` `[SECONDARY-SOURCED]` `[SNIPPET]` **Children given synonyms without word knowledge produce characteristic substitution errors.** Retrieved (attributed to George Miller and Patricia Gildea): pupils trying to work synonyms into their writing switched "Mrs Morrow stirred the soup" to **"Mrs Morrow stimulated the soup"**, and substituted *eroding* for *eats away* to produce **"Our family erodes a lot."** Retrieved commentary: "Even when children were given words in a sentence, or three, they could still struggle if they lacked word knowledge." Also retrieved: improper thesaurus use "can lead to awkward phrasing, miscommunication, and sometimes even a **loss of the writer's authentic voice**," and "Overuse of synonyms can strip writing of personal style and voice."
*Retrieved via:* [Alex Quigley, "The Problem with Teaching Sophisticated Vocabulary"](https://alexquigley.co.uk/the-problem-with-teaching-sophisticated-vocabulary/), [Principal Education mirror](https://principal-education.co.uk/the-problem-with-teaching-sophisticated-vocabulary/).
*I could not retrieve the Miller & Gildea primary source. `[SECONDARY-SOURCED]`.*

**`A4-C102`** `[E1]` `[SNIPPET]` **Lexical diversity and descriptive language grow measurably across the band.** Retrieved: older children's narrative writing shows "greater lexical density, sophistication, and diversity than younger children's"; children make "increases in the number of different words from 2nd to 4th grade, and even larger gains between 1st and 4th grade"; **"Adjectives and other forms of descriptive language increase children's narrative competence by providing nuance for both referential and evaluative aspects of storytelling"**; and **"fictional narratives contain more expressive elaboration than personal narratives, while personal narratives contain more lexical diversity."**
*Retrieved via:* [ScienceDirect, corpus-based developmental investigation of linguistic complexity in children's writing](https://www.sciencedirect.com/science/article/pii/S2666799124000017), [PMC8153412, lexical diversity in written narratives](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8153412/), [Wiley, supporting adjective learning by 5–7 year-olds](https://compass.onlinelibrary.wiley.com/doi/10.1111/lnc3.12476), [PMC3988833, fictional and personal narratives of school-age African American children](https://pmc.ncbi.nlm.nih.gov/articles/PMC3988833/).

**`A4-C103`** `[E1]` `[SNIPPET]` **Syntactic complexity grows on a known trajectory.** Retrieved: **Hunt (1965)** showed average written sentence length increasing from **13 → 16 → 17 → 25 words across Grades 4, 8, 12, and adult**. Fourth graders have greater T-unit length and clause density than first graders. With grade level, writers produce more relative, complement and subordinate clauses, a wider variety of clause types, and more passives and modals. Standard measures are length of sentences, T-units and clauses, plus clause-density ratios.
*Retrieved via:* [Springer, "Syntactic complexity measures: variation by genre, grade-level, students' writing abilities, and writing quality," *Reading and Writing*](https://link.springer.com/article/10.1007/s11145-020-10057-x), [Journal of Writing Research, linguistic features in writing quality and development](https://www.jowr.org/jowr/article/download/582/469/441), [BUCLD, Lexical Richness and Syntactic Complexity in Children's Story Writing](http://www.lingref.com/bucld/46/BUCLD46-25.pdf).

## C.5 — WHAT RESEARCH SAYS: readability and language-complexity measures, and their limits

**`A4-C104`** `[E1]` `[SNIPPET]` **Readability formulas lack construct and theoretical validity — this is a documented, longstanding critique, not a nitpick.** Retrieved: "Traditional readability formulas lack construct and theoretical validity because they are based on **weak proxies** of word decoding (characters or syllables per word) and syntactic complexity (words per sentence)"; "indicators are not the same as the thing to be indicated"; measures "are based only on surface characteristics of text and **ignore deeper levels of text processing** known to be important — cohesion, syntactic ambiguity, rhetorical organization, and propositional density — and they also ignore the reader's cognitive aptitudes, such as prior knowledge and language skills."
*Retrieved via:* ["Why readability formulas fail" (Illinois IDEALS)](https://www.ideals.illinois.edu/items/15551/bitstreams/54962/data.pdf), ["The linguistic assumptions underlying readability formulae: a critique"](https://www.academia.edu/197100/The_linguistic_assumptions_underlying_readability_formulae_a_critique), [UMich, computational assessment of text readability survey](https://public.websites.umich.edu/~kevynct/pubs/ITL-readability-invited-article-v10-camera.pdf).

**`A4-C105`** `[E1]` `[SNIPPET]` **Narrative text is the specific case where formulas fail worst — which is Character Studio's entire domain.** Retrieved: **"Short sentences and high-frequency vocabulary used in the dialogue of narratives can artificially skew the readability formula downward."** Concrete retrieved examples: an informational text about bats and a Newbery Award-winning novel about racism and land ownership can share **the same Lexile score of 720**; and *Don't Forget the Bacon* scores at grade level **2.7** on the Spache formula, "yet some children in fourth grade find it difficult to understand because the higher-level structure of the story is complex and subtle." Retrieved on Lexile specifically: "since the Lexile semantic measure comes from the average log frequency of words in a text, the predictive validity of the Lexiles can be limited when many words have the same rating."
*Retrieved via:* [TextProject, "Readability and the Common Core's Staircase of Text Complexity"](https://textproject.org/paper/staircase-text-complexity), [TextProject, "A Case for Using Multiple Sources of Information in Establishing Text Complexity"](https://textproject.org/paper/a-case-for-using-multiple-sources-of-information-in-establishing-text-complexity).

> **Dialogue-heavy character writing is precisely the text type that readability formulas score wrongly.** A tool that scores children's character writing for "reading level" would systematically penalize good dialogue and reward padding.

**`A4-C106`** `[E1]` `[SNIPPET]` **Better-grounded resources exist for judging word difficulty for children than readability formulas do.** Retrieved: **childLex**, a lexical database of German read by children built from a 10-million-word corpus of children's books, reporting norms for age groups **6–8 (grades 1–2), 9–10 (grades 3–4), 11–12 (grades 5–6)**; **CPB-Lex**, a database from children's picture books (ages 0–8) with ~25,585 wordform types plus bigram transitional probabilities, whose frequency norms "strongly predict age of acquisition and outperform comparable child-input lexical databases"; and **Kuperman et al. (2012) age-of-acquisition norms**, recently extended by a crowdsourcing megastudy obtaining **790,024 estimates** on **11,074 early-acquired words**.
*Retrieved via:* [Springer, childLex](https://link.springer.com/article/10.3758/s13428-014-0528-1), [Springer, CPB-Lex](https://link.springer.com/article/10.3758/s13428-023-02198-y), [PMC12500800, crowdsourced and AI-generated AoA norms extending Kuperman](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12500800/).
*Note: childLex is **German**; CPB-Lex covers **ages 0–8** and picture books, so it under-covers B2–B4. Neither is a drop-in solution for English grades 2–8.*

## PART C — WHAT CHARACTER STUDIO SHOULD DO

**Confidence: high for the restrictions; moderate for the positive recommendations.**

### Rule C.1 — Vocabulary support is offered as *meaning*, never as *substitution*.

`A4-C101`, `A4-C92`, `A4-C94`. The synonym-substitution failure ("Mrs Morrow stimulated the soup") is what happens when a system hands a child a word without the knowledge that governs its use. A one-tap "replace this word" control is the mechanized version of that failure.

```
FORBIDDEN interaction:  child taps word → tool replaces it with a "better" word
ALLOWED interaction:    child taps word → tool shows what a few nearby words MEAN,
                        with example sentences, and the child retypes if they want to
```

**Never implement a one-tap synonym swap.** The child must retype the word they choose. The retyping is not friction to be optimized away — it is the entire mechanism by which the word becomes theirs (`A4-C71`, `A4-C72`: ownership tracks the child's own contribution).

### Rule C.2 — Vocabulary offers are pull, not push.

`A4-C91`, `A4-C70`. Exposure alone yields ~6–15% learning and near-zero for lower-ability readers, so pushing words is ineffective *and* it is the homogenization mechanism. Word support appears only when the child opens it.

**Trigger conditions for vocabulary support (all must be child-initiated):**
- Child taps a word they wrote and asks about it.
- Child opens a word-exploration surface deliberately.
- Child types a "stuck for a word" query in their own words.

**Never triggered by:** the tool judging a word "too simple," repetition detection, reading-level scoring, or any automatic scan of the child's text.

### Rule C.3 — Quantity limits on word offers.

**DESIGN DECISION** (motivated by `A4-C58` on constraint overload, `A4-C68` on convergence, `A4-C13`/`A4-C63` on help abuse):

| Context | Max words shown | Notes |
|---|---|---|
| Single word-help request | **3–5** | Never a long list; long lists are thesauri and reproduce `A4-C101` |
| Per character, per session | **~15 total** | Soft cap; after this the tool suggests the child's own prior words instead |
| Auto-inserted into child's text | **0** | Always zero. No exceptions. |

### Rule C.4 — Prefer *contrast sets* over *synonym lists*.

`A4-C99`, `A4-C101`, `A4-C92`. Show words **that differ in meaning along a dimension the child cares about**, with the difference made explicit — the connotation-continuum practice. This teaches distinctions (robust instruction, `A4-C92`) rather than enabling substitution.

> ✅ "*Brave* means she does it even though she's scared. *Reckless* means she doesn't think about the danger at all. *Bold* is somewhere in between. Which is your character?"
> ❌ "Instead of *brave*, try: courageous, valiant, intrepid, dauntless, plucky."

Note that the ✅ version is also a **question about the child's character**, so it satisfies Rule A14.2 (the tool suggests questions, not content).

### Rule C.5 — Emotion vocabulary: match the developmental order, and never assume it.

`A4-C96`, `A4-C97`. The emotion lexicon roughly doubles every two years from 4 to 11, positive words come before negative, and simple precedes complex. Use this as a **prior for ordering**, never as a gate:

| Band | Emotion vocabulary posture |
|---|---|
| B0 (5–6) | Basic emotion set; picture support; positive-first |
| B1 (7–8) | Basic set plus first-tier extensions (nervous, embarrassed, jealous) |
| B2 (9–10) | Blends and intensities (frustrated vs. furious); mixed feelings |
| B3 (11–12) | Complex/social emotions (guilty, resentful, relieved, ashamed) |
| B4 (13–14) | Full range including subtle/ambivalent states |

**Gate rule:** a child who uses a B4-level emotion word at B1 gets B4-level support immediately, with no confirmation step and no comment about it.

### Rule C.6 — Figurative language: invite, don't require, and expect it to be perceptual before conceptual.

`A4-C100`. Under **B2**, metaphor comprehension is rudimentary and perceptually based. Character Studio may invite simile/metaphor ("what is she like, when she's angry?") but must never (a) mark a child's literal answer as a miss, (b) supply a metaphor for the child, or (c) mark a perceptual comparison ("she's like a red balloon") as less good than a conceptual one.

### Rule C.7 — DO NOT score children's writing for readability, reading level, or Lexile.

`A4-C104`, `A4-C105`. This is a hard prohibition, and it is one of the better-evidenced ones in the module. Readability formulas rest on weak proxies, ignore cohesion and structure, and **fail worst on dialogue-heavy narrative**, which is exactly what Character Studio produces. Scoring children's character writing this way would penalize the good writing and reward padding.

**Prohibited:** displaying a reading level for the child's work; using readability to gate features; using readability to decide what support to offer; showing readability to teachers or parents as a quality signal.
**Permitted:** using word-frequency/age-of-acquisition data (`A4-C106`) **internally** to order the vocabulary a child is *offered* — never to judge what the child *wrote*.

### Rule C.8 — Do not build vocabulary features on the tier taxonomy alone and call it evidence-based.

`A4-C92`, `A4-C93`, `A4-C94`, `A4-C95`. The tier framework has no located validation. What *is* supported is (a) robust instruction — multiple contexts plus active use; (b) that vocabulary instruction reliably raises vocabulary and barely moves standardized comprehension (d = 0.10); and (c) that morphology only pays off embedded and over 10+ hours. **Internal claim to hold the team to: "we help children learn words," not "we improve reading."**

### Rule C.9 — Route vocabulary support preferentially, but invisibly, to children who benefit most.

`A4-C94` (d = 1.23 for students with reading difficulties vs. 0.39 for others), `A4-C91` (low-ability readers learn almost nothing incidentally). This is a strong reason to make vocabulary support *available and easy*, and a strong reason **never to label who gets it** — see Part D.

---
---

# PART D — DIFFERENTIATION & ACCESSIBILITY

> **Be honest about this part.** Two of the most popular frameworks in this space — differentiated instruction and UDL — have evidence bases substantially weaker than their adoption suggests, and one adjacent idea (learning styles) is definitively debunked. Meanwhile the *specific* accessibility interventions (transcription relief, assistive input) have better evidence than the *general* frameworks do. Character Studio should therefore invest in the specific and be modest about the general.

## D.1 — WHAT RESEARCH SAYS: differentiated instruction

**`A4-C107`** `[E1]` `[SNIPPET]` **The differentiated-instruction evidence base is thin and inconsistently operationalized.** Smale-Jacobse, Meijer, Helms-Lorenz & Maulana (2019), "Differentiated Instruction in Secondary Education: A Systematic Review of Research Evidence," *Frontiers in Psychology*. Retrieved: a systematic review of literature from **2006 to 2016** on within-class differentiated instruction for secondary students' academic achievement identified **only 14 papers reporting 12 unique empirical studies**; "Differentiated instruction has been operationalized in many different ways, which complicates comparisons across studies"; "The majority of the studies show **small to moderate positive effects**"; and "more research is needed before drawing convincing conclusions regarding the effectiveness and value of different approaches."
*Retrieved via:* [Frontiers in Psychology](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2019.02366/full), [PMC6883934](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6883934/), [PubMed 31824362](https://pubmed.ncbi.nlm.nih.gov/31824362/).

> **⚠️ Number caution.** The retrieved synthesis reports "summarized effect sizes across studies range from d = +0.741 to +0.509 (omitting an outlier)" — a range stated backwards (larger to smaller) and with an outlier removed. **Do not cite this range.** What is safe to carry: 12 studies, inconsistent operationalization, small-to-moderate positive effects, explicit call for more research.

**`A4-C108`** `[E1]` `[SNIPPET]` **Learning styles are a debunked neuromyth, and the debunking is decisive.** Pashler et al. (2008) systematically reviewed **70+ studies** of the meshing hypothesis and concluded "at present, there is no adequate evidence base to justify incorporating learning-styles assessments into general educational practice." Retrieved: "the brain does not have separate visual, auditory, and kinesthetic processing channels"; "Substantial scientific evidence shows support for cross-modal processing and interconnectivity that contradicts the meshing perspective"; and belief in it remains "ubiquitous among educators."
*Retrieved via:* [Frontiers in Education, "The persistence of matching teaching and learning styles"](https://www.frontiersin.org/journals/education/articles/10.3389/feduc.2023.1147498/full), [Frontiers in Psychology, "Why educators endorse a neuromyth"](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2024.1407518/full), [PMC6113575, modality-specific learning style hypothesis mini-review](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6113575/).
*A retrieved 2024 meta-analysis is titled "Is it really a neuromyth? A meta-analysis of the learning styles matching hypothesis" — I could not retrieve its conclusion, so I note the dissent exists without characterizing it.* [Frontiers 2024](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2024.1428732/full).

**`A4-C109`** `[E6]` `[SNIPPET]` **UDL's evidence base has been formally challenged, including the evidence CAST itself cites.** Boysen (2024), "A critical analysis of the research evidence behind CAST's universal design for learning guidelines," evaluated the empirical studies cited on CAST's UDL website. Retrieved findings: "the cited studies provided little evidence for claims about UDL, **most of the studies did not offer a choice to learners or measure learning, and none of the studies were related to brain function**"; "the cited evidence behind CAST's UDL guidelines is weak and both basic research and implementation research are needed to establish the framework's validity and effectiveness." Separately, ongoing critiques cite "lacking clarity in definition, challenges with implementation, and insufficient evidence of its effectiveness."
*Retrieved via:* [Boysen 2024, SAGE](https://journals.sagepub.com/doi/10.1177/14782103241255428), [Springer, "Unraveling Challenges with the Implementation of Universal Design for Learning"](https://link.springer.com/article/10.1007/s10648-024-09860-7), [Taylor & Francis, UDL systematic review and meta-analysis](https://www.tandfonline.com/doi/full/10.1080/2331186X.2023.2218191).

> **⚠️ Do not cite the UDL meta-analysis effect size.** The retrieved synthesis reports "total effect sizes for the identified studies were **3.56**; however, considerable heterogeneity was evident." An aggregate effect of 3.56 for an instructional framework is not a credible educational effect size and almost certainly reflects a reporting or aggregation artifact. I am recording it only to warn against it.

**`A4-C110`** `[E6]` `[SNIPPET]` **Personalized/adaptive learning technology: inconclusive in K-12.** Retrieved: "The literature on adaptive learning's effectiveness in K-12 settings is inconclusive"; a meta-analysis of **27 studies** on reading found **g = 0.29**, "a modest positive effect"; and a named implementation problem — teachers reported that "misalignment between adaptive learning technology content and their personal teaching approach, or their school or district's standards, not only leads to confusion for students, but it makes them feel less effective at supporting student learning."
*Retrieved via:* [ScienceDirect, personalized and adaptive learning technologies on reading literacy meta-analysis](https://www.sciencedirect.com/science/article/abs/pii/S1747938X23000805), [ACM IDC 2025, impacts of adaptive learning technologies on K-12 teachers' autonomy/competence/relatedness](https://dl.acm.org/doi/full/10.1145/3713043.3727062).

## D.2 — WHAT RESEARCH SAYS: developmental language disorder (DLD)

**`A4-C111`** `[E1]` `[SNIPPET]` **Children with DLD show a substantial narrative gap.** A retrieved systematic review and meta-analysis in the *Journal of Speech, Language, and Hearing Research* reports children with DLD had decreased narrative performance relative to typically developing peers with **an overall average effect of −0.82 SD**.
*Retrieved via:* [ASHA JSLHR, "Investigating Narrative Performance in Children With Developmental Language Disorder"](https://pubs.asha.org/doi/10.1044/2022_JSLHR-22-00017).

**`A4-C112`** `[E1]` `[SNIPPET]` **Narrative intervention works, and the recommended form is explicit, manualized story-grammar teaching.** Retrieved from a systematic review with meta-analyses in *Language, Speech, and Hearing Services in Schools*: **26 group studies** identified "measurable improvements in both macrostructure and microstructure of narratives which were maintained," with the recommendation of "programmes and interventions that are **manualised or scripted with explicit teaching of story grammar and narrative elements**." Retrieved from intervention studies: "a story grammar intervention is an effective strategy for improving narrative proficiency and the ability to tell a coherent story"; "Although one method of narrative intervention did not prove more effective than others, improvements in story grammar and macrostructure abilities were seen across all studies"; after 10 weeks children improved at microstructural level (MLU, grammaticality, fluency, complexity) and macrostructural level (number of story grammar elements).
*Retrieved via:* [ASHA LSHSS, "Interventions Designed to Improve Narrative Language in School-Age Children"](https://pubs.asha.org/doi/10.1044/2021_LSHSS-20-00160), [SAGE, narrative group intervention in DLD](https://journals.sagepub.com/doi/abs/10.1177/0265659020950386), [ScienceDirect, pilot RCT of a novel narrative intervention program for DLD](https://www.sciencedirect.com/science/article/abs/pii/S0165587625000308).

## D.3 — WHAT RESEARCH SAYS: dyslexia, dysgraphia, transcription burden, and assistive input

**`A4-C113`** `[E1]` `[SNIPPET]` **Transcription burden is the mechanism, and it is quantified.** See `A4-C32`: mean standardized effect **0.49** for spelling-performance/writing-quality and **0.49** for handwriting fluency, K–12; transcription "acts as a constraint on the higher level processes of writing such as planning and revision"; spelling accuracy and handwriting speed predict burst length and text quality.

**`A4-C114`** `[E4]` `[SNIPPET]` **Dysgraphia: definitions and prevalence estimates conflict badly.** Retrieved definition: "individuals who, despite exposure to adequate instruction, demonstrate writing ability discordant with their cognitive level and age"; "a neurological disorder of written expression that impairs writing ability and fine motor skills... interfering with practically all aspects of the writing process, including spelling, legibility, word spacing and sizing, and expression." **Prevalence figures retrieved conflict: "5 to 20 percent of all children have some type of writing deficit like dysgraphia" and separately "the prevalence of dysgraphia ranges between 10 and 30%."** Named subtypes: motor dysgraphia (fine-motor/visual-perceptual; illegible slow handwriting, poor drawing/tracing, slow finger-tapping) and spatial dysgraphia (spatial perception affecting letter spacing and drawing; spelling and finger-tapping typically normal). Retrieved co-occurrence: common in children with ASD and/or ADHD; dyslexia the most prevalent co-occurrence indicator at **22%**.
*Retrieved via:* [Semantic Scholar, "Disorder of written expression and dysgraphia: definition, diagnosis, and management"](https://www.semanticscholar.org/paper/596d0025f5768c323413f263726c3b7f0efb9cb4), [Cleveland Clinic](https://my.clevelandclinic.org/health/diseases/23294-dysgraphia), [USNH Pressbooks chapter](https://pressbooks.usnh.edu/understandingandsupportinglearnerswithdisabilities/chapter/dysgraphia/).
*Do not cite a dysgraphia prevalence number. The retrieved range spans 5% to 30%.*

**`A4-C115`** `[E1]` `[SNIPPET]` **Speech-to-text: promising, mixed, and not yet demonstrated to change literacy outcomes.** Retrieved: "research suggests that STT may enhance students' ability to produce text with fewer errors and improve reading comprehension and word recognition"; retrieved rate comparison — "Students with dyslexia can speak at around **150 words per minute** compared to typing at **40 words per minute** or slower"; but also, from an intervention study, "the results on STT use for Grade 5 students with dyslexia are, to date, promising in its role as assistive technology, **the study did not demonstrate a significant effect on literacy acquisition** for the population," with individual cases suggesting STT use may support development; and "qualitative research is relatively sparse and short-term."
*Retrieved via:* [Taylor & Francis, "Writing Acquisition and Modality-Effect of Speech-to-Text Technology: An Intervention Study with Students with Dyslexia"](https://www.tandfonline.com/doi/full/10.1080/10573569.2026.2664964), [Taylor & Francis, STT scoping review for adolescents with learning difficulties](https://www.tandfonline.com/doi/full/10.1080/17483107.2022.2149865), [Taylor & Francis, STT single-case study in Nordic countries](https://www.tandfonline.com/doi/full/10.1080/17483107.2024.2351488), [Frontiers in Education, revisions in written composition with STT](https://www.frontiersin.org/journals/education/articles/10.3389/feduc.2023.1133930/full).

**`A4-C116`** `[E1]` `[SNIPPET]` **⚠️ Speech recognition is materially worse for children, and worst for the youngest — this is a serious equity issue for any voice-first design.** Retrieved figures: state-of-the-art speech-to-text achieves "as low as **5 percent word error rate on adults** in real-world settings, while the same models achieve **11–18 percent WER on children**," with "**15 to 21 percent WER on young children (6–10)** and up to **35 percent WER on kindergarteners (4–6)**" — "a **30 percentage point gap** between WER on kindergarteners vs adults." Also: "children's speech is subject to recognition error rates that are **two-to-five times higher** than adult speech." Named causes: higher acoustic variability, shifting formant frequencies due to vocal-tract development, irregular pronunciation, and dynamic developmental change.
*Retrieved via:* [The Learning Agency, "Closing the Child Speech Recognition Gap"](https://the-learning-agency.com/guides-resources/closing-the-child-speech-recognition-gap-evidence-limitations-and-paths-forward/), [The Learning Agency, "How Speech Recognition Systems Struggle with Children's Voices"](https://the-learning-agency.com/the-cutting-ed/article/how-speech-recognition-systems-struggle-with-childrens-voices/), [Interspeech 2005, human vs computer recognition accuracy for children's speech](https://www.isca-archive.org/interspeech_2005/darcy05_interspeech.pdf), [NSF PAR, difficulties of ASR for kindergarten-aged children](https://par.nsf.gov/biblio/10099068-difficulties-automatic-speech-recognition-kindergarten-aged-children).

> **This is the accessibility finding with the largest gap between what product teams assume and what is true.** "Just add voice input" is not an equivalent accommodation for a 7-year-old; at B0–B1 the tool will mis-transcribe roughly one word in five or worse. And children whose speech differs from the training distribution — multilingual children, children with speech sound disorders, children speaking non-mainstream varieties — will fare worse still.

**`A4-C117`** `[E1]` `[SNIPPET]` **Word prediction: clearest benefit is spelling/transcription accuracy; effects on quantity and speed are modest.** Retrieved: "An analysis of 25 years of research found that word prediction increases transcription accuracy and may also increase word fluency and compositional quality of writing for students with learning and academic difficulties. However, **gains in the total number of words and composition rate were modest** for the majority of participants." Retrieved: "The primary benefit of word prediction software for students with learning disabilities or developmental disabilities is **improved spelling**"; positive outcomes include fewer keystrokes, more words, increased spelling accuracy, increased writing rate. For students with **physical disabilities**: "word prediction had little to no effectiveness in increasing writing speed, but shows promise in decreasing spelling and typographical errors."
*Retrieved via:* [NCEO Accommodations Toolkit, word prediction research](https://publications.ici.umn.edu/nceo/accommodations-toolkit/word-prediction-research), [MacArthur 1999, word prediction for students with severe spelling problems](https://doi.org/10.2307/1511283), [ERIC EJ986388](https://eric.ed.gov/?id=EJ986388).

> **Note the tension with Part A/C.** Word prediction is an *evidence-supported accessibility feature* and simultaneously a *word-suggestion system*, which Part C restricts. The resolution is in Rule D.6 below: prediction may complete the word the child is already typing; it may not propose a word the child has not started.

**`A4-C118`** `[E4]` `[SNIPPET]` **Text-to-speech supports proofreading and revision.** Retrieved: "One of the best ways to catch errors in writing is to listen to it being read aloud"; speech synthesis programs "can aid with grammar, mechanics, and proofreading, with benefits in using adaptive software during higher-order revision"; auditory features "have assisted students with disabilities in overcoming difficulties composing, reading, and processing text"; and benefits "extend to any student regardless of background."
*Retrieved via:* [Purdue Writing Center Journal, "Listening to Revise"](https://docs.lib.purdue.edu/cgi/viewcontent.cgi?article=1745&context=wcj), [Taylor & Francis, STT scoping review](https://www.tandfonline.com/doi/full/10.1080/17483107.2022.2149865).

**`A4-C119`** `[E1]` `[SNIPPET]` **"Dyslexia-friendly" fonts do not work. This is a well-supported negative finding.** Retrieved: "There is no reliable research evidence that special fonts for children with dyslexia have any beneficial effect"; a **2017 study** comparing OpenDyslexic with Arial and Times New Roman found the font "actually **reduced reading speed and accuracy**," and "none of the students preferred to read material in OpenDyslexic"; a **2018 study** of Dyslexie found "no benefit to reading accuracy and speed"; and a retrieved meta-analysis "found that dyslexia-friendly fonts have **no consistent or reliable effect** on reading performance in terms of speed or accuracy," concluding that while certain typographical features may aid legibility, such fonts "do not offer substantial benefits over traditional fonts."
*Retrieved via:* [PubMed 42536336, meta-analysis of dyslexia-friendly fonts](https://pubmed.ncbi.nlm.nih.gov/42536336/), [PMC5629233, effect of OpenDyslexic on reading rate and accuracy](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5629233/), [PMC5934461, Dyslexie font does not benefit reading](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5934461/), [International Dyslexia Association](https://dyslexiaida.org/do-special-fonts-help-people-with-dyslexia/).

**`A4-C120`** `[E1]` `[SNIPPET]` **Keyboarding speed is low and enormously variable across the early band.** Retrieved: research indicates second-grade students type an average of **5 WPM**; students in grades 1–3 averaged **9 WPM**; third graders reached **up to 30 WPM**; fourth graders ranged **7.1–30 WPM**; fifth graders ranged **4.7–70 WPM**. A widely used informal target is **5 × grade level**. Retrieved caveat: "Current keyboarding speed norms are difficult to determine, because of the absence of a standardized keyboarding assessment and the variability of keyboarding instruction per grade level," and "without proper instruction, keyboarding may be more of a hindrance."
*Retrieved via:* [Taylor & Francis, keyboarding instruction comparison in elementary students](https://www.tandfonline.com/doi/full/10.1080/19411243.2018.1512067), [ERIC ED499927, initial touch keyboarding speed of fifth graders](https://files.eric.ed.gov/fulltext/ED499927.pdf), [QIAT handwriting/keyboarding rates PDF](https://www.qiat.org/docs/resourcebank/hwriting_kybding_rate_info.pdf), [Wisconsin DPI, elementary keyboarding](https://dpi.wi.gov/bit/standards/elementary-keyboarding).

> A B1 child typing at 5–9 WPM needs **several minutes** to produce two sentences. Any timeout, idle prompt, or "still there?" behaviour calibrated to adult typing will fire constantly and wrongly.

## D.4 — WHAT RESEARCH SAYS: ADHD and executive function

**`A4-C121`** `[E1]` `[SNIPPET]` **ADHD writing difficulty concentrates in the higher-order processes, especially planning.** Retrieved: "students with ADHD have more significant difficulties in high order writing performance, with writing quality and writing process (like planning and editing) identified as particular challenges"; "Children with ADHD usually experience difficulty producing a text because they **struggle to integrate ideas at the planning stage**"; and "written expression is a complex process governed by working memory, an area of significant weakness in children with ADHD." Named predictors of high-order writing performance: inattention, short-term memory, working memory, executive functions, reading, oral language skills, externalizing behavioural problems.
*Retrieved via:* [ScienceDirect, written expression abilities of adolescents with ADHD](https://www.sciencedirect.com/science/article/abs/pii/S0891422216300063), [ResearchGate, Executive functions and writing skills in children with and without ADHD](https://www.researchgate.net/publication/354876762_Executive_functions_and_writing_skills_in_children_with_and_without_ADHD), [NTU IREP, effects of ADHD on writing composition](https://irep.ntu.ac.uk/id/eprint/30527/1/8317_Betts.pdf).
*A retrieved prevalence figure — "64.5% of boys with ADHD presented with writing difficulties by age 19, while 57% of girls" — came from a practitioner blog, not a study I could verify. **Do not cite it.***

**`A4-C122`** `[E1]` `[SNIPPET]` **Executive function development across Character Studio's band is substantial and ongoing.** Retrieved: "Executive flexibility, goal setting, and information processing develop most rapidly from **ages 7 to 9**"; "the fastest stretch of executive function growth begins around **ages 10 to 12**, with abstract planning, prioritizing, and self-monitoring starting to sharpen"; "research points to the fastest development happening between roughly **10 and 15**"; and "continued improvement in working memory capacity across adolescence and into young adulthood," with full potential not reached until **18–20**.
*Retrieved via:* [Nature Communications, canonical trajectory of executive function maturation](https://www.nature.com/articles/s41467-023-42540-8), [Scientific Reports, developmental trajectories of executive function](https://www.nature.com/articles/s41598-020-80866-1), [Frontiers in Psychology, developmental profile of executive functioning in school-age children](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2020.596075/full).

## D.5 — WHAT RESEARCH SAYS: autistic learners

> **Framing note.** Much of the retrievable literature on autistic children's narrative is written in deficit terms. I have reported it accurately and paired it with the critiques of that framing, because a product built only on the deficit literature will build the wrong thing. Several searches in this area returned commercial ABA-provider blogs rather than research; I have not treated those as evidence.

**`A4-C123`** `[E2]` `[SNIPPET]` **The double empathy problem is the primary critique of deficit framing.** Damian Milton's framework "proposes that communication breakdowns in mixed-neurotype conversations arise from challenges on the part of **both** conversation partners, countering the assumption that autistic people are at a social deficit." Retrieved: "communication breakdowns happen **between** neurotypes, not within one group alone"; educational, workplace and community institutions "frequently function in accordance with implicit norms that favour neurotypical styles of interaction, and when these norms remain unexamined, they have the potential to inadvertently exclude autistic individuals and reinforce narratives of deficit."
*Retrieved via:* [Taylor & Francis open chapter, Milton, Waldock & Keates](https://www.taylorfrancis.com/chapters/oa-edit/10.4324/9781003189978-6/autism-double-empathy-problem-damian-milton-krysia-emily-waldock-nathan-keates), [SAGE, *Autism*, "Do you feel me?"](https://journals.sagepub.com/doi/10.1177/13623613241252320), [PMC10300641, rule-based theoretical account of social stories](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10300641/).

**`A4-C124`** `[E1]` `[SNIPPET]` **Narrative differences are documented; the research base is small, and cultural framing matters.** Retrieved: "Autistic children with adequate cognitive skills display several **differences** in their narrative competence affecting both micro- and macrolinguistic aspects of story production"; "Although autistic children did not show expressive language deficits on standardised tests, narrative assessment revealed difficulty with storytelling and referencing"; a systematic scoping review found **"only 12% of studies on narrative in autism spectrum disorder had a sample of more than 40 autistic participants."** On culture: "no differences between Mandarin-speaking autistic children and controls were found in the use of evaluation terms describing emotions, cognition, desire, or perception in storytelling, **which is not surprising given the generally lower levels of narrative evaluation documented in individuals from Asian cultural backgrounds**" — i.e. the "deficit" is partly an artifact of which narrative style is treated as the norm.
*Retrieved via:* [Languages, "Narrative Skills in Autistic and Non-Autistic Preschool Children: A Scoping Review"](https://doi.org/10.3390/languages11050093), [Springer JADD, "Defining the Characteristics of Story Production of Autistic Children"](https://link.springer.com/article/10.1007/s10803-023-06096-2), [Frontiers in Psychiatry, narrative and visual attention in ASD: cross-cultural perspective](https://www.frontiersin.org/journals/psychiatry/articles/10.3389/fpsyt.2026.1589600/full), [PMC7253523, narrative skills in primary school children with autism](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7253523/).

**`A4-C125`** `[E4]` `[SNIPPET]` **Strengths-based supports named in practitioner literature**: leveraging special interests ("students with ASD may have deep interest in one or more topics and can develop background information in these areas, which can contribute positively to the development of writing skills"); visual supports and graphic organizers; individualized rather than categorical instruction; and SRSD (`A4-C26`) as an evidence-based strategy that includes autistic students. Named strengths: visual thinking, attention to detail, special-interest knowledge, memory for facts, logical thinking, unique perspectives.
*Retrieved via:* [WRITE CENTER, Supporting Writers with ASD](https://www.writecenter.org/supporting-writers-with-asd.html), [Reading Rockets, using technology to support students with ASD in the writing process](https://www.readingrockets.org/topics/assistive-technology/articles/using-technology-support-students-autism-spectrum-disorders).
*Several sources returned for this search were commercial ABA-provider blogs. I have cited only the two non-commercial ones. `[E4]`, weak.*

## D.6 — WHAT RESEARCH SAYS: multilingual and emergent bilingual learners; non-mainstream narrative styles

**`A4-C126`** `[E1]` `[SNIPPET]` **Michaels's "sharing time" research is the canonical demonstration that teachers mis-evaluate non-mainstream narrative styles.** Retrieved: African American first-graders tended to produce narratives cohering "around a series of loosely and often unclearly related episodes, a style Michaels called **topic associating**," contrasted with the **topic centered** style of Caucasian first-graders. Critically: "**Teachers viewed the African-American children's stories as ill formed and saw the students' language as a deficit**, but Sarah Michaels analyzed the children's stories as fitting a different structure"; the teacher "was better able to help children expand narratives that were topic-centered" and "lacked the facility needed to aid children in particularizing narratives that were topic-associating, which led to unintentional mismatches." James Gee extended the analysis to argue the topic-associative structure "included complex literary elements."
*Retrieved via:* [Michaels, "Sharing time," *Language in Society* (Cambridge)](https://www.cambridge.org/core/journals/language-in-society/article/abs/sharing-time-childrens-narrative-styles-and-differential-access-to-literacy/EC5767FEA4D0837BA2CF0C0E89FAA39C), [ResearchGate PDF](https://www.researchgate.net/publication/231995864_Sharing_Time_Children's_Narrative_Styles_and_Differential_Access_to_Literacy), [ERIC EJ497723, African American kindergartners' spoken narratives](https://eric.ed.gov/?id=EJ497723).

**`A4-C127`** `[E1]` `[SNIPPET]` **Assessment bias against African American English in writing is measured.** Retrieved: "'errors' in writing caused by African-American English traits are **graded more harshly** than English as a Second Language (ESL) and Standard American English (SAE) errors and were failed at a higher percentage"; "the use of African American English negatively impacted community college students' grades on writing assignments because most educators had little knowledge of this variety or its valid linguistic characteristics"; and "White teachers are approximately **8 percentage points less likely** to rate Black student writing as grade-level or above compared to white student writing, while teachers of color do not show evidence of evaluation bias." Retrieved mitigation: "A relatively straightforward way to diminish the impact of teachers' racial biases in student evaluation is **standardizing grading rubrics**."
*Retrieved via:* [Linguistic Society of America proceedings, ratings of and attitudes toward student writing with AAE](https://journals.linguisticsociety.org/proceedings/index.php/PLSA/article/download/4041/3761/5667), [ResearchGate, "Linguistic Discrimination in Writing Assessment"](https://www.researchgate.net/publication/251642769_Linguistic_Discrimination_in_Writing_Assessment_How_Raters_React_to_African_American_Errors_ESL_Errors_and_Standard_English_Errors_on_a_State-Mandated_Writing_Exam), [Education Next, "How to Reduce Racial Bias in Grading"](https://www.educationnext.org/how-to-reduce-racial-bias-in-grading-research/), [PMC9132061, language variation in the writing of African American students](https://pmc.ncbi.nlm.nih.gov/articles/PMC9132061/).

**`A4-C128`** `[E4]/[E6]` `[SNIPPET]` **Translanguaging: promising, widely adopted, evidence base still forming.** Retrieved positive claims: "translanguaging enhances students' writing skills and fosters autonomy"; it "supports higher standards of thought and creativity in bilingual writing"; it "improves comprehension and reinforces weaker languages without diminishing any language's validity"; and it is "an essential process during the writing process not only as a scaffold for those at the initial stages of learning a language, but throughout the emergent bilingual students' writing life." Retrieved honesty: "**Translanguaging is relatively new as a classroom pedagogy, and it will be interesting to see if further research produces evidence for the effectiveness of teaching with translanguaging.**"
*Retrieved via:* [CUNY-NYSIEB, "A Translanguaging Pedagogy for Writing"](https://www.cuny-nysieb.org/wp-content/uploads/2016/05/TLG-Pedagogy-Writing-04-15-16.pdf), [NCTE Squire Office policy brief on translanguaging](https://ncte.org/wp-content/uploads/2021/04/SquireOfficePolicyBrief_Translanguaging_April2021.pdf), [Iowa Reading Research Center](https://irrc.education.uiowa.edu/blog/2023/02/embracing-translanguaging-classroom-bilingual-texts), [García & Lin, translanguaging in bilingual education PDF](https://ofeliagarciadotorg.wordpress.com/wp-content/uploads/2011/02/translanguaging-in-bilingual-education.pdf), [REL Pacific infographic](https://ies.ed.gov/rel-pacific/2025/01/infographic-5).

**`A4-C129`** `[E1]` `[SNIPPET]` **Multilingual writing instruction: some meta-analytic signal, mostly from technology and content-integration studies.** Retrieved: a meta-analysis of literacy-integrated content-area instruction for K–12 English learners covering **26 studies and 99 effect sizes** found "the magnitude of overall effects of literacy instruction in content learning was **medium in writing** but large in reading, vocabulary, and content knowledge," and that **"longer instructional durations (one year or longer) and small group configurations proved more effective."** A separate meta-analysis of **64 studies** on technology-enhanced ESL/EFL writing instruction reported **g = 1.00**. And writing self-efficacy correlated more strongly with achievement for L2 learners (**r = .441**) than L1 learners (**r = .233**) across **76 studies and 565 effect sizes**.
*Retrieved via:* [SAGE, effects of literacy-integrated content area instruction on English learners](https://journals.sagepub.com/doi/10.1177/13621688251397352), [Taylor & Francis, technology-enhanced language learning on ESL/EFL writing meta-analysis](https://www.tandfonline.com/doi/abs/10.1080/09588221.2022.2118782), [ScienceDirect, L2 writing self-efficacy meta-regression](https://www.sciencedirect.com/science/article/abs/pii/S1060374321000321).

**`A4-C130`** `[E1]` `[SNIPPET]` **A relevant reassurance from the AI-feedback literature:** in Steiss et al. (`A4-C46`), **"feedback did not vary by language status for humans or AI."**
*Retrieved via:* [ScienceDirect](https://www.sciencedirect.com/science/article/pii/S0959475224000215).

## D.7 — WHAT RESEARCH SAYS: gifted and advanced writers

**`A4-C131`** `[E1]` `[SNIPPET]` **Acceleration has strong research support; enrichment and acceleration are complementary; ceiling effects are a named measurement problem.** Retrieved: an umbrella review synthesized meta-analytic evidence on acceleration, enrichment and ability grouping; "No educational option for gifted students has the research support that academic acceleration has, with over 60 years of research"; "Enrichment programs focus on horizontal or lateral development, while acceleration programs focus on vertical development, with experts agreeing that the most successful gifted programs incorporate both"; and **"A 'ceiling effect' can flatten or even hide differences between students at the top."**
*Retrieved via:* [Frontiers in Education umbrella review](https://www.frontiersin.org/journals/education/articles/10.3389/feduc.2026.1925181/full), [Davidson Institute, best-evidence synthesis on acceleration](https://www.davidsongifted.org/gifted-blog/a-best-evidence-synthesis-of-research-on-acceleration-options-for-gifted-students/), [UConn, Enrichment Theory, Research and Practice PDF](https://gifted.media.uconn.edu/wp-content/uploads/sites/961/2025/01/Enrichment-Theory-and-Practice-Research.pdf).

**`A4-C132`** `[E1]` `[SNIPPET]` **Twice-exceptional children are systematically missed because strengths mask difficulties.** Retrieved: gifted students with learning disabilities show "higher-level intellectual abilities, advanced vocabulary, and exceptional comprehension of abstract ideas **intertwined with poor reading and writing skills**"; "Current identification procedures fail on certain children because of the 'masking' effect due to the compensation process"; "gifted-dyslexic students' gifted strengths, especially those relating to oral language, may enable them to compensate... at least to an extent that they fail to meet standard diagnostic criteria"; and "Identification is compounded because the strengths of these students sometimes mask the weaknesses."
*Retrieved via:* [Kranz et al. 2024, *Dyslexia*, "Twice-exceptionality unmasked"](https://onlinelibrary.wiley.com/doi/full/10.1002/dys.1763), [ScienceDirect, "Being Twice Exceptional"](https://www.sciencedirect.com/science/article/pii/S1877042814023933), [University of Denver, twice-exceptional identification and identity formation](https://digitalcommons.du.edu/cgi/viewcontent.cgi?article=3076&context=etd).

> **`A4-C132` is a direct argument against any single-axis support model.** A child may simultaneously need heavy transcription support and zero conceptual support. A system that reads "struggling" from output volume will get twice-exceptional children exactly wrong.

## D.8 — WHAT RESEARCH SAYS: accessibility standards and assistive technology obligations

**`A4-C133`** `[E3]` `[SNIPPET]` **WCAG 2.2** (W3C Recommendation, October 2023) adds nine success criteria: **Focus Not Obscured (Minimum, AA)** and **(Enhanced, AAA)**; **Focus Appearance (AAA)**; **Dragging Movements (AA)**; **Target Size (Minimum, AA)**; **Consistent Help (A)**; **Redundant Entry (A)**; **Accessible Authentication (Minimum, AA)** and **(Enhanced, AAA)**. Specifics retrieved: Target Size minimum **24 × 24 CSS pixels**; Dragging Movements requires "any action performed by dragging also have a single-pointer alternative, such as a tap or on-screen button, unless dragging is essential"; Focus Appearance requires the focus indicator be at least "as large as the area of a 2 CSS pixel thick perimeter of the unfocused component" with contrast ratio **at least 3:1**; Accessible Authentication requires methods that do not rely on cognitive function tests such as solving puzzles, recognising objects or transcribing something.
*Retrieved via:* [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/), [TetraLogical, what's new in WCAG 2.2](https://tetralogical.com/blog/2023/10/05/whats-new-wcag-2.2/), [Vispero, new success criteria in WCAG 2.2](https://vispero.com/resources/new-success-criteria-in-wcag22/).

**`A4-C134`** `[E3]` `[SNIPPET]` **W3C COGA — "Making Content Usable for People with Cognitive and Learning Disabilities"** provides supplemental guidance beyond normative WCAG, "addressing barriers that could not be included in the normative WCAG specification." Named principle: "Use icons, symbols, terms, and design patterns that are **already familiar** to users so they do not need to learn new ones, as people with cognitive and learning disabilities frequently need common behavior and design patterns." Scope named includes dyslexia, dyscalculia, dyspraxia, ADHD and autism. Named recommendations: simpler language, predictable navigation, fewer distractions.
*Retrieved via:* [W3C COGA "Making Content Usable"](https://www.w3.org/TR/coga-usable/), [W3C COGA introduction](https://www.w3.org/TR/coga-usable/introduction.html), [UK DfE accessibility manual, COGA guidelines](https://accessibility.education.gov.uk/guidelines/coga).

**`A4-C135`** `[E3]` `[SNIPPET]` **IDEA requires assistive technology to be *considered* for every child with an IEP.** Retrieved: "Every IEP team is required by the Individuals with Disabilities Education Act (IDEA) to take into account whether a student needs assistive technology in order to benefit from their education"; "The IEP team must document in writing that they considered assistive technology"; AT devices and services provided as part of special education, related services or supplementary aids "must be included in the IEP"; a 1997 amendment "required AT devices and services be an accommodation consideration for every student who is being evaluated for an IEP and if deemed appropriate, **must be provided at no cost to parents**"; and AT *services* — support with selection, acquisition and use, plus training for parents, families, teachers and related service providers — are separately required.
*Retrieved via:* [IDEA site, AT devices and services guidance](https://sites.ed.gov/idea/idea-files/at-guidance/), [Reading Rockets, Assistive Technology and the IEP](https://www.readingrockets.org/topics/learning-disabilities/articles/assistive-technology-and-iep), [ASHA, IDEA AT definition revision](https://www.asha.org/advocacy/idea/04-law-assist-tech/).

**`A4-C136`** `[E4]` `[SNIPPET]` **Interface design for children: text is the primary barrier.** Retrieved: "Most adult user-interfaces assume users are proficient readers with extensive vocabularies, but most children have not reached this proficiency level, and **older children may not fully understand text-based instructions**"; "children's reading comprehension develops gradually, meaning they often struggle with complex language"; "children between the ages of 5 and 8 are more successful with simplified layouts that avoid clutter and reduce mental load"; and "designers need to be aware of the challenges many children face in **typing, spelling, and reading**, as well as their search strategy skills."
*Retrieved via:* [Nielsen Norman Group, Children's UX](https://www.nngroup.com/articles/childrens-websites-usability-issues/), [ResearchGate, UI design guidelines for children's mobile learning applications](https://www.researchgate.net/publication/364105991_User_Interface_Design_Guidelines_for_Children_Mobile_Learning_Applications), [Oxford Academic, *Interacting with Computers*, interactive design framework for children's apps](https://academic.oup.com/iwc/article/34/3/85/6964644).

**`A4-C137`** `[E4]` `[SNIPPET]` **Non-visual creative tools are an active but immature research area.** Retrieved: children who are blind or have low vision "may write using typical word-processing programs with screen-reading programs, refreshable braille, or screen magnifiers"; supports include braille translation software and speech recognition as an alternative writing method; for drawing, "tactile drawing boards offer raised-line feedback, while swell-form machines convert printed images into raised graphics." Retrieved research framing: "Blind creativity and productivity tools are a challenging design space that requires continued innovation," with prior work on "accessible photography, video authoring, image generation, artboard authoring, and music creation."
*Retrieved via:* [APH ConnectCenter, Tools for Writing for Children Who Are Blind or Low Vision](https://aphconnectcenter.org/familyconnect/education/ecc/assistive-technology/tools-for-writing/), [ACM CHI 2021, "Understanding Blind Screen-Reader Users' Experiences of Digital Artboards"](https://dl.acm.org/doi/fullHtml/10.1145/3411764.3445242), [Perkins School for the Blind, A to Z of assistive technology for low vision](https://www.perkins.org/resource/z-assistive-technology-low-vision/).

## PART D — WHAT CHARACTER STUDIO SHOULD DO

**Confidence: high for the specific accessibility requirements; deliberately modest for the general frameworks.**

### Rule D.1 — Never label a child, visibly or in a way a child or peer can infer.

`A4-C126`, `A4-C127`, `A4-C132`, and the never-say list (Rule A9.3). This is the governing rule of Part D and it overrides feature convenience.

**Prohibited:**
- Any visible mode, badge, avatar, colour, or UI variant that denotes support level.
- Any copy that references the child's ability, difficulty, level, or category.
- Any teacher- or parent-facing screen that presents an inferred category ("likely needs support with X") as opposed to raw observed behaviour the adult interprets.
- Any peer-visible difference in the tool's appearance between two children.

**Required:**
- Support features are **available to every child, all the time**, under neutral names describing what they *do* ("read this to me," "type by talking," "word ideas"), never who they are *for*.
- Support intensity may vary in what the tool *offers proactively*, but never in what is *available*.
- **Both directions:** an advanced child must not be visibly marked as advanced either (`A4-C131`, `A4-C132`).

### Rule D.2 — Differentiation is opt-in and self-selected, because the alternative has weak evidence and real harms.

`A4-C107` (12 studies, inconsistent operationalization), `A4-C108` (learning styles debunked), `A4-C109` (UDL evidence challenged), `A4-C110` (adaptive learning inconclusive in K-12), `A4-C132` (masking). Character Studio should implement differentiation as **a wide set of always-available options the child chooses among**, not as a system that classifies children and routes them.

**Rule D.2a — NEVER implement learning styles.** `A4-C108`. No visual/auditory/kinesthetic learner assessment, no "your learning style" quiz, no content matched to a modality preference. This is a debunked neuromyth and shipping it would be an unforced error.

**Rule D.2b — Do not claim UDL compliance as an evidence claim.** `A4-C109`. Character Studio may *use* UDL's multiple-means structure as a **design checklist** — it is a reasonable checklist — while stating internally and externally that it is a framework, not a validated intervention.

### Rule D.3 — Transcription relief is the highest-value accessibility investment, and it is for everyone.

`A4-C32`, `A4-C113`, `A4-C120`. Transcription constrains composition for **all** young writers, not only identified ones; keyboarding at B1 runs 5–9 WPM. Every transcription-relief feature should ship to every child by default.

**Required inputs — the child may compose by any of these, at any time, with no setup and no permission:**

| Modality | Notes |
|---|---|
| Typing | Baseline |
| Speech-to-text | **With the accuracy caveats in Rule D.4** |
| Handwriting/stylus | Where the platform supports it |
| Drawing/visual | First-class composition, not decoration (`A4-C37`) |
| Selecting from the child's own prior words | Never from tool-generated words (Rule A14.2) |
| Dictating to a person who types | Explicitly supported and never treated as cheating |

### Rule D.4 — Speech-to-text must be built assuming it will be wrong, especially for the youngest and for non-mainstream speakers.

`A4-C116`. WER of 11–18% for children, 15–21% for ages 6–10, up to 35% for ages 4–6, vs ~5% for adults. Design consequences:

1. **Never auto-commit a transcription.** Always show it for confirmation before it enters the child's text.
2. **Make correction cheap and low-shame.** One tap to re-record a phrase; never a red squiggle over the child's own speech.
3. **Never let a misrecognition surface as a judgment of the child's language.** A mis-transcribed word must never trigger a vocabulary or grammar response.
4. **Never make voice the only path to any feature.** `A4-C116` means a voice-gated feature is inaccessible to a substantial fraction of B0–B1 children, to children with speech sound disorders, and to children whose speech varieties are underrepresented in training data.
5. **Support voice notes that are never transcribed.** A child should be able to record a character's voice and keep it as audio. This is fully accessible regardless of ASR quality.

### Rule D.5 — Text-to-speech is required, and is a revision tool as well as an access tool.

`A4-C118`. Every piece of text in the product — the child's own writing, other children's characters, the tool's own words — must be readable aloud on demand. Framed as "hear it," a craft affordance, not "read it to me because you can't."

### Rule D.6 — Word prediction is permitted; word *suggestion* is not. The line is whether the child started the word.

`A4-C117` (prediction improves transcription accuracy and spelling), `A4-C101` (synonym substitution errors), Rule A14.2, Rule C.1.

```
ALLOWED:  child typed "cour"  → offer "courage", "courageous"      (completion)
BLOCKED:  child typed nothing → offer "courageous", "brave"        (suggestion)
BLOCKED:  child typed "brave" → offer "courageous" as replacement  (substitution)
```

Prediction must be **toggleable off** in one step and must never be the only way to spell a word.

### Rule D.7 — Do not ship a "dyslexia font."

`A4-C119`. There is no reliable evidence of benefit, one study found OpenDyslexic *reduced* speed and accuracy, and no student in that study preferred it. **Ship instead** what does have support: user-controllable font size, line spacing, letter spacing, contrast, and background colour; a clean high-legibility default; and text-to-speech (`A4-C118`). Character Studio may *offer* OpenDyslexic among font choices if users request it, but must not present it as an accessibility feature or default it on.

### Rule D.8 — Support planning explicitly, because planning is the concentrated difficulty.

`A4-C121` (ADHD difficulty concentrates at planning/idea integration), `A4-C122` (EF still developing across the whole band), `A4-C112` (explicit story-grammar teaching works for DLD). Character Studio's planning surface should be:

- **Externalized** — the plan is visible on screen so it does not have to be held in working memory (`A4-C121`).
- **Chunked** — one decision visible at a time, with the rest collapsible.
- **Non-linear** — enter at any point, in any order (`A4-C20b`, `A4-C53`).
- **Persistent and forgiving** — state survives interruption; returning shows what the child was doing without implying they were away too long.
- **Optional** — a child who plans in their head must be able to skip it entirely.

### Rule D.9 — For DLD-type needs, the supported form is explicit, structured, repeated narrative/story-grammar teaching — offered, never imposed.

`A4-C112`. This is one of the better-evidenced interventions in Part D. In a character tool it maps to an optional, consistent, explicitly-named character structure (who they are, what they want, what's in the way, how they change) taught the same way every time. **Consistency is the active ingredient** — the retrieved review recommends manualized/scripted delivery.

### Rule D.10 — Never treat a non-mainstream narrative style or language variety as an error.

`A4-C126`, `A4-C127`. This is the most serious equity risk in the product, and it has direct measured harm behind it: topic-associating narratives were judged "ill formed"; AAE features are graded more harshly than ESL or SAE errors; white teachers rate Black students' writing lower.

**Prohibited:**
- Any automated flagging of AAE, other English varieties, or L1-influenced constructions in creative writing or character voice.
- Any structural feedback implying a topic-centered narrative is the correct shape.
- Any "improve this" suggestion that converts the child's variety into mainstream academic English.
- Any coherence/structure scoring whose training or rules encode one narrative style as correct.

**Required:**
- **Character voice is explicitly exempt from every mechanics affordance.** If the child says a line is their character talking, no spelling, grammar, or word-choice affordance applies to it at all.
- If a mechanics affordance exists anywhere, it must be **child-invoked only** and framed as "make it match how people spell in school writing" — a register choice the child makes, not a correction the tool imposes.
- Multilingual composition must be supported: the child can write any part of a character in any language or mix languages, and the tool must not flag, translate, or normalize it (`A4-C128`).

### Rule D.11 — Do not overclaim translanguaging, but do enable it.

`A4-C128`. The retrieved literature itself says the effectiveness evidence is still forming. So: **build the affordance** (it costs little and removes a real barrier), **don't market it as evidence-based**.

### Rule D.12 — No ceiling. Ever.

`A4-C131`, `A4-C132`. Advanced writers must never hit a wall built for the median child.

**Requirements:**
- No character length limit that a capable child can reach in normal use.
- No cap on the number of characters, relationships, or details.
- No forced scaffolding, forced steps, or forced tutorials — everything skippable at first contact.
- No "you're done" state imposed by the tool.
- Depth available on demand at every point, with no gate ("show me how professional writers think about this").
- **Support dimensions are independent** (`A4-C132`): a child using maximum transcription support must be able to receive zero conceptual support at the same time, and vice versa. Never collapse support to one axis.

### Rule D.13 — Accessibility conformance requirements.

`A4-C133`, `A4-C134`, `A4-C135`, `A4-C136`, `A4-C137`.

| Requirement | Source |
|---|---|
| WCAG 2.2 Level AA as the minimum conformance target | `A4-C133` |
| Touch/click targets **≥ 24 × 24 CSS px**; larger recommended for younger bands as a **DESIGN DECISION** | `A4-C133` |
| **Every drag interaction has a single-pointer alternative** — critical for a canvas/character-builder UI | `A4-C133` |
| Visible focus indicator, not obscured, ≥ 3:1 contrast | `A4-C133` |
| **Consistent Help** — help is in the same place on every screen | `A4-C133` |
| **Redundant Entry** — never make a child re-type something they already entered | `A4-C133` |
| **Accessible Authentication** — no puzzle/object-recognition/transcription-based sign-in for children | `A4-C133` |
| Full keyboard operability of the entire character builder | `A4-C133` |
| Screen-reader operability, including meaningful labels for every visual character element | `A4-C137` |
| Familiar icons and design patterns; predictable navigation; minimal distraction | `A4-C134` |
| **Interface text written well below the youngest supported reader's level**, with every text instruction also available as audio | `A4-C136`, `A4-C118` |
| Reduced-motion and reduced-distraction settings | `A4-C134` |
| Any visual character representation has a text alternative the child controls; visual selection is never required to create a character | `A4-C137` |
| Data exportable so it can be used with a child's own AT | `A4-C135` |

### Rule D.14 — Support the IEP/504 workflow without ever surfacing it to the child.

`A4-C135`. Because IDEA requires AT consideration and documentation, Character Studio's accessibility features have institutional value — but the child must never see a feature framed as an accommodation. **Implementation:** adult-facing documentation lists what the product offers so an IEP team can consider it; the child-facing product has no accommodation concept at all, because every feature is available to everyone (Rule D.1).

---
---

# PART E — CONSOLIDATED DECISION LOGIC FOR CHARACTER STUDIO

> Everything in this part is **product specification**, not research. It cites the claims it rests on. **Every numeric threshold here is a `DESIGN DECISION`** — an engineering starting point to be validated with real children, not a finding. Where a rule *is* research-driven in its direction (e.g. "fade support"), that is stated; where the *amount* is invented, that is stated too.

## E.1 — THE SCAFFOLD INTENSITY MODEL

### E.1.1 — Principles the model must satisfy

| # | Principle | Claims |
|---|---|---|
| P1 | Support is **contingent** on observed child output, never on age, never on a timer | `A4-C05` |
| P2 | Support **fades** as the child produces, by removing elements not by changing tone | `A4-C05`, `A4-C09`, `A4-C10` |
| P3 | Support **re-escalates** on observed need, and re-escalation must be as easy as fading | `A4-C05`, `A4-C60` |
| P4 | Support **dimensions are independent**; there is no single "level" for a child | `A4-C132` |
| P5 | The child can **override the level in either direction at any time**, and the override wins | `A4-C53`, `A4-C55` |
| P6 | **No level is ever visible** to the child, to peers, or as a category to adults | `A4-C126`, `A4-C127`, `A4-C132` |
| P7 | Age band is a **weak prior only**, discarded the moment output is observed | Whole-document stance |

### E.1.2 — The four independent support dimensions

Character Studio must model support as **four separate dials**, never one. `A4-C132`, `A4-C33`.

| Dimension | What it supports | Evidence anchor |
|---|---|---|
| **T — Transcription** | Getting words onto the screen at all | `A4-C32`, `A4-C113`, `A4-C120` |
| **S — Structure** | Knowing what parts a character has | `A4-C20`, `A4-C112` |
| **I — Ideation** | Having something to say | `A4-C57`, `A4-C58` |
| **L — Language** | Word choice, description, craft | `A4-C94`, `A4-C102` |

A twice-exceptional child may sit at **T3 / S0 / I0 / L0**. A fluent typist with no idea what to write may sit at **T0 / S1 / I2 / L0**. A single "level" would serve neither.

### E.1.3 — Levels within each dimension

| Level | Meaning | What the tool does |
|---|---|---|
| **0** | Out of the way | Nothing offered on this dimension. Everything still *available* if the child opens it. |
| **1** | Available and visible | The affordance is on screen, unopened, unlabelled as help. |
| **2** | Offered once | The tool makes **one** unobtrusive, declinable offer on this dimension, then returns to level 1. |
| **3** | Offered with structure | The tool offers the affordance **and** an accompanying question/structure. Still one offer. Still declinable. |

**There is no level 4. There is no level at which the tool produces the child's content.** `A4-C68`, `A4-C70`, `A4-C71`, `A4-C72`, Rule A14.2.

### E.1.4 — Initial level (weak prior only)

**DESIGN DECISION.** Applies only until the child produces anything at all — typically the first 60–120 seconds.

| Band | T | S | I | L | Rationale |
|---|---|---|---|---|---|
| B0 (5–6) | 3 | 2 | 2 | 0 | Transcription dominant (`A4-C32`, `A4-C120`); no language shaping this young |
| B1 (7–8) | 3 | 2 | 1 | 0 | Same; structure available (`A4-C112`) |
| B2 (9–10) | 2 | 1 | 1 | 1 | Transcription still constrains (`A4-C120`) |
| B3 (11–12) | 1 | 1 | 1 | 1 | Self-efficacy dip band — reduce evaluative surface (`A4-C56`) |
| B4 (13–14) | 1 | 0 | 1 | 1 | Expertise reversal risk highest (`A4-C09`) |

**This table is overridden by the first observed output.** It never re-applies within a session.

### E.1.5 — Fading rules (research-directed; thresholds invented)

```
FADE-1  Produce-then-fade
        IF child produces self-authored content on dimension D
           without using the level-2/3 offer on D
        THEN D.level -= 1
        (Basis: A4-C05 contingency, A4-C09 expertise reversal)

FADE-2  Decline memory  [DESIGN DECISION: 2 declines]
        IF child declines an offer on D twice in a session
        THEN D.level = 0 for the remainder of the session
             AND D starts one level lower next session
        (Basis: A4-C53 autonomy; A4-C60 unrequested support)

FADE-3  Fade the element, never the warmth
        Fading removes scaffold elements (Rule A2.2 ladder).
        It never changes tone, never withdraws availability,
        never communicates that the child "graduated."
        (Basis: A4-C10; A4-C40/A4-C42 — no self-level signalling)

FADE-4  Ceiling detection
        IF child's unprompted output on D already exceeds
           what the level-3 scaffold would have produced
        THEN D.level = 0 immediately, and stays 0 for the session
        (Basis: A4-C09 expertise reversal; A4-C131 no ceiling)

FADE-5  Session-to-session decay  [DESIGN DECISION]
        Levels persist across sessions but decay by 1 after
        3 consecutive sessions with no use of that dimension's offers.
        (Basis: A4-C05 transfer of responsibility)
```

### E.1.6 — Re-escalation rules (must be as easy as fading)

```
ESC-1  Child asks
       IF child explicitly requests help on D
       THEN D.level = 3 immediately, no confirmation, no comment
       (Basis: Rule A13.5 / A4-C62 — never withhold requested support)

ESC-2  Abandonment signal  [DESIGN DECISION]
       IF child opens a dimension, produces nothing, and leaves it
          — twice in one session —
       THEN D.level += 1  (max 3)
       Note: this is a WEAK signal. Silence may be thinking (A4-C120:
       a B1 child needs minutes to type two sentences). Never escalate
       on a single silence, and never on a timer alone.

ESC-3  Deletion signal  [DESIGN DECISION]
       IF child writes and then deletes substantially on D, twice
       THEN offer a DIFFERENT KIND of support, not more of the same
       (Basis: Rule A13.4 / A4-C63 — change mode rather than escalate hints)

ESC-4  New task type resets nothing downward
       Starting a new character NEVER resets levels upward
       "just in case." Levels are the child's, not the task's.
       (Basis: A4-C05 contingency; A4-C09)

ESC-5  Re-escalation is silent
       The tool never says "let's try with a bit more help."
       (Basis: never-say list Rule A9.3; A4-C126/A4-C127 no labelling)
```

### E.1.7 — Signals the model may and may not use

| ✅ May use | ❌ May NOT use |
|---|---|
| Whether the child produced self-authored content | Age or grade alone, after first output |
| Whether the child used or declined an offer | Reading level or readability score (`A4-C104`, `A4-C105`) |
| Whether the child asked for help | Word count as a proxy for ability (`A4-C26`) |
| Whether the child deleted substantially | Typing speed as a proxy for ability (`A4-C120` — huge variance) |
| Explicit child settings | Spelling accuracy as a proxy for ideas (`A4-C132` — masking) |
| Which support affordances the child turned on | Any inferred diagnosis or category (`A4-C127`, `A4-C132`, Rule D.1) |
| | Comparison to other children (`A4-C39`, `A4-C42`) |
| | Speech-recognition confidence as an ability signal (`A4-C116`) |

---

## E.2 — FEEDBACK RULES

### E.2.1 — The speak/silent decision

```
DEFAULT: SILENT                                   (A4-C39, A4-C41)

SPEAK only when ALL of:
  (a) trigger ∈ {child_requested, child_hit_stuck_affordance,
                 child_completed_own_declared_goal}
  (b) utterance.level ∈ {task, process, self_regulation}   (A4-C40)
  (c) utterance passes the NEVER-SAY filter                (Rule A9.3)
  (d) utterance contains no evaluation, no comparison,
      no trait attribution, no content the child could paste in
  (e) budget not exhausted                                  (E.3)

NEVER SPEAK on:
  idle timers · field blur · keystroke pauses · session start ·
  session end · streak maintenance · "encouragement" schedules ·
  detecting a "weak" word · detecting repetition ·
  detecting short output · detecting spelling errors in creative text
```

### E.2.2 — Permitted utterance forms

| Form | Template | Level | Claims |
|---|---|---|---|
| **Description** | "You [past-tense verb] [specific thing in the text]." | Task | `A4-C40` |
| **Naming the move** | "You started with [X]. That's one way in." | Process | `A4-C40` |
| **Open question** | "What does she do when [situation the child established]?" | Task | `A4-C81` |
| **Self-check invitation** | "Want to read it as if you'd never met him?" | Self-regulation | `A4-C40`, `A4-C41` (self ES 0.62) |
| **Handoff** | "Want to show this to someone?" | Self-regulation | `A4-C41` (adult ES 0.87) |
| **Contrast set** | "*Brave* means X, *reckless* means Y — which is she?" | Task | `A4-C99`, `A4-C101` |
| **Availability note** | "The word ideas are here if you want them." | — | `A4-C53` |

### E.2.3 — The NEVER-SAY list (normative — implement as an output filter)

Reproduced from Rule A9.3 for implementation reference. **This list is a filter on generated output, not a prompt instruction.** Prompt instructions are not enforcement.

1. **Trait attribution to the child.** Any sentence whose subject is the child and predicate is a stable characteristic. ("You're creative/smart/talented/a natural writer/good at this.") — `A4-C40`, `A4-C42`
2. **Evaluative verdicts on the work.** ("Great character!" "Amazing!" "Perfect!" "I love this!" "This is really good.") — `A4-C39`, `A4-C40`
3. **Cross-work or cross-child comparison.** ("Better than last time." "Most kids your age…") — `A4-C39`, `A4-C42`
4. **Scores, grades, stars, ratings, percentiles, levels, or leaderboards on creative work.** — `A4-C39`, `A4-C41`, `A4-C48`
5. **Deficit or category language.** ("You seem to be struggling." "Since this is hard for you…") — `A4-C126`, `A4-C127`, `A4-C132`
6. **Authorship claims or erosions.** ("I made this for you." "I fixed that." "I improved this." "Here's your character.") — `A4-C71`, `A4-C72`
7. **Pressure, urgency, guilt.** ("You haven't written anything." "Don't give up!" "You're almost there!") — `A4-C04` (frustration control)
8. **Unrequested correction of language variety or dialect.** — `A4-C126`, `A4-C127`
9. **Growth-mindset slogans stated as fact.** ("Your brain grows when you struggle!") — `A4-C44`
10. **Claims to know the child's mind.** ("I know what you mean." "You must be feeling…") — `A4-C74`
11. **Suggested character content** — traits, names, motivations, backstory, dialogue, descriptions offered as accept-able content. — `A4-C68`, `A4-C69`, `A4-C70`
12. **Any statement implying the child's character is incomplete, wrong, or not yet good enough.** — `A4-C53`, `A4-C39`

### E.2.4 — Phrasing that preserves authorship

`A4-C71`, `A4-C72`, `A4-C74`. Every tool utterance must satisfy all four:

1. **Provisional** — "one thing I noticed," "you decide," "that's just one idea."
2. **Non-possessive** — the tool never refers to the character as anything but the child's.
3. **Returning control** — every utterance ends in the child's hands, ideally with a question.
4. **Not pasteable** — nothing the tool says should be usable verbatim as the child's character content. If an utterance could be copied into the character, it is a suggestion, and suggestions of content are blocked.

### E.2.5 — Timing

`A4-C45` (evidence does not favour immediate or delayed), `A4-C32` (interruption costs composition capacity), `A4-C120` (children type slowly).

```
DEFAULT: feedback offered only when the child signals a pause point
         ("I'm done with this bit" / navigates away deliberately /
          explicitly asks)
NEVER:   mid-sentence, mid-word, or on a typing-pause timer
CHILD:   may set "tell me as I go" — but this is opt-in, off by default
```
**DESIGN DECISION**, since the research is genuinely equivocal on timing.

---

## E.3 — THE ANTI-OVER-SCAFFOLDING BUDGET

`A4-C60`, `A4-C61`, `A4-C63`, `A4-C64`, `A4-C68`, `A4-C71`, `A4-C72`. **The *existence* of a budget is research-motivated. Every *number* in it is a `DESIGN DECISION`.**

### E.3.1 — Hard caps

| Budget item | Cap | Basis |
|---|---|---|
| **Unrequested offers per character** | **3** total, across all four dimensions | `A4-C60`, `A4-C53` |
| **Unrequested offers per session** | **5** total | `A4-C60` |
| **Consecutive unrequested offers with no intervening child content** | **1** — the tool may not offer twice in a row without the child producing something | `A4-C60`, `A4-C63` |
| **Example characters shown per creation step** | **1** | `A4-C18` |
| **Example characters per session** | **3** | `A4-C18` |
| **Words shown per vocabulary request** | **3–5** | `A4-C101` |
| **Vocabulary words shown per character** | **~15** soft cap | `A4-C91`, `A4-C101` |
| **Starters offered at once** | **2–3, deliberately divergent** | `A4-C18`, `A4-C68` |
| **Active tool-supplied constraints per character** | **1** | `A4-C58` |
| **Hint ladder depth before mode change** | **4 rungs, ending in a non-content rung** | `A4-C61`, `A4-C63` |
| **Tool-generated text auto-inserted into the child's character** | **0. Always. No exception.** | `A4-C68`, `A4-C70`, `A4-C71`, `A4-C72` |

### E.3.2 — The authorship ratio

```
tool_origin_ratio = (characters of text originating as tool output
                     and never rewritten by the child)
                    ÷ (total characters in the character)

IF tool_origin_ratio > THRESHOLD          [DESIGN DECISION: start at 0.25]
THEN prompt ONCE, non-judgmentally, to put it in the child's own words
     before the character can be shared or published
AND  the prompt must never use the never-say list forms

IF tool_origin_ratio > 0 at share time
THEN the share view must visually distinguish tool-origin text
     (Basis: A4-C71, A4-C72 — ownership tracks the child's own contribution)
```

### E.3.3 — Dependence telemetry (required before launch)

`A4-C63`, `A4-C60`. These metrics must exist at launch, not be added after a problem appears.

| Metric | Watch for |
|---|---|
| Hint requests per session, per child, over time | Rising trend = dependence forming |
| Time from offer shown → next child-authored keystroke | Falling toward zero = accept-without-thinking |
| Rate of "accept" with zero subsequent edits | High = substitution, not scaffolding |
| Proportion of characters with `tool_origin_ratio > 0.25` | Rising = the tool is writing |
| Ratio of self-authored to tool-originated tokens, per child, over time | Falling = the core failure |
| **Inter-character semantic similarity within cohort, over time** | **Rising = homogenization (`A4-C68`) — treat as a launch-blocking metric** |
| Session abandonment immediately after an unrequested offer | Rising = the offers are intrusive |

### E.3.4 — The escape hatch that is not more help

Rule A13.4, `A4-C63`. When a child requests help repeatedly with no intervening self-authored content, the tool **must stop helping and change the situation**:

```
IF help_requests >= 3 within a window        [DESIGN DECISION: one work session]
   AND self_authored_content_since_first_request == 0
THEN stop offering hints entirely for this character
     AND offer, in the child's own choice:
       - switch to drawing this character instead
       - start a different character
       - take a break / come back later
       - show this to a person
     AND never characterize the child's situation while doing so
```

---

## E.4 — VOCABULARY SUPPORT RULES (consolidated)

| Rule | Specification | Claims |
|---|---|---|
| **V1** | Vocabulary support is **pull only** — child-initiated, never triggered by scanning the child's text | `A4-C70`, `A4-C91` |
| **V2** | **No one-tap replace.** The child retypes the word they choose. | `A4-C101`, `A4-C71` |
| **V3** | Show **contrast sets with explained differences**, not synonym lists | `A4-C92`, `A4-C99`, `A4-C101` |
| **V4** | **3–5 words** per request; ~15 per character | `A4-C58`, `A4-C63` |
| **V5** | Every word shown comes with **meaning + an example in a sentence** — never a bare list | `A4-C92`, `A4-C101` |
| **V6** | Emotion vocabulary follows the developmental order as a **prior**, overridden instantly by observed use | `A4-C96`, `A4-C97` |
| **V7** | **Never score, flag, or comment on the child's own word choices** | `A4-C39`, `A4-C104`, `A4-C127` |
| **V8** | Word-frequency/AoA data may order what is *offered*; never judge what was *written* | `A4-C104`, `A4-C105`, `A4-C106` |
| **V9** | **Character voice is exempt** — no vocabulary affordance applies to dialogue the child marks as their character speaking | `A4-C126`, `A4-C127` |
| **V10** | **Stay out entirely** when: the child is drafting; the child has declined twice; the child is writing dialogue; the child is writing in a language or variety other than the interface language | `A4-C53`, `A4-C126` |
| **V11** | Word **prediction** (completing a started word) is allowed; word **suggestion** (proposing an unstarted word) is not | `A4-C117`, `A4-C101` |
| **V12** | Internal claim discipline: "helps children learn words," **not** "improves reading" | `A4-C94` (d = 0.10 standardized) |

---

## E.5 — DIFFERENTIATION RULES: opt-in, non-labelling (consolidated)

| Rule | Specification | Claims |
|---|---|---|
| **D-1** | **Every support feature is available to every child at all times.** Support intensity varies only in what is *offered proactively*. | `A4-C107`, `A4-C132`, Rule D.1 |
| **D-2** | **No visible level, badge, mode, colour, or copy** denotes support. Not to the child, not to peers, not as a category to adults. | `A4-C126`, `A4-C127`, Rule A9.3 |
| **D-3** | Features are named by **what they do**, never by **who they're for**. "Type by talking," not "for kids who find typing hard." | Rule D.1 |
| **D-4** | The child may **raise or lower** any dimension at any time, and the child's choice always wins over the model. | `A4-C53`, `A4-C55` |
| **D-5** | **No learning-styles anything.** No modality quiz, no "your learning style," no modality-matched content. | `A4-C108` |
| **D-6** | Support dimensions are **independent**; never collapse to one level. | `A4-C132` |
| **D-7** | Adult-facing views show **observed behaviour**, never inferred categories. "Used voice input for most of this" ✅ / "May have writing difficulties" ❌ | `A4-C127`, `A4-C132` |
| **D-8** | **No ceiling.** No length caps, forced steps, or imposed completion for advanced writers. | `A4-C131`, `A4-C132` |
| **D-9** | UDL used as a **design checklist**, never as an evidence claim. | `A4-C109` |
| **D-10** | Two children using the tool side by side must see **the same product**, differing only in what each has chosen to turn on. | `A4-C126`, `A4-C127` |

---

## E.6 — ACCESSIBILITY REQUIREMENTS (consolidated)

**Input modality alternatives** — all available to all children, no setup, no permission: typing · speech-to-text (with confirm-before-commit, `A4-C116`) · handwriting/stylus where supported · drawing/visual as first-class composition · untranscribed voice notes · selecting from the child's own prior words · dictating to a person.

**Transcription burden reduction** — `A4-C32`, `A4-C113`, `A4-C120`: word prediction (completion only, toggleable) · no timeouts calibrated to adult typing speed · autosave with no data loss ever · **Redundant Entry** — never re-type anything already entered · no spelling requirement to progress · no penalty of any kind for misspelling in creative text.

**Output** — `A4-C118`, `A4-C136`: text-to-speech on everything, framed as "hear it" · interface text well below the youngest supported reader's level · every text instruction also available as audio · user control of font size, line spacing, letter spacing, contrast, background colour · **no "dyslexia font" defaulted or framed as accessibility** (`A4-C119`).

**Interaction** — `A4-C133`, `A4-C134`: WCAG 2.2 AA minimum · targets ≥ 24 × 24 CSS px · **single-pointer alternative for every drag** · visible focus ≥ 3:1 contrast, not obscured · full keyboard operability · screen-reader operability with meaningful labels for every visual character element · Consistent Help placement · Accessible Authentication (no puzzles/object recognition/transcription) · reduced motion and reduced distraction settings · familiar patterns, predictable navigation.

**Cognitive load** — `A4-C121`, `A4-C122`, `A4-C134`: one decision visible at a time, rest collapsible · externalized plan visible on screen · state persists across interruption · non-linear entry · minimal simultaneous demands.

**Institutional** — `A4-C135`: adult-facing documentation of available supports for IEP consideration · data exportable for use with a child's own AT · **no accommodation concept ever visible to the child**.

---

## E.7 — WHAT THE TOOL MUST NOT DO, IN THE NAME OF HELP

This is the explicit prohibition list. Every item is something a well-meaning team will propose.

1. **It must not write the child's character, or any part of it.** Not a trait, not a name, not a motivation, not a backstory, not a line of dialogue, not a description — not even as a "starting point" the child can edit. `A4-C68`, `A4-C70`, `A4-C71`, `A4-C72`
2. **It must not suggest what a person is like.** Suggesting traits makes the tool an opinionated model of human personality whose opinions users adopt without noticing. `A4-C70`
3. **It must not rewrite, "improve," polish, or auto-correct the child's creative text.** `A4-C35`, `A4-C71`, `A4-C72`
4. **It must not evaluate, score, rate, grade, or rank the child's character.** `A4-C39`, `A4-C41`, `A4-C48`
5. **It must not praise the child as a person.** `A4-C40`, `A4-C42`
6. **It must not compare the child to other children, or to their own earlier work.** `A4-C39`, `A4-C42`
7. **It must not label, categorize, or diagnose the child** — visibly, inferably, or in adult-facing views. `A4-C126`, `A4-C127`, `A4-C132`
8. **It must not treat a non-mainstream narrative style or language variety as an error.** `A4-C126`, `A4-C127`
9. **It must not measure children's writing with readability formulas.** They fail worst on exactly this text type. `A4-C104`, `A4-C105`
10. **It must not speak unprompted on a timer, an idle detector, or a schedule.** `A4-C05`, `A4-C39`
11. **It must not make the child's work feel incomplete.** No completion meters on creative fields, no "you still need to…", no imposed done-state. `A4-C53`
12. **It must not gamify creative output.** No streaks, points, badges or levels attached to characters. `A4-C40`, `A4-C42`, `A4-C53`
13. **It must not implement learning styles.** `A4-C108`
14. **It must not ship isolated grammar instruction as a writing-improvement feature.** It is the one practice with a *negative* effect on writing quality. `A4-C28`
15. **It must not make voice the only path to anything.** ASR fails children at 2–5× adult rates and worst for the youngest. `A4-C116`
16. **It must not present its own feedback as authoritative.** Trained humans beat AI on 4 of 5 feedback criteria, and children over-trust machines. `A4-C46`, `A4-C74`
17. **It must not withhold support a child explicitly asks for and uses productively.** The anti-over-scaffolding budget constrains *unrequested* help and *content substitution* only. `A4-C62`
18. **It must not overclaim.** No empathy, theory-of-mind, perspective-taking, reading-comprehension, critical-thinking or transfer claims. `A4-C86`, `A4-C87`, `A4-C88`
19. **It must not claim AI writing tools are proven harmful to children either.** That evidence does not exist at the strength the headlines imply. `A4-C64`, `A4-C65`
20. **It must not use the phrase "personalized learning" to describe routing children into different experiences.** The K-12 evidence is inconclusive and the labelling risk is real. `A4-C110`, `A4-C127`

---
---

# CLOSING SECTIONS

## Limitations and disagreements in the evidence base

**1. Everything here is search-result-level.** No full text was read. Every number is `[SNIPPET]`. This is the dominant limitation and it applies to all 137 claims.

**2. Writing-instruction effect sizes are actively mis-cited in the wild, and I caught it happening.** Three headline SRSD/strategy figures attributed to the same 2012 citation (`A4-C21`); two peer-feedback figures for overlapping literatures (`A4-C41`, `A4-C49`); a differentiation range reported backwards with an outlier removed (`A4-C107`); a UDL aggregate effect of 3.56 that cannot be a real instructional effect size (`A4-C109`); a mentor-text figure of +0.76 and a process-goal figure of +2.03 from a practitioner synthesis with untraceable provenance (`A4-C16`, `A4-C31`). **The scale of the mis-citation problem in this literature is itself a finding.**

**3. Differentiation is much weaker than its adoption implies.** Twelve unique studies for secondary within-class differentiation over a decade, inconsistently operationalized, with the reviewers themselves calling for more research (`A4-C107`). Character Studio should not present differentiation as settled science.

**4. UDL's evidence has been formally challenged, including CAST's own citations.** Boysen (2024) found most cited studies did not offer choice or measure learning, and none related to brain function (`A4-C109`). This is a serious challenge to a framework often treated as foundational. It does not mean UDL's *design ideas* are bad — a multiple-means checklist is sensible — but it means "UDL-aligned" is not an evidence claim.

**5. The AI-writing-assistance literature for children is genuinely immature, and I want to be blunt about it.** The single most on-target study I found (`A4-C67`, 40 children, grades 2–6, the floor-raiser/ceiling-limiter finding) is an arXiv preprint. The most-publicized cautionary study (`A4-C65`, "Your Brain on ChatGPT") is a preprint with 54 adults dropping to 18, on an essay task. The homogenization findings (`A4-C68`, `A4-C69`) and the opinion-shift finding (`A4-C70`) are stronger — peer-reviewed, larger samples — but **adult**. **We are extrapolating adult findings to children and preprint findings to production.** The direction of the extrapolation is conservative (restrict suggestions, preserve authorship), which is the right way to be wrong, but it is still extrapolation.

**6. Direct disagreements I found and did not resolve:**
- **Cognitive offloading** helps or harms depending on the study (`A4-C64`). Deliberately offloading *lower-order* tasks improved critical thinking in some 2025 work; "metacognitive laziness" is documented in others.
- **Process vs. person praise** failed to replicate with 9–13 year-olds in China (`A4-C43`), raising both replication and cultural-moderation questions about a finding this document leans on.
- **Growth mindset** is near-null in the best-designed studies (`A4-C44`) despite enormous adoption.
- **Bidirectionality of reading–writing** is asserted by models but "empirical evidence on bidirectionality is mixed" (`A4-C78`).
- **6+1 Trait Writing**: not meaningfully effective in the grades 1–8 formative-assessment meta-analysis (`A4-C41`); statistically significant gains in a 74-school REL study (`A4-C48`); "not adequately studied experimentally" per another source.
- **Dysgraphia prevalence** spans 5%–30% across retrieved sources (`A4-C114`).
- **Fiction and theory of mind** is an unresolved replication dispute (`A4-C87`).

**7. Practice-consensus areas with no located effect size:** sentence frames/starters (`A4-C23`), think-alouds in isolation (`A4-C14`), gradual release of responsibility as a whole (`A4-C08`), character-trait vocabulary instruction (`A4-C99`), the three-tier vocabulary taxonomy itself (`A4-C93`), optimal constraint level for children's narrative creativity (`A4-C59`), and writing conferences with young primary writers (`A4-C38`, by its own literature's admission).

**8. Grade-band skew.** The writing-to-reading-comprehension evidence is 81% grade 6+ (`A4-C76`). AWE research is 82.4% tertiary with only 15 K-12 studies (`A4-C47`). Peer-feedback effect sizes lean on higher-education and L2 samples (`A4-C50`). Constraint-and-creativity research is largely adult and non-narrative (`A4-C59`). **B1 and B2 — half of Character Studio's core band — are the thinnest-evidenced.**

## Cultural assumptions embedded in this research

**1. The narrative norm is topic-centered and Anglo-American.** Michaels's work (`A4-C126`) shows this is not a neutral standard: topic-associating narratives were read as "ill formed" by teachers, and the teacher could scaffold one style and not the other. Any structure Character Studio embeds — including story grammar, which is the DLD-supported intervention (`A4-C112`) — carries this assumption. **Story grammar is evidence-based *and* culturally particular. Both are true.**

**2. Written Standard American English is treated as the unmarked case.** `A4-C127` measures the cost: AAE features graded more harshly than ESL or SAE errors; an 8-point rating gap by teacher race.

**3. Autism research is written predominantly in deficit terms**, and the retrieved cross-cultural finding (`A4-C124`) shows part of the measured "deficit" is an artifact of which narrative evaluation style counts as normal — Mandarin-speaking autistic children showed no difference from controls on evaluation terms, consistent with generally lower narrative evaluation in Asian cultural backgrounds. Several searches in this area returned commercial therapy-provider marketing rather than research.

**4. Praise research may not generalize.** The process/person praise finding failed to replicate with children in China (`A4-C43`). Individualist assumptions about self-esteem and effort attribution are baked into this literature.

**5. AI writing assistance pulls toward American English and American cultural framing** — measured, not hypothesized (`A4-C69`). For a platform with any international reach, this is a first-order product risk, not a footnote.

**6. Vocabulary-growth estimates assume a particular language environment**, and the "vocabulary gap" framing carries known deficit assumptions about children's homes. The estimates themselves disagree by more than 2× (`A4-C89`).

**7. Speech recognition encodes whose voices were in the training data** (`A4-C116`). Children already fare 2–5× worse than adults; children whose speech varies further from the training distribution fare worse still.

**8. Nearly every effect size in this document comes from formal schooling in high-income countries**, mostly the US, mostly in English.

**9. "Character" itself is culturally loaded.** The individualist, psychologically-interior, wants-and-flaws model of character embedded in Common Core's RL.x.3 and W.x.3 (`A4-C84`, `A4-C85`) is one tradition of storytelling among many.

## Accessibility considerations summary

- **Transcription relief is the highest-value, best-evidenced accessibility investment**, and it benefits every child, not only identified ones (`A4-C32`, `A4-C113`, `A4-C120`).
- **Speech-to-text is not an equivalent accommodation for young children** at 15–35% WER for ages 4–10 (`A4-C116`). Confirm before commit; never voice-gate anything; support untranscribed voice.
- **Text-to-speech is required output and doubles as a revision tool** (`A4-C118`).
- **Do not ship a "dyslexia font"** — no reliable benefit, one study found harm (`A4-C119`). Ship user-controllable typography instead.
- **Word prediction (completion) is supported; word suggestion is not** (`A4-C117`).
- **Planning is where ADHD-related difficulty concentrates** — externalize, chunk, persist, make optional (`A4-C121`, `A4-C122`).
- **Explicit, consistent, repeated narrative structure is the DLD-supported form** — offered, never imposed (`A4-C112`).
- **WCAG 2.2 AA is the floor**, with drag alternatives and target size especially relevant to a canvas-based character builder (`A4-C133`); COGA for cognitive accessibility (`A4-C134`).
- **Interface text is itself an accessibility barrier for children** (`A4-C136`).
- **Non-visual creative-tool accessibility is an immature research area** (`A4-C137`) — Character Studio must not assume solved patterns exist.
- **Never label. Ever.** Support without stigma is the governing constraint (`A4-C126`, `A4-C127`, `A4-C132`).

## Populations underrepresented in the evidence

- **Grades 2–5 (B1–B2)** in the writing-to-reading, AWE and AI-assistance literatures.
- **Children generally** in the AI writing-assistance literature — the strongest findings (homogenization, opinion shift, ownership loss) are adult.
- **Autistic children** — a retrieved scoping review found **only 12% of ASD narrative studies had more than 40 autistic participants** (`A4-C124`).
- **Autistic girls and non-binary autistic children** — the retrieved "blended phenotype" work on girls' storytelling suggests the base literature is male-skewed.
- **Multilingual children in the AI-assistance literature.** `A4-C130` is a single reassuring data point (feedback did not vary by language status); it is not a literature.
- **Speakers of AAE and other English varieties** as *authors* rather than as *subjects of assessment-bias studies*.
- **Twice-exceptional children** — identified by the literature itself as systematically missed (`A4-C132`).
- **Children with severe/multiple disabilities, and non-speaking children**, in creative-writing research specifically.
- **Blind and low-vision children in creative authoring tools** (`A4-C137`).
- **Children outside high-income Anglophone schooling** — nearly absent from every effect size in this document.
- **Children with speech sound disorders** in ASR-dependent designs — a compounding disadvantage on top of `A4-C116`.
- **K–1 (B0)** in almost all writing-instruction meta-analyses.

## Open questions

1. **What is the actual homogenization rate for children's creative work under AI assistance, and does it compound over months?** `A4-C67` and `A4-C68` measure single sessions. Nobody has measured a year.
2. **Does the floor-raise/ceiling-limit pattern (`A4-C67`) replicate outside a preprint, and does it persist after assistance is withdrawn?**
3. **Does the opinion-adoption effect (`A4-C70`) hold for children — and is it larger, given documented over-trust (`A4-C74`)?** I would expect larger. Nobody has measured it.
4. **What is the right authorship ratio threshold?** E.3.2 starts at 0.25. That is invented.
5. **Can a tool teach a strategy children carry away, in the SRSD sense, without ever supplying content?** This is Character Studio's central bet and it is untested.
6. **Do the fading rules in E.1.5 actually fade, or do children plateau?** Requires longitudinal instrumentation.
7. **What actually predicts a child's need for support, if not age, word count, typing speed, or spelling?** E.1.7 rules out the easy signals for good reasons and leaves a real problem.
8. **Does character-trait and emotion vocabulary work in a creative tool transfer to anything?** `A4-C94` predicts custom-measure gains and near-zero standardized transfer.
9. **How should a tool support topic-associating and other non-mainstream narrative structures *positively*, rather than merely not penalizing them?** The literature diagnoses the problem; I found no product answer.
10. **How much does confirm-before-commit ASR (Rule D.4) cost in flow for a child at 5–9 WPM who chose voice precisely to avoid typing?** This is a real tension between accuracy and access.
11. **Is there any level of tool-supplied creative content that is safe?** This document says zero. That is a conservative reading of adult evidence, and it is falsifiable.
12. **What does over-scaffolding look like *quantitatively* in children's writing?** `A4-C60` is professional consensus with rich description and no numbers.
13. **Does the B3 self-efficacy dip (`A4-C56`) respond to reduced evaluative surface, as Rule A11.3 assumes?** Assumed, not tested.
14. **Do the differentiation rules (E.5) actually prevent children from inferring their support level from each other's screens?** Children are good at noticing.

---

## SOURCE LIST — only sources actually retrieved this session

Retrieval was at search-result level only (titles, URLs, and search-tool synthesis of page content); no full text was read. Grouped by role.

### Scaffolding foundations and fading
- [Wood, Bruner & Ross 1976, "The Role of Tutoring in Problem Solving" (PDF)](https://sachafund.wordpress.com/wp-content/uploads/2018/10/wood_et_al-1976-journal_of_child_psychology_and_psychiatry.pdf) — original scaffolding definition and six functions (`A4-C04`)
- [Wiley record for Wood et al. 1976](https://acamh.onlinelibrary.wiley.com/doi/10.1111/j.1469-7610.1976.tb00381.x) — bibliographic confirmation
- [Article summary of Wood et al. 1976](https://laurenmarg.com/2018/12/09/article-summary-wood-et-al-1976-role-of-tutoring-in-problem-solving/) — six functions detail
- [van de Pol, Volman & Beishuizen 2010, *Educational Psychology Review* (Springer)](https://link.springer.com/article/10.1007/s10648-010-9127-6) — contingency/fading/transfer (`A4-C05`)
- [ERIC EJ924182, same paper](https://eric.ed.gov/?id=EJ924182) — scope confirmation
- [Simply Psychology, ZPD](https://www.simplypsychology.org/zone-of-proximal-development.html) — ZPD critiques and dependence risk (`A4-C01`, `A4-C02`, `A4-C06`)
- [ScienceDirect ZPD topic page](https://www.sciencedirect.com/topics/psychology/zone-of-proximal-development) — measurement critique
- ["Scaffolding and the ZPD: A problematic relationship"](https://www.academia.edu/108616074/Scaffolding_and_the_zone_of_proximal_development_A_problematic_relationship) — conflation critique (`A4-C03`)
- [Pearson GRR PDF](https://www.researchgate.net/profile/P-Pearson/publication/364236124_Gradual_Release_of_Responsibility_Instructional_Model/links/6679f5591846ca33b84fa007/Gradual-Release-of-Responsibility-Instructional-Model.pdf?origin=scientificContributions) — GRR phases (`A4-C07`)
- ["The Genesis of the Gradual Release of Responsibility Model"](https://www.researchgate.net/publication/345618608_The_Genesis_of_the_Gradual_Release_of_Responsibility_Model) — GRR origins
- [Webb et al. 2019, *The Reading Teacher* (Wiley)](https://ila.onlinelibrary.wiley.com/doi/abs/10.1002/trtr.1799) — 35 years of GRR; scarcity of evaluation (`A4-C08`)
- [Kalyuga et al., "The Expertise Reversal Effect," *Educational Psychologist* 38(1)](https://www.tandfonline.com/doi/abs/10.1207/S15326985EP3801_4) — expertise reversal (`A4-C09`, `A4-C15`)
- [Springer, expertise reversal special issue introduction](https://link.springer.com/article/10.1007/s11251-009-9102-0) — instructional implications
- [Chartered College, expertise reversal](https://my.chartered.college/impact_article/expertise-reversal-effect-and-its-instructional-implications/) — practitioner summary
- [Renkl et al., fading worked-out solution steps](https://www.researchgate.net/publication/2398854_From_Studying_Examples_to_Solving_Problems_Fading_Worked-Out_Solution_Steps_Helps_Learning) — fading mechanism (`A4-C10`)
- [Sweller, "The Guidance Fading Effect" (PDF)](https://cogscisci.wordpress.com/wp-content/uploads/2019/08/sweller-guidance-fading.pdf) — guidance fading
- [Springer, "How Fading Worked Solution Steps Works"](https://link.springer.com/article/10.1023/B:TRUC.0000021815.74806.f6) — cognitive load account
- [Springer, "Probability Based Scaffolding System with Fading"](https://link.springer.com/chapter/10.1007/978-3-319-19773-9_49) — automated fading mechanism (`A4-C11`)
- [arXiv, "Agentic AI and Pedagogical Best Practice"](https://arxiv.org/pdf/2606.04543) — AI fading failure, preprint (`A4-C11`)
- [arXiv, Evidence-Decision-Feedback adaptive scaffolding](https://arxiv.org/pdf/2602.01415) — adaptive scaffolding framework, preprint

### Writing instruction meta-analyses and practice guides
- [ERIC EJ994038 — Graham, McKeown, Kiuhara & Harris 2012](https://eric.ed.gov/?id=EJ994038) — elementary writing meta-analysis (`A4-C21`, `A4-C28`)
- [Semantic Scholar record, same](https://www.semanticscholar.org/paper/A-Meta-Analysis-of-Writing-Instruction-for-Students-Graham-McKeown/e974a61f7f041884911889b217323f77107ab838) — effect size cross-check
- [Writing Next PDF (Carnegie)](https://media.carnegie.org/filer_public/3c/f5/3cf58727-34f4-4140-a014-723a00ac56f7/ccny_report_2007_writing.pdf) — 11 elements (`A4-C30`)
- [AdLit, summary of Writing Next](https://www.adlit.org/topics/writing/summary-writing-next) — element list
- [LINCS/TEAL research-based writing fact sheet](https://lincs.ed.gov/federal-initiatives/teal/guide/researchbasedwriting) — element list
- ["A meta-analysis of writing instruction for adolescent students"](https://www.academia.edu/113543898/A_meta_analysis_of_writing_instruction_for_adolescent_students) — grammar −0.32 (`A4-C28`)
- ["A meta-analysis of writing instruction for students in the elementary grades"](https://www.academia.edu/96478546/A_meta_analysis_of_writing_instruction_for_students_in_the_elementary_grades) — grammar −0.41
- [IES blog on SRSD](https://ies.ed.gov/learn/blog/improving-academic-achievement-through-instruction-self-regulated-strategy-development-science) — SRSD science (`A4-C21`)
- [SRSD Online research page](https://srsdonline.org/research/) — SRSD effect size range, genre/population breadth (`A4-C21`, `A4-C26`)
- [Springer, SRSD for English writing, last decade](https://link.springer.com/article/10.1007/s11145-022-10297-z) — outcome-type moderation (`A4-C26`)
- [Springer, long-term effects of SRSD in elementary children](https://link.springer.com/article/10.1007/s11145-025-10721-0) — record only
- [WWC practice guide 17](https://ies.ed.gov/ncee/wwc/practiceguide/17) — IES elementary writing guide (`A4-C29`)
- [ERIC ED533112, same guide](https://eric.ed.gov/?id=ED533112) — recommendations
- [TTAC Online summary of the guide](https://ttaconline.org/Resource/JWHaEa5BS750Jqr66HsB3w/Resource-ies-practice-guide-teaching-elementary-school-students-to-be-effective-writers-2012-wwc---what) — evidence-rating structure
- [ERIC EJ1303499, expert and coping models in writing instruction](https://files.eric.ed.gov/fulltext/EJ1303499.pdf) — coping models, SRSD expert→novice (`A4-C12`, `A4-C27`)
- [Reading Rockets, Think-alouds](https://www.readingrockets.org/classroom/classroom-strategies/think-alouds) — think-aloud practice (`A4-C12`)
- [Shanahan on modeling](https://www.readingrockets.org/blogs/shanahan-on-literacy/does-modeling-have-place-high-quality-literacy-teaching) — modeling quality varies (`A4-C13`)
- [AERO practice guide, sentence combining](https://www.edresearch.edu.au/guides-resources/practice-guides/sentence-combining) — sentence combining effects (`A4-C25`)
- [UVA intensive intervention guide, sentence combining](https://literacy.virginia.edu/sites/g/files/jsddwu1006/files/2022-05/Explicit-Instruction-in-Sentence-Combining.pdf) — effect sizes
- [Springer, sentence-combining RTI intervention](https://link.springer.com/article/10.1007/s11145-021-10135-8) — struggling writers
- [Writing For Pleasure Centre, teaching the writing processes](https://writing4pleasure.com/2025/10/08/teaching-the-writing-processes-to-children/) — mentor text figures, **secondary** (`A4-C16`)
- [Writing For Pleasure, Reading In The Writing Classroom preview](https://writing4pleasure.com/wp-content/uploads/2023/03/Reading-In-The-Writing-Classroom-PREVIEW.pdf) — mentor texts
- [Writing For Pleasure, what is a WfP pedagogy](https://writing4pleasure.com/2022/09/15/what-is-a-writing-for-pleasure-pedagogy/) — 43 literature reviews, 14 principles (`A4-C17`)
- [Schools Week review of Young & Ferguson](https://schoolsweek.co.uk/book-review-writing-for-pleasure-by-young-and-ferguson/) — independent characterization
- [Writing For Pleasure Handbook of Research 2025 PDF](https://writing4pleasure.com/wp-content/uploads/2025/01/The-WfPs-Handbook-Of-Research-On-Teaching-Young-Writers-2025.pdf) — synthesis scope
- [Writing For Pleasure, process goals](https://writing4pleasure.com/2023/04/03/trust-the-process-setting-process-goals/) — +2.03 figure, flagged unusable (`A4-C31`)
- [OhioLINK dissertation, goal setting in writing](https://etd.ohiolink.edu/acprod/odb_etd/ws/send_file/send?accession=kent1395826954&disposition=inline) — goal-setting operationalization (`A4-C31`)
- [ERIC ED589978, student goal setting](https://files.eric.ed.gov/fulltext/ED589978.pdf) — SMART goals
- [Savvas research recap on effective writing strategies](https://www.savvas.com/resource-center/blogs-and-podcasts/savvas-insights/science-of-reading-research-recap/a-study-on-most-effective-writing-strategies) — peer assistance 0.89; conflicting figure (`A4-C41`, `A4-C49`, `A4-C51`)
- [Springer, argumentation in collaboration](https://link.springer.com/article/10.1007/s11145-023-10439-x) — explicit instruction + collaboration (`A4-C51`)
- [Graham, revised Writer(s)-Within-Community model (T&F)](https://www.tandfonline.com/doi/abs/10.1080/00461520.2018.1481406) — sociocultural writing model (`A4-C52`)
- [ResearchGate record, same](https://www.researchgate.net/publication/328082076_A_Revised_Writers-Within-Community_Model_of_Writing) — model components

### Writing process, transcription, revision, planning
- [PMC9470714, process-disruption hypothesis](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9470714/) — spelling/typing skill and composition (`A4-C32`)
- [ScienceDirect, transcription–writing link in middle grades](https://www.sciencedirect.com/science/article/abs/pii/S104160801630262X) — handwriting fluency and spelling accuracy
- [PMC3474373, handwriting and spelling in kindergarten written expression](https://pmc.ncbi.nlm.nih.gov/articles/PMC3474373/) — early transcription contribution
- [Kim, DIEW pathways, *Reading and Writing* (Springer)](https://link.springer.com/article/10.1007/s11145-018-9913-y) — DIEW (`A4-C33`)
- [Kim et al., Expanding DIEW, *JEP* (APA PDF)](https://www.apa.org/pubs/journals/features/edu-edu0000564.pdf) — grade-specific pathways (`A4-C33`, `A4-C79`)
- [ERIC EJ1325053, Expanding DIEW](https://eric.ed.gov/?id=EJ1325053&pg=27&q=writing+skills%3A+a+cross+as+class+as+year+index) — bibliographic
- [ResearchGate, text revision from 3rd to 5th grades](https://www.researchgate.net/publication/12026298_How_to_make_it_easier_for_children_to_revise_their_writing_A_study_of_text_revision_from_3rd_to_5th_grades) — surface vs meaning revision (`A4-C34`, `A4-C36`)
- [ERIC EJ1047458, *Learning Disabilities: A Contemporary Journal* 12(2)](https://files.eric.ed.gov/fulltext/EJ1047458.pdf) — revision barriers (`A4-C34`, `A4-C35`)
- [ResearchGate, revision with struggling writers](https://www.researchgate.net/publication/284867588_Insights_from_Instructional_Research_on_Revision_with_Struggling_Writers) — named barriers (`A4-C35`)
- [ERIC EJ1094945, first graders constructing meaning through drawing and writing](https://files.eric.ed.gov/fulltext/EJ1094945.pdf) — drawing supports writing (`A4-C37`)
- [T&F, intermodality in early school compositions](https://www.tandfonline.com/doi/full/10.1080/20004508.2025.2479317?af=R) — multimodal composition
- [ResearchGate, drawing as a pre-writing strategy](https://www.researchgate.net/publication/263173481_Children's_use_of_drawing_as_a_pre-writing_strategy) — pre-writing drawing
- [Springer ECEJ, conferencing as catalyst](https://link.springer.com/article/10.1007/s10643-024-01778-7) — conferencing, evidence gap (`A4-C38`)
- [REL West, K–6 writing conferences](https://ies.ed.gov/ncee/edlabs/regions/west/Ask/Details/4) — instructional practices
- [T&F, graphic organizers meta-analysis for students with disabilities](https://www.tandfonline.com/doi/full/10.1080/09362835.2024.2389080) — 47 studies (`A4-C20`)
- [Springer, graphic organizer + storytelling, third graders](https://link.springer.com/article/10.1007/s10212-024-00908-4) — story writing quality
- [Bogaerds-Hazenberg et al., *RRQ*, text structure instruction](https://ila.onlinelibrary.wiley.com/doi/10.1002/rrq.311) — active construction moderator (`A4-C20b`)
- [Colorín Colorado, sentence frames and starters](https://www.colorincolorado.org/teaching-ells/ell-classroom-strategy-library/sentence-frames) — frames practice, differentiation (`A4-C22`, `A4-C24`)
- [Bell Foundation, speaking and writing frames](https://www.bell-foundation.org.uk/resources/great-ideas/speaking-and-writing-frames/) — writing frames
- [Achieve the Core, ELL supports for writing and discussion](https://achievethecore.org/content/upload/ELL%20Supports%20for%20Writing%20and%20Discussion.pdf) — scaffolds
- [LINCS/TEAL, make use of frames](https://lincs.ed.gov/state-resources/federal-initiatives/teal/guide/makeuse) — frames

### Feedback, praise, motivation
- [Kluger & DeNisi 1996 PDF](https://mrbartonmaths.com/resourcesnew/8.%20Research/Marking%20and%20Feedback/The%20effects%20of%20feedback%20interventions.pdf) — 607 ES, one-third harmful (`A4-C39`)
- [Hebrew University record, Kluger & DeNisi](https://cris.huji.ac.il/en/publications/the-effects-of-feedback-interventions-on-performance-a-historical/) — bibliographic
- [SAGE Encyclopedia, Feedback Intervention Theory](https://methods.sagepub.com/ency/edvol/sage-encyclopedia-of-educational-research-measurement-evaluation/chpt/feedback-intervention-theory) — FIT mechanism
- [Hattie & Timperley 2007 PDF (UCR)](https://assess.ucr.edu/sites/default/files/2019-02/hattietimperley_2007.pdf) — four levels (`A4-C40`)
- [Hattie & Timperley 2007 PDF (ULisboa)](https://conselhopedagogico.tecnico.ulisboa.pt/files/sites/32/hattie-and-timperley-2007.pdf) — second copy
- [SAGE record, The Power of Feedback](https://journals.sagepub.com/doi/abs/10.3102/003465430298487) — bibliographic
- [BERA blog on the feedback levels](https://www.bera.ac.uk/blog/how-to-optimise-the-use-of-hattie-and-timperleys-feedback-levels-for-student-learning) — level definitions
- [Graham, Hebert & Harris 2015, *Elementary School Journal* 115(4)](https://www.journals.uchicago.edu/doi/10.1086/681947) — **feedback source effect sizes, grades 1–8** (`A4-C41`)
- [ERIC EJ1068976, same](https://eric.ed.gov/?id=EJ1068976) — bibliographic
- [UNL DigitalCommons PDF, same](https://digitalcommons.unl.edu/cgi/viewcontent.cgi?article=1226&context=specedfacpub) — effect sizes and 6+1 Trait finding
- [PubMed 9686450, Mueller & Dweck 1998](https://pubmed.ncbi.nlm.nih.gov/9686450/) — intelligence praise (`A4-C42`)
- [UPenn PDF, Mueller & Dweck 1998](https://cpb-us-w2.wpmucdn.com/web.sas.upenn.edu/dist/b/398/files/2019/04/1998-04530-003-1sagefw.pdf) — full findings
- [Student Experience Research Network summary](https://studentexperiencenetwork.org/research_library/praise-for-intelligence-can-undermine-childrens-motivation-and-performance/) — summary
- [Haimovitz & Corpus PDF (Reed)](https://www.reed.edu/psychology/motivation/assets/downloads/Haimovitz_Corpus_2011.pdf) — person vs process praise (`A4-C43`)
- [Henderlong & Lepper 2002 PDF (Reed)](https://www.reed.edu/psychology/motivation/assets/downloads/Henderlong_Lepper_2002.pdf) — praise and intrinsic motivation review
- [ScienceDirect, praise and "easy" feedback on persistence](https://www.sciencedirect.com/science/article/abs/pii/S0022096524001723) — replication failure note (`A4-C43`)
- [T&F, "Wow, you're really smart!"](https://www.tandfonline.com/doi/abs/10.1080/01443410.2024.2396422) — self-esteem vulnerability
- [Macnamara & Burgoyne 2023 PDF (Case Western)](https://artscimedia.case.edu/wp-content/uploads/sites/141/2020/06/26110416/Macnamara-Burgoyne-2023.pdf) — growth mindset near-null (`A4-C44`)
- [Macnamara et al. 2022 PDF](https://alexanderpburgoyne.com/wp-content/uploads/2025/02/Macnamara-et-al.-2022-Do-Growth-Mindset-Interventions-Impact-Students-Academic-Achievement.pdf) — Sisk d = 0.08
- [Gazmuri et al. 2025, *Review of Education* (Wiley)](https://bera-journals.onlinelibrary.wiley.com/doi/10.1002/rev3.70066) — structured review
- [ScienceDirect, immediate vs delayed feedback and FIT](https://www.sciencedirect.com/science/article/abs/pii/S0023969025000396) — timing (`A4-C45`)
- [Nature HSSC, timing of feedback and retrieval practice](https://www.nature.com/articles/s41599-024-03983-6) — timing
- [*Medical Education*, "Timing's not everything"](https://asmepublications.onlinelibrary.wiley.com/doi/full/10.1111/medu.15287) — equivalence
- [PMC12702585, immediate vs delayed feedback, EFL engagement](https://pmc.ncbi.nlm.nih.gov/articles/PMC12702585/) — domain differences
- [T&F, formative peer feedback meta-analysis](https://www.tandfonline.com/doi/full/10.1080/02602938.2018.1545896) — training moderator (`A4-C50`)
- [Vuogan & Li, *TESOL Quarterly*](https://onlinelibrary.wiley.com/doi/abs/10.1002/tesq.3178) — peer feedback in L2 writing
- [Education Northwest, 6+1 Trait research](https://educationnorthwest.org/resources/61-trait-writing-research) — REL study (`A4-C48`)
- [ERIC ED527445, 6+1 Trait impact study](https://files.eric.ed.gov/fulltext/ED527445.pdf) — Oregon study design
- [Reading Rockets, writing assessment](https://www.readingrockets.org/topics/writing/articles/writing-assessment) — 6+1 Trait critique
- [APA, self-determination theory](https://www.apa.org/research-practice/conduct-research/self-determination-theory) — SDT (`A4-C53`)
- [Guay 2022 (SAGE), applying SDT to education](https://journals.sagepub.com/doi/10.1177/08295735211055355) — needs and autonomy support
- [PMC8935530, antecedents of autonomous and controlled motivation](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8935530/) — meta-analysis
- [PMC7399692, reading and writing motivation in grades 3–8](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7399692/) — SDT in the target band (`A4-C54`)
- [Journal of Writing Research, perceptions of choice](https://www.jowr.org/jowr/article/view/1012) — choice (`A4-C55`)
- [SAGE Open, topic selection and EFL writing](https://journals.sagepub.com/doi/pdf/10.1177/2158244014547176) — topic choice
- [PMC10792553, topic-based interest in EFL writing](https://pmc.ncbi.nlm.nih.gov/articles/PMC10792553/) — intrinsic motivation
- [Frontiers, second graders' efficacy for writing self-regulation](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2023.1265785/full) — self-efficacy (`A4-C56`)
- [Springer, writing self-efficacy in young children](https://link.springer.com/article/10.1007/s10984-005-7248-5) — early grades
- [ERIC EJ551377, influence of self-efficacy on elementary students' writing](https://eric.ed.gov/?id=EJ551377) — self-efficacy and writing

### Creativity, constraints, fixation, over-scaffolding
- ["The Green Eggs and Ham Hypothesis: How Constraints Facilitate Creativity"](https://www.researchgate.net/publication/301316673_The_Green_Eggs_and_Ham_Hypothesis_How_Constraints_Facilitate_Creativity) — constraints help (`A4-C57`)
- [ScienceDirect, "Creativity from constraints"](https://www.sciencedirect.com/science/article/abs/pii/S1871187122001870) — optimum and constraint types (`A4-C57`, `A4-C58`)
- [U. Michigan Deep Blue, creativity and constraint](https://deepblue.lib.umich.edu/bitstream/handle/2027.42/89692/brosso_1.pdf) — too many constraints
- [ScienceDirect, fixation effect: opposite impacts of example in children and adults](https://www.sciencedirect.com/science/article/abs/pii/S1871187115300353) — **children vs adults** (`A4-C18`)
- [ResearchGate, exposure effects in design idea generation](https://www.researchgate.net/publication/228628432_Exposure_Effects_in_Design_Idea_Generation_Unconscious_Conformity_or_a_Product_of_Sampling_Probability) — unconscious conformity
- [Springer *Memory & Cognition*, examples and task instructions](https://link.springer.com/article/10.3758/s13421-019-01005-4) — instruction matters (`A4-C19`)
- [NAESP, "The Consequences of Overscaffolding"](https://www.naesp.org/resource/the-consequences-of-overscaffolding/) — over-scaffolding symptoms (`A4-C60`)
- [Choice Literacy, "Are You Scaffolding or Rescuing?"](https://choiceliteracy.com/article/are-you-scaffolding-or-rescuing/) — practitioner account
- [Structural Learning, scaffolding guide](https://www.structural-learning.com/post/scaffolding-in-education-a-teachers-guide) — minimal hint strategy (`A4-C61`)
- [Science of Learning, "No, Explicit Instruction Does Not Cause Learned Helplessness"](https://scienceoflearning.substack.com/p/no-explicit-instruction-does-not) — counter-argument (`A4-C62`)
- [Baker, "Gaming the System: A Retrospective Look"](https://learninganalytics.upenn.edu/ryanbaker/PSCS-gaming-v6.pdf) — gaming, learning cost (`A4-C63`)
- [Baker, Corbett, Roll & Koedinger 2008 PDF](https://pact.cs.cmu.edu/pubs/Baker,Corbett,%20Roll%20&%20Koedinger%2008.pdf) — detecting gaming
- [Aleven et al., "Help Helps, But Only So Much," *IJAIED*](https://link.springer.com/article/10.1007/s40593-015-0089-1) — help-seeking research

### AI, children, authorship, homogenization
- [ACM CHI 2024, teachers/parents/students on GenAI in elementary literacy](https://dl.acm.org/doi/full/10.1145/3613904.3642438) — authorship/agency concerns (`A4-C66`)
- [arXiv 2606.27067, "Floor Raiser or Ceiling Limiter?"](https://arxiv.org/pdf/2606.27067) — **children's storytelling with GenAI, preprint** (`A4-C67`)
- [Digital Content Next, does GenAI aid or homogenize creativity](https://digitalcontentnext.org/blog/2024/07/23/does-generative-ai-aid-or-homogenize-human-creativity/) — 293 writers, 10.7% (`A4-C68`)
- [ScienceDirect, homogenizing effect of LLMs on creative diversity](https://www.sciencedirect.com/science/article/pii/S294988212500091X) — diversity comparison
- [ScienceDirect, diverse AI personas mitigate homogenization](https://www.sciencedirect.com/science/article/pii/S294988212600040X) — mitigation
- [Cornell Chronicle, AI suggestions make writing more generic, Western](https://news.cornell.edu/stories/2025/04/ai-suggestions-make-writing-more-generic-western) — cultural direction (`A4-C69`)
- [ACM CHI 2023, co-writing with opinionated language models](https://dl.acm.org/doi/10.1145/3544548.3581196) — **1,506 participants, opinion shift** (`A4-C70`)
- [arXiv 2302.00560, same](https://arxiv.org/abs/2302.00560) — preprint version
- [Semantic Scholar, interacting with opinionated LMs](https://www.semanticscholar.org/paper/Interacting-with-Opinionated-Language-Models-Users%E2%80%99-Bhat/1ea705967f64b306a08b875fce705941586d5444) — related
- [arXiv 2404.03108, writing with AI lowers psychological ownership](https://arxiv.org/pdf/2404.03108) — ownership and prompt length (`A4-C71`)
- [ACM CUI 2025, same](https://dl.acm.org/doi/10.1145/3719160.3736608) — published version
- [arXiv 2507.03670, interaction techniques encouraging longer prompts](https://arxiv.org/abs/2507.03670) — ownership techniques
- [arXiv 2601.10236, "Who Owns the Text?"](https://arxiv.org/abs/2601.10236) — 176 participants, ownership drop (`A4-C72`)
- [Moonlight review of "Who Owns the Text?"](https://www.themoonlight.io/en/review/who-owns-the-text-design-patterns-for-preserving-authorship-in-ai-assisted-writing) — summary
- [ScienceDirect, how GenAI impacts student creativity](https://www.sciencedirect.com/science/article/pii/S2713374523000316) — mixed effects (`A4-C73`)
- [bioRxiv, lower creativity in children using ChatGPT (fMRI)](https://www.biorxiv.org/content/10.1101/2025.11.07.687207.full.pdf) — unreviewed preprint
- [Frontiers Robotics & AI, LLM-driven storytelling with a social robot](https://www.frontiersin.org/journals/robotics-and-ai/articles/10.3389/frobt.2024.1457429/full) — children's storytelling
- [arXiv 2506.08872, "Your Brain on ChatGPT"](https://arxiv.org/abs/2506.08872) — cognitive debt, preprint (`A4-C65`)
- [MIT Media Lab project page](https://www.media.mit.edu/projects/your-brain-on-chatgpt/overview/) — study framing
- [brainonllm.com](https://www.brainonllm.com/) — study site
- [Forum for Linguistic Studies, cognitive offload instruction with GenAI](https://journals.bilpubgroup.com/index.php/fls/article/view/10072) — positive offloading (`A4-C64`)
- [ACM ICAIE 2025, interactive cognitive offload](https://dl.acm.org/doi/10.1145/3768421.3768447) — positive offloading
- [EPIC, GenAI, cognitive offloading and critical thinking](https://www.epicpeople.org/future-of-critical-thinking/) — negative framing
- [arXiv, metacognitive laziness in vocational education](https://arxiv.org/pdf/2512.12306) — preprint
- [ScienceDirect, who do children trust? AI vs human recommendations](https://www.sciencedirect.com/science/article/abs/pii/S0040162526001848) — children's trust (`A4-C74`)
- [ACM CHI 2026, child-centred K-AI Trust Scale](https://doi.org/10.1145/3772318.3790765) — trust measurement
- [Ada Lovelace Institute, "The trust problem"](https://www.adalovelaceinstitute.org/blog/the-trust-problem/) — design vulnerability
- [ScienceDirect, children trust a robot over a human in selective trust](https://www.sciencedirect.com/science/article/pii/S0747563224000979) — selective trust
- [Steiss et al. 2024, *Learning and Instruction* (ScienceDirect)](https://www.sciencedirect.com/science/article/pii/S0959475224000215) — **human vs ChatGPT feedback** (`A4-C46`, `A4-C130`)
- [eScholarship copy, same](https://escholarship.org/uc/item/6k61v37f) — full record
- [ASU record, same](https://asu.elsevierpure.com/en/publications/comparing-the-quality-of-human-and-chatgpt-feedback-of-students-w/) — bibliographic
- [ERIC EJ1380424, AWE effectiveness meta-analysis](https://eric.ed.gov/?id=EJ1380424) — g = 0.861 (`A4-C47`)
- [PMC10351274, automated feedback multi-level meta-analysis](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10351274/) — g = 0.55
- [Cambridge *ReCALL*, AI-based automated written feedback systematic review](https://www.cambridge.org/core/journals/recall/article/systematic-review-of-aibased-automated-written-feedback-research/28A670C4C7F2F1F30C7EA36EC489F867) — 82.4% tertiary
- [K-12 Dive, US Dept of Ed AI guidance](https://www.k12dive.com/news/Education-department-AI-schools-guidance/651409/) — humans in the loop (`A4-C75`)
- [EdTech Magazine, same guidance](https://edtechmagazine.com/k12/article/ai-in-education-new-guidance-from-department-of-education-perfcon) — recommendations
- [Panorama Education summary](https://www.panoramaed.com/blog/ai-future-teaching-report) — seven recommendations
- [Center for Data Innovation critique](https://datainnovation.org/2023/07/the-department-of-education-shouldnt-treat-human-in-the-loop-as-a-silver-bullet-for-ai/) — counterpoint

### Reading–writing connection, inference, transfer
- [Graham & Hebert 2011, *Harvard Educational Review* 81(4)](https://www.harvardeducationalreview.org/content/81/4/710) — Writing to Read (`A4-C76`)
- [ERIC EJ961480, same](https://eric.ed.gov/?id=EJ961480) — bibliographic
- [Center on Instruction synopsis](https://www.centeroninstruction.org/files/7%20COI%20Synopsis%20Writing%20to%20Read.pdf) — grade distribution
- [Carnegie Writing to Read report PDF](https://media.carnegie.org/filer_public/9d/e2/9de20604-a055-42da-bc00-77da949b29d7/ccny_report_2010_writing.pdf) — report
- [Graham et al. 2018, Reading for Writing, *RER* (SAGE)](https://journals.sagepub.com/doi/10.3102/0034654317746927) — reading→writing (`A4-C77`)
- [ResearchGate record, same](https://www.researchgate.net/publication/321726902_Reading_for_Writing_A_Meta-Analysis_of_the_Impact_of_Reading_Interventions_on_Writing) — study counts
- [Kim, Wolters & Lee 2024, *RER* (SAGE)](https://journals.sagepub.com/doi/full/10.3102/00346543231178830) — relations are not uniform (`A4-C78`)
- [ERIC EJ1256539, testing bidirectionality](https://files.eric.ed.gov/fulltext/EJ1256539.pdf) — mixed evidence
- [Wiley *RRQ*, balanced reading+writing literacy programs](https://ila.onlinelibrary.wiley.com/doi/10.1002/rrq.194) — record only (`A4-C80`)
- [Benjamins, promoting inference making](https://benjamins.com/catalog/swll.15.25mcm) — inference intervention (`A4-C81`)
- [PMC4555006, inferences about causality, intentionality, emotions](https://pmc.ncbi.nlm.nih.gov/articles/PMC4555006/) — mental-state inference
- [PMC6681044, inferential comprehension within story grammar](https://pmc.ncbi.nlm.nih.gov/articles/PMC6681044/) — scoping review
- [T&F, representation of mental states in young children's writings](https://www.tandfonline.com/doi/full/10.1080/03004430.2022.2051500) — mental-state language and ToM (`A4-C82`)
- [ResearchGate, ToM development and narrative writing longitudinal](https://www.researchgate.net/publication/330298220_Theory_of_Mind_development_and_narrative_writing_A_longitudinal_study) — longitudinal
- [ScienceDirect *JECP*, ToM more important for narrative comprehension](https://www.sciencedirect.com/science/article/abs/pii/S0022096521000990) — narrative specificity (`A4-C83`)
- [PubMed 28221090, Panero et al. reply to Kidd & Castano](https://pubmed.ncbi.nlm.nih.gov/28221090/) — replication failure (`A4-C87`)
- [PubMed 28221089, Kidd & Castano commentary](https://pubmed.ncbi.nlm.nih.gov/28221089/) — counter-response
- [SAGE, Kidd & Castano 2019 preregistered replications](https://journals.sagepub.com/doi/abs/10.1177/1948550618775410) — follow-up
- [ScienceDirect, near transfer overview](https://www.sciencedirect.com/topics/psychology/near-transfer) — transfer rarity (`A4-C88`)
- [PMC11560981, no evidence for far transfer to sports performance](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11560981/) — far transfer
- [NIFDI, near and far transfer in cognitive training](https://www.nifdi.org/resources/hempenstall-blog/758-near-and-far-transfer-in-cognitive-training.html) — generic skills critique
- [Academia.edu, enhancing empathy through a creative writing program](https://www.academia.edu/45685013/Enhancing_Empathy_Through_a_Creative_Writing_Program_in_Elementary_School) — empathy claim (`A4-C86`)
- [University of Cambridge, teaching empathy improves creative abilities](https://www.cam.ac.uk/research/news/teaching-pupils-empathy-measurably-improves-their-creative-abilities-study-finds) — direction of effect
- [Boise State, teaching perspective-taking with authentic literature](https://scholarworks.boisestate.edu/cgi/viewcontent.cgi?article=1096&context=literacy_facpubs) — perspective-taking instruction

### Standards
- [thecorestandards.org RL.3.3](https://www.thecorestandards.org/ELA-Literacy/RL/3/3/) — character traits/motivations/feelings (`A4-C84`)
- [thecorestandards.org RL Grade 3](https://www.thecorestandards.org/ELA-Literacy/RL/3/) — grade 3 RL
- [Connecticut K–5 ELA standards progression PDF](https://portal.ct.gov/-/media/SDE/CT-Core-Standards/2014/06/CCS-ELA_K-5_Standards_Progression.pdf) — grades 2–5 progression
- [thecorestandards.org W Grade 3](https://www.thecorestandards.org/ELA-Literacy/W/3/) — W.3.3 (`A4-C85`)
- [thecorestandards.org W Grade 7](https://www.thecorestandards.org/ELA-Literacy/W/7/) — W.7.3

### Vocabulary and language complexity
- [Dr. Karen Speech and Language, school-age vocabulary](https://drkarenspeech.com/vocabulary-development-school-age-years/) — growth estimates, reading as driver (`A4-C89`, `A4-C90`)
- [PMC4965448, "How Many Words Do We Know?"](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4965448/) — estimate dependence on definitions
- [H&V Library, vocabulary gap](https://hv-library.com/research/assessing-addressing-the-vocabulary-gap/) — estimate variation
- [SAGE, Swanborn & de Glopper 1999](https://journals.sagepub.com/doi/abs/10.3102/00346543069003261) — **incidental learning ~15%** (`A4-C91`)
- [ERIC EJ602665, same](https://eric.ed.gov/?id=EJ602665) — bibliographic
- [ResearchGate, impact of reading purpose on incidental word learning](https://www.researchgate.net/publication/229692794_Impact_of_Reading_Purpose_on_Incidental_Word_Learning_From_Context) — ability differences
- [Institute for Learning, robust vocabulary instruction](https://www.ifl-news.pitt.edu/2023/01/robust-vocabulary-instruction/) — three tiers (`A4-C92`)
- [Achieve the Core, robust vocabulary instruction](https://achievethecore.org/peersandpedagogy/robust-vocabulary-instruction/) — tier definitions
- [Vocabulary Matters, word tiers](https://www.vocabulary-matters.org/word-tiers) — tier framework
- [T&F, Elleman et al. 2009, *JREE* 2(1)](https://www.tandfonline.com/doi/full/10.1080/19345740802539200) — **vocabulary→comprehension effects** (`A4-C94`)
- [ERIC EJ866970, same](https://eric.ed.gov/?id=EJ866970) — bibliographic
- [ERIC EJ905044, Goodwin & Ahn morphological meta-analysis](https://eric.ed.gov/?id=EJ905044) — morphology (`A4-C95`)
- [ASHA Evidence Map summary, same](https://apps.asha.org/EvidenceMaps/Articles/ArticleSummary/93cb3843-8a27-4b52-887b-32781be13e92) — outcome breakdown
- [ResearchGate PDF, same](https://www.researchgate.net/profile/Amanda-Goodwin-2/publication/46010226_A_meta-analysis_of_morphological_interventions_Effects_on_literacy_achievement_of_children_with_literacy_difficulties/links/02e7e53208c8340c90000000/A-meta-analysis-of-morphological-interventions-Effects-on-literacy-achievement-of-children-with-literacy-difficulties.pdf) — dosage findings
- [PMC9382957, children's emotion vocabulary 4–11](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9382957/) — **lexicon doubling** (`A4-C96`, `A4-C97`)
- [PMC9928212, emotion vocabulary 5–13 psycholinguistic measure](https://pmc.ncbi.nlm.nih.gov/articles/PMC9928212/) — development
- [PMC4672887, emotion word comprehension in Chinese children 2–13](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4672887/) — valence effects
- [ScienceDirect, emotion-specific vocabulary 4–9](https://www.sciencedirect.com/science/article/abs/pii/S0022096519304229) — emotion understanding
- [ScienceDirect, RULER Feeling Words Curriculum](https://www.sciencedirect.com/science/article/abs/pii/S1041608010001214) — emotion vocabulary curriculum (`A4-C98`)
- [RULER Approach, classroom instruction](https://rulerapproach.org/how-it-works/classroom-instruction/) — curriculum structure
- [PMC4267422, READING and FEELING intervention](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4267422/) — grades 2–3 emotional vocabulary gains
- [Reading Rev, character trait vocabulary across the grades](https://readingrev.com/blog/implementing-character-trait-vocabulary-across-the-grades) — trait vocabulary practice (`A4-C99`)
- [Teaching Made Practical, developing character trait vocabulary](https://teachingmadepractical.com/charactertraitvocabulary/) — connotation continuum, word walls
- [Vocabulary.com, character traits list](https://www.vocabulary.com/lists/33665) — trait word list
- [Alex Quigley, "The Problem with Teaching Sophisticated Vocabulary"](https://alexquigley.co.uk/the-problem-with-teaching-sophisticated-vocabulary/) — **synonym substitution errors** (`A4-C101`)
- [Principal Education mirror of the same](https://principal-education.co.uk/the-problem-with-teaching-sophisticated-vocabulary/) — same content
- [SAGE, developmental steps in metaphorical language abilities](https://journals.sagepub.com/doi/abs/10.1177/0023830917746552) — metaphor development (`A4-C100`)
- [Cambridge, early acquisition of figurative meanings](https://www.cambridge.org/core/journals/language-and-cognition/article/early-acquisition-of-figurative-meanings-in-polysemous-nouns-and-verbs/52CC3BB5CD488EEF31C6FB8AF7A457DB) — figurative acquisition
- [PMC10800952, metaphorical comprehension in Chinese children](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10800952/) — cross-linguistic
- [Springer, figurative language and narrative writing in primary students](https://link.springer.com/article/10.1007/s13384-025-00890-w) — figurative language in writing
- [ScienceDirect, corpus-based investigation of linguistic complexity in children's writing](https://www.sciencedirect.com/science/article/pii/S2666799124000017) — lexical development (`A4-C102`, `A4-C103`)
- [PMC8153412, lexical diversity in written narratives](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8153412/) — lexical diversity
- [Wiley, supporting adjective learning by 5–7 year-olds](https://compass.onlinelibrary.wiley.com/doi/10.1111/lnc3.12476) — adjectives
- [PMC3988833, narratives of school-age African American children](https://pmc.ncbi.nlm.nih.gov/articles/PMC3988833/) — fictional vs personal narrative
- [Springer, syntactic complexity measures by genre and grade](https://link.springer.com/article/10.1007/s11145-020-10057-x) — T-units, Hunt (`A4-C103`)
- [Journal of Writing Research, linguistic features in writing quality](https://www.jowr.org/jowr/article/download/582/469/441) — complexity measures
- [BUCLD, lexical richness and syntactic complexity in children's story writing](http://www.lingref.com/bucld/46/BUCLD46-25.pdf) — story writing
- [Illinois IDEALS, "Why readability formulas fail"](https://www.ideals.illinois.edu/items/15551/bitstreams/54962/data.pdf) — readability critique (`A4-C104`)
- [Academia.edu, linguistic assumptions underlying readability formulae](https://www.academia.edu/197100/The_linguistic_assumptions_underlying_readability_formulae_a_critique) — critique
- [UMich, computational assessment of text readability survey](https://public.websites.umich.edu/~kevynct/pubs/ITL-readability-invited-article-v10-camera.pdf) — construct validity
- [TextProject, readability and the Common Core staircase](https://textproject.org/paper/staircase-text-complexity) — **narrative failure mode** (`A4-C105`)
- [TextProject, multiple sources of information in establishing text complexity](https://textproject.org/paper/a-case-for-using-multiple-sources-of-information-in-establishing-text-complexity) — Lexile limits
- [Springer, childLex](https://link.springer.com/article/10.3758/s13428-014-0528-1) — child lexical database (`A4-C106`)
- [Springer, CPB-Lex](https://link.springer.com/article/10.3758/s13428-023-02198-y) — picture-book lexicon
- [PMC12500800, extended age-of-acquisition norms](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12500800/) — AoA norms

### Differentiation, UDL, learning styles, adaptive learning
- [Frontiers in Psychology, differentiated instruction systematic review](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2019.02366/full) — 12 studies (`A4-C107`)
- [PMC6883934, same](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6883934/) — findings
- [PubMed 31824362, same](https://pubmed.ncbi.nlm.nih.gov/31824362/) — bibliographic
- [Frontiers in Education, persistence of learning-styles matching](https://www.frontiersin.org/journals/education/articles/10.3389/feduc.2023.1147498/full) — neuromyth (`A4-C108`)
- [Frontiers in Psychology, why educators endorse a neuromyth](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2024.1407518/full) — endorsement
- [PMC6113575, modality-specific learning style hypothesis mini-review](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6113575/) — cross-modal processing
- [Frontiers 2024, "Is it really a neuromyth?"](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2024.1428732/full) — dissenting meta-analysis, content not retrieved
- [Boysen 2024 (SAGE), critical analysis of CAST's UDL evidence](https://journals.sagepub.com/doi/10.1177/14782103241255428) — **UDL evidence critique** (`A4-C109`)
- [Springer EPR, unraveling UDL implementation challenges](https://link.springer.com/article/10.1007/s10648-024-09860-7) — implementation
- [T&F, UDL systematic review and meta-analysis](https://www.tandfonline.com/doi/full/10.1080/2331186X.2023.2218191) — heterogeneity, implausible aggregate
- [ScienceDirect, personalized and adaptive learning technologies on reading literacy](https://www.sciencedirect.com/science/article/abs/pii/S1747938X23000805) — g = 0.29 (`A4-C110`)
- [ACM IDC 2025, adaptive learning technologies and K-12 teachers](https://dl.acm.org/doi/full/10.1145/3713043.3727062) — implementation misalignment

### DLD, dyslexia, dysgraphia, ADHD, autism, assistive technology
- [ASHA JSLHR, narrative performance in DLD meta-analysis](https://pubs.asha.org/doi/10.1044/2022_JSLHR-22-00017) — −0.82 SD (`A4-C111`)
- [ASHA LSHSS, interventions to improve narrative language](https://pubs.asha.org/doi/10.1044/2021_LSHSS-20-00160) — 26 group studies (`A4-C112`)
- [SAGE, narrative group intervention in DLD](https://journals.sagepub.com/doi/abs/10.1177/0265659020950386) — story grammar
- [ScienceDirect, pilot RCT of narrative intervention for DLD](https://www.sciencedirect.com/science/article/abs/pii/S0165587625000308) — 10-week outcomes
- [Semantic Scholar, disorder of written expression and dysgraphia](https://www.semanticscholar.org/paper/596d0025f5768c323413f263726c3b7f0efb9cb4) — definition (`A4-C114`)
- [Cleveland Clinic, dysgraphia](https://my.clevelandclinic.org/health/diseases/23294-dysgraphia) — prevalence range
- [USNH Pressbooks, dysgraphia chapter](https://pressbooks.usnh.edu/understandingandsupportinglearnerswithdisabilities/chapter/dysgraphia/) — subtypes, co-occurrence
- [T&F, STT intervention study with students with dyslexia](https://www.tandfonline.com/doi/full/10.1080/10573569.2026.2664964) — modality effect (`A4-C115`)
- [T&F, STT scoping review for adolescents with learning difficulties](https://www.tandfonline.com/doi/full/10.1080/17483107.2022.2149865) — evidence sparseness (`A4-C115`, `A4-C118`)
- [T&F, STT single-case study, Nordic countries](https://www.tandfonline.com/doi/full/10.1080/17483107.2024.2351488) — text production
- [Frontiers in Education, revisions in written composition with STT](https://www.frontiersin.org/journals/education/articles/10.3389/feduc.2023.1133930/full) — revision with STT
- [The Learning Agency, closing the child speech recognition gap](https://the-learning-agency.com/guides-resources/closing-the-child-speech-recognition-gap-evidence-limitations-and-paths-forward/) — **WER by age** (`A4-C116`)
- [The Learning Agency, how speech recognition struggles with children's voices](https://the-learning-agency.com/the-cutting-ed/article/how-speech-recognition-systems-struggle-with-childrens-voices/) — causes
- [Interspeech 2005, human vs computer recognition of children's speech](https://www.isca-archive.org/interspeech_2005/darcy05_interspeech.pdf) — 2–5× error rates
- [NSF PAR, ASR difficulties for kindergarten-aged children](https://par.nsf.gov/biblio/10099068-difficulties-automatic-speech-recognition-kindergarten-aged-children) — youngest children
- [NCEO Accommodations Toolkit, word prediction research](https://publications.ici.umn.edu/nceo/accommodations-toolkit/word-prediction-research) — 25 years of research (`A4-C117`)
- [MacArthur 1999, word prediction for severe spelling problems](https://doi.org/10.2307/1511283) — spelling benefit
- [ERIC EJ986388, word prediction and writing fluency, physical disabilities](https://eric.ed.gov/?id=EJ986388) — speed findings
- [Purdue WCJ, "Listening to Revise"](https://docs.lib.purdue.edu/cgi/viewcontent.cgi?article=1745&context=wcj) — TTS for revision (`A4-C118`)
- [PubMed 42536336, meta-analysis of dyslexia-friendly fonts](https://pubmed.ncbi.nlm.nih.gov/42536336/) — **no reliable effect** (`A4-C119`)
- [PMC5629233, OpenDyslexic and reading rate/accuracy](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5629233/) — reduced speed/accuracy
- [PMC5934461, Dyslexie font does not benefit reading](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5934461/) — no benefit
- [International Dyslexia Association, do special fonts help?](https://dyslexiaida.org/do-special-fonts-help-people-with-dyslexia/) — professional position
- [T&F, keyboarding instruction in elementary students](https://www.tandfonline.com/doi/full/10.1080/19411243.2018.1512067) — keyboarding (`A4-C120`)
- [ERIC ED499927, touch keyboarding speed of fifth graders](https://files.eric.ed.gov/fulltext/ED499927.pdf) — speed ranges
- [QIAT, handwriting/keyboarding rates PDF](https://www.qiat.org/docs/resourcebank/hwriting_kybding_rate_info.pdf) — rate data
- [Wisconsin DPI, elementary keyboarding](https://dpi.wi.gov/bit/standards/elementary-keyboarding) — 5×grade rule
- [ScienceDirect, written expression of adolescents with ADHD](https://www.sciencedirect.com/science/article/abs/pii/S0891422216300063) — ADHD writing (`A4-C121`)
- [ResearchGate, executive functions and writing skills in ADHD](https://www.researchgate.net/publication/354876762_Executive_functions_and_writing_skills_in_children_with_and_without_ADHD) — EF predictors
- [NTU IREP, effects of ADHD on writing composition](https://irep.ntu.ac.uk/id/eprint/30527/1/8317_Betts.pdf) — planning difficulty
- [Nature Communications, canonical trajectory of EF maturation](https://www.nature.com/articles/s41467-023-42540-8) — EF development (`A4-C122`)
- [Scientific Reports, developmental trajectories of EF](https://www.nature.com/articles/s41598-020-80866-1) — trajectories
- [Frontiers, developmental profile of EF in school-age children](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2020.596075/full) — school-age EF
- [T&F open chapter, Milton, Waldock & Keates, double empathy](https://www.taylorfrancis.com/chapters/oa-edit/10.4324/9781003189978-6/autism-double-empathy-problem-damian-milton-krysia-emily-waldock-nathan-keates) — double empathy (`A4-C123`)
- [SAGE *Autism*, "Do you feel me?"](https://journals.sagepub.com/doi/10.1177/13623613241252320) — empathic accuracy
- [PMC10300641, rule-based account of social stories](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10300641/) — strengths-based reframing
- [*Languages*, narrative skills in autistic and non-autistic preschool children](https://doi.org/10.3390/languages11050093) — scoping review (`A4-C124`)
- [Springer JADD, characteristics of story production of autistic children](https://link.springer.com/article/10.1007/s10803-023-06096-2) — narrative differences
- [Frontiers in Psychiatry, narrative and visual attention in ASD, cross-cultural](https://www.frontiersin.org/journals/psychiatry/articles/10.3389/fpsyt.2026.1589600/full) — **cultural artifact finding**
- [PMC7253523, narrative skills in primary school children with autism](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7253523/) — narrative and sequencing
- [WRITE CENTER, supporting writers with ASD](https://www.writecenter.org/supporting-writers-with-asd.html) — strengths-based supports (`A4-C125`)
- [Reading Rockets, technology to support students with ASD in writing](https://www.readingrockets.org/topics/assistive-technology/articles/using-technology-support-students-autism-spectrum-disorders) — technology supports

### Language variety, multilingualism, giftedness
- [Michaels, "Sharing time," *Language in Society* (Cambridge)](https://www.cambridge.org/core/journals/language-in-society/article/abs/sharing-time-childrens-narrative-styles-and-differential-access-to-literacy/EC5767FEA4D0837BA2CF0C0E89FAA39C) — **topic-associating vs topic-centered** (`A4-C126`)
- [ResearchGate PDF, same](https://www.researchgate.net/publication/231995864_Sharing_Time_Children's_Narrative_Styles_and_Differential_Access_to_Literacy) — teacher evaluation
- [ERIC EJ497723, African American kindergartners' spoken narratives](https://eric.ed.gov/?id=EJ497723) — style comparison
- [LSA proceedings, ratings of student writing with AAE](https://journals.linguisticsociety.org/proceedings/index.php/PLSA/article/download/4041/3761/5667) — rating bias (`A4-C127`)
- [ResearchGate, linguistic discrimination in writing assessment](https://www.researchgate.net/publication/251642769_Linguistic_Discrimination_in_Writing_Assessment_How_Raters_React_to_African_American_Errors_ESL_Errors_and_Standard_English_Errors_on_a_State-Mandated_Writing_Exam) — harsher grading
- [Education Next, how to reduce racial bias in grading](https://www.educationnext.org/how-to-reduce-racial-bias-in-grading-research/) — 8pp gap, rubric mitigation
- [PMC9132061, language variation in the writing of African American students](https://pmc.ncbi.nlm.nih.gov/articles/PMC9132061/) — variation and achievement
- [CUNY-NYSIEB, translanguaging pedagogy for writing](https://www.cuny-nysieb.org/wp-content/uploads/2016/05/TLG-Pedagogy-Writing-04-15-16.pdf) — translanguaging in writing (`A4-C128`)
- [NCTE Squire Office policy brief on translanguaging](https://ncte.org/wp-content/uploads/2021/04/SquireOfficePolicyBrief_Translanguaging_April2021.pdf) — US literacy classrooms
- [Iowa Reading Research Center, translanguaging with bilingual texts](https://irrc.education.uiowa.edu/blog/2023/02/embracing-translanguaging-classroom-bilingual-texts) — classroom practice
- [García & Lin, translanguaging in bilingual education (PDF)](https://ofeliagarciadotorg.wordpress.com/wp-content/uploads/2011/02/translanguaging-in-bilingual-education.pdf) — theory
- [REL Pacific, translanguaging infographic](https://ies.ed.gov/rel-pacific/2025/01/infographic-5) — evidence framing
- [SAGE, literacy-integrated content area instruction for English learners](https://journals.sagepub.com/doi/10.1177/13621688251397352) — 26 studies (`A4-C129`)
- [T&F, technology-enhanced ESL/EFL writing meta-analysis](https://www.tandfonline.com/doi/abs/10.1080/09588221.2022.2118782) — g = 1.00
- [ScienceDirect, L2 writing self-efficacy meta-regression](https://www.sciencedirect.com/science/article/abs/pii/S1060374321000321) — L1 vs L2 correlations
- [Frontiers in Education, umbrella review of acceleration/enrichment/ability grouping](https://www.frontiersin.org/journals/education/articles/10.3389/feduc.2026.1925181/full) — gifted education (`A4-C131`)
- [Davidson Institute, best-evidence synthesis on acceleration](https://www.davidsongifted.org/gifted-blog/a-best-evidence-synthesis-of-research-on-acceleration-options-for-gifted-students/) — acceleration support
- [UConn, enrichment theory, research and practice (PDF)](https://gifted.media.uconn.edu/wp-content/uploads/sites/961/2025/01/Enrichment-Theory-and-Practice-Research.pdf) — enrichment
- [Kranz et al. 2024, *Dyslexia* (Wiley)](https://onlinelibrary.wiley.com/doi/full/10.1002/dys.1763) — **twice-exceptionality masking** (`A4-C132`)
- [ScienceDirect, being twice exceptional](https://www.sciencedirect.com/science/article/pii/S1877042814023933) — profile
- [University of Denver, twice-exceptional identification and identity](https://digitalcommons.du.edu/cgi/viewcontent.cgi?article=3076&context=etd) — identification

### Accessibility standards and child-computer interaction
- [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/) — normative standard (`A4-C133`)
- [TetraLogical, what's new in WCAG 2.2](https://tetralogical.com/blog/2023/10/05/whats-new-wcag-2.2/) — new criteria
- [Vispero, new success criteria in WCAG 2.2](https://vispero.com/resources/new-success-criteria-in-wcag22/) — criteria detail
- [W3C COGA, Making Content Usable](https://www.w3.org/TR/coga-usable/) — cognitive accessibility (`A4-C134`)
- [W3C COGA introduction](https://www.w3.org/TR/coga-usable/introduction.html) — scope
- [UK DfE accessibility manual, COGA](https://accessibility.education.gov.uk/guidelines/coga) — government guidance
- [IDEA site, AT devices and services guidance](https://sites.ed.gov/idea/idea-files/at-guidance/) — statutory requirement (`A4-C135`)
- [Reading Rockets, assistive technology and the IEP](https://www.readingrockets.org/topics/learning-disabilities/articles/assistive-technology-and-iep) — IEP documentation
- [ASHA, IDEA assistive technology definition revision](https://www.asha.org/advocacy/idea/04-law-assist-tech/) — 1997 amendment
- [Nielsen Norman Group, children's UX](https://www.nngroup.com/articles/childrens-websites-usability-issues/) — children's interface issues (`A4-C136`)
- [ResearchGate, UI design guidelines for children's mobile learning apps](https://www.researchgate.net/publication/364105991_User_Interface_Design_Guidelines_for_Children_Mobile_Learning_Applications) — guidelines
- [Oxford Academic *IwC*, interactive design framework for children's apps](https://academic.oup.com/iwc/article/34/3/85/6964644) — design framework
- [APH ConnectCenter, tools for writing for children who are blind or low vision](https://aphconnectcenter.org/familyconnect/education/ecc/assistive-technology/tools-for-writing/) — non-visual writing tools (`A4-C137`)
- [ACM CHI 2021, blind screen-reader users and digital artboards](https://dl.acm.org/doi/fullHtml/10.1145/3411764.3445242) — non-visual creative tools
- [Perkins School for the Blind, A to Z of AT for low vision](https://www.perkins.org/resource/z-assistive-technology-low-vision/) — AT inventory

---

*End of Agent 4 module. 137 numbered claims; 68 searches; all retrieval at search-result level; every effect size marked `[SNIPPET]` and requiring primary-source verification before external use.*

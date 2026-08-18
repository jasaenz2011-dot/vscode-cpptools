# 05 — Educator Analytics, Assessment, Standards & Episode Integration
### Character Studio Knowledge Base · Agent 5 deliverable

---

## Scope, method, and how to read this document

**Date of research:** 2026-08-18
**Searches run this session:** 68 distinct `WebSearch` queries (many domain-restricted to authoritative hosts).

### ⚠️ CRITICAL METHOD LIMITATION — READ THIS FIRST

**`WebFetch` was blocked for every domain attempted in this session** by this environment's egress policy (403 at the CONNECT layer). Confirmed blocked hosts included `ftc.gov`, `federalregister.gov`, `ecfr.gov`, `studentprivacy.ed.gov`, `ico.org.uk`, `gov.uk`, `pmc.ncbi.nlm.nih.gov`, `pubs.asha.org`, `sciencedirect.com`, `link.springer.com`, `tandfonline.com`, `eric.ed.gov`, `thecorestandards.org`, `arxiv.org`, `scholar.google.com`, and every other host tried. Per environment policy, organizational egress denials were **not** routed around.

**Consequence:** every claim below was retrieved through `WebSearch` result summaries — which do extract content from the target pages, but are *not* full-text reads. Therefore:

- **No claim in this document has been verified against full primary text.**
- Where a number appears, it appeared in a retrieved search result summary attributed to the named source. It has **not** been checked against the source PDF/HTML.
- Statutory and regulatory text is **paraphrase retrieved from the regulator's own domain via domain-restricted search**, not verbatim quotation from the Federal Register / eCFR / official guidance pages.
- Accordingly, **almost every substantive claim carries `[SECONDARY-SOURCED]`** in addition to its evidence tier. This is not false modesty; it is the accurate description of what was retrievable.

**Action required before this document is used for anything consequential:** a human with unrestricted network access must re-verify (a) every numeric finding, (b) every regulatory statement, and (c) every standards quotation against the primary source, using the URLs in the Source List.

### 🚨 NOT LEGAL ADVICE

**Part E of this document discusses COPPA, FERPA, PPRA, SOPIPA, UK/EU GDPR, and the ICO Children's Code. It is not legal advice and must not be relied upon as legal advice.** It was assembled by an AI research agent that could not open the primary regulatory texts. Children's privacy law is jurisdiction-specific, fact-specific, changes frequently, and carries civil-penalty exposure. **A qualified attorney licensed in each relevant jurisdiction must review every compliance decision before Character Studio ships any feature touching child data.** Where this document states a rule, treat it as a *research lead to be verified*, never as a determination of legal obligation.

### Evidence tiers used

| Tag | Meaning |
|---|---|
| `[E1]` | Empirical finding (study, meta-analysis, survey with data) |
| `[E2]` | Theoretical framework |
| `[E3]` | Educational standard, or regulatory/legal source |
| `[E4]` | Established practice / professional consensus |
| `[E5]` | Commercial / proprietary system or vendor claim |
| `[E6]` | Emerging or contested claim |
| `[UNVERIFIED]` | Could not be confirmed; what was searched is noted |
| `[SECONDARY-SOURCED]` | Read via search-result summary, not primary full text |

### Claim IDs

Every substantive research claim is numbered `A5-Cnn`. Product rules cite the claim IDs they rest on. Any threshold, band, or cutoff that is **not** derived from evidence is explicitly marked **`DESIGN DECISION`**.

### Structure

Each Part is split into `## WHAT RESEARCH SAYS` and `## WHAT CHARACTER STUDIO SHOULD DO`. Do not read the product half without the research half; several product rules exist specifically to *prevent* a plausible-sounding feature that the evidence does not support.

### Shared age taxonomy

| Band | Ages | Grades |
|---|---|---|
| B0 | 5–6 | K–1 (peripheral) |
| B1 | 7–8 | 2–3 |
| B2 | 9–10 | 4–5 |
| B3 | 11–12 | 6–7 |
| B4 | 13–14 | 8–9 |

Sources cite their own ranges; those are given first, then mapped. **Bands are soft defaults for choosing sensible presets. They are never gates.** No feature in Character Studio should be locked, hidden, or refused on the basis of a band alone.

### Default stance under uncertainty

Thin, mixed, or context-dependent evidence ⇒ **the product default is neutrality or gentle optionality, never prescription.**

**For analytics specifically the default is stronger:** where evidence is thin, the correct product behaviour is **to not measure and to not display**, rather than to surface a weak metric with a caveat. A caveat next to a number does not stop the number from being acted on.

---
---

# PART A — ASSESSMENT OF NARRATIVE WRITING

## A.1 WHAT RESEARCH SAYS

### A.1.1 Formative vs. summative assessment — and a live disagreement about how big the effect is

**`A5-C01`** `[E1]` `[SECONDARY-SOURCED]` Black & Wiliam's 1998 review *Inside the Black Box* is the canonical source for the claim that classroom formative assessment produces learning gains, reporting effect sizes "between 0.4 and 0.7" on standardized tests, described as larger than most known educational interventions. Retrieved summaries variously described the review base as ~250 studies and ~580 articles. → [Phi Delta Kappan / SAGE reprint](https://journals.sagepub.com/doi/10.1177/003172171009200119); [full text PDF mirror](http://allianceforlearning.co.uk/wp-content/uploads/2017/03/William-and-Black-Inside-the-Black-Box.pdf)

**`A5-C02`** `[E1]` `[SECONDARY-SOURCED]` **That figure is contested.** Kingston & Nash (2011), *Formative Assessment: A Meta-Analysis and a Call for Research* (Educational Measurement: Issues and Practice), reviewed 300+ K-12 studies, found only 13 with sufficient information to compute effect sizes, yielding 42 independent effect sizes, with a **median observed effect size of .25 and a weighted mean of .20** — roughly a third to a half of the Black & Wiliam figure. → [Wiley](https://onlinelibrary.wiley.com/doi/abs/10.1111/j.1745-3992.2011.00220.x); [Semantic Scholar](https://www.semanticscholar.org/paper/Formative-Assessment:-A-Meta-Analysis-and-a-Call-Kingston-Nash/493ebbe1ff55afeed3e0385fedb2e956d83f78d2)

**`A5-C03`** `[E6]` `[SECONDARY-SOURCED]` The disagreement is itself contested: retrieved sources note critics of Kingston & Nash argue their operationalization of "formative assessment" drove study selection and therefore the smaller estimate. Also retrieved: Briggs et al., *Studies of the Effect of Formative Assessment on Student Achievement: So Much More Is Needed* (Practical Assessment, Research & Evaluation, 2013), whose title alone signals the field's unsettled state. → [ERIC EJ1005135](https://eric.ed.gov/?id=EJ1005135)

> **Reading for product:** "Formative assessment works" is directionally supported but the *magnitude* is genuinely disputed by credible measurement researchers. Character Studio must not market a formative-feedback feature with a borrowed effect size.

**`A5-C04`** `[E1]` `[SECONDARY-SOURCED]` A writing-specific meta-analysis (Graham, Hebert & Harris, *Formative Assessment and Writing: A Meta-Analysis*, Elementary School Journal 2015) reported that feedback about writing statistically enhanced writing quality, with average weighted effect sizes by feedback source of **adults 0.87, peers 0.58, self 0.62, computers 0.38**. Note the ordering: *computer feedback was the weakest of the four sources examined.* → [University of Chicago Press](https://www.journals.uchicago.edu/doi/10.1086/681947)

**`A5-C05`** `[E1]` `[SECONDARY-SOURCED]` Feedback is not uniformly beneficial. Kluger & DeNisi (1996, *Psychological Bulletin*) meta-analysed 607 effect sizes from 23,663 observations and found that although feedback interventions improved performance on average, **over one-third of feedback interventions *decreased* performance.** Their Feedback Intervention Theory holds that effectiveness falls as attention moves up the hierarchy away from the task and toward the self. → [PDF mirror](https://mrbartonmaths.com/resourcesnew/8.%20Research/Marking%20and%20Feedback/The%20effects%20of%20feedback%20interventions.pdf); [Hebrew University record](https://cris.huji.ac.il/en/publications/the-effects-of-feedback-interventions-on-performance-a-historical/)

> **Reading for product:** this is the single most important assessment finding in this document for a creative-writing tool. Feedback that directs a child's attention to *themselves as a writer* ("you are a level 3 storyteller") is the pattern FIT predicts will backfire.

---

### A.1.2 Rubrics: analytic vs. holistic, and what they buy you

**`A5-C06`** `[E1]` `[SECONDARY-SOURCED]` The analytic-vs-holistic comparison literature does **not** produce a winner. Retrieved reviews state that findings that "neither holistic nor analytic scoring is preferable to the other" appear consistent across multiple studies, and that the two differ along several dimensions (bias, impact, inter-rater reliability, cost-effectiveness, discriminatory power) rather than one dominating. → [Macrothink JSEL](https://www.macrothink.org/journal/index.php/jsel/article/download/19060/14823)

**`A5-C07`** `[E1]` `[SECONDARY-SOURCED]` One retrieved comparison (a retrospective cohort study in *medical* research education, not children's writing) reported stronger inter-assessor correlation with analytic rubrics (r = 0.36) than holistic (r = 0.24). **Both correlations are low.** Treat this as an illustration that rater agreement on extended writing is hard, not as evidence for analytic scoring in grade 2–8 narrative. → [PMC11359436](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11359436/)

**`A5-C08`** `[E1]` `[SECONDARY-SOURCED]` High agreement on a *holistic* score can mask divergence between raters on the underlying criteria — i.e. raters can agree on the total while disagreeing about why, which is a validity problem masquerading as reliability. → [Macrothink JSEL](https://www.macrothink.org/journal/index.php/jsel/article/download/19060/14823)

**`A5-C09`** `[E1]` `[SECONDARY-SOURCED]` Rubrics used *by students* have a meta-analytic effect. Panadero et al., *Effects of Rubrics on Academic Performance, Self-Regulated Learning, and Self-Efficacy: a Meta-analytic Review* (Educational Psychology Review, 2023) reported **g = 0.45 in favour of rubrics on academic performance after correcting for publication bias.** → [Springer](https://link.springer.com/article/10.1007/s10648-023-09823-4)

**`A5-C10`** `[E1]` `[SECONDARY-SOURCED]` In elementary writing specifically, a study of a model + student criteria-generation + rubric-referenced self-assessment reported higher writing scores for the rubric/self-assessment group (M = 28.5) than control (M = 24.3). Retrieved as Andrade et al., *Putting Rubrics to the Test*. → [ResearchGate record](https://www.researchgate.net/publication/229518031_Putting_Rubrics_to_the_Test_The_Effect_of_a_Model_Criteria_Generation_and_Rubric-Referenced_Self-Assessment_on_Elementary_School_Students%27_Writing)

**`A5-C11`** `[E1]` `[SECONDARY-SOURCED]` Retrieved reviews caution that it is *implementation complexity*, not rubric type, that generates positive self-assessment effects — i.e. handing a child a rubric is not the intervention; the surrounding practice is. → [Springer meta-analysis](https://link.springer.com/article/10.1007/s10648-023-09823-4); [primary-school rubric self-assessment study](https://www.sciencedirect.com/science/article/pii/S2666374021000017)

**`A5-C12`** `[E4]` `[SECONDARY-SOURCED]` The **6+1 Trait** model (Education Northwest) scores ideas, organization, voice, word choice, sentence fluency, conventions, and presentation, with published rubrics for grades 3–12. One retrieved source asserts "interrater reliability of 97%." **Treat this figure with suspicion:** a bare percentage is almost certainly percent-agreement, not a chance-corrected reliability coefficient, and it was not traceable to a psychometric report in what was retrieved. → [Education Northwest rubrics PDF](https://educationnorthwest.org/sites/default/files/resources/traits-rubrics-3-12.pdf); [Boise State validity paper](https://scholarworks.boisestate.edu/cgi/viewcontent.cgi?article=1133&context=literacy_facpubs)

**`A5-C13`** `[E6]` `[SECONDARY-SOURCED]` The 6+1 Trait model has explicit critics; a retrieved paper is titled *"6-Traits Writing Rubric: Things That Make Us Smart Can Also Make Us Dumb."* Retrieved commentary also notes the traits omit synthesis and evidence, which matter in discipline-specific writing. → [Academia record](https://www.academia.edu/364993/6_Traits_Writing_Rubric_Things_That_Make_Us_Smart_Can_Also_Make_Us_Dumb)

---

### A.1.3 Established narrative-quality measurement approaches — what actually exists

This subsection exists because a product team will otherwise assume there is a validated "story quality score" available off the shelf. There is not one for the construct Character Studio cares about. There *are* validated instruments for adjacent, narrower constructs.

**`A5-C14`** `[E1]` `[SECONDARY-SOURCED]` **Narrative Scoring Scheme (NSS).** Scores narrative *macrostructure* across seven components (retrieved examples: introduction, character development, conflict resolution, conclusion) for a total maximum of 35. Retrieved properties study used **129 typically developing children aged 5–7** (→ B0–B1, grades K–3) producing **oral retells of a wordless picture book**; NSS correlated significantly with age and with microstructural measures. NSS scores from *Frog, Where Are You?* can be entered into SALT for comparison against the SALT reference database. → [AJSLP](https://pubs.asha.org/doi/10.1044/1058-0360(2009/08-0024))

> **Critical scope note:** NSS is an **oral retell** measure for young school-age children, normed on a *retell of a known stimulus*. It is not a measure of original written fiction by a grade-6 child. Repurposing it would be construct drift.

**`A5-C15`** `[E1]` `[SECONDARY-SOURCED]` **Index of Narrative Microstructure (INMIS)** — a clinical tool for analyzing school-age children's narrative microstructure performance. → [AJSLP](https://pubs.asha.org/doi/10.1044/1058-0360(2006/017))

**`A5-C16`** `[E1]` `[SECONDARY-SOURCED]` **Test of Narrative Language, 2nd ed. (TNL-2)** — a norm-referenced test of children's ability to understand and tell stories. Retrieved psychometric work on online administration found properties "generally in the good range" and not significantly different from in-person. It is a **clinical/diagnostic instrument**, published commercially. → [LSHSS](https://pubs.asha.org/doi/10.1044/2021_LSHSS-21-00129); [publisher](https://www.wpspublish.com/tnl-2-test-of-narrative-languagesecond-edition)

**`A5-C17`** `[E1]` `[SECONDARY-SOURCED]` **Narrative Assessment Protocol (NAP)** — evaluated on 262 children aged 3–5 (→ below B0) in preschool programs; reported "reasonable psychometric properties" with significant concurrent and predictive relations. Preschool scope. → [ScienceDirect / ECRQ](https://www.sciencedirect.com/science/article/abs/pii/S0885200609000933)

**`A5-C18`** `[E1]` `[SECONDARY-SOURCED]` **Curriculum-Based Measurement — Written Expression (CBM-WE).** Indices in common use at elementary level: total words written, words spelled correctly, **correct word sequences (CWS)**, and correct-minus-incorrect word sequences (CIWS). CWS was defined in the foundational work as *two adjacent, correctly spelled words that are acceptable within the context of the phrase to a native speaker of English*. → [Videen, Deno & Marston, ERIC ED225112](https://eric.ed.gov/?id=ED225112)

**`A5-C19`** `[E1]` `[SECONDARY-SOURCED]` CBM-WE indices have repeatedly shown validity and reliability as *indicators of writing proficiency* at elementary level, with retrieved reports of very high correlations between CWS and criterion measures including holistic ratings, and concurrent validity against the WIAT. → [ERIC ED225112](https://eric.ed.gov/?id=ED225112); [UWStout thesis](http://www2.uwstout.edu/content/lib/thesis/2003/2003diercksb.pdf)

> **Critical scope note:** CBM measures are deliberately designed as *cheap general-outcome indicators for screening and progress monitoring*, analogous to a thermometer. They were never designed to describe the quality of a story, and a high CWS count says nothing about whether a character is interesting.

**`A5-C20`** `[E1]` `[SECONDARY-SOURCED]` **Writing Assessment Measure (WAM)** — developed to reflect written-expression expectations under the National Curriculum for England and Wales. Retrieved evaluation used **97 children aged 7–11 (→ B1–B2, grades 2–5) in one urban primary school**, two prompts three weeks apart alongside a standardized written expression test; reported consistency over time and reliable scoring by different raters, with content validity supported by item-total correlations. **Single-school sample; treat generalization cautiously.** → [Dunsmuir & Kyriacou, *Assessing Writing*](https://www.sciencedirect.com/science/article/pii/S1075293514000385); [UCL Discovery](https://discovery.ucl.ac.uk/id/eprint/1457401/)

**`A5-C21`** `[E4]` `[SECONDARY-SOURCED]` Retrieved analytic rubrics that *do* name character as a scored dimension include a five-scale rubric (Theme, Character, Setting, Plot, Communication, each 1–6) applied to children's hypermedia narratives, and the NAPLAN narrative marking guide's ten categories (audience, text structure, ideas, **character and setting**, vocabulary, cohesion, paragraphing, sentence structure, punctuation, spelling). **`[UNVERIFIED]` for psychometrics:** searching for reliability/validity evidence for the five-scale instrument returned no psychometric report. → [ECRP](https://ecrp.illinois.edu/v5n1/mott.html)

**`A5-C22`** `[E1]` `[SECONDARY-SOURCED]` Narrative macrostructure develops measurably across early elementary: retrieved developmental work describes early narratives as simple and loosely organized, greater consistency of core story-grammar elements and clearer sequencing by grade 1, and emerging integration of multiple story-grammar components into causally connected narratives by grade 2 (→ B1). → [Frontiers in Education](https://www.frontiersin.org/journals/education/articles/10.3389/feduc.2026.1848759/full)

**`A5-C23`** `[E1]` `[SECONDARY-SOURCED]` In upper elementary, one retrieved study reported that **text length and story content did not increase with age, while syntactic complexity showed a clear developmental progression**, predicted by oral grammar, inhibition and planning. This directly undercuts length-as-growth. → [Reading and Writing / PMC5247531](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5247531/)

---

### A.1.4 Inter-rater reliability and validity when scoring children's writing

**`A5-C24`** `[E1]` `[SECONDARY-SOURCED]` A study of writing evaluation for **children in grades 3 and 4** (→ B1–B2) found scores **varied largely by task (30.44% and 28.61% of variance) rather than by rater.** → [Reading and Writing](https://link.springer.com/article/10.1007/s11145-017-9724-6); [ERIC ED602716](https://eric.ed.gov/?id=ED602716)

**`A5-C25`** `[E1]` `[SECONDARY-SOURCED]` The same work reported that reaching reliability of **0.90 required multiple tasks *and* multiple raters**, while **0.80 required a single rater but still multiple tasks** — and explicitly noted the implication that classroom and even some state accountability practice, which typically uses a single task and single rater, is under-reliable. → [Reading and Writing](https://link.springer.com/article/10.1007/s11145-017-9724-6)

> **This is the highest-leverage psychometric fact in Part A.** A single story cannot support a dependable judgment about a child's writing. Any Character Studio display implying otherwise is measurement malpractice regardless of how good the scorer is.

**`A5-C26`** `[E4]` `[SECONDARY-SOURCED]` Methods used to model rater variability in writing scoring include intraclass correlation, generalizability theory, and many-facet Rasch (FACETS); IRT frameworks are used to handle differences in rater severity and discrimination. → [IEJEE](https://iejee.com/index.php/IEJEE/article/download/1024/464/3844); [Academia FACETS overview](https://www.academia.edu/17178887/An_Overview_of_Inter_rater_reliability_Severity_and_Consistency_in_Scoring_Compositions_using_FACETS)

**`A5-C27`** `[E1]` `[SECONDARY-SOURCED]` **Text length confounds human quality judgment.** Retrieved review reports most studies find length–quality correlations in the range **r = 0.50 to 0.70**, and that number of words explained **39% of the variance in SAT essay scores**. Whether length is construct-relevant or judgment bias is described as "discussed controversially." Highly trained raters still showed a text-length effect beyond language proficiency. → [Frontiers in Psychology, *Is a Long Essay Always a Good Essay?*](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2020.562462/full); [PMC7544919](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7544919/)

---

### A.1.5 Automated writing evaluation / automated essay scoring — the candid version

**`A5-C28`** `[E1]` `[SECONDARY-SOURCED]` AWE **can** move measured writing outcomes. Zhai & Ma (2023), *The Effectiveness of Automated Writing Evaluation on Writing Quality: A Meta-Analysis* (Journal of Educational Computing Research), reported a large overall effect on writing quality, **g = 0.861, p < .001, across 26 studies**. → [SAGE](https://journals.sagepub.com/doi/10.1177/07356331221127300)

**`A5-C29`** `[E1]` `[SECONDARY-SOURCED]` A separate multi-level meta-analysis (Frontiers in Artificial Intelligence, 2023) reported a **medium effect, g = 0.55**, of automated feedback on writing performance, and stressed **significant heterogeneity — "the use of automated feedback tools cannot be understood as a single consistent form of intervention."** → [Frontiers in AI](https://www.frontiersin.org/journals/artificial-intelligence/articles/10.3389/frai.2023.1162454/full); [PMC10351274](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10351274/)

**`A5-C30`** `[E1]` `[SECONDARY-SOURCED]` Moderators matter: retrieved summary reports AWE was more effective for post-secondary than secondary students and more beneficial for EFL/ESL than native-English-speaker learners. **Grades 2–8 are outside the population where the largest effects were observed.** → [SAGE](https://journals.sagepub.com/doi/10.1177/07356331221127300)

**`A5-C31`** `[E6]` `[UNVERIFIED attribution]` A retrieved summary listed effect sizes "greater than zero for writing quality (d = 0.52), length (d = 0.48), development/organization (d = 0.66), mechanical correctness (d = 0.61), motivation to write (d = 1.42), preference for word processing (d = 0.64)" **without a resolvable attribution in the retrieved results.** Searched for the originating meta-analysis; could not tie it to a specific paper. **Do not cite these numbers.** Listed here only so a future reviewer recognizes them as unattributed if they resurface.

**`A5-C32`** `[E1]` `[SECONDARY-SOURCED]` **Construct validity is the core criticism.** Retrieved sources identify both **construct irrelevance** (the machine scores things that are not writing quality) and **construct underrepresentation** (the machine cannot score much of what writing quality is) as threats underlying automated scoring. → [Assessing Writing / ScienceDirect](https://www.sciencedirect.com/science/article/pii/S1075293526000541)

**`A5-C33`** `[E1]` `[SECONDARY-SOURCED]` **Documented bias, and it is not hypothetical.** A retrieved fairness study reported **GPT-4o exhibited no substantial bias by gender or socioeconomic status, but significant bias by race/ethnicity — assigning unexpectedly higher scores to essays from the Asian/Pacific Islander group and lower scores to essays by the Hispanic/Latino group.** → [Assessing Writing, *Assessing fairness in AI-assisted writing scoring*](https://www.sciencedirect.com/science/article/pii/S1075293526000541)

**`A5-C34`** `[E1]` `[SECONDARY-SOURCED]` Bias has been examined specifically for **elementary-age English language learners** — a retrieved paper is titled *Validity of automated essay scores for elementary-age English language learners: Evidence of bias?* This is exactly Character Studio's population. → [Assessing Writing](https://www.sciencedirect.com/science/article/abs/pii/S1075293524000084)

**`A5-C35`** `[E1]` `[SECONDARY-SOURCED]` Training-data provenance is named as the mechanism: retrieved review states automated scoring accuracy is intrinsically linked to training datasets "frequently plagued by sampling biases, measurement errors, and historical or societal prejudices," and that AES algorithms tend to optimize accuracy at the expense of fairness. → [PMC8460059, systematic literature review](https://pmc.ncbi.nlm.nih.gov/articles/PMC8460059/)

**`A5-C36`** `[E1]` `[SECONDARY-SOURCED]` Monolingual bias is documented in writing assessment generally, and AI scoring specifically has been studied for disparities toward English Language Learners driven by unbalanced training data. Retrieved reports also note **AI-generated scores clustered mid-range while teacher scores spread more evenly across the scale** — i.e. the machine compresses the distribution. → [Springer, *AI Bias on ELLs in Automatic Scoring*](https://link.springer.com/chapter/10.1007/978-3-031-98462-4_34); [arXiv 2505.10643](https://arxiv.org/abs/2505.10643); [WCER](https://wcer.wisc.edu/news/detail/risks-of-ai-scoring-tools-for-writing-by-multilingual-learners)

**`A5-C37`** `[E6]` `[SECONDARY-SOURCED — vendor blog]` A retrieved **commercial vendor blog** asserts that automated systems score poorly on writing that is "intentionally creative or experimental," e.g. poems or deliberately fragmented narratives, penalizing intentional rhetorical choices. This is a mechanistically plausible and widely repeated claim but the source is a company selling grading software; **it is flagged, not endorsed.** Searched for a peer-reviewed demonstration specific to children's creative writing; none retrieved. → [GraideMind blog](https://graidemind.com/blog/automated-essay-scoring-validity-research)

**`A5-C38`** `[E4]` `[UNVERIFIED content]` The classic adversarial-validity study in this space is **Powers et al., *Stumping E-Rater: Challenging the Validity of Automated Essay Scoring* (ETS Research Report RR-01-03)**. The URL was retrieved; **the content was not** (ets.org blocked). Title and existence confirmed only. → [ETS RR-01-03 PDF](https://www.ets.org/Media/Research/pdf/RR-01-03-Powers.pdf)

**`A5-C39`** `[E1]` `[SECONDARY-SOURCED]` **LLM-as-judge does not solve this.** Retrieved evaluation reports **~58% agreement between LLM judges and human ratings on creative writing**, notably lower than on objective tasks; known **positional bias** requiring permuted-order averaging; small and open-source judges failing on creative writing; and some models systematically scoring model-generated text above human text. A structural ceiling is also noted: *a judge cannot exceed inter-rater agreement on the underlying task.* → [arXiv 2606.19544, *Reliability without Validity*](https://arxiv.org/html/2606.19544v1); [arXiv 2507.00769](https://arxiv.org/pdf/2507.00769)

**`A5-C40`** `[E1]` `[SECONDARY-SOURCED]` Teachers do not reliably catch machine errors in the direction that matters. A retrieved study found teachers actively rejected and corrected *lenient* algorithmic scores, but **accepted harsh grading mistakes**; the corrective pattern was strongest among younger, more educated, more tech-confident teachers. → [Frontiers in Psychology, automation bias in teachers' evaluation of student writing](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2026.1889402/full); [PsyPost summary](https://www.psypost.org/teachers-say-they-distrust-ai-but-still-accept-its-harsh-grading-mistakes-study-finds/)

> **Reading for product:** an automated score that is unfairly *low* for a multilingual child is the failure mode least likely to be caught by the human in the loop. That is the exact intersection of `A5-C33`, `A5-C34`, `A5-C36` and `A5-C40`.

---

### A.1.6 Assessing creativity and character quality — the honest answer is "poorly"

**`A5-C41`** `[E2]` `[E1]` `[SECONDARY-SOURCED]` The **Consensual Assessment Technique (CAT)** (Amabile, 1982) has independent judges rate products for creativity using their own tacit definitions. It is described in retrieved sources as reliable, valid, and "often considered the gold standard of creativity assessment." → [HBS record](https://www.hbs.edu/faculty/Pages/item.aspx?num=7355); [SciSpace overview](https://scispace.com/pdf/amabile-s-consensual-assessment-technique-why-has-it-not-4o93phkmls.pdf)

**`A5-C42`** `[E1]` `[SECONDARY-SOURCED]` **CAT's reliability claim is narrower than it sounds.** Retrieved work (Barth et al., 2021, *Journal of Creative Behavior*, *Creativity Assessment over Time*) states the inter-rater reliability traditionally reported for CAT **cannot capture time-sampling error**, a relevant error source for many applications. → [Wiley](https://onlinelibrary.wiley.com/doi/full/10.1002/jocb.462)

**`A5-C43`** `[E1]` `[SECONDARY-SOURCED]` CAT is **not automatable**: retrieved sources describe it as depending on extensive human annotation, "unscalable and ill-suited for automated evaluation." → [arXiv 2411.02316](https://arxiv.org/pdf/2411.02316)

**`A5-C44`** `[E1]` `[SECONDARY-SOURCED]` **How many raters a story needs:** retrieved work on children's story creativity reports **at least 5 non-expert ratings per story as the minimum for reliable creativity judgments by non-experts.** → [Learning and Instruction, *What is creative in childhood writing?*](https://www.sciencedirect.com/science/article/pii/S1041608025000019)

**`A5-C45`** `[E1]` `[SECONDARY-SOURCED]` The same line of work reports that **computationally measured linguistic characteristics — length, grammar, originality, lexical diversity, divergent semantic integration — explain much of the variance in subjective human-rated creativity scores**, and that automated measures can *complement* but not replace human creativity ratings. → [Learning and Instruction](https://www.sciencedirect.com/science/article/pii/S1041608025000019)

> **Read `A5-C45` twice.** It cuts both ways. It means a machine can partly predict human creativity ratings — *and* it means human creativity ratings are substantially predicted by length and lexical diversity, which is uncomfortable evidence that human "creativity" ratings are themselves partly a length-and-vocabulary judgment (cf. `A5-C27`).

**`A5-C46`** `[E1]` `[SECONDARY-SOURCED]` A systematic literature search of empirical work 2000–2020 on assessing creativity in narrative writing screened **1,796 papers down to 97** for full-text scrutiny and concluded there is **a gap in the literature regarding assessment of creativity in writing for most of the major narrative genres**, with relatively few studies identifying characteristics of creativity in writing and **further research needed to produce a framework for classroom assessment purposes.** → [Thinking Skills and Creativity](https://www.sciencedirect.com/science/article/pii/S1871187121001644)

**`A5-C47`** `[E1]` `[SECONDARY-SOURCED]` Frequency-based originality scoring is unstable in exactly this population: retrieved work on children and adolescents found **reliability of originality scores increased with fluency and was partly explainable by participant age** — i.e. the "originality" score is entangled with how much the child produced and how old they are. → [Thinking Skills and Creativity](https://www.sciencedirect.com/science/article/abs/pii/S1871187121000663)

**`A5-C48`** `[E6]` `[SECONDARY-SOURCED]` Retrieved instruments for creativity in story writing propose dimensions such as imagination, originality, different perspective, content, language and expression, and form. **No psychometric consensus was retrievable.** Searched for a validated child-narrative creativity scale with published reliability and norms; none found. `[UNVERIFIED]` → [ERIC EJ1429271](https://files.eric.ed.gov/fulltext/EJ1429271.pdf)

**`A5-C49`** `[E1]` `[E2]` `[SECONDARY-SOURCED]` **Measuring creativity can destroy it.** Amabile's social-psychology-of-creativity line reports that **the expectation of evaluation severely undermines intrinsic motivation and creativity of performance across the entire age span, from preschoolers to professionals**; that **expected evaluation is the most deleterious extrinsic constraint of all**, plausibly because it combines the other "killers" (expected reward, competition, **surveillance**, time limits); and that these effects appear even when a **computer** is the source of the reward/evaluation. Retrieved sources also note a **developmental trend in which older children were more adversely affected than younger children**, and that children could be partly "immunized" against these effects. → [Springer chapter](https://link.springer.com/chapter/10.1007/978-1-4615-0801-4_3); [Amabile, contracted-for reward PDF](http://people.whitman.edu/~herbrawt/classes/390/Amabile.pdf); [Ruscio & Amabile PDF](https://ruscio.pages.tcnj.edu/files/2016/08/Ruscio-Amabile-1996-How-Does-Creativity-Happen.pdf)

> **This is the load-bearing claim of the entire document.** A creativity score, shown to a child, *is* an expectation of evaluation, delivered by a computer, under surveillance — four of Amabile's named killers at once. And the harm is reported to be **larger for older children**, i.e. worse for grades 6–8 than for grades 2–3.

#### Summary judgment on Part A's hardest question

**Is creativity / character quality reliably measurable in children's narrative writing at classroom scale? No.** `A5-C42`–`A5-C48` establish that: the field's gold-standard method is unscalable and does not model time-sampling error; the minimum for reliable non-expert judgment is ~5 raters *per story*; the assessment-of-creativity-in-narrative-writing literature explicitly reports itself as lacking a classroom framework; originality scores are confounded with fluency and age; and no validated child-narrative creativity instrument with norms was retrievable. Combined with `A5-C25` (a single task cannot support a dependable writing judgment even for ordinary writing quality) and `A5-C49` (evaluation expectation undermines the very thing being measured), **the responsible product conclusion is that Character Studio must not produce a creativity score at all.**

---

### A.1.7 Growth and progress monitoring in writing

**`A5-C50`** `[E1]` `[SECONDARY-SOURCED]` CBM-W slope studies: for **grades 2–3 (B1)** a linear model with random effects on intercept and slope fit best; for **grades 4–5 (B2)** growth trends varied with the number of weeks and the scoring procedure, and the point at which slopes differed significantly from zero varied by scoring procedure and grade. → [Reading and Writing](https://link.springer.com/article/10.1007/s11145-017-9766-9)

**`A5-C51`** `[E1]` `[SECONDARY-SOURCED]` Technical adequacy of writing progress monitoring is task-dependent: retrieved summary reports longer durations had stronger technical adequacy for older students, more complex scoring procedures had stronger technical adequacy for all students, and **narrative writing appeared most promising in terms of technical adequacy across grades.** → [Reading and Writing](https://link.springer.com/article/10.1007/s11145-017-9766-9)

**`A5-C52`** `[E1]` `[SECONDARY-SOURCED]` Growth rates are small and slow relative to any single session. A retrieved word-dictation progress-monitoring study reported students gaining **an average of 0.91 correct letter sequences per additional week of instruction.** → [Assessment for Effective Intervention / SAGE](https://journals.sagepub.com/doi/10.1177/15345084231182718)

> **Reading for product:** the unit of real writing growth is *weeks to months*, and it is only visible across *repeated comparable tasks*. Session-to-session deltas in a creative tool are noise.

**`A5-C53`** `[E1]` `[SECONDARY-SOURCED]` Retrieved CBM-W work also reports **gender related to intercept and slope** for CWS and CIWS in grades 2–3 and 4–5, and writing-motivation work reports girls produced texts judged higher quality, viewed writing more positively, and were more efficacious about self-regulating writing. Any growth display that does not account for this risks encoding a demographic pattern as an individual judgment. → [Reading and Writing](https://link.springer.com/article/10.1007/s11145-017-9766-9); [Frontiers in Psychology, grade-2 efficacy/attitude study](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2023.1265785/full)

**`A5-C54`** `[E1]` `[SECONDARY-SOURCED]` Writing self-efficacy has a validated four-factor structure (ideation, conventions, self-regulation, revision) in grades 4–9 (→ B2–B4); retrieved work reports **writing self-efficacy remained stable through upper-elementary but declined significantly in middle school**, and a broader significant decline in autonomous motivation to read and write in and outside school. → [Reading and Writing, Chinese grades 4–9 scale](https://link.springer.com/article/10.1007/s11145-026-10790-9); [PMC7399692, SDT mapping grades 3–8](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7399692/)

**`A5-C55`** `[E1]` `[SECONDARY-SOURCED]` Portfolio assessment tracks growth but its psychometrics are conditional: retrieved sources state validity "depends on the purpose" and that no general pronouncement is possible; moderate inter-rater reliability **may increase if the portfolio spans a longer period and contains more component pieces**, and requires explicit definition of contents, rater training, and consistent procedures. → [THEA research repository](https://research.thea.ie/bitstream/handle/20.500.12065/1078/Portfolio%20Is%20it%20a%20valid%20and%20reliable%20instrument%20for%20academic%20writing%20skills.pdf); [ERIC EJ659736](https://eric.ed.gov/?id=EJ659736)

**`A5-C56`** `[E1]` `[SECONDARY-SOURCED]` For context on what actually moves writing: Graham, McKeown, Kiuhara & Harris (2012), *A Meta-Analysis of Writing Instruction for Students in the Elementary Grades* (Journal of Educational Psychology), located 115 documents and computed weighted effects for 13 interventions, including **strategy instruction ES = 1.02, adding self-regulation to strategy instruction ES = 0.50, text structure instruction ES = 0.59, creativity/imagery instruction ES = 0.70**; grammar instruction was the non-significant exception among the explicit-teaching categories. → [ERIC EJ994038](https://eric.ed.gov/?id=EJ994038)

**`A5-C57`** `[E1]` `[SECONDARY-SOURCED]` **Peer assistance is consistently positive but the exact magnitude is unstable across meta-analyses.** Retrieved values for peer assistance/feedback ranged across roughly **0.59, 0.88, 0.89 and 0.92** in different analyses and grade bands. Report the direction, not a number. → [Graham et al. elementary meta-analysis](https://eric.ed.gov/?id=EJ994038); [grades 6–12 meta-analysis record](https://www.researchgate.net/publication/374364086_A_meta-analysis_of_writing_treatments_for_students_in_grades_6-12)

**`A5-C58`** `[E1]` `[SECONDARY-SOURCED]` Teachers have very little time for this. Retrieved national surveys report **grades 4–6 teachers teaching writing ~15 minutes/day with students writing ~25 minutes/day at paragraph length or longer**; primary-grade teachers reporting students writing ~35 minutes/day with ~1 hour/day of writing instruction *mostly devoted to mechanics, grammar and usage*; **almost two-thirds of elementary teachers reporting their teacher-education courses gave them little preparation to teach writing**; and Australian primary teachers reporting on average under three hours per week of writing practice. → [Teaching Writing to Elementary Students in Grades 4–6: A National Survey](https://www.journals.uchicago.edu/doi/abs/10.1086/651193); [Primary Grade Writing Instruction: A National Survey](https://www.researchgate.net/publication/232602527_Primary_Grade_Writing_Instruction_A_National_Survey); [PMC9069425, Australian national survey](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9069425/)

---

## A.2 WHAT CHARACTER STUDIO SHOULD DO

**Confidence key for product rules:** `HIGH` = multiple converging claims, low ambiguity · `MEDIUM` = supported but with evidence gaps · `LOW` = reasoned extrapolation, revisit with data.

### A.2.1 The four assessment prohibitions

| # | Rule | Supported by | Confidence |
|---|---|---|---|
| **P1** | **Character Studio MUST NOT compute, store, or display a creativity score, an originality score, or a "character quality" score for any child's work — for anyone, including internally.** | `A5-C42`–`A5-C49` | **HIGH** |
| **P2** | **Character Studio MUST NOT produce a summative writing-quality judgment from a single story or single session.** | `A5-C24`, `A5-C25`, `A5-C51`, `A5-C52` | **HIGH** |
| **P3** | **Character Studio MUST NOT apply automated essay scoring to child work for any consequential purpose** (grades, placement, flagging to admins, reports home). | `A5-C32`–`A5-C40` | **HIGH** |
| **P4** | **Character Studio MUST NOT present word count, length, or session count as a proxy for quality, effort, growth, or creativity, anywhere in any UI.** | `A5-C23`, `A5-C27`, `A5-C45`, `A5-C47` | **HIGH** |

**Rationale for P1 in one line:** the construct is not reliably measurable at scale (`A5-C46`, `A5-C48`), needs ~5 raters per story even for non-expert reliability (`A5-C44`), and the act of scoring it is itself documented to damage it, worse in older children (`A5-C49`).

**Rationale for P4:** length correlates r ≈ .50–.70 with human quality ratings (`A5-C27`) which makes it *look* like a quality signal, while a developmental study found length did **not** increase with age even as syntactic complexity did (`A5-C23`). A length metric is therefore a Goodhart trap that also fails as a growth indicator.

### A.2.2 What Character Studio MAY do instead — descriptive, not evaluative

```
RULE A-1 (Descriptive-not-evaluative)
IF the system surfaces any information about a child's writing
THEN it MUST be describable as a NOUN the child chose or an ACTION the child took
     ("you gave Mira a fear of water", "you revised this scene 3 times")
AND MUST NOT be describable as a JUDGMENT of the child or the work
     ("strong characterization", "creativity: 7/10", "below expectations")
```

```
RULE A-2 (Task-count gate on any longitudinal statement)
IF the system would display any statement about change over time
THEN require N_comparable_tasks >= 3 AND elapsed_time >= 6 weeks
ELSE display nothing.
```
> **DESIGN DECISION:** the specific values `3` and `6 weeks` are **invented**. They are chosen to be conservative relative to `A5-C25` (multiple tasks needed even for 0.80) and `A5-C52` (growth measured in ~1 unit/week on a fine-grained index). They are not derived from a study of this product. **Flagged for empirical replacement.**

```
RULE A-3 (Feedback stays at the task level)
Any AI-generated feedback string MUST reference the TEXT or the CHARACTER.
It MUST NOT reference the CHILD's ability, identity, trajectory, or comparison to others.
  ALLOWED:  "Mira says she's not scared, but she's hiding. Is that on purpose?"
  BANNED:   "You're getting better at showing feelings."
  BANNED:   "You're a level 3 character-builder."
```
Grounded in `A5-C05` — feedback effectiveness falls as attention moves from task toward self, and >1/3 of feedback interventions in the Kluger & DeNisi corpus reduced performance.

```
RULE A-4 (Optional, teacher-owned rubric — never system-owned)
IF an educator wants rubric-based assessment
THEN Character Studio MAY provide a BLANK analytic rubric scaffold and let the
     educator author or import their own criteria (incl. their state's standards),
AND the scoring is performed BY THE EDUCATOR,
AND Character Studio MUST NOT pre-fill, suggest, or auto-score any cell.
```
Grounded in `A5-C06`–`A5-C08` (no rubric type is superior; holistic agreement can mask criterion disagreement) and `A5-C09`–`A5-C11` (rubrics help, but implementation is the active ingredient), and in Part C's requirement that standards vary by jurisdiction.

```
RULE A-5 (Child-owned rubric self-assessment is permitted and encouraged)
Children MAY self-assess against a simple, child-authored or child-selected checklist.
Results are PRIVATE TO THE CHILD by default.
Sharing with the teacher requires an explicit per-instance child action.
```
Grounded in `A5-C09`, `A5-C10` (self-assessment with rubrics improved elementary writing) and `A5-C04` (self-feedback ES 0.62 exceeded computer feedback ES 0.38).

### A.2.3 If the team insists on automated analysis anyway — containment rules

If product leadership overrides P1/P3, these are the minimum containment conditions. They are *harm reduction*, not endorsement.

| Condition | Requirement | Source |
|---|---|---|
| C-1 | Output may never be shown to a child. | `A5-C49` |
| C-2 | Output may never be shown to an administrator, parent, or anyone outside the child's own teacher. | `A5-C49`, and Part B `A5-C68` |
| C-3 | Output must be framed to the teacher as *a machine guess to check*, with a one-tap "this is wrong" control that is logged. | `A5-C40` |
| C-4 | The system must be evaluated for differential performance by race/ethnicity, English-learner status, and disability status **before launch**, and results published internally. | `A5-C33`, `A5-C34`, `A5-C36` |
| C-5 | If differential performance is found and not remediated, the feature does not ship. | `A5-C33`–`A5-C36` |
| C-6 | Never route creative/experimental writing through a scorer trained on conventional prose without demonstrating it does not penalize deliberate rule-breaking. | `A5-C37` (flagged as vendor-sourced), `A5-C32` |
| C-7 | No LLM-as-judge output may be treated as a measurement. Positional bias and ~58% human agreement on creative writing place it below the threshold for any consequential use. | `A5-C39` |

### A.2.4 Assessment-facing copy the UI must never use

| Banned string pattern | Why |
|---|---|
| "creativity score", "originality score", "imagination level" | `A5-C46`, `A5-C48` — construct has no validated classroom instrument |
| "your best story yet", "stronger than last time" | `A5-C25`, `A5-C52` — single-task comparison is unreliable |
| "X words — great job!" | `A5-C27`, `A5-C04` — rewards length, a known confound |
| "above/below grade level" | `A5-C25`, and Part C: standards are jurisdiction-specific |
| "top 10% of your class" | Part B `A5-C71`, `A5-C72` — ranking on creative work |
| any percentile, stanine, or normative band on creative output | `A5-C46`, `A5-C49` |

---
---

# PART B — EDUCATOR-FACING ANALYTICS & DASHBOARDS

## B.1 WHAT RESEARCH SAYS

### B.1.1 What makes a dashboard actionable vs. decorative

**`A5-C59`** `[E1]` `[SECONDARY-SOURCED]` The evidence base for learning analytics dashboards improving learning is weak. Retrieved systematic reviews state that **"evidence about whether learning analytics and LADs improve learning in practice is scarce"**, with recurring limitations: **small-scale evaluations, limited causal evidence linking predictions to interventions, and weak deployment in real classroom contexts.** → [Journal of Learning Analytics systematic review](https://learning-analytics.info/index.php/JLA/article/view/8093); [IJETHE checklist paper](https://educationaltechnologyjournal.springeropen.com/articles/10.1186/s41239-023-00394-6)

**`A5-C60`** `[E1]` `[SECONDARY-SOURCED]` The central design failure is named directly: **"most dashboards are designed to increase teachers' awareness but with limited actionable insights to allow intervention."** Awareness without a next action is the definition of decorative. → [JLA, instructor use and sensemaking](https://learning-analytics.info/index.php/JLA/article/view/7961)

**`A5-C61`** `[E1]` `[SECONDARY-SOURCED]` Dashboard usefulness is context-conditional: retrieved work reports that the data sources available in a given context "condition the accuracy, relevance, interpretability and actionability" of the analytics, and affect the user's **sense of agency and trust**. → [IJETHE](https://educationaltechnologyjournal.springeropen.com/articles/10.1186/s41239-021-00313-7)

**`A5-C62`** `[E1]` `[SECONDARY-SOURCED]` Customization to the teacher's own context **increased effort but also increased relevance, understanding, and actionability** in a retrieved study — a genuine tradeoff, not a free win. → [IJETHE](https://educationaltechnologyjournal.springeropen.com/articles/10.1186/s41239-023-00394-6)

**`A5-C63`** `[E1]` `[SECONDARY-SOURCED]` K-12 learning analytics is characterized as **still tending "to focus more on students' behavior, instead of the actual learning process, development in students' knowledge and understanding."** → [PMC10881331, review of LA opportunities and challenges for K-12](https://pmc.ncbi.nlm.nih.gov/articles/PMC10881331/)

---

### B.1.2 What teachers actually do with dashboards — and the interpretation gap

**`A5-C64`** `[E1]` `[SECONDARY-SOURCED]` **The most alarming retrieved finding in Part B: "less than half, and as little as 11%, of educators' interpretations of data are accurate."** Retrieved from a peer-reviewed review of learning analytics for K-12 education. → [PMC10881331](https://pmc.ncbi.nlm.nih.gov/articles/PMC10881331/)

> This claim is important enough that it should be a **hard verification priority** for a human reviewer with full-text access. If it holds, it means the modal effect of adding a metric to a K-12 dashboard is to add a *misinterpretation*, not an insight.

**`A5-C65`** `[E1]` `[SECONDARY-SOURCED]` Where teachers do use dashboard data productively, retrieved uses are: **differentiation, identifying learning gaps, fine-tuning assessments, and providing feedback to students.** Note all four are *instructional* uses, not *evaluative* uses of individual children. → [CITE Journal](https://citejournal.org/volume-14/issue-4-14/science/data-driven-decision-making-facilitating-teacher-use-of-student-data-to-inform-classroom-instruction/)

**`A5-C66`** `[E1]` `[SECONDARY-SOURCED]` A documented capability gap: **teachers "are not taught how to use extensive data (i.e., multiple data sets) to reflect on student progress or to differentiate instruction."** Retrieved work also states teacher use of education dashboards is "greatly understudied." → [ERIC EJ1277061, Teachers' Use of Education Dashboards and Professional Growth](https://files.eric.ed.gov/fulltext/EJ1277061.pdf)

**`A5-C67`** `[E1]` `[SECONDARY-SOURCED]` Barriers to K-12 adoption identified in retrieved mixed-methods work include **teacher skepticism about the value of learning analytics and lack of data literacy**; teachers reported openness to adoption *if institutional support were provided.* → [TechTrends](https://link.springer.com/article/10.1007/s11528-025-01045-5); [Technology, Knowledge and Learning qualitative study](https://link.springer.com/article/10.1007/s10758-025-09847-5)

**`A5-C68`** `[E6]` `[SECONDARY-SOURCED]` There is an explicit critical literature on dashboards as *governance* rather than pedagogy — retrieved title: *"The dashboard school: governing teachers, students and parents in the data-driven school."* The critique is that dashboards restructure accountability relationships, not just information flow. → [Discourse: Studies in the Cultural Politics of Education](https://www.tandfonline.com/doi/full/10.1080/01596306.2025.2519383)

**`A5-C69`** `[E1]` `[SECONDARY-SOURCED]` Retrieved work on **implicit assumptions and bias in learning analytics** warns that biases in both the creation *and the interpretation* of analytics have negative equity implications, and that "algorithms with biases risk harming individuals or student groups exhibiting behaviors or characteristics that can be misinterpreted or assigned unwarranted causality." → [PMC10881331](https://pmc.ncbi.nlm.nih.gov/articles/PMC10881331/)

---

### B.1.3 Surveillance effects on students

**`A5-C70`** `[E1]` `[SECONDARY-SOURCED]` The Center for Democracy & Technology's student-monitoring research reports, among students whose schools use monitoring software:
- **58% agree with "I do not share my true thoughts or ideas because I know what I do online is being monitored."**
- **80% report being more careful about what they search for online.**
- **71% of parents and 66% of teachers** agree students are less likely to be open and expressive in sharing personal thoughts and ideas online when monitoring software is used.
- **47% of teachers and 51% of parents** are concerned monitoring could have unintended consequences such as "outing" LGBTQ+ students.

→ [CDT, *Online and Observed*](https://cdt.org/wp-content/uploads/2021/09/Online-and-Observed-Student-Privacy-Implications-of-School-Issued-Devices-and-Student-Activity-Monitoring-Software.pdf); [CDT, *Hidden Harms*](https://cdt.org/wp-content/uploads/2022/08/Hidden-Harms-The-Misleading-Promise-of-Monitoring-Students-Online-Research-Report-Final-Accessible.pdf); [CDT, chilling effect](https://cdt.org/insights/the-chilling-effect-of-student-monitoring-disproportionate-impacts-and-mental-health-risks/)

> **This is a direct, quantified threat to Character Studio's core value proposition.** A tool for imaginative self-expression in which children believe they are watched will get less imaginative self-expression. `A5-C70` and `A5-C49` (surveillance is one of Amabile's named creativity killers) point the same direction from two independent literatures.

**`A5-C71`** `[E1]` `[SECONDARY-SOURCED]` Chilling effects are **not evenly distributed**: retrieved analysis states youth, women, and minority communities are disproportionately impacted, partly because of more fraught relationships with institutions, and that **students in higher-poverty districts are subjected to a higher degree of monitoring** than students in wealthier districts. → [CDT chilling-effect analysis](https://cdt.org/insights/the-chilling-effect-of-student-monitoring-disproportionate-impacts-and-mental-health-risks/)

**`A5-C72`** `[E1]` `[SECONDARY-SOURCED]` Monitoring can reveal sensitive personal information (retrieved example: sexual orientation) and chill free expression, political organizing, and discussion of mental health. → [Stanford Law Review, *The Surveilled Student*](https://review.law.stanford.edu/wp-content/uploads/sites/3/2024/10/Citron-76-Stan.-L.-Rev.-1439.pdf); [CDT](https://cdt.org/insights/the-chilling-effect-of-student-monitoring-disproportionate-impacts-and-mental-health-risks/)

---

### B.1.4 Over-quantification, proxy metrics, and Goodhart-style distortion

**`A5-C73`** `[E2]` `[SECONDARY-SOURCED]` **Goodhart's law:** "When a measure becomes a target, it ceases to be a good measure," after Charles Goodhart's 1975 monetary-policy article. → [ModelThinkers](https://modelthinkers.com/mental-model/goodharts-law)

**`A5-C74`** `[E2]` `[SECONDARY-SOURCED]` **Campbell's law is the education-specific amplification.** Retrieved quotation of Campbell (1976): *"Achievement tests may well be valuable indicators of general school achievement under conditions of normal teaching aimed at general competence. But when test scores become the goal of the teaching process, they both lose their value as indicators of educational status and distort the educational process in undesirable ways."* → [NN/g on Campbell's law](https://www.nngroup.com/articles/campbells-law/)

**`A5-C75`** `[E2]` `[E6]` `[SECONDARY-SOURCED]` The **datafication** critique holds that platforms rely on easily quantifiable results and standardized comparisons while overlooking dimensions of learning, and that these metrics, "frequently glorified as objective measures, reflect and reinforce particular assumptions about learning and how it should be demonstrated." Retrieved sources tie this to Biesta's "learnification" and to the claim that **"too much surveillance and summative judgement may reduce innovation and creativity in teaching design and practice."** → [Postdigital Science and Education](https://link.springer.com/article/10.1007/s42438-020-00109-4); [Teaching in Higher Education](https://www.tandfonline.com/doi/full/10.1080/13562517.2020.1748811); [datafication of student engagement and children's digital rights](https://www.sciencedirect.com/science/article/pii/S2666557324000296)

**`A5-C76`** `[E1]` `[SECONDARY-SOURCED]` **The specific proxy risk for this product is word count**, because `A5-C27` shows length correlates .50–.70 with human quality judgment. That is precisely the condition under which a proxy is dangerous: strong enough to look valid, causally wrong. Combined with `A5-C23` (length did not increase with age while syntactic complexity did), a word-count metric would reward a behaviour that is not development.

---

### B.1.5 Teacher workload and alert fatigue

**`A5-C77`** `[E4]` `[SECONDARY-SOURCED — non-education sources]` Alert fatigue is well characterized outside education: excessive or low-relevance alerts diminish the ability to see critical issues; response times slow **including for genuinely urgent alerts**; teams lose trust in the monitoring system. Retrieved sources are operations/security vendors, not education research. → [Atlassian](https://www.atlassian.com/incident-management/on-call/alert-fatigue); [Datadog](https://www.datadoghq.com/blog/best-practices-to-prevent-alert-fatigue/)

**`A5-C78`** `[E5]` `[SECONDARY-SOURCED — vendor claim, treat with caution]` A **vendor blog** (a student-monitoring company, i.e. an interested party) asserts that peer-reviewed research on school online-monitoring companies found **71% used AI for automated flagging of "concerning activity" while only 43% reported having human review teams**, and that most tools generate alerts faster than schools can review them. **Sourced from a company selling the competing product; not independently verified.** `[UNVERIFIED]` as to the underlying peer-reviewed study. → [Lightspeed Systems blog](https://www.lightspeedsystems.com/blog/false-positives-and-the-student-safety-monitoring-gap-why-most-tools-miss-the-mark-and-what-lightspeed-does-instead/)

**`A5-C79`** `[E1]` `[SECONDARY-SOURCED]` Teacher capacity for writing specifically is extremely constrained — see `A5-C58`: ~15 min/day of writing instruction in grades 4–6, ~two-thirds of elementary teachers reporting minimal preparation to teach writing. **Any dashboard that adds review work is competing against a 15-minute budget.**

---

### B.1.6 What should NOT be surfaced to educators

Synthesis of the above, stated as findings rather than product rules:

**`A5-C80`** `[E1]` `[E2]` Surfacing per-child creative-quality judgments is contraindicated by: absence of a valid instrument (`A5-C46`, `A5-C48`), single-task unreliability (`A5-C25`), documented misinterpretation rates (`A5-C64`), documented algorithmic bias against the exact populations in scope (`A5-C33`, `A5-C34`, `A5-C36`), and the asymmetry that harsh machine errors go uncorrected (`A5-C40`).

**`A5-C81`** `[E1]` `[E2]` Surfacing behavioural surveillance data (time-on-task, idle time, keystroke/revision-by-revision replay, session frequency) is contraindicated by: the chilling-effect evidence (`A5-C70`–`A5-C72`), Amabile's surveillance finding (`A5-C49`), the K-12 LA critique that analytics over-focus on behaviour rather than learning (`A5-C63`), and Goodhart/Campbell (`A5-C73`, `A5-C74`).

**`A5-C82`** `[E1]` Surfacing *content-derived inferences about the child* (mood, wellbeing, home life, identity) from creative writing is contraindicated by `A5-C72` (monitoring reveals sensitive attributes such as sexual orientation), `A5-C70` (47% of teachers / 51% of parents already worry about outing LGBTQ+ students), and — separately and importantly — fiction is not testimony. A child writing a sad character is writing a sad character.

---

## B.2 WHAT CHARACTER STUDIO SHOULD DO

### B.2.1 METRIC WHITELIST — what Character Studio MAY measure and display

Every whitelisted metric must satisfy all four gates:
1. **Descriptive, not evaluative** (`RULE A-1`)
2. **Actionable** — a teacher can name the next instructional move (`A5-C60`)
3. **Not rankable** — cannot be ordered into a "better/worse" list of children
4. **Not a quality proxy** (`A5-C76`)

| # | Metric | Grain | Shown to | Why it passes | Claim support | Status |
|---|---|---|---|---|---|---|
| W1 | **Participation: has this child started / has anything saved** (binary, per assignment) | Child ✓ / Class roster | Purely operational; teacher needs to know who hasn't begun | `A5-C65` (differentiation), `A5-C60` | Validated need, trivial measure |
| W2 | **Character roster** — the characters this child has created, with names and child-authored descriptions | Per child | It is the child's own content, not a judgment of it | `A5-C65` | Content display, not a metric |
| W3 | **Which episodes a character appears in** (a link graph) | Per character | Structural fact; enables the teacher to follow a child's series | Part D `A5-C108`, `A5-C112` | Structural, not evaluative |
| W4 | **Revision occurred (yes/no) since last teacher view** | Per artifact | Tells the teacher there is something new to read | `A5-C60` | Operational |
| W5 | **Child-flagged "I want feedback on this"** | Per artifact | Child-initiated; inverts the surveillance relation | `A5-C70`, `A5-C71` | **Preferred primary signal** |
| W6 | **Child's own self-assessment, only if the child chose to share it** | Per artifact | Self-assessment has evidence; sharing is child-controlled | `A5-C09`, `A5-C10`, `A5-C04` | Opt-in only |
| W7 | **Aggregate, class-level, non-identified feature counts** (e.g. "18 of 24 characters in this class have a stated want") | **Class only, never per child** | Supports whole-class instructional decisions without individual judgment | `A5-C65`, `A5-C60` | **DESIGN DECISION** on which features to count — see below |
| W8 | **Standards coverage the *teacher* has mapped and *the teacher* has marked** | Per assignment | Educator-authored; product makes no claim | Part C `A5-C99`–`A5-C102` | Teacher-owned |
| W9 | **Safety/moderation events requiring adult attention** | Per event | Genuine duty-of-care signal | Part E `A5-C158`, `A5-C160` | Narrow, high-threshold — see E.2 |

**On W7 — the only genuinely analytical metric on this list.** Counting whether a character record has a stated want, a flaw, a relationship, etc., at **class aggregate level** is defensible because (a) it is a count of structural elements the child explicitly authored, not an inference; (b) it cannot rank children; (c) it maps to an instructional move ("we should do a mini-lesson on character motivation"). **Which features are counted is a DESIGN DECISION**, not a validated feature set — no retrieved instrument validates a "character completeness" construct (`A5-C21` is `[UNVERIFIED]` for psychometrics). Ship it as a *teacher-configurable* list, never a fixed rubric.

### B.2.2 METRIC BLACKLIST — what Character Studio MUST NOT measure or display

| # | Banned metric | Why banned | Claim support |
|---|---|---|---|
| B1 | Creativity score / originality score / imagination rating | No valid instrument; scoring damages the construct | `A5-C42`–`A5-C49` |
| B2 | Character-quality or characterization score | Same; `A5-C21` instruments lack retrievable psychometrics | `A5-C21`, `A5-C46` |
| B3 | Word count / character count as an achievement | Length is a confound, not development | `A5-C23`, `A5-C27`, `A5-C76` |
| B4 | Writing-quality grade or level from a single artifact | Single task cannot support it | `A5-C24`, `A5-C25` |
| B5 | Automated essay score of any kind, displayed | Bias against ELL and racial/ethnic groups; harsh errors uncorrected | `A5-C33`–`A5-C36`, `A5-C40` |
| B6 | Time-on-task, active-minutes, idle time | Behavioural surveillance; chilling effect; not learning | `A5-C49`, `A5-C63`, `A5-C70` |
| B7 | Keystroke logs, typing speed, backspace counts, revision replay | Maximal surveillance for minimal instructional value | `A5-C70`–`A5-C72`, `A5-C81` |
| B8 | Session frequency / streaks / "days active" | Engagement-as-target ⇒ Goodhart; also an evaluation cue | `A5-C73`, `A5-C74`, `A5-C49` |
| B9 | Any percentile, rank, stanine, or normative band on creative output | Ranking on creative work; social-comparison harms | `A5-C49`, `A5-C83`, `A5-C85` |
| B10 | Class leaderboards, "top stories", "most creative this week" | Documented motivational and social harms | `A5-C83`, `A5-C84` |
| B11 | Inferred mood, wellbeing, mental state, or home circumstances from story content | Fiction is not testimony; reveals sensitive attributes | `A5-C72`, `A5-C82` |
| B12 | Inferred identity attributes (sexual orientation, gender identity, religion, disability, immigration status) from any child content | Direct outing risk already feared by teachers and parents | `A5-C70`, `A5-C72` |
| B13 | Sentiment analysis over child creative writing surfaced to adults | Same as B11; also PPRA-adjacent (Part E `A5-C141`) | `A5-C82`, `A5-C141` |
| B14 | "Predicted" future performance or at-risk scores | Causal evidence linking prediction to intervention is absent | `A5-C59`, `A5-C69` |
| B15 | Comparison of a child to class average, on anything creative | Social comparison; anxiety | `A5-C83`, `A5-C85` |
| B16 | Growth/trend lines built from fewer than the `RULE A-2` minimum | Statistically meaningless at session grain | `A5-C25`, `A5-C52` |
| B17 | Teacher-facing "engagement score" composites | Composite of blacklisted inputs; opacity compounds misinterpretation | `A5-C64`, `A5-C69` |
| B18 | Any per-child metric visible to school/district administrators | Governance drift; teacher-level context is the only interpretable level | `A5-C68`, `A5-C64` |

**Supporting claims for the ranking bans:**

**`A5-C83`** `[E1]` `[SECONDARY-SOURCED]` Leaderboard research reports that leaderboards **can be socially threatening and reduce social engagement** for students who do not value competition; that students in lower ranks **can feel inadequate**; that public rankings can communicate a normative undervaluation of effort; and that points/rank/forced social comparison **shifted internally grounded extrinsic motivation to externally grounded extrinsic motivation, undermining intrinsic motivation.** One retrieved study reports gamifying lectures with a leaderboard **reduced female students' social engagement.** → [Journal of Computing in Higher Education](https://link.springer.com/article/10.1007/s12528-025-09438-4); [systematic review record](https://www.researchgate.net/publication/384632265_The_use_of_leaderboards_in_education_A_systematic_review_of_empirical_evidence_in_higher_education)

**`A5-C84`** `[E1]` `[SECONDARY-SOURCED]` Competition is one of Amabile's named creativity killers alongside expected reward, expected evaluation, surveillance, and time limits (`A5-C49`).

**`A5-C85`** `[E1]` `[SECONDARY-SOURCED]` Student-facing dashboards **"had negative impacts on learners because exposure to them induced social anxiety, especially when students were presented with how well their peers were doing compared to them"**, and dashboards "can elicit negative emotions in students." Effects varied by achievement-goal orientation and motivational profile — i.e. the students most likely to be harmed are not the ones designers imagine. → [Computers & Education](https://www.sciencedirect.com/science/article/abs/pii/S0360131520302839)

### B.2.3 Dashboard rules — grain, uncertainty, and anti-objectivity

```
RULE B-1 (Grain ceiling)
Per-child grain          → visible to that child's own teacher(s) and that child ONLY.
Class-aggregate grain    → visible to that class's teacher.
School/district grain    → NOTHING per-child. Only counts of usage at the licence level
                           (e.g. "how many classes are using Character Studio"),
                           containing no child-derived learning or creative signal.
```
Grounded in `A5-C68` (dashboards as governance), `A5-C64` (interpretation accuracy), `A5-C70`–`A5-C72` (surveillance harm scales with audience).

```
RULE B-2 (No number without a next move)
FOR each metric M proposed for the educator dashboard:
    IF a teacher cannot state, in one sentence, the instructional action M implies
    THEN M is decorative → DO NOT SHIP M.
```
Grounded in `A5-C60`. This is a shipping gate, not a guideline: it should be a required field in the spec for any new metric.

```
RULE B-3 (Uncertainty must be structural, not textual)
Character Studio MUST NOT communicate uncertainty by adding a caveat next to a number.
Where a quantity is uncertain enough to need a caveat, the correct action is to NOT SHOW
THE QUANTITY and instead show the underlying artifact (the child's actual text).
```
**Rationale:** given `A5-C64` (as little as 11% accurate interpretation) and `A5-C40` (teachers accept harsh machine errors), a disclaimer is not a mitigation. The document's stated default stance under uncertainty — *do not measure, do not display* — is implemented here.

```
RULE B-4 (Anti-objectivity: the UI must not be able to imply a creativity score exists)
BANNED UI PRIMITIVES for anything touching creative quality:
    - numeric scores, /10, %, x/5 stars, letter grades
    - progress bars toward a "quality" target
    - gauges, speedometers, radar/spider charts of "traits"
    - traffic-light red/amber/green on creative dimensions
    - trend arrows (↑ ↓) on creative dimensions
    - any colour ramp encoding better→worse on creative dimensions
ALLOWED PRIMITIVES:
    - the child's actual words, quoted
    - counts of things the child explicitly authored (class-aggregate only, per W7)
    - binary operational states (started / not started; new since last view)
    - the child's own self-assessment, if shared
```
Grounded in `A5-C49` (evaluation expectation), `A5-C75` (metrics presented as objective reinforce assumptions), `A5-C64`.

```
RULE B-5 (Primary dashboard object is the work, not the metric)
The default educator view MUST be a reading view of children's actual characters and
episodes, sorted by "needs a look" signals the CHILD raised (W5) or by recency (W4).
Any aggregate view is secondary and reachable, never the landing page.
```
Grounded in `A5-C63` (LA over-focuses on behaviour rather than learning), `A5-C65` (productive uses are instructional), `A5-C58`/`A5-C79` (teacher time is the binding constraint — 15 minutes is better spent reading two stories than parsing a chart).

```
RULE B-6 (Alert discipline)
Character Studio MAY raise an educator alert ONLY IF the event is in the
safety/duty-of-care category (W9, Part E).
It MUST NOT raise alerts for: inactivity, low output, "declining" anything,
short text, unusual content that is merely dark or strange fiction.
Alert volume budget: DESIGN DECISION — target < 1 alert per class per week in steady state.
IF measured volume exceeds budget THEN raise thresholds, do not add triage UI.
```
> **DESIGN DECISION:** the "<1 per class per week" budget is **invented**. It is set to respect `A5-C77` (alert fatigue degrades response to genuine alerts) and `A5-C79` (15-minute instructional budget). Replace with measured data post-launch.

```
RULE B-7 (Teacher override is logged and fed back)
Every automated suggestion shown to a teacher carries a one-tap "this is wrong" control.
Overrides are logged, aggregated, and reviewed for differential rates across
child demographics available to the school. Elevated override rates for any group
are treated as a bias signal and trigger review of the feature.
```
Grounded in `A5-C40`, `A5-C33`–`A5-C36`, `A5-C69`.

```
RULE B-8 (Context-configurable, teacher-owned)
Teachers can turn OFF any optional analytic surface for their class.
Default state for every optional analytic surface: OFF.
```
Grounded in `A5-C62` (customization raises relevance and actionability at some effort cost) and `A5-C61` (context conditions interpretability), plus the document's default-to-neutrality stance.

### B.2.4 Explicit rule set: no ranking of children on creative work

This is stated separately because it is a categorical commitment, not a tunable.

```
INVARIANT R (Non-Ranking Invariant)

R-1  There MUST NOT exist, anywhere in Character Studio's data model, UI, API, export,
     or report, any total order or partial order over children derived from the
     creative properties of their work.

R-2  This includes derived and disguised orderings:
       - sorting a class list by any creative metric
       - "top N" / "featured" / "story of the week" chosen by system scoring
       - badges, tiers, levels, or ranks attached to a child
       - percentile, quartile, band, or cohort-relative placement
       - colour-coding a roster by any creative dimension
       - any composite "score" from which an order could be reconstructed

R-3  Class-aggregate counts (W7) MUST be rendered so that no individual child is
     identifiable or back-inferable. Where a class is small enough that an aggregate
     reveals an individual, suppress the aggregate.
     Suppression threshold: DESIGN DECISION — suppress if the aggregate is derived
     from fewer than 5 children, or if any cell would identify a single child.

R-4  Human-chosen celebration IS permitted and encouraged: a teacher or a child MAY
     select work to feature. The system MUST NOT make or suggest that selection.

R-5  Sorting controls MAY sort by: name, recency, assignment, submitted/not submitted,
     child-requested-feedback. Nothing else.
```
Grounded in `A5-C83`, `A5-C84`, `A5-C85`, `A5-C49`, `A5-C73`, `A5-C74`.
> **DESIGN DECISION:** the k=5 suppression threshold is invented, chosen by analogy to common small-cell suppression practice. It is not derived from a retrieved source and must be set by the privacy/legal reviewer.

### B.2.5 Rules for whether and how children see their own analytics

The evidence here is genuinely mixed, so this section follows the default stance: **gentle optionality, minimal quantification.**

**Evidence in tension:**
- Against: student-facing dashboards induced social anxiety and negative emotions, especially with peer comparison (`A5-C85`); evaluation expectation from a computer undermines creativity, worse in older children (`A5-C49`); leaderboards undermine intrinsic motivation (`A5-C83`).
- For: rubric-referenced **self**-assessment improved elementary writing (`A5-C10`); self-feedback outperformed computer feedback (`A5-C04`); open learner models exist on an agency continuum and can act as "metacognitive mediators" supporting ownership (`A5-C86`); children have a rights-based interest in seeing data about themselves (`A5-C87`, and Part E `A5-C148`).

**`A5-C86`** `[E1]` `[E2]` `[SECONDARY-SOURCED]` Open Learner Models are described on a continuum from Inspectable to Persuasive/Adaptive reflecting progressively greater learner agency, transparency and co-regulation; pedagogically enriched OLMs can act as metacognitive mediators enabling learners to interpret feedback and assume ownership. → [Frontiers in Education meta-synthesis](https://www.frontiersin.org/journals/education/articles/10.3389/feduc.2025.1760183/full)

**`A5-C87`** `[E6]` `[SECONDARY-SOURCED]` Learning-analytics ethics work poses as open questions whether students have a right to access learning-analytics results about them and whether they can limit analysis and express privacy preferences. This is **unsettled**, not established. → [IJETHE informed-consent model](https://educationaltechnologyjournal.springeropen.com/articles/10.1186/s41239-019-0155-0); [Learning Analytics Ethical Issues and Dilemmas](https://www.researchgate.net/publication/258122968_Learning_Analytics_Ethical_Issues_and_Dilemmas)

**`A5-C88`** `[E1]` `[SECONDARY-SOURCED]` Children's mental models of AI differ by band: retrieved work reports **grades 3–5 (B1–B2) often attribute AI's reasoning to inherent intelligence, while grades 6–8 (B3–B4) recognize AI as a pattern recognizer.** Retrieved design guidance also warns against one-size-fits-all transparency and against text-heavy explanations that overwhelm young users. → [Children's Mental Models of AI Reasoning, IDC 2025](https://dl.acm.org/doi/10.1145/3713043.3728856); [Informing Age-Appropriate AI, CHI 2022](https://dl.acm.org/doi/fullHtml/10.1145/3491102.3502057)

> **Implication:** a B1 child shown a machine-generated number about themselves is disproportionately likely to treat it as authoritative truth about who they are. That is the worst possible audience for an unreliable metric.

**Child-facing rules:**

```
RULE C-1 (Children see their work, not scores about their work)
The child's own view is a LIBRARY, not a REPORT CARD.
Permitted child-facing surfaces:
  - their characters and episodes, browsable
  - "characters you've used in more than one episode" (a fact, framed as a story hook)
  - their own saved self-assessments
  - a personal, private "things I want to try next" list they author
BANNED child-facing surfaces:
  - any score, level, badge, tier, streak, or progress bar tied to creative quality
  - any comparison to peers, class average, or grade-level expectation
  - any system-generated statement about their trajectory as a writer
```
Grounded in `A5-C49`, `A5-C83`, `A5-C85`, `A5-C88`, `RULE A-3`.

```
RULE C-2 (Nothing about the child reaches an adult without the child knowing)
IF any child-derived signal is shown to a teacher
THEN the child's own interface MUST make that visible in child-appropriate language,
     at the same grain, without the child having to go looking.
There are NO teacher-visible child signals that are hidden from the child,
EXCEPT active safety escalations under Part E (which have their own handling).
```
Grounded in `A5-C70`–`A5-C72`: covert monitoring is the configuration that produces chilling effects. Making observation legible and bounded is the mitigation. Also grounded in `A5-C86`/`A5-C87` (agency and transparency).

```
RULE C-3 (Age-banded explanation, not age-gated function)
Explanations of what the system does with a child's work are written at three registers:
  B0–B1 (K–3): one short sentence + an icon
  B2–B3 (4–7): two to three sentences, concrete
  B4 (8–9):    a fuller explanation including that the AI predicts patterns
Function is NOT gated by band. Only the wording of explanations changes.
```
Grounded in `A5-C88`, and the taxonomy rule that bands are soft defaults, never gates.

```
RULE C-4 (Self-assessment is private by default)
Child self-assessment results are stored against the child, visible only to the child,
until the child performs an explicit, per-instance share action.
No bulk share. No default share. No "share all" toggle in onboarding.
```
Grounded in `A5-C09`, `A5-C10` (self-assessment works), `A5-C70` (sharing under observation changes what is written), `A5-C49`.

### B.2.6 Anti-Goodhart review procedure

```
PROCEDURE G (run before shipping any metric, and quarterly thereafter)

G-1  State the behaviour the metric is a proxy for.
G-2  State the cheapest way a child could raise the metric WITHOUT doing that behaviour.
G-3  IF that cheap path is plausible for a 7-to-14-year-old THEN do not ship the metric.
G-4  State the cheapest way a TEACHER could raise the class metric without the behaviour.
G-5  IF that cheap path is plausible under time pressure THEN do not ship the metric.
G-6  Confirm the metric is not visible to anyone with authority over the teacher (RULE B-1).
```
Grounded in `A5-C73`, `A5-C74`, `A5-C75`. Worked example: *word count* fails at G-3 immediately (a child can pad), which is why B3 is banned even though `A5-C27` shows it correlates with human quality ratings — the correlation is exactly what makes it exploitable.

---
---

# PART C — STANDARDS ALIGNMENT

> **Standards vary by state and by country. Nothing in this Part should be presented to any user as "the" writing standards.** The Common Core State Standards are used here because they were the most retrievable US framework and are adopted or adapted in many US states — **not** because they are universal. Several US states do not use CCSS and use their own frameworks. Two non-US frameworks are given for contrast.

## C.1 WHAT RESEARCH SAYS

### C.1.1 US — Common Core State Standards, Writing Standard 3 (Narrative), grades 2–8

All from [thecorestandards.org](https://www.thecorestandards.org/ELA-Literacy/W/) via domain-restricted search. `[E3]` `[SECONDARY-SOURCED]`

**`A5-C89`** **W.2.3 (Grade 2 → B1).** Write narratives in which they *recount a well-elaborated event or short sequence of events, include details to describe actions, thoughts, and feelings, use temporal words to signal event order, and provide a sense of closure.* → [W/2/3](https://www.thecorestandards.org/ELA-Literacy/W/2/3/)

**`A5-C90`** **W.3.3 (Grade 3 → B1).** Establish a situation and introduce a narrator and/or characters; organize an event sequence that unfolds naturally; **use dialogue and descriptions of actions, thoughts, and feelings to develop experiences and events or show the response of characters to situations**; use temporal words and phrases to signal event order; provide a sense of closure. → [W/3](https://www.thecorestandards.org/ELA-Literacy/W/3/)

**`A5-C91`** **W.4.3 (Grade 4 → B2).** Write narratives to develop real or imagined experiences or events using effective technique, descriptive details, and clear event sequences, with five components: (a) orient the reader by establishing a situation and introducing a narrator and/or characters, organize an event sequence that unfolds naturally; (b) **use dialogue and description to develop experiences and events or show the responses of characters to situations**; (c) use a variety of transitional words and phrases to manage the sequence of events; (d) use concrete words and phrases and sensory details to convey experiences and events precisely; (e) provide a conclusion that follows from the narrated experiences or events. → [W/4](https://www.thecorestandards.org/ELA-Literacy/W/4/)

**`A5-C92`** **W.5.3 (Grade 5 → B2).** Write narratives to develop real or imagined experiences or events using effective technique; provide a conclusion that follows from the narrated experiences or events. → [W/5](https://www.thecorestandards.org/ELA-Literacy/W/5/)

**`A5-C93`** **W.8.3 (Grade 8 → B4).** Write narratives to develop real or imagined experiences or events using effective technique, relevant descriptive details, and well-structured event sequences: **engage and orient the reader by establishing a context and point of view and introducing a narrator and/or characters**; organize an event sequence that unfolds naturally and logically; **use narrative techniques, such as dialogue, pacing, description, and reflection, to develop experiences, events, and/or characters**; use a variety of transition words, phrases, and clauses to convey sequence, signal shifts from one time frame or setting to another, and show the relationships among experiences and events. → [W/8](https://www.thecorestandards.org/ELA-Literacy/W/8/)

**`A5-C94`** **The developmental spine relevant to Character Studio, read across `A5-C89`–`A5-C93`:**

| Band | Grades | What the standard asks for regarding *character* |
|---|---|---|
| B1 | 2 | Details describing **actions, thoughts, and feelings** — no explicit "character" noun yet |
| B1 | 3 | **Introduce** a narrator and/or characters; **dialogue** + description of actions/thoughts/feelings to **show character response to situations** |
| B2 | 4–5 | Same introduction requirement; **dialogue and description to show responses of characters**; sensory/concrete precision |
| B3–B4 | 6–8 | Establishing **context and point of view**; **pacing and reflection** added to the technique list; characters named as an explicit object of development |

> The through-line is **character-as-response-to-situation**, not character-as-attribute-list. From grade 3 onward the standard asks children to show what a character *does and says when something happens* — not to fill in a profile. This has direct product consequences (see C.2.2).

### C.1.2 US — CCSS Speaking & Listening and Language standards relevant to character work

**`A5-C95`** `[E3]` `[SECONDARY-SOURCED]` **SL.2.1 (→ B1).** Participate in collaborative conversations with diverse partners about grade-2 topics and texts, with sub-points on following agreed-upon rules for discussion (gaining the floor respectfully, listening with care, speaking one at a time), building on others' talk by linking comments to the remarks of others, and asking for clarification. → [SL/2](https://www.thecorestandards.org/ELA-Literacy/SL/2/)

**`A5-C96`** `[E3]` `[SECONDARY-SOURCED]` **SL.8.1 (→ B4).** Engage effectively in a range of collaborative discussions with diverse partners, building on others' ideas and expressing their own clearly; coming to discussions prepared and drawing on that preparation; following rules for collegial discussions and decision-making, tracking progress toward goals and deadlines, **defining individual roles as needed**; posing questions that connect the ideas of several speakers. → [SL/8](https://www.thecorestandards.org/ELA-Literacy/SL/8/)

**`A5-C97`** `[E3]` `[SECONDARY-SOURCED]` **Presentation of Knowledge and Ideas (across grades).** Present information, findings, and supporting evidence such that listeners can follow the line of reasoning, with organization, development and style appropriate to task, purpose and audience; make strategic use of digital media and visual displays. → [SL strand](https://www.thecorestandards.org/ELA-Literacy/SL/)

**`A5-C98`** `[E3]` `[SECONDARY-SOURCED]` **Language standards most relevant to character work.** L.3.2 includes **use commas and quotation marks in dialogue**; L.3.3 includes using knowledge of language and its conventions and **recognizing and observing differences between the conventions of spoken and written standard English**. L.5.2 covers punctuation in series, introductory elements, direct address, and titles; L.5.3 covers knowledge of language and its conventions. → [L/3](https://www.thecorestandards.org/ELA-Literacy/L/3/); [L/3/2/c](https://www.thecorestandards.org/ELA-Literacy/L/3/2/c/); [L/5](https://www.thecorestandards.org/ELA-Literacy/L/5/)

> **L.3.3's spoken-vs-written distinction is the standards hook for character *voice*.** It is the one place in the retrieved CCSS language strand that legitimises a child writing a character who speaks in non-standard English deliberately. This matters enormously for the cultural-assumptions section: a tool that "corrects" dialect in dialogue is working against L.3.3, not for it.

### C.1.3 Non-US framework 1 — England, National Curriculum

**`A5-C99`** `[E3]` `[SECONDARY-SOURCED]` **Key Stage 2 (broadly ages 7–11 → B1–B2/B3), Writing – composition.** Retrieved from the DfE programmes of study: pupils should be taught to plan by discussing writing similar to that which they are planning to write in order to understand and learn from its structure, vocabulary and grammar, and discussing and recording ideas; in **drafting and writing**, to compose and rehearse sentences orally **(including dialogue)**, progressively building a varied and rich vocabulary and an increasing range of sentence structures, organise paragraphs around a theme, and **"in narratives, create settings, characters and plot"**; and in **evaluating and editing**, to assess the effectiveness of their own and others' writing and suggest improvements, and propose changes to grammar and vocabulary to improve consistency. Retrieved framing also states that effective composition involves forming, articulating and communicating ideas, then organising them coherently for a reader. → [GOV.UK English programmes of study](https://www.gov.uk/government/publications/national-curriculum-in-england-english-programmes-of-study/national-curriculum-in-england-english-programmes-of-study); [KS1–2 PDF](https://assets.publishing.service.gov.uk/media/5a7de93840f0b62305b7f8ee/PRIMARY_national_curriculum_-_English_220714.pdf)

**`A5-C100`** `[E3]` `[SECONDARY-SOURCED]` **Key Stage 3 (broadly ages 11–14 → B3–B4).** Pupils should write for a variety of purposes and audiences across a range of contexts, **including writing imaginatively**, requiring an increasingly wide knowledge of vocabulary and grammar. For **spoken language**, pupils should use spoken language to develop understanding through **speculating, hypothesising, imagining and exploring ideas**, and participate in discussions, presentations, performances, **role play/improvisations** and debates. → [KS3 PDF](https://assets.publishing.service.gov.uk/media/5a7b8761ed915d4147620f6b/SECONDARY_national_curriculum_-_English2.pdf)

**`A5-C101`** **Contrast worth noting for product.** England's KS2 statement — *"in narratives, create settings, characters and plot"* — is a **single clause** where CCSS spends five sub-standards. England places **oral rehearsal of sentences including dialogue** in the composition process itself, and KS3 explicitly names **role play/improvisation** as spoken-language work. **A product that models character work as speaking-in-role is better aligned to the England framework than to CCSS; a product that models it as structured drafting is better aligned to CCSS.** Neither is universal. This is precisely why alignment must be configurable rather than baked in.

### C.1.4 Non-US framework 2 — Australia

**`A5-C102`** `[E3]` `[SECONDARY-SOURCED]` The Australian Curriculum: English (v9) is built around **three interrelated strands — Language, Literature and Literacy** — with programs balancing and integrating all three across listening, reading, viewing, speaking, writing and creating; students create a range of imaginative, informative and persuasive texts including narratives. Retrieved Year 3 framing includes understanding how content can be organised using different text structures depending on purpose, and how language features, images and vocabulary choices are used for different effects. → [V9 English learning area](https://www.australiancurriculum.edu.au/curriculum-information/understand-this-learning-area/english); [F–6 content download](https://www.australiancurriculum.edu.au/content/dam/en/curriculum/ac-version-9/downloads/english/english-curriculum-content-f-6-v9.docx)

**`A5-C103`** `[E3]` `[SECONDARY-SOURCED]` `[UNVERIFIED for exact wording]` Retrieved search could not surface the **verbatim Year 3 / Year 6 achievement-standard text** for narrative and character from the official site. Searched `australiancurriculum.edu.au` with domain restriction; results returned the learning-area overview and downloadable content files but not the achievement-standard strings. **Anyone claiming Australian alignment must open the official documents directly.**

**`A5-C104`** `[E4]` `[SECONDARY-SOURCED]` The **NAPLAN narrative marking guide** was retrieved as scoring across ten categories: audience, text structure, ideas, **character and setting**, vocabulary, cohesion, paragraphing, sentence structure, punctuation, spelling. Retrieved via a third-party teaching-resources site, not from ACARA directly — `[UNVERIFIED]` as to current official criteria. → [Teach Starter NAPLAN-style rubric](https://www.teachstarter.com/au/teaching-resource/naplan-style-assessment-rubric-narrative-writing/)

### C.1.5 How a product should claim alignment honestly

**`A5-C105`** `[E3]` `[SECONDARY-SOURCED]` **"Aligned to standards" and "proven effective" are unrelated claims.** Retrieved guidance defines standards alignment as ensuring the taught, learned and assessed curriculum do not deviate significantly from state/national academic standards — a **content-match** claim. ESSA evidence tiers are a **causal-efficacy** claim, ranging from Tier 1 (well-designed, well-implemented RCT without attrition problems) down to Tier 4 (a research-based logic model with a study planned or underway). → [ERIC ED588503, Standards Alignment to Curriculum and Assessment](https://files.eric.ed.gov/fulltext/ED588503.pdf); [IES WWC on ESSA tiers](https://ies.ed.gov/ncee/wwc/essa)

**`A5-C106`** `[E4]` `[SECONDARY-SOURCED]` Retrieved guidance is blunt that the marketing phrase is near-meaningless on its own: **"'ESSA aligned' is not a stamp of quality. A tool can sit at the top tier with a strong study behind it, or it can sit at the bottom tier with little more than a logic model. Both can honestly say they meet an ESSA tier."** Educators are advised not to accept "ESSA-aligned" or "research-based" as an answer. → [CoGrader ESSA tiers guide](https://cograder.com/content/essa-tiers-of-evidence-explained/); [Lexia on ESSA tiers vs Evidence for ESSA](https://www.lexialearning.com/blog/essa-tiers-of-evidence-vs.-evidence-for-essa-key-differences)

**`A5-C107`** **The distinction Character Studio must hold, derived from `A5-C105`–`A5-C106` plus Part A:**

| Claim type | What it asserts | What it requires | Can Character Studio make it? |
|---|---|---|---|
| **"Supports" a standard** | An activity here gives children practice at the thing the standard describes | An honest mapping from feature → standard text | **Yes**, with the mapping published |
| **"Aligned to" a standard** | Content matches the standard's scope and sequence | A documented, jurisdiction-specific alignment, reviewed by someone qualified | **Yes, per jurisdiction, if actually done** |
| **"Assessed against" a standard** | The product produces a defensible judgment of whether a child met the standard | A valid, reliable instrument for that standard, with evidence | **No** — see `A5-C25`, `A5-C46`, `A5-C48` |
| **"Improves outcomes" / ESSA tier** | Causal effect on student outcomes | An actual study at the claimed tier | **No, until a study exists** |

---

## C.2 WHAT CHARACTER STUDIO SHOULD DO

### C.2.1 Alignment claim policy

```
RULE S-1 (Three-tier claim vocabulary — enforced in marketing, docs, and UI copy)

"SUPPORTS <standard>"        Permitted when a published mapping exists showing which
                             feature gives practice at the standard's described activity.
                             Must link to the mapping.

"ALIGNED TO <framework>"     Permitted ONLY per named jurisdiction and named version,
                             ONLY where a documented alignment has actually been performed
                             and is dated. Never "aligned to standards" unqualified.

"ASSESSED AGAINST"           BANNED. Character Studio does not assess against standards.
"MEASURES", "EVALUATES",     BANNED for any standard or creative construct.
"CERTIFIES", "GRADE LEVEL"

"RESEARCH-BASED",            BANNED unless accompanied by the specific citation and the
"EVIDENCE-BASED",            specific ESSA tier, in the same sentence.
"PROVEN"
```
Grounded in `A5-C105`, `A5-C106`, `A5-C107`, and Part A `A5-C25`/`A5-C46`.

```
RULE S-2 (Standards are data, not code)
Standards frameworks MUST be a configurable dataset, not hardcoded.
Minimum shipped set: CCSS (US), England National Curriculum, Australian Curriculum.
Schools MUST be able to load their own state/national framework.
The DEFAULT state is NO framework selected — the tool works with none attached.
```
Grounded in `A5-C101` (frameworks model character work differently), `A5-C103` (we could not even retrieve one framework's achievement standards reliably), and the document's stance that no framework is universal.

```
RULE S-3 (Teacher owns the mapping and the judgment)
Character Studio MAY show: "This activity is commonly used to practise <standard text>."
Character Studio MUST NOT show: "<Child> has met <standard>."
Only a teacher may mark a standard as met, and that marking is the teacher's record,
stored as the teacher's assertion, attributed to the teacher, and editable by the teacher.
```
Grounded in `A5-C107`, `A5-C25`, `A5-C64` (educator misinterpretation of data), Part B `RULE B-1`.

```
RULE S-4 (Mapping transparency)
Every standards mapping shipped MUST record: framework name, framework version/year,
jurisdiction, date the mapping was made, who made it, and the exact standard code + text
it maps to. Mappings are visible to educators, not buried in a sales PDF.
```
Grounded in `A5-C106` (opacity is how the phrase gets abused).

### C.2.2 Feature-to-standard support map (illustrative, US CCSS)

**This is an example of the format `RULE S-1` requires, not a completed alignment.** Every row is a "SUPPORTS" claim only.

| Character Studio activity | Supports (CCSS code) | Standard text hook | Claim source |
|---|---|---|---|
| Naming a character and writing who they are | W.3.3.a / W.4.3.a | "introducing a narrator and/or characters" | `A5-C90`, `A5-C91` |
| Writing what a character says in a scene | W.3.3.b / W.4.3.b; L.3.2 | "use dialogue…"; "commas and quotation marks in dialogue" | `A5-C90`, `A5-C91`, `A5-C98` |
| Writing how a character reacts to an event | W.3.3.b / W.4.3.b | "show the response of characters to situations" | `A5-C90`, `A5-C91` |
| Choosing whose eyes an episode is told through | W.8.3.a | "establishing a context and point of view" | `A5-C93` |
| Writing a character's inner reflection | W.8.3.b | "reflection, to develop experiences, events, and/or characters" | `A5-C93` |
| Giving a character a distinct way of speaking | L.3.3.b | "differences between the conventions of spoken and written standard English" | `A5-C98` |
| Discussing a shared character with classmates | SL.2.1 / SL.8.1 | collaborative discussion, building on others' ideas, defining roles | `A5-C95`, `A5-C96` |
| Presenting a character to the class | SL Presentation of Knowledge | organization/development/style appropriate to task, purpose, audience | `A5-C97` |

**Design consequence drawn from `A5-C94`:** because the standards frame character as **response to situation** rather than as an attribute list, Character Studio's character-creation flow should not be primarily a form of trait fields. **At minimum, every trait a child records should be paired with a prompt for a situation in which it shows.** A "brave" field with nothing attached supports no standard in the table above; "brave — she went back into the tunnel for the dog" supports W.3.3.b, W.4.3.b, and W.8.3.b.

### C.2.3 What Character Studio must not do with standards

| Prohibition | Why |
|---|---|
| Auto-tag a child's writing with standards met | `A5-C107` — that is "assessed against"; no valid instrument (`A5-C46`) |
| Show a standards-coverage percentage per child | Ranking risk (Invariant R), plus `A5-C25` |
| Present CCSS as "the standards" to non-US or non-CCSS-state users | `A5-C101`, `A5-C102` — frameworks differ materially |
| Use standards language in child-facing UI | `A5-C49` — turns creative play into an evaluated task for the child |
| Ship an alignment for a framework nobody verified against the official document | `A5-C103` — we could not retrieve one framework's own text this session |
| Correct or flag non-standard English in *character dialogue* | Works against L.3.3.b (`A5-C98`); see Cultural Assumptions |

---
---

# PART D — EPISODE & STORY INTEGRATION

## D.1 WHAT RESEARCH SAYS

### D.1.1 Serial / episodic narrative and character persistence

**`A5-C108`** `[E2]` `[E4]` `[SECONDARY-SOURCED]` The episodic/serial distinction is structural: **episodic series reset character progression each installment; serials build continuous storylines and character arcs that carry across episodes.** Retrieved narratology framing (Mittell, *Complex TV*) also emphasises that **"a core facet of seriality is that narrative events accumulate in characters' memories and experiences."** → [Complex TV, Character chapter](https://mcpress.media-commons.org/complextelevision/character/); [Mittell, Narrative Complexity PDF](https://justtv.wordpress.com/wp-content/uploads/2010/12/mittell-narrative-complexity.pdf)

**`A5-C109`** `[E2]` `[E6]` `[SECONDARY-SOURCED]` **A counter-intuitive and product-relevant finding:** retrieved narratology commentary states that *while it may seem like part of the pleasure of serial narrative is watching characters grow, **most serial characters are more stable and consistent rather than changeable entities.*** → [Complex TV, Character chapter](https://mcpress.media-commons.org/complextelevision/character/)

> **This is the key insight for Character Studio's episode model.** The default expectation for a recurring character is *continuity*, not arc. A tool that pressures children to make a character "grow" each episode is imposing a literary form (the arc) that even professional serial fiction mostly does not use.

**`A5-C110`** `[E4]` `[SECONDARY-SOURCED]` Practitioner consensus on balancing consistency and growth: characters need to change to stay interesting but must remain recognisably the same person, and **changes should be gradual and motivated by story events** so the audience can trace the logic and the change "feels earned rather than random." → [Fiveable TV Writing, character consistency across episodes](https://fiveable.me/tv-writing/unit-3/character-consistency-episodes/study-guide/eU0OyEeAbkIA0Xvw)

**`A5-C111`** `[E4]` `[SECONDARY-SOURCED]` **The story bible / series bible is the established professional artifact for exactly this problem.** Retrieved practitioner sources describe its purpose as **keeping continuity across writers who have never met**, containing "anything that you would need to keep the characters consistent from episode to episode and season to season," growing into an **archival document** recording character and story arcs that have happened and are planned, and conveying tone, atmosphere and direction to incoming writers. Retrieved sources distinguish the **pitch bible** (a selling document) from the **working bible** (a reference for the team). → [Scriptation guide](https://scriptation.com/blog/tv-show-bible-and-character-bibles-guide/); [Storyflow guide](https://storyflow.so/blog/what-is-a-story-bible-complete-guide); [Final Draft](https://www.finaldraft.com/blog/10-easy-steps-to-developing-your-tv-show-bible)

**`A5-C112`** `[E4]` `[SECONDARY-SOURCED]` Retrieved practice also describes **detailed episode summaries focused on character actions and development** serving as quick-reference guides capturing key character moments, relationship shifts, and **unresolved threads.** The "unresolved thread" is a first-class object in professional practice. → [Fiveable](https://fiveable.me/tv-writing/unit-3/character-consistency-episodes/study-guide/eU0OyEeAbkIA0Xvw)

### D.1.2 Children writing series, sequels, and recurring characters — a thin evidence base

**`A5-C113`** `[UNVERIFIED]` **Searched specifically for empirical research on children writing series/sequels with recurring characters in classroom settings.** Queries run included *"children writing series sequels recurring characters classroom writing workshop research"* and *"episodic writing serial fiction pedagogy students chapter books extended narrative classroom study literacy."* **Retrieved results were overwhelmingly practitioner and commercial** — Writer's Digest, Gotham Writers Workshop, Kidlit, Bookfox, a classroom-publishing vendor. **No controlled study of children writing serial fiction with persistent characters was retrieved.** This is a genuine gap in the evidence base, and Character Studio's episode features therefore rest largely on `[E4]` professional practice and adjacent literatures, not `[E1]` findings about children.

**`A5-C114`** `[E4]` `[E6]` `[SECONDARY-SOURCED]` What practitioner sources do converge on: **strong character is treated as the most important element of a series**, and series are structured so individual installments are complete while retaining potential for sequels. One retrieved source notes picture-book series need not be outlined because "the stories aren't cumulative, building on each other" — i.e. **episodic, not serial** is the default form in children's series publishing. → [Writers on the Move, 3 key elements](https://www.writersonthemove.com/2021/04/writing-successful-childrens-series-3.html); [Kidlit](https://kidlit.com/writing-a-childrens-book-series/); [Bookfox](https://thejohnfox.com/2023/08/4-steps-to-write-a-childrens-picture-book-series/)

**`A5-C115`** `[E4]` `[E6]` `[SECONDARY-SOURCED]` Seriality has been theorised as a *pedagogical* object: retrieved work argues serialized narratives cultivate critical thinking, communicative competence and media awareness (in an EFL media-literacy frame), and describes teaching texts in original installments to theorise seriality in the literature classroom. Separately, the **National Writing Project** describes **episodic fiction** as a classroom form, working "like a slide show where separate episodes are juxtaposed to be woven together by the reader," and notes it is "a natural for personal narrative." → [JMLE, *Beyond the episode*](https://digitalcommons.uri.edu/jmle/vol17/iss3/3/); [Pedagogy / Duke UP](https://read.dukeupress.edu/pedagogy/article-abstract/22/3/395/318285/Episodic-StorytellingTheorizing-Seriality-in-the); [NWP, Episodic Fiction](https://archive.nwp.org/cs/public/print/resource/202)

**`A5-C116`** `[E1]` `[SECONDARY-SOURCED]` Relevant developmental constraint from Part A: in upper elementary, **text length and story content did not increase with age while syntactic complexity did** (`A5-C23`). A child continuing a character across ten episodes is not expected to write longer each time. → [PMC5247531](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5247531/)

### D.1.3 Fan fiction and transformative writing — motivation and voice

**`A5-C117`** `[E1]` `[SECONDARY-SOURCED]` Curwood & Magnifico, *Writing in the Wild: Writers' Motivation in Fan-Based Affinity Spaces* (Journal of Adolescent & Adult Literacy, 2013): fan-based affinity spaces motivate young people to write because they offer **multiple modes of representation, diverse pathways to participation, and an authentic audience**; adolescents cite audience availability as motivation, and **reader feedback influences their writing goals and practices.** → [Wiley/ILA](https://ila.onlinelibrary.wiley.com/doi/10.1002/JAAL.192); [Semantic Scholar](https://www.semanticscholar.org/paper/Writing-in-the-Wild:-Writers%E2%80%99-Motivation-in-Spaces-Curwood-Magnifico/f85d0044701a38b067738954a7bdc6a887c2876e)

**`A5-C118`** `[E1]` `[SECONDARY-SOURCED]` Rebecca W. Black's ethnographic work on adolescents and online fan fiction describes fan-fiction sites as **affinity spaces where English-language-learning youth display expertise, affiliate around popular culture, and position themselves as capable and accomplished users of multiple social languages**, with convergence and divergence between academic settings and informal learning contexts for language socialization, literacy and identity development. → [E-Learning and Digital Media / SAGE](https://journals.sagepub.com/doi/10.2304/elea.2007.4.4.384); [*Adolescents and Online Fan Fiction*](https://www.goodreads.com/en/book/show/4937135-adolescents-and-online-fan-fiction)

> **`A5-C118` is a strong equity finding**: the population most likely to be scored down by automated writing evaluation (`A5-C34`, `A5-C36`) is a population documented as demonstrating sophisticated multi-register command in fan-writing spaces. The same child, same writing, different measurement frame, opposite verdict.

**`A5-C119`** `[E1]` `[E4]` `[SECONDARY-SOURCED]` Fan fiction has been brought into **early elementary** literacy work — retrieved: Magnifico, *Redesigning Author Study: Fanfiction and Early Elementary Literacy* (The Reading Teacher, 2025). Retrieved framing describes fanfiction as writing "new narratives that add to beloved works or take place in existing story worlds," and pedagogical value in **beta reading and collective feedback offering community mentorship**, and in the remix classroom letting students "respond to, adapt, and resist canonical knowledge." → [Wiley/ILA, The Reading Teacher](https://ila.onlinelibrary.wiley.com/doi/10.1002/trtr.2374); [Transformative Works and Cultures](https://journal.transformativeworks.org/index.php/twc/article/download/1917/2693?inline=1)

**`A5-C120`** `[E6]` `[SECONDARY-SOURCED]` Retrieved claim that **anonymity in online writing allows adolescents to take creative risks without personal judgment.** Directionally consistent with the surveillance/evaluation literature (`A5-C49`, `A5-C70`) but retrieved as a summary assertion rather than a specific study finding — treat as a hypothesis. → [Curwood & Magnifico record](https://www.researchgate.net/publication/264206047_Writing_in_the_Wild_Writers'_Motivation_in_Fan-Based_Affinity_Spaces)

### D.1.4 Collaborative and shared-world storytelling in classrooms

**`A5-C121`** `[E1]` `[SECONDARY-SOURCED]` Retrieved research on collaborative storytelling in classrooms reports that **peer collaboration increases motivation, self-expression, questioning of ideas, reflection, and content elaboration through common language**, and that collaborating and creating something together can positively affect self-esteem and **sense of belonging within the classroom community.** → [Children's collaborative storytelling record](https://www.researchgate.net/publication/248607063_Children's_collaborative_storytelling_with_linear_and_nonlinear_approaches); [Collective digital storytelling at school](https://www.researchgate.net/publication/221238437_Collective_digital_storytelling_at_school_A_whole-class_interaction)

**`A5-C122`** `[E1]` `[SECONDARY-SOURCED]` Digital storytelling work reports development of communication skills through organizing ideas, asking questions, expressing opinions and constructing narratives, with retrieved reports of **increases in empathy and comprehension** and greater confidence in expressing ideas and feelings. Also retrieved: online collaborative storytelling showed potential as a distance-education tool promoting collaboration and social interaction. → [Frontiers in Psychology, digital storytelling in early childhood](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2018.01800/full); [PMC8700547, online collaborative storytelling during 2020 home confinement](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8700547/)

**`A5-C123`** `[E1]` `[SECONDARY-SOURCED]` **The Scratch attribution research is directly applicable to shared characters.** Retrieved findings: although the platform supports **automatic** attribution when a project is remixed, **automatic attribution "is not enough for members, and manual credit given by the remixer is more valued"**; the open-sharing/remixing policy has been **controversial, with some members equating remixing to stealing**; and originators' reactions varied widely — **"people were just as likely to leave positive comments on remixes as they were to accuse these remixes of plagiarism."** → [Hill & Monroy-Hernández, *Computers Can't Give Credit*, arXiv](https://arxiv.org/pdf/1507.01285); [Princeton record](https://collaborate.princeton.edu/en/publications/computers-cant-give-credit-how-automatic-attribution-falls-short-/); [Remixing as a Pathway to Computational Thinking, CSCW](https://dl.acm.org/doi/10.1145/2818048.2819984)

> **`A5-C123` is the most transferable empirical finding available for shared-world design.** It says: (1) build attribution, (2) **do not assume automatic attribution satisfies children** — provide a way for the remixer to say thank you in their own words, and (3) **expect conflict**; roughly half the reaction distribution is negative. A shared-character feature without a consent and credit model will generate classroom disputes.

**`A5-C124`** `[E1]` `[SECONDARY-SOURCED]` Retrieved work on children co-creating stories with AI (StoryPrompt / *From Words to Wonder*): formative research with **3 elementary teachers and 18 children**, then a mixed-methods evaluation with **40 children in grades 2–6 (→ B1–B3)**, reporting significantly improved storytelling creativity and richness compared with a storyboard method. Retrieved design guidance: **guide children to plan the global story structure first, then let AI fill gaps with details, maintaining the child's creative ownership**; real-time generation from multimodal input can encourage divergent thinking "while also ensuring a user's ownership"; and encourage **collaboration and co-creation rather than relying on the system to generate stories.** → [CHI 2025, From Words to Wonder](https://dl.acm.org/doi/10.1145/3706598.3713478); [CHI EA 2024, StoryPrompt](https://dl.acm.org/doi/10.1145/3613905.3651118)

**`A5-C125`** `[E1]` `[E6]` `[SECONDARY-SOURCED]` Retrieved work on children co-creating with LLMs reports that **children can develop agency and creative capability when AI outputs are treated as objects of inquiry rather than as authoritative products**, and stresses designing for student agency and collaborative knowledge construction. Small-sample HCI studies; treat as design guidance, not established effect. → [IDC 2025, Empowering Children's AI Literacy Through Co-Creating Stories with LLM](https://dl.acm.org/doi/10.1145/3713043.3731520); [Educ. Sci., Co-Constructing Literacy with AI, Grade 4](https://doi.org/10.3390/educsci16081289)

---

## D.2 WHAT CHARACTER STUDIO SHOULD DO

### D.2.1 The governing principle for episode integration

> **A character record is a memory aid the child controls, not a contract the child must honour.**

Derived from `A5-C109` (serial characters are mostly stable, not arc-driven), `A5-C110` (change should be motivated and gradual, i.e. authored — not enforced), `A5-C111` (the professional artifact is a *reference*, not a rule engine), and `A5-C49` (any system that grades a child against their own past character record is an evaluation expectation).

### D.2.2 What the tool tracks vs. what it must never enforce

| Dimension | Tool TRACKS | Tool SURFACES | Tool NEVER ENFORCES | Claims |
|---|---|---|---|---|
| Stated traits/attributes | Yes, versioned | On request, as "what you wrote before" | Never blocks a contradicting trait | `A5-C109`, `A5-C110` |
| Name, pronouns, appearance | Yes, versioned | Yes, as a reminder | Never auto-corrects a change | `A5-C109` |
| Things that happened to the character | Yes, per episode | Yes — this is the highest-value surface | Never requires reference to them | `A5-C108`, `A5-C112` |
| Relationships to other characters | Yes | Yes | Never blocks a relationship change | `A5-C112` |
| Unresolved threads the child marked | Yes, child-marked only | Yes, as optional prompts | Never nags, never counts unresolved threads | `A5-C112` |
| "Growth" / arc | **No.** Not modelled, not scored | Nothing | Never suggests a character "should" grow | `A5-C109`, `A5-C49` |
| Consistency score | **No.** Never computed | Nothing | — | `A5-C109`, Part B B1/B2 |
| Voice / speech style | Child's own note only | As the child's own note | Never enforces, never "corrects" dialect | `A5-C98` (L.3.3.b) |

```
RULE D-1 (Contradiction is offered, never blocked)
IF a child writes something in episode N that contradicts the character record
THEN the system MAY, at most once per episode and dismissible forever, offer:
     "Earlier you wrote <X>. Want to keep both, change the record, or leave it?"
     Options: [Keep both] [Update the record] [Leave it alone] [Stop asking]
AND the default action if ignored is LEAVE IT ALONE.
The system MUST NOT flag, warn, error, highlight, score, or report contradictions.
```
> **DESIGN DECISION:** "at most once per episode, dismissible forever" is invented; it is set by analogy to alert-fatigue discipline (`A5-C77`, `RULE B-6`). Rationale for the rule itself: `A5-C109` — inconsistency is normal in serial fiction; and a child changing their mind about their own character is authorship, not error.

```
RULE D-2 (Growth is authored, never inferred)
Character Studio MUST NOT infer, label, or display character growth or arcs.
It MAY offer a CHILD-AUTHORED field: "What's different about them now?" — optional,
blank by default, never prompted more than once per episode, never required to publish.
```
Grounded in `A5-C109`, `A5-C110`, `A5-C49`, and Part B `B14`.

```
RULE D-3 (Revision is unlimited and non-destructive)
Every character field is versioned. The child can:
  - change anything at any time, including after the character has appeared in episodes
  - see previous versions
  - restore a previous version
  - branch: "this is a different version of this character" (parallel, not replacing)
Changing a character record MUST NOT retroactively alter published episodes.
No change is ever surfaced to an adult as a change ("child edited their character 6 times").
```
Grounded in `A5-C110` (change should be authored), Part B `B7` (revision counts are surveillance), `A5-C49`.

### D.2.3 Character data model sketch

Designed to satisfy: episode reuse (`A5-C108`, `A5-C111`), growth without freezing (`A5-C109`, `A5-C110`), child-controlled revision (`RULE D-3`), attribution in shared worlds (`A5-C123`), and the privacy constraints in Part E.

```
Character
├─ id                        stable, opaque; never contains the child's name
├─ owner_ref                 pseudonymous child ref (see Part E, RULE P-4)
├─ created_at / updated_at
├─ visibility                private | class | shared-world     (default: private)
├─ core                      ← SMALL, STABLE, CHILD-AUTHORED
│   ├─ display_name          free text (child's own spelling preserved)
│   ├─ pronouns              free text, not an enum          ← see note A
│   ├─ one_line              "who are they, in your words"
│   └─ portrait_ref          optional; provenance-tagged (Part E, RULE M-5)
├─ facets[]                  ← OPEN-ENDED, VERSIONED, ALL OPTIONAL
│   ├─ facet_id
│   ├─ label                 child-chosen or from a soft suggestion list
│   ├─ value                 free text
│   ├─ shown_by[]            ← REQUIRED-ish pairing: episode/scene refs where it showed
│   │                          (see note B — this is the standards hook)
│   ├─ version_history[]     {value, changed_at, changed_by_child}
│   └─ status                active | retired-by-child | superseded
├─ episode_appearances[]     ← THE SERIALITY SPINE
│   ├─ episode_ref
│   ├─ role_in_episode       free text, child-authored
│   ├─ what_happened_to_them free text, child-authored   ← A5-C108 "events accumulate"
│   └─ child_notes           free text, private to child by default
├─ relationships[]
│   ├─ other_character_ref
│   ├─ described_as          free text ("her annoying cousin")
│   ├─ as_of_episode_ref     ← relationships are episode-scoped, not global
│   └─ version_history[]
├─ open_threads[]            ← CHILD-MARKED ONLY, never auto-detected
│   ├─ text                  "she still hasn't told him about the letter"
│   ├─ marked_at_episode_ref
│   └─ resolved              boolean, child-set only; NEVER counted or reported
├─ provenance                ← A5-C123
│   ├─ origin               original | remixed_from | co_created
│   ├─ derived_from_ref     nullable
│   ├─ auto_attribution     system-generated credit line
│   ├─ manual_credit        ← FREE TEXT BY THE REMIXING CHILD (A5-C123: this is
│   │                          what children actually value; auto is not enough)
│   └─ permission_state     requested | granted | declined | not_required
├─ ai_assistance_log         ← per-field: was any part AI-suggested?
│   └─ {field_ref, suggested_at, accepted_verbatim | edited_by_child | rejected}
└─ retention                 ← Part E
    ├─ school_year_ref
    ├─ delete_after
    └─ export_state
```

**Note A — pronouns as free text, not an enum.** Grounded in `A5-C70` (47% of teachers and 51% of parents already worry monitoring could out LGBTQ+ students) and `A5-C159` (over-blocking of identity terms, Part E). A fixed pronoun enum on a *fictional character* creates a structured, queryable field that can be misread as a signal about the child. Free text on a fictional character is just writing. **Never aggregate, report, or analyse this field.**

**Note B — `shown_by[]` is the single most important structural decision in this model.** It operationalises `A5-C94`: the standards ask for character-as-response-to-situation, not character-as-attribute-list. A facet with an empty `shown_by[]` is a trait nobody has dramatized. The UI should invite (never require) the child to attach a moment. This is also what makes the class-aggregate metric W7 meaningful rather than decorative.

**Note C — what is deliberately absent from the model:**

| Absent field | Why |
|---|---|
| `consistency_score`, `growth_score`, `completeness_percent` | `A5-C109`, `A5-C49`, Part B B1/B2 |
| `quality`, `creativity`, `complexity_rating` | `A5-C46`, `A5-C48` |
| `word_count` as a displayed property | `A5-C23`, `A5-C27`, Part B B3 |
| `time_spent`, `edit_count`, `session_count` | `A5-C70`, Part B B6/B7 |
| inferred `mood`, `sentiment`, `themes_detected` | `A5-C82`, Part B B11/B13 |
| any archetype/trope classification of the child's character | Encodes a canon; see Cultural Assumptions |

### D.2.4 Episode-integration behaviours

```
RULE D-4 (Recall, don't rule)
When a child opens an episode featuring an existing character, the system MAY show a
compact, collapsible "What you know about them" panel drawn from `core`,
recent `episode_appearances.what_happened_to_them`, and child-marked `open_threads`.
It is READ-ONLY CONTEXT. It never blocks, validates, or scores what the child writes next.
Default state: collapsed for B3–B4, expanded for B0–B2.   [DESIGN DECISION]
```
Grounded in `A5-C111`, `A5-C112` (the professional artifact is a reference document), `A5-C108`.

```
RULE D-5 (Episodic is the default form, serial is opt-in)
New episodes default to STANDALONE (the character appears; nothing is required to carry over).
A child may opt a character into "this one follows on from <episode>".
The system MUST NOT default children into serial obligations.
```
Grounded in `A5-C114` (episodic is the default form in children's series publishing) and `A5-C109`.

```
RULE D-6 (Threads are invitations, with an expiry on nagging)
open_threads are surfaced only inside RULE D-4's panel, phrased as possibilities
("you could pick this up"), never as tasks, never with counts, never with badges.
An unresolved thread is never a negative state. It is never reported to an adult.
```
Grounded in `A5-C112`, `A5-C49`, `A5-C73` (unresolved-thread counts would be an instant Goodhart target).

### D.2.5 Shared worlds, borrowing, and credit

```
RULE D-7 (Borrow protocol, derived from A5-C123)
IF child A wants to use child B's character in A's episode
THEN:
  D-7.1  Permission is requested from B before the character is usable, unless the class
         teacher has enabled an explicit class-wide shared-world pool that B opted into.
  D-7.2  On use, the system generates automatic attribution AND presents A with a
         free-text "say thanks / say what you borrowed" field.
         ← A5-C123: automatic attribution alone is documented as insufficient to children.
  D-7.3  B can see where their character has been used, and can withdraw permission
         for FUTURE use. Withdrawal does NOT delete A's already-published episode
         (that would make A's work hostage), but B's character record is unlinked.
  D-7.4  A's version of B's character is stored as a BRANCH under A's ownership,
         so A's changes never mutate B's original.
  D-7.5  Disputes route to the teacher as a normal classroom matter, not as a system
         judgment. The system takes no position on whether a remix was fair.
```
Grounded in `A5-C123` (manual credit valued over automatic; remixing is controversial; ~half of reactions negative), `A5-C121` (collaboration supports belonging — but belonging is fragile if credit fails).

```
RULE D-8 (Co-created characters have plural ownership)
A character marked `co_created` has multiple owner_refs.
Deletion requires... [DESIGN DECISION — recommend: any owner may withdraw their
contribution and their identity link; the record persists for remaining owners
unless all withdraw]. This interacts with data-subject deletion rights (Part E);
LEGAL REVIEW REQUIRED before implementing plural ownership.
```

### D.2.6 Fan-fiction and transformative-work posture

```
RULE D-9 (Transformative work is legitimate, and is a first-class origin type)
`provenance.origin` supports remixed_from for characters derived from ANOTHER CHILD's work.
For characters derived from COMMERCIAL media (a child writing their own Pokémon character):
  - The tool does not moralise, does not refuse, and does not label the work "unoriginal."
  - The tool does not generate or supply copyrighted characters or their likenesses.
  - Publishing scope beyond the class requires policy + LEGAL REVIEW (IP, not covered here).
```
Grounded in `A5-C117`, `A5-C118`, `A5-C119` — fan writing is a documented driver of motivation, authentic audience, and multi-register language command, and has been used in early elementary literacy work. `[UNVERIFIED]` on the IP question: no legal source on children's fan work in classroom platforms was retrieved this session.

```
RULE D-10 (Audience is the motivational lever — and must be child-controlled)
Character Studio SHOULD make a real, bounded audience available (classmates first),
because authentic audience is the documented motivator (A5-C117).
BUT audience scope is CHILD-CHOSEN per artifact, defaults to private,
and widening scope is always an explicit act, never a default or a nudge.
```
Grounded in `A5-C117` (authentic audience motivates), `A5-C70` (being observed suppresses honest expression), ICO Children's Code data-minimisation and no-nudge standards (Part E `A5-C144`, `A5-C146`).

```
RULE D-11 (AI suggestions are objects of inquiry, not answers)
Per A5-C124/A5-C125:
  - Children plan the global structure; AI fills gaps only where invited.
  - Every AI suggestion is visibly marked as a suggestion, is editable in place,
    and is trivially rejectable.
  - ai_assistance_log records accepted_verbatim | edited_by_child | rejected
    for the child's own transparency and for the tool's own bias auditing
    — NOT as a metric about the child, and NEVER shown to a teacher as
    "how much AI this child used." (That would be Part B B6/B17.)
```

---
---

# PART E — CHILD DATA PRIVACY & SAFETY

# 🚨 NOT LEGAL ADVICE — READ BEFORE USING THIS PART

**This Part is a research summary produced by an AI agent that could not open a single primary regulatory document.** Every regulatory statement below was retrieved through domain-restricted web search of the regulator's own site — it is the regulator's *paraphrase as rendered in a search summary*, not verbatim statutory or regulatory text.

**This is not legal advice. It creates no attorney-client relationship. It must not be the basis of any compliance decision.**

**Required before any Character Studio feature touching child data ships:**
1. A qualified attorney licensed in each relevant jurisdiction reviews the actual primary texts.
2. Every claim in this Part is re-verified against the primary source at the URL given.
3. Jurisdictional scope is determined (US federal, US state-by-state, UK, EU, AU, and any others).
4. School/district contracts (DPAs) are reviewed separately — contract terms frequently impose obligations *stricter* than statute.

Children's privacy law carries civil-penalty exposure, changes frequently, and is fact-specific. Treat everything below as **a list of questions to ask your lawyer**, not answers.

---

## E.1 WHAT RESEARCH SAYS

### E.1.1 COPPA — US Children's Online Privacy Protection Rule (16 CFR Part 312)

All retrieved from [ftc.gov](https://www.ftc.gov/business-guidance/resources/complying-coppa-frequently-asked-questions) via domain-restricted search. `[E3]` `[SECONDARY-SOURCED]` throughout.

**`A5-C126`** **Scope of "personal information."** Retrieved FTC guidance states COPPA applies to **photos, videos, and audio files that contain children's images or voices**, to geolocation data in such files sufficient to identify street name and city/town, and to **persistent identifiers** collected via a child's upload of photos. The definition of personal information requiring parental notice and consent includes persistent identifiers that can recognize users over time and across different websites or services. → [FTC COPPA FAQs](https://www.ftc.gov/business-guidance/resources/complying-coppa-frequently-asked-questions)

**`A5-C127`** **2025 amendments.** Retrieved: the FTC finalized amendments in **January 2025**; the amended Rule is **effective June 23, 2025** with regulated entities having until **April 22, 2026** to comply. **Personal information was expanded to include biometric identifiers** (retrieved examples: fingerprints, facial patterns, DNA sequences, **voiceprints**, gait patterns) and government-issued identifiers. → [FTC press release, Jan 2025](https://www.ftc.gov/news-events/news/press-releases/2025/01/ftc-finalizes-changes-childrens-privacy-rule-limiting-companies-ability-monetize-kids-data); [FTC COPPA Final Rule Amendments](https://www.ftc.gov/legal-library/browse/federal-register-notices/16-cfr-part-312-coppa-final-rule-amendments)
> ⚠️ **The compliance date (April 22, 2026) has passed as of this document's date (2026-08-18). Verify current obligations immediately.**

**`A5-C128`** **Separate consent for third-party disclosure / targeted advertising.** Retrieved: operators are required to obtain **separate verifiable parental consent** to disclose children's personal information to third parties for targeted advertising or other purposes; entities cannot disclose for targeted advertising unless parents separately opt in; **if a parent declines, the operator may not cut off access** to the service; **behavioral advertising toward children must be off by default.** → [FTC press release](https://www.ftc.gov/news-events/news/press-releases/2025/01/ftc-finalizes-changes-childrens-privacy-rule-limiting-companies-ability-monetize-kids-data)

**`A5-C129`** **The school-consent pathway — the single most important provision for Character Studio.** Retrieved FTC guidance: **in the educational context, schools can consent on behalf of parents to the collection of student personal information, but only if the information is used for a school-authorized educational purpose and for no other commercial purpose** — whether learning takes place in the classroom or at home at the school's direction. **The school's ability to consent is limited to the educational context.** Operators collecting under school authorization **may use it only to provide the requested online education service** and are **prohibited from using it for any commercial purpose, including marketing, advertising, or other commercial purposes unrelated to the school-requested service.** Retrieved guidance also directs that **schools or districts — not individual teachers — should decide** whether a service's practices are appropriate. → [FTC ed tech guidance](https://www.ftc.gov/business-guidance/blog/2020/04/coppa-guidance-ed-tech-companies-schools-during-coronavirus); [FTC to Ed Tech, 2022](https://www.ftc.gov/business-guidance/blog/2022/05/ftc-ed-tech-protecting-kids-privacy-your-responsibility); [FTC Policy Statement on Education Technology](https://www.ftc.gov/system/files/ftc_gov/pdf/Policy%20Statement%20of%20the%20Federal%20Trade%20Commission%20on%20Education%20Technology.pdf)

**`A5-C130`** **Prohibition on conditioning participation.** Retrieved: COPPA prohibits conditioning a child's participation in an activity on disclosure of **more personal information than is reasonably necessary** to participate; operators must disclose in the privacy policy that they are bound by this. Retrieved FTC framing describes it as **"an outright ban on collecting more personal information than is reasonably necessary"**, and states ed tech providers must not condition participation in any activity on a child disclosing more than reasonably necessary. → [FTC COPPA FAQs](https://www.ftc.gov/business-guidance/resources/complying-coppa-frequently-asked-questions); [FTC six-step compliance plan](https://www.ftc.gov/business-guidance/resources/childrens-online-privacy-protection-rule-six-step-compliance-plan-your-business)

**`A5-C131`** **Retention and deletion (§ 312.10).** Retrieved: operators may retain children's personal information **"for only as long as is reasonably necessary to fulfill the purpose for which the information was collected,"** after which it must be deleted using reasonable measures to ensure secure destruction; **information cannot be retained indefinitely.** Operators must **establish and maintain a written data retention and deletion policy**, and the **privacy policy must set forth the purposes of collection, the business need to retain, and a timeframe for deletion.** → [FTC, "Under COPPA, data deletion isn't just a good idea. It's the law."](https://www.ftc.gov/business-guidance/blog/2018/05/under-coppa-data-deletion-isnt-just-good-idea-its-law); [FTC COPPA FAQs](https://www.ftc.gov/business-guidance/resources/complying-coppa-frequently-asked-questions)

**`A5-C132`** **Written information security program.** Retrieved: operators must establish and maintain reasonable procedures to protect the confidentiality, security and integrity of children's personal information, must have a **written information security program**, and must implement safeguards appropriate to the sensitivity of the information, the operator's size and complexity, and the nature and scope of activities. → [FTC COPPA FAQs](https://www.ftc.gov/business-guidance/resources/complying-coppa-frequently-asked-questions)

**`A5-C133`** **Parental review and deletion rights.** Retrieved: covered operators must provide parents the right to **review and delete** their child's information. → [FTC COPPA FAQs](https://www.ftc.gov/business-guidance/resources/complying-coppa-frequently-asked-questions)

**`A5-C134`** **Mixed audience.** Retrieved: the Rule provides a narrow exception for a service that may be directed to children but does not target children as its primary audience. → [FTC COPPA FAQs](https://www.ftc.gov/business-guidance/resources/complying-coppa-frequently-asked-questions)
> Likely **not** applicable to Character Studio, which targets grades 2–8 directly. Flagged for counsel.

**`A5-C135`** **Support for internal operations.** Retrieved: operators using this exception must provide **online notice stating the specific internal operations** for which a persistent identifier was collected and **how they will ensure the identifier is not used or disclosed to contact a specific individual, including through targeted advertising.** → [FTC COPPA FAQs](https://www.ftc.gov/business-guidance/resources/complying-coppa-frequently-asked-questions)

**`A5-C136`** **Audio/voice enforcement policy — directly relevant if Character Studio supports dictation.** Retrieved FTC enforcement policy statement: where an operator collects an audio file containing a child's voice **solely as a replacement for written words** (to perform a search or fulfill a verbal instruction) and **maintains the file only for the brief time necessary for that purpose**, the FTC would not take enforcement action for lacking prior verifiable parental consent — **but the operator must still provide COPPA-required notice, including clear notice of collection and use of audio files and its deletion policy, in the privacy policy.** The non-enforcement policy **does not apply** where the operator requests information via voice that would otherwise be personal information (e.g. a name). → [FTC Enforcement Policy Statement on audio recordings](https://www.ftc.gov/system/files/documents/public_statements/1266473/coppa_policy_statement_audiorecordings.pdf); [FTC press release, Oct 2017](https://www.ftc.gov/news-events/news/press-releases/2017/10/ftc-provides-additional-guidance-coppa-voice-recordings)
> ⚠️ Note the tension with `A5-C127`: **voiceprints are now enumerated biometric personal information.** Whether the 2017 non-enforcement policy survives the 2025 amendments is exactly the kind of question that requires counsel.

**`A5-C137`** **Verifiable parental consent methods.** Retrieved: the Rule enumerates acceptable methods and allows parties to submit new ones for approval. **Knowledge-based authentication is approved.** **Photo-ID verification plus facial-recognition comparison to a second parent-submitted photo is approved.** In 2024 the **FTC denied** an application for "Privacy-Protective Facial Age Estimation." → [FTC, 2013 approval](https://www.ftc.gov/news-events/news/press-releases/2013/12/ftc-grants-approval-new-coppa-verifiable-parental-consent-method); [FTC, 2024 denial](https://www.ftc.gov/news-events/news/press-releases/2024/03/ftc-denies-application-new-parental-consent-mechanism-under-coppa)

### E.1.2 FERPA — US Family Educational Rights and Privacy Act

All retrieved from [studentprivacy.ed.gov](https://studentprivacy.ed.gov/ferpa) / ed.gov via domain-restricted search. `[E3]` `[SECONDARY-SOURCED]`

**`A5-C138`** **Education records and PII.** Retrieved: FERPA affords parents rights to access their children's education records, seek amendment, and have some control over disclosure of PII from those records. **Education records are records directly related to a student and maintained by an educational agency or institution or a party acting for or on behalf of the agency or institution**, recorded in any medium (handwriting, print, computer media, video, audio, film, microfilm, microfiche, email). **PII** includes **direct identifiers** (name, ID number), **indirect identifiers** (date of birth), and other information usable to distinguish or trace identity directly or indirectly **through linkage with other information.** → [What is FERPA?](https://studentprivacy.ed.gov/faq/what-ferpa); [PII for Education Records](https://studentprivacy.ed.gov/content/personally-identifiable-information-education-records); [What is an education record?](https://studentprivacy.ed.gov/faq/what-education-record)

**`A5-C139`** **School official exception — three criteria for vendors.** Retrieved: FERPA permits outsourcing institutional services or functions involving disclosure of education records to contractors, consultants, volunteers or other third parties, provided the outside party (1) **performs an institutional service or function for which the agency would otherwise use employees**, (2) **is under the direct control of the agency or institution with respect to the use and maintenance of education records**, and (3) **meets the criteria specified in the school's annual notification of FERPA rights for being a school official with a legitimate educational interest.** Retrieved guidance adds that schools may require transparency about how student data are used, plans for data security, and **evidence that the school retains direct control at all times.** → [Who is a "school official"?](https://studentprivacy.ed.gov/faq/who-school-official-under-ferpa); [Responsibilities of Third-Party Service Providers under FERPA (PDF)](https://studentprivacy.ed.gov/sites/default/files/resource_document/file/Vendor%20FAQ.pdf)

**`A5-C140`** **Use limitation and redisclosure.** Retrieved: recipients of information from education records **may use it only for the purposes for which the disclosure was made** and generally **may not redisclose PII** to any other party without prior consent of the parent or eligible student. → [studentprivacy.ed.gov FAQs](https://studentprivacy.ed.gov/frequently-asked-questions)
> **`A5-C140` is the provision most directly in tension with model training on child work.** "Only for the purposes for which the disclosure was made" is a narrow envelope. See `A5-C151`.

### E.1.3 PPRA — US Protection of Pupil Rights Amendment

**`A5-C141`** `[E3]` `[SECONDARY-SOURCED]` **Eight protected categories and consent.** Retrieved: PPRA protects students from being required to reveal, in surveys, information concerning (1) political affiliations of student or parent; (2) mental or psychological problems of student or family; (3) sex behavior or attitudes; (4) illegal, anti-social, self-incriminating or demeaning behavior; (5) critical appraisals of others with whom students have close family relationships; (6) legally recognized privileged or analogous relationships; (7) religious practices, affiliations or beliefs of student or parent; (8) income other than as required by law to determine program eligibility. **For surveys funded by the US Department of Education covering any of the eight areas, an LEA must obtain prior written ("active") consent.** PPRA applies to programs and activities of SEAs, LEAs, or other recipients of ED funds. → [ED, PPRA topic page](https://studentprivacy.ed.gov/topic/protection-pupil-rights-amendment-ppra); [SPPO-21-01 PPRA (PDF)](https://studentprivacy.ed.gov/sites/default/files/resource_document/file/20-0379.PPRA_508.pdf)

**`A5-C142`** `[E3]` `[SECONDARY-SOURCED]` **Marketing provisions and the educational-products exception.** Retrieved: PPRA's **parental notification requirement and opt-out opportunity apply to the collection, disclosure or use of personal information collected from students for marketing purposes.** However, **parents are not required by PPRA to be notified about the collection, disclosure, or use of personal information collected from students for the exclusive purpose of developing, evaluating, or providing educational products or services for, or to, students or educational institutions.** LEAs must directly notify parents of these policies at least annually at the start of each school year and within a reasonable period after any substantive change. → [ED, PPRA topic page](https://studentprivacy.ed.gov/topic/protection-pupil-rights-amendment-ppra); [ED PPRA model notice](https://www.ed.gov/media/document/ppra-gen-not-consdoc-102017.doc)
> ⚠️ **Do not over-read the exception.** Whether "developing … educational products" covers training a general-purpose AI model on children's stories is **precisely the open question requiring counsel**, not something this document resolves. The exception's scope, and its interaction with COPPA `A5-C129` ("no other commercial purpose") and FERPA `A5-C140` ("only for the purposes for which the disclosure was made"), must be analysed together.

### E.1.4 US state law — illustrative, not exhaustive

**`A5-C143`** `[E3]` `[SECONDARY-SOURCED]` **California SOPIPA** (effective January 1, 2016) applies to operators of sites, services and applications with actual knowledge that the service is used for K-12 school purposes **and** was designed and marketed for K-12 purposes. Retrieved provisions: **prohibits targeted advertising** to students or their parents/guardians; **prohibits creating profiles of students for any purpose other than K-12 educational purposes**; prohibits **selling** student information and disclosing covered information; requires **reasonable security procedures**; and requires **deletion of a student's covered information if the school or district requests it.** → [CA Legislative Information SB 1177](https://leginfo.legislature.ca.gov/faces/billNavClient.xhtml?bill_id=201320140SB1177); [Cooley analysis](https://www.cooley.com/news/insight/2014/californias-student-online-personal-information-protection-act-is-the-first-state-law-to-comprehensively-address-student-privacy)
> **Many US states have student-privacy statutes.** Only California's was retrieved in detail. A per-state review is required; see [Parent Coalition for Student Privacy state list](https://studentprivacymatters.org/state-legislation/). `[UNVERIFIED]` for all states other than California.

### E.1.5 UK / EU — Children's Code and GDPR

**`A5-C144`** `[E3]` `[SECONDARY-SOURCED]` **ICO Children's Code (Age Appropriate Design Code).** Retrieved: the Code contains **15 standards** online services must follow to comply with data protection law when protecting children's data. **Standard 1, best interests of the child:** the best interests of the child should be **a primary consideration** when processing their data, with the **UNCRC as the basis** for the assessment. Organisations **must undertake a DPIA** to assess and mitigate risks to children's rights and freedoms, and the standards must be built into design processes from the start and into upgrade/development processes. **Data minimisation standard:** *collect and retain only the minimum amount of personal data needed to provide the elements of the service in which a child is actively and knowingly engaged*, and **give children separate choices over which elements they wish to activate.** → [ICO, Introduction to the Children's code](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/childrens-code-guidance-and-resources/introduction-to-the-childrens-code/); [ICO, Code standards](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/childrens-code-guidance-and-resources/age-appropriate-design-a-code-of-practice-for-online-services/code-standards/); [ICO, best interests assessment](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/childrens-code-guidance-and-resources/how-to-use-our-guidance-for-standard-one-best-interests-of-the-child/best-interests-assessment/)

**`A5-C145`** `[E3]` `[SECONDARY-SOURCED]` **Defaults and profiling standards.** Retrieved: **geolocation options off by default** unless a compelling reason can be demonstrated taking account of the child's best interests, with options making a child's location visible to others defaulting back to off at the end of each session; **options which use profiling switched off by default** unless a compelling reason can be demonstrated, and profiling allowed only with appropriate measures to protect the child from harmful effects, in particular being fed content detrimental to health or wellbeing. → [ICO, Default settings](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/childrens-code-guidance-and-resources/age-appropriate-design-a-code-of-practice-for-online-services/7-default-settings/); [ICO, Code standards](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/childrens-code-guidance-and-resources/age-appropriate-design-a-code-of-practice-for-online-services/code-standards/)

**`A5-C146`** `[E3]` `[SECONDARY-SOURCED]` **Nudge techniques standard.** Retrieved: **do not use nudge techniques to lead or encourage children to provide unnecessary personal data or to weaken or turn off their privacy protections**; if a user changes their settings they should generally be given the option to do so permanently or to return to high-privacy defaults at the end of the session; **"you should not 'nudge' them towards taking a lower privacy option."** → [ICO, Code standards](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/childrens-code-guidance-and-resources/age-appropriate-design-a-code-of-practice-for-online-services/code-standards/); [ICO, FAQs on the 15 standards](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/childrens-code-guidance-and-resources/faqs-on-the-15-standards-of-the-children-s-code/)

**`A5-C147`** `[E3]` `[SECONDARY-SOURCED]` **GDPR Article 8 and Article 17.** Retrieved: under Article 8, where consent is the lawful basis for information society services offered directly to a child, processing is lawful where the child is **at least 16**; below 16, consent must be given or authorised by the holder of parental responsibility; **Member States may provide a lower age, not below 13.** Controllers must make **reasonable efforts to verify** parental authorisation, taking available technology into account. Under **Article 17(1)(f) / UK GDPR right to erasure**, the right applies where data were collected in relation to the offer of information society services under Article 8(1); retrieved ICO guidance states this is **relevant in particular where the data subject gave consent as a child and was not fully aware of the risks**, that the **right persists even though the person is no longer a child**, and that controllers **"should give particular weight to any request for erasure"** where processing is based on consent given by a child, especially online. → [GDPR Art. 8](https://gdpr-info.eu/art-8-gdpr/); [GDPR Art. 17](https://gdpr-info.eu/art-17-gdpr/); [ICO, right to erasure and children](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/children-and-the-uk-gdpr-old/how-does-the-right-to-erasure-apply-to-children/); [ICO, children's data protection rights](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/children-and-the-uk-gdpr/what-data-protection-rights-do-children-have/)

### E.1.6 Children's rights and safety-by-design frameworks

**`A5-C148`** `[E3]` `[SECONDARY-SOURCED]` **UN Committee on the Rights of the Child, General Comment No. 25 (2021), on children's rights in relation to the digital environment.** Retrieved: an authoritative document setting out how States should implement the UNCRC in the digital context; **reaffirms non-discrimination, best interests of the child, rights to life/survival/development, and respect for children's views and evolving capacities in online environments**; States party must **consider the best interests of children when making decisions on the provision, regulation, design and management of the digital environment.** Retrieved process detail: **709 children aged 9–22 across 27–28 countries** were consulted. → [OHCHR, General comment No. 25](https://www.ohchr.org/en/documents/general-comments-and-recommendations/general-comment-no-25-2021-childrens-rights-relation); [5Rights](https://5rightsfoundation.com/resource/uncrc-general-comment-no-25-childrens-rights-apply-online/)

**`A5-C149`** `[E4]` `[E3]` `[SECONDARY-SOURCED]` **eSafety Commissioner (Australia), Safety by Design — three core principles:** (1) **Service provider responsibility** — "the burden of safety should never fall solely upon the user"; (2) **User empowerment and autonomy** — human agency and autonomy supported, amplified and strengthened, with technical measures and tools allowing users to manage their own safety, **"set to the most secure privacy and safety levels by default"**; (3) **Transparency and accountability** — publication of information about policy enforcement and the efficacy of safety features. → [eSafety, Safety by Design](https://www.esafety.gov.au/industry/safety-by-design); [eSafety, Principles PDF](https://www.esafety.gov.au/sites/default/files/2019-10/SBD%20-%20%20Principles.pdf)

### E.1.7 AI features and student data specifically

**`A5-C150`** `[E3]` `[SECONDARY-SOURCED]` **US Department of Education, Office of Educational Technology, *Artificial Intelligence and the Future of Teaching and Learning: Insights and Recommendations* (2023).** Retrieved key risk statement: **"AI adds new risks of algorithmic discrimination due to unwanted patterns in existing data and unfair automated decision-making."** Retrieved recommendations include prioritising informing and involving educational constituents so they are prepared to investigate how and when AI fits specific teaching and learning needs and what risks may arise, and building trust and establishing criteria for trustworthiness of emerging educational technologies. → [ED AI report PDF](https://www.ed.gov/sites/ed/files/documents/ai-report/ai-report.pdf); [ERIC ED631097](https://eric.ed.gov/?id=ED631097); [ED AI Guidance hub](https://www.ed.gov/about/ed-overview/artificial-intelligence-ai-guidance)

**`A5-C151`** `[E6]` `[SECONDARY-SOURCED]` **Using student data to train AI models is an active and unsettled policy area.** Retrieved (from journalism and practitioner sources, **not** primary legislative text): **California AB 1159**, described as still moving through the legislature as of mid-2026, would prohibit schools and ed tech vendors from using student data to train AI models; **Idaho SB 1227** is described as requiring data-privacy protections specifically for AI tools used in schools. Retrieved practitioner guidance recommends that **the DPA explicitly state that student data will not be used to train commercial AI models** and that the district retains the right to request deletion at any time, with **written documentation rather than general assurances**. Retrieved commentary also notes enterprise agreements typically prohibit training on school data while **standard consumer licences may allow broader data use including feeding student interactions back into model improvement**. → [Forbes](https://www.forbes.com/sites/sarahhernholm/2026/07/24/schools-race-to-write-ai-policies-what-about-student-data-privacy/); [FPF, *Vetting Generative AI Tools for Use in Schools* (PDF)](https://fpf.org/wp-content/uploads/2024/10/Ed_AI_legal_compliance.pdf_FInal_OCT24.pdf); [Wisconsin DPI AI policy guidance](https://dpi.wi.gov/imt/ai-guidance/administrators/policy)
> ⚠️ **`[UNVERIFIED]` as to bill status and text.** Legislative trackers were not reachable. **Verify current status of AB 1159, SB 1227, and any successor legislation before relying on any statement here.**

**`A5-C152`** `[UNVERIFIED]` **Ownership of student-created work.** Searched for authoritative statements on who owns copyright in K-12 student-created work under school district policy. Retrieved results were **school-district copyright pages and a SETDA paper focused on *teacher*-created content**; retrieved commentary notes ambiguity about who is the "author" for copyright purposes in educational contexts and that districts develop their own policies. **No authoritative determination of student-work ownership was retrieved.** This is a genuine open legal question for a platform that stores children's original characters. → [SETDA, Clarifying Ownership of Teacher-Created Digital Content (PDF)](https://www.setda.org/wp-content/uploads/2014/03/SETDA_WPTeacher-Created.final_.5.29.pdf); [Library of Congress copyright blog for K-12](https://blogs.loc.gov/copyright/2020/11/six-copyright-concepts-your-k-12-students-should-know/)

### E.1.8 Bias and representation in AI-generated character content

**`A5-C153`** `[E1]` `[SECONDARY-SOURCED]` **Gender erasure in AI-generated children's stories — the most directly on-point study retrieved.** Finkley, Li & Walsh, *Neutrality Bites: Gender Representation in AI-Generated Animal Stories* (ACM FAccT 2026). Method: **six leading LLMs** prompted to complete an English-language story about **seven anthropomorphic animal characters whose gender is unstated**, across **four narrative settings** and a range of temperatures. Across **23,800 stories**: models **avoided gendering the character 19% on average** and used gender-neutral language ("it"/"its") **38.2% on average**; when gender was assigned, **feminine animal characters appeared in just 2.2% of stories vs. 40.6% featuring masculine characters**; feminine characters **clustered heavily in cat stories, accounting for just over half of them.** The authors argue **models prioritising neutrality to address social bias may contribute to the erasure of marginalized perspectives and identities**, and that strategies beyond neutrality are needed. → [arXiv 2606.07969](https://arxiv.org/abs/2606.07969); [ACM FAccT 2026](https://dl.acm.org/doi/10.1145/3805689.3812287)

> **This finding invalidates the obvious mitigation.** The intuitive fix for gender bias in an AI character generator — make it neutral — is the specific behaviour this study documents as producing 2.2% feminine representation. **"Default to neutral" is not a safe default for character generation.**

**`A5-C154`** `[E1]` `[SECONDARY-SOURCED]` **Text-to-image bias.** Retrieved: Stable Diffusion exhibits significant biases across six races, two genders, 32 professions and eight attributes, with **significant racial homogenization** (retrieved example: depicting nearly all Middle Eastern men as bearded, brown-skinned, and in traditional attire); DALL·E 2 shows representational bias, underrepresenting women in male-dominated fields and overrepresenting them in female-dominated professions. → [Scientific Reports, AI-generated faces and racial homogenization](https://www.nature.com/articles/s41598-025-99623-3); [arXiv 2510.08628, The Digital Mirror](https://arxiv.org/pdf/2510.08628)

**`A5-C155`** `[E1]` `[SECONDARY-SOURCED]` **Disability representation.** Mack et al., *"They only care to show us the wheelchair": disability representation in text-to-image AI models* (CHI 2024). Retrieved findings: models produce **narrow, reductive images over-associating disability with wheelchair use**, portraying disabled people as **old, sad, isolated, or emotionally burdened**; **"bizarre amalgamation of human and wheelchair," half-human half-wheelchair hybrids**; **over-use of sunglasses** for blind people; failure to depict disabled individuals as multi-dimensional, defaulting to white, young or elderly figures. Retrieved participant concern: **"people unfamiliar with disability, including children or educators, might take these images at face value, thereby perpetuating misconceptions."** Participants wanted realistic portrayals of disabled people doing everyday things. → [CHI 2024, ACM DL](https://dl.acm.org/doi/10.1145/3613904.3642166); [arXiv 2406.14993](https://arxiv.org/pdf/2406.14993)

**`A5-C156`** `[E1]` `[SECONDARY-SOURCED]` **Cultural and topic bias in generated children's stories** is a named, studied phenomenon — retrieved title: *Cultural and Topic Bias in Generating Children's Stories* (EMNLP 2025). → [ACL Anthology](https://aclanthology.org/2025.emnlp-main.3.pdf)

**`A5-C157`** `[E1]` `[E6]` `[SECONDARY-SOURCED]` Retrieved reports of role-assignment bias in AI-generated educational narratives: characters "in need of support" being overwhelmingly depicted with names signalling historically marginalized identities; AI-generated children's stories reflecting biases in character roles, authority, age, personality and relationships "even when the stories appear imaginative and playful." Retrieved via secondary reporting; underlying studies not read. → [Stanford HAI](https://hai.stanford.edu/news/how-harmful-are-ais-biases-on-diverse-student-populations); [bioengineer.org summary](https://bioengineer.org/ai-models-nearly-erase-female-characters-in-animal-stories-for-children/)

### E.1.9 Moderation of AI-generated and child-generated content

**`A5-C158`** `[E4]` `[E1]` `[SECONDARY-SOURCED]` Retrieved characterisation of content moderation for children: moderation "tends to be **reactive** and focused on populations, specifying what should not be shown to broad groups rather than what might harm a specific user"; despite platform efforts, **children can encounter harmful material through passive exposure and active interaction**; and platform features "may not best support opportunities for youth community regulation and safe conflict resolution," with a positive counter-example of a children's Minecraft server offering direct user-to-user conflict resolution **plus a keyboard shortcut to alert a moderator.** Retrieved US government guidance: NTIA's Kids Online Health and Safety Task Force recommended practices for industry. → [Digital Wellness Lab research brief](https://digitalwellnesslab.org/research-briefs/young-people-content-effects-and-current-content-moderation-practices/); [NTIA, Recommended Practices for Industry](https://www.ntia.gov/report/2024/kids-online-health-and-safety/online-health-and-safety-for-children-and-youth/taskforce-guidance/recommended-practices-for-industry); [ICMEC, The Importance of Content Moderation (PDF)](https://cdn.icmec.org/wp-content/uploads/2023/06/TP-ICMEC-Downloadable-Part-2-The-Importance-Of-Content-Moderation.pdf)

**`A5-C159`** `[E1]` `[E6]` `[SECONDARY-SOURCED]` **Safety filters over-block marginalized identity terms.** Retrieved: Instagram's sensitive-content system **misclassified LGBTQ+ terms and blocked LGBTQ-related content from teenage users**, affecting hashtags including #lesbian, #bisexual, #gay, #trans, #queer, #nonbinary; retrieved research reports that terms such as "transgender" and "nonbinary" **attract more moderation flags than other terms**; and retrieved ACLU material notes schools' filtering software often blocks LGBT informational sites that are not sexually explicit. → [Beebom report on Instagram misclassification](https://beebom.com/instagram-blocked-lgbtq-hashtags-sensitive-content-mistake/); [ACLU, Anti-LGBTQ Web Filtering](https://www.aclu.org/issues/lgbtq-rights/lgbtq-youth/anti-lgbtq-web-filtering); [GLAAD Social Media Safety Index](https://glaad.org/social-media-safety-index-unveils-how-tech-companies-intentionally-rolled-back-lgbtq-safety-policies/)

> **`A5-C159` + `A5-C70` compose into a specific harm.** A filter that flags "nonbinary" in a child's character description, in a system where flags reach a teacher, is a mechanism for outing a child through their fiction — the exact risk 47% of teachers and 51% of parents named in `A5-C70`.

**`A5-C160`** `[E6]` `[SECONDARY-SOURCED]` **AI companion/roleplay characters carry documented risks for minors.** Retrieved concerns: children forming strong emotional bonds with chatbot companions that "talk back," strengthening attachment; younger children struggling with the fantasy/reality distinction, tweens vulnerable to parasocial attachment, teens using companions to avoid real relationships; documented instances of major-platform chatbots facilitating sexually explicit conversations with minors; and guardrails deliberately loosened for engagement. Retrieved sources are advocacy, journalism, and UNESCO commentary rather than controlled studies — **`[E6]`, contested, but the direction is corroborated across independent sources.** Retrieved recommendation: education bots should be **"friendly but professional and maintain strict boundaries, just as a human teacher would."** → [UNESCO, Ghost in the Chatbot](https://www.unesco.org/en/articles/ghost-chatbot-perils-parasocial-attachment); [KQED parent guide](https://www.kqed.org/news/12038874/how-to-talk-with-your-kids-about-ai-companion-bots); [arXiv 2606.28968, Beyond Her: Safety Dynamics in Role-play AI Companions](https://arxiv.org/pdf/2606.28968)

> **Direct product relevance:** if Character Studio ever lets a child *talk to* their character, it has built a companion chatbot for children. That is a materially different product with a materially different risk profile from a character *editor*.

---

## E.2 WHAT CHARACTER STUDIO SHOULD DO

> **Every rule below is a research-derived proposal requiring attorney sign-off. Rules are traced to claim IDs so counsel can check the reasoning.**

### E.2.1 Consent and lawful-basis requirements

| # | Requirement | Traced to | Notes |
|---|---|---|---|
| **P-1** | Operate under the **school-authorization pathway**: collect only what serves the school-authorized educational purpose, and use it for **no other commercial purpose**. | `A5-C129` | This is the design constraint from which most others follow. |
| **P-2** | **No advertising, no targeted advertising, no behavioural advertising, ever** — not merely off-by-default. | `A5-C128`, `A5-C129`, `A5-C143` | Removes an entire class of consent obligations. Recommend contractual commitment. |
| **P-3** | **No student profiling for any purpose other than the K-12 educational purpose**; profiling options off by default. | `A5-C143`, `A5-C145` | ICO requires off-by-default; SOPIPA prohibits non-educational profiles. |
| **P-4** | **Pseudonymous child references throughout the data model.** Real names, if needed at all, live in one mapping table under school control, never in character records or telemetry. | `A5-C138`, `A5-C144` | Reduces PII surface; supports data minimisation. |
| **P-5** | **Do not condition use of Character Studio on any disclosure beyond the minimum necessary.** No optional-profile nag, no "complete your profile" prompt. | `A5-C130`, `A5-C144` | COPPA describes this as an outright ban, not a balancing test. |
| **P-6** | **Verify the school/district — not the teacher — has authorized the service.** | `A5-C129` | FTC guidance directs the decision to school/district level. |
| **P-7** | Where operating in the **UK/EU** on a consent basis rather than a school basis, apply Article 8 age thresholds per Member State and make reasonable verification efforts. | `A5-C147` | Jurisdictional analysis required. |
| **P-8** | Complete a **DPIA before launch** and before each significant change, with best-interests-of-the-child as a primary consideration. | `A5-C144`, `A5-C148` | Required by the Children's Code; good practice everywhere. |
| **P-9** | **No nudges toward lower privacy.** No dark patterns, no "share your character with everyone?" prompts, no pre-checked sharing. | `A5-C146` | Interacts with `RULE D-10`. |
| **P-10** | If **dictation/voice** is supported: use audio solely as a replacement for typed words, retain only for the brief moment needed, delete immediately, and disclose collection, use and deletion in the privacy policy. **Never store voiceprints.** | `A5-C136`, `A5-C127` | ⚠️ 2017 non-enforcement policy vs. 2025 biometric definition — **counsel must resolve.** |
| **P-11** | If **portraits/images of the child** are ever supported: treat as personal information; recommend **not supporting** child photographs at all. | `A5-C126` | Simplest compliance posture is not to collect. |
| **P-12** | No **facial age estimation** for age assurance; the FTC denied that mechanism as VPC. | `A5-C137` | |

### E.2.2 Data-retention rules

```
RULE P-13 (Retention)
Every stored item carries a purpose and a deletion timeframe. Nothing is retained
"in case it's useful."

  Character records + episodes    → retained for the school year, plus a defined
                                    grace period for export.
                                    [DESIGN DECISION: recommend end-of-school-year
                                    + 60 days. NOT derived from any source.]
  Moderation event records        → shortest period that supports duty of care.
                                    [DESIGN DECISION: needs counsel + school input.]
  AI prompt/response logs         → shortest period supporting abuse investigation
                                    and safety debugging.
                                    [DESIGN DECISION: recommend ≤30 days, then delete.]
  Telemetry                       → no child-identifiable telemetry retained at all.
  Voice audio                     → seconds; delete after transcription (P-10).

Published: a WRITTEN data retention and deletion policy, and a privacy policy stating
purposes of collection, business need to retain, and deletion timeframe for each category.
```
Traced to `A5-C131` (written policy + privacy-policy content required; indefinite retention prohibited) and `A5-C144` (retain only the minimum). **All bracketed durations are DESIGN DECISIONS invented here and must be set by counsel and by district contract.**

```
RULE P-14 (Deletion and export rights)
  - Parents can review and delete their child's information.            [A5-C133]
  - Schools/districts can request deletion of covered information.      [A5-C143]
  - Children can delete their own characters and episodes, and this is a
    prominent, always-available control, not buried.                    [A5-C148, A5-C149]
  - Erasure requests relating to data given as a child receive particular
    weight, and the right persists into adulthood.                      [A5-C147]
  - Children/families can EXPORT their work in an open format before deletion.
    Deletion must never be the only way to leave.
  - Deletion propagates to derived artifacts (embeddings, caches, indexes, backups)
    on a documented schedule.  ← ENGINEERING REQUIREMENT, often missed.
```

```
RULE P-15 (Use limitation — the training question)
DEFAULT: Child-created content is NOT used to train, fine-tune, or evaluate any model,
         and is NOT sent to any third party that would do so.

This default is chosen because:
  - COPPA school-consent pathway limits use to the school-authorized educational
    purpose and "no other commercial purpose."                          [A5-C129]
  - FERPA limits use to "the purposes for which the disclosure was made" and
    restricts redisclosure.                                             [A5-C140]
  - SOPIPA prohibits non-educational profiling and disclosure.          [A5-C143]
  - PPRA's educational-products exception may or may not cover model training —
    this is UNRESOLVED and is exactly the wrong question to guess at.   [A5-C142]
  - Practitioner guidance recommends DPAs state explicitly that student data will
    not train commercial AI models.                                     [A5-C151]
  - State law is actively moving on this point.                         [A5-C151]

⚠️ POLICY DECISION REQUIRING LEGAL REVIEW — flagged as required by scope.
   Any deviation from this default (including "de-identified" training use) must be
   approved by counsel, disclosed plainly to schools and families, and reflected in
   the DPA. De-identification claims for free-text children's creative writing should
   be treated skeptically: names, places and details children write about are
   frequently their own.
```

### E.2.3 Transparency and rights

| # | Requirement | Traced to |
|---|---|---|
| **P-16** | Publish, in plain language, what is collected, why, how long, and who sees it — in **three registers** matching the age bands (`RULE C-3`). | `A5-C144`, `A5-C148`, `A5-C88` |
| **P-17** | Children's views are sought in design; the tool's own design process consults children. | `A5-C148` (respect for children's views and evolving capacities) |
| **P-18** | The burden of safety does not fall on the child; defaults are the most protective settings. | `A5-C149` |
| **P-19** | Publish enforcement/efficacy information about the safety features. | `A5-C149` |
| **P-20** | Give children **separate choices over which elements they activate** rather than one all-or-nothing consent. | `A5-C144` |

### E.2.4 Moderation guardrails

```
RULE M-1 (Two distinct pipelines — never conflate them)
  PIPELINE A — SAFETY: detects genuine risk of harm to a child.
               Narrow. High threshold. Routes to a human.
  PIPELINE B — CONTENT SUITABILITY: governs what the AI will GENERATE.
               Constrains the MACHINE's output, not the CHILD's writing.

A child writing a dark, sad, violent, or strange story is doing FICTION.
It is Pipeline A input ONLY under the narrow criteria in M-2. It is never
"flagged content" in the ordinary sense.
```
Traced to `A5-C82` (fiction is not testimony), `A5-C70`/`A5-C72` (chilling effects and outing risk), `A5-C158` (moderation is typically reactive and population-shaped rather than harm-shaped).

```
RULE M-2 (Safety escalation criteria — deliberately narrow)
Pipeline A escalates to a named adult ONLY for content indicating:
  - credible risk of serious harm to the child or another identifiable person
  - disclosure of abuse
  - sexual content involving a minor
IT DOES NOT ESCALATE FOR: sad themes, death of a fictional character, villains,
conflict, monsters, illness, grief, "dark" tone, unusual imagination,
non-standard English, or identity terms.
Escalation destination is the school's own designated safeguarding process,
NOT a product-side alert stream. Character Studio routes; it does not adjudicate.
```
Traced to `A5-C158`, `A5-C70`, `A5-C82`, and Part B `RULE B-6` (alert discipline).

```
RULE M-3 (Identity-term protection — mandatory over-blocking audit)
Any classifier used anywhere in Character Studio MUST be tested for over-flagging of:
  identity terms (LGBTQ+ terms, disability terms, religious terms, ethnic terms,
  names from underrepresented languages), and non-standard English / dialect.
IF elevated false-positive rates are found for any such term class
THEN the classifier does not ship until remediated.
Identity terms are NEVER, on their own, a signal of anything.
```
Traced to `A5-C159` (documented over-blocking of LGBTQ+ terms including for teen users), `A5-C70` (outing risk), `A5-C98`/L.3.3.b (dialect in dialogue is standards-aligned writing), `A5-C36` (monolingual bias).

```
RULE M-4 (No adjudication of a child's imagination)
Character Studio MUST NOT rate, label, or report a child's character or story as
inappropriate, concerning, unusual, off-topic, or low-quality.
Where the tool declines to GENERATE something, it says so plainly and briefly,
offers an alternative, and does not lecture, shame, or record a strike against the child.
Repeated declines are not a metric and are never surfaced to an adult.
```
Traced to `A5-C49`, `A5-C70`, Part B `B11`/`B17`.

### E.2.5 Bias guardrails for AI-generated character suggestions

```
RULE M-5 (Provenance on every AI suggestion)
Every AI-generated character element is marked as AI-suggested at the field level,
recorded in ai_assistance_log, editable in place, and rejectable in one action.
The child always knows which parts are theirs.
```
Traced to `A5-C125` (AI outputs as objects of inquiry, not authoritative products), `A5-C124` (preserving creative ownership).

```
RULE M-6 (Neutrality is NOT the mitigation — the counter-intuitive rule)
Character Studio MUST NOT solve representation bias by defaulting AI-generated
characters to gender-neutral / identity-unspecified.
Evidence: prioritising neutrality produced 19% ungendered + 38.2% neutral language,
and when gender WAS assigned, 2.2% feminine vs 40.6% masculine.   [A5-C153]

INSTEAD:
  M-6.1  The CHILD specifies identity attributes; the system does not guess.
  M-6.2  Where the system must produce a default (e.g. an example character),
         defaults are drawn to be balanced ACROSS the corpus of defaults,
         not neutral within each one.
  M-6.3  Measure the distribution of what the system actually generates, in
         aggregate, at intervals. Report it internally. Fix skew.
```

```
RULE M-7 (Suggestion-space audits before launch and on a schedule)
Audit AI character SUGGESTIONS (not children's work) for:
  - gender distribution across generated characters                    [A5-C153]
  - racial/ethnic homogenization in any generated imagery              [A5-C154]
  - disability portrayal: wheelchair over-association, sadness/isolation
    framing, human-object hybrids, sunglasses-for-blindness            [A5-C155]
  - role-assignment skew: who is depicted as struggling, needing help,
    being an authority, being a villain                                [A5-C157]
  - cultural/topic skew in settings, names, foods, family structures   [A5-C156]
Findings that show skew block release of the affected suggestion path.
```

```
RULE M-8 (Imagery)
IF Character Studio generates character imagery
THEN M-7's image audits are mandatory, AND generated imagery must not be presented
     as a canonical depiction — it is one interpretation the child may replace or reject.
Retrieved participant concern is explicit that children and educators may take
AI disability imagery "at face value."                                  [A5-C155]
```

```
RULE M-9 (No companion chatbot without a separate risk assessment)
"Talk to your character" is NOT an incremental feature of a character editor.
IF such a feature is proposed
THEN it requires its own risk assessment covering parasocial attachment,
     fantasy/reality confusion in younger bands, boundary maintenance,
     and sexual-content guardrails — and its own legal and safeguarding review.
Retrieved guidance for education bots: friendly but professional, with strict
boundaries, as a human teacher would maintain.                          [A5-C160]
Default posture: the character is a THING THE CHILD WRITES, not a thing that talks back.
```

### E.2.6 Contract and governance requirements

| # | Requirement | Traced to |
|---|---|---|
| **P-21** | Maintain a **written information security program** with safeguards appropriate to sensitivity, size, complexity and scope. | `A5-C132` |
| **P-22** | Support **FERPA school-official-exception** conditions contractually: perform an institutional function, remain **under the school's direct control** for use and maintenance of education records, and meet the school's annual-notification criteria. | `A5-C139` |
| **P-23** | **No redisclosure** of PII from education records without consent; sub-processors bound by the same terms. | `A5-C140` |
| **P-24** | Contractually commit: **no sale of student data, no targeted advertising, no non-educational profiling, deletion on district request.** | `A5-C143` |
| **P-25** | Contractually state the **model-training position** explicitly and in writing, per `RULE P-15`. | `A5-C151` |
| **P-26** | Give schools **documentation, not assurances**: data flows, sub-processors, retention schedule, deletion mechanics, audit results from `RULE M-7`. | `A5-C151`, `A5-C149` |
| **P-27** | Re-verify all of Part E against primary sources on a fixed cadence; COPPA changed materially in 2025 and state AI/student-data law was moving in 2026. | `A5-C127`, `A5-C151` |

---

# character-studio-core

An executable form of the [Character Studio knowledge base](../character-studio-kb/). The research lives there; this package encodes the subset that can be expressed as **enforced constraints** rather than documentation.

```bash
npm install   # @types/node + typescript only
npm test      # 54 tests
```

Zero runtime dependencies.

## Why a rule engine and not a UI

`90-integrated-decision-logic.md` §11 prescribes a build order, and it is deliberate:

> The ordering is deliberate: every layer constrains the next. A team that builds scaffolds first and prohibitions later will find the prohibitions expensive and will be tempted to weaken them.

So this is layers 1–5 of that order. The prohibitions exist as code that **throws**, not as guidance in a prompt that a later refactor can quietly drop.

| Layer | Module | What it enforces |
|---|---|---|
| 1 | `prohibitions.ts` | Forbidden metrics, suggestion-type gate, no absence-driven offers, no peer ranking, nothing hidden from the child |
| 2 | `doNotFlag.ts` | The 32-item union do-not-flag list, with exactly one permitted exception |
| 3 | `budget.ts` | One **global** offer budget; zero auto-inserted text |
| 4 | `feedback.ts` | Silence by default; the never-say list as an output filter |
| 5 | `genre.ts` | Genre prompt eligibility — questions only |
| — | `engine.ts` | Makes the kb §3 precedence order executable |

## What it refuses to do

Calling these is a design bug, so they throw rather than no-op:

```ts
assertMetricAllowed('creativity_score');        // throws — kb 05 P1
assertSuggestionTypeAllowed('trait');           // throws — kb 04 A14.2
assertNotAbsenceDriven({derivedFrom:'template_diff'}); // throws — kb 03 P-B2
assertNoAutoInsert(1);                          // throws — kb 90 §5
assertNoPeerRanking('top_n');                   // throws — kb 05 invariant R
guardAnalytics('session_count');                // throws — not implemented, see below
```

The suggestion-type gate is the load-bearing one. `A14.2` forbids offering traits, names, motivations, backstory, dialogue or descriptions as ready-to-accept content, because users adopt a model's leanings, content converges, and users do not notice while feeling in full control. Every genre prompt in `genre.ts` is therefore a **question** — `"What does your character notice that others miss?"`, never `"your detective is observant"` — and a test asserts that every prompt ends in `?`. A prompt that names a trait is a regression, not a refinement.

## Educator analytics are deliberately absent

`guardAnalytics()` throws unconditionally. kb §11 puts educator surfaces last, gated on the **H-2 qualified-attorney review**, and the privacy module was written by an agent that could not open a single primary regulatory text. A stub that silently returned data would be the wrong kind of convenient.

## Defect D-1 is resolved here

The knowledge base shipped with two incompatible band numberings: module 01 is zero-indexed (`B0` = ages 5–6), the governing conventions and modules 03/05 are one-indexed (`B1` = ages 5–6). Code cannot hold both, so building forced the resolution.

**This package adopts the one-indexed conventions taxonomy.** `BAND_SPEC` retains each band's module-01 label purely for auditing, and `fromModule01Label()` translates. Every site importing a module-01 rule is commented `D-1 shift`.

The divergence it caused is also resolved: module 01 `R2.1s` withholds genre features through ages 5–8 and introduces them from ages 9–10, while module 03 `P-A3` turned them off for K–1 only. Resolved toward module 01, because it owns developmental defaults (kb §3 P2) and because kb §9 makes the conservative reading the default under uncertainty. So `genrePromptsOnByDefault()` is false through `B2` and true from `B3`.

It remains a **default, not a gate**: a tested invariant confirms a younger child who asks gets prompts anyway.

## Inherited limitations

Everything in `../character-studio-kb/00-shared-conventions.md` §2 applies. No source behind these rules was read end to end — the research ran behind an egress policy that blocked full-text retrieval from every scholarly and governmental host. The thresholds here marked `DESIGN DECISION` are usability guesses, not findings, and none of this has been tested with a child.

What the tests prove is **internal consistency with the knowledge base**, not that the knowledge base is right.

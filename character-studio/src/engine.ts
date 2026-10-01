/**
 * The engine. Applies the layers in the order kb 90 §11 prescribes, and makes
 * the precedence order of kb 90 §3 executable:
 *
 *   P0  the four commitments (kb 00 §11) override everything
 *   P1  prohibitions beat permissions
 *   P2  domain ownership
 *   P3  the more conservative option wins
 *   P4  ownership is the final tie-breaker
 *
 * Every decision carries the layer that made it and a citation, so any
 * behaviour can be traced back to the knowledge base.
 */

import { type Band, type ObservedOutput, effectiveBand } from './bands.js';
import {
  assertMetricAllowed,
  assertNotAbsenceDriven,
  assertSuggestionTypeAllowed,
  type SuggestionType,
} from './prohibitions.js';
import { type BudgetState, mayOffer, recordOffer } from './budget.js';
import { type SpeakTrigger, filterUtterance, maySpeak } from './feedback.js';
import { type Genre, type GenrePrompt, eligiblePrompts, mayOfferRoundness } from './genre.js';

export type Layer =
  | 'prohibitions'
  | 'do_not_flag'
  | 'budget'
  | 'silence'
  | 'genre'
  | 'never_say';

export interface OfferDecision {
  readonly offer: GenrePrompt | undefined;
  readonly allowed: boolean;
  /** Which layer decided. Undefined only when every layer passed. */
  readonly decidedBy: Layer | undefined;
  readonly reason: string;
}

export interface OfferRequest {
  readonly ageBand: Band;
  readonly observed: ObservedOutput;
  readonly genres: readonly Genre[];
  readonly trigger: SpeakTrigger;
  /** True when the child asked for help, which bypasses budget and band default. */
  readonly requested: boolean;
  readonly suggestionType: SuggestionType;
  /** Where the offer came from. Template diffs are refused outright. */
  readonly derivedFrom: 'child_content' | 'template_diff';
}

/**
 * The single entry point for deciding whether to offer a prompt.
 *
 * Mutates `budget` only when an offer is actually emitted.
 */
export function considerOffer(req: OfferRequest, budget: BudgetState): OfferDecision {
  // ---- P1: prohibitions, before anything else (kb 90 §6) ----
  // These throw. A caller tripping one has a design bug, not a runtime
  // condition to handle.
  assertSuggestionTypeAllowed(req.suggestionType);
  assertNotAbsenceDriven({ derivedFrom: req.derivedFrom });

  // ---- Layer 4: silence by default (kb 04 A9.1) ----
  const speak = maySpeak(req.trigger);
  if (!speak.allowed) {
    return { offer: undefined, allowed: false, decidedBy: 'silence', reason: speak.reason };
  }

  // ---- Layer 3: the global shared budget (kb 90 §5) ----
  const budgetDecision = mayOffer(budget, req.requested);
  if (!budgetDecision.allowed) {
    return {
      offer: undefined,
      allowed: false,
      decidedBy: 'budget',
      reason: budgetDecision.reason,
    };
  }

  // ---- Layer 5: genre eligibility, which only narrows ----
  const band = effectiveBand(req.ageBand, req.observed);
  const pool = eligiblePrompts({ genres: req.genres, band, requested: req.requested });
  if (pool.length === 0) {
    return {
      offer: undefined,
      allowed: false,
      decidedBy: 'genre',
      reason:
        req.genres.length === 0
          ? 'No genre chosen; the character is complete and valid as-is (kb 03 P-A2)'
          : `Genre prompting off by default below B3 and not requested (kb 90 §2 D-1)`,
    };
  }

  const candidate = pool[0]!;

  // ---- The never-say filter, last, on the actual outbound text (kb 04 A9.3) ----
  const filtered = filterUtterance(candidate.text);
  if (!filtered.clean) {
    return {
      offer: undefined,
      allowed: false,
      decidedBy: 'never_say',
      reason: `Utterance matched never-say pattern(s): ${filtered.matched.join(', ')}`,
    };
  }

  recordOffer(budget, req.requested);
  return { offer: candidate, allowed: true, decidedBy: undefined, reason: 'All layers passed' };
}

/**
 * Guard for any analytics or storage path. Educator surfaces are deliberately
 * not implemented (kb 90 §11 puts them last, gated on the H-2 legal review),
 * so this exists to make an attempt fail loudly rather than quietly ship.
 */
export function guardAnalytics(metricName: string): never | void {
  assertMetricAllowed(metricName);
  throw new Error(
    `Educator-facing analytics are not implemented. kb 90 §11 orders them last, ` +
      `gated on the H-2 qualified-attorney review. Refusing to emit "${metricName}".`,
  );
}

export { mayOfferRoundness };

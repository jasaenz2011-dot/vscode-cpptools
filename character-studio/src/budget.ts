/**
 * Layer 3 — the shared offer budget (kb 90 §5).
 *
 * Four modules propose prompts; only module 04 proposes a cap. The cap is
 * GLOBAL. Genre selection, structure recommendation and developmental
 * prompting are filters on which prompts are eligible, never licences to offer
 * more. Implemented as one counter so per-module counters cannot sum past it.
 */

import { ProhibitionViolation } from './prohibitions.js';

/** DESIGN DECISION values from kb 04 E.3.1 — tune against usage, not evidence. */
export const BUDGET_LIMITS = Object.freeze({
  unrequestedPerCharacter: 3,
  unrequestedPerSession: 5,
  /** Not a limit. An invariant. kb 04; kb 03 F.1 declines to seek an exception. */
  autoInsertedText: 0,
});

export interface BudgetState {
  unrequestedThisCharacter: number;
  unrequestedThisSession: number;
  /** Characters of content the child has written since the last offer. */
  childContentSinceLastOffer: number;
}

export function newBudget(): BudgetState {
  return {
    unrequestedThisCharacter: 0,
    unrequestedThisSession: 0,
    childContentSinceLastOffer: 0,
  };
}

export interface BudgetDecision {
  readonly allowed: boolean;
  readonly reason: string;
}

/** Requested offers bypass the budget: the child asked. kb 04 A9.1. */
export function mayOffer(state: BudgetState, requested: boolean): BudgetDecision {
  if (requested) return { allowed: true, reason: 'Child explicitly requested it' };

  if (state.unrequestedThisCharacter >= BUDGET_LIMITS.unrequestedPerCharacter) {
    return { allowed: false, reason: 'Per-character unrequested budget exhausted' };
  }
  if (state.unrequestedThisSession >= BUDGET_LIMITS.unrequestedPerSession) {
    return { allowed: false, reason: 'Per-session unrequested budget exhausted' };
  }
  if (state.childContentSinceLastOffer <= 0) {
    return {
      allowed: false,
      reason: 'No child content since the last offer; the tool would be leading',
    };
  }
  return { allowed: true, reason: 'Within budget' };
}

export function recordOffer(state: BudgetState, requested: boolean): void {
  if (!requested) {
    state.unrequestedThisCharacter += 1;
    state.unrequestedThisSession += 1;
  }
  state.childContentSinceLastOffer = 0;
}

export function recordChildContent(state: BudgetState, chars: number): void {
  state.childContentSinceLastOffer += chars;
}

/** New character: per-character budget resets, session budget does not. */
export function startNewCharacter(state: BudgetState): void {
  state.unrequestedThisCharacter = 0;
  state.childContentSinceLastOffer = 0;
}

/**
 * The tool never writes into the child's work. kb 04 caps auto-inserted text
 * at zero with no exception, and kb 03 F.1 explicitly declines to request one.
 */
export function assertNoAutoInsert(charsToInsert: number): void {
  if (charsToInsert > BUDGET_LIMITS.autoInsertedText) {
    throw new ProhibitionViolation(
      `Refusing to auto-insert ${charsToInsert} characters into the child's work`,
      'kb 90 §5; kb 04; kb 03 F.1',
    );
  }
}

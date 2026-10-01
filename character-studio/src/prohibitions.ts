/**
 * Layer 1 — the prohibition set (kb 90 §6).
 *
 * These are built first and as hard invariants because, per kb 90 §11, every
 * later layer is constrained by them and retrofitting them is expensive. They
 * throw rather than warn: a caller that trips one has a design bug, and a
 * silent no-op would hide it.
 */

export class ProhibitionViolation extends Error {
  constructor(
    message: string,
    readonly citation: string,
  ) {
    super(`${message} [${citation}]`);
    this.name = 'ProhibitionViolation';
  }
}

/**
 * Quantities Character Studio must never compute, store, or display.
 *
 * kb 05 P1 (no creativity or character-quality score: the construct has no
 * validated classroom instrument), kb 05 metric blacklist, kb 03 E.2 ASSERT
 * (no conformance/originality/cliche detection), kb 03 P-A4 (no archetype
 * labelling of the child's character).
 */
export const FORBIDDEN_METRICS = Object.freeze([
  'genre_conformance',
  'trope_count',
  'originality',
  'cliche_flag',
  'completeness',
  'archetype_label',
  'creativity_score',
  'character_quality_score',
  'readability_score', // kb 04 Rule C — hard ban on scoring children's writing for readability
] as const);

export type ForbiddenMetric = (typeof FORBIDDEN_METRICS)[number];

const FORBIDDEN_SET: ReadonlySet<string> = new Set(FORBIDDEN_METRICS);

/**
 * Call at any site that is about to derive a quantity from a child's work.
 * Throws if the quantity is prohibited.
 */
export function assertMetricAllowed(name: string): void {
  if (FORBIDDEN_SET.has(name)) {
    throw new ProhibitionViolation(
      `Refusing to compute "${name}" from a child's work`,
      'kb 90 §6; kb 05 P1; kb 03 E.2',
    );
  }
}

/** Suggestion shapes the tool may produce. kb 04 Rule A14.2. */
export const ALLOWED_SUGGESTION_TYPES = Object.freeze([
  'question',
  'dimension',
  'child_prior_content',
  'structural_reminder',
] as const);

/**
 * Suggestion shapes the tool may never produce as ready-to-accept content.
 *
 * kb 04 A14.2 is the strongest inference in that module: users adopt a model's
 * leanings, content converges, and users do not notice while feeling in full
 * control. Offering "shy" or "brave" makes the tool an opinionated model of
 * human personality.
 */
export const BLOCKED_SUGGESTION_TYPES = Object.freeze([
  'trait',
  'name',
  'motivation',
  'backstory',
  'dialogue',
  'description',
] as const);

export type AllowedSuggestionType = (typeof ALLOWED_SUGGESTION_TYPES)[number];
export type BlockedSuggestionType = (typeof BLOCKED_SUGGESTION_TYPES)[number];
export type SuggestionType = AllowedSuggestionType | BlockedSuggestionType;

const ALLOWED_SUGGESTION_SET: ReadonlySet<string> = new Set(ALLOWED_SUGGESTION_TYPES);

export function isAllowedSuggestionType(t: string): t is AllowedSuggestionType {
  return ALLOWED_SUGGESTION_SET.has(t);
}

export function assertSuggestionTypeAllowed(t: string): void {
  if (!ALLOWED_SUGGESTION_SET.has(t)) {
    throw new ProhibitionViolation(
      `Suggestion type "${t}" may not be offered as ready-to-accept content`,
      'kb 04 Rule A14.2',
    );
  }
}

/**
 * Offers must derive from what the child HAS written, never from a diff
 * against a template. kb 03 P-B2 calls this the single most important
 * implementation detail in that module: absence-detection is what makes a
 * child's work feel incorrect for lacking a convention.
 */
export function assertNotAbsenceDriven(reason: {
  readonly derivedFrom: 'child_content' | 'template_diff';
}): void {
  if (reason.derivedFrom === 'template_diff') {
    throw new ProhibitionViolation(
      'Refusing to generate an offer because something is absent',
      'kb 03 P-B2; kb 00 §11.2',
    );
  }
}

/**
 * No ranking of children against each other on creative work, including
 * orderings disguised as something else. kb 05 invariant R.
 */
export const DISGUISED_RANKING_FORMS = Object.freeze([
  'sort_by_quality',
  'top_n',
  'badge',
  'color_coded_roster',
  'leaderboard',
  'percentile',
] as const);

export function assertNoPeerRanking(form: string): void {
  if ((DISGUISED_RANKING_FORMS as readonly string[]).includes(form)) {
    throw new ProhibitionViolation(
      `"${form}" ranks children against each other on creative work`,
      'kb 05 invariant R',
    );
  }
}

/**
 * Nothing reaches an adult that is hidden from the child (kb 05 C-family).
 * Any educator-facing payload must be child-visible too.
 */
export function assertChildVisible(payload: { readonly childVisible: boolean }): void {
  if (!payload.childVisible) {
    throw new ProhibitionViolation(
      'Refusing to surface to an educator something the child cannot see',
      'kb 05 C-family',
    );
  }
}

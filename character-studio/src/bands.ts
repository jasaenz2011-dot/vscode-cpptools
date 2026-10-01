/**
 * Age bands — the canonical taxonomy.
 *
 * DEFECT D-1 RESOLUTION (kb 90 §2).
 * The knowledge base shipped with two incompatible numberings: module 01 is
 * zero-indexed (B0 = ages 5-6) while 00-shared-conventions and modules 03/05
 * are one-indexed (B1 = ages 5-6). Code cannot hold both. This module adopts
 * the one-indexed conventions taxonomy, because 00 is the governing document
 * and four of five modules already conform.
 *
 * Every rule imported from module 01 is therefore shifted +1 at the point of
 * use, and each such site is commented `D-1 shift`. Ages, not band labels, are
 * the source of truth for anything quoted from a source.
 */

export type Band = 'B1' | 'B2' | 'B3' | 'B4' | 'B5';

export const BANDS: readonly Band[] = ['B1', 'B2', 'B3', 'B4', 'B5'] as const;

interface BandSpec {
  readonly ages: readonly [number, number];
  readonly grades: string;
  /** Module 01's label for this same band, kept only for auditing D-1. */
  readonly module01Label: string;
}

export const BAND_SPEC: Readonly<Record<Band, BandSpec>> = {
  B1: { ages: [5, 6], grades: 'K-1', module01Label: 'B0' },
  B2: { ages: [7, 8], grades: '2-3', module01Label: 'B1' },
  B3: { ages: [9, 10], grades: '4-5', module01Label: 'B2' },
  B4: { ages: [11, 12], grades: '6-7', module01Label: 'B3' },
  B5: { ages: [13, 14], grades: '8-9', module01Label: 'B4' },
};

/** Translate a module-01 band label to canonical. Audit helper for D-1. */
export function fromModule01Label(label: string): Band | undefined {
  return BANDS.find((b) => BAND_SPEC[b].module01Label === label);
}

export function bandForAge(age: number): Band {
  if (age <= 6) return 'B1';
  if (age <= 8) return 'B2';
  if (age <= 10) return 'B3';
  if (age <= 12) return 'B4';
  return 'B5';
}

export function bandIndex(b: Band): number {
  return BANDS.indexOf(b);
}

export function atLeast(actual: Band, floor: Band): boolean {
  return bandIndex(actual) >= bandIndex(floor);
}

/**
 * What the child has actually produced. Observed output outranks age
 * (kb 00 §8 anti-gating rule 2), so this is the primary signal and the
 * band is only a prior.
 */
export interface ObservedOutput {
  /** Child has written motivation or reasons for action. */
  readonly statesMotivation: boolean;
  /** Child has written internal states / feelings. */
  readonly statesInternalState: boolean;
  /** Child has written more than one character. */
  readonly multipleCharacters: boolean;
  /** Child has revised previously written content. */
  readonly hasRevised: boolean;
}

export const NO_OBSERVATION: ObservedOutput = {
  statesMotivation: false,
  statesInternalState: false,
  multipleCharacters: false,
  hasRevised: false,
};

/**
 * Effective band: the age prior, raised (never lowered) by observed output.
 *
 * kb 00 §8: bands are soft defaults, never gates; within-band variance exceeds
 * between-band difference. Evidence of a more advanced move promotes the
 * child; absence of a move never demotes them, because absence is
 * developmentally normal (kb 00 §11.3).
 */
export function effectiveBand(ageBand: Band, observed: ObservedOutput): Band {
  let idx = bandIndex(ageBand);
  const advanced =
    (observed.statesMotivation ? 1 : 0) +
    (observed.statesInternalState ? 1 : 0) +
    (observed.multipleCharacters ? 1 : 0) +
    (observed.hasRevised ? 1 : 0);
  // DESIGN DECISION (kb 00 §7): two advanced moves promote one band, three or
  // more promote two. Not a research finding; tune against real usage.
  if (advanced >= 3) idx += 2;
  else if (advanced >= 2) idx += 1;
  return BANDS[Math.min(idx, BANDS.length - 1)]!;
}

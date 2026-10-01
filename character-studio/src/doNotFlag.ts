/**
 * Layer 2 — the union do-not-flag list (kb 90 §4, declared binding by kb 00 §11.3).
 *
 * Nothing on this list may trigger a suggestion, correction, score, nudge,
 * badge, or educator-facing "area for growth".
 *
 * Note on band scoping: module 01 organises its list as a base set plus
 * additions for younger bands, but closes by stating the list "continues to
 * apply in full" at older bands and that "nothing new is added to the
 * flaggable set". So the union is never flaggable at ANY band. The lists are
 * kept separate below only to preserve each item's provenance.
 *
 * The single exception in the whole corpus is an ambiguous pronoun that
 * genuinely blocks a reader, from age 7 upward, once per draft, phrased as a
 * reader's question (module 01 R2.1h).
 */

import { type Band, atLeast } from './bands.js';

/** Observations that are developmentally normal, culturally legitimate, or both. */
export const NEVER_FLAG_ANY_AGE = Object.freeze([
  'additive_chaining', // "and then... and then..."  kb 01 §3.5 (A1-C15, A1-C16)
  'short_story', // no defensible length norms retrieved (A1-C61, A1-C68)
  'flat_character', // kb 01 §3.5 + kb 03 P-C9 (A1-C47, A1-C52, A3-C24, A3-C31)
  'static_character', // same
  'animal_or_fantastical_character', // (A1-C62, A1-C46)
  'episodic_or_wandering_shape', // topic-associating shapes are well-formed (A1-C79/82/83)
  'no_resolution', // ends at the high point; kb 02 AI-2 (A1-C06, A1-C31)
  'spelling_or_punctuation', // transcription competes with composition (A1-C69, A1-C70)
  'mixed_or_non_english_language', // (A1-C95, A1-C98, A4-C128)
  'repetition_or_sound_words', // performance devices (A1-C81, A1-C83, A1-C12)
  'villain_does_one_nice_thing', // positivity asymmetry in trait attribution (A1-C50)
  'true_rather_than_invented', // home narrative norms vary (A1-C83)
  'purely_good_or_evil', // kb 03 P-C9 (A3-C24, A3-C31, A3-C46)
  'chosen_one_or_prophecy_or_orphan', // kb 03 P-C9 (A3-C07)
  'resembles_existing_character', // kb 03 P-C9 (A3-C15, A3-C16)
  'missing_optional_trope', // kb 03 P-C9 (P-B1, P-B2)
  'does_not_match_selected_genre', // kb 03 P-C9 (P-A1, P-B10)
  'multiple_genres_selected', // kb 03 P-C9 (A3-C18, P-B10)
  'genre_without_its_hallmark', // fable w/o moral, mystery w/o solution (P-B2)
  'unexplained_magic_or_technology', // kb 03 P-C9 (A3-C22, A3-C29, A3-C30)
  'cross_episode_contradiction', // kb 05: must not flag, warn, score, or report
] as const);

/** Provenance-preserving sub-lists. Flaggability is unaffected: still never. */
export const NEVER_FLAG_AGES_5_TO_8 = Object.freeze([
  'no_stated_reasons', // psychological causality emerges 6->8 (A1-C21)
  'no_internal_states', // mental state talk develops over years (A1-C42)
  'telling_not_showing', // telling is the correct direction at this age (A1-C50)
  'ambiguous_pronoun_non_blocking', // cohesion develops to age 10 (A1-C54, A1-C56)
  'no_evaluative_language', // near-universal only at 10-12 (A1-C61)
  'goal_achieved_first_try', // goal reinstatement is a later move (A1-C26, A1-C30)
  'single_character', // coherence runs through one protagonist (A1-C28)
  'no_genre_differentiation', // genre knowledge nascent in K-2 (A1-C107)
] as const);

export const NEVER_FLAG_AGES_9_TO_10 = Object.freeze([
  'no_nested_mental_states', // SOFB consolidates 7-9, written control later (A1-C35)
  'no_character_arc', // no developmental evidence for arcs in invented characters (A1-C52)
  'no_internal_contradiction', // same (A1-C52)
] as const);

export type Observation =
  | (typeof NEVER_FLAG_ANY_AGE)[number]
  | (typeof NEVER_FLAG_AGES_5_TO_8)[number]
  | (typeof NEVER_FLAG_AGES_9_TO_10)[number]
  | 'ambiguous_pronoun_blocking_reader';

const UNION: ReadonlySet<string> = new Set<string>([
  ...NEVER_FLAG_ANY_AGE,
  ...NEVER_FLAG_AGES_5_TO_8,
  ...NEVER_FLAG_AGES_9_TO_10,
]);

export function unionSize(): number {
  return UNION.size;
}

export interface DraftFlagState {
  /** Whether a blocking-pronoun question has already been raised this draft. */
  readonly pronounQuestionRaisedThisDraft: boolean;
}

export interface FlagDecision {
  readonly permitted: boolean;
  readonly reason: string;
}

/**
 * The only gate that may ever surface a mechanical issue.
 *
 * Returns permitted:false for everything on the union list, at every band.
 */
export function mayFlag(
  observation: Observation,
  band: Band,
  state: DraftFlagState,
): FlagDecision {
  if (UNION.has(observation)) {
    return {
      permitted: false,
      reason: `"${observation}" is on the union do-not-flag list (kb 90 §4)`,
    };
  }

  if (observation === 'ambiguous_pronoun_blocking_reader') {
    // D-1 shift: module 01 says "from B1 upward" in its own numbering,
    // i.e. from age 7 upward, which is canonical B2.
    if (!atLeast(band, 'B2')) {
      return {
        permitted: false,
        reason: 'Below age 7 even a blocking pronoun is not raised (A1-C54, A1-C56)',
      };
    }
    if (state.pronounQuestionRaisedThisDraft) {
      return { permitted: false, reason: 'Already raised once this draft (kb 01 R2.1h)' };
    }
    return {
      permitted: true,
      reason: 'Blocking pronoun, once per draft, phrased as a reader question (kb 01 R2.1h)',
    };
  }

  // Unknown observation kinds are refused by default: kb 00 §9 puts the burden
  // of proof on speaking, not on staying quiet.
  return {
    permitted: false,
    reason: `Unrecognised observation "${observation}"; default is silence (kb 00 §9)`,
  };
}

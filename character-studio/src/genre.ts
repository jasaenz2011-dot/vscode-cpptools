/**
 * Layer 5 — genre prompt eligibility (kb 03 Part B / E.1).
 *
 * Every prompt here is a QUESTION. That is not stylistic: kb 04 A14.2 forbids
 * offering traits, names, motivations, backstory, dialogue or descriptions as
 * ready-to-accept content, and kb 03 P-A5 requires functional language
 * ("someone who helps them") over personality language ("the Mentor
 * archetype"). A genre prompt that names a trait is a regression (kb 90 §6).
 */

import { type Band, atLeast } from './bands.js';

export type Genre =
  | 'fantasy'
  | 'adventure'
  | 'mystery'
  | 'realistic_fiction'
  | 'science_fiction'
  | 'fable'
  | 'folktale'
  | 'fairy_tale'
  | 'humor'
  | 'spooky';

export type PromptClass =
  | 'convention'
  | 'roundness'
  | 'subversion'
  | 'moral_complexity'
  | 'worldbuilding';

export interface GenrePrompt {
  readonly genre: Genre;
  readonly text: string;
  readonly cls: PromptClass;
}

interface GenreProfile {
  /** What the genre asks of a character, in functional terms. */
  readonly functionalDemand: string;
  readonly conventionPrompts: readonly string[];
  /** The single most useful question if only one is allowed. */
  readonly oneQuestion: string;
  /** Never offered for this genre, at any band. */
  readonly neverOffer: readonly string[];
}

export const GENRE_PROFILES: Readonly<Record<Genre, GenreProfile>> = {
  fantasy: {
    functionalDemand: 'A stance toward the impossible (A3-C21)',
    conventionPrompts: [
      'Where does your character stand next to the magic - inside it, visiting it, or invaded by it?',
      'What is impossible here?',
    ],
    oneQuestion: 'Is the magic normal to them, or new?',
    neverOffer: ['magic_rules_or_costs', 'prophecy', 'mentor', 'chosen_one'],
  },
  adventure: {
    functionalDemand: 'Capability under pressure (A3-C24)',
    conventionPrompts: [
      'Where do they go?',
      'What makes it dangerous?',
      "Why don't they turn back?",
    ],
    oneQuestion: 'What keeps them going?',
    neverOffer: ['exotic_locales', 'treasure', 'map', 'absent_adults'],
  },
  mystery: {
    functionalDemand: 'Noticing and reasoning (A3-C25)',
    conventionPrompts: [
      "What doesn't add up?",
      'What does your character notice that others miss?',
      "Who isn't telling the truth?",
    ],
    oneQuestion: 'What do they notice?',
    neverOffer: ['crime_victim_criminal_framing', 'red_herrings', 'reveal_scenes'],
  },
  realistic_fiction: {
    // kb 03: the only genre where neverOffer is broader than what is offerable.
    // Deliberate and safety-motivated (A3-C28).
    functionalDemand: 'Inner response to ordinary events (A3-C27)',
    conventionPrompts: ['What is one ordinary thing that matters a lot to them?'],
    oneQuestion: "What's a small thing that's a big deal to them?",
    neverOffer: ['any_problem_topic', 'divorce', 'illness', 'death', 'growth_prompt'],
  },
  science_fiction: {
    functionalDemand: 'Position relative to a change (A3-C29, A3-C30)',
    conventionPrompts: ["What's different from now?", 'How does that change their day?'],
    oneQuestion: "What's different, and how does it affect them?",
    neverOffer: ['how_the_tech_works', 'space', 'robots', 'dystopia'],
  },
  fable: {
    functionalDemand: 'Embodying one quality (A3-C31)',
    conventionPrompts: ['What is your character mostly like?', 'Who else is in it?'],
    oneQuestion: 'What are they mostly like?',
    neverOffer: ['roundness_prompts', 'a_moral', 'specific_animals'],
  },
  folktale: {
    functionalDemand: 'Role and action (A3-C08)',
    conventionPrompts: ['What does your character do for other people in the story?'],
    oneQuestion: 'What job do they do in the story?',
    neverOffer: ['named_tradition_content', 'rule_of_three', 'tricksters'],
  },
  fairy_tale: {
    functionalDemand: 'Role in a patterned shape (A3-C08, A3-C38)',
    conventionPrompts: ['Who helps and who hinders?', 'What does your character want most?'],
    oneQuestion: 'Who helps them and who gets in the way?',
    neverOffer: ['princess_stepmother_marriage_package', 'beauty_equals_goodness'],
  },
  humor: {
    functionalDemand: 'A comic engine (A3-C41)',
    conventionPrompts: [
      "What does your character believe that isn't true?",
      'What do they take way too seriously?',
    ],
    oneQuestion: 'What do they get wrong?',
    neverOffer: ['ridicule', 'harm', 'gross_out'],
  },
  spooky: {
    functionalDemand: 'Vulnerability plus anticipation (A3-C54)',
    conventionPrompts: [
      'What feels wrong before anything happens?',
      'What does your character not want to find?',
    ],
    oneQuestion: 'What are they afraid is there?',
    neverOffer: ['realistic_peril'],
  },
};

/**
 * Genres whose house style is a flat character. Roundness prompts are
 * SUPPRESSED, not merely deprioritised: kb 03 P-B3 — a fox in a fable IS
 * cunning, and that is the form working, not a deficiency.
 */
export const ROUNDNESS_SUPPRESSED: readonly Genre[] = Object.freeze([
  'fable',
  'folktale',
  'fairy_tale',
  'adventure',
]);

/**
 * Named living traditions. The tool never generates content from these at any
 * band, and never offers a subversion of them (kb 03 P-B7a, P-B7c), grounded
 * in retrieved access protocols.
 */
export const PROTECTED_TRADITIONS: readonly string[] = Object.freeze([
  'anansi',
  'jataka',
  'coyote',
  'la_llorona',
  'brer_rabbit',
]);

export function isProtectedTradition(name: string): boolean {
  return PROTECTED_TRADITIONS.includes(name.trim().toLowerCase().replace(/[^a-z]+/g, '_'));
}

/**
 * Whether genre-derived prompting is on by default.
 *
 * DEFECT D-1 RESOLUTION. Module 01 R2.1s says do not build genre/audience
 * features for its B0-B1 — ages 5-8, i.e. canonical B1-B2 — and introduce
 * genre play from its B2, i.e. canonical B3. Module 03 P-A3 turned prompts off
 * only for K-1, believing it was implementing module 01; the band-numbering
 * offset defeated it (kb 90 §2).
 *
 * Resolved toward module 01, because it owns developmental defaults (kb 90 §P2
 * domain ownership) and because kb 00 §9 makes the conservative reading the
 * default under uncertainty. Genre prompting is therefore OFF by default
 * through canonical B2 (grades 2-3) and ON from B3.
 *
 * This is a DEFAULT, not a gate (kb 00 §8): a younger child who asks for genre
 * prompts gets them.
 */
export function genrePromptsOnByDefault(band: Band): boolean {
  return atLeast(band, 'B3');
}

export interface GenrePromptQuery {
  readonly genres: readonly Genre[];
  readonly band: Band;
  /** True when the child asked, which overrides the band default. */
  readonly requested: boolean;
}

/**
 * Build the eligible prompt pool. Multi-select is native, not an edge case
 * (kb 03 P-B10): the pool is the union across chosen genres, deduped, and the
 * child is never asked to pick a primary genre.
 */
export function eligiblePrompts(q: GenrePromptQuery): readonly GenrePrompt[] {
  if (q.genres.length === 0) return [];
  if (!q.requested && !genrePromptsOnByDefault(q.band)) return [];

  const seen = new Set<string>();
  const out: GenrePrompt[] = [];
  for (const g of q.genres) {
    const profile = GENRE_PROFILES[g];
    for (const text of profile.conventionPrompts) {
      const key = text.toLowerCase();
      if (seen.has(key)) continue; // dedupe near-identical prompts across genres
      seen.add(key);
      out.push({ genre: g, text, cls: 'convention' });
    }
  }
  return out;
}

/** kb 03 P-B3: suppressed outright for the flat-by-design genres. */
export function mayOfferRoundness(genres: readonly Genre[]): boolean {
  return !genres.some((g) => ROUNDNESS_SUPPRESSED.includes(g));
}

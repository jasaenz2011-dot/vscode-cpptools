/**
 * Layer 4 — silence by default, and the never-say filter (kb 04 A9.1-A9.8).
 *
 * kb 04 A9.1: over a third of feedback interventions harm performance, and
 * computer-sourced feedback was the weakest of four sources measured in this
 * grade band. The burden of proof is on speaking, not on staying quiet.
 */

export type SpeakTrigger =
  // permitted
  | 'child_requested_feedback'
  | 'child_hit_stuck_affordance'
  | 'child_completed_declared_goal_opted_in'
  // refused
  | 'idle_timer'
  | 'field_blur'
  | 'keystroke_pause'
  | 'session_start'
  | 'encouragement_schedule';

const PERMITTED_TRIGGERS: ReadonlySet<SpeakTrigger> = new Set<SpeakTrigger>([
  'child_requested_feedback',
  'child_hit_stuck_affordance',
  'child_completed_declared_goal_opted_in',
]);

export function maySpeak(trigger: SpeakTrigger): { readonly allowed: boolean; readonly reason: string } {
  if (PERMITTED_TRIGGERS.has(trigger)) {
    return { allowed: true, reason: `Permitted trigger: ${trigger}` };
  }
  return {
    allowed: false,
    reason: `Default state is silence; "${trigger}" is not a permitted trigger (kb 04 A9.1)`,
  };
}

/** Feedback may address task, process, or self-regulation. Never the self. kb 04 A9.2. */
export type FeedbackTarget = 'task' | 'process' | 'self_regulation' | 'self';

export function mayAddress(target: FeedbackTarget): boolean {
  return target !== 'self';
}

/**
 * The never-say list, implemented as an output filter rather than prompt
 * guidance — kb 04 A9.3 specifies it that way because prompt guidance is
 * advisory and a filter is not.
 *
 * Patterns are deliberately broad. A false positive costs one rephrase; a
 * false negative reaches a child.
 */
export const NEVER_SAY_PATTERNS: readonly RegExp[] = Object.freeze([
  /\byou'?re (so )?(smart|clever|talented|gifted|creative)\b/i, // person praise, not process
  /\bgood (girl|boy)\b/i,
  /\bwhat a (great|wonderful|amazing) (writer|imagination)\b/i, // ability attribution
  /\bthat'?s (wrong|incorrect|not right)\b/i,
  /\byour character (needs|should have|is missing)\b/i, // implies a correct character
  /\breal (stories|characters) (have|need)\b/i, // implies one correct story shape
  /\b(most|other) (kids|students|children) (write|make|do)\b/i, // peer comparison
  /\btry to be more (original|creative|imaginative)\b/i, // originality judgement
  /\bthis (is|seems) (clich|unoriginal|generic)/i,
  /\byou forgot (to|the)\b/i, // absence framed as failure
  /\b(score|rating|grade) (of|is)\b/i, // quantified creative work
  /\bbetter than\b/i, // ranking
]);

export interface FilterResult {
  readonly clean: boolean;
  readonly matched: readonly string[];
}

/** Run every outbound utterance through this before it reaches a child. */
export function filterUtterance(text: string): FilterResult {
  const matched = NEVER_SAY_PATTERNS.filter((p) => p.test(text)).map((p) => p.source);
  return { clean: matched.length === 0, matched };
}

/**
 * kb 04 A9.4: when the tool does speak, it describes rather than evaluates.
 * kb 04 A9.7: it never presents its feedback as authoritative.
 */
export function isDescriptive(utterance: { readonly mood: 'describe' | 'evaluate' }): boolean {
  return utterance.mood === 'describe';
}

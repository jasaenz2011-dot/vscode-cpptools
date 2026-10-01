import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  FORBIDDEN_METRICS,
  ProhibitionViolation,
  assertChildVisible,
  assertMetricAllowed,
  assertNoPeerRanking,
  assertNotAbsenceDriven,
  assertSuggestionTypeAllowed,
  isAllowedSuggestionType,
} from '../src/prohibitions.js';

test('every forbidden metric throws', () => {
  for (const m of FORBIDDEN_METRICS) {
    assert.throws(() => assertMetricAllowed(m), ProhibitionViolation, `expected ${m} to throw`);
  }
});

test('a creativity score cannot be computed under any spelling we ship', () => {
  assert.throws(() => assertMetricAllowed('creativity_score'), ProhibitionViolation);
  assert.throws(() => assertMetricAllowed('character_quality_score'), ProhibitionViolation);
  // kb 04 Rule C bans scoring children's writing for readability outright.
  assert.throws(() => assertMetricAllowed('readability_score'), ProhibitionViolation);
});

test('benign metrics are allowed', () => {
  assert.doesNotThrow(() => assertMetricAllowed('session_count'));
  assert.doesNotThrow(() => assertMetricAllowed('characters_created'));
});

test('trait-shaped suggestions are blocked, question-shaped ones allowed', () => {
  for (const blocked of ['trait', 'name', 'motivation', 'backstory', 'dialogue', 'description']) {
    assert.throws(() => assertSuggestionTypeAllowed(blocked), ProhibitionViolation);
    assert.equal(isAllowedSuggestionType(blocked), false);
  }
  for (const ok of ['question', 'dimension', 'child_prior_content', 'structural_reminder']) {
    assert.doesNotThrow(() => assertSuggestionTypeAllowed(ok));
  }
});

test('absence-driven offers are refused — the kb calls this the key detail', () => {
  assert.throws(
    () => assertNotAbsenceDriven({ derivedFrom: 'template_diff' }),
    ProhibitionViolation,
  );
  assert.doesNotThrow(() => assertNotAbsenceDriven({ derivedFrom: 'child_content' }));
});

test('peer ranking is refused including disguised orderings', () => {
  for (const form of ['sort_by_quality', 'top_n', 'badge', 'color_coded_roster', 'leaderboard', 'percentile']) {
    assert.throws(() => assertNoPeerRanking(form), ProhibitionViolation);
  }
});

test('nothing reaches an adult that is hidden from the child', () => {
  assert.throws(() => assertChildVisible({ childVisible: false }), ProhibitionViolation);
  assert.doesNotThrow(() => assertChildVisible({ childVisible: true }));
});

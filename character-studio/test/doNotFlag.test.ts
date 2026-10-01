import { test } from 'node:test';
import assert from 'node:assert/strict';
import { BANDS } from '../src/bands.js';
import {
  NEVER_FLAG_AGES_5_TO_8,
  NEVER_FLAG_AGES_9_TO_10,
  NEVER_FLAG_ANY_AGE,
  mayFlag,
  unionSize,
} from '../src/doNotFlag.js';

const FRESH = { pronounQuestionRaisedThisDraft: false };

test('nothing on the union list is flaggable at ANY band', () => {
  const all = [...NEVER_FLAG_ANY_AGE, ...NEVER_FLAG_AGES_5_TO_8, ...NEVER_FLAG_AGES_9_TO_10];
  for (const obs of all) {
    for (const band of BANDS) {
      const d = mayFlag(obs, band, FRESH);
      assert.equal(d.permitted, false, `${obs} became flaggable at ${band}`);
    }
  }
});

test('the union list is the full assembled set', () => {
  // 21 + 8 + 3, with flat_character and static_character appearing once each
  // despite being cited by two modules.
  assert.equal(unionSize(), 32);
});

test('flat and static characters are never a defect, at any age', () => {
  for (const band of BANDS) {
    assert.equal(mayFlag('flat_character', band, FRESH).permitted, false);
    assert.equal(mayFlag('static_character', band, FRESH).permitted, false);
    assert.equal(mayFlag('no_character_arc', band, FRESH).permitted, false);
  }
});

test('a story with no resolution is a shape, not an error', () => {
  assert.equal(mayFlag('no_resolution', 'B5', FRESH).permitted, false);
});

test('mixed-language writing is never flagged', () => {
  assert.equal(mayFlag('mixed_or_non_english_language', 'B5', FRESH).permitted, false);
});

test('the sole exception: a blocking pronoun, from age 7, once per draft', () => {
  // Below age 7 even a blocking pronoun stays unraised.
  assert.equal(mayFlag('ambiguous_pronoun_blocking_reader', 'B1', FRESH).permitted, false);

  // From B2 (ages 7-8) upward it is permitted once.
  const first = mayFlag('ambiguous_pronoun_blocking_reader', 'B2', FRESH);
  assert.equal(first.permitted, true);

  const second = mayFlag('ambiguous_pronoun_blocking_reader', 'B2', {
    pronounQuestionRaisedThisDraft: true,
  });
  assert.equal(second.permitted, false);
});

test('a non-blocking ambiguous pronoun is never raised', () => {
  for (const band of BANDS) {
    assert.equal(mayFlag('ambiguous_pronoun_non_blocking', band, FRESH).permitted, false);
  }
});

test('unknown observations default to silence', () => {
  // @ts-expect-error deliberately outside the union
  const d = mayFlag('some_new_metric_someone_added', 'B4', FRESH);
  assert.equal(d.permitted, false);
  assert.match(d.reason, /default is silence/);
});

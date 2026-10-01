import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  BAND_SPEC,
  NO_OBSERVATION,
  bandForAge,
  effectiveBand,
  fromModule01Label,
} from '../src/bands.js';

test('D-1: module 01 labels map one lower than canonical', () => {
  assert.equal(fromModule01Label('B0'), 'B1');
  assert.equal(fromModule01Label('B1'), 'B2');
  assert.equal(fromModule01Label('B2'), 'B3');
  assert.equal(fromModule01Label('B4'), 'B5');
});

test('canonical bands match the conventions age table', () => {
  assert.deepEqual(BAND_SPEC.B1.ages, [5, 6]);
  assert.deepEqual(BAND_SPEC.B2.ages, [7, 8]);
  assert.deepEqual(BAND_SPEC.B5.ages, [13, 14]);
  assert.equal(BAND_SPEC.B2.grades, '2-3');
});

test('age maps to band, with the top band open-ended', () => {
  assert.equal(bandForAge(5), 'B1');
  assert.equal(bandForAge(8), 'B2');
  assert.equal(bandForAge(10), 'B3');
  assert.equal(bandForAge(14), 'B5');
  assert.equal(bandForAge(17), 'B5');
});

test('observed output promotes, and absence never demotes', () => {
  // kb 00 §8: absence of an advanced move is developmentally normal.
  assert.equal(effectiveBand('B3', NO_OBSERVATION), 'B3');

  const twoMoves = { ...NO_OBSERVATION, statesMotivation: true, statesInternalState: true };
  assert.equal(effectiveBand('B2', twoMoves), 'B3');

  const fourMoves = {
    statesMotivation: true,
    statesInternalState: true,
    multipleCharacters: true,
    hasRevised: true,
  };
  assert.equal(effectiveBand('B2', fourMoves), 'B4');
});

test('promotion saturates at the top band', () => {
  const all = {
    statesMotivation: true,
    statesInternalState: true,
    multipleCharacters: true,
    hasRevised: true,
  };
  assert.equal(effectiveBand('B5', all), 'B5');
});

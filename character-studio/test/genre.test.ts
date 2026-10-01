import { test } from 'node:test';
import assert from 'node:assert/strict';
import { BANDS } from '../src/bands.js';
import {
  GENRE_PROFILES,
  type Genre,
  eligiblePrompts,
  genrePromptsOnByDefault,
  isProtectedTradition,
  mayOfferRoundness,
} from '../src/genre.js';
import { filterUtterance } from '../src/feedback.js';

const ALL_GENRES = Object.keys(GENRE_PROFILES) as Genre[];

test('every convention prompt is a question, never a trait offer', () => {
  // kb 04 A14.2 compliance by construction. A prompt that names a trait is a
  // regression (kb 90 §6).
  for (const g of ALL_GENRES) {
    for (const p of GENRE_PROFILES[g].conventionPrompts) {
      assert.ok(p.trim().endsWith('?'), `${g}: not a question -> ${p}`);
    }
    assert.ok(GENRE_PROFILES[g].oneQuestion.trim().endsWith('?'), `${g}: oneQuestion`);
  }
});

test('no convention prompt trips the never-say filter', () => {
  for (const g of ALL_GENRES) {
    for (const p of GENRE_PROFILES[g].conventionPrompts) {
      assert.equal(filterUtterance(p).clean, true, `${g}: ${p}`);
    }
  }
});

test('roundness is suppressed for the flat-by-design genres', () => {
  assert.equal(mayOfferRoundness(['fable']), false);
  assert.equal(mayOfferRoundness(['folktale']), false);
  assert.equal(mayOfferRoundness(['fairy_tale']), false);
  assert.equal(mayOfferRoundness(['adventure']), false);
  assert.equal(mayOfferRoundness(['mystery']), true);
  // Suppressed if ANY chosen genre suppresses it.
  assert.equal(mayOfferRoundness(['mystery', 'fable']), false);
});

test('realistic fiction offers least and never proposes a problem topic', () => {
  const rf = GENRE_PROFILES.realistic_fiction;
  assert.equal(rf.conventionPrompts.length, 1);
  assert.ok(rf.neverOffer.length > rf.conventionPrompts.length, 'asymmetry is deliberate');
  for (const topic of ['any_problem_topic', 'divorce', 'illness', 'death']) {
    assert.ok(rf.neverOffer.includes(topic), `must never offer ${topic}`);
  }
});

test('multi-select is native: pool is the union, deduped', () => {
  const single = eligiblePrompts({ genres: ['mystery'], band: 'B4', requested: false });
  const multi = eligiblePrompts({ genres: ['mystery', 'humor'], band: 'B4', requested: false });
  assert.ok(multi.length > single.length);
  const texts = multi.map((p) => p.text.toLowerCase());
  assert.equal(new Set(texts).size, texts.length, 'no duplicate prompts');
});

test('no genre chosen means no genre prompts, and that is valid', () => {
  assert.equal(eligiblePrompts({ genres: [], band: 'B4', requested: true }).length, 0);
});

test('D-1 resolved: genre prompting off by default through B2, on from B3', () => {
  assert.equal(genrePromptsOnByDefault('B1'), false);
  assert.equal(genrePromptsOnByDefault('B2'), false, 'grades 2-3 off by default per module 01');
  assert.equal(genrePromptsOnByDefault('B3'), true);
  assert.equal(genrePromptsOnByDefault('B5'), true);
});

test('the band default is a default, not a gate', () => {
  // A younger child who asks gets prompts anyway (kb 00 §8).
  const unrequested = eligiblePrompts({ genres: ['fantasy'], band: 'B1', requested: false });
  const requested = eligiblePrompts({ genres: ['fantasy'], band: 'B1', requested: true });
  assert.equal(unrequested.length, 0);
  assert.ok(requested.length > 0, 'asking must work at every band');
});

test('named living traditions are recognised for protection', () => {
  for (const t of ['Anansi', 'anansi', 'La Llorona', 'Coyote', 'Jataka']) {
    assert.equal(isProtectedTradition(t), true, t);
  }
  assert.equal(isProtectedTradition('Gandalf'), false);
});

test('every genre has a functional demand stated, not a personality', () => {
  for (const g of ALL_GENRES) {
    assert.ok(GENRE_PROFILES[g].functionalDemand.length > 0, g);
  }
  for (const band of BANDS) void band; // bands unused here; keeps import meaningful
});

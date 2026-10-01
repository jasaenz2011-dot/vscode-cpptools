import { test } from 'node:test';
import assert from 'node:assert/strict';
import { NO_OBSERVATION } from '../src/bands.js';
import { newBudget, recordChildContent } from '../src/budget.js';
import { considerOffer, guardAnalytics, type OfferRequest } from '../src/engine.js';
import { ProhibitionViolation } from '../src/prohibitions.js';

function req(over: Partial<OfferRequest> = {}): OfferRequest {
  return {
    ageBand: 'B4',
    observed: NO_OBSERVATION,
    genres: ['mystery'],
    trigger: 'child_requested_feedback',
    requested: true,
    suggestionType: 'question',
    derivedFrom: 'child_content',
    ...over,
  };
}

test('a clean request produces a question-shaped offer', () => {
  const b = newBudget();
  const d = considerOffer(req(), b);
  assert.equal(d.allowed, true);
  assert.equal(d.decidedBy, undefined);
  assert.ok(d.offer);
  assert.ok(d.offer!.text.endsWith('?'));
});

test('P1: prohibitions throw before any budget or genre logic runs', () => {
  const b = newBudget();
  // Trait-shaped suggestion: must throw even though everything else is valid.
  assert.throws(() => considerOffer(req({ suggestionType: 'trait' }), b), ProhibitionViolation);
  // Budget untouched — the prohibition fired first.
  assert.equal(b.unrequestedThisSession, 0);
});

test('P1: a template-diff offer throws regardless of budget state', () => {
  const b = newBudget();
  assert.throws(
    () => considerOffer(req({ derivedFrom: 'template_diff' }), b),
    ProhibitionViolation,
  );
});

test('silence outranks a full budget and an eligible genre', () => {
  const b = newBudget();
  recordChildContent(b, 100);
  const d = considerOffer(req({ trigger: 'idle_timer', requested: false }), b);
  assert.equal(d.allowed, false);
  assert.equal(d.decidedBy, 'silence');
});

test('budget outranks genre eligibility — kb 03 F.1 resolved toward module 04', () => {
  const b = newBudget();
  // Exhaust the per-character budget with unrequested offers.
  for (let i = 0; i < 3; i++) {
    recordChildContent(b, 30);
    considerOffer(req({ trigger: 'child_hit_stuck_affordance', requested: false }), b);
  }
  recordChildContent(b, 30);
  const d = considerOffer(req({ trigger: 'child_hit_stuck_affordance', requested: false }), b);
  assert.equal(d.allowed, false);
  assert.equal(d.decidedBy, 'budget', 'genre must not extend the budget');
});

test('no genre chosen is a valid, complete state — not an error', () => {
  const b = newBudget();
  const d = considerOffer(req({ genres: [] }), b);
  assert.equal(d.allowed, false);
  assert.equal(d.decidedBy, 'genre');
  assert.match(d.reason, /complete and valid as-is/);
});

test('D-1 in effect: an unrequested offer at B2 is refused by the genre layer', () => {
  const b = newBudget();
  recordChildContent(b, 50);
  const d = considerOffer(
    req({ ageBand: 'B2', trigger: 'child_hit_stuck_affordance', requested: false }),
    b,
  );
  assert.equal(d.allowed, false);
  assert.equal(d.decidedBy, 'genre');
});

test('observed output can promote a B2 child past the genre default', () => {
  const b = newBudget();
  recordChildContent(b, 50);
  const d = considerOffer(
    req({
      ageBand: 'B2',
      observed: {
        statesMotivation: true,
        statesInternalState: true,
        multipleCharacters: true,
        hasRevised: false,
      },
      trigger: 'child_hit_stuck_affordance',
      requested: false,
    }),
    b,
  );
  // Three advanced moves promote B2 -> B4, which is at or above B3.
  assert.equal(d.allowed, true, 'observed output outranks the age prior');
});

test('educator analytics are not implemented and fail loudly', () => {
  assert.throws(() => guardAnalytics('session_count'), /not implemented/);
  // A forbidden metric trips the prohibition first.
  assert.throws(() => guardAnalytics('creativity_score'), ProhibitionViolation);
});

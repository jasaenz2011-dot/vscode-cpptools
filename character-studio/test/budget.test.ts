import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  BUDGET_LIMITS,
  assertNoAutoInsert,
  mayOffer,
  newBudget,
  recordChildContent,
  recordOffer,
  startNewCharacter,
} from '../src/budget.js';
import { ProhibitionViolation } from '../src/prohibitions.js';

test('auto-inserted text is zero, always', () => {
  assert.equal(BUDGET_LIMITS.autoInsertedText, 0);
  assert.doesNotThrow(() => assertNoAutoInsert(0));
  assert.throws(() => assertNoAutoInsert(1), ProhibitionViolation);
  assert.throws(() => assertNoAutoInsert(500), ProhibitionViolation);
});

test('an offer requires child content since the last offer', () => {
  const b = newBudget();
  assert.equal(mayOffer(b, false).allowed, false, 'no content written yet');
  recordChildContent(b, 40);
  assert.equal(mayOffer(b, false).allowed, true);
});

test('per-character cap is three unrequested offers', () => {
  const b = newBudget();
  for (let i = 0; i < BUDGET_LIMITS.unrequestedPerCharacter; i++) {
    recordChildContent(b, 30);
    assert.equal(mayOffer(b, false).allowed, true, `offer ${i + 1} should be allowed`);
    recordOffer(b, false);
  }
  recordChildContent(b, 30);
  assert.equal(mayOffer(b, false).allowed, false, 'fourth offer must be refused');
});

test('per-session cap holds across characters', () => {
  const b = newBudget();
  let emitted = 0;
  for (let c = 0; c < 4; c++) {
    startNewCharacter(b);
    for (let i = 0; i < 3; i++) {
      recordChildContent(b, 30);
      if (mayOffer(b, false).allowed) {
        recordOffer(b, false);
        emitted++;
      }
    }
  }
  assert.equal(emitted, BUDGET_LIMITS.unrequestedPerSession);
});

test('a requested offer bypasses the budget — the child asked', () => {
  const b = newBudget();
  b.unrequestedThisCharacter = 99;
  b.unrequestedThisSession = 99;
  assert.equal(mayOffer(b, true).allowed, true);
});

test('recording an offer resets the content counter so offers cannot stack', () => {
  const b = newBudget();
  recordChildContent(b, 100);
  recordOffer(b, false);
  assert.equal(mayOffer(b, false).allowed, false);
});

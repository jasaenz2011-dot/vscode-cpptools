import { test } from 'node:test';
import assert from 'node:assert/strict';
import { filterUtterance, mayAddress, maySpeak } from '../src/feedback.js';

test('the default state is silence', () => {
  for (const t of ['idle_timer', 'field_blur', 'keystroke_pause', 'session_start', 'encouragement_schedule'] as const) {
    assert.equal(maySpeak(t).allowed, false, `${t} must not make the tool speak`);
  }
});

test('the tool speaks only when the child opens the door', () => {
  for (const t of ['child_requested_feedback', 'child_hit_stuck_affordance', 'child_completed_declared_goal_opted_in'] as const) {
    assert.equal(maySpeak(t).allowed, true);
  }
});

test('feedback may address task, process, self-regulation — never the self', () => {
  assert.equal(mayAddress('task'), true);
  assert.equal(mayAddress('process'), true);
  assert.equal(mayAddress('self_regulation'), true);
  assert.equal(mayAddress('self'), false);
});

test('never-say filter catches person praise', () => {
  assert.equal(filterUtterance("You're so creative!").clean, false);
  assert.equal(filterUtterance("You're so smart").clean, false);
  assert.equal(filterUtterance('What a great imagination').clean, false);
});

test('never-say filter catches implying a correct character or story', () => {
  assert.equal(filterUtterance('Your character needs a goal.').clean, false);
  assert.equal(filterUtterance('Real stories have a problem to solve.').clean, false);
  assert.equal(filterUtterance("That's wrong.").clean, false);
});

test('never-say filter catches peer comparison, ranking and scoring', () => {
  assert.equal(filterUtterance('Most kids write more than this.').clean, false);
  assert.equal(filterUtterance('This is better than your last one.').clean, false);
  assert.equal(filterUtterance('Your score is 4 out of 5.').clean, false);
});

test('never-say filter catches originality and cliche judgements', () => {
  assert.equal(filterUtterance('Try to be more original.').clean, false);
  assert.equal(filterUtterance('This is cliched.').clean, false);
});

test('never-say filter catches absence framed as failure', () => {
  assert.equal(filterUtterance('You forgot to give them a reason.').clean, false);
});

test('descriptive, non-evaluative utterances pass', () => {
  for (const ok of [
    'What does your character notice that others miss?',
    'You wrote that she waited by the door. What was she waiting for?',
    'Where do they go?',
  ]) {
    assert.equal(filterUtterance(ok).clean, true, `should pass: ${ok}`);
  }
});

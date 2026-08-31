#!/usr/bin/env node
/*
 * Be Me — progress report.
 * Counts the artwork you've drawn in incoming/ against each folder's target.
 * Run from the be-me folder:  node tools/progress.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const INCOMING = path.join(ROOT, 'incoming');

if (!fs.existsSync(INCOMING)) {
  console.log('\n  No incoming/ folder yet — nothing to report.\n');
  process.exit(0);
}

// Walk to the leaf folders (the ones that actually hold artwork).
const leaves = [];
(function walk(dir) {
  const subdirs = fs.readdirSync(dir, { withFileTypes: true }).filter((e) => e.isDirectory());
  if (!subdirs.length) leaves.push(dir);
  subdirs.forEach((e) => walk(path.join(dir, e.name)));
})(INCOMING);

let totalDone = 0;
let totalTarget = 0;
const rows = leaves.map((dir) => {
  let target = 0;
  try {
    target = Number(/TARGET: (\d+)/.exec(fs.readFileSync(path.join(dir, 'README.txt'), 'utf8'))?.[1] || 0);
  } catch { /* folder without a guide */ }
  const done = fs.readdirSync(dir).filter((f) => f.toLowerCase().endsWith('.png')).length;
  totalDone += done;
  totalTarget += target;
  return { name: path.relative(INCOMING, dir), done, target };
}).sort((a, b) => a.name.localeCompare(b.name));

console.log('\n  Be Me — art progress\n');
rows.forEach(({ name, done, target }) => {
  const complete = target > 0 && done >= target;
  const filled = target > 0 ? Math.min(10, Math.round((done / target) * 10)) : 0;
  const bar = '#'.repeat(filled).padEnd(10, '.');
  console.log(`  ${complete ? '✔' : ' '} ${name.padEnd(22)} [${bar}] ${done}/${target}`);
});

const pct = totalTarget ? Math.round((totalDone / totalTarget) * 100) : 0;
console.log(`\n  TOTAL: ${totalDone}/${totalTarget} files (${pct}%)`);
console.log('  Drawn something new? Run: node tools/normalize.js\n');

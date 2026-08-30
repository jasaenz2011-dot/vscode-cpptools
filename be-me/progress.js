// Counts finished art files in each assets folder and prints a progress
// report against the targets. Run from this folder:  node progress.js
const fs = require('fs');
const path = require('path');

const dirs = [];
(function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const subdirs = entries.filter((e) => e.isDirectory());
  if (subdirs.length === 0) dirs.push(dir);
  subdirs.forEach((e) => walk(path.join(dir, e.name)));
})(path.join(__dirname, 'assets'));

let totalDone = 0;
let totalTarget = 0;
const rows = dirs.map((dir) => {
  const readme = path.join(dir, 'README.txt');
  let target = 0;
  try {
    target = Number(/TARGET: (\d+)/.exec(fs.readFileSync(readme, 'utf8'))?.[1] || 0);
  } catch { /* folder without a guide: target stays 0 */ }
  const done = fs.readdirSync(dir).filter((f) => f.toLowerCase().endsWith('.png')).length;
  totalDone += done;
  totalTarget += target;
  return { name: path.relative(path.join(__dirname, 'assets'), dir), done, target };
});

console.log('\n  Be Me — asset progress\n');
rows.forEach(({ name, done, target }) => {
  const full = target > 0 && done >= target;
  const bar = target > 0
    ? '#'.repeat(Math.min(10, Math.round((done / target) * 10))).padEnd(10, '.')
    : '          ';
  console.log(`  ${full ? '✔' : ' '} ${name.padEnd(22)} [${bar}] ${done}/${target}`);
});
console.log(`\n  TOTAL: ${totalDone}/${totalTarget} files (${Math.round((totalDone / totalTarget) * 100)}%)\n`);

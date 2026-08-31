#!/usr/bin/env node
/*
 * Be Me — avatar preview.
 *
 * Stacks one option from each layer into a finished avatar so you can SEE
 * whether your proportions look right, without opening the game.
 *
 * Usage:
 *   node preview.js                       # first option of every layer
 *   node preview.js --pick hair/front=3   # choose specific options
 *   node preview.js --guides              # draw the skeleton lines on top
 *   node preview.js --body kid            # show the kid skeleton guides
 *   node preview.js --out my-preview.png
 */
const fs = require('fs');
const path = require('path');
const { Jimp } = require('jimp');

const ROOT = path.resolve(__dirname, '..');
const CONFIG = JSON.parse(fs.readFileSync(path.join(__dirname, 'proportions.json'), 'utf8'));
const CW = CONFIG.canvas.width;
const CH = CONFIG.canvas.height;

const args = process.argv.slice(2);
const getArg = (name, fallback) => {
  const i = args.indexOf('--' + name);
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback;
};
const showGuides = args.includes('--guides');
const bodyType = getArg('body', 'adult');
const outPath = path.resolve(getArg('out', path.join(ROOT, 'preview.png')));

// --pick can appear several times: --pick hair/front=3 --pick clothes/tops=2
const picks = {};
args.forEach((a, i) => {
  if (a === '--pick' && args[i + 1]) {
    const [cat, n] = args[i + 1].split('=');
    picks[cat] = parseInt(n, 10);
  }
});

function optionsFor(category) {
  const dir = path.join(ROOT, 'assets', category);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith('.png')).sort();
}

(async () => {
  const canvas = new Jimp({ width: CW, height: CH, color: 0xffffffff });
  const used = [];

  for (const category of CONFIG.layerOrder) {
    const options = optionsFor(category);
    if (!options.length) continue;
    const index = Math.min(options.length, Math.max(1, picks[category] || 1)) - 1;
    const layer = await Jimp.read(path.join(ROOT, 'assets', category, options[index]));
    canvas.composite(layer, 0, 0);
    used.push(`${category} → ${options[index]}`);
  }

  if (showGuides) {
    // Draw the skeleton lines so you can see what each piece is aligning to.
    const skeleton = CONFIG.bodyTypes[bodyType];
    if (!skeleton) { console.error(`Unknown body type "${bodyType}"`); process.exit(1); }
    for (const [name, pct] of Object.entries(skeleton)) {
      if (name === 'headWidth' || name === 'bodyWidth') continue;
      const y = Math.round(pct * CH);
      if (y < 0 || y >= CH) continue;
      for (let x = 0; x < CW; x += 4) canvas.setPixelColor(0xff0080ff, x, y);
    }
  }

  await canvas.write(outPath);
  console.log('\n  Preview written to ' + outPath + '\n');
  used.forEach((u) => console.log('    ' + u));
  if (!used.length) console.log('    (no assets yet — run normalize.js first)');
  console.log('');
})().catch((e) => { console.error(e); process.exit(1); });

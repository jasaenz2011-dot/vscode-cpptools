#!/usr/bin/env node
/*
 * Be Me — avatar preview.
 * Stacks one option from each layer so you can SEE whether things line up,
 * without running the game.
 *
 *   node tools/preview.js --body kid
 *   node tools/preview.js --body kid --pick hair=3 --pick face/eyes=2
 *   node tools/preview.js --body kid --guides      # draw the skeleton lines
 *   node tools/preview.js --all                    # every body type, side by side
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
const showAll = args.includes('--all');
const outPath = path.resolve(getArg('out', path.join(ROOT, 'preview.png')));

const picks = {};
args.forEach((a, i) => {
  if (a === '--pick' && args[i + 1]) {
    const [cat, n] = args[i + 1].split('=');
    picks[cat] = parseInt(n, 10);
  }
});

function optionsFor(bodyType, category) {
  const dir = path.join(ROOT, 'assets', bodyType, category);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith('.png')).sort();
}

async function buildOne(bodyType) {
  const canvas = new Jimp({ width: CW, height: CH, color: 0xf2f2f4ff });
  const used = [];
  for (const category of CONFIG.layerOrder) {
    const options = optionsFor(bodyType, category);
    if (!options.length) continue;
    const idx = Math.min(options.length, Math.max(1, picks[category] || 1)) - 1;
    canvas.composite(await Jimp.read(path.join(ROOT, 'assets', bodyType, category, options[idx])), 0, 0);
    used.push(`${category} → ${options[idx]}`);
  }
  if (showGuides) {
    const skeleton = CONFIG.bodyTypes[bodyType];
    for (const [name, pct] of Object.entries(skeleton)) {
      if (name === 'headWidth' || name === 'bodyWidth') continue;
      const y = Math.round(pct * CH);
      if (y >= 0 && y < CH) for (let x = 0; x < CW; x += 4) canvas.setPixelColor(0xff0080ff, x, y);
    }
  }
  return { canvas, used };
}

(async () => {
  const types = showAll
    ? Object.keys(CONFIG.bodyTypes).filter((t) => optionsFor(t, 'bodies').length)
    : [getArg('body', Object.keys(CONFIG.bodyTypes)[0])];

  if (!types.length) {
    console.log('\n  No normalized art yet — run: node tools/normalize.js\n');
    return;
  }

  const built = [];
  for (const t of types) built.push({ type: t, ...(await buildOne(t)) });

  const sheet = new Jimp({ width: CW * built.length, height: CH, color: 0xf2f2f4ff });
  built.forEach((b, i) => sheet.composite(b.canvas, CW * i, 0));
  await sheet.write(outPath);

  console.log('\n  Preview written to ' + outPath + '\n');
  built.forEach((b) => {
    console.log(`  ${b.type}:`);
    b.used.forEach((u) => console.log('    ' + u));
    if (!b.used.length) console.log('    (nothing normalized for this body type yet)');
  });
  console.log('');
})().catch((e) => { console.error(e); process.exit(1); });

#!/usr/bin/env node
/*
 * Be Me — art normalizer.
 *
 * Draw your art at ANY size, cropped however you like. Drop it in
 * incoming/<category>/ with any filename. This script figures out the rest:
 *
 *   1. trims the empty space around your drawing
 *   2. scales it to the right size for the chosen body type
 *   3. places it on the 512x768 canvas at the right spot
 *   4. saves it into assets/<category>/ with the numbering the game expects
 *
 * Usage:
 *   node normalize.js                 # normalize everything for the default body
 *   node normalize.js --body kid      # same art, sized for a child character
 *   node normalize.js --only hair     # just the folders matching "hair"
 *
 * Because every size is a percentage of the body, switching body type
 * re-sizes hair, hats, eyes and clothes to match. You never touch pixels.
 */
const fs = require('fs');
const path = require('path');
const { Jimp } = require('jimp');

const ROOT = path.resolve(__dirname, '..');
const CONFIG = JSON.parse(fs.readFileSync(path.join(__dirname, 'proportions.json'), 'utf8'));

// Filename prefix per category, so the game can auto-discover options.
const PREFIX = {
  'body': 'body',
  'face/eyes': 'eyes', 'face/brows': 'brows', 'face/noses': 'nose',
  'face/mouths': 'mouth', 'face/extras': 'extra',
  'hair/back': 'hairback', 'hair/front': 'hairfront',
  'clothes/tops': 'top', 'clothes/bottoms': 'bottom', 'clothes/outfits': 'outfit',
  'clothes/shoes': 'shoes', 'clothes/outerwear': 'jacket',
  'accessories/glasses': 'glasses', 'accessories/hats': 'hat',
  'accessories/jewelry': 'jewelry', 'accessories/props': 'prop',
  'accessories/fantasy': 'fantasy',
  'backgrounds': 'bg', 'ui': 'ui'
};

const args = process.argv.slice(2);
const getArg = (name, fallback) => {
  const i = args.indexOf('--' + name);
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback;
};
const bodyType = getArg('body', 'adult');
const onlyFilter = getArg('only', null);

if (!CONFIG.bodyTypes[bodyType]) {
  console.error(`Unknown body type "${bodyType}". Available: ${Object.keys(CONFIG.bodyTypes).join(', ')}`);
  process.exit(1);
}

const skeleton = CONFIG.bodyTypes[bodyType];
const CW = CONFIG.canvas.width;
const CH = CONFIG.canvas.height;

// Turn the percentage skeleton into pixels for this canvas.
const line = (name) => Math.round(skeleton[name] * CH);
const headWidthPx = Math.round(skeleton.headWidth * CW);
const bodyWidthPx = Math.round(skeleton.bodyWidth * CW);

/** Find the bounding box of everything that isn't transparent. */
function contentBounds(image) {
  const { width, height, data } = image.bitmap;
  let minX = width, minY = height, maxX = -1, maxY = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * 4 + 3] > 8) {  // alpha above near-invisible
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < 0) return null;  // fully transparent
  return { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 };
}

async function normalizeOne(srcPath, rule) {
  const image = await Jimp.read(srcPath);

  // Backgrounds just fill the whole canvas.
  if (rule.fill) {
    image.resize({ w: CW, h: CH });
    return image;
  }

  // UI icons are square and not part of the avatar stack.
  if (rule.iconSize) {
    image.resize({ w: rule.iconSize, h: rule.iconSize });
    return image;
  }

  const box = contentBounds(image);
  if (!box) return null;
  image.crop({ x: box.x, y: box.y, w: box.w, h: box.h });

  // The body is scaled to span exactly from one skeleton line to another
  // (head to feet), so however tall or short you drew it, the face and
  // clothing lines always land in the right place on it.
  if (rule.fitHeight) {
    const [fromLine, toLine] = rule.fitHeight;
    const targetH = line(toLine) - line(fromLine);
    const targetW = Math.max(1, Math.round(box.w * (targetH / box.h)));
    image.resize({ w: targetW, h: targetH });
    const canvas = new Jimp({ width: CW, height: CH, color: 0x00000000 });
    canvas.composite(image, Math.round((CW - targetW) / 2), line(fromLine));
    return canvas;
  }

  // Scale so the art's width matches its share of the reference width.
  const referenceWidth = rule.relativeTo === 'head' ? headWidthPx : bodyWidthPx;
  const targetW = Math.max(1, Math.round(referenceWidth * rule.widthPct));
  const targetH = Math.max(1, Math.round(box.h * (targetW / box.w)));
  image.resize({ w: targetW, h: targetH });

  // Place it: horizontally centered, vertically hung off its anchor line.
  const anchorPx = line(rule.anchorY);
  const x = Math.round((CW - targetW) / 2);
  let y;
  if (rule.anchorMode === 'top') y = anchorPx;
  else if (rule.anchorMode === 'bottom') y = anchorPx - targetH;
  else y = Math.round(anchorPx - targetH / 2);

  const canvas = new Jimp({ width: CW, height: CH, color: 0x00000000 });
  canvas.composite(image, x, y);
  return canvas;
}

async function processCategory(category, rule) {
  const inDir = path.join(ROOT, 'incoming', category);
  if (!fs.existsSync(inDir)) return null;
  const files = fs.readdirSync(inDir)
    .filter((f) => /\.(png|PNG)$/.test(f))
    .sort();
  if (!files.length) return null;

  const outDir = path.join(ROOT, 'assets', category);
  fs.mkdirSync(outDir, { recursive: true });

  const prefix = PREFIX[category] || category.split('/').pop();
  const manifest = [];
  const rows = [];

  for (let i = 0; i < files.length; i++) {
    const num = String(i + 1).padStart(2, '0');
    const outName = `${prefix}_${num}.png`;
    const result = await normalizeOne(path.join(inDir, files[i]), rule);
    if (!result) {
      rows.push([files[i], '— SKIPPED (image is empty)']);
      continue;
    }
    await result.write(path.join(outDir, outName));
    // Keep the artist's own name as a friendly label the game can display.
    const label = path.basename(files[i], path.extname(files[i]))
      .replace(/[-_]+/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
    manifest.push({ file: outName, label });
    rows.push([files[i], '→ ' + outName + '  "' + label + '"']);
  }

  if (manifest.length) {
    fs.writeFileSync(path.join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
  }
  return rows;
}

(async () => {
  console.log(`\n  Normalizing art for body type: ${bodyType}  (canvas ${CW}x${CH})\n`);
  let total = 0;
  let touchedAny = false;

  for (const [category, rule] of Object.entries(CONFIG.categories)) {
    if (category.startsWith('_')) continue;
    if (onlyFilter && !category.includes(onlyFilter)) continue;
    const rows = await processCategory(category, rule);
    if (!rows) continue;
    touchedAny = true;
    console.log(`  ${category}`);
    rows.forEach(([from, to]) => console.log(`    ${from.padEnd(28)} ${to}`));
    total += rows.length;
    console.log('');
  }

  if (!touchedAny) {
    console.log('  Nothing to do — put your artwork in incoming/<category>/ first.');
    console.log('  Example: incoming/clothes/tops/blue-hoodie.png\n');
  } else {
    console.log(`  Done — ${total} file(s) normalized into assets/\n`);
  }
})().catch((e) => { console.error(e); process.exit(1); });

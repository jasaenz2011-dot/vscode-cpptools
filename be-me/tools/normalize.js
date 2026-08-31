#!/usr/bin/env node
/*
 * Be Me — art normalizer.
 *
 * Draw or render your art at ANY size, cropped however it comes out. Drop it
 * in incoming/ with any filename. This does the rest:
 *
 *   1. trims the empty space around the artwork
 *   2. scales it to fit the character
 *   3. positions it on the shared canvas
 *   4. writes it into assets/<body type>/ with game-ready numbering
 *
 * Body and outfit are ONE piece (rendered together, so clothing always fits).
 * Hair, faces and accessories are drawn once and automatically re-fitted to
 * every body build.
 *
 * Usage:
 *   node tools/normalize.js               # every body type
 *   node tools/normalize.js --body kid    # just one
 *   node tools/normalize.js --only hair   # just matching folders
 */
const fs = require('fs');
const path = require('path');
const { Jimp } = require('jimp');

const ROOT = path.resolve(__dirname, '..');
const CONFIG = JSON.parse(fs.readFileSync(path.join(__dirname, 'proportions.json'), 'utf8'));
const CW = CONFIG.canvas.width;
const CH = CONFIG.canvas.height;

const PREFIX = {
  'bodies': 'body', 'hair': 'hair',
  'face/eyes': 'eyes', 'face/brows': 'brows', 'face/noses': 'nose',
  'face/mouths': 'mouth', 'face/extras': 'extra',
  'accessories/hats': 'hat', 'accessories/glasses': 'glasses',
  'accessories/jewelry': 'jewelry', 'accessories/props': 'prop',
  'backgrounds': 'bg', 'ui': 'ui'
};

const args = process.argv.slice(2);
const getArg = (name, fallback) => {
  const i = args.indexOf('--' + name);
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback;
};
const onlyBody = getArg('body', null);
const onlyFilter = getArg('only', null);

if (onlyBody && !CONFIG.bodyTypes[onlyBody]) {
  console.error(`\n  Unknown body type "${onlyBody}". Available: ${Object.keys(CONFIG.bodyTypes).join(', ')}\n`);
  process.exit(1);
}
const bodyTypes = onlyBody ? [onlyBody] : Object.keys(CONFIG.bodyTypes);

/** Bounding box of everything that isn't transparent. */
function contentBounds(image) {
  const { width, height, data } = image.bitmap;
  let minX = width, minY = height, maxX = -1, maxY = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * 4 + 3] > 8) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  return maxX < 0 ? null : { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 };
}

async function normalizeOne(srcPath, rule, skeleton) {
  const image = await Jimp.read(srcPath);
  const line = (name) => Math.round(skeleton[name] * CH);

  if (rule.fill) { image.resize({ w: CW, h: CH }); return image; }
  if (rule.iconSize) { image.resize({ w: rule.iconSize, h: rule.iconSize }); return image; }

  const box = contentBounds(image);
  if (!box) return null;
  image.crop({ x: box.x, y: box.y, w: box.w, h: box.h });

  const canvas = new Jimp({ width: CW, height: CH, color: 0x00000000 });

  // Bodies span exactly head-to-feet, so the face and accessory lines always
  // land correctly no matter how the body was framed when it was rendered.
  if (rule.fitHeight) {
    const [fromLine, toLine] = rule.fitHeight;
    const targetH = line(toLine) - line(fromLine);
    const targetW = Math.max(1, Math.round(box.w * (targetH / box.h)));
    image.resize({ w: targetW, h: targetH });
    canvas.composite(image, Math.round((CW - targetW) / 2), line(fromLine));
    return canvas;
  }

  const reference = rule.relativeTo === 'head'
    ? Math.round(skeleton.headWidth * CW)
    : Math.round(skeleton.bodyWidth * CW);
  const targetW = Math.max(1, Math.round(reference * rule.widthPct));
  const targetH = Math.max(1, Math.round(box.h * (targetW / box.w)));
  image.resize({ w: targetW, h: targetH });

  // offsetY nudges a piece up or down, measured in head-heights, so the nudge
  // stays correct across every body build. This is the knob to turn when
  // something sits slightly too high or too low.
  const headHeight = (skeleton.chinY - skeleton.headTop) * CH;
  const nudge = Math.round((rule.offsetY || 0) * headHeight);

  const anchorPx = line(rule.anchorY) + nudge;
  const x = Math.round((CW - targetW) / 2);
  const y = rule.anchorMode === 'top' ? anchorPx
    : rule.anchorMode === 'bottom' ? anchorPx - targetH
    : Math.round(anchorPx - targetH / 2);

  canvas.composite(image, x, y);
  return canvas;
}

/** Where the source art for a category lives (bodies are per body type). */
function sourceDir(category, rule, bodyType) {
  return rule.perBodyType
    ? path.join(ROOT, 'incoming', category, bodyType)
    : path.join(ROOT, 'incoming', category);
}

async function processCategory(category, rule, bodyType, skeleton) {
  const inDir = sourceDir(category, rule, bodyType);
  if (!fs.existsSync(inDir)) return null;
  const files = fs.readdirSync(inDir).filter((f) => /\.png$/i.test(f)).sort();
  if (!files.length) return null;

  const outDir = path.join(ROOT, 'assets', bodyType, category);
  fs.mkdirSync(outDir, { recursive: true });

  const prefix = PREFIX[category] || category.split('/').pop();
  const manifest = [];
  const rows = [];

  for (let i = 0; i < files.length; i++) {
    const outName = `${prefix}_${String(i + 1).padStart(2, '0')}.png`;
    const result = await normalizeOne(path.join(inDir, files[i]), rule, skeleton);
    if (!result) { rows.push([files[i], '— SKIPPED (image is empty)']); continue; }
    await result.write(path.join(outDir, outName));
    const label = path.basename(files[i], path.extname(files[i]))
      .replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    manifest.push({ file: outName, label });
    rows.push([files[i], `→ ${outName}  "${label}"`]);
  }

  if (manifest.length) {
    fs.writeFileSync(path.join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
  }
  return rows;
}

(async () => {
  let grandTotal = 0;

  for (const bodyType of bodyTypes) {
    const skeleton = CONFIG.bodyTypes[bodyType];
    const sections = [];
    let count = 0;

    for (const [category, rule] of Object.entries(CONFIG.categories)) {
      if (category.startsWith('_')) continue;
      if (onlyFilter && !category.includes(onlyFilter)) continue;
      const rows = await processCategory(category, rule, bodyType, skeleton);
      if (!rows) continue;
      sections.push([category, rows]);
      count += rows.length;
    }

    if (!count) continue;
    console.log(`\n  ══ ${bodyType} ══  → assets/${bodyType}/`);
    sections.forEach(([category, rows]) => {
      console.log(`\n  ${category}`);
      rows.forEach(([from, to]) => console.log(`    ${from.padEnd(30)} ${to}`));
    });
    console.log(`\n  ${count} file(s) for ${bodyType}`);
    grandTotal += count;
  }

  if (!grandTotal) {
    console.log('\n  Nothing to do yet. Put your artwork in incoming/ first:');
    console.log('    incoming/bodies/kid/lakers-outfit.png     (body + clothes together)');
    console.log('    incoming/hair/curly-short.png             (shared by every body type)');
    console.log('    incoming/face/eyes/friendly.png\n');
  } else {
    console.log(`\n  Done — ${grandTotal} file(s) written into assets/\n`);
  }
})().catch((e) => { console.error(e); process.exit(1); });

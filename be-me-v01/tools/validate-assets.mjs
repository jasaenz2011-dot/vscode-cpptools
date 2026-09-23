/**
 * PRE-RUNTIME ASSET VALIDATOR
 * ===========================
 *
 *   npm run validate:assets              validate everything in the manifest
 *   npm run validate:assets -- <path>    validate one file or directory
 *
 * Enforces the master canvas contract BEFORE anything reaches the browser, so a
 * mis-exported asset fails at the command line instead of silently landing a
 * few pixels off inside the app.
 *
 * The engine never resizes, crops, re-centres or smart-fits a layer. That is
 * only safe if every layer is genuinely authored on the same canvas at the same
 * origin — which is exactly what this checks.
 */

import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = process.cwd();
const MANIFEST = 'public/assets/manifest.json';
const CANVAS_CONFIG = 'src/config/canvas.ts';

/** Read the canvas contract from the app's own config — one source of truth. */
async function readCanvas() {
  const src = await readFile(path.join(ROOT, CANVAS_CONFIG), 'utf8');
  const width = Number(/width:\s*(\d+)/.exec(src)?.[1]);
  const height = Number(/height:\s*(\d+)/.exec(src)?.[1]);
  if (!width || !height) throw new Error(`Could not read MASTER_CANVAS from ${CANVAS_CONFIG}`);
  return { width, height };
}

const CHECKS = {
  FORMAT: 'must be PNG (JPEG cannot carry an alpha channel)',
  CANVAS: 'must be exactly the master canvas size',
  ALPHA: 'must have an alpha channel',
  BACKDROP: 'background must be transparent, not painted',
  BOUNDS: 'artwork must not touch the canvas edge (no headroom to grow)',
  EMPTY: 'must contain visible artwork',
};

async function validateFile(file, canvas, { isMaster = false } = {}) {
  const issues = [];
  const meta = await sharp(file).metadata();

  if (meta.format !== 'png') {
    issues.push({ check: 'FORMAT', detail: `is ${meta.format}` });
    // Everything below assumes alpha; a JPEG cannot pass any of it.
    return { file, meta, issues };
  }

  if (meta.width !== canvas.width || meta.height !== canvas.height) {
    issues.push({
      check: 'CANVAS',
      detail: `is ${meta.width} x ${meta.height}, expected ${canvas.width} x ${canvas.height}`,
    });
  }

  if (!meta.hasAlpha) {
    issues.push({ check: 'ALPHA', detail: 'no alpha channel' });
    return { file, meta, issues };
  }

  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h, channels: c } = info;
  const alphaAt = (x, y) => data[(y * w + x) * c + 3];

  // Border must be clear. A painted backdrop shows up here first.
  let borderTotal = 0;
  let borderClear = 0;
  for (let x = 0; x < w; x++) {
    for (const y of [0, h - 1]) {
      borderTotal++;
      if (alphaAt(x, y) < 16) borderClear++;
    }
  }
  for (let y = 0; y < h; y++) {
    for (const x of [0, w - 1]) {
      borderTotal++;
      if (alphaAt(x, y) < 16) borderClear++;
    }
  }
  const borderPct = (borderClear / borderTotal) * 100;
  if (borderPct < 95) {
    issues.push({ check: 'BACKDROP', detail: `only ${borderPct.toFixed(1)}% of the border is clear` });
  }

  // Opaque bounding box.
  let minX = w;
  let maxX = -1;
  let minY = h;
  let maxY = -1;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (alphaAt(x, y) > 40) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (maxX < 0) {
    issues.push({ check: 'EMPTY', detail: 'every pixel is transparent' });
    return { file, meta, issues, bbox: null };
  }

  const bbox = { minX, maxX, minY, maxY };

  // Masters especially need room above the head for tall hair.
  if (isMaster && minY < 8) {
    issues.push({
      check: 'BOUNDS',
      detail: `artwork starts at y=${minY} — no headroom for tall hairstyles`,
    });
  }

  return { file, meta, issues, bbox };
}

async function collectPngs(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await collectPngs(full)));
    else if (/\.(png|jpe?g)$/i.test(entry.name)) out.push(full);
  }
  return out;
}

async function main() {
  const canvas = await readCanvas();
  const target = process.argv[2];

  console.log(`\nMASTER CANVAS  ${canvas.width} x ${canvas.height}   (from ${CANVAS_CONFIG})\n`);

  let files = [];
  let masters = new Set();

  if (target) {
    const info = await stat(target);
    files = info.isDirectory() ? await collectPngs(target) : [target];
    for (const f of files) if (/master\.png$/i.test(f)) masters.add(f);
  } else {
    const manifest = JSON.parse(await readFile(path.join(ROOT, MANIFEST), 'utf8'));
    const missing = [];
    for (const asset of manifest.assets) {
      for (const rel of Object.values(asset.files)) {
        const full = path.join(ROOT, 'public', rel);
        try {
          await stat(full);
          files.push(full);
          if (asset.category === 'base') masters.add(full);
        } catch {
          missing.push({ id: asset.id, rel, enabled: asset.enabled });
        }
      }
    }
    const declared = missing.filter((m) => m.enabled);
    console.log(
      `MANIFEST       ${manifest.assets.length} entries · ${files.length} files present · ` +
        `${missing.length} awaiting artwork\n`,
    );
    if (declared.length > 0) {
      console.log(`  ${declared.length} ENABLED entries point at files that do not exist:`);
      for (const m of declared.slice(0, 10)) console.log(`    ${m.id.padEnd(18)} ${m.rel}`);
      if (declared.length > 10) console.log(`    ... and ${declared.length - 10} more`);
      console.log('');
    }
  }

  if (files.length === 0) {
    console.log('Nothing to validate.\n');
    return;
  }

  const results = [];
  for (const f of files) {
    results.push(await validateFile(f, canvas, { isMaster: masters.has(f) }));
  }

  const failed = results.filter((r) => r.issues.length > 0);
  const passed = results.filter((r) => r.issues.length === 0);

  for (const r of failed) {
    console.log(`FAIL  ${path.relative(ROOT, r.file)}`);
    for (const issue of r.issues) {
      console.log(`        ${issue.check.padEnd(9)} ${issue.detail}`);
      console.log(`        ${''.padEnd(9)} -> ${CHECKS[issue.check]}`);
    }
    console.log('');
  }

  for (const r of passed) {
    const b = r.bbox;
    const extent = b ? `bbox x ${b.minX}-${b.maxX}  y ${b.minY}-${b.maxY}` : '';
    console.log(`PASS  ${path.relative(ROOT, r.file).padEnd(58)} ${extent}`);
  }

  console.log(`\n${passed.length} passed, ${failed.length} failed\n`);
  if (failed.length > 0) process.exitCode = 1;
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});

/**
 * One-off preparation of the artwork supplied by the client.
 *
 * This script does NOT create artwork. It only:
 *   1. Crops the Be ME! logo out of the phone screenshot it was supplied in
 *      (removing the OS status bar, close button and download toast).
 *   2. Derives a transparent-background copy of that same logo by keying out
 *      the white page it was photographed on — pixels are keyed, never redrawn.
 *   3. Copies the two K-8 character contact sheets in verbatim as reference.
 *
 * Run:  node tools/prepare-supplied-art.mjs
 */
import sharp from 'sharp';
import { mkdir, copyFile } from 'node:fs/promises';
import path from 'node:path';

const UPLOADS = '/root/.claude/uploads/419eb09f-30e5-5366-a284-7012ae2bb3da';
const BRAND = 'public/brand';
const REFERENCE = 'public/assets/reference';

await mkdir(BRAND, { recursive: true });
await mkdir(REFERENCE, { recursive: true });

/* ------------------------------- 1. the logo ------------------------------ */

const logoSrc = path.join(UPLOADS, 'bd116f7f-image.png');
const meta = await sharp(logoSrc).metadata();
console.log(`logo screenshot: ${meta.width} x ${meta.height}`);

/**
 * Find the white artwork card inside the dark screenshot chrome by scanning for
 * the first and last rows that are predominantly bright.
 */
const { data, info } = await sharp(logoSrc)
  .removeAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width, height, channels } = info;
const rowIsBright = (y) => {
  let bright = 0;
  for (let x = 0; x < width; x += 8) {
    const i = (y * width + x) * channels;
    if (data[i] > 200 && data[i + 1] > 200 && data[i + 2] > 200) bright += 1;
  }
  return bright / Math.ceil(width / 8) > 0.6;
};

let top = 0;
let bottom = height - 1;
while (top < height && !rowIsBright(top)) top += 1;
while (bottom > top && !rowIsBright(bottom)) bottom -= 1;

const cropTop = top;
const cropHeight = bottom - top + 1;
console.log(`white card detected: y ${cropTop} .. ${bottom} (${cropHeight}px tall)`);

if (cropHeight < 200) throw new Error('Could not locate the logo card in the screenshot.');

await sharp(logoSrc)
  .extract({ left: 0, top: cropTop, width, height: cropHeight })
  .png()
  .toFile(path.join(BRAND, 'be-me-logo.png'));
console.log(`wrote ${BRAND}/be-me-logo.png`);

/**
 * Transparent variant: key out the near-white page. This removes background
 * pixels only; nothing is painted in. Feathered so the logo keeps clean edges.
 */
const cropped = await sharp(logoSrc)
  .extract({ left: 0, top: cropTop, width, height: cropHeight })
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const px = cropped.data;
const ch = cropped.info.channels;
for (let i = 0; i < px.length; i += ch) {
  const r = px[i];
  const g = px[i + 1];
  const b = px[i + 2];
  const min = Math.min(r, g, b);
  const max = Math.max(r, g, b);
  // Near-white and near-neutral => background.
  if (min > 232 && max - min < 14) {
    px[i + 3] = 0;
  } else if (min > 214 && max - min < 20) {
    px[i + 3] = Math.round(((min - 214) / (232 - 214)) * 0 + (1 - (min - 214) / 18) * 255);
  }
}

await sharp(px, { raw: { width: cropped.info.width, height: cropped.info.height, channels: ch } })
  .png()
  .toFile(path.join(BRAND, 'be-me-logo-transparent.png'));
console.log(`wrote ${BRAND}/be-me-logo-transparent.png`);

// A small mark for the header, trimmed to the logo's own bounds.
await sharp(path.join(BRAND, 'be-me-logo-transparent.png'))
  .trim({ threshold: 1 })
  .resize({ height: 320, withoutEnlargement: true })
  .png()
  .toFile(path.join(BRAND, 'be-me-mark.png'));
console.log(`wrote ${BRAND}/be-me-mark.png`);

/* ---------------------------- 2. reference sheets -------------------------- */

await copyFile(
  path.join(UPLOADS, '5fe3a378-image.png'),
  path.join(REFERENCE, 'reference-k8-hispanic-boy-girl.png'),
);
await copyFile(
  path.join(UPLOADS, '60382ee7-image.jpg'),
  path.join(REFERENCE, 'reference-k8-boy.jpg'),
);
console.log(`copied 2 reference contact sheets into ${REFERENCE}/`);

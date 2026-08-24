/**
 * SLICE THE SUPPLIED FACE / HAIR SHEETS
 * =====================================
 *
 * Four sheets of Cinematic 3D face and hair components: boy eyes, girl eyes,
 * boy + girl mouths, girl hairstyles. All four are 1536x1024 PNGs with a real
 * alpha channel, so unlike the wardrobe JPEGs nothing has to be keyed.
 *
 * AS WITH THE WARDROBE SHEETS, THIS PRODUCES A CATALOG, NOT LAYER ASSETS.
 * The output is not wired into the compositor. See public/assets/catalog/
 * README.md for the two measured reasons these cannot yet be avatar layers.
 *
 * The eye sheets are laid out irregularly — different numbers of pairs per
 * band — so bands and blobs are found from the alpha channel and blobs are
 * grouped two at a time into pairs. That IS per-item detection, which would be
 * illegitimate for a master-canvas layer; it is fine here precisely because
 * these files are catalog thumbnails and are never composited.
 */

import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const UPLOADS = '/root/.claude/uploads/419eb09f-30e5-5366-a284-7012ae2bb3da';
const OUT = 'public/assets/catalog';

const PAIR_SHEETS = [
  {
    id: 'eyes-boy',
    file: `${UPLOADS}/812184f1-image.png`,
    names: [
      ['brown', 'blue', 'green'],
      ['amber', 'deep-brown'],
      ['hooded-brown', 'round-brown', 'sharp-brown', 'grey'],
    ],
  },
];

const GRID_SHEETS = [
  {
    /* Regular 5 x 2 of pairs. Band detection merges these rows because the
       lashes of adjacent rows touch, so the layout is declared instead. */
    id: 'eyes-girl',
    file: `${UPLOADS}/77005b9d-image.png`,
    cols: 2,
    rowBands: [[0, 205], [205, 410], [410, 614], [614, 819], [819, 1024]],
    names: [
      ['amber-lash', 'grey-lash'],
      ['deep-brown-lash', 'honey-lash'],
      ['blue-lash', 'green-lash'],
      ['violet-lash', 'teal-lash'],
      ['hazel-lash', 'pink-lash'],
    ],
  },
  {
    id: 'mouths',
    file: `${UPLOADS}/73fb538a-image.png`,
    /* Bands, not edges: the sheet interleaves a caption strip and a GIRL header
       between the two rows of artwork, so the rows are not contiguous. */
    cols: 5,
    rowBands: [[110, 430], [620, 930]],
    names: [
      ['boy-01', 'boy-02', 'boy-03', 'boy-04', 'boy-05'],
      ['girl-01', 'girl-02', 'girl-03', 'girl-04', 'girl-05'],
    ],
  },
  {
    id: 'hair-girl',
    file: `${UPLOADS}/21d6c82e-image.png`,
    cols: 2,
    rowBands: [[0, 512], [512, 1024]],
    names: [
      ['puff-bow', 'wavy-butterfly'],
      ['braided-buns', 'ponytail-swirl'],
    ],
  },
];

/** Rows of the sheet that contain artwork, and the blobs within each. */
async function findBandsAndBlobs(file) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const opaque = (x, y) => data[(y * width + x) * channels + 3] > 70;

  const rowCount = new Array(height).fill(0);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) if (opaque(x, y)) rowCount[y]++;
  }

  const bands = [];
  let start = null;
  for (let y = 0; y < height; y++) {
    if (rowCount[y] > width * 0.02) {
      if (start === null) start = y;
    } else if (start !== null) {
      if (y - start > 20) bands.push([start, y - 1]);
      start = null;
    }
  }
  if (start !== null) bands.push([start, height - 1]);

  return bands.map(([top, bottom]) => {
    const colCount = new Array(width).fill(0);
    for (let y = top; y <= bottom; y++) {
      for (let x = 0; x < width; x++) if (opaque(x, y)) colCount[x]++;
    }
    const blobs = [];
    let s = null;
    for (let x = 0; x < width; x++) {
      if (colCount[x] > 0) {
        if (s === null) s = x;
      } else if (s !== null) {
        if (x - s > 25) blobs.push([s, x - 1]);
        s = null;
      }
    }
    if (s !== null) blobs.push([s, width - 1]);
    return { top, bottom, blobs };
  });
}

async function main() {
  const index = [];

  for (const sheet of PAIR_SHEETS) {
    const bands = await findBandsAndBlobs(sheet.file);
    const meta = await sharp(sheet.file).metadata();
    const dir = path.join(OUT, sheet.id);
    await mkdir(dir, { recursive: true });
    let made = 0;

    for (let b = 0; b < bands.length; b++) {
      const { top, bottom, blobs } = bands[b];
      const rowNames = sheet.names[b] ?? [];
      for (let p = 0; p * 2 + 1 < blobs.length; p++) {
        const name = rowNames[p];
        if (!name) continue;
        const pad = 10;
        // Clamp to the sheet: a blob touching an edge would otherwise push the
        // extract window past it and sharp rejects the whole region.
        const left = Math.max(0, blobs[p * 2][0] - 8);
        const right = Math.min(meta.width, blobs[p * 2 + 1][1] + 8);
        const topPad = Math.max(0, top - pad);
        const bottomPad = Math.min(meta.height, bottom + pad);
        const buf = await sharp(sheet.file)
          .extract({
            left,
            top: topPad,
            width: Math.max(1, right - left),
            height: Math.max(1, bottomPad - topPad),
          })
          .png()
          .toBuffer();
        const rel = path.join(dir, `${name}.png`);
        await writeFile(rel, buf);
        index.push({ sheet: sheet.id, id: name, file: '/' + path.relative('public', rel) });
        made++;
      }
    }
    console.log(`${sheet.id.padEnd(12)} ${bands.length} bands -> ${made} pairs`);
  }

  for (const sheet of GRID_SHEETS) {
    const meta = await sharp(sheet.file).metadata();
    const cellW = meta.width / sheet.cols;
    const dir = path.join(OUT, sheet.id);
    await mkdir(dir, { recursive: true });
    let made = 0;

    for (let r = 0; r < sheet.rowBands.length; r++) {
      const [bandTop, bandBottom] = sheet.rowBands[r];
      for (let c = 0; c < sheet.cols; c++) {
        const name = sheet.names[r]?.[c];
        if (!name) continue;
        const left = Math.round(cellW * c);
        const buf = await sharp(sheet.file)
          .extract({
            left,
            top: bandTop,
            width: Math.round(cellW * (c + 1)) - left,
            height: bandBottom - bandTop,
          })
          .png()
          .toBuffer();
        const rel = path.join(dir, `${name}.png`);
        await writeFile(rel, buf);
        index.push({ sheet: sheet.id, id: name, file: '/' + path.relative('public', rel) });
        made++;
      }
    }
    console.log(`${sheet.id.padEnd(12)} grid -> ${made} items`);
  }

  console.log(`\n${index.length} face/hair items -> ${OUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

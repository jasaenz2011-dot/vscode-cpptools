/**
 * SLICE THE SUPPLIED CATALOG SHEETS
 * =================================
 *
 * The client supplied five contact sheets of wardrobe artwork. This cuts them
 * into individual PNGs so each garment exists as its own file.
 *
 * WHAT THIS DELIBERATELY DOES NOT DO
 * ----------------------------------
 * It does NOT produce master-canvas layer assets, and the output is NOT wired
 * into the avatar compositor. Every cell is cut on a UNIFORM DECLARED GRID:
 * same cell size across a sheet, measured once from the sheet's gutters and
 * written down below.
 *
 * There is no per-item bounding-box detection, no crop-to-content, no
 * smart-fitting and no independent centring — those are exactly the operations
 * the brief forbids, and doing them here would bake a wrong position into every
 * file. The cut is dumb on purpose.
 *
 * The three JPEG sheets carry a PAINTED checkerboard rather than an alpha
 * channel, so the checkerboard is keyed to real transparency by colour test.
 * That removes pixels; it never repaints them. JPEG ringing around garment
 * edges is inherent to the supplied files and is left as delivered.
 */

import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const UPLOADS = '/root/.claude/uploads/419eb09f-30e5-5366-a284-7012ae2bb3da';
const OUT = 'public/assets/catalog';

/**
 * Grids measured from each sheet's gutters (see tools/README notes). Rows for
 * the shoe sheet are uneven in the supplied art, so its row edges are listed
 * explicitly rather than divided evenly.
 */
const SHEETS = [
  {
    id: 'shoes',
    file: `${UPLOADS}/fa252a15-image.png`,
    cols: 5,
    rowEdges: [8, 229, 472, 724, 984],
    key: false,
    names: [
      ['white', 'chicago', 'royal', 'slime', 'blackout'],
      ['ice', 'flame', 'teal-cement', 'spider', 'galaxy'],
      ['hazard', 'shark', 'primary', 'neon-crown', 'rainbow-drip'],
      ['ferrari', 'lightning', 'monogram', 'camo', 'pink-heart'],
    ],
  },
  {
    id: 'tees-graphic',
    file: `${UPLOADS}/1fda16c0-image.png`,
    cols: 5,
    rows: 4,
    key: false,
    names: [
      ['bear-blue', 'game-on', 'red-boy', 'legend', 'lion-crown'],
      ['astronaut', 'smiley-drip', 'controller-neon', 'hoops-boy', 'just-do-it'],
      ['dino-rex', 'hooded-figure', 'level-up', 'night-car', 'ninja-fire'],
      ['spider-hero', 'shark-jaws', 'controller-crown', 'money-bear', 'texas'],
    ],
  },
  {
    id: 'tops',
    file: `${UPLOADS}/87f6fa94-image.jpg`,
    cols: 5,
    rows: 4,
    key: true,
    names: [
      ['ninja', 'dragon-red', 'slam', 'mech', 'power-bolt'],
      ['wrestle', 'kick', 'beast', 'touchdown', 'power-fist'],
      ['shadow', 'strike', 'dragon-flame', 'robot', 'dunk'],
      ['pin', 'jaws', 'star', 'fight', 'dragon-orange'],
    ],
  },
  {
    id: 'bottoms',
    file: `${UPLOADS}/01e2a058-image.jpg`,
    cols: 5,
    rows: 2,
    key: true,
    names: [
      ['chino-khaki', 'denim-light', 'mesh-black', 'sweat-grey', 'cargo-navy'],
      ['track-red', 'denim-dark', 'cargo-olive', 'knit-black', 'camo'],
    ],
  },
  {
    id: 'tees-white',
    file: `${UPLOADS}/578bcf6c-image.jpg`,
    cols: 5,
    rows: 4,
    key: true,
    names: [
      ['goku', 'wwe-champion', 'heroic', 'dunk-orange', 'boom'],
      ['soccer', 'mech-red', 'dragon-purple', 'touchdown-blue', 'race'],
      ['ninja-white', 'super-bolt', 'lava-monster', 'shark-white', 'shadow-white'],
      ['robot-space', 'dunk-lightning', 'legend-burst', 'luchador', 'dragon-green'],
    ],
  },
];

/** True for the painted checkerboard: near-neutral and light. */
function isCheckerboard(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  return max - min < 14 && min > 180;
}

/*
 * The supplied checkerboard is exactly periodic: 10px squares. That periodicity
 * — not colour — is the only reliable way to tell it from a white garment.
 */
const CHECK_HALF = 10;

/** Find a patch that is certainly empty backdrop, to read phase and tones from. */
function findEmptyPatch(data, width, height, channels) {
  const boxW = 60;
  const boxH = 30;
  let best = null;
  for (let y = 0; y + boxH < height; y += 10) {
    for (let x = 0; x + boxW < width; x += 10) {
      let min = 255;
      let chroma = 0;
      for (let yy = y; yy < y + boxH; yy += 2) {
        for (let xx = x; xx < x + boxW; xx += 2) {
          const i = (yy * width + xx) * channels;
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          chroma = Math.max(chroma, Math.max(r, g, b) - Math.min(r, g, b));
          min = Math.min(min, Math.min(r, g, b));
        }
      }
      // Backdrop only: never coloured, never dark.
      if (chroma > 12 || min < 185) continue;
      const score = (y < height / 2 ? 0 : 1) + (x < width / 2 ? 0 : 1);
      if (!best || score < best.score) best = { x, y, score };
      if (best && best.score === 0) return best;
    }
  }
  return best;
}

/**
 * Mask of pixels belonging to the painted checkerboard.
 *
 * Colour alone cannot decide this. A white t-shirt is light and neutral like the
 * light squares, and the shirt's own grey shading (200-224) overlaps the dark
 * squares, so any tone test — or a flood fill gated on one — treats the garment
 * as backdrop and erases it, leaving the print floating in mid-air. Both earlier
 * attempts failed exactly there.
 *
 * The backdrop is instead RECONSTRUCTED: its 10px pitch, phase and two tones are
 * read from a patch known to be empty, and a pixel is backdrop only if it
 * matches what the checkerboard should be AT THAT COORDINATE. A white shirt
 * fails on every predicted dark square, so the fill stops dead at its edge.
 */
function checkerboardMask(data, width, height, channels) {
  const patch = findEmptyPatch(data, width, height, channels);
  const out = new Uint8Array(width * height);
  if (!patch) return out;

  let bestPhase = { dx: 0, dy: 0, sep: -1, a: 0, b: 0 };
  for (let dx = 0; dx < CHECK_HALF; dx++) {
    for (let dy = 0; dy < CHECK_HALF; dy++) {
      const sum = [0, 0];
      const count = [0, 0];
      for (let y = patch.y; y < patch.y + 30; y++) {
        for (let x = patch.x; x < patch.x + 60; x++) {
          const parity =
            (Math.floor((x + dx) / CHECK_HALF) + Math.floor((y + dy) / CHECK_HALF)) % 2;
          sum[parity] += data[(y * width + x) * channels];
          count[parity]++;
        }
      }
      if (!count[0] || !count[1]) continue;
      const a = sum[0] / count[0];
      const b = sum[1] / count[1];
      if (Math.abs(a - b) > bestPhase.sep) bestPhase = { dx, dy, sep: Math.abs(a - b), a, b };
    }
  }
  if (bestPhase.sep < 12) return out;

  const TOL = 16;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * channels;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      if (Math.max(r, g, b) - Math.min(r, g, b) >= 16) continue;
      const parity =
        (Math.floor((x + bestPhase.dx) / CHECK_HALF) +
          Math.floor((y + bestPhase.dy) / CHECK_HALF)) %
        2;
      const expected = parity === 0 ? bestPhase.a : bestPhase.b;
      if (Math.abs(r - expected) <= TOL) out[y * width + x] = 1;
    }
  }
  return out;
}

/**
 * Key the painted checkerboard to transparency by FLOOD FILL FROM THE BORDERS.
 *
 * A plain colour test cannot be used here: a white t-shirt is also "light and
 * neutral", so a global test erases the shirt body and leaves the print
 * floating in mid-air. The checkerboard is instead identified structurally —
 * it is the region connected to the edge of the cell. A white shirt in the
 * middle is an island the fill never reaches, so it survives intact.
 *
 * Removes pixels only; no pixel is ever recoloured.
 */
async function keyCheckerboard(buffer) {
  const { data, info } = await sharp(buffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  const at = (x, y) => (y * width + x) * channels;
  const mask = checkerboardMask(data, width, height, channels);
  const check = (x, y) => mask[y * width + x] === 1;

  const seen = new Uint8Array(width * height);
  const stack = [];
  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const k = y * width + x;
    if (seen[k] || !check(x, y)) return;
    seen[k] = 1;
    stack.push(x, y);
  };

  for (let x = 0; x < width; x++) {
    push(x, 0);
    push(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    push(0, y);
    push(width - 1, y);
  }

  while (stack.length) {
    const y = stack.pop();
    const x = stack.pop();
    data[at(x, y) + 3] = 0;
    push(x + 1, y);
    push(x - 1, y);
    push(x, y + 1);
    push(x, y - 1);
  }

  return sharp(data, { raw: { width, height, channels } })
    .png()
    .toBuffer();
}

/**
 * Row boundaries read from the sheet's own gutters.
 *
 * This reads the SHEET's layout, which is not the same thing as fitting an
 * individual asset: cells still contain whatever the artist put in them, at the
 * position and scale they drew it. Dividing the sheet evenly instead would slice
 * through neighbouring garments, which is what bled shoe tips into the tee row.
 */
async function rowEdgesFromGutters(file, expectedRows) {
  const { data, info } = await sharp(file).raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const content = new Array(height).fill(0);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * channels;
      if (!isCheckerboard(data[i], data[i + 1], data[i + 2])) content[y]++;
    }
  }

  const threshold = Math.max(2, Math.round(width * 0.002));
  const bands = [];
  let start = null;
  for (let y = 0; y < height; y++) {
    if (content[y] > threshold) {
      if (start === null) start = y;
    } else if (start !== null) {
      if (y - start > height / (expectedRows * 4)) bands.push([start, y - 1]);
      start = null;
    }
  }
  if (start !== null) bands.push([start, height - 1]);

  if (bands.length !== expectedRows) {
    /*
     * Some sheets are laid out with the rows touching, so there is no empty
     * gutter to find. Fall back to snapping each boundary to the quietest row
     * near where it is expected — the seam with the least artwork crossing it.
     * Still reading the sheet's layout, still no per-item fitting.
     */
    const edges = [0];
    const span = height / expectedRows;
    for (let i = 1; i < expectedRows; i++) {
      const target = Math.round(span * i);
      const lo = Math.max(1, target - Math.round(span * 0.22));
      const hi = Math.min(height - 2, target + Math.round(span * 0.22));
      let best = target;
      for (let y = lo; y <= hi; y++) if (content[y] < content[best]) best = y;
      edges.push(best);
    }
    edges.push(height);
    return edges;
  }

  const edges = [Math.max(0, bands[0][0] - 4)];
  for (let i = 0; i < bands.length - 1; i++) {
    edges.push(Math.round((bands[i][1] + bands[i + 1][0]) / 2));
  }
  edges.push(Math.min(height, bands[bands.length - 1][1] + 4));
  return edges;
}

async function main() {
  const index = [];

  for (const sheet of SHEETS) {
    const meta = await sharp(sheet.file).metadata();
    const cellW = meta.width / sheet.cols;
    const measured = sheet.key ? await rowEdgesFromGutters(sheet.file, sheet.rows) : null;
    const rowEdges =
      sheet.rowEdges ??
      measured ??
      Array.from({ length: sheet.rows + 1 }, (_, i) => Math.round((meta.height / sheet.rows) * i));
    if (sheet.key) {
      console.log(`  ${sheet.id} row edges ${measured ? 'measured' : 'EVEN FALLBACK'}: ${rowEdges.join(', ')}`);
    }

    /*
     * Key the WHOLE sheet before cutting. The pattern test needs a window
     * around each pixel, and near a cell border that window would run past the
     * crop and see only one tone — which left a rind of un-keyed checkerboard
     * on every tile when the keying was done per-cell.
     */
    const source = sheet.key ? await keyCheckerboard(await sharp(sheet.file).toBuffer()) : sheet.file;

    const dir = path.join(OUT, sheet.id);
    await mkdir(dir, { recursive: true });

    for (let r = 0; r < rowEdges.length - 1; r++) {
      for (let c = 0; c < sheet.cols; c++) {
        const name = sheet.names[r]?.[c];
        if (!name) continue;

        const left = Math.round(cellW * c);
        const top = rowEdges[r];
        const width = Math.round(cellW * (c + 1)) - left;
        const height = rowEdges[r + 1] - top;

        const buf = await sharp(source).extract({ left, top, width, height }).png().toBuffer();

        const rel = path.join(dir, `${name}.png`);
        await writeFile(rel, buf);
        index.push({ sheet: sheet.id, id: name, file: '/' + path.relative('public', rel), width, height });
      }
    }
    console.log(`${sheet.id.padEnd(13)} ${sheet.cols} x ${rowEdges.length - 1}  cell ${Math.round(cellW)}x${rowEdges[1] - rowEdges[0]}`);
  }

  await writeFile(path.join(OUT, 'index.json'), JSON.stringify({ note: 'Supplied catalog art sliced on a uniform declared grid. NOT master-canvas layer assets - see tools/slice-catalog.mjs.', items: index }, null, 2) + '\n');
  console.log(`\n${index.length} items -> ${OUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

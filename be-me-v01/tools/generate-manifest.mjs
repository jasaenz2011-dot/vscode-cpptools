/**
 * Creates the asset directory tree and seeds public/assets/manifest.json.
 *
 * The manifest is the single source of truth for what the Customize panel
 * offers. Adding an asset later is:
 *   1. drop the PNG into the directory the manifest names
 *   2. add (or enable) its entry here / in the JSON
 * No UI code changes.
 *
 * This script creates NO artwork. Every entry it seeds points at a file path
 * that the artist will fill; until then the engine renders a labelled empty
 * slot rather than substituting anything.
 *
 * Run:  node tools/generate-manifest.mjs
 */
import { mkdir, writeFile } from 'node:fs/promises';

const ROOT = 'public/assets';
const STYLES = ['cinematic3d', 'watercolor', 'photorealistic', 'animebattle', 'storybook3d', 'comichero'];
const BASES = ['boy', 'girl'];
const DIRS = [
  'base',
  'skin',
  'eyes',
  'eyebrows',
  'hair',
  'tops',
  'bottoms',
  'shoes',
  'accessories',
  'extras',
];

const SLOT_DIR = {
  base: 'base',
  skin: 'skin',
  eyes: 'eyes',
  eyebrows: 'eyebrows',
  hair: 'hair',
  top: 'tops',
  bottom: 'bottoms',
  shoes: 'shoes',
  accessories: 'accessories',
  extras: 'extras',
};

/* ------------------------------ seed catalog ------------------------------ */

const SKIN = [
  ['skin_001', 'Porcelain', '#f2d3bd'],
  ['skin_002', 'Sand', '#e7bb98'],
  ['skin_003', 'Honey', '#d09b6a'],
  ['skin_004', 'Amber', '#b3784b'],
  ['skin_005', 'Umber', '#8a5636'],
  ['skin_006', 'Ebony', '#5c3722'],
];

const HAIR = {
  boy: [
    ['hair_001', 'Close Crop'],
    ['hair_002', 'Textured Crop'],
    ['hair_003', 'Curl Top'],
    ['hair_004', 'Waves'],
    ['hair_005', 'Twists'],
    ['hair_006', 'Mid Fade'],
  ],
  girl: [
    ['hair_001', 'Long Straight'],
    ['hair_002', 'High Bun'],
    ['hair_003', 'Twin Braids'],
    ['hair_004', 'Natural Curls'],
    ['hair_005', 'Ponytail'],
    ['hair_006', 'Shoulder Bob'],
  ],
};

const EYES = [
  ['eyes_001', 'Warm Brown', '#6b4423'],
  ['eyes_002', 'Deep Brown', '#3b2416'],
  ['eyes_003', 'Hazel', '#8a6b3d'],
  ['eyes_004', 'Green', '#4a6b45'],
];

const EYEBROWS = [
  ['brow_001', 'Soft'],
  ['brow_002', 'Straight'],
  ['brow_003', 'Arched'],
  ['brow_004', 'Bold'],
];

const TOPS = [
  ['top_001', 'Crew Tee'],
  ['top_002', 'Hoodie'],
  ['top_003', 'Flannel Shirt'],
  ['top_004', 'Track Jacket'],
  ['top_005', 'Polo'],
  ['top_006', 'Knit Sweater'],
];

const BOTTOMS = {
  boy: [
    ['bottom_001', 'Denim Jeans'],
    ['bottom_002', 'Cargo Pants'],
    ['bottom_003', 'Shorts'],
    ['bottom_004', 'Joggers'],
    ['bottom_005', 'Track Pants'],
  ],
  girl: [
    ['bottom_001', 'Denim Jeans'],
    ['bottom_002', 'Cargo Pants'],
    ['bottom_003', 'Shorts'],
    ['bottom_004', 'Leggings'],
    ['bottom_005', 'Pleated Skirt'],
  ],
};

const SHOES = [
  ['shoes_001', 'Sneakers'],
  ['shoes_002', 'Hi-Tops'],
  ['shoes_003', 'Boots'],
  ['shoes_004', 'Runners'],
  ['shoes_005', 'Slip-Ons'],
];

const ACCESSORIES = [
  ['acc_001', 'Backpack'],
  ['acc_002', 'Glasses'],
  ['acc_003', 'Headphones'],
  ['acc_004', 'Cap'],
  ['acc_005', 'Watch'],
];

const EXTRAS = [
  ['extra_001', 'Aura Glow'],
  ['extra_002', 'Cape'],
  ['extra_003', 'Wings'],
  ['extra_004', 'Sparks'],
  ['extra_005', 'Halo'],
];

/* ------------------------------ tree creation ----------------------------- */

for (const style of STYLES) {
  for (const base of BASES) {
    for (const dir of DIRS) {
      await mkdir(`${ROOT}/${style}/${base}/${dir}`, { recursive: true });
    }
  }
}

const styleReadme = (style) => `# ${style}

Asset directory for the **${style}** art style.

Every PNG in here must be authored on the master canvas defined in
\`src/config/canvas.ts\` (currently 1024 x 1536, taken from the delivered
masters) with the character in the exact
position the master base places them. The engine composites layers by exact
canvas alignment: it does not crop, re-centre, or scale-to-fit individual
assets.

\`\`\`
${style}/
  boy/
    base/          master.png            <- the master avatar for this body base
    skin/          skin_001.png ...
    eyes/          eyes_001.png ...
    eyebrows/      brow_001.png ...
    hair/          hair_001.png ...
    tops/          top_001.png ...
    bottoms/       bottom_001.png ...
    shoes/         shoes_001.png ...
    accessories/   acc_001.png ...
    extras/        extra_001.png ...
  girl/
    (same structure)
\`\`\`

Filenames are declared in \`public/assets/manifest.json\`. To add an asset:
drop the PNG in the right directory and add or enable its manifest entry.
`;

for (const style of STYLES) {
  await writeFile(`${ROOT}/${style}/README.md`, styleReadme(style));
}

/* -------------------------------- manifest -------------------------------- */

const assets = [];
const file = (style, base, slot, id) => `/assets/${style}/${base}/${SLOT_DIR[slot]}/${id}.png`;

const push = (style, base, slot, id, name, swatch, notes) => {
  assets.push({
    id,
    name,
    style,
    bodyBase: base,
    category: slot,
    files: { front: file(style, base, slot, id) },
    enabled: true,
    ...(swatch ? { swatch } : {}),
    ...(notes ? { notes } : {}),
  });
};

for (const base of BASES) {
  const style = 'cinematic3d';

  assets.push({
    id: 'base_master',
    name: `Cinematic 3D ${base === 'boy' ? 'Boy' : 'Girl'}`,
    style,
    bodyBase: base,
    category: 'base',
    files: { front: `/assets/${style}/${base}/base/master.png` },
    enabled: true,
    notes: 'Supplied master artwork. Place the delivered PNG at this exact path.',
  });

  for (const [id, name, swatch] of SKIN) push(style, base, 'skin', id, name, swatch);
  for (const [id, name] of HAIR[base]) push(style, base, 'hair', id, name);
  for (const [id, name, swatch] of EYES) push(style, base, 'eyes', id, name, swatch);
  for (const [id, name] of EYEBROWS) push(style, base, 'eyebrows', id, name);
  for (const [id, name] of TOPS) push(style, base, 'top', id, name);
  for (const [id, name] of BOTTOMS[base]) push(style, base, 'bottom', id, name);
  for (const [id, name] of SHOES) push(style, base, 'shoes', id, name);
  for (const [id, name] of ACCESSORIES) push(style, base, 'accessories', id, name);
  for (const [id, name] of EXTRAS) push(style, base, 'extras', id, name);
}

/**
 * Taken from the delivered master artwork, not from a guess. Must stay in step
 * with MASTER_CANVAS in src/config/canvas.ts — the app surfaces a mismatch in
 * the footer rather than silently preferring one over the other.
 */
const MASTER_CANVAS = { width: 1024, height: 1536 };

const manifest = {
  version: 1,
  masterCanvas: MASTER_CANVAS,
  assets,
};

await writeFile(`${ROOT}/manifest.json`, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`wrote ${ROOT}/manifest.json — ${assets.length} entries`);
console.log(`created ${STYLES.length} style trees x ${BASES.length} body bases x ${DIRS.length} slots`);

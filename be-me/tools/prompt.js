#!/usr/bin/env node
/*
 * Be Me — prompt writer.
 *
 * Prints a ready-to-paste art prompt so every new piece matches the rest of
 * the set. Paste into your image generator of choice.
 *
 *   node tools/prompt.js bodies "Lakers t-shirt and tan cargo shorts"
 *   node tools/prompt.js hair "curly afro with white bows"
 *   node tools/prompt.js accessories/hats "red baseball cap" --fix
 *   node tools/prompt.js --list
 */

// ---------------------------------------------------------------------------
// THE STYLE BLOCK — goes into every prompt. This is what makes a hundred
// separate renders look like one game. Edit once, then leave it alone.
// ---------------------------------------------------------------------------
const STYLE = '3D rendered character art, soft toy-like stylization with rounded '
  + 'friendly proportions, smooth matte skin, realistic fabric texture with visible '
  + 'weave and stitching, soft even studio lighting, gentle contact shadows only, '
  + 'straight-on front view, upright and centered, high detail, clean product-shot '
  + 'presentation';

const BLANK_FACE = 'completely blank featureless face with no eyes, no nose, no mouth '
  + 'and no eyebrows, smooth and empty';

const NEGATIVE = 'photo of a real person, realistic human face, facial features, eyes, '
  + 'mouth, nose, multiple views, character sheet, turnaround, grid, collage, side view, '
  + 'back view, three-quarter view, text, letters, logo, watermark, signature, cropped, '
  + 'cut off, scenery, furniture, props, busy background, dramatic lighting, harsh shadows';

const CATEGORIES = {
  'bodies': {
    subject: 'a full standing character from head to feet wearing an outfit, completely bald with no hair at all, ' + BLANK_FACE + ', arms relaxed straight down at the sides, standing upright facing forward, entire body and both feet visible',
    item: 'character',
    note: 'Body AND clothing render together — that is why the clothes fit. Say the skin tone and the whole outfit in one description. Save into incoming/bodies/<body type>/.'
  },
  'hair': {
    subject: 'a hairstyle by itself, shaped as if it were being worn, with a hollow empty opening where the head and face would be',
    item: 'hair',
    note: 'The hardest one. If the generator insists on drawing a head, render it on a bald head and erase the head afterwards.'
  },
  'face/eyes': { subject: 'a single pair of stylized cartoon eyes floating by themselves, no face, no head, no skin around them', item: 'pair of eyes' },
  'face/brows': { subject: 'a single pair of eyebrows by themselves, no face, no skin', item: 'pair of eyebrows' },
  'face/noses': { subject: 'one simple stylized nose by itself, no face', item: 'nose' },
  'face/mouths': { subject: 'one stylized cartoon mouth by itself, no face, no chin, no skin around it', item: 'mouth' },
  'face/extras': { subject: 'one facial detail by itself, no face around it', item: 'facial detail' },
  'accessories/hats': { subject: 'one hat seen straight from the front as if being worn, with a hollow empty space where the head would be', item: 'hat' },
  'accessories/glasses': { subject: 'one pair of eyeglasses seen straight from the front, floating by themselves, no face', item: 'eyeglasses' },
  'accessories/jewelry': { subject: 'one piece of jewelry by itself, no body, no neck, no ears', item: 'jewelry' },
  'accessories/props': { subject: 'one hand-held object by itself, no hand, no character', item: 'object' },
  'backgrounds': { subject: 'a simple portrait backdrop, empty of characters, tall vertical composition, soft and uncluttered so a character reads clearly in front of it', item: 'backdrop', isBackground: true },
  'ui': { subject: 'one simple flat interface icon, square, bold and readable at small size', item: 'icon' }
};

const args = process.argv.slice(2);
const wantFix = args.includes('--fix');
const positional = args.filter((a) => !a.startsWith('--'));

if (args.includes('--list') || !positional.length) {
  console.log('\n  Usage:  node tools/prompt.js <category> "<what you want>" [--fix]\n');
  console.log('  Categories:');
  Object.keys(CATEGORIES).forEach((c) => console.log('    ' + c));
  console.log('\n  Examples:');
  console.log('    node tools/prompt.js bodies "medium brown skin, white tee, tan cargo shorts, white sneakers"');
  console.log('    node tools/prompt.js hair "short curly black hair"');
  console.log('    node tools/prompt.js accessories/hats "red baseball cap" --fix\n');
  process.exit(0);
}

const category = positional[0];
const description = positional.slice(1).join(' ');
const spec = CATEGORIES[category];

if (!spec) {
  console.error(`\n  Unknown category "${category}". Run with --list to see them all.\n`);
  process.exit(1);
}
if (!description) {
  console.error(`\n  Describe what you want, e.g.:\n    node tools/prompt.js ${category} "red baseball cap"\n`);
  process.exit(1);
}

const line = '─'.repeat(72);
const slug = description.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

if (wantFix) {
  console.log(`\n${line}\n  FIX-EXISTING-ART PROMPT — ${category}: ${description}`);
  console.log('  Attach your image, then paste everything below.');
  console.log(`${line}\n`);
  console.log(`Rework this image so it matches an avatar-creator asset set. Keep the
design, colors and personality exactly as they are — change only what the
rules below require.

Apply each of these that isn't already true:
1. ${STYLE}
2. Make the background fully transparent. No backdrop, no gradient, no
   scenery, no ground, no cast shadow on any surface.
3. Show ONLY the ${spec.item}. Remove everything else — any other
   characters, body parts, props or objects that aren't part of it.
4. Show ONE single front view. Delete any side views, back views,
   three-quarter views or turnaround panels.
5. Face straight forward, upright and level — no tilt, no rotation,
   no perspective.${category === 'bodies' ? `
6. The face must be completely blank — no eyes, nose, mouth or eyebrows.
7. The head must be completely bald — no hair at all.` : ''}
${category === 'bodies' ? '8' : '6'}. Leave clear empty space around every edge; nothing touching or running
   off the sides.
${category === 'bodies' ? '9' : '7'}. Remove any text, labels, brand logos, watermarks, borders or frames.

If something in this list is already correct, leave it alone.`);
  console.log(`\n${line}\n`);
} else {
  const parts = [`${spec.subject}, ${description}`, STYLE];
  if (spec.isBackground) {
    parts.push('fills the entire frame edge to edge', 'no characters, no people, no text, no watermark');
  } else {
    parts.push(
      'completely transparent background',
      `only the ${spec.item} and nothing else`,
      'one single front view only, no turnaround, no side or back views',
      'no text, no logos, no watermark, no border',
      'entire subject visible with clear empty space around all edges'
    );
  }

  // --raw prints just the prompt text, for piping into other files.
  if (args.includes('--raw')) {
    console.log(parts.join(', '));
    process.exit(0);
  }

  console.log(`\n${line}\n  NEW ART PROMPT — ${category}: ${description}`);
  console.log(`${line}\n`);
  console.log(parts.join(', '));
  console.log(`\n${line}\n  NEGATIVE PROMPT (paste into the negative field if you have one)\n${line}\n`);
  console.log(NEGATIVE);
  if (spec.note) console.log(`\n${line}\n  NOTE: ${spec.note}`);
  console.log(`\n${line}`);
  const dest = category === 'bodies'
    ? `incoming/bodies/<body type>/${slug}.png`
    : `incoming/${category}/${slug}.png`;
  console.log(`  Save it to: ${dest}`);
  console.log('  Then run:   node tools/normalize.js   (sizing and placement are automatic)');
  console.log(`${line}\n`);
}

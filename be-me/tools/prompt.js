#!/usr/bin/env node
/*
 * Be Me — prompt writer.
 *
 * Prints a ready-to-paste art prompt so every new piece comes out matching
 * the rest of the set. Paste the result into GameLab's Sprites tab or any
 * AI image generator.
 *
 *   node tools/prompt.js hair/front "curly afro"
 *   node tools/prompt.js clothes/tops "denim jacket" --fix
 *   node tools/prompt.js --list
 */

// ---------------------------------------------------------------------------
// THE STYLE BLOCK. This same text goes into every prompt — that is what makes
// all the artwork look like one set. Edit it once if you want a different
// look for your whole game, then leave it alone.
// ---------------------------------------------------------------------------
const STYLE = 'flat vector cartoon style, bold clean uniform black outlines of even '
  + 'thickness, simple two-tone cel shading, no gradients, no texture, no painterly '
  + 'rendering, friendly modern character design, straight-on front view, perfectly '
  + 'symmetrical, centered';

const GRAYSCALE = 'drawn in grayscale only — white, grays and black, absolutely no '
  + 'color, shading expressed purely as lighter and darker gray values';

const NEGATIVE = 'photo, realistic, 3d render, gradient, texture, noise, grain, '
  + 'sketchy lines, multiple views, character sheet, grid, collage, text, letters, '
  + 'watermark, signature, cropped, cut off, drop shadow, ground shadow, busy '
  + 'background, scenery';

// subject = what to draw; item = what to say "only the ___ and nothing else"
const CATEGORIES = {
  'body': { subject: 'a full standing character body, head to feet, arms relaxed slightly away from the sides, neutral pose, blank featureless face', item: 'body', gray: true },
  'face/eyes': { subject: 'a single pair of cartoon eyes, no face around them', item: 'pair of eyes', gray: true },
  'face/brows': { subject: 'a single pair of eyebrows', item: 'pair of eyebrows', gray: true },
  'face/noses': { subject: 'one simple cartoon nose', item: 'nose', gray: true },
  'face/mouths': { subject: 'one cartoon mouth', item: 'mouth', gray: false },
  'face/extras': { subject: 'one facial detail', item: 'facial detail', gray: false },
  'hair/back': { subject: 'the rear section of a hairstyle only — the mass of hair that sits behind the head and shoulders, with a hollow empty gap where the face would be', item: 'back section of hair', gray: true },
  'hair/front': { subject: 'the front section of a hairstyle only — the bangs and fringe that fall in front of the forehead', item: 'front section of hair', gray: true },
  'clothes/tops': { subject: 'an empty garment shaped as if worn, with no body inside it', item: 'garment', gray: true },
  'clothes/bottoms': { subject: 'empty trousers or skirt shaped as if worn, with no legs inside', item: 'garment', gray: true },
  'clothes/outfits': { subject: 'a full one-piece outfit shaped as if worn, with no body inside', item: 'outfit', gray: true },
  'clothes/shoes': { subject: 'one matching pair of shoes side by side, no feet or legs', item: 'pair of shoes', gray: false },
  'clothes/outerwear': { subject: 'an open jacket or coat shaped as if worn, with no body inside', item: 'jacket', gray: true },
  'accessories/glasses': { subject: 'one pair of eyeglasses, no face', item: 'eyeglasses', gray: false },
  'accessories/hats': { subject: 'one hat seen from the front as if worn, with no head inside it', item: 'hat', gray: false },
  'accessories/jewelry': { subject: 'one piece of jewelry, no body', item: 'jewelry', gray: false },
  'accessories/props': { subject: 'one hand-held object', item: 'object', gray: false },
  'accessories/fantasy': { subject: 'one fantasy accessory, symmetrical', item: 'accessory', gray: false },
  'backgrounds': { subject: 'a simple portrait backdrop scene, empty of characters, tall vertical composition', item: 'background scene', gray: false, isBackground: true },
  'ui': { subject: 'one simple flat interface icon, square, bold and readable at small size', item: 'icon', gray: false }
};

const args = process.argv.slice(2);
const wantFix = args.includes('--fix');
const positional = args.filter((a) => !a.startsWith('--'));

if (args.includes('--list') || !positional.length) {
  console.log('\n  Usage:  node tools/prompt.js <category> "<what you want>" [--fix]\n');
  console.log('  Categories:');
  Object.keys(CATEGORIES).forEach((c) => console.log('    ' + c));
  console.log('\n  Examples:');
  console.log('    node tools/prompt.js hair/front "curly afro"');
  console.log('    node tools/prompt.js clothes/tops "denim jacket" --fix\n');
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

const line = '─'.repeat(70);

if (wantFix) {
  console.log(`\n${line}\n  FIX-EXISTING-ART PROMPT — ${category}: ${description}`);
  console.log('  Attach your image, then paste everything below.');
  console.log(`${line}\n`);
  console.log(`Rework this image so it matches an avatar-creator asset set. Keep the
design, shapes and personality exactly as they are — change only what the
rules below require.

Apply each of these that isn't already true:
1. ${STYLE}
2. Remove the background completely — plain flat white, nothing behind the subject.
3. Show ONLY the ${spec.item}. Delete any character, body parts, props, scenery,
   shadow or ground it is sitting on.
4. Face the viewer straight on, symmetrical and upright — no tilt, no
   three-quarter angle, no perspective.${spec.gray ? `
5. ${GRAYSCALE}` : ''}
${spec.gray ? '6' : '5'}. Leave clear empty space around every edge; nothing touching or running
   off the sides.
${spec.gray ? '7' : '6'}. Remove any text, labels, watermarks, borders or frames.

If something in this list is already correct, leave it alone.`);
  console.log(`\n${line}\n`);
} else {
  const parts = [
    `${spec.subject}, ${description}`,
    STYLE
  ];
  if (spec.gray) parts.push(GRAYSCALE);
  if (spec.isBackground) {
    parts.push('fills the entire frame edge to edge', 'no characters, no people, no text, no watermark');
  } else {
    parts.push(
      'isolated on a plain flat white background',
      `only the ${spec.item} and nothing else, no character, no body parts, no shadow, no ground`,
      'no text, no watermark, no border',
      'full item visible with clear space around all edges'
    );
  }

  console.log(`\n${line}\n  NEW ART PROMPT — ${category}: ${description}`);
  console.log(`${line}\n`);
  console.log(parts.join(', '));
  console.log(`\n${line}\n  NEGATIVE PROMPT (paste in the negative field, if you have one)\n${line}\n`);
  console.log(NEGATIVE);
  console.log(`\n${line}`);
  console.log(`  Save the result into: incoming/${category}/${description.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.png`);
  console.log('  Then run: node tools/normalize.js   (size and placement are handled for you)');
  console.log(`${line}\n`);
}

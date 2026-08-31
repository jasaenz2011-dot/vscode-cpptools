# 🎨 Be Me — master art prompts

Copy-paste prompts for generating avatar artwork that comes out right the
first time. Works in GameLab's Sprites tab, or any AI image generator.

Don't want to think about it? Let the tool write the prompt for you:

```bash
node tools/prompt.js hair/front "curly afro"      # prompt for new art
node tools/prompt.js clothes/tops "denim jacket" --fix   # prompt to fix art you already have
node tools/prompt.js --list                        # every category
```

---

## 1. The style block — the most important part

This paragraph must appear **word for word in every single prompt**, for
every piece, forever. It is what makes 100 separate images look like one
game instead of a ransom note. Change it once at the start if you want a
different look, then never touch it again.

> 3D rendered character art, soft toy-like stylization with rounded
> friendly proportions, smooth matte skin, realistic fabric texture with
> visible weave and stitching, soft even studio lighting, gentle contact
> shadows only, completely blank featureless face with no eyes no nose no
> mouth and no eyebrows, straight-on front view, upright and centered,
> high detail, clean product-shot presentation

Two extra tricks for consistency:

- **Reuse the same model.** Don't switch between generators halfway.
- **Reuse the same seed** if your tool exposes one. Same seed + same style
  block gives noticeably steadier results across a set.

---

## 2. New artwork — the template

```
[SUBJECT], [STYLE BLOCK], isolated on a plain flat white background,
only the [ITEM TYPE] and nothing else, no character, no body parts,
no shadow, no ground, no text, no watermark, no border, full item
visible with clear space around all edges
```

**Negative prompt** (paste into the negative field if your tool has one):

```
photo, realistic, 3d render, gradient, texture, noise, grain, sketchy
lines, multiple views, character sheet, grid, collage, text, letters,
watermark, signature, cropped, cut off, drop shadow, ground shadow,
busy background, scenery
```

---

## 3. Fixing artwork you already have

Use this when you've got art that isn't quite conforming yet. Attach the
image and paste:

```
Rework this image so it matches an avatar-creator asset set. Keep the
design, shapes and personality exactly as they are — change only what the
rules below require.

Apply each of these that isn't already true:
1. [STYLE BLOCK]
2. Remove the background completely — plain flat white, nothing behind
   the subject.
3. Show ONLY the [ITEM TYPE]. Delete any character, body parts, props,
   scenery, shadow or ground the item is sitting on.
4. Face the viewer straight on, symmetrical and upright — no tilt, no
   three-quarter angle, no perspective.
5. [GRAYSCALE RULE]
6. Leave clear empty space around every edge; nothing touching or
   running off the sides.
7. Remove any text, labels, watermarks, borders or frames.

If something in this list is already correct, leave it alone.
```

---

## 4. Color: bake it, don't tint it

Tinting a grayscale file works beautifully for flat cartoon art. It does
**not** work well for 3D rendered art — real shading and fabric texture go
muddy when you recolor them, and skin tone especially looks wrong.

So for this art style, generate real variants instead:

- **Skin tones:** render the base body separately in each tone you want
  (5–6 is a good range). Same prompt, same pose, one word changed.
- **Clothing colors:** if a shirt should come in four colors, that's four
  renders. Cheap to generate, and they'll actually look right.
- **Hair colors:** same — render each color.

It's more files, but they're generated files, not hand-drawn ones. And
`normalize.js` doesn't care how many you have.

---

## 5. Per-category subjects

Drop these into the `[SUBJECT]` and `[ITEM TYPE]` slots. `tools/prompt.js`
does it for you automatically.

| Folder | Subject phrasing | Grayscale? |
|---|---|---|
| `body` | full standing character body, head to feet, arms relaxed slightly away from the sides, neutral pose, blank featureless face | yes |
| `face/eyes` | a single pair of cartoon eyes, no face around them | yes |
| `face/brows` | a single pair of eyebrows, nothing else | yes |
| `face/noses` | one simple cartoon nose, nothing else | yes |
| `face/mouths` | one cartoon mouth, nothing else | no |
| `face/extras` | facial detail | no |
| `hair/back` | the rear section of a hairstyle only — the mass that sits behind the head and shoulders, with a hollow gap where the face would be | yes |
| `hair/front` | the front section of a hairstyle only — bangs and fringe that fall in front of the forehead | yes |
| `clothes/tops` | an empty garment shaped as if worn, with no body inside it | yes |
| `clothes/bottoms` | empty trousers or skirt shaped as if worn, with no legs inside | yes |
| `clothes/outfits` | a full one-piece outfit shaped as if worn, with no body inside | yes |
| `clothes/shoes` | one matching pair of shoes side by side, no feet or legs | no |
| `clothes/outerwear` | an open jacket or coat shaped as if worn, with no body inside | yes |
| `accessories/glasses` | one pair of eyeglasses, no face | no |
| `accessories/hats` | one hat seen from the front as if worn, no head inside | no |
| `accessories/jewelry` | one piece of jewelry, no body | no |
| `accessories/props` | one hand-held object | no |
| `accessories/fantasy` | one fantasy accessory, symmetrical | no |
| `backgrounds` | a simple portrait backdrop scene, empty of characters, tall vertical composition | no |
| `ui` | one simple flat interface icon, square, centered, bold and readable at small size | no |

---

## 6. Honest expectations

Isolated-item generation is the hard part for image models. Some
categories fight back:

- **Hair halves** are the fussiest. Generators want to draw a whole head.
  Often it's faster to generate the full hairstyle once, then erase the
  front half for `hair/back` and the back half for `hair/front`.
- **Empty clothes** sometimes come out with a ghost body inside. GameLab's
  background remover handles the plain background, but a body inside the
  shirt needs erasing by hand.
- **Expect to reroll.** Two or three tries per item is normal. The style
  block is what keeps the keepers consistent.

You never have to worry about size or placement — that's `normalize.js`.

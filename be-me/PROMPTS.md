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

| Folder | What one file is |
|---|---|
| `bodies/<build>` | a whole dressed character — bald, blank face, arms down, head to feet. Skin tone AND outfit in one render, which is why the clothes fit. |
| `hair` | a hairstyle by itself, hollow where the head goes |
| `face/eyes` | a single pair of eyes, no face around them |
| `face/brows` | a single pair of eyebrows |
| `face/noses` | one nose (optional — blank faces often read better without) |
| `face/mouths` | one mouth |
| `face/extras` | freckles, blush, face paint |
| `accessories/hats` | one hat, front view, hollow where the head goes |
| `accessories/glasses` | one pair of glasses, front view, no face |
| `accessories/jewelry` | earrings or a necklace |
| `accessories/props` | one held or worn item — backpack, book, skateboard |
| `backgrounds` | a portrait backdrop, no characters |
| `ui` | one flat square interface icon |

---

## 6. Honest expectations

- **Bodies are the easy part.** A whole dressed character is exactly what
  image generators are good at. Ask for transparent background and a bald
  head with a blank face, and you'll mostly get usable results first try.
- **Hair is the fussiest.** Generators badly want to attach it to a head.
  The reliable trick: render it on a bald head, then erase the head. Or
  render the hairstyle over one of your own base bodies and cut it out.
- **Turnaround sheets are wasted work.** If your generator keeps producing
  front/side/back panels, add "one single front view only, no turnaround"
  and put the rest in the negative prompt. Only the front view is used.
- **Expect to reroll.** Two or three tries per item is normal. The style
  block is what keeps the keepers consistent with each other.

You never have to worry about size or placement — that's `normalize.js`.

## 7. A note on brand logos

Real logos (team badges, sportswear marks) are trademarks. Fine for
artwork that stays inside your own classroom; a real problem if the game
is ever published, shared publicly, or distributed to other schools.
Generic designs — a plain jersey, an unbranded sneaker — avoid the issue
entirely and cost nothing to prompt for.

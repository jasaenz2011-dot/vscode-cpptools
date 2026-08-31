# 🪞 Be Me — avatar creator art workspace

Built for **3D rendered** character art. The key idea: the body and its
clothes are rendered **together as one piece**, so the clothing always fits
the body it was made for. Hair, faces and accessories are made **once** and
automatically re-fitted to every body build.

## You never size or place anything

Render at any size, any crop, any amount of empty space, any filename.
Drop it in the matching `incoming/` folder and run:

```bash
node tools/normalize.js
```

It trims, scales, positions, numbers it, and writes it into
`assets/<body type>/`. Your filename becomes the label players see, so
`purple hoodie.png` shows up in the game as "Purple Hoodie".

**Never edit `assets/` by hand** — it's generated. Change the art in
`incoming/` and re-run.

## The layers

| Layer | Folder | What one file is |
|---|---|---|
| Backdrop | `incoming/backgrounds/` | a scene behind the character |
| **Body + outfit** | `incoming/bodies/<build>/` | a whole dressed character: bald, blank face, arms down, head to feet |
| Hair | `incoming/hair/` | a hairstyle, hollow where the head goes |
| Face | `incoming/face/eyes|brows|noses|mouths|extras/` | one feature on its own |
| Accessories | `incoming/accessories/hats|glasses|jewelry|props/` | one item on its own |

Bodies are the main variety: each file is one skin tone + one outfit. Every
other layer is shared across all body builds.

## Body builds

Four are defined — `adult`, `teen`, `kid`, `kid-round`. Each needs its own
body renders in `incoming/bodies/<build>/`, because a chunky eight-year-old
and a tall teenager are genuinely different renders.

But you only make hair, faces and accessories **once**. Because every size
is a percentage of the character (never pixels), the same hairstyle
automatically fits a small round kid and a tall adult:

```bash
node tools/normalize.js              # fits shared art to every build
node tools/normalize.js --body kid   # just one build
```

Want a different build? Add it to `bodyTypes` in `tools/proportions.json`.

## Seeing your work

```bash
node tools/preview.js --body kid          # stack a full avatar
node tools/preview.js --all               # every build side by side
node tools/preview.js --guides            # show the skeleton lines
node tools/preview.js --pick hair=3       # try a specific option
node tools/progress.js                    # what's done, what's left
```

## When something sits slightly wrong

Hat too high? Hair too wide? That's one number in
`tools/proportions.json`, then re-run — never a redraw.

- `widthPct` — how wide the piece is, relative to the head or body
- `offsetY` — nudge up (negative) or down, measured in head-heights so the
  nudge stays right on every build

## Making new art that matches

```bash
node tools/prompt.js bodies "medium brown skin, white tee, tan cargo shorts"
node tools/prompt.js hair "short curly black hair"
node tools/prompt.js accessories/hats "red cap" --fix   # fix art you already have
node tools/prompt.js --list
```

Every prompt carries the same style block — that's what keeps a hundred
renders looking like one game. Full reference in `PROMPTS.md`.

## Setup (once)

```bash
cd tools && npm install
```

## The rules that still matter

1. **Transparent background.** If your generator can output transparency,
   turn it on — it saves a cleanup step on every file.
2. **One front view per file.** No turnaround sheets. Side and back views
   aren't used.
3. **Bodies are bald with blank faces.** Hair and features layer on top.
4. **One item per file** for everything that isn't a body.
5. **Keep one style** — same lighting, same rendering, same proportions.
   This is the one thing no script can fix.

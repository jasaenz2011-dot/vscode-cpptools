# 🪞 Be Me — avatar creator art workspace

## Draw at any size. The tools handle the rest.

You never have to match a pixel dimension, line anything up, or resize
anything by hand. Draw each piece however you like — any canvas size, any
crop, any amount of empty space around it — save it as a transparent PNG
with any filename, and drop it in the matching `incoming/` folder.

Then run one command:

```bash
node tools/normalize.js
```

It trims the empty space, scales each piece to the right size, positions it
on the shared canvas, numbers it the way the game expects, and writes it
into `assets/`. Your filename becomes the label players see, so
`blue hoodie.png` shows up in the game as "Blue Hoodie".

**Never edit `assets/` by hand** — it's generated. Edit the art in
`incoming/` and re-run the command.

## Different ages, same artwork

Every size in this system is a **percentage of the character**, never a
pixel measurement. So you can re-render the exact same art at different
proportions:

```bash
node tools/normalize.js --body adult
node tools/normalize.js --body teen
node tools/normalize.js --body kid
```

Younger body types get proportionally bigger heads and shorter bodies —
which is what actually makes a character read as a child. Because hair,
hats, eyes and glasses are all sized relative to the head, they resize
themselves to match. You draw one hat; it fits every age.

Proportions live in `tools/proportions.json`. If a kid's head should be
bigger still, change one number there and re-run — every piece of art
follows automatically.

## Seeing your work

```bash
node tools/preview.js                      # stack a full avatar
node tools/preview.js --guides             # show the skeleton lines
node tools/preview.js --pick hair/front=3  # try a specific option
node tools/preview.js --body kid --guides  # check the kid proportions
```

This writes `preview.png` so you can check proportions without opening the
game.

```bash
node tools/progress.js                     # what's done, what's left
```

## Making new art that matches

Don't guess at wording — have the prompt written for you:

```bash
node tools/prompt.js hair/front "curly afro"
node tools/prompt.js clothes/tops "denim jacket" --fix   # to fix art you already have
node tools/prompt.js --list                              # all categories
```

Paste the result into GameLab's Sprites tab or any AI image generator. Every
prompt carries the same style block, which is what keeps a hundred separate
images looking like one game. See `PROMPTS.md` for the full reference.

## Setup (once)

```bash
cd tools && npm install
```

## What to draw

Each folder in `incoming/` has a `README.txt` saying what belongs there and
how many to aim for. The full set is ~109 files; a playable starter is
much smaller.

**Fastest path to a testable avatar:** body → 2 hairstyles (a back and
front half each) → eyes → mouths → 2 tops → 1 bottom → 1 background.
That's one complete stack. Everything after that is adding options.

## The few rules that still matter

1. **Transparent PNG.** Backgrounds are the exception — those can be opaque.
2. **One item per file.** Just the hat, just the eyes. Not a whole
   character (except in `body/`).
3. **Hair comes in two halves** — the part behind the head and the part in
   front of the face. Give both files the **same filename** so they pair up.
4. **Draw tintable things in grayscale** — skin, hair, eyes, most clothes.
   White-to-gray shading. The game colors them, so one file covers every
   color.
5. **Keep one art style** — same outline weight, same shading approach
   across everything. This is the one thing no script can fix for you.

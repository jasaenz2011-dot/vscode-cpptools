# Be Me — art delivery spec

Everything the code needs from the art side. Written against the ten supplied
sheets (kept in `public/assets/reference/supplied-*`).

---

## 1. Transparency — status

Verified by rendering each sheet's alpha channel and looking at it, not by
sampling statistics. (An earlier pass of mine called some of these "backdrop
painted in" on the strength of an opaque-pixel ratio — that was wrong. A
densely packed sheet reads mostly-opaque simply because it is full of artwork.)

**Clean — real alpha, tight cutouts, nothing to do:**

| Sheet | Format | Size |
| --- | --- | --- |
| combined master sheet (shorts / tees / dresses / hair / eyes / glasses / shoes) | PNG | 1536 × 1024 |
| shoes | PNG | 1536 × 1024 |
| tees-graphic | PNG | 1536 × 1024 |
| eyes-boy | PNG | 1536 × 1024 |
| eyes-girl | PNG | 1536 × 1024 |
| mouths | PNG | 1536 × 1024 |
| hair-girl | PNG | 1536 × 1024 |
| hair-boy | PNG | 1536 × 1024 |

**No alpha channel — JPEG with the checkerboard painted into the pixels:**

- tops (NINJA / DRAGON / SLAM / MECH …)
- bottoms (10 shorts)
- tees-white (GOKU / WWE / HEROIC …)

These three look superseded by the combined master sheet, which carries shorts,
tees, hoodies and dresses with correct alpha. Only re-export them if they hold
designs the combined sheet does not.

**Transfer-damaged — arrived at 440 × 293 JPEG, flattened onto black:**
a batch of five (eyes, heads-with-glasses, hair-boy, mouths, hair-girl). The
same files had already come through clean at full size, so this was the upload
re-encoding them, not the export. Resend as PNG only if they contain something
the combined sheet does not.

## 2. Canvas — the one rule that matters

`MASTER_CANVAS = 1024 × 1536` (set in `src/config/canvas.ts`; change those two
numbers if you re-cut the masters and nothing else needs touching).

**Every interchangeable PNG must be exported on that full canvas, with the item
sitting where it belongs on the character, everything else transparent.**

Not cropped to the item. Not centred per item. Not trimmed. The engine draws
every layer into the identical box at the identical origin and does nothing
else — no scaling, no fitting, no nudging. Two layers aligned in Photoshop are
aligned on screen; anything else is a guess the code would have to invent.

Measured off the current masters, so you can position against them:

| | BOY | GIRL |
| --- | --- | --- |
| figure bbox | x 139–883, y 1–1521 | x 142–859, y 4–1525 |
| centre X | 511 | 501 |
| ground Y (sole line) | 1521 | 1525 |
| face skin bbox | x 320–698, y 94–419 | x 336–656, y 110–396 |
| face centre | 509, 257 | 496, 253 |
| top of hair | **y = 1** | **y = 4** |

---

## 3. Headroom — the masters are flush to the top

Boy's hair starts at y=1, girl's at y=4. There is no room above the head.

The tall styles on the boy hair sheet — high-top afro, spiky, raised dreads,
afro puffs — will be clipped off the top of the canvas.

→ Either drop the character lower on the canvas to leave headroom, or make the
canvas taller. Whichever you pick, both masters need to move together and all
layers re-export against the new position.

---

## 4. Masters need to be bald

The girl master has curly pigtails with white bows baked in; the boy has a
cropped cut. Compositing only ever *adds* pixels — a hair layer cannot erase
what is underneath, so any alternate style paints on top of the existing hair
and both show.

→ Deliver both masters with the scalp bare. The faceless head already on your
hair sheets is exactly the base needed.

---

## 5. Per-sheet notes

**Eyes (boy + girl), mouths** — closest to usable. Right render style, real
alpha. Each item carries a soft feathered skin patch around it; on the masters'
skin that will show as a halo unless the tone matches exactly or the feather is
trimmed back to the feature. Then just needs §2 placement.

**Hair (boy + girl)** — needs §4 (bald masters) and §2 (canvas placement). On
the girl sheet the four heads are drawn at four different sizes and positions
(skin widths 271 / 415 / 352 / 307 px), so each style needs re-registering to
one head.

**Tops, bottoms, tees-white, tees-graphic** — these are flat-lay product
renders: photographed straight-on, no armholes wrapping the arms, not the
standing figure's projection. They cannot be composited onto the body at any
position. They work as a style catalogue; to become layers they need to be
rendered *on the character*.

**Shoes** — side-view pairs with socks and ankles attached, on glow backdrops.
Needs the socks separated (or made their own layer) and the pair placed at the
avatar's feet against ground Y above.

---

## 6. Trademarks

The supplied art carries Nike swoosh / JUST DO IT, Jordan Jumpman, Ferrari,
the Louis Vuitton monogram, Spider-Man, Naruto, Dragon Ball, WWE and
PlayStation controllers. Flagging once as a licensing question for a shipping
kids' product — your call, not a blocker for the build.

---

## Adding an asset once it's on-canvas

1. Drop the PNG in the directory the manifest names.
2. Add or flip `enabled` on its entry in `public/assets/manifest.json`.

No code change, no rebuild. The manifest is fetched at runtime.

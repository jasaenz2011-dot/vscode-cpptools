# Supplied catalog art — staging

123 items sliced from the nine supplied contact sheets. The originals are kept
verbatim in `../reference/supplied-*`.

| Folder | Items | Source | Alpha |
| --- | --- | --- | --- |
| `shoes/` | 20 | shoes sheet | real |
| `tees-graphic/` | 20 | graphic tees sheet | real |
| `tops/` | 20 | tops sheet | **keyed from a painted checkerboard** |
| `bottoms/` | 10 | shorts sheet | **keyed from a painted checkerboard** |
| `tees-white/` | 20 | white tees sheet | **keyed from a painted checkerboard** |
| `eyes-boy/` | 9 pairs | boy eyes sheet | real |
| `eyes-girl/` | 10 pairs | girl eyes sheet | real |
| `mouths/` | 10 | mouths sheet (BOY-01…05, GIRL-01…05) | real |
| `hair-girl/` | 4 | girl hair sheet | real |

Regenerate with `node tools/slice-catalog.mjs` and `node tools/slice-face-catalog.mjs`.

---

## These are NOT avatar layer assets, and are not wired into the compositor

Three findings, each measured rather than assumed. All three are art-side fixes;
none can be corrected in code without breaking the master canvas contract.

### 1. The masters have hair baked in

The girl master wears curly pigtails with white bows; the boy master has a
cropped cut. Compositing is additive — a layer can add pixels, never remove
them — so dropping `hair-girl/wavy-butterfly` onto the girl master paints long
wavy hair **on top of the existing pigtails**. Both would be visible.

**Needed:** masters delivered bald, with the scalp bare. The hair sheet's own
faceless head is exactly that base, so it already exists on the art side.

### 2. The sheets have no shared origin

Every sheet is a presentation layout: each item is placed and scaled for the
contact sheet, not authored on a common canvas. Measured on the hair sheet, the
four heads differ in both size and position:

| Quadrant | Skin bbox width | Position |
| --- | --- | --- |
| top-left | 271 px | x 300–570 |
| top-right | 415 px | x 91–505 |
| bottom-left | 352 px | x 272–623 |
| bottom-right | 307 px | x 91–397 |

The master canvas contract requires every interchangeable PNG to be authored at
identical canvas dimensions and identical origin. Making these line up would
mean per-item scaling and centring — precisely the "smart fit" the brief
forbids, and it would bake a guessed position into every file.

**Needed:** each item exported on the full 1024 × 1536 master canvas, positioned
where it belongs on the character, with the surrounding area transparent.
No cropping to the item's bounding box.

### 3. The wardrobe sheets are flat-lay product renders

The tops and bottoms are photographed flat, straight-on; the shoes are side-view
pairs **with socks and ankles attached**. The avatar is a front-facing standing
figure. A flat-lay shirt has no armholes wrapping the character's arms and does
not share its projection, so it cannot be composited onto the body at any
position.

The face and hair sheets do **not** have this problem — they are rendered in the
same Cinematic 3D style as the masters and are the closest to usable. They need
only fix 1 and fix 2.

Separately, three of the five wardrobe sheets (`tops`, `bottoms`, `tees-white`)
arrived as **JPEGs with the transparency checkerboard painted into the pixels**
rather than a real alpha channel. That alpha was reconstructed here by detecting
the checkerboard's 10 px period and flood-filling from the borders, which is why
some backdrop remains (`tees-white` averages 25% transparent against ~49% for
the sheets that shipped real alpha). Reconstruction only ever removes pixels —
nothing is repainted — but it is guesswork standing in for data that was thrown
away.

**Needed:** re-export these three as PNGs with a real alpha channel.

---

## Trademarks

The supplied art contains third-party marks and characters: Nike swoosh and
"JUST DO IT", Jordan Jumpman, Ferrari, the Louis Vuitton monogram, Spider-Man,
Naruto, Dragon Ball, WWE, and PlayStation controllers. That is a licensing
question for a shipping children's product, and it is the client's call — noted
here so it is not discovered late.

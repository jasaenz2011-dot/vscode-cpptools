# BE ME — v0.1

**BUILD YOUR IDENTITY.**
**BE YOU. BE BOLD. BE ME!**

A working local prototype of the Be Me modular avatar creator. This is the engine
and the UI architecture, built so that professionally prepared artwork drops in
and displays at exactly the scale and position it was authored at.

The screen follows the supplied Be Me UI reference: numbered sections
**01 Art Style · 02 Customize Everything · 03 Live Preview · 04 Your Creations**
around a central holographic orb stage, over a suite navigation bar.

> **Naming note.** One of the supplied UI references is titled *AVATAR MAKER*.
> The written brief says the application must say **BE ME**, not Avatar Maker, so
> the BE ME branding is what ships. Everything else in that reference — layout,
> style tiles, orb stage, gold framing, section numbering, bottom nav — is
> implemented. **This is the one open question in the build:** if the reference
> title is the intended product name rather than a working label, say so and it
> is a one-line change.

Three references were supplied in sequence. The third specifies the chrome, and
the build follows it:

- **Notched gold bezels** (`.bezel` / `.bezel-in` in `globals.css`, wrapped by
  `src/ui/Bezel.tsx`) — a gradient metal plate around an inset dark panel, with
  octagonal `clip-path` corner cuts, framing panels 01–04.
- **Rounded-rectangle style tiles**, not hexagons. An earlier pass built these
  as hex tiles from reference #2; reference #3 shows rounded rects, and they
  were corrected. The hex silhouette is retained only where the reference uses
  it: the **360°** badge beside the orb.
- **Paging chevrons** either side of the style grid (6 per page).
- **A mechanical projector platform** under the avatar: stacked machined decks,
  concentric light rings, and a tapered projection cone rising into the stage.
- **A rig readout** at the foot of panel 03 — base, view, master canvas, live
  layer count, anchor calibration state, off-canvas asset count. Every row is
  read from the running compositor; none of it is decorative. It is dropped
  below 1536px wide rather than being clipped by the frame.

---

## Launch

```bash
cd be-me-v01
npm install
npm run dev
```

Then open **http://localhost:5173**.

| Command | What it does |
| --- | --- |
| `npm run dev` | Local dev server with hot reload |
| `npm run build` | Typecheck + production build to `dist/` |
| `npm run preview` | Serve the production build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run assets` | Regenerate the asset tree + manifest |

Stack: **React 19 · TypeScript · Vite 8 · Tailwind CSS 4 · Zustand**. No backend.
Fonts are self-hosted in `public/fonts/`, so the app runs with no network access.

---

## THE MOST IMPORTANT PART: the master canvas contract

**ART CONTROLS THE CODE.**

Every interchangeable PNG for an art style is authored on one master canvas.
The engine renders every layer into the same box at the same origin, and does
nothing else.

It does **not**:

- resize a layer to its visible bounding box
- crop transparent padding
- "smart fit" hair, clothing or eyes
- independently centre a layer

The entire engine is one style block in
[`src/engine/LayerImage.tsx`](src/engine/LayerImage.tsx):

```
position: absolute; inset: 0; width: 100%; height: 100%; object-fit: fill;
```

Because every layer gets the identical box, the only transform in play is the
single uniform scale that maps the whole master canvas onto the stage — and all
layers share it. Two PNGs aligned in Photoshop are aligned on screen.

If a delivered asset is **not** on the master canvas, the stage shows an
`OFF-CANVAS ASSET · NOT CORRECTED` warning naming the file and both sizes. It
does not silently re-fit the artwork, because that would be the code overriding
the art.

### Master canvas configuration

**`src/config/canvas.ts`** — the single source of truth.

```ts
export const MASTER_CANVAS = { width: 1024, height: 1536 };
```

> **Note — this differs from the brief.** The brief specified 2048 × 2048 as a
> placeholder. The delivered Cinematic 3D Boy and Girl masters are both
> **1024 × 1536** transparent PNGs, identically framed. The art is the authority,
> so the config follows the art. Change these two numbers if the masters are
> re-delivered at a different size — nothing else needs to change.

The same file declares `AvatarAnchors` (`centerX`, `groundY`, `eyeLeftAnchor`,
`eyeRightAnchor`, `hairAnchor`, `topAnchor`, `bottomAnchor`, `shoeAnchor`).
**They are all `null` on purpose.** Nothing in the v0.1 render path reads them —
exact canvas alignment needs no anchors. They exist so later features have a
defined home, and they must be *measured from the master PSD*, not guessed.

---

## Where the master artwork lives

| Asset | Path |
| --- | --- |
| **Boy master** | `public/assets/cinematic3d/boy/base/master.png` ✅ installed |
| **Girl master** | `public/assets/cinematic3d/girl/base/master.png` ✅ installed |

Both supplied masters are installed and rendering. They are used exactly as
delivered — not redrawn, not reinterpreted, not resized.

If a master is ever absent, the stage displays **MASTER AVATAR ASSET REQUIRED**
with the exact path to drop the file at, and substitutes nothing.

---

## Asset manifest

**`public/assets/manifest.json`** — 94 entries. It lives beside the artwork, and
the Customize panel is generated entirely from it. No customisation option is
hard-coded in any component.

```jsonc
{
  "id": "hair_003",
  "name": "Curl Top",
  "style": "cinematic3d",
  "bodyBase": "boy",
  "category": "hair",
  "files": { "front": "/assets/cinematic3d/boy/hair/hair_003.png" },
  "enabled": true
}
```

### Adding an asset

1. Drop the PNG into the directory the manifest names.
2. Add (or flip `enabled` on) its manifest entry.

That is all. No UI code changes, no rebuild — the manifest is fetched at runtime.

### Directory structure

```
public/assets/
  manifest.json
  cinematic3d/ | watercolor/ | photorealistic/ | animebattle/ | storybook3d/ | comichero/
    boy/  base/ skin/ eyes/ eyebrows/ hair/ tops/ bottoms/ shoes/ accessories/ extras/
    girl/ base/ skin/ eyes/ eyebrows/ hair/ tops/ bottoms/ shoes/ accessories/ extras/
  reference/            <- supplied reference imagery, not production assets
```

### Genesis style catalog

Numbering follows the supplied reference — 01 Watercolor, **02 Cinematic 3D**,
04 Photorealistic, 09 Anime Battle, 13 Storybook 3D, 19 Comic Hero. The gaps in
the numbering are intentional: only the styles the client has named are
declared, and no styles were invented to fill them.

All six trees exist on disk. Enabling a style is `enabled: true` in
`src/data/styles.ts` plus its artwork.

---

## Layer stack

Bottom to top, defined once in `src/config/layers.ts`:

```
base → skin → bottom → top → shoes → eyes → eyebrows → hair → accessories → extras
```

Re-ordering the stack is a one-line change to that array.

The supplied masters are deliberately **faceless** — eyes and eyebrows are
interchangeable overlays, which is exactly what this stack expects.

---

## What is functional right now

- **Cinematic 3D** art style, fully operational
- **Boy / Girl** switching — swaps the master avatar, verified against both files
- **Live layer compositing** on the master canvas contract (verified by
  `tools/interact.mjs`: across 3 simultaneous stages, every layer of a 10-layer
  stack occupies an identical box to the pixel)
- **All 9 customise categories** — Skin, Hair, Eyes, Eyebrows, Tops, Bottoms,
  Shoes, Accessories, Extras — generated from the manifest, shown as stacked
  labelled rows with a category rail, as in the reference
- **Instant updates** on selection, no reload; gold/cyan active states
- **Reset**, **Randomize** (enabled assets only), **New Avatar**
- **Save / Load / Delete** avatars to `localStorage`, persisting across reloads.
  Panel 04 renders each saved slot through the real compositor, so a thumbnail
  is the actual avatar rather than a stored screenshot
- **FRONT** view, plus a live-preview turnaround strip in panel 03
- **Off-canvas asset detection** with a visible, non-destructive warning
- **MASTER AVATAR ASSET REQUIRED** failure state
- Self-hosted typography, `prefers-reduced-motion` support, 1920×1080-first
  layout that scales down to 1440×900 with no overflow

## What is placeholder

- **All non-base artwork.** 92 of 94 manifest entries point at PNGs that do not
  exist yet. Each renders as an explicitly labelled **EMPTY SLOT** chip whose
  tooltip gives the exact path to drop the file at. **Nothing has been invented
  to fill them.**
- **Watercolor, Photorealistic, Anime Battle, Storybook 3D, Comic Hero** —
  present in the data model, shown as locked tiles, not selectable. A locked
  tile shows a padlock, never another style's character.
- **EXPLORE ALL GENESIS STYLES**, the top-right shelf icons (Premium / Codex /
  Settings) and the bottom-nav destinations other than AVATAR are declared and
  visibly disabled. **LAUNCH AVATAR** reports that its destination is v0.2
  rather than pretending to navigate.
- **LEFT / BACK / RIGHT views** — architecturally supported; each states the
  artwork it needs. In the panel-03 turnaround strip the other angles are empty
  bays, **not** the front artwork mirrored or skewed.
- **360** — deliberately not implemented. A real turntable needs a rendered image
  sequence; this will not be faked by spinning the flat front PNG, and the
  control says so.

---

## Supplied artwork handling

| File supplied | What was done |
| --- | --- |
| Cinematic 3D Boy master | Installed verbatim at `boy/base/master.png` |
| Cinematic 3D Girl master | Installed verbatim at `girl/base/master.png` |
| Be ME! logo (phone screenshot) | Cropped out of the screenshot chrome and white page keyed to transparency by `tools/prepare-supplied-art.mjs`. Pixels were removed, never repainted. Used as the header brand mark. |
| Be Me UI references (×3) | `public/assets/reference/` — visual targets. The third, `be-me-ui-reference-03-chrome.png`, specifies the frame/chrome system and is the one the current build follows. |
| Two K–8 character contact sheets | `public/assets/reference/` — reference only. They are contact sheets of many separate characters, not modular bases, so they were **not** sliced into avatar assets. |

---

## Known limitations

1. **Anchors are uncalibrated.** `AvatarAnchors` is all `null` until measured
   from the master PSD. Nothing needs them yet, but procedural features later
   will.
2. **Thumbnails render the full master canvas.** An option chip shows the whole
   PNG scaled into a square, so a hair asset will appear small in its chip. A
   proper fix is a per-asset thumbnail crop rectangle in the manifest — that is a
   manifest field, not a code assumption, and is deliberately not guessed here.
3. **`object-fit: fill` distorts a wrongly sized asset.** This is intentional: it
   makes a canvas violation visible instead of hiding it. The warning banner
   names the offending file.
4. **No export yet.** Saving stores the configuration, not a rendered PNG.
5. Layer opacity cross-fades on swap (220 ms). There is no skeletal animation.

---

## Project map

```
be-me-v01/
├── public/
│   ├── assets/          manifest.json + all art directories + reference/
│   ├── brand/           Be ME! logo, prepared from the supplied screenshot
│   └── fonts/           self-hosted Chakra Petch + Inter
├── src/
│   ├── ui/              TopBar, StylePanel(01), OrbStage, CustomizePanel(02),
│   │                    PreviewPanel(03), CreationsPanel(04), BottomNav
│   ├── config/
│   │   ├── canvas.ts    MASTER CANVAS CONTRACT + anchor metadata
│   │   └── layers.ts    layer stack order + categories
│   ├── data/
│   │   ├── styles.ts    art styles, body bases, views
│   │   └── types.ts     manifest + asset types
│   ├── engine/
│   │   ├── manifest.ts  load + index the manifest
│   │   ├── LayerImage.tsx   ONE LAYER — the whole engine
│   │   └── AvatarStage.tsx  the layer stack + failure states
│   ├── state/store.ts   avatar config, save/load, persistence
│   └── styles/globals.css   the black/gold/cyan visual system
└── tools/
    ├── prepare-supplied-art.mjs   logo crop + key, reference copy
    ├── fetch-fonts.mjs            self-host the typefaces
    ├── generate-manifest.mjs      build the asset tree + manifest
    ├── shoot.mjs                  screenshot capture
    └── interact.mjs               10-check interaction suite
```

## Verification

```
npm run build        typecheck + production build, clean
node tools/interact.mjs
```

The interaction suite covers: selection updates, randomize, save, reset, load
from panel 04, both masters, **the master-canvas contract asserted separately for
every stage on screen** (orb, preview strip and saved slots — each must align its
own layers to the pixel), that locked style tiles borrow no artwork, persistence
across reload, and new-avatar. All eleven pass with a clean browser console and
no failed network requests.

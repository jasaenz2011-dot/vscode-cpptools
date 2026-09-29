# Be ME! — Build Your Identity

An avatar creator studio for students from Kindergarten through 8th grade, themed as
**"Be ME! Under Construction / The Maker's Workshop"** — heavy industrial construction
meets vibrant maker-space creativity.

Students build a character, watch it grow across nine grade levels, and stamp their own
**Be ME! Badge** — a printable student ID carrying their name, grade, core trait and
school branding.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint     # eslint (flat config, next/core-web-vitals + next/typescript)
npm run typecheck
```

## Stack

Next.js 16 (App Router) · React 19 · TypeScript 6 (strict, `noUncheckedIndexedAccess`) ·
Tailwind CSS v4 · Zustand 5. No UI kit, no icon package, no runtime asset files — every
piece of art in the app is hand-authored SVG rendered from TypeScript.

## Architecture

### The Grade Growth Engine — `src/lib/rig.ts`

`buildRig(grade)` turns a grade (0–8, fractional allowed) into a skeleton of **anchors**.
The whole design rests on one rule:

> Every anchor is a **uniform** scale + rotation + translation, and every asset space has a
> **fixed aspect ratio**.

That means a single CSS `transform` fully describes an anchor. Growing from Kindergarten to
8th grade is therefore a pure compositor animation: React renders once when the config
changes, and the browser interpolates all ~20 anchors together on its own timeline. No
per-frame React renders, no path morphing, and — because assets are *children* of the
anchors they belong to — no layer drift.

Growth is not just "scale everything up". Head-to-body ratio goes 4.7 → 6.7, legs go from
44% to 50.5% of height, posture shifts from a slight forward lean to upright, and the head
tilt straightens out. Little kids are top-heavy; eighth graders are not.

### The Layer Compositor — `src/components/stage/AvatarFigure.tsx`

One SVG scene graph, `viewBox="0 0 360 480"`. Assets are authored in canonical spaces and
placed by the anchor that owns them:

| Space   | Box        | Origin                | Used by                        |
| ------- | ---------- | --------------------- | ------------------------------ |
| `head`  | 100 × 100  | centre of the skull   | hair, hats, expressions, specs |
| `torso` | 100 × 125  | the neck notch        | tops                           |
| `hips`  | 100 × 100  | hip centre            | bottoms                        |
| `feet`  | 100 × 40   | between the ankles    | footwear                       |
| `hand`  | 40 × 40    | the fist              | handheld tools                 |
| `chest` | 100 × 100  | the sternum           | badges                         |
| `canvas`| 360 × 480  | stage origin          | backgrounds                    |

Two structural details keep clothing honest:

- **Limb pieces.** A top supplies a sleeve and a bottom supplies a trouser leg that are
  rendered *inside* each limb group, so they inherit the joint's exact rotation and can
  never slide off the limb they dress.
- **Back pieces.** Long hair supplies a `BackAsset` drawn behind the whole body, so it
  falls behind the shoulders instead of over them.

Draw order matters and is deliberate: legs → shoes → torso skin → bottoms → tops → arms
(with sleeves) → badge → **neck** → head → expression → hair → headwear → eyewear → tool →
grip. The neck draws *after* the garments so it fills the collar opening rather than hiding
behind it.

### State — `src/lib/store.ts`

A Zustand store where `present` is the single serialisable `AvatarConfig` — grade, skin
tone, one item id per slot, hex overrides per slot/channel, and identity metadata. `past`
and `future` give undo/redo.

Edits that belong to one gesture (dragging the grade slider, scrubbing a colour, typing a
name) coalesce into a single history entry via a commit key, so an undo step maps to what
the student actually *did* rather than to every intermediate value.

Persistence uses `zustand/persist` with `skipHydration`, rehydrated in an effect after
mount — so the first client render matches the server render exactly and there is no
hydration mismatch. Imported JSON goes through `sanitizeConfig`, which validates every item
id and hex against the catalog before it can reach the renderer.

### Colour

Each item exposes up to three recolourable channels (`primary` / `secondary` / `accent`).
Assets derive their own shadows and highlights from those hexes via `shade()` / `tint()`,
so one swatch restyles a whole garment without anyone hand-authoring a five-stop palette.
`readableInk()` picks label ink at the 0.21 luminance crossover, where WCAG contrast
against near-black and against white are equal.

### Export — `src/lib/export.ts`

- **Badge PNG** (960 × 1860, 3×). The card is drawn with the Canvas 2D API so text stays
  crisp and uses the studio's real webfonts; the avatar is rasterised from the *live* stage
  SVG, so a download is exactly what the student was looking at.
- **Avatar PNG** (1080 × 1440).
- **JSON config**, re-importable through the same validation path.

### Audio — `src/lib/audio.ts`

Every sound is synthesised with WebAudio — gear ratchet on the grade slider, clicky
toolbelt swaps, a stamp thud on export. No audio files ship, and nothing plays until the
student turns sound on.

## The catalog

`src/lib/catalog/` — 10 hairstyles, 8 headgear, 8 tops, 6 bottoms, 5 footwear, 6 eyewear,
6 chest badges, 7 handheld tools, 8 expressions, 5 backgrounds, 10 core traits, 9 skin
tones. Adding an item means adding one entry with an `Asset` component and its anchor
space; the trays, thumbnails, colour pickers and export all pick it up automatically.

## Accessibility

Skip links past the ~100 tray controls, a proper ARIA tablist with roving tabindex and
arrow-key navigation, a real `<input type="range">` under the custom grade slider (so it is
keyboard- and screen-reader-operable), distinct accessible names on every per-tray "None"
chip, visible focus rings, and full `prefers-reduced-motion` support — with reduced motion
on, the page runs zero animations.

## Verified

- `tsc --noEmit` and `eslint .` clean; production build clean.
- Zero console errors or warnings in development or production.
- 60fps with no dropped frames: 16.7 ms median and p95 across the K→8 growth transition,
  rapid slider scrubbing, category switching and colour scrubbing.
- No horizontal overflow at 360, 390, 768, 834, 1180, 1440 or 1920 px wide.

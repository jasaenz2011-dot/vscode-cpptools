# Be Me — Ambient FX delivery contract

Settled before production so nothing gets rendered twice.

---

## THE ONE DECISION THAT CHANGES EVERYTHING

**Deliver luminous FX on pure black with NO alpha channel. Composite with
`mix-blend-mode: screen`.**

Under screen blending, black is mathematically invisible — `screen(base, 0) =
base`. A glow plate on black composites exactly like a plate with alpha, with
none of the cost:

| | Black plate + screen | Alpha video |
| --- | --- | --- |
| Codec | **H.264** — universal, hardware decoded | VP9-alpha (no Safari) + HEVC-alpha (Safari only) |
| Exports per asset | **1** | 2, and they must be kept in sync |
| iOS Safari | works | needs the HEVC path |
| Decode | GPU | GPU, but two codec paths to test |

This is what your Gemini workflow already produces natively — locked camera,
effect on pure black. **Do not composite it onto transparency in After Effects.
Deliver the black plate.**

**The one limit:** screen can only ADD light, never darken or occlude. Every
effect on the list below is light, so this holds. The moment we want a real
shadow, an occluding element, or anything that darkens what's behind it, that
asset needs alpha and the dual-encode path — flag it and we'll handle it as the
exception it is.

---

## Answers

**1. Is 5s / 30fps / 150 frames right?**
Yes. Ship it as the standard. 30fps is correct — these effects are low-frequency
and heavily blurred, so the extra 30 frames of 60fps buy nothing visible and cost
~40% more bitrate. 5s is the right side of the loop-detection threshold (under
~4s the eye starts catching the seam).

**2. Same duration, or 2.5 / 5 / 10?**
All **exactly 5.000s**. Do not mix durations. Because I'm consolidating multiple
effects into a single video file (see Q7/Q8), effects sharing a file *must* share
its duration — that's forced, not preference.

Get the variety from **frequency, not duration**. Every internal motion must
complete a whole number of cycles in 5.0s, and pick **coprime cycle counts** so
the combined pattern doesn't visibly re-sync inside the loop:

| Effect | Cycles per 5s |
| --- | --- |
| dais rotation | 1 |
| orb energy | 2 |
| beam pulse | 3 |
| ambient shimmer | 5 |
| rim LED chase | 7 |
| particle drift | 1 (full traverse, wrap seamless) |

1/2/3/5/7 share no common factor above 1, so nothing lines up until the loop
point — which is exactly where you want it to line up.

**3. Runtime format**
**H.264 MP4, yuv420p, no alpha.** Universal, hardware decoded on every target.
I'll also emit VP9 WebM as an optional smaller sibling and let the browser pick
via `<source>`; that's my transcode job, not yours.

Not animated WebP (no hardware decode, balloons at this resolution), not animated
AVIF (CPU-heavy decode, uneven support), not APNG (enormous), not PNG sequence at
runtime (hundreds of requests).

**Sprite sheets** for short one-shots only — see Q15.

**4. Compatibility target and fallback**
No browserslist is declared, so Vite 8's baseline applies. Practical target for a
kids' product: **Chrome/Edge 111+, Safari 16.4+, Firefox 121+, iPadOS 16.4+,
ChromeOS**. Those all support H.264, `mix-blend-mode`, and `plus-lighter`.

Fallback chain, in order:
1. `plus-lighter` blend (true additive, best-looking)
2. `screen` blend (universal)
3. **Poster PNG** — static frame, no video. Used for reduced-motion, iOS Low
   Power Mode (which blocks autoplay outright), save-data, and decode failure.

**5. Archival master**
**ProRes 4444 at authoring resolution, 30fps** — plus the `.aep`. ProRes 4444
carries alpha if a future asset needs it, is visually lossless, and re-encodes
cleanly. Keep a PNG sequence only for anything you'd want to re-time later.
Never archive the H.264; that's a derivative.

**6. What to deliver for luminous effects**
**The black-background plate. Just that.** No alpha composite, no separate luma
matte, no colour+matte pair. Screen blending makes all of those redundant work.

Two rules on the plate:
- **True black background** — 0,0,0. Lift the blacks and you get a glowing
  rectangle where the video element sits.
- **Nothing may touch the frame edge** unless it should bleed off-screen; screen
  blending has no soft edge of its own.

**7. Modular delivery?**
**Author modular, deliver consolidated.** Keep `dais-energy`, `dais-particles`,
`rim-LEDs` as separate AE comps so you can retime any one — then render them
**pre-combined into the two runtime files** in Q8.

Reason: iOS Safari throttles simultaneous video decoders hard. Six video elements
is a stutter on an iPad; two is comfortable everywhere.

Static art stays separate as before: `dais-base.png` never becomes video.

**8. Layer order — corrected**
Your order is close, but the dais energy must sit *above* `dais-base`, and
everything additive can share one pass. Final stack:

```
z0    page background                    CSS
z10   dais-base.png                      static PNG
z15   orb-back.png                       static PNG
z20   FX-BACK.mp4          screen        dais energy + rim LEDs + beam
                                         + orb-back energy + rear particles
z50   AVATAR STACK                       the 1024x1536 master canvas
z70   orb-front.png                      static PNG, low opacity
z80   FX-FRONT.mp4         screen        orb-front refraction + front particles
z90   UI chrome                          CSS / PNG
```

Because the FX pass is purely additive, putting it above *all* the static back
art is free — light falling on the dais is exactly the look we want. The avatar
sits between the two passes, so it composites **inside** the orb.

Container needs `isolation: isolate` or the blend leaks onto the page ground —
my job, noting it so the look you approve is the look that ships.

**9. Should orb-back / orb-front be static or animated?**
**Static PNGs.** The glass, rim light and specular are form, not motion — bake
them. All orb movement lives in the FX passes. This keeps the two most
resolution-critical elements at full sharpness while the soft glow rides at lower
video resolution, which is the whole point of splitting them.

**10. Dimensions — and video breaks the 2× rule**

For **static art the 2× rule stands** — crisp edges need the device pixels.

For **video it does not.** Decode cost and memory scale with pixel count, and
these plates are heavily blurred, so they survive upscaling almost invisibly.
Delivering 2× video would roughly quadruple decode load to protect detail that
does not exist in the source.

**Author at 2×, deliver at 1× CSS pixels.** Same habit, different endpoint — I
downscale in the transcode.

| Asset | Author (AE) | Runtime |
| --- | --- | --- |
| FX-BACK | 1792 × 2048 | **896 × 1024** |
| FX-FRONT | 1792 × 2048 | **896 × 1024** |
| dais-base.png | 1600 × 700 | 800 × 350 |
| orb-back / orb-front .png | 1400 × 1400 | 700 × 700 |

Both FX passes are the **same dimensions and same origin** so they align with
zero offset math — the master canvas rule, applied to motion.

All runtime dimensions are multiples of 16 for H.264 macroblock alignment.

**11. Simultaneous start or phased?**
**Both FX passes start together at t=0.** They're one coherent scene; offsetting
them would break the beam-to-orb relationship. The de-syncing happens *inside*
the loop via the coprime frequencies in Q2.

Repeated UI elements (LED chase across several panels) are CSS, and I stagger
those with `animation-delay`.

**12. prefers-reduced-motion**
**Yes — non-negotiable for a children's product**, and already wired at
`globals.css:497`.

Reduced-motion swaps every video for its **poster PNG**. So each FX file needs a
poster:

| Video | Poster |
| --- | --- |
| FX-BACK.mp4 | `fx-back-poster.png` |
| FX-FRONT.mp4 | `fx-front-poster.png` |

Pick the **fullest, most luminous frame**, not frame 0 — a poster caught at a
pulse trough looks broken. Export it as the same black plate; I composite it with
the identical screen blend, so reduced-motion is the same image, just still.

**13. Pause behaviour — all four, yes**

| Trigger | Action |
| --- | --- |
| Tab hidden | pause on `visibilitychange`, resume on return |
| Component offscreen | `IntersectionObserver`, pause below 10% visible |
| Navigated away | unmount, release the decoder |
| Constrained device | `navigator.connection.saveData`, low-power autoplay rejection, or dropped frames → fall back to poster permanently for the session |

**14. Performance budget**

| Metric | Budget |
| --- | --- |
| Simultaneous videos | **2** (hard limit — iOS decoder pressure) |
| Runtime resolution | ≤ 896 × 1024 each |
| Compressed size | ≤ 1.2 MB each, **≤ 2.5 MB total** |
| Decoded memory | ~3.7 MB/frame × ~3 buffered ≈ 11 MB per video, ~22 MB total |
| Blend-mode elements | ≤ 3 in the stage subtree |
| Total animated payload | ≤ 3 MB including posters |

If a plate won't hit 1.2 MB at acceptable quality, the fix is **less resolution,
not more bitrate** — blur hides resolution far better than it hides compression.

**15. What should NOT be video**

| Effect | Do it with | Why |
| --- | --- | --- |
| Panel rim LED chase | CSS gradient animation | Appears on 4+ panels; a video each is absurd |
| Button hover / press | CSS | Must respond instantly to input |
| Selection sparkle | **sprite sheet** + `steps()` | One-shot, fires anywhere, many at once |
| 360° badge idle | CSS transform on static PNG | Rigid rotation, no pixel change |
| Loading / progress | CSS or SVG | Trivial geometry |
| Text shimmer | CSS gradient | Must track live text |
| Panel edge glow | CSS box-shadow | Resolution-independent |
| Toast / dialog entry | CSS | Timing must be interruptible |

Rule of thumb: **video for organic, unpredictable, painterly light. Code for
anything rigid, interactive, repeated, or that must respond within a frame.**

---

## PRODUCTION TABLE

| Asset | Authoring | Runtime | Dur | FPS | Loop | BG | Runtime fmt | Master | Z |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **FX-BACK** (dais energy + rim LEDs + beam + orb-back energy + rear particles) | 1792×2048 | 896×1024 | 5.000s | 30 | seamless | pure black | H.264 MP4 (+VP9) | ProRes 4444 | 20 |
| **FX-FRONT** (orb-front refraction + front particles/highlights) | 1792×2048 | 896×1024 | 5.000s | 30 | seamless | pure black | H.264 MP4 (+VP9) | ProRes 4444 | 80 |
| fx-back-poster | 1792×2048 | 896×1024 | still | — | — | pure black | PNG-24 | PSD/PNG | 20 |
| fx-front-poster | 1792×2048 | 896×1024 | still | — | — | pure black | PNG-24 | PSD/PNG | 80 |
| dais-base | 1600×700 | 800×350 | still | — | — | **alpha** | PNG-24 | PSD | 10 |
| orb-back | 1400×1400 | 700×700 | still | — | — | **alpha** | PSD | PNG-24 | 15 |
| orb-front | 1400×1400 | 700×700 | still | — | — | **alpha** | PSD | PNG-24 | 70 |
| **selection sparkle** | 256×256/frame | 128×128 ×12 frames (1536×128 sheet) | 0.5s | 24 | one-shot | pure black | PNG or WebP sheet | PNG seq | overlay |
| **LAUNCH activation** | 1200×200 | 600×100 | 0.6s | 30 | one-shot | pure black | PNG sheet (10 fr) | PNG seq | overlay |
| **Be Me logo sting** | 960×320 | 480×160 | 1.2s | 30 | one-shot on load | pure black | H.264 MP4 | ProRes 4444 | header |
| 360° badge idle | — | uses static PNG | — | — | — | — | **CSS** | — | — |
| Panel rim LEDs | — | — | — | — | — | — | **CSS** | — | — |

**Also worth producing, high value:**

| Asset | Authoring | Runtime | Dur | Notes |
| --- | --- | --- | --- | --- |
| **Avatar materialise** | 1792×2048 | 896×1024 | 0.8s | Plays once when Boy↔Girl switches or a style loads. Sells "the machine built this." Black plate, screen. |
| **Slot fill burst** | 512×512 | 256×256 ×10 | 0.4s | Fires in the wardrobe tile when an item is chosen. Sprite sheet. |

---

## MAKE THIS IN AFTER EFFECTS / GEMINI

Priority order. Stop after 1–2 and we already have most of the win.

**1. FX-BACK.mov — 1792×2048, 5.000s, 30fps, ProRes 4444, pure black**
The whole rear light pass in one comp. Internal elements and their cycle counts:
- dais energy: concentric gold rings on the top face — **1 rotation**
- rim LEDs: cyan chase around the deck edge — **7 cycles**
- projection beam: vertical cone, orb→deck — **3 pulses**
- orb-back energy: gyroscope bands on the rear hemisphere — **2 cycles**
- rear particles: rising motes — **1 full traverse, wrap seamless**

Frame 150 must equal frame 0 exactly. Locked camera. Black at 0,0,0.

**2. FX-FRONT.mov — same size/duration/format**
Front hemisphere refraction, specular travel, a few foreground motes. **Keep this
one subtle** — it sits over the child's face. Target under 25% average luminance;
if in doubt, less.

**3. Posters** — one PNG per FX pass, fullest frame, same dimensions, black.

**4. Static PNGs** (from the earlier UI list, unchanged): `dais-base`,
`orb-back`, `orb-front` — these carry **real alpha**, unlike the FX plates.

**5. Sparkle sheet** — 12 frames, 256×256 each, laid out in one horizontal strip,
black background, one-shot (no loop needed).

**6. Logo sting** — 1.2s, plays once on load.

**Deliver ProRes 4444 masters only. I run the transcode**, so you never touch a
web codec:

```
# H.264 runtime
ffmpeg -i FX-BACK.mov -vf scale=896:1024:flags=lanczos \
  -c:v libx264 -profile:v main -pix_fmt yuv420p -crf 23 \
  -g 150 -keyint_min 150 -an -movflags +faststart fx-back.mp4

# VP9 sibling
ffmpeg -i FX-BACK.mov -vf scale=896:1024:flags=lanczos \
  -c:v libvpx-vp9 -crf 32 -b:v 0 -g 150 -an fx-back.webm
```

`-g 150` puts a keyframe exactly at the loop point so the seam never softens.

---

## CLAUDE — HANDLE THIS IN CODE

Mine. Not starting until the art contract is signed off.

**Playback**
- `<video muted loop playsinline autoplay preload="metadata">` — all four
  attributes required or iOS refuses to autoplay
- `<source>` VP9 then H.264; browser picks
- `poster` attribute set to the poster PNG so first paint is never empty
- Detect autoplay rejection (`play()` promise rejects) → permanent poster for
  the session, no retry loop

**Layering**
- Stage container gets `isolation: isolate` so blending can't leak to the page
- FX layers: `mix-blend-mode: plus-lighter` with `screen` fallback via
  `@supports`
- Both FX passes absolutely positioned on the same origin box as the avatar
  stage — the master-canvas rule extended to motion
- `pointer-events: none` on every FX layer

**Reduced motion**
- `matchMedia('(prefers-reduced-motion: reduce)')` → render `<img>` posters
  instead of `<video>`, never mount the video at all
- Live listener: respond if the user changes the setting mid-session

**Performance**
- `IntersectionObserver` at 10% → pause offscreen
- `visibilitychange` → pause hidden tab
- Unmount releases decoders
- `navigator.connection.saveData` → poster only
- Frame-drop watchdog: if `getVideoPlaybackQuality().droppedVideoFrames` exceeds
  ~20% over 3s, drop to poster and stay there
- Hard cap of 2 concurrent video elements, enforced in code not by convention

**Responsive**
- FX passes scale with the stage box; they never re-layout independently
- Below 1280px wide: FX-FRONT drops (keep FX-BACK) to halve decode load
- Below 900px: both drop to posters

**Asset loading**
- Posters preloaded with the initial bundle
- Videos lazy — request only when the stage is near viewport
- Never block first paint on video
- Sprite sheets bundled as normal images

**Also mine, and not animation:** a `validate:assets` script — I'll build it
next, since it gates tonight's art production.

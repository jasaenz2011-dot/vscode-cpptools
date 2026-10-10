# Higgsfield design iteration log: BMe robot turnaround

Date: 2026-10-10. Tool: Higgsfield MCP, model `nano_banana_pro` (served as `nano_banana_2`), 3:2, 2k (2528x1696 px). Reference: `refs/bme-robot-reference-turnaround.png` (the logo-free mockup, 1536x1024).
Credits spent: 10 of 15.18 (2 credits per image). Five images generated in three passes.

Result files are hosted on Higgsfield's CDN (links below). They could not be copied into this repository because the research sandbox cannot reach that CDN. Download them from the links or from the Higgsfield library before the URLs expire.

## Pass 1: faithful polish (2 variants, one reference)

Prompt intent: same character, cleaner shell seams, stronger frosted diffusion, limited metal accents, blank T-shirt, generic sneakers with soft blue sole, three views on white.

| Variant | URL | Assessment (visual review by Claude) |
|---|---|---|
| 1A | https://d8j0ntlcm91z4.cloudfront.net/user_3JQWbdOZ2cMLWqCICPKW5bdizVR/hf_20261010_233900_139dbe54-ab69-4d6c-a39d-0ee3c29aafc4.png | Near-copy of the reference. Identity, proportions, flush ears, faceplate all preserved. Background cleaned to pure white, LED soles read better, frosting marginally softer. Internal mechanisms in the shins still fairly sharp. |
| 1B | https://d8j0ntlcm91z4.cloudfront.net/user_3JQWbdOZ2cMLWqCICPKW5bdizVR/hf_20261010_233900_39718177-950c-4ca9-b3af-e580debb7450.png | Same as 1A with trivial differences. |

Verdict: on-brief but conservative. Usable as a cleaned-up version of the reference, not a redesign.

## Pass 2: bolder industrial-design revision (2 variants, one reference)

Prompt intent: "second-generation production toy next to a first prototype". Stronger subsurface diffusion, deliberate panel breaks on upper arm/forearm/thigh/shin, refined accents, cupsole sneaker with full-length glowing midsole.

| Variant | URL | Assessment |
|---|---|---|
| 2C | https://d8j0ntlcm91z4.cloudfront.net/user_3JQWbdOZ2cMLWqCICPKW5bdizVR/hf_20261010_234107_9cdcb1e8-afaa-48b3-963c-c609b9481e5c.png | Again near-identical to the reference (same as pass 1). The model is bimodal: it either copies or departs. |
| 2D | https://d8j0ntlcm91z4.cloudfront.net/user_3JQWbdOZ2cMLWqCICPKW5bdizVR/hf_20261010_234107_3e411b9a-4789-437a-a6c6-e883ce927c11.png | Real redesign of the body: thicker frosted shell with internals properly blurred, clean chamfered panel breaks, light lines glowing from inside the shell, knee caps and wrist collars as discrete accents, cleaner cupsole sneaker with even sole glow, better cloth on the T-shirt. OFF-BRIEF at the head: paneled helmet with seams, protruding metal ear discs, and a face that reads as a human child inside a helmet rather than a faceplate. Also the proportions are stockier and the neck joint is exposed. |

Verdict: 2D is the best body-craftsmanship reference in the set and the worst head. Useful as a materials and panel-design reference only.

## Pass 3: combination (1 image, two references: original + 2D)

Prompt intent: keep head and face exactly from the original (seamless dome, flush ear panels, faceplate), take the body treatment from 2D.

| Variant | URL | Assessment |
|---|---|---|
| 3E | https://d8j0ntlcm91z4.cloudfront.net/user_3JQWbdOZ2cMLWqCICPKW5bdizVR/hf_20261010_234508_066b2933-e21b-4194-a678-ab326e74dc30.png | Failed the head: the second reference dominated and the helmet, ear discs and human face were kept. Body is the 2D treatment. |

## Pass 4: original reinterpretations (2 concepts, text-only, no reference image)

Brief changed: "your own design, not a close copy". Reference image deliberately omitted because passes 1 to 3 showed the model copies identity from any supplied reference. Credits after this pass: 1.18.

| Concept | URL | Assessment |
|---|---|---|
| Lantern | https://d8j0ntlcm91z4.cloudfront.net/user_3JQWbdOZ2cMLWqCICPKW5bdizVR/hf_20261010_234842_689f426a-11c1-468e-b6ef-d7aaffb701fd.png | Strongest result of the session. Inverted-egg frosted head with a flush smoked visor; the face is light (amber arch eyes, small smile, blush glows), so expressions are emissive-texture swaps rather than face rig work. Warm light runs along panel seams and the crown; every limb reads as a capsule module with a brushed-silver socket ring at shoulder, elbow, wrist, hip, knee and ankle, which makes the swap points part of the design language. Frosted shell with softened internals, restrained metal, amber sole glow. Three views consistent. Flag: the glowing ring on the chest sits on the T-shirt surface and could be read as a print; intent is a core glow seen through the fabric, so it should be moved under the shirt or dropped. Pelvis V-seam light may be too much. |
| Mochi | https://d8j0ntlcm91z4.cloudfront.net/user_3JQWbdOZ2cMLWqCICPKW5bdizVR/hf_20261010_234842_6c17e362-b7e1-4a87-bcde-31fc6bd73071.png | Chunky two-and-a-half-head proportions, frosted squircle head with antenna nub and a recessed cartoon faceplate; cute and consistent across views. Weaker on the material brief: limbs rendered as pearlescent chrome with no visible softened internals, mitten hands are solid metal, and the petal panel idea barely shows. Closer in spirit to the original faceplate concept than Lantern. |

## What this says about the tool for BMe reference generation (Observed)

- Nano Banana Pro via Higgsfield preserves identity very strongly from a single reference when the prompt asks for refinement, and ignores most "improve" instructions. Pushing for a redesign flips it into a different character. Mid-range control (same character, materially better craftsmanship) did not come out in three passes.
- When two references are supplied, the second (more detailed) image dominated the head even with explicit "keep head from the first reference" language.
- Three-view consistency was good in every result: same scale, same pose, matching details front/side/back. This confirms the model is a reasonable turnaround generator for image-to-3D input once the design is locked.

## Suggested next steps if more passes are wanted

1. Regenerate from 2D with a face-only edit instruction (inpaint/edit mode, e.g. Seedream `is_inpaint` or Nano Banana edit) replacing the helmet head with the original dome head, rather than a full re-render.
2. Or author the "upgraded" head in Blender/2D paint and feed a corrected front view back as the single reference.
3. Keep every candidate; the prompt text for each pass is stored in the Higgsfield library with the generation.

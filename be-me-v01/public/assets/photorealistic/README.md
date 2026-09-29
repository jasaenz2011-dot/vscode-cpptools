# photorealistic

Asset directory for the **photorealistic** art style.

Every PNG in here must be authored on the master canvas defined in
`src/config/canvas.ts` (currently 1024 x 1536, taken from the delivered
masters) with the character in the exact
position the master base places them. The engine composites layers by exact
canvas alignment: it does not crop, re-centre, or scale-to-fit individual
assets.

```
photorealistic/
  boy/
    base/          master.png            <- the master avatar for this body base
    skin/          skin_001.png ...
    eyes/          eyes_001.png ...
    eyebrows/      brow_001.png ...
    hair/          hair_001.png ...
    tops/          top_001.png ...
    bottoms/       bottom_001.png ...
    shoes/         shoes_001.png ...
    accessories/   acc_001.png ...
    extras/        extra_001.png ...
  girl/
    (same structure)
```

Filenames are declared in `public/assets/manifest.json`. To add an asset:
drop the PNG in the right directory and add or enable its manifest entry.

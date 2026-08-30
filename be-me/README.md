# 🪞 Be Me — avatar creator art workspace

Drop your finished art files into the folders under `assets/`. Each folder
is one **layer** of the avatar; each numbered file in it is one **option**
the player can pick. Every folder has a `README.txt` with its naming
pattern and target count, and `CHECKLIST.md` tracks overall progress
(run `node progress.js` to have it counted for you).

## The five rules

1. **Numbering is the ID.** Always two digits (`_01`, `_02` … never `_1`),
   all lowercase, no spaces. The game discovers options by counting files —
   adding art never means editing code.
2. **Matching numbers pair up.** `hairback_03.png` + `hairfront_03.png` are
   the *same hairstyle*, split into behind-the-head and in-front-of-face
   halves.
3. **Every file, same canvas.** Same dimensions — **512 × 768 recommended** —
   transparent PNG, character anchored in the identical spot in every file.
   An eyes file is mostly empty canvas with just the eyes where they belong.
   That's correct; don't crop it.
4. **Tintables are grayscale.** Skin, hair, eyes, and most clothes get drawn
   once in white-to-gray shading; the game tints them into every color.
   One file = a full palette.
5. **The folders are the to-do list.** Files in folder vs. the target in its
   `README.txt` = what's done and what's left.

## Layer order (back → front)

```
background → hair/back → fantasy (wings, tail) → body → shoes → bottoms
→ tops → outerwear → face (eyes, brows, nose, mouth, extras) → hair/front
→ hats → glasses → jewelry → props
```

## Style consistency

Whether the art is hand-drawn or generated with GameLab's sprite tool, keep
one look across everything: same outline thickness, same shading style, same
level of detail. When generating, reuse the same style words in every prompt
(e.g. "flat cartoon style, thick clean outline, front-facing, plain flat
background") and only change the subject.

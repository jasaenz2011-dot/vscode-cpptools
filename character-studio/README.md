# Character Studio

A local CLI + folder system for building **locked Character Specs**. You drop
in reference images and a few choices; it produces a spec that downstream
tools (image gen, video gen, 3D blocking, ComfyUI) can consume without
guessing.

Scope: actor specification only. It does **not** generate images, meshes, or
video, and it makes **no network or cloud API calls**. Python 3 stdlib only.

## Layout

```
character-studio/
  actors/            one JSON spec per actor: {slug}.json
    _template/       blank actor template (actor.json)
  refs/{slug}/       your reference images, split into:
    face/ body/ details/ master/
  exports/{slug}/    generated spec + prompt files
  prompts/           editable style prompt snippets (photoreal.txt, anime.txt)
  character_studio.py
  schema.json        JSON Schema for actor files
```

## Quick start (sample actor included)

`init` creates everything, including a ready-made sample actor
`demo_swimmer`, so you can run the whole flow immediately:

```
python character_studio.py init
python character_studio.py new-actor --name "Demo Swimmer" --style anime --priority body --body-type swimmer
python character_studio.py ingest --actor demo-swimmer
python character_studio.py lock --actor demo-swimmer
python character_studio.py export --actor demo-swimmer
```

Then open `exports/demo-swimmer/prompt_image.txt` and use that first.
(`demo_swimmer` — the init-created sample — works the same way:
`ingest/lock/export --actor demo_swimmer`.)

## Commands

### `init`
Creates the folders, writes `schema.json`, the `_template` actor, the
editable style snippets in `prompts/`, and the `demo_swimmer` sample.
Safe to re-run; it never overwrites an existing actor.

### `new-actor --name NAME --style photoreal|anime --priority face|body|balanced --body-type twink|swimmer|bear|custom [--content-mode sfw|nsfw_local]`
Creates `actors/{slug}.json` (slug is derived from the name, e.g.
"Demo Swimmer" → `demo-swimmer`) and `refs/{slug}/{face,body,details,master}/`.
Content mode defaults to `sfw`.

### `ingest --actor SLUG`
Scans `refs/{slug}/` and attaches filenames into the spec:

- `master/`, `face/`, `body/`, `details/` fill `refs.master/face/body/detail`.
- A file backs a **region** when its filename contains the region name (or a
  common synonym): `chest_01.png` → chest, `left-arm-tattoo.jpg` → arms +
  tattoos. Everything in `face/` backs the face region automatically.
- A region with no matching files is marked `enabled: false`. Nothing is
  ever invented: no refs for a region means it stays out of the prompts.
- Empty folders are reported and skipped; ingest never fails on them.

Re-run ingest whenever you add or rename refs (it clears the lock so you
re-lock afterwards).

### `lock --actor SLUG`
Rewrites the spec so later generations cannot drift, then builds every
prompt from it:

- `--priority face`: all facial traits become immutable (`face.do_not_change`
  is filled in); the body may vary slightly within the body type.
- `--priority body`: body regions plus scars/tattoos/navel/nails are marked
  `IMMUTABLE`; the face may simplify but keeps its unique traits.
- `--priority balanced`: unique traits and markings on both are held.
- **Male anatomy is always locked**, regardless of priority or content mode:
  `sex: male`, `genitals: penis`, and the negative prompt always forbids
  `vagina, pussy, breasts, feminine body, futanari, hermaphrodite` so a
  model can never default to female genitals.

Prompt rules applied:

- **photoreal** — uses your plain-language face-distance notes
  (`face.landmarks_notes`; lock warns if empty) and only adds skin texture /
  pores / stubble / veins language when face or detail refs exist to
  support it.
- **anime** — locks eye shape, hair, colors, proportions, and shading style;
  consistency over micro-detail.
- **nsfw_local** — explicit male terms (`penis`, `glans`, `scrotum`, `anus`)
  are added only in this mode and only for regions that have refs, plus the
  line "use provided male anatomy references; do not substitute female
  genitals". In `sfw` mode `nsfw_prompt_additions` stays empty and the
  negatives additionally exclude nudity.

The style line comes from `prompts/photoreal.txt` / `prompts/anime.txt` —
edit those files to change the style wording for every future lock.

### `export --actor SLUG`
Requires a locked actor. Writes `exports/{slug}/`:

| file | use |
| --- | --- |
| `spec.json` | full locked spec for any downstream tool |
| `prompt_image.txt` | positive prompt for image generation — start here |
| `prompt_video.txt` | image prompt + temporal-consistency additions |
| `prompt_comfy.txt` | comma-separated tags for a ComfyUI CLIPTextEncode node |
| `negatives.txt` | negative prompt (anatomy lock included) |
| `checklist.md` | pre-generation checklist: refs, regions, rules |

## Filling in a spec

After `new-actor`, edit `actors/{slug}.json` before locking:

- `face.landmarks_notes` — describe unique face distances in plain language
  from your refs ("eyes one eye-width apart, short straight nose…").
- `face.unique_traits` — moles, piercings, heterochromia, anything that
  identifies this actor.
- `body.regions.*.notes` — per-region descriptions; only regions that end up
  enabled (i.e. have refs) reach the prompts.
- `body.proportions` — prefilled from the body type; write your own for
  `--body-type custom`.

Then `ingest` → `lock` → `export`. Any later edit to refs or the JSON just
needs `lock` + `export` again.

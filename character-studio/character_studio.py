#!/usr/bin/env python3
"""Character Studio: a local CLI that turns reference images + a few choices
into a locked Character Spec that downstream tools (image gen, video gen,
3D blocking, ComfyUI) can consume without guessing.

Python 3 stdlib only. No network calls. No model generation.

Commands:
  init        Create folders, schema, template actor, and the demo_swimmer sample.
  new-actor   Create /actors/{slug}.json and /refs/{slug}/ subfolders.
  ingest      Scan /refs/{slug} and attach filenames to region slots.
  lock        Freeze the spec and build all prompts from it.
  export      Write /exports/{slug}/ with spec + prompt files + checklist.
"""

import argparse
import json
import re
import sys
import uuid
from pathlib import Path

ROOT = Path(__file__).resolve().parent
ACTORS_DIR = ROOT / "actors"
REFS_DIR = ROOT / "refs"
EXPORTS_DIR = ROOT / "exports"
PROMPTS_DIR = ROOT / "prompts"
TEMPLATE_DIR = ACTORS_DIR / "_template"

REF_SUBDIRS = ("face", "body", "details", "master")

# Every trackable body region. Ingest attaches ref files to these by filename
# keyword; lock decides which are immutable based on --priority.
REGIONS = (
    "face", "ears", "neck", "chest", "belly", "navel", "back", "arms",
    "hands", "nails", "groin", "penis", "scrotum", "ass", "thighs",
    "calves", "feet", "tattoos", "scars",
)

# Extra filename keywords that map to a region during ingest.
REGION_SYNONYMS = {
    "penis": ("cock", "dick"),
    "scrotum": ("balls", "sack"),
    "ass": ("butt", "glutes", "rear"),
    "belly": ("stomach", "abs", "torso"),
    "tattoos": ("tattoo", "tat", "ink"),
    "scars": ("scar",),
    "arms": ("arm", "biceps", "forearm"),
    "hands": ("hand",),
    "thighs": ("thigh",),
    "calves": ("calf", "legs", "leg"),
    "feet": ("foot",),
    "ears": ("ear",),
    "nails": ("nail",),
}

IMAGE_EXTS = {".png", ".jpg", ".jpeg", ".webp", ".bmp", ".gif", ".tif", ".tiff"}

BODY_TYPES = {
    "twink": "slim adult male build, lean flat torso, narrow shoulders, "
             "smooth skin with minimal body hair, light muscle tone",
    "swimmer": "athletic adult male swimmer build, broad shoulders, tapered "
               "waist, lean defined muscle, long limbs, low body fat",
    "bear": "heavyset adult male build, broad chest, thick arms and legs, "
            "rounded belly, dense body hair",
    "custom": "",
}

# Body-anatomy lock: applied to every actor regardless of content mode.
ANATOMY_FORBID = ["vagina", "breasts as female", "futanari unless explicitly requested"]
ANATOMY_NEGATIVES = ["vagina", "pussy", "breasts", "feminine body",
                     "futanari", "hermaphrodite"]

QUALITY_NEGATIVES = {
    "photoreal": ["deformed hands", "extra fingers", "extra limbs",
                  "plastic skin", "airbrushed skin", "waxy skin",
                  "cartoon", "anime", "illustration", "watermark", "text"],
    "anime": ["deformed hands", "extra fingers", "extra limbs",
              "off-model face", "inconsistent eye shape",
              "photorealistic rendering", "3d render", "watermark", "text"],
}

STYLE_PROMPT_DEFAULTS = {
    "photoreal": (
        "photorealistic, natural lighting, true-to-life skin tones, "
        "realistic proportions, sharp focus, consistent identity across shots"
    ),
    "anime": (
        "anime style, clean line art, flat cel shading with soft rim light, "
        "consistent character design, on-model in every frame"
    ),
}


# ---------------------------------------------------------------------------
# helpers
# ---------------------------------------------------------------------------

def slugify(name):
    slug = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")
    if not slug:
        sys.exit("error: name produces an empty slug")
    return slug


def actor_path(slug):
    return ACTORS_DIR / f"{slug}.json"


def load_actor(slug):
    path = actor_path(slug)
    if not path.exists():
        sys.exit(f"error: no actor '{slug}' at {path}. Run new-actor first.")
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def save_actor(spec):
    path = actor_path(spec["slug"])
    with open(path, "w", encoding="utf-8") as f:
        json.dump(spec, f, indent=2, ensure_ascii=False)
        f.write("\n")
    return path


def blank_spec(name, slug, style, priority, body_type, content_mode):
    return {
        "id": uuid.uuid4().hex,
        "name": name,
        "slug": slug,
        "style": style,
        "content_mode": content_mode,
        "priority": priority,
        "body_type": body_type,
        "sex": "male",
        "anatomy_lock": {
            "genitals": "penis",
            "forbid": list(ANATOMY_FORBID),
        },
        "face": {
            "landmarks_notes": "",
            "unique_traits": [],
            "do_not_change": [],
        },
        "body": {
            "proportions": BODY_TYPES.get(body_type, ""),
            "regions": {
                r: {"enabled": False, "notes": "", "ref_files": []}
                for r in REGIONS
            },
        },
        "refs": {"master": [], "face": [], "body": [], "detail": []},
        "consistency_rules": [],
        "negative_prompt": "",
        "positive_prompt_core": "",
        "style_prompt": "",
        "nsfw_prompt_additions": "",
        "export": {
            "comfy_prompt": "",
            "image_gen_prompt": "",
            "video_gen_prompt": "",
            "3d_blocking_notes": "",
        },
        "locked": False,
    }


def style_prompt_for(style):
    """Read prompts/{style}.txt if the user customized it, else built-in."""
    path = PROMPTS_DIR / f"{style}.txt"
    if path.exists():
        text = path.read_text(encoding="utf-8").strip()
        if text:
            return text
    return STYLE_PROMPT_DEFAULTS[style]


# ---------------------------------------------------------------------------
# init
# ---------------------------------------------------------------------------

SCHEMA = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "title": "Character Studio Actor Spec",
    "type": "object",
    "required": [
        "id", "name", "slug", "style", "content_mode", "priority",
        "body_type", "sex", "anatomy_lock", "face", "body", "refs",
        "consistency_rules", "negative_prompt", "positive_prompt_core",
        "style_prompt", "nsfw_prompt_additions", "export", "locked",
    ],
    "properties": {
        "id": {"type": "string"},
        "name": {"type": "string"},
        "slug": {"type": "string", "pattern": "^[a-z0-9_-]+$"},
        "style": {"enum": ["photoreal", "anime"]},
        "content_mode": {"enum": ["sfw", "nsfw_local"]},
        "priority": {"enum": ["face", "body", "balanced"]},
        "body_type": {"enum": ["twink", "swimmer", "bear", "custom"]},
        "sex": {"const": "male"},
        "anatomy_lock": {
            "type": "object",
            "required": ["genitals", "forbid"],
            "properties": {
                "genitals": {"const": "penis"},
                "forbid": {"type": "array", "items": {"type": "string"}},
            },
        },
        "face": {
            "type": "object",
            "required": ["landmarks_notes", "unique_traits", "do_not_change"],
            "properties": {
                "landmarks_notes": {"type": "string"},
                "unique_traits": {"type": "array", "items": {"type": "string"}},
                "do_not_change": {"type": "array", "items": {"type": "string"}},
            },
        },
        "body": {
            "type": "object",
            "required": ["proportions", "regions"],
            "properties": {
                "proportions": {"type": "string"},
                "regions": {
                    "type": "object",
                    "propertyNames": {"enum": list(REGIONS)},
                    "additionalProperties": {
                        "type": "object",
                        "required": ["enabled", "notes", "ref_files"],
                        "properties": {
                            "enabled": {"type": "boolean"},
                            "notes": {"type": "string"},
                            "ref_files": {
                                "type": "array",
                                "items": {"type": "string"},
                            },
                        },
                    },
                },
            },
        },
        "refs": {
            "type": "object",
            "required": ["master", "face", "body", "detail"],
            "additionalProperties": {
                "type": "array", "items": {"type": "string"},
            },
        },
        "consistency_rules": {"type": "array", "items": {"type": "string"}},
        "negative_prompt": {"type": "string"},
        "positive_prompt_core": {"type": "string"},
        "style_prompt": {"type": "string"},
        "nsfw_prompt_additions": {"type": "string"},
        "export": {
            "type": "object",
            "required": ["comfy_prompt", "image_gen_prompt",
                         "video_gen_prompt", "3d_blocking_notes"],
            "additionalProperties": {"type": "string"},
        },
        "locked": {"type": "boolean"},
    },
}


def cmd_init(_args):
    for d in (ACTORS_DIR, REFS_DIR, EXPORTS_DIR, PROMPTS_DIR, TEMPLATE_DIR):
        d.mkdir(parents=True, exist_ok=True)

    schema_path = ROOT / "schema.json"
    with open(schema_path, "w", encoding="utf-8") as f:
        json.dump(SCHEMA, f, indent=2)
        f.write("\n")
    print(f"wrote {schema_path.relative_to(ROOT)}")

    # editable style prompt snippets, read by `lock`
    for style, text in STYLE_PROMPT_DEFAULTS.items():
        p = PROMPTS_DIR / f"{style}.txt"
        if not p.exists():
            p.write_text(text + "\n", encoding="utf-8")
            print(f"wrote prompts/{style}.txt (edit to customize style prompts)")

    # template actor
    template = blank_spec("TEMPLATE", "template", "photoreal", "balanced",
                          "custom", "sfw")
    template["id"] = "template"
    tpath = TEMPLATE_DIR / "actor.json"
    with open(tpath, "w", encoding="utf-8") as f:
        json.dump(template, f, indent=2)
        f.write("\n")
    print("wrote actors/_template/actor.json")

    # sample actor so the whole flow runs immediately
    if not actor_path("demo_swimmer").exists():
        sample = blank_spec("Demo Swimmer", "demo_swimmer", "anime", "body",
                            "swimmer", "sfw")
        sample["face"]["landmarks_notes"] = (
            "wide-set almond eyes, roughly one eye-width apart; short "
            "straight nose; jaw tapers to a soft point; hairline sits high "
            "with a left-side part"
        )
        sample["face"]["unique_traits"] = [
            "small mole under the left eye",
            "single silver stud in the right earlobe",
        ]
        sample["body"]["regions"]["navel"]["notes"] = "vertical oval navel, shallow"
        sample["body"]["regions"]["scars"]["notes"] = (
            "thin 3 cm surfing scar on the right shin"
        )
        save_actor(sample)
        for sub in REF_SUBDIRS:
            (REFS_DIR / "demo_swimmer" / sub).mkdir(parents=True, exist_ok=True)
        print("wrote actors/demo_swimmer.json (sample) + refs/demo_swimmer/")

    print("init complete.")


# ---------------------------------------------------------------------------
# new-actor
# ---------------------------------------------------------------------------

def cmd_new_actor(args):
    slug = slugify(args.name)
    path = actor_path(slug)
    if path.exists():
        sys.exit(f"error: actor '{slug}' already exists at {path}")
    ACTORS_DIR.mkdir(parents=True, exist_ok=True)
    spec = blank_spec(args.name, slug, args.style, args.priority,
                      args.body_type, args.content_mode)
    save_actor(spec)
    for sub in REF_SUBDIRS:
        (REFS_DIR / slug / sub).mkdir(parents=True, exist_ok=True)
    print(f"created actors/{slug}.json")
    print(f"created refs/{slug}/{{face,body,details,master}}/")
    print(f"next: drop reference images into refs/{slug}/ then run:")
    print(f"  python character_studio.py ingest --actor {slug}")


# ---------------------------------------------------------------------------
# ingest
# ---------------------------------------------------------------------------

def region_keywords(region):
    return (region,) + REGION_SYNONYMS.get(region, ())


def cmd_ingest(args):
    spec = load_actor(args.actor)
    slug = spec["slug"]
    ref_root = REFS_DIR / slug
    if not ref_root.exists():
        sys.exit(f"error: {ref_root} does not exist. Run new-actor first.")

    # collect files per subfolder, paths relative to refs/{slug}
    bucket_map = {"face": "face", "body": "body", "details": "detail",
                  "master": "master"}
    all_files = []
    for sub in REF_SUBDIRS:
        subdir = ref_root / sub
        files = []
        if subdir.exists():
            files = sorted(
                f"{sub}/{p.name}" for p in subdir.iterdir()
                if p.is_file() and p.suffix.lower() in IMAGE_EXTS
            )
        if not files:
            print(f"refs/{slug}/{sub}/ is empty — continuing without it")
        spec["refs"][bucket_map[sub]] = files
        all_files.extend(files)

    # attach files to regions by filename keyword; never invent anatomy
    for region, slot in spec["body"]["regions"].items():
        matched = []
        keywords = region_keywords(region)
        for rel in all_files:
            stem = Path(rel).stem.lower()
            words = re.split(r"[^a-z0-9]+", stem)
            if any(k in words for k in keywords):
                matched.append(rel)
        # everything in face/ backs the face region even without keyword
        if region == "face":
            for rel in spec["refs"]["face"]:
                if rel not in matched:
                    matched.append(rel)
        slot["ref_files"] = matched
        slot["enabled"] = bool(matched)

    enabled = [r for r, s in spec["body"]["regions"].items() if s["enabled"]]
    disabled = [r for r in REGIONS if r not in enabled]
    spec["locked"] = False  # refs changed; must re-lock
    save_actor(spec)
    print(f"ingested {len(all_files)} reference file(s) for '{slug}'")
    print(f"regions with refs ({len(enabled)}): {', '.join(enabled) or 'none'}")
    print(f"regions without refs, disabled ({len(disabled)}): "
          f"{', '.join(disabled) or 'none'}")
    print("no refs are ever invented: a disabled region stays out of prompts.")
    print(f"next: python character_studio.py lock --actor {slug}")


# ---------------------------------------------------------------------------
# lock
# ---------------------------------------------------------------------------

FACE_IMMUTABLE = [
    "eye shape, size, spacing, and color",
    "nose shape and length",
    "mouth width and lip shape",
    "jawline and chin shape",
    "hairline, hair color, and hairstyle",
    "ear shape",
]

BODY_IMMUTABLE_REGIONS = ("chest", "belly", "navel", "back", "arms", "hands",
                          "nails", "groin", "penis", "scrotum", "ass",
                          "thighs", "calves", "feet", "tattoos", "scars")


def build_consistency_rules(spec):
    rules = [
        "sex is male; genitals are a penis; never render female genitals",
        "never render breasts as female breasts",
        "no futanari or hermaphrodite variants unless explicitly requested",
        "only depict regions backed by reference files; do not invent "
        "anatomy that has no reference",
    ]
    priority = spec["priority"]
    if priority == "face":
        rules += [
            "face is immutable: reproduce every facial trait exactly from "
            "the face references in every generation",
            "body may vary slightly (pose, lighting, minor bulk) but must "
            "stay within the stated body type",
        ]
    elif priority == "body":
        rules += [
            "body is immutable: proportions, scars, tattoos, navel, and "
            "nails must match the body references exactly in every "
            "generation",
            "face may simplify at distance but must keep its unique traits",
        ]
    else:
        rules += [
            "face and body carry equal weight: keep unique facial traits "
            "and body markings consistent in every generation",
        ]
    if spec["style"] == "anime":
        rules.append("keep eye shape, hair, colors, proportions, and "
                     "shading style identical across generations")
    else:
        rules.append("keep facial distances and skin detail consistent with "
                     "the reference photos; no beauty-filter smoothing")
    return rules


def apply_priority_locks(spec):
    face = spec["face"]
    if spec["priority"] == "face":
        merged = list(FACE_IMMUTABLE)
        for t in face["unique_traits"]:
            if t not in merged:
                merged.append(t)
        for t in face["do_not_change"]:
            if t not in merged:
                merged.append(t)
        face["do_not_change"] = merged
    elif spec["priority"] == "body":
        for t in face["unique_traits"]:
            if t not in face["do_not_change"]:
                face["do_not_change"].append(t)
        for region in BODY_IMMUTABLE_REGIONS:
            slot = spec["body"]["regions"][region]
            if slot["enabled"] and "IMMUTABLE" not in slot["notes"]:
                slot["notes"] = ("IMMUTABLE: " + slot["notes"]).rstrip(": ")
    else:  # balanced
        for t in face["unique_traits"]:
            if t not in face["do_not_change"]:
                face["do_not_change"].append(t)


def build_positive_core(spec):
    parts = ["solo adult male", spec["name"]]
    proportions = spec["body"]["proportions"].strip()
    if proportions:
        parts.append(proportions)

    face = spec["face"]
    if face["landmarks_notes"].strip():
        parts.append("face: " + face["landmarks_notes"].strip())
    parts.extend(face["unique_traits"])

    for region, slot in spec["body"]["regions"].items():
        note = slot["notes"].replace("IMMUTABLE: ", "").strip()
        if slot["enabled"] and note:
            parts.append(f"{region}: {note}")

    if spec["style"] == "photoreal":
        # micro-detail only when refs exist to support it
        if spec["refs"]["face"] or spec["refs"]["detail"]:
            parts.append("visible skin texture and pores as shown in the "
                         "reference photos; stubble, veins, and blemishes "
                         "only where the references show them")
    else:
        parts.append("exact same eye shape, hair, colors, and proportions "
                     "as the reference art")

    parts.append("identity matches the provided reference images exactly")
    return ", ".join(parts)


def build_negative_prompt(spec):
    negatives = list(ANATOMY_NEGATIVES)  # male anatomy is always locked
    negatives += QUALITY_NEGATIVES[spec["style"]]
    if spec["content_mode"] == "sfw":
        negatives += ["nudity", "explicit content"]
    return ", ".join(negatives)


def build_nsfw_additions(spec):
    if spec["content_mode"] != "nsfw_local":
        return ""
    regions = spec["body"]["regions"]
    parts = ["explicit adult male anatomy"]
    if regions["penis"]["enabled"]:
        parts.append("penis and glans match the anatomy references")
    if regions["scrotum"]["enabled"]:
        parts.append("scrotum matches the anatomy references")
    if regions["ass"]["enabled"] or regions["groin"]["enabled"]:
        parts.append("male anus rendered anatomically when visible")
    parts.append("use provided male anatomy references; do not substitute "
                 "female genitals")
    return ", ".join(parts)


def build_exports(spec):
    core = spec["positive_prompt_core"]
    style = spec["style_prompt"]
    nsfw = spec["nsfw_prompt_additions"]
    positive = ", ".join(p for p in (core, style, nsfw) if p)

    image_prompt = positive
    video_prompt = positive + (
        ", stable identity in every frame, no morphing between frames, "
        "same face and body markings across all shots and camera angles"
    )
    comfy_prompt = positive  # comma-separated tags; paste into CLIPTextEncode

    enabled = [r for r, s in spec["body"]["regions"].items() if s["enabled"]]
    lines = [
        f"character: {spec['name']} ({spec['slug']})",
        f"sex: male; genitals: penis (locked)",
        f"body type: {spec['body_type']} — {spec['body']['proportions']}",
        f"priority: {spec['priority']}",
        f"regions with references: {', '.join(enabled) or 'none'}",
        "block the silhouette from master refs first, then refine regions "
        "that have references; leave unreferenced regions generic",
    ]
    if spec["face"]["landmarks_notes"].strip():
        lines.append("face landmarks: " + spec["face"]["landmarks_notes"].strip())
    for region in ("tattoos", "scars", "navel", "nails"):
        note = spec["body"]["regions"][region]["notes"].replace(
            "IMMUTABLE: ", "").strip()
        if note:
            lines.append(f"{region}: {note}")

    spec["export"] = {
        "comfy_prompt": comfy_prompt,
        "image_gen_prompt": image_prompt,
        "video_gen_prompt": video_prompt,
        "3d_blocking_notes": "\n".join(lines),
    }


def cmd_lock(args):
    spec = load_actor(args.actor)

    if spec["style"] == "photoreal" and not spec["face"]["landmarks_notes"].strip():
        print("warning: face.landmarks_notes is empty. For photoreal actors, "
              "describe the unique face distances from your refs in plain "
              "language (edit actors/%s.json), then re-run lock."
              % spec["slug"])

    apply_priority_locks(spec)
    spec["consistency_rules"] = build_consistency_rules(spec)
    spec["style_prompt"] = style_prompt_for(spec["style"])
    spec["positive_prompt_core"] = build_positive_core(spec)
    spec["negative_prompt"] = build_negative_prompt(spec)
    spec["nsfw_prompt_additions"] = build_nsfw_additions(spec)
    build_exports(spec)
    spec["locked"] = True
    save_actor(spec)

    print(f"locked '{spec['slug']}' (priority={spec['priority']}, "
          f"style={spec['style']}, content_mode={spec['content_mode']})")
    print("male anatomy locked: negatives forbid " + ", ".join(ANATOMY_NEGATIVES))
    print(f"next: python character_studio.py export --actor {spec['slug']}")


# ---------------------------------------------------------------------------
# export
# ---------------------------------------------------------------------------

def build_checklist(spec):
    regions = spec["body"]["regions"]
    lines = [
        f"# Pre-generation checklist — {spec['name']} ({spec['slug']})",
        "",
        f"- style: **{spec['style']}**  |  priority: **{spec['priority']}**  "
        f"|  content mode: **{spec['content_mode']}**",
        f"- sex: male  |  genitals: penis (locked; forbid: "
        f"{', '.join(spec['anatomy_lock']['forbid'])})",
        "",
        "## Before every generation",
        "",
        "- [ ] Attach the master refs listed below to the generation tool",
        "- [ ] Paste `prompt_image.txt` (or the video/comfy variant) as the "
        "positive prompt",
        "- [ ] Paste `negatives.txt` as the negative prompt — never trim the "
        "anatomy negatives",
        "- [ ] Confirm the output is male with a penis; regenerate anything "
        "that drifts female",
    ]
    if spec["priority"] == "face":
        lines.append("- [ ] Compare the output face to the face refs "
                     "trait-by-trait; the face is immutable")
    elif spec["priority"] == "body":
        lines.append("- [ ] Compare scars, tattoos, navel, and nails to the "
                     "body refs; the body is immutable")
    else:
        lines.append("- [ ] Check both unique facial traits and body "
                     "markings against the refs")

    lines += ["", "## Reference files", ""]
    for bucket in ("master", "face", "body", "detail"):
        files = spec["refs"][bucket]
        if files:
            lines.append(f"- {bucket}: " + ", ".join(files))
        else:
            lines.append(f"- {bucket}: (none)")

    lines += ["", "## Regions", ""]
    for region in REGIONS:
        slot = regions[region]
        state = "enabled" if slot["enabled"] else "disabled (no refs)"
        note = slot["notes"].strip()
        suffix = f" — {note}" if note else ""
        lines.append(f"- {region}: {state}{suffix}")

    lines += ["", "## Consistency rules", ""]
    lines += [f"- {r}" for r in spec["consistency_rules"]]
    return "\n".join(lines) + "\n"


def cmd_export(args):
    spec = load_actor(args.actor)
    if not spec["locked"]:
        sys.exit(f"error: actor '{spec['slug']}' is not locked. "
                 f"Run: python character_studio.py lock --actor {spec['slug']}")

    out = EXPORTS_DIR / spec["slug"]
    out.mkdir(parents=True, exist_ok=True)

    files = {
        "spec.json": json.dumps(spec, indent=2, ensure_ascii=False) + "\n",
        "prompt_image.txt": spec["export"]["image_gen_prompt"] + "\n",
        "prompt_video.txt": spec["export"]["video_gen_prompt"] + "\n",
        "prompt_comfy.txt": spec["export"]["comfy_prompt"] + "\n",
        "negatives.txt": spec["negative_prompt"] + "\n",
        "checklist.md": build_checklist(spec),
    }
    for name, content in files.items():
        (out / name).write_text(content, encoding="utf-8")
        print(f"wrote exports/{spec['slug']}/{name}")
    print(f"export complete. Start with exports/{spec['slug']}/prompt_image.txt")


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def main(argv=None):
    parser = argparse.ArgumentParser(
        prog="character_studio.py",
        description="Local Character Studio: lock reusable actor specs from "
                    "reference images. No cloud calls, no generation.",
    )
    sub = parser.add_subparsers(dest="command", required=True)

    p = sub.add_parser("init", help="create folders, schema, template, and "
                                    "the demo_swimmer sample actor")
    p.set_defaults(func=cmd_init)

    p = sub.add_parser("new-actor", help="create a new actor spec + ref folders")
    p.add_argument("--name", required=True)
    p.add_argument("--style", required=True, choices=["photoreal", "anime"])
    p.add_argument("--priority", required=True,
                   choices=["face", "body", "balanced"])
    p.add_argument("--body-type", required=True,
                   choices=["twink", "swimmer", "bear", "custom"])
    p.add_argument("--content-mode", default="sfw",
                   choices=["sfw", "nsfw_local"],
                   help="default sfw; nsfw_local unlocks explicit prompt "
                        "additions (local use only)")
    p.set_defaults(func=cmd_new_actor)

    p = sub.add_parser("ingest", help="scan refs/{slug} and attach files to "
                                      "region slots")
    p.add_argument("--actor", required=True, metavar="SLUG")
    p.set_defaults(func=cmd_ingest)

    p = sub.add_parser("lock", help="freeze the spec and build all prompts")
    p.add_argument("--actor", required=True, metavar="SLUG")
    p.set_defaults(func=cmd_lock)

    p = sub.add_parser("export", help="write exports/{slug}/ prompt files")
    p.add_argument("--actor", required=True, metavar="SLUG")
    p.set_defaults(func=cmd_export)

    args = parser.parse_args(argv)
    args.func(args)


if __name__ == "__main__":
    main()

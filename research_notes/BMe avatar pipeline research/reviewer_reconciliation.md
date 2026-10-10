# Reviewer reconciliation — BMe avatar pipeline research notes

Review date: **2026-10-10**. Files reviewed (read in full, not modified): `converter_limits_tripo_meshy.md`, `converter_limits_3daistudio_local.md`, `mixar_factcheck.md`, `modular_character_workflows.md`, `practitioner_videos.md`, `babylon_export_performance.md`. Short names used below: **TM** (Tripo/Meshy), **3DL** (3D AI Studio + local), **MX** (Mixar), **MOD** (modular workflows), **VID** (practitioner videos), **BAB** (Babylon export).

Reviewer access on 2026-10-10: `raw.githubusercontent.com` and `git fetch`/`git ls-remote` against `github.com` worked. `api.github.com` (also via `gh`) returned HTTP 403 "GitHub access to this repository is not enabled for this session" for every repo tried, and `github.com` HTML pages (release pages) returned 403 through the proxy. Vendor sites (tripo3d.ai, meshy.ai, 3daistudio.com, mixar.app, docs.comfy.org, huggingface.co, arxiv.org, youtube.com) were not attempted beyond what the notes already reported as blocked. Nothing was installed, run, or watched by the reviewer. Every check below is dated 2026-10-10.

---

## 1. Conflicts between notes

Format: what each note says → which source is stronger → reconciled statement.

**C1. Blender version / glTF add-on target (BAB internal; BAB vs MX).**
BAB header says glTF-Blender-IO `main` is 5.4.4 with "minimum Blender 5.3.0" and, in the same paragraph, that `main` tracks "Blender 5.2" (from the README branch table that also calls 5.0 "the current stable release"). MX says Blender 5.2 LTS was released 2026-07-14 (snippet) and Mixar pins `v5.2.0`.
Stronger: code and tags. Re-verified: `bl_info` = `(5, 4, 4)`, `'blender': (5, 3, 0)` ([__init__.py](https://raw.githubusercontent.com/KhronosGroup/glTF-Blender-IO/main/addons/io_scene_gltf2/__init__.py)); README still says "5.0 is the current stable release … main … will become Blender 5.2" ([README](https://raw.githubusercontent.com/KhronosGroup/glTF-Blender-IO/main/README.md)) — stale. Blender tag `v5.2.0` → commit `fbe6228777e7d9afefcd61a413844e790ae75db7`, committed 2026-07-13T17:20:11+02:00 (fetched from the `blender/blender` GitHub mirror).
Reconciled: Blender 5.2 LTS is the shipped LTS (July 2026). The glTF add-on `main` branch now targets Blender ≥ 5.3 (in development); the add-on bundled with 5.2 is the `blender-v5.2-release` branch, which no note read. BAB's `scene_gltf2.rst` facts came from `main` and may differ slightly from the 5.2-bundled manual. Do not describe Blender 5.3 as released (BAB cites "Blender 5.3 release notes" from a snippet — those are in-development notes).

**C2. TRELLIS.2 on a 16 GB RTX 5070 Ti (MOD vs 3DL vs VID).**
MOD: TRELLIS.2 "24 GB stated, Linux only … not reliably local without FP8/low-VRAM community modes that nobody has documented as working at 16 GB"; "single-image input only". 3DL: ComfyUI made TRELLIS.2 a core node in v0.34.0 with int8 weights; community reports say the 32³ structure grid fits 16 GB, 64³/1536 OOMs. VID: a second-hand lilys.ai summary claims a combined run "needs roughly 12 to 14 GB", and a video title claims 6 GB with GGUF.
Stronger: 3DL (reads the upstream pipeline and the ComfyUI node source). Re-verified: upstream README still says "at least 24GB", "tested only on Linux", MIT ([README](https://raw.githubusercontent.com/microsoft/TRELLIS.2/main/README.md)); `comfy_extras/nodes_trellis2.py` exists with `resolution` ∈ {"32","64"} default "32" and `target_resolution` 1024–2048 ([nodes_trellis2.py](https://raw.githubusercontent.com/comfyanonymous/ComfyUI/master/comfy_extras/nodes_trellis2.py)); ComfyUI tag `v0.34.0` commit dated 2026-08-25T17:58-04:00; visualbruno's wrapper changelog lists multi-view nodes from 2026-02-12 and FP8 models 2026-02-26 ([visualbruno README](https://raw.githubusercontent.com/visualbruno/ComfyUI-Trellis2/main/README.md)).
Reconciled: the 24 GB/Linux requirement is the **standalone repo's**; the ComfyUI native path (int8) and the visualbruno FP8 wrapper exist on Windows. 16 GB fit is **community-reported only** (Observed/Unverified), with 32³ + 1024 + remesh-off as the reported working configuration. Multi-view input is **not** in the upstream README but is provided by the visualbruno wrapper and by Pixal3D (multi-view inference released Sep 2026, verified in its README). MOD's "single-image only" and "nobody has documented 16 GB" are out of date relative to 3DL. The VID 12–14 GB and 6 GB figures are second-hand and must not be quoted as VRAM requirements.

**C3. Does Hunyuan3D 3.1 exist? (MOD vs 3DL vs MX).**
MOD: "I found no source confirming open weights for 3.0 or any '3.1' release." 3DL: 3D AI Studio API docs list model versions 3.0/3.1; Replicate lists `tencent/hunyuan-3d-3.1`; 3.0/3.1 are hosted-only. MX: Mixar client code contains slugs `hunyuan_pro_v3` and `hunyuan_pro_v3.1`.
Stronger: MX (direct code read) + 3DL (two independent listings).
Reconciled: Hunyuan3D 3.0 and 3.1 exist as **hosted API models** (three independent indications); no open weights for any 3.x (all three notes agree). MOD's gap statement should be dropped.

**C4/C5. Hunyuan3D license territory (MOD vs 3DL).**
MOD: Hunyuan3D license "not read; LICENSE fetch failed"; Hunyuan3D-Part "license terms are not stated". 3DL: Hunyuan3D 2.0/2.1/Part/Omni are under Tencent Community Licenses that do not apply in the EU/UK/South Korea and need a separate license above 1M MAU.
Stronger: 3DL. Re-verified: Hunyuan3D-2.1 LICENSE line 3 "THIS LICENSE AGREEMENT DOES NOT APPLY IN THE EUROPEAN UNION, UNITED KINGDOM AND SOUTH KOREA" and the 1 million MAU clause ([LICENSE](https://raw.githubusercontent.com/Tencent-Hunyuan/Hunyuan3D-2.1/main/LICENSE)); identical wording in Hunyuan3D-Part ([LICENSE](https://raw.githubusercontent.com/Tencent-Hunyuan/Hunyuan3D-Part/main/LICENSE)).
Reconciled: Documented. The territorial exclusion is decision-relevant (see §5).

**C6. Hunyuan3D-2.0 shape+texture on 16 GB (3DL vs MOD).**
3DL: "feasible" (official 16 GB total; 6 GB with mmgp). MOD: "≈16 GB — marginal". Same source: README line 126 "6 GB VRAM for shape generation and 16 GB for shape and texture generation in total" (re-verified, [README](https://raw.githubusercontent.com/Tencent-Hunyuan/Hunyuan3D-2/main/README.md)).
Reconciled: at the card's limit with stock code; needs `--low_vram_mode`, the mmgp (Hunyuan3D-2GP) path or reduced `view_size/texture_size`. Unverified on the target card. Neither note tested.

**C7. Does a larger reference image help Hunyuan3D-Paint? (VID vs 3DL).**
VID quotes RunComfy: "a larger reference image improves texture quality at the cost of more VRAM" (snippet, vendor). 3DL reads code: the texture reference is resized to 512×512 in both 2.0 and 2.1.
Stronger: code. Re-verified: 2.0 `multiview_utils.py` `self.view_size = 512`, inputs resized to `(view_size, view_size)` ([multiview_utils.py](https://raw.githubusercontent.com/Tencent-Hunyuan/Hunyuan3D-2/main/hy3dgen/texgen/utils/multiview_utils.py)); 2.1 `textureGenPipeline.py` line 139 `image = image.resize((512, 512))`, `render_size = 1024*2`, `texture_size = 1024*4`, RealESRGAN_x4plus ([textureGenPipeline.py](https://raw.githubusercontent.com/Tencent-Hunyuan/Hunyuan3D-2.1/main/hy3dpaint/textureGenPipeline.py)).
Reconciled: for the open 2.x models the texture reference is downsampled to 512² before diffusion; the RunComfy sentence is unverified vendor copy and contradicts the code. Hosted products are a separate, undocumented question.

**C8. Hunyuan3D-2 conditioning encoder (TM vs 3DL).**
TM: "Hunyuan3D-2 conditions DINOv2-Giant at 518×518" (third-party paper notes). 3DL: 2.0 paper = DINOv2-Giant 518 (snippet); 2.1 training config = `facebook/dinov2-large`, `image_size: 518`; `conditioner.py` class default `image_size=224` is overridden by config.
Stronger: 3DL (code). Re-verified: config header "ImageEncoder: DINO-v2 Large; ImageSize: 518", `version: 'facebook/dinov2-large'`, `image_size: 518`, `use_cls_token: true` ([config yaml](https://raw.githubusercontent.com/Tencent-Hunyuan/Hunyuan3D-2.1/main/hy3dshape/configs/hunyuandit-finetuning-flowmatching-dinol518-bf16-lr1e5-4096.yaml)); `conditioner.py` default `image_size=224`, `Resize(BILINEAR, antialias)` + `CenterCrop`, `num_patches=(image_size//14)**2` ([conditioner.py](https://raw.githubusercontent.com/Tencent-Hunyuan/Hunyuan3D-2/main/hy3dgen/shapegen/models/conditioner.py)); ComfyUI's `dino2_giant.json` has `image_size: 518`, `hidden_size: 1536`, 40 layers ([dino2_giant.json](https://raw.githubusercontent.com/comfyanonymous/ComfyUI/master/comfy/image_encoders/dino2_giant.json)).
Reconciled: 518×518 for both 2.0 (Giant) and 2.1 (Large). The shipped 2.0 checkpoint config on HF was not readable by anyone; the 518/Giant figure for 2.0 rests on the paper (snippet) plus ComfyUI's detection of a Giant backbone for the native Hunyuan3D-2 path.

**C9. Meshy multi-image count and ordering (TM vs MOD).**
TM: API "1 to 4 images"; on meshy-7.1 the first image is the front view and the rest are order-free. MOD: "Meshy multi-image accepts 1–4 (webapp docs say 2–8) images, ordered front, back, left, right" (Runware meshy-6 excerpt).
Stronger: TM (cites the Meshy API page for the current model). Neither could be re-verified (docs.meshy.ai blocked).
Reconciled: API accepts 1–4 images (snippet-documented); ordering rules are version-dependent (meshy-6 fixed order per reseller doc; 7.1 first = front). The "2–8" figure is unsupported and should be dropped or marked Unverified.

**C10. Which Meshy models support multi-view (TM internal).**
TM Q8 quotes a tutorial: "Multi-View currently only supported on Meshy 7"; TM Q7 and MOD cite meshy-6 multi-image API parameters.
Reconciled: the multi-image **API** exists for meshy-6 and later; the tutorial sentence likely described the web app at its writing date. Say "version-dependent; confirm on the live docs".

**C11. Tripo face limits (MOD vs MX).**
MOD: retopology node "max 10,000 quads instead of 20,000 triangles"; Scenario "1k–20k target". MX: issue #6 says Tripo v3.1 image-to-3D `face_limit` allows 500–2,000,000, while Mixar clamps to 20,000.
Not a true conflict: different endpoints (retopology target vs generation `face_limit`). Re-verified Mixar line 73 `face_limit: bpy.props.IntProperty(default=0, min=0, max=20000)` ([image_to_3d_ops.py](https://raw.githubusercontent.com/Mixar-AI/mixar-app/605ebe3406208c3a7a03c661033f756abd49427b/src/scripts/mixar/modules/moodboard/ui/operators/image_to_3d_ops.py)). Keep the two numbers separate in the report; the 10k/20k retopology figures are snippet-only and conflict with each other.

**C12. Tripo `texture_quality=detailed` surcharge (TM internal).** +10 credits (docs.tripo3d.ai pricing snippet) vs +20 (3D AI Studio reseller doc). Could not re-verify. Reconciled: report both with their sources; label snippet.

**C13. Access to Mixar's CLAUDE.md and release dates (VID vs MX).**
VID: "Mixar's CLAUDE.md and docs/ directory could not be read (HTTP 503 / 404)"; release notes "show day/month only — year inferred as 2026". MX: read CLAUDE.md at commit `605ebe3…` and gives tag commit dates.
Stronger: MX. Re-verified: raw CLAUDE.md at that commit is 38,023 bytes and contains "Upstream is pinned at Blender `v5.2.0`" and the LangGraph/"Claude Sonnet 4.6 primary, Gemini 3.1 Pro fallback" line ([CLAUDE.md](https://raw.githubusercontent.com/Mixar-AI/mixar-app/605ebe3406208c3a7a03c661033f756abd49427b/CLAUDE.md)); `git ls-remote` shows `main` = `605ebe34`, `develop` = `3e407dd2` = tag `v4.2.3`; the `v4.2.3` commit is dated 2026-10-10T14:54:18-07:00.
Reconciled: use MX for all Mixar facts; VID's Mixar section is derived and should defer.

**C14. "Mixar is built on Blender 5.2" (MX vs Mixar README as quoted by VID).**
README line 10 reads "Project status: v2.0.0 — first public source release. Built on Blender 5.2" (re-verified, [README](https://raw.githubusercontent.com/Mixar-AI/mixar-app/605ebe3406208c3a7a03c661033f756abd49427b/README.md)). MX shows v2.0.0 was tagged 2026-06-05 — before Blender 5.2.0 existed (tag 2026-07-13) — and that the rebase onto 5.2.0 happened in v4.0.0 (2026-09-24).
Reconciled: MX is right; the README sentence conflates the current base with the v2.0.0 milestone. Demos recorded before 2026-09-24 were not on Blender 5.2.

**C15. What Mixar does locally (MX vs VID).** Both agree in substance: `bpy` scripts execute locally; planning, tool definitions, LLM calls, viewport captures and all generation/retopo/UV/rig jobs go to `api.mixar.app`; the "Local" LLM provider only relays chat completions to localhost, the orchestrator stays remote. VID's "architecturally similar to Blender-MCP but in-process" is an inference; MX documents the sandbox restrictions (`os`/`pathlib` blocked) that make it narrower than blender-mcp's raw `execute_blender_code`. Use MX's wording.

**C16. ComfyUI native Hunyuan3D-2 texturing (MOD vs 3DL).** MOD: docs say unsupported but "a 2025 blog claims PBR support — possible doc lag". 3DL: native nodes are shape-only. Re-verified: `nodes_hunyuan3d.py` (507 lines) defines only `EmptyLatentHunyuan3Dv2`, `Hunyuan3Dv2Conditioning`, `Hunyuan3Dv2ConditioningMultiView`, `VAEDecodeHunyuan3D`, `VoxelToMeshBasic`, `VoxelToMesh` ([nodes_hunyuan3d.py](https://raw.githubusercontent.com/comfyanonymous/ComfyUI/master/comfy_extras/nodes_hunyuan3d.py)). Reconciled: native = shape only as of master on 2026-10-10; texturing requires kijai's or visualbruno's wrapper and a compiled `custom_rasterizer`.

**C17. Mobile triangle budgets (BAB vs MOD).** BAB infers "≤30–40k triangles total, ≤10–15 draw calls"; MOD infers "~15–25k tris for the whole assembled avatar". Both are labelled Inferred; the only sourced numbers are Ready Player Me's 20,000-triangle outfit cap and per-slot caps (snippet) and a third-party "~15k" profile. Reconciled: present a 15–40k working range as an assumption, cite only RPM.

**C18. Hunyuan3D 3.0 dates (MOD vs 3DL).** MOD: "global launch 25 Nov 2025" (comfyui-wiki excerpt); 3DL: "announced 16 Sep 2025" (Blue Lightning). Not contradictory (announcement vs engine launch), both secondary. Say "announced Sep 2025; engine launched globally Nov 2025 (secondary sources)".

**C19. Which note read ahujasid/blender-mcp (MX vs MOD/VID).** MX says "general knowledge, not fetched this session"; MOD and VID read the README directly. Use MOD's description (tool list, security warnings).

**C20. ComfyUI release dates (3DL).** 3DL gives v0.34.0 = "26 Aug" and v0.3.27 = "22 Mar, year not shown". Re-verified tag commits: `v0.34.0` 2026-08-25T17:58:26-04:00 (= 2026-08-25 21:58 UTC); `v0.3.27` 2025-03-21T20:09:54-04:00. The one-day differences are timezone/publish-vs-commit; the years are now confirmed (2026 and 2025).

---

## 2. Over-stated or unsupported claims

Each item: quote → how to relabel.

**TM (Tripo/Meshy)**
- Header: "Where a fact rests only on an indexed snippet it is still marked Documented." Summary table: "all 'Documented' unless marked". → Every vendor-page fact in this file (Tripo 20 MB / >256 px, Meshy ≥512 px, Meshy 20 MB web, Meshy API 100 MB, pricing tables) should carry **"Documented (indexed snippet; page not opened)"**. None was re-verifiable here.
- Q6 summary table: "TripoSG 224² crop of 256-short-edge resize (DINOv2-L) **[Code]**". → The 224/256 figures come from two third-party ports (QtMeshEditor notes, bevy_synth), not from VAST source or the HF `preprocessor_config.json`. Relabel **"Third-party code notes reading the HF weights; primary config not reached"**. (Re-verified that QtMeshEditor's notes say exactly this; see V11.)
- Q2: Meshy image **generator** "1:1 recommended for 3D conversion" and Q3: Meshy **Background Removal tool** "JPG or PNG up to 10MB". → These are other Meshy features. The note scopes them correctly, but the report must not present either as an image-to-3D input limit (this is the user's explicit prohibition).
- Q7: WaveSpeed "P2 endpoint" `texture_quality` values and per-task USD prices → reseller; keep as **Partner-documented**, not Tripo-documented.
- Q1: Tripo tutorial "high-resolution inputs (preferably 2048×2048 pixels or higher) directly determine the level of detail" → marketing; the note flags it, the report should treat it as **Unverified (vendor marketing, contradicted by the open-model encoder analysis)**.

**3DL (3D AI Studio + local)**
- KQ1: "Models exposed (**Documented** via site pages/snippets)". → Vendor marketing pages via snippets; relabel **"Vendor page (snippet)"**. Same for credit costs ("sources conflict" is already noted), "Hunyuan3D 3.5" listing, "up to 4K/8K" texture claims.
- KQ1: "Upstream Hunyuan 3.x is cloud-only (**Observed/Documented** via third parties)". → **Third-party/Unverified**; the conclusion is corroborated by MX's code slugs but no Tencent statement was read.
- KQ2: "Hunyuan3D-2-WinPortable … CUDA 12.9 pack supports Blackwell" → Documented as a README claim of compatibility; it is not a test result and should not be written as "works on RTX 50-series".
- KQ2 header "preprocessors.py header still says NON-COMMERCIAL" vs LICENSE → correctly flagged; keep.
- KQ3: "InstaSD guide … 32 cubed is the right answer on 16 GB", "Lilys summary (low quality) ~13 GB on RTX 5080" → Observed/Unverified; must not become a VRAM figure in the report.
- KQ1 "Texture Generator accepts GLB/FBX/OBJ up to 120MB (200MB for Hunyuan)", "Optimize API GLB only", text-to-3D "Max 8K +15 credits" → mesh-upload and text-to-3D limits, correctly scoped; keep them out of any image-input-limit table.

**MX (Mixar)**
- Q2: "Backend runs a LangGraph orchestrator (Claude Sonnet 4.6 primary, Gemini 3.1 Pro fallback) … 200+ tools — **Documented**". → It is a statement in the client repo's developer notes describing a closed backend; relabel **"Documented in client-side dev notes (CLAUDE.md); backend not observable, may be stale"**.
- Q1: "Blender 5.2 LTS … released 2026-07-14 (snippet)". Consistent with the `v5.2.0` tag commit of 2026-07-13 (re-verified); fine.
- Q11: "493 stars, 88 forks, 5 watchers, 8 open issues" and "Tagged … by GitHub user 'claude'" → could not re-verify (API and release HTML blocked here); keep as Documented-at-time-of-read.
- Q3 inference about OpenAI terms and refresh-token hand-off → clearly labelled Inferred; keep it labelled.
- Q4: "from $29.99/mo" → correctly Unverified (aggregator); the report must not quote a price.

**MOD (modular workflows)**
- KQ1: "Hunyuan3D 3.0 … global launch 25 Nov 2025 … **Documented (excerpt)**" from comfyui-wiki → third-party wiki; relabel **Unverified/secondary**.
- KQ1: "I found no source confirming … any '3.1' release" → superseded (C3); delete.
- KQ1: "TRELLIS.2 … single-image input only — **Documented**" → true of the upstream README only; add "upstream; multi-view available via visualbruno wrapper and Pixal3D".
- KQ1: "Hunyuan3D license terms … were not read" → superseded (C4).
- KQ3: "CharacterSheet (July 2026) … **Documented (excerpt; page not opened)**" → **Unverified**; a page not opened is not documented.
- KQ2/KQ3: "Meshy multi-image accepts 1–4 (webapp docs say 2–8)" → drop "2–8" or mark Unverified.
- KQ7/KQ9: Mixamo "maintenance mode … persistent 2025–26 outage … add-on broke" from Cinevva and a competitor (Sorceress) → relabel **Unverified (competitor/third-party)**.
- KQ8: Khronos 3DC numbers "as quoted on the three.js forum" and Fiverr "1,500–5,000 tris" → second-hand/service page; already labelled; keep out of the budget table or mark as such.
- KQ1: "Meshy 6 is preferred by 63.8% of professional evaluators" → correctly Unverified (vendor).

**VID (practitioner videos)**
- Honest about access throughout. Three things to tighten: (a) KQ1 Takeaway "a dense cluster of 2025–2026 YouTube tutorials … several that specifically use four-view input" → rests on titles; say "titles indicate". (b) Item #9 and #25 (lilys.ai AI summaries: "12 to 14 GB of VRAM", "233 seconds", "hard surface meshes", "requires at least 12 GB") → second-hand machine summaries of unwatched videos; must not be cited as figures. (c) KQ7 #54 quotes a "search-engine summary of the result set" as if it were evidence ("isn't supported by these sources…") → not a source; delete.
- Item #27 "posted about 65 days ago" and #12 "about 36 to 120 days old" → search-engine relative dates; acceptable only as approximate.

**BAB (Babylon export)**
- KQ2 Takeaway/header "main tracking Blender 5.2" → internally inconsistent with `'blender': (5, 3, 0)`; fix per C1.
- KQ2: "Blender 5.3 release notes (search excerpt only)" → in-development notes; do not imply 5.3 is released.
- KQ7: "Real-device testing … steps from assistant knowledge — treat as Unverified" and "device-mode limitation is general knowledge, not sourced — Unverified" → honest; the report should either source or omit these.
- KQ3/KQ7 Inferred budgets ("≤30–40k triangles", "≤10–15 draw calls", "≤8 1K textures") → labelled Inferred; the report must keep them as assumptions, not findings.
- KQ3 "every opaque mesh … drawn twice per frame" → Inferred from source; correct label, but no measurement exists.

**User-prohibited patterns — audit result.** No note claims to have tested software or watched a video (all six carry explicit disclaimers). No note presents an image-generation or retexture limit as an image-to-3D limit; the risk is at report-assembly time (see §6). Invented numbers: none found; the derived numbers (3DL "object spans ≈ 440 px", TM "~100 credits per test") are arithmetic on documented constants and are labelled Inferred.

---

## 3. Spot re-verifications (all on 2026-10-10)

| # | Claim (note) | Primary source checked | Result |
|---|---|---|---|
| V1 | Hunyuan3D-2 `ImageProcessorV2(size=512)`, `load_image(border_ratio=0.15)`, long side = `int(size*(1-border_ratio))`, white background, no-alpha → mask all 255, INTER_AREA recenter / INTER_CUBIC final / INTER_NEAREST mask, MV order front=0,left=1,back=2,right=3 (3DL) | [preprocessors.py](https://raw.githubusercontent.com/Tencent-Hunyuan/Hunyuan3D-2/main/hy3dgen/shapegen/preprocessors.py) | **Matched.** Note: `recenter()`'s own default is 0.2 but `load_image`/`__call__` pass 0.15, as the note says. |
| V2 | Hunyuan3D-2.1 training config: `facebook/dinov2-large`, `image_size: 518`, `use_cls_token: true`, `ImageProcessorV2` target (3DL) | [config yaml](https://raw.githubusercontent.com/Tencent-Hunyuan/Hunyuan3D-2.1/main/hy3dshape/configs/hunyuandit-finetuning-flowmatching-dinol518-bf16-lr1e5-4096.yaml) | **Matched.** Header: "VAE: 4096 token length; ImageEncoder: DINO-v2 Large; ImageSize: 518". |
| V3 | ComfyUI `dino2_giant.json` image_size 518 / hidden 1536 / patch 14; `nodes_hunyuan3d.py` exists, `octree_resolution` default 256 (16–512), `num_chunks` 8000, multi-view `arange(4)` embedding, no texture nodes (3DL) | [dino2_giant.json](https://raw.githubusercontent.com/comfyanonymous/ComfyUI/master/comfy/image_encoders/dino2_giant.json); [nodes_hunyuan3d.py](https://raw.githubusercontent.com/comfyanonymous/ComfyUI/master/comfy_extras/nodes_hunyuan3d.py) | **Matched.** |
| V4 | Hunyuan3D-Paint: 2.0 `view_size=512`, render/texture 2048, `bake_exp=4`, `recenter_image(border_ratio=0.2)`; 2.1 ref → 512², `render_size=2048`, `texture_size=4096`, dinov2-giant, RealESRGAN_x4plus (3DL) | [multiview_utils.py](https://raw.githubusercontent.com/Tencent-Hunyuan/Hunyuan3D-2/main/hy3dgen/texgen/utils/multiview_utils.py); [texgen/pipelines.py](https://raw.githubusercontent.com/Tencent-Hunyuan/Hunyuan3D-2/main/hy3dgen/texgen/pipelines.py); [textureGenPipeline.py](https://raw.githubusercontent.com/Tencent-Hunyuan/Hunyuan3D-2.1/main/hy3dpaint/textureGenPipeline.py) | **Matched.** README VRAM lines also matched: 2.0 "6 GB … 16 GB"; 2.1 "10 GB … 21GB … 29GB", `--low_vram_mode`. |
| V5 | Babylon.js 9.30.0 is current; `Extensions/index.ts` contains the listed extensions incl. variants, diffuse_transmission, dispersion, basisu, meshopt, draco, webp, quantization, unlit; `TransmissionHelper` defaults 1024 / 4 samples / half-float / mipmaps; diffuse_transmission marked experimental and triggers the helper (BAB) | [index.ts](https://raw.githubusercontent.com/BabylonJS/Babylon.js/master/packages/dev/loaders/src/glTF/2.0/Extensions/index.ts); [transmissionHelper.ts](https://raw.githubusercontent.com/BabylonJS/Babylon.js/master/packages/dev/loaders/src/glTF/2.0/Extensions/transmissionHelper.ts); [abstractEngine.pure.ts](https://raw.githubusercontent.com/BabylonJS/Babylon.js/master/packages/dev/core/src/Engines/abstractEngine.pure.ts); [KHR_materials_diffuse_transmission.pure.ts](https://raw.githubusercontent.com/BabylonJS/Babylon.js/master/packages/dev/loaders/src/glTF/2.0/Extensions/KHR_materials_diffuse_transmission.pure.ts) | **Matched.** `Version` returns "9.30.0"; tag `9.30.0` commit dated 2026-10-08T07:05Z; defaults `renderSize: 1024, samples: 4, lodGenerationScale: 1, lodGenerationOffset: -4, TEXTURETYPE_HALF_FLOAT, generateMipmaps: true`, RTT named "opaqueSceneTexture"; "!!! Experimental Extension Subject to Changes !!!" present. Index also exports `objectModelMapping`, which the note omitted (immaterial). |
| V6 | Three.js `GLTFLoader` (dev) has no built-in KHR_materials_variants and no diffuse_transmission (BAB) | [GLTFLoader.js](https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/jsm/loaders/GLTFLoader.js) | **Matched.** Variants appear only in a doc comment pointing to `three-gltf-extensions`; `EXTENSIONS` list has no diffuse_transmission. |
| V7 | Mixar: latest tag v4.2.3; `main` = `605ebe3…`; LICENSE GPL-3.0; `VERSION` 4.2.2; Codex provider = paste `~/.codex/auth.json`, sent to backend; `mcp.py` stdio launcher with 8 MiB / 32 pending; CLAUDE.md pins Blender `v5.2.0`; README says BYOK routes only the chat agent (MX) | `git ls-remote`; [LICENSE](https://raw.githubusercontent.com/Mixar-AI/mixar-app/605ebe3406208c3a7a03c661033f756abd49427b/LICENSE); [VERSION](https://raw.githubusercontent.com/Mixar-AI/mixar-app/605ebe3406208c3a7a03c661033f756abd49427b/VERSION); [byok/constants.py](https://raw.githubusercontent.com/Mixar-AI/mixar-app/605ebe3406208c3a7a03c661033f756abd49427b/src/scripts/mixar/modules/byok/constants.py); [byok_ops.py](https://raw.githubusercontent.com/Mixar-AI/mixar-app/605ebe3406208c3a7a03c661033f756abd49427b/src/scripts/mixar/modules/byok/ui/operators/byok_ops.py); [mcp.py](https://raw.githubusercontent.com/Mixar-AI/mixar-app/605ebe3406208c3a7a03c661033f756abd49427b/src/scripts/mixar/mcp.py); [CLAUDE.md](https://raw.githubusercontent.com/Mixar-AI/mixar-app/605ebe3406208c3a7a03c661033f756abd49427b/CLAUDE.md) | **Matched, and strengthened.** Tags end at v4.2.3 → `3e407dd2` (= `develop` head), commit 2026-10-10T14:54:18-07:00; `main` HEAD `605ebe34`. `_execute_codex` calls `byok_client.save_credentials(provider='codex', model=model, api_key=bundle, …)` and its docstring says "**The backend refreshes the token (validating it) and stores the bundle**" — i.e. the OAuth bundle is stored server-side, which the note inferred. `mcp.py` header, `MAX_MESSAGE_BYTES = 8*1024*1024`, `MAX_PENDING_REQUESTS = 32`, and the "Connect AI Apps (MCP)" error text match. **Could not re-verify:** star/fork/issue counts, the release page's "tagged by user 'claude'", and the v4.2.2/v4.2.3 release-note text (github.com HTML and API returned 403 here). |
| V8 | Mixar submodule pin `fbe6228…` "could not confirm is exactly v5.2.0" (MX gap) | `git fetch` of tag `v5.2.0` from the `blender/blender` GitHub mirror | **Resolved (new).** `v5.2.0` → commit `fbe6228777e7d9afefcd61a413844e790ae75db7`, committed 2026-07-13T17:20:11+02:00 — identical to the pin quoted in MX. |
| V9 | Blender glTF add-on `main`: version 5.4.4, min Blender 5.3.0; meshopt/gltfpack/WebP export properties exist; KHR_materials_variants export UI documented (BAB) | [__init__.py](https://raw.githubusercontent.com/KhronosGroup/glTF-Blender-IO/main/addons/io_scene_gltf2/__init__.py); [README](https://raw.githubusercontent.com/KhronosGroup/glTF-Blender-IO/main/README.md); [scene_gltf2.rst](https://raw.githubusercontent.com/KhronosGroup/glTF-Blender-IO/main/docs/blender_docs/scene_gltf2.rst) | **Matched** for version, min Blender, `export_meshopt_compression_enable`, `export_meshopt_extension`, `export_use_gltfpack`, `export_image_format`, and the rst "glTF Variants" section ("Assign to Variant", enable UI in add-on preferences). **Confirmed inconsistency:** README still says 5.0 is current stable and `main` "will become Blender 5.2". The `KHR_materials_variants_ui` preference name was not found by grep in `__init__.py` (it may live in a preferences module); the UI itself is documented in the rst. |
| V10 | TRELLIS.2 `preprocess_image`: `scale = min(1, 1024/max_size)`, bbox from `alpha > 0.8*255`, `image_cond_model.image_size = resolution`, 512/1024 model keys, default `'1024_cascade'`; TRELLIS: 1.2× bbox, 518 LANCZOS, u2net; ComfyUI `nodes_trellis2.py` 32/64 and 1024–2048 (3DL) | [trellis2_image_to_3d.py](https://raw.githubusercontent.com/microsoft/TRELLIS.2/main/trellis2/pipelines/trellis2_image_to_3d.py); [trellis_image_to_3d.py](https://raw.githubusercontent.com/microsoft/TRELLIS/main/trellis/pipelines/trellis_image_to_3d.py); [nodes_trellis2.py](https://raw.githubusercontent.com/comfyanonymous/ComfyUI/master/comfy_extras/nodes_trellis2.py) | **Matched.** TRELLIS.2 README re-checked: "at least 24GB", "tested only on Linux", MIT badge and licence line, OPAQUE-export note. |
| V11 | TripoSG conditions DINOv2-L at 224 after 256 shortest-edge resize (TM, via two third-party ports) | [pipeline_triposg.py](https://raw.githubusercontent.com/VAST-AI-Research/TripoSG/main/triposg/pipelines/pipeline_triposg.py); [QtMeshEditor TRIPOSG_EXPORT_NOTES.md](https://raw.githubusercontent.com/fernandotonon/QtMeshEditor/800a36c802f98392655c6d98408a6b390a8e8a63/docs/TRIPOSG_EXPORT_NOTES.md); [bevy_synth image_encoder.rs](https://raw.githubusercontent.com/mosure/bevy_synth/c0313a4055ca106ed50c01d3b04e4d0ddde82239/crates/burn_tripo/src/model/triposg/image_encoder.rs) | **Partially re-verified.** The official pipeline does use `BitImageProcessor` + `Dinov2Model` (matched). QtMeshEditor's notes do state "resize shortest-edge 256 → center-crop 224", 257 tokens (matched as a secondary source). In bevy_synth's `image_encoder.rs` the `size_shortest_edge`/`crop_size` fields default to `None` and are loaded from the weights at runtime; the asserted 256/[224,224] values were not in that file's lines I grepped (they may be in a test). The primary (HF `preprocessor_config.json`) was unreachable. Keep the 224 figure labelled third-party. |
| V12 | Hunyuan3D 2.x / Part community licences exclude EU/UK/South Korea, 1M MAU threshold (3DL) | [Hunyuan3D-2.1 LICENSE](https://raw.githubusercontent.com/Tencent-Hunyuan/Hunyuan3D-2.1/main/LICENSE); [Hunyuan3D-Part LICENSE](https://raw.githubusercontent.com/Tencent-Hunyuan/Hunyuan3D-Part/main/LICENSE) | **Matched** (exact wording quoted in C4). |
| V13 | Pixal3D is MIT; SIGGRAPH 2026; multi-view inference Sep 2026; 1536 standard / 1024 low-VRAM; needs `natten` (3DL) — vs an outlet's "academic-only" | `git ls-remote` (default branch `master`); [LICENSE](https://raw.githubusercontent.com/TencentARC/Pixal3D/master/LICENSE); [README](https://raw.githubusercontent.com/TencentARC/Pixal3D/master/README.md) | **Matched.** LICENSE = "MIT License, Copyright (c) 2026 Tencent"; README: "SIGGRAPH 2026", "Sep 2026: Release multi-view inference code", "pipeline resolution is 1536 (standard mode) or 1024 (low-VRAM mode)", `pip install natten==0.21.0`. The "academic-only" report is wrong. |
| V14 | ComfyUI v0.34.0 (TRELLIS.2/Pixal3D native) is an Aug-2026 release; v0.3.27 (Hunyuan3D-2 native) is Mar-2025 (3DL) | `git fetch` of tags from `comfyanonymous/ComfyUI` | **Matched/clarified.** `v0.34.0` commit 2026-08-25T17:58-04:00 (note said 26 Aug); `v0.3.27` commit 2025-03-21T20:09-04:00 (note said 22 Mar, year unknown). |
| V15 | kijai ComfyUI-Hunyuan3DWrapper README wheel/Blackwell statements (3DL) | `raw.githubusercontent.com/kijai/ComfyUI-Hunyuan3DWrapper/main/README.md` | **Could not re-verify** — 404 at that path (default branch is `main`; the README may use a different filename). Issue threads (#203, #214) could not be re-opened (API/HTML blocked). |

Not re-verifiable from this sandbox: all tripo3d.ai, meshy.ai, 3daistudio.com, mixar.app, docs.comfy.org, huggingface.co and arxiv.org claims; YouTube content; GitHub star/issue counts; GitHub release-page text.

---

## 4. Evidence-label audit

- **converter_limits_tripo_meshy.md** — Labels are mostly honest and the partner/reseller distinction is well kept, but "Documented" is used for snippet-only vendor pages by the author's own admission, and the Q6 table mislabels third-party port notes as "[Code]". Systematic weakness: **no vendor page was opened; every Tripo/Meshy number is an indexed snippet**, and the hosted products' preprocessing is extrapolated from open research models.
- **converter_limits_3daistudio_local.md** — Strongest file: constants were read from source and the re-verified ones (V1–V4, V10, V12, V13) all matched. Weakness: **3D AI Studio facts are vendor-marketing snippets labelled "Documented"**, and the 16 GB/Blackwell conclusions rest on issue threads and community posts (correctly labelled Observed/Inferred, but untested).
- **mixar_factcheck.md** — Labels are used carefully; code citations at a fixed commit are reproducible and the ones checked matched or were strengthened (V7, V8). Weakness: **everything about the backend (model routing, pricing, privacy, what is stored) comes from client-side comments and snippets**, and "Documented" is applied to a dev-notes description of a closed service.
- **modular_character_workflows.md** — Labels are present but several "Documented (excerpt)" items are third-party or vendor pages that were never opened, and three statements (no Hunyuan 3.1; licence not read; TRELLIS.2 16 GB/single-image) are contradicted by sister notes. Systematic weakness: **breadth over verification; many sources are vendor blogs, competitor comparisons and single-author posts labelled "Observed"**.
- **practitioner_videos.md** — The most honest file about its own limits: every entry says "Not accessed — snippet only". Weakness: **no transcript, description, date or duration was read for any video; the "Observed vs Claimed" distinction the brief asked for was impossible**, and some entries lean on third-party AI summaries (lilys.ai) and on search-engine result summaries.
- **babylon_export_performance.md** — Source-code citations are precise and all re-verified ones matched (V5, V6, V9). Weakness: **public docs pages and forums were not reachable, so forum statements are excerpts and mobile cost is inferred, not measured**; one internal inconsistency about the add-on's target Blender version; a few "assistant knowledge" items flagged Unverified.

---

## 5. Gaps that matter for the decision

**Essential before production (would change the pipeline choice)**
1. **Hosted converters' effective input resolution** (Tripo H3.1/P1, Meshy 7.1, 3D AI Studio's Hunyuan 3.x) is undocumented by every vendor. Only the proposed empirical test (same subject at 1024²/2048²/4096², fixed seed; TM Q9, 3DL KQ8) answers whether the 4K–8K master has any value for geometry. Cost per TM: ~100 credits per vendor (derived from snippet pricing).
2. **Local texturing on the RTX 5070 Ti / Windows**: Hunyuan3D-Paint needs a compiled `custom_rasterizer` for sm_120; no official wheel was found and the relevant issues are open (3DL). A 30-minute smoke test decides whether local PBR texturing exists at all.
3. **TRELLIS.2 / Pixal3D native ComfyUI fit on 16 GB** is community-reported only; the 32³ vs 64³ boundary must be tested before planning on it.
4. **Licence territory**: Hunyuan3D 2.x, Part and Omni community licences do not apply in the EU/UK/South Korea (verified). If the project or its users are in those territories, the local Hunyuan route is off the table; TRELLIS.2, Pixal3D, PartCrafter (MIT) remain.
5. **Mixar data handling and terms**: privacy policy, retention of uploaded meshes/captures, what the backend does with a stored Codex OAuth bundle, pricing and free-tier terms — all unreadable (mixar.app blocked). The code shows captures and generation uploads go to `api.mixar.app` and that the Codex bundle is stored server-side (V7).
6. **Babylon transmission cost on target phones** is unmeasured; the helper's defaults are known (V5) but no document quantifies the second opaque pass. This decides frosted-shell authoring (real transmission vs baked/alpha-blend).
7. **Blender version lock-in**: confirm the glTF add-on branch bundled with Blender 5.2 LTS has the Variants UI and meshopt/gltfpack options (BAB read `main`, which targets 5.3).

**Useful later**
8. Controlled multi-view vs single-large-image comparison on the chosen vendor (no credible test exists for any vendor).
9. Any independent Mixar reliability data (none exists; issue tracker unanswered).
10. Actual content of the ~20 shortlisted videos (none watched); the only robot-titled agent demo (#60) is title-only.
11. Meshy API 100 MB cap, Tripo 6000 px bound, Meshy "2–8 views" — confirm on live docs.
12. Pixal3D VRAM and texture resolution (README gives none).
13. Khronos ACG 2.0 numeric budgets; current iOS MAX_TEXTURE_SIZE survey.
14. Kijai wrapper README and 2.1-shape support status (could not be re-read).

---

## 6. Guidance for the report writer

1. State plainly that **no video was watched and no transcript, description or publish date was read**; present the video list as leads to verify, and never cite lilys.ai or search-engine summaries as evidence.
2. Keep the upload limits apart and attributed: **Tripo API 20 MB / JPEG+PNG / >256 px recommended (Tripo docs, snippet)**; **[20, 6000] px per side is the Alibaba Model Studio hosting of Tripo H3.1/P1, not Tripo's own API**; **3D AI Studio ≤50 MB (its troubleshooting page, snippet)**; **Meshy 20 MB web app, 100 MB API stated only in a tutorial**. Do not import Meshy's image-generator aspect-ratio advice, its 10 MB background-removal tool limit, 3D AI Studio's mesh-upload caps or any retexture/texture-output figure into an image-to-3D input table.
3. Write Mixar's "Codex subscription" as: *you run `codex login`, paste `~/.codex/auth.json` into Mixar, and the client sends that OAuth bundle to Mixar's backend, which (per the client docstring) refreshes and stores it*. There is **no Anthropic/Claude subscription sign-in**; BYOK removes only LLM credits, generation/retopo/UV/rig still bill Mixar credits; the "Local model" option still runs the orchestrator on `api.mixar.app`.
4. For the open models, give the code-verified conditioning sizes — Hunyuan3D-2.x and TRELLIS **518²**, TRELLIS.2 **512 + 1024**, Hunyuan3D-Paint reference **512²** — and say explicitly that **hosted Tripo/Meshy/Hunyuan 3.x conditioning is undocumented and must not be inferred from these**.
5. Mark every number taken from a vendor site as **"indexed snippet; page not opened"**, and every 3D AI Studio model/credit/texture claim as vendor marketing.
6. Blender: say **5.2 LTS (tagged 2026-07-13) is current**, Mixar pins exactly `v5.2.0`, the glTF add-on's `main` (5.4.4) targets Blender ≥ 5.3 in development, and **KHR_materials_variants export does exist** in the add-on's Variants UI; do not say Blender 5.3 is released.
7. Babylon: **9.30.0 (2026-10-08) verified**; the transmission helper's 1024² / 4× MSAA / half-float opaque render target is verified from source, but "the scene is drawn twice" and all mobile cost statements are **inferences to be measured**, not findings.
8. Present triangle/draw-call/texture budgets as **working assumptions**; the only sourced figures are Ready Player Me's per-slot caps and 20k outfit total (snippet) and a third-party ~15k profile.
9. Licensing paragraph: Hunyuan3D 2.x/Part/Omni community licences **exclude EU/UK/South Korea** (verified); PartPacker is non-commercial; TRELLIS.2, Pixal3D, PartCrafter, Hi3DGen are MIT (Pixal3D verified; the "academic-only" report is wrong).
10. Hunyuan3D 3.0/3.1 (and a listed 3.5) are **hosted-only**; 3.1's existence is supported by a Replicate listing, 3D AI Studio docs and Mixar's code slugs. ComfyUI's native Hunyuan3D nodes are **shape-only**; texturing needs a wrapper plus a compiled rasterizer, which is an **open blocker on Blackwell/Windows**, not a solved step.
11. TRELLIS.2 at 16 GB and multi-view: say the upstream repo requires 24 GB/Linux and is single-image, that ComfyUI native (v0.34.0, 2026-08-25) and community wrappers add int8/FP8 and multi-view, and that **16 GB fit is community-reported, untested here**.
12. Where sister notes disagreed (C2, C3, C4, C13, C14), use the reconciled statements above rather than either original sentence.

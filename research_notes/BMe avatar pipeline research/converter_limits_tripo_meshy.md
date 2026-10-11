# Image-to-3D input limits and internal preprocessing: Tripo (VAST) vs Meshy — as of 2026-10-10

Research scope: what each converter accepts as image-to-3D / multi-view input and what it does to that input before reconstruction. All facts were checked on **2026-10-10**. Evidence classes used: **Documented** (vendor doc/page), **Partner-documented** (reseller/partner API doc hosting the vendor model), **Code** (open-source source read directly), **Observed in a demonstration** (third-party hands-on article), **Inferred**, **Unverified / not publicly verified**. Nothing below was tested by this researcher.

**Access caveat (important for the report writer):** the research sandbox's egress proxy blocked direct fetches of `platform.tripo3d.ai`, `developers.tripo3d.ai/.com`, `docs.tripo3d.ai`, `www.tripo3d.ai`, `docs.meshy.ai`, `www.meshy.ai`, `help.meshy.ai`, `help.aliyun.com`, `fal.ai`, `runware.ai`, `arxiv.org`, `huggingface.co`, `docs.comfy.org`, `hackernoon.com` and `web.archive.org`. For those pages, facts were taken from search-engine indexed text of the official page (quoted as returned) rather than a full page read. Raw GitHub source files **were** fetched and read directly. Where a fact rests only on an indexed snippet it is still marked Documented, but the first thing to do with any number below that matters is open the linked page.

---

## Key Question 1 — Maximum accepted input width/height (pixels) for image-to-3D

### Takeaway
Neither vendor publishes a per-side pixel maximum on its own image-to-3D pages. The only hard pixel range found anywhere is Alibaba Cloud Model Studio's hosting of Tripo-H3.1/P1.0: **width and height each in [20, 6000] px**. Meshy has no documented pixel cap at all (file-size only). Both vendors publish only *minimum/recommended* resolutions.

### Cited Findings
**Tripo**
- Tripo API, `image_to_model` (platform docs, applies to all listed `model_version`s incl. v2.5/v3.0/v3.1/P1): "Supports JPEG and PNG formats with a maximum size of 20MB … The suggested resolution should be more than 256 x 256px." — no maximum stated. [Documented, 2026-10-10] — [platform.tripo3d.ai/docs/generation](https://platform.tripo3d.ai/docs/generation)
- Tripo API `multiview_to_model` (P1-20260311 page): "The suggested resolution should be more than 256 x 256px. Supports JPEG and PNG formats with a maximum size of 20MB." Front view mandatory; at least two images. [Documented, 2026-10-10] — [docs.tripo3d.ai multiview-to-model P1](https://docs.tripo3d.ai/model-generation/multiview-to-model-p1-20260311.html)
- Tripo H-series multiview docs (developers portal): front view mandatory, at least 2 images, "PNG, JPEG, and WebP", "recommended resolution of at least 256 × 256 px". [Documented, 2026-10-10] — [developers.tripo3d.com multiview-to-model (H series)](https://developers.tripo3d.com/en/docs/generation-multiview-to-model/standard.md)
- **Hard pixel range (partner API):** Alibaba Cloud Model Studio API reference for `Tripo/Tripo-H3.1` and `Tripo/Tripo-P1.0` (Chinese page): "图像限制：格式：JPEG、PNG。分辨率：宽和高的范围为[20, 6000]像素，建议边长大于256像素。文件大小：不超过20MB。" (= JPEG/PNG; width and height each 20–6000 px; >256 px recommended; ≤20 MB). English guide snippet gives the same "20–6,000 pixels per side". [Partner-documented, 2026-10-10] — [help.aliyun.com (zh) tripo-3d-generation-api-reference](https://help.aliyun.com/zh/model-studio/tripo-3d-generation-api-reference); [help.aliyun.com (en) tripo-3d-generation-guide](https://help.aliyun.com/en/model-studio/tripo-3d-generation-guide)
- Tripo help article: "aim for at least 1024x1024"; below 512 px "the geometry gets muddy". [Documented (help center), 2026-10-10] — [tripo3d.ai help: how to get better image-to-3D results](https://www.tripo3d.ai/help/features/how-to-get-better-image-to-3d-results)
- Tripo tutorial (marketing): "high-resolution inputs (preferably 2048×2048 pixels or higher) directly determine the level of detail in the generated mesh". [Documented (marketing tutorial), 2026-10-10] — [tripo3d.ai tutorial: best image types](https://www.tripo3d.ai/tutorials/tripo-ai-best-image-types)

**Meshy**
- Meshy web app docs: "resolution ≥ 512×512" recommended; no maximum stated. [Documented, 2026-10-10] — [docs.meshy.ai webapp image-to-3d](https://docs.meshy.ai/en/webapp/image-to-3d)
- Meshy help article: "1024 × 1024 px or higher is ideal". [Documented, 2026-10-10] — [help.meshy.ai 15723519](https://help.meshy.ai/en/articles/15723519-how-to-get-better-image-to-3d-results-in-meshy)
- Meshy tutorial (localized versions returned; English page exists): "short side ≥ 1024 px; 2048 px or higher recommended if you plan to use Refine mode". [Documented (tutorial), 2026-10-10] — [meshy.ai tutorial image-to-3d-model-complete-guide (nl)](https://www.meshy.ai/nl/tutorials/image-to-3d-model-complete-guide); [ja version](https://www.meshy.ai/ja/tutorials/image-to-3d-model-complete-guide)
- Meshy API image-to-3D page: states formats and URL/data-URI input; no width/height/pixel limit stated. [Documented, 2026-10-10] — [docs.meshy.ai API image-to-3d](https://docs.meshy.ai/en/api/image-to-3d)
- Meshy API errors page lists `image_too_complex` (subject geometric complexity), not any "image too large"/resolution error. [Documented, 2026-10-10] — [docs.meshy.ai API errors (zh mirror returned)](https://docs.meshy.ai/zh/api/errors)
- Meshy's own image-to-STL page: "very large files don't improve quality, as a sharp, well-framed image at moderate resolution works best". [Documented (marketing), 2026-10-10] — [meshy.ai image→STL converter page](https://www.meshy.ai/3d-tools/file-converter/image/to/stl)

### Inferences
- The 6000 px/side cap on Alibaba's hosting is most plausibly a Tripo backend validation that Alibaba surfaced, since it sits alongside Tripo's own 256 px / 20 MB wording — but it could equally be an Alibaba gateway rule. Treat 6000 px/side as the best available upper bound for Tripo, **not** confirmed on Tripo's own API.
- For both vendors, a 4K–8K master is in practice bounded by file size (20 MB web, see Q3), not by pixels; an 8192² PNG with alpha will often exceed 20 MB unless compressed/JPEG.

### Gaps
- Tripo's own API/web app max pixel dimension: **not publicly verified**. Pages checked: platform.tripo3d.ai/docs/upload, platform.tripo3d.ai/docs/generation, developers.tripo3d.ai/en/docs/files, developers.tripo3d.com/en/docs/generation-multiview-to-model/standard.md, docs.tripo3d.ai/model-generation/image-to-model-v3-0-v3-1.html, docs.tripo3d.ai/model-generation/multiview-to-model-p1-20260311.html, studio.tripo3d.ai/workspace/generate, tripo3d.ai help/tutorial pages above.
- Meshy max pixel dimension (web and API): **not publicly verified**. Pages checked: docs.meshy.ai/en/api/image-to-3d, docs.meshy.ai/en/api/multi-image-to-3d, docs.meshy.ai/en/webapp/image-to-3d, docs.meshy.ai/*/api/errors, help.meshy.ai 9996860 and 15723519, meshy.ai/features/image-to-3d, meshy.ai/tutorials/api-quickstart-image-to-3d, meshy.ai/tutorials/multi-view-image-to-3d.
- **Shortest reliable test:** (a) Tripo API: `POST /v2/openapi/upload/sts` (or `/upload`) with a 8192×8192 PNG < 20 MB, then `image_to_model`; read the error body; repeat at 6001×6001 vs 6000×6000 to confirm the Alibaba-reported bound. (b) Meshy API: submit `image_url` as a data-URI of an 8192×8192 PNG and a 4096×4096 PNG to `/openapi/v1/image-to-3d`; read the 4xx body. Both vendors refund/don't charge failed tasks (Tripo: credits frozen on create, deducted on success — [developers.tripo3d.com billing](https://developers.tripo3d.com/en/docs/billing.md)).

---

## Key Question 2 — Total-pixel, megapixel or aspect-ratio limits

### Takeaway
No megapixel/total-pixel limit is documented by either vendor. No hard aspect-ratio limit is documented; Tripo's own guidance says square (1:1) "works best" and to crop non-square inputs to square, Meshy recommends a centered subject on a plain background and 1:1 only for its *image generator* output destined for 3D.

### Cited Findings
- Tripo blog: "Square aspect ratios (1:1) work best for most 3D conversion scenarios. For non-square images, crop to a square format before conversion or use tools that automatically handle aspect ratio adjustments. Maintain the subject's proportions by centering the focal point within the frame." [Documented (blog), 2026-10-10] — [tripo3d.ai blog: JPG to 3D image dimensions](https://www.tripo3d.ai/blog/explore/jpg-3d-image-dimensions-best-practices)
- Alibaba hosting of Tripo: only per-side [20, 6000] px range — no aspect or megapixel constraint stated. [Partner-documented, 2026-10-10] — [help.aliyun.com (zh)](https://help.aliyun.com/zh/model-studio/tripo-3d-generation-api-reference)
- Meshy image generator (not image-to-3D upload): "1:1 recommended for 3D conversion; 16:9, 9:16, 4:3, and 3:4 also available." [Documented, 2026-10-10] — [help.meshy.ai 12005614 how to create images](https://intercom.help/meshy/en/articles/12005614-how-to-create-images-in-meshy)
- Meshy image-to-3D docs: "center a single object in each view image and avoid cluttered or distracting backgrounds"; no aspect requirement. [Documented, 2026-10-10] — [docs.meshy.ai webapp image-to-3d](https://docs.meshy.ai/en/webapp/image-to-3d)
- ComfyUI `TripoSplat Preprocess Image` node (open-source Tripo research model, not the hosted API): "crops each input image to a centered square on a black background, then adds padding to reach the specified output size … default size is 1024, and the model is trained at 1024; other sizes run but are off-distribution." [Documented (third-party node doc for a VAST open model), 2026-10-10] — [docs.comfy.org TripoSplatPreprocessImage](https://docs.comfy.org/built-in-nodes/TripoSplatPreprocessImage)

### Inferences
- Both vendors' pipelines almost certainly square-pad internally (every VAST open-source lineage model does — see Q6), so a non-square stitched master will be letterboxed, wasting resolution. Pre-cropping to a square around the subject is the safe move for both.

### Gaps
- No vendor statement on megapixel limits or on what happens to extreme aspect ratios (e.g., 2:1) at the hosted API; **not publicly verified**.

---

## Key Question 3 — Maximum file size and supported formats (incl. alpha)

### Takeaway
Tripo: **20 MB**, JPEG/PNG on the API upload endpoint (WebP accepted on the Studio web UI and on the image-to-multiview endpoint). Meshy: **20 MB** PNG/JPG/JPEG/WebP in the web app; API accepts .jpg/.jpeg/.png via URL or base64 data-URI, and a Meshy tutorial states an API cap of **100 MB** (not on the API reference page itself). Transparent PNG is accepted by both; neither documents alpha semantics for the API.

### Cited Findings
**Tripo**
- API File Upload: "Images must be JPEG or PNG, with a maximum of 20 MB." [Documented, 2026-10-10] — [developers.tripo3d.ai/en/docs/files](https://developers.tripo3d.ai/en/docs/files)
- `image_to_model`: "Supports JPEG and PNG formats with a maximum size of 20MB" (applies to URL inputs too). [Documented, 2026-10-10] — [platform.tripo3d.ai/docs/generation](https://platform.tripo3d.ai/docs/generation)
- Studio web UI upload hint: "JPG, PNG, WEBP … Size ≤ 20MB". [Documented (web UI text as indexed), 2026-10-10] — [studio.tripo3d.ai/workspace/generate](https://studio.tripo3d.ai/workspace/generate/)
- Image-to-Multiview endpoint (API v3): "Formats: PNG, JPEG, WebP." [Documented, 2026-10-10] — [developers.tripo3d.com image-to-multiview](https://developers.tripo3d.com/en/docs/generation-image-to-multiview.md)
- Older tutorials: "under 10MB", and format list "JPEG, PNG, and TIFF". These conflict with the current 20 MB / JPEG+PNG API docs; treat as stale marketing. [Documented but conflicting, 2026-10-10] — [tripo3d.ai tutorial best image types](https://www.tripo3d.ai/tutorials/tripo-ai-best-image-types)
- Alpha: open-source TripoSG preprocessing uses a valid alpha channel as the foreground mask instead of running background removal (`if not is_valid_alpha(alpha): alpha = None`; else composite over bg). Hosted-API alpha handling not documented. [Code (open model), 2026-10-10] — [TripoSG scripts/image_process.py](https://raw.githubusercontent.com/VAST-AI-Research/TripoSG/main/scripts/image_process.py)

**Meshy**
- Web app: "Supported formats: .png, .jpg, .jpeg, .webp (max 20 MB)". [Documented, 2026-10-10] — [help.meshy.ai 9996860](https://help.meshy.ai/en/articles/9996860-how-to-use-meshy-image-to-3d); [meshy.ai/features/image-to-3d](https://www.meshy.ai/features/image-to-3d)
- API: "There are two ways to provide the image: Publicly accessible URL … Data URI: A base64-encoded data URI of the image." "We currently support .jpg, .jpeg, and .png formats." [Documented, 2026-10-10] — [docs.meshy.ai API image-to-3d](https://docs.meshy.ai/en/api/image-to-3d)
- Meshy tutorial: "the Image to 3D API supports JPG, JPEG, and PNG images up to 100 MB — larger than the 20 MB limit in the Meshy Workspace UI." [Documented (tutorial, ~190 days old, predates meshy-7.1), 2026-10-10] — [meshy.ai tutorial api-quickstart-image-to-3d](https://www.meshy.ai/tutorials/api-quickstart-image-to-3d)
- Meshy tutorial: "Supported inputs are PNG, JPG, and WebP. Transparent PNGs work well." [Documented (tutorial), 2026-10-10] — [meshy.ai tutorial complete guide (cs)](https://www.meshy.ai/cs/tutorials/image-to-3d-model-complete-guide)
- Meshy standalone AI Background Removal tool: "JPG or PNG up to 10MB", outputs transparent PNG, "recommended first step before Image to 3D". [Documented, 2026-10-10] — [docs.meshy.ai background-removal guide](https://docs.meshy.ai/en/webapp/guides/image/background-removal)

### Inferences
- A 20 MB ceiling is the practical constraint for an 8K master on both web apps; an 8192² RGBA PNG of a detailed character typically exceeds 20 MB. JPEG at 8K fits but loses alpha. Meshy's API (100 MB per tutorial) is the only route documented to accept a very large PNG.

### Gaps
- Meshy API file-size limit is stated only in a tutorial, not on the API reference; **not fully verified**. Shortest test: POST a ~25 MB data-URI PNG to `/openapi/v1/image-to-3d` and read the response.
- Tripo WebP acceptance on the API `upload` endpoint: **not publicly verified** (docs say JPEG/PNG; UI says WebP).

---

## Key Question 4 — Do limits differ by web app vs API, model version, or plan?

### Takeaway
Documented differences are small: Tripo's web UI lists WebP where the API upload doc lists only JPEG/PNG; Meshy's API has a larger stated file cap (100 MB) than the web app (20 MB). No vendor documents different *input* limits per model version or plan. Plan/version gating exists for *outputs/features* (Meshy Ultra modes & downloads need paid plans; 4K/8K textures need specific `ai_model`s), not for input size.

### Cited Findings
- Tripo `model_version` values for `image_to_model` (current): `P1-20260311`, `Turbo-v1.0-20250506`, `v3.1-20260211`, `v3.0-20250812`, `v2.5-20250123`; the same 20 MB / >256 px input wording applies to all. [Documented, 2026-10-10] — [platform.tripo3d.ai/docs/generation](https://platform.tripo3d.ai/docs/generation); [developers.tripo3d.ai models-and-versions](https://developers.tripo3d.ai/en/docs/models-and-versions)
- Tripo H3 = v3.0/v3.1 ("H3 supports two model versions: v3.1-20260211 and v3.0-20250812"); v3.1 is default. [Documented, 2026-10-10] — [docs.tripo3d.ai image-to-model (H3)](https://docs.tripo3d.ai/model-generation/image-to-model-v3-0-v3-1.html); [developers.tripo3d.ai/en/models/v3-1](https://developers.tripo3d.ai/en/models/v3-1)
- Tripo H3.1 and P1.0 announced for GDC 2026 (press release 2026-03-09). [Documented, 2026-10-10] — [PRNewswire via StreetInsider](https://www.streetinsider.com/PRNewswire/Tripo+AI+Debuts+Production-Grade+Native+3D+Diffusion+at+GDC+2026/26130831.html)
- Meshy `ai_model` values for image-to-3D: `meshy-6-lite`, `meshy-6`, `meshy-7.1`, `latest` (= meshy-7.1); `meshy-7` deprecated but still works. [Documented, 2026-10-10] — [docs.meshy.ai API changelog](https://docs.meshy.ai/en/api/changelog); [docs.meshy.ai API image-to-3d](https://docs.meshy.ai/en/api/image-to-3d)
- Meshy 7 released 2026-08-10; Meshy 7.1 release note dated 2026-09-10 (press republication says 2026-09-16). [Documented/third-party, 2026-10-10] — [neural4d blog](https://blog.neural4d.com/comparisons/meshy-7-release-date-and-alternative/); [TechNode press release](https://technode.global/?p=993278)
- Meshy 7.1: "Ultra 2K and 4K modes, and downloads of Meshy 7.1 models, require a paid subscription"; Ultra 4K is single-view only. [Documented (press release), 2026-10-10] — [Webull/PRN copy](https://www.webull.com/news/15616957784278016)
- Meshy plan difference found: "Pro users getting 4 free retries and Studio users getting 8 per task"; no source says input size differs by plan. [Third-party, 2026-10-10] — [help.scenario.com Meshy essentials](https://help.scenario.com/articles/5709143930-meshy-the-essentials)
- Meshy web vs API file size: 20 MB vs 100 MB (see Q3 sources).

### Inferences
- Input limits appear to be enforced at the upload/gateway layer independent of model version for both vendors. Any version-specific internal resize is undocumented (Q5/Q6).

### Gaps
- No vendor changelog entry about changing input resolution handling between versions was found; **not publicly verified**.

---

## Key Question 5 — Is the input internally resized, cropped, padded, or background-removed before reconstruction?

### Takeaway
Neither vendor documents an internal resize for the hosted service. Both offer/recommend background removal (Tripo: automatic per tutorials; Meshy: a user-triggered "Remove Background" and an "Image Enhancement" On/Off pre-processing toggle). The only concrete preprocessing facts come from VAST's open-source research models (TripoSR, TripoSG, TripoSplat), all of which remove background, crop to the subject's bounding box, pad to a square with margin, and resize to a fixed small square before encoding (see Q6).

### Cited Findings
**Tripo (hosted)**
- No statement found on tripo3d.ai docs about internal resizing. Help center only gives minimum/recommended sizes. [Gap] — [help: better image-to-3D results](https://www.tripo3d.ai/help/features/how-to-get-better-image-to-3d-results)
- Tripo's image-to-multiview docs: "The subject should stand out clearly against a clean background." [Documented, 2026-10-10] — [developers.tripo3d.com image-to-multiview](https://developers.tripo3d.com/en/docs/generation-image-to-multiview.md)

**Tripo (open-source lineage, read from code)**
- TripoSR `run.py`: `rembg.remove(...)` background removal; `resize_foreground(image, args.foreground_ratio)` with default `0.85` ("Ratio of the foreground size to the image size"); composite onto mid-grey `0.5`; `--no-remove-bg` expects "an RGB image with gray background and properly-sized foreground". [Code, 2026-10-10] — [TripoSR run.py](https://raw.githubusercontent.com/VAST-AI-Research/TripoSR/main/run.py)
- TripoSR `tsr/utils.py`: `resize_foreground` crops to alpha>0 bbox, pads to square, pads to `new_size = int(shape/ratio)`; `ImagePreprocessor.convert_and_resize` does `F.interpolate(..., (size, size), mode="bilinear", align_corners=False, antialias=True)` — always a square `size×size` output. [Code, 2026-10-10] — [TripoSR tsr/utils.py](https://raw.githubusercontent.com/VAST-AI-Research/TripoSR/main/tsr/utils.py)
- TripoSG `scripts/image_process.py`: BriaRMBG background removal (RMBG input resized to 1024×1024 and 384×384 for the net), Otsu threshold, `remove_small_objects(min_size=200)`, bbox crop `find_bounding_box(alpha)`, `padding_ratio` default `0.1`, padding adjusted so the result is square, composite `rgb*alpha + bg_color*(1-alpha)`; the padded crop itself is **not** resized to a fixed size at this stage. `inference_triposg.py` calls `prepare_image(image_input, bg_color=np.array([1.0,1.0,1.0]), rmbg_net=rmbg_net)` (white background). [Code, 2026-10-10] — [TripoSG image_process.py](https://raw.githubusercontent.com/VAST-AI-Research/TripoSG/main/scripts/image_process.py); [TripoSG inference_triposg.py](https://raw.githubusercontent.com/VAST-AI-Research/TripoSG/main/scripts/inference_triposg.py)
- TripoSG `pipeline_triposg.py`: `encode_image` runs `self.feature_extractor_dinov2(image, return_tensors="pt").pixel_values` (a `BitImageProcessor`) then `Dinov2Model(...).last_hidden_state`; the processor's resize/crop sizes live in the HF `preprocessor_config.json`. [Code, 2026-10-10] — [TripoSG pipeline_triposg.py](https://raw.githubusercontent.com/VAST-AI-Research/TripoSG/main/triposg/pipelines/pipeline_triposg.py)
- TripoSplat (ComfyUI preprocess node): centered square crop on black, pad to 1024, "model is trained at 1024". [Documented (node doc), 2026-10-10] — [docs.comfy.org TripoSplatPreprocessImage](https://docs.comfy.org/built-in-nodes/TripoSplatPreprocessImage)

**Meshy (hosted)**
- "Image Enhancement" setting: "On: AI pre-processes to improve image quality; Off: preserves original, best for high-quality inputs." Troubleshooting: if the model ignores detail because "image resolution too low", enable Image Enhancement or provide a higher-resolution input. [Documented, 2026-10-10] — [docs.meshy.ai webapp image-to-3d](https://docs.meshy.ai/en/webapp/image-to-3d)
- Help center: Image Enhancement "sharpens details, improves contrast, and reduces noise"; "Remove Background" button in the upload area; for multi-view "run the background remover on every uploaded view". [Documented, 2026-10-10] — [help.meshy.ai 9996860](https://help.meshy.ai/en/articles/9996860-how-to-use-meshy-image-to-3d)
- Meshy publishes no model architecture or preprocessing description. [Third-party research note; consistent with absence of any Meshy paper] — [jangtrinh/design-os-3d-blender research/how-image-to-3d-works.md](https://github.com/jangtrinh/design-os-3d-blender/blob/0fa32f46f261009f14cf318c8c4b3137f210a667/research/how-image-to-3d-works.md)

### Inferences
- **Inferred:** every VAST open model does bg-removal → bbox crop → square pad with 10–15% margin → fixed square resize before the image encoder. It is very likely the hosted Tripo v2.5/v3.x/H3.1 pipeline does the same class of operation (with a proprietary, probably larger, encoder input), so (a) pixels outside the subject bbox are discarded, (b) the subject is re-centered regardless of your framing, and (c) the effective resolution is set by the encoder, not by your file.
- **Inferred:** Meshy's "Image Enhancement" is an upscale/sharpen pre-pass; its existence (and the advice to turn it Off for high-quality inputs) implies Meshy's pipeline has a working resolution that low-res inputs fall below, but gives no number.

### Gaps
- Hosted Tripo and Meshy internal resize/crop behaviour: **not publicly verified**. No Discord/Reddit staff statement giving a processing resolution was found in searches ("Tripo resizes input internally", "Meshy image to 3d downscaled 2048 1024", "resolution too high" error).
- Shortest test: upload the same subject as (i) 1024², (ii) 4096², (iii) 4096² with the subject occupying only 25% of the frame, (iv) a 2:1 non-square version; compare meshes/textures. If (iii) ≈ (i) in detail, the pipeline crops-and-rescales to the subject bbox; if (ii) ≈ (i), input is downsampled to ≤1K before encoding.

---

## Key Question 6 — Effective image resolution used for geometry and for texture (incl. underlying research encoders)

### Takeaway
For the hosted products: **not documented by either vendor.** For VAST's open lineage: TripoSR conditions on DINO ViT-B/16 at **512×512** (`cond_image_size: 512`); TripoSG (2025) uses DINOv2-large whose shipped `BitImageProcessor` resizes shortest edge to 256 and center-crops to **224×224** (257 tokens), even though the DINOv2 config's position table is 518. For comparison, Hunyuan3D-2 conditions DINOv2-Giant at 518×518 and LATTICE (CVPR 2026) at 1022. Meshy has published no model, so no encoder resolution is knowable.

### Cited Findings
**TripoSR (VAST + Stability, March 2024)**
- Config: `cond_image_size: 512`; `image_tokenizer_cls: ...DINOSingleImageTokenizer`; `pretrained_model_name_or_path: "facebook/dino-vitb16"`. [Code (vendored config), 2026-10-10] — [ComfyUI-3D-Pack Configs/TripoSR_config.yaml](https://github.com/MrForExample/ComfyUI-3D-Pack/blob/9e8096e50c5bcf35e1f3e34c6ae06216101f8a11/Configs/TripoSR_config.yaml)
- Independent export notes: "`cond_image_size` **512** … Image normalization `/255` only, no mean/std" and encoder input `[1, 3, S, S] S = cfg.cond_image_size (512)`. [Code/third-party notes, 2026-10-10] — [QtMeshEditor docs/IMAGE_TO_3D_SPIKE_764.md](https://github.com/fernandotonon/QtMeshEditor/blob/800a36c802f98392655c6d98408a6b390a8e8a63/docs/IMAGE_TO_3D_SPIKE_764.md)
- Tokenizer: `class DINOSingleImageTokenizer`, default `"facebook/dino-vitb16"`, `interpolate_pos_encoding=True`. [Code, 2026-10-10] — [TripoSR tsr/models/tokenizers/image.py](https://raw.githubusercontent.com/VAST-AI-Research/TripoSR/main/tsr/models/tokenizers/image.py)
- Output texture bake default `--texture-resolution 2048`; marching cubes default 256. [Code, 2026-10-10] — [TripoSR run.py](https://raw.githubusercontent.com/VAST-AI-Research/TripoSR/main/run.py)

**TripoSG (VAST, Feb 2025, arXiv 2502.06608)**
- Encoder: `image_encoder_dinov2/config.json` = `facebook/dinov2-large`, hidden 1024, patch 14, 24 layers, "`image_size` 518 (position table base; interpolated down at runtime)". Preprocessor: "`BitImageProcessor`, resize `shortest_edge: 256` (resample 3 = bicubic), `do_center_crop` to **224×224**, normalize ImageNet mean/std". "DINOv2 runs at **224**, giving `1 + (224/14)² = 257` tokens"; `image_embeds` shape `[1, 257, 1024]`. [Third-party export notes derived from the HF weights; corroborated by a second independent port, 2026-10-10] — [QtMeshEditor docs/TRIPOSG_EXPORT_NOTES.md](https://raw.githubusercontent.com/fernandotonon/QtMeshEditor/800a36c802f98392655c6d98408a6b390a8e8a63/docs/TRIPOSG_EXPORT_NOTES.md); corroboration: Rust port test asserts `size_shortest_edge == Some(256)` and `crop_size == Some([224, 224])` — [mosure/bevy_synth image_encoder.rs](https://github.com/mosure/bevy_synth/blob/c0313a4055ca106ed50c01d3b04e4d0ddde82239/crates/burn_tripo/src/model/triposg/image_encoder.rs)
- Weights location (not fetchable from sandbox): [huggingface.co/VAST-AI/TripoSG image_encoder_dinov2](https://www.huggingface.co/VAST-AI/TripoSG/tree/main/image_encoder_dinov2)

**Comparators (not Tripo products, for calibration)**
- Hunyuan3D-2 paper: "we utilize a large image encoder – DINOv2 Giant and large input image size – 518×518". [Third-party notes quoting paper, 2026-10-10] — [jangtrinh research/hunyuan3d.md](https://github.com/jangtrinh/design-os-3d-blender/blob/0fa32f46f261009f14cf318c8c4b3137f210a667/research/hunyuan3d.md)
- LATTICE (CVPR 2026): DINOv2-Giant conditioning "with resolution increased to 1022 (compared to 518 in Hunyuan3D-2) to preserve detail. Objects are cropped according to a binary mask to maintain the aspect ratio." [Third-party paper notes, 2026-10-10] — [zhaoyang97/Paper-Notes-en LATTICE](https://github.com/zhaoyang97/Paper-Notes-en/blob/148a16dd45b148e890b4428db21133e5a1589b77/docs/CVPR2026/3d_vision/lattice_democratize_high-fidelity_3d_generation_at_scale.md)
- "Tripo's shipping v2.5/v3.x models are not documented publicly; TripoSG is the closest published proxy, not a statement about the product." [Third-party research note, 2026-10-10] — [jangtrinh how-image-to-3d-works.md](https://github.com/jangtrinh/design-os-3d-blender/blob/0fa32f46f261009f14cf318c8c4b3137f210a667/research/how-image-to-3d-works.md)

**Meshy**
- Meshy 7.1 Ultra 4K: "raises geometry generation from 2048³ to 4096³ … up to 80 million triangles before simplification" — this is *output voxel/geometry* resolution, not input image resolution. [Documented (press)/third-party, 2026-10-10] — [neural4d](https://blog.neural4d.com/comparisons/meshy-7-release-date-and-alternative/); [TechNode press release](https://technode.global/?p=993278)

### Inferences
- **Inferred:** state-of-the-art native-3D diffusion conditioning sits between 224 px (TripoSG as shipped) and ~1022 px (LATTICE) on the subject crop. Even if Tripo H3.1 and Meshy 7.1 use a 1K-class encoder, anything beyond ~1024–2048 px on the subject's bounding box is discarded for *geometry*. Texture pipelines (multi-view texture diffusion/projection) may use higher-res conditioning but no vendor says so.
- **Inferred:** therefore a 4K–8K stitched master would, for geometry, be equivalent to a clean ~1K–2K square crop of the subject.

### Gaps
- Hosted Tripo (v2.5/v3.0/v3.1/H3.1/P1) and Meshy (5/6/7/7.1) encoder input resolution: **not publicly verified**. arXiv HTML of TripoSG/TripoSR could not be fetched from the sandbox; the TripoSG numbers above come from two independent code ports reading the official HF weights, not the paper text.

---

## Key Question 7 — Output texture resolution options and plan dependence (kept separate from input limits)

### Takeaway
Tripo: `texture_quality` standard/detailed on the API (`fast/standard/detailed/extreme` on one reseller endpoint); product line now advertises 2K Standard / 4K HD / 8K Ultra textures (8K native 8192² BaseColor, 4K normal/ORM, announced Aug 2026). Meshy API: `texture_resolution` 2k/4k/8k (default 2k); 4K/8K require `meshy-6`, `meshy-7.1` or `latest`; 8K drops the emission map and disallows quad topology; 8K costs +5 credits.

### Cited Findings
**Tripo**
- API `texture_quality`: "standard" (+10 credits on P1) and "detailed (high-resolution textures)" (+20 on P1); H2/H3 `texture_quality=detailed` adds 10 credits. [Documented, 2026-10-10] — [platform.tripo3d.ai/docs/generation](https://platform.tripo3d.ai/docs/generation); [docs.tripo3d.ai pricing](https://docs.tripo3d.ai/get-started/pricing.html)
- Reseller (WaveSpeed, P2 endpoint): `texture_quality` "fast, standard, detailed, or extreme", default standard; enabling PBR enables texture billing. [Partner-documented, 2026-10-10] — [wavespeed.ai tripo3d-p2-image-to-3d](https://wavespeed.ai/docs/docs-api/tripo3d/tripo3d-p2-image-to-3d)
- Press release 2026-08-17: "Tripo 8K Texture system offers multiple texture resolution options, including 2K Standard, 4K HD, and 8K Ultra … generates native 8192×8192 BaseColor textures". [Documented (company PR), 2026-10-10] — [marketersmedia PR](https://news.marketersmedia.com/tripo-launches-8k-texture-to-advance-production-ready-ai-3d-asset-creation/89201029)
- Jon Peddie interview: "The highest setting is an 8K base color texture, with 4K normal and ORM maps" (stated for P1.0). [Third-party interview, 2026-10-10] — [jonpeddie.com](https://www.jonpeddie.com/news/tripo-ai-aims-to-revolutionize-the-3d-content-creation-landscape/)
- Earlier Tripo blog (pre-8K): "Tripo currently supports HD textures up to 4K, with 8K support on the roadmap." [Documented, superseded] — [tripo3d.ai blog texture resolution strategy](https://www.tripo3d.ai/blog/explore/texture-resolution-strategy-1k-2k-4k-8k)
- Plan gating of 2K/4K/8K textures in the Tripo web app: **not publicly verified**.

**Meshy**
- `texture_resolution`: "One of 2k (2048×2048), 4k (4096×4096), or 8k (8192×8192)", default 2k; "At 8k, no emission map is produced and topology: quad is not supported"; older page: "4k and 8k are not available with ai_model: meshy-5"; current: not available with `meshy-6-lite`; multi-image page: 4k/8k "require ai_model meshy-6, meshy-7.1 or latest". [Documented, 2026-10-10] — [docs.meshy.ai API image-to-3d](https://docs.meshy.ai/en/api/image-to-3d); [docs.meshy.ai API multi-image-to-3d](https://docs.meshy.ai/en/api/multi-image-to-3d); [changelog](https://docs.meshy.ai/en/api/changelog)
- 8K texture "costs 5 extra credits" (reseller listing echoing Meshy pricing). [Partner-documented, 2026-10-10] — [atlascloud.ai meshy-v7 image-to-3d](https://www.atlascloud.ai/models/meshy-v7/image-to-3d)
- Third-party: "paid plans for 4K/8K; free tier defaults lower (2K)". [Unverified third-party] — [gamineai.com](https://gamineai.com/blog/how-to-use-meshy-8k-texture-first-indie-hero-asset-evening-2026)

### Inferences
- Output texture resolution is decoupled from input resolution in both products: an 8K texture is *generated* by the texture model, not sampled from the source image, so input detail beyond the texture model's conditioning resolution does not transfer 1:1.

### Gaps
- Exact web-app plan tiers for 4K/8K on both vendors: not publicly verified in sources reachable here (pricing pages blocked).

---

## Key Question 8 — Multi-view / multi-image input

### Takeaway
Tripo `multiview_to_model`: front view mandatory, 2–4 views (front/left/back/right slots), same 20 MB / >256 px rules. Meshy multi-image: 1–4 images; on meshy-7.1 the first image is the front view and the rest are order-free; Ultra 4K is single-view only (Ultra 2K supports multi-view). Both vendors claim extra views add geometric information; one hands-on article found multi-view preserved raised surface detail better than a single image. No controlled test versus a single large image was found.

### Cited Findings
- Tripo H-series multiview: "front view is mandatory, you may omit other views, but at least 2 images are required"; PNG/JPEG/WebP; ≥256×256 recommended. [Documented, 2026-10-10] — [developers.tripo3d.com multiview-to-model standard](https://developers.tripo3d.com/en/docs/generation-multiview-to-model/standard.md)
- Tripo image-to-multiview returns "front, left, back, and right view image URLs" (Tripo's own view convention). [Documented, 2026-10-10] — [developers.tripo3d.com image-to-multiview](https://developers.tripo3d.com/en/docs/generation-image-to-multiview.md)
- Tripo H3.1 "supports text prompts, single images, and multiview inputs natively". [Documented, 2026-10-10] — [developers.tripo3d.ai/en/models/v3-1](https://developers.tripo3d.ai/en/models/v3-1)
- Meshy API: "Provide 1 to 4 images for Meshy to use in model creation"; "For meshy-7.1 (or latest), the first image is used as the primary (front) view. The order of the remaining images doesn't matter." [Documented, 2026-10-10] — [docs.meshy.ai API multi-image-to-3d](https://docs.meshy.ai/en/api/multi-image-to-3d)
- Meshy: Multi-View "currently only supported on Meshy 7"; costs 20 credits by default; needs a paid plan; tips: remove backgrounds from every view, use clear high-resolution images; results "can still look symmetrical if the uploaded views are too similar". [Documented, 2026-10-10] — [meshy.ai tutorial multi-view](https://www.meshy.ai/tutorials/multi-view-image-to-3d); [help.meshy.ai 9996860](https://help.meshy.ai/en/articles/9996860-how-to-use-meshy-image-to-3d)
- Meshy 7.1: "Ultra 4K currently supports single-view generation only; Ultra 2K supports single-view and multi-view". [Documented (press), 2026-10-10] — [Webull/PRN](https://www.webull.com/news/15616957784278016)
- Meshy docs: "very fine details, such as hair strands or intricate surface patterns, are hard to reconstruct from a single image"; extra views "give the AI more geometric information". [Documented, 2026-10-10] — [docs.meshy.ai webapp image-to-3d](https://docs.meshy.ai/en/webapp/image-to-3d)
- Hands-on (anime character, Meshy multiview vs single): single-image result "looked flatter and more generic", decals/rivets "sank toward the base surface"; multi-view "kept those details standing off the surface"; text legibility equal. [Observed in a demonstration, 2026-10-10] — [HackerNoon multiview vs single-image](https://hackernoon.com/i-ran-the-same-anime-character-through-meshy-multiview-and-single-image-3d)
- Independent 4-generator comparison on a four-view backpack: "a single photo forces everything it doesn't show to be guessed". [Observed in a demonstration, 2026-10-10] — [ufo3d.com](https://ufo3d.com/?p=11629)
- Scenario (reseller) Tripo 3.0 multiview examples. [Observed in a demonstration] — [scenario.com blog](https://www.scenario.com/blog/tripo-30-multiview-examples-eeda996)

### Inferences
- **Inferred:** because each view is independently cropped/encoded at the same conditioning resolution, 4 views deliver ~4× the encoded pixels of one view *and* disambiguate occluded geometry; a single 8K image cannot do either. Multi-view is the only documented lever that increases information reaching the geometry model.

### Gaps
- No credible test comparing "one 4K–8K image" against "four 1–2K views" was found for either vendor.

---

## Key Question 9 — Evidence that a larger/more detailed source image improves results vs ~1K–2K

### Takeaway
No documented evidence or credible controlled test was found for either vendor. Vendor guidance tops out at "≥1024 px" (both) and "2048 px recommended for Refine" (Meshy) / "preferably 2048×2048 or higher" (Tripo tutorial). Meshy's own converter page says very large files do not improve quality.

### Cited Findings
- Tripo tutorial: "high-resolution inputs (preferably 2048×2048 pixels or higher) directly determine the level of detail in the generated mesh." [Documented (marketing claim, no test), 2026-10-10] — [tripo3d.ai tutorial](https://www.tripo3d.ai/tutorials/tripo-ai-best-image-types)
- Tripo help: at least 1024×1024; below 512 px geometry gets muddy. [Documented, 2026-10-10] — [tripo3d.ai help](https://www.tripo3d.ai/help/features/how-to-get-better-image-to-3d-results)
- Meshy: ≥512 (docs), 1024 ideal (help), short side ≥1024 / ≥2048 for Refine (tutorial). [Documented, 2026-10-10] — [docs.meshy.ai](https://docs.meshy.ai/en/webapp/image-to-3d); [help 15723519](https://help.meshy.ai/en/articles/15723519-how-to-get-better-image-to-3d-results-in-meshy); [tutorial](https://www.meshy.ai/nl/tutorials/image-to-3d-model-complete-guide)
- Meshy: "very large files don't improve quality, as a sharp, well-framed image at moderate resolution works best". [Documented (marketing), 2026-10-10] — [meshy.ai image-to-STL page](https://www.meshy.ai/3d-tools/file-converter/image/to/stl)
- All3DP hands-on of Meshy 7.1 Ultra 4K found gains "on predictable geometry" (output-resolution test, not input-resolution). [Observed in a demonstration, 2026-10-10] — [all3dp.com Meshy 7.1 test](https://all3dp.com/1/we-tested-meshy-7-1-does-the-new-ultra-4k-really-improve-3d-prints/)
- Searches for Tripo H3.1 input-resolution comparisons (1024 vs 2048 vs 4096) returned no such test. [Gap] — e.g. [aitechin H3.1 review](https://aitechin.substack.com/p/is-tripos-hd-model-v31-the-3d-upgrade); [glbgpt H3.1 review](https://www.glbgpt.com/hub/tripo-h3-1-review)

### Inferences
- **Inferred from Q6:** given encoder conditioning resolutions in the 224–1022 px range across published native-3D models, geometry benefit from inputs above ~2K is implausible; any benefit of a region-refined master would be via texture conditioning, which is undocumented.

### Gaps
- Shortest reliable test: one subject, same seed/options, inputs at 1024², 2048², 4096² (same square crop, same bg); compare mesh (face count fixed) via normal-map difference and texture via crop-level comparison on both vendors. Cost: Tripo ~30–40 credits per run (Q10), Meshy 30–35 credits per run.

---

## Key Question 10 — Current pricing / credits per image-to-3D generation and API availability (brief)

### Takeaway
Tripo API: image_to_model 20 credits (no texture) / 30 (texture) on H2/H3, +10 for `texture_quality=detailed`; P1 40/50 all-in; API credits ~$0.01 each via AWS Marketplace; plans Free ~300 cr/mo, Pro $19.90 (3,000 cr), Max $89.90 (25,000 cr). Meshy API: meshy-6/7/7.1 image-to-3D 20 (no texture) / 30 (texture) / 35 (8K texture) credits, Ultra +5; web app 20 credits (Meshy 6/7) vs 10 (Meshy 5); multi-view 20 credits, paid plan required.

### Cited Findings
**Tripo**
- "image-to-model tasks cost 20 credits without texture and 30 with texture on H2/H3 models, or 40 and 50 on P1. Setting texture_quality=detailed adds 10 credits on H2/H3 … P1 pricing is all-in per task." [Documented, 2026-10-10] — [docs.tripo3d.ai pricing](https://docs.tripo3d.ai/get-started/pricing.html)
- Conflicting third-party: detailed texture adds 20 credits on v3.0/v3.1. [Partner-documented, conflicting] — [3daistudio Tripo API doc](https://www.3daistudio.com/Platform/API/Documentation/3d-generation/tripo)
- Billing mechanics: credits frozen on task creation, deducted on success; failed/cancelled not charged. [Documented, 2026-10-10] — [developers.tripo3d.com billing](https://developers.tripo3d.com/en/docs/billing.md)
- AWS Marketplace: "usage beyond your prepaid credits is billed at $0.01 per credit". [Documented, 2026-10-10] — [aws.amazon.com marketplace Tripo](https://aws.amazon.com/marketplace/pp/prodview-hwlbvx7vubh7c)
- Plans (third-party aggregator, 2026): Pro $19.90 ($11.94 annual) 3,000 cr/mo; Max $89.90 25,000 cr/mo; Team $109.90/seat; Free 300 (or 200) cr/mo. [Third-party, 2026-10-10] — [costbench Tripo pricing](https://www.costbench.com/software/ai-3d-generation/tripo-ai/)
- Reseller per-task USD (P2): $1.20 no texture / $1.32 standard / $1.44 detailed / $1.56 extreme. [Partner-documented, 2026-10-10] — [wavespeed.ai](https://wavespeed.ai/docs/docs-api/tripo3d/tripo3d-p2-image-to-3d)

**Meshy**
- API pricing: "Meshy-6 models: 20 credits (without texture), 30 credits (with texture), 35 credits (with 8K texture)"; Meshy T1 same; T2 5/15/20; "pay-before-you-go". [Documented, 2026-10-10] — [docs.meshy.ai API pricing](https://docs.meshy.ai/api/pricing)
- "For meshy-7.1, same parameters and credit cost as meshy-7"; `ultra_mode` +5 credits. [Documented, 2026-10-10] — [docs.meshy.ai API changelog](https://docs.meshy.ai/en/api/changelog)
- Web app: Image to 3D 20 credits (Meshy 6) vs 10 (Meshy 5). [Documented, 2026-10-10] — [docs.meshy.ai webapp pricing](https://docs.meshy.ai/en/webapp/pricing)
- Multi-view: 20 credits default, paid plan required. [Documented, 2026-10-10] — [meshy.ai multi-view tutorial](https://www.meshy.ai/tutorials/multi-view-image-to-3d)
- Plans (third-party): Pro ~$20/mo, Studio ~$60/mo. [Third-party] — [costbench Meshy](https://costbench.com/software/ai-3d-generation/meshy/)
- Both APIs also resold via fal.ai (Tripo h3.1, Meshy v7.1), Runware, WaveSpeed, Atlas Cloud, Alibaba Model Studio. [Documented listings] — [fal Tripo H3.1 multiview](https://fal.ai/models/tripo3d/h3.1/multiview-to-3d/api); [fal Meshy 7.1 image-to-3d](https://fal.ai/models/meshy/v7.1/image-to-3d/api); [runware tripo-v3-1](https://runware.ai/docs/models/tripo-v3-1)

### Inferences
- A resolution-comparison test (Q9) on both vendors at 3 input sizes with texture costs roughly 100 Tripo credits (~$1) and ~100 Meshy credits.

### Gaps
- Live pricing pages (platform.tripo3d.ai, docs.meshy.ai/en/webapp/pricing) could not be opened from the sandbox; numbers are from indexed page text and may lag.

---

## Summary table for the decision (all "Documented" unless marked)

| Item | Tripo (v2.5/v3.x/H3.1/P1, 2026-10-10) | Meshy (6/7/7.1, 2026-10-10) |
|---|---|---|
| Max px per side | Not on Tripo docs; **20–6000 px** on Alibaba-hosted H3.1/P1 (partner) | **Not publicly verified** |
| Megapixel / aspect cap | None documented; blog says 1:1 best, crop to square | None documented; center subject |
| File size | 20 MB (API upload + web) | 20 MB web; 100 MB API (tutorial only) |
| Formats | API: JPEG/PNG; web UI + image-to-multiview: +WebP | Web: PNG/JPG/JPEG/WebP; API: jpg/jpeg/png (URL or data-URI) |
| Min/recommended | >256 (API), ≥1024 (help), 2048 (tutorial) | ≥512 (docs), 1024 (help), 2048 for Refine (tutorial) |
| Internal preprocessing (hosted) | Undocumented | "Image Enhancement" On/Off pre-process; optional Remove Background; otherwise undocumented |
| Open-lineage encoder input | TripoSR 512² (DINO ViT-B/16); TripoSG 224² crop of 256-short-edge resize (DINOv2-L) [Code] | No open model |
| Multi-view | 2–4 views, front mandatory | 1–4 images, first = front (7.1); Ultra 4K single-view only |
| Texture output | standard/detailed; 2K/4K/8K product tiers (8K Aug 2026) | 2k/4k/8k; 8K needs meshy-6/7.1, no emission map |
| Cost per image-to-3D | 20/30 cr (H3), +10 detailed; P1 40/50 | 20/30/35 cr; Ultra +5 |

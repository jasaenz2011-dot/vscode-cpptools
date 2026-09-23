# Video Baseline Kit

Four scripts that take one video from "what is this file" to a
worst-case 3-second excerpt, a Real-ESRGAN x2 baseline upscale, and a
side-by-side comparison. Built for Windows + ComfyUI portable +
an NVIDIA GPU (tested target: RTX 5070 Ti 16GB), but everything except
`baseline.py` runs on any Python 3 with OpenCV.

## Setup (ComfyUI portable Python)

Find your ComfyUI portable Python — usually:

```
C:\ComfyUI_windows_portable\python_embeded\python.exe
```

Install the two dependencies into it (torch/spandrel already ship with
ComfyUI):

```
C:\ComfyUI_windows_portable\python_embeded\python.exe -m pip install opencv-python matplotlib
```

Below, `PY` stands for that full python.exe path. Put your video in this
folder as `video.mp4` (rename it if needed).

## Workflow

### 1. Inventory

```
PY cut_excerpt.py video.mp4 --inventory
```

Prints resolution, framerate, frame count, duration, size, and average
bitrate.

### 2. Analyze and pick the worst-case window

```
PY sharpness.py video.mp4
```

Writes `sharpness_plot.png` (sharpness, motion, brightness, and the
combined worst-case score over time, with the chosen window shaded red
and face-visible samples marked green), prints the **lucky frame**
verdict (an isolated sharp frame inside softer neighbors), and prints
the recommended worst-case 3-second window — fast motion, low light,
face visible — as a ready-to-run cut command.

### 3. Cut the excerpt

```
PY cut_excerpt.py video.mp4 --start <recommended> --duration 3
```

Uses ffmpeg when it is on PATH (keeps audio); otherwise falls back to
OpenCV (video only). Writes `excerpt.mp4` and prints its inventory.

### 4. Baseline upscale (Real-ESRGAN x2)

```
PY baseline.py excerpt.mp4
```

- Finds an x2 model automatically in the usual ComfyUI folders
  (`models/upscale_models`, `models/ESRGAN`), preferring RealESRGAN
  names; or pass `--model <path>` explicitly. Set `COMFYUI_DIR` if your
  install lives somewhere unusual.
- Loads it with spandrel, runs on CUDA in fp16, and writes
  `excerpt_x2.mp4`.
- On a CUDA out-of-memory error it retries the frame with 256px tiles
  automatically; you can force tiling with `--tile 256` or precision
  with `--fp32`.
- Prints frames/sec while running and peak VRAM at the end.

### 5. Compare

```
PY compare.py excerpt.mp4 excerpt_x2.mp4
```

Opens both in one window: side-by-side (original nearest-enlarged so
pixel detail is honest), or press `w` for a wipe with a slider.
`space` pauses, `a`/`d` step frames, `s` saves a PNG, `q` quits.
Headless or scripted use: `--save` writes 5 side-by-side PNGs instead.

## Files

| file | job |
| --- | --- |
| `cut_excerpt.py` | inventory + cut an excerpt (ffmpeg or OpenCV) |
| `sharpness.py` | per-frame analysis, plot, lucky-frame verdict, window pick |
| `baseline.py` | Real-ESRGAN x2 upscale via spandrel/torch, OOM-safe |
| `compare.py` | interactive side-by-side / wipe viewer, PNG export |

## Notes

- `sharpness.py` samples large videos (~6000 frames max) so it stays
  fast; the plot title notes the sampling stride.
- Face detection uses OpenCV's built-in Haar cascade — good enough to
  bias the window choice, not a face recognizer.
- All scripts exit with a clear `error: ...` message instead of a stack
  trace for the common failure cases (missing file, no model, no CUDA).

#!/usr/bin/env python3
"""Upscale a video excerpt with a Real-ESRGAN model (baseline pass).

Usage:
  python baseline.py excerpt.mp4
  python baseline.py excerpt.mp4 --model "C:/ComfyUI/models/upscale_models/RealESRGAN_x2.pth"
  python baseline.py excerpt.mp4 --tile 256          # if VRAM runs out

With no --model it searches the usual ComfyUI locations for an x2
Real-ESRGAN checkpoint. Loading uses spandrel (ships with ComfyUI);
inference runs on CUDA in fp16 when available. On a CUDA out-of-memory
error it automatically retries the frame with tiling.
"""

import argparse
import glob
import os
import sys
import time

import cv2
import numpy as np

try:
    import torch
except ImportError:
    sys.exit("error: torch is not installed in this Python. Run this with "
             "your ComfyUI portable python.exe, e.g.\n"
             r"  C:\ComfyUI_windows_portable\python_embeded\python.exe baseline.py excerpt.mp4")


MODEL_ROOTS = [
    os.environ.get("COMFYUI_DIR", ""),
    r"C:\ComfyUI_windows_portable\ComfyUI",
    r"C:\ComfyUI",
    os.path.expanduser(r"~\ComfyUI"),
    os.path.expanduser(r"~\Documents\ComfyUI"),
    os.path.expanduser(r"~\Downloads\ComfyUI_windows_portable\ComfyUI"),
    ".", "..",
]


def find_model(explicit):
    if explicit:
        if os.path.isfile(explicit):
            return explicit
        sys.exit(f"error: model file {explicit} not found")
    candidates = []
    for root in MODEL_ROOTS:
        if not root or not os.path.isdir(root):
            continue
        for pattern in ("models/upscale_models/*", "models/ESRGAN/*",
                        "models/upscalers/*"):
            candidates += glob.glob(os.path.join(root, pattern))
    def is_x2(path):
        name = os.path.basename(path).lower()
        return (name.endswith((".pth", ".safetensors"))
                and ("x2" in name or "2x" in name))
    x2 = [c for c in candidates if is_x2(c)]
    if not x2:
        listing = "\n  ".join(sorted(set(candidates))[:20]) or "(none found)"
        sys.exit("error: no x2 upscale model found automatically.\n"
                 f"Checkpoints seen:\n  {listing}\n"
                 "Pass one explicitly with --model <path> "
                 "(a RealESRGAN x2 .pth/.safetensors).")
    x2.sort(key=lambda p: ("realesrgan" not in os.path.basename(p).lower(),
                           os.path.basename(p).lower()))
    return x2[0]


def load_model(path, device, fp16):
    try:
        from spandrel import ModelLoader
    except ImportError:
        sys.exit("error: spandrel is not installed (ComfyUI normally ships "
                 "it). Install into this Python:  python -m pip install spandrel")
    described = ModelLoader().load_from_file(path)
    model = described.model if hasattr(described, "model") else described
    scale = getattr(described, "scale", getattr(model, "scale", 2))
    model.eval().to(device)
    if fp16:
        model.half()
    return model, int(scale)


def upscale_tensor(model, tensor):
    with torch.no_grad():
        return model(tensor).clamp_(0, 1)


def upscale_tiled(model, tensor, tile, overlap, scale):
    _, _, h, w = tensor.shape
    out = torch.zeros((1, 3, h * scale, w * scale),
                      dtype=tensor.dtype, device=tensor.device)
    step = tile - overlap
    for y in range(0, h, step):
        for x in range(0, w, step):
            y0, x0 = y, x
            y1, x1 = min(y + tile, h), min(x + tile, w)
            y0, x0 = max(0, y1 - tile), max(0, x1 - tile)
            patch = upscale_tensor(model, tensor[:, :, y0:y1, x0:x1])
            out[:, :, y0 * scale:y1 * scale, x0 * scale:x1 * scale] = patch
    return out


def frame_to_tensor(frame, device, fp16):
    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    tensor = torch.from_numpy(rgb).permute(2, 0, 1).unsqueeze(0)
    tensor = tensor.to(device).float().div_(255.0)
    return tensor.half() if fp16 else tensor


def tensor_to_frame(tensor):
    array = (tensor.squeeze(0).permute(1, 2, 0).float().cpu().numpy()
             * 255.0).round().astype(np.uint8)
    return cv2.cvtColor(array, cv2.COLOR_RGB2BGR)


def main():
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("video")
    ap.add_argument("--model", help="path to RealESRGAN x2 checkpoint")
    ap.add_argument("-o", "--output", help="default: <input>_x2.mp4")
    ap.add_argument("--tile", type=int, default=0,
                    help="tile size (0 = whole frame, auto-tiles on OOM)")
    ap.add_argument("--overlap", type=int, default=16)
    ap.add_argument("--fp32", action="store_true",
                    help="disable fp16 (slower, more VRAM)")
    args = ap.parse_args()
    if not os.path.isfile(args.video):
        sys.exit(f"error: {args.video} not found")

    device = "cuda" if torch.cuda.is_available() else "cpu"
    fp16 = device == "cuda" and not args.fp32
    if device == "cpu":
        print("warning: CUDA not available — running on CPU (slow)")

    model_path = find_model(args.model)
    print(f"model  : {model_path}")
    model, scale = load_model(model_path, device, fp16)
    print(f"scale  : x{scale}   device: {device}   fp16: {fp16}")

    cap = cv2.VideoCapture(args.video)
    if not cap.isOpened():
        sys.exit(f"error: cannot open {args.video}")
    fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    output = args.output or (os.path.splitext(args.video)[0]
                             + f"_x{scale}.mp4")
    writer = cv2.VideoWriter(output, cv2.VideoWriter_fourcc(*"mp4v"), fps,
                             (width * scale, height * scale))
    if not writer.isOpened():
        sys.exit(f"error: cannot write {output}")

    tile = args.tile
    done, t0 = 0, time.time()
    while True:
        ok, frame = cap.read()
        if not ok:
            break
        tensor = frame_to_tensor(frame, device, fp16)
        try:
            if tile:
                result = upscale_tiled(model, tensor, tile, args.overlap,
                                       scale)
            else:
                result = upscale_tensor(model, tensor)
        except torch.cuda.OutOfMemoryError:
            torch.cuda.empty_cache()
            tile = tile or 256
            print(f"\nCUDA out of memory — retrying with tile={tile}")
            result = upscale_tiled(model, tensor, tile, args.overlap, scale)
        writer.write(tensor_to_frame(result))
        done += 1
        if done % 10 == 0 or done == total:
            rate = done / (time.time() - t0)
            print(f"\r{done}/{total or '?'} frames  ({rate:.1f} fps)",
                  end="", flush=True)
    cap.release()
    writer.release()
    elapsed = time.time() - t0
    print(f"\nwrote {output}  ({done} frames, {width}x{height} -> "
          f"{width*scale}x{height*scale}, {elapsed:.1f}s)")
    if device == "cuda":
        peak = torch.cuda.max_memory_allocated() / 1e9
        print(f"peak VRAM: {peak:.2f} GB")
    print(f"compare with:\n  python compare.py {args.video} {output}")


if __name__ == "__main__":
    main()

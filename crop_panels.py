"""
Usage:
    pip install Pillow
    python crop_panels.py

Place ChatGPT-Image-May-19-2026-09_24_39-AM.jpg in the same directory.
Outputs: female-idle.png, female-speaking.png, female-closing.png,
         male-idle.png, male-speaking.png, male-closing.png,
         female-strip.png, male-strip.png
"""

from pathlib import Path
from PIL import Image
import numpy as np

SRC = Path("ChatGPT-Image-May-19-2026-09_24_39-AM.jpg")
COLS = 3
ROWS = 2
BLACK_THRESH = 20   # pixel brightness below which counts as gutter


def find_content_bounds(arr: np.ndarray, axis: int, thresh: int = BLACK_THRESH):
    """Return sorted list of (start, end) slices for non-black runs along axis."""
    # Max brightness across the other axis
    other = 1 - axis
    brightness = arr.max(axis=other).max(axis=-1)  # shape: (dim,)
    mask = brightness > thresh

    runs = []
    in_run = False
    start = 0
    for i, val in enumerate(mask):
        if val and not in_run:
            start = i
            in_run = True
        elif not val and in_run:
            runs.append((start, i))
            in_run = False
    if in_run:
        runs.append((start, len(mask)))
    return runs


def merge_close_runs(runs, min_gap: int = 5):
    """Merge runs separated by fewer than min_gap pixels (noise gaps)."""
    if not runs:
        return runs
    merged = [runs[0]]
    for s, e in runs[1:]:
        ps, pe = merged[-1]
        if s - pe < min_gap:
            merged[-1] = (ps, e)
        else:
            merged.append((s, e))
    return merged


def pick_n_largest(runs, n: int):
    """Return the n largest runs by length, sorted by start position."""
    by_size = sorted(runs, key=lambda r: r[1] - r[0], reverse=True)[:n]
    return sorted(by_size, key=lambda r: r[0])


def crop_image():
    img = Image.open(SRC).convert("RGB")
    arr = np.array(img)

    # ── detect column bands ──────────────────────────────────────────────────
    col_runs = find_content_bounds(arr, axis=0)
    col_runs = merge_close_runs(col_runs)
    col_bands = pick_n_largest(col_runs, COLS)

    # ── detect row bands ─────────────────────────────────────────────────────
    row_runs = find_content_bounds(arr, axis=1)
    row_runs = merge_close_runs(row_runs)
    row_bands = pick_n_largest(row_runs, ROWS)

    if len(col_bands) != COLS or len(row_bands) != ROWS:
        print(f"Auto-detection found {len(col_bands)} cols / {len(row_bands)} rows. "
              "Falling back to uniform grid split.")
        h, w = arr.shape[:2]
        col_bands = [(round(w * i / COLS), round(w * (i + 1) / COLS)) for i in range(COLS)]
        row_bands = [(round(h * i / ROWS), round(h * (i + 1) / ROWS)) for i in range(ROWS)]
    else:
        print(f"Detected columns: {col_bands}")
        print(f"Detected rows:    {row_bands}")

    names = [
        ["female-idle",    "female-speaking",  "female-closing"],
        ["male-idle",      "male-speaking",    "male-closing"],
    ]

    panels: dict[str, Image.Image] = {}
    for r, (y0, y1) in enumerate(row_bands):
        for c, (x0, x1) in enumerate(col_bands):
            panel = img.crop((x0, y0, x1, y1))
            name = names[r][c]
            out = Path(f"{name}.png")
            panel.save(out, "PNG")
            panels[name] = panel
            print(f"Saved {out}  ({panel.width}×{panel.height})")

    # ── strips ───────────────────────────────────────────────────────────────
    for prefix, keys in (
        ("female", ["female-idle", "female-speaking", "female-closing"]),
        ("male",   ["male-idle",   "male-speaking",   "male-closing"]),
    ):
        imgs = [panels[k] for k in keys]
        total_w = sum(i.width for i in imgs)
        max_h = max(i.height for i in imgs)
        strip = Image.new("RGB", (total_w, max_h))
        x = 0
        for i in imgs:
            strip.paste(i, (x, 0))
            x += i.width
        strip.save(f"{prefix}-strip.png", "PNG")
        print(f"Saved {prefix}-strip.png  ({strip.width}×{strip.height})")


if __name__ == "__main__":
    crop_image()

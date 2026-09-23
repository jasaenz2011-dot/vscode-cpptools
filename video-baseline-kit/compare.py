#!/usr/bin/env python3
"""Open the original excerpt and the upscaled result side by side.

Usage:
  python compare.py excerpt.mp4 excerpt_x2.mp4
  python compare.py excerpt.mp4 excerpt_x2.mp4 --save   # PNGs, no window

Interactive keys:
  space  pause/play        a / d   step one frame back / forward
  w      toggle wipe/split s       save current comparison frame
  q/esc  quit
The original is nearest-neighbor enlarged to the result's size, so any
extra detail you see on the right (or right of the wipe) is real.
"""

import argparse
import os
import sys

import cv2
import numpy as np


def open_pair(a, b):
    cap_a, cap_b = cv2.VideoCapture(a), cv2.VideoCapture(b)
    if not cap_a.isOpened():
        sys.exit(f"error: cannot open {a}")
    if not cap_b.isOpened():
        sys.exit(f"error: cannot open {b}")
    return cap_a, cap_b


def read_pair(cap_a, cap_b):
    ok_a, fa = cap_a.read()
    ok_b, fb = cap_b.read()
    if not (ok_a and ok_b):
        return None, None
    if fa.shape[:2] != fb.shape[:2]:
        fa = cv2.resize(fa, (fb.shape[1], fb.shape[0]),
                        interpolation=cv2.INTER_NEAREST)
    return fa, fb


def label(img, text):
    cv2.putText(img, text, (12, 34), cv2.FONT_HERSHEY_SIMPLEX, 1.0,
                (0, 0, 0), 4, cv2.LINE_AA)
    cv2.putText(img, text, (12, 34), cv2.FONT_HERSHEY_SIMPLEX, 1.0,
                (255, 255, 255), 2, cv2.LINE_AA)
    return img


def side_by_side(fa, fb):
    return np.hstack([label(fa.copy(), "ORIGINAL (nearest x2)"),
                      label(fb.copy(), "UPSCALED")])


def wipe(fa, fb, split):
    x = int(fb.shape[1] * split)
    out = fb.copy()
    out[:, :x] = fa[:, :x]
    cv2.line(out, (x, 0), (x, out.shape[0]), (255, 255, 255), 2)
    return label(out, "wipe: original | upscaled")


def save_mode(a, b, count):
    cap_a, cap_b = open_pair(a, b)
    total = int(min(cap_a.get(cv2.CAP_PROP_FRAME_COUNT),
                    cap_b.get(cv2.CAP_PROP_FRAME_COUNT)))
    picks = sorted({max(0, int(total * i / (count + 1))) for i in
                    range(1, count + 1)})
    index, saved = 0, 0
    while True:
        fa, fb = read_pair(cap_a, cap_b)
        if fa is None:
            break
        if index in picks:
            name = f"compare_{index:05d}.png"
            cv2.imwrite(name, side_by_side(fa, fb))
            print(f"wrote {name}")
            saved += 1
        index += 1
    if not saved:
        sys.exit("error: no overlapping frames to save")


def interactive(a, b):
    cap_a, cap_b = open_pair(a, b)
    fps = cap_a.get(cv2.CAP_PROP_FPS) or 30.0
    window = "compare (space=pause  a/d=step  w=wipe  s=save  q=quit)"
    cv2.namedWindow(window, cv2.WINDOW_NORMAL)
    cv2.createTrackbar("wipe %", window, 50, 100, lambda v: None)
    playing, use_wipe = True, False
    fa, fb = read_pair(cap_a, cap_b)
    if fa is None:
        sys.exit("error: could not read first frames")
    while True:
        if playing:
            nxt = read_pair(cap_a, cap_b)
            if nxt[0] is None:
                playing = False  # hold on last frame
            else:
                fa, fb = nxt
        split = cv2.getTrackbarPos("wipe %", window) / 100.0
        view = wipe(fa, fb, split) if use_wipe else side_by_side(fa, fb)
        cv2.imshow(window, view)
        key = cv2.waitKey(max(1, int(1000 / fps))) & 0xFF
        if key in (ord("q"), 27):
            break
        if key == ord(" "):
            playing = not playing
        if key == ord("w"):
            use_wipe = not use_wipe
        if key == ord("d") and not playing:
            nxt = read_pair(cap_a, cap_b)
            if nxt[0] is not None:
                fa, fb = nxt
        if key == ord("a") and not playing:
            pos = max(0.0, cap_a.get(cv2.CAP_PROP_POS_FRAMES) - 2)
            cap_a.set(cv2.CAP_PROP_POS_FRAMES, pos)
            cap_b.set(cv2.CAP_PROP_POS_FRAMES, pos)
            nxt = read_pair(cap_a, cap_b)
            if nxt[0] is not None:
                fa, fb = nxt
        if key == ord("s"):
            name = f"compare_frame_{int(cap_a.get(cv2.CAP_PROP_POS_FRAMES)):05d}.png"
            cv2.imwrite(name, view)
            print(f"wrote {name}")
    cv2.destroyAllWindows()


def main():
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("original")
    ap.add_argument("upscaled")
    ap.add_argument("--save", action="store_true",
                    help="write side-by-side PNGs instead of opening a window")
    ap.add_argument("--count", type=int, default=5,
                    help="how many PNGs with --save (default 5)")
    args = ap.parse_args()
    for path in (args.original, args.upscaled):
        if not os.path.isfile(path):
            sys.exit(f"error: {path} not found")
    if args.save:
        save_mode(args.original, args.upscaled, args.count)
        return
    try:
        interactive(args.original, args.upscaled)
    except cv2.error:
        print("no display available — falling back to --save mode")
        save_mode(args.original, args.upscaled, args.count)


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Analyze a video's per-frame sharpness, motion, brightness and faces,
plot the curves, report the "lucky frame", and recommend the best
worst-case test window (fast motion + visible face + low light).

Usage:
  python sharpness.py video.mp4
  python sharpness.py video.mp4 --window 3 --out sharpness_plot.png

Prints a recommended `cut_excerpt.py --start <t> --duration <w>` command.
"""

import argparse
import os
import sys

import cv2
import numpy as np

import matplotlib
matplotlib.use("Agg")  # never needs a display
import matplotlib.pyplot as plt


def make_face_detector():
    """Haar cascade when this OpenCV build still ships it (removed in 5.x);
    otherwise a skin-tone heuristic so the window pick keeps a face signal."""
    try:
        cascade = cv2.CascadeClassifier(
            cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
        if not cascade.empty():
            return "haar", lambda small: bool(
                len(cascade.detectMultiScale(small, 1.2, 4, minSize=(24, 24))))
    except AttributeError:
        pass

    def skin(small_bgr):
        ycrcb = cv2.cvtColor(small_bgr, cv2.COLOR_BGR2YCrCb)
        mask = cv2.inRange(ycrcb, (0, 135, 85), (255, 180, 135))
        return bool(mask.mean() > 4.0)  # >~1.5% skin-toned pixels
    return "skin-tone heuristic", skin


def analyze(path, max_samples=6000, face_every=5):
    cap = cv2.VideoCapture(path)
    if not cap.isOpened():
        sys.exit(f"error: cannot open {path}")
    fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
    total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    stride = max(1, total // max_samples)

    face_kind, detect_face = make_face_detector()
    if face_kind != "haar":
        print(f"note: Haar cascades unavailable in this OpenCV build — "
              f"using {face_kind} for the face signal")

    times, sharp, motion, bright, faces = [], [], [], [], []
    prev_small = None
    index = 0
    while True:
        ok = cap.grab()
        if not ok:
            break
        if index % stride:
            index += 1
            continue
        ok, frame = cap.retrieve()
        if not ok:
            break
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        small = cv2.resize(gray, (320, 180))
        small_bgr = cv2.resize(frame, (320, 180))

        times.append(index / fps)
        sharp.append(cv2.Laplacian(gray, cv2.CV_64F).var())
        bright.append(float(gray.mean()))
        if prev_small is None:
            motion.append(0.0)
        else:
            motion.append(float(cv2.absdiff(small, prev_small).mean()))
        prev_small = small

        if len(times) % face_every == 1 or face_every == 1:
            probe = small if face_kind == "haar" else small_bgr
            faces.append(1.0 if detect_face(probe) else 0.0)
        else:
            faces.append(faces[-1] if faces else 0.0)
        index += 1
    cap.release()
    if len(times) < 3:
        sys.exit("error: too few readable frames")
    return (np.array(times), np.array(sharp), np.array(motion),
            np.array(bright), np.array(faces), fps, stride)


def normalize(x):
    lo, hi = float(np.min(x)), float(np.max(x))
    return (x - lo) / (hi - lo) if hi > lo else np.zeros_like(x)


def lucky_frame(times, sharp):
    """Sharpest frame, and whether it is a spike above its neighborhood."""
    best = int(np.argmax(sharp))
    k = 15
    lo, hi = max(0, best - k), min(len(sharp), best + k + 1)
    neighborhood = np.concatenate([sharp[lo:best], sharp[best + 1:hi]])
    median = float(np.median(neighborhood)) if len(neighborhood) else 0.0
    spike = sharp[best] > 1.8 * median if median else False
    return best, spike, median


def pick_window(times, sharp, motion, bright, faces, window):
    """Highest score = fast motion + dark + face visible + soft frames."""
    score = (1.4 * normalize(motion) + 1.0 * (1.0 - normalize(bright))
             + 1.0 * faces + 0.6 * (1.0 - normalize(sharp)))
    best_start, best_value = 0.0, -1.0
    j = 0
    for i in range(len(times)):
        end = times[i] + window
        if end > times[-1] + 1e-9:
            break
        while j < len(times) and times[j] < end:
            j += 1
        value = float(score[i:j].mean()) if j > i else 0.0
        if value > best_value:
            best_value, best_start = value, float(times[i])
        j = max(j - 1, i)
    return best_start, best_value, score


def main():
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("video")
    ap.add_argument("--window", type=float, default=3.0)
    ap.add_argument("--out", default="sharpness_plot.png")
    args = ap.parse_args()
    if not os.path.isfile(args.video):
        sys.exit(f"error: {args.video} not found")

    times, sharp, motion, bright, faces, fps, stride = analyze(args.video)
    best, spike, median = lucky_frame(times, sharp)
    start, value, score = pick_window(times, sharp, motion, bright,
                                      faces, args.window)

    fig, axes = plt.subplots(4, 1, figsize=(14, 10), sharex=True)
    for ax, data, label in zip(
            axes,
            (sharp, motion, bright, score),
            ("sharpness (Laplacian var)", "motion (frame diff)",
             "brightness (mean luma)", "worst-case score")):
        ax.plot(times, data, linewidth=0.8)
        ax.set_ylabel(label, fontsize=9)
        ax.axvspan(start, start + args.window, color="red", alpha=0.25)
    face_on = faces > 0.5
    axes[0].scatter(times[face_on], sharp[face_on], s=4, color="green",
                    label="face visible")
    axes[0].scatter([times[best]], [sharp[best]], s=60, marker="*",
                    color="orange", zorder=5, label="lucky frame")
    axes[0].legend(loc="upper right", fontsize=8)
    axes[-1].set_xlabel("time (s)")
    fig.suptitle(os.path.basename(args.video))
    fig.tight_layout()
    fig.savefig(args.out, dpi=110)
    print(f"wrote {args.out} (sampled every {stride} frame(s))")

    print(f"\nlucky frame: t={times[best]:.2f}s  sharpness={sharp[best]:.0f} "
          f"(neighborhood median {median:.0f})")
    print("verdict    : " + (
        "LUCKY FRAME — an isolated sharp spike inside softer frames"
        if spike else
        "no lucky frame — the sharpest frame matches its neighborhood"))

    end = start + args.window
    print(f"\nworst-case {args.window:.0f}s window: {start:.2f}s – {end:.2f}s "
          f"(score {value:.2f}; motion high, light low, "
          f"face {'present' if faces[(times >= start) & (times <= end)].mean() > 0.3 else 'mostly absent'})")
    print(f"cut it with:\n  python cut_excerpt.py {args.video} "
          f"--start {start:.2f} --duration {args.window:.0f}")


if __name__ == "__main__":
    main()

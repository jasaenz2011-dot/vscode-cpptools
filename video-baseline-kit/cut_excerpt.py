#!/usr/bin/env python3
"""Inventory a video or cut a short excerpt from it.

Usage:
  python cut_excerpt.py video.mp4 --inventory
  python cut_excerpt.py video.mp4 --start 83.5 --duration 3
  python cut_excerpt.py video.mp4 --start 1:23.5 --duration 3 -o excerpt.mp4

Cutting prefers ffmpeg (keeps audio, accurate, fast). If ffmpeg is not on
PATH it falls back to OpenCV (video only, no audio).
"""

import argparse
import os
import shutil
import subprocess
import sys

import cv2


def parse_time(text):
    """Accept seconds ('83.5') or clock ('1:23.5', '0:01:23.5')."""
    parts = str(text).split(":")
    if len(parts) > 3:
        sys.exit(f"error: cannot parse time '{text}'")
    seconds = 0.0
    for part in parts:
        seconds = seconds * 60 + float(part)
    return seconds


def probe(path):
    cap = cv2.VideoCapture(path)
    if not cap.isOpened():
        sys.exit(f"error: cannot open {path}")
    info = {
        "width": int(cap.get(cv2.CAP_PROP_FRAME_WIDTH)),
        "height": int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT)),
        "fps": cap.get(cv2.CAP_PROP_FPS) or 0.0,
        "frames": int(cap.get(cv2.CAP_PROP_FRAME_COUNT)),
    }
    cap.release()
    info["duration"] = info["frames"] / info["fps"] if info["fps"] else 0.0
    size_bytes = os.path.getsize(path)
    info["size_mb"] = size_bytes / 1e6
    info["bitrate_mbps"] = (size_bytes * 8 / info["duration"] / 1e6
                            if info["duration"] else 0.0)
    return info


def show_inventory(path):
    info = probe(path)
    mins, secs = divmod(info["duration"], 60)
    print(f"file       : {path}")
    print(f"resolution : {info['width']}x{info['height']}")
    print(f"framerate  : {info['fps']:.3f} fps")
    print(f"frames     : {info['frames']}")
    print(f"duration   : {int(mins)}m {secs:.2f}s ({info['duration']:.2f}s)")
    print(f"size       : {info['size_mb']:.1f} MB")
    print(f"bitrate    : {info['bitrate_mbps']:.2f} Mbit/s (container average)")


def cut_ffmpeg(src, start, duration, dst):
    cmd = [
        "ffmpeg", "-y", "-ss", f"{start:.3f}", "-i", src,
        "-t", f"{duration:.3f}",
        "-c:v", "libx264", "-crf", "16", "-preset", "medium",
        "-pix_fmt", "yuv420p", "-c:a", "aac", dst,
    ]
    print("running:", " ".join(cmd))
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print(result.stderr[-2000:])
        sys.exit("error: ffmpeg failed")


def cut_opencv(src, start, duration, dst):
    cap = cv2.VideoCapture(src)
    fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    writer = cv2.VideoWriter(dst, cv2.VideoWriter_fourcc(*"mp4v"),
                             fps, (width, height))
    if not writer.isOpened():
        sys.exit(f"error: cannot write {dst}")
    cap.set(cv2.CAP_PROP_POS_MSEC, start * 1000.0)
    wanted = int(round(duration * fps))
    written = 0
    while written < wanted:
        ok, frame = cap.read()
        if not ok:
            break
        writer.write(frame)
        written += 1
    cap.release()
    writer.release()
    if written == 0:
        sys.exit("error: no frames in that range (start beyond end?)")
    print(f"note: OpenCV fallback used — audio is not carried over")
    print(f"wrote {written} frames")


def main():
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("video")
    ap.add_argument("--inventory", action="store_true",
                    help="print resolution/framerate/bitrate/duration and exit")
    ap.add_argument("--start", help="excerpt start (seconds or mm:ss)")
    ap.add_argument("--duration", type=float, default=3.0,
                    help="excerpt length in seconds (default 3)")
    ap.add_argument("-o", "--output", default="excerpt.mp4")
    args = ap.parse_args()

    if not os.path.isfile(args.video):
        sys.exit(f"error: {args.video} not found")

    if args.inventory:
        show_inventory(args.video)
        return
    if args.start is None:
        ap.error("--start is required unless --inventory is given")

    start = parse_time(args.start)
    if shutil.which("ffmpeg"):
        cut_ffmpeg(args.video, start, args.duration, args.output)
    else:
        cut_opencv(args.video, start, args.duration, args.output)
    print(f"wrote {args.output} ({start:.2f}s +{args.duration:.2f}s)")
    show_inventory(args.output)


if __name__ == "__main__":
    main()

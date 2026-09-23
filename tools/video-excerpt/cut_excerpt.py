"""Inspect a video and cut an excerpt from it.

Usage:
    python cut_excerpt.py video.mp4 --inventory
    python cut_excerpt.py video.mp4 --start 1:23 --end 1:45
    python cut_excerpt.py video.mp4 --start 83.5 --duration 10 -o clip.mp4

--inventory prints the video's basic facts and a list of likely scene
changes, and saves a contact sheet (<name>_contact.png) showing one
thumbnail per interval with its timestamp.

Cutting uses ffmpeg when one can be found (keeps audio). ComfyUI installs
often have one through the imageio-ffmpeg package. Otherwise it falls back
to OpenCV, which writes video only (no audio).
"""

import argparse
import math
import os
import shutil
import subprocess
import sys

import cv2


def parse_time(text):
    """Accept seconds ("83.5"), "M:SS" or "H:MM:SS(.ms)"."""
    parts = text.strip().split(":")
    if len(parts) > 3:
        raise argparse.ArgumentTypeError(f"bad time: {text}")
    try:
        seconds = 0.0
        for part in parts:
            seconds = seconds * 60 + float(part)
    except ValueError:
        raise argparse.ArgumentTypeError(f"bad time: {text}")
    if seconds < 0:
        raise argparse.ArgumentTypeError(f"time can't be negative: {text}")
    return seconds


def fmt_time(seconds):
    seconds = max(0.0, seconds)
    h = int(seconds // 3600)
    m = int(seconds % 3600 // 60)
    s = seconds % 60
    return f"{h}:{m:02d}:{s:05.2f}" if h else f"{m}:{s:05.2f}"


def open_video(path):
    if not os.path.isfile(path):
        sys.exit(f"Can't find '{path}'. Is it in this folder? (Run 'dir' to check.)")
    cap = cv2.VideoCapture(path)
    if not cap.isOpened():
        sys.exit(f"OpenCV couldn't open '{path}'. The file may be damaged or an unusual format.")
    return cap


def video_info(cap):
    fps = cap.get(cv2.CAP_PROP_FPS) or 0.0
    frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT) or 0)
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fourcc = int(cap.get(cv2.CAP_PROP_FOURCC))
    codec = "".join(chr((fourcc >> (8 * i)) & 0xFF) for i in range(4)).strip("\x00 ") or "unknown"
    duration = frames / fps if fps > 0 else 0.0
    return {"fps": fps, "frames": frames, "width": width, "height": height,
            "codec": codec, "duration": duration}


def find_scene_changes(cap, info, threshold=0.45, max_samples=1500):
    """Compare colour histograms of sampled frames; big jumps are likely cuts."""
    fps, frames = info["fps"], info["frames"]
    if fps <= 0 or frames <= 0:
        return []
    step = max(1, int(round(fps / 4)))              # ~4 samples per second
    step = max(step, math.ceil(frames / max_samples))  # but cap total work
    changes, prev = [], None
    cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
    idx = 0
    while idx < frames:
        ok = cap.grab()
        if not ok:
            break
        if idx % step == 0:
            ok, frame = cap.retrieve()
            if ok:
                small = cv2.resize(frame, (160, 90))
                hsv = cv2.cvtColor(small, cv2.COLOR_BGR2HSV)
                hist = cv2.calcHist([hsv], [0, 1], None, [32, 32], [0, 180, 0, 256])
                cv2.normalize(hist, hist)
                if prev is not None:
                    dist = cv2.compareHist(prev, hist, cv2.HISTCMP_BHATTACHARYYA)
                    if dist > threshold:
                        changes.append(idx / fps)
                prev = hist
        idx += 1
    return changes


def contact_sheet(cap, info, out_path, count=24):
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt

    duration = info["duration"]
    if duration <= 0:
        return None
    cols = 6
    rows = math.ceil(count / cols)
    aspect = info["height"] / info["width"] if info["width"] else 9 / 16
    fig, axes = plt.subplots(rows, cols, figsize=(cols * 3, rows * 3 * aspect + rows * 0.35))
    for i, ax in enumerate(axes.flat):
        ax.axis("off")
        if i >= count:
            continue
        t = duration * (i + 0.5) / count
        cap.set(cv2.CAP_PROP_POS_MSEC, t * 1000)
        ok, frame = cap.read()
        if not ok:
            continue
        ax.imshow(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
        ax.set_title(fmt_time(t), fontsize=10)
    fig.tight_layout()
    fig.savefig(out_path, dpi=80)
    plt.close(fig)
    return out_path


def inventory(path):
    cap = open_video(path)
    info = video_info(cap)
    size_mb = os.path.getsize(path) / (1024 * 1024)

    print(f"File:        {path} ({size_mb:.1f} MB)")
    print(f"Resolution:  {info['width']} x {info['height']}")
    print(f"Frame rate:  {info['fps']:.3f} fps")
    print(f"Frames:      {info['frames']}")
    print(f"Duration:    {fmt_time(info['duration'])}  ({info['duration']:.2f} s)")
    print(f"Codec:       {info['codec']}")
    print(f"ffmpeg:      {'found (audio will be kept)' if find_ffmpeg() else 'not found (cuts will have no audio)'}")

    print("\nScanning for scene changes...")
    changes = find_scene_changes(cap, info)
    if changes:
        print(f"Likely scene changes ({len(changes)}):")
        for t in changes[:60]:
            print(f"  {fmt_time(t)}")
        if len(changes) > 60:
            print(f"  ... and {len(changes) - 60} more")
    else:
        print("No obvious scene changes found.")

    sheet = os.path.splitext(path)[0] + "_contact.png"
    if contact_sheet(cap, info, sheet):
        print(f"\nSaved thumbnails with timestamps to: {sheet}")
    cap.release()


def find_ffmpeg():
    try:
        import imageio_ffmpeg
        return imageio_ffmpeg.get_ffmpeg_exe()
    except Exception:
        pass
    return shutil.which("ffmpeg")


def cut_with_ffmpeg(ffmpeg, src, start, length, out):
    # Re-encode so the cut lands on the exact frame (stream copy snaps to keyframes).
    cmd = [ffmpeg, "-y", "-hide_banner", "-loglevel", "error",
           "-ss", f"{start:.3f}", "-i", src, "-t", f"{length:.3f}",
           "-c:v", "libx264", "-crf", "18", "-preset", "fast", "-pix_fmt", "yuv420p",
           "-c:a", "aac", "-b:a", "192k", out]
    return subprocess.run(cmd).returncode == 0


def cut_with_opencv(src, start, length, out):
    cap = open_video(src)
    info = video_info(cap)
    fps = info["fps"] or 30.0
    first = int(round(start * fps))
    last = first + int(round(length * fps))
    cap.set(cv2.CAP_PROP_POS_FRAMES, first)
    writer = cv2.VideoWriter(out, cv2.VideoWriter_fourcc(*"mp4v"), fps,
                             (info["width"], info["height"]))
    written = 0
    for _ in range(first, last):
        ok, frame = cap.read()
        if not ok:
            break
        writer.write(frame)
        written += 1
    writer.release()
    cap.release()
    return written > 0


def cut(args):
    cap = open_video(args.video)
    info = video_info(cap)
    cap.release()
    duration = info["duration"]

    start = args.start
    if args.end is not None:
        end = args.end
    elif args.duration is not None:
        end = start + args.duration
    else:
        sys.exit("Say where the excerpt ends: add --end TIME or --duration SECONDS.")
    if duration > 0:
        if start >= duration:
            sys.exit(f"--start {fmt_time(start)} is past the end of the video ({fmt_time(duration)}).")
        end = min(end, duration)
    if end <= start:
        sys.exit("The end time must be after the start time.")

    out = args.output or f"{os.path.splitext(args.video)[0]}_excerpt_{int(start)}-{int(math.ceil(end))}.mp4"
    print(f"Cutting {fmt_time(start)} -> {fmt_time(end)} ({end - start:.2f} s) into {out}")

    ffmpeg = find_ffmpeg()
    if ffmpeg and cut_with_ffmpeg(ffmpeg, args.video, start, end - start, out):
        print("Done (with audio).")
        return
    if ffmpeg:
        print("ffmpeg failed; falling back to OpenCV (no audio).")
    else:
        print("ffmpeg not found; using OpenCV (the excerpt will have no audio).")
    if not cut_with_opencv(args.video, start, end - start, out):
        sys.exit("No frames were written. Check the start time.")
    print("Done.")


def main():
    p = argparse.ArgumentParser(description="Inspect a video or cut an excerpt from it.")
    p.add_argument("video", help="input video file, e.g. video.mp4")
    p.add_argument("--inventory", action="store_true",
                   help="print video info, scene changes, and save a thumbnail sheet")
    p.add_argument("--start", type=parse_time, help="excerpt start (seconds, M:SS or H:MM:SS)")
    p.add_argument("--end", type=parse_time, help="excerpt end (same formats)")
    p.add_argument("--duration", type=float, help="excerpt length in seconds (instead of --end)")
    p.add_argument("-o", "--output", help="output file (default: <name>_excerpt_<start>-<end>.mp4)")
    args = p.parse_args()

    if args.inventory:
        inventory(args.video)
    elif args.start is not None:
        cut(args)
    else:
        p.error("use --inventory, or --start with --end/--duration")


if __name__ == "__main__":
    main()

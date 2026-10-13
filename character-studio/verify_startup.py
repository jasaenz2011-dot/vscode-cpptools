#!/usr/bin/env python3
"""verify_startup: go/no-go dependency check for the Character Studio pipeline.

Runs the checks in dependency order and prints a table. Exit code is 0 when
every check is GO (WARN counts as GO unless --strict), 1 otherwise, so other
modules and shell scripts can gate on it:

    python verify_startup.py && python character_studio.py export --actor icarus

Checks, in order:
  1. ollama     local Ollama server answers /api/tags (optionally has a model)
  2. comfyui    local ComfyUI server answers /system_stats
  3. blender    a Blender binary is on PATH (or --blender) and reports a version
  4. arc        an Intel Arc B60 is visible to the OS
  5. nvidia     an NVIDIA RTX 5070 Ti is visible to nvidia-smi

Python 3 stdlib only. Only talks to localhost (Ollama / ComfyUI); never calls
out to the internet. Every probe has a timeout so a hung service can't hang
the check.

Examples:
  python verify_startup.py
  python verify_startup.py --ollama-model llama3.1 --strict
  python verify_startup.py --skip arc --skip nvidia      # laptop without GPUs
  python verify_startup.py --json > startup.json
"""

import argparse
import glob
import json
import os
import platform
import shutil
import subprocess
import sys
import urllib.error
import urllib.request
from pathlib import Path

GO, WARN, NOGO = "GO", "WARN", "NO-GO"

DEFAULT_OLLAMA_URL = "http://127.0.0.1:11434"
DEFAULT_COMFY_URL = "http://127.0.0.1:8188"
DEFAULT_ARC_NAME = "B60"
DEFAULT_NVIDIA_NAME = "5070 Ti"

CHECK_ORDER = ("ollama", "comfyui", "blender", "arc", "nvidia")


class Result:
    def __init__(self, name, status, detail, hint=""):
        self.name = name
        self.status = status
        self.detail = detail
        self.hint = hint

    def as_dict(self):
        return {"check": self.name, "status": self.status,
                "detail": self.detail, "hint": self.hint}


# --------------------------------------------------------------------------
# helpers

def http_get_json(url, timeout):
    """GET url and parse JSON. Raises on any failure; callers translate."""
    req = urllib.request.Request(url, headers={"User-Agent": "verify_startup"})
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return json.loads(resp.read().decode("utf-8", "replace"))


def run(cmd, timeout):
    """Run a command, return (returncode, stdout+stderr). Never raises."""
    try:
        proc = subprocess.run(cmd, capture_output=True, text=True,
                              timeout=timeout, check=False)
    except FileNotFoundError:
        return 127, ""
    except subprocess.TimeoutExpired:
        return 124, f"timed out after {timeout}s"
    except OSError as exc:
        return 1, str(exc)
    return proc.returncode, (proc.stdout or "") + (proc.stderr or "")


def describe_http_error(exc):
    if isinstance(exc, urllib.error.HTTPError):
        return f"HTTP {exc.code}"
    if isinstance(exc, urllib.error.URLError):
        reason = exc.reason
        return f"connection refused ({reason})" if reason else "connection refused"
    if isinstance(exc, TimeoutError):
        return "timed out"
    return f"{type(exc).__name__}: {exc}"


# --------------------------------------------------------------------------
# 1. Ollama

def check_ollama(args):
    url = args.ollama_url.rstrip("/")
    try:
        data = http_get_json(f"{url}/api/tags", args.timeout)
    except Exception as exc:  # noqa: BLE001 - we report, not crash
        return Result("ollama", NOGO, f"{url} -> {describe_http_error(exc)}",
                      "start it with `ollama serve` (or the Ollama tray app)")

    models = [m.get("name", "?") for m in data.get("models", [])]
    if args.ollama_model:
        want = args.ollama_model
        hit = [m for m in models if m == want or m.split(":")[0] == want]
        if not hit:
            return Result("ollama", NOGO,
                          f"server up, model '{want}' not pulled "
                          f"({len(models)} models present)",
                          f"run `ollama pull {want}`")
        return Result("ollama", GO, f"server up, model {hit[0]} present")

    if not models:
        return Result("ollama", WARN, "server up, no models pulled",
                      "run `ollama pull <model>` before text/prompt steps")
    shown = ", ".join(models[:3]) + (" …" if len(models) > 3 else "")
    return Result("ollama", GO, f"server up, {len(models)} model(s): {shown}")


# --------------------------------------------------------------------------
# 2. ComfyUI

def check_comfyui(args):
    url = args.comfy_url.rstrip("/")
    try:
        data = http_get_json(f"{url}/system_stats", args.timeout)
    except Exception as exc:  # noqa: BLE001
        return Result("comfyui", NOGO, f"{url} -> {describe_http_error(exc)}",
                      "start ComfyUI (python main.py --listen 127.0.0.1 --port 8188)")

    system = data.get("system", {})
    version = system.get("comfyui_version") or system.get("version") or "?"
    devices = data.get("devices", [])
    names = []
    for dev in devices:
        name = dev.get("name", "?")
        total = dev.get("vram_total")
        if isinstance(total, (int, float)) and total > 0:
            name += f" ({total / 2**30:.0f} GiB)"
        names.append(name)
    if not devices:
        return Result("comfyui", WARN, f"v{version} up, no compute device reported",
                      "ComfyUI is running on CPU; check its torch/GPU install")
    return Result("comfyui", GO, f"v{version} up on {', '.join(names)}")


# --------------------------------------------------------------------------
# 3. Blender

def find_blender(explicit):
    if explicit:
        return explicit if Path(explicit).exists() else None
    env = os.environ.get("BLENDER")
    if env and Path(env).exists():
        return env
    found = shutil.which("blender") or shutil.which("Blender")
    if found:
        return found
    candidates = []
    system = platform.system()
    if system == "Windows":
        for root in (os.environ.get("ProgramFiles", r"C:\Program Files"),
                     os.environ.get("ProgramFiles(x86)", r"C:\Program Files (x86)")):
            candidates += glob.glob(os.path.join(
                root, "Blender Foundation", "Blender*", "blender.exe"))
        candidates += glob.glob(os.path.join(
            os.environ.get("LOCALAPPDATA", ""), "Programs", "Blender*", "blender.exe"))
    elif system == "Darwin":
        candidates += glob.glob("/Applications/Blender*.app/Contents/MacOS/Blender")
    else:
        candidates += glob.glob("/opt/blender*/blender")
        candidates += glob.glob("/snap/bin/blender")
        candidates += glob.glob(os.path.expanduser("~/.local/bin/blender"))
    candidates = sorted(c for c in candidates if Path(c).exists())
    return candidates[-1] if candidates else None  # newest-looking path


def check_blender(args):
    exe = find_blender(args.blender)
    if not exe:
        return Result("blender", NOGO, "no blender binary found",
                      "install Blender, add it to PATH, or pass --blender <path>")
    code, out = run([exe, "--version"], args.timeout)
    if code != 0:
        return Result("blender", NOGO, f"{exe} exited {code}: {out.strip()[:80]}",
                      "the binary exists but won't start; reinstall or check drivers")
    first = next((ln for ln in out.splitlines() if ln.strip()), "").strip()
    return Result("blender", GO, f"{first or 'version unknown'} at {exe}")


# --------------------------------------------------------------------------
# 4/5. GPUs

def enumerate_nvidia(timeout):
    """Return list of (name, vram_mib, driver) from nvidia-smi, or None if absent."""
    smi = shutil.which("nvidia-smi")
    if not smi and platform.system() == "Windows":
        for cand in (r"C:\Windows\System32\nvidia-smi.exe",
                     r"C:\Program Files\NVIDIA Corporation\NVSMI\nvidia-smi.exe"):
            if Path(cand).exists():
                smi = cand
                break
    if not smi:
        return None
    code, out = run([smi, "--query-gpu=name,memory.total,driver_version",
                     "--format=csv,noheader,nounits"], timeout)
    if code != 0:
        return []
    gpus = []
    for line in out.splitlines():
        parts = [p.strip() for p in line.split(",")]
        if len(parts) >= 3:
            gpus.append((parts[0], parts[1], parts[2]))
        elif parts and parts[0]:
            gpus.append((parts[0], "?", "?"))
    return gpus


def enumerate_display_adapters(timeout):
    """Best-effort list of display adapter names the OS can see."""
    names = []
    system = platform.system()
    if system == "Windows":
        ps = shutil.which("powershell") or shutil.which("pwsh")
        if ps:
            code, out = run([ps, "-NoProfile", "-Command",
                             "Get-CimInstance Win32_VideoController | "
                             "Select-Object -ExpandProperty Name"], timeout)
            if code == 0:
                names += [ln.strip() for ln in out.splitlines() if ln.strip()]
    elif system == "Linux":
        if shutil.which("lspci"):
            code, out = run(["lspci", "-nn"], timeout)
            if code == 0:
                for ln in out.splitlines():
                    if any(tag in ln for tag in ("VGA", "3D controller", "Display")):
                        names.append(ln.split(": ", 1)[-1].strip())
        if not names:
            # Fall back to sysfs vendor IDs when lspci is missing.
            vendors = {"0x8086": "Intel GPU", "0x10de": "NVIDIA GPU", "0x1002": "AMD GPU"}
            for vend in glob.glob("/sys/class/drm/card*/device/vendor"):
                try:
                    vid = Path(vend).read_text().strip().lower()
                except OSError:
                    continue
                dev = Path(vend).with_name("device")
                try:
                    did = dev.read_text().strip()
                except OSError:
                    did = "?"
                names.append(f"{vendors.get(vid, vid)} [{vid}:{did}]")
        # Intel's own tool knows the marketing name when present.
        if shutil.which("xpu-smi"):
            code, out = run(["xpu-smi", "discovery"], timeout)
            if code == 0:
                for ln in out.splitlines():
                    if "Device Name" in ln:
                        names.append(ln.split(":", 1)[-1].strip())
    elif system == "Darwin":
        code, out = run(["system_profiler", "SPDisplaysDataType"], timeout)
        if code == 0:
            for ln in out.splitlines():
                if "Chipset Model" in ln:
                    names.append(ln.split(":", 1)[-1].strip())
    # de-dupe, keep order
    seen, uniq = set(), []
    for n in names:
        if n not in seen:
            seen.add(n)
            uniq.append(n)
    return uniq


def check_arc(args, adapters):
    want = args.arc_name.lower()
    hits = [a for a in adapters if want in a.lower()]
    if hits:
        return Result("arc", GO, hits[0])
    intel = [a for a in adapters if "intel" in a.lower() or "arc" in a.lower()
             or "battlemage" in a.lower()]
    if intel:
        return Result("arc", WARN,
                      f"Intel adapter present but '{args.arc_name}' not in name: "
                      f"{intel[0]}",
                      "install Intel's driver / xpu-smi so the model name is reported, "
                      "or pass --arc-name to match what your OS reports")
    if not adapters:
        return Result("arc", NOGO, "no display adapters could be enumerated",
                      "install lspci (pciutils) on Linux; on Windows run from a "
                      "shell that has PowerShell")
    return Result("arc", NOGO,
                  f"no Intel Arc '{args.arc_name}' among {len(adapters)} adapter(s)",
                  "seat/power the card, then install the Intel Arc driver")


def check_nvidia(args, nvidia, adapters):
    want = args.nvidia_name.lower()
    if nvidia is None:
        hits = [a for a in adapters if want in a.lower()]
        if hits:
            return Result("nvidia", WARN, f"{hits[0]} visible, but nvidia-smi missing",
                          "install the NVIDIA driver so nvidia-smi / CUDA work")
        return Result("nvidia", NOGO, "nvidia-smi not found",
                      "install the NVIDIA driver (it ships nvidia-smi)")
    if not nvidia:
        return Result("nvidia", NOGO, "nvidia-smi present but reports no GPU",
                      "driver loaded without a card; reseat or check `nvidia-smi` output")
    for name, vram, drv in nvidia:
        if want in name.lower():
            vram_txt = f"{int(vram) // 1024} GiB" if vram.isdigit() else vram
            return Result("nvidia", GO, f"{name}, {vram_txt}, driver {drv}")
    names = ", ".join(n for n, _, _ in nvidia)
    return Result("nvidia", WARN, f"NVIDIA GPU(s) present but not '{args.nvidia_name}': {names}",
                  "pass --nvidia-name to match your card if this is intentional")


# --------------------------------------------------------------------------
# report

def print_table(results, strict):
    w_name = max(len("Check"), *(len(r.name) for r in results))
    w_stat = max(len("Status"), *(len(r.status) for r in results))
    line = f"{'Check':<{w_name}}  {'Status':<{w_stat}}  Detail"
    print(line)
    print("-" * (len(line) + 40))
    for r in results:
        print(f"{r.name:<{w_name}}  {r.status:<{w_stat}}  {r.detail}")
        if r.status != GO and r.hint:
            print(f"{'':<{w_name}}  {'':<{w_stat}}  -> {r.hint}")
    print()
    failing = [r for r in results if r.status == NOGO or (strict and r.status == WARN)]
    warns = [r for r in results if r.status == WARN]
    if failing:
        print(f"NO-GO: {len(failing)} of {len(results)} check(s) failed: "
              + ", ".join(r.name for r in failing))
    elif warns:
        print(f"GO (with warnings): {len(warns)} check(s) need attention: "
              + ", ".join(r.name for r in warns))
    else:
        print(f"GO: all {len(results)} checks passed")
    return not failing


def main(argv=None):
    parser = argparse.ArgumentParser(
        prog="verify_startup",
        description="Go/no-go dependency check for the Character Studio pipeline.")
    parser.add_argument("--ollama-url", default=DEFAULT_OLLAMA_URL,
                        help=f"Ollama base URL (default {DEFAULT_OLLAMA_URL})")
    parser.add_argument("--ollama-model", default=None,
                        help="require this model to be pulled (e.g. llama3.1)")
    parser.add_argument("--comfy-url", default=DEFAULT_COMFY_URL,
                        help=f"ComfyUI base URL (default {DEFAULT_COMFY_URL})")
    parser.add_argument("--blender", default=None,
                        help="explicit path to the blender binary ($BLENDER also honoured)")
    parser.add_argument("--arc-name", default=DEFAULT_ARC_NAME,
                        help=f"substring to match the Intel card (default '{DEFAULT_ARC_NAME}')")
    parser.add_argument("--nvidia-name", default=DEFAULT_NVIDIA_NAME,
                        help=f"substring to match the NVIDIA card (default '{DEFAULT_NVIDIA_NAME}')")
    parser.add_argument("--timeout", type=float, default=5.0,
                        help="seconds per probe (default 5)")
    parser.add_argument("--skip", action="append", default=[], choices=CHECK_ORDER,
                        metavar="CHECK", help="skip a check; repeatable "
                        f"({', '.join(CHECK_ORDER)})")
    parser.add_argument("--strict", action="store_true",
                        help="treat WARN as NO-GO for the exit code")
    parser.add_argument("--json", action="store_true",
                        help="emit JSON instead of the table")
    args = parser.parse_args(argv)

    skip = set(args.skip)
    results = []

    if "ollama" not in skip:
        results.append(check_ollama(args))
    if "comfyui" not in skip:
        results.append(check_comfyui(args))
    if "blender" not in skip:
        results.append(check_blender(args))

    need_gpu = {"arc", "nvidia"} - skip
    adapters = enumerate_display_adapters(args.timeout) if need_gpu else []
    nvidia = enumerate_nvidia(args.timeout) if "nvidia" in need_gpu else None
    if "arc" in need_gpu:
        results.append(check_arc(args, adapters))
    if "nvidia" in need_gpu:
        results.append(check_nvidia(args, nvidia, adapters))

    if args.json:
        ok = all(r.status == GO or (r.status == WARN and not args.strict)
                 for r in results)
        print(json.dumps({
            "go": ok,
            "platform": platform.platform(),
            "python": platform.python_version(),
            "adapters_seen": adapters,
            "checks": [r.as_dict() for r in results],
        }, indent=2))
        return 0 if ok else 1

    print(f"verify_startup on {platform.system()} {platform.release()}, "
          f"Python {platform.python_version()}")
    print()
    ok = print_table(results, args.strict)
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())

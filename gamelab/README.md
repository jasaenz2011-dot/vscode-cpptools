# 🧙 GameLab

A simple, self-hosted game-creation lab for the classroom. Students pick a
starter game (platformer, overhead adventure, turn-based RPG, or shooter),
edit the code in the browser with a live preview, and generate their own
sprites and sound effects — all powered by **open-source AI running on your
own machines**. No accounts, no cloud, no API keys.

Everything runs from one machine on your lab network:

```
Student browsers ──► GameLab server (Node.js, this folder)
                        ├─► Stable Diffusion (AUTOMATIC1111) — sprite art
                        ├─► Ollama (open LLM)               — coding helper chat
                        ├─► MusicGen sidecar (music_server.py) — music, with optional
                        │       YouTube "sounds like this" reference via yt-dlp
                        ├─► Piper TTS                        — voice acting for NPC lines
                        └─► built-in chip synthesizer        — retro sound FX (no AI needed)
```

Projects are plain folders on disk (`projects/<name>/`) — easy to back up,
grade, or hand back on a USB stick.

## Quick start (no AI yet)

Requires **Node.js 18+**.

```bash
cd gamelab
npm install
npm start
```

Open http://localhost:8420. Students on the same network use
`http://<your-machine-ip>:8420`.

Everything except AI sprite generation and the helper chat works immediately:
all four starter games run, the code editor and live preview work, and the
**Sounds** tab (a built-in retro synthesizer, no AI involved) can already make
jump/coin/laser/explosion effects.

## Adding the AI backends (open source, local)

Both backends are optional and independent. Run them on the same machine or
on one beefier "AI box" that the whole lab shares — just point `config.json`
at its IP.

### Sprite art — Stable Diffusion via AUTOMATIC1111

1. Install [AUTOMATIC1111 Stable Diffusion WebUI](https://github.com/AUTOMATIC1111/stable-diffusion-webui).
2. Download an open model into `models/Stable-diffusion/` — good classroom picks:
   - **Stable Diffusion 1.5** (small, fast, runs on ~4 GB VRAM)
   - a pixel-art fine-tune or LoRA from Civitai for better sprite results
3. Start it with the API enabled:
   ```bash
   ./webui.sh --api --listen        # (webui-user.bat with the same flags on Windows)
   ```
4. In `config.json`, set `sd_url` to the machine running it, e.g.
   `"sd_url": "http://192.168.1.50:7860"`.

GameLab already sends pixel-art-friendly prompts and a "flat background"
instruction, and the editor can knock out the background client-side so
sprites drop straight into Phaser.

### Music — MusicGen (with YouTube "sounds like this" references)

Students describe the track AND can paste a YouTube link meaning "this
vibe". The server pulls ~25 seconds of that audio as a *style reference*
and MusicGen composes an **original** track guided by it — the YouTube
audio itself is never saved into any project.

On the AI box (GPU strongly recommended, ~8 GB VRAM):

```bash
pip install flask audiocraft torch torchaudio
python3 music_server.py          # first run downloads the model (~4 GB)
```

For the YouTube reference feature, the GameLab server machine also needs:

```bash
pip install yt-dlp               # and ffmpeg from your package manager
```

Set `music_url` in `config.json` if the sidecar runs on another machine.
Without yt-dlp the tool still works — it just generates from the text
description and says so.

### Voice acting — Piper TTS

Fast, open-source, CPU-only text-to-speech for NPC lines:

```bash
pip install piper-tts
```

Then download voice files into the `voices/` folder — see
`voices/README.txt` for good starter voices. The Voice tool lists every
installed voice automatically.

### Coding helper — Ollama

1. Install [Ollama](https://ollama.com).
2. Pull an open coding model (pick by your hardware):
   ```bash
   ollama pull qwen2.5-coder:7b     # good default, ~8 GB RAM
   ollama pull qwen2.5-coder:1.5b   # small machines
   ```
3. If Ollama runs on a different machine than GameLab, start it listening on
   the network: `OLLAMA_HOST=0.0.0.0 ollama serve`, and set `ollama_url` and
   `ollama_model` in `config.json`.

The helper is tutor-prompted: it explains, suggests small snippets, and sees
the file the student has open — it won't dump whole rewritten files.

## config.json

| Key | Meaning | Default |
| --- | --- | --- |
| `port` | GameLab web port | `8420` |
| `sd_url` | AUTOMATIC1111 base URL | `http://127.0.0.1:7860` |
| `sd_steps` / `sd_sampler` | generation speed/quality knobs | `20` / `Euler a` |
| `ollama_url` | Ollama base URL | `http://127.0.0.1:11434` |
| `ollama_model` | model tag for the helper | `qwen2.5-coder:7b` |
| `music_url` | MusicGen sidecar base URL | `http://127.0.0.1:8760` |
| `piper_bin` / `piper_voices_dir` | Piper command and voices folder | `piper` / `voices` |

The home page shows a live online/offline badge for both backends.

## The starter games

| Template | Genre | Built-in lesson hooks |
| --- | --- | --- |
| `platformer` | side-scrolling platformer | gravity/jump constants, camera follow, level layout by coordinates |
| `adventure` | overhead adventure | **level drawn as a text map** students can redraw, keys/door logic, patrols |
| `rpg` | turn-based RPG battle | data-driven move list, turn state machine, HP/MP resource math |
| `shooter` | vertical shooter (side-scroll variant suggested in comments) | spawn timers, difficulty scaling, lives/game-over loop |
| `fighter` | 2-player versus fighter on one keyboard | attack data (damage/reach/cooldown), hit detection, knockback and stun |

Each is ~150 lines of heavily commented Phaser 3 with a `TWEAK ME` block at
the top, runs out of the box with placeholder rectangles, and contains
`SWAP IN YOUR ART` comments showing exactly how to load generated assets.

To add your own template: copy a folder in `templates/`, edit it, and give it
a `template.json` with a title and description.

## Classroom notes

- **Trust model:** this is for a trusted lab LAN. There is no login and no
  sandboxing beyond path checks — don't expose it to the internet.
- **Grading/backup:** zip the `projects/` folder.
- **Resetting between classes:** delete folders inside `projects/`.
- **Offline labs:** after `npm install`, no internet is needed at all —
  Phaser and the editor are served locally and both AI backends are local.

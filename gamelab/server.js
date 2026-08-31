/*
 * GameLab server — serves the editor UI, manages student projects on disk,
 * and proxies AI requests to open-source backends:
 *   - Stable Diffusion (AUTOMATIC1111 WebUI, run with --api) for sprite art
 *   - Ollama for the coding helper chat
 * No database: projects are plain folders under ./projects, so students can
 * also grab their work with a USB stick.
 */
const express = require('express');
const fs = require('fs');
const fsp = fs.promises;
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');

const CONFIG_PATH = path.join(__dirname, 'config.json');
const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));

const ROOT = __dirname;
const PROJECTS_DIR = path.join(ROOT, 'projects');
const TEMPLATES_DIR = path.join(ROOT, 'templates');

if (!fs.existsSync(PROJECTS_DIR)) fs.mkdirSync(PROJECTS_DIR);

const app = express();
app.use(express.json({ limit: '30mb' }));

// ---------- static: UI, vendored libraries, playable projects ----------

app.use('/', express.static(path.join(ROOT, 'public')));
app.use('/vendor/phaser.min.js', express.static(path.join(ROOT, 'node_modules/phaser/dist/phaser.min.js')));
app.use('/vendor/codemirror', express.static(path.join(ROOT, 'node_modules/codemirror')));
app.use('/play', express.static(PROJECTS_DIR));

// ---------- helpers ----------

const SAFE_NAME = /^[a-z0-9][a-z0-9-_]{0,40}$/;

function projectPath(id) {
  if (!SAFE_NAME.test(id)) throw httpError(400, 'Bad project name.');
  return path.join(PROJECTS_DIR, id);
}

// Resolve a file path inside a project and refuse anything that escapes it.
function safeFile(projDir, rel) {
  const abs = path.resolve(projDir, rel);
  if (!abs.startsWith(projDir + path.sep)) throw httpError(400, 'Bad file path.');
  return abs;
}

function httpError(status, message) {
  const e = new Error(message);
  e.status = status;
  return e;
}

async function copyDir(src, dest) {
  await fsp.mkdir(dest, { recursive: true });
  for (const entry of await fsp.readdir(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) await copyDir(s, d);
    else await fsp.copyFile(s, d);
  }
}

async function listFiles(dir, base = '') {
  let out = [];
  for (const entry of await fsp.readdir(dir, { withFileTypes: true })) {
    const rel = base ? base + '/' + entry.name : entry.name;
    if (entry.isDirectory()) out = out.concat(await listFiles(path.join(dir, entry.name), rel));
    else out.push(rel);
  }
  return out.sort();
}

const wrap = (fn) => (req, res) => fn(req, res).catch((e) => {
  res.status(e.status || 500).json({ error: e.message });
});

// ---------- config / backend status ----------

app.get('/api/status', wrap(async (req, res) => {
  const status = {
    sd: false, ollama: false, music: false, voices: 0,
    sd_url: config.sd_url, ollama_url: config.ollama_url, ollama_model: config.ollama_model, music_url: config.music_url
  };
  try {
    const r = await fetch(config.sd_url + '/sdapi/v1/options', { signal: AbortSignal.timeout(2500) });
    status.sd = r.ok;
  } catch { /* backend offline */ }
  try {
    const r = await fetch(config.ollama_url + '/api/tags', { signal: AbortSignal.timeout(2500) });
    status.ollama = r.ok;
  } catch { /* backend offline */ }
  try {
    const r = await fetch(config.music_url + '/health', { signal: AbortSignal.timeout(2500) });
    status.music = r.ok;
  } catch { /* backend offline */ }
  status.voices = listVoices().length;
  res.json(status);
}));

// ---------- templates & projects ----------

app.get('/api/templates', wrap(async (req, res) => {
  const dirs = await fsp.readdir(TEMPLATES_DIR, { withFileTypes: true });
  const out = [];
  for (const d of dirs) {
    if (!d.isDirectory()) continue;
    const metaPath = path.join(TEMPLATES_DIR, d.name, 'template.json');
    let meta = { title: d.name, description: '' };
    try { meta = JSON.parse(await fsp.readFile(metaPath, 'utf8')); } catch { /* optional */ }
    out.push({ id: d.name, ...meta });
  }
  res.json(out);
}));

app.get('/api/projects', wrap(async (req, res) => {
  const dirs = await fsp.readdir(PROJECTS_DIR, { withFileTypes: true });
  res.json(dirs.filter((d) => d.isDirectory()).map((d) => d.name).sort());
}));

app.post('/api/projects', wrap(async (req, res) => {
  const { name, template } = req.body || {};
  if (!SAFE_NAME.test(name || '')) throw httpError(400, 'Project name must be lowercase letters, numbers, - or _.');
  if (!SAFE_NAME.test(template || '')) throw httpError(400, 'Bad template name.');
  const src = path.join(TEMPLATES_DIR, template);
  if (!fs.existsSync(src)) throw httpError(404, 'Template not found.');
  const dest = projectPath(name);
  if (fs.existsSync(dest)) throw httpError(409, 'A project with that name already exists.');
  await copyDir(src, dest);
  await fsp.rm(path.join(dest, 'template.json'), { force: true });
  res.json({ ok: true, id: name });
}));

app.get('/api/projects/:id/files', wrap(async (req, res) => {
  const dir = projectPath(req.params.id);
  if (!fs.existsSync(dir)) throw httpError(404, 'Project not found.');
  res.json(await listFiles(dir));
}));

app.get('/api/projects/:id/file', wrap(async (req, res) => {
  const abs = safeFile(projectPath(req.params.id), String(req.query.path || ''));
  res.json({ content: await fsp.readFile(abs, 'utf8') });
}));

app.put('/api/projects/:id/file', wrap(async (req, res) => {
  const abs = safeFile(projectPath(req.params.id), String(req.query.path || ''));
  await fsp.mkdir(path.dirname(abs), { recursive: true });
  await fsp.writeFile(abs, req.body.content ?? '');
  res.json({ ok: true });
}));

// Save a generated asset (base64 png/wav) into the project's assets folder.
app.post('/api/projects/:id/asset', wrap(async (req, res) => {
  const { filename, dataBase64 } = req.body || {};
  if (!filename || !dataBase64) throw httpError(400, 'filename and dataBase64 are required.');
  if (!/^[a-z0-9][a-z0-9-_]{0,40}\.(png|wav)$/.test(filename)) {
    throw httpError(400, 'Filename must be lowercase and end in .png or .wav.');
  }
  const abs = safeFile(projectPath(req.params.id), 'assets/' + filename);
  await fsp.mkdir(path.dirname(abs), { recursive: true });
  await fsp.writeFile(abs, Buffer.from(dataBase64, 'base64'));
  res.json({ ok: true, path: 'assets/' + filename });
}));

// ---------- AI: sprites via Stable Diffusion (AUTOMATIC1111 API) ----------

const SPRITE_STYLES = {
  character: 'pixel art game character sprite, full body, facing camera, centered, plain flat background, clean outline, 16-bit style',
  item: 'pixel art game item icon, centered, plain flat background, clean outline, 16-bit style',
  enemy: 'pixel art game enemy monster sprite, full body, centered, plain flat background, clean outline, 16-bit style',
  tile: 'pixel art seamless game texture tile, top-down, flat, 16-bit style',
  background: 'pixel art game background scene, 16-bit style, detailed'
};

app.post('/api/generate/sprite', wrap(async (req, res) => {
  const { prompt, style = 'character', size = 512 } = req.body || {};
  if (!prompt) throw httpError(400, 'Prompt is required.');
  const stylePrefix = SPRITE_STYLES[style] || SPRITE_STYLES.character;
  const payload = {
    prompt: `${stylePrefix}, ${prompt}`,
    negative_prompt: 'photo, realistic, blurry, watermark, text, signature, cropped, deformed',
    steps: config.sd_steps || 20,
    sampler_name: config.sd_sampler || 'Euler a',
    width: Number(size) || 512,
    height: Number(size) || 512,
    tiling: style === 'tile'
  };
  let r;
  try {
    r = await fetch(config.sd_url + '/sdapi/v1/txt2img', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(180000)
    });
  } catch {
    throw httpError(503, `Stable Diffusion is not reachable at ${config.sd_url}. Start AUTOMATIC1111 with --api (see README) or fix sd_url in config.json.`);
  }
  if (!r.ok) throw httpError(502, `Stable Diffusion returned an error (${r.status}).`);
  const data = await r.json();
  if (!data.images || !data.images.length) throw httpError(502, 'Stable Diffusion returned no image.');
  res.json({ imageBase64: data.images[0] });
}));

// ---------- AI: music via MusicGen sidecar, with optional YouTube style reference ----------

// Runs a command with stdin/timeout, collecting stdout. Used for yt-dlp and piper.
function runCommand(cmd, args, { stdin = null, timeoutMs = 120000 } = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: ['pipe', 'pipe', 'pipe'] });
    let out = '', err = '';
    const timer = setTimeout(() => { child.kill('SIGKILL'); reject(new Error(`${cmd} timed out`)); }, timeoutMs);
    child.stdout.on('data', (d) => { out += d; });
    child.stderr.on('data', (d) => { err += d; });
    child.on('error', (e) => { clearTimeout(timer); reject(e); });
    child.on('close', (code) => {
      clearTimeout(timer);
      if (code === 0) resolve(out);
      else reject(new Error(`${cmd} failed: ${err.slice(-300)}`));
    });
    if (stdin !== null) child.stdin.write(stdin);
    child.stdin.end();
  });
}

const YOUTUBE_URL = /^https?:\/\/(www\.|m\.|music\.)?(youtube\.com|youtu\.be)\//;

app.post('/api/generate/music', wrap(async (req, res) => {
  const { prompt, youtubeUrl, duration = 20 } = req.body || {};
  if (!prompt) throw httpError(400, 'Describe the music you want.');
  const secs = Math.min(30, Math.max(5, Number(duration) || 20));

  // Optional: pull ~25s of audio from a YouTube link as a style/melody
  // reference. The clip only guides generation — it is never saved into
  // the student's project.
  let referenceBase64 = null;
  let warning = null;
  if (youtubeUrl) {
    if (!YOUTUBE_URL.test(youtubeUrl)) throw httpError(400, 'The reference link must be a YouTube URL.');
    const tmp = await fsp.mkdtemp(path.join(os.tmpdir(), 'gamelab-ref-'));
    try {
      await runCommand('yt-dlp', [
        '--no-playlist', '-x', '--audio-format', 'wav',
        '--download-sections', '*00:00:00-00:00:25',
        '-o', path.join(tmp, 'ref.%(ext)s'), youtubeUrl
      ], { timeoutMs: 120000 });
      referenceBase64 = (await fsp.readFile(path.join(tmp, 'ref.wav'))).toString('base64');
    } catch (e) {
      warning = 'Could not fetch the YouTube reference (' + e.message.split('\n')[0] +
        '). Generated from your text description only. Is yt-dlp installed on the server?';
    } finally {
      await fsp.rm(tmp, { recursive: true, force: true });
    }
  }

  let r;
  try {
    r = await fetch(config.music_url + '/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, duration: secs, referenceBase64 }),
      signal: AbortSignal.timeout(600000)
    });
  } catch {
    throw httpError(503, `The music server is not reachable at ${config.music_url}. Start it with: python3 music_server.py (see README) or fix music_url in config.json.`);
  }
  if (!r.ok) {
    const body = await r.text().catch(() => '');
    throw httpError(502, `Music server error (${r.status}). ${body.slice(0, 200)}`);
  }
  const data = await r.json();
  res.json({ audioBase64: data.audioBase64, warning });
}));

// ---------- AI: voice acting via Piper TTS ----------

function voicesDir() {
  return path.resolve(ROOT, config.piper_voices_dir || 'voices');
}

function listVoices() {
  try {
    return fs.readdirSync(voicesDir())
      .filter((f) => f.endsWith('.onnx'))
      .map((f) => f.replace(/\.onnx$/, ''))
      .sort();
  } catch {
    return [];
  }
}

app.get('/api/voices', wrap(async (req, res) => res.json(listVoices())));

app.post('/api/generate/speech', wrap(async (req, res) => {
  const { text, voice } = req.body || {};
  if (!text || !text.trim()) throw httpError(400, 'Type the line you want spoken.');
  if (text.length > 1000) throw httpError(400, 'Keep lines under 1000 characters.');
  const voices = listVoices();
  if (!voices.length) throw httpError(503, `No voices installed. Download Piper voice files (.onnx + .onnx.json) into the ${config.piper_voices_dir}/ folder (see README).`);
  if (!voices.includes(voice)) throw httpError(400, 'Unknown voice. Pick one from the list.');

  const outFile = path.join(os.tmpdir(), `gamelab-tts-${Date.now()}.wav`);
  try {
    await runCommand(config.piper_bin || 'piper', [
      '--model', path.join(voicesDir(), voice + '.onnx'),
      '--output_file', outFile
    ], { stdin: text.trim(), timeoutMs: 120000 });
    res.json({ audioBase64: (await fsp.readFile(outFile)).toString('base64') });
  } catch (e) {
    if (e.code === 'ENOENT') {
      throw httpError(503, `Piper is not installed (command "${config.piper_bin}" not found). Install it with: pip install piper-tts (see README).`);
    }
    throw httpError(502, 'Voice generation failed: ' + e.message.split('\n')[0]);
  } finally {
    await fsp.rm(outFile, { force: true });
  }
}));

// ---------- AI: coding helper via Ollama ----------

app.post('/api/chat', wrap(async (req, res) => {
  const { messages } = req.body || {};
  if (!Array.isArray(messages) || !messages.length) throw httpError(400, 'messages array is required.');
  let r;
  try {
    r = await fetch(config.ollama_url + '/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: config.ollama_model, messages, stream: false }),
      signal: AbortSignal.timeout(300000)
    });
  } catch {
    throw httpError(503, `Ollama is not reachable at ${config.ollama_url}. Start Ollama and pull ${config.ollama_model} (see README) or fix ollama_url in config.json.`);
  }
  if (!r.ok) {
    const body = await r.text().catch(() => '');
    throw httpError(502, `Ollama returned an error (${r.status}). ${body.slice(0, 200)}`);
  }
  const data = await r.json();
  res.json({ reply: data.message?.content || '' });
}));

app.listen(config.port, () => {
  console.log(`GameLab running at http://localhost:${config.port}`);
  console.log(`Students on the lab network can use http://<this-machine-ip>:${config.port}`);
});

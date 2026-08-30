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
const path = require('path');

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
  const status = { sd: false, ollama: false, sd_url: config.sd_url, ollama_url: config.ollama_url, ollama_model: config.ollama_model };
  try {
    const r = await fetch(config.sd_url + '/sdapi/v1/options', { signal: AbortSignal.timeout(2500) });
    status.sd = r.ok;
  } catch { /* backend offline */ }
  try {
    const r = await fetch(config.ollama_url + '/api/tags', { signal: AbortSignal.timeout(2500) });
    status.ollama = r.ok;
  } catch { /* backend offline */ }
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

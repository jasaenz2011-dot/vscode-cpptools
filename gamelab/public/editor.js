/* GameLab editor page: file editing, live preview, and the three asset tools. */

const projectId = new URLSearchParams(location.search).get('project');
if (!projectId) location.href = '/';
document.getElementById('projTitle').textContent = projectId;
document.title = projectId + ' — GameLab';

async function api(url, opts) {
  const r = await fetch(url, opts);
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data.error || ('Request failed: ' + r.status));
  return data;
}
const jsonPost = (url, body) => api(url, {
  method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
});

// ---------- code editor ----------

const cm = CodeMirror.fromTextArea(document.getElementById('code'), {
  theme: 'material-darker',
  lineNumbers: true,
  indentUnit: 2,
  mode: 'javascript'
});

let currentFile = null;
let dirty = false;
cm.on('change', () => {
  if (currentFile) { dirty = true; setSaveState('unsaved changes'); }
});

function setSaveState(text) { document.getElementById('saveState').textContent = text; }

function modeFor(file) {
  if (file.endsWith('.html')) return 'htmlmixed';
  if (file.endsWith('.css')) return 'css';
  if (file.endsWith('.json')) return { name: 'javascript', json: true };
  return 'javascript';
}

async function openFile(file) {
  if (dirty && currentFile) await saveFile();
  const { content } = await api(`/api/projects/${projectId}/file?path=${encodeURIComponent(file)}`);
  currentFile = file;
  cm.setOption('mode', modeFor(file));
  cm.setValue(content);
  dirty = false;
  setSaveState('');
  document.querySelectorAll('.filepane .file').forEach((b) => b.classList.toggle('active', b.dataset.file === file));
}

async function saveFile() {
  if (!currentFile) return;
  await api(`/api/projects/${projectId}/file?path=${encodeURIComponent(currentFile)}`, {
    method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content: cm.getValue() })
  });
  dirty = false;
  setSaveState('saved ✓');
}

async function loadFiles(preferred) {
  const files = await api(`/api/projects/${projectId}/files`);
  const editable = files.filter((f) => /\.(js|html|css|json|md|txt)$/.test(f));
  const pane = document.getElementById('filePane');
  pane.innerHTML = '';
  editable.forEach((f) => {
    const b = document.createElement('button');
    b.className = 'file';
    b.dataset.file = f;
    b.textContent = f;
    b.onclick = () => openFile(f);
    pane.appendChild(b);
  });
  const first = preferred && editable.includes(preferred) ? preferred
    : editable.includes('game.js') ? 'game.js' : editable[0];
  if (first) await openFile(first);
}

function runGame() {
  document.getElementById('gameFrame').src = `/play/${projectId}/index.html?t=${Date.now()}`;
}

document.getElementById('saveBtn').onclick = saveFile;
document.getElementById('runBtn').onclick = async () => { await saveFile(); runGame(); };
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); saveFile(); }
});

// ---------- side tabs ----------

document.querySelectorAll('.tabs button').forEach((b) => {
  b.onclick = () => {
    document.querySelectorAll('.tabs button').forEach((x) => x.classList.toggle('active', x === b));
    document.querySelectorAll('.tabbody').forEach((x) => x.classList.toggle('active', x.id === 'tab-' + b.dataset.tab));
  };
});

// ---------- sprites (Stable Diffusion) ----------

// Removes the flat AI-generated background by clearing every pixel close in
// color to the image corners, so the sprite drops into the game cleanly.
function makeTransparent(img) {
  const c = document.createElement('canvas');
  c.width = img.naturalWidth; c.height = img.naturalHeight;
  const g = c.getContext('2d');
  g.drawImage(img, 0, 0);
  const d = g.getImageData(0, 0, c.width, c.height);
  const px = d.data;
  const corner = [px[0], px[1], px[2]];
  const TOL = 42;
  for (let i = 0; i < px.length; i += 4) {
    const dist = Math.abs(px[i] - corner[0]) + Math.abs(px[i + 1] - corner[1]) + Math.abs(px[i + 2] - corner[2]);
    if (dist < TOL) px[i + 3] = 0;
  }
  g.putImageData(d, 0, 0);
  return c.toDataURL('image/png');
}

document.getElementById('spriteGen').onclick = async () => {
  const btn = document.getElementById('spriteGen');
  const err = document.getElementById('spriteError');
  const out = document.getElementById('spriteResult');
  err.textContent = '';
  btn.disabled = true;
  btn.textContent = 'Generating…';
  try {
    const { imageBase64 } = await jsonPost('/api/generate/sprite', {
      prompt: document.getElementById('spritePrompt').value.trim(),
      style: document.getElementById('spriteStyle').value,
      size: Number(document.getElementById('spriteSize').value)
    });
    const img = new Image();
    img.src = 'data:image/png;base64,' + imageBase64;
    await img.decode();
    const wantTransparent = document.getElementById('spriteTransparent').checked
      && document.getElementById('spriteStyle').value !== 'background'
      && document.getElementById('spriteStyle').value !== 'tile';
    const finalUrl = wantTransparent ? makeTransparent(img) : img.src;

    out.innerHTML = '';
    const shown = new Image();
    shown.src = finalUrl;
    const row = document.createElement('div');
    row.className = 'row';
    const nameInput = document.createElement('input');
    nameInput.placeholder = 'filename (e.g. hero)';
    nameInput.maxLength = 30;
    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Save to assets/';
    const note = document.createElement('p');
    note.className = 'hint';
    saveBtn.onclick = async () => {
      const name = nameInput.value.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '');
      if (!name) { note.textContent = 'Type a filename first.'; return; }
      const saved = await jsonPost(`/api/projects/${projectId}/asset`, {
        filename: name + '.png',
        dataBase64: finalUrl.split(',')[1]
      });
      note.textContent = `Saved as ${saved.path} — load it in your code with: this.load.image('${name}', 'assets/${name}.png')`;
      loadFiles(currentFile);
    };
    row.append(nameInput, saveBtn);
    out.append(shown, row, note);
  } catch (e) {
    err.textContent = e.message;
  } finally {
    btn.disabled = false;
    btn.textContent = 'Generate';
  }
};

// ---------- sounds (Chip SFX) ----------

let lastSamples = null;
let lastPreset = null;

document.querySelectorAll('.sfx').forEach((b) => {
  b.onclick = () => {
    lastPreset = b.dataset.sfx;
    lastSamples = SFX.render(SFX.randomize(lastPreset));
    SFX.play(lastSamples);
    document.getElementById('sfxSaveRow').hidden = false;
    const nameInput = document.getElementById('sfxName');
    if (!nameInput.value || !nameInput.dataset.custom) nameInput.value = lastPreset;
  };
});
document.getElementById('sfxName').oninput = (e) => { e.target.dataset.custom = '1'; };
document.getElementById('sfxReplay').onclick = () => lastSamples && SFX.play(lastSamples);
document.getElementById('sfxSave').onclick = async () => {
  const err = document.getElementById('sfxError');
  const okMsg = document.getElementById('sfxSaved');
  err.textContent = '';
  try {
    const name = document.getElementById('sfxName').value.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '');
    if (!name || !lastSamples) throw new Error('Play a sound and type a filename first.');
    const wav = SFX.toWav(lastSamples);
    let bin = '';
    wav.forEach((byte) => { bin += String.fromCharCode(byte); });
    const saved = await jsonPost(`/api/projects/${projectId}/asset`, { filename: name + '.wav', dataBase64: btoa(bin) });
    okMsg.textContent = `Saved as ${saved.path} — load it with: this.load.audio('${name}', 'assets/${name}.wav')`;
    loadFiles(currentFile);
  } catch (e) {
    err.textContent = e.message;
  }
};

// ---------- coding helper (Ollama) ----------

const chatHistory = [];

function addMsg(role, text) {
  const div = document.createElement('div');
  div.className = 'msg ' + (role === 'user' ? 'user' : 'ai');
  // Render ``` blocks as <pre>; everything else as escaped text.
  const parts = text.split(/```(?:\w*\n)?/);
  parts.forEach((part, i) => {
    const el = document.createElement(i % 2 ? 'pre' : 'span');
    el.textContent = part;
    div.appendChild(el);
  });
  document.getElementById('chatLog').appendChild(div);
  div.scrollIntoView({ block: 'nearest' });
}

document.getElementById('chatSend').onclick = sendChat;
document.getElementById('chatInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChat(); }
});

async function sendChat() {
  const input = document.getElementById('chatInput');
  const busy = document.getElementById('chatBusy');
  const question = input.value.trim();
  if (!question || busy.textContent) return;
  input.value = '';
  addMsg('user', question);
  chatHistory.push({ role: 'user', content: question });
  busy.textContent = 'thinking…';
  try {
    const system = {
      role: 'system',
      content: 'You are a friendly coding tutor helping a student modify a small Phaser 3 web game. ' +
        'Explain simply, show short code snippets they can paste in, and never rewrite the whole file. ' +
        `The student currently has ${currentFile} open:\n\n` + cm.getValue().slice(0, 12000)
    };
    const { reply } = await jsonPost('/api/chat', { messages: [system, ...chatHistory.slice(-10)] });
    chatHistory.push({ role: 'assistant', content: reply });
    addMsg('ai', reply);
  } catch (e) {
    addMsg('ai', '⚠ ' + e.message);
  } finally {
    busy.textContent = '';
  }
}

// ---------- boot ----------

loadFiles().then(runGame);

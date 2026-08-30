"""GameLab music sidecar — MusicGen (Meta's open-source model) behind a tiny HTTP API.

Run this on the machine with the GPU (can be the same box as GameLab):

    pip install flask audiocraft torch torchaudio
    python3 music_server.py

First run downloads the model (~4 GB). Then point GameLab's config.json
"music_url" at http://<this-machine>:8760.

Accepts POST /generate with JSON:
    prompt          - text description of the music
    duration        - seconds (5-30)
    referenceBase64 - optional WAV; its melody/vibe guides the generation
                      (this is what powers the "YouTube link as style" feature)
"""
import base64
import io
import tempfile

from flask import Flask, jsonify, request

import torch
import torchaudio
from audiocraft.models import MusicGen

# musicgen-melody supports audio conditioning; swap for 'facebook/musicgen-small'
# on weak hardware (text-only prompts, the reference is then ignored).
MODEL_NAME = 'facebook/musicgen-melody'

print(f'Loading {MODEL_NAME} (first run downloads the weights)...')
model = MusicGen.get_pretrained(MODEL_NAME)
print('Model ready.')

app = Flask(__name__)


@app.get('/health')
def health():
    return jsonify({'ok': True, 'model': MODEL_NAME})


@app.post('/generate')
def generate():
    data = request.get_json(force=True)
    prompt = (data.get('prompt') or '').strip()
    if not prompt:
        return jsonify({'error': 'prompt is required'}), 400
    duration = min(30, max(5, int(data.get('duration') or 20)))
    model.set_generation_params(duration=duration)

    ref_b64 = data.get('referenceBase64')
    if ref_b64 and hasattr(model, 'generate_with_chroma'):
        wav, sr = torchaudio.load(io.BytesIO(base64.b64decode(ref_b64)))
        wav = wav.mean(dim=0, keepdim=True)  # mono
        out = model.generate_with_chroma([prompt], wav[None], sr)
    else:
        out = model.generate([prompt])

    audio = out[0].cpu()
    with tempfile.NamedTemporaryFile(suffix='.wav') as f:
        torchaudio.save(f.name, audio, model.sample_rate)
        f.seek(0)
        wav_bytes = f.read()
    return jsonify({'audioBase64': base64.b64encode(wav_bytes).decode()})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8760)

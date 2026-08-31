/*
 * Chip SFX — a tiny retro sound-effect synthesizer (no AI model needed).
 * Generates samples directly into a Float32Array, so the exact same data
 * can be previewed with WebAudio and saved as a .wav file.
 */
const SFX = (() => {
  const RATE = 44100;

  // Each preset is a set of synth parameters; randomize() jitters them so
  // students can roll variations until one sounds right.
  const PRESETS = {
    jump:      { wave: 'square',   freq: 320,  slide: 480,   decay: 0.28, noise: 0,    arp: 0,   duty: 0.4 },
    coin:      { wave: 'square',   freq: 940,  slide: 0,     decay: 0.35, noise: 0,    arp: 1.5, duty: 0.5 },
    laser:     { wave: 'sawtooth', freq: 1150, slide: -1600, decay: 0.22, noise: 0.05, arp: 0,   duty: 0.5 },
    explosion: { wave: 'noise',    freq: 130,  slide: -80,   decay: 0.85, noise: 1,    arp: 0,   duty: 0.5 },
    hit:       { wave: 'noise',    freq: 220,  slide: -300,  decay: 0.18, noise: 0.7,  arp: 0,   duty: 0.5 },
    powerup:   { wave: 'square',   freq: 400,  slide: 700,   decay: 0.6,  noise: 0,    arp: 1.33, duty: 0.3 }
  };

  function jitter(v, amount) { return v * (1 + (Math.random() * 2 - 1) * amount); }

  function randomize(name) {
    const p = { ...PRESETS[name] };
    p.freq = jitter(p.freq, 0.25);
    p.slide = jitter(p.slide, 0.35);
    p.decay = Math.min(1.2, jitter(p.decay, 0.3));
    return p;
  }

  function render(p) {
    const length = Math.floor(RATE * (p.decay + 0.05));
    const out = new Float32Array(length);
    let phase = 0;
    let noiseVal = 0;
    for (let i = 0; i < length; i++) {
      const t = i / RATE;
      // Frequency with linear slide, plus a square-wave "arpeggio" hop for coin/powerup blips.
      let f = p.freq + p.slide * t;
      if (p.arp && t > 0.06) f *= p.arp;
      f = Math.max(30, f);
      phase += f / RATE;

      let s;
      if (p.wave === 'noise') {
        // Sample-and-hold noise pitched by frequency: classic explosion crunch.
        if (i % Math.max(1, Math.floor(RATE / (f * 4))) === 0) noiseVal = Math.random() * 2 - 1;
        s = noiseVal;
      } else if (p.wave === 'square') {
        s = (phase % 1) < p.duty ? 1 : -1;
      } else { // sawtooth
        s = (phase % 1) * 2 - 1;
      }
      if (p.noise && p.wave !== 'noise') s += (Math.random() * 2 - 1) * p.noise;

      // Percussive envelope: fast attack, exponential-ish decay to zero.
      const env = Math.max(0, 1 - t / p.decay) ** 1.6;
      out[i] = Math.max(-1, Math.min(1, s)) * env * 0.5;
    }
    return out;
  }

  let ctx = null;
  function play(samples) {
    ctx = ctx || new AudioContext();
    const buf = ctx.createBuffer(1, samples.length, RATE);
    buf.copyToChannel(samples, 0);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.connect(ctx.destination);
    src.start();
  }

  // 16-bit mono PCM WAV encoder.
  function toWav(samples) {
    const dataSize = samples.length * 2;
    const buf = new ArrayBuffer(44 + dataSize);
    const v = new DataView(buf);
    const writeStr = (off, s) => { for (let i = 0; i < s.length; i++) v.setUint8(off + i, s.charCodeAt(i)); };
    writeStr(0, 'RIFF'); v.setUint32(4, 36 + dataSize, true); writeStr(8, 'WAVE');
    writeStr(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
    v.setUint32(24, RATE, true); v.setUint32(28, RATE * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true);
    writeStr(36, 'data'); v.setUint32(40, dataSize, true);
    for (let i = 0; i < samples.length; i++) {
      v.setInt16(44 + i * 2, Math.max(-1, Math.min(1, samples[i])) * 0x7fff, true);
    }
    return new Uint8Array(buf);
  }

  return { PRESETS, randomize, render, play, toWav };
})();

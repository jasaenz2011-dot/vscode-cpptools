'use client';

/**
 * Workshop sound kit — every effect is synthesised with WebAudio, so the studio
 * ships no audio files and stays silent until the student opts in.
 */

type Voice = 'click' | 'ratchet' | 'stamp' | 'swap' | 'undo';

let ctx: AudioContext | null = null;
let noise: AudioBuffer | null = null;

function ensureContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (ctx) {
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  }
  const Ctor = window.AudioContext ?? (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  try {
    ctx = new Ctor();
  } catch {
    return null;
  }
  return ctx;
}

function noiseBuffer(ac: AudioContext): AudioBuffer {
  if (noise) return noise;
  const buffer = ac.createBuffer(1, ac.sampleRate * 0.4, ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
  noise = buffer;
  return buffer;
}

function blip(
  ac: AudioContext,
  at: number,
  freq: number,
  duration: number,
  gain: number,
  type: OscillatorType = 'square',
) {
  const osc = ac.createOscillator();
  const amp = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, at);
  amp.gain.setValueAtTime(0.0001, at);
  amp.gain.exponentialRampToValueAtTime(gain, at + 0.004);
  amp.gain.exponentialRampToValueAtTime(0.0001, at + duration);
  osc.connect(amp).connect(ac.destination);
  osc.start(at);
  osc.stop(at + duration + 0.02);
}

function tick(ac: AudioContext, at: number, gain: number, freq: number, q = 6) {
  const src = ac.createBufferSource();
  src.buffer = noiseBuffer(ac);
  const filter = ac.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(freq, at);
  filter.Q.setValueAtTime(q, at);
  const amp = ac.createGain();
  amp.gain.setValueAtTime(gain, at);
  amp.gain.exponentialRampToValueAtTime(0.0001, at + 0.045);
  src.connect(filter).connect(amp).connect(ac.destination);
  src.start(at);
  src.stop(at + 0.06);
}

const VOICES: Record<Voice, (ac: AudioContext, now: number) => void> = {
  click: (ac, now) => {
    tick(ac, now, 0.09, 2400, 9);
    blip(ac, now, 660, 0.05, 0.05);
  },
  swap: (ac, now) => {
    tick(ac, now, 0.08, 1800, 7);
    blip(ac, now, 520, 0.05, 0.045);
    blip(ac, now + 0.045, 780, 0.06, 0.038);
  },
  ratchet: (ac, now) => {
    tick(ac, now, 0.07, 3200, 12);
    tick(ac, now + 0.028, 0.05, 2600, 12);
  },
  stamp: (ac, now) => {
    const osc = ac.createOscillator();
    const amp = ac.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(48, now + 0.22);
    amp.gain.setValueAtTime(0.28, now);
    amp.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
    osc.connect(amp).connect(ac.destination);
    osc.start(now);
    osc.stop(now + 0.32);
    tick(ac, now, 0.16, 1200, 3);
    tick(ac, now + 0.012, 0.1, 600, 2);
  },
  undo: (ac, now) => {
    blip(ac, now, 720, 0.07, 0.05, 'triangle');
    blip(ac, now + 0.055, 480, 0.09, 0.045, 'triangle');
  },
};

let enabled = false;

/** Mirrors the store's sound toggle; kept here so playback stays synchronous. */
export function setSoundEnabled(on: boolean): void {
  enabled = on;
  if (on) ensureContext();
}

export function play(voice: Voice): void {
  if (!enabled) return;
  const ac = ensureContext();
  if (!ac) return;
  try {
    VOICES[voice](ac, ac.currentTime);
  } catch {
    /* Audio is a nicety; never let it break an interaction. */
  }
}

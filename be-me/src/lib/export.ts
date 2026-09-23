'use client';

/**
 * Export station.
 *
 * The badge is drawn with the Canvas 2D API rather than rasterised from HTML so
 * the text stays crisp at 3× and uses the studio's real webfonts, while the
 * avatar itself is rasterised from the live SVG scene graph — one source of
 * truth for what the student sees and what they download.
 */
import type { AvatarConfig } from './types';
import { GRADE_LABELS } from './rig';
import { getTrait } from './catalog';
import { readableInk, shade, tint } from './color';

/** Logical badge size; the PNG is rendered at `SCALE`×. */
export const CARD_W = 320;
export const CARD_H = 620;
export const CARD_SCALE = 3;

const WINDOW = { x: 20, y: 64, w: 280, h: 360 };

const PITCH = '#0b1120';
const STEEL = '#1e293b';
const STEEL_UP = '#334155';
const HAZARD = '#f59e0b';
const CHALK = '#f8fafc';
const CONCRETE = '#94a3b8';

function fontStack(variable: string, fallback: string): string {
  if (typeof window === 'undefined') return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
  return value.length > 0 ? `${value}, ${fallback}` : fallback;
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

/** Diagonal hazard stripes, clipped to the current path's rectangle. */
function hazardStripes(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  a = HAZARD,
  b = PITCH,
  band = 11,
) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  ctx.fillStyle = b;
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = a;
  const span = w + h;
  for (let i = -h; i < span; i += band * 2) {
    ctx.beginPath();
    ctx.moveTo(x + i, y);
    ctx.lineTo(x + i + band, y);
    ctx.lineTo(x + i + band - h, y + h);
    ctx.lineTo(x + i - h, y + h);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

function tracked(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  spacing: number,
  align: 'center' | 'left' = 'center',
) {
  const chars = [...text];
  const widths = chars.map((c) => ctx.measureText(c).width);
  const total = widths.reduce((sum, w) => sum + w + spacing, -spacing);
  let cursor = align === 'center' ? x - total / 2 : x;
  chars.forEach((char, i) => {
    ctx.fillText(char, cursor, y);
    cursor += (widths[i] ?? 0) + spacing;
  });
}

/** Shrink `size` until `text` fits `maxWidth`. */
function fitFont(
  ctx: CanvasRenderingContext2D,
  text: string,
  family: string,
  weight: string,
  size: number,
  maxWidth: number,
  min = 14,
): number {
  let current = size;
  for (;;) {
    ctx.font = `${weight} ${current}px ${family}`;
    if (ctx.measureText(text).width <= maxWidth || current <= min) return current;
    current -= 1;
  }
}

function rivet(ctx: CanvasRenderingContext2D, x: number, y: number, r = 3.4) {
  const grad = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, 0, x, y, r);
  grad.addColorStop(0, '#e2e8f0');
  grad.addColorStop(0.6, '#64748b');
  grad.addColorStop(1, '#0f172a');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

/**
 * Rasterise an SVG element. The clone gets explicit size and a slice fit so the
 * figure fills the badge window without letterboxing.
 */
export function svgToImage(
  source: SVGSVGElement,
  width: number,
  height: number,
  preserveAspectRatio = 'xMidYMid meet',
): Promise<HTMLImageElement> {
  const clone = source.cloneNode(true) as SVGSVGElement;
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  clone.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
  clone.setAttribute('width', String(width));
  clone.setAttribute('height', String(height));
  clone.setAttribute('preserveAspectRatio', preserveAspectRatio);
  clone.removeAttribute('class');
  // Screen-only chrome (the blueprint measurement overlay) never exports.
  clone.querySelectorAll('[data-export="hide"]').forEach((node) => node.remove());

  const markup = new XMLSerializer().serializeToString(clone);
  const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup)}`;

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = 'sync';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Could not rasterise the avatar.'));
    img.src = url;
  });
}

export interface BadgeOptions {
  config: AvatarConfig;
  svg: SVGSVGElement;
  scale?: number;
}

/** Render the full Be ME! badge to an offscreen canvas. */
export async function renderBadge({ config, svg, scale = CARD_SCALE }: BadgeOptions): Promise<HTMLCanvasElement> {
  const display = fontStack('--font-be-display', "'Arial Black', sans-serif");
  const mono = fontStack('--font-be-mono', 'monospace');
  const ui = fontStack('--font-be-ui', 'system-ui, sans-serif');

  if (typeof document !== 'undefined' && 'fonts' in document) {
    try {
      await document.fonts.ready;
    } catch {
      /* Fall back to whatever is already loaded. */
    }
  }

  const avatar = await svgToImage(svg, WINDOW.w * scale, WINDOW.h * scale, 'xMidYMax slice');

  const canvas = document.createElement('canvas');
  canvas.width = CARD_W * scale;
  canvas.height = CARD_H * scale;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas is unavailable in this browser.');
  ctx.scale(scale, scale);
  ctx.textBaseline = 'alphabetic';

  const trait = getTrait(config.identity.traitId);
  const name = config.identity.name.trim() || 'Your Name';
  const school = config.identity.school.trim() || 'Maker Lab';
  const gradeLabel = GRADE_LABELS[config.grade] ?? 'Kindergarten';

  /* ------------------------------- card body ------------------------------ */
  const body = ctx.createLinearGradient(0, 0, CARD_W * 0.6, CARD_H);
  body.addColorStop(0, STEEL_UP);
  body.addColorStop(0.45, STEEL);
  body.addColorStop(1, PITCH);
  roundRect(ctx, 0, 0, CARD_W, CARD_H, 20);
  ctx.fillStyle = body;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#475569';
  ctx.stroke();

  /* --------------------------------- header ------------------------------- */
  ctx.save();
  roundRect(ctx, 10, 10, CARD_W - 20, 40, 8);
  ctx.clip();
  hazardStripes(ctx, 10, 10, CARD_W - 20, 40);
  ctx.restore();

  roundRect(ctx, 16, 15, 168, 30, 6);
  ctx.fillStyle = PITCH;
  ctx.fill();
  ctx.font = `800 21px ${display}`;
  ctx.fillStyle = HAZARD;
  ctx.textAlign = 'left';
  tracked(ctx, 'BE ME!', 27, 37, 1.4, 'left');

  roundRect(ctx, 190, 15, CARD_W - 206, 30, 6);
  ctx.fillStyle = PITCH;
  ctx.fill();
  ctx.font = `600 9px ${mono}`;
  ctx.fillStyle = CONCRETE;
  tracked(ctx, 'STUDENT', 200, 28, 1.1, 'left');
  ctx.fillStyle = CHALK;
  tracked(ctx, 'BUILD ID', 200, 40, 1.1, 'left');

  /* ------------------------------ avatar window --------------------------- */
  ctx.save();
  roundRect(ctx, WINDOW.x, WINDOW.y, WINDOW.w, WINDOW.h, 12);
  ctx.fillStyle = '#0d1b34';
  ctx.fill();
  ctx.clip();
  ctx.drawImage(avatar, WINDOW.x, WINDOW.y, WINDOW.w, WINDOW.h);

  // Corner registration marks, so the window reads as a blueprint plate.
  ctx.strokeStyle = 'rgba(125, 211, 252, 0.55)';
  ctx.lineWidth = 1.4;
  const marks: Array<[number, number, number, number]> = [
    [WINDOW.x + 10, WINDOW.y + 10, 1, 1],
    [WINDOW.x + WINDOW.w - 10, WINDOW.y + 10, -1, 1],
    [WINDOW.x + 10, WINDOW.y + WINDOW.h - 10, 1, -1],
    [WINDOW.x + WINDOW.w - 10, WINDOW.y + WINDOW.h - 10, -1, -1],
  ];
  for (const [mx, my, dx, dy] of marks) {
    ctx.beginPath();
    ctx.moveTo(mx + dx * 16, my);
    ctx.lineTo(mx, my);
    ctx.lineTo(mx, my + dy * 16);
    ctx.stroke();
  }
  ctx.restore();

  ctx.lineWidth = 2;
  ctx.strokeStyle = '#475569';
  roundRect(ctx, WINDOW.x, WINDOW.y, WINDOW.w, WINDOW.h, 12);
  ctx.stroke();

  /* --------------------------------- details ------------------------------ */
  ctx.textAlign = 'center';
  const cx = CARD_W / 2;

  ctx.font = `600 9px ${mono}`;
  ctx.fillStyle = CONCRETE;
  tracked(ctx, 'BUILDER NAME', cx, WINDOW.y + WINDOW.h + 26, 2.2);

  const nameSize = fitFont(ctx, name, display, '800', 32, CARD_W - 56, 15);
  ctx.font = `800 ${nameSize}px ${display}`;
  ctx.fillStyle = CHALK;
  ctx.fillText(name, cx, WINDOW.y + WINDOW.h + 58);

  ctx.font = `600 11px ${mono}`;
  ctx.fillStyle = HAZARD;
  tracked(ctx, gradeLabel.toUpperCase(), cx, WINDOW.y + WINDOW.h + 78, 2.4);

  // Trait pill
  const pillY = WINDOW.y + WINDOW.h + 90;
  ctx.font = `800 14px ${ui}`;
  const pillW = Math.min(CARD_W - 40, ctx.measureText(trait.label).width + 40);
  roundRect(ctx, cx - pillW / 2, pillY, pillW, 32, 16);
  ctx.fillStyle = trait.color;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = shade(trait.color, 0.45);
  ctx.stroke();
  ctx.fillStyle = readableInk(trait.color);
  ctx.fillText(trait.label, cx, pillY + 21);

  /* --------------------------------- footer ------------------------------- */
  const footY = CARD_H - 62;
  roundRect(ctx, 14, footY, CARD_W - 28, 46, 10);
  ctx.fillStyle = PITCH;
  ctx.fill();
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  hazardStripes(ctx, 14, footY, 8, 46, HAZARD, PITCH, 5);

  ctx.textAlign = 'left';
  ctx.font = `600 8px ${mono}`;
  ctx.fillStyle = CONCRETE;
  tracked(ctx, 'ISSUED BY', 32, footY + 17, 1.6, 'left');

  const schoolSize = fitFont(ctx, school.toUpperCase(), display, '800', 15, CARD_W - 150, 9);
  ctx.font = `800 ${schoolSize}px ${display}`;
  ctx.fillStyle = CHALK;
  ctx.fillText(school.toUpperCase(), 32, footY + 34);

  // Stamp
  ctx.save();
  ctx.translate(CARD_W - 54, footY + 23);
  ctx.rotate((-9 * Math.PI) / 180);
  ctx.strokeStyle = tint(HAZARD, 0.1);
  ctx.lineWidth = 2;
  roundRect(ctx, -34, -15, 68, 30, 5);
  ctx.stroke();
  ctx.textAlign = 'center';
  ctx.font = `800 10px ${display}`;
  ctx.fillStyle = tint(HAZARD, 0.1);
  tracked(ctx, 'APPROVED', 0, -1, 0.8);
  ctx.font = `600 7px ${mono}`;
  tracked(ctx, 'MAKER PROGRAM', 0, 10, 0.4);
  ctx.restore();

  for (const [rx, ry] of [
    [12, 12],
    [CARD_W - 12, 12],
    [12, CARD_H - 12],
    [CARD_W - 12, CARD_H - 12],
  ] as Array<[number, number]>) {
    rivet(ctx, rx, ry);
  }

  return canvas;
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  // Give the browser a tick to start the download before revoking.
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Could not encode the PNG.'));
    }, 'image/png');
  });
}

export function safeFilename(config: AvatarConfig, suffix: string): string {
  const base = (config.identity.name.trim() || 'be-me')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 28);
  return `${base || 'be-me'}-${suffix}`;
}

export async function downloadBadgePng(options: BadgeOptions): Promise<void> {
  const canvas = await renderBadge(options);
  const blob = await canvasToBlob(canvas);
  downloadBlob(blob, `${safeFilename(options.config, 'badge')}.png`);
}

/** The avatar on its own, at 3× the stage size. */
export async function downloadAvatarPng(config: AvatarConfig, svg: SVGSVGElement): Promise<void> {
  const width = 1080;
  const height = 1440;
  const img = await svgToImage(svg, width, height, 'xMidYMid meet');
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas is unavailable in this browser.');
  ctx.drawImage(img, 0, 0, width, height);
  const blob = await canvasToBlob(canvas);
  downloadBlob(blob, `${safeFilename(config, 'avatar')}.png`);
}

export function downloadConfigJson(config: AvatarConfig): void {
  const payload = {
    app: 'be-me-avatar-studio',
    version: 1,
    exportedAt: new Date().toISOString(),
    config,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  downloadBlob(blob, `${safeFilename(config, 'config')}.json`);
}

/** Pull an `AvatarConfig` out of a file the student picked. */
export async function readConfigFile(file: File): Promise<unknown> {
  const text = await file.text();
  const parsed: unknown = JSON.parse(text);
  if (parsed && typeof parsed === 'object' && 'config' in parsed) {
    return (parsed as { config: unknown }).config;
  }
  return parsed;
}

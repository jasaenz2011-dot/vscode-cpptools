/**
 * Tiny colour helpers. Every asset derives its shadows and highlights from the
 * single hex the student picked, so one swatch restyles a whole garment
 * without anyone hand-authoring a five-stop palette.
 */

export interface Rgb {
  r: number;
  g: number;
  b: number;
}

const clamp255 = (n: number) => Math.max(0, Math.min(255, Math.round(n)));

export function hexToRgb(hex: string): Rgb {
  let h = hex.replace('#', '').trim();
  if (h.length === 3) {
    h = `${h[0]}${h[0]}${h[1]}${h[1]}${h[2]}${h[2]}`;
  }
  const int = Number.parseInt(h.slice(0, 6), 16);
  if (!Number.isFinite(int)) return { r: 0, g: 0, b: 0 };
  return { r: (int >> 16) & 255, g: (int >> 8) & 255, b: int & 255 };
}

export function rgbToHex({ r, g, b }: Rgb): string {
  const v = (clamp255(r) << 16) | (clamp255(g) << 8) | clamp255(b);
  return `#${v.toString(16).padStart(6, '0')}`;
}

/** Blend two hexes. `amount` 0 → `a`, 1 → `b`. */
export function mix(a: string, b: string, amount: number): string {
  const ca = hexToRgb(a);
  const cb = hexToRgb(b);
  return rgbToHex({
    r: ca.r + (cb.r - ca.r) * amount,
    g: ca.g + (cb.g - ca.g) * amount,
    b: ca.b + (cb.b - ca.b) * amount,
  });
}

/** Darken toward a deep neutral rather than pure black -- keeps hues alive. */
export function shade(hex: string, amount: number): string {
  return mix(hex, '#10141f', amount);
}

/** Lighten toward a warm white. */
export function tint(hex: string, amount: number): string {
  return mix(hex, '#fffdf7', amount);
}

/** Perceptual-ish luminance, 0 (black) → 1 (white). */
export function luminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  const srgb = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
}

/**
 * Pick ink that stays readable on top of `hex`.
 *
 * The 0.21 crossover is where WCAG contrast against near-black and against
 * white are equal — eyeballing a higher threshold puts white text on mid
 * oranges like #fb923c, which fails badly.
 */
export function readableInk(hex: string): string {
  return luminance(hex) > 0.21 ? '#0f172a' : '#f8fafc';
}

/** Guard against malformed values coming back from a JSON import. */
export function isHex(value: unknown): value is string {
  return typeof value === 'string' && /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(value.trim());
}

export function normalizeHex(value: string, fallback: string): string {
  return isHex(value) ? (value.length === 4 ? mix(value, value, 0) : value.toLowerCase()) : fallback;
}

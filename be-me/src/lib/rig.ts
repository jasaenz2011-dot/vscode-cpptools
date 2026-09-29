/**
 * The Grade Growth Engine.
 *
 * Turns a (possibly fractional) grade into a full skeletal rig of anchors. The
 * one hard rule that keeps the compositor drift-free: **every anchor is a
 * uniform scale + rotation + translation**, and every asset space has a fixed
 * aspect ratio. That means a single CSS `transform` fully describes an anchor,
 * so growing from Kindergarten to 8th grade is a pure compositor animation --
 * no per-frame React renders, no path morphing, no layer drift.
 */

import type { GradeStep } from './types';

/** Stage viewBox. Every anchor below lives in this coordinate space. */
export const STAGE_W = 360;
export const STAGE_H = 480;

/** Where the student's shoes meet the workshop floor. */
export const GROUND_Y = 446;
export const CENTER_X = STAGE_W / 2;

/** Canonical authoring boxes. Assets are drawn inside these, then anchored. */
export const HEAD_BOX = 100;
export const TORSO_BOX_W = 100;
export const TORSO_BOX_H = 125;
export const HIPS_BOX = 100;
export const FEET_BOX_W = 100;
export const FEET_BOX_H = 40;
export const HAND_BOX = 40;
export const CHEST_BOX = 100;

/** Limb capsules are authored 100 long; width is fixed so scaling stays uniform. */
export const ARM_BOX_LEN = 100;
export const ARM_BOX_W = 18;
export const LEG_BOX_LEN = 100;
export const LEG_BOX_W = 21;

/**
 * Neck length as a fraction of head height. Held constant so the neck can be
 * authored once in head space (from the chin down past the collar line).
 */
export const NECK_RATIO = 0.15;
/** Neck geometry inside head space. */
export const NECK = { top: 36, bottom: 49 + NECK_RATIO * 100 + 10, halfW: 13.5 } as const;

export const GRADE_LABELS = [
  'Kindergarten',
  '1st Grade',
  '2nd Grade',
  '3rd Grade',
  '4th Grade',
  '5th Grade',
  '6th Grade',
  '7th Grade',
  '8th Grade',
] as const;

export const GRADE_SHORT = ['K', '1', '2', '3', '4', '5', '6', '7', '8'] as const;

/** Typical age at each grade, printed alongside the grade on badges. */
export const GRADE_AGES = [5, 6, 7, 8, 9, 10, 11, 12, 13] as const;

/** Per-grade accent, used by the journey strip and the grade rail. */
export const GRADE_COLORS = [
  '#7c3aed',
  '#16a34a',
  '#ea580c',
  '#2563eb',
  '#a855f7',
  '#15803d',
  '#dc2626',
  '#3b82f6',
  '#1e3a8a',
] as const;

export function gradeLabel(grade: GradeStep): string {
  return GRADE_LABELS[grade];
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Gentle S-curve so the middle grades don't all look identical. */
const smooth = (t: number) => t * t * (3 - 2 * t);

const DEG = Math.PI / 180;

export interface Anchor {
  x: number;
  y: number;
  /** Uniform scale applied to the anchor's canonical authoring box. */
  scale: number;
  /** Degrees, clockwise (SVG convention). */
  rotate: number;
}

export interface Limb {
  /** Joint position in stage space. */
  x: number;
  y: number;
  scale: number;
  rotate: number;
  /** Endpoint of the limb in stage space, for placing hands/feet. */
  endX: number;
  endY: number;
}

export interface Rig {
  /** Fractional grade actually used for the maths. */
  grade: number;
  /** Eased 0 → 1 growth factor. */
  t: number;
  height: number;
  centerX: number;
  groundY: number;
  head: Anchor;
  /** Neck notch: torso assets (shirts, jackets) hang from here. */
  torso: Anchor;
  chest: Anchor;
  hips: Anchor;
  armLeft: Limb;
  armRight: Limb;
  legLeft: Limb;
  legRight: Limb;
  footLeft: Anchor;
  footRight: Anchor;
  hand: Anchor;
  shadow: { cx: number; cy: number; rx: number; ry: number };
}

/**
 * Build the rig. `grade` may be fractional -- the slider snaps to integers, but
 * the export renderer and previews are free to sample in between.
 */
export function buildRig(grade: number): Rig {
  const g = Math.min(8, Math.max(0, grade));
  const t = smooth(g / 8);

  const height = lerp(258, 392, t);
  // Head-to-body ratio: little kids are famously top-heavy.
  const ratio = lerp(4.7, 6.7, t);
  const headH = height / ratio;
  const headScale = headH / HEAD_BOX;

  const headTopY = GROUND_Y - height;
  const headCy = headTopY + headH / 2;
  const chinY = headTopY + headH;

  // Constant neck ratio: the neck is authored in head space, so tying its
  // length to the head keeps the collar and the chin locked together at every
  // grade instead of drifting apart.
  const neckH = headH * NECK_RATIO;
  const shoulderY = chinY + neckH;

  const legFrac = lerp(0.44, 0.505, t);
  const legLen = height * legFrac;
  const hipY = GROUND_Y - legLen;

  const torsoH = hipY - shoulderY;
  const torsoScale = torsoH / TORSO_BOX_H;
  const torsoW = TORSO_BOX_W * torsoScale;
  const hipW = torsoW * lerp(0.9, 0.82, t);

  // Posture: a small forward-to-upright shift as the student grows.
  const posture = lerp(-1.6, 0.9, t);
  const headTilt = lerp(-4.2, -0.6, t);

  const armLen = height * lerp(0.345, 0.395, t);
  const armScale = armLen / ARM_BOX_LEN;
  const armAngle = lerp(14, 9.5, t);
  // The joint sits *inside* the torso silhouette, not on its edge — an arm
  // hung off the outline reads as detached no matter how good the sleeve is.
  const shoulderHalf = torsoW * 0.4;
  const shoulderDrop = torsoH * 0.16;

  const legScale = (legLen * 1.02) / LEG_BOX_LEN;
  const legAngle = lerp(6.4, 3.4, t);
  const hipHalf = hipW * 0.27;

  const limb = (x: number, y: number, scale: number, deg: number, len: number): Limb => ({
    x,
    y,
    scale,
    rotate: deg,
    endX: x - Math.sin(deg * DEG) * len,
    endY: y + Math.cos(deg * DEG) * len,
  });

  const armLeft = limb(
    CENTER_X - shoulderHalf,
    shoulderY + shoulderDrop,
    armScale,
    armAngle,
    armLen,
  );
  const armRight = limb(
    CENTER_X + shoulderHalf,
    shoulderY + shoulderDrop,
    armScale,
    -armAngle,
    armLen,
  );
  const legLeft = limb(CENTER_X - hipHalf, hipY, legScale, legAngle, legLen);
  const legRight = limb(CENTER_X + hipHalf, hipY, legScale, -legAngle, legLen);

  const footScale = (LEG_BOX_W * legScale * 2.32) / FEET_BOX_W;
  const handScale = (ARM_BOX_W * armScale * 1.65) / HAND_BOX;

  return {
    grade: g,
    t,
    height,
    centerX: CENTER_X,
    groundY: GROUND_Y,
    head: { x: CENTER_X, y: headCy, scale: headScale, rotate: headTilt },
    torso: { x: CENTER_X, y: shoulderY, scale: torsoScale, rotate: posture },
    chest: {
      x: CENTER_X,
      y: shoulderY + torsoH * 0.3,
      scale: (torsoW * 0.62) / CHEST_BOX,
      rotate: posture,
    },
    hips: { x: CENTER_X, y: hipY, scale: hipW / HIPS_BOX, rotate: 0 },
    armLeft,
    armRight,
    legLeft,
    legRight,
    footLeft: { x: legLeft.endX, y: GROUND_Y, scale: footScale, rotate: 0 },
    footRight: { x: legRight.endX, y: GROUND_Y, scale: footScale, rotate: 0 },
    hand: { x: armRight.endX, y: armRight.endY, scale: handScale, rotate: -armAngle },
    shadow: {
      cx: CENTER_X,
      cy: GROUND_Y + 6,
      rx: torsoW * 0.98,
      ry: torsoW * 0.16,
    },
  };
}

/**
 * Serialise an anchor to a CSS transform. Always emits the same three
 * functions in the same order so the browser can interpolate component-wise
 * when the grade changes -- that is what makes growth animate on the
 * compositor instead of re-rendering React.
 */
export function anchorTransform(a: Anchor | Limb): string {
  return `translate(${a.x.toFixed(2)}px, ${a.y.toFixed(2)}px) rotate(${a.rotate.toFixed(
    2,
  )}deg) scale(${a.scale.toFixed(4)})`;
}

/**
 * Style bundle for a rigged `<g>`. `transformBox`/`transformOrigin` are pinned
 * so the CSS transform matches SVG user-space semantics in every browser.
 */
export function rigStyle(a: Anchor | Limb): React.CSSProperties {
  return {
    transformBox: 'view-box',
    transformOrigin: '0px 0px',
    transform: anchorTransform(a),
  };
}

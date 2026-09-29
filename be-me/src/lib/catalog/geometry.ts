/**
 * Shared silhouette geometry.
 *
 * Hair, hats and expressions are all authored against these numbers, so every
 * asset in the catalog lines up with the skull no matter who drew it.
 */

/** Head space: 100×100 box, origin at the centre of the skull. */
export const HEAD = {
  top: -50,
  chin: 49,
  side: 42,
  earY: 3,
  earR: 7.5,
  /** Eye line, brow line and mouth line used by every expression. */
  eyeY: 3,
  eyeX: 16,
  browY: -12,
  mouthY: 25,
  noseY: 14,
} as const;

/** The skull. Slightly wide cranium tapering into a soft chin. */
export const SKULL_PATH =
  'M 0,-50 C 23,-50 40.5,-33.5 41.8,-11 C 43,9 34.5,29.5 18.5,41.5 C 12.5,46 6.2,48.8 0,48.8 C -6.2,48.8 -12.5,46 -18.5,41.5 C -34.5,29.5 -43,9 -41.8,-11 C -40.5,-33.5 -23,-50 0,-50 Z';

/** Cranium-only outline, used as the base for close-fitting hair and caps. */
export const CAP_PATH =
  'M -41.9,-6 C -42.6,-32 -24,-51.5 0,-51.5 C 24,-51.5 42.6,-32 41.9,-6 C 34,-16 20,-22 0,-22 C -20,-22 -34,-16 -41.9,-6 Z';

/** Torso space: 100 wide × 125 tall, origin at the neck notch. */
export const TORSO_PATH =
  'M -19,0 C -33,2.5 -43.5,11 -45.8,27 L -39.5,70 C -38.5,90 -40.5,107 -41.5,124.5 L 41.5,124.5 C 40.5,107 38.5,90 39.5,70 L 45.8,27 C 43.5,11 33,2.5 19,0 Z';

/** Shirt shell: the torso, grown slightly so garments read as worn over skin. */
export const SHIRT_PATH =
  'M -20,-1 C -35,1.5 -46,10.5 -48.4,27.5 L -41.5,71 C -40.5,91 -42.5,107 -43.5,125.5 L 43.5,125.5 C 42.5,107 40.5,91 41.5,71 L 48.4,27.5 C 46,10.5 35,1.5 20,-1 Z';

/** Where a collar sits inside torso space. */
export const COLLAR = { y: 2, rx: 19, ry: 7 } as const;

/** Limb capsules are authored as strokes down the +y axis. */
export const ARM_LEN = 100;
export const LEG_LEN = 100;

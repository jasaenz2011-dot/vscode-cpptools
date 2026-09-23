/**
 * MASTER CANVAS CONFIGURATION
 * ===========================
 *
 * The single contract between the artwork and the application.
 *
 * PRINCIPLE: ART CONTROLS THE CODE.
 *
 * Every interchangeable production PNG for a given art style is authored on
 * this exact canvas, at these exact dimensions, with the character positioned
 * exactly where the artist placed them. The engine renders every layer into the
 * same box at the same origin and does nothing else.
 *
 * The engine therefore NEVER:
 *   - resizes a layer to its visible bounding box
 *   - crops transparent padding
 *   - "smart fits" hair, clothing or eyes
 *   - independently centres a layer
 *
 * If an asset is delivered at the wrong dimensions the engine reports it as a
 * calibration error instead of silently correcting it — a silent correction
 * would mean the code had overridden the art.
 */

export interface MasterCanvasConfig {
  width: number;
  height: number;
}

/**
 * Set from the DELIVERED master artwork, not from a guess.
 *
 * The supplied Cinematic 3D Boy and Girl masters are both 1024 x 1536
 * transparent PNGs, identically framed. The brief's placeholder figure was
 * 2048 x 2048; the art is the authority, so the config follows the art.
 *
 * If the masters are re-delivered at a different size, change these two numbers
 * and nothing else — every layer, thumbnail and export derives from them.
 */
export const MASTER_CANVAS: MasterCanvasConfig = {
  width: 1024,
  height: 1536,
};

export const MASTER_ASPECT = MASTER_CANVAS.width / MASTER_CANVAS.height;

/**
 * A point in master-canvas pixel coordinates. Origin is the top-left of the
 * master canvas, +x right, +y down — the same coordinate space Photoshop
 * reports, so a value read off the master PSD can be typed in directly.
 */
export interface AnchorPoint {
  x: number;
  y: number;
}

/**
 * Optional metadata describing where things sit on the master artwork.
 *
 * DELIBERATELY UNCALIBRATED. These are `null` until measured from the delivered
 * master PSD/PNG. Nothing in the v0.1 render path reads them — layers are
 * composited by exact canvas alignment alone, which needs no anchors at all.
 *
 * They exist now so that later features (procedural eye swaps, per-style
 * retargeting, accessory attachment, animation rigs) have a defined home and a
 * defined shape, rather than being bolted on with invented numbers.
 *
 * DO NOT populate these with guesses. Measure them from the master artwork.
 */
export interface AvatarAnchors {
  centerX: number | null;
  groundY: number | null;
  eyeLeftAnchor: AnchorPoint | null;
  eyeRightAnchor: AnchorPoint | null;
  hairAnchor: AnchorPoint | null;
  topAnchor: AnchorPoint | null;
  bottomAnchor: AnchorPoint | null;
  shoeAnchor: AnchorPoint | null;
}

export const UNCALIBRATED_ANCHORS: AvatarAnchors = {
  centerX: null,
  groundY: null,
  eyeLeftAnchor: null,
  eyeRightAnchor: null,
  hairAnchor: null,
  topAnchor: null,
  bottomAnchor: null,
  shoeAnchor: null,
};

/** True once every anchor has been measured from the master artwork. */
export function isCalibrated(anchors: AvatarAnchors): boolean {
  return Object.values(anchors).every((value) => value !== null);
}

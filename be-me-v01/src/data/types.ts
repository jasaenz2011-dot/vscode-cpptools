import type { LayerSlot } from '../config/layers';

/** Art styles. Only `cinematic3d` is operational in v0.1. */
export type ArtStyleId = 'cinematic3d' | 'watercolor' | 'comic' | 'anime' | 'realistic';

export type BodyBase = 'boy' | 'girl';

/** Character views. Only `front` is operational in v0.1. */
export type ViewId = 'front' | 'left' | 'back' | 'right' | 'turntable';

export interface ArtStyle {
  id: ArtStyleId;
  /** Two-digit index shown in the left rail, e.g. "01". */
  index: string;
  name: string;
  /** Short line under the name in the rail. */
  descriptor: string;
  /**
   * `false` means the style exists in the data model but has no artwork yet.
   * The rail shows COMING SOON and the style cannot be selected.
   */
  enabled: boolean;
}

export interface ViewDefinition {
  id: ViewId;
  label: string;
  short: string;
  enabled: boolean;
  /** Why it is unavailable, shown in the stage when selected. */
  requirement: string;
}

/**
 * One interchangeable asset.
 *
 * `file` is a path relative to the site root, e.g.
 *   /assets/cinematic3d/boy/hair/hair_001.png
 *
 * Every file referenced here must be authored on the master canvas
 * (see src/config/canvas.ts). The engine composites by exact alignment.
 */
export interface AssetEntry {
  id: string;
  name: string;
  style: ArtStyleId;
  bodyBase: BodyBase;
  category: LayerSlot;
  /** Per-view files. `front` is required; other views are added as they exist. */
  files: Partial<Record<ViewId, string>>;
  enabled: boolean;
  /**
   * Optional swatch colour, used only to tint the thumbnail chip while the
   * asset PNG itself is missing. It is never composited onto the avatar.
   */
  swatch?: string;
  notes?: string;
}

export interface AssetManifest {
  /** Manifest schema version, so future migrations are detectable. */
  version: number;
  masterCanvas: { width: number; height: number };
  assets: AssetEntry[];
}

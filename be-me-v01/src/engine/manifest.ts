import { MASTER_CANVAS } from '../config/canvas';
import type { LayerSlot } from '../config/layers';
import type { ArtStyleId, AssetEntry, AssetManifest, BodyBase, ViewId } from '../data/types';

/**
 * Loads and indexes the asset manifest.
 *
 * The manifest lives beside the artwork in `public/assets/manifest.json` so a
 * new asset is a PNG plus a JSON entry, with no rebuild and no UI change.
 */

export interface ManifestIndex {
  raw: AssetManifest;
  /** Every enabled asset for a style + body base + slot, in manifest order. */
  list(style: ArtStyleId, base: BodyBase, slot: LayerSlot): AssetEntry[];
  byId(id: string, style: ArtStyleId, base: BodyBase, slot: LayerSlot): AssetEntry | null;
  /** The `base` slot entry — the master avatar for this style + body base. */
  master(style: ArtStyleId, base: BodyBase): AssetEntry | null;
  /** True if the manifest declares its canvas differently from the app config. */
  canvasMismatch: { manifest: string; app: string } | null;
}

const key = (style: string, base: string, slot: string) => `${style}/${base}/${slot}`;

export function indexManifest(raw: AssetManifest): ManifestIndex {
  const buckets = new Map<string, AssetEntry[]>();

  for (const asset of raw.assets) {
    if (!asset.enabled) continue;
    const k = key(asset.style, asset.bodyBase, asset.category);
    const bucket = buckets.get(k);
    if (bucket) bucket.push(asset);
    else buckets.set(k, [asset]);
  }

  const declared = `${raw.masterCanvas?.width} x ${raw.masterCanvas?.height}`;
  const configured = `${MASTER_CANVAS.width} x ${MASTER_CANVAS.height}`;

  return {
    raw,
    list: (style, base, slot) => buckets.get(key(style, base, slot)) ?? [],
    byId: (id, style, base, slot) =>
      buckets.get(key(style, base, slot))?.find((a) => a.id === id) ?? null,
    master: (style, base) => buckets.get(key(style, base, 'base'))?.[0] ?? null,
    canvasMismatch:
      declared === configured ? null : { manifest: declared, app: configured },
  };
}

export async function loadManifest(signal?: AbortSignal): Promise<ManifestIndex> {
  const response = await fetch('/assets/manifest.json', { signal });
  if (!response.ok) {
    throw new Error(`Could not load the asset manifest (HTTP ${response.status}).`);
  }
  const raw = (await response.json()) as AssetManifest;
  if (!raw || !Array.isArray(raw.assets)) {
    throw new Error('The asset manifest is malformed: expected an `assets` array.');
  }
  return indexManifest(raw);
}

/** Resolve the file for an asset in a given view, or null if it has none. */
export function fileForView(asset: AssetEntry, view: ViewId): string | null {
  return asset.files[view] ?? null;
}

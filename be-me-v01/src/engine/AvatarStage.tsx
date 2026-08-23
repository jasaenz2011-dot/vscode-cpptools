import { useCallback, useEffect, useMemo, useState } from 'react';
import { MASTER_CANVAS } from '../config/canvas';
import { LAYER_SLOTS, type LayerSlot } from '../config/layers';
import type { ArtStyleId, BodyBase, ViewId } from '../data/types';
import { fileForView, type ManifestIndex } from './manifest';
import { LayerImage, type LayerReport } from './LayerImage';

export interface AvatarStageProps {
  manifest: ManifestIndex;
  style: ArtStyleId;
  bodyBase: BodyBase;
  view: ViewId;
  /** Selected asset id per slot. `null` means the slot is empty. */
  selection: Partial<Record<LayerSlot, string | null>>;
  onReports?: (reports: LayerReport[]) => void;
}

interface ResolvedLayer {
  slot: LayerSlot;
  assetId: string;
  name: string;
  src: string;
}

/**
 * THE AVATAR STAGE
 *
 * A single box with the master canvas aspect ratio. Every layer in the stack is
 * rendered into it at identical dimensions and identical origin — see
 * `LayerImage` for the one style block that constitutes the whole engine.
 *
 * The stage renders nothing decorative of its own. Framing, glow and platform
 * live in the presentation shell so that what is inside this box is exactly the
 * artwork and nothing else.
 */
export function AvatarStage({
  manifest,
  style,
  bodyBase,
  view,
  selection,
  onReports,
}: AvatarStageProps) {
  const [reports, setReports] = useState<Record<string, LayerReport>>({});

  const layers = useMemo<ResolvedLayer[]>(() => {
    const out: ResolvedLayer[] = [];
    for (const slot of LAYER_SLOTS) {
      const assetId =
        slot === 'base' ? (manifest.master(style, bodyBase)?.id ?? null) : (selection[slot] ?? null);
      if (!assetId) continue;

      const asset = manifest.byId(assetId, style, bodyBase, slot);
      if (!asset) continue;

      const src = fileForView(asset, view);
      if (!src) continue;

      out.push({ slot, assetId: asset.id, name: asset.name, src });
    }
    return out;
  }, [manifest, style, bodyBase, view, selection]);

  const handleReport = useCallback((report: LayerReport) => {
    setReports((current) => {
      const existing = current[report.src];
      if (
        existing &&
        existing.status === report.status &&
        existing.sizeMismatch?.got === report.sizeMismatch?.got
      ) {
        return current;
      }
      return { ...current, [report.src]: report };
    });
  }, []);

  // Notify upward from an effect, never from inside a state updater — calling a
  // parent's setter during another component's render is a React violation.
  useEffect(() => {
    onReports?.(Object.values(reports));
  }, [reports, onReports]);

  const masterReport = layers.length > 0 ? reports[layers[0]!.src] : undefined;
  const masterMissing = layers.length === 0 || masterReport?.status === 'missing';

  return (
    <div
      className="relative mx-auto h-full"
      style={{ aspectRatio: `${MASTER_CANVAS.width} / ${MASTER_CANVAS.height}` }}
      data-master-canvas={`${MASTER_CANVAS.width}x${MASTER_CANVAS.height}`}
    >
      {layers.map((layer, index) => (
        <LayerImage
          key={`${layer.slot}:${layer.src}`}
          slot={layer.slot}
          assetId={layer.assetId}
          src={layer.src}
          alt={`${layer.slot}: ${layer.name}`}
          zIndex={index + 1}
          onReport={handleReport}
        />
      ))}

      {masterMissing ? <MasterAssetRequired bodyBase={bodyBase} style={style} /> : null}
    </div>
  );
}

/**
 * The required failure state. The app never substitutes a different character
 * when the master is absent — it says exactly what is missing and where it goes.
 */
function MasterAssetRequired({ bodyBase, style }: { bodyBase: BodyBase; style: ArtStyleId }) {
  const path = `public/assets/${style}/${bodyBase}/base/master.png`;
  return (
    <div className="absolute inset-0 z-50 grid place-items-center p-6">
      <div className="w-full max-w-md border border-gold/40 bg-black/80 p-6 text-center backdrop-blur-sm">
        <p className="font-display text-[13px] tracking-[0.34em] text-gold uppercase">
          Master Avatar Asset Required
        </p>
        <div className="my-4 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
        <p className="text-[12.5px] leading-relaxed text-white/55">
          No master artwork found for{' '}
          <span className="text-cyan">
            {style} · {bodyBase}
          </span>
          . Place the delivered PNG at:
        </p>
        <code className="mt-3 block bg-white/5 px-3 py-2 font-mono text-[11px] break-all text-white/75">
          {path}
        </code>
        <p className="mt-3 text-[11px] leading-relaxed text-white/35">
          Nothing has been substituted in its place.
        </p>
      </div>
    </div>
  );
}

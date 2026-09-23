import { useEffect, useRef, useState } from 'react';
import { MASTER_CANVAS } from '../config/canvas';

export type LayerStatus = 'loading' | 'ready' | 'missing';

export interface LayerReport {
  slot: string;
  assetId: string;
  src: string;
  status: LayerStatus;
  /** Set when the file loaded but is not authored on the master canvas. */
  sizeMismatch: { got: string; expected: string } | null;
}

export interface LayerImageProps {
  slot: string;
  assetId: string;
  src: string;
  alt: string;
  zIndex: number;
  onReport: (report: LayerReport) => void;
}

/**
 * ONE COMPOSITED LAYER.
 *
 * The whole engine is this component's style block, and it is deliberately
 * boring: the layer fills the master canvas box exactly, at the same origin as
 * every other layer.
 *
 *   position: absolute; inset: 0; width: 100%; height: 100%;
 *
 * There is no object-fit contain, no bounding-box trim, no per-asset centring
 * and no scale-to-fit. Two PNGs authored on the same master canvas therefore
 * land on screen exactly as they sit in Photoshop, because the only transform
 * applied is the one uniform scale that maps the whole master canvas onto the
 * stage — and every layer gets the identical one.
 *
 * If a delivered asset is NOT on the master canvas the component reports a size
 * mismatch upward so the stage can surface it. It does not quietly re-fit the
 * artwork: that would be the code overriding the art.
 */
export function LayerImage({ slot, assetId, src, alt, zIndex, onReport }: LayerImageProps) {
  const [status, setStatus] = useState<LayerStatus>('loading');
  const reportRef = useRef(onReport);
  reportRef.current = onReport;

  // Reset when the source changes so a swap re-probes rather than showing stale state.
  useEffect(() => {
    setStatus('loading');
  }, [src]);

  return (
    <img
      key={src}
      src={src}
      alt={alt}
      draggable={false}
      decoding="async"
      className="pointer-events-none absolute inset-0 h-full w-full select-none"
      style={{
        zIndex,
        // `fill` maps the image onto the canvas box 1:1. For a correctly
        // authored asset this is an exact uniform scale; for a wrongly sized
        // one it distorts visibly rather than hiding the error.
        objectFit: 'fill',
        opacity: status === 'ready' ? 1 : 0,
        transition: 'opacity 220ms ease-out',
      }}
      onLoad={(event) => {
        const img = event.currentTarget;
        const got = `${img.naturalWidth} x ${img.naturalHeight}`;
        const expected = `${MASTER_CANVAS.width} x ${MASTER_CANVAS.height}`;
        setStatus('ready');
        reportRef.current({
          slot,
          assetId,
          src,
          status: 'ready',
          sizeMismatch: got === expected ? null : { got, expected },
        });
      }}
      onError={() => {
        setStatus('missing');
        reportRef.current({ slot, assetId, src, status: 'missing', sizeMismatch: null });
      }}
    />
  );
}

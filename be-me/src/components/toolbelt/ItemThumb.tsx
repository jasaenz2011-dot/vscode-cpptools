'use client';

import { memo } from 'react';
import { SKULL_PATH, TORSO_PATH } from '@/lib/catalog/geometry';
import { LEG_BOX_W, NECK } from '@/lib/rig';
import { shade } from '@/lib/color';
import type { AnchorSpace, AssetPalette, CatalogItem } from '@/lib/types';

type Ghost = 'head' | 'torso' | 'hips' | 'feet' | 'hand' | 'none';

interface Frame {
  x: number;
  y: number;
  w: number;
  h: number;
  ghost: Ghost;
}

/**
 * Each anchor space gets a frame that crops tightly to where its assets live,
 * plus a faded body part for context so a hairstyle reads as a hairstyle.
 */
const FRAMES: Record<AnchorSpace, Frame> = {
  head: { x: -64, y: -76, w: 128, h: 132, ghost: 'head' },
  face: { x: -46, y: -36, w: 92, h: 94, ghost: 'head' },
  torso: { x: -58, y: -18, w: 116, h: 152, ghost: 'torso' },
  hips: { x: -76, y: -38, w: 152, h: 128, ghost: 'hips' },
  feet: { x: -34, y: -58, w: 68, h: 70, ghost: 'feet' },
  hand: { x: -34, y: -36, w: 68, h: 80, ghost: 'hand' },
  chest: { x: -58, y: -52, w: 56, h: 82, ghost: 'none' },
  canvas: { x: 0, y: 0, w: 360, h: 480, ghost: 'none' },
};

/**
 * Display-case backdrop. Without it, navy garments on the navy tray are
 * invisible — every item needs a lit surface to sit against.
 */
const BACKDROP_ID = 'be-thumb-backdrop';

function Backdrop({ frame }: { frame: Frame }) {
  return (
    <>
      <defs>
        <linearGradient id={BACKDROP_ID} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#42556f" />
          <stop offset="62%" stopColor="#2b3a52" />
          <stop offset="100%" stopColor="#16203a" />
        </linearGradient>
      </defs>
      <rect x={frame.x} y={frame.y} width={frame.w} height={frame.h} fill={`url(#${BACKDROP_ID})`} />
    </>
  );
}

function GhostBody({ kind, skin }: { kind: Ghost; skin: string }) {
  const deep = shade(skin, 0.24);
  switch (kind) {
    case 'head':
      return (
        <g opacity={0.9}>
          <rect x={-NECK.halfW} y={NECK.top} width={NECK.halfW * 2} height={26} rx={5} fill={deep} />
          <ellipse cx={-40} cy={4} rx={7} ry={9} fill={skin} />
          <ellipse cx={40} cy={4} rx={7} ry={9} fill={skin} />
          <path d={SKULL_PATH} fill={skin} />
        </g>
      );
    case 'torso':
      return (
        <g opacity={0.9}>
          <rect x={-13} y={-18} width={26} height={22} rx={5} fill={deep} />
          <path d={TORSO_PATH} fill={skin} />
        </g>
      );
    case 'hips':
      return (
        <g opacity={0.9}>
          <path d="M -42,-38 L 42,-38 L 44,-2 L -44,-2 Z" fill={skin} />
          {[-15, 15].map((x) => (
            <rect
              key={x}
              x={x - LEG_BOX_W / 2}
              y={-8}
              width={LEG_BOX_W}
              height={96}
              rx={LEG_BOX_W / 2}
              fill={skin}
            />
          ))}
        </g>
      );
    case 'feet':
      return (
        <g opacity={0.9}>
          <rect x={-13} y={-50} width={26} height={40} rx={13} fill={skin} />
          <rect x={-32} y={2} width={64} height={2.5} rx={1.25} fill="#7dd3fc" opacity={0.35} />
        </g>
      );
    case 'hand':
      return <circle cx={0} cy={0} r={15} fill={skin} opacity={0.9} />;
    default:
      return null;
  }
}

export interface ItemThumbProps {
  item: CatalogItem;
  palette: AssetPalette;
  t: number;
  className?: string;
}

function ItemThumbImpl({ item, palette, t, className = '' }: ItemThumbProps) {
  const frame = FRAMES[item.anchor];
  const BackAsset = item.BackAsset;
  return (
    <svg
      viewBox={`${frame.x} ${frame.y} ${frame.w} ${frame.h}`}
      className={className}
      aria-hidden="true"
      focusable="false"
      shapeRendering="geometricPrecision"
      preserveAspectRatio="xMidYMid slice"
    >
      {item.anchor === 'canvas' ? null : <Backdrop frame={frame} />}
      {BackAsset ? <BackAsset palette={palette} t={t} /> : null}
      <GhostBody kind={frame.ghost} skin={palette.skin} />
      <item.Asset palette={palette} t={t} />
      {item.LimbAsset && item.limbTarget === 'legs' ? (
        <>
          <g transform="translate(-15 -8)">
            <item.LimbAsset palette={palette} t={t} side="left" />
          </g>
          <g transform="translate(15 -8)">
            <item.LimbAsset palette={palette} t={t} side="right" />
          </g>
        </>
      ) : null}
    </svg>
  );
}

export const ItemThumb = memo(ItemThumbImpl);

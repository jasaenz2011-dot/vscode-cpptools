'use client';

/**
 * The layer compositor.
 *
 * Renders the whole student as one SVG scene graph. Every rigged group carries
 * a CSS transform built by the growth engine, so changing grade animates on the
 * browser's own timeline: React renders once, the browser interpolates all
 * ~20 anchors together, and nothing can drift because assets are children of
 * the anchors they belong to.
 */
import { memo, useMemo } from 'react';
import {
  ARM_BOX_W,
  ARM_BOX_LEN,
  LEG_BOX_W,
  LEG_BOX_LEN,
  NECK,
  STAGE_H,
  STAGE_W,
  buildRig,
  rigStyle,
} from '@/lib/rig';
import { getItem } from '@/lib/catalog';
import { paletteFor } from '@/lib/store';
import { SKULL_PATH, TORSO_PATH } from '@/lib/catalog/geometry';
import type { AssetPalette, AvatarConfig, CatalogItem, LayerSlot } from '@/lib/types';
import { shade } from '@/lib/color';

const GROW_MS = 620;
const GROW_EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

export interface AvatarFigureProps {
  config: AvatarConfig;
  /** Animate anchor changes. Off for export and static thumbnails. */
  animate?: boolean;
  /** Gentle breathing loop. Off for export. */
  idle?: boolean;
  /** Blueprint measurement overlay. Stripped from exports by `svgToImage`. */
  overlay?: boolean;
}

/**
 * Blueprint mode: the rig's own landmarks, drawn over the figure as survey
 * lines. Marked `data-export="hide"` so it never lands in a downloaded PNG.
 */
function BlueprintOverlay({ rig }: { rig: ReturnType<typeof buildRig> }) {
  const ease = 'cubic-bezier(0.22, 1, 0.36, 1)';
  const marks: Array<{ y: number; label: string }> = [
    { y: rig.groundY - rig.height, label: 'CROWN' },
    { y: rig.head.y + 50 * rig.head.scale, label: 'CHIN' },
    { y: rig.torso.y, label: 'SHLDR' },
    { y: rig.hips.y, label: 'HIP' },
    { y: rig.hips.y + (rig.groundY - rig.hips.y) / 2, label: 'KNEE' },
    { y: rig.groundY, label: 'FLOOR' },
  ];

  return (
    <g data-export="hide" pointerEvents="none">
      <g stroke="#7dd3fc" strokeWidth={0.6} opacity={0.4}>
        <path d={`M ${rig.centerX},18 V ${STAGE_H - 18}`} strokeDasharray="4 5" />
      </g>
      {marks.map((mark) => (
        <g
          key={mark.label}
          style={{
            transformBox: 'view-box',
            transformOrigin: '0px 0px',
            transform: `translate(0px, ${mark.y.toFixed(2)}px)`,
            transition: `transform ${GROW_MS}ms ${ease}`,
          }}
        >
          <path
            d={`M 26,0 H ${STAGE_W - 26}`}
            stroke="#7dd3fc"
            strokeWidth={0.7}
            strokeDasharray="3 6"
            opacity={0.5}
          />
          <path d="M 20,0 H 30 M 25,-4 V 4" stroke="#f59e0b" strokeWidth={1} opacity={0.85} />
          <text
            x={34}
            y={-4}
            fill="#7dd3fc"
            fontSize={7}
            letterSpacing={1.1}
            opacity={0.72}
            fontFamily="var(--font-blueprint)"
          >
            {mark.label}
          </text>
        </g>
      ))}
      <g
        style={{
          transformBox: 'view-box',
          transformOrigin: '0px 0px',
          transform: `translate(${(STAGE_W - 30).toFixed(2)}px, ${(
            rig.groundY -
            rig.height / 2
          ).toFixed(2)}px)`,
          transition: `transform ${GROW_MS}ms ${ease}`,
        }}
      >
        <text
          textAnchor="middle"
          transform="rotate(-90)"
          fill="#f59e0b"
          fontSize={7.5}
          letterSpacing={1.4}
          opacity={0.8}
          fontFamily="var(--font-blueprint)"
        >
          {`H ${Math.round(rig.height)}U`}
        </text>
      </g>
    </g>
  );
}

interface Equipped {
  item: CatalogItem;
  palette: AssetPalette;
}

function AvatarFigureImpl({
  config,
  animate = true,
  idle = true,
  overlay = false,
}: AvatarFigureProps) {
  const rig = useMemo(() => buildRig(config.grade), [config.grade]);

  const equipped = useMemo(() => {
    const out = {} as Record<LayerSlot, Equipped | null>;
    for (const slot of [
      'background',
      'hair',
      'headwear',
      'expression',
      'top',
      'bottom',
      'shoes',
      'eyewear',
      'badge',
      'tool',
    ] as LayerSlot[]) {
      const item = getItem(slot, config.items[slot]);
      out[slot] = item ? { item, palette: paletteFor(config, item) } : null;
    }
    return out;
  }, [config]);

  const skin = config.skinTone;
  const skinDeep = useMemo(() => shade(skin, 0.2), [skin]);
  const skinLine = useMemo(() => shade(skin, 0.42), [skin]);
  const t = rig.t;

  const grow = animate ? `transform ${GROW_MS}ms ${GROW_EASE}` : undefined;
  const anchor = (a: Parameters<typeof rigStyle>[0]) =>
    grow ? { ...rigStyle(a), transition: grow } : rigStyle(a);

  const bg = equipped.background;
  const hair = equipped.hair;
  const top = equipped.top;
  const bottom = equipped.bottom;
  const shoes = equipped.shoes;

  const armCapsule = (
    <>
      <rect
        x={-ARM_BOX_W / 2}
        y={-ARM_BOX_W / 2}
        width={ARM_BOX_W}
        height={ARM_BOX_LEN + ARM_BOX_W / 2}
        rx={ARM_BOX_W / 2}
        fill={skin}
      />
      <rect
        x={ARM_BOX_W / 2 - 5}
        y={-ARM_BOX_W / 2}
        width={5}
        height={ARM_BOX_LEN + ARM_BOX_W / 2}
        rx={2.5}
        fill={skinDeep}
        opacity={0.5}
      />
    </>
  );

  const legCapsule = (
    <>
      <rect
        x={-LEG_BOX_W / 2}
        y={-LEG_BOX_W / 2}
        width={LEG_BOX_W}
        height={LEG_BOX_LEN + LEG_BOX_W / 2}
        rx={LEG_BOX_W / 2}
        fill={skin}
      />
      <rect
        x={LEG_BOX_W / 2 - 6}
        y={-LEG_BOX_W / 2}
        width={6}
        height={LEG_BOX_LEN + LEG_BOX_W / 2}
        rx={3}
        fill={skinDeep}
        opacity={0.45}
      />
    </>
  );

  // A mitten shape with a thumb bump reads as a hand where a bare circle reads
  // as a ball.
  const hand = (
    <g transform={`translate(0 ${ARM_BOX_LEN})`}>
      <rect
        x={-ARM_BOX_W * 0.5}
        y={-ARM_BOX_W * 0.42}
        width={ARM_BOX_W}
        height={ARM_BOX_W * 1.06}
        rx={ARM_BOX_W * 0.46}
        fill={skin}
      />
      <circle cx={-ARM_BOX_W * 0.42} cy={-ARM_BOX_W * 0.04} r={ARM_BOX_W * 0.22} fill={skin} />
      <path
        d={`M ${-ARM_BOX_W * 0.2},${ARM_BOX_W * 0.24} h ${ARM_BOX_W * 0.4}`}
        stroke={skinDeep}
        strokeWidth={1.6}
        strokeLinecap="round"
        opacity={0.5}
      />
    </g>
  );

  // Fingers close over the handle, so a held tool reads as gripped, not glued on.
  const grip = (
    <g style={anchor(rig.hand)}>
      <rect x={-8.4} y={-8} width={16.8} height={16} rx={8} fill={skin} />
      <path d="M -6,-2 h 12" stroke={skinDeep} strokeWidth={1.5} strokeLinecap="round" opacity={0.55} />
      <path d="M -6,2.6 h 12" stroke={skinDeep} strokeWidth={1.5} strokeLinecap="round" opacity={0.4} />
    </g>
  );

  return (
    <>
      {bg ? <bg.item.Asset palette={bg.palette} t={t} /> : null}

      <ellipse
        rx={1}
        ry={1}
        fill="#000000"
        opacity={0.3}
        style={{
          transformBox: 'view-box',
          transformOrigin: '0px 0px',
          transform: `translate(${rig.shadow.cx}px, ${rig.shadow.cy}px) scale(${rig.shadow.rx.toFixed(
            2,
          )}, ${rig.shadow.ry.toFixed(2)})`,
          ...(grow ? { transition: grow } : {}),
        }}
      />

      <g className={idle ? 'motion-safe:animate-idle-bob' : undefined} style={{ transformOrigin: '50% 90%' }}>
        {/* Long hair falls behind the whole body. */}
        {hair?.item.BackAsset ? (
          <g style={anchor(rig.head)}>
            <hair.item.BackAsset palette={hair.palette} t={t} />
          </g>
        ) : null}

        <g style={anchor(rig.legLeft)}>
          {legCapsule}
          {bottom?.item.LimbAsset && bottom.item.limbTarget === 'legs' ? (
            <bottom.item.LimbAsset palette={bottom.palette} t={t} side="left" />
          ) : null}
        </g>
        <g style={anchor(rig.legRight)}>
          {legCapsule}
          {bottom?.item.LimbAsset && bottom.item.limbTarget === 'legs' ? (
            <bottom.item.LimbAsset palette={bottom.palette} t={t} side="right" />
          ) : null}
        </g>

        {shoes ? (
          <>
            <g style={anchor(rig.footLeft)}>
              <shoes.item.Asset palette={shoes.palette} t={t} side="left" />
            </g>
            <g style={anchor(rig.footRight)}>
              <shoes.item.Asset palette={shoes.palette} t={t} side="right" />
            </g>
          </>
        ) : (
          <>
            <g style={anchor(rig.footLeft)}>
              <ellipse cx={0} cy={-6} rx={20} ry={9} fill={skin} />
            </g>
            <g style={anchor(rig.footRight)}>
              <ellipse cx={0} cy={-6} rx={20} ry={9} fill={skin} />
            </g>
          </>
        )}

        <g style={anchor(rig.torso)}>
          <path d={TORSO_PATH} fill={skin} />
          <path
            d="M 19,0 C 33,2.5 43.5,11 45.8,27 L 39.5,70 C 38.5,90 40.5,107 41.5,124.5 L 24,124.5 C 26,100 26,40 19,0 Z"
            fill={skinDeep}
            opacity={0.45}
          />
        </g>

        {bottom ? (
          <g style={anchor(rig.hips)}>
            <bottom.item.Asset palette={bottom.palette} t={t} />
          </g>
        ) : null}

        {top ? (
          <g style={anchor(rig.torso)}>
            <top.item.Asset palette={top.palette} t={t} />
          </g>
        ) : null}

        <g style={anchor(rig.armLeft)}>
          {armCapsule}
          {top?.item.LimbAsset && top.item.limbTarget === 'arms' ? (
            <top.item.LimbAsset palette={top.palette} t={t} side="left" />
          ) : null}
          {hand}
        </g>
        <g style={anchor(rig.armRight)}>
          {armCapsule}
          {top?.item.LimbAsset && top.item.limbTarget === 'arms' ? (
            <top.item.LimbAsset palette={top.palette} t={t} side="right" />
          ) : null}
          {hand}
        </g>

        {equipped.badge ? (
          <g style={anchor(rig.chest)}>
            <equipped.badge.item.Asset palette={equipped.badge.palette} t={t} />
          </g>
        ) : null}

        {/* The neck is authored in head space so it always meets the chin, and
            it draws *after* the garments so it fills the collar opening rather
            than hiding behind it. */}
        <g style={anchor(rig.head)}>
          <rect
            x={-NECK.halfW}
            y={NECK.top}
            width={NECK.halfW * 2}
            height={NECK.bottom - NECK.top}
            rx={5}
            fill={skinDeep}
          />
          <rect
            x={-NECK.halfW + 2.5}
            y={NECK.top}
            width={NECK.halfW * 2 - 5}
            height={NECK.bottom - NECK.top - 3}
            rx={4}
            fill={skin}
          />
        </g>

        <g style={anchor(rig.head)}>
          <g fill={skin}>
            <ellipse cx={-40} cy={4} rx={7} ry={9} />
            <ellipse cx={40} cy={4} rx={7} ry={9} />
          </g>
          <g fill={skinDeep} opacity={0.7}>
            <ellipse cx={-41} cy={4} rx={3.4} ry={4.6} />
            <ellipse cx={41} cy={4} rx={3.4} ry={4.6} />
          </g>
          <path d={SKULL_PATH} fill={skin} />
          <path
            d="M 41.8,-11 C 43,9 34.5,29.5 18.5,41.5 C 12.5,46 6.2,48.8 0,48.8 L 0,44 C 12,42 26,26 30,6 C 32,-4 32,-14 30,-24 C 36,-20 41,-16 41.8,-11 Z"
            fill={skinLine}
            opacity={0.28}
          />
        </g>

        {equipped.expression ? (
          <g style={anchor(rig.head)}>
            <equipped.expression.item.Asset palette={equipped.expression.palette} t={t} />
          </g>
        ) : null}

        {hair ? (
          <g style={anchor(rig.head)}>
            <hair.item.Asset palette={hair.palette} t={t} />
          </g>
        ) : null}

        {equipped.headwear ? (
          <g style={anchor(rig.head)}>
            <equipped.headwear.item.Asset palette={equipped.headwear.palette} t={t} />
          </g>
        ) : null}

        {equipped.eyewear ? (
          <g style={anchor(rig.head)}>
            <equipped.eyewear.item.Asset palette={equipped.eyewear.palette} t={t} />
          </g>
        ) : null}

        {equipped.tool ? (
          <>
            <g style={anchor(rig.hand)}>
              <equipped.tool.item.Asset palette={equipped.tool.palette} t={t} />
            </g>
            {grip}
          </>
        ) : null}
      </g>

      {overlay ? <BlueprintOverlay rig={rig} /> : null}
    </>
  );
}

export const AvatarFigure = memo(AvatarFigureImpl);

/** Standalone SVG wrapper — used by the stage, the badge and the exporter. */
export interface AvatarSceneProps extends AvatarFigureProps {
  className?: string;
  title?: string;
  preserveAspectRatio?: string;
}

export function AvatarScene({ className, title, preserveAspectRatio, ...rest }: AvatarSceneProps) {
  return (
    <svg
      viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
      className={className}
      role="img"
      aria-label={title ?? 'Avatar preview'}
      shapeRendering="geometricPrecision"
      {...(preserveAspectRatio ? { preserveAspectRatio } : {})}
    >
      <AvatarFigure {...rest} />
    </svg>
  );
}

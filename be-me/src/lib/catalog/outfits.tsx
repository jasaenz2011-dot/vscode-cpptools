/**
 * Gear: tops, bottoms and footwear.
 *
 * Tops paint the torso plus a sleeve that is drawn *inside* each arm group, and
 * bottoms paint the hips plus a trouser leg drawn inside each leg group. Because
 * the limb pieces are children of the limb anchors they inherit the exact joint
 * rotation, so sleeves and trousers can never slide off the limb they dress --
 * at any grade, at any viewport.
 */
import { shade, tint } from '../color';
import type { AssetProps, CatalogItem } from '../types';
import { ARM_BOX_W, LEG_BOX_W } from '../rig';
import { SHIRT_PATH } from './geometry';

/* ================================== TOPS ================================= */

function Collar({ color, w = 19 }: { color: string; w?: number }) {
  return <ellipse cx={0} cy={1} rx={w} ry={7.5} fill={color} />;
}

/** Fabric shell + a soft inner shadow so garments never look like flat decals. */
function Shell({ fill, d = SHIRT_PATH }: { fill: string; d?: string }) {
  return (
    <g>
      <path d={d} fill={shade(fill, 0.4)} />
      <path d={d} fill={fill} transform="translate(0 -1.6)" />
      <path
        d="M -20,-1 C -30,26 -32,80 -30,124 L -43.5,125.5 C -42.5,107 -40.5,91 -41.5,71 L -48.4,27.5 C -46,10.5 -35,1.5 -20,-1 Z"
        fill={shade(fill, 0.22)}
        opacity={0.55}
      />
    </g>
  );
}

function Sleeve({
  fill,
  length,
  cuff,
}: {
  fill: string;
  length: number;
  cuff?: string;
}) {
  const w = ARM_BOX_W / 2 + 2.4;
  // The cap is a full semicircle on purpose. The shoulder joint sits inside the
  // torso, so the round cap is what bridges the gap between the garment's
  // shoulder curve and the outer edge of the sleeve — flatten it and a wedge of
  // background opens up above the shoulder.
  return (
    <g>
      <rect x={-w} y={-w} width={w * 2} height={length + w} rx={w} fill={shade(fill, 0.32)} />
      <rect x={-w} y={-w - 1.4} width={w * 2} height={length + w} rx={w} fill={fill} />
      {cuff ? (
        <rect x={-w - 0.6} y={length - 9} width={w * 2 + 1.2} height={10} rx={4.5} fill={cuff} />
      ) : null}
    </g>
  );
}

function MakerTee({ palette }: AssetProps) {
  return (
    <g>
      <Shell fill={palette.primary} />
      <Collar color={shade(palette.primary, 0.45)} />
      <g transform="translate(0 46)">
        <circle r={17} fill={palette.accent} opacity={0.95} />
        <circle r={17} fill="none" stroke={shade(palette.accent, 0.5)} strokeWidth={2.4} />
        <path
          d="M -7,-6 L 7,-6 M 0,-6 L 0,7 M -8,7 L 8,7"
          stroke={shade(palette.accent, 0.72)}
          strokeWidth={3.4}
          strokeLinecap="round"
        />
      </g>
    </g>
  );
}

function TeeSleeve({ palette }: AssetProps) {
  return <Sleeve fill={palette.primary} length={30} />;
}

function Hoodie({ palette }: AssetProps) {
  return (
    <g>
      <path
        d="M -34,-4 C -38,18 -22,34 0,34 C 22,34 38,18 34,-4 C 22,-14 -22,-14 -34,-4 Z"
        fill={shade(palette.primary, 0.5)}
      />
      <Shell fill={palette.primary} />
      <path
        d="M -30,-6 C -34,16 -20,30 0,30 C 20,30 34,16 30,-6 C 20,4 -20,4 -30,-6 Z"
        fill={shade(palette.primary, 0.34)}
      />
      <g stroke={palette.secondary} strokeWidth={3.4} strokeLinecap="round" fill="none">
        <path d="M -9,12 C -11,26 -11,36 -10,44" />
        <path d="M 9,12 C 11,26 11,36 10,44" />
      </g>
      <circle cx={-10} cy={46} r={3.4} fill={palette.accent} />
      <circle cx={10} cy={46} r={3.4} fill={palette.accent} />
      <path
        d="M -28,74 L 28,74 C 30,74 31,76 31,78 L 31,100 C 31,102 30,104 28,104 L -28,104 C -30,104 -31,102 -31,100 L -31,78 C -31,76 -30,74 -28,74 Z"
        fill={shade(palette.primary, 0.22)}
      />
      <path d="M -31,80 L 31,80" stroke={palette.secondary} strokeWidth={2.4} opacity={0.7} />
    </g>
  );
}

function LongSleeve({ palette }: AssetProps) {
  return <Sleeve fill={palette.primary} length={84} cuff={palette.secondary} />;
}

function HiVisVest({ palette }: AssetProps) {
  return (
    <g>
      <Shell fill={palette.secondary} />
      <Collar color={shade(palette.secondary, 0.45)} />
      <path
        d="M -20,-1 C -35,1.5 -46,10.5 -48.4,27.5 L -41.5,71 C -40.5,91 -42.5,107 -43.5,125.5 L -7,125.5 L -7,4 Z"
        fill={palette.primary}
      />
      <path
        d="M 20,-1 C 35,1.5 46,10.5 48.4,27.5 L 41.5,71 C 40.5,91 42.5,107 43.5,125.5 L 7,125.5 L 7,4 Z"
        fill={palette.primary}
      />
      <g fill={palette.accent}>
        <rect x={-45} y={54} width={37} height={9} />
        <rect x={8} y={54} width={37} height={9} />
        <rect x={-44} y={92} width={36} height={9} />
        <rect x={8} y={92} width={36} height={9} />
        <path d="M -40,8 L -31,4 L -20,66 L -28,68 Z" />
        <path d="M 40,8 L 31,4 L 20,66 L 28,68 Z" />
      </g>
      <g fill="#ffffff" opacity={0.4}>
        <rect x={-45} y={54} width={37} height={3} />
        <rect x={8} y={54} width={37} height={3} />
      </g>
      <rect x={-5} y={2} width={10} height={124} fill={shade(palette.secondary, 0.2)} opacity={0.7} />
    </g>
  );
}

function BibOveralls({ palette }: AssetProps) {
  const denim = palette.primary;
  return (
    <g>
      <Shell fill={palette.secondary} />
      <Collar color={shade(palette.secondary, 0.45)} />
      <path
        d="M -30,40 L 30,40 C 33,40 34,42 34,45 L 36,126 L -36,126 L -34,45 C -34,42 -33,40 -30,40 Z"
        fill={shade(denim, 0.34)}
      />
      <path
        d="M -30,38 L 30,38 C 33,38 34,40 34,43 L 36,126 L -36,126 L -34,43 C -34,40 -33,38 -30,38 Z"
        fill={denim}
      />
      <g fill={shade(denim, 0.3)}>
        <path d="M -30,4 L -18,2 L -14,40 L -26,42 Z" />
        <path d="M 30,4 L 18,2 L 14,40 L 26,42 Z" />
      </g>
      <g fill={denim}>
        <path d="M -30,2 L -18,0 L -14,38 L -26,40 Z" />
        <path d="M 30,2 L 18,0 L 14,38 L 26,40 Z" />
      </g>
      <g fill={palette.accent}>
        <rect x={-28} y={34} width={11} height={11} rx={2.5} />
        <rect x={17} y={34} width={11} height={11} rx={2.5} />
      </g>
      <rect x={-16} y={62} width={32} height={30} rx={3} fill={shade(denim, 0.18)} />
      <path d="M -16,70 L 16,70" stroke={palette.accent} strokeWidth={2} opacity={0.8} />
    </g>
  );
}

function LabCoat({ palette }: AssetProps) {
  return (
    <g>
      <Shell fill={palette.primary} />
      <Collar color={shade(palette.primary, 0.3)} />
      <path d="M -19,2 L -4,18 L -14,34 L -26,14 Z" fill={shade(palette.primary, 0.24)} />
      <path d="M 19,2 L 4,18 L 14,34 L 26,14 Z" fill={shade(palette.primary, 0.24)} />
      <path d="M -3,16 L 3,16 L 4,126 L -4,126 Z" fill={shade(palette.primary, 0.28)} />
      <g fill={palette.secondary}>
        <circle cx={0} cy={46} r={3.2} />
        <circle cx={0} cy={70} r={3.2} />
        <circle cx={0} cy={94} r={3.2} />
      </g>
      <rect x={-40} y={76} width={26} height={24} rx={2.5} fill={shade(palette.primary, 0.14)} />
      <rect x={14} y={76} width={26} height={24} rx={2.5} fill={shade(palette.primary, 0.14)} />
      <g transform="translate(-27 34)">
        <rect x={-2.6} y={-11} width={5.2} height={17} rx={2} fill={palette.accent} />
        <rect x={-2.6} y={-13} width={5.2} height={4} rx={1.4} fill={shade(palette.accent, 0.4)} />
      </g>
    </g>
  );
}

function Flannel({ palette }: AssetProps) {
  return (
    <g>
      <Shell fill={palette.secondary} />
      <Collar color={shade(palette.secondary, 0.4)} />
      <g>
        <path
          d="M -20,-1 C -35,1.5 -46,10.5 -48.4,27.5 L -41.5,71 C -40.5,91 -42.5,107 -43.5,125.5 L -14,125.5 L -8,6 Z"
          fill={palette.primary}
        />
        <path
          d="M 20,-1 C 35,1.5 46,10.5 48.4,27.5 L 41.5,71 C 40.5,91 42.5,107 43.5,125.5 L 14,125.5 L 8,6 Z"
          fill={palette.primary}
        />
        <g stroke={palette.accent} strokeWidth={2.6} opacity={0.55}>
          <path d="M -44,20 L -10,20 M 10,20 L 44,20" />
          <path d="M -44,52 L -12,52 M 12,52 L 44,52" />
          <path d="M -43,86 L -13,86 M 13,86 L 43,86" />
          <path d="M -34,2 L -30,126 M 34,2 L 30,126" />
          <path d="M -20,4 L -17,126 M 20,4 L 17,126" />
        </g>
      </g>
      <path d="M -8,6 L 8,6 L 6,126 L -6,126 Z" fill={shade(palette.secondary, 0.2)} />
    </g>
  );
}

function TeamJersey({ palette }: AssetProps) {
  return (
    <g>
      <Shell fill={palette.primary} />
      <Collar color={palette.secondary} w={20} />
      <g fill={palette.secondary}>
        <rect x={-46} y={30} width={92} height={11} />
        <rect x={-46} y={48} width={92} height={5} />
      </g>
      <g transform="translate(0 84)" fill={palette.accent} stroke={shade(palette.accent, 0.6)} strokeWidth={2}>
        <path d="M -19,-18 L -6,-18 L -6,18 L -19,18 Z" />
        <path d="M 3,-18 L 19,-18 L 19,18 L 3,18 Z" />
      </g>
      <g transform="translate(0 84)" fill={palette.primary}>
        <rect x={-15.5} y={-14} width={5.5} height={28} />
        <rect x={7} y={-14} width={8} height={9} />
        <rect x={7} y={5} width={8} height={9} />
      </g>
    </g>
  );
}

function BoilerSuit({ palette }: AssetProps) {
  return (
    <g>
      <Shell fill={palette.primary} />
      <Collar color={shade(palette.primary, 0.4)} />
      <path d="M -22,2 L -3,14 L -3,126 L -12,126 Z" fill={shade(palette.primary, 0.2)} />
      <path d="M 22,2 L 3,14 L 3,126 L 12,126 Z" fill={shade(palette.primary, 0.2)} />
      <rect x={-3} y={14} width={6} height={112} fill={palette.secondary} />
      <g fill={palette.accent}>
        <rect x={-42} y={62} width={26} height={7} rx={2} />
        <rect x={16} y={62} width={26} height={7} rx={2} />
        <rect x={-40} y={100} width={80} height={7} rx={3} />
      </g>
      <rect x={-40} y={74} width={22} height={20} rx={2} fill={shade(palette.primary, 0.18)} />
      <rect x={18} y={74} width={22} height={20} rx={2} fill={shade(palette.primary, 0.18)} />
    </g>
  );
}

function VestSleeve({ palette }: AssetProps) {
  return <Sleeve fill={palette.secondary} length={30} />;
}

function CoatSleeve({ palette }: AssetProps) {
  return <Sleeve fill={palette.primary} length={80} cuff={shade(palette.primary, 0.2)} />;
}

function FlannelSleeve({ palette }: AssetProps) {
  return (
    <g>
      <Sleeve fill={palette.primary} length={70} cuff={palette.secondary} />
      <g stroke={palette.accent} strokeWidth={2.2} opacity={0.5}>
        <path d="M -12,14 L 12,14 M -12,36 L 12,36 M -12,56 L 12,56" />
        <path d="M -5,-8 L -5,64 M 5,-8 L 5,64" />
      </g>
    </g>
  );
}

/* ================================ BOTTOMS ================================ */

const HIP_PATH =
  'M -50,-26 C -34,-18 34,-18 50,-26 L 52,16 C 34,26 -34,26 -52,16 Z';

function HipPiece({ fill, belt }: { fill: string; belt?: string }) {
  return (
    <g>
      <path d={HIP_PATH} fill={shade(fill, 0.36)} />
      <path d={HIP_PATH} fill={fill} transform="translate(0 -1.6)" />
      {belt ? (
        <g>
          <path d="M -50,-24 C -34,-16 34,-16 50,-24 L 50,-11 C 34,-3 -34,-3 -50,-11 Z" fill={belt} />
          <rect x={-8} y={-20} width={16} height={12} rx={2} fill={shade(belt, 0.45)} />
          <rect x={-5} y={-17} width={10} height={6} rx={1.5} fill={tint(belt, 0.35)} />
        </g>
      ) : null}
    </g>
  );
}

function TrouserLeg({
  fill,
  length,
  cuff,
  taper = 0,
}: {
  fill: string;
  length: number;
  cuff?: string;
  taper?: number;
}) {
  const w = LEG_BOX_W / 2 + 2.4;
  const bottom = w - taper;
  return (
    <g>
      <path
        d={`M ${-w},-14 L ${w},-14 L ${bottom},${length} C ${bottom},${length + 4} ${-bottom},${length + 4} ${-bottom},${length} Z`}
        fill={shade(fill, 0.32)}
      />
      <path
        d={`M ${-w},-15 L ${w},-15 L ${bottom},${length - 2} C ${bottom},${length + 2} ${-bottom},${length + 2} ${-bottom},${length - 2} Z`}
        fill={fill}
      />
      {cuff ? (
        <rect
          x={-bottom - 1}
          y={length - 11}
          width={bottom * 2 + 2}
          height={12}
          rx={4}
          fill={cuff}
        />
      ) : null}
    </g>
  );
}

function CargoHip({ palette }: AssetProps) {
  return <HipPiece fill={palette.primary} belt={palette.secondary} />;
}

function CargoLeg({ palette }: AssetProps) {
  return (
    <g>
      <TrouserLeg fill={palette.primary} length={84} taper={2} />
      <g>
        <rect x={-15} y={30} width={13} height={17} rx={2} fill={shade(palette.primary, 0.24)} />
        <rect x={2} y={30} width={13} height={17} rx={2} fill={shade(palette.primary, 0.24)} />
        <path d="M -15,34 L -2,34 M 2,34 L 15,34" stroke={palette.accent} strokeWidth={2} opacity={0.8} />
      </g>
    </g>
  );
}

function JeansHip({ palette }: AssetProps) {
  return (
    <g>
      <HipPiece fill={palette.primary} belt={palette.secondary} />
      <path d="M -30,-6 C -20,8 20,8 30,-6" fill="none" stroke={palette.accent} strokeWidth={2} opacity={0.6} />
    </g>
  );
}

function JeansLeg({ palette }: AssetProps) {
  return (
    <g>
      <TrouserLeg fill={palette.primary} length={86} taper={3.5} />
      <path
        d={`M 0,-10 L 0,80`}
        stroke={palette.accent}
        strokeWidth={1.8}
        strokeDasharray="5 4"
        opacity={0.55}
      />
    </g>
  );
}

function ShortsHip({ palette }: AssetProps) {
  return <HipPiece fill={palette.primary} belt={palette.secondary} />;
}

function ShortsLeg({ palette }: AssetProps) {
  return (
    <g>
      <TrouserLeg fill={palette.primary} length={38} taper={-3} />
      <rect x={-17} y={26} width={34} height={6} rx={3} fill={palette.accent} opacity={0.85} />
    </g>
  );
}

function JoggersHip({ palette }: AssetProps) {
  return (
    <g>
      <HipPiece fill={palette.primary} />
      <path d="M -34,-14 C -20,-6 20,-6 34,-14" fill="none" stroke={palette.secondary} strokeWidth={4} strokeLinecap="round" />
    </g>
  );
}

function JoggersLeg({ palette }: AssetProps) {
  return (
    <g>
      <TrouserLeg fill={palette.primary} length={80} cuff={palette.secondary} taper={4.5} />
      <rect x={-4} y={0} width={4} height={70} fill={palette.accent} opacity={0.9} />
    </g>
  );
}

function SkirtHip({ palette }: AssetProps) {
  return (
    <g>
      <path d="M -50,-26 C -34,-18 34,-18 50,-26 L 74,58 C 40,70 -40,70 -74,58 Z" fill={shade(palette.primary, 0.36)} />
      <path d="M -50,-27 C -34,-19 34,-19 50,-27 L 72,55 C 40,67 -40,67 -72,55 Z" fill={palette.primary} />
      <g stroke={shade(palette.primary, 0.3)} strokeWidth={2.4} opacity={0.75}>
        <path d="M -30,-20 L -42,60" />
        <path d="M -12,-16 L -16,64" />
        <path d="M 12,-16 L 16,64" />
        <path d="M 30,-20 L 42,60" />
      </g>
      <path d="M -50,-26 C -34,-18 34,-18 50,-26 L 51,-12 C 34,-4 -34,-4 -51,-12 Z" fill={palette.secondary} />
      <path d="M -72,54 C -40,66 40,66 72,54 L 73,62 C 40,74 -40,74 -73,62 Z" fill={palette.accent} opacity={0.9} />
    </g>
  );
}

function SkirtLeg({ palette }: AssetProps) {
  return <TrouserLeg fill={palette.secondary} length={26} taper={6} />;
}

function LeggingsHip({ palette }: AssetProps) {
  return <HipPiece fill={palette.primary} />;
}

function LeggingsLeg({ palette }: AssetProps) {
  return (
    <g>
      <TrouserLeg fill={palette.primary} length={88} taper={7} />
      <path d="M -9,4 L -6,80" stroke={palette.accent} strokeWidth={3} opacity={0.85} strokeLinecap="round" />
      <path d="M 9,4 L 6,80" stroke={palette.secondary} strokeWidth={3} opacity={0.85} strokeLinecap="round" />
    </g>
  );
}

/* ================================= SHOES ================================= */

/**
 * Feet space: 100 × 40, origin on the floor between the ankles. Shoes are drawn
 * front-on and symmetric, so they need no per-side mirroring.
 */
function Sole({ color, h = 9 }: { color: string; h?: number }) {
  return <rect x={-27} y={-h} width={54} height={h + 2} rx={4.5} fill={color} />;
}

function Sneaker({ palette }: AssetProps) {
  return (
    <g>
      <path d="M -25,-30 L 25,-30 C 28,-30 30,-24 30,-14 L 30,-8 L -30,-8 L -30,-14 C -30,-24 -28,-30 -25,-30 Z" fill={shade(palette.primary, 0.34)} />
      <path d="M -24,-31 L 24,-31 C 27,-31 29,-25 29,-15 L 29,-10 L -29,-10 L -29,-15 C -29,-25 -27,-31 -24,-31 Z" fill={palette.primary} />
      <path d="M -22,-30 L -4,-30 L -10,-12 L -26,-12 Z" fill={palette.secondary} opacity={0.9} />
      <g stroke={palette.accent} strokeWidth={2.6} strokeLinecap="round">
        <path d="M -12,-26 L 12,-26" />
        <path d="M -11,-20 L 11,-20" />
        <path d="M -10,-14 L 10,-14" />
      </g>
      <Sole color={palette.secondary} h={10} />
      <rect x={-27} y={-4} width={54} height={4} rx={2} fill={shade(palette.secondary, 0.4)} />
    </g>
  );
}

function WorkBoot({ palette }: AssetProps) {
  return (
    <g>
      <path d="M -26,-40 L 26,-40 L 29,-12 L -29,-12 Z" fill={shade(palette.primary, 0.36)} />
      <path d="M -25,-41 L 25,-41 L 28,-14 L -28,-14 Z" fill={palette.primary} />
      <path d="M -25,-41 L 25,-41 L 25.6,-35 L -25.6,-35 Z" fill={palette.secondary} />
      <g stroke={palette.accent} strokeWidth={2.4} strokeLinecap="round">
        <path d="M -13,-34 L 13,-34" />
        <path d="M -13,-27 L 13,-27" />
        <path d="M -13,-20 L 13,-20" />
      </g>
      <path d="M -29,-16 L 29,-16 L 30,-6 L -30,-6 Z" fill={palette.secondary} />
      <Sole color={shade(palette.secondary, 0.45)} h={7} />
      <g fill={palette.accent} opacity={0.75}>
        <rect x={-24} y={-5} width={5} height={4} />
        <rect x={-10} y={-5} width={5} height={4} />
        <rect x={5} y={-5} width={5} height={4} />
        <rect x={19} y={-5} width={5} height={4} />
      </g>
    </g>
  );
}

function HiTop({ palette }: AssetProps) {
  return (
    <g>
      <path d="M -24,-46 L 24,-46 C 27,-46 29,-30 29,-14 L -29,-14 C -29,-30 -27,-46 -24,-46 Z" fill={shade(palette.primary, 0.34)} />
      <path d="M -23,-47 L 23,-47 C 26,-47 28,-31 28,-16 L -28,-16 C -28,-31 -26,-47 -23,-47 Z" fill={palette.primary} />
      <circle cx={0} cy={-32} r={8.5} fill={palette.accent} />
      <circle cx={0} cy={-32} r={8.5} fill="none" stroke={shade(palette.accent, 0.5)} strokeWidth={1.8} />
      <path d="M -4,-35 L 4,-35 M 0,-35 L 0,-28" stroke={shade(palette.accent, 0.7)} strokeWidth={2} strokeLinecap="round" />
      <g stroke={palette.secondary} strokeWidth={2.4} strokeLinecap="round">
        <path d="M -12,-44 L 12,-44" />
        <path d="M -13,-22 L 13,-22" />
      </g>
      <Sole color={palette.secondary} h={11} />
    </g>
  );
}

function Flat({ palette }: AssetProps) {
  return (
    <g>
      <path d="M -26,-22 C -18,-27 18,-27 26,-22 L 28,-8 L -28,-8 Z" fill={shade(palette.primary, 0.34)} />
      <path d="M -25,-23 C -17,-28 17,-28 25,-23 L 27,-10 L -27,-10 Z" fill={palette.primary} />
      <path d="M -14,-24 C -6,-27 6,-27 14,-24 C 6,-19 -6,-19 -14,-24 Z" fill={palette.secondary} />
      <circle cx={0} cy={-22} r={4} fill={palette.accent} />
      <Sole color={palette.secondary} h={7} />
    </g>
  );
}

function Cleat({ palette }: AssetProps) {
  return (
    <g>
      <path d="M -25,-28 C -16,-33 16,-33 25,-28 L 29,-11 L -29,-11 Z" fill={shade(palette.primary, 0.36)} />
      <path d="M -24,-29 C -15,-34 15,-34 24,-29 L 28,-13 L -28,-13 Z" fill={palette.primary} />
      <path d="M -20,-27 C -10,-31 10,-31 20,-27 L 22,-20 C 10,-24 -10,-24 -22,-20 Z" fill={palette.accent} />
      <g stroke={palette.secondary} strokeWidth={2.4} strokeLinecap="round">
        <path d="M -10,-20 L 10,-20" />
        <path d="M -9,-15 L 9,-15" />
      </g>
      <Sole color={palette.secondary} h={6} />
      <g fill={shade(palette.secondary, 0.5)}>
        <rect x={-23} y={-1} width={6} height={5} rx={1.5} />
        <rect x={-8} y={-1} width={6} height={5} rx={1.5} />
        <rect x={7} y={-1} width={6} height={5} rx={1.5} />
        <rect x={18} y={-1} width={5} height={5} rx={1.5} />
      </g>
    </g>
  );
}

/* ================================ CATALOG ================================ */

interface TopSpec {
  id: string;
  label: string;
  Asset: (p: AssetProps) => React.ReactElement;
  LimbAsset: (p: AssetProps) => React.ReactElement;
  blurb: string;
  colors: [string, string, string];
}

const TOP_SPECS: TopSpec[] = [
  {
    id: 'hivis',
    label: 'Hi-Vis Vest',
    Asset: HiVisVest,
    LimbAsset: VestSleeve,
    blurb: 'Seen from every corner of the lab.',
    colors: ['#f59e0b', '#1e293b', '#e2e8f0'],
  },
  {
    id: 'tee',
    label: 'Maker Tee',
    Asset: MakerTee,
    LimbAsset: TeeSleeve,
    blurb: 'Soft cotton, hard ideas.',
    colors: ['#2563eb', '#1d4ed8', '#f59e0b'],
  },
  {
    id: 'hoodie',
    label: 'Shop Hoodie',
    Asset: Hoodie,
    LimbAsset: LongSleeve,
    blurb: 'Pocket holds exactly one prototype.',
    colors: ['#a855f7', '#f59e0b', '#facc15'],
  },
  {
    id: 'overalls',
    label: 'Bib Overalls',
    Asset: BibOveralls,
    LimbAsset: TeeSleeve,
    blurb: 'Denim armour for messy builds.',
    colors: ['#3b82f6', '#fb923c', '#facc15'],
  },
  {
    id: 'labcoat',
    label: 'Lab Coat',
    Asset: LabCoat,
    LimbAsset: CoatSleeve,
    blurb: 'Officially in charge of experiments.',
    colors: ['#e2e8f0', '#2563eb', '#fb923c'],
  },
  {
    id: 'flannel',
    label: 'Shop Flannel',
    Asset: Flannel,
    LimbAsset: FlannelSleeve,
    blurb: 'Woodshop approved.',
    colors: ['#dc2626', '#1e293b', '#fbbf24'],
  },
  {
    id: 'jersey',
    label: 'Team Jersey',
    Asset: TeamJersey,
    LimbAsset: TeeSleeve,
    blurb: 'Number one at showing up.',
    colors: ['#0ea5e9', '#f8fafc', '#f59e0b'],
  },
  {
    id: 'boiler',
    label: 'Boiler Suit',
    Asset: BoilerSuit,
    LimbAsset: CoatSleeve,
    blurb: 'Full-body focus mode.',
    colors: ['#fb923c', '#1e293b', '#e2e8f0'],
  },
];

export const TOPS: CatalogItem[] = TOP_SPECS.map((s) => ({
  id: s.id,
  label: s.label,
  slot: 'top',
  anchor: 'torso',
  Asset: s.Asset,
  LimbAsset: s.LimbAsset,
  limbTarget: 'arms',
  channels: ['primary', 'secondary', 'accent'],
  defaults: { primary: s.colors[0], secondary: s.colors[1], accent: s.colors[2] },
  blurb: s.blurb,
}));

interface BottomSpec {
  id: string;
  label: string;
  Asset: (p: AssetProps) => React.ReactElement;
  LimbAsset: (p: AssetProps) => React.ReactElement;
  blurb: string;
  colors: [string, string, string];
}

const BOTTOM_SPECS: BottomSpec[] = [
  {
    id: 'cargo',
    label: 'Cargo Pants',
    Asset: CargoHip,
    LimbAsset: CargoLeg,
    blurb: 'Pockets for every spare bolt.',
    colors: ['#3f6212', '#1e293b', '#facc15'],
  },
  {
    id: 'jeans',
    label: 'Denim Jeans',
    Asset: JeansHip,
    LimbAsset: JeansLeg,
    blurb: 'Broken in the good way.',
    colors: ['#1d4ed8', '#78350f', '#fbbf24'],
  },
  {
    id: 'joggers',
    label: 'Joggers',
    Asset: JoggersHip,
    LimbAsset: JoggersLeg,
    blurb: 'Built for the sprint to the bus.',
    colors: ['#334155', '#f59e0b', '#a855f7'],
  },
  {
    id: 'shorts',
    label: 'Utility Shorts',
    Asset: ShortsHip,
    LimbAsset: ShortsLeg,
    blurb: 'Recess-ready ventilation.',
    colors: ['#0d9488', '#1e293b', '#fbbf24'],
  },
  {
    id: 'skirt',
    label: 'Pleated Skirt',
    Asset: SkirtHip,
    LimbAsset: SkirtLeg,
    blurb: 'Pleats folded to spec.',
    colors: ['#a855f7', '#1e293b', '#f59e0b'],
  },
  {
    id: 'leggings',
    label: 'Speed Leggings',
    Asset: LeggingsHip,
    LimbAsset: LeggingsLeg,
    blurb: 'Racing stripes optional. Always chosen.',
    colors: ['#1e293b', '#f43f5e', '#22d3ee'],
  },
];

export const BOTTOMS: CatalogItem[] = BOTTOM_SPECS.map((s) => ({
  id: s.id,
  label: s.label,
  slot: 'bottom',
  anchor: 'hips',
  Asset: s.Asset,
  LimbAsset: s.LimbAsset,
  limbTarget: 'legs',
  channels: ['primary', 'secondary', 'accent'],
  defaults: { primary: s.colors[0], secondary: s.colors[1], accent: s.colors[2] },
  blurb: s.blurb,
}));

interface ShoeSpec {
  id: string;
  label: string;
  Asset: (p: AssetProps) => React.ReactElement;
  blurb: string;
  colors: [string, string, string];
}

const SHOE_SPECS: ShoeSpec[] = [
  {
    id: 'boots',
    label: 'Work Boots',
    Asset: WorkBoot,
    blurb: 'Steel toe. Zero nonsense.',
    colors: ['#b45309', '#78350f', '#fbbf24'],
  },
  {
    id: 'sneakers',
    label: 'Sneakers',
    Asset: Sneaker,
    blurb: 'Squeak-tested on gym floors.',
    colors: ['#f8fafc', '#dc2626', '#1e293b'],
  },
  {
    id: 'hitops',
    label: 'Hi-Tops',
    Asset: HiTop,
    blurb: 'Ankle support for big landings.',
    colors: ['#a855f7', '#f8fafc', '#facc15'],
  },
  {
    id: 'cleats',
    label: 'Field Cleats',
    Asset: Cleat,
    blurb: 'Grip for the muddy prototype run.',
    colors: ['#22c55e', '#0f172a', '#f8fafc'],
  },
  {
    id: 'flats',
    label: 'Classic Flats',
    Asset: Flat,
    blurb: 'Quiet in the library, loud in ideas.',
    colors: ['#e11d48', '#7f1d1d', '#fbbf24'],
  },
];

export const SHOES: CatalogItem[] = SHOE_SPECS.map((s) => ({
  id: s.id,
  label: s.label,
  slot: 'shoes',
  anchor: 'feet',
  Asset: s.Asset,
  channels: ['primary', 'secondary', 'accent'],
  defaults: { primary: s.colors[0], secondary: s.colors[1], accent: s.colors[2] },
  blurb: s.blurb,
}));

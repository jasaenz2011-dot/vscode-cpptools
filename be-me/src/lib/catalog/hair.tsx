/**
 * Hairstyles. Authored in head space; long styles supply a `BackAsset` that the
 * compositor draws behind the whole body so hair falls *behind* the shoulders.
 *
 * Every style paints three tones derived from two user channels:
 *   primary → base, shade(primary) → depth, accent → highlight / dye streak.
 */
import { shade, tint } from '../color';
import type { AssetProps, CatalogItem } from '../types';

const HAIR_BROWN = '#3b2a20';
const HAIR_SHINE = '#6b4a33';

interface Tones {
  base: string;
  deep: string;
  shine: string;
}

function tones({ palette }: AssetProps): Tones {
  return {
    base: palette.primary,
    deep: shade(palette.primary, 0.42),
    shine: palette.accent,
  };
}

/* ------------------------------- silhouettes ----------------------------- */

/** Close-fitting cap with a soft fringe. The base of nearly every style. */
const CAP =
  'M -42.6,-3 C -43.8,-33 -24,-53 0,-53 C 24,-53 43.8,-33 42.6,-3 C 35,-16 21,-27 0,-27 C -21,-27 -35,-16 -42.6,-3 Z';

/** Cap with a centre part. */
const CAP_PART =
  'M -42.6,-3 C -43.8,-33 -24,-53 0,-53 C 24,-53 43.8,-33 42.6,-3 C 37,-18 22,-29 3,-30 L 0,-19 L -3,-30 C -22,-29 -37,-18 -42.6,-3 Z';

/** Cap with a heavy side sweep across the brow. */
const CAP_SWOOP =
  'M -42.6,-4 C -43.8,-34 -24,-53 0,-53 C 24,-53 43.8,-34 42.6,-4 C 40,-14 34,-22 26,-25 C 8,-14 -14,-14 -30,-24 C -36,-19 -40,-11 -42.6,-4 Z';

/**
 * Coil-cloud puff ring, precomputed once at module load.
 *
 * Rounded to two decimals on purpose: `Math.cos`/`Math.sin` are allowed to
 * differ in the last bits between JS engines, and an unrounded value renders as
 * a different string on the Node server than in the browser — which React
 * reports as a hydration mismatch.
 */
const COILS = Array.from({ length: 16 }, (_, i) => {
  const a = Math.PI * (1 + i / 15);
  return {
    x: Math.round(Math.cos(a) * 4500) / 100,
    y: Math.round((-13 + Math.sin(a) * 41) * 100) / 100,
  };
});

/* --------------------------------- styles -------------------------------- */

function Buzz(props: AssetProps) {
  const { base, deep, shine } = tones(props);
  return (
    <g>
      <path d={CAP} fill={deep} />
      <path d={CAP} fill={base} transform="translate(0 1.5) scale(0.985)" />
      <path
        d="M -30,-34 C -18,-45 12,-47 27,-36"
        fill="none"
        stroke={shine}
        strokeWidth={5}
        strokeLinecap="round"
        opacity={0.55}
      />
    </g>
  );
}

/**
 * Cloud core. Deliberately a cranium-hugging path rather than an ellipse: an
 * ellipse big enough to fill the coil ring also reaches down over the eyes, and
 * hair draws after the expression.
 */
const COIL_CORE =
  'M -46,-12 C -47,-46 -25,-60 0,-60 C 25,-60 47,-46 46,-12 C 34,-24 20,-30 0,-30 C -20,-30 -34,-24 -46,-12 Z';

function CoilCrown(props: AssetProps) {
  const { base, deep, shine } = tones(props);
  return (
    <g>
      <g fill={deep}>
        {COILS.map((c, i) => (
          <circle key={i} cx={c.x} cy={c.y} r={15.5} />
        ))}
        <path d={COIL_CORE} />
      </g>
      <g fill={base}>
        {COILS.map((c, i) => (
          <circle key={i} cx={c.x} cy={c.y - 2.6} r={13.6} />
        ))}
        <path d={COIL_CORE} transform="translate(0 -2.6)" />
      </g>
      <g fill={shine} opacity={0.6}>
        <circle cx={-24} cy={-44} r={8} />
        <circle cx={-8} cy={-50} r={7} />
        <circle cx={-36} cy={-33} r={6} />
      </g>
      {/* Hairline shadow. Kept above y = -20 so it never dims the eyebrows,
          which the expression draws underneath this layer. */}
      <path
        d="M -44,-16 C -35,-27 -18,-33 0,-33 C 18,-33 35,-27 44,-16 C 30,-24 -30,-24 -44,-16 Z"
        fill={deep}
        opacity={0.45}
      />
    </g>
  );
}

function TwinBraids(props: AssetProps) {
  const { base, deep, shine } = tones(props);
  const braid = (dir: 1 | -1) => (
    <g fill={base} stroke={deep} strokeWidth={1.6}>
      {[0, 1, 2, 3, 4].map((i) => (
        <ellipse
          key={i}
          cx={dir * (37 + i * 1.9)}
          cy={2 + i * 17}
          rx={10 - i * 0.5}
          ry={10.5}
          transform={`rotate(${dir * i * 2.5} ${dir * (37 + i * 1.9)} ${2 + i * 17})`}
        />
      ))}
      <circle cx={dir * 47} cy={92} r={6.4} fill={shine} stroke="none" />
    </g>
  );
  return (
    <g>
      <path d={CAP_PART} fill={deep} />
      <path d={CAP_PART} fill={base} transform="translate(0 1.6) scale(0.985)" />
      {braid(-1)}
      {braid(1)}
    </g>
  );
}

function SpacePuffs(props: AssetProps) {
  const { base, deep, shine } = tones(props);
  return (
    <g>
      <path d={CAP_PART} fill={deep} />
      <path d={CAP_PART} fill={base} transform="translate(0 1.6) scale(0.985)" />
      <g>
        <circle cx={-40} cy={-40} r={20} fill={deep} />
        <circle cx={40} cy={-40} r={20} fill={deep} />
        <circle cx={-40} cy={-42} r={17.5} fill={base} />
        <circle cx={40} cy={-42} r={17.5} fill={base} />
        <circle cx={-45} cy={-49} r={6} fill={shine} opacity={0.7} />
        <circle cx={35} cy={-49} r={6} fill={shine} opacity={0.7} />
      </g>
    </g>
  );
}

function Swoop(props: AssetProps) {
  const { base, deep, shine } = tones(props);
  return (
    <g>
      <path d={CAP_SWOOP} fill={deep} />
      <path d={CAP_SWOOP} fill={base} transform="translate(0 1.4) scale(0.99)" />
      <path
        d="M -34,-30 C -20,-44 16,-48 34,-30 C 22,-38 -4,-40 -20,-26 C -26,-21 -31,-24 -34,-30 Z"
        fill={shine}
        opacity={0.72}
      />
      <path
        d="M 26,-26 C 38,-20 44,-8 43,4 C 40,-6 34,-16 24,-21 Z"
        fill={deep}
      />
    </g>
  );
}

function LongFlowBack(props: AssetProps) {
  const { base, deep, shine } = tones(props);
  return (
    <g>
      <path
        d="M -44,-30 C -60,4 -62,52 -54,104 C -30,116 30,116 54,104 C 62,52 60,4 44,-30 Z"
        fill={deep}
      />
      <path
        d="M -38,-24 C -52,6 -55,52 -47,98 C -26,108 26,108 47,98 C 55,52 52,6 38,-24 Z"
        fill={base}
      />
      <path
        d="M -22,-10 C -30,26 -30,66 -24,98 C -18,99 -14,99 -10,98 C -16,64 -14,24 -8,-8 Z"
        fill={shine}
        opacity={0.5}
      />
    </g>
  );
}

function LongFlow(props: AssetProps) {
  const { base, deep } = tones(props);
  return (
    <g>
      <path d={CAP_PART} fill={deep} />
      <path d={CAP_PART} fill={base} transform="translate(0 1.6) scale(0.985)" />
      <path d="M -43,-8 C -47,12 -47,30 -43,46 C -37,30 -36,10 -38,-6 Z" fill={base} />
      <path d="M 43,-8 C 47,12 47,30 43,46 C 37,30 36,10 38,-6 Z" fill={base} />
    </g>
  );
}

function HighPonyBack(props: AssetProps) {
  const { base, deep, shine } = tones(props);
  return (
    <g>
      <path
        d="M 4,-56 C 34,-70 62,-52 66,-18 C 70,16 58,44 40,58 C 46,36 50,10 44,-10 C 38,-30 22,-42 4,-44 Z"
        fill={deep}
      />
      <path
        d="M 6,-52 C 32,-64 56,-48 59,-18 C 62,12 52,38 38,50 C 43,30 45,8 40,-8 C 34,-26 22,-38 6,-41 Z"
        fill={base}
      />
      <path d="M 20,-44 C 40,-34 48,-14 46,8 C 42,-12 34,-30 18,-38 Z" fill={shine} opacity={0.55} />
    </g>
  );
}

function HighPony(props: AssetProps) {
  const { base, deep, shine } = tones(props);
  return (
    <g>
      <path d={CAP} fill={deep} />
      <path d={CAP} fill={base} transform="translate(0 1.5) scale(0.985)" />
      <path
        d="M -32,-38 C -16,-48 14,-48 30,-38 C 14,-44 -14,-44 -32,-38 Z"
        fill={shine}
        opacity={0.6}
      />
      <ellipse cx={22} cy={-46} rx={12} ry={7} fill={deep} transform="rotate(-24 22 -46)" />
    </g>
  );
}

function LocsBack(props: AssetProps) {
  const { base, deep, shine } = tones(props);
  return (
    <g>
      {[-46, -31, -16, 0, 16, 31, 46].map((x, i) => (
        <g key={x}>
          <rect
            x={x - 7.5}
            y={-40}
            width={15}
            height={i % 2 === 0 ? 128 : 116}
            rx={7.5}
            fill={deep}
            transform={`rotate(${x * 0.06} ${x} -20)`}
          />
          <rect
            x={x - 5.6}
            y={-40}
            width={11.2}
            height={(i % 2 === 0 ? 128 : 116) - 6}
            rx={5.6}
            fill={i === 3 ? shine : base}
            transform={`rotate(${x * 0.06} ${x} -20)`}
          />
        </g>
      ))}
    </g>
  );
}

function Locs(props: AssetProps) {
  const { base, deep } = tones(props);
  return (
    <g>
      <path d={CAP} fill={deep} />
      <path d={CAP} fill={base} transform="translate(0 1.5) scale(0.985)" />
      {[-42, -28, 28, 42].map((x) => (
        <rect key={x} x={x - 5.5} y={-30} width={11} height={44} rx={5.5} fill={base} stroke={deep} strokeWidth={1.4} />
      ))}
    </g>
  );
}

function SharpBob(props: AssetProps) {
  const { base, deep, shine } = tones(props);
  return (
    <g>
      <path
        d="M -47,-2 C -50,-34 -26,-54 0,-54 C 26,-54 50,-34 47,-2 L 49,44 L 30,44 C 34,22 33,4 30,-8 C 16,-20 -16,-20 -30,-8 C -33,4 -34,22 -30,44 L -49,44 Z"
        fill={deep}
      />
      <path
        d="M -45,-2 C -48,-33 -25,-52 0,-52 C 25,-52 48,-33 45,-2 L 46.5,41 L 32,41 C 35,20 34,3 31,-9 C 16,-22 -16,-22 -31,-9 C -34,3 -35,20 -32,41 L -46.5,41 Z"
        fill={base}
      />
      <path d="M -30,-36 C -14,-46 12,-46 28,-34 C 10,-40 -12,-40 -30,-36 Z" fill={shine} opacity={0.65} />
    </g>
  );
}

function FadePart(props: AssetProps) {
  const { base, deep, shine } = tones(props);
  return (
    <g>
      <path
        d="M -42.6,-6 C -43.8,-34 -24,-53 0,-53 C 24,-53 43.8,-34 42.6,-6 C 38,-16 30,-24 18,-27 C 4,-30 -18,-28 -32,-20 C -37,-16 -40,-11 -42.6,-6 Z"
        fill={deep}
      />
      <path
        d="M -40,-8 C -41,-33 -23,-51 0,-51 C 23,-51 41,-33 40,-8 C 36,-17 29,-23 17,-25.6 C 4,-28.4 -17,-26.6 -30,-19 C -35,-15.6 -38,-12 -40,-8 Z"
        fill={base}
      />
      <path d="M -20,-27 C -6,-32 14,-31 26,-25" fill="none" stroke={shine} strokeWidth={4} strokeLinecap="round" opacity={0.8} />
      <path d="M -34,-19 L -22,-25" fill="none" stroke={shine} strokeWidth={3} strokeLinecap="round" opacity={0.5} />
    </g>
  );
}

/* -------------------------------- catalog -------------------------------- */

interface HairSpec {
  id: string;
  label: string;
  Asset: (props: AssetProps) => React.ReactElement;
  BackAsset?: (props: AssetProps) => React.ReactElement;
  blurb: string;
  primary?: string;
  accent?: string;
}

const SPECS: HairSpec[] = [
  { id: 'buzz', label: 'Buzz Cut', Asset: Buzz, blurb: 'Low maintenance, high output.' },
  { id: 'coils', label: 'Coil Crown', Asset: CoilCrown, blurb: 'Big hair, bigger ideas.' },
  { id: 'fade', label: 'Fade + Part', Asset: FadePart, blurb: 'Crisp lines, sharp thinking.' },
  { id: 'swoop', label: 'The Swoop', Asset: Swoop, blurb: 'Wind-tunnel tested.' },
  { id: 'bob', label: 'Sharp Bob', Asset: SharpBob, blurb: 'Precision-cut to spec.' },
  { id: 'puffs', label: 'Space Puffs', Asset: SpacePuffs, blurb: 'Two small planets, orbiting.' },
  {
    id: 'braids',
    label: 'Twin Braids',
    Asset: TwinBraids,
    blurb: 'Braided like a load-bearing cable.',
    accent: '#f59e0b',
  },
  { id: 'pony', label: 'High Pony', Asset: HighPony, BackAsset: HighPonyBack, blurb: 'Built for velocity.' },
  { id: 'locs', label: 'Locs', Asset: Locs, BackAsset: LocsBack, blurb: 'Every strand engineered.' },
  { id: 'flow', label: 'Long Flow', Asset: LongFlow, BackAsset: LongFlowBack, blurb: 'Aerodynamic at recess speed.' },
];

export const HAIRSTYLES: CatalogItem[] = SPECS.map((s) => ({
  id: s.id,
  label: s.label,
  slot: 'hair',
  anchor: 'head',
  Asset: s.Asset,
  ...(s.BackAsset ? { BackAsset: s.BackAsset } : {}),
  channels: ['primary', 'accent'],
  defaults: {
    primary: s.primary ?? HAIR_BROWN,
    accent: s.accent ?? (s.primary ? tint(s.primary, 0.3) : HAIR_SHINE),
  },
  blurb: s.blurb,
}));

/** Curated hair swatches offered before the free hex picker. */
export const HAIR_SWATCHES = [
  '#0f0d0c',
  '#3b2a20',
  '#6b4a33',
  '#a16207',
  '#d9a441',
  '#f4d7a1',
  '#b91c1c',
  '#ea580c',
  '#7c3aed',
  '#0ea5e9',
  '#10b981',
  '#e879f9',
  '#94a3b8',
  '#f8fafc',
];

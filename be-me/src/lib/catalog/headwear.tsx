/**
 * Hard hats and headgear. Head space; drawn on top of hair.
 */
import { shade, tint } from '../color';
import type { AssetProps, CatalogItem } from '../types';

const HAZARD = '#f59e0b';
const STEEL = '#334155';

/** Shared hard-hat shell so every site helmet reads as the same product line. */
function HatShell({ base, rim }: { base: string; rim: string }) {
  const deep = shade(base, 0.34);
  const lift = tint(base, 0.26);
  return (
    <g>
      <ellipse cx={0} cy={-28} rx={50} ry={10} fill={deep} />
      <ellipse cx={0} cy={-30.5} rx={50} ry={10} fill={rim} />
      <path d="M -38,-29 C -39,-57 -19,-70 0,-70 C 19,-70 39,-57 38,-29 Z" fill={deep} />
      <path d="M -35.5,-30 C -36,-55 -17.5,-67.5 0,-67.5 C 17.5,-67.5 36,-55 35.5,-30 Z" fill={base} />
      <path d="M -5.5,-67 C -3,-67.6 3,-67.6 5.5,-67 L 6.5,-30 L -6.5,-30 Z" fill={lift} opacity={0.75} />
      <path d="M -25,-58 C -20.5,-62 -17,-64 -12.5,-65 L -16,-30 L -23,-30 Z" fill={lift} opacity={0.4} />
      <path d="M 25,-58 C 20.5,-62 17,-64 12.5,-65 L 16,-30 L 23,-30 Z" fill={deep} opacity={0.35} />
      <path d="M -13,-31.5 L 13,-31.5 L 11,-24 L -11,-24 Z" fill={rim} />
      <path d="M -13,-31.5 L 13,-31.5 L 12,-27.5 L -12,-27.5 Z" fill={deep} opacity={0.4} />
    </g>
  );
}

function HardHat({ palette }: AssetProps) {
  return (
    <g>
      <HatShell base={palette.primary} rim={palette.secondary} />
      <g transform="translate(0 -46)">
        <rect x={-15} y={-7} width={30} height={14} rx={3} fill={palette.accent} />
        <path d="M -9,-3 h 18 M -9,2 h 12" stroke={shade(palette.accent, 0.6)} strokeWidth={2.4} strokeLinecap="round" />
      </g>
    </g>
  );
}

function LampHat({ palette }: AssetProps) {
  const deep = shade(palette.secondary, 0.35);
  return (
    <g>
      <HatShell base={palette.primary} rim={palette.secondary} />
      <g transform="translate(0 -42)">
        <rect x={-13} y={-9} width={26} height={17} rx={4} fill={deep} />
        <rect x={-10} y={-6.5} width={20} height={12} rx={3} fill={palette.accent} />
        <circle cx={0} cy={-0.5} r={4.6} fill={tint(palette.accent, 0.7)} />
        <path d="M -22,-2 h 9 M 13,-2 h 9" stroke={deep} strokeWidth={4} strokeLinecap="round" />
      </g>
    </g>
  );
}

function VisorHat({ palette }: AssetProps) {
  return (
    <g>
      <HatShell base={palette.primary} rim={palette.secondary} />
      <g transform="translate(0 -54) rotate(-6)">
        <path d="M -34,-6 L 34,-6 L 30,20 L -30,20 Z" fill={shade(palette.secondary, 0.3)} />
        <path d="M -30,-2 L 30,-2 L 27,15 L -27,15 Z" fill={palette.accent} opacity={0.85} />
        <path d="M -24,0 L -6,0 L -10,12 L -22,12 Z" fill="#ffffff" opacity={0.22} />
      </g>
    </g>
  );
}

function Beanie({ palette }: AssetProps) {
  const deep = shade(palette.primary, 0.34);
  return (
    <g>
      <path d="M -43,-14 C -44,-50 -22,-64 0,-64 C 22,-64 44,-50 43,-14 Z" fill={deep} />
      <path d="M -40,-16 C -41,-48 -20,-61 0,-61 C 20,-61 41,-48 40,-16 Z" fill={palette.primary} />
      <g stroke={deep} strokeWidth={2} opacity={0.55}>
        <path d="M -20,-58 L -22,-16" />
        <path d="M 0,-61 L 0,-16" />
        <path d="M 20,-58 L 22,-16" />
      </g>
      <rect x={-45} y={-22} width={90} height={17} rx={8} fill={palette.secondary} />
      <rect x={-45} y={-22} width={90} height={6} rx={3} fill={tint(palette.secondary, 0.25)} opacity={0.6} />
      <circle cx={0} cy={-66} r={10} fill={palette.accent} />
      <circle cx={-3} cy={-69} r={4} fill={tint(palette.accent, 0.45)} opacity={0.8} />
    </g>
  );
}

function BallCap({ palette }: AssetProps) {
  const deep = shade(palette.primary, 0.32);
  return (
    <g>
      <path d="M -41,-18 C -42,-52 -21,-64 0,-64 C 21,-64 42,-52 41,-18 Z" fill={deep} />
      <path d="M -38,-19 C -39,-50 -19,-61 0,-61 C 19,-61 39,-50 38,-19 Z" fill={palette.primary} />
      <path d="M 0,-61 L 0,-19" stroke={deep} strokeWidth={2.2} opacity={0.5} />
      <path d="M -20,-56 C -12,-60 12,-60 20,-56" fill="none" stroke={deep} strokeWidth={2} opacity={0.4} />
      <path d="M -36,-20 C -20,-31 20,-31 36,-20 L 36,-14 C 20,-24 -20,-24 -36,-14 Z" fill={deep} />
      <path d="M 30,-20 C 46,-19 58,-11 59,-2 C 44,-9 12,-12 -6,-12 L -6,-21 Z" fill={palette.secondary} />
      <circle cx={0} cy={-58} r={4} fill={palette.accent} />
      <path d="M -13,-44 h 26 M -13,-38 h 18" stroke={palette.accent} strokeWidth={3.4} strokeLinecap="round" />
    </g>
  );
}

function Bandana({ palette }: AssetProps) {
  const deep = shade(palette.primary, 0.34);
  return (
    <g>
      <path d="M -42,-12 C -44,-40 -22,-54 0,-54 C 22,-54 44,-40 42,-12 C 22,-24 -22,-24 -42,-12 Z" fill={deep} />
      <path d="M -40,-14 C -42,-38 -21,-51 0,-51 C 21,-51 42,-38 40,-14 C 21,-25 -21,-25 -40,-14 Z" fill={palette.primary} />
      <g fill={palette.accent} opacity={0.85}>
        <circle cx={-24} cy={-32} r={3.4} />
        <circle cx={-6} cy={-40} r={3.4} />
        <circle cx={14} cy={-34} r={3.4} />
        <circle cx={28} cy={-24} r={3.4} />
        <circle cx={-32} cy={-21} r={3} />
      </g>
      <path d="M -40,-15 C -52,-8 -58,4 -55,16 L -44,4 Z" fill={palette.secondary} />
      <path d="M -44,-13 C -54,-14 -60,-8 -60,0 L -46,-4 Z" fill={deep} />
    </g>
  );
}

function MakerCrown({ palette }: AssetProps) {
  const deep = shade(palette.primary, 0.36);
  return (
    <g>
      <path
        d="M -40,-24 L -40,-52 L -26,-40 L -13,-58 L 0,-42 L 13,-58 L 26,-40 L 40,-52 L 40,-24 Z"
        fill={deep}
      />
      <path
        d="M -37,-26 L -37,-49 L -25,-38.5 L -13,-55 L 0,-40 L 13,-55 L 25,-38.5 L 37,-49 L 37,-26 Z"
        fill={palette.primary}
      />
      <rect x={-38} y={-30} width={76} height={7} rx={3.5} fill={palette.secondary} />
      <g fill={palette.accent}>
        <circle cx={-20} cy={-38} r={4.2} />
        <circle cx={0} cy={-34} r={4.6} />
        <circle cx={20} cy={-38} r={4.2} />
      </g>
    </g>
  );
}

function GogglesUp({ palette }: AssetProps) {
  const deep = shade(palette.secondary, 0.4);
  return (
    <g transform="translate(0 -36)">
      <rect x={-46} y={-6} width={92} height={11} rx={5.5} fill={deep} />
      <g>
        <rect x={-34} y={-13} width={68} height={26} rx={12} fill={palette.primary} />
        <rect x={-30} y={-9.5} width={60} height={19} rx={9} fill={palette.accent} opacity={0.9} />
        <path d="M -26,-6 L -8,-6 L -18,7 L -28,7 Z" fill="#ffffff" opacity={0.3} />
        <rect x={-2.5} y={-13} width={5} height={26} rx={2.5} fill={deep} />
      </g>
    </g>
  );
}

interface HeadSpec {
  id: string;
  label: string;
  Asset: (props: AssetProps) => React.ReactElement;
  blurb: string;
  primary: string;
  secondary: string;
  accent: string;
}

const SPECS: HeadSpec[] = [
  {
    id: 'hardhat',
    label: 'Site Hard Hat',
    Asset: HardHat,
    blurb: 'Standard issue. Non-negotiable.',
    primary: HAZARD,
    secondary: '#b45309',
    accent: '#1e293b',
  },
  {
    id: 'lamphat',
    label: 'Lamp Helmet',
    Asset: LampHat,
    blurb: 'For building after dark.',
    primary: '#fb923c',
    secondary: STEEL,
    accent: '#fde68a',
  },
  {
    id: 'visorhat',
    label: 'Weld Visor',
    Asset: VisorHat,
    blurb: 'Flip down. Spark up.',
    primary: '#2563eb',
    secondary: '#1e293b',
    accent: '#38bdf8',
  },
  {
    id: 'goggles-up',
    label: 'Goggles Up',
    Asset: GogglesUp,
    blurb: 'Parked on the forehead, ready.',
    primary: '#a855f7',
    secondary: '#1e293b',
    accent: '#67e8f9',
  },
  {
    id: 'beanie',
    label: 'Knit Beanie',
    Asset: Beanie,
    blurb: 'Workshop mornings are cold.',
    primary: '#2563eb',
    secondary: '#1d4ed8',
    accent: '#f59e0b',
  },
  {
    id: 'ballcap',
    label: 'Ball Cap',
    Asset: BallCap,
    blurb: 'Team colours, always on.',
    primary: '#1e293b',
    secondary: '#0f172a',
    accent: '#f59e0b',
  },
  {
    id: 'bandana',
    label: 'Bandana',
    Asset: Bandana,
    blurb: 'Keeps sawdust out of your eyes.',
    primary: '#dc2626',
    secondary: '#b91c1c',
    accent: '#fef3c7',
  },
  {
    id: 'crown',
    label: 'Maker Crown',
    Asset: MakerCrown,
    blurb: 'Awarded for outstanding tinkering.',
    primary: '#facc15',
    secondary: '#a855f7',
    accent: '#fb923c',
  },
];

export const HEADWEAR: CatalogItem[] = SPECS.map((s) => ({
  id: s.id,
  label: s.label,
  slot: 'headwear',
  anchor: 'head',
  Asset: s.Asset,
  channels: ['primary', 'secondary', 'accent'],
  defaults: { primary: s.primary, secondary: s.secondary, accent: s.accent },
  blurb: s.blurb,
}));

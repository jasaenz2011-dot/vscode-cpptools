/**
 * Backgrounds. Drawn in raw canvas space (0 0 360 480) behind everything else.
 * Each scene keeps its busy detail above the shoulder line and below the knee
 * so the student always reads clearly against it.
 */
import type { AssetProps, CatalogItem } from '../types';
import { GROUND_Y, STAGE_H, STAGE_W } from '../rig';
import { shade, tint } from '../color';

const W = STAGE_W;
const H = STAGE_H;

function Floor({ color, y = GROUND_Y - 22 }: { color: string; y?: number }) {
  return (
    <g>
      <rect x={0} y={y} width={W} height={H - y} fill={color} />
      <rect x={0} y={y} width={W} height={3} fill={tint(color, 0.28)} opacity={0.7} />
    </g>
  );
}

/* ------------------------------- Blueprint ------------------------------- */

function BlueprintBay({ palette }: AssetProps) {
  const line = palette.accent;
  const cols = Array.from({ length: 13 }, (_, i) => i * 30);
  const rows = Array.from({ length: 17 }, (_, i) => i * 30);
  return (
    <g>
      <defs>
        <radialGradient id="bp-glow" cx="50%" cy="42%" r="72%">
          <stop offset="0%" stopColor={tint(palette.primary, 0.22)} />
          <stop offset="100%" stopColor={shade(palette.primary, 0.55)} />
        </radialGradient>
      </defs>
      <rect x={0} y={0} width={W} height={H} fill="url(#bp-glow)" />
      <g stroke={line} strokeWidth={0.6} opacity={0.28}>
        {cols.map((x) => (
          <path key={`c${x}`} d={`M ${x},0 V ${H}`} />
        ))}
        {rows.map((y) => (
          <path key={`r${y}`} d={`M 0,${y} H ${W}`} />
        ))}
      </g>
      <g stroke={line} strokeWidth={1.3} opacity={0.5}>
        <path d={`M 0,${H / 2} H ${W}`} />
        <path d={`M ${W / 2},0 V ${H}`} />
      </g>
      <g stroke={line} strokeWidth={1.4} opacity={0.75} fill="none">
        <path d="M 16,52 H 44 M 16,52 V 80" />
        <path d={`M ${W - 16},52 H ${W - 44} M ${W - 16},52 V 80`} />
        <path d={`M 16,${H - 40} H 44 M 16,${H - 40} V ${H - 68}`} />
        <path d={`M ${W - 16},${H - 40} H ${W - 44} M ${W - 16},${H - 40} V ${H - 68}`} />
      </g>
      <g stroke={palette.secondary} strokeWidth={1.2} opacity={0.85} fill="none">
        <path d={`M 44,${GROUND_Y} H ${W - 44}`} strokeDasharray="7 5" />
        <path d="M 52,96 H 84 M 52,96 V 104 M 52,88 V 104" />
      </g>
      <rect x={0} y={GROUND_Y} width={W} height={H - GROUND_Y} fill={shade(palette.primary, 0.4)} opacity={0.55} />
    </g>
  );
}

/* ------------------------------- Classroom ------------------------------- */

function Classroom({ palette }: AssetProps) {
  const wall = palette.primary;
  const board = palette.secondary;
  return (
    <g>
      <rect x={0} y={0} width={W} height={H} fill={wall} />
      <rect x={0} y={0} width={W} height={62} fill={shade(wall, 0.16)} />
      <g>
        <rect x={44} y={74} width={272} height={172} rx={5} fill={shade(board, 0.45)} />
        <rect x={49} y={79} width={262} height={162} rx={3} fill={board} />
        <g stroke={tint(board, 0.75)} strokeWidth={2.4} strokeLinecap="round" opacity={0.85} fill="none">
          <path d="M 70,104 H 176" />
          <path d="M 70,124 H 140" />
          <path d="M 210,110 m -22,0 a 22,22 0 1 0 44,0 a 22,22 0 1 0 -44,0" />
          <path d="M 210,88 V 132 M 188,110 H 232" />
          <path d="M 70,166 H 150 M 70,186 H 190 M 70,206 H 120" />
          <path d="M 232,168 L 260,196 M 260,168 L 232,196" />
        </g>
        <rect x={44} y={246} width={272} height={9} rx={3} fill={palette.accent} />
        <rect x={124} y={249} width={40} height={5} rx={2.5} fill={tint(palette.accent, 0.6)} />
      </g>
      <g>
        <rect x={12} y={96} width={22} height={128} rx={3} fill={palette.accent} opacity={0.9} />
        {Array.from({ length: 5 }, (_, i) => (
          <rect key={i} x={12} y={100 + i * 25} width={22} height={4} rx={2} fill={shade(palette.accent, 0.4)} />
        ))}
      </g>
      <g transform="translate(324 106)">
        <circle r={19} fill={shade(wall, 0.3)} />
        <circle r={15.5} fill={tint(wall, 0.7)} />
        <path d="M 0,0 V -10 M 0,0 L 7,4" stroke={shade(wall, 0.6)} strokeWidth={2.2} strokeLinecap="round" />
      </g>
      <Floor color={shade(wall, 0.42)} y={GROUND_Y - 26} />
      <g opacity={0.5} stroke={shade(wall, 0.6)} strokeWidth={1.4}>
        <path d={`M 40,${GROUND_Y - 26} V ${H}`} />
        <path d={`M 140,${GROUND_Y - 26} V ${H}`} />
        <path d={`M 240,${GROUND_Y - 26} V ${H}`} />
        <path d={`M 330,${GROUND_Y - 26} V ${H}`} />
      </g>
      <g transform={`translate(300 ${GROUND_Y - 78})`}>
        <rect x={-38} y={0} width={76} height={12} rx={3} fill={palette.accent} />
        <rect x={-32} y={12} width={8} height={52} fill={shade(palette.accent, 0.45)} />
        <rect x={24} y={12} width={8} height={52} fill={shade(palette.accent, 0.45)} />
        <rect x={-30} y={-16} width={30} height={17} rx={2} fill={tint(wall, 0.85)} transform="rotate(-6 -15 -8)" />
      </g>
    </g>
  );
}

/* --------------------------------- Campus -------------------------------- */

function Campus({ palette }: AssetProps) {
  const sky = palette.primary;
  const brick = palette.secondary;
  return (
    <g>
      <defs>
        <linearGradient id="cam-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={tint(sky, 0.35)} />
          <stop offset="100%" stopColor={sky} />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={W} height={H} fill="url(#cam-sky)" />
      <circle cx={296} cy={64} r={30} fill={palette.accent} opacity={0.9} />
      <circle cx={296} cy={64} r={44} fill={palette.accent} opacity={0.16} />
      <g fill={tint(sky, 0.85)} opacity={0.55}>
        <ellipse cx={70} cy={70} rx={34} ry={15} />
        <ellipse cx={96} cy={62} rx={24} ry={17} />
        <ellipse cx={214} cy={104} rx={26} ry={11} />
      </g>
      <g>
        <rect x={54} y={168} width={252} height={140} fill={shade(brick, 0.28)} />
        <rect x={54} y={168} width={252} height={140} fill={brick} opacity={0.92} />
        <path d="M 44,168 L 180,104 L 316,168 Z" fill={shade(brick, 0.45)} />
        <path d="M 54,168 L 180,110 L 306,168 Z" fill={shade(brick, 0.2)} />
        <rect x={160} y={128} width={40} height={40} rx={20} fill={palette.accent} opacity={0.9} />
        <path d="M 180,138 V 148 L 188,152" stroke={shade(brick, 0.6)} strokeWidth={2.4} strokeLinecap="round" fill="none" />
        <g fill={tint(sky, 0.6)} opacity={0.9}>
          {[78, 122, 234, 278].map((x) => (
            <g key={x}>
              <rect x={x} y={196} width={28} height={34} rx={2} />
              <rect x={x} y={252} width={28} height={34} rx={2} />
            </g>
          ))}
        </g>
        <rect x={162} y={214} width={36} height={94} rx={4} fill={shade(brick, 0.5)} />
        <rect x={166} y={218} width={28} height={90} rx={3} fill={palette.accent} opacity={0.55} />
      </g>
      <g>
        <rect x={16} y={244} width={11} height={64} rx={4} fill={shade(brick, 0.55)} />
        <circle cx={21} cy={228} r={30} fill={shade('#22c55e', 0.25)} />
        <circle cx={38} cy={244} r={22} fill="#22c55e" opacity={0.85} />
        <rect x={332} y={244} width={11} height={64} rx={4} fill={shade(brick, 0.55)} />
        <circle cx={338} cy={230} r={27} fill={shade('#22c55e', 0.3)} />
        <circle cx={322} cy={246} r={20} fill="#22c55e" opacity={0.8} />
      </g>
      <rect x={0} y={300} width={W} height={H - 300} fill="#3f8f4a" />
      <rect x={0} y={300} width={W} height={4} fill="#4ade80" opacity={0.6} />
      <path d={`M 96,${H} L 132,304 L 228,304 L 264,${H} Z`} fill={shade(brick, 0.05)} opacity={0.85} />
      <g stroke={tint(brick, 0.5)} strokeWidth={2} opacity={0.5}>
        <path d={`M 128,332 H 232 M 120,376 H 240 M 110,424 H 250`} />
      </g>
    </g>
  );
}

/* -------------------------------- Maker Lab ------------------------------ */

function MakerLab({ palette }: AssetProps) {
  const wall = palette.primary;
  const steel = palette.secondary;
  const pegs: number[] = [];
  for (let y = 96; y <= 268; y += 18) {
    for (let x = 30; x <= 330; x += 18) pegs.push(x + y * 1000);
  }
  return (
    <g>
      <rect x={0} y={0} width={W} height={H} fill={shade(wall, 0.3)} />
      <rect x={18} y={80} width={324} height={204} rx={4} fill={wall} />
      <rect x={18} y={80} width={324} height={204} rx={4} fill="none" stroke={shade(wall, 0.45)} strokeWidth={3} />
      <g fill={shade(wall, 0.5)} opacity={0.55}>
        {pegs.map((p) => (
          <circle key={p} cx={p % 1000} cy={Math.floor(p / 1000)} r={1.9} />
        ))}
      </g>
      <g>
        <rect x={40} y={92} width={9} height={54} rx={3} fill={steel} />
        <path d="M 32,92 h 25 l -4,-14 h -17 Z" fill={palette.accent} />
        <rect x={68} y={92} width={7} height={46} rx={3} fill={steel} />
        <circle cx={71.5} cy={144} r={13} fill="none" stroke={steel} strokeWidth={6} />
        <g transform="translate(300 116)">
          <rect x={-5} y={-24} width={10} height={40} rx={4} fill={palette.accent} />
          <rect x={-16} y={16} width={32} height={12} rx={3} fill={steel} />
        </g>
        <g transform="translate(266 108)">
          <circle r={16} fill="none" stroke={steel} strokeWidth={6} />
          <circle r={5} fill={palette.accent} />
        </g>
        <path d="M 116,92 L 150,92 L 146,150 L 120,150 Z" fill={steel} opacity={0.8} />
        <path d="M 122,100 H 144 M 122,112 H 144 M 123,124 H 143" stroke={palette.accent} strokeWidth={2.4} opacity={0.7} />
      </g>
      <g transform="translate(58 232)">
        <rect x={-32} y={-46} width={64} height={46} rx={4} fill={steel} />
        <rect x={-26} y={-40} width={52} height={30} rx={2} fill={palette.accent} opacity={0.35} />
        <rect x={-26} y={-16} width={52} height={6} rx={2} fill={palette.accent} />
        <circle cx={0} cy={-25} r={5} fill={palette.accent} />
      </g>
      <g transform="translate(300 236)">
        <rect x={-30} y={-30} width={60} height={30} rx={3} fill={shade(steel, 0.2)} />
        <rect x={-30} y={-52} width={60} height={18} rx={3} fill={shade(steel, 0.35)} />
        <circle cx={-16} cy={-15} r={5} fill={palette.accent} />
        <circle cx={4} cy={-15} r={5} fill={palette.accent} opacity={0.6} />
        <circle cx={22} cy={-15} r={5} fill={palette.accent} opacity={0.35} />
      </g>
      <g>
        <rect x={0} y={284} width={W} height={22} fill={shade(steel, 0.15)} />
        <rect x={0} y={284} width={W} height={5} fill={palette.accent} opacity={0.5} />
        <rect x={24} y={306} width={16} height={68} fill={shade(steel, 0.35)} />
        <rect x={320} y={306} width={16} height={68} fill={shade(steel, 0.35)} />
      </g>
      <Floor color={shade(wall, 0.55)} y={GROUND_Y - 24} />
      <g opacity={0.35} stroke={palette.accent} strokeWidth={2}>
        <path d={`M 0,${GROUND_Y + 14} H ${W}`} strokeDasharray="16 12" />
      </g>
    </g>
  );
}

/* -------------------------------- Cityscape ------------------------------ */

const TOWERS = [
  { x: 0, w: 46, h: 150 },
  { x: 44, w: 34, h: 208 },
  { x: 76, w: 52, h: 118 },
  { x: 126, w: 40, h: 186 },
  { x: 164, w: 30, h: 138 },
  { x: 192, w: 56, h: 224 },
  { x: 246, w: 36, h: 150 },
  { x: 280, w: 46, h: 194 },
  { x: 324, w: 40, h: 130 },
];

function Cityscape({ palette }: AssetProps) {
  const sky = palette.primary;
  const tower = palette.secondary;
  const base = 356;
  return (
    <g>
      <defs>
        <linearGradient id="city-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={shade(sky, 0.4)} />
          <stop offset="58%" stopColor={sky} />
          <stop offset="100%" stopColor={tint(sky, 0.42)} />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={W} height={H} fill="url(#city-sky)" />
      <circle cx={180} cy={244} r={78} fill={palette.accent} opacity={0.28} />
      <circle cx={180} cy={244} r={52} fill={palette.accent} opacity={0.5} />
      <g fill={shade(tower, 0.3)} opacity={0.65}>
        {TOWERS.map((t) => (
          <rect key={`b${t.x}`} x={t.x - 8} y={base - t.h * 0.82} width={t.w} height={t.h} />
        ))}
      </g>
      <g>
        {TOWERS.map((t) => (
          <g key={t.x}>
            <rect x={t.x} y={base - t.h} width={t.w} height={t.h} fill={tower} />
            <rect x={t.x} y={base - t.h} width={t.w} height={4} fill={tint(tower, 0.3)} opacity={0.7} />
            <g fill={palette.accent} opacity={0.75}>
              {Array.from({ length: Math.floor(t.h / 26) }, (_, r) =>
                Array.from({ length: Math.max(1, Math.floor(t.w / 18)) }, (_, c) => {
                  const lit = (r * 7 + c * 3 + t.x) % 5 !== 0;
                  return lit ? (
                    <rect
                      key={`${r}-${c}`}
                      x={t.x + 6 + c * 18}
                      y={base - t.h + 14 + r * 26}
                      width={8}
                      height={11}
                      rx={1}
                      opacity={(r * 3 + c) % 3 === 0 ? 0.45 : 0.95}
                    />
                  ) : null;
                }),
              )}
            </g>
          </g>
        ))}
      </g>
      <g stroke={palette.accent} strokeWidth={3.4} fill="none" strokeLinecap="round">
        <path d="M 292,140 L 292,238" />
        <path d="M 292,140 L 348,158" />
        <path d="M 292,152 L 262,144" />
        <path d="M 336,156 L 336,182" />
        <path d="M 262,144 L 268,158" />
      </g>
      <rect x={0} y={base} width={W} height={H - base} fill={shade(tower, 0.55)} />
      <rect x={0} y={base} width={W} height={5} fill={palette.accent} opacity={0.5} />
      <g stroke={palette.accent} strokeWidth={2.6} opacity={0.3} strokeDasharray="18 14">
        <path d={`M 0,${GROUND_Y + 16} H ${W}`} />
      </g>
    </g>
  );
}

interface BgSpec {
  id: string;
  label: string;
  Asset: (p: AssetProps) => React.ReactElement;
  blurb: string;
  colors: [string, string, string];
}

const BG_SPECS: BgSpec[] = [
  {
    id: 'blueprint',
    label: 'Blueprint Bay',
    Asset: BlueprintBay,
    blurb: 'Where every build starts.',
    colors: ['#12305f', '#f59e0b', '#7dd3fc'],
  },
  {
    id: 'makerlab',
    label: 'Maker Lab',
    Asset: MakerLab,
    blurb: 'Pegboard, printers, possibility.',
    colors: ['#1f3b57', '#334155', '#f59e0b'],
  },
  {
    id: 'classroom',
    label: 'Classroom',
    Asset: Classroom,
    blurb: 'Front row, hand already up.',
    colors: ['#d9c39a', '#14532d', '#b45309'],
  },
  {
    id: 'campus',
    label: 'Campus',
    Asset: Campus,
    blurb: 'Morning bell, big plans.',
    colors: ['#38bdf8', '#b45309', '#fbbf24'],
  },
  {
    id: 'cityscape',
    label: 'Cityscape',
    Asset: Cityscape,
    blurb: 'The skyline you will help build.',
    colors: ['#3b1d6e', '#1e1b4b', '#fb923c'],
  },
];

export const BACKGROUNDS: CatalogItem[] = BG_SPECS.map((s) => ({
  id: s.id,
  label: s.label,
  slot: 'background',
  anchor: 'canvas',
  Asset: s.Asset,
  channels: ['primary', 'secondary', 'accent'],
  defaults: { primary: s.colors[0], secondary: s.colors[1], accent: s.colors[2] },
  blurb: s.blurb,
}));

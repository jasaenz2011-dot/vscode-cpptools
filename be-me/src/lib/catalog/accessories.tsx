/**
 * Badges & accessories: eyewear (head space), chest badges (chest space) and
 * handheld tools (hand space, anchored to the fist at the end of the arm).
 */
import { shade, tint } from '../color';
import { HEAD } from './geometry';
import type { AssetProps, CatalogItem } from '../types';

const { eyeX, eyeY } = HEAD;

/* ================================ EYEWEAR =============================== */

function Bridge({ color, y = 0, w = 10 }: { color: string; y?: number; w?: number }) {
  return (
    <path
      d={`M ${-w},${eyeY + y} q ${w},-5 ${w * 2},0`}
      fill="none"
      stroke={color}
      strokeWidth={3}
      strokeLinecap="round"
    />
  );
}

function Temples({ color }: { color: string }) {
  return (
    <g stroke={color} strokeWidth={3.4} strokeLinecap="round">
      <path d={`M ${-eyeX - 14},${eyeY - 1} L -42,${eyeY - 3}`} />
      <path d={`M ${eyeX + 14},${eyeY - 1} L 42,${eyeY - 3}`} />
    </g>
  );
}

function SafetyGlasses({ palette }: AssetProps) {
  return (
    <g>
      <Temples color={palette.secondary} />
      <path
        d={`M -38,${eyeY - 10} C -20,${eyeY - 15} 20,${eyeY - 15} 38,${eyeY - 10} L 36,${eyeY + 7} C 20,${eyeY + 15} -20,${eyeY + 15} -36,${eyeY + 7} Z`}
        fill={tint(palette.primary, 0.62)}
        opacity={0.5}
      />
      <path
        d={`M -38,${eyeY - 10} C -20,${eyeY - 15} 20,${eyeY - 15} 38,${eyeY - 10} L 36,${eyeY + 7} C 20,${eyeY + 15} -20,${eyeY + 15} -36,${eyeY + 7} Z`}
        fill="none"
        stroke={palette.secondary}
        strokeWidth={3}
      />
      <path d={`M -30,${eyeY - 8} L -16,${eyeY - 8} L -24,${eyeY + 8} L -34,${eyeY + 5} Z`} fill="#ffffff" opacity={0.35} />
      <Bridge color={palette.secondary} y={-6} w={7} />
    </g>
  );
}

function RoundSpecs({ palette }: AssetProps) {
  return (
    <g>
      <Temples color={palette.primary} />
      <circle cx={-eyeX} cy={eyeY} r={13.5} fill={tint(palette.accent, 0.68)} opacity={0.42} />
      <circle cx={eyeX} cy={eyeY} r={13.5} fill={tint(palette.accent, 0.68)} opacity={0.42} />
      <circle cx={-eyeX} cy={eyeY} r={13.5} fill="none" stroke={palette.primary} strokeWidth={3.6} />
      <circle cx={eyeX} cy={eyeY} r={13.5} fill="none" stroke={palette.primary} strokeWidth={3.6} />
      <path d={`M -8,${eyeY - 2} h 16`} stroke={palette.primary} strokeWidth={3.2} strokeLinecap="round" />
      <path d={`M ${-eyeX - 8},${eyeY - 7} a 10,10 0 0 1 9,-4`} fill="none" stroke="#ffffff" strokeWidth={3} opacity={0.5} strokeLinecap="round" />
    </g>
  );
}

function RectSpecs({ palette }: AssetProps) {
  return (
    <g>
      <Temples color={palette.primary} />
      <g>
        <rect x={-eyeX - 14} y={eyeY - 10} width={28} height={21} rx={5} fill={tint(palette.accent, 0.68)} opacity={0.42} />
        <rect x={eyeX - 14} y={eyeY - 10} width={28} height={21} rx={5} fill={tint(palette.accent, 0.68)} opacity={0.42} />
        <rect x={-eyeX - 14} y={eyeY - 10} width={28} height={21} rx={5} fill="none" stroke={palette.primary} strokeWidth={3.6} />
        <rect x={eyeX - 14} y={eyeY - 10} width={28} height={21} rx={5} fill="none" stroke={palette.primary} strokeWidth={3.6} />
      </g>
      <path d={`M -3,${eyeY - 3} h 6`} stroke={palette.primary} strokeWidth={3.4} strokeLinecap="round" />
    </g>
  );
}

function LabGoggles({ palette }: AssetProps) {
  return (
    <g>
      <rect x={-46} y={eyeY - 6} width={92} height={9} rx={4.5} fill={shade(palette.secondary, 0.3)} />
      <g>
        <circle cx={-eyeX - 2} cy={eyeY} r={16} fill={palette.secondary} />
        <circle cx={eyeX + 2} cy={eyeY} r={16} fill={palette.secondary} />
        <circle cx={-eyeX - 2} cy={eyeY} r={11.5} fill={tint(palette.primary, 0.6)} opacity={0.5} />
        <circle cx={eyeX + 2} cy={eyeY} r={11.5} fill={tint(palette.primary, 0.6)} opacity={0.5} />
        <path d={`M ${-eyeX - 9},${eyeY - 6} a 9,9 0 0 1 8,-4`} fill="none" stroke="#ffffff" strokeWidth={3} opacity={0.6} strokeLinecap="round" />
        <rect x={-4} y={eyeY - 5} width={8} height={10} rx={3} fill={shade(palette.secondary, 0.35)} />
      </g>
    </g>
  );
}

function StarShades({ palette }: AssetProps) {
  const star =
    'M 0,-15 L 4.4,-4.8 L 15.4,-4.6 L 6.7,2.2 L 9.7,12.8 L 0,6.6 L -9.7,12.8 L -6.7,2.2 L -15.4,-4.6 L -4.4,-4.8 Z';
  return (
    <g>
      <Temples color={palette.secondary} />
      <path d={`M -6,${eyeY - 3} h 12`} stroke={palette.secondary} strokeWidth={4} strokeLinecap="round" />
      <g transform={`translate(${-eyeX} ${eyeY})`}>
        <path d={star} fill={palette.primary} stroke={palette.secondary} strokeWidth={2.6} strokeLinejoin="round" />
      </g>
      <g transform={`translate(${eyeX} ${eyeY})`}>
        <path d={star} fill={palette.primary} stroke={palette.secondary} strokeWidth={2.6} strokeLinejoin="round" />
      </g>
      <circle cx={-eyeX - 3} cy={eyeY - 4} r={2.4} fill={palette.accent} />
      <circle cx={eyeX - 3} cy={eyeY - 4} r={2.4} fill={palette.accent} />
    </g>
  );
}

function SportShades({ palette }: AssetProps) {
  return (
    <g>
      <Temples color={palette.secondary} />
      <path
        d={`M -40,${eyeY - 11} C -14,${eyeY - 17} 14,${eyeY - 17} 40,${eyeY - 11} C 38,${eyeY + 4} 22,${eyeY + 14} 4,${eyeY + 11} L 0,${eyeY + 4} L -4,${eyeY + 11} C -22,${eyeY + 14} -38,${eyeY + 4} -40,${eyeY - 11} Z`}
        fill={palette.primary}
      />
      <path
        d={`M -34,${eyeY - 8} C -20,${eyeY - 12} -8,${eyeY - 12} -4,${eyeY - 10} L -12,${eyeY + 6} C -24,${eyeY + 4} -32,${eyeY - 1} -34,${eyeY - 8} Z`}
        fill={palette.accent}
        opacity={0.45}
      />
    </g>
  );
}

interface Spec3 {
  id: string;
  label: string;
  Asset: (p: AssetProps) => React.ReactElement;
  blurb: string;
  colors: [string, string, string];
}

const EYEWEAR_SPECS: Spec3[] = [
  { id: 'safety', label: 'Safety Specs', Asset: SafetyGlasses, blurb: 'Rule one of the workshop.', colors: ['#67e8f9', '#1e293b', '#38bdf8'] },
  { id: 'round', label: 'Round Specs', Asset: RoundSpecs, blurb: 'Classic inventor energy.', colors: ['#1e293b', '#334155', '#93c5fd'] },
  { id: 'rect', label: 'Study Frames', Asset: RectSpecs, blurb: 'Reads the manual first.', colors: ['#b45309', '#78350f', '#bae6fd'] },
  { id: 'goggles', label: 'Lab Goggles', Asset: LabGoggles, blurb: 'Chemistry-grade sealed.', colors: ['#a855f7', '#1e293b', '#e9d5ff'] },
  { id: 'star', label: 'Star Shades', Asset: StarShades, blurb: 'For the after-party.', colors: ['#f59e0b', '#1e293b', '#ffffff'] },
  { id: 'sport', label: 'Sport Shades', Asset: SportShades, blurb: 'Wind-resistant to 30mph.', colors: ['#1e293b', '#f59e0b', '#38bdf8'] },
];

export const EYEWEAR: CatalogItem[] = EYEWEAR_SPECS.map((s) => ({
  id: s.id,
  label: s.label,
  slot: 'eyewear',
  anchor: 'head',
  Asset: s.Asset,
  channels: ['primary', 'secondary', 'accent'],
  defaults: { primary: s.colors[0], secondary: s.colors[1], accent: s.colors[2] },
  blurb: s.blurb,
}));

/* ================================= BADGES =============================== */

/** Chest space: 100 × 100 centred on the sternum. Badges ride the wearer's right. */
const BADGE_X = -32;
const BADGE_Y = -4;

function GearBadge({ palette }: AssetProps) {
  const teeth = Array.from({ length: 8 }, (_, i) => i * 45);
  return (
    <g transform={`translate(${BADGE_X} ${BADGE_Y})`}>
      <g fill={shade(palette.primary, 0.4)}>
        {teeth.map((a) => (
          <rect key={a} x={-3.6} y={-19} width={7.2} height={8} rx={1.6} transform={`rotate(${a})`} />
        ))}
        <circle r={13.5} />
      </g>
      <g fill={palette.primary} transform="translate(0 -1.4)">
        {teeth.map((a) => (
          <rect key={a} x={-3.6} y={-19} width={7.2} height={8} rx={1.6} transform={`rotate(${a})`} />
        ))}
        <circle r={13.5} />
      </g>
      <circle cy={-1.4} r={6} fill={palette.secondary} />
      <circle cy={-1.4} r={2.6} fill={palette.accent} />
    </g>
  );
}

function StarBadge({ palette }: AssetProps) {
  const star =
    'M 0,-18 L 5.3,-5.8 L 18.5,-5.5 L 8,2.6 L 11.6,15.4 L 0,7.9 L -11.6,15.4 L -8,2.6 L -18.5,-5.5 L -5.3,-5.8 Z';
  return (
    <g transform={`translate(${BADGE_X} ${BADGE_Y})`}>
      <path d={star} fill={shade(palette.primary, 0.4)} transform="translate(0 2)" />
      <path d={star} fill={palette.primary} stroke={palette.secondary} strokeWidth={2.4} strokeLinejoin="round" />
      <circle r={4.6} fill={palette.accent} />
    </g>
  );
}

function BoltPatch({ palette }: AssetProps) {
  return (
    <g transform={`translate(${BADGE_X} ${BADGE_Y})`}>
      <rect x={-17} y={-17} width={34} height={34} rx={9} fill={shade(palette.secondary, 0.4)} transform="rotate(-8)" />
      <rect x={-16} y={-18} width={32} height={32} rx={8.5} fill={palette.secondary} transform="rotate(-8)" />
      <path d="M 3,-13 L -8,1 L -1,1 L -4,13 L 8,-2 L 1,-2 Z" fill={palette.primary} transform="rotate(-8)" />
      <rect x={-16} y={-18} width={32} height={32} rx={8.5} fill="none" stroke={palette.accent} strokeWidth={2} strokeDasharray="4 3" transform="rotate(-8)" />
    </g>
  );
}

function ShieldBadge({ palette }: AssetProps) {
  const shield = 'M 0,-19 L 16,-13 C 16,4 9,15 0,19 C -9,15 -16,4 -16,-13 Z';
  return (
    <g transform={`translate(${BADGE_X} ${BADGE_Y})`}>
      <path d={shield} fill={shade(palette.primary, 0.42)} transform="translate(0 2)" />
      <path d={shield} fill={palette.primary} />
      <path d="M 0,-15 L 12,-10 C 12,3 7,11 0,15 Z" fill={palette.secondary} opacity={0.8} />
      <path d="M -7,-2 L -2,4 L 8,-8" fill="none" stroke={palette.accent} strokeWidth={3.6} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

function LanyardId({ palette }: AssetProps) {
  return (
    <g transform={`translate(${BADGE_X + 2} ${BADGE_Y + 2})`}>
      <path d="M -22,-44 L -2,-6 M 22,-44 L 2,-6" stroke={palette.secondary} strokeWidth={4.5} fill="none" />
      <rect x={-3} y={-10} width={6} height={8} rx={2} fill={shade(palette.secondary, 0.4)} />
      <rect x={-15} y={-4} width={30} height={22} rx={3.5} fill={shade(palette.primary, 0.4)} transform="translate(0 1.6)" />
      <rect x={-15} y={-4} width={30} height={22} rx={3.5} fill={palette.primary} />
      <circle cx={-7} cy={4} r={4.6} fill={palette.accent} />
      <g fill={palette.secondary} opacity={0.85}>
        <rect x={0} y={1} width={12} height={2.6} rx={1.3} />
        <rect x={0} y={6} width={9} height={2.6} rx={1.3} />
        <rect x={-11} y={11.5} width={22} height={2.6} rx={1.3} />
      </g>
    </g>
  );
}

function RibbonBadge({ palette }: AssetProps) {
  return (
    <g transform={`translate(${BADGE_X} ${BADGE_Y - 3})`}>
      <path d="M -9,4 L -13,24 L -4,19 L 0,26 L 4,19 L 13,24 L 9,4 Z" fill={palette.secondary} />
      <circle r={15} fill={shade(palette.primary, 0.42)} transform="translate(0 2)" />
      <circle r={15} fill={palette.primary} />
      <circle r={15} fill="none" stroke={palette.secondary} strokeWidth={2.6} strokeDasharray="3.5 3" />
      <circle r={8} fill={palette.accent} />
      <path d="M -3.6,-1 L -1,2 L 4,-4" fill="none" stroke={shade(palette.accent, 0.65)} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

const BADGE_SPECS: Spec3[] = [
  { id: 'gear', label: 'Gear Pin', Asset: GearBadge, blurb: 'Certified: turns ideas into motion.', colors: ['#f59e0b', '#1e293b', '#fbbf24'] },
  { id: 'star', label: 'Gold Star', Asset: StarBadge, blurb: 'Earned, not given.', colors: ['#facc15', '#b45309', '#fff7ed'] },
  { id: 'bolt', label: 'Bolt Patch', Asset: BoltPatch, blurb: 'High voltage curiosity.', colors: ['#fde047', '#7c3aed', '#f0abfc'] },
  { id: 'shield', label: 'Safety Shield', Asset: ShieldBadge, blurb: 'Looks out for the whole crew.', colors: ['#2563eb', '#1e3a8a', '#7dd3fc'] },
  { id: 'lanyard', label: 'Lab Lanyard', Asset: LanyardId, blurb: 'All-access maker pass.', colors: ['#e2e8f0', '#dc2626', '#38bdf8'] },
  { id: 'ribbon', label: 'Prize Ribbon', Asset: RibbonBadge, blurb: 'First place, science fair.', colors: ['#a855f7', '#f59e0b', '#fde68a'] },
];

export const BADGES: CatalogItem[] = BADGE_SPECS.map((s) => ({
  id: s.id,
  label: s.label,
  slot: 'badge',
  anchor: 'chest',
  Asset: s.Asset,
  channels: ['primary', 'secondary', 'accent'],
  defaults: { primary: s.colors[0], secondary: s.colors[1], accent: s.colors[2] },
  blurb: s.blurb,
}));

/* ================================== TOOLS =============================== */

/** Hand space: 40 × 40 centred on the fist. Tools hang down out of the grip. */
function Wrench({ palette }: AssetProps) {
  return (
    <g transform="rotate(14)">
      <rect x={-5} y={-16} width={10} height={42} fill={palette.primary} />
      <path
        d="M -11,-26 A 11,11 0 0 1 11,-26 L 11,-19 L 4,-19 L 4,-24 L -4,-24 L -4,-19 L -11,-19 Z"
        fill={palette.primary}
      />
      <circle cx={0} cy={30} r={11} fill={palette.primary} />
      <circle cx={0} cy={30} r={5} fill="#0f172a" opacity={0.55} />
      <rect x={-6} y={-4} width={12} height={22} rx={4} fill={palette.secondary} />
      <rect x={-6} y={-4} width={12} height={6} rx={3} fill={tint(palette.secondary, 0.3)} opacity={0.6} />
      <rect x={-6} y={11} width={12} height={4} rx={2} fill={palette.accent} />
    </g>
  );
}

function Hammer({ palette }: AssetProps) {
  return (
    <g transform="rotate(-10)">
      <rect x={-4} y={-8} width={8} height={40} rx={3.5} fill={palette.secondary} />
      <rect x={-4} y={16} width={8} height={16} rx={3.5} fill={palette.accent} />
      <path d="M -17,-20 L 12,-20 L 16,-13 L 12,-6 L -13,-6 L -17,-12 Z" fill={palette.primary} />
      <path d="M -17,-20 L 12,-20 L 12,-16 L -17,-16 Z" fill={tint(palette.primary, 0.28)} opacity={0.7} />
      <path d="M -17,-12 L -22,-10 L -22,-15 Z" fill={shade(palette.primary, 0.3)} />
    </g>
  );
}

function Screwdriver({ palette }: AssetProps) {
  return (
    <g transform="rotate(18)">
      <rect x={-6.5} y={-22} width={13} height={26} rx={5} fill={palette.primary} />
      <g fill={shade(palette.primary, 0.32)}>
        <rect x={-6.5} y={-17} width={13} height={2.6} />
        <rect x={-6.5} y={-11} width={13} height={2.6} />
        <rect x={-6.5} y={-5} width={13} height={2.6} />
      </g>
      <rect x={-3} y={2} width={6} height={26} fill={palette.secondary} />
      <path d="M -3,28 L 3,28 L 2.4,34 L -2.4,34 Z" fill={palette.accent} />
    </g>
  );
}

function PaintBrush({ palette }: AssetProps) {
  return (
    <g transform="rotate(-16)">
      <rect x={-4} y={-24} width={8} height={32} rx={3.5} fill={palette.secondary} />
      <path d="M -6.5,8 L 6.5,8 L 7.5,18 L -7.5,18 Z" fill={palette.accent} />
      <path d="M -8,18 L 8,18 L 6,34 C 3,37 -3,37 -6,34 Z" fill={palette.primary} />
      <path d="M -4,20 L -2,34 M 1,20 L 2,34" stroke={shade(palette.primary, 0.34)} strokeWidth={1.8} />
    </g>
  );
}

function TabletTool({ palette }: AssetProps) {
  return (
    <g transform="rotate(-8)">
      <rect x={-16} y={-20} width={32} height={44} rx={4.5} fill={shade(palette.secondary, 0.35)} />
      <rect x={-16} y={-21.5} width={32} height={44} rx={4.5} fill={palette.secondary} />
      <rect x={-12.5} y={-17.5} width={25} height={34} rx={2} fill={palette.primary} />
      <g fill={palette.accent} opacity={0.9}>
        <rect x={-9} y={-13} width={18} height={3} rx={1.5} />
        <rect x={-9} y={-6} width={12} height={3} rx={1.5} />
        <rect x={-9} y={1} width={15} height={3} rx={1.5} />
        <circle cx={-4} cy={10} r={3.4} />
      </g>
      <rect x={-3} y={18.5} width={6} height={2.4} rx={1.2} fill={shade(palette.secondary, 0.5)} />
    </g>
  );
}

function BlueprintRoll({ palette }: AssetProps) {
  return (
    <g transform="rotate(-24)">
      <rect x={-9} y={-26} width={18} height={54} rx={9} fill={palette.primary} />
      <rect x={-9} y={-26} width={18} height={54} rx={9} fill="none" stroke={shade(palette.primary, 0.35)} strokeWidth={1.6} />
      <ellipse cx={0} cy={-26} rx={9} ry={3.4} fill={tint(palette.primary, 0.3)} />
      <g stroke={palette.accent} strokeWidth={1.4} opacity={0.75}>
        <path d="M -9,-14 L 9,-14 M -9,-4 L 9,-4 M -9,6 L 9,6 M -9,16 L 9,16" />
      </g>
      <rect x={-11} y={-6} width={22} height={9} rx={2} fill={palette.secondary} />
    </g>
  );
}

function Flashlight({ palette }: AssetProps) {
  return (
    <g transform="rotate(24)">
      <rect x={-5.5} y={-20} width={11} height={34} rx={4} fill={palette.secondary} />
      <g fill={shade(palette.secondary, 0.35)}>
        <rect x={-5.5} y={-12} width={11} height={2.6} />
        <rect x={-5.5} y={-6} width={11} height={2.6} />
      </g>
      <path d="M -10,14 L 10,14 L 13,28 L -13,28 Z" fill={palette.primary} />
      <ellipse cx={0} cy={28} rx={13} ry={4} fill={palette.accent} />
      <path d="M -13,29 L 13,29 L 22,54 L -22,54 Z" fill={palette.accent} opacity={0.2} />
    </g>
  );
}

const TOOL_SPECS: Spec3[] = [
  { id: 'wrench', label: 'Big Wrench', Asset: Wrench, blurb: 'Torque, meet enthusiasm.', colors: ['#94a3b8', '#f59e0b', '#dc2626'] },
  { id: 'hammer', label: 'Claw Hammer', Asset: Hammer, blurb: 'Percussive engineering.', colors: ['#94a3b8', '#b45309', '#f59e0b'] },
  { id: 'driver', label: 'Screwdriver', Asset: Screwdriver, blurb: 'Righty tighty, always.', colors: ['#dc2626', '#cbd5e1', '#f59e0b'] },
  { id: 'brush', label: 'Paint Brush', Asset: PaintBrush, blurb: 'Colour is a building material.', colors: ['#a855f7', '#b45309', '#f59e0b'] },
  { id: 'tablet', label: 'Design Tablet', Asset: TabletTool, blurb: 'Where the sketch becomes a plan.', colors: ['#38bdf8', '#1e293b', '#f59e0b'] },
  { id: 'roll', label: 'Blueprints', Asset: BlueprintRoll, blurb: 'Rolled, dog-eared, beloved.', colors: ['#2563eb', '#f59e0b', '#bae6fd'] },
  { id: 'torch', label: 'Work Light', Asset: Flashlight, blurb: 'Finds the dropped screw. Eventually.', colors: ['#f59e0b', '#334155', '#fde68a'] },
];

export const TOOLS: CatalogItem[] = TOOL_SPECS.map((s) => ({
  id: s.id,
  label: s.label,
  slot: 'tool',
  anchor: 'hand',
  Asset: s.Asset,
  channels: ['primary', 'secondary', 'accent'],
  defaults: { primary: s.colors[0], secondary: s.colors[1], accent: s.colors[2] },
  blurb: s.blurb,
}));

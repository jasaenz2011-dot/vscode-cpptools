/**
 * Expressions. All authored in head space (100×100, origin at skull centre)
 * so they ride the head anchor exactly, at every grade.
 */
import { mix } from '../color';
import type { AssetProps, CatalogItem } from '../types';
import { HEAD } from './geometry';

const { eyeX, eyeY, browY, mouthY, noseY } = HEAD;

interface FaceBits {
  ink: string;
  blush: string;
  accent: string;
}

function bits({ palette }: AssetProps): FaceBits {
  return {
    ink: palette.line,
    blush: mix(palette.skin, '#f43f5e', 0.34),
    accent: palette.accent,
  };
}

/* ----------------------------- shared pieces ---------------------------- */

function Blush({ blush }: { blush: string }) {
  return (
    <g fill={blush} opacity={0.6}>
      <ellipse cx={-27} cy={14} rx={8} ry={5} />
      <ellipse cx={27} cy={14} rx={8} ry={5} />
    </g>
  );
}

function Nose({ ink }: { ink: string }) {
  return (
    <path
      d={`M -3,${noseY - 2} q 3,5 6,0`}
      fill="none"
      stroke={ink}
      strokeWidth={2.6}
      strokeLinecap="round"
      opacity={0.75}
    />
  );
}

function RoundEyes({ ink, r = 7, shine = true }: { ink: string; r?: number; shine?: boolean }) {
  return (
    <g>
      <circle cx={-eyeX} cy={eyeY} r={r} fill={ink} />
      <circle cx={eyeX} cy={eyeY} r={r} fill={ink} />
      {shine ? (
        <g fill="#ffffff">
          <circle cx={-eyeX + r * 0.34} cy={eyeY - r * 0.4} r={r * 0.3} />
          <circle cx={eyeX + r * 0.34} cy={eyeY - r * 0.4} r={r * 0.3} />
        </g>
      ) : null}
    </g>
  );
}

function ArcEyes({ ink, flip = false }: { ink: string; flip?: boolean }) {
  const d = flip
    ? `M -${eyeX + 7},${eyeY + 3} q 7,-9 14,0`
    : `M -${eyeX + 7},${eyeY + 2} q 7,9 14,0`;
  return (
    <g fill="none" stroke={ink} strokeWidth={3.6} strokeLinecap="round">
      <path d={d} />
      <path d={d} transform={`translate(${eyeX * 2} 0)`} />
    </g>
  );
}

function Brows({
  ink,
  tilt = 0,
  lift = 0,
  asymmetric = false,
}: {
  ink: string;
  tilt?: number;
  lift?: number;
  asymmetric?: boolean;
}) {
  return (
    <g stroke={ink} strokeWidth={3.4} strokeLinecap="round" fill="none">
      <path d="M -9,0 q 9,-4 18,1" transform={`translate(${-eyeX - 9} ${browY - lift}) rotate(${-tilt})`} />
      <path
        d="M -9,1 q 9,-5 18,0"
        transform={`translate(${eyeX + 9} ${browY - lift - (asymmetric ? 5 : 0)}) rotate(${tilt})`}
      />
    </g>
  );
}

function Smile({ ink, w = 15, depth = 8 }: { ink: string; w?: number; depth?: number }) {
  return (
    <path
      d={`M ${-w},${mouthY - 2} q ${w},${depth + 4} ${w * 2},0`}
      fill="none"
      stroke={ink}
      strokeWidth={3.6}
      strokeLinecap="round"
    />
  );
}

function OpenMouth({ ink, w = 13, h = 11 }: { ink: string; w?: number; h?: number }) {
  return (
    <g>
      <path
        d={`M ${-w},${mouthY - 3} q ${w},${h * 1.8} ${w * 2},0 q -${w},${h * 0.5} -${w * 2},0 Z`}
        fill={ink}
      />
      <path
        d={`M ${-w * 0.72},${mouthY - 2.4} q ${w * 0.72},2.5 ${w * 1.44},0 Z`}
        fill="#ffffff"
        opacity={0.94}
      />
    </g>
  );
}

/* ------------------------------ expressions ----------------------------- */

function BrightSpark(props: AssetProps) {
  const { ink, blush } = bits(props);
  return (
    <g>
      <Brows ink={ink} lift={2} />
      <RoundEyes ink={ink} r={7.4} />
      <Blush blush={blush} />
      <Nose ink={ink} />
      <Smile ink={ink} w={16} depth={9} />
    </g>
  );
}

function DeepFocus(props: AssetProps) {
  const { ink } = bits(props);
  return (
    <g>
      <Brows ink={ink} tilt={11} lift={-2} />
      <g>
        <path
          d={`M ${-eyeX - 7},${eyeY - 2} h 14`}
          stroke={ink}
          strokeWidth={3.2}
          strokeLinecap="round"
        />
        <circle cx={-eyeX} cy={eyeY + 2.5} r={5} fill={ink} />
        <path
          d={`M ${eyeX - 7},${eyeY - 2} h 14`}
          stroke={ink}
          strokeWidth={3.2}
          strokeLinecap="round"
        />
        <circle cx={eyeX} cy={eyeY + 2.5} r={5} fill={ink} />
      </g>
      <Nose ink={ink} />
      <path
        d={`M -11,${mouthY + 1} q 11,4 22,-2`}
        fill="none"
        stroke={ink}
        strokeWidth={3.4}
        strokeLinecap="round"
      />
    </g>
  );
}

function MegaBeam(props: AssetProps) {
  const { ink, blush } = bits(props);
  return (
    <g>
      <Brows ink={ink} lift={4} />
      <ArcEyes ink={ink} flip />
      <Blush blush={blush} />
      <OpenMouth ink={ink} w={15} h={12} />
    </g>
  );
}

function Curious(props: AssetProps) {
  const { ink, accent } = bits(props);
  return (
    <g>
      <Brows ink={ink} lift={1} asymmetric />
      <RoundEyes ink={ink} r={7} />
      <Nose ink={ink} />
      <circle cx={0} cy={mouthY + 2} r={5.4} fill={ink} />
      <circle cx={0} cy={mouthY + 3.4} r={2.6} fill={mix(ink, accent, 0.5)} opacity={0.85} />
    </g>
  );
}

function BoldMaker(props: AssetProps) {
  const { ink } = bits(props);
  return (
    <g>
      <Brows ink={ink} tilt={-9} lift={0} />
      <RoundEyes ink={ink} r={7.2} />
      <Nose ink={ink} />
      <path
        d={`M -14,${mouthY} q 10,9 25,-4`}
        fill="none"
        stroke={ink}
        strokeWidth={3.8}
        strokeLinecap="round"
      />
    </g>
  );
}

function Chill(props: AssetProps) {
  const { ink, blush } = bits(props);
  return (
    <g>
      <Brows ink={ink} lift={3} />
      <g stroke={ink} strokeWidth={3.4} strokeLinecap="round" fill="none">
        <path d={`M ${-eyeX - 7},${eyeY} h 14`} />
        <path d={`M ${eyeX - 7},${eyeY} h 14`} />
      </g>
      <g fill={ink}>
        <path d={`M ${-eyeX - 6},${eyeY + 1} q 6,7 12,0 Z`} />
        <path d={`M ${eyeX - 6},${eyeY + 1} q 6,7 12,0 Z`} />
      </g>
      <Blush blush={blush} />
      <Nose ink={ink} />
      <Smile ink={ink} w={12} depth={5} />
    </g>
  );
}

function Wow(props: AssetProps) {
  const { ink, blush } = bits(props);
  return (
    <g>
      <Brows ink={ink} lift={7} />
      <g>
        <circle cx={-eyeX} cy={eyeY} r={9} fill="#ffffff" stroke={ink} strokeWidth={2.6} />
        <circle cx={eyeX} cy={eyeY} r={9} fill="#ffffff" stroke={ink} strokeWidth={2.6} />
        <circle cx={-eyeX} cy={eyeY + 1} r={4.4} fill={ink} />
        <circle cx={eyeX} cy={eyeY + 1} r={4.4} fill={ink} />
      </g>
      <Blush blush={blush} />
      <ellipse cx={0} cy={mouthY + 3} rx={7.5} ry={9.5} fill={ink} />
    </g>
  );
}

function Giggle(props: AssetProps) {
  const { ink, blush } = bits(props);
  return (
    <g>
      <Brows ink={ink} lift={4} />
      <ArcEyes ink={ink} flip />
      <Blush blush={blush} />
      <g>
        <path
          d={`M -14,${mouthY - 3} q 14,17 28,0 Z`}
          fill={ink}
          stroke={ink}
          strokeWidth={2}
          strokeLinejoin="round"
        />
        <path
          d={`M -5,${mouthY + 7} q 5,9 10,0 Z`}
          fill={mix(ink, '#fb7185', 0.72)}
        />
      </g>
    </g>
  );
}

const face = (
  id: string,
  label: string,
  Asset: (props: AssetProps) => React.ReactElement,
  blurb: string,
): CatalogItem => ({
  id,
  label,
  slot: 'expression',
  anchor: 'face',
  Asset,
  channels: [],
  defaults: {},
  blurb,
});

export const EXPRESSIONS: CatalogItem[] = [
  face('spark', 'Bright Spark', BrightSpark, 'Ready for the next big idea.'),
  face('beam', 'Mega Beam', MegaBeam, 'Full-wattage grin.'),
  face('focus', 'Deep Focus', DeepFocus, 'Locked in on the build.'),
  face('curious', 'Curious', Curious, 'Wait... how does that work?'),
  face('bold', 'Bold Maker', BoldMaker, 'Knows the plan will work.'),
  face('chill', 'Easy Going', Chill, 'Calm hands, steady work.'),
  face('wow', 'Whoa!', Wow, 'It actually launched!'),
  face('giggle', 'Giggle', Giggle, 'Something just went hilariously right.'),
];

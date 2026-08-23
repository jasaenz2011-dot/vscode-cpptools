'use client';

import { useCallback, useMemo, useRef } from 'react';
import { GRADE_LABELS, GRADE_SHORT, buildRig } from '@/lib/rig';
import { play } from '@/lib/audio';
import { useStudio } from '@/lib/store';
import type { GradeStep } from '@/lib/types';

const STEPS: GradeStep[] = [0, 1, 2, 3, 4, 5, 6, 7, 8];

/** Stage units → a friendly centimetre readout for the blueprint annotation. */
function heightCm(units: number): number {
  return Math.round(108 + ((units - 236) / (372 - 236)) * 57);
}

function GearKnob({ grade }: { grade: number }) {
  const teeth = useMemo(() => Array.from({ length: 8 }, (_, i) => i * 45), []);
  return (
    <svg
      viewBox="-24 -24 48 48"
      className="h-full w-full drop-shadow-[0_3px_6px_rgba(0,0,0,0.7)]"
      aria-hidden="true"
      style={{
        transform: `rotate(${grade * 40}deg)`,
        transition: 'transform 420ms cubic-bezier(0.34, 1.4, 0.5, 1)',
      }}
    >
      <g fill="#b45309">
        {teeth.map((a) => (
          <rect key={a} x={-4} y={-22} width={8} height={9} rx={2} transform={`rotate(${a})`} />
        ))}
        <circle r={15} />
      </g>
      <g fill="#f59e0b">
        {teeth.map((a) => (
          <rect key={a} x={-3.4} y={-21.4} width={6.8} height={8} rx={2} transform={`rotate(${a})`} />
        ))}
        <circle r={13.6} />
      </g>
      <circle r={6.2} fill="#0f172a" />
      <circle r={2.6} fill="#fbbf24" />
    </svg>
  );
}

export function GradeSlider() {
  const grade = useStudio((s) => s.present.grade);
  const setGrade = useStudio((s) => s.setGrade);
  const lastPlayed = useRef(grade);

  const rig = useMemo(() => buildRig(grade), [grade]);
  const pct = (grade / 8) * 100;

  const commit = useCallback(
    (next: number) => {
      const clamped = Math.min(8, Math.max(0, Math.round(next))) as GradeStep;
      setGrade(clamped);
      if (lastPlayed.current !== clamped) {
        lastPlayed.current = clamped;
        play('ratchet');
      }
    },
    [setGrade],
  );

  return (
    <div className="border-t border-steel-light/50 bg-pitch/70 px-4 pt-3 pb-4 sm:px-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="h-7 w-7 shrink-0 sm:h-8 sm:w-8">
            <GearKnob grade={grade} />
          </span>
          <div>
            <p className="stencil text-[11px] leading-tight text-chalk/90">Grade Growth Engine</p>
            <p className="font-blueprint text-[9px] tracking-[0.18em] text-concrete/60 uppercase">
              K → 8 · live re-rig
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="stencil text-[13px] leading-tight text-hazard sm:text-[15px]">
            {GRADE_LABELS[grade]}
          </p>
          <p className="font-blueprint text-[9.5px] tracking-[0.16em] text-cobalt-light/80">
            ≈ {heightCm(rig.height)} CM TALL
          </p>
        </div>
      </div>

      <div className="relative h-11">
        {/* Track */}
        <div className="absolute inset-x-1 top-1/2 h-3 -translate-y-1/2 overflow-hidden rounded-full border border-pitch-deep bg-steel shadow-[inset_0_2px_5px_rgba(0,0,0,0.75)]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-hazard-deep via-hazard to-hazard-glow"
            style={{ width: `${pct}%`, transition: 'width 420ms cubic-bezier(0.22, 1, 0.36, 1)' }}
          />
        </div>

        {/* Notches */}
        <div className="pointer-events-none absolute inset-x-1 top-1/2 flex -translate-y-1/2 justify-between px-[2px]">
          {STEPS.map((step) => (
            <span
              key={step}
              className={`h-3.5 w-[2px] rounded-full transition-colors duration-200 ${
                step <= grade ? 'bg-pitch-deep/70' : 'bg-steel-lighter/70'
              }`}
            />
          ))}
        </div>

        {/* Knob */}
        <div
          className="pointer-events-none absolute top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `calc(4px + (100% - 8px) * ${grade / 8})`,
            transition: 'left 420ms cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          <GearKnob grade={grade} />
        </div>

        <input
          type="range"
          min={0}
          max={8}
          step={1}
          value={grade}
          onChange={(event) => commit(Number(event.target.value))}
          aria-label="Grade level"
          aria-valuetext={GRADE_LABELS[grade]}
          className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
        />
      </div>

      <div className="mt-1 flex justify-between px-[3px]">
        {STEPS.map((step) => (
          <button
            key={step}
            type="button"
            onClick={() => commit(step)}
            aria-label={GRADE_LABELS[step]}
            aria-current={step === grade}
            className={`h-6 w-6 rounded-md text-[11px] font-bold transition-all duration-200 ${
              step === grade
                ? 'scale-110 bg-hazard text-pitch shadow-[0_0_14px_rgba(245,158,11,0.55)]'
                : 'text-concrete/55 hover:bg-steel hover:text-chalk'
            }`}
          >
            {GRADE_SHORT[step]}
          </button>
        ))}
      </div>
    </div>
  );
}

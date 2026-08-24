'use client';

import { useMemo } from 'react';
import { GRADE_LABELS } from '@/lib/rig';
import { TRAITS, getTrait } from '@/lib/catalog';
import { readableInk, shade } from '@/lib/color';
import { play } from '@/lib/audio';
import { useStudio } from '@/lib/store';
import { AvatarScene } from '../stage/AvatarFigure';

function RegistrationMarks() {
  const corners = [
    'top-2.5 left-2.5 border-t-2 border-l-2',
    'top-2.5 right-2.5 border-t-2 border-r-2',
    'bottom-2.5 left-2.5 border-b-2 border-l-2',
    'bottom-2.5 right-2.5 border-b-2 border-r-2',
  ];
  return (
    <>
      {corners.map((cls) => (
        <span
          key={cls}
          aria-hidden="true"
          className={`pointer-events-none absolute h-4 w-4 border-blueprint/55 ${cls}`}
        />
      ))}
    </>
  );
}

/**
 * The live Be ME! badge. Deliberately mirrors the canvas layout in
 * `lib/export.ts`, so the download is what the student was just looking at.
 */
export function IdentityCard() {
  const config = useStudio((s) => s.present);
  const setIdentity = useStudio((s) => s.setIdentity);
  const trait = getTrait(config.identity.traitId);
  const traitInk = useMemo(() => readableInk(trait.color), [trait.color]);

  return (
    <div className="flex flex-col gap-3">
      <div className="plate rivets relative mx-auto w-full max-w-[330px] overflow-hidden !rounded-2xl p-2.5">
        {/* Header */}
        <div className="caution-tape relative flex h-10 items-center justify-between overflow-hidden rounded-lg px-1.5">
          <span className="flex h-[30px] w-[56%] items-center rounded-md bg-pitch-deep px-3">
            <span className="stencil text-[15px] tracking-[0.06em] text-hazard">BE ME!</span>
          </span>
          <span className="flex h-[30px] w-[39%] flex-col justify-center rounded-md bg-pitch-deep px-2.5 text-right">
            <span className="font-blueprint text-[7.5px] leading-tight tracking-[0.18em] text-concrete/70">
              STUDENT
            </span>
            <span className="font-blueprint text-[7.5px] leading-tight tracking-[0.18em] text-chalk">
              BUILD ID
            </span>
          </span>
        </div>

        {/* Avatar window */}
        <div className="relative mt-2.5 aspect-[280/360] overflow-hidden rounded-xl border-2 border-steel-lighter/70 bg-[#0d1b34]">
          <AvatarScene
            config={config}
            idle={false}
            preserveAspectRatio="xMidYMax slice"
            className="h-full w-full"
            title="Badge portrait"
          />
          <RegistrationMarks />
        </div>

        {/* Details */}
        <div className="px-1 pt-3 text-center">
          <label className="font-blueprint block text-[8px] tracking-[0.28em] text-concrete/60 uppercase">
            Builder Name
            <input
              type="text"
              value={config.identity.name}
              maxLength={28}
              placeholder="Your Name"
              onChange={(event) => setIdentity({ name: event.target.value })}
              className="mt-1 block w-full rounded-md border border-transparent bg-transparent px-1 py-0.5 text-center font-[family-name:var(--font-display)] text-[26px] tracking-normal text-chalk normal-case transition-colors placeholder:text-concrete/30 hover:border-steel-lighter/50 focus:border-hazard/70 focus:outline-none"
            />
          </label>

          <p className="font-blueprint mt-1 text-[10.5px] tracking-[0.22em] text-hazard uppercase">
            {GRADE_LABELS[config.grade]}
          </p>

          <p
            className="mx-auto mt-2.5 inline-flex max-w-full items-center rounded-full border-2 px-4 py-1.5 text-[13.5px] leading-tight font-bold"
            style={{
              background: trait.color,
              color: traitInk,
              borderColor: shade(trait.color, 0.45),
            }}
          >
            <span className="truncate">{trait.label}</span>
          </p>
        </div>

        {/* Footer */}
        <div className="relative mt-3 flex items-center gap-2 overflow-hidden rounded-lg border border-steel-light/70 bg-pitch-deep px-2 py-2">
          <span className="caution-tape absolute inset-y-0 left-0 w-2" aria-hidden="true" />
          <label className="ml-2 min-w-0 flex-1 text-left">
            <span className="font-blueprint block text-[7.5px] tracking-[0.22em] text-concrete/60 uppercase">
              Issued by
            </span>
            <input
              type="text"
              value={config.identity.school}
              maxLength={32}
              placeholder="Maker Lab"
              onChange={(event) => setIdentity({ school: event.target.value })}
              className="mt-0.5 block w-full rounded border border-transparent bg-transparent text-[13px] font-[family-name:var(--font-display)] tracking-wide text-chalk uppercase transition-colors placeholder:text-concrete/30 hover:border-steel-lighter/50 focus:border-hazard/70 focus:outline-none"
            />
          </label>
          <span
            className="shrink-0 -rotate-[9deg] rounded-md border-2 border-hazard/85 px-2 py-0.5 text-center text-hazard/85"
            aria-hidden="true"
          >
            <span className="stencil block text-[9px] leading-tight">APPROVED</span>
            <span className="font-blueprint block text-[6px] leading-tight tracking-[0.12em]">
              MAKER PROGRAM
            </span>
          </span>
        </div>
      </div>

      {/* Trait picker */}
      <div className="px-0.5">
        <p className="font-blueprint mb-2 text-[9px] tracking-[0.2em] text-concrete/60 uppercase">
          Core Trait · Superpower
        </p>
        <div className="flex flex-wrap gap-1.5">
          {TRAITS.map((option) => {
            const active = option.id === config.identity.traitId;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  setIdentity({ traitId: option.id });
                  play('click');
                }}
                aria-pressed={active}
                title={option.blurb}
                className={`rounded-full border px-2.5 py-1 text-[11px] font-bold transition-all duration-150 ease-[var(--ease-spring)] active:scale-95 ${
                  active ? 'border-transparent' : 'border-steel-light/50 text-concrete/70 hover:text-chalk'
                }`}
                style={
                  active
                    ? { background: option.color, color: readableInk(option.color) }
                    : undefined
                }
              >
                {option.label}
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-[11.5px] leading-snug text-concrete/60 italic">{trait.blurb}</p>
      </div>
    </div>
  );
}

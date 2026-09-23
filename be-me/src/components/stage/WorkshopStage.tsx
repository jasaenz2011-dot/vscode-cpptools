'use client';

import { useMemo } from 'react';
import { STAGE_H, STAGE_W, buildRig } from '@/lib/rig';
import { useStudio } from '@/lib/store';
import { getItem, getTrait } from '@/lib/catalog';
import { AvatarFigure } from './AvatarFigure';
import { GradeSlider } from './GradeSlider';
import { useStageRef } from './stage-ref';

function CornerBrackets() {
  const corners = [
    'top-2 left-2 border-t-2 border-l-2',
    'top-2 right-2 border-t-2 border-r-2',
    'bottom-2 left-2 border-b-2 border-l-2',
    'bottom-2 right-2 border-b-2 border-r-2',
  ];
  return (
    <>
      {corners.map((cls) => (
        <span
          key={cls}
          aria-hidden="true"
          className={`pointer-events-none absolute h-6 w-6 border-hazard/70 ${cls}`}
        />
      ))}
    </>
  );
}

export function WorkshopStage() {
  const config = useStudio((s) => s.present);
  const gridOn = useStudio((s) => s.gridOn);
  const svgRef = useStageRef();

  const rig = useMemo(() => buildRig(config.grade), [config.grade]);
  const trait = getTrait(config.identity.traitId);
  const bgLabel = getItem('background', config.items.background)?.label ?? 'Open Site';

  // The figure's bounding box as a percentage of the stage, for the HUD ruler.
  const topPct = ((STAGE_H - rig.height - 8) / STAGE_H) * 100;
  const bottomPct = ((STAGE_H - rig.groundY) / STAGE_H) * 100;

  return (
    <div className={`plate rivets flex min-h-0 flex-col overflow-hidden ${gridOn ? '' : 'grid-off'}`}>
      <header className="relative flex items-center justify-between gap-3 border-b border-steel-light/60 bg-pitch/70 py-2 pr-4 pl-6">
        <span
          aria-hidden="true"
          className="absolute top-2 bottom-2 left-2 w-[3px] rounded-full bg-hazard shadow-[0_0_12px_#f59e0b]"
        />
        <h2 className="stencil text-[13px] text-chalk/95">Workshop Stage</h2>
        <span className="font-blueprint truncate text-[10px] tracking-[0.16em] text-concrete/70 uppercase">
          Site: {bgLabel}
        </span>
      </header>

      <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-pitch-deep px-3 py-4 sm:px-6 sm:py-5">
        {/* The workshop wall behind the sheet. */}
        <div className="blueprint-field pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_45%,transparent,rgba(6,13,28,0.85))]"
          aria-hidden="true"
        />

        {/* The blueprint sheet: everything inside it is exactly what exports.
            Sizing is width-driven so the sheet can never collapse if an
            ancestor's height chain changes. The annotations are flex siblings
            rather than absolute overlays, so they cannot collide with the art
            at any width. */}
        <div className="relative flex w-full items-stretch justify-center">
          <div
            className="font-blueprint hidden shrink-0 basis-[104px] pt-1 pr-4 text-[9px] leading-relaxed tracking-[0.14em] text-blueprint/45 uppercase xl:block"
            aria-hidden="true"
          >
            <p>SHEET 01</p>
            <p>FIGURE RIG</p>
            <p className="mt-1 text-blueprint/30">
              {STAGE_W} × {STAGE_H} U
            </p>
          </div>

          <div className="relative w-full max-w-[min(54vh,470px)] self-center">
            <svg
              ref={svgRef}
              viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
              className="block h-auto w-full rounded-lg shadow-[0_28px_60px_-20px_rgba(0,0,0,0.9),0_0_0_1px_rgba(125,211,252,0.22)]"
              role="img"
              aria-label={`Avatar preview: ${trait.label}, ${bgLabel}`}
              shapeRendering="geometricPrecision"
            >
              <AvatarFigure config={config} overlay={gridOn} />
            </svg>

            <CornerBrackets />

            {/* Scanline sweeps the sheet only. */}
            <div
              className="pointer-events-none absolute inset-0 overflow-hidden rounded-lg"
              aria-hidden="true"
            >
              <div className="scanline motion-safe:animate-scan h-10 w-full opacity-35" />
            </div>

            {/* Height dimension line, pinned to the figure's actual extents. */}
            <div
              className="pointer-events-none absolute -left-4 w-3 sm:-left-5 sm:w-4"
              style={{
                top: `${topPct}%`,
                bottom: `${bottomPct}%`,
                transition:
                  'top 620ms cubic-bezier(0.22, 1, 0.36, 1), bottom 620ms cubic-bezier(0.22, 1, 0.36, 1)',
              }}
              aria-hidden="true"
            >
              <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-hazard/60" />
              <span className="absolute top-0 left-0 h-px w-full bg-hazard/80" />
              <span className="absolute bottom-0 left-0 h-px w-full bg-hazard/80" />
            </div>
          </div>

          <div
            className="font-blueprint hidden shrink-0 basis-[104px] flex-col justify-end pb-1 pl-4 text-right text-[9px] leading-relaxed tracking-[0.14em] text-blueprint/45 uppercase xl:flex"
            aria-hidden="true"
          >
            <p className="text-blueprint/30">TRAIT</p>
            <p className="break-words">{trait.label}</p>
            <p className="mt-1 text-blueprint/30">SCALE 1:1</p>
          </div>
        </div>
      </div>

      <GradeSlider />
    </div>
  );
}

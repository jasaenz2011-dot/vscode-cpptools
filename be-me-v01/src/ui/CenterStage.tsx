import { useMemo } from 'react';
import { AvatarStage } from '../engine/AvatarStage';
import type { LayerReport } from '../engine/LayerImage';
import type { ManifestIndex } from '../engine/manifest';
import { VIEWS } from '../data/styles';
import { ART_STYLES } from '../data/styles';
import type { ArtStyleId, BodyBase, ViewId } from '../data/types';
import type { CustomizeCategory } from '../config/layers';
import { AlertIcon, RotateIcon } from './icons';

interface CenterStageProps {
  manifest: ManifestIndex;
  style: ArtStyleId;
  bodyBase: BodyBase;
  view: ViewId;
  selection: Record<CustomizeCategory, string | null>;
  reports: LayerReport[];
  onView: (view: ViewId) => void;
  onReports: (reports: LayerReport[]) => void;
}

export function CenterStage({
  manifest,
  style,
  bodyBase,
  view,
  selection,
  reports,
  onView,
  onReports,
}: CenterStageProps) {
  const current = VIEWS.find((v) => v.id === view) ?? VIEWS[0]!;
  const styleName = ART_STYLES.find((s) => s.id === style)?.name ?? style;

  const mismatches = useMemo(() => reports.filter((r) => r.sizeMismatch), [reports]);

  return (
    <section className="relative flex h-full min-h-0 flex-col">
      {/* Stage caption */}
      <div className="flex shrink-0 items-baseline justify-between gap-3 px-1 pb-2">
        <div>
          <p className="label-dim">Current Style</p>
          <p className="font-display text-[15px] font-700 tracking-[0.2em] text-cyan uppercase">
            {styleName}
          </p>
        </div>
        <div className="text-right">
          <p className="label-dim">Live Preview</p>
          <p className="font-display text-[15px] font-700 tracking-[0.2em] text-gold uppercase">
            {current.label}
          </p>
        </div>
      </div>

      {/* Presentation area */}
      <div className="frame cut-corner corner-ticks relative flex min-h-0 flex-1 items-center justify-center overflow-hidden">
        <StageBackdrop />

        {current.enabled ? (
          <div className="relative z-10 flex h-full w-full items-end justify-center pb-[5%]">
            <div className="relative h-[94%]">
              <AvatarStage
                manifest={manifest}
                style={style}
                bodyBase={bodyBase}
                view={view}
                selection={selection}
                onReports={onReports}
              />
            </div>
            <Platform />
          </div>
        ) : (
          <ViewUnavailable label={current.label} requirement={current.requirement} />
        )}

        {mismatches.length > 0 ? <CalibrationWarning reports={mismatches} /> : null}
      </div>

      {/* View switcher */}
      <div className="mt-3 flex shrink-0 items-center justify-center gap-2">
        {VIEWS.map((option) => {
          const active = option.id === view;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onView(option.id)}
              aria-pressed={active}
              title={option.enabled ? option.label : `${option.label} — ${option.requirement}`}
              className={`cut-corner-sm relative min-w-[56px] px-3 py-2 font-display text-[11px] font-700 tracking-[0.18em] uppercase transition-all duration-200 ease-[var(--ease-soft)] ${
                active
                  ? 'border border-gold/70 bg-gradient-to-b from-gold/22 to-transparent text-gold-bright'
                  : option.enabled
                    ? 'border border-white/10 bg-white/[0.02] text-white/55 hover:border-gold/35 hover:text-white/85'
                    : 'border border-white/6 bg-transparent text-white/22'
              }`}
            >
              {option.id === 'turntable' ? (
                <span className="flex items-center justify-center gap-1.5">
                  <RotateIcon className="text-[12px]" />
                  360
                </span>
              ) : (
                option.label
              )}
              {!option.enabled ? (
                <span
                  aria-hidden="true"
                  className="absolute -top-1 -right-1 h-1.5 w-1.5 rounded-full bg-white/25"
                />
              ) : null}
            </button>
          );
        })}
      </div>
    </section>
  );
}

/** Circuitry, vignette and ambient colour behind the character. */
function StageBackdrop() {
  return (
    <>
      <div className="circuitry pointer-events-none absolute inset-0" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 48% 44% at 50% 46%, rgba(79,214,255,0.16), transparent 70%)',
        }}
      />
      {/* Arched frame, echoing the reference stage. */}
      <div
        className="pointer-events-none absolute inset-x-[7%] top-[2.5%] bottom-[8%] rounded-t-full border border-gold/30"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-[11%] top-[5.5%] bottom-[8%] rounded-t-full border border-cyan/16"
        aria-hidden="true"
      />
      <div
        className="motion-safe:animate-sheen pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 34% 20% at 50% 90%, rgba(79,214,255,0.30), transparent 72%)',
        }}
      />
    </>
  );
}

/** The glowing circular platform the character stands on. */
function Platform() {
  return (
    <div
      className="pointer-events-none absolute bottom-[4%] left-1/2 -translate-x-1/2"
      aria-hidden="true"
      style={{ width: '62%', aspectRatio: '3 / 1' }}
    >
      <div className="motion-safe:animate-breathe absolute inset-0 rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(79,214,255,0.30),transparent_66%)]" />
      <div className="absolute inset-[14%] rounded-[50%] border border-cyan/35 shadow-[0_0_28px_-6px_var(--color-cyan)]" />
      <div className="motion-safe:animate-platform-spin absolute inset-[22%] rounded-[50%] border border-dashed border-cyan/25" />
      <div className="motion-safe:animate-platform-spin-rev absolute inset-[34%] rounded-[50%] border border-gold/25" />
      <div className="absolute inset-[44%] rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(217,164,65,0.35),transparent_70%)]" />
    </div>
  );
}

function ViewUnavailable({ label, requirement }: { label: string; requirement: string }) {
  return (
    <div className="relative z-10 max-w-sm px-8 text-center">
      <p className="font-display text-[13px] tracking-[0.34em] text-white/40 uppercase">
        {label} view unavailable
      </p>
      <div className="rule-gold my-4" />
      <p className="text-[12.5px] leading-relaxed text-white/45">{requirement}</p>
      <p className="mt-4 text-[11px] tracking-[0.14em] text-white/25 uppercase">
        Architecture ready · awaiting assets
      </p>
    </div>
  );
}

function CalibrationWarning({ reports }: { reports: LayerReport[] }) {
  return (
    <div className="absolute inset-x-3 bottom-3 z-40 border border-amber-400/40 bg-black/85 px-3 py-2 backdrop-blur-sm">
      <p className="flex items-center gap-2 font-display text-[10px] tracking-[0.22em] text-amber-300 uppercase">
        <AlertIcon className="text-[13px]" />
        Off-canvas asset · not corrected
      </p>
      <ul className="mt-1.5 space-y-0.5">
        {reports.slice(0, 3).map((r) => (
          <li key={r.src} className="font-mono text-[10.5px] text-white/50">
            {r.slot}/{r.assetId}: {r.sizeMismatch?.got} — master canvas is {r.sizeMismatch?.expected}
          </li>
        ))}
      </ul>
    </div>
  );
}

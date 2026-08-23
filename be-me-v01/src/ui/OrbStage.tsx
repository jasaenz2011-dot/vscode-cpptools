import { useMemo } from 'react';
import { AvatarStage } from '../engine/AvatarStage';
import type { LayerReport } from '../engine/LayerImage';
import type { ManifestIndex } from '../engine/manifest';
import { VIEWS } from '../data/styles';
import type { ArtStyleId, BodyBase, ViewId } from '../data/types';
import type { CustomizeCategory } from '../config/layers';
import { AlertIcon, ArrowIcon, ChevronIcon, RotateIcon } from './icons';

interface OrbStageProps {
  manifest: ManifestIndex;
  style: ArtStyleId;
  bodyBase: BodyBase;
  view: ViewId;
  selection: Record<CustomizeCategory, string | null>;
  reports: LayerReport[];
  onView: (view: ViewId) => void;
  onReports: (reports: LayerReport[]) => void;
  onLaunch: () => void;
}

export function OrbStage({
  manifest,
  style,
  bodyBase,
  view,
  selection,
  reports,
  onView,
  onReports,
  onLaunch,
}: OrbStageProps) {
  const current = VIEWS.find((v) => v.id === view) ?? VIEWS[0]!;
  const mismatches = useMemo(() => reports.filter((r) => r.sizeMismatch), [reports]);
  const turntable = VIEWS.find((v) => v.id === 'turntable')!;

  return (
    <section className="flex h-full min-h-0 flex-col">
      <div className="relative flex min-h-0 flex-1 items-center justify-center">
        <OrbBackdrop />

        {/* 360 widget — the hex badge from the reference. Disabled, and says why.
            The rig telemetry that used to float here now lives inside panel 03,
            where it is framed rather than loose on the backdrop. */}
        <div className="absolute top-[16%] right-0 hidden 2xl:block">
          <button
            type="button"
            onClick={() => onView('turntable')}
            title={turntable.requirement}
            aria-label={`360 view — ${turntable.requirement}`}
            className="group block"
          >
            <span className="bezel hex block h-[92px] w-[82px] !p-[2px]">
              <span className="bezel-in hex grid h-full w-full place-items-center px-2 text-center">
                <span>
                  <span className="block font-display text-[19px] font-700 tracking-[0.02em] text-gold-bright">
                    360°
                  </span>
                  <span className="mx-auto my-1 flex items-center justify-center gap-1 text-cyan/60">
                    <ChevronIcon className="rotate-180 text-[9px]" />
                    <RotateIcon className="text-[10px]" />
                    <ChevronIcon className="text-[9px]" />
                  </span>
                  <span className="block font-display text-[6.5px] leading-tight tracking-[0.14em] text-white/34 uppercase">
                    Assets
                    <br />
                    required
                  </span>
                </span>
              </span>
            </span>
          </button>
        </div>

        {/* The orb */}
        <div className="relative flex h-full w-full items-center justify-center">
          {current.enabled ? (
            <div className="relative flex h-[86%] items-end justify-center">
              <OrbGlass />
              <div className="relative z-10 h-full">
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
        </div>

        {mismatches.length > 0 ? <CalibrationWarning reports={mismatches} /> : null}
      </div>

      {/* Launch */}
      <div className="shrink-0 pt-1 text-center">
        <button
          type="button"
          onClick={onLaunch}
          className="btn-launch notch group relative w-full max-w-[440px] px-6 py-3.5"
        >
          <span className="flex items-center justify-center gap-3 font-display text-[17px] font-700 tracking-[0.22em] uppercase">
            Launch Avatar
            <ArrowIcon className="text-[18px] transition-transform duration-200 group-hover:translate-x-1" />
          </span>
        </button>
        <p className="label-dim mt-2">Take your creation into the future</p>
      </div>
    </section>
  );
}

function OrbBackdrop() {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 50% 44% at 50% 42%, rgba(79,214,255,0.14), transparent 70%)',
        }}
      />
      <div
        className="motion-safe:animate-drift pointer-events-none absolute top-1/2 left-1/2 aspect-square w-[78%] -translate-x-1/2 -translate-y-[54%] rounded-full border border-dashed border-gold/10"
        aria-hidden="true"
      />
    </>
  );
}

/** The holographic sphere around the character. */
function OrbGlass() {
  return (
    <span
      className="pointer-events-none absolute top-[1%] left-1/2 aspect-square w-[152%] -translate-x-1/2"
      aria-hidden="true"
    >
      {/* Volume: a lit sphere, not just an outline. */}
      <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_36%_26%,rgba(255,255,255,0.16),rgba(79,214,255,0.11)_34%,rgba(79,214,255,0.04)_58%,transparent_72%)]" />
      <span className="absolute inset-0 rounded-full shadow-[inset_0_0_90px_-30px_rgba(79,214,255,0.65),0_0_80px_-30px_rgba(79,214,255,0.5)]" />
      {/* Rim */}
      <span className="absolute inset-0 rounded-full border border-cyan/45" />
      <span className="absolute inset-[2%] rounded-full border border-gold/28" />
      {/* Meridians */}
      <span className="motion-safe:animate-orb absolute inset-[6%] rounded-full border-t-2 border-b-2 border-gold/34" />
      <span
        className="motion-safe:animate-drift absolute inset-[6%] rounded-full border-l-2 border-r-2 border-cyan/32"
        style={{ animationDuration: '30s', animationDirection: 'reverse' }}
      />
      {/* Specular highlight */}
      <span className="absolute top-[12%] left-[18%] h-[16%] w-[24%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.30),transparent_70%)] blur-[2px]" />
    </span>
  );
}

/**
 * The projector platform: stacked machined decks with concentric light rings and
 * a beam rising into the stage, as in the supplied chrome reference.
 */
function Platform() {
  return (
    <span
      className="pointer-events-none absolute bottom-[-9%] left-1/2 -translate-x-1/2"
      aria-hidden="true"
      style={{ width: '138%', aspectRatio: '2.5 / 1' }}
    >
      {/* Projection beam: a cone widening down onto the deck, not a hard bar. */}
      <span
        className="absolute bottom-[44%] left-1/2 h-[540%] w-[78%] -translate-x-1/2 blur-[3px]"
        style={{
          clipPath: 'polygon(38% 0, 62% 0, 100% 100%, 0 100%)',
          background:
            'linear-gradient(to top, rgba(243,205,117,0.20), rgba(79,214,255,0.09) 44%, transparent 82%)',
        }}
      />

      {/* Ambient bloom */}
      <span className="motion-safe:animate-breathe absolute inset-[-16%] rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(79,214,255,0.24),transparent_62%)]" />

      {/* Lower deck */}
      <span className="absolute inset-x-[6%] bottom-0 h-[52%] rounded-[50%] bg-[linear-gradient(180deg,#2a313d,#12161e_58%,#080a0f)] shadow-[0_16px_40px_-14px_#000]" />
      <span className="absolute inset-x-[6%] bottom-[16%] h-[42%] rounded-[50%] border border-cyan/30 shadow-[0_0_26px_-8px_var(--color-cyan)]" />

      {/* Upper deck */}
      <span className="absolute inset-x-[14%] bottom-[26%] h-[52%] rounded-[50%] bg-[linear-gradient(180deg,#333b48,#161b25_60%,#0b0e14)]" />
      <span className="absolute inset-x-[14%] bottom-[26%] h-[52%] rounded-[50%] border-2 border-gold/50 shadow-[0_0_32px_-8px_var(--color-gold),inset_0_0_26px_-10px_var(--color-gold)]" />

      {/* Emitter face */}
      <span className="absolute inset-x-[20%] bottom-[40%] h-[40%] rounded-[50%] bg-[radial-gradient(ellipse_at_center,#1d2530_0%,#0d1119_62%,#080b10_100%)]" />
      <span className="motion-safe:animate-drift ring inset-x-[24%] bottom-[44%] top-auto h-[32%] border-dashed border-cyan/38" />
      <span
        className="motion-safe:animate-drift ring inset-x-[30%] bottom-[48%] top-auto h-[24%] border-gold/34"
        style={{ animationDuration: '34s', animationDirection: 'reverse' }}
      />
      <span className="absolute inset-x-[36%] bottom-[52%] h-[16%] rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(243,205,117,0.62),rgba(79,214,255,0.22)_58%,transparent_78%)]" />
    </span>
  );
}

function ViewUnavailable({ label, requirement }: { label: string; requirement: string }) {
  return (
    <div className="relative z-10 max-w-sm px-8 text-center">
      <p className="font-display text-[13px] tracking-[0.34em] text-white/42 uppercase">
        {label} view unavailable
      </p>
      <div className="rule-gold my-4" />
      <p className="text-[12.5px] leading-relaxed text-white/45">{requirement}</p>
      <p className="mt-4 font-display text-[10px] tracking-[0.18em] text-white/25 uppercase">
        Architecture ready · awaiting assets
      </p>
    </div>
  );
}

function CalibrationWarning({ reports }: { reports: LayerReport[] }) {
  return (
    <div className="absolute inset-x-4 bottom-2 z-40 border border-amber-400/45 bg-black/88 px-3 py-2 backdrop-blur-sm">
      <p className="flex items-center gap-2 font-display text-[9.5px] tracking-[0.22em] text-amber-300 uppercase">
        <AlertIcon className="text-[13px]" />
        Off-canvas asset · not corrected
      </p>
      <ul className="mt-1.5 space-y-0.5">
        {reports.slice(0, 3).map((r) => (
          <li key={r.src} className="font-mono text-[10px] text-white/50">
            {r.slot}/{r.assetId}: {r.sizeMismatch?.got} — master canvas is {r.sizeMismatch?.expected}
          </li>
        ))}
      </ul>
    </div>
  );
}

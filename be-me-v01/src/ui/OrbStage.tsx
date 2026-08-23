import { useMemo } from 'react';
import { AvatarStage } from '../engine/AvatarStage';
import type { LayerReport } from '../engine/LayerImage';
import type { ManifestIndex } from '../engine/manifest';
import { ART_STYLES, VIEWS } from '../data/styles';
import type { ArtStyleId, BodyBase, ViewId } from '../data/types';
import type { CustomizeCategory } from '../config/layers';
import { AlertIcon, ArrowIcon, RotateIcon } from './icons';

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
  const styleName = ART_STYLES.find((s) => s.id === style)?.name ?? style;
  const mismatches = useMemo(() => reports.filter((r) => r.sizeMismatch), [reports]);
  const turntable = VIEWS.find((v) => v.id === 'turntable')!;

  return (
    <section className="flex h-full min-h-0 flex-col">
      <div className="relative flex min-h-0 flex-1 items-center justify-center">
        <OrbBackdrop />

        {/* Technical readout, left of the orb — reads the live rig, invents nothing. */}
        <dl
          className="pointer-events-none absolute top-[16%] left-0 hidden w-[124px] space-y-1 2xl:block"
          aria-hidden="true"
        >
          <Readout k="STYLE" v={styleName} />
          <Readout k="BASE" v={bodyBase} />
          <Readout k="VIEW" v={current.label} />
          <Readout k="LAYERS" v={String(reports.filter((r) => r.status === 'ready').length)} />
        </dl>

        {/* 360 control, right of the orb. Disabled and says why. */}
        <div className="absolute top-[18%] right-0 hidden text-right 2xl:block">
          <button
            type="button"
            onClick={() => onView('turntable')}
            title={turntable.requirement}
            className="group block"
          >
            <span className="block font-display text-[26px] font-700 tracking-[0.04em] text-white/72 transition-colors group-hover:text-gold-bright">
              360°
            </span>
            <span className="mt-0.5 flex items-center justify-end gap-1 text-cyan/55">
              <RotateIcon className="text-[11px]" />
              <span className="font-display text-[8px] tracking-[0.2em] uppercase">
                Assets required
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
          className="btn-launch cut-corner group relative w-full max-w-[430px] px-6 py-3.5"
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

function Readout({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between gap-2 border-b border-white/6 pb-0.5">
      <dt className="font-display text-[8px] tracking-[0.2em] text-white/25 uppercase">{k}</dt>
      <dd className="truncate font-display text-[9px] tracking-[0.1em] text-cyan/70 uppercase">
        {v}
      </dd>
    </div>
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

/** The mechanical platform with concentric light rings. */
function Platform() {
  return (
    <span
      className="pointer-events-none absolute bottom-[-6%] left-1/2 -translate-x-1/2"
      aria-hidden="true"
      style={{ width: '130%', aspectRatio: '3 / 1' }}
    >
      {/* Ambient bloom */}
      <span className="motion-safe:animate-breathe absolute inset-[-14%] rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(79,214,255,0.26),transparent_62%)]" />
      {/* Machined deck */}
      <span className="absolute inset-[4%] rounded-[50%] bg-[radial-gradient(ellipse_at_center,#1b2130_0%,#0d111a_58%,#070a10_100%)] shadow-[0_18px_40px_-14px_#000]" />
      <span className="absolute inset-[4%] rounded-[50%] border-2 border-gold/55 shadow-[0_0_34px_-6px_var(--color-gold),inset_0_0_28px_-10px_var(--color-gold)]" />
      {/* Concentric light rings */}
      <span className="motion-safe:animate-drift ring inset-[15%] border-dashed border-cyan/34" />
      <span
        className="motion-safe:animate-drift ring inset-[25%] border-gold/28"
        style={{ animationDuration: '34s', animationDirection: 'reverse' }}
      />
      <span className="ring inset-[36%] border-cyan/40 shadow-[0_0_20px_-6px_var(--color-cyan)]" />
      {/* Core emitter */}
      <span className="absolute inset-[45%] rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(243,205,117,0.55),rgba(79,214,255,0.20)_55%,transparent_75%)]" />
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

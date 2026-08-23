import { AvatarStage } from '../engine/AvatarStage';
import type { ManifestIndex } from '../engine/manifest';
import type { LayerReport } from '../engine/LayerImage';
import { ART_STYLES, VIEWS } from '../data/styles';
import type { ArtStyleId, BodyBase, ViewId } from '../data/types';
import type { CustomizeCategory } from '../config/layers';
import { MASTER_CANVAS, UNCALIBRATED_ANCHORS, isCalibrated } from '../config/canvas';
import { SectionHeader } from './SectionHeader';
import { Bezel } from './Bezel';
import { ChevronIcon, LockIcon } from './icons';

interface PreviewPanelProps {
  manifest: ManifestIndex;
  style: ArtStyleId;
  bodyBase: BodyBase;
  view: ViewId;
  selection: Record<CustomizeCategory, string | null>;
  reports: LayerReport[];
  onView: (view: ViewId) => void;
}

/**
 * LIVE PREVIEW — the turnaround strip, over the rig readout.
 *
 * FRONT renders the real composited avatar. The other angles are NOT the front
 * artwork mirrored, rotated or skewed: each is an empty bay stating the artwork
 * it needs. Faking a turnaround from one flat PNG is exactly what the brief
 * forbids, so the strip shows the truth instead.
 *
 * Beneath it, the readout reports the live state of the rig — canvas, layer
 * count, anchor calibration. Every value is measured from what is actually
 * loaded; none of it is decorative.
 */
export function PreviewPanel({
  manifest,
  style,
  bodyBase,
  view,
  selection,
  reports,
  onView,
}: PreviewPanelProps) {
  const styleName = ART_STYLES.find((s) => s.id === style)?.name ?? style;
  const viewName = VIEWS.find((v) => v.id === view)?.label ?? view;
  const ready = reports.filter((r) => r.status === 'ready').length;
  const offCanvas = reports.filter((r) => r.sizeMismatch).length;
  const calibrated = isCalibrated(UNCALIBRATED_ANCHORS);

  return (
    <Bezel className="min-h-0 flex-1">
      <SectionHeader number="03" title="Live Preview" accent={`Style: ${styleName}`} />

      <div className="relative flex min-h-0 flex-1 flex-col px-3 pt-3 pb-2">
        <div
          className="pointer-events-none absolute inset-x-6 top-16 h-10 rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(79,214,255,0.20),transparent_68%)]"
          aria-hidden="true"
        />

        {/* On shorter viewports the readout below is dropped rather than sliced
            by the frame, and the strip centres in the panel instead. */}
        <div className="my-auto shrink-0 2xl:my-0">
          <div className="relative flex items-end justify-center gap-1.5">
            <span
              aria-hidden="true"
              className="grid h-9 w-5 shrink-0 place-items-center text-gold/38"
            >
              <ChevronIcon className="rotate-180 text-[14px]" />
            </span>

            {VIEWS.filter((v) => v.id !== 'turntable').map((v) => {
              const isFront = v.id === 'front';
              const isActive = v.id === view;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => onView(v.id)}
                  aria-pressed={isActive}
                  aria-label={v.enabled ? `${v.label} view` : `${v.label} view — ${v.requirement}`}
                  title={v.enabled ? `${v.label} view` : v.requirement}
                  className={`slot-tile notch-sm group relative flex flex-col items-center transition-all duration-200 ease-[var(--ease-soft)] ${
                    isFront ? 'w-[70px]' : 'w-[50px]'
                  } ${isActive ? 'slot-tile-active' : 'hover:border-cyan/50'}`}
                >
                  <span
                    className={`relative block w-full overflow-hidden ${
                      isFront ? 'h-[88px]' : 'h-[70px]'
                    }`}
                  >
                    {v.enabled ? (
                      <span className="absolute inset-0 flex items-end justify-center pb-1">
                        <span className="relative h-[96%]">
                          <AvatarStage
                            manifest={manifest}
                            style={style}
                            bodyBase={bodyBase}
                            view={v.id}
                            selection={selection}
                          />
                        </span>
                      </span>
                    ) : (
                      <span aria-hidden="true" className="absolute inset-0 grid place-items-center">
                        <LockIcon className="text-[13px] text-white/18" />
                      </span>
                    )}
                  </span>
                  <span
                    className={`block w-full truncate py-0.5 text-center font-display text-[7.5px] font-600 tracking-[0.14em] uppercase ${
                      isActive ? 'text-gold-bright' : v.enabled ? 'text-white/55' : 'text-white/26'
                    }`}
                  >
                    {v.label}
                  </span>
                </button>
              );
            })}

            <span
              aria-hidden="true"
              className="grid h-9 w-5 shrink-0 place-items-center text-gold/38"
            >
              <ChevronIcon className="text-[14px]" />
            </span>
          </div>

          <p className="mt-2 text-center font-display text-[7.5px] tracking-[0.16em] text-white/26 uppercase">
            Front is live · other angles await their artwork
          </p>
        </div>

        <div className="rule-gold my-2.5 hidden shrink-0 2xl:block" />

        <p className="label-dim mb-1 hidden shrink-0 2xl:block">Rig Readout</p>

        <dl className="hidden min-h-0 flex-1 flex-col 2xl:flex">
          <Readout k="Base" v={bodyBase} />
          <Readout k="View" v={viewName} />
          <Readout k="Canvas" v={`${MASTER_CANVAS.width} × ${MASTER_CANVAS.height}`} />
          <Readout k="Layers Live" v={String(ready)} />
          <Readout
            k="Anchors"
            v={calibrated ? 'Calibrated' : 'Uncalibrated'}
            tone={calibrated ? 'ok' : 'idle'}
          />
          <Readout
            k="Off-canvas"
            v={offCanvas === 0 ? 'None' : `${offCanvas} asset${offCanvas === 1 ? '' : 's'}`}
            tone={offCanvas === 0 ? 'ok' : 'warn'}
          />
        </dl>
      </div>
    </Bezel>
  );
}

/**
 * One telemetry row. Rows stretch to fill the panel so the readout reads as an
 * instrument face rather than a block of text floating in dead space.
 */
function Readout({ k, v, tone = 'ok' }: { k: string; v: string; tone?: 'ok' | 'warn' | 'idle' }) {
  const value =
    tone === 'warn' ? 'text-amber-300' : tone === 'idle' ? 'text-white/38' : 'text-cyan/75';
  return (
    <div className="flex min-h-[17px] flex-1 items-center justify-between gap-2 border-b border-white/6 last:border-b-0">
      <dt className="font-display text-[8px] tracking-[0.2em] text-white/28 uppercase">{k}</dt>
      <dd className={`truncate font-display text-[9px] tracking-[0.1em] uppercase ${value}`}>{v}</dd>
    </div>
  );
}

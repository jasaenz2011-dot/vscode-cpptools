import { AvatarStage } from '../engine/AvatarStage';
import type { ManifestIndex } from '../engine/manifest';
import { ART_STYLES, VIEWS } from '../data/styles';
import type { ArtStyleId, BodyBase, ViewId } from '../data/types';
import type { CustomizeCategory } from '../config/layers';
import { SectionHeader } from './SectionHeader';
import { LockIcon } from './icons';

interface PreviewPanelProps {
  manifest: ManifestIndex;
  style: ArtStyleId;
  bodyBase: BodyBase;
  view: ViewId;
  selection: Record<CustomizeCategory, string | null>;
  onView: (view: ViewId) => void;
}

/**
 * LIVE PREVIEW — the turnaround strip.
 *
 * FRONT renders the real composited avatar. The other angles are NOT the front
 * artwork mirrored, rotated or skewed: each is an empty bay stating the artwork
 * it needs. Faking a turnaround from one flat PNG is exactly what the brief
 * forbids, so the strip shows the truth instead.
 */
export function PreviewPanel({
  manifest,
  style,
  bodyBase,
  view,
  selection,
  onView,
}: PreviewPanelProps) {
  const styleName = ART_STYLES.find((s) => s.id === style)?.name ?? style;

  return (
    <section className="plate-gold cut-corner flex shrink-0 flex-col">
      <SectionHeader number="03" title="Live Preview" accent={`Style: ${styleName}`} />

      <div className="relative px-3 py-3">
        <div
          className="pointer-events-none absolute inset-x-6 bottom-2 h-10 rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(79,214,255,0.20),transparent_68%)]"
          aria-hidden="true"
        />

        <div className="relative flex items-end justify-center gap-1.5">
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
                className={`cut-corner-sm group relative flex flex-col items-center transition-all duration-200 ease-[var(--ease-soft)] ${
                  isFront ? 'w-[74px]' : 'w-[52px]'
                } ${
                  isActive
                    ? 'border border-gold/70 bg-gradient-to-b from-gold/16 to-transparent'
                    : 'border border-white/8 bg-white/[0.02] hover:border-cyan/45'
                }`}
              >
                <span
                  className={`relative block w-full overflow-hidden bg-black/45 ${
                    isFront ? 'h-[92px]' : 'h-[74px]'
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
        </div>

        <p className="mt-2 text-center font-display text-[7.5px] tracking-[0.16em] text-white/26 uppercase">
          Front is live · other angles await their artwork
        </p>
      </div>
    </section>
  );
}

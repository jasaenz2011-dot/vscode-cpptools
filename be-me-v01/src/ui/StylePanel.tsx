import { useState } from 'react';
import { ART_STYLES, BODY_BASES, stylePreview } from '../data/styles';
import type { ArtStyle, ArtStyleId, BodyBase } from '../data/types';
import { ArrowIcon, LockIcon } from './icons';
import { SectionHeader } from './SectionHeader';

interface StylePanelProps {
  style: ArtStyleId;
  bodyBase: BodyBase;
  onStyle: (style: ArtStyleId) => void;
  onBodyBase: (base: BodyBase) => void;
}

export function StylePanel({ style, bodyBase, onStyle, onBodyBase }: StylePanelProps) {
  const live = ART_STYLES.filter((s) => s.enabled).length;

  return (
    <section className="plate-gold cut-corner flex min-h-0 flex-1 flex-col">
      <SectionHeader number="01" title="Choose Your" accent="Art Style" meta={`${live} / ${ART_STYLES.length} live`} />

      <div className="scroll-fade flex min-h-0 flex-1 flex-col justify-center overflow-y-auto px-3 py-3">
        <div className="grid grid-cols-3 gap-x-2.5 gap-y-4">
          {ART_STYLES.map((option) => (
            <StyleHex
              key={option.id}
              option={option}
              bodyBase={bodyBase}
              active={option.id === style}
              onSelect={() => option.enabled && onStyle(option.id)}
            />
          ))}
        </div>

        <button
          type="button"
          disabled
          title="The wider Genesis catalog is not declared yet — add entries to src/data/styles.ts"
          className="btn-ghost cut-corner-sm mt-4 flex w-full items-center justify-center gap-2 px-3 py-2.5 text-[10px]"
        >
          Explore All Genesis Styles
          <ArrowIcon className="text-[13px]" />
        </button>
      </div>

      <div className="shrink-0 border-t border-gold/16 px-3 py-2.5">
        <p className="label-dim mb-1.5">Body Base</p>
        <div className="grid grid-cols-2 gap-2">
          {BODY_BASES.map((option) => {
            const active = option.id === bodyBase;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => onBodyBase(option.id)}
                aria-pressed={active}
                className={`cut-corner-sm relative px-2 py-2.5 font-display text-[11.5px] font-700 tracking-[0.2em] uppercase transition-all duration-200 ease-[var(--ease-soft)] ${
                  active
                    ? 'border border-gold/75 bg-gradient-to-b from-gold/24 to-gold/[0.06] text-gold-bright shadow-[0_0_22px_-8px_var(--color-gold)]'
                    : 'border border-white/8 bg-white/[0.02] text-white/45 hover:border-gold/35 hover:text-white/80'
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/**
 * A hexagonal style tile.
 *
 * Cinematic 3D previews with its own delivered master. Every other style has no
 * artwork, so the tile shows a labelled locked slot — it does not borrow another
 * style's character to look populated.
 */
function StyleHex({
  option,
  bodyBase,
  active,
  onSelect,
}: {
  option: ArtStyle;
  bodyBase: BodyBase;
  active: boolean;
  onSelect: () => void;
}) {
  const preview = stylePreview(option.id, bodyBase);
  const [loaded, setLoaded] = useState(false);

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={!option.enabled}
      aria-current={active}
      aria-label={
        option.enabled ? `${option.name} art style` : `${option.name} — coming soon, no artwork yet`
      }
      title={option.enabled ? option.descriptor : 'Coming soon'}
      className={`group flex flex-col items-center gap-1.5 ${option.enabled ? '' : 'cursor-not-allowed'}`}
    >
      <span
        className={`hex relative block aspect-[0.88] w-full transition-all duration-200 ease-[var(--ease-soft)] ${
          active
            ? 'bg-gold p-[2px] shadow-[0_0_26px_-4px_var(--color-gold)]'
            : option.enabled
              ? 'bg-white/18 p-[1px] group-hover:bg-cyan/60'
              : 'bg-white/8 p-[1px]'
        }`}
      >
        <span className="hex relative block h-full w-full overflow-hidden bg-[#0b0f18]">
          {preview ? (
            <img
              src={preview}
              alt=""
              draggable={false}
              loading="lazy"
              decoding="async"
              onLoad={() => setLoaded(true)}
              className="absolute inset-x-0 top-[6%] mx-auto h-[112%] w-auto max-w-none object-contain"
              style={{ opacity: loaded ? 1 : 0, transition: 'opacity 240ms ease-out' }}
            />
          ) : null}

          {!loaded ? (
            <span aria-hidden="true" className="absolute inset-0 grid place-items-center">
              <LockIcon className="text-[16px] text-white/22" />
            </span>
          ) : null}

          {!option.enabled ? (
            <span
              aria-hidden="true"
              className="absolute inset-0 grid place-items-center bg-black/55"
            >
              <LockIcon className="text-[15px] text-gold/45" />
            </span>
          ) : null}
        </span>
      </span>

      <span className="w-full text-center leading-tight">
        <span
          className={`block font-display text-[9px] font-700 tracking-[0.16em] tabular-nums ${
            active ? 'text-gold' : 'text-white/28'
          }`}
        >
          {option.index}
        </span>
        <span
          className={`block truncate font-display text-[8.5px] font-600 tracking-[0.08em] uppercase ${
            active ? 'text-gold-bright' : option.enabled ? 'text-white/70' : 'text-white/32'
          }`}
        >
          {option.name}
        </span>
      </span>
    </button>
  );
}

import { useState } from 'react';
import { ART_STYLES, BODY_BASES, stylePreview } from '../data/styles';
import type { ArtStyle, ArtStyleId, BodyBase } from '../data/types';
import { ArrowIcon, LockIcon, TriangleIcon } from './icons';
import { SectionHeader } from './SectionHeader';
import { Bezel } from './Bezel';

const PAGE_SIZE = 6;

interface StylePanelProps {
  style: ArtStyleId;
  bodyBase: BodyBase;
  onStyle: (style: ArtStyleId) => void;
  onBodyBase: (base: BodyBase) => void;
}

export function StylePanel({ style, bodyBase, onStyle, onBodyBase }: StylePanelProps) {
  const [page, setPage] = useState(0);
  const pages = Math.max(1, Math.ceil(ART_STYLES.length / PAGE_SIZE));
  const visible = ART_STYLES.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);
  const live = ART_STYLES.filter((s) => s.enabled).length;

  return (
    <Bezel className="shrink-0">
      <SectionHeader
        number="01"
        title="Choose Your"
        accent="Art Style"
        meta={`${live} / ${ART_STYLES.length} live`}
      />

      <div className="flex flex-col px-2 py-3">
        <div className="flex items-center gap-1">
          <PageArrow
            dir="prev"
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
          />

          <div className="grid min-w-0 flex-1 grid-cols-3 gap-2">
            {visible.map((option) => (
              <StyleTile
                key={option.id}
                option={option}
                bodyBase={bodyBase}
                active={option.id === style}
                onSelect={() => option.enabled && onStyle(option.id)}
              />
            ))}
            {Array.from({ length: Math.max(0, PAGE_SIZE - visible.length) }, (_, i) => (
              <span
                key={`pad-${i}`}
                aria-hidden="true"
                className="slot-tile notch-sm aspect-[0.86] opacity-40"
              />
            ))}
          </div>

          <PageArrow
            dir="next"
            disabled={page >= pages - 1}
            onClick={() => setPage((p) => Math.min(pages - 1, p + 1))}
          />
        </div>

        <button
          type="button"
          disabled
          title="The wider Genesis catalog is not declared yet — add entries to src/data/styles.ts"
          className="btn-ghost notch-sm mt-4 flex w-full items-center justify-center gap-2 px-3 py-2.5 text-[10px]"
        >
          Explore All Styles
          <ArrowIcon className="text-[13px]" />
        </button>
      </div>

      <div className="shrink-0 border-t border-gold/22 px-3 py-2.5">
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
                className={`notch-sm relative px-2 py-2.5 font-display text-[11.5px] font-700 tracking-[0.2em] uppercase transition-all duration-200 ease-[var(--ease-soft)] ${
                  active
                    ? 'slot-tile slot-tile-active text-gold-bright'
                    : 'slot-tile text-white/45 hover:text-white/80'
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
    </Bezel>
  );
}

function PageArrow({
  dir,
  disabled,
  onClick,
}: {
  dir: 'prev' | 'next';
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === 'prev' ? 'Previous styles' : 'More styles'}
      title={dir === 'prev' ? 'Previous styles' : 'More styles'}
      className="grid h-10 w-6 shrink-0 place-items-center text-gold/70 transition-colors hover:text-gold-bright disabled:cursor-not-allowed disabled:text-white/12"
    >
      <TriangleIcon className={`text-[17px] ${dir === 'prev' ? 'rotate-180' : ''}`} />
    </button>
  );
}

/**
 * A style tile.
 *
 * Cinematic 3D previews with its own delivered master. Every other style has no
 * artwork, so the tile stays an empty locked slot — it does not borrow another
 * style's character to look populated.
 */
function StyleTile({
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
      className={`group flex flex-col items-center gap-1 ${option.enabled ? '' : 'cursor-not-allowed'}`}
    >
      <span
        className={`slot-tile notch-sm relative block aspect-[0.86] w-full overflow-hidden transition-all duration-200 ease-[var(--ease-soft)] ${
          active ? 'slot-tile-active' : option.enabled ? 'group-hover:border-cyan/60' : ''
        }`}
      >
        {preview ? (
          <img
            src={preview}
            alt=""
            draggable={false}
            loading="lazy"
            decoding="async"
            onLoad={() => setLoaded(true)}
            className="absolute inset-x-0 top-[5%] mx-auto h-[110%] w-auto max-w-none object-contain"
            style={{ opacity: loaded ? 1 : 0, transition: 'opacity 240ms ease-out' }}
          />
        ) : null}

        {!option.enabled ? (
          <span aria-hidden="true" className="absolute inset-0 grid place-items-center">
            <LockIcon className="text-[14px] text-gold/38" />
          </span>
        ) : null}
      </span>

      <span className="w-full text-center leading-tight">
        <span
          className={`block font-display text-[8.5px] font-700 tracking-[0.16em] tabular-nums ${
            active ? 'text-gold' : 'text-white/28'
          }`}
        >
          {option.index}
        </span>
        <span
          className={`block truncate font-display text-[8px] font-600 tracking-[0.06em] uppercase ${
            active ? 'text-gold-bright' : option.enabled ? 'text-white/70' : 'text-white/32'
          }`}
        >
          {option.name}
        </span>
      </span>
    </button>
  );
}

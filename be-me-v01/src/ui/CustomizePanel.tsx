import { useCallback, useRef, useState } from 'react';
import {
  CATEGORY_LABELS,
  CUSTOMIZE_CATEGORIES,
  OPTIONAL_SLOTS,
  type CustomizeCategory,
} from '../config/layers';
import type { ArtStyleId, AssetEntry, BodyBase, ViewId } from '../data/types';
import type { ManifestIndex } from '../engine/manifest';
import { SectionHeader } from './SectionHeader';
import { Bezel } from './Bezel';
import { BanIcon, CATEGORY_ICONS, CheckIcon, ChevronIcon } from './icons';

interface CustomizePanelProps {
  manifest: ManifestIndex;
  style: ArtStyleId;
  bodyBase: BodyBase;
  view: ViewId;
  active: CustomizeCategory;
  selection: Record<CustomizeCategory, string | null>;
  onCategory: (category: CustomizeCategory) => void;
  onSelect: (category: CustomizeCategory, assetId: string | null) => void;
}

/**
 * CUSTOMIZE EVERYTHING
 *
 * Category rail on the left, every category's options stacked as horizontal
 * rows on the right — matching the supplied reference, which shows several
 * groups at once rather than one at a time. Selecting a rail entry scrolls its
 * group into view.
 */
export function CustomizePanel({
  manifest,
  style,
  bodyBase,
  view,
  active,
  selection,
  onCategory,
  onSelect,
}: CustomizePanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const groupRefs = useRef<Partial<Record<CustomizeCategory, HTMLElement | null>>>({});

  const jumpTo = useCallback(
    (category: CustomizeCategory) => {
      onCategory(category);
      groupRefs.current[category]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
    [onCategory],
  );

  return (
    <Bezel className="min-h-0 flex-1">
      <SectionHeader number="02" title="Customize" accent="Everything" />

      <div className="grid min-h-0 flex-1 grid-cols-[104px_minmax(0,1fr)] xl:grid-cols-[122px_minmax(0,1fr)]">
        {/* Category rail */}
        <nav
          aria-label="Customisation categories"
          className="scroll-fade min-h-0 overflow-y-auto border-r border-gold/16 py-2"
        >
          {CUSTOMIZE_CATEGORIES.map((category) => {
            const Icon = CATEGORY_ICONS[category];
            const isActive = category === active;
            const filled = selection[category] !== null;
            return (
              <button
                key={category}
                type="button"
                onClick={() => jumpTo(category)}
                aria-pressed={isActive}
                className={`group relative flex w-full items-center gap-2 px-2.5 py-2 text-left transition-all duration-200 ease-[var(--ease-soft)] ${
                  isActive
                    ? 'bg-gradient-to-r from-gold/20 to-transparent text-gold-bright'
                    : 'text-white/42 hover:bg-white/[0.04] hover:text-white/78'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`absolute inset-y-0 left-0 w-[2px] ${
                    isActive ? 'bg-gold shadow-[0_0_10px_var(--color-gold)]' : 'bg-transparent'
                  }`}
                />
                <span
                  className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border transition-colors duration-200 ${
                    isActive
                      ? 'border-gold/80 bg-gold/16 text-gold-bright'
                      : 'border-white/14 text-white/45 group-hover:border-cyan/45'
                  }`}
                >
                  <Icon className="text-[12px]" />
                </span>
                <span className="min-w-0 flex-1 truncate font-display text-[8.5px] font-600 tracking-[0.04em] uppercase">
                  {CATEGORY_LABELS[category]}
                </span>
                {filled ? (
                  <span
                    aria-hidden="true"
                    className="h-1 w-1 shrink-0 rounded-full bg-cyan shadow-[0_0_6px_var(--color-cyan)]"
                  />
                ) : (
                  <ChevronIcon className="shrink-0 text-[10px] opacity-40" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Stacked option rows */}
        <div ref={scrollRef} className="scroll-fade min-h-0 overflow-y-auto px-2.5 py-2.5">
          {CUSTOMIZE_CATEGORIES.map((category) => {
            const options = manifest.list(style, bodyBase, category);
            return (
              <section
                key={category}
                ref={(el) => {
                  groupRefs.current[category] = el;
                }}
                className="mb-3.5 scroll-mt-2 last:mb-0"
              >
                <h3
                  className={`mb-1.5 font-display text-[8.5px] font-700 tracking-[0.26em] uppercase ${
                    category === active ? 'text-gold-bright' : 'text-white/34'
                  }`}
                >
                  {CATEGORY_LABELS[category]}
                </h3>

                {options.length === 0 ? (
                  <p className="text-[10.5px] text-white/28">
                    None declared for {style} / {bodyBase}.
                  </p>
                ) : (
                  <div className="grid grid-cols-4 gap-1.5">
                    {OPTIONAL_SLOTS.has(category) ? (
                      <NoneChip
                        label={CATEGORY_LABELS[category]}
                        selected={selection[category] === null}
                        onSelect={() => onSelect(category, null)}
                      />
                    ) : null}
                    {options.map((asset) => (
                      <OptionChip
                        key={asset.id}
                        asset={asset}
                        view={view}
                        selected={selection[category] === asset.id}
                        onSelect={() => onSelect(category, asset.id)}
                      />
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </div>
    </Bezel>
  );
}

/**
 * One selectable asset.
 *
 * Shows the real PNG when it exists. When the file is absent the chip becomes an
 * explicitly labelled EMPTY SLOT whose tooltip carries the exact drop path — it
 * never invents a stand-in image.
 */
function OptionChip({
  asset,
  view,
  selected,
  onSelect,
}: {
  asset: AssetEntry;
  view: ViewId;
  selected: boolean;
  onSelect: () => void;
}) {
  const src = asset.files[view] ?? asset.files.front ?? null;
  const [state, setState] = useState<'loading' | 'ready' | 'missing'>(src ? 'loading' : 'missing');

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      aria-label={
        state === 'missing' ? `${asset.name} — empty slot, artwork not yet supplied` : asset.name
      }
      title={state === 'missing' && src ? `Empty slot — drop art at ${src}` : asset.name}
      className={`slot-tile notch-sm group relative overflow-hidden transition-all duration-200 ease-[var(--ease-soft)] ${
        selected ? 'slot-tile-active' : 'hover:border-cyan/55'
      }`}
    >
      <span className="relative block aspect-square w-full overflow-hidden">
        {src ? (
          <img
            src={src}
            alt=""
            draggable={false}
            loading="lazy"
            decoding="async"
            onLoad={() => setState('ready')}
            onError={() => setState('missing')}
            className="absolute inset-x-0 top-[4%] mx-auto h-[124%] w-auto max-w-none object-contain"
            style={{ opacity: state === 'ready' ? 1 : 0, transition: 'opacity 200ms ease-out' }}
          />
        ) : null}

        {state !== 'ready' ? (
          <span aria-hidden="true" className="absolute inset-0 grid place-items-center px-1">
            <span className="block text-center">
              <span
                className="mx-auto mb-1 block h-4 w-4 rounded-full border border-dashed"
                style={{
                  borderColor: asset.swatch ?? 'rgba(255,255,255,0.2)',
                  background: asset.swatch ? `${asset.swatch}33` : 'transparent',
                }}
              />
              <span className="block font-display text-[6px] leading-tight tracking-[0.1em] text-white/28 uppercase">
                Empty
              </span>
            </span>
          </span>
        ) : null}

        {selected ? (
          <span className="absolute top-0.5 right-0.5 grid h-3.5 w-3.5 place-items-center rounded-full bg-gold text-black">
            <CheckIcon className="text-[9px]" />
          </span>
        ) : null}
      </span>

      <span
        className={`block w-full truncate px-1 py-0.5 text-center text-[8px] leading-tight font-500 ${
          selected ? 'text-gold-bright' : 'text-white/50 group-hover:text-white/80'
        }`}
      >
        {asset.name}
      </span>
    </button>
  );
}

function NoneChip({
  label,
  selected,
  onSelect,
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      aria-label={`No ${label.toLowerCase()}`}
      title={`Leave ${label.toLowerCase()} empty`}
      className={`slot-tile notch-sm overflow-hidden transition-all duration-200 ease-[var(--ease-soft)] ${
        selected ? 'slot-tile-active' : 'hover:border-cyan/55'
      }`}
    >
      <span className="grid aspect-square w-full place-items-center text-white/26">
        <BanIcon className="text-[16px]" />
      </span>
      <span
        className={`block w-full truncate px-1 py-0.5 text-center text-[8px] leading-tight font-500 ${
          selected ? 'text-gold-bright' : 'text-white/50'
        }`}
      >
        None
      </span>
    </button>
  );
}

import { useMemo, useState } from 'react';
import {
  CATEGORY_LABELS,
  CATEGORY_SHORT,
  CUSTOMIZE_CATEGORIES,
  OPTIONAL_SLOTS,
  type CustomizeCategory,
} from '../config/layers';
import type { ArtStyleId, AssetEntry, BodyBase, ViewId } from '../data/types';
import type { ManifestIndex } from '../engine/manifest';
import { PanelHeader } from './LeftPanel';
import { BanIcon, CATEGORY_ICONS, CheckIcon } from './icons';

interface RightPanelProps {
  manifest: ManifestIndex;
  style: ArtStyleId;
  bodyBase: BodyBase;
  view: ViewId;
  active: CustomizeCategory;
  selection: Record<CustomizeCategory, string | null>;
  onCategory: (category: CustomizeCategory) => void;
  onSelect: (category: CustomizeCategory, assetId: string | null) => void;
}

export function RightPanel({
  manifest,
  style,
  bodyBase,
  view,
  active,
  selection,
  onCategory,
  onSelect,
}: RightPanelProps) {
  const options = useMemo(
    () => manifest.list(style, bodyBase, active),
    [manifest, style, bodyBase, active],
  );

  return (
    <aside className="flex h-full min-h-0 flex-col gap-3">
      <section className="frame cut-corner corner-ticks flex min-h-0 flex-1 flex-col">
        <PanelHeader title="Customize" meta={CATEGORY_LABELS[active]} />

        {/* Category rail */}
        <nav
          aria-label="Customisation categories"
          className="grid shrink-0 grid-cols-4 gap-1 border-b border-gold/12 p-2"
        >
          {CUSTOMIZE_CATEGORIES.map((category) => {
            const Icon = CATEGORY_ICONS[category];
            const isActive = category === active;
            const filled = selection[category] !== null;
            return (
              <button
                key={category}
                type="button"
                onClick={() => onCategory(category)}
                aria-pressed={isActive}
                title={CATEGORY_LABELS[category]}
                className={`cut-corner-sm group relative flex flex-col items-center gap-1 px-1 py-2 transition-all duration-200 ease-[var(--ease-soft)] ${
                  isActive
                    ? 'border border-gold/70 bg-gradient-to-b from-gold/20 to-transparent text-gold-bright'
                    : 'border border-white/8 bg-white/[0.02] text-white/40 hover:border-gold/30 hover:text-white/75'
                }`}
              >
                <Icon className="text-[18px]" />
                <span className="w-full truncate text-center font-display text-[8.5px] font-600 tracking-[0.08em] uppercase">
                  {CATEGORY_SHORT[category]}
                </span>
                {filled ? (
                  <span
                    aria-hidden="true"
                    className="absolute top-1 right-1 h-1 w-1 rounded-full bg-cyan shadow-[0_0_6px_var(--color-cyan)]"
                  />
                ) : null}
              </button>
            );
          })}
        </nav>

        {/* Option grid */}
        <div className="scroll-fade min-h-0 flex-1 overflow-y-auto p-2">
          {options.length === 0 ? (
            <EmptyCategory category={active} style={style} bodyBase={bodyBase} />
          ) : (
            <div className="grid grid-cols-3 gap-1.5">
              {OPTIONAL_SLOTS.has(active) ? (
                <NoneChip
                  selected={selection[active] === null}
                  onSelect={() => onSelect(active, null)}
                  label={CATEGORY_LABELS[active]}
                />
              ) : null}
              {options.map((asset) => (
                <OptionChip
                  key={asset.id}
                  asset={asset}
                  view={view}
                  selected={selection[active] === asset.id}
                  onSelect={() => onSelect(active, asset.id)}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </aside>
  );
}

/**
 * One selectable asset.
 *
 * The thumbnail shows the real PNG when it exists. When the file is not there
 * yet the chip becomes an explicitly labelled EMPTY SLOT showing the path the
 * artist should drop the file into — it never invents a stand-in image.
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
      // Explicit name: the placeholder graphic is decorative and would
      // otherwise be read out as part of the option's accessible name.
      aria-label={state === 'missing' ? `${asset.name} — empty slot, artwork not yet supplied` : asset.name}
      title={state === 'missing' && src ? `Empty slot — drop art at ${src}` : asset.name}
      className={`cut-corner-sm group relative flex flex-col overflow-hidden transition-all duration-200 ease-[var(--ease-soft)] ${
        selected
          ? 'border border-gold bg-gradient-to-b from-gold/18 to-transparent shadow-[0_0_20px_-6px_var(--color-gold)]'
          : 'border border-white/8 bg-white/[0.02] hover:border-cyan/45 hover:bg-white/[0.05]'
      }`}
    >
      <span className="relative block aspect-square w-full overflow-hidden bg-black/45">
        {src ? (
          <img
            src={src}
            alt=""
            draggable={false}
            loading="lazy"
            decoding="async"
            onLoad={() => setState('ready')}
            onError={() => setState('missing')}
            className="absolute inset-0 h-full w-full object-contain object-top"
            style={{ opacity: state === 'ready' ? 1 : 0, transition: 'opacity 200ms ease-out' }}
          />
        ) : null}

        {state !== 'ready' ? (
          <span aria-hidden="true" className="absolute inset-0 grid place-items-center px-1">
            <span className="block text-center">
              <span
                className="mx-auto mb-1 block h-5 w-5 rounded-full border border-dashed"
                style={{
                  borderColor: asset.swatch ?? 'rgba(255,255,255,0.22)',
                  background: asset.swatch ? `${asset.swatch}33` : 'transparent',
                }}
              />
              <span className="block font-display text-[7px] leading-tight tracking-[0.12em] text-white/30 uppercase">
                Empty
                <br />
                slot
              </span>
            </span>
          </span>
        ) : null}

        {selected ? (
          <span className="absolute top-1 right-1 grid h-4 w-4 place-items-center rounded-full bg-gold text-black">
            <CheckIcon className="text-[10px]" />
          </span>
        ) : null}
      </span>

      <span
        className={`block w-full truncate px-1.5 py-1 text-center text-[9.5px] leading-tight font-500 ${
          selected ? 'text-gold-bright' : 'text-white/55 group-hover:text-white/85'
        }`}
      >
        {asset.name}
      </span>
    </button>
  );
}

function NoneChip({
  selected,
  onSelect,
  label,
}: {
  selected: boolean;
  onSelect: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      aria-label={`No ${label.toLowerCase()}`}
      title={`Leave ${label.toLowerCase()} empty`}
      className={`cut-corner-sm flex flex-col overflow-hidden transition-all duration-200 ease-[var(--ease-soft)] ${
        selected
          ? 'border border-gold bg-gradient-to-b from-gold/18 to-transparent'
          : 'border border-white/8 bg-white/[0.02] hover:border-cyan/45'
      }`}
    >
      <span className="grid aspect-square w-full place-items-center bg-black/45 text-white/28">
        <BanIcon className="text-[19px]" />
      </span>
      <span
        className={`block w-full truncate px-1.5 py-1 text-center text-[9.5px] leading-tight font-500 ${
          selected ? 'text-gold-bright' : 'text-white/55'
        }`}
      >
        None
      </span>
    </button>
  );
}

function EmptyCategory({
  category,
  style,
  bodyBase,
}: {
  category: CustomizeCategory;
  style: ArtStyleId;
  bodyBase: BodyBase;
}) {
  return (
    <div className="px-3 py-8 text-center">
      <p className="font-display text-[11px] tracking-[0.24em] text-white/35 uppercase">
        No {CATEGORY_LABELS[category]} declared
      </p>
      <div className="rule-gold my-3" />
      <p className="text-[11.5px] leading-relaxed text-white/35">
        Add entries to <code className="text-cyan/70">public/assets/manifest.json</code> for
      </p>
      <code className="mt-2 block font-mono text-[10.5px] break-all text-white/45">
        {style} / {bodyBase} / {category}
      </code>
    </div>
  );
}

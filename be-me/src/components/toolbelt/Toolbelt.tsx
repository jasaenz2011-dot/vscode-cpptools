'use client';

import { memo, useMemo } from 'react';
import { CATEGORIES, groupsForCategory } from '@/lib/catalog';
import { buildRig } from '@/lib/rig';
import { play } from '@/lib/audio';
import { paletteFor, useStudio } from '@/lib/store';
import type { AssetPalette, CatalogGroup, CatalogItem, CategoryId } from '@/lib/types';
import { BanIcon, GearIcon } from '../shell/icons';
import { ItemThumb } from './ItemThumb';
import { SkinToneStrip, SwatchPicker } from './SwatchPicker';

/* --------------------------------- tabs --------------------------------- */

interface TabProps {
  id: CategoryId;
  label: string;
  sub: string;
  accent: string;
  active: boolean;
  onSelect: (id: CategoryId) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
}

function Tab({ id, label, sub, accent, active, onSelect, onKeyDown }: TabProps) {
  return (
    <button
      type="button"
      role="tab"
      id={`toolbelt-tab-${id}`}
      aria-selected={active}
      aria-controls={`toolbelt-panel-${id}`}
      // Roving tabindex: the tablist is one tab stop, arrows move within it.
      tabIndex={active ? 0 : -1}
      onKeyDown={onKeyDown}
      onClick={() => onSelect(id)}
      className={`group relative flex min-w-0 flex-1 flex-col items-center gap-1 rounded-lg border px-1 py-2 transition-all duration-200 ${
        active
          ? 'border-transparent text-pitch shadow-[0_3px_0_0_rgba(0,0,0,0.5)]'
          : 'border-steel-light/40 bg-steel/60 text-concrete/70 hover:bg-steel hover:text-chalk'
      }`}
      style={active ? { background: accent } : undefined}
    >
      <GearIcon
        key={active ? `${id}-on` : `${id}-off`}
        className={`h-4 w-4 shrink-0 ${active ? 'motion-safe:animate-gear-kick' : 'opacity-70'}`}
      />
      {/* Wraps rather than truncates: a narrow tablet column would otherwise
          render "HARD H…" and lose the category name entirely. */}
      <span className="w-full text-center text-[10px] leading-[1.15] font-bold tracking-wide uppercase">
        {label}
      </span>
      <span
        className={`hidden w-full truncate text-center text-[8.5px] leading-none tracking-[0.08em] uppercase xl:block ${
          active ? 'text-pitch/70' : 'text-concrete/45'
        }`}
      >
        {sub}
      </span>
    </button>
  );
}

/* ------------------------------- item cards ------------------------------ */

interface ItemCardProps {
  item: CatalogItem;
  palette: AssetPalette;
  t: number;
  selected: boolean;
  onSelect: (item: CatalogItem) => void;
}

const ItemCard = memo(function ItemCard({ item, palette, t, selected, onSelect }: ItemCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(item)}
      aria-pressed={selected}
      title={item.blurb ?? item.label}
      className={`group relative flex flex-col items-center gap-1 overflow-hidden rounded-lg border p-1.5 transition-all duration-150 ease-[var(--ease-spring)] active:translate-y-[2px] ${
        selected
          ? 'border-hazard bg-steel shadow-[0_0_0_1px_#f59e0b,0_0_18px_-4px_#f59e0b]'
          : 'border-steel-light/45 bg-pitch/60 hover:border-cobalt-light/60 hover:bg-steel/70'
      }`}
    >
      {selected ? (
        <span
          aria-hidden="true"
          className="tape-strip absolute -top-2 -right-5 h-4 w-16 rotate-45 opacity-90"
        />
      ) : null}
      <span
        className={`grid aspect-square w-full place-items-center overflow-hidden rounded-md border transition-colors duration-150 ${
          selected ? 'border-hazard/40 bg-pitch-deep' : 'border-steel-light/25 bg-pitch-deep/70'
        }`}
      >
        <ItemThumb item={item} palette={palette} t={t} className="h-full w-full" />
      </span>
      <span
        className={`w-full truncate text-center text-[9.5px] leading-tight font-semibold ${
          selected ? 'text-hazard' : 'text-concrete/75 group-hover:text-chalk'
        }`}
      >
        {item.label}
      </span>
    </button>
  );
});

function NoneCard({
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
      // Each tray has its own "None", so the accessible name has to say which.
      aria-label={`No ${label.toLowerCase()}`}
      title={`Leave ${label.toLowerCase()} empty`}
      className={`flex flex-col items-center gap-1 rounded-lg border p-1.5 transition-all duration-150 ease-[var(--ease-spring)] active:translate-y-[2px] ${
        selected
          ? 'border-hazard bg-steel shadow-[0_0_0_1px_#f59e0b]'
          : 'border-steel-light/45 bg-pitch/60 hover:border-cobalt-light/60 hover:bg-steel/70'
      }`}
    >
      <span className="grid aspect-square w-full place-items-center rounded-md bg-pitch-deep/70 text-concrete/50">
        <BanIcon className="h-6 w-6" />
      </span>
      <span
        className={`w-full truncate text-center text-[9.5px] leading-tight font-semibold ${
          selected ? 'text-hazard' : 'text-concrete/70'
        }`}
      >
        None
      </span>
    </button>
  );
}

/* --------------------------------- trays --------------------------------- */

function Tray({ group }: { group: CatalogGroup }) {
  const config = useStudio((s) => s.present);
  const selectItem = useStudio((s) => s.selectItem);
  const t = useMemo(() => buildRig(config.grade).t, [config.grade]);

  const selectedId = config.items[group.slot];
  const selected = group.items.find((i) => i.id === selectedId) ?? null;

  const choose = (item: CatalogItem) => {
    selectItem(group.slot, item.id);
    play('swap');
  };

  return (
    <section className="overflow-hidden rounded-xl border border-steel-light/45 bg-pitch/40">
      <header className="flex items-center justify-between gap-2 border-b border-steel-light/40 bg-steel/40 px-3 py-1.5">
        <h3 className="stencil text-[10.5px] text-chalk/85">{group.label}</h3>
        <span className="font-blueprint text-[9px] tracking-[0.14em] text-concrete/55 uppercase">
          {selected?.label ?? 'None'}
        </span>
      </header>

      {group.slot === 'hair' ? <SkinToneStrip /> : null}

      <div className="grid grid-cols-3 gap-1.5 p-2 sm:grid-cols-4">
        {group.optional ? (
          <NoneCard
            label={group.label}
            selected={selectedId === null}
            onSelect={() => {
              selectItem(group.slot, null);
              play('swap');
            }}
          />
        ) : null}
        {group.items.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            palette={paletteFor(config, item)}
            t={t}
            selected={item.id === selectedId}
            onSelect={choose}
          />
        ))}
      </div>

      {selected ? <SwatchPicker item={selected} /> : null}
    </section>
  );
}

/* -------------------------------- toolbelt ------------------------------- */

export function Toolbelt() {
  const category = useStudio((s) => s.category);
  const setCategory = useStudio((s) => s.setCategory);
  const groups = useMemo(() => groupsForCategory(category), [category]);

  const select = (id: CategoryId) => {
    if (id === category) return;
    setCategory(id);
    play('click');
  };

  /** Arrow/Home/End move between tabs, per the ARIA tabs pattern. */
  const onTabKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    const index = CATEGORIES.findIndex((c) => c.id === category);
    let next = index;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = index + 1;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = index - 1;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = CATEGORIES.length - 1;
    else return;

    event.preventDefault();
    const wrapped = (next + CATEGORIES.length) % CATEGORIES.length;
    const target = CATEGORIES[wrapped];
    if (!target) return;
    select(target.id);
    document.getElementById(`toolbelt-tab-${target.id}`)?.focus();
  };

  return (
    <div className="plate rivets flex min-h-0 flex-col overflow-hidden">
      <header className="relative flex items-center justify-between gap-3 border-b border-steel-light/60 bg-pitch/70 py-2 pr-4 pl-6">
        <span
          aria-hidden="true"
          className="absolute top-2 bottom-2 left-2 w-[3px] rounded-full bg-cobalt shadow-[0_0_12px_#2563eb]"
        />
        <h2 className="stencil text-[13px] text-chalk/95">The Toolbelt</h2>
        <span className="font-blueprint text-[10px] tracking-[0.16em] text-concrete/70 uppercase">
          Station 02
        </span>
      </header>

      <div className="caution-tape h-[5px] w-full opacity-70" aria-hidden="true" />

      <div role="tablist" aria-label="Part categories" className="flex gap-1.5 bg-pitch/60 p-2">
        {CATEGORIES.map((cat) => (
          <Tab
            key={cat.id}
            id={cat.id}
            label={cat.label}
            sub={cat.sub}
            accent={cat.accent}
            active={cat.id === category}
            onSelect={select}
            onKeyDown={onTabKeyDown}
          />
        ))}
      </div>

      <div
        id={`toolbelt-panel-${category}`}
        role="tabpanel"
        aria-labelledby={`toolbelt-tab-${category}`}
        tabIndex={-1}
        className="tray-scroll flex flex-col gap-2.5 overflow-y-auto p-2.5 lg:max-h-[calc(100vh-260px)]"
      >
        {groups.map((group) => (
          <Tray key={group.id} group={group} />
        ))}
      </div>
    </div>
  );
}

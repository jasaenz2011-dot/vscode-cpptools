'use client';

import { useState } from 'react';
import { HAIR_SWATCHES, SKIN_TONES, SWATCHES } from '@/lib/catalog';
import { play } from '@/lib/audio';
import { colorFor, useStudio } from '@/lib/store';
import { readableInk } from '@/lib/color';
import type { CatalogItem, ColorChannel } from '@/lib/types';
import { CheckIcon, ResetIcon } from '../shell/icons';

const CHANNEL_LABELS: Record<ColorChannel, string> = {
  primary: 'Main',
  secondary: 'Trim',
  accent: 'Detail',
};

function Swatch({
  color,
  selected,
  label,
  onClick,
}: {
  color: string;
  selected: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      aria-pressed={selected}
      className={`grid h-7 w-7 place-items-center rounded-md border transition-transform duration-150 ease-[var(--ease-spring)] hover:scale-110 active:scale-95 ${
        selected ? 'border-chalk shadow-[0_0_0_2px_rgba(248,250,252,0.35)]' : 'border-pitch-deep/80'
      }`}
      style={{ background: color }}
    >
      {selected ? <CheckIcon className="h-3.5 w-3.5" /> : null}
      {selected ? null : <span className="sr-only">{label}</span>}
    </button>
  );
}

export interface SwatchPickerProps {
  item: CatalogItem;
}

/** Colour channels for the item currently equipped in a slot. */
export function SwatchPicker({ item }: SwatchPickerProps) {
  const config = useStudio((s) => s.present);
  const setColor = useStudio((s) => s.setColor);
  const resetColors = useStudio((s) => s.resetColors);
  const [preferred, setPreferred] = useState<ColorChannel>('primary');

  // Derived, not synced: if the newly equipped item has no such channel, fall
  // back to its first one without bouncing through an effect.
  const channel = item.channels.includes(preferred) ? preferred : (item.channels[0] ?? 'primary');

  if (item.channels.length === 0) return null;

  const current = colorFor(config, item, channel);
  const palette = item.slot === 'hair' ? HAIR_SWATCHES : SWATCHES;
  const overridden = Boolean(config.colors[item.slot]);

  const apply = (hex: string) => {
    setColor(item.slot, channel, hex);
    play('click');
  };

  return (
    <div className="border-t border-steel-light/40 bg-pitch/50 px-3 py-3">
      <div className="mb-2.5 flex flex-wrap items-center gap-1.5">
        <span className="font-blueprint mr-1 text-[9px] tracking-[0.18em] text-concrete/60 uppercase">
          Paint
        </span>
        {item.channels.map((ch) => {
          const chColor = colorFor(config, item, ch);
          const active = ch === channel;
          return (
            <button
              key={ch}
              type="button"
              onClick={() => setPreferred(ch)}
              aria-pressed={active}
              className={`flex items-center gap-1.5 rounded-md border px-2 py-1 text-[10px] font-bold tracking-wide uppercase transition-colors duration-150 ${
                active
                  ? 'border-hazard/80 bg-steel text-chalk'
                  : 'border-steel-light/50 text-concrete/70 hover:text-chalk'
              }`}
            >
              <span
                className="h-3 w-3 rounded-sm border border-pitch-deep/70"
                style={{ background: chColor }}
              />
              {CHANNEL_LABELS[ch]}
            </button>
          );
        })}
        {overridden ? (
          <button
            type="button"
            onClick={() => {
              resetColors(item.slot);
              play('swap');
            }}
            className="ml-auto flex items-center gap-1 rounded-md px-1.5 py-1 text-[10px] font-bold tracking-wide text-concrete/60 uppercase transition-colors hover:text-hazard"
          >
            <ResetIcon className="h-3 w-3" />
            Stock
          </button>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {palette.map((hex) => (
          <Swatch
            key={hex}
            color={hex}
            label={hex}
            selected={hex.toLowerCase() === current.toLowerCase()}
            onClick={() => apply(hex)}
          />
        ))}
        <label
          className="relative grid h-7 w-7 cursor-pointer place-items-center overflow-hidden rounded-md border border-steel-lighter/70 text-[9px] font-bold"
          style={{ background: current, color: readableInk(current) }}
          title={`Custom colour (${current})`}
        >
          <span aria-hidden="true">+</span>
          <input
            type="color"
            value={current}
            onChange={(event) => setColor(item.slot, channel, event.target.value)}
            className="absolute inset-0 cursor-pointer opacity-0"
            aria-label={`Custom ${CHANNEL_LABELS[channel]} colour`}
          />
        </label>
      </div>
    </div>
  );
}

/** Skin tone strip — shared across the whole avatar, so it lives on its own. */
export function SkinToneStrip() {
  const skinTone = useStudio((s) => s.present.skinTone);
  const setSkinTone = useStudio((s) => s.setSkinTone);

  return (
    <div className="border-b border-steel-light/40 bg-pitch/40 px-3 py-3">
      <p className="font-blueprint mb-2 text-[9px] tracking-[0.18em] text-concrete/60 uppercase">
        Skin Tone
      </p>
      <div className="flex flex-wrap gap-1.5">
        {SKIN_TONES.map((hex) => (
          <Swatch
            key={hex}
            color={hex}
            label={`Skin tone ${hex}`}
            selected={hex.toLowerCase() === skinTone.toLowerCase()}
            onClick={() => {
              setSkinTone(hex);
              play('click');
            }}
          />
        ))}
        <label
          className="relative grid h-7 w-7 cursor-pointer place-items-center overflow-hidden rounded-md border border-steel-lighter/70 text-[9px] font-bold"
          style={{ background: skinTone, color: readableInk(skinTone) }}
          title={`Custom skin tone (${skinTone})`}
        >
          <span aria-hidden="true">+</span>
          <input
            type="color"
            value={skinTone}
            onChange={(event) => setSkinTone(event.target.value)}
            className="absolute inset-0 cursor-pointer opacity-0"
            aria-label="Custom skin tone"
          />
        </label>
      </div>
    </div>
  );
}

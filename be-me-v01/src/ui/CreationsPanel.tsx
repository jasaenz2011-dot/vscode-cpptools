import { AvatarStage } from '../engine/AvatarStage';
import type { ManifestIndex } from '../engine/manifest';
import type { SavedAvatar } from '../state/store';
import { SectionHeader } from './SectionHeader';
import { Bezel } from './Bezel';
import { PlusIcon, TrashIcon } from './icons';

interface CreationsPanelProps {
  manifest: ManifestIndex;
  saved: SavedAvatar[];
  loadedId: string | null;
  onLoad: (id: string) => void;
  onDelete: (id: string) => void;
  onNewSlot: () => void;
}

const VISIBLE_SLOTS = 4;

/**
 * YOUR CREATIONS — SAVE · LOAD · SHARE
 *
 * Each filled slot renders its saved configuration through the real compositor,
 * so the thumbnail is the actual avatar rather than a stored screenshot.
 */
export function CreationsPanel({
  manifest,
  saved,
  loadedId,
  onLoad,
  onDelete,
  onNewSlot,
}: CreationsPanelProps) {
  const shown = saved.slice(0, VISIBLE_SLOTS);
  const overflow = saved.length - shown.length;

  return (
    <Bezel className="shrink-0">
      <SectionHeader
        number="04"
        title="Your Creations"
        accent="Save · Load · Share"
        meta={saved.length > 0 ? `${saved.length} stored` : undefined}
      />

      <div className="grid grid-cols-5 gap-1.5 p-3">
        {shown.map((entry) => (
          <SavedSlot
            key={entry.id}
            manifest={manifest}
            entry={entry}
            active={entry.id === loadedId}
            onLoad={() => onLoad(entry.id)}
            onDelete={() => onDelete(entry.id)}
          />
        ))}

        {Array.from({ length: Math.max(0, VISIBLE_SLOTS - shown.length) }, (_, i) => (
          <div
            key={`empty-${i}`}
            aria-hidden="true"
            className="slot-tile notch-sm grid aspect-[3/4] place-items-center opacity-70"
          >
            <span className="font-display text-[7px] tracking-[0.14em] text-white/18 uppercase">
              Empty
            </span>
          </div>
        ))}

        <button
          type="button"
          onClick={onNewSlot}
          aria-label="Save the current build into a new slot"
          title="Save the current build into a new slot"
          className="slot-tile notch-sm group grid aspect-[3/4] place-items-center transition-all duration-200 ease-[var(--ease-soft)] hover:border-gold/70"
        >
          <span className="text-center">
            <PlusIcon className="mx-auto text-[16px] text-gold/70 transition-colors group-hover:text-gold-bright" />
            <span className="mt-1 block font-display text-[6.5px] tracking-[0.14em] text-gold/60 uppercase">
              New Slot
            </span>
          </span>
        </button>
      </div>

      {overflow > 0 ? (
        <p className="px-3 pb-2 text-center font-display text-[7.5px] tracking-[0.14em] text-white/26 uppercase">
          +{overflow} more stored
        </p>
      ) : null}
    </Bezel>
  );
}

function SavedSlot({
  manifest,
  entry,
  active,
  onLoad,
  onDelete,
}: {
  manifest: ManifestIndex;
  entry: SavedAvatar;
  active: boolean;
  onLoad: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      className={`slot-tile notch-sm group relative aspect-[3/4] overflow-hidden transition-all duration-200 ease-[var(--ease-soft)] ${
        active ? 'slot-tile-active' : 'hover:border-cyan/50'
      }`}
    >
      <button
        type="button"
        onClick={onLoad}
        aria-label={`Load ${entry.name}`}
        title={`Load ${entry.name}`}
        className="absolute inset-0 flex flex-col"
      >
        <span className="relative min-h-0 flex-1">
          <span className="absolute inset-0 flex items-end justify-center pb-0.5">
            <span className="relative h-[97%]">
              <AvatarStage
                manifest={manifest}
                style={entry.config.style}
                bodyBase={entry.config.bodyBase}
                view="front"
                selection={entry.config.selection}
              />
            </span>
          </span>
        </span>
        <span
          className={`block w-full truncate px-1 py-0.5 text-center text-[7.5px] leading-tight font-500 ${
            active ? 'text-gold-bright' : 'text-white/55'
          }`}
        >
          {entry.name}
        </span>
      </button>

      <button
        type="button"
        onClick={onDelete}
        aria-label={`Delete ${entry.name}`}
        title={`Delete ${entry.name}`}
        className="absolute top-0.5 right-0.5 z-10 p-1 text-white/0 transition-colors group-hover:text-white/45 hover:!text-red-400 focus-visible:text-white/60"
      >
        <TrashIcon className="text-[11px]" />
      </button>
    </div>
  );
}

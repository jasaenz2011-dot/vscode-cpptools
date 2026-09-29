import { BookIcon, DiceIcon, GemIcon, GearIcon, PlusIcon, ResetIcon, SaveIcon } from './icons';
import { BezelPill } from './Bezel';

interface TopBarProps {
  onNew: () => void;
  onReset: () => void;
  onRandomize: () => void;
  onSave: () => void;
}

export function TopBar({ onNew, onReset, onRandomize, onSave }: TopBarProps) {
  return (
    <header className="relative shrink-0">
      {/* Suite strapline, centred across the top as in the reference. */}
      <div className="pointer-events-none absolute inset-x-0 top-1.5 hidden justify-center lg:flex">
        <BezelPill className="pointer-events-auto">
          <p className="px-6 py-1 font-display text-[8px] tracking-[0.42em] whitespace-nowrap text-gold/70 uppercase">
            31st Century <span className="mx-2 text-cyan/50">•</span> Next Generation Creation Suite
          </p>
        </BezelPill>
      </div>

      <div className="flex items-center justify-between gap-4 px-4 pt-5 pb-2.5 xl:px-5">
        {/* Brand — the supplied Be ME! logo, used as delivered. */}
        <div className="flex min-w-0 items-center gap-3.5">
          <img
            src="/brand/be-me-mark.png"
            alt="Be ME!"
            draggable={false}
            className="drag-none h-[52px] w-auto shrink-0 xl:h-[62px]"
          />
          <div className="min-w-0 border-l border-gold/20 pl-3.5">
            <p className="font-display text-[10px] font-700 tracking-[0.3em] whitespace-nowrap text-gold uppercase">
              Build Your Identity.
            </p>
            <p className="font-display mt-0.5 text-[10px] font-600 tracking-[0.2em] whitespace-nowrap uppercase">
              <span className="text-cyan">Be You.</span>{' '}
              <span className="text-violet">Be Bold.</span>{' '}
              <span className="text-magenta">Be Me!</span>
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Action label="New" onClick={onNew} icon={<PlusIcon />} />
          <Action label="Reset" onClick={onReset} icon={<ResetIcon />} />
          <Action label="Randomize" onClick={onRandomize} icon={<DiceIcon />} />
          <button
            type="button"
            onClick={onSave}
            className="btn-key notch-sm flex items-center gap-2 px-4 py-2.5 text-[10.5px]"
          >
            <SaveIcon className="text-[14px]" />
            <span className="hidden sm:inline">Save Avatar</span>
          </button>

          {/* Creator block, mirroring the reference's top-right identity area. */}
          <BezelPill className="hidden xl:block">
            <div className="flex items-center gap-3 px-3.5 py-1.5">
              <span className="text-right">
                <span className="block font-display text-[8px] tracking-[0.26em] text-white/38 uppercase">
                  Welcome, Creator
                </span>
                <span className="block font-display text-[12px] font-700 tracking-[0.18em] text-gold-bright uppercase">
                  Visionary
                </span>
              </span>
              <Crest />
            </div>
          </BezelPill>

          <BezelPill className="hidden xl:block">
            <div className="flex items-center gap-0.5 px-1.5 py-1">
              <Shelf label="Premium" icon={<GemIcon />} />
              <Shelf label="Codex" icon={<BookIcon />} />
              <Shelf label="Settings" icon={<GearIcon />} />
            </div>
          </BezelPill>
        </div>
      </div>

      <div className="rule-gold" />
    </header>
  );
}

/** The creator crest from the reference's top-right corner. */
function Crest() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className="h-7 w-7 shrink-0">
      <path
        d="M16 2.6 27.4 9v14L16 29.4 4.6 23V9Z"
        fill="none"
        stroke="var(--color-gold)"
        strokeWidth={1.2}
        opacity={0.55}
      />
      <path d="M16 8.4 22.6 21H9.4Z" fill="var(--color-gold)" opacity={0.9} />
      <path d="M16 14.2 19.4 21h-6.8Z" fill="#0d1119" />
    </svg>
  );
}

function Action({
  label,
  onClick,
  icon,
}: {
  label: string;
  onClick: () => void;
  icon: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="btn-ghost notch-sm flex items-center gap-2 px-3.5 py-2.5 text-[10.5px]"
    >
      <span className="text-[14px]">{icon}</span>
      <span className="hidden lg:inline">{label}</span>
    </button>
  );
}

/**
 * Shelf buttons are present in the reference chrome but have no destination in
 * v0.1. They are explicitly disabled and say so rather than looking live.
 */
function Shelf({ label, icon }: { label: string; icon: React.ReactNode }) {
  return (
    <button
      type="button"
      disabled
      aria-label={`${label} — coming soon`}
      title={`${label} — coming soon`}
      className="grid h-8 w-8 place-items-center text-[15px] text-gold/45 transition-colors hover:text-gold-bright disabled:cursor-not-allowed"
    >
      {icon}
    </button>
  );
}

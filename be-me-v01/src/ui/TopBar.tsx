import { BookIcon, DiceIcon, GemIcon, GearIcon, PlusIcon, ResetIcon, SaveIcon } from './icons';

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
      <p className="pointer-events-none absolute inset-x-0 top-1.5 hidden text-center font-display text-[8px] tracking-[0.42em] text-gold/45 uppercase lg:block">
        31st Century <span className="mx-2 text-gold/25">•</span> Next Generation Creation Suite
      </p>

      <div className="flex items-center justify-between gap-4 px-4 pt-4 pb-2.5 xl:px-5">
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
            className="btn-key cut-corner-sm flex items-center gap-2 px-4 py-2.5 text-[10.5px]"
          >
            <SaveIcon className="text-[14px]" />
            <span className="hidden sm:inline">Save Avatar</span>
          </button>

          <span className="mx-1 hidden h-8 w-px bg-gold/18 xl:block" aria-hidden="true" />

          {/* Creator block, mirroring the reference's top-right identity area. */}
          <div className="hidden text-right xl:block">
            <p className="font-display text-[8px] tracking-[0.26em] text-white/32 uppercase">
              Welcome, Creator
            </p>
            <p className="font-display text-[12px] font-700 tracking-[0.18em] text-gold-bright uppercase">
              Visionary
            </p>
          </div>

          <div className="hidden items-center gap-1 xl:flex">
            <Shelf label="Premium" icon={<GemIcon />} />
            <Shelf label="Codex" icon={<BookIcon />} />
            <Shelf label="Settings" icon={<GearIcon />} />
          </div>
        </div>
      </div>

      <div className="rule-gold" />
    </header>
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
      className="btn-ghost cut-corner-sm flex items-center gap-2 px-3.5 py-2.5 text-[10.5px]"
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
      className="grid h-9 w-9 place-items-center border border-gold/18 text-[15px] text-gold/40 transition-colors hover:text-gold/60 disabled:cursor-not-allowed"
    >
      {icon}
    </button>
  );
}

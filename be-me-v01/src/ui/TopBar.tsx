import { DiceIcon, PlusIcon, ResetIcon, SaveIcon } from './icons';

interface TopBarProps {
  onNew: () => void;
  onReset: () => void;
  onRandomize: () => void;
  onSave: () => void;
}

export function TopBar({ onNew, onReset, onRandomize, onSave }: TopBarProps) {
  return (
    <header className="flex shrink-0 items-center justify-between gap-4 px-4 py-2.5 xl:px-5">
      {/* Brand lockup — the supplied Be ME! logo, used as delivered. */}
      <div className="flex min-w-0 items-center gap-3.5">
        <img
          src="/brand/be-me-mark.png"
          alt="Be ME!"
          draggable={false}
          className="drag-none h-14 w-auto shrink-0 xl:h-16"
        />
        <div className="min-w-0 border-l border-gold/18 pl-3.5">
          <p className="font-display text-[10.5px] font-700 tracking-[0.3em] whitespace-nowrap text-gold uppercase">
            Build Your Identity.
          </p>
          <p className="font-display mt-0.5 text-[10.5px] font-600 tracking-[0.22em] whitespace-nowrap uppercase">
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
          className="btn-key cut-corner-sm flex items-center gap-2 px-4 py-2.5 text-[11px]"
        >
          <SaveIcon className="text-[14px]" />
          Save Avatar
        </button>
      </div>
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
      className="btn-ghost cut-corner-sm flex items-center gap-2 px-3.5 py-2.5 text-[11px]"
    >
      <span className="text-[14px]">{icon}</span>
      <span className="hidden lg:inline">{label}</span>
    </button>
  );
}

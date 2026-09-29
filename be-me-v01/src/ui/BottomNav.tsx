import {
  AnimationsIcon,
  AvatarNavIcon,
  GridIcon,
  LoadoutIcon,
  WorldsIcon,
} from './icons';

/**
 * The suite navigation bar from the reference.
 *
 * AVATAR is the only destination that exists in v0.1. The rest are declared and
 * visibly disabled — no fake controls that look live but do nothing.
 */
const DESTINATIONS = [
  { id: 'dashboard', label: 'Dashboard', icon: GridIcon, enabled: false },
  { id: 'avatar', label: 'Avatar', icon: AvatarNavIcon, enabled: true },
  { id: 'loadout', label: 'Loadout', icon: LoadoutIcon, enabled: false },
  { id: 'worlds', label: 'Worlds', icon: WorldsIcon, enabled: false },
  { id: 'animations', label: 'Animations', icon: AnimationsIcon, enabled: false },
] as const;

export function BottomNav({ footnote }: { footnote: string }) {
  return (
    <nav
      aria-label="Suite navigation"
      className="relative grid shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-4 border-t border-gold/18 bg-gradient-to-b from-[#141821] to-[#0a0c12] px-4 py-1.5 xl:px-5"
    >
      <ul className="flex items-center gap-1">
        {DESTINATIONS.map((d) => {
          const Icon = d.icon;
          return (
            <li key={d.id}>
              <button
                type="button"
                disabled={!d.enabled}
                aria-current={d.enabled ? 'page' : undefined}
                aria-label={d.enabled ? d.label : `${d.label} — coming soon`}
                title={d.enabled ? d.label : `${d.label} — coming soon`}
                className={`notch-sm flex items-center gap-2 px-3 py-2 font-display text-[9px] font-600 tracking-[0.2em] uppercase transition-all duration-200 ease-[var(--ease-soft)] ${
                  d.enabled
                    ? 'border border-gold/45 bg-gradient-to-b from-gold/18 to-transparent text-gold-bright'
                    : 'border border-transparent text-white/26 hover:text-white/45 disabled:cursor-not-allowed'
                }`}
              >
                <Icon className="text-[14px]" />
                <span className="hidden sm:inline">{d.label}</span>
              </button>
            </li>
          );
        })}
      </ul>

      {/* Central crest */}
      <span aria-hidden="true" className="justify-self-center">
        <svg viewBox="0 0 40 30" className="h-7 w-9">
          <path d="M20 4 34 26H6Z" fill="none" stroke="var(--color-gold)" strokeWidth={1.4} opacity={0.75} />
          <path d="M20 12 26.5 24h-13Z" fill="var(--color-gold)" opacity={0.85} />
        </svg>
      </span>

      <div className="min-w-0 justify-self-end text-right">
        <p className="hidden truncate font-display text-[8px] tracking-[0.18em] text-white/22 uppercase 2xl:block">
          {footnote}
        </p>
        <p className="hidden font-display text-[8px] tracking-[0.24em] whitespace-nowrap text-gold/40 uppercase lg:block">
          Powered by imagination
          <span className="mx-2 text-gold/20">•</span>
          Built for legends
        </p>
      </div>
    </nav>
  );
}

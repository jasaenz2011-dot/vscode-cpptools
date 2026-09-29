/**
 * Icon set. Hand-drawn on a 24×24 grid to match the industrial line weight of
 * the rest of the studio — no icon dependency, no runtime cost.
 */
interface IconProps {
  className?: string;
}

const base = 'h-[1.15em] w-[1.15em]';

export function GearIcon({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={`${base} ${className}`}>
      <path
        d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z"
        stroke="currentColor"
        strokeWidth={2}
      />
      <path
        d="M19.4 13.5a7.6 7.6 0 0 0 0-3l1.8-1.4-1.9-3.2-2.2.8a7.5 7.5 0 0 0-2.6-1.5L14.1 3H9.9l-.4 2.2a7.5 7.5 0 0 0-2.6 1.5l-2.2-.8-1.9 3.2 1.8 1.4a7.6 7.6 0 0 0 0 3l-1.8 1.4 1.9 3.2 2.2-.8c.8.7 1.7 1.2 2.6 1.5l.4 2.2h4.2l.4-2.2a7.5 7.5 0 0 0 2.6-1.5l2.2.8 1.9-3.2-1.8-1.4Z"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function UndoIcon({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={`${base} ${className}`}>
      <path
        d="M4 9h9.5a5.5 5.5 0 0 1 0 11H9"
        stroke="currentColor"
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M8 4 3.5 9 8 14" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function RedoIcon({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={`${base} ${className}`}>
      <path
        d="M20 9h-9.5a5.5 5.5 0 0 0 0 11H15"
        stroke="currentColor"
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M16 4l4.5 5L16 14" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function DiceIcon({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={`${base} ${className}`}>
      <rect x={3} y={3} width={18} height={18} rx={4} stroke="currentColor" strokeWidth={2.2} />
      <circle cx={8.5} cy={8.5} r={1.6} fill="currentColor" />
      <circle cx={15.5} cy={8.5} r={1.6} fill="currentColor" />
      <circle cx={12} cy={12} r={1.6} fill="currentColor" />
      <circle cx={8.5} cy={15.5} r={1.6} fill="currentColor" />
      <circle cx={15.5} cy={15.5} r={1.6} fill="currentColor" />
    </svg>
  );
}

export function SoundOnIcon({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={`${base} ${className}`}>
      <path
        d="M5 9.5h3L12.5 5v14L8 14.5H5a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth={2.2}
        strokeLinejoin="round"
      />
      <path d="M16 9.2a4 4 0 0 1 0 5.6M18.6 6.6a7.6 7.6 0 0 1 0 10.8" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" />
    </svg>
  );
}

export function SoundOffIcon({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={`${base} ${className}`}>
      <path
        d="M5 9.5h3L12.5 5v14L8 14.5H5a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth={2.2}
        strokeLinejoin="round"
      />
      <path d="M16.5 9.5 21 14M21 9.5 16.5 14" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" />
    </svg>
  );
}

export function GridIcon({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={`${base} ${className}`}>
      <rect x={3} y={3} width={18} height={18} rx={2.5} stroke="currentColor" strokeWidth={2.2} />
      <path d="M9 3v18M15 3v18M3 9h18M3 15h18" stroke="currentColor" strokeWidth={1.6} opacity={0.8} />
    </svg>
  );
}

export function DownloadIcon({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={`${base} ${className}`}>
      <path d="M12 3v12M12 15l-4.5-4.5M12 15l4.5-4.5" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 17v2.5A1.5 1.5 0 0 0 5.5 21h13a1.5 1.5 0 0 0 1.5-1.5V17" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" />
    </svg>
  );
}

export function CodeIcon({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={`${base} ${className}`}>
      <path d="m8.5 7-5 5 5 5M15.5 7l5 5-5 5" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function UploadIcon({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={`${base} ${className}`}>
      <path d="M12 15V3M12 3 7.5 7.5M12 3l4.5 4.5" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 17v2.5A1.5 1.5 0 0 0 5.5 21h13a1.5 1.5 0 0 0 1.5-1.5V17" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" />
    </svg>
  );
}

export function ResetIcon({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={`${base} ${className}`}>
      <path
        d="M20 12a8 8 0 1 1-2.6-5.9"
        stroke="currentColor"
        strokeWidth={2.4}
        strokeLinecap="round"
      />
      <path d="M20 3v5h-5" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CheckIcon({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={`${base} ${className}`}>
      <path d="m5 12.5 4.5 4.5L19 7" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function BanIcon({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={`${base} ${className}`}>
      <circle cx={12} cy={12} r={9} stroke="currentColor" strokeWidth={2.2} />
      <path d="m6 18 12-12" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" />
    </svg>
  );
}

export function HardHatIcon({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={`${base} ${className}`}>
      {/* Dome + centre rib + side ribs + brim: the four cues that make a shape
          read as a hard hat rather than a serving cloche. */}
      <path
        d="M4 16.2a8 8 0 0 1 16 0"
        stroke="currentColor"
        strokeWidth={2.2}
        strokeLinecap="round"
      />
      <path d="M12 8.3v7.9" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" />
      <path
        d="M7.9 10.2 7 16.2M16.1 10.2l.9 6"
        stroke="currentColor"
        strokeWidth={1.7}
        strokeLinecap="round"
        opacity={0.75}
      />
      <path
        d="M2 16.2h20a1.2 1.2 0 0 1 1.2 1.2v1.4a1.2 1.2 0 0 1-1.2 1.2H2a1.2 1.2 0 0 1-1.2-1.2v-1.4A1.2 1.2 0 0 1 2 16.2Z"
        stroke="currentColor"
        strokeWidth={2.2}
        strokeLinejoin="round"
      />
    </svg>
  );
}

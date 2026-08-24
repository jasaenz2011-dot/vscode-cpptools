'use client';

import type { ReactNode } from 'react';

export interface PanelProps {
  title?: string;
  /** Small mono label on the right of the title bar. */
  tag?: ReactNode;
  accent?: string;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  /** Set when the panel is a skip-link target. */
  id?: string;
}

/**
 * A riveted steel plate. Every surface in the workshop is one of these, so the
 * whole studio reads as machined from the same stock.
 */
export function Panel({
  title,
  tag,
  accent = '#f59e0b',
  children,
  className = '',
  bodyClassName = '',
  id,
}: PanelProps) {
  return (
    <section
      {...(id ? { id, tabIndex: -1 } : {})}
      className={`plate rivets overflow-hidden ${className}`}
    >
      {title ? (
        <header className="relative flex items-center justify-between gap-3 border-b border-steel-light/60 bg-pitch/60 py-2 pr-4 pl-6">
          <span
            aria-hidden="true"
            className="absolute top-2 bottom-2 left-2 w-[3px] rounded-full"
            style={{ background: accent, boxShadow: `0 0 12px ${accent}` }}
          />
          <h2 className="stencil truncate text-[13px] text-chalk/95">{title}</h2>
          {tag ? (
            <span className="font-blueprint shrink-0 text-[10px] tracking-[0.16em] text-concrete/70 uppercase">
              {tag}
            </span>
          ) : null}
        </header>
      ) : null}
      <div className={bodyClassName}>{children}</div>
    </section>
  );
}

/** Hazard tape divider. */
export function CautionBar({ className = '', height = 8 }: { className?: string; height?: number }) {
  return (
    <div
      aria-hidden="true"
      className={`caution-tape w-full ${className}`}
      style={{ height }}
    />
  );
}

import type { ReactNode } from 'react';

/**
 * The machined gold frame every panel sits in.
 *
 * Two notched layers: an outer plate filled with a gold gradient, and the panel
 * surface inset inside it. That is what makes the frame read as milled metal
 * rather than a 1px border.
 */
export function Bezel({
  children,
  className = '',
  innerClassName = '',
}: {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
}) {
  return (
    <div className={`bezel notch ${className}`}>
      <div className={`bezel-in notch edge-glow flex min-h-0 flex-col ${innerClassName}`}>
        {children}
      </div>
    </div>
  );
}

/** Small standalone bezel for pills and badges in the top chrome. */
export function BezelPill({
  children,
  className = '',
  innerClassName = '',
}: {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
}) {
  return (
    <div className={`bezel notch-sm !p-[2px] ${className}`}>
      <div className={`bezel-in notch-sm ${innerClassName}`}>{children}</div>
    </div>
  );
}

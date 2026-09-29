import type { ReactNode } from 'react';

/**
 * The machined gold frame every panel sits in.
 *
 * Three notched layers, matching the finished reference: an outer plate filled
 * with a gold gradient, a blue LED channel, and the panel surface inset inside
 * that. The LED layer is what gives the frame apparent thickness — with the
 * plate alone it reads as a thick border rather than milled metal.
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
      <div className="bezel-led notch flex min-h-0 flex-col">
        <div className={`bezel-in notch edge-glow flex min-h-0 flex-1 flex-col ${innerClassName}`}>
          {children}
        </div>
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

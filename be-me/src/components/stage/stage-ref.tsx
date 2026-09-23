'use client';

import { createContext, useContext, useRef, type ReactNode, type RefObject } from 'react';

type StageRef = RefObject<SVGSVGElement | null>;

const StageRefContext = createContext<StageRef | null>(null);

/**
 * Shares the live stage `<svg>` with the export station, so a download is a
 * rasterisation of exactly what the student is looking at.
 */
export function StageRefProvider({ children }: { children: ReactNode }) {
  const ref = useRef<SVGSVGElement | null>(null);
  return <StageRefContext.Provider value={ref}>{children}</StageRefContext.Provider>;
}

export function useStageRef(): StageRef {
  const ref = useContext(StageRefContext);
  if (!ref) throw new Error('useStageRef must be used inside <StageRefProvider>.');
  return ref;
}

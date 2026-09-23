'use client';

import { useEffect, type ReactNode } from 'react';
import { setSoundEnabled } from '@/lib/audio';
import { useStudio } from '@/lib/store';
import { StageRefProvider } from './stage/stage-ref';

/**
 * Client bootstrap: rehydrates the saved build *after* mount (so the first
 * client render matches the server exactly), keeps the sound kit in sync, and
 * wires the global undo/redo shortcuts.
 */
export function StudioProvider({ children }: { children: ReactNode }) {
  const soundOn = useStudio((s) => s.soundOn);

  useEffect(() => {
    let cancelled = false;
    void useStudio.persist.rehydrate()?.then(() => {
      if (!cancelled) useStudio.getState().markHydrated();
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setSoundEnabled(soundOn);
  }, [soundOn]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey)) return;

      // Text fields keep their own native undo stack.
      const target = event.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || target?.isContentEditable) return;

      const key = event.key.toLowerCase();
      if (key === 'z') {
        event.preventDefault();
        if (event.shiftKey) useStudio.getState().redo();
        else useStudio.getState().undo();
      } else if (key === 'y') {
        event.preventDefault();
        useStudio.getState().redo();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return <StageRefProvider>{children}</StageRefProvider>;
}

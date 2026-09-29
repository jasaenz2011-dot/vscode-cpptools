'use client';

import { useCallback } from 'react';
import { play } from '@/lib/audio';
import { selectCanRedo, selectCanUndo, useStudio } from '@/lib/store';
import {
  DiceIcon,
  GridIcon,
  HardHatIcon,
  RedoIcon,
  ResetIcon,
  SoundOffIcon,
  SoundOnIcon,
  UndoIcon,
} from './icons';

interface ToolButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  children: React.ReactNode;
  tone?: 'steel' | 'hazard';
}

function ToolButton({
  label,
  onClick,
  disabled = false,
  active = false,
  children,
  tone = 'steel',
}: ToolButtonProps) {
  const palette =
    tone === 'hazard'
      ? 'bg-hazard text-pitch hover:bg-hazard-glow'
      : active
        ? 'bg-cobalt text-chalk'
        : 'bg-steel text-concrete hover:text-chalk';
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-pressed={active}
      title={label}
      className={`btn-mech h-8 w-8 shrink-0 text-[14px] sm:h-10 sm:w-10 sm:text-[15px] ${palette}`}
    >
      {children}
    </button>
  );
}

export function Header() {
  const undo = useStudio((s) => s.undo);
  const redo = useStudio((s) => s.redo);
  const randomize = useStudio((s) => s.randomize);
  const resetAll = useStudio((s) => s.resetAll);
  const toggleSound = useStudio((s) => s.toggleSound);
  const toggleGrid = useStudio((s) => s.toggleGrid);
  const canUndo = useStudio(selectCanUndo);
  const canRedo = useStudio(selectCanRedo);
  const soundOn = useStudio((s) => s.soundOn);
  const gridOn = useStudio((s) => s.gridOn);

  const onUndo = useCallback(() => {
    undo();
    play('undo');
  }, [undo]);

  const onRedo = useCallback(() => {
    redo();
    play('undo');
  }, [redo]);

  const onRandomize = useCallback(() => {
    randomize();
    play('ratchet');
  }, [randomize]);

  const onReset = useCallback(() => {
    resetAll();
    play('swap');
  }, [resetAll]);

  const onToggleSound = useCallback(() => {
    toggleSound();
    // Fires only when turning sound on, which doubles as the audio unlock tap.
    play('click');
  }, [toggleSound]);

  const onToggleGrid = useCallback(() => {
    toggleGrid();
    play('click');
  }, [toggleGrid]);

  return (
    <header className="sticky top-0 z-40 border-b border-steel-light/50 bg-pitch-deep/92 backdrop-blur-md">
      <div className="caution-tape h-[6px] w-full" aria-hidden="true" />
      <div className="mx-auto flex max-w-[1680px] items-center justify-between gap-2 px-3 py-2.5 sm:gap-3 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <span
            className="relative grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-hazard-deep bg-hazard text-pitch shadow-[0_4px_0_0_rgba(0,0,0,0.55)] sm:h-11 sm:w-11"
            aria-hidden="true"
          >
            <HardHatIcon className="h-5 w-5 sm:h-6 sm:w-6" />
          </span>
          <div className="min-w-0">
            <h1 className="flex items-baseline gap-2 text-[17px] leading-none whitespace-nowrap sm:text-[23px]">
              <span className="text-glow-hazard text-hazard">BE ME!</span>
              <span className="hidden text-[11px] tracking-[0.22em] text-concrete/70 sm:inline">
                BUILD YOUR IDENTITY
              </span>
            </h1>
            <p className="font-blueprint mt-1 hidden truncate text-[9.5px] tracking-[0.2em] text-cobalt-light/70 uppercase sm:block">
              Under Construction · The Maker&rsquo;s Workshop
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <ToolButton label="Undo" onClick={onUndo} disabled={!canUndo}>
            <UndoIcon />
          </ToolButton>
          <ToolButton label="Redo" onClick={onRedo} disabled={!canRedo}>
            <RedoIcon />
          </ToolButton>
          <span className="mx-0.5 hidden h-7 w-px bg-steel-light/70 sm:block" aria-hidden="true" />
          <ToolButton
            label={gridOn ? 'Hide blueprint grid' : 'Show blueprint grid'}
            onClick={onToggleGrid}
            active={gridOn}
          >
            <GridIcon />
          </ToolButton>
          <ToolButton
            label={soundOn ? 'Mute workshop sounds' : 'Enable workshop sounds'}
            onClick={onToggleSound}
            active={soundOn}
          >
            {soundOn ? <SoundOnIcon /> : <SoundOffIcon />}
          </ToolButton>
          <ToolButton label="Reset to the default build" onClick={onReset}>
            <ResetIcon />
          </ToolButton>
          <ToolButton label="Shuffle a random build" onClick={onRandomize} tone="hazard">
            <DiceIcon />
          </ToolButton>
        </div>
      </div>
    </header>
  );
}

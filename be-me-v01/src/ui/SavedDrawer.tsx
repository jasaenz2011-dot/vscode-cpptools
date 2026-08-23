import { useEffect, useRef, useState } from 'react';
import type { SavedAvatar } from '../state/store';
import { FolderIcon, TrashIcon } from './icons';

interface SavedDrawerProps {
  open: boolean;
  saved: SavedAvatar[];
  loadedId: string | null;
  onClose: () => void;
  onLoad: (id: string) => void;
  onDelete: (id: string) => void;
}

export function SavedDrawer({ open, saved, loadedId, onClose, onLoad, onDelete }: SavedDrawerProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Close saved avatars"
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"
      />
      <aside className="frame motion-safe:animate-rise relative flex h-full w-[360px] max-w-[92vw] flex-col border-l border-gold/25">
        <header className="flex shrink-0 items-center justify-between border-b border-gold/16 px-4 py-3">
          <h2 className="label flex items-center gap-2">
            <FolderIcon className="text-[14px]" />
            My Avatars
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="btn-ghost cut-corner-sm px-2.5 py-1.5 text-[10px]"
          >
            Close
          </button>
        </header>

        <div className="scroll-fade min-h-0 flex-1 overflow-y-auto p-3">
          {saved.length === 0 ? (
            <p className="px-2 py-10 text-center text-[12px] leading-relaxed text-white/35">
              No avatars saved yet.
              <br />
              Build one and press{' '}
              <span className="font-display tracking-[0.14em] text-gold uppercase">Save Avatar</span>
              .
            </p>
          ) : (
            <ul className="flex flex-col gap-1.5">
              {saved.map((entry) => {
                const active = entry.id === loadedId;
                return (
                  <li key={entry.id}>
                    <div
                      className={`cut-corner-sm flex items-center gap-2 border px-3 py-2.5 transition-colors duration-200 ${
                        active
                          ? 'border-gold/70 bg-gradient-to-r from-gold/15 to-transparent'
                          : 'border-white/8 bg-white/[0.02] hover:border-cyan/35'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => onLoad(entry.id)}
                        className="min-w-0 flex-1 text-left"
                      >
                        <span
                          className={`block truncate font-display text-[12.5px] font-600 tracking-[0.08em] ${
                            active ? 'text-gold-bright' : 'text-white/82'
                          }`}
                        >
                          {entry.name}
                        </span>
                        <span className="mt-0.5 block truncate text-[10px] tracking-[0.1em] text-white/30 uppercase">
                          {entry.config.bodyBase} · {entry.config.style} ·{' '}
                          {new Date(entry.savedAt).toLocaleDateString()}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(entry.id)}
                        aria-label={`Delete ${entry.name}`}
                        className="shrink-0 p-1.5 text-white/25 transition-colors hover:text-red-400"
                      >
                        <TrashIcon className="text-[14px]" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </aside>
    </div>
  );
}

interface SaveDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (name: string) => void;
}

export function SaveDialog({ open, onCancel, onConfirm }: SaveDialogProps) {
  const [name, setName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setName('');
      const id = window.setTimeout(() => inputRef.current?.focus(), 40);
      return () => window.clearTimeout(id);
    }
    return undefined;
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-6">
      <button
        type="button"
        aria-label="Cancel save"
        onClick={onCancel}
        className="absolute inset-0 bg-black/75 backdrop-blur-[2px]"
      />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onConfirm(name);
        }}
        className="frame cut-corner corner-ticks motion-safe:animate-rise relative w-full max-w-sm p-5"
      >
        <h2 className="label">Save Avatar</h2>
        <div className="rule-gold my-3" />
        <label className="block">
          <span className="label-dim">Name</span>
          <input
            ref={inputRef}
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={40}
            placeholder="Untitled Build"
            className="mt-1.5 w-full border border-white/12 bg-black/50 px-3 py-2.5 font-display text-[14px] tracking-[0.06em] text-white outline-none transition-colors placeholder:text-white/22 focus:border-gold/70"
          />
        </label>
        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="btn-ghost cut-corner-sm px-4 py-2.5 text-[11px]"
          >
            Cancel
          </button>
          <button type="submit" className="btn-key cut-corner-sm px-5 py-2.5 text-[11px]">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

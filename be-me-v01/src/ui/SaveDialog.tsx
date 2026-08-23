import { useEffect, useRef, useState } from 'react';

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

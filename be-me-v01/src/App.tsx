import { useCallback, useEffect, useState } from 'react';
import { loadManifest, type ManifestIndex } from './engine/manifest';
import type { LayerReport } from './engine/LayerImage';
import { useStudio } from './state/store';
import { TopBar } from './ui/TopBar';
import { LeftPanel } from './ui/LeftPanel';
import { CenterStage } from './ui/CenterStage';
import { RightPanel } from './ui/RightPanel';
import { SaveDialog, SavedDrawer } from './ui/SavedDrawer';
import { FolderIcon } from './ui/icons';

export default function App() {
  const [manifest, setManifest] = useState<ManifestIndex | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reports, setReports] = useState<LayerReport[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [saveOpen, setSaveOpen] = useState(false);

  const config = useStudio((s) => s.config);
  const view = useStudio((s) => s.view);
  const activeCategory = useStudio((s) => s.activeCategory);
  const saved = useStudio((s) => s.saved);
  const loadedId = useStudio((s) => s.loadedId);
  const toast = useStudio((s) => s.toast);

  const hydrate = useStudio((s) => s.hydrate);
  const setStyle = useStudio((s) => s.setStyle);
  const setBodyBase = useStudio((s) => s.setBodyBase);
  const setView = useStudio((s) => s.setView);
  const setCategory = useStudio((s) => s.setCategory);
  const select = useStudio((s) => s.select);
  const reset = useStudio((s) => s.reset);
  const newAvatar = useStudio((s) => s.newAvatar);
  const randomize = useStudio((s) => s.randomize);
  const saveAvatar = useStudio((s) => s.saveAvatar);
  const loadAvatar = useStudio((s) => s.loadAvatar);
  const deleteAvatar = useStudio((s) => s.deleteAvatar);
  const clearToast = useStudio((s) => s.clearToast);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    const controller = new AbortController();
    loadManifest(controller.signal)
      .then(setManifest)
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : 'Could not load the asset manifest.');
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(clearToast, 2600);
    return () => window.clearTimeout(id);
  }, [toast, clearToast]);

  const handleRandomize = useCallback(() => {
    if (manifest) randomize(manifest);
  }, [manifest, randomize]);

  if (error) {
    return (
      <div className="circuitry grid h-full place-items-center p-8">
        <div className="frame cut-corner max-w-md p-6 text-center">
          <p className="label text-red-300">Manifest Error</p>
          <div className="rule-gold my-3" />
          <p className="text-[12.5px] leading-relaxed text-white/60">{error}</p>
          <code className="mt-3 block font-mono text-[11px] text-white/40">
            public/assets/manifest.json
          </code>
        </div>
      </div>
    );
  }

  if (!manifest) {
    return (
      <div className="circuitry grid h-full place-items-center">
        <p className="label animate-pulse">Loading manifest…</p>
      </div>
    );
  }

  return (
    <div className="circuitry flex h-full flex-col overflow-hidden">
      <TopBar
        onNew={newAvatar}
        onReset={reset}
        onRandomize={handleRandomize}
        onSave={() => setSaveOpen(true)}
      />

      <div className="rule-gold shrink-0" />

      <main className="grid min-h-0 flex-1 grid-cols-[220px_minmax(0,1fr)_260px] gap-3 p-3 xl:grid-cols-[250px_minmax(0,1fr)_300px] xl:gap-4 xl:p-4">
        <LeftPanel
          style={config.style}
          bodyBase={config.bodyBase}
          onStyle={setStyle}
          onBodyBase={setBodyBase}
        />

        <CenterStage
          manifest={manifest}
          style={config.style}
          bodyBase={config.bodyBase}
          view={view}
          selection={config.selection}
          reports={reports}
          onView={setView}
          onReports={setReports}
        />

        <RightPanel
          manifest={manifest}
          style={config.style}
          bodyBase={config.bodyBase}
          view={view}
          active={activeCategory}
          selection={config.selection}
          onCategory={setCategory}
          onSelect={select}
        />
      </main>

      <footer className="flex shrink-0 items-center justify-between gap-4 border-t border-gold/12 px-4 py-2">
        <p className="label-dim truncate">
          Master canvas {manifest.raw.masterCanvas.width} × {manifest.raw.masterCanvas.height} ·{' '}
          {manifest.raw.assets.length} manifest entries
          {manifest.canvasMismatch
            ? ` · manifest declares ${manifest.canvasMismatch.manifest}, app configured ${manifest.canvasMismatch.app}`
            : ''}
        </p>
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="btn-ghost cut-corner-sm flex shrink-0 items-center gap-2 px-3.5 py-2 text-[10.5px]"
        >
          <FolderIcon className="text-[13px]" />
          My Avatars
          {saved.length > 0 ? (
            <span className="ml-0.5 rounded-full bg-gold/20 px-1.5 text-[9.5px] text-gold-bright tabular-nums">
              {saved.length}
            </span>
          ) : null}
        </button>
      </footer>

      <SavedDrawer
        open={drawerOpen}
        saved={saved}
        loadedId={loadedId}
        onClose={() => setDrawerOpen(false)}
        onLoad={(id) => {
          loadAvatar(id);
          setDrawerOpen(false);
        }}
        onDelete={deleteAvatar}
      />

      <SaveDialog
        open={saveOpen}
        onCancel={() => setSaveOpen(false)}
        onConfirm={(name) => {
          saveAvatar(name);
          setSaveOpen(false);
        }}
      />

      {toast ? (
        <div
          role="status"
          aria-live="polite"
          className="motion-safe:animate-rise pointer-events-none fixed bottom-14 left-1/2 z-40 -translate-x-1/2"
        >
          <p
            className={`cut-corner-sm border px-4 py-2 font-display text-[11px] tracking-[0.16em] uppercase backdrop-blur-sm ${
              toast.tone === 'ok'
                ? 'border-gold/45 bg-black/85 text-gold-bright'
                : 'border-amber-400/45 bg-black/85 text-amber-300'
            }`}
          >
            {toast.message}
          </p>
        </div>
      ) : null}
    </div>
  );
}

import { useCallback, useEffect, useState } from 'react';
import { loadManifest, type ManifestIndex } from './engine/manifest';
import type { LayerReport } from './engine/LayerImage';
import { useStudio } from './state/store';
import { TopBar } from './ui/TopBar';
import { StylePanel } from './ui/StylePanel';
import { PreviewPanel } from './ui/PreviewPanel';
import { OrbStage } from './ui/OrbStage';
import { CustomizePanel } from './ui/CustomizePanel';
import { CreationsPanel } from './ui/CreationsPanel';
import { BottomNav } from './ui/BottomNav';
import { SaveDialog } from './ui/SaveDialog';

export default function App() {
  const [manifest, setManifest] = useState<ManifestIndex | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reports, setReports] = useState<LayerReport[]>([]);
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
  const showToast = useStudio((s) => s.showToast);
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

  const handleLaunch = useCallback(() => {
    showToast('Launch is a v0.2 destination — the build is saved and ready.', 'warn');
  }, [showToast]);

  if (error) {
    return (
      <div className="circuitry grid h-full place-items-center p-8">
        <div className="bezel notch max-w-md"><div className="bezel-in notch p-6 text-center">
          <p className="label text-red-300">Manifest Error</p>
          <div className="rule-gold my-3" />
          <p className="text-[12.5px] leading-relaxed text-white/60">{error}</p>
          <code className="mt-3 block font-mono text-[11px] text-white/40">
            public/assets/manifest.json
          </code>
        </div></div>
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

  const footnote = `Master canvas ${manifest.raw.masterCanvas.width} × ${manifest.raw.masterCanvas.height} · ${manifest.raw.assets.length} manifest entries${
    manifest.canvasMismatch
      ? ` · manifest ${manifest.canvasMismatch.manifest} vs app ${manifest.canvasMismatch.app}`
      : ''
  }`;

  return (
    <div className="circuitry flex h-full flex-col overflow-hidden">
      <TopBar
        onNew={newAvatar}
        onReset={reset}
        onRandomize={handleRandomize}
        onSave={() => setSaveOpen(true)}
      />

      {/* 01 + 03 | orb | 02 + 04 */}
      <main className="grid min-h-0 flex-1 grid-cols-[290px_minmax(0,1fr)_320px] gap-3 p-3 xl:grid-cols-[330px_minmax(0,1fr)_380px] xl:gap-4 xl:p-4">
        <div className="flex min-h-0 flex-col gap-3 xl:gap-4">
          <StylePanel
            style={config.style}
            bodyBase={config.bodyBase}
            onStyle={setStyle}
            onBodyBase={setBodyBase}
          />
          <PreviewPanel
            manifest={manifest}
            style={config.style}
            bodyBase={config.bodyBase}
            view={view}
            selection={config.selection}
            reports={reports}
            onView={setView}
          />
        </div>

        <OrbStage
          manifest={manifest}
          style={config.style}
          bodyBase={config.bodyBase}
          view={view}
          selection={config.selection}
          reports={reports}
          onView={setView}
          onReports={setReports}
          onLaunch={handleLaunch}
        />

        <div className="flex min-h-0 flex-col gap-3 xl:gap-4">
          <CustomizePanel
            manifest={manifest}
            style={config.style}
            bodyBase={config.bodyBase}
            view={view}
            active={activeCategory}
            selection={config.selection}
            onCategory={setCategory}
            onSelect={select}
          />
          <CreationsPanel
            manifest={manifest}
            saved={saved}
            loadedId={loadedId}
            onLoad={loadAvatar}
            onDelete={deleteAvatar}
            onNewSlot={() => setSaveOpen(true)}
          />
        </div>
      </main>

      <BottomNav footnote={footnote} />

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
          className="motion-safe:animate-rise pointer-events-none fixed bottom-16 left-1/2 z-40 -translate-x-1/2"
        >
          <p
            className={`notch-sm border px-4 py-2 font-display text-[10.5px] tracking-[0.16em] uppercase backdrop-blur-sm ${
              toast.tone === 'ok'
                ? 'border-gold/50 bg-black/88 text-gold-bright'
                : 'border-amber-400/50 bg-black/88 text-amber-300'
            }`}
          >
            {toast.message}
          </p>
        </div>
      ) : null}
    </div>
  );
}

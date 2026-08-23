'use client';

import { useCallback, useRef, useState } from 'react';
import {
  downloadAvatarPng,
  downloadBadgePng,
  downloadConfigJson,
  readConfigFile,
} from '@/lib/export';
import { play } from '@/lib/audio';
import { sanitizeConfig, useStudio } from '@/lib/store';
import { useStageRef } from '../stage/stage-ref';
import { CodeIcon, DownloadIcon, UploadIcon } from '../shell/icons';

type Status = { tone: 'ok' | 'error'; message: string; id: number } | null;

export function ExportStation() {
  const config = useStudio((s) => s.present);
  const loadConfig = useStudio((s) => s.loadConfig);
  const stageRef = useStageRef();
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>(null);

  const report = useCallback((tone: 'ok' | 'error', message: string) => {
    setStatus({ tone, message, id: Date.now() });
  }, []);

  const run = useCallback(
    async (key: string, task: () => Promise<void> | void, success: string) => {
      if (busy) return;
      setBusy(key);
      try {
        await task();
        play('stamp');
        report('ok', success);
      } catch (error) {
        report('error', error instanceof Error ? error.message : 'Something went wrong.');
      } finally {
        setBusy(null);
      }
    },
    [busy, report],
  );

  const exportBadge = () =>
    run(
      'badge',
      async () => {
        const svg = stageRef.current;
        if (!svg) throw new Error('The stage is not ready yet.');
        await downloadBadgePng({ config, svg });
      },
      'Badge PNG stamped and downloaded.',
    );

  const exportAvatar = () =>
    run(
      'avatar',
      async () => {
        const svg = stageRef.current;
        if (!svg) throw new Error('The stage is not ready yet.');
        await downloadAvatarPng(config, svg);
      },
      'Avatar PNG downloaded at 1080 × 1440.',
    );

  const exportJson = () =>
    run('json', () => downloadConfigJson(config), 'Build config exported as JSON.');

  const onImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    await run(
      'import',
      async () => {
        const raw = await readConfigFile(file);
        loadConfig(sanitizeConfig(raw));
      },
      'Build config loaded.',
    );
  };

  const buttonBase =
    'btn-mech w-full px-3 py-2.5 text-[11.5px] disabled:cursor-wait';

  return (
    <div className="flex flex-col gap-2.5 p-3">
      <button
        type="button"
        onClick={exportBadge}
        disabled={busy !== null}
        className={`${buttonBase} bg-hazard text-pitch hover:bg-hazard-glow`}
      >
        <DownloadIcon />
        {busy === 'badge' ? 'Stamping…' : 'Download Be ME! Badge'}
      </button>

      <div className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={exportAvatar}
          disabled={busy !== null}
          className={`${buttonBase} bg-cobalt text-chalk hover:bg-cobalt-light`}
        >
          <DownloadIcon />
          {busy === 'avatar' ? 'Rendering…' : 'Avatar PNG'}
        </button>
        <button
          type="button"
          onClick={exportJson}
          disabled={busy !== null}
          className={`${buttonBase} bg-steel text-chalk hover:bg-steel-light`}
        >
          <CodeIcon />
          JSON
        </button>
      </div>

      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        disabled={busy !== null}
        className={`${buttonBase} bg-steel/70 text-concrete hover:text-chalk`}
      >
        <UploadIcon />
        Load a saved build
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="application/json,.json"
        onChange={onImport}
        className="hidden"
        aria-label="Load a saved build from JSON"
      />

      <p
        role="status"
        aria-live="polite"
        className={`min-h-[32px] rounded-md border px-2.5 py-1.5 text-[11px] leading-snug transition-colors ${
          status === null
            ? 'border-steel-light/40 text-concrete/50'
            : status.tone === 'ok'
              ? 'border-hazard/50 bg-hazard/10 text-hazard'
              : 'border-red-500/50 bg-red-500/10 text-red-300'
        }`}
      >
        {status === null ? (
          'PNG downloads render at 3× for print. JSON keeps every layer and colour.'
        ) : (
          <span key={status.id} className="motion-safe:animate-pop-in inline-block">
            {status.message}
          </span>
        )}
      </p>
    </div>
  );
}

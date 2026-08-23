import { MASTER_CANVAS, UNCALIBRATED_ANCHORS, isCalibrated } from '../config/canvas';
import { ART_STYLES, BODY_BASES } from '../data/styles';
import type { ArtStyleId, BodyBase } from '../data/types';
import { LockIcon } from './icons';

interface LeftPanelProps {
  style: ArtStyleId;
  bodyBase: BodyBase;
  onStyle: (style: ArtStyleId) => void;
  onBodyBase: (base: BodyBase) => void;
}

export function LeftPanel({ style, bodyBase, onStyle, onBodyBase }: LeftPanelProps) {
  return (
    <aside className="flex h-full min-h-0 flex-col gap-3">
      <section className="frame cut-corner corner-ticks flex min-h-0 flex-1 flex-col">
        <PanelHeader title="Art Style" meta={`${ART_STYLES.filter((s) => s.enabled).length} / ${ART_STYLES.length} live`} />

        <div className="scroll-fade min-h-0 flex-1 overflow-y-auto px-2 py-2">
          <ul className="flex flex-col gap-1.5">
            {ART_STYLES.map((option) => {
              const active = option.id === style;
              return (
                <li key={option.id}>
                  <button
                    type="button"
                    onClick={() => option.enabled && onStyle(option.id)}
                    disabled={!option.enabled}
                    aria-current={active}
                    className={`group relative flex w-full items-center gap-3 px-3 py-2.5 text-left transition-all duration-200 ease-[var(--ease-soft)] ${
                      active
                        ? 'bg-gradient-to-r from-gold/16 to-transparent'
                        : option.enabled
                          ? 'hover:bg-white/[0.04]'
                          : 'cursor-not-allowed'
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`absolute inset-y-0 left-0 w-[2px] transition-colors duration-200 ${
                        active ? 'bg-gold shadow-[0_0_10px_var(--color-gold)]' : 'bg-transparent'
                      }`}
                    />
                    <span
                      className={`font-display text-[11px] tracking-[0.14em] tabular-nums ${
                        active ? 'text-gold' : 'text-white/22'
                      }`}
                    >
                      {option.index}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span
                        className={`block truncate font-display text-[12.5px] font-600 tracking-[0.12em] uppercase ${
                          active ? 'text-gold-bright' : option.enabled ? 'text-white/80' : 'text-white/30'
                        }`}
                      >
                        {option.name}
                      </span>
                      <span className="mt-0.5 block truncate text-[10px] leading-tight text-white/25">
                        {option.enabled ? option.descriptor : 'Coming soon'}
                      </span>
                    </span>
                    {!option.enabled ? (
                      <LockIcon className="shrink-0 text-[13px] text-white/18" />
                    ) : active ? (
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-cyan shadow-[0_0_8px_var(--color-cyan)]" />
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="frame cut-corner corner-ticks shrink-0">
        <PanelHeader title="Master Canvas" meta="Contract" />
        <dl className="space-y-1.5 px-3 py-2.5">
          <Row term="Canvas" value={`${MASTER_CANVAS.width} × ${MASTER_CANVAS.height}`} />
          <Row term="Fit" value="Exact · 1:1" />
          <Row
            term="Anchors"
            value={isCalibrated(UNCALIBRATED_ANCHORS) ? 'Calibrated' : 'Uncalibrated'}
            dim={!isCalibrated(UNCALIBRATED_ANCHORS)}
          />
        </dl>
      </section>

      <section className="frame cut-corner corner-ticks shrink-0">
        <PanelHeader title="Body Base" meta="Master" />
        <div className="grid grid-cols-2 gap-2 p-2.5">
          {BODY_BASES.map((option) => {
            const active = option.id === bodyBase;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => onBodyBase(option.id)}
                aria-pressed={active}
                className={`cut-corner-sm relative px-2 py-3 font-display text-[12px] font-700 tracking-[0.2em] uppercase transition-all duration-200 ease-[var(--ease-soft)] ${
                  active
                    ? 'border border-gold/70 bg-gradient-to-b from-gold/22 to-gold/[0.06] text-gold-bright shadow-[0_0_22px_-8px_var(--color-gold)]'
                    : 'border border-white/8 bg-white/[0.02] text-white/45 hover:border-gold/30 hover:text-white/75'
                }`}
              >
                {option.label}
                {active ? (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-3 bottom-1 h-px bg-gradient-to-r from-transparent via-cyan to-transparent"
                  />
                ) : null}
              </button>
            );
          })}
        </div>
      </section>
    </aside>
  );
}

function Row({ term, value, dim = false }: { term: string; value: string; dim?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <dt className="label-dim">{term}</dt>
      <dd
        className={`font-display text-[10.5px] font-600 tracking-[0.12em] tabular-nums ${
          dim ? 'text-white/34' : 'text-cyan/85'
        }`}
      >
        {value}
      </dd>
    </div>
  );
}

export function PanelHeader({ title, meta }: { title: string; meta?: string }) {
  return (
    <header className="flex shrink-0 items-center justify-between gap-2 border-b border-gold/16 px-3 py-2.5">
      <h2 className="label">{title}</h2>
      {meta ? <span className="label-dim">{meta}</span> : null}
    </header>
  );
}

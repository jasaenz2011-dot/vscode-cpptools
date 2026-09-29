import { Header } from '@/components/shell/Header';
import { Panel } from '@/components/shell/Panel';
import { WorkshopStage } from '@/components/stage/WorkshopStage';
import { Toolbelt } from '@/components/toolbelt/Toolbelt';
import { IdentityCard } from '@/components/badge/IdentityCard';
import { ExportStation } from '@/components/badge/ExportStation';

const SKIP_LINKS = [
  { href: '#station-toolbelt', label: 'Skip to the toolbelt' },
  { href: '#station-identity', label: 'Skip to the identity card' },
  { href: '#station-export', label: 'Skip to the export station' },
];

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col">
      {/* The trays hold ~100 controls, so keyboard users need a way past them. */}
      <nav aria-label="Skip links" className="sr-only focus-within:not-sr-only">
        <ul className="flex gap-2 bg-pitch p-2">
          {SKIP_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="btn-mech inline-flex bg-hazard px-3 py-2 text-[12px] text-pitch"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <Header />

      <main className="mx-auto w-full max-w-[1680px] flex-1 px-3 py-4 sm:px-5 sm:py-5">
        {/* One column on phones, two on tablets (stage spanning the top), three
            on desktop with the stage centred between toolbelt and badge. */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-start lg:grid-cols-[minmax(320px,1fr)_minmax(0,1.35fr)_minmax(320px,1fr)] lg:items-start xl:gap-5">
          {/* Stage leads on mobile; it is the thing students look at. */}
          <div className="order-1 md:col-span-2 lg:order-2 lg:col-span-1 lg:sticky lg:top-[86px]">
            <WorkshopStage />
          </div>

          <div id="station-toolbelt" tabIndex={-1} className="order-2 lg:order-1">
            <Toolbelt />
          </div>

          <div className="order-3 flex flex-col gap-4 lg:order-3">
            <Panel
              title="Identity Card"
              tag="Station 03"
              accent="#a855f7"
              bodyClassName="p-3"
              id="station-identity"
            >
              <IdentityCard />
            </Panel>

            <Panel title="Export Station" tag="Station 04" accent="#fb923c" id="station-export">
              <ExportStation />
            </Panel>
          </div>
        </div>
      </main>

      <footer className="mt-2 border-t border-steel-light/40 bg-pitch-deep">
        <div className="caution-tape h-[5px] w-full opacity-60" aria-hidden="true" />
        <div className="mx-auto flex max-w-[1680px] flex-col items-center justify-between gap-1.5 px-4 py-4 text-center sm:flex-row sm:text-left">
          <p className="font-blueprint text-[10px] tracking-[0.18em] text-concrete/50 uppercase">
            Be ME! · Under Construction · The Maker&rsquo;s Workshop
          </p>
          <p className="font-blueprint text-[10px] tracking-[0.18em] text-concrete/40 uppercase">
            Every build is saved to this device · Ctrl/⌘ + Z to undo
          </p>
        </div>
      </footer>
    </div>
  );
}

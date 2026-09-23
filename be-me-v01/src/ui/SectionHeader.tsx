/** Numbered section header — the 01 / 02 / 03 / 04 treatment from the reference. */
export function SectionHeader({
  number,
  title,
  accent,
  meta,
}: {
  number: string;
  title: string;
  accent?: string;
  meta?: string;
}) {
  return (
    <header className="flex shrink-0 items-center gap-3 border-b border-gold/20 px-3 py-2.5">
      <span className="cut-corner-sm grid h-8 w-8 shrink-0 place-items-center border border-gold/40 bg-black/50">
        <span className="section-no">{number}</span>
      </span>
      <span className="min-w-0 flex-1 leading-tight">
        <span className="label-dim block">{title}</span>
        {accent ? (
          <span className="block truncate font-display text-[12.5px] font-700 tracking-[0.2em] text-gold-bright uppercase">
            {accent}
          </span>
        ) : null}
      </span>
      {meta ? <span className="label-dim shrink-0">{meta}</span> : null}
    </header>
  );
}

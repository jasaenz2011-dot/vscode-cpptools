"""Layer 3b -- the command line.

    dlg init                       create a project skeleton next to your files
    dlg ingest [--force]           build the index from corpus/
    dlg status                     what is indexed, which backends are live
    dlg units --grade 5 --subject math
    dlg standards 5.3K 5.3E        show the district's exact wording
    dlg search "comparing fractions"
    dlg generate --grade 5 --subject math --week 6
    dlg serve                      the click-a-grade web interface
"""

from __future__ import annotations

import argparse
import shutil
import sys
from pathlib import Path

from . import __version__
from .agents.base import AgentError
from .config import CONFIG_FILENAME, Config
from .embeddings import ollama_available
from .ingest import ingest
from .llm import get_client
from .models import LessonRequest
from .pipeline import Pipeline
from .render import to_markdown, write_all
from .retrieval import Store
from .util import get_logger, truncate_words

log = get_logger("dlg.cli")


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="dlg",
        description="Generate standards-aligned lessons from your district's own documents.",
    )
    parser.add_argument("--version", action="version", version=f"dlg {__version__}")
    parser.add_argument("--root", default=".", help="project directory (default: current)")
    parser.add_argument("--corpus", help="override the corpus directory")
    parser.add_argument("--index", help="override the index directory")
    parser.add_argument("--backend", help="llm backend: auto|ollama|openai|anthropic|offline")
    parser.add_argument("--model", help="model name, e.g. llama3.1:8b")
    sub = parser.add_subparsers(dest="command", required=True)

    sub.add_parser("init", help="create dlg.config.json, corpus/, and output/")

    ingest_parser = sub.add_parser("ingest", help="index everything in corpus/")
    ingest_parser.add_argument("--force", action="store_true", help="rebuild even if unchanged")

    sub.add_parser("status", help="show what is indexed and which backends are reachable")
    sub.add_parser("doctor", help="check the local model and embedding backends")
    sub.add_parser("rules", help="print the instructional standard the validator enforces")

    units_parser = sub.add_parser("units", help="list scope and sequence units")
    units_parser.add_argument("--grade", default="")
    units_parser.add_argument("--subject", default="")

    standards_parser = sub.add_parser("standards", help="show verbatim standard text")
    standards_parser.add_argument("codes", nargs="+")

    search_parser = sub.add_parser("search", help="search the indexed corpus")
    search_parser.add_argument("query", nargs="+")
    search_parser.add_argument("-k", type=int, default=8)
    search_parser.add_argument("--grade", default="")
    search_parser.add_argument("--subject", default="")

    generate_parser = sub.add_parser("generate", help="generate a lesson or intervention packet")
    generate_parser.add_argument("--grade", required=True)
    generate_parser.add_argument("--subject", required=True)
    generate_parser.add_argument("--unit", default="", help="unit name or number")
    generate_parser.add_argument("--week", default="", help="week number or date")
    generate_parser.add_argument("--lesson", type=int, default=1, help="lesson number within the unit")
    generate_parser.add_argument("--minutes", type=int, default=60)
    generate_parser.add_argument(
        "--material", choices=("lesson", "intervention"), default="lesson"
    )
    generate_parser.add_argument("--tier", choices=("core", "tier2", "tier3"), default="core")
    generate_parser.add_argument("--notes", default="", help="class profile, e.g. '5 newcomers'")
    generate_parser.add_argument("--standards", nargs="*", default=[], help="override the standards")
    generate_parser.add_argument("--out", default="", help="output directory")
    generate_parser.add_argument("--stdout", action="store_true", help="print markdown instead of writing files")

    serve_parser = sub.add_parser("serve", help="run the local web interface")
    serve_parser.add_argument("--port", type=int, default=0)
    serve_parser.add_argument("--host", default="")

    return parser


def _config(args: argparse.Namespace) -> Config:
    overrides = {
        "corpus_dir": getattr(args, "corpus", None),
        "index_dir": getattr(args, "index", None),
        "llm_backend": getattr(args, "backend", None),
        "llm_model": getattr(args, "model", None),
    }
    return Config.load(args.root, {k: v for k, v in overrides.items() if v})


def main(argv: list[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    config = _config(args)
    handlers = {
        "init": cmd_init, "ingest": cmd_ingest, "status": cmd_status, "doctor": cmd_doctor,
        "rules": cmd_rules,
        "units": cmd_units, "standards": cmd_standards, "search": cmd_search,
        "generate": cmd_generate, "serve": cmd_serve,
    }
    try:
        return handlers[args.command](args, config)
    except FileNotFoundError as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 2
    except AgentError as exc:
        print(f"generation failed: {exc}", file=sys.stderr)
        return 3
    except KeyboardInterrupt:
        return 130


# ----------------------------------------------------------------------
def cmd_init(args: argparse.Namespace, config: Config) -> int:
    root = Path(config.root)
    root.mkdir(parents=True, exist_ok=True)
    corpus = config.corpus_path
    corpus.mkdir(parents=True, exist_ok=True)
    config.output_path.mkdir(parents=True, exist_ok=True)

    config_file = root / CONFIG_FILENAME
    if not config_file.exists():
        config.save(config_file)
        print(f"wrote {config_file}")
    else:
        print(f"{config_file} already exists; leaving it alone")

    samples = Path(__file__).resolve().parent.parent / "samples" / "corpus"
    if samples.is_dir() and not any(corpus.iterdir()):
        for source in samples.iterdir():
            if source.is_file():
                shutil.copy2(source, corpus / source.name)
        print(f"copied {len(list(corpus.iterdir()))} sample files into {corpus}")
        print("Replace them with your district's real documents when you are ready.")

    print("\nNext: dlg ingest    then: dlg generate --grade 5 --subject math")
    return 0


def cmd_ingest(args: argparse.Namespace, config: Config) -> int:
    report = ingest(config, force=args.force)
    print(report.summary())
    return 0


def cmd_status(args: argparse.Namespace, config: Config) -> int:
    print(f"project:   {config.root}")
    print(f"corpus:    {config.corpus_path}")
    print(f"index:     {config.index_path}")
    try:
        store = Store.load(config.index_path)
    except FileNotFoundError:
        print("\nNo index yet. Run: dlg ingest")
        return 0

    print(f"\nbuilt:     {store.meta.built_at}")
    print(f"documents: {len(store.documents)}")
    print(f"chunks:    {len(store.chunks)}   (embeddings: {store.meta.embed_backend})")
    print(f"standards: {len(store.standards)}")
    print(f"units:     {len(store.units)}")
    grades = ", ".join(store.known_grades()) or "none detected"
    subjects = ", ".join(store.known_subjects()) or "none detected"
    print(f"grades:    {grades}")
    print(f"subjects:  {subjects}")

    by_kind: dict[str, int] = {}
    for document in store.documents:
        by_kind[document.kind] = by_kind.get(document.kind, 0) + 1
    if by_kind:
        print("\ndocuments by kind:")
        for kind, count in sorted(by_kind.items()):
            print(f"  {kind:<12} {count}")
    if store.meta.warnings:
        print("\nwarnings from the last ingest:")
        for warning in store.meta.warnings:
            print(f"  - {warning}")
    print(f"\nmodel:     {get_client(config).describe()}")
    return 0


def cmd_doctor(args: argparse.Namespace, config: Config) -> int:
    print("Checking local backends...\n")
    reachable = ollama_available(config.llm_base_url)
    print(f"  Ollama at {config.llm_base_url}: {'reachable' if reachable else 'not reachable'}")
    if not reachable:
        print("    -> install from https://ollama.com, then: ollama pull llama3.1:8b")
        print("    -> and for retrieval:                      ollama pull nomic-embed-text")
    client = get_client(config)
    print(f"  selected model backend: {client.describe()}")

    for module, why in (
        ("numpy", "faster vector search"),
        ("pypdf", "much better PDF text extraction"),
        ("streamlit", "the optional Streamlit interface"),
    ):
        try:
            __import__(module)
            print(f"  {module}: installed ({why})")
        except ImportError:
            print(f"  {module}: not installed -- optional, {why}")

    try:
        store = Store.load(config.index_path)
        print(f"\n  index: {len(store.chunks)} chunks, built {store.meta.built_at}")
    except FileNotFoundError:
        print("\n  index: not built yet (run: dlg ingest)")
    return 0


def cmd_rules(args: argparse.Namespace, config: Config) -> int:
    """Print the instructional standard as the validator actually applies it."""
    from .schemas import EVERYDAY_MANIPULATIVES, HIGH_ORDER_MARKERS, HUNTER_STEPS, LOW_ORDER_STEMS

    print(f"Instructional standard enforced for {config.district_name}\n")
    print("Every lesson is a three-part package:")
    print("  Part A  Madeline Hunter lesson, all 8 steps")
    print("  Part B  student pages the children write on")
    print("  Part C  STAAR-level exit ticket with a teacher key\n")

    print("ERRORS -- the draft is sent back to the writer")
    for rule, description in (
        ("hunter_complete", "all 8 steps carry real teacher moves"),
        ("duration_sum", f"step minutes total the period (+/-{config.duration_tolerance_minutes})"),
        ("objective_form", "the objective states how mastery will be shown"),
        ("vocabulary_bounds", f"{config.vocabulary_min}-{config.vocabulary_max} academic vocabulary terms"),
        ("vocabulary_woven", "each term is used in Input, Modeling, Guided Practice or CFU"),
        ("high_order_questions", f"no bare recall stem at or under {config.bare_recall_max_words} words"),
        ("manipulatives", "a math lesson names manipulatives"),
        ("student_pages", "a page per activity, with evidence space, a because line and keys"),
        ("exit_ticket_staar", f">={config.exit_ticket_min_items} STAAR items with distractor rationale, "
                              "a constructed item, model + justification + 0/1/2 rubric"),
        ("closure_points_to_ticket", "closure hands students to the exit ticket"),
        ("ell_support", "language load and concept gap diagnosed separately, 4 motion-movie beats"),
        ("no_growth_promises", "never promises a score outcome"),
        ("standards_grounded", "every cited code resolves to a district standard"),
        ("no_invented_codes", "no code unknown to the district appears anywhere"),
        ("no_placeholders", "no TBD or template debris survives"),
        ("required_sections", "the sections a teacher cannot teach without are filled"),
    ):
        print(f"  {rule:<26} {description}")

    print("\nWARNINGS -- reported, not retried")
    for rule, description in (
        ("verbatim_standards", "standard text matches the district's wording"),
        ("realistic_period", f"lesson length within {config.period_min_minutes}-{config.period_max_minutes} minutes"),
        ("sentence_length", f"student-facing text under {config.max_sentence_words} words a sentence"),
        ("citations_resolve", "cited filenames exist in the corpus"),
    ):
        print(f"  {rule:<26} {description}")

    print("\nBANNED AS A WHOLE QUESTION (unless a reasoning demand is attached)")
    print(f"  {', '.join(LOW_ORDER_STEMS)}")
    print("\nCOUNTS AS A REASONING DEMAND")
    print(f"  {', '.join(HIGH_ORDER_MARKERS)}")
    print("\nEVERYDAY OBJECTS PREFERRED IN MATH")
    print(f"  {', '.join(EVERYDAY_MANIPULATIVES)}")
    print("\nHUNTER STEPS")
    print("  " + " -> ".join(label for _, label in HUNTER_STEPS))
    print(f"\nChange any threshold in {config.root}/dlg.config.json")
    return 0


def cmd_units(args: argparse.Namespace, config: Config) -> int:
    store = Store.load(config.index_path)
    units = store.units_for(args.grade, args.subject)
    if not units:
        print("No units matched. Try `dlg status` to see which grades and subjects were parsed.")
        return 1
    for unit in units:
        window = unit.weeks or f"{unit.start_date}-{unit.end_date}".strip("-") or "no window"
        print(f"[{unit.sequence:>2}] {unit.unit_name}")
        print(f"     grade {unit.grade} {unit.subject} | {window} | {unit.days or '?'} days")
        if unit.standard_codes:
            print(f"     standards: {', '.join(unit.standard_codes)}")
        if unit.focus:
            print(f"     focus: {truncate_words(unit.focus, 24)}")
        print(f"     source: {unit.source_path} ({unit.locator})")
    return 0


def cmd_standards(args: argparse.Namespace, config: Config) -> int:
    store = Store.load(config.index_path)
    found, missing = store.lookup_standards(args.codes)
    for standard in found:
        header = standard.code + (f"  [{standard.level}]" if standard.level else "")
        print(f"{header}")
        print(f"  {standard.text}")
        print(f"  grade {standard.grade or '?'} {standard.subject or ''} -- {standard.citation()}\n")
    for code in missing:
        print(f"{code}: not found in any district document", file=sys.stderr)
    return 1 if missing else 0


def cmd_search(args: argparse.Namespace, config: Config) -> int:
    pipeline = Pipeline(config)
    hits = pipeline.retriever.search(
        " ".join(args.query), k=args.k, grade=args.grade, subject=args.subject
    )
    if not hits:
        print("No matches.")
        return 1
    for rank, hit in enumerate(hits, start=1):
        reasons = f"  ({', '.join(hit.reasons)})" if hit.reasons else ""
        print(f"{rank:>2}. [{hit.score:.3f}] {hit.chunk.citation()}  <{hit.chunk.kind}>{reasons}")
        print(f"    {truncate_words(hit.chunk.text.replace(chr(10), ' '), 40)}\n")
    return 0


def cmd_generate(args: argparse.Namespace, config: Config) -> int:
    pipeline = Pipeline(config)
    request = LessonRequest(
        grade=args.grade,
        subject=args.subject,
        unit=args.unit,
        week=args.week,
        lesson_number=args.lesson,
        duration_minutes=args.minutes,
        material=args.material,
        tier=args.tier,
        student_notes=args.notes,
        focus_standards=list(args.standards or []),
    )
    print(f"backend: {pipeline.client.describe()}", file=sys.stderr)
    result = pipeline.generate(request)

    print(
        f"context: {result.context_report.get('used_tokens')}/"
        f"{result.context_report.get('budget_tokens')} tokens, "
        f"{result.attempts} pass(es)",
        file=sys.stderr,
    )
    for violation in result.report.violations:
        print(f"  {violation}", file=sys.stderr)

    if args.stdout:
        print(to_markdown(result))
        return 0 if result.report.ok else 1

    output_dir = Path(args.out) if args.out else config.output_path
    written = write_all(result, output_dir)
    print("\nwrote:")
    for label, path in written.items():
        print(f"  {label:<9} {path}")
    return 0 if result.report.ok else 1


def cmd_serve(args: argparse.Namespace, config: Config) -> int:
    from .server import serve

    serve(config, host=args.host or config.server_host, port=args.port or config.server_port)
    return 0


if __name__ == "__main__":  # pragma: no cover
    raise SystemExit(main())

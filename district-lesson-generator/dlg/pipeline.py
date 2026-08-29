"""Layer 2 orchestration -- wire the agents into one generate() call.

    map the curriculum -> resolve standards verbatim -> pack context -> draft
    -> deterministic repair -> validate -> model repair (bounded) -> result

The repair loop is bounded and shrinking: each retry sends back only the failed
checks and the allowed standard codes, not the whole corpus, so a second pass
costs a fraction of the first and cannot drift onto new material.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any

from .agents import CurriculumMapper, InterventionWriter, LessonWriter, StandardsAgent, Validator
from .agents.base import AgentError
from .agents.validator import apply_deterministic_fixes
from .config import Config
from .contextpack import ContextOverflow
from .embeddings import get_embedder
from .llm import LLMClient, get_client
from .models import GenerationResult, LessonRequest, ValidationReport
from .retrieval import Retriever, Store
from .util import dedupe, get_logger

log = get_logger("dlg.pipeline")


@dataclass
class PipelineInfo:
    backend: str = ""
    embeddings: str = ""
    documents: int = 0
    chunks: int = 0
    standards: int = 0
    units: int = 0
    grades: list[str] = field(default_factory=list)
    subjects: list[str] = field(default_factory=list)

    def to_dict(self) -> dict[str, Any]:
        return self.__dict__.copy()


class Pipeline:
    def __init__(self, config: Config, store: Store | None = None, client: LLMClient | None = None) -> None:
        self.config = config
        self.store = store or Store.load(config.index_path)
        self.client = client or get_client(config)
        embedder = None
        if self.store.vectors:
            embedder = get_embedder(
                config.embed_backend, config.embed_model, config.llm_base_url, config.embed_dim
            )
            if getattr(embedder, "name", "") != self.store.meta.embed_backend:
                log.warning(
                    "index was built with %s but %s is configured; vector search disabled. "
                    "Re-run `dlg ingest --force` to rebuild.",
                    self.store.meta.embed_backend, getattr(embedder, "name", "?"),
                )
                embedder = None
        self.retriever = Retriever(
            self.store, embedder, config.lexical_weight, config.vector_weight
        )

        common = dict(config=config, client=self.client, store=self.store, retriever=self.retriever)
        self.mapper = CurriculumMapper(**common)
        self.standards_agent = StandardsAgent(**common)
        self.lesson_writer = LessonWriter(**common)
        self.intervention_writer = InterventionWriter(**common)
        self.validator = Validator(**common)

    # ------------------------------------------------------------------
    def info(self) -> PipelineInfo:
        return PipelineInfo(
            backend=self.client.describe(),
            embeddings=self.store.meta.embed_backend or "none",
            documents=len(self.store.documents),
            chunks=len(self.store.chunks),
            standards=len(self.store.standards),
            units=len(self.store.units),
            grades=self.store.known_grades(),
            subjects=self.store.known_subjects(),
        )

    # ------------------------------------------------------------------
    def generate(self, request: LessonRequest) -> GenerationResult:
        intervention = request.material == "intervention"
        writer = self.intervention_writer if intervention else self.lesson_writer

        mapping = self.mapper.run(request)
        pack = self.standards_agent.run(mapping.all_codes, request.grade, request.subject)

        try:
            document, packed = writer.run(request, mapping, pack)
        except ContextOverflow as exc:
            raise AgentError(str(exc)) from exc

        fixes = apply_deterministic_fixes(
            document, pack, intervention, self.store, request.grade, request.subject
        )
        report = self.validator.run(document, request, pack)
        attempts = 1

        while (
            not report.ok
            and attempts <= self.config.max_repair_attempts
            and not writer.offline
        ):
            log.info(
                "repair pass %d/%d for %d error(s): %s",
                attempts, self.config.max_repair_attempts, len(report.errors),
                "; ".join(v.rule for v in report.errors),
            )
            try:
                document = writer.repair(document, report.errors, pack, request)
            except AgentError as exc:
                log.warning("repair pass failed (%s); keeping the previous draft", exc)
                break
            fixes.extend(
                apply_deterministic_fixes(
                    document, pack, intervention, self.store, request.grade, request.subject
                )
            )
            report = self.validator.run(document, request, pack)
            attempts += 1

        self._annotate(document, mapping, pack, report, fixes, writer.offline)

        return GenerationResult(
            request=request,
            unit=mapping.unit,
            standards=pack.standards,
            document=document,
            report=report,
            attempts=attempts,
            citations=self._citations(mapping, pack),
            context_report=packed.report(),
            backend=self.client.describe(),
        )

    # ------------------------------------------------------------------
    def _annotate(
        self,
        document: dict[str, Any],
        mapping: Any,
        pack: Any,
        report: ValidationReport,
        fixes: list[str],
        offline: bool,
    ) -> None:
        """Record provenance inside the document so an exported file carries it."""
        document["_provenance"] = {
            "district": self.config.district_name,
            "unit": mapping.unit.label() if mapping.unit else "",
            "unit_source": (
                f"{mapping.unit.source_path} ({mapping.unit.locator})" if mapping.unit else ""
            ),
            "standards_sources": dedupe([s.citation() for s in pack.standards]),
            "backend": self.client.describe(),
            "mode": "scaffold" if offline else "generated",
            "automatic_fixes": fixes,
            "unresolved_codes": pack.missing,
            "notes": [*mapping.notes, *pack.notes],
            "open_issues": [v.message for v in report.errors],
        }

    def _citations(self, mapping: Any, pack: Any) -> list[str]:
        out: list[str] = []
        if mapping.unit:
            out.append(f"{mapping.unit.source_path} ({mapping.unit.locator})")
        out.extend(standard.citation() for standard in pack.standards)
        out.extend(hit.chunk.citation() for hit in pack.support)
        return dedupe(out)

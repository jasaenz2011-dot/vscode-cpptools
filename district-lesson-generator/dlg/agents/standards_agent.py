"""Standards Agent -- resolve codes to the district's exact wording.

This agent never calls a model. That is the point: the text of a standard is a
lookup, and a lookup that sometimes paraphrases is worse than no lookup at all.

It does three things:

1. Resolve each code against the parsed standards table.
2. For codes that miss, search the raw chunks -- a code that appears in a PDF
   the parser could not tabulate is still recoverable, and recovering it beats
   telling a teacher their standard does not exist.
3. Gather supporting context: resources, assessments, and vertical alignment
   text that mention those codes.
"""

from __future__ import annotations

import re
from dataclasses import dataclass, field

from ..models import Standard
from ..retrieval import Hit
from ..util import get_logger, normalize_code
from .base import Agent

log = get_logger("dlg.agents.standards")

_INLINE_RE_TEMPLATE = r"{code}\s*[).:\-–]?\s+(?P<text>[A-Za-z][^\n]{{12,400}})"


@dataclass
class StandardsPack:
    standards: list[Standard] = field(default_factory=list)
    missing: list[str] = field(default_factory=list)
    recovered: list[str] = field(default_factory=list)
    support: list[Hit] = field(default_factory=list)
    notes: list[str] = field(default_factory=list)

    @property
    def codes(self) -> list[str]:
        return [standard.code for standard in self.standards]

    def allowed_code_keys(self) -> set[str]:
        return {normalize_code(standard.code) for standard in self.standards}

    def to_block(self) -> str:
        """The verbatim block that gets pinned into the model's context."""
        if not self.standards:
            return "(No standards could be resolved from district documents.)"
        lines: list[str] = []
        for standard in self.standards:
            header = standard.code
            if standard.level:
                header += f" [{standard.level}]"
            lines.append(f"{header}: {standard.text}")
            provenance = standard.citation()
            if provenance:
                lines.append(f"    source: {provenance}")
        return "\n".join(lines)


class StandardsAgent(Agent):
    name = "standards"

    def run(
        self,
        codes: list[str],
        grade: str = "",
        subject: str = "",
        support_k: int = 6,
    ) -> StandardsPack:
        pack = StandardsPack()
        if self.store is None:
            pack.notes.append("no index available; standards could not be resolved")
            return pack

        found, missing = self.store.lookup_standards(codes, grade, subject)
        pack.standards = found

        for code in missing:
            recovered = self._recover_from_chunks(code, grade, subject)
            if recovered:
                pack.standards.append(recovered)
                pack.recovered.append(code)
            else:
                pack.missing.append(code)

        if pack.recovered:
            pack.notes.append(
                "Recovered from document text rather than a standards table: "
                + ", ".join(pack.recovered)
                + ". Verify the wording against your official export."
            )
        if pack.missing:
            pack.notes.append(
                "Not found in any district document: "
                + ", ".join(pack.missing)
                + ". These will not be cited in the generated material."
            )

        pack.support = self._gather_support(pack.standards, grade, subject, support_k)
        return pack

    # ------------------------------------------------------------------
    def _recover_from_chunks(self, code: str, grade: str, subject: str) -> Standard | None:
        """Find ``code`` followed by its text inside an indexed chunk."""
        if self.store is None:
            return None
        key = normalize_code(code)
        pattern = re.compile(
            _INLINE_RE_TEMPLATE.format(code=re.escape(code.strip())), re.IGNORECASE
        )
        for chunk in self.store.chunks:
            if key not in {normalize_code(c) for c in chunk.codes}:
                continue
            match = pattern.search(chunk.text)
            if not match:
                continue
            text = match.group("text").strip(" |")
            # A table row renders as "code | text | more"; keep the first cell.
            text = text.split(" | ")[0].strip()
            if len(text.split()) < 4:
                continue
            return Standard(
                code=code.strip(),
                text=text,
                grade=chunk.grade or grade,
                subject=chunk.subject or subject,
                source_path=chunk.path,
                locator=chunk.locator,
            )
        return None

    def _gather_support(
        self, standards: list[Standard], grade: str, subject: str, k: int
    ) -> list[Hit]:
        if not self.retriever or not standards:
            return []
        query = " ".join(
            f"{standard.code} {standard.text}" for standard in standards[:4]
        )
        return self.retriever.search(
            query,
            k=k,
            grade=grade,
            subject=subject,
            kinds=("resource", "assessment", "pacing", "unknown"),
            boost_codes=[standard.code for standard in standards],
        )

"""Context budgeting -- the part that decides what a small model gets to see.

An 8B model with an 8k window cannot be handed a district's whole curriculum,
and the naive fix (retrieve top-k, concatenate, hope) fails in the specific way
that matters here: the standards text gets truncated, and a truncated standard
produces a lesson that is *almost* aligned.

So sections are packed by priority with an explicit contract:

* **Pinned** sections (the verbatim standards, the active pacing row) are never
  trimmed. If they do not fit, that is an error the teacher can act on --
  narrow the focus standards or raise ``context_tokens`` -- not a silent cut.
* **Trimmable** sections (retrieved resources, prior lessons) are cut at
  paragraph boundaries, largest-priority-number first, and the packed result
  records exactly what was dropped.

Every generation returns its :class:`PackedContext` report, so when a lesson
looks thin you can see whether the model was starved or simply wrong.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any

from .util import estimate_tokens


class ContextOverflow(RuntimeError):
    """Pinned content alone exceeds the context budget."""


@dataclass
class Section:
    name: str
    text: str
    priority: int = 50          # lower packs first and survives trimming
    pinned: bool = False        # never trimmed
    tokens: int = 0
    trimmed_from: int = 0

    @property
    def was_trimmed(self) -> bool:
        return self.trimmed_from > 0


@dataclass
class PackedContext:
    text: str = ""
    budget: int = 0
    used: int = 0
    sections: list[Section] = field(default_factory=list)
    dropped: list[str] = field(default_factory=list)

    def report(self) -> dict[str, Any]:
        return {
            "budget_tokens": self.budget,
            "used_tokens": self.used,
            "headroom_tokens": max(0, self.budget - self.used),
            "sections": [
                {
                    "name": section.name,
                    "tokens": section.tokens,
                    "pinned": section.pinned,
                    "trimmed_from_tokens": section.trimmed_from or None,
                }
                for section in self.sections
            ],
            "dropped": self.dropped,
        }

    def summary_line(self) -> str:
        parts = [f"{s.name}={s.tokens}" + ("*" if s.was_trimmed else "") for s in self.sections]
        return f"context {self.used}/{self.budget} tokens [{' '.join(parts)}]"


class ContextPacker:
    def __init__(self, budget_tokens: int) -> None:
        self.budget = max(256, int(budget_tokens))
        self._sections: list[Section] = []

    def add(self, name: str, text: str, priority: int = 50, pinned: bool = False) -> None:
        text = (text or "").strip()
        if not text:
            return
        self._sections.append(
            Section(name=name, text=text, priority=priority, pinned=pinned,
                    tokens=estimate_tokens(text))
        )

    def pack(self) -> PackedContext:
        ordered = sorted(self._sections, key=lambda s: (s.priority, s.name))
        pinned_cost = sum(s.tokens for s in ordered if s.pinned)
        if pinned_cost > self.budget:
            raise ContextOverflow(
                f"the standards and pacing context alone need {pinned_cost} tokens but the "
                f"budget is {self.budget}. Narrow the focus standards, split the lesson, or "
                f"raise context_tokens in dlg.config.json."
            )

        remaining = self.budget - pinned_cost
        kept: list[Section] = []
        dropped: list[str] = []

        for section in ordered:
            if section.pinned:
                kept.append(section)
                continue
            if remaining <= 0:
                dropped.append(section.name)
                continue
            if section.tokens <= remaining:
                kept.append(section)
                remaining -= section.tokens
                continue
            trimmed = _trim_to_tokens(section.text, remaining)
            if not trimmed.strip():
                dropped.append(section.name)
                continue
            section.trimmed_from = section.tokens
            section.text = trimmed
            section.tokens = estimate_tokens(trimmed)
            kept.append(section)
            remaining -= section.tokens

        kept.sort(key=lambda s: (s.priority, s.name))
        body = "\n\n".join(f"### {s.name}\n{s.text}" for s in kept)
        return PackedContext(
            text=body,
            budget=self.budget,
            used=sum(s.tokens for s in kept),
            sections=kept,
            dropped=dropped,
        )


def _trim_to_tokens(text: str, budget: int) -> str:
    """Cut at the last block boundary that fits, then note the omission."""
    if budget <= 0:
        return ""
    marker = "\n[... trimmed to fit the model's context window ...]"
    marker_cost = estimate_tokens(marker)
    target = max(0, budget - marker_cost)
    if target <= 0:
        return ""

    blocks = text.split("\n\n")
    kept: list[str] = []
    used = 0
    for block in blocks:
        cost = estimate_tokens(block)
        if used + cost > target:
            break
        kept.append(block)
        used += cost

    if kept:
        return "\n\n".join(kept) + marker

    # No paragraph fits: try lines, then words. A wall of text with no
    # structure is still worth half of, and dropping the section entirely
    # would silently starve the model of the one resource it was given.
    for line in text.split("\n"):
        cost = estimate_tokens(line)
        if used + cost > target:
            break
        kept.append(line)
        used += cost
    if kept:
        return "\n".join(kept) + marker

    words: list[str] = []
    used = 0
    for word in text.split():
        cost = estimate_tokens(word + " ")
        if used + cost > target:
            break
        words.append(word)
        used += cost
    return (" ".join(words) + marker) if words else ""

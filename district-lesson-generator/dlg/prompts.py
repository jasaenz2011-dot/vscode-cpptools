"""Prompt loading.

Prompts live as ``.md`` files next to this module so a curriculum director can
edit the voice of the generated materials without touching Python. Placeholders
are ``{{name}}`` rather than ``str.format`` braces, because every prompt here
contains JSON examples full of literal braces.
"""

from __future__ import annotations

import re
from functools import lru_cache
from pathlib import Path

PROMPT_DIR = Path(__file__).parent / "prompts"
_PLACEHOLDER_RE = re.compile(r"\{\{\s*([a-z0-9_]+)\s*\}\}", re.IGNORECASE)


@lru_cache(maxsize=32)
def load(name: str) -> str:
    path = PROMPT_DIR / f"{name}.md"
    if not path.is_file():
        raise FileNotFoundError(f"prompt template not found: {path}")
    return path.read_text(encoding="utf-8")


def render(name: str, **values: object) -> str:
    """Fill ``{{placeholders}}``; unknown ones collapse to an empty string."""
    template = load(name)

    def substitute(match: re.Match[str]) -> str:
        value = values.get(match.group(1).lower())
        return "" if value is None else str(value)

    filled = _PLACEHOLDER_RE.sub(substitute, template)
    # Collapse the blank lines left behind by empty optional sections.
    return re.sub(r"\n{3,}", "\n\n", filled).strip()


def available() -> list[str]:
    return sorted(path.stem for path in PROMPT_DIR.glob("*.md"))

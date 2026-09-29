"""Small shared helpers: token accounting, text normalization, logging."""

from __future__ import annotations

import hashlib
import json
import logging
import re
import sys
import unicodedata
from typing import Any, Iterable

_LOG_CONFIGURED = False

# Two regexes, deliberately.
#
# STANDARD_CODE_RE is permissive and used for indexing and retrieval boosting,
# where a false positive costs one wasted lookup.
#
# STRICT_CODE_RE is used by the validator's hallucinated-code scan, where a
# false positive would reject a correct lesson. It requires a shape a decimal
# number cannot have -- a letter suffix, a subject prefix, or three dotted
# levels -- so "3.5" in a fifth-grade math problem is never mistaken for a code.
STANDARD_CODE_RE = re.compile(
    r"""\b
    (?:[A-Z]{1,6}\.)?          # optional subject prefix, e.g. MATH. / RL. / SCI.
    \d{1,3}                    # grade or chapter
    (?:\.\d{1,3})+             # at least one dotted level
    (?:\s*\(?[A-Za-z]\)?)?     # optional student expectation letter
    \b""",
    re.VERBOSE,
)

STRICT_CODE_RE = re.compile(
    r"""(?:
        \b[A-Z]{2,6}\.\d{1,3}(?:\.\d{1,3})*(?:\s*\(?[A-Za-z]\)?)?\b   # RL.5.1 / MATH.5.3.K
      | \b\d{1,3}\.\d{1,3}(?:\.\d{1,3})+(?:\s*\(?[A-Za-z]\)?)?\b      # 112.16.3
      | \b\d{1,3}\.\d{1,3}\s*\(\s*[A-Za-z]\s*\)                       # 5.3(K)
      | \b\d{1,3}\.\d{1,3}[A-Za-z]\b                                  # 5.3K
    )""",
    re.VERBOSE,
)

_WS_RE = re.compile(r"[ \t ]+")
_MULTINEWLINE_RE = re.compile(r"\n{3,}")
_WORD_RE = re.compile(r"[a-z0-9']+")


def get_logger(name: str = "dlg", level: int = logging.INFO) -> logging.Logger:
    """Return a configured logger that writes to stderr (stdout stays clean)."""
    global _LOG_CONFIGURED
    if not _LOG_CONFIGURED:
        handler = logging.StreamHandler(sys.stderr)
        handler.setFormatter(logging.Formatter("%(levelname)-7s %(name)s: %(message)s"))
        root = logging.getLogger("dlg")
        root.addHandler(handler)
        root.setLevel(level)
        root.propagate = False
        _LOG_CONFIGURED = True
    return logging.getLogger(name)


def estimate_tokens(text: str) -> int:
    """Cheap, model-agnostic token estimate.

    Real tokenizers vary by model and none ship with the standard library. Four
    characters per token is the usual rule of thumb for English prose and runs
    slightly conservative for the tabular curriculum text we pack, which is what
    we want when budgeting a fixed context window.
    """
    if not text:
        return 0
    return max(1, (len(text) + 3) // 4)


def clean_text(text: str) -> str:
    """Normalize whitespace and unicode without destroying document structure."""
    if not text:
        return ""
    text = unicodedata.normalize("NFKC", text)
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    # Ligatures and typographic characters that survive PDF extraction.
    for bad, good in (
        ("ﬁ", "fi"), ("ﬂ", "fl"), ("‘", "'"), ("’", "'"),
        ("“", '"'), ("”", '"'), ("–", "-"), ("—", "--"),
        ("•", "* "), ("­", ""),
    ):
        text = text.replace(bad, good)
    lines = [_WS_RE.sub(" ", line).strip() for line in text.split("\n")]
    text = "\n".join(lines)
    return _MULTINEWLINE_RE.sub("\n\n", text).strip()


def normalize_for_match(text: str) -> str:
    """Aggressive normalization used when comparing two renderings of the same
    standard text (the model's copy vs. the district's source of truth)."""
    text = clean_text(text).lower()
    text = re.sub(r"[^a-z0-9 ]+", " ", text)
    return " ".join(text.split())


def normalize_code(code: str) -> str:
    """Canonical form of a standard code so ``5.3(K)`` == ``5.3K`` == ``5.3 k``."""
    return re.sub(r"[^a-z0-9]", "", (code or "").lower())


def find_standard_codes(text: str) -> list[str]:
    """Return every standard-code-shaped token in ``text``, in order, deduped."""
    seen: set[str] = set()
    out: list[str] = []
    for match in STANDARD_CODE_RE.finditer(text or ""):
        raw = match.group(0).strip()
        key = normalize_code(raw)
        if key and key not in seen:
            seen.add(key)
            out.append(raw)
    return out


def find_strict_codes(text: str) -> list[str]:
    """Standard-code tokens that a plain decimal number cannot produce."""
    seen: set[str] = set()
    out: list[str] = []
    for match in STRICT_CODE_RE.finditer(text or ""):
        raw = match.group(0).strip()
        key = normalize_code(raw)
        if key and key not in seen:
            seen.add(key)
            out.append(raw)
    return out


def walk_strings(node: Any, path: str = "") -> Iterable[tuple[str, str]]:
    """Yield ``(dotted_path, string)`` for every string in a nested structure."""
    if isinstance(node, str):
        yield path, node
    elif isinstance(node, dict):
        for key, value in node.items():
            yield from walk_strings(value, f"{path}.{key}" if path else str(key))
    elif isinstance(node, (list, tuple)):
        for index, value in enumerate(node):
            yield from walk_strings(value, f"{path}[{index}]")


def tokenize(text: str) -> list[str]:
    """Lowercase word tokens for lexical retrieval."""
    return _WORD_RE.findall((text or "").lower())


def slugify(text: str, max_len: int = 60) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", (text or "").lower()).strip("-")
    return (slug[:max_len].rstrip("-")) or "untitled"


def stable_id(*parts: Any) -> str:
    """Deterministic short id, so re-ingesting an unchanged corpus is a no-op."""
    digest = hashlib.sha1("\x1f".join(str(p) for p in parts).encode("utf-8"))
    return digest.hexdigest()[:16]


def dumps(obj: Any, indent: int | None = 2) -> str:
    return json.dumps(obj, indent=indent, ensure_ascii=False, sort_keys=False, default=str)


def truncate_words(text: str, max_words: int) -> str:
    words = (text or "").split()
    if len(words) <= max_words:
        return text or ""
    return " ".join(words[:max_words]) + " ..."


def dedupe(items: Iterable[str]) -> list[str]:
    seen: set[str] = set()
    out: list[str] = []
    for item in items:
        key = (item or "").strip().lower()
        if key and key not in seen:
            seen.add(key)
            out.append(item.strip())
    return out


def grade_key(grade: str) -> str:
    """Normalize grade labels: ``Grade 5``, ``5th``, ``05`` -> ``5``; ``K`` -> ``K``."""
    raw = (grade or "").strip().lower()
    if not raw:
        return ""
    if raw in {"k", "kg", "kinder", "kindergarten", "grade k"}:
        return "K"
    if raw in {"pk", "pre-k", "prek", "pre-kindergarten"}:
        return "PK"
    match = re.search(r"\d{1,2}", raw)
    if match:
        return str(int(match.group(0)))
    return raw.upper()


def subject_key(subject: str) -> str:
    """Fold common subject spellings so a district export and a UI click agree."""
    raw = " ".join((subject or "").strip().lower().split())
    aliases = {
        "math": "math", "mathematics": "math", "maths": "math",
        "ela": "ela", "english": "ela", "english language arts": "ela",
        "reading": "ela", "rla": "ela", "language arts": "ela",
        "science": "science", "sci": "science",
        "social studies": "social studies", "ss": "social studies",
        "history": "social studies",
    }
    return aliases.get(raw, raw)

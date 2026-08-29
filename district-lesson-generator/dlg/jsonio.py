"""Getting reliable JSON out of an 8B model that was asked politely.

Small local models emit JSON wrapped in prose, fenced in markdown, with trailing
commas, smart quotes, or a stray comment. Rather than raise on the first
malformed byte, :func:`parse_json` peels those layers off in order and only
then gives up.

:func:`coerce` then forces the parsed object into the shape the renderer
expects, so a missing list is an empty list and never an ``AttributeError`` in
the middle of writing a teacher's lesson.
"""

from __future__ import annotations

import json
import re
from typing import Any

_FENCE_RE = re.compile(r"```(?:json|JSON)?\s*(.*?)```", re.DOTALL)
_TRAILING_COMMA_RE = re.compile(r",(\s*[}\]])")
_CONTROL_RE = re.compile(r"[\x00-\x08\x0b\x0c\x0e-\x1f]")


class JSONRecoveryError(ValueError):
    """Raised when no JSON object could be recovered from a model response."""


def parse_json(raw: str) -> dict[str, Any]:
    """Recover a JSON object from a model response. Raises on total failure."""
    if not raw or not raw.strip():
        raise JSONRecoveryError("empty model response")

    for candidate in _candidates(raw):
        for attempt in (candidate, _repair(candidate)):
            try:
                value = json.loads(attempt)
            except (json.JSONDecodeError, ValueError):
                continue
            if isinstance(value, dict):
                return value
            if isinstance(value, list) and value and isinstance(value[0], dict):
                return value[0]
    raise JSONRecoveryError(
        "model response contained no parseable JSON object "
        f"(first 200 chars: {raw.strip()[:200]!r})"
    )


def _candidates(raw: str) -> list[str]:
    out: list[str] = []
    for match in _FENCE_RE.finditer(raw):
        block = match.group(1).strip()
        if block:
            out.append(block)
    stripped = raw.strip()
    out.append(stripped)
    balanced = _first_balanced_object(stripped)
    if balanced:
        out.append(balanced)
    seen: set[str] = set()
    return [c for c in out if not (c in seen or seen.add(c))]


def _first_balanced_object(text: str) -> str:
    """Return the first top-level ``{...}`` span, ignoring braces inside strings."""
    start = text.find("{")
    if start == -1:
        return ""
    depth = 0
    in_string = False
    escaped = False
    for index in range(start, len(text)):
        char = text[index]
        if in_string:
            if escaped:
                escaped = False
            elif char == "\\":
                escaped = True
            elif char == '"':
                in_string = False
            continue
        if char == '"':
            in_string = True
        elif char == "{":
            depth += 1
        elif char == "}":
            depth -= 1
            if depth == 0:
                return text[start : index + 1]
    return text[start:]  # truncated output; _repair may still close it


def _repair(text: str) -> str:
    text = text.strip()
    text = text.replace("“", '"').replace("”", '"')
    text = text.replace("‘", "'").replace("’", "'")
    text = _CONTROL_RE.sub(" ", text)
    text = re.sub(r"^\s*//.*$", "", text, flags=re.MULTILINE)
    text = _TRAILING_COMMA_RE.sub(r"\1", text)
    # Close a response the model ran out of tokens on.
    opens = text.count("{") - text.count("}")
    if opens > 0:
        text = text.rstrip().rstrip(",")
        brackets = text.count("[") - text.count("]")
        text += "]" * max(0, brackets) + "}" * opens
    return text


# --------------------------------------------------------------------------
# Lightweight schema coercion
# --------------------------------------------------------------------------
#   "str"            -> string
#   "int"            -> integer
#   ["str"]          -> list of strings
#   {...}            -> nested object
#   [{...}]          -> list of objects
def coerce(data: Any, schema: Any) -> Any:
    """Force ``data`` into ``schema``'s shape, filling sane defaults."""
    if schema == "str":
        if data is None:
            return ""
        if isinstance(data, (list, tuple)):
            return " ".join(str(item) for item in data)
        if isinstance(data, dict):
            return json.dumps(data, ensure_ascii=False)
        return str(data).strip()

    if schema == "int":
        if isinstance(data, bool):
            return int(data)
        if isinstance(data, (int, float)):
            return int(data)
        match = re.search(r"-?\d+", str(data or ""))
        return int(match.group(0)) if match else 0

    if isinstance(schema, list) and schema:
        item_schema = schema[0]
        if data is None:
            return []
        if not isinstance(data, list):
            # A model that returned "a; b; c" where a list was requested.
            if item_schema == "str" and isinstance(data, str):
                parts = [p.strip() for p in re.split(r"[\n;]+|(?<=[.!?])\s{2,}", data) if p.strip()]
                return parts or ([data.strip()] if data.strip() else [])
            data = [data]
        return [coerce(item, item_schema) for item in data if item is not None]

    if isinstance(schema, dict):
        source = data if isinstance(data, dict) else {}
        return {key: coerce(source.get(key), sub) for key, sub in schema.items()}

    return data

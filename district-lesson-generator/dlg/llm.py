"""Model backends. Local first, hosted optional, offline always works.

``ollama``   a local model (Llama 3, Mistral, Qwen, ...) over Ollama's HTTP API.
``openai``   any OpenAI-compatible server: LM Studio, llama.cpp, vLLM, TGI.
``anthropic``the Claude API, for districts that have approved a hosted model.
``offline``  no model at all -- the writer agents assemble a verbatim-grounded
             scaffold from retrieved district content so the pipeline, the
             validator, and the exports can be exercised before any model is
             installed. Output is clearly marked as a scaffold.

Only :mod:`urllib` is used, so there is no SDK to install and no telemetry.
"""

from __future__ import annotations

import json
import os
import urllib.error
import urllib.request
from dataclasses import dataclass
from typing import Any, Protocol

from .util import get_logger

log = get_logger("dlg.llm")

ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages"
ANTHROPIC_VERSION = "2023-06-01"
DEFAULT_ANTHROPIC_MODEL = "claude-sonnet-5"


class LLMError(RuntimeError):
    """A backend refused, timed out, or returned something unusable."""


@dataclass
class Usage:
    input_tokens: int = 0
    output_tokens: int = 0


class LLMClient(Protocol):
    kind: str
    model: str

    def describe(self) -> str: ...

    def complete(
        self,
        system: str,
        user: str,
        *,
        max_tokens: int = 2048,
        temperature: float = 0.2,
        json_mode: bool = False,
    ) -> str: ...


# --------------------------------------------------------------------------
def _post_json(url: str, payload: dict[str, Any], headers: dict[str, str], timeout: int) -> dict[str, Any]:
    body = json.dumps(payload).encode("utf-8")
    request = urllib.request.Request(url, data=body, headers={"Content-Type": "application/json", **headers})
    try:
        with urllib.request.urlopen(request, timeout=timeout) as response:
            return json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")[:400]
        raise LLMError(f"{url} returned HTTP {exc.code}: {detail}") from exc
    except (urllib.error.URLError, OSError) as exc:
        raise LLMError(f"could not reach {url}: {exc}") from exc
    except json.JSONDecodeError as exc:
        raise LLMError(f"{url} returned a non-JSON body: {exc}") from exc


# --------------------------------------------------------------------------
class OllamaClient:
    kind = "ollama"

    def __init__(self, model: str, base_url: str = "http://localhost:11434",
                 timeout: int = 300, context_tokens: int = 8192) -> None:
        self.model = model
        self.base_url = base_url.rstrip("/")
        self.timeout = timeout
        self.context_tokens = context_tokens

    def describe(self) -> str:
        return f"Ollama {self.model} at {self.base_url}"

    def complete(self, system: str, user: str, *, max_tokens: int = 2048,
                 temperature: float = 0.2, json_mode: bool = False) -> str:
        payload: dict[str, Any] = {
            "model": self.model,
            "stream": False,
            "messages": [
                {"role": "system", "content": system},
                {"role": "user", "content": user},
            ],
            "options": {
                "temperature": temperature,
                "num_ctx": self.context_tokens,
                "num_predict": max_tokens,
            },
        }
        if json_mode:
            payload["format"] = "json"
        data = _post_json(f"{self.base_url}/api/chat", payload, {}, self.timeout)
        content = (data.get("message") or {}).get("content", "")
        if not content:
            raise LLMError(f"Ollama returned an empty response for model {self.model!r}")
        return content

    def available(self) -> bool:
        return _http_ok(f"{self.base_url}/api/tags")


class OpenAICompatClient:
    """LM Studio, llama.cpp server, vLLM, TGI -- anything speaking /v1/chat/completions."""

    kind = "openai"

    def __init__(self, model: str, base_url: str = "http://localhost:1234",
                 api_key: str = "", timeout: int = 300) -> None:
        self.model = model
        self.base_url = base_url.rstrip("/")
        self.api_key = api_key
        self.timeout = timeout

    def describe(self) -> str:
        return f"OpenAI-compatible {self.model} at {self.base_url}"

    def complete(self, system: str, user: str, *, max_tokens: int = 2048,
                 temperature: float = 0.2, json_mode: bool = False) -> str:
        payload: dict[str, Any] = {
            "model": self.model,
            "temperature": temperature,
            "max_tokens": max_tokens,
            "messages": [
                {"role": "system", "content": system},
                {"role": "user", "content": user},
            ],
        }
        if json_mode:
            payload["response_format"] = {"type": "json_object"}
        headers = {"Authorization": f"Bearer {self.api_key}"} if self.api_key else {}
        url = self.base_url if self.base_url.endswith("/chat/completions") else f"{self.base_url}/v1/chat/completions"
        data = _post_json(url, payload, headers, self.timeout)
        choices = data.get("choices") or []
        if not choices:
            raise LLMError("OpenAI-compatible server returned no choices")
        return (choices[0].get("message") or {}).get("content", "") or ""


class AnthropicClient:
    kind = "anthropic"

    def __init__(self, model: str = DEFAULT_ANTHROPIC_MODEL, api_key: str = "", timeout: int = 300) -> None:
        self.model = model
        self.api_key = api_key
        self.timeout = timeout

    def describe(self) -> str:
        return f"Claude API ({self.model})"

    def complete(self, system: str, user: str, *, max_tokens: int = 2048,
                 temperature: float = 0.2, json_mode: bool = False) -> str:
        if not self.api_key:
            raise LLMError("no API key set for the Anthropic backend")
        messages: list[dict[str, Any]] = [{"role": "user", "content": user}]
        if json_mode:
            # Prefilling the assistant turn with "{" removes the preamble that
            # otherwise has to be stripped back off.
            messages.append({"role": "assistant", "content": "{"})
        payload = {
            "model": self.model,
            "max_tokens": max_tokens,
            "temperature": temperature,
            "system": system,
            "messages": messages,
        }
        headers = {"x-api-key": self.api_key, "anthropic-version": ANTHROPIC_VERSION}
        data = _post_json(ANTHROPIC_API_URL, payload, headers, self.timeout)
        blocks = data.get("content") or []
        text = "".join(block.get("text", "") for block in blocks if block.get("type") == "text")
        if json_mode:
            text = "{" + text
        if not text.strip():
            raise LLMError("Claude API returned an empty response")
        return text


class OfflineClient:
    """A stand-in that never calls a model.

    The writer agents recognise this backend and assemble a scaffold from the
    retrieved district content instead of generating prose. Everything
    downstream -- validation, citation checking, rendering, export -- runs
    unchanged, so the system is testable and demonstrable with no model
    installed.
    """

    kind = "offline"
    model = "offline-scaffold"

    def describe(self) -> str:
        return "offline scaffold (no model) -- install Ollama for full generation"

    def complete(self, system: str, user: str, *, max_tokens: int = 2048,
                 temperature: float = 0.2, json_mode: bool = False) -> str:
        raise LLMError(
            "the offline backend does not generate text; agents must use their scaffold path"
        )


# --------------------------------------------------------------------------
def _http_ok(url: str, timeout: float = 1.5) -> bool:
    try:
        with urllib.request.urlopen(url, timeout=timeout):
            return True
    except (urllib.error.URLError, OSError, ValueError):
        return False


def get_client(config: Any) -> LLMClient:
    """Build the configured client, falling back to something that works."""
    backend = (getattr(config, "llm_backend", "auto") or "auto").lower()
    model = getattr(config, "llm_model", "llama3.1:8b")
    base_url = getattr(config, "llm_base_url", "http://localhost:11434")
    timeout = int(getattr(config, "request_timeout", 300))
    context_tokens = int(getattr(config, "context_tokens", 8192))
    api_key = os.environ.get(getattr(config, "llm_api_key_env", "ANTHROPIC_API_KEY"), "")

    if backend == "ollama":
        return OllamaClient(model, base_url, timeout, context_tokens)
    if backend in {"openai", "openai-compat", "lmstudio", "llamacpp", "vllm"}:
        return OpenAICompatClient(model, base_url, api_key, timeout)
    if backend in {"anthropic", "claude"}:
        return AnthropicClient(model if model.startswith("claude") else DEFAULT_ANTHROPIC_MODEL,
                               api_key, timeout)
    if backend in {"offline", "none", "scaffold"}:
        return OfflineClient()

    # auto: prefer a local model, then a configured hosted key, then offline.
    ollama = OllamaClient(model, base_url, timeout, context_tokens)
    if ollama.available():
        log.info("using %s", ollama.describe())
        return ollama
    if api_key:
        client = AnthropicClient(model if model.startswith("claude") else DEFAULT_ANTHROPIC_MODEL,
                                 api_key, timeout)
        log.info("using %s", client.describe())
        return client
    log.warning(
        "no local model found at %s and no API key in $%s -- running in offline scaffold mode",
        base_url, getattr(config, "llm_api_key_env", "ANTHROPIC_API_KEY"),
    )
    return OfflineClient()

"""Shared agent plumbing."""

from __future__ import annotations

from typing import Any

from ..config import Config
from ..jsonio import JSONRecoveryError, coerce, parse_json
from ..llm import LLMClient, LLMError
from ..retrieval import Retriever, Store
from ..util import get_logger

log = get_logger("dlg.agents")

_JSON_NUDGE = (
    "\n\nYour previous reply was not valid JSON. Reply with the JSON object only: "
    "start with { and end with }. No explanation, no markdown fence."
)


class AgentError(RuntimeError):
    """An agent could not produce usable output."""


class Agent:
    name = "agent"

    def __init__(
        self,
        config: Config,
        client: LLMClient,
        store: Store | None = None,
        retriever: Retriever | None = None,
    ) -> None:
        self.config = config
        self.client = client
        self.store = store
        self.retriever = retriever

    @property
    def offline(self) -> bool:
        return getattr(self.client, "kind", "") == "offline"

    def complete_json(
        self,
        system: str,
        user: str,
        schema: Any,
        *,
        max_tokens: int | None = None,
        temperature: float | None = None,
        attempts: int = 2,
    ) -> dict[str, Any]:
        """Call the model and return a schema-shaped dict.

        One retry with an explicit nudge covers the common case of a small model
        prefacing its JSON with a sentence. Beyond that the failure is real and
        the caller should hear about it.
        """
        if self.offline:
            raise AgentError(f"{self.name} cannot call a model in offline mode")

        max_tokens = max_tokens or self.config.max_output_tokens
        temperature = self.config.temperature if temperature is None else temperature
        last_error: Exception | None = None

        for attempt in range(1, attempts + 1):
            prompt = user if attempt == 1 else user + _JSON_NUDGE
            try:
                raw = self.client.complete(
                    system, prompt,
                    max_tokens=max_tokens, temperature=temperature, json_mode=True,
                )
            except LLMError as exc:
                raise AgentError(f"{self.name}: {exc}") from exc
            try:
                return coerce(parse_json(raw), schema)
            except JSONRecoveryError as exc:
                last_error = exc
                log.warning("%s: attempt %d returned unparseable JSON (%s)", self.name, attempt, exc)

        raise AgentError(
            f"{self.name}: the model did not return valid JSON after {attempts} attempts. "
            f"Last error: {last_error}"
        )

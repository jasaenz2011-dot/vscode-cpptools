"""Runtime configuration.

Precedence: explicit argument > ``dlg.config.json`` in the project root >
environment variable > default. Everything has a default that works offline.
"""

from __future__ import annotations

import json
import os
from dataclasses import asdict, dataclass, field, fields
from pathlib import Path
from typing import Any

CONFIG_FILENAME = "dlg.config.json"


def _env(name: str, default: Any) -> Any:
    raw = os.environ.get(f"DLG_{name.upper()}")
    if raw is None:
        return default
    if isinstance(default, bool):
        return raw.strip().lower() in {"1", "true", "yes", "on"}
    if isinstance(default, int):
        try:
            return int(raw)
        except ValueError:
            return default
    if isinstance(default, float):
        try:
            return float(raw)
        except ValueError:
            return default
    return raw


@dataclass
class Config:
    """All tunables in one place."""

    # --- District identity (appears on generated materials) --------------
    district_name: str = field(default_factory=lambda: _env("district_name", "Our District"))
    standards_framework: str = field(default_factory=lambda: _env("standards_framework", "TEKS"))

    # --- Paths -----------------------------------------------------------
    corpus_dir: str = field(default_factory=lambda: _env("corpus_dir", "corpus"))
    index_dir: str = field(default_factory=lambda: _env("index_dir", ".dlg_index"))
    output_dir: str = field(default_factory=lambda: _env("output_dir", "output"))

    # --- Ingestion -------------------------------------------------------
    chunk_tokens: int = field(default_factory=lambda: _env("chunk_tokens", 320))
    chunk_overlap_tokens: int = field(default_factory=lambda: _env("chunk_overlap_tokens", 64))
    embed_backend: str = field(default_factory=lambda: _env("embed_backend", "auto"))
    embed_model: str = field(default_factory=lambda: _env("embed_model", "nomic-embed-text"))
    embed_dim: int = field(default_factory=lambda: _env("embed_dim", 512))

    # --- Retrieval -------------------------------------------------------
    top_k: int = field(default_factory=lambda: _env("top_k", 12))
    lexical_weight: float = field(default_factory=lambda: _env("lexical_weight", 0.6))
    vector_weight: float = field(default_factory=lambda: _env("vector_weight", 0.4))

    # --- Generation ------------------------------------------------------
    llm_backend: str = field(default_factory=lambda: _env("llm_backend", "auto"))
    llm_model: str = field(default_factory=lambda: _env("llm_model", "llama3.1:8b"))
    llm_base_url: str = field(default_factory=lambda: _env("llm_base_url", "http://localhost:11434"))
    llm_api_key_env: str = field(default_factory=lambda: _env("llm_api_key_env", "ANTHROPIC_API_KEY"))
    temperature: float = field(default_factory=lambda: _env("temperature", 0.2))
    request_timeout: int = field(default_factory=lambda: _env("request_timeout", 300))

    # --- Context budget (the local-model constraint that drives design) --
    context_tokens: int = field(default_factory=lambda: _env("context_tokens", 8192))
    max_output_tokens: int = field(default_factory=lambda: _env("max_output_tokens", 2600))
    prompt_reserve_tokens: int = field(default_factory=lambda: _env("prompt_reserve_tokens", 900))

    # --- Validation / repair loop ---------------------------------------
    max_repair_attempts: int = field(default_factory=lambda: _env("max_repair_attempts", 2))
    duration_tolerance_minutes: int = field(default_factory=lambda: _env("duration_tolerance_minutes", 5))
    strict: bool = field(default_factory=lambda: _env("strict", False))

    # --- Interface -------------------------------------------------------
    server_host: str = field(default_factory=lambda: _env("server_host", "127.0.0.1"))
    server_port: int = field(default_factory=lambda: _env("server_port", 8765))

    # Set when loaded from disk; used to resolve relative paths.
    root: str = "."

    # -- helpers ---------------------------------------------------------
    @property
    def corpus_path(self) -> Path:
        return self._resolve(self.corpus_dir)

    @property
    def index_path(self) -> Path:
        return self._resolve(self.index_dir)

    @property
    def output_path(self) -> Path:
        return self._resolve(self.output_dir)

    def _resolve(self, value: str) -> Path:
        path = Path(value).expanduser()
        return path if path.is_absolute() else (Path(self.root) / path).resolve()

    @property
    def input_budget_tokens(self) -> int:
        """Tokens available for retrieved context after output and prompt reserve."""
        return max(512, self.context_tokens - self.max_output_tokens - self.prompt_reserve_tokens)

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)

    @classmethod
    def load(cls, root: str | Path = ".", overrides: dict[str, Any] | None = None) -> "Config":
        root_path = Path(root).expanduser().resolve()
        data: dict[str, Any] = {}
        config_file = root_path / CONFIG_FILENAME
        if config_file.is_file():
            try:
                data = json.loads(config_file.read_text(encoding="utf-8"))
            except json.JSONDecodeError as exc:
                raise ValueError(f"{config_file} is not valid JSON: {exc}") from exc
        known = {f.name for f in fields(cls)}
        merged = {k: v for k, v in data.items() if k in known}
        for key, value in (overrides or {}).items():
            if value is not None and key in known:
                merged[key] = value
        config = cls(**merged)
        config.root = str(root_path)
        return config

    def save(self, path: str | Path | None = None) -> Path:
        target = Path(path) if path else Path(self.root) / CONFIG_FILENAME
        payload = {k: v for k, v in self.to_dict().items() if k != "root"}
        target.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
        return target

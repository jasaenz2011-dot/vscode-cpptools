"""Embedding backends, newest-capable-first with a working offline default.

``auto``      use Ollama if it answers on ``llm_base_url``, else ``hashing``.
``ollama``    a local embedding model (default ``nomic-embed-text``).
``sentence``  ``sentence-transformers`` if it is installed.
``hashing``   the built-in fallback: a signed hashing vectorizer over words and
              character 4-grams. It is not semantic -- it approximates lexical
              similarity in a fixed-width vector -- which is exactly why the
              retriever fuses it with BM25 instead of trusting it alone.

Swapping backends does not change the index format, but it does change the
vectors, so :class:`dlg.retrieval.Store` records the backend and dimension and
re-embeds when they change.
"""

from __future__ import annotations

import hashlib
import json
import math
import urllib.error
import urllib.request
from collections import Counter
from typing import Protocol, Sequence

from .util import get_logger, tokenize

log = get_logger("dlg.embeddings")


class Embedder(Protocol):
    name: str
    dim: int

    def embed(self, texts: Sequence[str]) -> list[list[float]]: ...


# --------------------------------------------------------------------------
class HashingEmbedder:
    """Deterministic, dependency-free vectorizer using the hashing trick."""

    def __init__(self, dim: int = 512) -> None:
        self.dim = max(64, int(dim))
        self.name = f"hashing-{self.dim}"

    def embed(self, texts: Sequence[str]) -> list[list[float]]:
        return [self._embed_one(text) for text in texts]

    def _embed_one(self, text: str) -> list[float]:
        vector = [0.0] * self.dim
        words = tokenize(text)
        for word, count in Counter(words).items():
            self._add(vector, word, 1.0 + math.log(count))
        # Character 4-grams keep codes like "5.3(K)" and "112.16" comparable even
        # when word tokenization splits them apart.
        lowered = (text or "").lower()
        grams = Counter(lowered[i : i + 4] for i in range(max(0, len(lowered) - 3)))
        for gram, count in grams.items():
            if gram.strip():
                self._add(vector, f"#{gram}", 0.35 * (1.0 + math.log(count)))
        norm = math.sqrt(sum(value * value for value in vector))
        if norm > 0:
            vector = [value / norm for value in vector]
        return vector

    def _add(self, vector: list[float], token: str, weight: float) -> None:
        digest = hashlib.blake2b(token.encode("utf-8"), digest_size=8).digest()
        value = int.from_bytes(digest, "big")
        index = value % self.dim
        sign = 1.0 if (value >> 63) & 1 else -1.0
        vector[index] += sign * weight


# --------------------------------------------------------------------------
class OllamaEmbedder:
    """Local embeddings via the Ollama HTTP API."""

    def __init__(self, model: str = "nomic-embed-text",
                 base_url: str = "http://localhost:11434", timeout: int = 120) -> None:
        self.model = model
        self.base_url = base_url.rstrip("/")
        self.timeout = timeout
        self.name = f"ollama:{model}"
        self.dim = 0  # discovered on first call

    def embed(self, texts: Sequence[str]) -> list[list[float]]:
        out: list[list[float]] = []
        for text in texts:
            vector = self._embed_one(text)
            if not self.dim:
                self.dim = len(vector)
            out.append(vector)
        return out

    def _embed_one(self, text: str) -> list[float]:
        payload = json.dumps({"model": self.model, "prompt": text}).encode("utf-8")
        request = urllib.request.Request(
            f"{self.base_url}/api/embeddings",
            data=payload,
            headers={"Content-Type": "application/json"},
        )
        with urllib.request.urlopen(request, timeout=self.timeout) as response:
            data = json.loads(response.read().decode("utf-8"))
        vector = data.get("embedding") or (data.get("embeddings") or [[]])[0]
        if not vector:
            raise RuntimeError(f"Ollama returned no embedding for model {self.model!r}")
        norm = math.sqrt(sum(v * v for v in vector))
        return [v / norm for v in vector] if norm else list(vector)


# --------------------------------------------------------------------------
class SentenceTransformerEmbedder:
    """``sentence-transformers`` when the teacher's machine already has it."""

    def __init__(self, model: str = "all-MiniLM-L6-v2") -> None:
        from sentence_transformers import SentenceTransformer  # type: ignore

        self._model = SentenceTransformer(model)
        self.name = f"sentence:{model}"
        self.dim = int(self._model.get_sentence_embedding_dimension())

    def embed(self, texts: Sequence[str]) -> list[list[float]]:
        vectors = self._model.encode(list(texts), normalize_embeddings=True)
        return [list(map(float, vector)) for vector in vectors]


# --------------------------------------------------------------------------
def ollama_available(base_url: str, timeout: float = 1.5) -> bool:
    try:
        with urllib.request.urlopen(f"{base_url.rstrip('/')}/api/tags", timeout=timeout):
            return True
    except (urllib.error.URLError, OSError, ValueError):
        return False


def get_embedder(
    backend: str = "auto",
    model: str = "nomic-embed-text",
    base_url: str = "http://localhost:11434",
    dim: int = 512,
) -> Embedder:
    """Build an embedder, degrading gracefully rather than failing the run."""
    backend = (backend or "auto").lower()

    if backend in {"hash", "hashing", "builtin", "none"}:
        return HashingEmbedder(dim)

    if backend in {"sentence", "sentence-transformers", "st"}:
        try:
            return SentenceTransformerEmbedder(model if "/" in model or "-" in model else "all-MiniLM-L6-v2")
        except Exception as exc:
            log.warning("sentence-transformers unavailable (%s); using hashing embeddings", exc)
            return HashingEmbedder(dim)

    if backend == "ollama":
        return OllamaEmbedder(model, base_url)

    # auto
    if ollama_available(base_url):
        embedder = OllamaEmbedder(model, base_url)
        try:
            embedder.embed(["probe"])
            log.info("using %s for embeddings", embedder.name)
            return embedder
        except Exception as exc:
            log.warning("Ollama reachable but embedding model %r failed (%s)", model, exc)
    log.info("using built-in hashing embeddings (offline-safe)")
    return HashingEmbedder(dim)

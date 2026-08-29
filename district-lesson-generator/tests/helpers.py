"""Shared test fixtures: a throwaway project and a scripted model backend."""

from __future__ import annotations

import logging
import shutil
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from dlg.config import Config          # noqa: E402
from dlg.ingest import ingest          # noqa: E402
from dlg.retrieval import Store        # noqa: E402
from dlg.util import get_logger        # noqa: E402

SAMPLES = ROOT / "samples" / "corpus"

# The tests deliberately exercise the unhappy paths (unreadable files, repair
# passes, unparseable model output). Those log lines are the system working, so
# quiet them here rather than in the library.
get_logger().setLevel(logging.ERROR)


class FakeClient:
    """A model backend that replays scripted responses."""

    kind = "fake"
    model = "fake-model"

    def __init__(self, responses: list[str]) -> None:
        self.responses = list(responses)
        self.calls: list[tuple[str, str]] = []

    def describe(self) -> str:
        return "scripted test backend"

    def complete(self, system: str, user: str, **kwargs: object) -> str:
        self.calls.append((system, user))
        if not self.responses:
            raise AssertionError("FakeClient ran out of scripted responses")
        return self.responses.pop(0)


def make_project(files: dict[str, str] | None = None) -> tuple[Config, Store, Path]:
    """Build a temp project. With no ``files``, the sample corpus is used."""
    tmp = Path(tempfile.mkdtemp(prefix="dlg-test-"))
    corpus = tmp / "corpus"
    corpus.mkdir(parents=True)

    if files is None:
        for source in SAMPLES.iterdir():
            if source.is_file():
                shutil.copy2(source, corpus / source.name)
    else:
        for name, content in files.items():
            path = corpus / name
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(content, encoding="utf-8")

    config = Config.load(tmp, {"embed_backend": "hashing", "llm_backend": "offline"})
    ingest(config, force=True)
    return config, Store.load(config.index_path), tmp

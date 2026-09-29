"""District Lesson Generator (dlg).

A local-first, zero-dependency pipeline that turns a district's own scope and
sequence, standards exports, and resource libraries into standards-aligned
lesson plans and intervention materials.

Three layers, matching the architecture this package implements:

1. Ingestion & context   -- ``dlg.loaders``, ``dlg.chunking``, ``dlg.parsers``,
                            ``dlg.ingest``, ``dlg.retrieval``, ``dlg.embeddings``
2. Agent orchestration   -- ``dlg.agents``, ``dlg.pipeline``, ``dlg.contextpack``
3. Interface & output    -- ``dlg.cli``, ``dlg.server``, ``dlg.render``

Everything required to run end to end is in the Python standard library.
Optional accelerators (Ollama, numpy, pypdf, python-docx, Streamlit) are
detected at runtime and used when present.
"""

__version__ = "0.1.0"

__all__ = ["__version__"]

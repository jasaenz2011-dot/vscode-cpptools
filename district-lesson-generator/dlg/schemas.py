"""Output shapes the agents must produce.

These are deliberately not JSON Schema. A local 8B model does a better job with
a short worked example than with a formal schema, and what actually enforces
the shape is :func:`dlg.jsonio.coerce`, which runs on whatever comes back. The
dicts below are both the coercion spec and the source of the example shown in
the prompt, so the two can never drift apart.
"""

from __future__ import annotations

import json
from typing import Any

LESSON_SCHEMA: dict[str, Any] = {
    "title": "str",
    "essential_question": "str",
    "learning_objective": "str",
    "language_objective": "str",
    "success_criteria": ["str"],
    "standards": [{"code": "str", "text": "str", "emphasis": "str"}],
    "vocabulary": [{"term": "str", "student_friendly_definition": "str", "spanish_cognate": "str"}],
    "materials": ["str"],
    "prior_knowledge": "str",
    "misconceptions": [{"misconception": "str", "teacher_response": "str"}],
    "lesson_flow": [
        {
            "phase": "str",
            "minutes": "int",
            "teacher_moves": ["str"],
            "student_actions": ["str"],
            "check_for_understanding": "str",
        }
    ],
    "differentiation": {
        "tier2_support": ["str"],
        "emergent_bilingual": ["str"],
        "special_education": ["str"],
        "extension": ["str"],
    },
    "formative_assessment": {"task": "str", "exemplar_response": "str", "scoring_notes": "str"},
    "exit_ticket": {"prompt": "str", "answer_key": "str"},
    "independent_practice": "str",
    "teacher_notes": "str",
}

INTERVENTION_SCHEMA: dict[str, Any] = {
    "title": "str",
    "target_standards": [{"code": "str", "text": "str"}],
    "prerequisite_skill": "str",
    "why_students_struggle": "str",
    "diagnostic": {
        "directions": "str",
        "items": [{"prompt": "str", "answer": "str", "misconception_if_wrong": "str"}],
    },
    "mini_lesson": {
        "minutes": "int",
        "teacher_script": ["str"],
        "model_problem": "str",
        "visual_or_manipulative": "str",
    },
    "guided_practice": {"directions": "str", "items": [{"prompt": "str", "answer": "str", "scaffold": "str"}]},
    "independent_practice": {"directions": "str", "items": [{"prompt": "str", "answer": "str"}]},
    "progress_monitoring": {
        "probe": "str",
        "answer_key": "str",
        "mastery_criteria": "str",
        "cadence": "str",
    },
    "family_note": "str",
    "teacher_notes": "str",
}

# Fields that must be non-empty for the document to be usable in a classroom.
LESSON_REQUIRED = (
    "title",
    "learning_objective",
    "success_criteria",
    "standards",
    "lesson_flow",
    "formative_assessment.task",
    "exit_ticket.prompt",
)

INTERVENTION_REQUIRED = (
    "title",
    "target_standards",
    "diagnostic.items",
    "mini_lesson.teacher_script",
    "guided_practice.items",
    "progress_monitoring.probe",
)

# The 5E phases, used to seed the offline scaffold and to check coverage.
FIVE_E_PHASES = ("Engage", "Explore", "Explain", "Elaborate", "Evaluate")


def schema_example(schema: dict[str, Any]) -> str:
    """Render a schema as an annotated JSON skeleton for the prompt."""
    return json.dumps(_example(schema), indent=2, ensure_ascii=False)


def _example(node: Any) -> Any:
    if node == "str":
        return "<text>"
    if node == "int":
        return 0
    if isinstance(node, list) and node:
        return [_example(node[0])]
    if isinstance(node, dict):
        return {key: _example(value) for key, value in node.items()}
    return None


def get(document: dict[str, Any], dotted: str) -> Any:
    """Fetch ``a.b.c`` from a nested document, returning None when absent."""
    node: Any = document
    for part in dotted.split("."):
        if not isinstance(node, dict):
            return None
        node = node.get(part)
    return node

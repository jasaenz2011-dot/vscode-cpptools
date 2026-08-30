"""Output shapes the agents must produce.

The lesson shape implements the district's instructional standard: every output
is a complete printable package in three parts.

    Part A  Full Madeline Hunter lesson, all 8 steps, never skipped or merged
    Part B  Student-facing pages the children actually write on
    Part C  A STAAR-level exit ticket with a teacher answer key

These are deliberately not JSON Schema. A local 8B model does a better job with
a short worked example than with a formal schema, and what actually enforces
the shape is :func:`dlg.jsonio.coerce`, which runs on whatever comes back. The
dicts below are both the coercion spec and the source of the example shown in
the prompt, so the two can never drift apart.
"""

from __future__ import annotations

import json
from typing import Any

# The eight Hunter steps, in order. The keys are the schema fields; the labels
# are what a teacher and a walkthrough observer expect to see on the page.
HUNTER_STEPS: tuple[tuple[str, str], ...] = (
    ("purpose", "Purpose / Objective"),
    ("anticipatory_set", "Anticipatory Set"),
    ("input", "Input"),
    ("modeling", "Modeling"),
    ("guided_practice", "Guided Practice"),
    ("checking_for_understanding", "Checking for Understanding (CFU)"),
    ("independent_practice", "Independent Practice"),
    ("closure", "Closure"),
)

# The steps the standard requires academic vocabulary to be woven through.
VOCAB_BEARING_STEPS = ("input", "modeling", "guided_practice", "checking_for_understanding")

_STEP: dict[str, Any] = {
    "minutes": "int",
    "teacher_moves": ["str"],
    "student_actions": ["str"],
    "questions": ["str"],
    "look_fors": ["str"],
}

LESSON_SCHEMA: dict[str, Any] = {
    "title": "str",
    "grade": "str",
    "subject": "str",
    "standards": [{"code": "str", "text": "str", "emphasis": "str"}],
    "objective": {"student_friendly": "str", "mastery_evidence": "str"},
    "academic_vocabulary": [
        {"term": "str", "student_definition": "str", "cognate": "str", "gesture_or_object": "str"}
    ],
    # --- Part A: the eight Hunter steps -------------------------------
    "hunter": {step: dict(_STEP) for step, _ in HUNTER_STEPS},
    "materials": ["str"],
    "manipulatives": ["str"],
    "differentiation": {
        "below_level": ["str"],
        "on_level": ["str"],
        "above_level": ["str"],
        "special_education": ["str"],
    },
    "ell_support": {
        "language_load": "str",
        "concept_gap": "str",
        "motion_movie": {
            "scene": "str",
            "move": "str",
            "freeze_frame": "str",
            "talk_back": "str",
        },
        "thinking_stems": ["str"],
    },
    "timing_overview": [{"segment": "str", "minutes": "int"}],
    # --- Part B: what the children hold -------------------------------
    "student_pages": [
        {
            "title": "str",
            "directions": "str",
            "vocabulary_or_stems": ["str"],
            "evidence_space": "str",
            "items": [{"prompt": "str", "answer": "str"}],
            "because_line": "str",
        }
    ],
    # --- Part C: the STAAR-level ticket -------------------------------
    "exit_ticket": {
        "minutes": "int",
        "teks_posted": ["str"],
        "items": [
            {
                "prompt": "str",
                "choices": ["str"],
                "answer": "str",
                "distractor_rationale": "str",
            }
        ],
        "constructed_item": {
            "prompt": "str",
            "exemplar_model": "str",
            "exemplar_equation": "str",
            "exemplar_justification": "str",
            "scoring": {"zero": "str", "one": "str", "two": "str"},
        },
        "success_line": "str",
    },
    # --- Part D: the media brief --------------------------------------
    # This repo emits briefs; it never renders media. The three engines are
    # driven by a human pasting these, or later by a webhook.
    "part_d": {
        "concept_one_liner": "str",
        "motion_movie": {
            "scene": "str",
            "move": "str",
            "freeze_frame": "str",
            "talk_back": "str",
        },
        "misconceptions_to_show": ["str"],
        "gemini_sim_prompt": "str",
        "notebooklm_source_pack": {
            "title": "str",
            "audience": "str",
            "teks_block": "str",
            "source_doc_markdown": "str",
        },
        "veo_shot_list": [
            {"shot_id": "str", "seconds": "int", "purpose": "str", "prompt": "str"}
        ],
        "classroom_use": {
            "when_in_hunter": "str",
            "minutes": "int",
            "grouping": "str",
            "teacher_move_after": "str",
        },
    },
    "teacher_notes": "str",
}

# --- Part D thresholds ----------------------------------------------------
VEO_MIN_SHOTS = 3
VEO_PREFERRED_SHOTS = 5
VEO_SECONDS_RANGE = (3, 8)
VEO_PURPOSES = ("hook", "model", "misconception", "freeze", "transfer")

NOTEBOOK_PACK_MIN_WORDS = 800
NOTEBOOK_PACK_MAX_WORDS = 1500

# A simulation the student can only watch is a GIF. These words are the
# evidence that something on screen can actually be moved.
GEMINI_CONTROL_MARKERS = (
    "slider", "draggable", "drag ", "drag-", "toggle", "control", "manipulate",
    "input", "adjust", "move the", "pull the", "type in",
)

# Part D exists to make a concept visible, so the brief has to name the wrong
# idea it is killing.
GEMINI_MISCONCEPTION_MARKERS = ("misconception", "wrong idea", "common error", "students think")

# CALC_NOT_MODEL: a Pythagorean brief that is a calculator, not a model.
CALC_ONLY_MARKERS = ("sqrt", "square root", "√", "c =", "c=", "formula", "calculate")
AREA_MODEL_MARKERS = ("square on", "squares on", "area", "a²", "b²", "c²",
                      "a2 + b2", "grid", "unit square", "tiles")

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

# Fields that must be non-empty for the package to be printable tonight.
LESSON_REQUIRED = (
    "title",
    "standards",
    "objective.student_friendly",
    "objective.mastery_evidence",
    "academic_vocabulary",
    "materials",
    "student_pages",
    "exit_ticket.items",
    "exit_ticket.constructed_item.prompt",
    "exit_ticket.success_line",
)

INTERVENTION_REQUIRED = (
    "title",
    "target_standards",
    "diagnostic.items",
    "mini_lesson.teacher_script",
    "guided_practice.items",
    "progress_monitoring.probe",
)

# Stems that are recall unless a deeper demand is attached in the same question.
LOW_ORDER_STEMS = (
    "who", "what", "when", "where", "why", "choose", "define", "select", "show",
    "name", "list", "identify", "circle",
)

# Evidence that a question asks for reasoning rather than retrieval.
HIGH_ORDER_MARKERS = (
    "explain", "justify", "compare", "contrast", "represent", "apply", "prove",
    "how do you know", "because", "evidence", "model", "predict", "defend",
    "what would happen", "which strategy", "convince", "support your",
    # Hypothetical and causal framing is analysis, not recall: "Why *would*
    # joining unequal pieces give the wrong amount?" is a mechanism question.
    "would", "instead of", "rather than", "how does", "how did", "what happens",
)

# A genuinely bare recall question is short: "What is a denominator?" A stem
# that opens a longer question is almost always carrying its own demand.
# Overridable per campus via Config.bare_recall_max_words.
BARE_RECALL_MAX_WORDS = 9

# "Never invent fake growth data. Design for growth. Don't promise scores."
# A lesson plan that promises a score gain is making a claim nobody can keep.
GROWTH_PROMISE_PATTERNS = (
    r"\braise\s+(?:their\s+)?(?:staar\s+)?scores?\b",
    r"\bincrease\s+(?:their\s+)?scores?\b",
    r"\bscores?\s+will\s+(?:go up|rise|increase|improve)\b",
    r"\bguarantee(?:d|s)?\s+(?:growth|mastery|proficiency|results)\b",
    r"\bproven\s+to\s+(?:raise|increase|improve)\b",
    r"\b\d{1,3}\s*%\s*(?:growth|gain|increase)\b",
    r"\bwill\s+(?:master|pass)\s+staar\b",
)

# A reflection slip is not an exit ticket. These belong in a closure routine,
# not in the items that are supposed to measure the standard.
REFLECTION_SLIP_PATTERNS = (
    r"\b3\s*[-–,]\s*2\s*[-–,]\s*1\b",
    r"\bhow\s+(?:do|did)\s+you\s+feel\b",
    r"\brate\s+your\s+(?:understanding|confidence)\b",
    r"\bthumbs\s+(?:up|down)\b",
    r"\bemoji\b",
    r"\bexit\s+slip:?\s+(?:how|what)\s+(?:do|did)\s+you\s+feel\b",
    r"\bone\s+thing\s+you\s+(?:liked|enjoyed)\b",
)

# Everyday objects the standard wants reached for before commercial kits.
EVERYDAY_MANIPULATIVES = (
    "coin", "bottle cap", "bean", "paper plate", "egg carton", "string",
    "sticky note", "cereal", "paper clip", "button", "straw", "index card",
    "counter", "cube", "tile", "fraction strip", "number line",
)


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


def step_text(document: dict[str, Any], step: str) -> str:
    """All prose in one Hunter step, for vocabulary and question checks."""
    node = get(document, f"hunter.{step}") or {}
    parts: list[str] = []
    for key in ("teacher_moves", "student_actions", "questions", "look_fors"):
        value = node.get(key) or []
        parts.extend(str(item) for item in value)
    return " ".join(parts)

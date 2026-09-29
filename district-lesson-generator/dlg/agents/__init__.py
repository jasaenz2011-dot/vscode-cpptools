"""Layer 2 -- the agents.

Each agent has one job and a narrow contract, which is what keeps a small local
model on task:

``CurriculumMapper``    which unit are we in, and which standards go in this lesson
``StandardsAgent``      resolve those codes to verbatim district text
``LessonWriter``        draft the lesson from the packed context
``InterventionWriter``  draft a small-group intervention packet
``Validator``           check the draft against the district's own sources

The orchestration that wires them together lives in :mod:`dlg.pipeline`.
"""

from .base import Agent, AgentError
from .curriculum_mapper import CurriculumMapper, MappingResult
from .intervention_writer import InterventionWriter
from .lesson_writer import LessonWriter
from .standards_agent import StandardsAgent, StandardsPack
from .validator import Validator

__all__ = [
    "Agent",
    "AgentError",
    "CurriculumMapper",
    "MappingResult",
    "StandardsAgent",
    "StandardsPack",
    "LessonWriter",
    "InterventionWriter",
    "Validator",
]

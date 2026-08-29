Write one {{duration}}-minute grade {{grade}} {{subject}} lesson.

Unit: {{unit}}
Lesson {{lesson_number}} of this unit.
{{class_profile}}

# DISTRICT CONTEXT

{{context}}

# YOUR TASK

Produce the lesson as a single JSON object in the required shape.

Before you write, work through this silently:
1. Which of the standards in scope is the *primary* focus of this one lesson?
   A 60-minute lesson usually serves one student expectation well, not four.
2. What does a student have to already know to access it? That goes in
   `prior_knowledge`.
3. Where do students predictably go wrong on this specific content? Those go in
   `misconceptions`, each with the move a teacher makes in response.
4. What single piece of student work at the end would prove they met the
   objective? That is your `exit_ticket`.

Then write the JSON. Minutes must sum to {{duration}}.

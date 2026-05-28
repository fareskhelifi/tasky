# GitHub Copilot Instructions

## Project Intent
This repository implements a grammar-first chatbot for structured autofill.
User input should be parsed by the grammar library whenever possible.
The LLM is a reformulation fallback, not the primary parser.

## Behavioral Rules
- Prefer deterministic parsing over generative interpretation.
- Never fill form fields directly from LLM output unless grammar validates the reformulated query.
- Preserve user-provided values exactly.
- Never invent missing fields, values, or commands.
- Keep outputs compact and machine-readable.

## Architectural Preferences
- Keep UI logic in `frontend/` focused on rendering and API calls.
- Keep orchestration in `src/services/`.
- Keep provider-specific HTTP logic in `src/llm/`.
- Keep grammar integration behind `src/grammar/`.
- Keep Express routing thin and free of business logic.

## Reformulation Constraints
- Use exact field names declared in `src/config/fieldDefinitions.js`.
- Reformulate toward grammar-compatible verbs like `metti`, `scrivi`, `riempi`, `compila`.
- Favor short commands over natural prose.
- Respect model ordering from cheaper/faster to stronger/slower.

## Style Preferences
- Use CommonJS modules.
- Prefer small, focused classes or functions with one clear responsibility.
- Prefer dependency injection over hidden imports when wiring services together.
- Keep comments short and only when they add real clarity.
- Avoid broad refactors unless they are necessary for the task.

## Review Priorities
- Latency on the grammar-success path.
- Separation of concerns between route, service, grammar, and LLM code.
- Predictable JSON responses.
- Secret handling via environment variables, not hardcoded values.

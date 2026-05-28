# Project AI Guide

## Product Goal
Build a low-latency chatbot that converts natural-language user input into structured form actions.
The system is grammar-first:

1. Try the railroad-diagram grammar library.
2. If grammar fails, ask an LLM to reformulate the user query.
3. Run the reformulated query through grammar again.
4. Accept only grammar-validated results.

The LLM is never the final authority for structured form filling.

## Architecture Priorities
- Keep grammar parsing deterministic and isolated from HTTP and UI code.
- Keep LLM integration separate behind a client boundary.
- Keep request handling fast: use smaller or cheaper models first, then escalate.
- Preserve the original user intent and values exactly.
- Prefer machine-readable outputs between layers.

## Repo Map
- `frontend/`: HTML, CSS, and browser-side chat UI.
- `grammar/`: legacy browser-style grammar library and parser support.
- `src/grammar/`: Node-side adapter around the grammar library.
- `src/llm/`: LLM provider clients and reformulation logic.
- `src/services/`: application workflow orchestration.
- `src/routes/`: Express route handlers.
- `src/config/`: static project configuration like field definitions.

## Working Rules
- Do not bypass grammar when filling fields.
- Do not invent fields, values, or fallback behavior.
- Do not couple Express route code directly to grammar internals.
- Prefer small, composable modules over large files with mixed concerns.
- Keep browser code thin: UI should call the API, not own parsing logic.

## LLM Reformulation Rules
- Reformulate only when direct grammar parsing fails.
- Use exact field names known to the grammar and field definitions.
- Prefer short commands that match grammar verbs such as `metti`, `scrivi`, `riempi`, `compila`.
- Return reformulations in a structured, minimal format.
- Try configured models in order from lighter/faster to heavier/stronger.

## Performance Rules
- Optimize for low median latency on the common path.
- Grammar success should be the fastest path and require no LLM call.
- Avoid unnecessary retries, long prompts, and verbose completions.
- Keep prompt context narrow and task-specific.

## Coding Style
- Use CommonJS consistently unless the project is intentionally migrated.
- Keep side effects at the edges: server startup, HTTP calls, env loading.
- Prefer dependency injection for services and clients.
- Validate external inputs early and return predictable response shapes.
- Add small comments only where the code would otherwise be hard to follow.

## Review Checklist
- Does the change preserve grammar-first behavior?
- Does every accepted autofill still pass through grammar?
- Are models ordered intentionally by latency/cost?
- Are secrets kept out of committed config files?
- Is parsing logic separate from route and UI code?
- Does the API response stay deterministic and compact?

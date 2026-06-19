# Tooling Setup

## Codex
- Keep `AGENTS.md` at the repo root as the main persistent project instruction file.
- Use it for architecture rules, workflow invariants, and review priorities.
- Treat `docs/ai/project-context.md` as the shared mental model for the codebase.
- Treat `docs/ai/coding-standards.md` and `docs/ai/review-checklist.md` as the default implementation and review guardrails.

## GitHub Copilot
- Keep repository instructions in `.github/copilot-instructions.md`.
- Use that file for concise, durable guidance Copilot should apply across sessions.
- Keep it short enough that it stays focused on project invariants instead of becoming a second README.

## OpenCode
- Keep provider wiring in `opencode.json`.
- Keep dynamic model discovery in `.opencode/plugins/fetch-models.js`.
- Prefer using environment variables for endpoint and API key handling.
- Treat OpenCode as a convenience layer for model access, not the source of truth for project architecture.

## Recommended Team Habit
- Put durable project knowledge in repo files, not only in prompt history.
- When a session uncovers an important rule, add it to one of the AI docs instead of relying on memory.
- Keep prompts task-focused and let the repo documents carry the stable context.

## What To Update Over Time
- Add new grammar verbs or field naming rules when the parser evolves.
- Update model ordering when latency or quality measurements change.
- Add review checks when you discover recurring bug patterns.

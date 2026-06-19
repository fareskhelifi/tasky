# Coding Standards

## JavaScript and Node
- Use CommonJS consistently for now.
- Keep constructors lightweight and pass dependencies explicitly.
- Use async/await for I/O.
- Keep modules small and centered on one responsibility.
- Prefer pure transformation functions where practical.

## Express
- Routes should validate input, call a service, and return JSON.
- Business rules belong in services, not route handlers.
- Provider or parser details should not leak into route code.
- Keep error responses consistent and compact.

## Grammar Integration
- Treat `grammar/` as an external subsystem.
- Wrap grammar behavior in adapter code rather than modifying old files casually.
- When adding new grammar-aware features, first ask whether they belong in:
  - grammar definitions
  - grammar adapter
  - orchestration service
  - UI

## LLM Integration
- Keep prompts minimal and specific to reformulation.
- Prefer low-cost or low-latency models first.
- Always parse LLM output defensively.
- Never trust an LLM response without grammar validation.
- Record enough metadata to understand fallback behavior.

## Frontend
- Keep the browser focused on UX and API interaction.
- Avoid duplicating parsing logic in the browser.
- Match DOM field ids to backend field names whenever possible.
- Keep UI state transitions obvious and debuggable.

## Security and Secrets
- Do not hardcode API keys in committed config files.
- Load secrets from `.env` during local development.
- Add example env files when setup clarity is needed.
- Sanitize logs when they may include tokens or secrets.

## Review Checklist
- Is the grammar-first invariant still preserved?
- Is the LLM path only a fallback?
- Are models ordered intentionally?
- Is the response shape stable?
- Is the change easy to test?
- Does the change keep latency in mind?

# AI Project Context

## What We Are Building
This project is a chatbot-driven structured autofill application.
The user writes a natural-language request in chat.
The backend tries to interpret it with a grammar library based on a railroad diagram parser.
If grammar fails, an LLM reformulates the request into a grammar-compatible command.
That reformulated command is parsed again by grammar.

## Primary Workflow
1. Frontend sends the user message to `POST /api/chat`.
2. `AutofillService` calls `GrammarEngine.parse(query)`.
3. If grammar succeeds, return structured fields immediately.
4. If grammar fails, try LLM models in configured order.
5. For each model, reformulate the query and run grammar again.
6. Return success only if grammar accepts the reformulated command.

## Important Constraints
- Grammar is the final validator for structured autofill.
- LLM output is advisory, not authoritative.
- Latency matters, so keep the common path fast.
- Outputs should be deterministic and easy to inspect in logs and tests.
- The grammar library is legacy browser-style code wrapped for Node usage.

## Known Domain Rules
- Valid field names come from `src/config/fieldDefinitions.js`.
- Grammar-compatible verbs currently include forms like `metti`, `scrivi`, `riempi`, and `compila`.
- Reformulation should align to existing grammar tokens, not invent new syntax.

## Preferred Development Direction
- Add tests around service orchestration and parser behavior.
- Keep the LLM client replaceable.
- Add observability around parse success, fallback rate, model usage, and latency.
- Evolve prompt design cautiously to reduce token usage and empty or verbose completions.

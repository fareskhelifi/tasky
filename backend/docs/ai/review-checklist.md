# Code Review Checklist

Use this checklist for human review or for an AI review agent.

- Verify the direct grammar path still works without any LLM call.
- Verify fallback still sends the reformulated query back through grammar.
- Verify exact field names are preserved.
- Verify no new hidden coupling was introduced between frontend, routes, grammar, and LLM code.
- Verify model order reflects latency and cost goals.
- Verify no secrets are hardcoded into source-controlled config.
- Verify failures remain understandable through response payloads or logs.
- Verify new code stays aligned with CommonJS and current project structure.

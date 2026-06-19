const path = require("path");
const express = require("express");
const fieldDefinitions = require("./config/fieldDefinitions");
const GrammarEngine = require("./grammar/GrammarEngine");
const LlmClient = require("./llm/LlmClient");
const AutofillService = require("./services/AutofillService");
const createChatRouter = require("./routes/chatRoutes");

function createServer() {
  const app = express();
  const frontendDirectory = path.resolve(__dirname, "..", "..", "frontend");

  const grammarEngine = new GrammarEngine({ fields: fieldDefinitions });

  const llmClient = new LlmClient({
    endpoint: process.env.LLM_ENDPOINT,
    apiKey: process.env.LLM_API_KEY,
    models: (process.env.LLM_MODELS || "")
      .split(",")
      .map((model) => model.trim())
      .filter(Boolean),
    timeoutMs: Number(process.env.LLM_TIMEOUT_MS) || 12000,
  });

  const autofillService = new AutofillService({
    grammarEngine,
    llmClient,
    fields: fieldDefinitions,
  });

  app.use(express.json());
  app.use(express.static(frontendDirectory));
  app.use("/api", createChatRouter({ autofillService }));

  app.get("/", (req, res) => {
    res.sendFile(path.join(frontendDirectory, "app.html"));
  });

  app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).json({
      ok: false,
      message: "Unexpected server error.",
    });
  });

  return app;
}

module.exports = createServer;

class LlmClient {
  constructor({
    endpoint,
    apiKey,
    models = [],
    timeoutMs = 12000,
    chatCompletionsPath = "/chat/completions",
  } = {}) {
    this.endpoint = endpoint ? endpoint.replace(/\/$/, "") : "";
    this.apiKey = apiKey;
    this.models = models.length
      ? models
      : ["gemma4:e4b", "qwen3.5:2b"];
    this.timeoutMs = Number(timeoutMs) || 12000;
    this.chatCompletionsPath = chatCompletionsPath.startsWith("/")
      ? chatCompletionsPath
      : `/${chatCompletionsPath}`;
  }

  debugLog(...args) {
    if (process.env.DEBUG_LLM === "true") {
      console.log(...args);
    }
  }

  async reformulate(query, { model, fields }) {
    if (!this.endpoint || !this.apiKey) {
      return null;
    }

    console.log(`Sending query to LLM ${model}:`, query);

    let response;

    try {
      response = await fetch(`${this.endpoint}${this.chatCompletionsPath}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
          "x-litellm-api-key": this.apiKey,
        },
        signal: AbortSignal.timeout(this.timeoutMs),
        body: JSON.stringify({
          model,
          temperature: 0,
          max_tokens: 40,
          messages: [
            {
              role: "system",
              content: this.buildSystemPrompt(fields),
            },
            {
              role: "user",
              content: query,
            },
          ],
        }),
      });
    } catch (error) {
      if (error.name === "AbortError" || error.name === "TimeoutError") {
        throw new Error(
          `LLM request timed out for ${model} after ${this.timeoutMs}ms`,
        );
      }

      throw error;
    }

    const responseText = await response.text();

    if (!response.ok) {
      throw new Error(
        `LLM request failed for ${model}: ${response.status} ${responseText}`,
      );
    }

    const payload = JSON.parse(responseText);
    const content = payload.choices?.[0]?.message?.content || "";

    this.debugLog(`LLM response from ${model}:`, { content });
    this.debugLog(
      `Full LLM response payload from ${model}:`,
      JSON.stringify(payload),
    );

    return this.extractQuery(content);
  }

  buildSystemPrompt(fields) {
    const fieldList = fields
      .map((field) => `${field.name}:${field.type}`)
      .join(", ");

    return [
      "Rewrite Italian user text into one grammar command.",
      "Use only: metti, scrivi, riempi, compila.",
      `Fields: ${fieldList}.`,
      "Keep values unchanged. Do not invent fields or values.",
      "Return only JSON: {\"query\":\"metti quantita 5\"}",
    ].join("\n");
  }


  extractQuery(content) {
    const cleanedContent = content
      .trim()
      .replace(/^```(?:json)?/i, "")
      .replace(/```$/i, "")
      .trim();

    this.debugLog("Cleaned LLM content:", cleanedContent);

    if (!cleanedContent) {
      return null;
    }

    try {
      const parsed = JSON.parse(cleanedContent);
      return this.cleanQuery(parsed.query);
    } catch (error) {
      const jsonObject = cleanedContent.match(/\{[\s\S]*\}/);
      if (jsonObject) {
        try {
          const parsed = JSON.parse(jsonObject[0]);
          return this.cleanQuery(parsed.query);
        } catch (nestedError) {
          return this.cleanQuery(cleanedContent);
        }
      }

      return this.cleanQuery(cleanedContent);
    }
  }

  cleanQuery(query) {
    if (typeof query !== "string") {
      return null;
    }

    const cleanedQuery = query.trim().replace(/^["']|["']$/g, "");
    this.debugLog("Cleaned query:", cleanedQuery);
    return cleanedQuery || null;
  }
}

module.exports = LlmClient;

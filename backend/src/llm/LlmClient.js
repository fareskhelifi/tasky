class LlmClient {
  constructor({ endpoint, apiKey, models, timeoutMs }) {
    this.endpoint = endpoint ? endpoint.replace(/\/$/, "") : "";
    this.apiKey = apiKey;
    this.models = models;
    this.timeoutMs = timeoutMs;
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
      response = await fetch(`${this.endpoint}/chat/completions`, {
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
          max_tokens: 80,
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
        .map((field) => `- ${field.name}: ${field.type}`)
        .join("\n");

      var result = [
        "Rewrite the user's Italian message into the shortest command accepted by the BO grammar parser.",
        "Return a command only for form-field compilation. Do not answer the user.",
        "",
        "Accepted compile grammar:",
        "- optional verb + field + value: metti quantita 5",
        "- field + con il valore + value: quantita con il valore 5",
        "- field + e/è + value: quantita è 5",
        "- value + in/nel + field: 5 in quantita",
        "",
        "Accepted verbs include: compila, compilami, metti, mettimi, scrivi, scrivimi, riempi, riempimi.",
        "Use only exact field names from the list.",
        "Preserve the user's value exactly; do not translate, normalize, calculate, round, or invent values.",
        "For number fields, keep numeric digits as written by the user.",
        "For string fields, keep the original words after the field name.",
        "If the message has an unknown field, no field, or no value, return an empty query.",
        "",
        "Available fields:",
        fieldList,
        "",
        "Return only minified JSON in this exact shape:",
        "{\"query\":\"metti quantita 5\"}",
        "",
        "Examples:",
        "input: imposta la quantita a 5",
        "output: {\"query\":\"metti quantita 5\"}",
        "input: il codice deve essere 20",
        "output: {\"query\":\"metti codice 20\"}",
        "input: descrizione uguale prova tecnica",
        "output: {\"query\":\"descrizione è prova tecnica\"}",
        "input: apri il tab successivo",
        "output: {\"query\":\"\"}",
      ].join("\n");
      return result;
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

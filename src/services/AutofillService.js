class AutofillService {
  constructor({ grammarEngine, llmClient, fields }) {
    this.grammarEngine = grammarEngine;
    this.llmClient = llmClient;
    this.fields = fields;
  }

  async handleUserQuery(query) {
    const grammarResult = this.grammarEngine.parse(query);


    if (grammarResult.ok) {
      return {
        ...grammarResult,
        message: "Ho compilato il modulo utilizzando il parser grammaticale.",
      };
    }

    const attempts = [];

    for (const model of this.llmClient.models) {
      try {
        const reformulatedQuery = await this.llmClient.reformulate(query, {
          model,
          fields: this.fields,
        });

        console.log(`Reformulated query from model ${model}:`, reformulatedQuery);

        attempts.push({
          model,
          reformulatedQuery,
        });

        if (!reformulatedQuery) {
          continue;
        }

        const fallbackResult = this.grammarEngine.parse(reformulatedQuery);

        if (fallbackResult.ok) {
          return {
            ...fallbackResult,
            source: "llm+grammar",
            originalQuery: query,
            reformulatedQuery,
            model,
            attempts,
            message: `Ho riformulato il tuo messaggio con il modello: ${model} e il prompt: "${reformulatedQuery}" e compilato il modulo.`,
          };
        }
      } catch (error) {
        attempts.push({
          model,
          error: error.message,
        });
      }
    }

    return {
      ok: false,
      query,
      source: "none",
      fields: {},
      attempts,
      message: "Non sono riuscito a combinare quella richiesta con i campi del modulo disponibili.",
    };
  }
}

module.exports = AutofillService;

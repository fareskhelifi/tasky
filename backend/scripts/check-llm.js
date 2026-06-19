require("dotenv").config();

const endpoint = (process.env.LLM_ENDPOINT || "").replace(/\/$/, "");
const apiKey = process.env.LLM_API_KEY;
const timeoutMs = Number(process.env.LLM_TIMEOUT_MS) || 12000;
const models = (process.env.LLM_MODELS || "gemma3:1b")
  .split(",")
  .map((model) => model.trim())
  .filter(Boolean);

const authHeaders = {
  Authorization: `Bearer ${apiKey}`,
  "x-litellm-api-key": apiKey,
};

async function request(label, url, options = {}) {
  const controller = new AbortController();
  const startedAt = Date.now();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    const text = await response.text();
    const duration = Date.now() - startedAt;

    console.log(`${label}: ${response.status} in ${duration}ms`);
    console.log(text.slice(0, 500));
  } catch (error) {
    const duration = Date.now() - startedAt;
    console.log(`${label}: ${error.name} ${error.message} in ${duration}ms`);
  } finally {
    clearTimeout(timer);
  }
}

async function main() {
  if (!endpoint || !apiKey) {
    throw new Error("LLM_ENDPOINT and LLM_API_KEY are required.");
  }

  await request("GET /models", `${endpoint}/models`, {
    headers: {
      accept: "application/json",
      ...authHeaders,
    },
  });

  for (const model of models) {
    const body = JSON.stringify({
      model,
      temperature: 0,
      max_tokens: 30,
      messages: [
        {
          role: "user",
          content: "Return only this exact text: metti quantita 5",
        },
      ],
    });

    await request(`POST /chat/completions ${model}`, `${endpoint}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
      },
      body,
    });
  }
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}

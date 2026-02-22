const AIRIA_ENDPOINT =
  "https://api.airia.ai/v2/PipelineExecution/6bc72fd2-944c-4d9c-9484-c47b4ce98d6e";

export async function runAiriaPipeline(input) {
  const payload =
    typeof input === "string"
      ? { userInput: input, asyncOutput: false }
      : { asyncOutput: false, ...(input || {}) };

  const response = await fetch(AIRIA_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": AIRIA_API_KEY
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Airia request failed (${response.status}): ${text}`);
  }

  return response.json();
}

const { onRequest } = require("firebase-functions/v2/https");

const AIRIA_URL =
  "https://api.airia.ai/v2/PipelineExecution/6dc38393-c059-43b5-827f-01e58c0052c7";
const AIRIA_KEY =
  "ak-MjczNzM5Njg4MHwxNzcxNjk2MDgwNzQzfHRpLVUzUmxZV3gwYUNCQlNTQlRkR0Z5ZEhWd0xVOXdaVzRnVW1WbmFYTjBjbUYwYVc5dUxVRnBjbWxoSUVaeVpXVT18MXwzMDEyNDE0NDY5";

exports.chat = onRequest(async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { userInput } = req.body;
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const prompt = `Today is ${today}. The user is located in New York City.

${userInput}

IMPORTANT: After your response, include a fenced code block labeled "json" with an array of events you mentioned. Each event must have: "title", "date" (YYYY-MM-DD), "startTime" (HH:MM, 24h), and "endTime" (HH:MM, 24h). If the exact time is unknown, estimate a reasonable time. Example:
\`\`\`json
[{"title":"Event Name","date":"2026-02-22","startTime":"14:00","endTime":"16:00"}]
\`\`\``;

  const response = await fetch(AIRIA_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-API-KEY": AIRIA_KEY },
    body: JSON.stringify({ userInput: prompt, asyncOutput: false }),
  });

  const data = await response.json();
  res.status(200).json(data);
});

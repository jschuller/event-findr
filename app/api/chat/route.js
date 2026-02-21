const AIRIA_URL = "https://api.airia.ai/v2/PipelineExecution/6dc38393-c059-43b5-827f-01e58c0052c7";
const AIRIA_KEY = "ak-MjczNzM5Njg4MHwxNzcxNjk2MDgwNzQzfHRpLVUzUmxZV3gwYUNCQlNTQlRkR0Z5ZEhWd0xVOXdaVzRnVW1WbmFYTjBjbUYwYVc5dUxVRnBjbWxoSUVaeVpXVT18MXwzMDEyNDE0NDY5";

export async function POST(request) {
  const { userInput } = await request.json();

  const res = await fetch(AIRIA_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-API-KEY": AIRIA_KEY },
    body: JSON.stringify({ userInput, asyncOutput: false }),
  });

  const data = await res.json();
  return Response.json(data);
}

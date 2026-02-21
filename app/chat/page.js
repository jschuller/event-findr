"use client";

import { useState } from "react";

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!input.trim() || loading) return;
    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userInput: input.trim() }),
      });
      const data = await res.json();
      setResponse(data.result || JSON.stringify(data, null, 2));
    } catch (err) {
      setResponse("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", padding: "0 1rem" }}>
      <h1>Event Findr — Airia Test</h1>
      <form onSubmit={handleSubmit} style={{ display: "flex", gap: "0.5rem" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Find me tech events in NYC this weekend"
          style={{ flex: 1, padding: "0.5rem", fontSize: "1rem" }}
        />
        <button disabled={loading}>{loading ? "..." : "Send"}</button>
      </form>
      {response && (
        <pre style={{ marginTop: "1rem", background: "#f5f5f5", padding: "1rem", whiteSpace: "pre-wrap" }}>
          {response}
        </pre>
      )}
    </div>
  );
}

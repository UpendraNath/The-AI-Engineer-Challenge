"use client";
"use client";
import React, { useState, useRef } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [developerMessage, setDeveloperMessage] = useState("");
  const [userMessage, setUserMessage] = useState("");
  const [model, setModel] = useState("gpt-4.1-mini");
  const [apiKey, setApiKey] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const responseRef = useRef<HTMLDivElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setResponse("");
    setLoading(true);
    try {
  const res = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          developer_message: developerMessage,
          user_message: userMessage,
          model,
          api_key: apiKey,
        }),
      });
      if (!res.body) throw new Error("No response body");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let fullText = "";
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunk = decoder.decode(value);
          fullText += chunk;
          setResponse((prev) => prev + chunk);
          if (responseRef.current) {
            responseRef.current.scrollTop = responseRef.current.scrollHeight;
          }
        }
      }
    } catch (err: any) {
      setResponse("Error: " + err.message);
    }
    setLoading(false);
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>AI Engineer Challenge: LLM Chat</h1>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label>
            Developer Message:
            <input
              type="text"
              value={developerMessage}
              onChange={(e) => setDeveloperMessage(e.target.value)}
              required
              placeholder="e.g. You are helpful and concise."
            />
          </label>
          <label>
            User Message:
            <input
              type="text"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              required
              placeholder="e.g. What's the weather today?"
            />
          </label>
          <label>
            Model:
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="gpt-4.1-mini"
            />
          </label>
          <label>
            OpenAI API Key:
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              required
              placeholder="sk-..."
            />
          </label>
          <button type="submit" disabled={loading} className={styles.primary}>
            {loading ? "Loading..." : "Send"}
          </button>
        </form>
        <div
          ref={responseRef}
          className={styles.response}
          style={{
            maxHeight: "300px",
            overflowY: "auto",
            background: "var(--gray-alpha-100)",
            padding: "1rem",
            borderRadius: "8px",
            marginTop: "1rem",
            width: "100%",
            minHeight: "100px",
            color: "#222",
            fontFamily: "var(--font-geist-mono)",
          }}
        >
          {response}
        </div>
      </main>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MarkdownRenderer } from "@/components/markdown-renderer";

interface Source {
  n: number;
  documentId: string;
  title: string;
  score: number;
}
interface AskResult {
  answer: string;
  confidence: number;
  refused: boolean;
  provider: string;
  sources: Source[];
}

function confidenceColor(c: number) {
  if (c >= 0.7) return "text-green-600 dark:text-green-400";
  if (c >= 0.35) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}

export default function AskPage() {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AskResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function ask() {
    if (!q.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });
      if (!res.ok) throw new Error(await res.text());
      setResult(await res.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to get an answer.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)]">Ask</h1>
        <p className="text-sm text-[var(--text-muted)]">
          Answers come only from your knowledge base, with citations — and an honest “I don’t know” when they can’t.
        </p>
      </div>

      <div className="space-y-2">
        <textarea
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) ask(); }}
          placeholder="e.g. How do I set up the dev environment?"
          rows={3}
          className="w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <div className="flex items-center gap-3">
          <Button onClick={ask} disabled={loading || !q.trim()}>{loading ? "Thinking…" : "Ask"}</Button>
          <span className="text-xs text-[var(--text-muted)]">⌘/Ctrl + Enter</span>
        </div>
      </div>

      {error && (
        <div className="rounded-md border border-[var(--error-border)] bg-[var(--error-bg)] p-3 text-sm text-[var(--error-text)]">{error}</div>
      )}

      {result && (
        <div className="space-y-4 rounded-lg border border-[var(--content-border)] bg-[var(--content-bg)] p-5">
          <div className="flex items-center justify-between">
            <span className={`text-sm font-semibold ${confidenceColor(result.confidence)}`}>
              {result.refused ? "Not enough verified knowledge" : `Confidence ${Math.round(result.confidence * 100)}%`}
            </span>
            <span className="text-xs text-[var(--text-muted)]">{result.provider}</span>
          </div>
          <MarkdownRenderer content={result.answer} />
          {result.sources.length > 0 && (
            <div className="border-t border-[var(--content-border)] pt-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">Sources</p>
              <ul className="space-y-1 text-sm">
                {result.sources.map((s) => (
                  <li key={s.n}>
                    <span className="text-[var(--text-muted)]">[{s.n}]</span>{" "}
                    <a href={`/knowledge/${s.documentId}`} className="text-[var(--accent-col)] hover:underline">{s.title}</a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

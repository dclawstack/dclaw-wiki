"use client";

import { useState } from "react";
import { Bot, X, Send } from "lucide-react";
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

export function Copilot() {
  const [open, setOpen] = useState(false);
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
    <>
      <button
        type="button"
        aria-label={open ? "Close AI Copilot" : "Open AI Copilot"}
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--accent-col)] text-white shadow-lg transition-transform hover:scale-105"
      >
        {open ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 flex max-h-[70vh] w-[min(24rem,calc(100vw-3rem))] flex-col rounded-lg border border-[var(--content-border)] bg-[var(--content-bg)] shadow-xl">
          <div className="flex items-center gap-2 border-b border-[var(--content-border)] px-4 py-3">
            <Bot className="h-5 w-5 text-[var(--accent-col)]" />
            <span className="text-sm font-semibold text-[var(--text)]">AI Copilot</span>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
            {!result && !error && !loading && (
              <p className="text-sm text-[var(--text-muted)]">
                Ask anything about your wiki. Answers are cited — or an honest &ldquo;I don&rsquo;t know.&rdquo;
              </p>
            )}
            {loading && <p className="text-sm text-[var(--text-muted)]">Thinking…</p>}
            {error && (
              <div className="rounded-md border border-[var(--error-border)] bg-[var(--error-bg)] p-3 text-sm text-[var(--error-text)]">
                {error}
              </div>
            )}
            {result && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-semibold ${confidenceColor(result.confidence)}`}>
                    {result.refused
                      ? "Not enough verified knowledge"
                      : `Confidence ${Math.round(result.confidence * 100)}%`}
                  </span>
                  <span className="text-xs text-[var(--text-muted)]">{result.provider}</span>
                </div>
                <MarkdownRenderer content={result.answer} />
                {result.sources.length > 0 && (
                  <div className="border-t border-[var(--content-border)] pt-2">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                      Sources
                    </p>
                    <ul className="space-y-1 text-xs">
                      {result.sources.map((s) => (
                        <li key={s.n}>
                          <span className="text-[var(--text-muted)]">[{s.n}]</span>{" "}
                          <a
                            href={`/wiki/${s.documentId}`}
                            className="text-[var(--accent-col)] hover:underline"
                          >
                            {s.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-end gap-2 border-t border-[var(--content-border)] p-3">
            <textarea
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  ask();
                }
              }}
              placeholder="Ask a question…"
              rows={1}
              className="flex-1 resize-none rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <button
              type="button"
              onClick={ask}
              disabled={loading || !q.trim()}
              aria-label="Send"
              className="flex h-9 w-9 items-center justify-center rounded-md bg-[var(--accent-col)] text-white disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

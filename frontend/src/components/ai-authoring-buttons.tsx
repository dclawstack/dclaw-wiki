"use client";

import { useState } from "react";
import { Sparkles, Wand2 } from "lucide-react";
import { generatePage, improvePage } from "@/lib/api";
import { Button } from "@/components/ui/button";

interface AiAuthoringButtonsProps {
  /** Current editor content (used by "Improve writing"). */
  content: string;
  /** Optional getter for the latest content if `content` may be stale. */
  getContent?: () => string;
  /** Called with the AI-produced Markdown so the editor can apply it. */
  onResult: (content: string) => void;
}

export function AiAuthoringButtons({ content, getContent, onResult }: AiAuthoringButtonsProps) {
  const [busy, setBusy] = useState<"generate" | "improve" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const current = () => (getContent ? getContent() : content);

  async function handleGenerate() {
    const outline = window.prompt("Describe the page or paste an outline:");
    if (!outline?.trim()) return;
    setBusy("generate");
    setError(null);
    try {
      const result = await generatePage(outline);
      onResult(result.content);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate page.");
    } finally {
      setBusy(null);
    }
  }

  async function handleImprove() {
    const text = current();
    if (!text.trim()) {
      setError("Nothing to improve yet — write some content first.");
      return;
    }
    setBusy("improve");
    setError(null);
    try {
      const result = await improvePage(text);
      onResult(result.content);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to improve writing.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleGenerate}
        disabled={busy !== null}
        title="Generate a full page from an outline"
        style={{ color: "var(--accent-col)" }}
      >
        <Sparkles className="mr-1.5 h-3.5 w-3.5" />
        {busy === "generate" ? "Generating…" : "✨ Generate from outline"}
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleImprove}
        disabled={busy !== null}
        title="Rewrite the current content for clarity and completeness"
      >
        <Wand2 className="mr-1.5 h-3.5 w-3.5" />
        {busy === "improve" ? "Improving…" : "Improve writing"}
      </Button>
      {error && (
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          {error}
        </span>
      )}
    </div>
  );
}

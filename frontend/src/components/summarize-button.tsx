"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { summarizeRevision } from "@/lib/api";
import { Button } from "@/components/ui/button";

interface Props {
  pageId: string;
  revisionId: string;
  initialSummary: string | null;
}

/** Shows a revision's AI change-summary, generating it on demand. */
export function SummarizeButton({ pageId, revisionId, initialSummary }: Props) {
  const [summary, setSummary] = useState<string | null>(initialSummary);
  const [loading, setLoading] = useState(false);

  if (summary) {
    return <p className="text-xs italic text-[var(--text-muted)]">“{summary}”</p>;
  }

  async function handleClick() {
    setLoading(true);
    try {
      const rev = await summarizeRevision(pageId, revisionId);
      setSummary(rev.change_summary ?? "(no summary)");
    } catch {
      setSummary(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button type="button" variant="ghost" size="sm" onClick={handleClick} disabled={loading}>
      <Sparkles className="mr-1.5 h-3.5 w-3.5" />
      {loading ? "Summarizing…" : "Summarize change"}
    </Button>
  );
}

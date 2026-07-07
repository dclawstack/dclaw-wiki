"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SummarizeButton({
  documentId,
  revisionId,
  initialSummary,
}: {
  documentId: string;
  revisionId: string;
  initialSummary: string | null;
}) {
  const [summary, setSummary] = useState(initialSummary);
  const [loading, setLoading] = useState(false);

  if (summary) return <p className="text-xs italic text-[var(--text-muted)]">“{summary}”</p>;

  async function go() {
    setLoading(true);
    try {
      const r = await fetch(`/api/pages/${documentId}/revisions/${revisionId}/summarize`, { method: "POST" });
      if (r.ok) setSummary((await r.json()).changeSummary ?? "(no summary)");
    } finally { setLoading(false); }
  }

  return (
    <Button type="button" variant="ghost" size="sm" onClick={go} disabled={loading}>
      <Sparkles className="mr-1.5 h-3.5 w-3.5" />{loading ? "Summarizing…" : "Summarize change"}
    </Button>
  );
}

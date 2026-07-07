"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Gap {
  id: string;
  query: string;
  occurrences: number;
  lastSeen: string;
}

export default function GapsPage() {
  const [gaps, setGaps] = useState<Gap[]>([]);
  useEffect(() => {
    fetch("/api/gaps")
      .then((r) => (r.ok ? r.json() : []))
      .then(setGaps)
      .catch(() => {});
  }, []);

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)]">Knowledge gaps</h1>
        <p className="text-sm text-[var(--text-muted)]">
          Questions the knowledge base couldn’t answer — your roadmap for what to document next.
        </p>
      </div>
      <div className="space-y-2">
        {gaps.map((g) => (
          <div key={g.id} className="flex items-center justify-between rounded-lg border border-[var(--content-border)] bg-[var(--content-bg)] px-4 py-3">
            <span className="text-[var(--text)]">{g.query}</span>
            <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
              <span>asked {g.occurrences}×</span>
              <Link href={`/knowledge`} className="text-[var(--accent-col)] hover:underline">Fill →</Link>
            </div>
          </div>
        ))}
        {gaps.length === 0 && <p className="text-sm italic text-[var(--text-muted)]">No gaps yet. Ask questions — anything unanswered shows up here.</p>}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Doc {
  id: string;
  title: string;
  source: string;
  freshnessState: string;
  verifiedAt: string | null;
  updatedAt: string;
}

const FRESH: Record<string, string> = {
  verified: "bg-green-500/15 text-green-600 dark:text-green-400",
  stale: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  unverified: "bg-[var(--surface)] text-[var(--text-muted)]",
};

export default function KnowledgePage() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    const res = await fetch("/api/documents");
    if (res.ok) setDocs(await res.json());
  }
  useEffect(() => { load(); }, []);

  async function add() {
    if (!title.trim() || !content.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
      if (res.ok) { setTitle(""); setContent(""); await load(); }
    } finally { setSaving(false); }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)]">Knowledge</h1>
        <p className="text-sm text-[var(--text-muted)]">Add knowledge (Markdown). It’s chunked and made answerable immediately.</p>
      </div>

      <div className="space-y-2 rounded-lg border border-[var(--content-border)] bg-[var(--content-bg)] p-4">
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Page title" />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Paste Markdown content…"
          rows={8}
          className="w-full resize-y rounded-md border border-input bg-background px-3 py-2 font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <Button onClick={add} disabled={saving || !title.trim() || !content.trim()}>{saving ? "Adding…" : "Add knowledge"}</Button>
      </div>

      <div className="space-y-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--text-muted)]">{docs.length} pages</h2>
        {docs.map((d) => (
          <Link key={d.id} href={`/knowledge/${d.id}`} className="block">
            <div className="flex items-center justify-between rounded-lg border border-[var(--content-border)] bg-[var(--content-bg)] px-4 py-3 hover:border-[var(--accent-col)]">
              <span className="font-medium text-[var(--text)]">{d.title}</span>
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${FRESH[d.freshnessState] ?? FRESH.unverified}`}>
                {d.freshnessState}
              </span>
            </div>
          </Link>
        ))}
        {docs.length === 0 && <p className="text-sm italic text-[var(--text-muted)]">No knowledge yet — add your first page above.</p>}
      </div>
    </div>
  );
}

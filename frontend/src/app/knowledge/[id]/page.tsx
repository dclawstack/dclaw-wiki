"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MarkdownRenderer } from "@/components/markdown-renderer";

interface Doc {
  id: string;
  title: string;
  content: string;
  freshnessState: string;
  verifiedAt: string | null;
  verifiedBy: string | null;
  updatedAt: string;
}

const FRESH: Record<string, string> = {
  verified: "bg-green-500/15 text-green-600 dark:text-green-400",
  stale: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  unverified: "bg-[var(--surface)] text-[var(--text-muted)]",
};

export default function DocPage() {
  const { id } = useParams<{ id: string }>();
  const [doc, setDoc] = useState<Doc | null>(null);
  const [busy, setBusy] = useState(false);

  async function load() {
    const res = await fetch(`/api/documents/${id}`);
    if (res.ok) setDoc(await res.json());
  }
  useEffect(() => { load(); }, [id]);

  async function act(action: "verify" | "flag_stale") {
    setBusy(true);
    try {
      await fetch(`/api/documents/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      await load();
    } finally { setBusy(false); }
  }

  if (!doc) return <p className="text-sm text-[var(--text-muted)]">Loading…</p>;

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-2xl font-bold text-[var(--text)]">{doc.title}</h1>
        <div className="flex flex-shrink-0 items-center gap-2">
          <Button size="sm" onClick={() => act("verify")} disabled={busy}>Verify</Button>
          <Button size="sm" variant="outline" onClick={() => act("flag_stale")} disabled={busy}>Flag stale</Button>
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs">
        <span className={`rounded-full px-2 py-0.5 font-medium capitalize ${FRESH[doc.freshnessState] ?? FRESH.unverified}`}>{doc.freshnessState}</span>
        {doc.verifiedAt && <span className="text-[var(--text-muted)]">verified {new Date(doc.verifiedAt).toLocaleDateString()}</span>}
      </div>
      <div className="rounded-lg border border-[var(--content-border)] bg-[var(--content-bg)] p-6">
        <MarkdownRenderer content={doc.content} />
      </div>
    </div>
  );
}

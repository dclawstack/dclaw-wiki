"use client";

import { useEffect, useState } from "react";
import { Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Comment {
  id: string;
  body: string;
  author: string | null;
  resolved: boolean;
  createdAt: string;
}

export function CommentsSection({ documentId }: { documentId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    const r = await fetch(`/api/pages/${documentId}/comments`);
    if (r.ok) setComments(await r.json());
  }
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [documentId]);

  async function add() {
    if (!body.trim()) return;
    setBusy(true);
    try {
      const r = await fetch(`/api/pages/${documentId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body }),
      });
      if (r.ok) { setBody(""); await load(); }
    } finally { setBusy(false); }
  }
  async function toggle(c: Comment) {
    await fetch(`/api/comments/${c.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ resolved: !c.resolved }) });
    load();
  }
  async function remove(id: string) {
    await fetch(`/api/comments/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--text-muted)]">Comments ({comments.length})</h3>
      <div className="flex gap-2">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Add a comment…"
          rows={2}
          className="flex-1 resize-y rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <Button onClick={add} disabled={busy || !body.trim()}>Post</Button>
      </div>
      <div className="space-y-2">
        {comments.map((c) => (
          <div key={c.id} className={`flex items-start justify-between rounded-md border border-[var(--content-border)] bg-[var(--content-bg)] px-3 py-2 ${c.resolved ? "opacity-60" : ""}`}>
            <div className="text-sm">
              <p className={c.resolved ? "text-[var(--text-muted)] line-through" : "text-[var(--text)]"}>{c.body}</p>
              <p className="mt-0.5 text-xs text-[var(--text-muted)]">{c.author ?? "anon"} · {new Date(c.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="flex flex-shrink-0 gap-1">
              <button onClick={() => toggle(c)} title="Resolve" className="p-1 text-[var(--text-muted)] hover:text-[var(--accent-col)]"><Check className="h-4 w-4" /></button>
              <button onClick={() => remove(c.id)} title="Delete" className="p-1 text-[var(--text-muted)] hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

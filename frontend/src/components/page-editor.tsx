"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Code, Table as TableIcon, Image as ImageIcon, Video, GitBranch, Sparkles, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MarkdownRenderer } from "@/components/markdown-renderer";

interface Props {
  page?: { id: string; title: string; content: string };
  parentId?: string | null;
  templateKey?: string;
}

const SNIPPETS = [
  { label: "Code", icon: Code, text: "\n```js\n// code\n```\n" },
  { label: "Table", icon: TableIcon, text: "\n| A | B |\n| --- | --- |\n| 1 | 2 |\n" },
  { label: "Image", icon: ImageIcon, text: "\n![alt](https://example.com/img.png)\n" },
  { label: "Video", icon: Video, text: "\n```video\nhttps://www.youtube.com/watch?v=dQw4w9WgXcQ\n```\n" },
  { label: "Mermaid", icon: GitBranch, text: "\n```mermaid\ngraph TD;\n  A-->B;\n```\n" },
];

export function PageEditor({ page, parentId, templateKey }: Props) {
  const router = useRouter();
  const isEdit = Boolean(page);
  const [title, setTitle] = useState(page?.title ?? "");
  const [content, setContent] = useState(page?.content ?? "");
  const [saving, setSaving] = useState(false);
  const [aiBusy, setAiBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ta = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!isEdit && templateKey) {
      fetch(`/api/templates/${templateKey}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((t) => { if (t?.content) setContent(t.content); if (t?.name && !title) setTitle(t.name); })
        .catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateKey]);

  function insert(s: string) {
    const el = ta.current;
    if (!el) { setContent((c) => c + s); return; }
    const start = el.selectionStart;
    setContent(content.slice(0, start) + s + content.slice(el.selectionEnd));
    requestAnimationFrame(() => { el.focus(); el.setSelectionRange(start + s.length, start + s.length); });
  }

  async function generate() {
    const outline = prompt("What should this page cover? (outline or prompt)");
    if (!outline) return;
    setAiBusy(true);
    try {
      const r = await fetch("/api/ai/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ outline }) });
      if (r.ok) setContent((await r.json()).content);
    } finally { setAiBusy(false); }
  }
  async function improve() {
    if (!content.trim()) return;
    setAiBusy(true);
    try {
      const r = await fetch("/api/ai/improve", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content }) });
      if (r.ok) setContent((await r.json()).content);
    } finally { setAiBusy(false); }
  }

  async function save() {
    if (!title.trim()) { setError("Title is required."); return; }
    setSaving(true); setError(null);
    try {
      const res = isEdit
        ? await fetch(`/api/pages/${page!.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title, content }) })
        : await fetch("/api/pages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title, content, parentId }) });
      if (!res.ok) throw new Error(await res.text());
      const saved = await res.json();
      router.push(`/wiki/${isEdit ? page!.id : saved.id}`);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save.");
    } finally { setSaving(false); }
  }

  return (
    <div className="space-y-4">
      <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Page title" autoFocus className="text-lg font-medium" />
      <div className="flex flex-wrap gap-2">
        {SNIPPETS.map(({ label, icon: Icon, text }) => (
          <Button key={label} type="button" variant="outline" size="sm" onClick={() => insert(text)}>
            <Icon className="mr-1.5 h-3.5 w-3.5" />{label}
          </Button>
        ))}
        <span className="mx-1 w-px self-stretch bg-[var(--content-border)]" />
        <Button type="button" variant="outline" size="sm" onClick={generate} disabled={aiBusy}><Sparkles className="mr-1.5 h-3.5 w-3.5" />Generate</Button>
        <Button type="button" variant="outline" size="sm" onClick={improve} disabled={aiBusy || !content.trim()}><Wand2 className="mr-1.5 h-3.5 w-3.5" />Improve</Button>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <textarea
          ref={ta}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write Markdown…"
          rows={22}
          className="w-full resize-y rounded-md border border-input bg-background px-3 py-2 font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <div className="overflow-auto rounded-md border border-[var(--content-border)] bg-[var(--content-bg)] px-4 py-2">
          <div className="mb-1 text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">Preview</div>
          {content.trim() ? <MarkdownRenderer content={content} /> : <p className="text-sm italic text-[var(--text-muted)]">{aiBusy ? "AI is writing…" : "Nothing to preview yet."}</p>}
        </div>
      </div>
      {error && <div className="rounded-md border border-[var(--error-border)] bg-[var(--error-bg)] p-3 text-sm text-[var(--error-text)]">{error}</div>}
      <div className="flex gap-3">
        <Button onClick={save} disabled={saving}>{saving ? "Saving…" : isEdit ? "Save changes" : "Create page"}</Button>
        <Button type="button" variant="ghost" onClick={() => router.back()} disabled={saving}>Cancel</Button>
      </div>
    </div>
  );
}

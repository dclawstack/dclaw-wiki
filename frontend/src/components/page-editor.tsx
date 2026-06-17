"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Code, Table as TableIcon, Image as ImageIcon, Video, GitBranch } from "lucide-react";
import { createPage, updatePage, type PageRead, type PageCreate, type PageUpdate } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { AiAuthoringButtons } from "@/components/ai-authoring-buttons";

interface PageEditorProps {
  page?: PageRead;
  defaultParentId?: string | null;
  defaultContent?: string;
}

const SNIPPETS = [
  { label: "Code", icon: Code, text: "\n```js\n// your code\n```\n" },
  { label: "Table", icon: TableIcon, text: "\n| Column A | Column B |\n| --- | --- |\n| a | b |\n" },
  { label: "Image", icon: ImageIcon, text: "\n![alt text](https://example.com/image.png)\n" },
  { label: "Video", icon: Video, text: "\n```video\nhttps://www.youtube.com/watch?v=dQw4w9WgXcQ\n```\n" },
  { label: "Mermaid", icon: GitBranch, text: "\n```mermaid\ngraph TD;\n  A[Start] --> B[End];\n```\n" },
];

export function PageEditor({ page, defaultParentId, defaultContent }: PageEditorProps) {
  const router = useRouter();
  const isEdit = Boolean(page);

  const [title, setTitle] = useState(page?.title ?? "");
  const [content, setContent] = useState(page?.content ?? defaultContent ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function insertSnippet(snippet: string) {
    const ta = textareaRef.current;
    if (!ta) {
      setContent((c) => c + snippet);
      return;
    }
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    setContent(content.slice(0, start) + snippet + content.slice(end));
    requestAnimationFrame(() => {
      ta.focus();
      const pos = start + snippet.length;
      ta.setSelectionRange(pos, pos);
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      if (isEdit && page) {
        const updated = await updatePage(page.id, { title, content } as PageUpdate);
        router.refresh();
        router.push(`/wiki/${updated.id}`);
      } else {
        const created = await createPage({
          title,
          content,
          parent_id: defaultParentId ?? null,
        } as PageCreate);
        router.refresh();
        router.push(`/wiki/${created.id}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save page.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Page title"
          required
          autoFocus
          className="text-lg font-medium"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>

        {/* Insert toolbar */}
        <div className="flex flex-wrap gap-2">
          {SNIPPETS.map(({ label, icon: Icon, text }) => (
            <Button
              key={label}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => insertSnippet(text)}
              title={`Insert ${label}`}
            >
              <Icon className="mr-1.5 h-3.5 w-3.5" />
              {label}
            </Button>
          ))}
          <span className="mx-1 w-px self-stretch bg-[var(--content-border)]" />
          <AiAuthoringButtons content={content} getContent={() => content} onResult={(c) => setContent(c)} />
        </div>

        {/* Split pane: editor | live preview */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <textarea
            id="content"
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write Markdown here…"
            rows={24}
            className="w-full resize-y rounded-md border border-input bg-background px-3 py-2 font-mono text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          <div className="overflow-auto rounded-md border border-[var(--content-border)] bg-[var(--content-bg)] px-4 py-2">
            <div className="mb-1 text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
              Preview
            </div>
            {content.trim() ? (
              <MarkdownRenderer content={content} />
            ) : (
              <p className="text-sm italic text-[var(--text-muted)]">Nothing to preview yet.</p>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-[var(--error-bg)] border border-[var(--error-border)] p-3 text-sm text-[var(--error-text)]">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Page"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.back()}
          disabled={saving}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

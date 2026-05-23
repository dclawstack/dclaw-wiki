"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPage, updatePage, type PageRead, type PageCreate, type PageUpdate } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PageEditorProps {
  page?: PageRead;
  defaultParentId?: string | null;
}

export function PageEditor({ page, defaultParentId }: PageEditorProps) {
  const router = useRouter();
  const isEdit = Boolean(page);

  const [title, setTitle] = useState(page?.title ?? "");
  const [content, setContent] = useState(page?.content ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your content here..."
          rows={20}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y font-mono"
        />
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

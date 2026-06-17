"use client";

import { useEffect, useState } from "react";
import { Check, MessageSquare, Trash2 } from "lucide-react";
import {
  listComments,
  createComment,
  resolveComment,
  deleteComment,
  type CommentRead,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {
  pageId: string;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function CommentsSection({ pageId }: Props) {
  const [comments, setComments] = useState<CommentRead[]>([]);
  const [body, setBody] = useState("");
  const [author, setAuthor] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    try {
      const data = await listComments(pageId);
      setComments(data);
    } catch {
      // ignore — render empty state
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = body.trim();
    if (!trimmed) return;
    setSubmitting(true);
    try {
      await createComment(pageId, trimmed, author.trim() || undefined);
      setBody("");
      await load();
    } catch {
      alert("Failed to add comment.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResolve(id: string) {
    try {
      await resolveComment(id);
      await load();
    } catch {
      alert("Failed to resolve comment.");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this comment?")) return;
    try {
      await deleteComment(id);
      await load();
    } catch {
      alert("Failed to delete comment.");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-[var(--text)]">
        <MessageSquare className="h-5 w-5" />
        <h2 className="text-lg font-semibold">
          Comments {comments.length > 0 && `(${comments.length})`}
        </h2>
      </div>

      {/* Add comment form */}
      <form onSubmit={handleSubmit} className="space-y-2">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Add a comment…"
          rows={3}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
        <div className="flex items-center gap-2">
          <Input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Your name (optional)"
            className="max-w-xs"
          />
          <Button type="submit" size="sm" disabled={submitting || !body.trim()}>
            {submitting ? "Posting…" : "Comment"}
          </Button>
        </div>
      </form>

      {/* Comment list */}
      {loading ? (
        <p className="text-sm text-[var(--text-muted)]">Loading comments…</p>
      ) : comments.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)] italic">No comments yet.</p>
      ) : (
        <ul className="space-y-3">
          {comments.map((c) => (
            <li
              key={c.id}
              className="rounded-lg border border-[var(--content-border)] bg-[var(--content-bg)] p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                    <span className="font-medium text-[var(--text)]">
                      {c.author || "Anonymous"}
                    </span>
                    <span>· {formatDate(c.created_at)}</span>
                    {c.resolved && (
                      <span className="text-[var(--accent-col)]">· Resolved</span>
                    )}
                  </div>
                  <p
                    className={`text-sm whitespace-pre-wrap ${
                      c.resolved ? "text-[var(--text-muted)] line-through" : "text-[var(--text)]"
                    }`}
                  >
                    {c.body}
                  </p>
                </div>
                <div className="flex flex-shrink-0 gap-1">
                  {!c.resolved && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleResolve(c.id)}
                      title="Resolve"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(c.id)}
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { getPage, listRevisions } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RestoreButton } from "@/components/restore-button";
import { SummarizeButton } from "@/components/summarize-button";

export const dynamic = "force-dynamic";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface Props {
  params: { id: string };
}

export default async function HistoryPage({ params }: Props) {
  let page, revisions;
  try {
    [page, revisions] = await Promise.all([
      getPage(params.id),
      listRevisions(params.id),
    ]);
  } catch {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-6">
      <nav className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
        <Link href="/wiki" className="hover:text-[var(--accent-col)]">Wiki</Link>
        <span>/</span>
        <Link href={`/wiki/${page.id}`} className="hover:text-[var(--accent-col)]">{page.title}</Link>
        <span>/</span>
        <span className="text-[var(--text)] font-medium">History</span>
      </nav>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--text)]">Page History</h1>
        <Link href={`/wiki/${page.id}`}>
          <Button variant="ghost" size="sm">← Back to Page</Button>
        </Link>
      </div>

      {revisions.length === 0 ? (
        <div className="rounded-lg border border-[var(--content-border)] bg-[var(--content-bg)] p-8 text-center text-[var(--text-muted)]">
          No revisions yet. Edit the page to create the first revision.
        </div>
      ) : (
        <div className="space-y-3">
          {revisions.map((rev) => (
            <div
              key={rev.id}
              className="flex items-center justify-between rounded-lg border border-[var(--content-border)] bg-[var(--content-bg)] px-5 py-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">v{rev.revision_number}</Badge>
                  <span className="font-medium text-[var(--text)]">{rev.title}</span>
                </div>
                <div className="text-xs text-[var(--text-muted)]">
                  {rev.changed_by && <span>{rev.changed_by} · </span>}
                  {formatDate(rev.created_at)}
                </div>
                <SummarizeButton
                  pageId={page.id}
                  revisionId={rev.id}
                  initialSummary={rev.change_summary}
                />
              </div>
              <RestoreButton pageId={page.id} revisionId={rev.id} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

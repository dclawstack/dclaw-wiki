import Link from "next/link";
import { notFound } from "next/navigation";
import { getPage, listRevisions } from "@/lib/wiki";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SummarizeButton } from "@/components/summarize-button";
import { RestoreButton } from "@/components/restore-button";

export const dynamic = "force-dynamic";

export default async function HistoryPage({ params }: { params: { id: string } }) {
  const page = await getPage(params.id);
  if (!page) notFound();
  const revs = await listRevisions(page.id);

  return (
    <div className="max-w-3xl space-y-6">
      <nav className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
        <Link href="/wiki" className="hover:text-[var(--accent-col)]">Wiki</Link>
        <span>/</span>
        <Link href={`/wiki/${page.id}`} className="hover:text-[var(--accent-col)]">{page.title}</Link>
        <span>/</span>
        <span className="font-medium text-[var(--text)]">History</span>
      </nav>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--text)]">Page history</h1>
        <Link href={`/wiki/${page.id}`}><Button variant="ghost" size="sm">← Back</Button></Link>
      </div>

      {revs.length === 0 ? (
        <p className="text-sm italic text-[var(--text-muted)]">No revisions yet.</p>
      ) : (
        <div className="space-y-3">
          {revs.map((r) => (
            <div key={r.id} className="flex items-start justify-between rounded-lg border border-[var(--content-border)] bg-[var(--content-bg)] px-5 py-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">v{r.revisionNumber}</Badge>
                  <span className="font-medium text-[var(--text)]">{r.title}</span>
                </div>
                <div className="text-xs text-[var(--text-muted)]">
                  {r.changedBy && <span>{r.changedBy} · </span>}
                  {new Date(r.createdAt).toLocaleString()}
                </div>
                <SummarizeButton documentId={page.id} revisionId={r.id} initialSummary={r.changeSummary} />
              </div>
              <RestoreButton documentId={page.id} revisionId={r.id} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

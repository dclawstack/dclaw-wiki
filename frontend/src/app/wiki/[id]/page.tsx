import Link from "next/link";
import { notFound } from "next/navigation";
import { getPage, breadcrumbs } from "@/lib/wiki";
import { Button } from "@/components/ui/button";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { TableOfContents } from "@/components/table-of-contents";
import { ViewTracker } from "@/components/view-tracker";
import { VerifyButton } from "@/components/verify-button";
import { CommentsSection } from "@/components/comments-section";

export const dynamic = "force-dynamic";

const FRESH: Record<string, string> = {
  verified: "bg-green-500/15 text-green-600 dark:text-green-400",
  stale: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  unverified: "bg-[var(--surface)] text-[var(--text-muted)]",
};

export default async function PageView({ params }: { params: { id: string } }) {
  const page = await getPage(params.id);
  if (!page) notFound();
  const trail = await breadcrumbs(page.id);
  const tags = (page.tags as string[]) ?? [];

  return (
    <div className="max-w-3xl space-y-5">
      <ViewTracker documentId={page.id} />

      <nav className="flex flex-wrap items-center gap-2 text-sm text-[var(--text-muted)]">
        <Link href="/wiki" className="hover:text-[var(--accent-col)]">Wiki</Link>
        {trail.map((b) => (
          <span key={b.id} className="flex items-center gap-2">
            <span>/</span>
            {b.id === page.id ? <span className="font-medium text-[var(--text)]">{b.title}</span> : <Link href={`/wiki/${b.id}`} className="hover:text-[var(--accent-col)]">{b.title}</Link>}
          </span>
        ))}
      </nav>

      <div className="flex items-start justify-between gap-4">
        <h1 className="text-3xl font-bold text-[var(--text)]">{page.title}</h1>
        <div className="flex flex-shrink-0 items-center gap-2">
          <VerifyButton documentId={page.id} />
          <Link href={`/wiki/${page.id}/history`}><Button variant="ghost" size="sm">History</Button></Link>
          <Link href={`/wiki/${page.id}/edit`}><Button size="sm">Edit</Button></Link>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs">
        <span className={`rounded-full px-2 py-0.5 font-medium capitalize ${FRESH[page.freshnessState] ?? FRESH.unverified}`}>
          {page.freshnessState === "unverified" ? "Unverified" : page.freshnessState}
        </span>
        {page.verifiedAt && <span className="text-[var(--text-muted)]">verified {new Date(page.verifiedAt).toLocaleDateString()}</span>}
        {tags.map((t) => <span key={t} className="rounded-full bg-[var(--surface)] px-2 py-0.5 text-[var(--text-muted)]">#{t}</span>)}
      </div>

      <TableOfContents content={page.content} />

      <div className="rounded-lg border border-[var(--content-border)] bg-[var(--content-bg)] p-6">
        {page.content ? <MarkdownRenderer content={page.content} /> : <p className="italic text-[var(--text-muted)]">This page has no content yet.</p>}
      </div>

      <div className="flex gap-3 pt-1">
        <Link href={`/wiki/new?parent=${page.id}`}><Button variant="outline" size="sm">+ Add child page</Button></Link>
      </div>

      <div className="border-t border-[var(--content-border)] pt-6">
        <CommentsSection documentId={page.id} />
      </div>
    </div>
  );
}

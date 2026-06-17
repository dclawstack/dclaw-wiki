import Link from "next/link";
import { listPages } from "@/lib/wiki";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

const FRESH: Record<string, string> = {
  verified: "bg-green-500/15 text-green-600 dark:text-green-400",
  stale: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  unverified: "bg-[var(--surface)] text-[var(--text-muted)]",
};

export default async function WikiHome() {
  const pages = await listPages();
  const recent = [...pages].sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt)).slice(0, 6);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--text)]">Wiki</h1>
        <Link href="/wiki/new"><Button>+ New page</Button></Link>
      </div>

      {pages.length === 0 ? (
        <div className="rounded-lg border border-[var(--content-border)] bg-[var(--content-bg)] p-8 text-center text-[var(--text-muted)]">
          <p className="mb-4">No pages yet.</p>
          <Link href="/wiki/new"><Button variant="outline">Create your first page</Button></Link>
        </div>
      ) : (
        <section className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--text-muted)]">Recently updated</h2>
          {recent.map((p) => (
            <Link key={p.id} href={`/wiki/${p.id}`} className="block">
              <div className="flex items-center justify-between rounded-lg border border-[var(--content-border)] bg-[var(--content-bg)] px-4 py-3 hover:border-[var(--accent-col)]">
                <span className="font-medium text-[var(--text)]">{p.title}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${FRESH[p.freshnessState] ?? FRESH.unverified}`}>{p.freshnessState}</span>
              </div>
            </Link>
          ))}
        </section>
      )}
    </div>
  );
}

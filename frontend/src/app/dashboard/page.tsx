import Link from "next/link";
import { sql } from "drizzle-orm";
import { FileText, Eye, Map } from "lucide-react";
import { db } from "@/db/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

function rows<T>(res: unknown): T[] {
  if (Array.isArray(res)) return res as T[];
  return (res as { rows?: T[] }).rows ?? [];
}

async function getAnalytics() {
  // Raw SQL — drizzle count() mis-returned 0 for page_views under neon-http.
  const totalPages = rows<{ n: number }>(await db.execute(sql`SELECT count(*)::int AS n FROM documents`))[0]?.n ?? 0;
  const totalViews = rows<{ n: number }>(await db.execute(sql`SELECT count(*)::int AS n FROM page_views`))[0]?.n ?? 0;
  const popular = rows<{ documentId: string; title: string; views: number }>(
    await db.execute(sql`
      SELECT pv.document_id AS "documentId", d.title AS title, count(*)::int AS views
      FROM page_views pv JOIN documents d ON d.id = pv.document_id
      GROUP BY pv.document_id, d.title ORDER BY views DESC LIMIT 8`),
  );
  const recentlyUpdated = rows<{ id: string; title: string; updatedAt: string }>(
    await db.execute(sql`SELECT id, title, updated_at AS "updatedAt" FROM documents ORDER BY updated_at DESC LIMIT 5`),
  );
  const roadmapItems = rows<{ itemKey: string; phase: string; title: string; status: string }>(
    await db.execute(sql`
      SELECT item_key AS "itemKey", phase, title, status FROM roadmap
      ORDER BY phase, item_key`),
  );
  return { totalPages, totalViews, popular, recentlyUpdated, roadmapItems };
}

const STATUS_STYLES: Record<string, string> = {
  done: "bg-green-500/15 text-green-600",
  in_progress: "bg-amber-500/15 text-amber-600",
  planned: "bg-slate-500/15 text-slate-500",
  deferred: "bg-slate-500/10 text-slate-400 line-through",
};

function StatCard({ label, value, icon: Icon }: { label: string; value: number; icon: typeof FileText }) {
  return (
    <Card className="bg-[var(--content-bg)] border-[var(--content-border)]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-[var(--text-muted)]">{label}</CardTitle>
        <Icon className="h-4 w-4 text-[var(--accent-col)]" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-[var(--text)]">{value.toLocaleString()}</div>
      </CardContent>
    </Card>
  );
}

export default async function DashboardPage() {
  const { totalPages, totalViews, popular, recentlyUpdated, roadmapItems } = await getAnalytics();
  const roadmapActive = roadmapItems.filter((r) => r.status !== "deferred");
  const roadmapDone = roadmapActive.filter((r) => r.status === "done").length;
  const phases = Array.from(new Set(roadmapItems.map((r) => r.phase)));

  return (
    <div className="mx-auto max-w-4xl space-y-6 py-8">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)]">Dashboard</h1>
        <p className="text-sm text-[var(--text-muted)]">An overview of your wiki's activity.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard label="Total pages" value={totalPages} icon={FileText} />
        <StatCard label="Total views" value={totalViews} icon={Eye} />
      </div>

      <Card className="bg-[var(--content-bg)] border-[var(--content-border)]">
        <CardHeader className="pb-2">
          <CardTitle className="text-base text-[var(--text)]">Popular pages</CardTitle>
        </CardHeader>
        <CardContent>
          {popular.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)]">No page views yet.</p>
          ) : (
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="text-left text-[var(--text-muted)]">
                  <th className="border-b border-[var(--content-border)] py-2 font-medium">Page</th>
                  <th className="border-b border-[var(--content-border)] py-2 text-right font-medium">Views</th>
                </tr>
              </thead>
              <tbody>
                {popular.map((p) => (
                  <tr key={p.documentId}>
                    <td className="border-b border-[var(--content-border)] py-2">
                      <Link href={`/wiki/${p.documentId}`} className="text-[var(--accent-col)] hover:underline">
                        {p.title}
                      </Link>
                    </td>
                    <td className="border-b border-[var(--content-border)] py-2 text-right text-[var(--text)]">
                      {p.views.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      <Card className="bg-[var(--content-bg)] border-[var(--content-border)]">
        <CardHeader className="pb-2">
          <CardTitle className="text-base text-[var(--text)]">Recently updated</CardTitle>
        </CardHeader>
        <CardContent>
          {recentlyUpdated.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)]">No pages yet.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {recentlyUpdated.map((d) => (
                <li key={d.id} className="flex items-center justify-between">
                  <Link href={`/wiki/${d.id}`} className="text-[var(--accent-col)] hover:underline">
                    {d.title}
                  </Link>
                  <span className="text-xs text-[var(--text-muted)]">
                    {new Date(d.updatedAt).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card className="bg-[var(--content-bg)] border-[var(--content-border)]" data-testid="roadmap-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base text-[var(--text)]">Build roadmap</CardTitle>
          <span className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
            <Map className="h-4 w-4 text-[var(--accent-col)]" />
            {roadmapDone}/{roadmapActive.length} shipped
          </span>
        </CardHeader>
        <CardContent>
          {roadmapItems.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)]">No roadmap items yet.</p>
          ) : (
            <div className="space-y-4">
              {phases.map((phase) => (
                <div key={phase}>
                  <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                    {phase}
                  </h3>
                  <ul className="space-y-1 text-sm">
                    {roadmapItems
                      .filter((r) => r.phase === phase)
                      .map((r) => (
                        <li key={r.itemKey} className="flex items-center justify-between gap-2">
                          <span className="text-[var(--text)]">{r.title}</span>
                          <span
                            className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[r.status] ?? STATUS_STYLES.planned}`}
                          >
                            {r.status.replace("_", " ")}
                          </span>
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

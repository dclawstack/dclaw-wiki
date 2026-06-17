import Link from "next/link";
import { count, desc, eq } from "drizzle-orm";
import { FileText, Eye } from "lucide-react";
import { db } from "@/db/client";
import { documents, pageViews } from "@/db/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

async function getAnalytics() {
  // Sequential — the neon-http driver mis-returns results under concurrent queries.
  const [{ totalPages }] = await db.select({ totalPages: count() }).from(documents);
  const [{ totalViews }] = await db.select({ totalViews: count() }).from(pageViews);
  const popular = await db
    .select({ documentId: pageViews.documentId, title: documents.title, views: count(pageViews.id) })
    .from(pageViews)
    .innerJoin(documents, eq(documents.id, pageViews.documentId))
    .groupBy(pageViews.documentId, documents.title)
    .orderBy(desc(count(pageViews.id)))
    .limit(8);
  const recentlyUpdated = await db
    .select({ id: documents.id, title: documents.title, updatedAt: documents.updatedAt })
    .from(documents)
    .orderBy(desc(documents.updatedAt))
    .limit(5);
  return { totalPages, totalViews, popular, recentlyUpdated };
}

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
  const { totalPages, totalViews, popular, recentlyUpdated } = await getAnalytics();

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
    </div>
  );
}

import Link from "next/link";
import { Eye, FileText, TrendingUp } from "lucide-react";
import { getAnalyticsOverview, type AnalyticsOverview } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const dynamic = "force-dynamic";

export default async function Analytics() {
  let overview: AnalyticsOverview | null = null;
  let error: string | null = null;
  try {
    overview = await getAnalyticsOverview();
  } catch {
    error = "Could not connect to backend.";
  }

  const totalViews = overview?.total_views ?? 0;
  const totalPages = overview?.total_pages ?? 0;
  const recentActivity = overview?.recent_activity ?? 0;
  const popularPages = overview?.popular_pages ?? [];

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text)]">Analytics</h1>
          <p className="text-[var(--text-muted)] mt-1">Page-view insights for your wiki</p>
        </div>

        {error && (
          <div className="rounded-md bg-[var(--error-bg)] border border-[var(--error-border)] p-4 text-sm text-[var(--error-text)]">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <Card className="bg-[var(--content-bg)] border-[var(--content-border)]">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm text-[var(--text-muted)] font-normal">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-[var(--text-muted)]" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[var(--stat-color)]">{totalViews}</p>
            </CardContent>
          </Card>
          <Card className="bg-[var(--content-bg)] border-[var(--content-border)]">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm text-[var(--text-muted)] font-normal">Total Pages</CardTitle>
              <FileText className="h-4 w-4 text-[var(--text-muted)]" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[var(--stat-color)]">{totalPages}</p>
            </CardContent>
          </Card>
          <Card className="bg-[var(--content-bg)] border-[var(--content-border)]">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm text-[var(--text-muted)] font-normal">Views (7 days)</CardTitle>
              <TrendingUp className="h-4 w-4 text-[var(--text-muted)]" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[var(--stat-color)]">{recentActivity}</p>
            </CardContent>
          </Card>
        </div>

        {/* Popular pages */}
        <section>
          <h2 className="text-lg font-semibold text-[var(--text)] mb-3">Popular Pages</h2>
          {popularPages.length === 0 ? (
            <Card className="bg-[var(--content-bg)] border-[var(--content-border)]">
              <CardContent className="pt-8 pb-8 text-center text-[var(--text-muted)]">
                <p>No page views recorded yet.</p>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-[var(--content-bg)] border-[var(--content-border)]">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-[var(--text-muted)]">Page</TableHead>
                      <TableHead className="text-[var(--text-muted)] text-right">Views</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {popularPages.map((page) => (
                      <TableRow key={page.page_id} className="border-[var(--content-border)]">
                        <TableCell>
                          <Link
                            href={`/wiki/${page.page_id}`}
                            className="font-medium text-[var(--text)] hover:text-[var(--accent-col)]"
                          >
                            {page.title}
                          </Link>
                        </TableCell>
                        <TableCell className="text-right text-[var(--text)] tabular-nums">
                          {page.views}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </section>
      </div>
    </main>
  );
}

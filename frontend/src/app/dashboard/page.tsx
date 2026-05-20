import Link from "next/link";
import { listPages, type PageRead } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SearchBar } from "@/components/search-bar";

export const dynamic = "force-dynamic";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function Dashboard() {
  let pages: PageRead[] = [];
  let error = null;
  try {
    pages = await listPages();
  } catch {
    error = "Could not connect to backend.";
  }

  const recentPages = [...pages]
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 8);

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 mt-1">Overview of your wiki</p>
          </div>
          <Link href="/wiki/new">
            <Button>+ New Page</Button>
          </Link>
        </div>

        <div className="w-full max-w-md">
          <SearchBar />
        </div>

        {error && (
          <div className="rounded-md bg-red-50 border border-red-200 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-500 font-normal">Total Pages</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-indigo-600">{pages.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-500 font-normal">Root Pages</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-indigo-600">{pages.filter((p) => !p.parent_id).length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-500 font-normal">Nested Pages</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-indigo-600">{pages.filter((p) => p.parent_id).length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent pages */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-700">Recently Updated</h2>
            <Link href="/wiki" className="text-sm text-indigo-600 hover:underline">
              View all →
            </Link>
          </div>
          {recentPages.length === 0 ? (
            <Card>
              <CardContent className="pt-8 pb-8 text-center text-gray-400">
                <p className="mb-4">No pages yet. Start building your wiki.</p>
                <Link href="/wiki/new">
                  <Button variant="outline">Create First Page</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {recentPages.map((page) => (
                <Link key={page.id} href={`/wiki/${page.id}`} className="block group">
                  <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 hover:border-indigo-300 hover:shadow-sm transition">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-gray-900 group-hover:text-indigo-600">
                        {page.title}
                      </span>
                      {page.parent_id && (
                        <Badge variant="secondary" className="text-xs">Nested</Badge>
                      )}
                    </div>
                    <span className="text-xs text-gray-400">{formatDate(page.updated_at)}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

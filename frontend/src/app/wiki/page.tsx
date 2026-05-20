import Link from "next/link";
import { listPages, type PageRead } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function WikiHome() {
  let pages: PageRead[] = [];
  let error = null;
  try {
    pages = await listPages();
  } catch (e) {
    error = "Could not connect to backend.";
  }

  const rootPages = pages.filter((p) => !p.parent_id);
  const recentPages = [...pages]
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 5);

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Wiki</h1>
        <Link href="/wiki/new">
          <Button>+ New Page</Button>
        </Link>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {recentPages.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Recently Updated</h2>
          <div className="space-y-2">
            {recentPages.map((page) => (
              <Link key={page.id} href={`/wiki/${page.id}`} className="block group">
                <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 hover:border-indigo-300 hover:shadow-sm transition">
                  <span className="font-medium text-gray-900 group-hover:text-indigo-600">{page.title}</span>
                  <span className="text-xs text-gray-400">{formatDate(page.updated_at)}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-lg font-semibold text-gray-700 mb-3">
          All Pages
          {pages.length > 0 && (
            <Badge variant="secondary" className="ml-2 text-xs">
              {pages.length}
            </Badge>
          )}
        </h2>
        {rootPages.length === 0 ? (
          <Card>
            <CardContent className="pt-8 pb-8 text-center text-gray-400">
              <p className="mb-4">No pages yet. Create your first wiki page to get started.</p>
              <Link href="/wiki/new">
                <Button variant="outline">Create First Page</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {rootPages.map((page) => (
              <Link key={page.id} href={`/wiki/${page.id}`} className="block group">
                <Card className="h-full hover:border-indigo-300 hover:shadow-sm transition">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base group-hover:text-indigo-600">{page.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {page.content || "No content yet."}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">{formatDate(page.updated_at)}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

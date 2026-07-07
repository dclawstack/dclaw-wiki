import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { db } from "@/db/client";

export const dynamic = "force-dynamic";

function rows<T>(res: unknown): T[] {
  if (Array.isArray(res)) return res as T[];
  return (res as { rows?: T[] }).rows ?? [];
}

// Raw SQL throughout — drizzle's count() helper mis-returned 0 for page_views
// under neon-http; sequential raw queries are reliable.
export async function GET() {
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
  return NextResponse.json({ totalPages, totalViews, popular, recentlyUpdated });
}

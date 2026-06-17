import { NextResponse } from "next/server";
import { count, desc, eq, sql } from "drizzle-orm";
import { db } from "@/db/client";
import { documents, pageViews } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function GET() {
  // NOTE: run sequentially — the neon-http driver returns wrong results when
  // multiple queries are issued concurrently (Promise.all), so do not batch these.
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

  return NextResponse.json({ totalPages, totalViews, popular, recentlyUpdated });
}

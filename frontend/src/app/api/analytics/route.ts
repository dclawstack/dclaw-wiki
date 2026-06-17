import { NextResponse } from "next/server";
import { count, desc, eq, sql } from "drizzle-orm";
import { db } from "@/db/client";
import { documents, pageViews } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function GET() {
  const [[{ totalPages }], [{ totalViews }], popular, recentlyUpdated] = await Promise.all([
    db.select({ totalPages: count() }).from(documents),
    db.select({ totalViews: count() }).from(pageViews),
    db
      .select({
        documentId: pageViews.documentId,
        title: documents.title,
        views: count(pageViews.id),
      })
      .from(pageViews)
      .innerJoin(documents, eq(documents.id, pageViews.documentId))
      .groupBy(pageViews.documentId, documents.title)
      .orderBy(desc(count(pageViews.id)))
      .limit(8),
    db
      .select({
        id: documents.id,
        title: documents.title,
        updatedAt: documents.updatedAt,
      })
      .from(documents)
      .orderBy(desc(documents.updatedAt))
      .limit(5),
  ]);

  return NextResponse.json({
    totalPages,
    totalViews,
    popular,
    recentlyUpdated,
  });
}

import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { knowledgeGaps } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function GET() {
  const gaps = await db
    .select()
    .from(knowledgeGaps)
    .where(eq(knowledgeGaps.status, "open"))
    .orderBy(desc(knowledgeGaps.occurrences), desc(knowledgeGaps.lastSeen))
    .limit(100);
  return NextResponse.json(gaps);
}

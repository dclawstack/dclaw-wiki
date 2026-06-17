import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/db/client";
import { documents } from "@/db/schema";
import { addDocument } from "@/lib/ingest";

export const dynamic = "force-dynamic";

export async function GET() {
  const docs = await db
    .select({
      id: documents.id,
      title: documents.title,
      source: documents.source,
      tags: documents.tags,
      freshnessState: documents.freshnessState,
      verifiedAt: documents.verifiedAt,
      updatedAt: documents.updatedAt,
    })
    .from(documents)
    .orderBy(desc(documents.updatedAt))
    .limit(200);
  return NextResponse.json(docs);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body?.title || typeof body.content !== "string") {
    return NextResponse.json({ error: "title and content are required" }, { status: 400 });
  }
  const doc = await addDocument({
    title: body.title,
    content: body.content,
    source: body.source ?? "manual",
    tags: Array.isArray(body.tags) ? body.tags : [],
    createdBy: body.createdBy,
  });
  return NextResponse.json(doc, { status: 201 });
}

import { NextResponse } from "next/server";
import { eq, desc } from "drizzle-orm";
import { db } from "@/db/client";
import { comments } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const rows = await db
    .select()
    .from(comments)
    .where(eq(comments.documentId, params.id))
    .orderBy(desc(comments.createdAt));
  return NextResponse.json(rows);
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json().catch(() => ({}));
  const text = typeof body.body === "string" ? body.body.trim() : "";
  if (!text) return NextResponse.json({ error: "body is required" }, { status: 400 });

  const [created] = await db
    .insert(comments)
    .values({ documentId: params.id, body: text, author: body.author ?? null })
    .returning();
  return NextResponse.json(created, { status: 201 });
}

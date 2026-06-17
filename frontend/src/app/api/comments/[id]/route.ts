import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { comments } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json().catch(() => ({}));

  const [existing] = await db.select().from(comments).where(eq(comments.id, params.id));
  if (!existing) return NextResponse.json({ error: "not found" }, { status: 404 });

  // Explicit resolved value wins; otherwise toggle the current state.
  const resolved = typeof body.resolved === "boolean" ? body.resolved : !existing.resolved;

  const [updated] = await db
    .update(comments)
    .set({ resolved })
    .where(eq(comments.id, params.id))
    .returning();
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const [deleted] = await db
    .delete(comments)
    .where(eq(comments.id, params.id))
    .returning();
  if (!deleted) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}

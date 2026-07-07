import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { documents, verifications } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const [doc] = await db.select().from(documents).where(eq(documents.id, params.id));
  if (!doc) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(doc);
}

// Trust actions: verify a page (resets freshness) or flag it stale.
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json().catch(() => ({}));
  const action = body.action === "flag_stale" ? "flagged_stale" : "verified";
  const actor = body.actor ?? "user";

  const [doc] = await db.select().from(documents).where(eq(documents.id, params.id));
  if (!doc) return NextResponse.json({ error: "not found" }, { status: 404 });

  const [updated] = await db
    .update(documents)
    .set(
      action === "verified"
        ? { freshnessState: "verified", verifiedAt: new Date(), verifiedBy: actor, updatedAt: new Date() }
        : { freshnessState: "stale", updatedAt: new Date() },
    )
    .where(eq(documents.id, params.id))
    .returning();

  await db.insert(verifications).values({ documentId: params.id, action, actor, note: body.note });
  return NextResponse.json(updated);
}

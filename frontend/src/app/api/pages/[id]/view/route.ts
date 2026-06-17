import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { pageViews } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  await db.insert(pageViews).values({ documentId: params.id });
  return NextResponse.json({ ok: true });
}

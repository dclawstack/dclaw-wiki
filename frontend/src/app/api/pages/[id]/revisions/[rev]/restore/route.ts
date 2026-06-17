import { NextResponse } from "next/server";
import { restoreRevision } from "@/lib/wiki";

export const dynamic = "force-dynamic";

export async function POST(_req: Request, { params }: { params: { id: string; rev: string } }) {
  const page = await restoreRevision(params.id, params.rev);
  if (!page) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(page);
}

import { NextResponse } from "next/server";
import { listRevisions } from "@/lib/wiki";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  return NextResponse.json(await listRevisions(params.id));
}

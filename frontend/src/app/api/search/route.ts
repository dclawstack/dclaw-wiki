import { NextResponse } from "next/server";
import { searchPages } from "@/lib/wiki";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";
  return NextResponse.json(await searchPages(q));
}

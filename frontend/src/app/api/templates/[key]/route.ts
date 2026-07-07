import { NextResponse } from "next/server";
import { getTemplate } from "@/lib/templates";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: { key: string } }) {
  const template = getTemplate(params.key);
  if (!template) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(template);
}

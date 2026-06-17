import { NextResponse } from "next/server";
import { listPages, getTree, createPage } from "@/lib/wiki";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  if (searchParams.get("tree")) return NextResponse.json(await getTree());
  return NextResponse.json(await listPages());
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body?.title) return NextResponse.json({ error: "title required" }, { status: 400 });
  const page = await createPage({
    title: body.title,
    content: typeof body.content === "string" ? body.content : "",
    parentId: body.parentId ?? null,
    tags: Array.isArray(body.tags) ? body.tags : [],
    createdBy: body.createdBy,
  });
  return NextResponse.json(page, { status: 201 });
}

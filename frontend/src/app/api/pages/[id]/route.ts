import { NextResponse } from "next/server";
import { getPage, updatePage, deletePage } from "@/lib/wiki";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const page = await getPage(params.id);
  if (!page) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(page);
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json().catch(() => ({}));
  const updated = await updatePage(params.id, {
    title: body.title,
    content: body.content,
    tags: body.tags,
    updatedBy: body.updatedBy,
  });
  if (!updated) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const ok = await deletePage(params.id);
  return NextResponse.json({ ok }, { status: ok ? 200 : 404 });
}

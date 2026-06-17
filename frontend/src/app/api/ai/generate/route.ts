import { NextResponse } from "next/server";
import { chat, MODELS } from "@/lib/ai";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const outline: string = body?.outline?.trim();
  if (!outline) return NextResponse.json({ error: "outline required" }, { status: 400 });
  const content = await chat(
    [
      {
        role: "system",
        content:
          "You write clear, well-structured wiki pages in Markdown. Use headings, lists, and code blocks where helpful. Output only the Markdown body.",
      },
      { role: "user", content: `Write a wiki page from this outline/prompt:\n${outline}` },
    ],
    { model: MODELS.cheap, maxTokens: 1200 },
  );
  return NextResponse.json({ content });
}

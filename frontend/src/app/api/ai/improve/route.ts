import { NextResponse } from "next/server";
import { chat, MODELS } from "@/lib/ai";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const content: string = body?.content;
  if (!content?.trim()) return NextResponse.json({ error: "content required" }, { status: 400 });
  const improved = await chat(
    [
      {
        role: "system",
        content:
          "Improve the following wiki page for clarity, structure, and completeness. Keep it Markdown, keep the author's meaning, fix grammar. Output only the improved Markdown.",
      },
      { role: "user", content },
    ],
    { model: MODELS.cheap, maxTokens: 1400 },
  );
  return NextResponse.json({ content: improved });
}

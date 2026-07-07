import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { revisions } from "@/db/schema";
import { previousRevisionContent, setRevisionSummary } from "@/lib/wiki";
import { chat, MODELS } from "@/lib/ai";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(_req: Request, { params }: { params: { id: string; rev: string } }) {
  const [rev] = await db.select().from(revisions).where(eq(revisions.id, params.rev));
  if (!rev || rev.documentId !== params.id) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  const oldContent = await previousRevisionContent(params.id, rev.revisionNumber);
  const summary = await chat(
    [
      {
        role: "system",
        content:
          "Summarize the difference between two versions of a wiki page in ONE concise sentence (max 15 words). State what changed. No preamble, no quotes.",
      },
      { role: "user", content: `OLD:\n${oldContent.slice(0, 4000)}\n\nNEW:\n${rev.content.slice(0, 4000)}` },
    ],
    { model: MODELS.free, maxTokens: 80 },
  );
  const updated = await setRevisionSummary(params.rev, summary);
  return NextResponse.json(updated ?? { changeSummary: summary });
}

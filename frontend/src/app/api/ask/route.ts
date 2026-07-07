import { NextResponse } from "next/server";
import { and, eq, ilike, sql } from "drizzle-orm";
import { db } from "@/db/client";
import { questions, answerSources, knowledgeGaps } from "@/db/schema";
import { retrieve } from "@/lib/retrieval";
import { answerWithCitations, type Source } from "@/lib/ai";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const question: string = body?.question?.trim();
  if (!question) {
    return NextResponse.json({ error: "question is required" }, { status: 400 });
  }

  const hits = await retrieve(question, 5);
  const sources: Source[] = hits.map((h, i) => ({
    n: i + 1,
    documentId: h.documentId,
    title: h.title,
    score: h.score,
  }));
  const contexts = hits.map((h) => h.content);

  const result = await answerWithCitations(question, sources, contexts);

  // Log the question (basis for analytics + gap detection).
  const [q] = await db
    .insert(questions)
    .values({
      text: question,
      answered: !result.refused,
      answer: result.answer,
      confidence: result.confidence,
      provider: result.provider,
      numSources: result.usedSources.length,
      askedBy: body.askedBy,
    })
    .returning();

  if (result.usedSources.length) {
    await db.insert(answerSources).values(
      result.usedSources.map((s) => ({
        questionId: q.id,
        documentId: s.documentId,
        title: s.title,
        score: s.score,
      })),
    );
  }

  // Unanswered / refused → record (or bump) a knowledge gap.
  if (result.refused) {
    const [existing] = await db
      .select()
      .from(knowledgeGaps)
      .where(and(eq(knowledgeGaps.status, "open"), ilike(knowledgeGaps.query, question)))
      .limit(1);
    if (existing) {
      await db
        .update(knowledgeGaps)
        .set({ occurrences: existing.occurrences + 1, lastSeen: new Date() })
        .where(eq(knowledgeGaps.id, existing.id));
    } else {
      await db.insert(knowledgeGaps).values({ query: question });
    }
  }

  return NextResponse.json({
    answer: result.answer,
    confidence: result.confidence,
    refused: result.refused,
    provider: result.provider,
    sources: result.usedSources,
  });
}

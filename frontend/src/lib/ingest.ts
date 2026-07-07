import { db } from "@/db/client";
import { documents, chunks } from "@/db/schema";

/** Greedy paragraph-based chunking (~1200 chars), keeping headings attached. */
export function chunkText(content: string, target = 1200): string[] {
  const paras = content.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  const out: string[] = [];
  let buf = "";
  for (const p of paras) {
    if (buf && buf.length + p.length + 2 > target) {
      out.push(buf);
      buf = "";
    }
    buf = buf ? `${buf}\n\n${p}` : p;
  }
  if (buf) out.push(buf);
  return out.length ? out : [content.trim()].filter(Boolean);
}

export async function addDocument(input: {
  title: string;
  content: string;
  source?: string;
  tags?: string[];
  createdBy?: string;
}) {
  const [doc] = await db
    .insert(documents)
    .values({
      title: input.title,
      content: input.content,
      source: input.source ?? "manual",
      tags: input.tags ?? [],
      createdBy: input.createdBy,
      freshnessState: "unverified",
    })
    .returning();

  const pieces = chunkText(input.content);
  if (pieces.length) {
    await db.insert(chunks).values(
      pieces.map((content, idx) => ({
        documentId: doc.id,
        idx,
        content,
        // embedding stays null until an embeddings key is configured
      })),
    );
  }
  return doc;
}

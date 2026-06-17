import { db } from "@/db/client";
import { sql } from "drizzle-orm";

export interface Retrieved {
  documentId: string;
  title: string;
  content: string;
  score: number;
}

function rows<T>(res: unknown): T[] {
  if (Array.isArray(res)) return res as T[];
  const r = res as { rows?: T[] };
  return r.rows ?? [];
}

const STOP = new Set([
  "the", "a", "an", "and", "or", "of", "to", "in", "on", "for", "is", "are", "do", "does",
  "how", "what", "why", "when", "where", "which", "can", "i", "you", "it", "this", "that",
  "with", "my", "me", "we", "us", "use", "using", "about", "into", "our",
]);

/**
 * Keyword retrieval over chunks. Significant query terms are OR-ed in a tsquery
 * (so natural-language questions match even when only some terms appear) and
 * ranked by ts_rank. ILIKE fallback for recall. Vector slots in when embeddings exist.
 */
export async function retrieve(query: string, limit = 5): Promise<Retrieved[]> {
  const q = query.trim();
  if (!q) return [];

  const terms = (q.toLowerCase().match(/[a-z0-9]{3,}/g) ?? []).filter((t) => !STOP.has(t));
  if (terms.length) {
    const tsq = terms.join(" | ");
    const res = await db.execute(sql`
      SELECT c.document_id AS "documentId", d.title AS title, c.content AS content,
             ts_rank(to_tsvector('english', d.title || ' ' || c.content), to_tsquery('english', ${tsq})) AS score
      FROM chunks c
      JOIN documents d ON d.id = c.document_id
      WHERE to_tsvector('english', d.title || ' ' || c.content) @@ to_tsquery('english', ${tsq})
      ORDER BY score DESC
      LIMIT ${limit}
    `);
    const out = rows<Retrieved>(res);
    if (out.length) return out;
  }

  const like = `%${q.replace(/[%_]/g, "")}%`;
  const likeRes = await db.execute(sql`
    SELECT c.document_id AS "documentId", d.title AS title, c.content AS content, 0.1 AS score
    FROM chunks c JOIN documents d ON d.id = c.document_id
    WHERE c.content ILIKE ${like} OR d.title ILIKE ${like}
    LIMIT ${limit}
  `);
  return rows<Retrieved>(likeRes);
}

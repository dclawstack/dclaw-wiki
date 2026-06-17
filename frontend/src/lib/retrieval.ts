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

/**
 * Keyword retrieval over chunks using Postgres full-text search (title + body),
 * with an ILIKE fallback for recall. Vector retrieval slots in here once an
 * embeddings key is available (search.vector roadmap item).
 */
export async function retrieve(query: string, limit = 5): Promise<Retrieved[]> {
  const q = query.trim();
  if (!q) return [];

  const ftsRes = await db.execute(sql`
    SELECT c.document_id AS "documentId", d.title AS title, c.content AS content,
           ts_rank(to_tsvector('english', d.title || ' ' || c.content),
                   websearch_to_tsquery('english', ${q})) AS score
    FROM chunks c
    JOIN documents d ON d.id = c.document_id
    WHERE to_tsvector('english', d.title || ' ' || c.content)
          @@ websearch_to_tsquery('english', ${q})
    ORDER BY score DESC
    LIMIT ${limit}
  `);
  let out = rows<Retrieved>(ftsRes);

  if (out.length === 0) {
    // Fallback: match any significant term as a substring.
    const like = `%${q.replace(/[%_]/g, "")}%`;
    const likeRes = await db.execute(sql`
      SELECT c.document_id AS "documentId", d.title AS title, c.content AS content, 0.1 AS score
      FROM chunks c
      JOIN documents d ON d.id = c.document_id
      WHERE c.content ILIKE ${like} OR d.title ILIKE ${like}
      LIMIT ${limit}
    `);
    out = rows<Retrieved>(likeRes);
  }
  return out;
}

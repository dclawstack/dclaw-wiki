import { db } from "@/db/client";
import { documents, chunks, revisions } from "@/db/schema";
import { chunkText } from "@/lib/ingest";
import { and, asc, desc, eq, lt, sql } from "drizzle-orm";

export type PageRow = typeof documents.$inferSelect;

export interface TreeNode {
  id: string;
  title: string;
  parentId: string | null;
  position: number;
  children: TreeNode[];
}

export async function listPages() {
  return db
    .select({
      id: documents.id,
      title: documents.title,
      parentId: documents.parentId,
      path: documents.path,
      position: documents.position,
      freshnessState: documents.freshnessState,
      updatedAt: documents.updatedAt,
    })
    .from(documents)
    .orderBy(asc(documents.path), asc(documents.position));
}

export async function getTree(): Promise<TreeNode[]> {
  const rows = await listPages();
  const byId = new Map<string, TreeNode>();
  rows.forEach((r) => byId.set(r.id, { id: r.id, title: r.title, parentId: r.parentId, position: r.position, children: [] }));
  const roots: TreeNode[] = [];
  byId.forEach((node) => {
    if (node.parentId && byId.has(node.parentId)) byId.get(node.parentId)!.children.push(node);
    else roots.push(node);
  });
  return roots;
}

export async function getPage(id: string): Promise<PageRow | null> {
  const [row] = await db.select().from(documents).where(eq(documents.id, id));
  return row ?? null;
}

export async function breadcrumbs(id: string): Promise<{ id: string; title: string }[]> {
  const trail: { id: string; title: string }[] = [];
  let cur = await getPage(id);
  let guard = 0;
  while (cur && guard++ < 20) {
    trail.unshift({ id: cur.id, title: cur.title });
    cur = cur.parentId ? await getPage(cur.parentId) : null;
  }
  return trail;
}

async function reindexChunks(documentId: string, content: string) {
  await db.delete(chunks).where(eq(chunks.documentId, documentId));
  const pieces = chunkText(content);
  if (pieces.length) {
    await db.insert(chunks).values(pieces.map((c, idx) => ({ documentId, idx, content: c })));
  }
}

export async function createPage(input: {
  title: string;
  content: string;
  parentId?: string | null;
  tags?: string[];
  createdBy?: string;
}) {
  const [doc] = await db
    .insert(documents)
    .values({
      title: input.title,
      content: input.content,
      parentId: input.parentId ?? null,
      tags: input.tags ?? [],
      createdBy: input.createdBy,
      freshnessState: "unverified",
    })
    .returning();

  const base = input.parentId ? (await getPage(input.parentId))?.path ?? "/" : "/";
  await db.update(documents).set({ path: `${base}${doc.id}/` }).where(eq(documents.id, doc.id));

  await reindexChunks(doc.id, input.content);
  await db.insert(revisions).values({
    documentId: doc.id,
    revisionNumber: 1,
    title: input.title,
    content: input.content,
    changedBy: input.createdBy,
  });
  return { ...doc, path: `${base}${doc.id}/` };
}

async function nextRevisionNumber(documentId: string) {
  const [last] = await db
    .select({ n: revisions.revisionNumber })
    .from(revisions)
    .where(eq(revisions.documentId, documentId))
    .orderBy(desc(revisions.revisionNumber))
    .limit(1);
  return (last?.n ?? 0) + 1;
}

export async function updatePage(
  id: string,
  input: { title?: string; content?: string; tags?: string[]; updatedBy?: string },
) {
  const page = await getPage(id);
  if (!page) return null;

  // Snapshot current state before mutating.
  await db.insert(revisions).values({
    documentId: id,
    revisionNumber: await nextRevisionNumber(id),
    title: page.title,
    content: page.content,
    changedBy: input.updatedBy ?? page.createdBy,
  });

  const contentChanged = input.content !== undefined && input.content !== page.content;
  const [updated] = await db
    .update(documents)
    .set({
      title: input.title ?? page.title,
      content: input.content ?? page.content,
      tags: input.tags ?? (page.tags as string[]),
      ...(contentChanged ? { freshnessState: "unverified" } : {}),
      updatedAt: new Date(),
    })
    .where(eq(documents.id, id))
    .returning();

  if (contentChanged) await reindexChunks(id, input.content!);
  return updated;
}

export async function deletePage(id: string) {
  const res = await db.delete(documents).where(eq(documents.id, id)).returning({ id: documents.id });
  return res.length > 0;
}

export async function listRevisions(documentId: string) {
  return db
    .select()
    .from(revisions)
    .where(eq(revisions.documentId, documentId))
    .orderBy(desc(revisions.revisionNumber));
}

export async function previousRevisionContent(documentId: string, revisionNumber: number) {
  const [prev] = await db
    .select({ content: revisions.content })
    .from(revisions)
    .where(and(eq(revisions.documentId, documentId), lt(revisions.revisionNumber, revisionNumber)))
    .orderBy(desc(revisions.revisionNumber))
    .limit(1);
  return prev?.content ?? "";
}

export async function setRevisionSummary(revisionId: string, summary: string) {
  const [r] = await db
    .update(revisions)
    .set({ changeSummary: summary })
    .where(eq(revisions.id, revisionId))
    .returning();
  return r ?? null;
}

export async function restoreRevision(documentId: string, revisionId: string) {
  const [rev] = await db.select().from(revisions).where(eq(revisions.id, revisionId));
  if (!rev || rev.documentId !== documentId) return null;
  return updatePage(documentId, { title: rev.title, content: rev.content });
}

export async function searchPages(q: string, limit = 8) {
  const query = q.trim();
  if (!query) return [];
  const res = await db.execute(sql`
    SELECT id, title,
           left(content, 160) AS snippet,
           ts_rank(to_tsvector('english', title || ' ' || content), websearch_to_tsquery('english', ${query})) AS score
    FROM documents
    WHERE to_tsvector('english', title || ' ' || content) @@ websearch_to_tsquery('english', ${query})
    ORDER BY score DESC
    LIMIT ${limit}
  `);
  const rows = (Array.isArray(res) ? res : (res as { rows?: unknown[] }).rows ?? []) as {
    id: string;
    title: string;
    snippet: string;
  }[];
  if (rows.length) return rows;

  const like = `%${query.replace(/[%_]/g, "")}%`;
  const res2 = await db.execute(sql`
    SELECT id, title, left(content, 160) AS snippet
    FROM documents WHERE title ILIKE ${like} OR content ILIKE ${like} LIMIT ${limit}
  `);
  return (Array.isArray(res2) ? res2 : (res2 as { rows?: unknown[] }).rows ?? []) as {
    id: string;
    title: string;
    snippet: string;
  }[];
}

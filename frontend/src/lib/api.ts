// Server-side fetches bypass Next.js rewrites, so we need the direct backend URL.
// Client-side fetches use "" (empty) to go through the rewrite proxy.
const API_BASE =
  typeof window === "undefined"
    ? (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8113")
    : "";

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function fetchJson<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${path}`;
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });
  if (!response.ok) {
    const error = await response.text();
    throw new ApiError(`API error ${response.status}: ${error}`, response.status);
  }
  return response.json();
}

export async function getHealth() {
  return fetchJson<{ status: string }>("/health/");
}

// ── Wiki types ────────────────────────────────────────────────────────────────

export interface PageRead {
  id: string;
  title: string;
  content: string;
  parent_id: string | null;
  path: string;
  position: number;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface PageTree {
  id: string;
  title: string;
  parent_id: string | null;
  path: string;
  position: number;
  children: PageTree[];
}

export interface PageCreate {
  title: string;
  content?: string;
  parent_id?: string | null;
  created_by?: string;
}

export interface PageUpdate {
  title?: string;
  content?: string;
  parent_id?: string | null;
  updated_by?: string;
}

export interface RevisionRead {
  id: string;
  page_id: string;
  revision_number: number;
  title: string;
  content: string;
  change_summary: string | null;
  changed_by: string | null;
  created_at: string;
}

// ── Wiki API ──────────────────────────────────────────────────────────────────

export async function listPages(): Promise<PageRead[]> {
  return fetchJson<PageRead[]>("/api/v1/pages");
}

export async function getPageTree(): Promise<PageTree[]> {
  return fetchJson<PageTree[]>("/api/v1/pages/tree");
}

export async function getPage(id: string): Promise<PageRead> {
  return fetchJson<PageRead>(`/api/v1/pages/${id}`);
}

export async function createPage(data: PageCreate): Promise<PageRead> {
  return fetchJson<PageRead>("/api/v1/pages", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updatePage(id: string, data: PageUpdate): Promise<PageRead> {
  return fetchJson<PageRead>(`/api/v1/pages/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deletePage(id: string): Promise<void> {
  const url = `${API_BASE}/api/v1/pages/${id}`;
  const response = await fetch(url, { method: "DELETE" });
  if (!response.ok) {
    const error = await response.text();
    throw new ApiError(`API error ${response.status}: ${error}`, response.status);
  }
}

export async function searchPages(q: string, limit = 20): Promise<PageRead[]> {
  return fetchJson<PageRead[]>(`/api/v1/search?q=${encodeURIComponent(q)}&limit=${limit}`);
}

export async function listRevisions(pageId: string): Promise<RevisionRead[]> {
  return fetchJson<RevisionRead[]>(`/api/v1/pages/${pageId}/revisions`);
}

export async function restoreRevision(pageId: string, revisionId: string): Promise<PageRead> {
  return fetchJson<PageRead>(`/api/v1/pages/${pageId}/revisions/${revisionId}/restore`, {
    method: "POST",
  });
}

// ── AI Copilot ────────────────────────────────────────────────────────────────

export interface ChatResponse {
  answer: string;
  sources: { id: string; title: string }[];
  provider: string;
}

export interface RelatedPage {
  id: string;
  title: string;
}

export async function wikiChat(question: string): Promise<ChatResponse> {
  return fetchJson<ChatResponse>("/api/v1/ai/wiki-chat", {
    method: "POST",
    body: JSON.stringify({ question }),
  });
}

export async function getRelatedPages(pageId: string, limit = 5): Promise<RelatedPage[]> {
  return fetchJson<RelatedPage[]>(`/api/v1/ai/related-pages/${pageId}?limit=${limit}`);
}

export { ApiError };

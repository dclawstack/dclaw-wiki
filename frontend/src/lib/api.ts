// Server components fetch directly (relative URLs can't be resolved on the
// server), so they hit BACKEND_URL — the same in-cluster backend the Next
// rewrite proxy targets. Client-side fetches use "" (empty) to go through the
// proxy. NEXT_PUBLIC_API_URL is kept empty in production.
const API_BASE =
  typeof window === "undefined"
    ? (process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8113")
    : (process.env.NEXT_PUBLIC_API_URL || "");

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

// ── Demo seed / clear ───────────────────────────────────────────────────────
// Self-contained demo utility — see backend app/api/v1/seed.py and the
// <SeedControls /> block on the landing page. Remove all three to drop it.

export interface SeedResult {
  seeded: boolean;
  pages: number;
  revisions: number;
}

export async function seedDemoData(): Promise<SeedResult> {
  return fetchJson<SeedResult>("/api/v1/seed", { method: "POST" });
}

export async function clearDemoData(): Promise<{ cleared: boolean }> {
  return fetchJson<{ cleared: boolean }>("/api/v1/seed", { method: "DELETE" });
}

// ── AI Content Generation (P1.5) ─────────────────────────────────────────────

export interface AuthoringResponse {
  content: string;
  provider: string;
}

export async function generatePage(outline: string): Promise<AuthoringResponse> {
  return fetchJson<AuthoringResponse>("/api/v1/ai/generate-page", {
    method: "POST",
    body: JSON.stringify({ outline }),
  });
}

export async function improvePage(content: string): Promise<AuthoringResponse> {
  return fetchJson<AuthoringResponse>("/api/v1/ai/improve", {
    method: "POST",
    body: JSON.stringify({ content }),
  });
}

// ── Templates (P1.6) ──────────────────────────────────────────────────────────

export interface Template {
  key: string;
  name: string;
  description: string;
  icon: string;
  content: string;
}

export async function listTemplates(): Promise<Template[]> {
  return fetchJson<Template[]>("/api/v1/templates");
}

export async function getTemplate(key: string): Promise<Template> {
  return fetchJson<Template>(`/api/v1/templates/${key}`);
}

// ── Comments (P1.7) ───────────────────────────────────────────────────────────

export interface CommentRead {
  id: string;
  page_id: string;
  author: string | null;
  body: string;
  resolved: boolean;
  created_at: string;
}

export async function listComments(pageId: string): Promise<CommentRead[]> {
  return fetchJson<CommentRead[]>(`/api/v1/pages/${pageId}/comments`);
}

export async function createComment(pageId: string, body: string, author?: string): Promise<CommentRead> {
  return fetchJson<CommentRead>(`/api/v1/pages/${pageId}/comments`, {
    method: "POST",
    body: JSON.stringify({ body, author }),
  });
}

export async function resolveComment(id: string): Promise<CommentRead> {
  return fetchJson<CommentRead>(`/api/v1/comments/${id}/resolve`, { method: "PATCH" });
}

export async function deleteComment(id: string): Promise<void> {
  const url = `${API_BASE}/api/v1/comments/${id}`;
  const response = await fetch(url, { method: "DELETE" });
  if (!response.ok) {
    const error = await response.text();
    throw new ApiError(`API error ${response.status}: ${error}`, response.status);
  }
}

// ── Import / Export (P1.8) ────────────────────────────────────────────────────

export function exportPageUrl(pageId: string, format: "md" | "html"): string {
  return `${API_BASE}/api/v1/pages/${pageId}/export?format=${format}`;
}

export async function importMarkdown(data: {
  title: string;
  markdown: string;
  parent_id?: string | null;
}): Promise<PageRead> {
  return fetchJson<PageRead>("/api/v1/import", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ── Content Maintenance (P2.9) ────────────────────────────────────────────────

export interface StalePage {
  id: string;
  title: string;
  updated_at: string;
  days_stale: number;
}

export interface UpdateSuggestion {
  suggestion: string;
  provider: string;
}

export async function getStalePages(days = 90): Promise<StalePage[]> {
  return fetchJson<StalePage[]>(`/api/v1/maintenance/stale?days=${days}`);
}

export async function suggestUpdate(pageId: string): Promise<UpdateSuggestion> {
  return fetchJson<UpdateSuggestion>(`/api/v1/maintenance/suggest/${pageId}`, { method: "POST" });
}

// ── Analytics (P2.10) ─────────────────────────────────────────────────────────

export interface PopularPage {
  page_id: string;
  title: string;
  views: number;
}

export interface AnalyticsOverview {
  total_views: number;
  total_pages: number;
  recent_activity: number;
  popular_pages: PopularPage[];
}

export interface PageViewRead {
  id: string;
  page_id: string;
  viewed_at: string;
}

export async function getAnalyticsOverview(): Promise<AnalyticsOverview> {
  return fetchJson<AnalyticsOverview>("/api/v1/analytics/overview");
}

export async function recordPageView(pageId: string): Promise<PageViewRead> {
  return fetchJson<PageViewRead>(`/api/v1/pages/${pageId}/view`, { method: "POST" });
}

// ── Publish / Public Sites (P2.11) ────────────────────────────────────────────

export interface PublishStatus {
  published: boolean;
  page_id: string;
  slug: string | null;
  published_at: string | null;
}

export interface PublishedRead {
  id: string;
  page_id: string;
  slug: string;
  published_at: string;
}

export interface PublicPageSummary {
  slug: string;
  title: string;
}

export interface PublicPageDetail {
  slug: string;
  title: string;
  content: string;
}

export async function publishPage(pageId: string): Promise<PublishedRead> {
  return fetchJson<PublishedRead>(`/api/v1/pages/${pageId}/publish`, { method: "POST" });
}

export async function unpublishPage(pageId: string): Promise<void> {
  const url = `${API_BASE}/api/v1/pages/${pageId}/publish`;
  const response = await fetch(url, { method: "DELETE" });
  if (!response.ok) {
    const error = await response.text();
    throw new ApiError(`API error ${response.status}: ${error}`, response.status);
  }
}

export async function getPublishStatus(pageId: string): Promise<PublishStatus> {
  return fetchJson<PublishStatus>(`/api/v1/pages/${pageId}/publish`);
}

export async function getPublicPage(slug: string): Promise<PublicPageDetail> {
  return fetchJson<PublicPageDetail>(`/api/v1/public/pages/${slug}`);
}

export async function listPublicPages(): Promise<PublicPageSummary[]> {
  return fetchJson<PublicPageSummary[]>("/api/v1/public/pages");
}

// ── External Chatbot (P2.12) ──────────────────────────────────────────────────

export async function publicChat(question: string): Promise<ChatResponse> {
  return fetchJson<ChatResponse>("/api/v1/public/chat", {
    method: "POST",
    body: JSON.stringify({ question }),
  });
}

export { ApiError };

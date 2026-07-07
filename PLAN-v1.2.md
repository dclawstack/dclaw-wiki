# DClaw Wiki — v1.2 Feature Roadmap

> 📘 **REVISED PRD v2.3 available:** See `REVISED-PRD.md` for complete gap analysis, current state, and full feature roadmap.


> Based on: Y Combinator vertical SaaS principles, trending GitHub repos (wiki-js, outline), AI product research (Notion, Confluence, Slab, GitBook)

---

# v2.0 — YC-Grade Roadmap (added 2026-06-17)

## A. YC Submission Evaluation

Assessed the current product (P0–P2 of v1.2, all shipped) against a high-potential YC bar.

### Where it stands
A competent AI-assisted wiki: CRUD + hierarchy, Markdown editor with embeds, keyword search, RAG copilot (OpenRouter/Ollama), comments, templates, import/export, analytics, public sites, embeddable chatbot. Solid foundation, but **currently a feature-complete Notion/Confluence clone with an AI chat bolted on** — not yet a YC standout.

### Gap analysis vs. the YC bar
| Axis | Gap | Why it matters to YC |
|------|-----|----------------------|
| **Hair-on-fire problem** | "Build a wiki" is a vitamin, not a painkiller. The acute pain is that **wikis rot** — knowledge goes stale, nobody trusts it, people re-ask in Slack. We solve *authoring*, not *trust*. | YC funds painkillers. Need a sharp wedge. |
| **Competitive advantage / moat** | No defensibility. Anyone can wrap an LLM around Markdown. No data moat, no workflow lock-in, no network effect. | YC asks "why can't Notion ship this in a week?" |
| **Technical sophistication** | Search is `ILIKE` substring only (PRD §5 mandates **embedding/hybrid semantic search** over 10K pages <1s). No vector DB. RAG retrieves by keyword. No real-time collab. | Reviewers probe technical depth. |
| **Scalability / SaaS readiness** | **No auth, no multi-tenancy, no billing.** Single shared DB, no spaces/workspaces, no RBAC. Cannot onboard a second customer. | Can't be a business without tenancy + payments. |
| **Observability** | `print`-style logging, no structlog/metrics (PRD §4.1), no readiness gates. | Scale story is unproven. |
| **Platform compliance** | `frontend/public/dclaw-manifest.json` missing (PRD gap #1). | Required to ship on DPanel. |

### The sharpened wedge (positioning)
**"The wiki that keeps itself true."** Reposition from *authoring* to **trust & freshness**: every page carries a verification state; AI continuously detects staleness, cross-checks claims against linked sources and recent changes, and proposes patches as reviewable suggestions; answers are always cited with a confidence score. This is the painkiller (teams drowning in stale docs), the moat (a *trust graph* + verification history that compounds with usage), and the technical story (hybrid semantic retrieval + agentic maintenance).

---

## B. Prioritized Roadmap (complexity-numbered)

Numbering: **0** = low complexity / foundational quick win · **1** = medium / core differentiator · **2** = high / advanced (AI, complex workflows).

> Architecture note: all work stays on the **Sacred Stack** (PostgreSQL 16 + asyncpg + SQLAlchemy 2.0 + Pydantic v2, Next.js 14). **No SQLite** — it would violate AGENTS.md and PRD §4. Semantic search uses **pgvector** on the existing Postgres. Items marked 🔑 need external credentials/decisions before they can be fully built.

### Complexity 0 — Foundational quick wins
- **0.1 DPanel manifest** — add `frontend/public/dclaw-manifest.json` (PRD gap #1). *Verify:* file present, valid JSON, served at `/dclaw-manifest.json`.
- **0.2 Auto-TOC + heading anchors** — generate a table of contents and anchor links on page view (PRD P0.2 acceptance). *Verify:* TOC renders for a multi-heading page; anchors navigate.
- **0.3 AI change-summaries on revisions** — auto-generate a one-line summary per revision via the existing LLM service (PRD P0.4 AI component). *Verify:* new revision stores a summary; shown in history.
- **0.4 structlog + request metrics** — replace ad-hoc logging with `structlog`; add a Prometheus `/metrics` endpoint and `/health/ready` (PRD §4.1, observability gap). *Verify:* JSON logs emitted; `/metrics` scrapeable.
- **0.5 Trust metadata fields** — add `tags`, `verified_at`, `verified_by`, `freshness_state` to pages (sets up the wedge). *Verify:* migration applies; fields round-trip via API.

### Complexity 1 — Core differentiators
- **1.1 🔑 Auth + multi-tenancy** — Logto JWT validation on protected routes; `Workspace`/`Space` models; scope pages to a space. (SaaS foundation.) *Verify:* unauthenticated calls 401; pages isolated per space.
- **1.2 RBAC / Access Control** — roles (owner/editor/viewer), public vs. private spaces, expiring share links (PRD P1.1). *Verify:* viewer cannot edit; share link honors expiry.
- **1.3 Hybrid semantic search (pgvector)** — embed pages; hybrid keyword+vector ranking; replace ILIKE-only retrieval in both search and copilot RAG (PRD P0.3). *Verify:* natural-language query returns semantically-relevant pages keyword search misses; copilot cites better sources.
- **1.4 Trust layer v1** — freshness scoring, "Verify" action, stale badges, per-space freshness dashboard. (The wedge, shippable slice.) *Verify:* a page past threshold flags stale; verifying resets state.
- **1.5 🔑 Stripe billing** — per-seat/metered plans, workspace subscription state, gated limits. *Verify:* checkout creates subscription; limits enforced on free tier.

### Complexity 2 — Advanced / AI
- **2.1 Cited Q&A copilot v2** — RAG over pgvector with inline citations, confidence score, and suggested next actions (PRD copilot mandate §9). *Verify:* answers cite specific pages with confidence; falls back to Ollama.
- **2.2 Self-maintaining knowledge (agentic)** — scheduled agent cross-checks pages against linked sources + recent diffs, opens reviewable "update suggestions" (the moat). *Verify:* stale/contradicted page generates a suggestion a human can accept/reject.
- **2.3 Knowledge Graph** — relationship extraction across pages; interactive graph with explore mode (PRD P2.2). *Verify:* graph renders ≥5 relationship types; click navigates.
- **2.4 Real-time collaborative editing** — CRDT (Yjs) co-editing + presence. *Verify:* two clients edit concurrently without clobbering.
- **2.5 Content-gap analytics** — mine failed searches + unanswered Q&A to surface missing/duplicate knowledge and suggest pages (PRD P2.4). *Verify:* a repeated zero-result query appears as a suggested gap.

---

## C. Implementation Plan & Sequencing

1. **Phase 0 (now, autonomous-safe):** ship all Complexity-0 items. No external creds; pure additive code + one Alembic migration (0.5). Keep build green (tsc + pytest) after each.
2. **Phase 1a (autonomous-safe):** 1.3 Hybrid semantic search (pgvector) and 1.4 Trust layer v1 — both buildable locally on Postgres without third-party accounts.
3. **Phase 1b (needs 🔑):** 1.1 Auth (Logto tenant), 1.2 RBAC, 1.5 Stripe — require credentials/decisions; scaffold behind interfaces, wire when keys provided.
4. **Phase 2:** 2.1 → 2.2 → 2.5 (trust/AI moat first), then 2.3 graph and 2.4 real-time collab.

Each feature: model → migration (Alembic, per AGENTS.md) → repository → schema → router → tests → frontend → verify. Maintain a stable build (`pytest` green, `tsc --noEmit` clean) at every step.

---

## Pre-Flight Checklist

- [ ] `frontend/package-lock.json` committed after any `npm install` / dependency change
- [ ] `frontend/next-env.d.ts` exists and is committed
- [ ] `docker-compose.yml` healthchecks correct
- [ ] `frontend/Dockerfile` declares `ARG NEXT_PUBLIC_API_URL` before `RUN npm run build`

## v1.0 Feature Inventory (Current)

- [x] Page CRUD with hierarchy — `backend/app/api/v1/wiki.py`, `backend/app/repositories/wiki_repo.py`
- [x] Rich editor — Markdown editor with live preview + embeds (code, tables, images, video, Mermaid)
- [x] Search — full-text ILIKE search in `backend/app/services/search.py` + `SearchBar` component
- [ ] Basic permissions — deferred to P1.1 (Access Control)
- [x] Real backend CRUD (no mocks) — all endpoints backed by PostgreSQL via repository pattern
- [x] Docker + Helm deployment — scaffold intact
- [x] Alembic migrations — `backend/alembic/versions/001_initial_wiki_schema.py`
- [x] Backend tests — `backend/tests/test_wiki_api.py` (12 tests)

---

## v1.2 Roadmap

### P0 — Must Have (Ship in v1.0, demo-ready)

#### 1. AI Wiki Copilot (Knowledge Navigator) ✅
**Description:** AI assistant that answers questions, finds pages, and suggests related content. "How do I reset my password?"
- **AI Angle:** RAG over wiki content. Semantic search. Auto-suggest related pages.
- **Backend:** `/api/v1/ai/wiki-chat` endpoint. Vector index of all pages.
- **Frontend:** Chat widget with source links. "Related pages" sidebar.
- **Files:** `backend/app/services/wiki_ai.py`, `frontend/src/components/wiki-copilot.tsx`
- **Completed:** 2026-05-20. OpenRouter (cloud) + Ollama (local fallback). Floating chat widget on every page with source citations.

#### 2. Hierarchical Page Tree & Navigation ✅
**Description:** Nested page structure with breadcrumbs, table of contents, and quick navigation.
- **Backend:** Tree model with move/reorder operations.
- **Frontend:** Collapsible sidebar tree. Breadcrumb bar.
- **Files:** `frontend/src/app/wiki/tree.tsx`
- **Completed:** 2026-05-20. Self-referential `WikiPage` model with materialized path. Collapsible tree sidebar (`page-tree.tsx`). Breadcrumb on page view. Full CRUD pages at `/wiki`, `/wiki/[id]`, `/wiki/[id]/edit`, `/wiki/new`.

#### 3. Rich Editor with Embeds ✅
**Description:** Support for tables, code blocks, images, videos, Mermaid diagrams, and embedded apps.
- **Backend:** Asset storage. Embed validation.
- **Frontend:** Block-based editor with slash commands.
- **Files:** `frontend/src/components/page-editor.tsx`, `frontend/src/components/markdown-renderer.tsx`
- **Completed:** 2026-06-17. Markdown-based approach: split-pane editor (write | live preview) with an Insert toolbar for code/table/image/video/Mermaid. Rendered view supports GFM tables, syntax-highlighted code (highlight.js), images, video embeds (YouTube + direct), and Mermaid diagrams, with raw HTML escaped. Embeds are URL-based (no asset upload), so no backend change.

#### 4. Advanced Search & Discovery ✅
**Description:** Full-text search with filters, semantic search, and search suggestions.
- **Backend:** Search index with ranking. Query suggestions.
- **Frontend:** Search bar with instant results and filters.
- **Files:** `backend/app/services/search.py`
- **Completed:** 2026-05-20. ILIKE full-text search with title-rank boost (`GET /api/v1/search`). Debounced `SearchBar` component with dropdown results in sidebar.

### P1 — Should Have (v1.1–1.2)

#### 5. AI Content Generation & Improvement ✅ (2026-06-17)
**Description:** Generate page drafts from outlines. Improve existing content for clarity and completeness.
- **AI Angle:** LLM page generation. Content gap analysis.
- **Backend:** `/api/v1/ai/generate-page` endpoint.
- **Frontend:** AI toolbar with generate and improve buttons.

#### 6. Templates & Blueprints ✅ (2026-06-17)
**Description:** Pre-built page templates for meeting notes, project plans, retrospectives, SOPs.
- **Backend:** Template engine with placeholders.
- **Frontend:** Template gallery with preview.

#### 7. Comments & Suggestions ✅ (2026-06-17)
**Description:** Inline comments, page-level discussions, and suggestion mode for edits.
- **Backend:** Comment threading. Suggestion diff store.
- **Frontend:** Comment threads with resolve button.

#### 8. Import & Export ✅ (2026-06-17)
**Description:** Import from Confluence, Notion, GitBook, Markdown. Export to PDF, HTML, Markdown.
- **Backend:** Import adapters. Export generators.
- **Frontend:** Import wizard. Export dialog.

### P2 — Could Have (v1.3+)

#### 9. AI-Powered Content Maintenance ✅ (2026-06-17)
**Description:** Identify stale pages, suggest updates, and auto-archive outdated content.

#### 10. Wiki Analytics ✅ (2026-06-17)
**Description:** Page views, search analytics, popular content, and knowledge gaps.

#### 11. Public/Published Sites ✅ (2026-06-17)
**Description:** Publish wiki sections as public documentation sites with custom domains.

#### 12. Wiki Chatbot for External Users ✅ (2026-06-17)
**Description:** Embed wiki Q&A chatbot on websites for customer self-service.

---

## Implementation Priority

1. **Week 1–2:** AI Wiki Copilot (P0.1) + Page Tree (P0.2)
2. **Week 3–4:** Rich Editor (P0.3) + Advanced Search (P0.4)
3. **Week 5–6:** AI Content Generation (P1.5) + Templates (P1.6)
4. **Week 7–8:** Comments (P1.7) + Import/Export (P1.8)

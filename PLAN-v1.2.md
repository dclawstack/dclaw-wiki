# DClaw Wiki — v1.2 Feature Roadmap

> 📘 **REVISED PRD v2.3 available:** See `REVISED-PRD.md` for complete gap analysis, current state, and full feature roadmap.


> Based on: Y Combinator vertical SaaS principles, trending GitHub repos (wiki-js, outline), AI product research (Notion, Confluence, Slab, GitBook)

## Pre-Flight Checklist

- [ ] `frontend/package-lock.json` committed after any `npm install` / dependency change
- [ ] `frontend/next-env.d.ts` exists and is committed
- [ ] `docker-compose.yml` healthchecks correct
- [ ] `frontend/Dockerfile` declares `ARG NEXT_PUBLIC_API_URL` before `RUN npm run build`

## v1.0 Feature Inventory (Current)

- [ ] Page CRUD with hierarchy
- [ ] Rich text editor
- [ ] Search
- [ ] Basic permissions
- [ ] Real backend CRUD (no mocks)
- [ ] Docker + Helm deployment
- [ ] Alembic migrations
- [ ] Backend tests

---

## v1.2 Roadmap

### P0 — Must Have (Ship in v1.0, demo-ready)

#### 1. AI Wiki Copilot (Knowledge Navigator)
**Description:** AI assistant that answers questions, finds pages, and suggests related content. "How do I reset my password?"
- **AI Angle:** RAG over wiki content. Semantic search. Auto-suggest related pages.
- **Backend:** `/api/v1/ai/wiki-chat` endpoint. Vector index of all pages.
- **Frontend:** Chat widget with source links. "Related pages" sidebar.
- **Files:** `backend/app/services/wiki_ai.py`, `frontend/src/components/wiki-copilot.tsx`

#### 2. Hierarchical Page Tree & Navigation
**Description:** Nested page structure with breadcrumbs, table of contents, and quick navigation.
- **Backend:** Tree model with move/reorder operations.
- **Frontend:** Collapsible sidebar tree. Breadcrumb bar.
- **Files:** `frontend/src/app/wiki/tree.tsx`

#### 3. Rich Editor with Embeds
**Description:** Support for tables, code blocks, images, videos, Mermaid diagrams, and embedded apps.
- **Backend:** Asset storage. Embed validation.
- **Frontend:** Block-based editor with slash commands.
- **Files:** `frontend/src/components/wiki-editor.tsx`

#### 4. Advanced Search & Discovery
**Description:** Full-text search with filters, semantic search, and search suggestions.
- **Backend:** Search index with ranking. Query suggestions.
- **Frontend:** Search bar with instant results and filters.
- **Files:** `backend/app/services/search.py`

### P1 — Should Have (v1.1–1.2)

#### 5. AI Content Generation & Improvement
**Description:** Generate page drafts from outlines. Improve existing content for clarity and completeness.
- **AI Angle:** LLM page generation. Content gap analysis.
- **Backend:** `/api/v1/ai/generate-page` endpoint.
- **Frontend:** AI toolbar with generate and improve buttons.

#### 6. Templates & Blueprints
**Description:** Pre-built page templates for meeting notes, project plans, retrospectives, SOPs.
- **Backend:** Template engine with placeholders.
- **Frontend:** Template gallery with preview.

#### 7. Comments & Suggestions
**Description:** Inline comments, page-level discussions, and suggestion mode for edits.
- **Backend:** Comment threading. Suggestion diff store.
- **Frontend:** Comment threads with resolve button.

#### 8. Import & Export
**Description:** Import from Confluence, Notion, GitBook, Markdown. Export to PDF, HTML, Markdown.
- **Backend:** Import adapters. Export generators.
- **Frontend:** Import wizard. Export dialog.

### P2 — Could Have (v1.3+)

#### 9. AI-Powered Content Maintenance
**Description:** Identify stale pages, suggest updates, and auto-archive outdated content.

#### 10. Wiki Analytics
**Description:** Page views, search analytics, popular content, and knowledge gaps.

#### 11. Public/Published Sites
**Description:** Publish wiki sections as public documentation sites with custom domains.

#### 12. Wiki Chatbot for External Users
**Description:** Embed wiki Q&A chatbot on websites for customer self-service.

---

## Implementation Priority

1. **Week 1–2:** AI Wiki Copilot (P0.1) + Page Tree (P0.2)
2. **Week 3–4:** Rich Editor (P0.3) + Advanced Search (P0.4)
3. **Week 5–6:** AI Content Generation (P1.5) + Templates (P1.6)
4. **Week 7–8:** Comments (P1.7) + Import/Export (P1.8)

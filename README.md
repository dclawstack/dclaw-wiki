# DClaw Wiki

Team knowledge base SaaS — hierarchical pages, revision history, AI-powered search, and wiki copilot.

## Ports

| Service | Port |
|---------|------|
| Backend (FastAPI) | 8113 |
| Frontend (Next.js) | 3027 |
| Database (Postgres) | 5436 |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui |
| Backend | FastAPI, SQLAlchemy 2.0 (async), Pydantic v2 |
| Database | PostgreSQL 16 via asyncpg |
| Infrastructure | Docker Compose |

## Features

- **Wiki Pages CRUD** — create, read, update, delete pages with a rich editor
- **Hierarchical Page Tree** — parent-child page structure with collapsible sidebar navigation
- **Revision History** — every page edit creates a revision; view history and restore any version
- **Full-Text Search** — debounced live search with dropdown results
- **AI Wiki Copilot** — floating chat panel for asking questions about wiki content (OpenRouter / Ollama)
- **Dashboard** — overview with page stats and recently updated pages
- **Dark / Light Theme** — toggle with localStorage persistence; accent color `#06b6d4` (cyan)
- **Active Tab Highlighting** — current route highlighted in the header navigation
- **Demo Seed Data** — seed 15 pages + 30 revisions via the floating widget or API
- **Initial Revision on Create** — every new page gets a "v1" revision so history is immediately available

## Local Dev

### Prerequisites
- Docker running (for PostgreSQL)
- Python 3.12+ with venv at `backend/.venv`
- Node.js 20+ with modules at `frontend/node_modules`

### Start Database
```bash
docker compose up -d postgres
# Or standalone:
# docker run -d --name dclaw-wiki-db -e POSTGRES_USER=learn -e POSTGRES_PASSWORD=learn -e POSTGRES_DB=dclaw_wiki -p 5436:5432 postgres:16-alpine
```

### Start Backend
```bash
cd backend
source .venv/bin/activate
uvicorn app.api.main:app --host 127.0.0.1 --port 8113
```
The database schema is auto-created on startup via `Base.metadata.create_all`.

### Start Frontend
```bash
cd frontend
npm run dev
```
Opens at http://localhost:3027. API calls are proxied to the backend via Next.js rewrites in `next.config.js`.

### Seed Demo Data
```bash
curl -X POST http://localhost:8113/api/v1/demo/seed
# Or use the SeedWidget on the landing page at http://localhost:3027
```

## E2E Tests

Automated E2E tests via [TestSprite](https://testsprite.com). Requires backend on port 8113, frontend on port 3027, and DB on port 5436.

```bash
# Run full test suite via TestSprite MCP (requires API key in .mcp.json)
# Or run remainder scripts locally:
bash remainder_test_scripts/run_all.sh
```

Test results and report are in `testsprite_tests/`.

## Backend Entry Point

`backend/app/api/main.py` — routers mounted at `/api/v1/`

## API Routes

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health/` | Health check |
| POST | `/api/v1/pages` | Create a wiki page |
| GET | `/api/v1/pages` | List all wiki pages |
| GET | `/api/v1/pages/tree` | Page tree (hierarchical) |
| GET | `/api/v1/pages/{id}` | Get a single page |
| PATCH | `/api/v1/pages/{id}` | Update a page |
| DELETE | `/api/v1/pages/{id}` | Delete a page |
| GET | `/api/v1/search?q=...` | Search pages |
| GET | `/api/v1/pages/{id}/revisions` | List page revisions |
| POST | `/api/v1/pages/{id}/revisions/{rev_id}/restore` | Restore a revision |
| POST | `/api/v1/ai/wiki-chat` | AI copilot chat |
| GET | `/api/v1/ai/related-pages/{id}` | Find related pages |
| POST | `/api/v1/demo/seed` | Seed demo data (15 pages, 30 revisions) |
| DELETE | `/api/v1/demo/clear` | Clear demo data |
| GET | `/api/v1/demo/status` | Demo data status |

## Frontend Routes

| Path | Description |
|------|-------------|
| `/` | Homepage with hero, feature grid, seed widget |
| `/wiki` | Wiki landing — page list, recent updates, sidebar tree |
| `/wiki/new` | Create new page |
| `/wiki/[id]` | View page with breadcrumbs and content |
| `/wiki/[id]/edit` | Edit page |
| `/wiki/[id]/history` | Revision history with restore buttons |
| `/dashboard` | Stats cards and recently updated pages |

## Theme

The app supports dark and light modes with two accent colours:

| Variable | Light | Dark |
|----------|-------|------|
| `--bg` | `#ffffff` | `#0f172a` |
| `--surface` | `#f1f5f9` | `#1e293b` |
| `--text` | `#0f172a` | `#f1f5f9` |
| `--accent-col` | `#06b6d4` | `#22d3ee` |

Toggle via the sun/moon button in the header. Preference is saved in `localStorage`.

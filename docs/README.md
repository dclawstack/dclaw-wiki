# DClaw Wiki

> Internal Wikipedia with AI-powered search, hierarchical pages, and revision history.

**Category:** Knowledge  
**Version:** 1.2.0  
**Status:** Active Development

## Overview

DClaw Wiki is a team knowledge base with hierarchical page organization, full revision history, AI-powered copilot chat, and full-text search. It features a dark/light theme with cyan (`#06b6d4`) accent, active tab navigation, and demo seed data for quick onboarding.

**Tech Stack:** Next.js 14 + FastAPI + PostgreSQL 16

## Architecture

| Layer | Stack | Port |
|-------|-------|------|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui | 3027 |
| Backend | FastAPI, SQLAlchemy 2.0 (async), Pydantic v2 | 8113 |
| Database | PostgreSQL 16 (asyncpg) | 5436 |

## Quick Links

- [Getting Started](./getting-started/index)
- [Guides](./guides/index)
- [Reference](./reference/index)
- [Troubleshooting](./troubleshooting/index)
- [Releases](./releases/index)

## Key Features

- **Wiki CRUD** — create, edit, delete pages with parent-child hierarchy
- **Page Tree** — collapsible sidebar with hierarchical navigation
- **Revision History** — automatic versioning on every edit; one-click restore
- **Search** — debounced full-text search with live dropdown results
- **AI Copilot** — floating chat panel powered by OpenRouter / Ollama
- **Dashboard** — page stats and recently updated pages
- **Dark / Light Theme** — localStorage-persisted toggle, cyan accent colour
- **Demo Seed** — 15 sample pages + 30 revisions via widget or API

## Local Development

```bash
# 1. Start database
docker compose up -d postgres

# 2. Start backend
cd backend && source .venv/bin/activate
uvicorn app.api.main:app --host 127.0.0.1 --port 8113

# 3. Start frontend
cd frontend && npm run dev

# 4. Seed demo data (optional)
curl -X POST http://localhost:8113/api/v1/demo/seed
```

## Support

For platform-level issues, see the [DClaw Platform Documentation](https://docs.dclawstack.io).

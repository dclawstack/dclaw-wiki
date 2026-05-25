"""Demo seed/clear/status endpoints for dclaw-wiki."""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete

from app.core.database import get_db
from app.models.wiki import WikiPage
from app.models.revision import PageRevision

router = APIRouter()

# Root page IDs
R1 = "eeeeeeee-0000-0000-0000-000000000001"
R2 = "eeeeeeee-0000-0000-0000-000000000002"
R3 = "eeeeeeee-0000-0000-0000-000000000003"
R4 = "eeeeeeee-0000-0000-0000-000000000004"
R5 = "eeeeeeee-0000-0000-0000-000000000005"
# Child page IDs
C1  = "ffffffff-0000-0000-0000-000000000001"
C2  = "ffffffff-0000-0000-0000-000000000002"
C3  = "ffffffff-0000-0000-0000-000000000003"
C4  = "ffffffff-0000-0000-0000-000000000004"
C5  = "ffffffff-0000-0000-0000-000000000005"
C6  = "ffffffff-0000-0000-0000-000000000006"
C7  = "ffffffff-0000-0000-0000-000000000007"
C8  = "ffffffff-0000-0000-0000-000000000008"
C9  = "ffffffff-0000-0000-0000-000000000009"
C10 = "ffffffff-0000-0000-0000-000000000010"

ALL_PAGE_IDS = [R1,R2,R3,R4,R5,C1,C2,C3,C4,C5,C6,C7,C8,C9,C10]

DEMO_PAGES = [
    # Root pages
    dict(id=R1, title="Getting Started", content="# Getting Started\n\nWelcome to DClaw Wiki — your team's central knowledge hub.\n\nThis section covers onboarding, setup guides, and everything new team members need to hit the ground running.\n\n## Quick Links\n\n- Installation guide\n- Development environment setup\n- First week checklist", parent_id=None, path=f"/{R1}/", position=0),
    dict(id=R2, title="Engineering", content="# Engineering\n\nTechnical documentation for the DClaw platform.\n\nCovers architecture decisions, API references, coding standards, and deployment procedures.\n\n## Sections\n\n- Backend Architecture\n- Frontend Patterns\n- Database Schema\n- Deployment Guide", parent_id=None, path=f"/{R2}/", position=1),
    dict(id=R3, title="Product", content="# Product\n\nProduct roadmap, feature specs, and design principles.\n\nThis section is maintained by the product team and updated after each sprint planning session.\n\n## Current Quarter\n\nFocus: AI-powered search, mobile app launch, and onboarding improvements.", parent_id=None, path=f"/{R3}/", position=2),
    dict(id=R4, title="Team Handbook", content="# Team Handbook\n\nCulture, values, and people operations at DClaw.\n\nFrom our hiring process to performance reviews, this handbook covers how we work together.\n\n## Contents\n\n- Our Values\n- Communication Norms\n- PTO & Leave Policy\n- Career Ladders", parent_id=None, path=f"/{R4}/", position=3),
    dict(id=R5, title="Release Notes", content="# Release Notes\n\nChangelog for all DClaw platform releases.\n\nEach release includes a summary of new features, bug fixes, and breaking changes.\n\n## Latest: v1.3.0\n\nReleased 2024-05-15. Added AI search, bulk import, and dark mode support.", parent_id=None, path=f"/{R5}/", position=4),
    # Children of Getting Started (R1)
    dict(id=C1, title="Installation Guide", content="# Installation Guide\n\n## Prerequisites\n\n- Node.js 20+\n- Python 3.12+\n- Docker Desktop\n- PostgreSQL 16 (via Docker)\n\n## Steps\n\n1. Clone the repository: `git clone https://github.com/dclaw/platform`\n2. Run `docker compose up -d` to start all services\n3. Navigate to `http://localhost:3000` to verify the frontend\n4. Check `http://localhost:8000/health` for backend status", parent_id=R1, path=f"/{R1}/{C1}/", position=0),
    dict(id=C2, title="Dev Environment Setup", content="# Development Environment Setup\n\nThis guide walks through configuring your local machine for DClaw development.\n\n## VS Code Extensions\n\n- Python (ms-python)\n- ESLint\n- Tailwind CSS IntelliSense\n- Prisma\n\n## Environment Variables\n\nCopy `.env.example` to `.env` and fill in your local values. Never commit `.env` files.", parent_id=R1, path=f"/{R1}/{C2}/", position=1),
    # Children of Engineering (R2)
    dict(id=C3, title="Backend Architecture", content="# Backend Architecture\n\n## Stack\n\n- **FastAPI** — async HTTP framework\n- **SQLAlchemy 2.0** — async ORM with `DeclarativeBase`\n- **asyncpg** — PostgreSQL async driver\n- **Alembic** — schema migrations\n\n## Design Principles\n\nAll endpoints are async. Repository pattern separates data access from business logic. Pydantic v2 handles request/response validation.", parent_id=R2, path=f"/{R2}/{C3}/", position=0),
    dict(id=C4, title="API Reference", content="# API Reference\n\n## Base URL\n\n`http://localhost:8000/api/v1`\n\n## Authentication\n\nAll endpoints require a Bearer token in the `Authorization` header.\n\n## Endpoints\n\n| Method | Path | Description |\n|--------|------|-------------|\n| GET | /wiki | List root pages |\n| POST | /wiki | Create page |\n| GET | /wiki/{id} | Get page by ID |\n| PUT | /wiki/{id} | Update page |\n| DELETE | /wiki/{id} | Delete page |", parent_id=R2, path=f"/{R2}/{C4}/", position=1),
    dict(id=C5, title="Deployment Guide", content="# Deployment Guide\n\n## Production Stack\n\n- **Kubernetes** (k3s) for container orchestration\n- **Helm** charts for service configuration\n- **GitHub Actions** for CI/CD\n\n## Deploy Steps\n\n1. Push to `main` branch\n2. CI builds and pushes Docker images to GHCR\n3. Helm chart updates are applied via `helm upgrade`\n4. Rolling restart ensures zero downtime", parent_id=R2, path=f"/{R2}/{C5}/", position=2),
    # Children of Product (R3)
    dict(id=C6, title="Roadmap 2026", content="# Roadmap 2026\n\n## Q1 — Foundation\n\n- AI-powered wiki search\n- Revision history UI\n- Mobile-responsive redesign\n\n## Q2 — Growth\n\n- Team spaces and permissions\n- External sharing (public pages)\n- Slack integration\n\n## Q3 — Scale\n\n- Enterprise SSO\n- Audit logs\n- Advanced analytics", parent_id=R3, path=f"/{R3}/{C6}/", position=0),
    dict(id=C7, title="Feature Specs", content="# Feature Specs\n\nDetailed specifications for upcoming features.\n\n## AI Search\n\nUsers can ask natural language questions and receive answers grounded in wiki content. The copilot cites the source page for each answer.\n\n## Revision History\n\nEvery page edit creates a revision. Users can view a diff between any two revisions and restore a previous version with one click.", parent_id=R3, path=f"/{R3}/{C7}/", position=1),
    # Children of Team Handbook (R4)
    dict(id=C8, title="Our Values", content="# Our Values\n\n## Build with Clarity\n\nWe write clear code, clear docs, and clear communication. Ambiguity is a bug.\n\n## Ship with Care\n\nSpeed matters, but so does quality. We test, we review, and we deploy with confidence.\n\n## Grow Together\n\nWe share knowledge openly. A win for one engineer is a win for the whole team.", parent_id=R4, path=f"/{R4}/{C8}/", position=0),
    # Children of Release Notes (R5)
    dict(id=C9, title="v1.3.0 — May 2024", content="# v1.3.0 — May 15, 2024\n\n## New Features\n\n- **AI Wiki Copilot**: Ask questions, get answers with source citations\n- **Dark Mode**: System-aware dark/light theme with manual toggle\n- **Bulk Import**: Import pages from Notion, Confluence, or Markdown files\n\n## Bug Fixes\n\n- Fixed pagination on pages with deep hierarchies\n- Resolved search index lag after bulk edits\n\n## Breaking Changes\n\n- None", parent_id=R5, path=f"/{R5}/{C9}/", position=0),
    dict(id=C10, title="v1.2.0 — March 2024", content="# v1.2.0 — March 3, 2024\n\n## New Features\n\n- **Revision History**: Full diff view and one-click restore\n- **Page Templates**: Meeting notes, SOPs, and project briefs\n- **@Mentions**: Reference team members in page content\n\n## Bug Fixes\n\n- Fixed tree reorder on drag-and-drop\n- Improved search relevance ranking\n\n## Breaking Changes\n\n- `GET /api/v1/pages` renamed to `GET /api/v1/wiki`", parent_id=R5, path=f"/{R5}/{C10}/", position=1),
]

# 2 revisions per page × 15 pages = 30 revisions
def _make_revisions():
    revs = []
    for i, page in enumerate(DEMO_PAGES):
        pid = page["id"]
        revs.append(dict(
            id=f"dddddddd-0000-0000-0000-{str(i*2+1).zfill(12)}",
            page_id=pid, revision_number=1,
            title=page["title"], content=f"# {page['title']}\n\nInitial draft.",
            change_summary="Initial version", changed_by="admin",
        ))
        revs.append(dict(
            id=f"dddddddd-0000-0000-0000-{str(i*2+2).zfill(12)}",
            page_id=pid, revision_number=2,
            title=page["title"], content=page["content"],
            change_summary="Expanded content with details", changed_by="editor",
        ))
    return revs

DEMO_REVISIONS = _make_revisions()


@router.post("/demo/seed")
async def seed_demo(db: AsyncSession = Depends(get_db)):
    # Seed root pages first, then children
    root_pages = [p for p in DEMO_PAGES if p["parent_id"] is None]
    child_pages = [p for p in DEMO_PAGES if p["parent_id"] is not None]
    for p in root_pages:
        if not await db.get(WikiPage, p["id"]):
            db.add(WikiPage(**p))
    await db.flush()
    for p in child_pages:
        if not await db.get(WikiPage, p["id"]):
            db.add(WikiPage(**p))
    await db.flush()
    for r in DEMO_REVISIONS:
        if not await db.get(PageRevision, r["id"]):
            db.add(PageRevision(**r))
    await db.commit()
    return {"status": "seeded", "pages": len(DEMO_PAGES), "revisions": len(DEMO_REVISIONS)}


@router.delete("/demo/clear")
async def clear_demo(db: AsyncSession = Depends(get_db)):
    rev_ids = [r["id"] for r in DEMO_REVISIONS]
    await db.execute(delete(PageRevision).where(PageRevision.id.in_(rev_ids)))
    child_ids = [p["id"] for p in DEMO_PAGES if p["parent_id"] is not None]
    root_ids = [p["id"] for p in DEMO_PAGES if p["parent_id"] is None]
    await db.execute(delete(WikiPage).where(WikiPage.id.in_(child_ids)))
    await db.execute(delete(WikiPage).where(WikiPage.id.in_(root_ids)))
    await db.commit()
    return {"status": "cleared"}


@router.get("/demo/status")
async def demo_status(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(WikiPage).where(WikiPage.id.in_([R1,R2,R3,R4,R5])))
    count = len(result.scalars().all())
    return {"seeded": count > 0, "page_count": count}

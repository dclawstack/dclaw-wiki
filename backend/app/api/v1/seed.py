"""
Seed / clear demo data for DClaw Wiki.

POST   /api/v1/seed  — wipe every page + revision, then create a realistic
                       demo knowledge base (hierarchical pages with revision
                       history) so a visitor can explore the full app.
DELETE /api/v1/seed  — wipe all pages + revisions (back to an empty wiki).

This whole module is a self-contained demo utility. To remove the feature,
delete this file and the line that registers it in app/api/main.py
(plus the SeedControls block on the frontend landing page).

The demo content lives in app/api/v1/demo.py (DEMO_PAGES / DEMO_REVISIONS) and
is reused here so there is a single source of truth for the seed fixture.
"""
from fastapi import APIRouter, Depends
from sqlalchemy import delete
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.wiki import WikiPage
from app.models.revision import PageRevision
from app.api.v1.demo import DEMO_PAGES, DEMO_REVISIONS

router = APIRouter()


async def _wipe(db: AsyncSession) -> None:
    # Child → parent order so the wipe works even without ON DELETE CASCADE.
    await db.execute(delete(PageRevision))
    await db.execute(delete(WikiPage))


@router.post("", status_code=201)
async def seed_data(db: AsyncSession = Depends(get_db)):
    """Reset to a fully-populated demo wiki."""
    await _wipe(db)

    # Root pages first so parent_id FKs resolve, then children.
    root_pages = [p for p in DEMO_PAGES if p["parent_id"] is None]
    child_pages = [p for p in DEMO_PAGES if p["parent_id"] is not None]
    for p in root_pages:
        db.add(WikiPage(**p))
    await db.flush()
    for p in child_pages:
        db.add(WikiPage(**p))
    await db.flush()
    for r in DEMO_REVISIONS:
        db.add(PageRevision(**r))

    await db.commit()
    return {
        "seeded": True,
        "pages": len(DEMO_PAGES),
        "revisions": len(DEMO_REVISIONS),
    }


@router.delete("", status_code=200)
async def clear_data(db: AsyncSession = Depends(get_db)):
    """Wipe every page + revision — back to an empty wiki."""
    await _wipe(db)
    await db.commit()
    return {"cleared": True}

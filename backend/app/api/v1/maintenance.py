"""AI-Powered Content Maintenance.

Detects stale wiki pages and suggests how to refresh them.
  - GET  /maintenance/stale?days=90    list pages not updated in `days` days
  - POST /maintenance/suggest/{page_id} AI suggestion on how to refresh a page
"""
from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.config import settings
from app.core.utils import utc_now
from app.repositories.wiki_repo import WikiRepository
from app.services.wiki_ai import WikiAIService

router = APIRouter()


class StalePage(BaseModel):
    id: str
    title: str
    updated_at: str
    days_stale: int


class SuggestionResponse(BaseModel):
    suggestion: str
    provider: str


@router.get("/maintenance/stale", response_model=list[StalePage])
async def list_stale_pages(days: int = 90, db: AsyncSession = Depends(get_db)) -> list[StalePage]:
    # Timezone-naive cutoff to match TIMESTAMP WITHOUT TIME ZONE columns.
    now = utc_now()
    cutoff = now - timedelta(days=days)

    repo = WikiRepository(db)
    pages = await repo.list_all()

    stale: list[StalePage] = []
    for page in pages:
        if page.updated_at < cutoff:
            stale.append(
                StalePage(
                    id=page.id,
                    title=page.title,
                    updated_at=page.updated_at.isoformat(),
                    days_stale=(now - page.updated_at).days,
                )
            )

    stale.sort(key=lambda p: p.days_stale, reverse=True)
    return stale


@router.post("/maintenance/suggest/{page_id}", response_model=SuggestionResponse)
async def suggest_update(page_id: str, db: AsyncSession = Depends(get_db)) -> SuggestionResponse:
    repo = WikiRepository(db)
    page = await repo.get(page_id)
    if not page:
        raise HTTPException(status_code=404, detail="Page not found")

    svc = WikiAIService(db)
    system_prompt = (
        "You are a wiki maintenance assistant. Given a wiki page that may be out of "
        "date, give a short, actionable suggestion (2-3 sentences) on how to refresh "
        "or update it. Be concrete and concise."
    )
    user_prompt = (
        f"Page title: {page.title}\n"
        f"Last updated: {page.updated_at.isoformat()}\n\n"
        f"Content:\n{page.content[:_MAX_CONTENT_CHARS]}\n\n"
        "How should this page be updated or refreshed?"
    )

    suggestion, provider = await svc._call_llm(system_prompt, user_prompt)
    return SuggestionResponse(suggestion=suggestion, provider=provider)


# Max chars of page content fed into the suggestion prompt.
_MAX_CONTENT_CHARS = 4000

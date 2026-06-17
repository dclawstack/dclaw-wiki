from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.wiki import WikiPage
from app.repositories.analytics_repo import AnalyticsRepository
from app.repositories.wiki_repo import WikiRepository
from app.schemas.analytics import PageViewRead, PopularPage, AnalyticsOverview

router = APIRouter()


@router.post("/pages/{page_id}/view", response_model=PageViewRead, status_code=201)
async def record_page_view(page_id: str, db: AsyncSession = Depends(get_db)) -> PageViewRead:
    page = await WikiRepository(db).get(page_id)
    if not page:
        raise HTTPException(status_code=404, detail="Page not found")
    view = await AnalyticsRepository(db).record_view(page_id)
    return PageViewRead.model_validate(view)


@router.get("/analytics/overview", response_model=AnalyticsOverview)
async def analytics_overview(db: AsyncSession = Depends(get_db)) -> AnalyticsOverview:
    repo = AnalyticsRepository(db)

    total_views = await repo.total_views()
    popular = await repo.popular_pages(limit=10)
    recent_activity = await repo.views_last_n_days(7)

    page_count_result = await db.execute(select(func.count()).select_from(WikiPage))
    total_pages = int(page_count_result.scalar_one())

    return AnalyticsOverview(
        total_views=total_views,
        total_pages=total_pages,
        recent_activity=recent_activity,
        popular_pages=[PopularPage(**p) for p in popular],
    )

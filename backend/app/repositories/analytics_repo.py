from datetime import timedelta

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.page_view import PageView
from app.models.wiki import WikiPage
from app.core.utils import utc_now


class AnalyticsRepository:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def record_view(self, page_id: str) -> PageView:
        view = PageView(page_id=page_id)
        self.db.add(view)
        await self.db.commit()
        await self.db.refresh(view)
        return view

    async def total_views(self) -> int:
        result = await self.db.execute(select(func.count()).select_from(PageView))
        return int(result.scalar_one())

    async def popular_pages(self, limit: int = 10) -> list[dict]:
        view_count = func.count(PageView.id).label("views")
        result = await self.db.execute(
            select(WikiPage.id, WikiPage.title, view_count)
            .join(PageView, PageView.page_id == WikiPage.id)
            .group_by(WikiPage.id, WikiPage.title)
            .order_by(view_count.desc())
            .limit(limit)
        )
        return [
            {"page_id": row.id, "title": row.title, "views": int(row.views)}
            for row in result.all()
        ]

    async def views_last_n_days(self, n: int) -> int:
        cutoff = utc_now() - timedelta(days=n)
        result = await self.db.execute(
            select(func.count()).select_from(PageView).where(PageView.viewed_at >= cutoff)
        )
        return int(result.scalar_one())

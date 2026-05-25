from sqlalchemy import select, or_, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.wiki import WikiPage


class SearchService:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def search(self, query: str, limit: int = 20) -> list[WikiPage]:
        """Full-text search over page title and content using ILIKE.

        Uses PostgreSQL ILIKE for case-insensitive substring matching.
        A tsvector/tsquery GIN index can be layered on later for performance.
        """
        pattern = f"%{query}%"
        result = await self.db.execute(
            select(WikiPage)
            .where(
                or_(
                    WikiPage.title.ilike(pattern),
                    WikiPage.content.ilike(pattern),
                )
            )
            .order_by(
                # Rank title matches higher than content matches
                func.coalesce(WikiPage.title.ilike(pattern).cast(type_=None), False).desc(),
                WikiPage.updated_at.desc(),
            )
            .limit(limit)
        )
        return list(result.scalars().all())

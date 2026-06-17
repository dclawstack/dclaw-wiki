import re
from typing import Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.published_page import PublishedPage
from app.models.wiki import WikiPage


def slugify(text: str) -> str:
    """Derive a URL-safe slug from arbitrary text."""
    slug = text.strip().lower()
    slug = re.sub(r"[^a-z0-9]+", "-", slug)
    slug = slug.strip("-")
    return slug or "page"


class PublishRepository:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def _unique_slug(self, base: str, exclude_page_id: Optional[str] = None) -> str:
        candidate = base
        suffix = 1
        while True:
            result = await self.db.execute(
                select(PublishedPage).where(PublishedPage.slug == candidate)
            )
            existing = result.scalar_one_or_none()
            if existing is None or existing.page_id == exclude_page_id:
                return candidate
            suffix += 1
            candidate = f"{base}-{suffix}"

    async def get_by_page_id(self, page_id: str) -> Optional[PublishedPage]:
        result = await self.db.execute(
            select(PublishedPage).where(PublishedPage.page_id == page_id)
        )
        return result.scalar_one_or_none()

    async def is_published(self, page_id: str) -> bool:
        return (await self.get_by_page_id(page_id)) is not None

    async def publish(self, page_id: str, slug: str) -> PublishedPage:
        existing = await self.get_by_page_id(page_id)
        if existing:
            return existing

        unique = await self._unique_slug(slug, exclude_page_id=page_id)
        published = PublishedPage(page_id=page_id, slug=unique)
        self.db.add(published)
        await self.db.commit()
        await self.db.refresh(published)
        return published

    async def unpublish(self, page_id: str) -> bool:
        existing = await self.get_by_page_id(page_id)
        if not existing:
            return False
        await self.db.delete(existing)
        await self.db.commit()
        return True

    async def list_published(self) -> list[PublishedPage]:
        result = await self.db.execute(
            select(PublishedPage).order_by(PublishedPage.published_at.desc())
        )
        return list(result.scalars().all())

    async def get_by_slug(self, slug: str) -> Optional[PublishedPage]:
        """Return the published record with its joined WikiPage (eager via selectin)."""
        result = await self.db.execute(
            select(PublishedPage).where(PublishedPage.slug == slug)
        )
        return result.scalar_one_or_none()

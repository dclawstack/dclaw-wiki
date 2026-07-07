from typing import Optional

from sqlalchemy import select, update, delete
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.wiki import WikiPage
from app.models.revision import PageRevision
from app.schemas.wiki import PageCreate, PageUpdate
from app.core.utils import utc_now


class WikiRepository:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def create(self, data: PageCreate) -> WikiPage:
        page = WikiPage(
            title=data.title,
            content=data.content,
            parent_id=data.parent_id,
            created_by=data.created_by,
            updated_by=data.created_by,
            tags=data.tags,
        )
        # Build materialized path after we have the id
        self.db.add(page)
        await self.db.flush()  # gets the id without committing

        if data.parent_id:
            parent = await self.get(data.parent_id)
            page.path = f"{parent.path}{page.id}/" if parent else f"/{page.id}/"
        else:
            page.path = f"/{page.id}/"

        await self.db.commit()
        await self.db.refresh(page)
        return page

    async def get(self, page_id: str) -> Optional[WikiPage]:
        result = await self.db.execute(select(WikiPage).where(WikiPage.id == page_id))
        return result.scalar_one_or_none()

    async def list_roots(self) -> list[WikiPage]:
        result = await self.db.execute(
            select(WikiPage).where(WikiPage.parent_id.is_(None)).order_by(WikiPage.position, WikiPage.created_at)
        )
        return list(result.scalars().all())

    async def list_children(self, parent_id: str) -> list[WikiPage]:
        result = await self.db.execute(
            select(WikiPage).where(WikiPage.parent_id == parent_id).order_by(WikiPage.position, WikiPage.created_at)
        )
        return list(result.scalars().all())

    async def list_all(self) -> list[WikiPage]:
        result = await self.db.execute(select(WikiPage).order_by(WikiPage.path, WikiPage.position))
        return list(result.scalars().all())

    async def update(self, page_id: str, data: PageUpdate) -> Optional[WikiPage]:
        page = await self.get(page_id)
        if not page:
            return None

        # Snapshot current state as a revision before applying changes
        await self._snapshot_revision(page)

        if data.title is not None:
            page.title = data.title
        if data.content is not None:
            page.content = data.content
        if data.parent_id is not None:
            page.parent_id = data.parent_id
        if data.updated_by is not None:
            page.updated_by = data.updated_by
        if data.tags is not None:
            page.tags = data.tags
        page.updated_at = utc_now()

        await self.db.commit()
        await self.db.refresh(page)
        return page

    async def delete(self, page_id: str) -> bool:
        page = await self.get(page_id)
        if not page:
            return False
        await self.db.delete(page)
        await self.db.commit()
        return True

    # ── revision helpers ────────────────────────────────────────────────

    async def _snapshot_revision(self, page: WikiPage) -> None:
        result = await self.db.execute(
            select(PageRevision)
            .where(PageRevision.page_id == page.id)
            .order_by(PageRevision.revision_number.desc())
        )
        latest = result.scalars().first()
        next_rev = (latest.revision_number + 1) if latest else 1

        revision = PageRevision(
            page_id=page.id,
            revision_number=next_rev,
            title=page.title,
            content=page.content,
            changed_by=page.updated_by,
        )
        self.db.add(revision)

    async def list_revisions(self, page_id: str) -> list[PageRevision]:
        result = await self.db.execute(
            select(PageRevision)
            .where(PageRevision.page_id == page_id)
            .order_by(PageRevision.revision_number.desc())
        )
        return list(result.scalars().all())

    async def previous_revision_content(self, page_id: str, revision_number: int) -> str:
        """Content of the most recent revision before `revision_number` ("" if none)."""
        result = await self.db.execute(
            select(PageRevision)
            .where(
                PageRevision.page_id == page_id,
                PageRevision.revision_number < revision_number,
            )
            .order_by(PageRevision.revision_number.desc())
        )
        prev = result.scalars().first()
        return prev.content if prev else ""

    async def set_revision_summary(
        self, page_id: str, revision_id: str, summary: str
    ) -> Optional[PageRevision]:
        revision = await self.get_revision(page_id, revision_id)
        if not revision:
            return None
        revision.change_summary = summary
        await self.db.commit()
        await self.db.refresh(revision)
        return revision

    async def get_revision(self, page_id: str, revision_id: str) -> Optional[PageRevision]:
        result = await self.db.execute(
            select(PageRevision).where(
                PageRevision.id == revision_id,
                PageRevision.page_id == page_id,
            )
        )
        return result.scalar_one_or_none()

    async def restore_revision(self, page_id: str, revision_id: str) -> Optional[WikiPage]:
        revision = await self.get_revision(page_id, revision_id)
        if not revision:
            return None
        page = await self.get(page_id)
        if not page:
            return None

        await self._snapshot_revision(page)
        page.title = revision.title
        page.content = revision.content
        page.updated_at = utc_now()

        await self.db.commit()
        await self.db.refresh(page)
        return page

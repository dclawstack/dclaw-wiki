from typing import Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.comment import Comment
from app.schemas.comment import CommentCreate


class CommentRepository:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def list_for_page(self, page_id: str) -> list[Comment]:
        result = await self.db.execute(
            select(Comment)
            .where(Comment.page_id == page_id)
            .order_by(Comment.created_at)
        )
        return list(result.scalars().all())

    async def create(self, page_id: str, data: CommentCreate) -> Comment:
        comment = Comment(
            page_id=page_id,
            author=data.author,
            body=data.body,
        )
        self.db.add(comment)
        await self.db.commit()
        await self.db.refresh(comment)
        return comment

    async def get(self, comment_id: str) -> Optional[Comment]:
        result = await self.db.execute(select(Comment).where(Comment.id == comment_id))
        return result.scalar_one_or_none()

    async def set_resolved(self, comment_id: str, resolved: bool) -> Optional[Comment]:
        comment = await self.get(comment_id)
        if not comment:
            return None
        comment.resolved = resolved
        await self.db.commit()
        await self.db.refresh(comment)
        return comment

    async def delete(self, comment_id: str) -> bool:
        comment = await self.get(comment_id)
        if not comment:
            return False
        await self.db.delete(comment)
        await self.db.commit()
        return True

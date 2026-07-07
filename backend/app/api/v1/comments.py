from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.repositories.comment_repo import CommentRepository
from app.schemas.comment import CommentCreate, CommentRead

router = APIRouter()


@router.get("/pages/{page_id}/comments", response_model=list[CommentRead])
async def list_comments(page_id: str, db: AsyncSession = Depends(get_db)) -> list[CommentRead]:
    repo = CommentRepository(db)
    comments = await repo.list_for_page(page_id)
    return [CommentRead.model_validate(c) for c in comments]


@router.post("/pages/{page_id}/comments", response_model=CommentRead, status_code=201)
async def create_comment(
    page_id: str, body: CommentCreate, db: AsyncSession = Depends(get_db)
) -> CommentRead:
    repo = CommentRepository(db)
    comment = await repo.create(page_id, body)
    return CommentRead.model_validate(comment)


@router.patch("/comments/{comment_id}/resolve", response_model=CommentRead)
async def resolve_comment(comment_id: str, db: AsyncSession = Depends(get_db)) -> CommentRead:
    repo = CommentRepository(db)
    comment = await repo.set_resolved(comment_id, True)
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    return CommentRead.model_validate(comment)


@router.delete("/comments/{comment_id}", status_code=204)
async def delete_comment(comment_id: str, db: AsyncSession = Depends(get_db)) -> None:
    repo = CommentRepository(db)
    deleted = await repo.delete(comment_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Comment not found")

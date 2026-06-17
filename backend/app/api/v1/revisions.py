from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.repositories.wiki_repo import WikiRepository
from app.services.wiki_ai import WikiAIService
from app.schemas.revision import RevisionRead
from app.schemas.wiki import PageRead

router = APIRouter()


@router.get("/pages/{page_id}/revisions", response_model=list[RevisionRead])
async def list_revisions(page_id: str, db: AsyncSession = Depends(get_db)) -> list[RevisionRead]:
    repo = WikiRepository(db)
    page = await repo.get(page_id)
    if not page:
        raise HTTPException(status_code=404, detail="Page not found")
    revisions = await repo.list_revisions(page_id)
    return [RevisionRead.model_validate(r) for r in revisions]


@router.post("/pages/{page_id}/revisions/{revision_id}/summarize", response_model=RevisionRead)
async def summarize_revision(
    page_id: str,
    revision_id: str,
    db: AsyncSession = Depends(get_db),
) -> RevisionRead:
    """AI-generate and store a one-line change summary for a revision (P0.4 AI component)."""
    repo = WikiRepository(db)
    revision = await repo.get_revision(page_id, revision_id)
    if not revision:
        raise HTTPException(status_code=404, detail="Revision not found")
    old_content = await repo.previous_revision_content(page_id, revision.revision_number)
    result = await WikiAIService(db).summarize_change(old_content, revision.content)
    updated = await repo.set_revision_summary(page_id, revision_id, result["summary"])
    return RevisionRead.model_validate(updated)


@router.post("/pages/{page_id}/revisions/{revision_id}/restore", response_model=PageRead)
async def restore_revision(
    page_id: str,
    revision_id: str,
    db: AsyncSession = Depends(get_db),
) -> PageRead:
    repo = WikiRepository(db)
    page = await repo.restore_revision(page_id, revision_id)
    if not page:
        raise HTTPException(status_code=404, detail="Page or revision not found")
    return PageRead.model_validate(page)

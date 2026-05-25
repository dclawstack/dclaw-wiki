from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.services.search import SearchService
from app.schemas.wiki import PageRead

router = APIRouter()


@router.get("/search", response_model=list[PageRead])
async def search_pages(
    q: str = Query(..., min_length=1, description="Search query"),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
) -> list[PageRead]:
    svc = SearchService(db)
    pages = await svc.search(q, limit=limit)
    return [PageRead.model_validate(p) for p in pages]

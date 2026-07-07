from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.repositories.publish_repo import PublishRepository, slugify
from app.repositories.wiki_repo import WikiRepository
from app.schemas.publish import (
    PublishStatus,
    PublishedRead,
    PublicPageSummary,
    PublicPageDetail,
)

router = APIRouter()


@router.post("/pages/{page_id}/publish", response_model=PublishedRead, status_code=201)
async def publish_page(page_id: str, db: AsyncSession = Depends(get_db)) -> PublishedRead:
    wiki_repo = WikiRepository(db)
    page = await wiki_repo.get(page_id)
    if not page:
        raise HTTPException(status_code=404, detail="Page not found")

    publish_repo = PublishRepository(db)
    published = await publish_repo.publish(page_id, slugify(page.title))
    return PublishedRead.model_validate(published)


@router.delete("/pages/{page_id}/publish", status_code=204)
async def unpublish_page(page_id: str, db: AsyncSession = Depends(get_db)) -> None:
    publish_repo = PublishRepository(db)
    removed = await publish_repo.unpublish(page_id)
    if not removed:
        raise HTTPException(status_code=404, detail="Page is not published")


@router.get("/pages/{page_id}/publish", response_model=PublishStatus)
async def get_publish_status(page_id: str, db: AsyncSession = Depends(get_db)) -> PublishStatus:
    publish_repo = PublishRepository(db)
    published = await publish_repo.get_by_page_id(page_id)
    if not published:
        return PublishStatus(published=False, page_id=page_id)
    return PublishStatus(
        published=True,
        page_id=page_id,
        slug=published.slug,
        published_at=published.published_at,
    )


@router.get("/public/pages", response_model=list[PublicPageSummary])
async def list_public_pages(db: AsyncSession = Depends(get_db)) -> list[PublicPageSummary]:
    publish_repo = PublishRepository(db)
    published = await publish_repo.list_published()
    return [
        PublicPageSummary(slug=p.slug, title=p.page.title)
        for p in published
        if p.page is not None
    ]


@router.get("/public/pages/{slug}", response_model=PublicPageDetail)
async def get_public_page(slug: str, db: AsyncSession = Depends(get_db)) -> PublicPageDetail:
    publish_repo = PublishRepository(db)
    published = await publish_repo.get_by_slug(slug)
    if not published or published.page is None:
        raise HTTPException(status_code=404, detail="Published page not found")
    return PublicPageDetail(
        slug=published.slug,
        title=published.page.title,
        content=published.page.content,
    )

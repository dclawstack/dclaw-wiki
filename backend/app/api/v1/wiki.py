from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.repositories.wiki_repo import WikiRepository
from app.schemas.wiki import PageCreate, PageUpdate, PageRead, PageTree

router = APIRouter()


def _to_tree(pages: list[PageRead]) -> list[PageTree]:
    """Build a nested tree from a flat list of PageRead objects."""
    lookup: dict[str, PageTree] = {}
    roots: list[PageTree] = []

    for page in pages:
        node = PageTree(
            id=page.id,
            title=page.title,
            parent_id=page.parent_id,
            path=page.path,
            position=page.position,
        )
        lookup[page.id] = node

    for page in pages:
        node = lookup[page.id]
        if page.parent_id and page.parent_id in lookup:
            lookup[page.parent_id].children.append(node)
        else:
            roots.append(node)

    return roots


@router.post("/pages", response_model=PageRead, status_code=201)
async def create_page(body: PageCreate, db: AsyncSession = Depends(get_db)) -> PageRead:
    repo = WikiRepository(db)
    page = await repo.create(body)
    return PageRead.model_validate(page)


@router.get("/pages", response_model=list[PageRead])
async def list_pages(db: AsyncSession = Depends(get_db)) -> list[PageRead]:
    repo = WikiRepository(db)
    pages = await repo.list_all()
    return [PageRead.model_validate(p) for p in pages]


@router.get("/pages/tree", response_model=list[PageTree])
async def get_tree(db: AsyncSession = Depends(get_db)) -> list[PageTree]:
    repo = WikiRepository(db)
    pages = await repo.list_all()
    page_reads = [PageRead.model_validate(p) for p in pages]
    return _to_tree(page_reads)


@router.get("/pages/{page_id}", response_model=PageRead)
async def get_page(page_id: str, db: AsyncSession = Depends(get_db)) -> PageRead:
    repo = WikiRepository(db)
    page = await repo.get(page_id)
    if not page:
        raise HTTPException(status_code=404, detail="Page not found")
    return PageRead.model_validate(page)


@router.patch("/pages/{page_id}", response_model=PageRead)
async def update_page(page_id: str, body: PageUpdate, db: AsyncSession = Depends(get_db)) -> PageRead:
    repo = WikiRepository(db)
    page = await repo.update(page_id, body)
    if not page:
        raise HTTPException(status_code=404, detail="Page not found")
    return PageRead.model_validate(page)


@router.delete("/pages/{page_id}", status_code=204)
async def delete_page(page_id: str, db: AsyncSession = Depends(get_db)) -> None:
    repo = WikiRepository(db)
    deleted = await repo.delete(page_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Page not found")

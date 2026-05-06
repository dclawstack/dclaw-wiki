import uuid
from datetime import datetime, timezone

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class CreatePageRequest(BaseModel):
    title: str
    content: str


class WikiPage(BaseModel):
    id: str
    title: str
    content: str
    related_pages: list[str]
    last_edited_by: str
    created_at: str


@router.post("/pages", response_model=WikiPage)
async def create_page(req: CreatePageRequest) -> WikiPage:
    return WikiPage(
        id=str(uuid.uuid4()),
        title=req.title,
        content=req.content,
        related_pages=["Related 1", "Related 2"],
        last_edited_by="Alice",
        created_at=datetime.now(timezone.utc).isoformat(),
    )


@router.get("/pages/search", response_model=list[WikiPage])
async def search_pages(q: str) -> list[WikiPage]:
    return [
        WikiPage(
            id=str(uuid.uuid4()),
            title=f"Result for {q} — 1",
            content="Sample content 1",
            related_pages=["Related A"],
            last_edited_by="Alice",
            created_at=datetime.now(timezone.utc).isoformat(),
        ),
        WikiPage(
            id=str(uuid.uuid4()),
            title=f"Result for {q} — 2",
            content="Sample content 2",
            related_pages=["Related B"],
            last_edited_by="Bob",
            created_at=datetime.now(timezone.utc).isoformat(),
        ),
        WikiPage(
            id=str(uuid.uuid4()),
            title=f"Result for {q} — 3",
            content="Sample content 3",
            related_pages=["Related C"],
            last_edited_by="Charlie",
            created_at=datetime.now(timezone.utc).isoformat(),
        ),
    ]

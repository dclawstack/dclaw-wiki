from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.services.wiki_ai import WikiAIService

router = APIRouter()


class ChatRequest(BaseModel):
    question: str


class ChatResponse(BaseModel):
    answer: str
    sources: list[dict]
    provider: str


class RelatedPage(BaseModel):
    id: str
    title: str


@router.post("/ai/wiki-chat", response_model=ChatResponse)
async def wiki_chat(body: ChatRequest, db: AsyncSession = Depends(get_db)) -> ChatResponse:
    svc = WikiAIService(db)
    result = await svc.chat(body.question)
    return ChatResponse(**result)


@router.get("/ai/related-pages/{page_id}", response_model=list[RelatedPage])
async def related_pages(
    page_id: str,
    limit: int = 5,
    db: AsyncSession = Depends(get_db),
) -> list[RelatedPage]:
    svc = WikiAIService(db)
    pages = await svc.related_pages(page_id, limit=limit)
    return [RelatedPage(**p) for p in pages]

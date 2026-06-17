"""Public, no-auth wiki Q&A chatbot endpoint.

External-facing companion to ``app.api.v1.ai`` — it reuses the existing
``WikiAIService.chat`` (RAG over wiki content) so there is one LLM code path.
Intended to back the embeddable iframe widget at ``/embed``.
"""
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.services.wiki_ai import WikiAIService

router = APIRouter()


class PublicChatRequest(BaseModel):
    question: str


class PublicChatResponse(BaseModel):
    answer: str
    sources: list[dict]
    provider: str


@router.post("/public/chat", response_model=PublicChatResponse)
async def public_chat(
    body: PublicChatRequest, db: AsyncSession = Depends(get_db)
) -> PublicChatResponse:
    svc = WikiAIService(db)
    result = await svc.chat(body.question)
    return PublicChatResponse(**result)

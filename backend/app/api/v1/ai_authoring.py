from fastapi import APIRouter, Depends
from pydantic import BaseModel, ConfigDict
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.services.wiki_authoring import WikiAuthoringService

router = APIRouter()


class GeneratePageRequest(BaseModel):
    outline: str


class ImproveRequest(BaseModel):
    content: str


class AuthoringResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    content: str
    provider: str


@router.post("/ai/generate-page", response_model=AuthoringResponse)
async def generate_page(
    body: GeneratePageRequest, db: AsyncSession = Depends(get_db)
) -> AuthoringResponse:
    svc = WikiAuthoringService(db)
    result = await svc.generate(body.outline)
    return AuthoringResponse(**result)


@router.post("/ai/improve", response_model=AuthoringResponse)
async def improve(
    body: ImproveRequest, db: AsyncSession = Depends(get_db)
) -> AuthoringResponse:
    svc = WikiAuthoringService(db)
    result = await svc.improve(body.content)
    return AuthoringResponse(**result)

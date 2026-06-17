from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, ConfigDict

from app.services.templates import list_templates, get_template

router = APIRouter()


class TemplateRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    key: str
    name: str
    description: str
    icon: str
    content: str


@router.get("/templates", response_model=list[TemplateRead])
async def get_templates() -> list[TemplateRead]:
    return [TemplateRead.model_validate(t) for t in list_templates()]


@router.get("/templates/{key}", response_model=TemplateRead)
async def get_one_template(key: str) -> TemplateRead:
    template = get_template(key)
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    return TemplateRead.model_validate(template)

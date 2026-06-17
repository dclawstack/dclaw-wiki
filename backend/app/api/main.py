from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import init_db
from app.api.routes import health
from app.api.v1 import wiki, search, revisions, ai
from app.api.v1 import demo
from app.api.v1 import seed
from app.api.v1 import (
    ai_authoring,
    templates,
    comments,
    io_routes,
    maintenance,
    analytics,
    publish,
    public_chat,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield


app = FastAPI(title=settings.app_name, version="1.0.0", lifespan=lifespan)

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

app.include_router(health.router, prefix="/health", tags=["health"])
app.include_router(wiki.router, prefix="/api/v1", tags=["wiki"])
app.include_router(search.router, prefix="/api/v1", tags=["search"])
app.include_router(revisions.router, prefix="/api/v1", tags=["revisions"])
app.include_router(ai.router, prefix="/api/v1", tags=["ai"])
app.include_router(demo.router, prefix="/api/v1", tags=["demo"])
# Demo seed / clear — self-contained utility (see app/api/v1/seed.py).
app.include_router(seed.router, prefix="/api/v1/seed", tags=["seed"])

# v1.2 feature routers
app.include_router(ai_authoring.router, prefix="/api/v1", tags=["ai"])
app.include_router(templates.router, prefix="/api/v1", tags=["templates"])
app.include_router(comments.router, prefix="/api/v1", tags=["comments"])
app.include_router(io_routes.router, prefix="/api/v1", tags=["io"])
app.include_router(maintenance.router, prefix="/api/v1", tags=["maintenance"])
app.include_router(analytics.router, prefix="/api/v1", tags=["analytics"])
app.include_router(publish.router, prefix="/api/v1", tags=["publish"])
app.include_router(public_chat.router, prefix="/api/v1", tags=["public-chat"])

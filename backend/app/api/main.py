from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import init_db
from app.api.routes import health
from app.api.v1 import wiki, search, revisions, ai


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield


app = FastAPI(
    title=settings.app_name,
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/health", tags=["health"])
app.include_router(wiki.router, prefix="/api/v1", tags=["wiki"])
app.include_router(search.router, prefix="/api/v1", tags=["search"])
app.include_router(revisions.router, prefix="/api/v1", tags=["revisions"])
app.include_router(ai.router, prefix="/api/v1", tags=["ai"])

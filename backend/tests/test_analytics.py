import os

import pytest
import pytest_asyncio
from fastapi import FastAPI
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.pool import NullPool

from app.core.database import get_db
from app.models.base import Base
# Importing the model registers the page_views table on Base.metadata.
from app.models.page_view import PageView  # noqa: F401
from app.api.v1 import wiki
from app.api.v1 import analytics

TEST_DATABASE_URL = os.environ.get(
    "DATABASE_URL",
    "postgresql+asyncpg://postgres:postgres@localhost:5432/dclaw_wiki_test",
)

analytics_engine = create_async_engine(TEST_DATABASE_URL, poolclass=NullPool)


async def override_get_db():
    async with AsyncSession(analytics_engine, expire_on_commit=False) as session:
        try:
            yield session
        finally:
            await session.close()


# Self-contained app so the analytics router is mounted without editing main.py.
analytics_app = FastAPI()
analytics_app.include_router(wiki.router, prefix="/api/v1", tags=["wiki"])
analytics_app.include_router(analytics.router, prefix="/api/v1", tags=["analytics"])
analytics_app.dependency_overrides[get_db] = override_get_db


@pytest_asyncio.fixture(autouse=True)
async def setup_analytics_db():
    async with analytics_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with analytics_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest_asyncio.fixture
async def analytics_client():
    async with AsyncClient(
        transport=ASGITransport(app=analytics_app), base_url="http://test"
    ) as ac:
        yield ac


@pytest.mark.asyncio
async def test_record_view_and_overview(analytics_client: AsyncClient):
    create_resp = await analytics_client.post(
        "/api/v1/pages",
        json={"title": "Analytics Page", "content": "tracked"},
    )
    assert create_resp.status_code == 201
    page_id = create_resp.json()["id"]

    # Record two views.
    for _ in range(2):
        view_resp = await analytics_client.post(f"/api/v1/pages/{page_id}/view")
        assert view_resp.status_code == 201
        assert view_resp.json()["page_id"] == page_id

    overview_resp = await analytics_client.get("/api/v1/analytics/overview")
    assert overview_resp.status_code == 200
    data = overview_resp.json()
    assert data["total_views"] == 2
    assert data["total_pages"] == 1
    assert data["recent_activity"] == 2
    assert len(data["popular_pages"]) == 1
    assert data["popular_pages"][0]["page_id"] == page_id
    assert data["popular_pages"][0]["title"] == "Analytics Page"
    assert data["popular_pages"][0]["views"] == 2


@pytest.mark.asyncio
async def test_record_view_missing_page(analytics_client: AsyncClient):
    resp = await analytics_client.post("/api/v1/pages/nonexistent-id/view")
    assert resp.status_code == 404


@pytest.mark.asyncio
async def test_overview_empty(analytics_client: AsyncClient):
    resp = await analytics_client.get("/api/v1/analytics/overview")
    assert resp.status_code == 200
    data = resp.json()
    assert data["total_views"] == 0
    assert data["total_pages"] == 0
    assert data["popular_pages"] == []

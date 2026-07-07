from datetime import timedelta

import pytest
from httpx import AsyncClient

from app.core.utils import utc_now
from app.models.wiki import WikiPage
from tests.conftest import test_engine
from sqlalchemy.ext.asyncio import AsyncSession


async def _insert_page(title: str, updated_at) -> str:
    async with AsyncSession(test_engine, expire_on_commit=False) as session:
        page = WikiPage(title=title, content="some content", path="/")
        session.add(page)
        await session.flush()
        page.path = f"/{page.id}/"
        # Override timestamps to control staleness.
        page.created_at = updated_at
        page.updated_at = updated_at
        await session.commit()
        return page.id


@pytest.mark.asyncio
async def test_stale_lists_old_pages(client: AsyncClient):
    old = utc_now() - timedelta(days=120)
    fresh = utc_now()
    old_id = await _insert_page("Old Page", old)
    await _insert_page("Fresh Page", fresh)

    resp = await client.get("/api/v1/maintenance/stale?days=90")
    assert resp.status_code == 200
    data = resp.json()
    assert len(data) == 1
    assert data[0]["id"] == old_id
    assert data[0]["title"] == "Old Page"
    assert data[0]["days_stale"] >= 119


@pytest.mark.asyncio
async def test_stale_days_filter(client: AsyncClient):
    await _insert_page("Recent", utc_now() - timedelta(days=10))

    # Not stale at 90 days.
    resp = await client.get("/api/v1/maintenance/stale?days=90")
    assert resp.json() == []

    # Stale at 5 days.
    resp = await client.get("/api/v1/maintenance/stale?days=5")
    assert len(resp.json()) == 1


@pytest.mark.asyncio
async def test_suggest_update(client: AsyncClient, monkeypatch):
    page_id = await _insert_page("Install Guide", utc_now() - timedelta(days=200))

    async def fake_call_llm(self, system: str, user: str):
        return ("Update the install steps for the latest version.", "test-provider")

    monkeypatch.setattr(
        "app.services.wiki_ai.WikiAIService._call_llm", fake_call_llm
    )

    resp = await client.post(f"/api/v1/maintenance/suggest/{page_id}")
    assert resp.status_code == 200
    data = resp.json()
    assert data["suggestion"] == "Update the install steps for the latest version."
    assert data["provider"] == "test-provider"


@pytest.mark.asyncio
async def test_suggest_update_not_found(client: AsyncClient):
    resp = await client.post("/api/v1/maintenance/suggest/nonexistent-id")
    assert resp.status_code == 404

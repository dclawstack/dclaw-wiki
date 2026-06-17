import pytest
from httpx import AsyncClient

# Ensure the PublishedPage table is registered on Base.metadata so the
# conftest setup_db fixture creates it (models/__init__.py is not edited).
from app.models.published_page import PublishedPage  # noqa: F401


async def _create_page(client: AsyncClient, title: str, content: str = "") -> str:
    resp = await client.post("/api/v1/pages", json={"title": title, "content": content})
    assert resp.status_code == 201
    return resp.json()["id"]


@pytest.mark.asyncio
async def test_publish_page(client: AsyncClient):
    page_id = await _create_page(client, "My Public Doc", "# Hello\n\nBody text.")

    resp = await client.post(f"/api/v1/pages/{page_id}/publish")
    assert resp.status_code == 201
    data = resp.json()
    assert data["page_id"] == page_id
    assert data["slug"] == "my-public-doc"


@pytest.mark.asyncio
async def test_publish_status(client: AsyncClient):
    page_id = await _create_page(client, "Status Doc")

    before = await client.get(f"/api/v1/pages/{page_id}/publish")
    assert before.status_code == 200
    assert before.json()["published"] is False

    await client.post(f"/api/v1/pages/{page_id}/publish")

    after = await client.get(f"/api/v1/pages/{page_id}/publish")
    assert after.status_code == 200
    body = after.json()
    assert body["published"] is True
    assert body["slug"] == "status-doc"


@pytest.mark.asyncio
async def test_list_public_pages(client: AsyncClient):
    page_id = await _create_page(client, "Listed Doc", "content")
    await client.post(f"/api/v1/pages/{page_id}/publish")

    resp = await client.get("/api/v1/public/pages")
    assert resp.status_code == 200
    items = resp.json()
    assert len(items) == 1
    assert items[0]["slug"] == "listed-doc"
    assert items[0]["title"] == "Listed Doc"


@pytest.mark.asyncio
async def test_get_public_page_by_slug(client: AsyncClient):
    page_id = await _create_page(client, "Fetch Me", "# Markdown\n\nSome **bold** text.")
    pub = await client.post(f"/api/v1/pages/{page_id}/publish")
    slug = pub.json()["slug"]

    resp = await client.get(f"/api/v1/public/pages/{slug}")
    assert resp.status_code == 200
    data = resp.json()
    assert data["title"] == "Fetch Me"
    assert data["content"] == "# Markdown\n\nSome **bold** text."


@pytest.mark.asyncio
async def test_get_public_page_not_found(client: AsyncClient):
    resp = await client.get("/api/v1/public/pages/does-not-exist")
    assert resp.status_code == 404


@pytest.mark.asyncio
async def test_unpublish_page(client: AsyncClient):
    page_id = await _create_page(client, "Temp Doc", "content")
    pub = await client.post(f"/api/v1/pages/{page_id}/publish")
    slug = pub.json()["slug"]

    del_resp = await client.delete(f"/api/v1/pages/{page_id}/publish")
    assert del_resp.status_code == 204

    status = await client.get(f"/api/v1/pages/{page_id}/publish")
    assert status.json()["published"] is False

    gone = await client.get(f"/api/v1/public/pages/{slug}")
    assert gone.status_code == 404


@pytest.mark.asyncio
async def test_unpublish_not_published(client: AsyncClient):
    page_id = await _create_page(client, "Never Published")
    resp = await client.delete(f"/api/v1/pages/{page_id}/publish")
    assert resp.status_code == 404

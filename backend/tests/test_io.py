import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_export_markdown(client: AsyncClient):
    create_resp = await client.post(
        "/api/v1/pages",
        json={"title": "Export Me", "content": "# Hello\n\nSome **bold** text."},
    )
    page_id = create_resp.json()["id"]

    resp = await client.get(f"/api/v1/pages/{page_id}/export?format=md")
    assert resp.status_code == 200
    assert resp.headers["content-type"].startswith("text/markdown")
    assert "attachment" in resp.headers["content-disposition"]
    assert ".md" in resp.headers["content-disposition"]
    assert resp.text == "# Hello\n\nSome **bold** text."


@pytest.mark.asyncio
async def test_export_html(client: AsyncClient):
    create_resp = await client.post(
        "/api/v1/pages",
        json={"title": "Doc", "content": "# Title\n\n- one\n- two\n\nA **bold** line."},
    )
    page_id = create_resp.json()["id"]

    resp = await client.get(f"/api/v1/pages/{page_id}/export?format=html")
    assert resp.status_code == 200
    assert resp.headers["content-type"].startswith("text/html")
    assert "attachment" in resp.headers["content-disposition"]
    assert ".html" in resp.headers["content-disposition"]

    body = resp.text
    assert "<!DOCTYPE html>" in body
    assert "<h1>Title</h1>" in body
    assert "<ul>" in body and "<li>one</li>" in body
    assert "<strong>bold</strong>" in body


@pytest.mark.asyncio
async def test_export_html_escapes(client: AsyncClient):
    create_resp = await client.post(
        "/api/v1/pages",
        json={"title": "XSS", "content": "<script>alert(1)</script>"},
    )
    page_id = create_resp.json()["id"]

    resp = await client.get(f"/api/v1/pages/{page_id}/export?format=html")
    assert resp.status_code == 200
    assert "<script>alert(1)</script>" not in resp.text
    assert "&lt;script&gt;" in resp.text


@pytest.mark.asyncio
async def test_export_not_found(client: AsyncClient):
    resp = await client.get("/api/v1/pages/nonexistent/export?format=md")
    assert resp.status_code == 404


@pytest.mark.asyncio
async def test_import_markdown(client: AsyncClient):
    resp = await client.post(
        "/api/v1/import",
        json={"title": "Imported Page", "markdown": "# Imported\n\nContent here."},
    )
    assert resp.status_code == 201
    data = resp.json()
    assert data["title"] == "Imported Page"
    assert data["content"] == "# Imported\n\nContent here."
    assert "id" in data

    # The created page is retrievable through the standard API.
    get_resp = await client.get(f"/api/v1/pages/{data['id']}")
    assert get_resp.status_code == 200
    assert get_resp.json()["content"] == "# Imported\n\nContent here."


@pytest.mark.asyncio
async def test_import_with_parent(client: AsyncClient):
    parent_resp = await client.post(
        "/api/v1/pages",
        json={"title": "Parent", "content": ""},
    )
    parent_id = parent_resp.json()["id"]

    resp = await client.post(
        "/api/v1/import",
        json={"title": "Child", "markdown": "child", "parent_id": parent_id},
    )
    assert resp.status_code == 201
    data = resp.json()
    assert data["parent_id"] == parent_id
    assert parent_id in data["path"]

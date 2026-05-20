import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_create_page(client: AsyncClient):
    response = await client.post(
        "/api/v1/pages",
        json={"title": "Getting Started", "content": "Welcome to the wiki."},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Getting Started"
    assert data["content"] == "Welcome to the wiki."
    assert data["parent_id"] is None
    assert "id" in data


@pytest.mark.asyncio
async def test_get_page(client: AsyncClient):
    create_resp = await client.post(
        "/api/v1/pages",
        json={"title": "Test Page", "content": "Some content"},
    )
    page_id = create_resp.json()["id"]

    response = await client.get(f"/api/v1/pages/{page_id}")
    assert response.status_code == 200
    assert response.json()["title"] == "Test Page"


@pytest.mark.asyncio
async def test_get_page_not_found(client: AsyncClient):
    response = await client.get("/api/v1/pages/nonexistent-id")
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_list_pages_empty(client: AsyncClient):
    response = await client.get("/api/v1/pages")
    assert response.status_code == 200
    assert response.json() == []


@pytest.mark.asyncio
async def test_list_pages(client: AsyncClient):
    await client.post("/api/v1/pages", json={"title": "Page A", "content": "A"})
    await client.post("/api/v1/pages", json={"title": "Page B", "content": "B"})
    response = await client.get("/api/v1/pages")
    assert response.status_code == 200
    assert len(response.json()) == 2


@pytest.mark.asyncio
async def test_update_page(client: AsyncClient):
    create_resp = await client.post(
        "/api/v1/pages",
        json={"title": "Old Title", "content": "Old content"},
    )
    page_id = create_resp.json()["id"]

    response = await client.patch(
        f"/api/v1/pages/{page_id}",
        json={"title": "New Title", "updated_by": "alice"},
    )
    assert response.status_code == 200
    assert response.json()["title"] == "New Title"


@pytest.mark.asyncio
async def test_delete_page(client: AsyncClient):
    create_resp = await client.post(
        "/api/v1/pages",
        json={"title": "To Delete", "content": "bye"},
    )
    page_id = create_resp.json()["id"]

    delete_resp = await client.delete(f"/api/v1/pages/{page_id}")
    assert delete_resp.status_code == 204

    get_resp = await client.get(f"/api/v1/pages/{page_id}")
    assert get_resp.status_code == 404


@pytest.mark.asyncio
async def test_create_child_page(client: AsyncClient):
    parent_resp = await client.post(
        "/api/v1/pages",
        json={"title": "Parent", "content": "Parent content"},
    )
    parent_id = parent_resp.json()["id"]

    child_resp = await client.post(
        "/api/v1/pages",
        json={"title": "Child", "content": "Child content", "parent_id": parent_id},
    )
    assert child_resp.status_code == 201
    child = child_resp.json()
    assert child["parent_id"] == parent_id
    assert parent_id in child["path"]


@pytest.mark.asyncio
async def test_get_tree(client: AsyncClient):
    parent_resp = await client.post(
        "/api/v1/pages",
        json={"title": "Root", "content": ""},
    )
    parent_id = parent_resp.json()["id"]
    await client.post(
        "/api/v1/pages",
        json={"title": "Child", "content": "", "parent_id": parent_id},
    )

    tree_resp = await client.get("/api/v1/pages/tree")
    assert tree_resp.status_code == 200
    tree = tree_resp.json()
    assert len(tree) == 1
    assert tree[0]["title"] == "Root"
    assert len(tree[0]["children"]) == 1
    assert tree[0]["children"][0]["title"] == "Child"


@pytest.mark.asyncio
async def test_search_pages(client: AsyncClient):
    await client.post(
        "/api/v1/pages",
        json={"title": "FastAPI Guide", "content": "How to build APIs"},
    )
    await client.post(
        "/api/v1/pages",
        json={"title": "Docker Setup", "content": "Container deployment guide"},
    )

    resp = await client.get("/api/v1/search?q=FastAPI")
    assert resp.status_code == 200
    results = resp.json()
    assert len(results) == 1
    assert results[0]["title"] == "FastAPI Guide"


@pytest.mark.asyncio
async def test_revisions_after_update(client: AsyncClient):
    create_resp = await client.post(
        "/api/v1/pages",
        json={"title": "Original", "content": "v1 content"},
    )
    page_id = create_resp.json()["id"]

    await client.patch(f"/api/v1/pages/{page_id}", json={"title": "Updated", "content": "v2 content"})

    rev_resp = await client.get(f"/api/v1/pages/{page_id}/revisions")
    assert rev_resp.status_code == 200
    revisions = rev_resp.json()
    assert len(revisions) == 1
    assert revisions[0]["title"] == "Original"
    assert revisions[0]["content"] == "v1 content"


@pytest.mark.asyncio
async def test_restore_revision(client: AsyncClient):
    create_resp = await client.post(
        "/api/v1/pages",
        json={"title": "Original", "content": "v1 content"},
    )
    page_id = create_resp.json()["id"]

    await client.patch(f"/api/v1/pages/{page_id}", json={"title": "Updated"})

    rev_resp = await client.get(f"/api/v1/pages/{page_id}/revisions")
    revision_id = rev_resp.json()[0]["id"]

    restore_resp = await client.post(f"/api/v1/pages/{page_id}/revisions/{revision_id}/restore")
    assert restore_resp.status_code == 200
    assert restore_resp.json()["title"] == "Original"

import { test, expect } from '@playwright/test';

// v1.0 smoke suite — runs against localhost (default) or production
// (BASE_URL=https://... npx playwright test e2e/smoke.spec.ts).

test.describe('Wiki API', () => {
  test('lists pages', async ({ request }) => {
    const res = await request.get('/api/pages');
    expect(res.status()).toBe(200);
    expect(Array.isArray(await res.json())).toBe(true);
  });

  test('page CRUD round-trip', async ({ request }) => {
    const created = await request.post('/api/pages', {
      data: { title: 'E2E Smoke Page', content: '# hello\nsmoke test content' },
    });
    expect(created.status()).toBe(201);
    const page = await created.json();

    const fetched = await request.get(`/api/pages/${page.id}`);
    expect(fetched.status()).toBe(200);
    expect((await fetched.json()).title).toBe('E2E Smoke Page');

    const deleted = await request.delete(`/api/pages/${page.id}`);
    expect([200, 204]).toContain(deleted.status());
  });

  test('search finds seeded content', async ({ request }) => {
    const res = await request.get('/api/search?q=setup');
    expect(res.status()).toBe(200);
  });
});

test.describe('Copilot (consensus AI)', () => {
  test('answers with citations or refuses honestly', async ({ request }) => {
    const res = await request.post('/api/ask', {
      data: { question: 'How do I set up the dev environment?' },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(typeof body.answer).toBe('string');
    expect(body.answer.length).toBeGreaterThan(0);
    expect(typeof body.confidence).toBe('number');
    if (!body.refused) expect(body.sources?.length ?? body.usedSources?.length ?? 0).toBeGreaterThan(0);
  });
});

test.describe('Pages render', () => {
  test('wiki index renders sidebar tree', async ({ page }) => {
    await page.goto('/wiki');
    await expect(page.locator('aside, nav').first()).toBeVisible({ timeout: 10000 });
  });

  test('dashboard shows analytics and build roadmap', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.getByText('Total pages')).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('roadmap-card')).toBeVisible();
    await expect(page.getByText(/\d+\/\d+ shipped/)).toBeVisible();
  });
});

import { test, expect } from '@playwright/test';
test.describe('Proxy health', () => {
  test('GET /health/ returns 200', async ({ request }) => {
    expect((await request.get('/health/')).status()).toBe(200);
  });
});
test.describe('Seed/clear cycle', () => {
  test('seed returns 200', async ({ request }) => {
    expect((await request.post('/api/v1/demo/seed')).status()).toBe(200);
  });
  test('after seeding, demo status shows >= 5 pages', async ({ request }) => {
    await request.post('/api/v1/demo/seed');
    const body = await (await request.get('/api/v1/demo/status')).json();
    expect(body.page_count).toBeGreaterThanOrEqual(5);
  });
  test('clear returns 200', async ({ request }) => {
    expect((await request.delete('/api/v1/demo/clear')).status()).toBe(200);
  });
  test('after clearing, page_count is 0', async ({ request }) => {
    await request.post('/api/v1/demo/seed');
    await request.delete('/api/v1/demo/clear');
    const body = await (await request.get('/api/v1/demo/status')).json();
    expect(body.page_count).toBe(0);
  });
});
test.describe('404 regression', () => {
  test('GET /api/v1/pages/ not 404', async ({ request }) => {
    expect((await request.get('/api/v1/pages/')).status()).not.toBe(404);
  });
});

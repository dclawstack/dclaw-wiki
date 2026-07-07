import { test, expect } from '@playwright/test';
test.describe('Landing page', () => {
  test('shows hero headline', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText(/keeps itself.*true/i)).toBeVisible({ timeout: 8000 });
  });
  test('shows all 3 feature cards', async ({ page }) => {
    await page.goto('/');
    for (const t of ['Cited & honest', 'Stays fresh', 'Finds its gaps'])
      await expect(page.getByText(t)).toBeVisible();
  });
  test('CTAs link to ask and wiki', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: /ask a question/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /browse the wiki/i })).toBeVisible();
  });
});

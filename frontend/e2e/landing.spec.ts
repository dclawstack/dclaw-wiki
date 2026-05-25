import { test, expect } from '@playwright/test';
test.describe('Landing page', () => {
  test('shows hero headline', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText(/always findable/i)).toBeVisible({ timeout: 8000 });
  });
  test('shows all 4 feature sections', async ({ page }) => {
    await page.goto('/');
    for (const t of ['AI Wiki Copilot','Hierarchical Navigation','Revision History','Smart Search'])
      await expect(page.getByRole('heading', { name: t })).toBeVisible();
  });
});

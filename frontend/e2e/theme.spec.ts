import { test, expect } from '@playwright/test';
test('defaults to dark', async ({ page }) => {
  await page.goto('/'); await expect(page.locator('html')).toHaveClass(/dark/, { timeout: 5000 });
});
test('toggles to light', async ({ page }) => {
  await page.goto('/'); await page.click('[aria-label="Toggle theme"]');
  await expect(page.locator('html')).not.toHaveClass(/dark/);
});

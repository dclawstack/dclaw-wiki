import { test, expect } from '@playwright/test';
test('SeedWidget visible', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText(/seed demo data/i).or(page.getByText(/re-seed data/i))).toBeVisible({ timeout: 8000 });
});

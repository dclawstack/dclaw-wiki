import { defineConfig } from '@playwright/test';

// BASE_URL=https://dclaw-trust-wiki.vercel.app npx playwright test → run against prod
const baseURL = process.env.BASE_URL || 'http://localhost:3027';

export default defineConfig({
  testDir: './e2e',
  use: { baseURL },
  ...(process.env.BASE_URL
    ? {}
    : { webServer: { command: 'npm run dev', url: baseURL, reuseExistingServer: true } }),
});

import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './e2e',
  use: { baseURL: 'http://localhost:3027' },
  webServer: { command: 'npm run dev', url: 'http://localhost:3027', reuseExistingServer: true },
});

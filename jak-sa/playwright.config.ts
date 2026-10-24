import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  retries: 1,
  use: {
    baseURL: process.env.E2E_BASE_URL ?? "http://localhost:3000",
    headless: true,
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  workers: 2,
  webServer: {
    command: "npm run build && npm run start",
    url: "http://localhost:3000/ar",
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});

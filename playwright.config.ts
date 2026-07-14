import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  expect: {
    timeout: 15_000,
    toHaveScreenshot: {
      animations: "disabled",
      maxDiffPixelRatio: 0.01,
    },
  },
  fullyParallel: true,
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
  reporter: "line",
  retries: 0,
  testDir: "./tests",
  timeout: 60_000,
  use: {
    baseURL: "http://127.0.0.1:4173",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  webServer: [
    {
      command: "node scripts/visual-test-api.mjs",
      reuseExistingServer: false,
      timeout: 30_000,
      url: "http://127.0.0.1:4174/health",
    },
    {
      command: "npm run dev -- --hostname 127.0.0.1 --port 4173",
      env: {
        NEXT_PUBLIC_DESIGN_MODE: "false",
        NEXT_PUBLIC_EVENT_SLUG: "all-sections",
        NEXT_PUBLIC_WEBSERBISYO_API_URL: "http://127.0.0.1:4174",
      },
      reuseExistingServer: false,
      timeout: 120_000,
      url: "http://127.0.0.1:4173",
    },
  ],
  workers: 2,
});

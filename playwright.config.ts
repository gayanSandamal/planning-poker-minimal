import { defineConfig, devices } from "@playwright/test";

// Override with E2E_PORT if 8080 is taken locally (e.g. E2E_PORT=8093).
const port = Number(process.env.E2E_PORT) || 8080;
const baseURL = `http://localhost:${port}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "html",
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        ...(process.env.SLOW_E2E && {
          launchOptions: {
            slowMo: Number(process.env.SLOW_E2E) || 400,
          },
        }),
      },
    },
  ],
  webServer: {
    command: `yarn serve --port ${port}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});

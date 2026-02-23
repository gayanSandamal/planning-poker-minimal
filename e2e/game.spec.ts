import { test, expect } from "@playwright/test";

test.describe("Game page", () => {
  test("game route loads and shows game view", async ({ page }) => {
    await page.goto("/game-e2e-test");
    await expect(
      page.getByRole("heading", { name: /planning poker minimal/i })
    ).toBeVisible();
  });

  test("game view shows either join modal or voting UI", async ({ page }) => {
    await page.goto("/game-e2e-test");
    const joinModal = page.getByPlaceholder("Display name");
    const chooseCard = page.getByText(/choose your card/i);
    const startNewVoting = page.getByRole("button", { name: /start new voting/i });
    await expect(
      joinModal.or(chooseCard).or(startNewVoting)
    ).toBeVisible({ timeout: 10000 });
  });
});

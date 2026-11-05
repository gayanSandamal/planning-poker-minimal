import { test, expect } from "./fixtures";

// Read-only: opens a game ID that doesn't exist, so nothing is written.
test.describe("Game page", () => {
  test("an unknown game link shows a friendly not-found page", async ({
    page,
  }) => {
    await page.goto("/e2e-no-such-game");
    await expect(
      page.getByRole("heading", { name: "Game not found" })
    ).toBeVisible({ timeout: 15000 });
    await expect(
      page.getByRole("main").getByRole("link", { name: /start new game/i })
    ).toHaveAttribute("href", "/new-game");
  });

  test("an unknown game is not added to recent games", async ({ page }) => {
    await page.goto("/e2e-no-such-game");
    await expect(
      page.getByRole("heading", { name: "Game not found" })
    ).toBeVisible({ timeout: 15000 });
    const recent = await page.evaluate(() =>
      localStorage.getItem("ppm.recentGames")
    );
    expect(JSON.parse(recent ?? "[]")).toEqual([]);
  });
});

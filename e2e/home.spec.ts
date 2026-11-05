import { test, expect } from "./fixtures";

test.describe("Home page", () => {
  test("shows the hero with a Start a game call to action", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { level: 1, name: /estimate together/i })
    ).toBeVisible();
    // The hero CTA is the first of two "Start a game" links on the page.
    await expect(
      page.getByRole("link", { name: /start a game/i }).first()
    ).toHaveAttribute("href", "/new-game");
  });

  test("shows the about and features sections", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: /built for teams that ship/i })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /everything you need for estimation/i })
    ).toBeVisible();
  });

  test("navbar has the brand and a Start new game link", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("link", { name: "Planning Poker – Home" })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /start new game/i }).first()
    ).toBeVisible();
  });

  test("footer links to the privacy page", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("contentinfo").getByRole("link", { name: /privacy/i })
    ).toHaveAttribute("href", "/privacy");
  });

  test("hides recent games for first-time visitors", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: /estimate together/i })
    ).toBeVisible();
    await expect(page.getByText(/welcome back/i)).toHaveCount(0);
  });

  test("welcomes returning players back with their recent games", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      localStorage.setItem("planningPokerDisplayName", "Priya");
      localStorage.setItem(
        "ppm.recentGames",
        JSON.stringify([
          {
            id: "e2e-recent-1",
            name: "Sprint 42 Planning",
            deck: "Fibonacci",
            lastVisited: Date.now() - 2 * 24 * 60 * 60 * 1000,
          },
        ])
      );
    });
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "Welcome back, Priya!" })
    ).toBeVisible();
    const game = page.getByRole("link", { name: /sprint 42 planning/i });
    await expect(game).toHaveAttribute("href", "/e2e-recent-1");
    await expect(game).toContainText("2 days ago");
  });
});

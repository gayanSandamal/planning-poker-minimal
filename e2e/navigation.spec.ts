import { test, expect } from "./fixtures";

test.describe("Navigation", () => {
  test("About link goes to the about page", async ({ page }) => {
    await page.goto("/");
    await page
      .getByRole("navigation", { name: "Main navigation" })
      .getByRole("link", { name: "About" })
      .click();
    await expect(page).toHaveURL(/\/about$/);
    await expect(
      page.getByRole("heading", { level: 1, name: /built for teams/i })
    ).toBeVisible();
  });

  test("Start new game goes to the new game page", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /start new game/i }).first().click();
    await expect(page).toHaveURL(/\/new-game$/);
    await expect(
      page.getByRole("heading", { name: /set up your planning session/i })
    ).toBeVisible();
  });

  test("hero CTA goes to the new game page", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /start a game/i }).first().click();
    await expect(page).toHaveURL(/\/new-game$/);
  });

  test("brand link goes home", async ({ page }) => {
    await page.goto("/about");
    await page.getByRole("link", { name: "Planning Poker – Home" }).click();
    await expect(page).toHaveURL(/\/$/);
  });

  test("footer link opens the privacy page", async ({ page }) => {
    await page.goto("/");
    await page
      .getByRole("contentinfo")
      .getByRole("link", { name: /privacy/i })
      .click();
    await expect(page).toHaveURL(/\/privacy$/);
    await expect(
      page.getByRole("heading", { level: 1, name: /privacy/i })
    ).toBeVisible();
  });
});

import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("About link goes to about page", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "About" }).click();
    await expect(page).toHaveURL(/\/about/);
    await expect(page.getByRole("heading", { name: "About" }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /gayan sandamal's linkedin/i })).toBeVisible();
  });

  test("Start New Game link goes to new game page", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /start new game/i }).click();
    await expect(page).toHaveURL(/\/new-game/);
    await expect(page.getByLabel(/name of the game/i)).toBeVisible();
  });

  test("Hero CTA goes to new game", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /start playing now/i }).click();
    await expect(page).toHaveURL(/\/new-game/);
  });

  test("Brand link goes home", async ({ page }) => {
    await page.goto("/about");
    await page.getByRole("link", { name: "Planning Poker" }).click();
    await expect(page).toHaveURL("/");
  });
});

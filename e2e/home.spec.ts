import { test, expect } from "@playwright/test";

test.describe("Home page", () => {
  test("loads and shows hero with title and CTA", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /planning poker minimal/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /start playing now/i })).toBeVisible();
  });

  test("shows About section", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "About" }).first()).toBeVisible();
    await expect(page.getByText(/planning poker app/i).first()).toBeVisible();
  });

  test("shows Features section with feature cards", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Features" })).toBeVisible();
    await expect(page.getByRole("heading", { name: /efficient task estimation/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /user-friendly interface/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /real-time collaboration/i })).toBeVisible();
  });

  test("navbar has brand and Start New Game link", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: "Planning Poker" })).toBeVisible();
    await expect(page.getByRole("link", { name: /start new game/i })).toBeVisible();
  });

  test("footer is visible", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText(/planning poker minimal/i).last()).toBeVisible();
  });
});

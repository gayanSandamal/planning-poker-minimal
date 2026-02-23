import { test, expect } from "@playwright/test";

test.describe("New game page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/new-game");
  });

  test("shows form with game name and voting system", async ({ page }) => {
    await expect(
      page.getByText(/choose a name and a voting system for your game/i)
    ).toBeVisible();
    await expect(page.getByLabel(/name of the game/i)).toBeVisible();
    await expect(page.getByRole("combobox")).toBeVisible();
    await expect(page.getByRole("button", { name: /create game/i })).toBeVisible();
  });

  test("Create Game button is disabled when name is empty", async ({ page }) => {
    const createBtn = page.getByRole("button", { name: /create game/i });
    await expect(createBtn).toBeDisabled();
  });

  test("Create Game button is enabled when name is filled and default system selected", async ({ page }) => {
    await page.getByLabel(/name of the game/i).fill("My Sprint Planning");
    await expect(page.getByRole("button", { name: /create game/i })).toBeEnabled();
  });

  test("voting system dropdown has Fibonacci, T-shirt, and Custom Deck options", async ({ page }) => {
    const select = page.getByRole("combobox");
    await expect(select).toBeVisible();
    await expect(select.locator("option").first()).toHaveText(/Fibonacci/);
    const optionsText = await select.locator("option").allTextContents();
    expect(optionsText.some((t) => /t-shirt|T-shirt/i.test(t))).toBe(true);
    expect(optionsText.some((t) => /custom deck|Create Custom/i.test(t))).toBe(true);
  });

  test("another voting system is selectable and Create Game stays enabled when name is filled", async ({ page }) => {
    await page.getByLabel(/name of the game/i).fill("Estimation Game");
    const select = page.getByRole("combobox");
    await select.selectOption({ index: 3 });
    await expect(select).toContainText("Powers of 2");
    await expect(page.getByRole("button", { name: /create game/i })).toBeEnabled();
  });
});

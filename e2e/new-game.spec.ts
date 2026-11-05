import { test, expect } from "./fixtures";

// These tests never click "Create Game", so nothing is written to Firestore.
test.describe("New game page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/new-game");
  });

  test("shows the name field, deck choices and Create Game", async ({
    page,
  }) => {
    await expect(
      page.getByRole("heading", { name: /set up your planning session/i })
    ).toBeVisible();
    await expect(page.getByLabel("Game Name")).toBeVisible();
    await expect(
      page.getByRole("radiogroup", { name: "Voting system" })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /create game/i })
    ).toBeVisible();
  });

  test("offers every built-in deck plus a custom deck", async ({ page }) => {
    const decks = page.getByRole("radiogroup", { name: "Voting system" });
    for (const name of [
      /^Fibonacci/,
      /Modified Fibonacci/,
      /T-Shirt Sizes/,
      /Powers of 2/,
      /Custom Deck/,
    ]) {
      await expect(decks.getByRole("button", { name })).toBeVisible();
    }
  });

  test("Fibonacci is selected by default", async ({ page }) => {
    await expect(
      page.getByRole("button", { name: /^Fibonacci/ })
    ).toHaveAttribute("aria-pressed", "true");
  });

  test("Create Game is disabled until the game has a name", async ({
    page,
  }) => {
    const create = page.getByRole("button", { name: /create game/i });
    await expect(create).toBeDisabled();
    await page.getByLabel("Game Name").fill("Sprint 24 Planning");
    await expect(create).toBeEnabled();
    await page.getByLabel("Game Name").fill("   ");
    await expect(create).toBeDisabled();
  });

  test("another deck can be selected", async ({ page }) => {
    await page.getByRole("button", { name: /Powers of 2/ }).click();
    await expect(
      page.getByRole("button", { name: /Powers of 2/ })
    ).toHaveAttribute("aria-pressed", "true");
    await expect(
      page.getByRole("button", { name: /^Fibonacci/ })
    ).toHaveAttribute("aria-pressed", "false");
  });
});

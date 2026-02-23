import { test, expect } from "@playwright/test";

test.describe("About page", () => {
  test("loads and shows about content", async ({ page }) => {
    await page.goto("/about");
    await expect(page.getByRole("heading", { name: "About" }).first()).toBeVisible();
    await expect(page.getByText(/gayan sandamal/i).first()).toBeVisible();
    await expect(page.getByText(/planning poker app/i).first()).toBeVisible();
  });

  test("has links to LinkedIn, GitHub, Twitter", async ({ page }) => {
    await page.goto("/about");
    await expect(page.getByRole("link", { name: /linkedin/i })).toHaveAttribute(
      "href",
      /linkedin\.com/
    );
    await expect(page.getByRole("link", { name: /github/i })).toHaveAttribute(
      "href",
      /github\.com/
    );
    await expect(page.getByRole("link", { name: /twitter/i })).toHaveAttribute(
      "href",
      /twitter\.com/
    );
  });
});

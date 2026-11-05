import { test, expect } from "./fixtures";

test.describe("About page", () => {
  test("shows the app and the creator", async ({ page }) => {
    await page.goto("/about");
    await expect(
      page.getByRole("heading", { level: 1, name: /built for teams/i })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Gayan Sandamal" })
    ).toBeVisible();
    await expect(
      page.getByRole("img", { name: "Portrait of Gayan Sandamal" })
    ).toBeVisible();
  });

  test("links to the creator's profiles", async ({ page }) => {
    await page.goto("/about");
    await expect(
      page.getByRole("link", { name: "Gayan Sandamal on LinkedIn" })
    ).toHaveAttribute("href", /linkedin\.com/);
    await expect(
      page.getByRole("link", { name: "Gayan Sandamal on GitHub" })
    ).toHaveAttribute("href", /github\.com/);
    await expect(
      page.getByRole("link", { name: "Gayan Sandamal on Twitter" })
    ).toHaveAttribute("href", /twitter\.com/);
  });
});

import { test, expect } from "./fixtures";

// Start with no consent choice stored, like a first-time visitor.
test.use({ consent: null });

test.describe("Cookie consent", () => {
  test("asks first-time visitors and remembers Decline", async ({ page }) => {
    await page.goto("/");
    const banner = page.getByRole("region", { name: "Cookie consent" });
    await expect(banner).toBeVisible();
    await banner.getByRole("button", { name: "Decline" }).click();
    await expect(banner).toBeHidden();
    expect(
      await page.evaluate(() => localStorage.getItem("ppm.analyticsConsent"))
    ).toBe("denied");

    await page.reload();
    await expect(
      page.getByRole("heading", { name: /estimate together/i })
    ).toBeVisible();
    await expect(banner).toBeHidden();
  });

  test("the privacy page shows and changes the choice", async ({ page }) => {
    await page.goto("/privacy");
    await expect(page.getByText("Not chosen yet")).toBeVisible();
    await page.getByRole("button", { name: "Turn off analytics" }).click();
    await expect(page.getByText("Analytics off")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Turn off analytics" })
    ).toBeDisabled();
  });
});

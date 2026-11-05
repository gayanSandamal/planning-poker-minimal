import { test as base, expect } from "@playwright/test";

/**
 * Every test starts with the cookie banner already answered ("denied"), so
 * it can't cover buttons and no analytics is ever loaded. The consent spec
 * opts out of this with `test.use({ consent: null })`.
 */
export const test = base.extend<{ consent: "granted" | "denied" | null }>({
  consent: ["denied", { option: true }],
  page: async ({ page, consent }, use) => {
    if (consent) {
      await page.addInitScript((value) => {
        localStorage.setItem("ppm.analyticsConsent", value);
      }, consent);
    }
    await use(page);
  },
});

export { expect };

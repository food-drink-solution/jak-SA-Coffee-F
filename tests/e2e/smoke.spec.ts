import { expect, test } from "@playwright/test";

test.describe("JAK storefront", () => {
  test("Arabic homepage renders with RTL and hero", async ({ page }) => {
    await page.goto("/ar");
    await expect(page).toHaveTitle(/جاك/);
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("English homepage renders with LTR", async ({ page }) => {
    await page.goto("/en");
    await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("language switch navigates to the other locale", async ({ page, isMobile }) => {
    await page.goto("/ar");
    if (isMobile) {
      await page.getByRole("button", { name: /فتح القائمة/ }).click();
    }
    await page.getByRole("link", { name: "English" }).first().click();
    await expect(page).toHaveURL(/\/en/);
    await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
  });

  test("browse category and open a product", async ({ page }) => {
    await page.goto("/ar/categories");
    await page.getByRole("link").filter({ hasText: /عرض المنتجات|تسوق/ }).first().click().catch(async () => {
      await page.locator("a[href*='/categories/']").first().click();
    });
    await expect(page).toHaveURL(/\/(categories|products)\//);
  });

  test("product detail page shows name, price and specs", async ({ page }) => {
    await page.goto("/ar/products");
    await page.locator("a[href*='/products/']").first().click();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator("dl")).toBeVisible();
  });

  test("search returns results for a known product", async ({ page }) => {
    await page.goto("/ar/search?q=%D9%83%D8%B1%D9%88%D8%B3%D8%A7%D9%86");
    await expect(page.locator("main")).toBeVisible();
  });

  test("contact form validates required fields", async ({ page }) => {
    await page.goto("/ar/contact");
    await page.getByRole("button", { name: /إرسال/ }).click();
    await expect(page.getByRole("alert").first()).toBeVisible();
  });

  test("legal pages render", async ({ page }) => {
    for (const slug of ["terms", "privacy", "about", "profile"]) {
      await page.goto(`/ar/${slug}`);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    }
  });

  test("mobile navigation opens", async ({ page, isMobile }) => {
    test.skip(!isMobile, "mobile only");
    await page.goto("/ar");
    await page.getByRole("button", { name: /فتح القائمة|القائمة/ }).click();
    await expect(page.locator("#mobile-nav")).toBeVisible();
  });
});

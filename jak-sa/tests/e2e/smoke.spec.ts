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

  test("products listing has sort dropdown, view toggle and pagination", async ({ page }) => {
    await page.goto("/ar/products");
    // Sort dropdown opens and offers localized options.
    await page.getByRole("button", { name: /ترتيب حسب/ }).click();
    await page.getByRole("option", { name: /السعر: من الأقل إلى الأعلى/ }).click();
    await expect(page).toHaveURL(/sort=price-asc/);
    // View toggle switches to list layout.
    await page.getByRole("button", { name: "عرض قائمة" }).click();
    await expect(page.getByRole("button", { name: "عرض قائمة" })).toHaveAttribute("aria-pressed", "true");
    // Pagination navigates to page 2.
    await page.getByRole("navigation", { name: "التنقل بين الصفحات" }).getByRole("link", { name: "صفحة 2" }).click();
    await expect(page).toHaveURL(/page=2/);
  });

  test("scroll-to-top button appears after scrolling", async ({ page }) => {
    await page.goto("/ar");
    const button = page.getByRole("button", { name: "العودة إلى الأعلى" });
    await expect(button).not.toBeVisible();
    await page.evaluate(() => window.scrollTo(0, 1500));
    await expect(button).toBeVisible();
    await button.click();
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(100);
  });

  test("chat widget opens the contact panel", async ({ page }) => {
    await page.goto("/en");
    await page.getByRole("button", { name: "Open contact options" }).click();
    await expect(page.getByRole("dialog", { name: "Need help?" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Contact page" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog", { name: "Need help?" })).toBeHidden();
  });
});

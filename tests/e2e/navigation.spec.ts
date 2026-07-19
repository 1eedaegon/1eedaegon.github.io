import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('home page loads and has title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/.+/);
    await expect(page.locator('.logo')).toBeVisible();
  });

  test('navigate to About page', async ({ page }) => {
    await page.goto('/');
    await page.locator('.nav-link', { hasText: 'About' }).click();
    await expect(page).toHaveURL(/\/about/);
  });

  test('navigate to Code Work page', async ({ page }) => {
    await page.goto('/');
    await page.locator('.nav-link', { hasText: 'Code Work' }).click();
    await expect(page).toHaveURL(/\/code/);
  });

  test('navigate to article page via article link', async ({ page }) => {
    await page.goto('/');
    const articleLink = page.locator('a[href*="/articles/"]').first();
    await articleLink.click();
    await expect(page).toHaveURL(/\/articles\//);
  });

  test('breadcrumb navigation works on article pages', async ({ page }) => {
    await page.goto('/');
    const articleLink = page.locator('a[href*="/articles/"]').first();
    await articleLink.click();
    await expect(page).toHaveURL(/\/articles\//);

    const breadcrumb = page.locator('.breadcrumb');
    await expect(breadcrumb).toBeVisible();

    const homeLink = breadcrumb.locator('a', { hasText: 'Home' });
    await expect(homeLink).toBeVisible();

    await homeLink.click();
    await expect(page).toHaveURL('/');
  });

  test('mobile menu toggle works', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const menuToggle = page.locator('#mobile-menu-toggle');
    const mobileMenu = page.locator('#mobile-menu');

    await expect(menuToggle).toBeVisible();
    await expect(mobileMenu).not.toHaveClass(/open/);

    await menuToggle.click();
    await expect(mobileMenu).toHaveClass(/open/);

    await menuToggle.click();
    await expect(mobileMenu).not.toHaveClass(/open/);
  });
});

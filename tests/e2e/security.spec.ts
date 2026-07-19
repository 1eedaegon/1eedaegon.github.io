import { test, expect } from '@playwright/test';

test.describe('Security and metadata', () => {
  test('article structured data renders in head and external links are isolated', async ({
    page,
  }) => {
    await page.goto('/articles/astro-tips/');

    const jsonLdScripts = await page
      .locator('head script[type="application/ld+json"]')
      .evaluateAll((scripts) =>
        scripts.map((script) => script.textContent || ''),
      );
    expect(
      jsonLdScripts.some((script) => script.includes('"BlogPosting"')),
    ).toBe(true);

    const externalLinks = page.locator('a[target="_blank"][href^="http"]');
    const externalCount = await externalLinks.count();

    for (let index = 0; index < externalCount; index += 1) {
      const rel = await externalLinks.nth(index).getAttribute('rel');
      expect(rel).toContain('noopener');
      expect(rel).toContain('noreferrer');
    }
  });

  test('search query is rendered as text, not executable markup', async ({
    page,
  }) => {
    let didOpenDialog = false;
    page.on('dialog', async (dialog) => {
      didOpenDialog = true;
      await dialog.dismiss();
    });

    await page.goto('/');
    await page.keyboard.press('Control+k');
    await page.locator('#search-input').fill('"><img src=x onerror=alert(1)>');

    await expect(page.locator('#search-results')).toBeVisible();
    await expect(page.locator('#search-results img')).toHaveCount(0);
    expect(didOpenDialog).toBe(false);
  });

  test('search index exposes only same-origin article URLs', async ({
    request,
    baseURL,
  }) => {
    const response = await request.get('/search-index.json');
    expect(response.ok()).toBe(true);
    expect(response.headers()['content-type']).toContain('application/json');

    const origin = new URL(baseURL || 'http://localhost:4321').origin;
    const items = await response.json();
    expect(Array.isArray(items)).toBe(true);

    for (const item of items) {
      expect(typeof item.url).toBe('string');
      const url = new URL(item.url, origin);
      expect(url.origin).toBe(origin);
      expect(url.pathname).toMatch(/\/articles\//);
    }
  });
});

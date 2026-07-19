import { test, expect } from '@playwright/test';

test.describe('Wikilink rendering', () => {
  test('[[slug|label]] renders as an internal link in the article body', async ({
    page,
  }) => {
    await page.goto('/articles/astro-series-part2');
    const prose = page.locator('.prose');
    const link = prose
      .locator('a[href*="/articles/astro-series-part1"]')
      .first();
    await expect(link).toBeVisible();
    await expect(link).toHaveText('Part 1');
  });

  test('article body contains no raw [[ wikilink syntax', async ({ page }) => {
    for (const path of [
      '/articles/astro-series-part2',
      '/articles/astro-tips',
    ]) {
      await page.goto(path);
      const proseText = await page.locator('.prose').innerText();
      expect(proseText).not.toContain('[[');
    }
  });

  test('unknown wikilink target renders as a harmless broken-link span', async ({
    page,
  }) => {
    await page.goto('/articles/draft-example');
    const broken = page.locator('.wikilink-broken');
    await expect(broken).toBeVisible();
    await expect(broken).toHaveText('[[no-such-post]]');
    // must not become an anchor that lychee/readers can follow
    expect(await broken.evaluate((el) => el.tagName)).toBe('SPAN');
  });
});

test.describe('Code block chrome', () => {
  test('language watermark renders inside the code box (no chip)', async ({
    page,
  }) => {
    await page.goto('/articles/draft-example');
    const watermark = page
      .locator('.code-block-wrapper .code-watermark')
      .first();
    await expect(watermark).toBeVisible();
    await expect(watermark.locator('.code-watermark-name')).toHaveText(
      'TypeScript',
    );
    await expect(watermark.locator('svg.code-watermark-icon')).toHaveCount(1);
    // faint, not a solid badge
    const opacity = await watermark.evaluate((el) =>
      parseFloat(getComputedStyle(el).opacity),
    );
    expect(opacity).toBeGreaterThan(0.2);
    expect(opacity).toBeLessThan(0.9);
  });

  test('copy button is visible inside the box without hovering', async ({
    page,
  }) => {
    await page.goto('/articles/draft-example');
    const button = page.locator('.code-block-wrapper .copy-button').first();
    await expect(button).toBeVisible();
    const opacity = await button.evaluate((el) =>
      parseFloat(getComputedStyle(el).opacity),
    );
    expect(opacity).toBeGreaterThan(0.2);
  });

  test('copy button copies the code text', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/articles/draft-example');
    const button = page.locator('.code-block-wrapper .copy-button').first();
    await button.click();
    await expect(button).toHaveClass(/copied/);
    const clipboard = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboard).toContain('faint language watermark');
  });
});

test.describe('Draft badge', () => {
  test('draft article shows a DRAFT badge next to the title', async ({
    page,
  }) => {
    await page.goto('/articles/draft-example');
    await expect(page.locator('.draft-badge')).toHaveText('DRAFT');
  });

  test('published article shows no DRAFT badge', async ({ page }) => {
    await page.goto('/articles/astro-tips');
    await expect(page.locator('.draft-badge')).toHaveCount(0);
  });
});

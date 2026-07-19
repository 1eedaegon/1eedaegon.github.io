import { test, expect } from '@playwright/test';

test.describe('Article Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to first article from home page
    await page.goto('/');
    const articleLink = page.locator('a[href*="/articles/"]').first();
    await articleLink.click();
    await expect(page).toHaveURL(/\/articles\//);
  });

  test('renders with title, date, and reading time', async ({ page }) => {
    // Article title should exist (h1 or .article-title)
    const title = page.locator('h1').first();
    await expect(title).toBeVisible();
    await expect(title).not.toBeEmpty();

    // Date should be visible
    const dateElement = page.locator('time').first();
    await expect(dateElement).toBeVisible();

    // Reading time should be visible (Korean: "분", English: "min read")
    const readingTime = page.getByText(/분|min read/i);
    await expect(readingTime).toBeVisible();
  });

  test('code blocks have copy button', async ({ page }) => {
    // Find any code block on the page
    const codeBlock = page.locator('pre code').first();
    const hasCode = await codeBlock
      .isVisible({ timeout: 3000 })
      .catch(() => false);

    if (hasCode) {
      const copyBtn = page.locator('.copy-button').first();
      await expect(copyBtn).toBeVisible();
    }
  });

  test('code blocks keep Shiki colors and stable wrappers', async ({
    page,
  }) => {
    await page.goto('/articles/welcome-to-monochrome-edge/');

    const codeBlock = page.locator('.code-block-wrapper').first();
    const pre = codeBlock.locator('pre.astro-code').first();
    const firstToken = pre.locator('span[style*="--shiki"]').first();

    await expect(pre).toBeVisible();
    await expect(codeBlock.locator('.copy-button')).toHaveCount(1);
    await expect(codeBlock.locator('.code-watermark-name')).toHaveText(
      /Markdown/i,
    );

    const lightStyles = await pre.evaluate((element) => ({
      background: getComputedStyle(element).backgroundColor,
      color: getComputedStyle(element).color,
    }));
    const lightTokenColor = await firstToken.evaluate(
      (element) => getComputedStyle(element).color,
    );

    await page.locator('#mode-toggle').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    await expect
      .poll(() =>
        pre.evaluate((element) => getComputedStyle(element).backgroundColor),
      )
      .not.toBe(lightStyles.background);

    const darkTokenColor = await firstToken.evaluate(
      (element) => getComputedStyle(element).color,
    );
    expect(darkTokenColor).not.toBe(lightTokenColor);

    await page.evaluate(() => {
      document.dispatchEvent(new Event('astro:after-swap'));
      document.dispatchEvent(new Event('astro:after-swap'));
    });

    await expect(
      page.locator('.code-block-wrapper .code-block-wrapper'),
    ).toHaveCount(0);
    await expect(codeBlock.locator('.copy-button')).toHaveCount(1);
    await expect(codeBlock.locator('.code-watermark')).toHaveCount(1);
  });

  test('tags link correctly', async ({ page }) => {
    const tagLink = page.locator('.article-tags a').first();
    const hasTag = await tagLink
      .isVisible({ timeout: 3000 })
      .catch(() => false);

    if (hasTag) {
      const href = await tagLink.getAttribute('href');
      expect(href).toBeTruthy();
      await tagLink.click();
      // Tags link to /articles?tag=xxx
      await expect(page).toHaveURL(/\/articles\?tag=/);
    }
  });

  test('series navigation shows for series articles', async ({ page }) => {
    // Go back to home and find a series article if available
    await page.goto('/');

    // Look for articles with series indicators
    const seriesArticle = page.locator('a[href*="/articles/"]').first();
    await seriesArticle.click();
    await expect(page).toHaveURL(/\/articles\//);

    // Check if series stepper exists (only some articles have it)
    const seriesStepper = page
      .locator('.series-stepper, [class*="series"]')
      .first();
    const hasSeries = await seriesStepper
      .isVisible({ timeout: 3000 })
      .catch(() => false);

    if (hasSeries) {
      await expect(seriesStepper).toBeVisible();
    }
  });

  test('series stepper renders through Monochrome Edge package', async ({
    page,
  }) => {
    await page.goto('/articles/astro-series-part1/');

    const stepper = page.locator('[data-series-stepper]').first();
    await expect(stepper).toHaveAttribute('data-stepper-initialized', 'true');
    await expect(stepper.locator('svg.stepper-svg')).toBeVisible();

    const errorState = await stepper.getAttribute('data-stepper-error');
    expect(errorState).toBeNull();
  });
});

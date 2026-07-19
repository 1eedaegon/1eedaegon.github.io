import { test, expect } from '@playwright/test';

test.describe('Theme', () => {
  test('uses cold theme as the default variant', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('html')).toHaveAttribute(
      'data-theme-variant',
      'cold',
    );
    await expect(page.locator('#theme-toggle')).toHaveAttribute(
      'data-state',
      'cold',
    );

    const storedTheme = await page.evaluate(() =>
      localStorage.getItem('theme-variant'),
    );
    expect(storedTheme).toBeNull();
  });

  test('legacy blog tokens resolve to Monochrome Edge theme colors', async ({
    page,
  }) => {
    await page.addInitScript(() => {
      localStorage.setItem('theme-variant', 'warm');
      localStorage.setItem('theme', 'light');
    });

    await page.goto('/');

    const tokens = await page.evaluate(() => {
      const probe = document.createElement('div');
      probe.style.position = 'absolute';
      probe.style.pointerEvents = 'none';
      probe.style.visibility = 'hidden';
      document.body.appendChild(probe);

      const resolveColor = (
        cssVar: string,
        property: 'backgroundColor' | 'color' | 'borderColor',
      ) => {
        probe.style.backgroundColor = '';
        probe.style.color = '';
        probe.style.borderColor = '';
        probe.style[property] = `var(${cssVar})`;
        return getComputedStyle(probe)[property];
      };

      const result = {
        bgPrimary: resolveColor('--bg-primary', 'backgroundColor'),
        themeBg: resolveColor('--theme-bg', 'backgroundColor'),
        bgSecondary: resolveColor('--bg-secondary', 'backgroundColor'),
        themeSurface: resolveColor('--theme-surface', 'backgroundColor'),
        textPrimary: resolveColor('--text-primary', 'color'),
        themeTextPrimary: resolveColor('--theme-text-primary', 'color'),
        accentPrimary: resolveColor('--accent-primary', 'color'),
        themeAccent: resolveColor('--theme-accent', 'color'),
        borderSecondary: resolveColor('--border-secondary', 'borderColor'),
        textTertiary: resolveColor('--text-tertiary', 'color'),
      };

      probe.remove();
      return result;
    });

    expect(tokens.bgPrimary).toBe(tokens.themeBg);
    expect(tokens.bgSecondary).toBe(tokens.themeSurface);
    expect(tokens.textPrimary).toBe(tokens.themeTextPrimary);
    expect(tokens.accentPrimary).toBe(tokens.themeAccent);
    expect(tokens.borderSecondary).not.toBe('');
    expect(tokens.textTertiary).not.toBe('');
  });

  test('theme switches update actual colors, not only attributes', async ({
    page,
  }) => {
    await page.addInitScript(() => {
      localStorage.setItem('theme-variant', 'warm');
      localStorage.setItem('theme', 'light');
    });

    await page.goto('/');
    const html = page.locator('html');

    const warmLightBackground = await page
      .locator('body')
      .evaluate((body) => getComputedStyle(body).backgroundColor);

    await page.locator('#theme-toggle').click();
    await expect(html).toHaveAttribute('data-theme-variant', 'cold');

    await expect
      .poll(() =>
        page
          .locator('body')
          .evaluate((body) => getComputedStyle(body).backgroundColor),
      )
      .not.toBe(warmLightBackground);

    const coldLightBackground = await page
      .locator('body')
      .evaluate((body) => getComputedStyle(body).backgroundColor);

    await page.locator('#mode-toggle').click();
    await expect(html).toHaveAttribute('data-theme', 'dark');

    await expect
      .poll(() =>
        page
          .locator('body')
          .evaluate((body) => getComputedStyle(body).backgroundColor),
      )
      .not.toBe(coldLightBackground);
  });

  test('theme controls do not bind duplicate handlers after swaps', async ({
    page,
  }) => {
    await page.addInitScript(() => {
      localStorage.setItem('theme-variant', 'warm');
      localStorage.setItem('theme', 'light');
    });

    await page.goto('/');
    await page.evaluate(() => {
      document.dispatchEvent(new Event('astro:after-swap'));
      document.dispatchEvent(new Event('astro:after-swap'));
    });

    await page.locator('#theme-toggle').click();
    await expect(page.locator('html')).toHaveAttribute(
      'data-theme-variant',
      'cold',
    );

    await page.locator('#mode-toggle').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });

  test('theme toggle switches warm/cold', async ({ page }) => {
    await page.goto('/');
    const toggle = page.locator('#theme-toggle');
    const html = page.locator('html');

    const initialTheme = await html.getAttribute('data-theme-variant');
    await toggle.click();

    const newTheme = await html.getAttribute('data-theme-variant');
    expect(newTheme).not.toBe(initialTheme);
  });

  test('mode toggle switches light/dark', async ({ page }) => {
    await page.goto('/');
    const toggle = page.locator('#mode-toggle');
    const html = page.locator('html');

    const initialMode = await html.getAttribute('data-theme');
    await toggle.click();

    const newMode = await html.getAttribute('data-theme');
    expect(newMode).not.toBe(initialMode);
  });

  test('theme persists after navigation', async ({ page }) => {
    await page.goto('/');
    const themeToggle = page.locator('#theme-toggle');
    const html = page.locator('html');

    // Switch theme
    await themeToggle.click();
    const themeAfterToggle = await html.getAttribute('data-theme-variant');

    // Navigate to About
    await page.locator('.nav-link', { hasText: 'About' }).click();
    await expect(page).toHaveURL(/\/about/);

    // Verify theme persisted
    const themeAfterNav = await page
      .locator('html')
      .getAttribute('data-theme-variant');
    expect(themeAfterNav).toBe(themeAfterToggle);

    // Verify localStorage
    const stored = await page.evaluate(() =>
      localStorage.getItem('theme-variant'),
    );
    expect(stored).toBe(themeAfterToggle);
  });
});

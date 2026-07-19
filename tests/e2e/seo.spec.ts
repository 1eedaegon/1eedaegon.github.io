import { test, expect } from '@playwright/test'

test.describe('SEO baseline', () => {
  test('robots.txt is served and points at the sitemap', async ({ request }) => {
    const response = await request.get('/robots.txt')
    expect(response.status()).toBe(200)
    const body = await response.text()
    expect(body).toContain('User-agent: *')
    expect(body).toContain('Sitemap:')
    expect(body).toContain('sitemap-index.xml')
  })

  test('custom 404 page renders with recovery links', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist')
    expect(response?.status()).toBe(404)
    await expect(page.locator('h1')).toHaveText('Page not found')
    await expect(page.locator('.not-found-actions a').first()).toBeVisible()
  })

  test('default og:image asset exists', async ({ page, request }) => {
    await page.goto('/')
    const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content')
    expect(ogImage).toBeTruthy()
    const url = new URL(ogImage!)
    const asset = await request.get(url.pathname)
    expect(asset.status()).toBe(200)
  })

  test('publisher logo asset exists', async ({ request }) => {
    const asset = await request.get('/logo.png')
    expect(asset.status()).toBe(200)
  })

  test('home page has exactly one h1', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1')).toHaveCount(1)
  })

  test('article page has exactly one h1', async ({ page }) => {
    await page.goto('/articles/astro-tips')
    await expect(page.locator('h1')).toHaveCount(1)
  })
})

test.describe('Draft workflow', () => {
  test('draft article is excluded from the sitemap', async ({ request }) => {
    const response = await request.get('/sitemap-0.xml')
    expect(response.status()).toBe(200)
    const body = await response.text()
    expect(body).not.toContain('draft-example')
  })

  test('draft article builds as an unlisted noindex preview', async ({ page }) => {
    await page.goto('/articles/draft-example')
    await expect(page.locator('h1')).toContainText('Draft Preview Example')
    const robots = await page.locator('meta[name="robots"]').getAttribute('content')
    expect(robots).toContain('noindex')
  })

  test('draft article is not listed on the home page', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('a[href*="draft-example"]')).toHaveCount(0)
  })
})

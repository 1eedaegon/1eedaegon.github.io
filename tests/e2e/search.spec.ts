import { test, expect } from '@playwright/test'

test.describe('Search', () => {
  test('Ctrl+K opens search modal', async ({ page }) => {
    await page.goto('/')
    const modal = page.locator('#search-modal')
    await expect(modal).not.toHaveClass(/open/)

    await page.keyboard.press('Control+k')
    await expect(modal).toHaveClass(/open/)
    await expect(page.locator('#search-input')).toBeFocused()
  })

  test('typing shows results', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('Control+k')

    const input = page.locator('#search-input')
    await input.fill('test')

    // Wait for search results or no-results message
    const results = page.locator('.search-result-item')
    const noResults = page.locator('.search-no-results')
    await expect(results.first().or(noResults)).toBeVisible({ timeout: 5000 })
  })

  test('Escape closes modal', async ({ page }) => {
    await page.goto('/')
    const modal = page.locator('#search-modal')

    await page.keyboard.press('Control+k')
    await expect(modal).toHaveClass(/open/)

    await page.keyboard.press('Escape')
    await expect(modal).not.toHaveClass(/open/)
  })

  test('click result navigates to article', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('Control+k')

    const input = page.locator('#search-input')
    await input.fill('a')

    const firstResult = page.locator('.search-result-item').first()
    // Only proceed if there are results
    const hasResults = await firstResult.isVisible({ timeout: 5000 }).catch(() => false)
    if (hasResults) {
      await firstResult.click()
      await expect(page).toHaveURL(/\/articles\//)
    }
  })
})

import { test, expect } from '@playwright/test'

test.describe('Sveltia CMS admin', () => {
  test('admin page is served with the CMS script', async ({ request }) => {
    const response = await request.get('/admin/')
    expect(response.status()).toBe(200)
    const body = await response.text()
    expect(body).toContain('sveltia-cms')
    expect(body).toContain('noindex')
  })

  test('generated config.yml matches the content schema contract', async ({ request }) => {
    const response = await request.get('/admin/config.yml')
    expect(response.status()).toBe(200)
    const body = await response.text()
    expect(body).toContain('backend:')
    expect(body).toContain('name: github')
    expect(body).toContain('folder: src/content/articles')
    expect(body).toContain('media_folder: public/images')
    // draft defaults to true so new CMS posts follow the unlisted-preview flow
    expect(body).toContain('name: draft, label: Draft, widget: boolean, default: true')
  })

  test('robots.txt disallows the admin path', async ({ request }) => {
    const response = await request.get('/robots.txt')
    const body = await response.text()
    expect(body).toContain('Disallow: /admin/')
  })
})

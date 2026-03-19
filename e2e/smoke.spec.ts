import { test, expect } from '@playwright/test'

const languages = ['es', 'en', 'ca']

for (const lang of languages) {
  test.describe(`Language: ${lang}`, () => {
    test('homepage should load and have SEO metadata', async ({ page }) => {
      await page.goto(`/${lang}/`)

      // Check Title
      await expect(page).toHaveTitle(/PyConES 2026/i)

      // Check for Meta Description (standard for SEO)
      const description = await page.getAttribute('meta[name="description"]', 'content')
      expect(description).toBeTruthy()
      expect(description?.length).toBeGreaterThan(50)

      // Check for viewport meta (responsive)
      const viewport = await page.getAttribute('meta[name="viewport"]', 'content')
      expect(viewport).toContain('width=device-width')
    })

    test('should not have broken internal links', async ({ page }) => {
      await page.goto(`/${lang}/`)
      
      const links = await page.getByRole('link').all()
      for (const link of links) {
        const href = await link.getAttribute('href')
        if (href && href.startsWith('/') && !href.startsWith('//')) {
          const response = await page.request.get(href)
          expect(response.status()).toBe(200)
        }
      }
    })
  })
}

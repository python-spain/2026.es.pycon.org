import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const languages = ['es', 'en', 'ca']
const pages = [
  '', // Home
  'code-of-conduct',
  'location',
  'sponsors'
]

test.describe('Accessibility Audit', () => {
  for (const lang of languages) {
    for (const pagePath of pages) {
      const url = `/${lang}/${pagePath}`
      
      test(`page "${url}" should not have accessibility violations`, async ({ page }) => {
        await page.goto(url)
        
        // Wait for page to be ready
        await page.waitForLoadState('networkidle')
        
        // Run scan
        const accessibilityScanResults = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
          .analyze()
        
        // If it fails, Playwright report will detailed the issues
        expect(accessibilityScanResults.violations).toEqual([])
      })
    }
  }
})

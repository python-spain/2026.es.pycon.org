import { test, expect } from '@playwright/test'

test.describe('Visual Regression', () => {
  test('should match homepage snapshot (Desktop)', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Only run on Desktop for visual consistency')
    
    await page.goto('/es/')
    
    // Wait for dynamic content and animations to settle
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)
    
    await expect(page).toHaveScreenshot('homepage-es-desktop.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.1,
    })
  })

  test('should match navigation snapshot', async ({ page }) => {
    await page.goto('/es/')
    
    // Use the navigation bar ID, as the <header> tag might have 0 height due to fixed positioning
    const nav = page.locator('#main-navigation')
    
    await expect(nav).toBeVisible()
    await expect(nav).toHaveScreenshot('navigation-es.png')
  })
})

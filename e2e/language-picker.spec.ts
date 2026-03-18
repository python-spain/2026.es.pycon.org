import { test, expect } from '@playwright/test'

const languages = ['es', 'en', 'ca']

test.describe('Language Selection', () => {
  test('Desktop: should allow switching languages', async ({ page, isMobile }) => {
    test.skip(isMobile, 'This test is for desktop only')
    
    await page.goto('/es/')
    
    // Switch to English
    const enLink = page.locator('.desktop-menu + div .lang-picker a').filter({ 
      hasText: /^en$/i 
    })
    await expect(enLink).toBeVisible()
    await enLink.click()
    
    // Match /en or /en/
    await expect(page).toHaveURL(/\/en\/?$/)
    
    // Switch to Catalan
    const caLink = page.locator('.desktop-menu + div .lang-picker a').filter({ 
      hasText: /^ca$/i 
    })
    await expect(caLink).toBeVisible()
    await caLink.click()
    await expect(page).toHaveURL(/\/ca\/?$/)
  })

  test('Mobile: should allow switching languages via mobile menu', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'This test is for mobile only')
    
    await page.goto('/es/')
    
    // Open mobile menu
    await page.locator('.responsive-toggle').click()
    
    // Switch to English
    const enLink = page.locator('.mobile-menu .lang-picker-mobile a').filter({ 
      hasText: /^en$/i 
    })
    await expect(enLink).toBeVisible()
    await enLink.click()
    
    await expect(page).toHaveURL(/\/en\/?$/)
    
    // Re-open menu to switch to Catalan
    await page.locator('.responsive-toggle').click()
    const caLink = page.locator('.mobile-menu .lang-picker-mobile a').filter({ 
      hasText: /^ca$/i 
    })
    await expect(caLink).toBeVisible()
    await caLink.click()
    await expect(page).toHaveURL(/\/ca\/?$/)
  })
})

import { test, expect } from '@playwright/test'

test.describe('Mobile Navigation', () => {
  test.use({ viewport: { width: 375, height: 667 } }) // Mobile viewport

  test('should toggle mobile menu when clicking the burger button', async ({ page }) => {
    await page.goto('/es/')
    
    const toggle = page.locator('.responsive-toggle')
    const mobileMenu = page.locator('.mobile-menu')
    
    // Initially hidden
    await expect(mobileMenu).not.toHaveClass(/show/)
    
    // Toggle ON
    await toggle.click()
    await expect(mobileMenu).toHaveClass(/show/)
    
    // Toggle OFF
    await toggle.click()
    await expect(mobileMenu).not.toHaveClass(/show/)
  })

  test('should close mobile menu on Escape key', async ({ page }) => {
    await page.goto('/es/')
    
    const toggle = page.locator('.responsive-toggle')
    const mobileMenu = page.locator('.mobile-menu')
    
    await toggle.click()
    await expect(mobileMenu).toHaveClass(/show/)
    
    await page.keyboard.press('Escape')
    await expect(mobileMenu).not.toHaveClass(/show/)
  })
})

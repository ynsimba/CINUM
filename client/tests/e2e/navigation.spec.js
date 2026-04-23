import { test, expect } from '@playwright/test'

test.describe('Navigation publique', () => {
  test('accueil et accès aux actualités', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await page.getByRole('link', { name: /actualités/i }).first().click()
    await expect(page).toHaveURL(/\/actualites/)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('accès au formulaire de signalement', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: /signaler un abus/i }).first().click()
    await expect(page).toHaveURL(/\/signalement$/)
    await expect(page.getByRole('heading', { level: 1, name: /signalement/i })).toBeVisible()
  })
})

import { test, expect } from '@playwright/test'

const adminEmail = process.env.E2E_ADMIN_EMAIL || ''
const adminPassword = process.env.E2E_ADMIN_PASSWORD || ''

test.describe('Auth admin', () => {
  test('connexion admin et accès tableau de bord', async ({ page }) => {
    test.skip(!adminEmail || !adminPassword, 'E2E_ADMIN_EMAIL / E2E_ADMIN_PASSWORD non définis')

    await page.goto('/connexion')
    await page.getByLabel(/courriel/i).fill(adminEmail)
    await page.getByLabel(/mot de passe/i).fill(adminPassword)
    await page.getByRole('button', { name: /se connecter/i }).click()

    await expect(page).toHaveURL(/\/admin/)
    await expect(page.getByRole('heading', { level: 1, name: /tableau de bord/i })).toBeVisible()
  })
})

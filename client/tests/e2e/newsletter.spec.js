import { test, expect } from '@playwright/test'

test.describe('Newsletter', () => {
  test('soumission du formulaire depuis l’accueil', async ({ page }) => {
    await page.goto('/')
    const email = `e2e+${Date.now()}@example.test`
    await page.getByLabel('Adresse e-mail').fill(email)
    await page.getByRole('button', { name: /s'abonner|envoi/i }).click()
    await expect(page.getByRole('status')).toBeVisible()
  })
})

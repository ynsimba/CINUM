import { test, expect } from '@playwright/test'

test.describe('Suivi signalement', () => {
  test('erreur claire sur identifiants invalides', async ({ page }) => {
    await page.goto('/signalement/suivi')
    await page.getByLabel(/référence du dossier/i).fill('CIN-2099-XXXXXX')
    await page.getByLabel(/code secret/i).fill('invalid-secret-123')
    await page.getByRole('button', { name: /afficher le dossier/i }).click()
    await expect(page.getByRole('alert')).toBeVisible()
  })
})

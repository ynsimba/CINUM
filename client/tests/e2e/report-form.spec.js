import { test, expect } from '@playwright/test'

test.describe('Formulaire signalement', () => {
  test('validation étape identité', async ({ page }) => {
    await page.goto('/signalement')
    await page.getByRole('button', { name: /continuer vers le signalement/i }).click()
    await expect(page.getByRole('alert')).toBeVisible()
  })
})

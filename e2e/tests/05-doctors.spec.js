const { test, expect } = require('@playwright/test');
const { seedLocalAuth } = require('./helpers');

test.describe('Doctors Page', () => {
  test.beforeEach(async ({ page }) => {
    await seedLocalAuth(page);
    await page.goto('http://localhost:5173/doctors');
    await page.waitForLoadState('networkidle');
  });

  test('page loads without crash', async ({ page }) => {
    const body = await page.locator('body').innerText();
    expect(body).not.toMatch(/error boundary|cannot GET|crash/i);
  });

  test('doctor list or empty state renders', async ({ page }) => {
    const hasContent = await page.locator('table, [class*="card"], [class*="doctor"]').first().isVisible().catch(() => false);
    const hasEmpty = await page.locator('[class*="empty"], text=No doctors').isVisible().catch(() => false);
    expect(hasContent || hasEmpty).toBeTruthy();
  });

  test('Add Doctor button visible', async ({ page }) => {
    await expect(page.locator('button', { hasText: /add|new doctor/i }).first()).toBeVisible();
  });

  test('Add Doctor modal opens', async ({ page }) => {
    await page.locator('button', { hasText: /add|new doctor/i }).first().click();
    await expect(page.locator('div.fixed.inset-0').first()).toBeVisible({ timeout: 3000 });
  });

  test('Add Doctor form validates required fields', async ({ page }) => {
    await page.locator('button', { hasText: /add|new doctor/i }).first().click();
    await page.waitForTimeout(300);
    await page.locator('button[type="submit"]').last().click();
    await expect(page.locator('.error-msg, [class*="error"]').first()).toBeVisible({ timeout: 3000 });
  });
});

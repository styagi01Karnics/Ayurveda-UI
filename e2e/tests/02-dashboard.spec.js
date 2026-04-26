const { test, expect } = require('@playwright/test');
const { seedLocalAuth } = require('./helpers');

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await seedLocalAuth(page);
  });

  test('renders all 4 stat cards', async ({ page }) => {
    await expect(page.locator('span, h3').filter({ hasText: 'Total Patients' }).first()).toBeVisible();
    await expect(page.locator('span, h3').filter({ hasText: 'Total Appointments' }).first()).toBeVisible();
    // "Billing" appears in sidebar too — target the card heading specifically
    await expect(page.locator('main span, main h3').filter({ hasText: /^Billing$/ }).first()).toBeVisible();
    await expect(page.locator('h3').filter({ hasText: 'Medicine Stock Availability' }).first()).toBeVisible();
  });

  test('renders Today\'s Schedule card', async ({ page }) => {
    await expect(page.locator("text=Today's Schedule")).toBeVisible();
    await expect(page.locator('text=Ongoing Appointment')).toBeVisible();
    await expect(page.locator('text=Next Appointment')).toBeVisible();
    await expect(page.locator('text=Remaining Today')).toBeVisible();
  });

  test('renders Recent Patient Records table', async ({ page }) => {
    await expect(page.locator('text=Recent Patient Records')).toBeVisible();
    await expect(page.locator('text=Patient ID')).toBeVisible();
    await expect(page.locator('text=Visit Type')).toBeVisible();
  });

  test('period dropdown opens and selects options', async ({ page }) => {
    // Click the first period dropdown (Total Patients card)
    const dropdowns = page.locator('button', { hasText: /Monthly|Quarterly|Yearly/ });
    await dropdowns.first().click();
    await expect(page.locator('text=Quarterly')).toBeVisible();
    await page.locator('text=Quarterly').first().click();
    await expect(page.locator('button', { hasText: 'Quarterly' }).first()).toBeVisible();
  });

  test('period dropdown closes on outside click', async ({ page }) => {
    const dropdown = page.locator('button', { hasText: /Monthly/ }).first();
    await dropdown.click();
    await expect(page.locator('text=Quarterly').first()).toBeVisible();
    await page.click('body');
    await page.waitForTimeout(300);
    const quarterlyDropdownItem = page.locator('[class*="absolute"]').filter({ hasText: 'Quarterly' });
    await expect(quarterlyDropdownItem).not.toBeVisible();
  });

  test('View All in Medicine Stock navigates to medicines', async ({ page }) => {
    await page.locator('button', { hasText: 'View All →' }).first().click();
    await expect(page).toHaveURL(/medicines/);
  });

  test('View Full Schedule navigates to appointments', async ({ page }) => {
    await page.locator('button', { hasText: 'View Full Schedule' }).click();
    await expect(page).toHaveURL(/appointments/);
  });

  test('Recent Records View All navigates to patients', async ({ page }) => {
    await page.locator('button', { hasText: 'View All →' }).last().click();
    await expect(page).toHaveURL(/patients/);
  });

  test('chart renders without crashing', async ({ page }) => {
    const chart = page.locator('.recharts-wrapper, [class*="recharts"]').first();
    await expect(chart).toBeVisible();
  });

  test('promo banner can be dismissed', async ({ page }) => {
    const banner = page.locator('text=Get Up to 50% Off');
    if (await banner.isVisible()) {
      await page.locator('button').filter({ has: page.locator('svg') }).first().click();
      await expect(banner).not.toBeVisible();
    }
  });

  test('breadcrumb shows Dashboard', async ({ page }) => {
    await expect(page.locator('text=Dashboard').first()).toBeVisible();
  });

  test('sidebar nav links are all visible', async ({ page }) => {
    for (const label of ['Patients', 'Doctors', 'Appointments', 'Treatments', 'Medicines', 'Billing']) {
      await expect(page.locator(`text=${label}`).first()).toBeVisible();
    }
  });
});

const { test, expect } = require('@playwright/test');
const { seedLocalAuth } = require('./helpers');

const PAGES = [
  { path: '/dashboard',     label: 'Dashboard' },
  { path: '/patients',      label: 'Patients' },
  { path: '/doctors',       label: 'Doctors' },
  { path: '/appointments',  label: 'Appointments' },
  { path: '/treatments',    label: 'Treatments' },
  { path: '/medicines',     label: 'Medicines' },
  { path: '/billing',       label: 'Billing' },
  { path: '/sales',         label: 'Sales' },
  { path: '/activity-logs', label: 'Activity' },
  { path: '/settings',      label: 'Settings' },
];

test.describe('Sidebar Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await seedLocalAuth(page);
  });

  for (const { path, label } of PAGES) {
    test(`navigates to ${label} page without crashing`, async ({ page }) => {
      await page.goto(`http://localhost:5173${path}`);
      await page.waitForLoadState('networkidle');
      // Should not show error page
      const bodyText = await page.locator('body').innerText();
      expect(bodyText).not.toMatch(/cannot GET|404|not found|error boundary/i);
    });
  }

  test('sidebar active link highlights current page', async ({ page }) => {
    await page.goto('http://localhost:5173/patients');
    await page.waitForLoadState('networkidle');
    const activeLink = page.locator('a[class*="active"], .sidebar-link-active');
    await expect(activeLink).toBeVisible();
  });

  test('breadcrumb updates on navigation', async ({ page }) => {
    await page.goto('http://localhost:5173/patients');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('text=Patients').first()).toBeVisible();
  });

  test('Dashboard breadcrumb link navigates home', async ({ page }) => {
    await page.goto('http://localhost:5173/patients');
    await page.waitForLoadState('networkidle');
    await page.locator('span', { hasText: 'Dashboard' }).first().click();
    await expect(page).toHaveURL(/dashboard/);
  });

  test('unknown route redirects to dashboard', async ({ page }) => {
    await page.goto('http://localhost:5173/this-does-not-exist');
    await page.waitForTimeout(1000);
    expect(page.url()).toMatch(/dashboard/);
  });
});

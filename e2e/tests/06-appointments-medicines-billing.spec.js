const { test, expect } = require('@playwright/test');
const { seedLocalAuth } = require('./helpers');

/* ── Appointments ── */
test.describe('Appointments Page', () => {
  test.beforeEach(async ({ page }) => {
    await seedLocalAuth(page);
    await page.goto('http://localhost:5173/appointments');
    await page.waitForLoadState('networkidle');
  });

  test('loads without crash', async ({ page }) => {
    const body = await page.locator('body').innerText();
    expect(body).not.toMatch(/error boundary|cannot GET/i);
  });

  test('has Add Appointment button', async ({ page }) => {
    await expect(page.locator('button', { hasText: /add|new appointment|book/i }).first()).toBeVisible();
  });

  test('appointment list or empty state visible', async ({ page }) => {
    const hasContent = await page.locator('table tbody tr, [class*="appointment"]').first().isVisible().catch(() => false);
    const hasEmpty = await page.locator('[class*="empty"]').isVisible().catch(() => false);
    expect(hasContent || hasEmpty).toBeTruthy();
  });
});

/* ── Medicines ── */
test.describe('Medicines Page', () => {
  test.beforeEach(async ({ page }) => {
    await seedLocalAuth(page);
    await page.goto('http://localhost:5173/medicines');
    await page.waitForLoadState('networkidle');
  });

  test('loads without crash', async ({ page }) => {
    const body = await page.locator('body').innerText();
    expect(body).not.toMatch(/error boundary|cannot GET/i);
  });

  test('has Add Medicine button', async ({ page }) => {
    await expect(page.locator('button', { hasText: /add|new medicine/i }).first()).toBeVisible();
  });

  test('medicine table or cards render', async ({ page }) => {
    const hasContent = await page.locator('table, [class*="medicine"], [class*="card"]').first().isVisible().catch(() => false);
    expect(hasContent).toBeTruthy();
  });

  test('search input is present', async ({ page }) => {
    await expect(page.locator('input[type="search"], input[placeholder*="search" i]').first()).toBeVisible();
  });
});

/* ── Billing ── */
test.describe('Billing Page', () => {
  test.beforeEach(async ({ page }) => {
    await seedLocalAuth(page);
    await page.goto('http://localhost:5173/billing');
    await page.waitForLoadState('networkidle');
  });

  test('loads without crash', async ({ page }) => {
    const body = await page.locator('body').innerText();
    expect(body).not.toMatch(/error boundary|cannot GET/i);
  });

  test('billing content renders', async ({ page }) => {
    const hasContent = await page.locator('table, [class*="bill"], [class*="invoice"]').first().isVisible().catch(() => false);
    const hasEmpty = await page.locator('[class*="empty"]').isVisible().catch(() => false);
    expect(hasContent || hasEmpty).toBeTruthy();
  });
});

/* ── Treatments ── */
test.describe('Treatments Page', () => {
  test.beforeEach(async ({ page }) => {
    await seedLocalAuth(page);
    await page.goto('http://localhost:5173/treatments');
    await page.waitForLoadState('networkidle');
  });

  test('loads without crash', async ({ page }) => {
    const body = await page.locator('body').innerText();
    expect(body).not.toMatch(/error boundary|cannot GET/i);
  });
});

/* ── Sales ── */
test.describe('Sales Page', () => {
  test.beforeEach(async ({ page }) => {
    await seedLocalAuth(page);
    await page.goto('http://localhost:5173/sales');
    await page.waitForLoadState('networkidle');
  });

  test('loads without crash', async ({ page }) => {
    const body = await page.locator('body').innerText();
    expect(body).not.toMatch(/error boundary|cannot GET/i);
  });
});

/* ── Activity Logs ── */
test.describe('Activity Logs Page', () => {
  test.beforeEach(async ({ page }) => {
    await seedLocalAuth(page);
    await page.goto('http://localhost:5173/activity-logs');
    await page.waitForLoadState('networkidle');
  });

  test('loads without crash', async ({ page }) => {
    const body = await page.locator('body').innerText();
    expect(body).not.toMatch(/error boundary|cannot GET/i);
  });
});

/* ── Settings ── */
test.describe('Settings Page', () => {
  test.beforeEach(async ({ page }) => {
    await seedLocalAuth(page);
    await page.goto('http://localhost:5173/settings');
    await page.waitForLoadState('networkidle');
  });

  test('loads without crash', async ({ page }) => {
    const body = await page.locator('body').innerText();
    expect(body).not.toMatch(/error boundary|cannot GET/i);
  });
});

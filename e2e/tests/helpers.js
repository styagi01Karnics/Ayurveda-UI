// Shared helpers — login sets localStorage so every protected test starts authenticated.

const ADMIN = { email: 'admin@ganesha.com', password: 'admin123' };
const BASE = 'http://localhost:5173';

async function loginAs(page, creds = ADMIN) {
  await page.goto(`${BASE}/login`);
  await page.fill('input[name="email"]', creds.email);
  await page.fill('input[name="password"]', creds.password);
  await page.click('button[type="submit"]');
  // Wait for redirect to dashboard (API may fail → mock data, still renders)
  await page.waitForURL(/dashboard/, { timeout: 10000 });
}

async function seedLocalAuth(page) {
  // Faster: set localStorage directly so we skip the login round-trip.
  await page.goto(`${BASE}/login`);
  await page.evaluate(() => {
    const user = { id: 1, email: 'admin@ganesha.com', fullName: 'Rahul Sharma', role: 'SUPER_ADMIN', active: true };
    localStorage.setItem('token', 'mock-token-for-e2e');
    localStorage.setItem('user', JSON.stringify(user));
  });
  await page.goto(`${BASE}/dashboard`);
  await page.waitForLoadState('networkidle');
}

module.exports = { loginAs, seedLocalAuth, ADMIN, BASE };

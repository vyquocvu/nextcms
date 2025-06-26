import { test, expect } from '@playwright/test';

test('admin workflow', async ({ page }) => {
  // Login
  await page.goto('/dashboard/login');
  await page.fill('input[type="text"]', 'admin');
  await page.fill('input[type="password"]', 'password');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByText('Dashboard Home')).toBeVisible();

  // Create collection type
  await page.goto('/dashboard/collections');
  await page.fill('input[placeholder="Name"]', 'Books');
  await page.fill('input[placeholder="Slug"]', 'books');
  await page.fill('input[placeholder="Field name"]', 'title');
  await page.getByRole('button', { name: 'Add Field' }).click();
  const fields = page.locator('input[placeholder="Field name"]');
  await fields.nth(1).fill('author');
  await page.getByRole('button', { name: 'Add Collection' }).click();
  await expect(page.locator('a', { hasText: 'Books' })).toBeVisible();

  // Create content entry
  await page.click('a[href="/dashboard/collections/books"]');
  await page.fill('input[placeholder="title"]', 'My Book');
  await page.fill('input[placeholder="author"]', 'Alice');
  await page.getByRole('button', { name: 'Add Entry' }).click();
  await expect(page.locator('li').filter({ hasText: 'My Book' })).toBeVisible();

  // Logout by clearing storage
  await page.evaluate(() => localStorage.removeItem('isLoggedIn'));
  await page.goto('/dashboard/login');
  await expect(page).toHaveURL('/dashboard/login');
});

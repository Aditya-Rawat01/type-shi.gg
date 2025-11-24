import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.waitForTimeout(5000);
  await expect(page.getByText('punctuationnumbers|timewords|')).toBeVisible();
  await expect(page.getByText('Test Settingspunctuationnumbers|timewords|')).toBeVisible();
  await expect(page.getByRole('paragraph').filter({ hasText: 'type-shi.gg' })).toBeVisible();
  await page.waitForTimeout(10000);
  await expect(page.getByText('Click here or Press any key')).toBeVisible();
  await page.getByRole('button', { name: 'Themes' }).click();
  await expect(page.locator('div').filter({ hasText: /^jungle$/ })).toBeVisible();
  await expect(page.locator('div').filter({ hasText: /^caramel$/ })).toBeVisible();
  await expect(page.locator('div').filter({ hasText: /^arctic$/ })).toBeVisible();
});
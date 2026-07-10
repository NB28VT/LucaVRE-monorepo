import { test, expect } from '@playwright/test';

test('Verify frontend loads successfully and displays the Start Session page', async ({
  page,
}) => {
  const response = await page.goto('http://localhost:5173');

  expect(response?.ok()).toBe(true);
  await expect(page.getByRole('heading', { name: 'Setup Assistant' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'New Session' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Load Session' })).toBeVisible();
});

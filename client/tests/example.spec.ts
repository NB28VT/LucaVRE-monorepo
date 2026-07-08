import { test, expect } from '@playwright/test';

test('Verify frontend loads successfully and displays baseline text', async ({ page }) => {
  const response = await page.goto('http://localhost:5173');

  expect(response?.ok()).toBe(true);
  await expect(page.getByText('LucaVRE Client Baseline')).toBeVisible();
});

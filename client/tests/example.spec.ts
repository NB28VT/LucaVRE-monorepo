import { test, expect } from '@playwright/test';

test('Verify frontend can fetch hello world from Rails API', async ({ page }) => {
  // 1. Tell Playwright to intercept and listen to network requests
  const apiRequestPromise = page.waitForResponse(response => 
    response.url().includes('/welcome/hello') && response.status() === 200
  );

  // 2. Open up your local React application page
  await page.goto('http://localhost:5173');

  // 3. Wait for the API network call to finish and inspect the payload text
  const response = await apiRequestPromise;
  const json = await response.json();
  
  // 4. Assert the backend response structural payload matches perfectly
  expect(json.message).toBe('Hello, world!');
});

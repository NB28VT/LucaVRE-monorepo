import { test, expect } from '@playwright/test';

test.describe('Page navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('shows the Start Session page on initial load', async ({ page }) => {
    await expect(page.getByRole('region', { name: 'Start Session' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Setup Assistant' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'New Session' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Load Session' })).toBeVisible();
  });

  test('navigates to New Session and back to Start Session', async ({ page }) => {
    await page.getByRole('button', { name: 'New Session' }).click();

    await expect(page.getByRole('region', { name: 'New Session' })).toBeVisible();
    await expect(page.getByRole('region', { name: 'Start Session' })).not.toBeVisible();

    await page.getByRole('button', { name: 'Back' }).click();

    await expect(page.getByRole('region', { name: 'Start Session' })).toBeVisible();
    await expect(page.getByRole('region', { name: 'New Session' })).not.toBeVisible();
  });

  test('navigates to Load Session and back to Start Session', async ({ page }) => {
    await page.getByRole('button', { name: 'Load Session' }).click();

    await expect(page.getByRole('region', { name: 'Load Session' })).toBeVisible();
    await expect(page.getByRole('region', { name: 'Start Session' })).not.toBeVisible();

    await page.getByRole('button', { name: 'Back' }).click();

    await expect(page.getByRole('region', { name: 'Start Session' })).toBeVisible();
    await expect(page.getByRole('region', { name: 'Load Session' })).not.toBeVisible();
  });

  test('shows a Next button (not Submit) on the New Session page', async ({ page }) => {
    await page.getByRole('button', { name: 'New Session' }).click();
    await expect(page.getByRole('region', { name: 'New Session' })).toBeVisible();

    await expect(page.getByRole('button', { name: 'Next' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Submit', exact: true })).not.toBeVisible();
  });

  test('does not show the car balance dropdown on the New Session page', async ({ page }) => {
    await page.getByRole('button', { name: 'New Session' }).click();
    await expect(page.getByRole('region', { name: 'New Session' })).toBeVisible();

    await expect(page.getByLabel('Reported Symptom')).not.toBeVisible();
  });

  test('navigates from New Session to Car Balance via Next', async ({ page }) => {
    await page.getByRole('button', { name: 'New Session' }).click();
    await page.getByRole('button', { name: 'Next' }).click();

    await expect(page.getByRole('region', { name: 'Car Balance' })).toBeVisible();
    await expect(page.getByRole('region', { name: 'New Session' })).not.toBeVisible();
    await expect(page.getByLabel('Reported Symptom')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
  });

  test('navigates from Car Balance back to New Session', async ({ page }) => {
    await page.getByRole('button', { name: 'New Session' }).click();
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page.getByRole('region', { name: 'Car Balance' })).toBeVisible();

    await page.getByRole('button', { name: 'Back' }).click();

    await expect(page.getByRole('region', { name: 'New Session' })).toBeVisible();
    await expect(page.getByRole('region', { name: 'Car Balance' })).not.toBeVisible();
  });

  test('navigates from Car Balance to Suggested Setup Changes via Submit', async ({ page }) => {
    await page.getByRole('button', { name: 'New Session' }).click();
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('button', { name: 'Submit' }).click();

    await expect(page.getByRole('region', { name: 'Suggested Setup Changes' })).toBeVisible();
    await expect(page.getByRole('region', { name: 'Car Balance' })).not.toBeVisible();
  });

  test('navigates from Suggested Setup Changes back to Car Balance', async ({ page }) => {
    await page.getByRole('button', { name: 'New Session' }).click();
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByRole('region', { name: 'Suggested Setup Changes' })).toBeVisible();

    await page.getByRole('button', { name: 'Back' }).click();

    await expect(page.getByRole('region', { name: 'Car Balance' })).toBeVisible();
    await expect(page.getByRole('region', { name: 'Suggested Setup Changes' })).not.toBeVisible();
  });

  test('preserves selected car, track, and car balance across the full round trip', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'New Session' }).click();

    await page.getByLabel('Car').selectOption({ label: 'Porsche 911 GT3 R' });
    await page.getByLabel('Track').selectOption({ label: 'Spa-Francorchamps' });

    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page.getByRole('region', { name: 'Car Balance' })).toBeVisible();

    await page.getByLabel('Reported Symptom').selectOption({ label: 'Oversteer' });

    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByRole('region', { name: 'Suggested Setup Changes' })).toBeVisible();

    await page.getByRole('button', { name: 'Back' }).click();
    await expect(page.getByRole('region', { name: 'Car Balance' })).toBeVisible();
    await expect(page.getByLabel('Reported Symptom')).toHaveValue('oversteer');

    await page.getByRole('button', { name: 'Back' }).click();
    await expect(page.getByRole('region', { name: 'New Session' })).toBeVisible();
    await expect(page.getByLabel('Car')).toHaveValue('porsche-911-gt3');
    await expect(page.getByLabel('Track')).toHaveValue('spa-francorchamps');
  });

  test('shows the session header with the selected car and track on the Car Balance page', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'New Session' }).click();

    await page.getByLabel('Car').selectOption({ label: 'Porsche 911 GT3 R' });
    await page.getByLabel('Track').selectOption({ label: 'Spa-Francorchamps' });

    await page.getByRole('button', { name: 'Next' }).click();

    const sessionHeader = page.getByRole('group', { name: 'Active session' });
    await expect(sessionHeader).toBeVisible();
    await expect(sessionHeader).toContainText('Session Active');
    await expect(sessionHeader).toContainText('Porsche 911 GT3 R');
    await expect(sessionHeader).toContainText('Spa-Francorchamps');
  });

  test('shows the session header with the selected car and track on the Suggested Setup Changes page', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'New Session' }).click();

    await page.getByLabel('Car').selectOption({ label: 'Ferrari 296 GT3' });
    await page.getByLabel('Track').selectOption({ label: 'Circuit de la Sarthe (Le Mans)' });

    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByLabel('Reported Symptom').selectOption({ label: 'Understeer' });
    await page.getByRole('button', { name: 'Submit' }).click();

    const sessionHeader = page.getByRole('group', { name: 'Active session' });
    await expect(sessionHeader).toBeVisible();
    await expect(sessionHeader).toContainText('Session Active');
    await expect(sessionHeader).toContainText('Ferrari 296 GT3');
    await expect(sessionHeader).toContainText('Circuit de la Sarthe (Le Mans)');
  });

  test('navigates from Suggested Setup Changes all the way back to Start Session via Work on Another Session', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'New Session' }).click();
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByRole('region', { name: 'Suggested Setup Changes' })).toBeVisible();

    await page.getByRole('button', { name: 'Work on Another Session' }).click();

    await expect(page.getByRole('region', { name: 'Start Session' })).toBeVisible();
    await expect(page.getByRole('region', { name: 'Suggested Setup Changes' })).not.toBeVisible();
  });
});

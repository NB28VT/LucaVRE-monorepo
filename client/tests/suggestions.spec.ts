import { test, expect } from '@playwright/test';
import { mockCreateWorkingSessionSuccess } from './helpers/workingSessionApi';
import { mockVehicleOptions } from './helpers/vehicleOptionsApi';

test.describe('Setup diagnosis submission', () => {
  test.beforeEach(async ({ page }) => {
    await mockVehicleOptions(page);
    await mockCreateWorkingSessionSuccess(page);

    await page.goto('http://localhost:5173');
    await page.getByRole('button', { name: 'New Session' }).click();
    await expect(page.getByRole('region', { name: 'New Session' })).toBeVisible();
    await page.getByLabel('Car').selectOption({ label: 'Porsche 911 GT3 R' });
    await page.getByLabel('Track').selectOption({ label: 'Spa-Francorchamps' });
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByRole('region', { name: 'Car Balance' })).toBeVisible();
  });

  test('shows a Submit button on the Car Balance page', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
  });

  test('navigates to the Suggested Setup Changes page when Submit is clicked', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'Submit' }).click();

    await expect(page.getByRole('region', { name: 'Suggested Setup Changes' })).toBeVisible();
    await expect(page.getByRole('region', { name: 'Car Balance' })).not.toBeVisible();
  });

  test('lists each suggested setup change as a bullet point', async ({ page }) => {
    await page.getByRole('button', { name: 'Submit' }).click();

    const suggestionsList = page.getByRole('list');
    await expect(suggestionsList.getByRole('listitem')).toHaveCount(3);

    await expect(
      page.getByText('Stiffen the front anti-roll bar by one click to sharpen turn-in response'),
    ).toBeVisible();
    await expect(
      page.getByText('Lower rear tire pressures by 1.5 psi to increase mid-corner contact patch'),
    ).toBeVisible();
    await expect(
      page.getByText('Increase brake bias rearward by 2% to reduce entry understeer'),
    ).toBeVisible();
  });

  test('returns to the Car Balance page when Back is clicked from the suggestions view', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByRole('region', { name: 'Suggested Setup Changes' })).toBeVisible();

    await page.getByRole('button', { name: 'Back' }).click();

    await expect(page.getByRole('region', { name: 'Car Balance' })).toBeVisible();
    await expect(page.getByRole('region', { name: 'Suggested Setup Changes' })).not.toBeVisible();
  });

  test('preserves selected car, track, and reported symptom after returning from the suggestions view', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'Back' }).click();
    await expect(page.getByRole('region', { name: 'New Session' })).toBeVisible();

    await page.getByLabel('Car').selectOption({ label: 'Porsche 911 GT3 R' });
    await page.getByLabel('Track').selectOption({ label: 'Spa-Francorchamps' });

    await page.getByRole('button', { name: 'Submit' }).click();
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

  test('shows a Work on Another Session button on the suggestions view', async ({ page }) => {
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByRole('region', { name: 'Suggested Setup Changes' })).toBeVisible();

    await expect(
      page.getByRole('button', { name: 'Work on Another Session' }),
    ).toBeVisible();
  });

  test('returns all the way to the Start Session page when Work on Another Session is clicked', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByRole('region', { name: 'Suggested Setup Changes' })).toBeVisible();

    await page.getByRole('button', { name: 'Work on Another Session' }).click();

    await expect(page.getByRole('region', { name: 'Start Session' })).toBeVisible();
    await expect(page.getByRole('region', { name: 'Suggested Setup Changes' })).not.toBeVisible();
  });

  test('clears the selected car, track, and reported symptom after starting another session', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'Back' }).click();
    await expect(page.getByRole('region', { name: 'New Session' })).toBeVisible();

    await page.getByLabel('Car').selectOption({ label: 'Porsche 911 GT3 R' });
    await page.getByLabel('Track').selectOption({ label: 'Spa-Francorchamps' });

    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByRole('region', { name: 'Car Balance' })).toBeVisible();
    await page.getByLabel('Reported Symptom').selectOption({ label: 'Oversteer' });

    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByRole('region', { name: 'Suggested Setup Changes' })).toBeVisible();

    await page.getByRole('button', { name: 'Work on Another Session' }).click();
    await expect(page.getByRole('region', { name: 'Start Session' })).toBeVisible();

    await page.getByRole('button', { name: 'New Session' }).click();
    await expect(page.getByRole('region', { name: 'New Session' })).toBeVisible();
    await expect(page.getByLabel('Car')).toHaveValue('');
    await expect(page.getByLabel('Track')).toHaveValue('');

    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByLabel('Reported Symptom')).toHaveValue('');
  });
});

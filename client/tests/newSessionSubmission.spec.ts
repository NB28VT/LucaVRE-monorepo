import { test, expect } from '@playwright/test';
import {
  mockCreateWorkingSessionSuccess,
  mockCreateWorkingSessionValidationError,
} from './helpers/workingSessionApi';
import { mockVehicleOptions } from './helpers/vehicleOptionsApi';

test.describe('New Session submission', () => {
  test.beforeEach(async ({ page }) => {
    await mockVehicleOptions(page);

    await page.goto('http://localhost:5173');
    await page.getByRole('button', { name: 'New Session' }).click();
    await expect(page.getByRole('region', { name: 'New Session' })).toBeVisible();
  });

  test('navigates to Car Balance when submitting with a car and track selected succeeds', async ({
    page,
  }) => {
    await mockCreateWorkingSessionSuccess(page);

    await page.getByLabel('Car').selectOption({ label: 'Porsche 911 GT3 R' });
    await page.getByLabel('Track').selectOption({ label: 'Spa-Francorchamps' });

    await page.getByRole('button', { name: 'Submit' }).click();

    await expect(page.getByRole('region', { name: 'Car Balance' })).toBeVisible();
    await expect(page.getByRole('region', { name: 'New Session' })).not.toBeVisible();
  });

  test('shows errors for both car and track when neither is selected', async ({ page }) => {
    await mockCreateWorkingSessionValidationError(page, {
      car_id: ["can't be blank"],
      track_id: ["can't be blank"],
    });

    await page.getByRole('button', { name: 'Submit' }).click();

    await expect(page.getByText('Please select a car.')).toBeVisible();
    await expect(page.getByText('Please select a track.')).toBeVisible();
    await expect(page.getByRole('region', { name: 'New Session' })).toBeVisible();
  });

  test('shows only a car error when only the track is selected', async ({ page }) => {
    await mockCreateWorkingSessionValidationError(page, {
      car_id: ["can't be blank"],
    });

    await page.getByLabel('Track').selectOption({ label: 'Spa-Francorchamps' });
    await page.getByRole('button', { name: 'Submit' }).click();

    await expect(page.getByText('Please select a car.')).toBeVisible();
    await expect(page.getByText('Please select a track.')).not.toBeVisible();
  });

  test('shows only a track error when only the car is selected', async ({ page }) => {
    await mockCreateWorkingSessionValidationError(page, {
      track_id: ["can't be blank"],
    });

    await page.getByLabel('Car').selectOption({ label: 'Porsche 911 GT3 R' });
    await page.getByRole('button', { name: 'Submit' }).click();

    await expect(page.getByText('Please select a track.')).toBeVisible();
    await expect(page.getByText('Please select a car.')).not.toBeVisible();
  });

  test('clears the car error when the car selection changes, leaving the track error in place', async ({
    page,
  }) => {
    await mockCreateWorkingSessionValidationError(page, {
      car_id: ["can't be blank"],
      track_id: ["can't be blank"],
    });

    await page.getByRole('button', { name: 'Submit' }).click();

    await expect(page.getByText('Please select a car.')).toBeVisible();
    await expect(page.getByText('Please select a track.')).toBeVisible();

    await page.getByLabel('Car').selectOption({ label: 'Porsche 911 GT3 R' });

    await expect(page.getByText('Please select a car.')).not.toBeVisible();
    await expect(page.getByText('Please select a track.')).toBeVisible();
  });

  test('clears the track error when the track selection changes, leaving the car error in place', async ({
    page,
  }) => {
    await mockCreateWorkingSessionValidationError(page, {
      car_id: ["can't be blank"],
      track_id: ["can't be blank"],
    });

    await page.getByRole('button', { name: 'Submit' }).click();

    await expect(page.getByText('Please select a car.')).toBeVisible();
    await expect(page.getByText('Please select a track.')).toBeVisible();

    await page.getByLabel('Track').selectOption({ label: 'Spa-Francorchamps' });

    await expect(page.getByText('Please select a track.')).not.toBeVisible();
    await expect(page.getByText('Please select a car.')).toBeVisible();
  });

  test('disables the Submit button while the request is in flight', async ({ page }) => {
    await page.route('**/api/v1/working_sessions', async (route) => {
      if (route.request().method() !== 'POST') {
        await route.continue();
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, 500));
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 1,
          carId: 'porsche-911-gt3',
          trackId: 'spa-francorchamps',
          createdAt: new Date().toISOString(),
          car: { id: 'porsche-911-gt3', name: 'Porsche 911 GT3 R' },
          track: { id: 'spa-francorchamps', name: 'Spa-Francorchamps' },
        }),
      });
    });

    await page.getByLabel('Car').selectOption({ label: 'Porsche 911 GT3 R' });
    await page.getByLabel('Track').selectOption({ label: 'Spa-Francorchamps' });

    const submitButton = page.getByRole('button', { name: 'Submit' });
    await submitButton.click();

    await expect(submitButton).toBeDisabled();
    await expect(page.getByRole('region', { name: 'Car Balance' })).toBeVisible();
  });
});

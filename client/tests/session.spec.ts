import { test, expect } from '@playwright/test';
import { mockCreateWorkingSessionSuccess } from './helpers/workingSessionApi';
import { mockVehicleOptions } from './helpers/vehicleOptionsApi';

test.describe('New Session car/track selection', () => {
  test.beforeEach(async ({ page }) => {
    await mockVehicleOptions(page);

    await page.goto('http://localhost:5173');
    await page.getByRole('button', { name: 'New Session' }).click();
    await expect(page.getByRole('region', { name: 'New Session' })).toBeVisible();
  });

  test('shows placeholder options in the Car and Track dropdowns by default', async ({
    page,
  }) => {
    const carSelect = page.getByLabel('Car');
    const trackSelect = page.getByLabel('Track');

    await expect(carSelect).toBeVisible();
    await expect(trackSelect).toBeVisible();

    await expect(carSelect).toHaveValue('');
    await expect(trackSelect).toHaveValue('');

    await expect(carSelect.locator('option', { hasText: 'Select a GT3 car…' })).toHaveCount(1);
    await expect(trackSelect.locator('option', { hasText: 'Select a track…' })).toHaveCount(1);
  });

  test('lists every mock car and track as selectable options', async ({ page }) => {
    const carSelect = page.getByLabel('Car');
    const trackSelect = page.getByLabel('Track');

    await expect(carSelect.locator('option', { hasText: 'Porsche 911 GT3 R' })).toHaveCount(1);
    await expect(carSelect.locator('option', { hasText: 'Ferrari 296 GT3' })).toHaveCount(1);

    await expect(
      trackSelect.locator('option', { hasText: 'Circuit de la Sarthe (Le Mans)' }),
    ).toHaveCount(1);
    await expect(trackSelect.locator('option', { hasText: 'Spa-Francorchamps' })).toHaveCount(1);
  });

  test('saves the selected car in local state', async ({ page }) => {
    const carSelect = page.getByLabel('Car');

    await carSelect.selectOption({ label: 'Porsche 911 GT3 R' });

    await expect(carSelect).toHaveValue('porsche-911-gt3');
  });

  test('updates the selected car when the selection changes', async ({ page }) => {
    const carSelect = page.getByLabel('Car');

    await carSelect.selectOption({ label: 'Porsche 911 GT3 R' });
    await expect(carSelect).toHaveValue('porsche-911-gt3');

    await carSelect.selectOption({ label: 'Ferrari 296 GT3' });

    await expect(carSelect).toHaveValue('ferrari-296-gt3');
  });

  test('saves the selected track in local state', async ({ page }) => {
    const trackSelect = page.getByLabel('Track');

    await trackSelect.selectOption({ label: 'Spa-Francorchamps' });

    await expect(trackSelect).toHaveValue('spa-francorchamps');
  });

  test('retains selected car and track in local state after navigating away and back', async ({
    page,
  }) => {
    const carSelect = page.getByLabel('Car');
    const trackSelect = page.getByLabel('Track');

    await carSelect.selectOption({ label: 'Ferrari 296 GT3' });
    await trackSelect.selectOption({ label: 'Circuit de la Sarthe (Le Mans)' });

    await page.getByRole('button', { name: 'Back' }).click();
    await expect(page.getByRole('region', { name: 'Start Session' })).toBeVisible();

    await page.getByRole('button', { name: 'New Session' }).click();
    await expect(page.getByRole('region', { name: 'New Session' })).toBeVisible();

    await expect(page.getByLabel('Car')).toHaveValue('ferrari-296-gt3');
    await expect(page.getByLabel('Track')).toHaveValue('le-mans');
  });
});

test.describe('Car Balance selection', () => {
  test.beforeEach(async ({ page }) => {
    await mockVehicleOptions(page);
    await mockCreateWorkingSessionSuccess(page);

    await page.goto('http://localhost:5173');
    await page.getByRole('button', { name: 'New Session' }).click();
    await page.getByLabel('Car').selectOption({ label: 'Porsche 911 GT3 R' });
    await page.getByLabel('Track').selectOption({ label: 'Spa-Francorchamps' });
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByRole('region', { name: 'Car Balance' })).toBeVisible();
  });

  test('shows a placeholder option in the Reported Symptom dropdown by default', async ({
    page,
  }) => {
    const symptomSelect = page.getByLabel('Reported Symptom');

    await expect(symptomSelect).toBeVisible();
    await expect(symptomSelect).toHaveValue('');
    await expect(symptomSelect.locator('option', { hasText: 'Select a symptom…' })).toHaveCount(
      1,
    );
  });

  test('lists every mock reported symptom as a selectable option', async ({ page }) => {
    const symptomSelect = page.getByLabel('Reported Symptom');

    await expect(symptomSelect.locator('option', { hasText: 'Oversteer' })).toHaveCount(1);
    await expect(symptomSelect.locator('option', { hasText: 'Understeer' })).toHaveCount(1);
    await expect(symptomSelect.locator('option', { hasText: 'Balanced' })).toHaveCount(1);

    await expect(symptomSelect.locator('option')).toHaveCount(4);
  });

  test('saves the selected reported symptom in local state', async ({ page }) => {
    const symptomSelect = page.getByLabel('Reported Symptom');

    await symptomSelect.selectOption({ label: 'Oversteer' });

    await expect(symptomSelect).toHaveValue('oversteer');
  });

  test('updates the selected reported symptom when the selection changes', async ({ page }) => {
    const symptomSelect = page.getByLabel('Reported Symptom');

    await symptomSelect.selectOption({ label: 'Understeer' });
    await expect(symptomSelect).toHaveValue('understeer');

    await symptomSelect.selectOption({ label: 'Balanced' });
    await expect(symptomSelect).toHaveValue('balanced');
  });

  test('retains the selected reported symptom in local state after navigating away and back', async ({
    page,
  }) => {
    const symptomSelect = page.getByLabel('Reported Symptom');

    await symptomSelect.selectOption({ label: 'Oversteer' });

    await page.getByRole('button', { name: 'Back' }).click();
    await expect(page.getByRole('region', { name: 'New Session' })).toBeVisible();

    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByRole('region', { name: 'Car Balance' })).toBeVisible();

    await expect(page.getByLabel('Reported Symptom')).toHaveValue('oversteer');
  });
});

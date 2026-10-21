import { test, expect } from '@playwright/test';
import { mockCreateWorkingSessionSuccess } from './helpers/workingSessionApi';
import { mockVehicleOptions } from './helpers/vehicleOptionsApi';
import {
  mockHandlingDeficitsList,
  mockCreateHandlingDeficitSuccess,
  mockDeleteHandlingDeficitSuccess,
} from './helpers/handlingDeficitsApi';
import {
  addHandlingCharacteristic,
  deleteHandlingCharacteristic,
} from './helpers/handlingCharacteristics';

test.describe('Setup diagnosis submission', () => {
  test.beforeEach(async ({ page }) => {
    await mockVehicleOptions(page);
    await mockCreateWorkingSessionSuccess(page);
    await mockHandlingDeficitsList(page, 1, []);
    await mockCreateHandlingDeficitSuccess(page, 1);

    await page.goto('http://localhost:5173');
    await page.getByRole('button', { name: 'New Session' }).click();
    await expect(page.getByRole('region', { name: 'New Session' })).toBeVisible();
    await page.getByLabel('Car').selectOption({ label: 'Porsche 911 GT3 R' });
    await page.getByLabel('Track').selectOption({ label: 'Spa-Francorchamps' });
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByRole('region', { name: 'Current Session' })).toBeVisible();
  });

  test('shows a Diagnose button on the Current Session page', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Diagnose' })).toBeVisible();
  });

  test('disables Diagnose when the current session has no handling characteristics', async ({
    page,
  }) => {
    const diagnose = page.getByRole('button', { name: 'Diagnose' });
    await expect(diagnose).toBeVisible();
    await expect(diagnose).toBeDisabled();
  });

  test('enables Diagnose after a handling characteristic is added', async ({ page }) => {
    await addHandlingCharacteristic(page, 'Oversteer');

    await expect(page.getByRole('button', { name: 'Diagnose' })).toBeEnabled();
  });

  test('disables Diagnose again after the last handling characteristic is deleted', async ({
    page,
  }) => {
    await mockDeleteHandlingDeficitSuccess(page);
    await addHandlingCharacteristic(page, 'Oversteer');
    await expect(page.getByRole('button', { name: 'Diagnose' })).toBeEnabled();

    await deleteHandlingCharacteristic(page);

    await expect(page.getByRole('button', { name: 'Diagnose' })).toBeDisabled();
  });

  test('fades the disabled Diagnose button when there are no handling characteristics', async ({
    page,
  }) => {
    await expect(page.getByRole('button', { name: 'Diagnose' })).toHaveCSS('opacity', '0.5');
  });

  test('restores Diagnose button opacity after a handling characteristic is added', async ({
    page,
  }) => {
    await addHandlingCharacteristic(page, 'Oversteer');

    await expect(page.getByRole('button', { name: 'Diagnose' })).toHaveCSS('opacity', '1');
  });

  test('asks for a handling characteristic when Diagnose is clicked with none', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'Diagnose' }).click({ force: true });

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText('Please add at least one handling characteristic');
    await expect(page.getByRole('region', { name: 'Current Session' })).toBeVisible();
    await expect(page.getByRole('region', { name: 'Suggested Setup Changes' })).not.toBeVisible();
  });

  test('places the Close button at the top right of the handling characteristic dialog', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'Diagnose' }).click({ force: true });

    const dialog = page.getByRole('dialog');
    const close = dialog.getByRole('button', { name: 'Close' });
    const title = dialog.getByRole('heading', {
      name: 'Please add at least one handling characteristic',
    });

    const dialogBox = await dialog.boundingBox();
    const closeBox = await close.boundingBox();
    const titleBox = await title.boundingBox();

    expect(dialogBox).not.toBeNull();
    expect(closeBox).not.toBeNull();
    expect(titleBox).not.toBeNull();

    expect(closeBox!.y + closeBox!.height).toBeLessThanOrEqual(titleBox!.y);

    const dialogCenter = dialogBox!.x + dialogBox!.width / 2;
    const closeFromRight = dialogBox!.x + dialogBox!.width - (closeBox!.x + closeBox!.width);
    expect(closeBox!.x).toBeGreaterThan(dialogCenter);
    expect(closeFromRight).toBeLessThan(40);

    const titleCenter = titleBox!.x + titleBox!.width / 2;
    expect(Math.abs(titleCenter - dialogCenter)).toBeLessThan(8);
  });

  test('closes the handling characteristic dialog when Ok is clicked', async ({ page }) => {
    await page.getByRole('button', { name: 'Diagnose' }).click({ force: true });
    await page.getByRole('dialog').getByRole('button', { name: 'Ok' }).click();

    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('closes the handling characteristic dialog when Close is clicked', async ({ page }) => {
    await page.getByRole('button', { name: 'Diagnose' }).click({ force: true });
    await page.getByRole('dialog').getByRole('button', { name: 'Close' }).click();

    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('closes the handling characteristic dialog when the overlay is clicked', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'Diagnose' }).click({ force: true });
    await page.getByRole('presentation').click({ position: { x: 8, y: 8 } });

    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('navigates to the Suggested Setup Changes page when Diagnose is clicked', async ({
    page,
  }) => {
    await addHandlingCharacteristic(page, 'Oversteer');
    await page.getByRole('button', { name: 'Diagnose' }).click();

    await expect(page.getByRole('region', { name: 'Suggested Setup Changes' })).toBeVisible();
    await expect(page.getByRole('region', { name: 'Current Session' })).not.toBeVisible();
  });

  test('lists each suggested setup change as a bullet point', async ({ page }) => {
    await addHandlingCharacteristic(page, 'Oversteer');
    await page.getByRole('button', { name: 'Diagnose' }).click();

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

  test('returns to the Current Session page when Back is clicked from the suggestions view', async ({
    page,
  }) => {
    await addHandlingCharacteristic(page, 'Oversteer');
    await page.getByRole('button', { name: 'Diagnose' }).click();
    await expect(page.getByRole('region', { name: 'Suggested Setup Changes' })).toBeVisible();

    await page.getByRole('button', { name: 'Back' }).click();

    await expect(page.getByRole('region', { name: 'Current Session' })).toBeVisible();
    await expect(page.getByRole('region', { name: 'Suggested Setup Changes' })).not.toBeVisible();
  });

  test('preserves selected car, track, and handling characteristics after returning from the suggestions view', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'Back' }).click();
    await expect(page.getByRole('region', { name: 'New Session' })).toBeVisible();

    await page.getByLabel('Car').selectOption({ label: 'Porsche 911 GT3 R' });
    await page.getByLabel('Track').selectOption({ label: 'Spa-Francorchamps' });

    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByRole('region', { name: 'Current Session' })).toBeVisible();

    await addHandlingCharacteristic(page, 'Oversteer');

    await page.getByRole('button', { name: 'Diagnose' }).click();
    await expect(page.getByRole('region', { name: 'Suggested Setup Changes' })).toBeVisible();

    await page.getByRole('button', { name: 'Back' }).click();
    await expect(page.getByRole('region', { name: 'Current Session' })).toBeVisible();
    await expect(page.getByText('Oversteer')).toBeVisible();

    await page.getByRole('button', { name: 'Back' }).click();
    await expect(page.getByRole('region', { name: 'New Session' })).toBeVisible();
    await expect(page.getByLabel('Car')).toHaveValue('porsche-911-gt3');
    await expect(page.getByLabel('Track')).toHaveValue('spa-francorchamps');
  });

  test('shows a Work on Another Session button on the suggestions view', async ({ page }) => {
    await addHandlingCharacteristic(page, 'Oversteer');
    await page.getByRole('button', { name: 'Diagnose' }).click();
    await expect(page.getByRole('region', { name: 'Suggested Setup Changes' })).toBeVisible();

    await expect(
      page.getByRole('button', { name: 'Work on Another Session' }),
    ).toBeVisible();
  });

  test('returns all the way to the Start Session page when Work on Another Session is clicked', async ({
    page,
  }) => {
    await addHandlingCharacteristic(page, 'Oversteer');
    await page.getByRole('button', { name: 'Diagnose' }).click();
    await expect(page.getByRole('region', { name: 'Suggested Setup Changes' })).toBeVisible();

    await page.getByRole('button', { name: 'Work on Another Session' }).click();

    await expect(page.getByRole('region', { name: 'Start Session' })).toBeVisible();
    await expect(page.getByRole('region', { name: 'Suggested Setup Changes' })).not.toBeVisible();
  });

  test('clears the selected car, track, and handling characteristics after starting another session', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'Back' }).click();
    await expect(page.getByRole('region', { name: 'New Session' })).toBeVisible();

    await page.getByLabel('Car').selectOption({ label: 'Porsche 911 GT3 R' });
    await page.getByLabel('Track').selectOption({ label: 'Spa-Francorchamps' });

    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByRole('region', { name: 'Current Session' })).toBeVisible();
    await addHandlingCharacteristic(page, 'Oversteer');

    await page.getByRole('button', { name: 'Diagnose' }).click();
    await expect(page.getByRole('region', { name: 'Suggested Setup Changes' })).toBeVisible();

    await page.getByRole('button', { name: 'Work on Another Session' }).click();
    await expect(page.getByRole('region', { name: 'Start Session' })).toBeVisible();

    await page.getByRole('button', { name: 'New Session' }).click();
    await expect(page.getByRole('region', { name: 'New Session' })).toBeVisible();
    await expect(page.getByLabel('Car')).toHaveValue('');
    await expect(page.getByLabel('Track')).toHaveValue('');

    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByRole('region', { name: 'Current Session' })).toBeVisible();
    await expect(page.getByText('No handling characteristics added yet.')).toBeVisible();
  });
});

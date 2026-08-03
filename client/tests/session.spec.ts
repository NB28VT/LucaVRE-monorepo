import { test, expect } from '@playwright/test';
import { mockCreateWorkingSessionSuccess } from './helpers/workingSessionApi';
import { mockVehicleOptions } from './helpers/vehicleOptionsApi';
import {
  DEFAULT_CHARACTERISTIC_LABEL,
  addHandlingCharacteristic,
  editHandlingCharacteristic,
  openDeleteConfirmation,
  deleteHandlingCharacteristic,
} from './helpers/handlingCharacteristics';

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

test.describe('Handling Characteristics', () => {
  test.beforeEach(async ({ page }) => {
    await mockVehicleOptions(page);
    await mockCreateWorkingSessionSuccess(page);

    await page.goto('http://localhost:5173');
    await page.getByRole('button', { name: 'New Session' }).click();
    await page.getByLabel('Car').selectOption({ label: 'Porsche 911 GT3 R' });
    await page.getByLabel('Track').selectOption({ label: 'Spa-Francorchamps' });
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByRole('region', { name: 'Current Session' })).toBeVisible();
  });

  test('shows an empty list and a "+ Add" button by default', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Handling Characteristics' })).toBeVisible();
    await expect(page.getByText('No handling characteristics added yet.')).toBeVisible();
    await expect(page.getByRole('button', { name: '+ Add' })).toBeVisible();
  });

  test('opens a modal with Location, Phase, and Symptom dropdowns when "+ Add" is clicked', async ({
    page,
  }) => {
    await page.getByRole('button', { name: '+ Add' }).click();

    const locationSelect = page.getByLabel('Location', { exact: true });
    const phaseSelect = page.getByLabel('Phase', { exact: true });
    const symptomSelect = page.getByLabel('Symptom', { exact: true });

    await expect(locationSelect).toBeVisible();
    await expect(locationSelect).toHaveValue('');
    await expect(locationSelect.locator('option', { hasText: 'Select a location…' })).toHaveCount(
      1,
    );

    await expect(phaseSelect).toBeVisible();
    await expect(phaseSelect).toHaveValue('');
    await expect(phaseSelect.locator('option', { hasText: 'Select a phase…' })).toHaveCount(1);

    await expect(symptomSelect).toBeVisible();
    await expect(symptomSelect).toHaveValue('');
    await expect(symptomSelect.locator('option', { hasText: 'Select a symptom…' })).toHaveCount(1);
  });

  test('lists every location, phase, and symptom option in the modal', async ({ page }) => {
    await page.getByRole('button', { name: '+ Add' }).click();

    const locationSelect = page.getByLabel('Location', { exact: true });
    const phaseSelect = page.getByLabel('Phase', { exact: true });
    const symptomSelect = page.getByLabel('Symptom', { exact: true });

    await expect(locationSelect.locator('option', { hasText: 'Everywhere' })).toHaveCount(1);
    await expect(locationSelect.locator('option', { hasText: 'High Speed Corners' })).toHaveCount(
      1,
    );
    await expect(
      locationSelect.locator('option', { hasText: 'Medium Speed Corners' }),
    ).toHaveCount(1);
    await expect(locationSelect.locator('option', { hasText: 'Low Speed Corners' })).toHaveCount(1);
    await expect(locationSelect.locator('option')).toHaveCount(5);

    await expect(phaseSelect.locator('option', { hasText: 'Entry' })).toHaveCount(1);
    await expect(phaseSelect.locator('option', { hasText: 'Mid Corner' })).toHaveCount(1);
    await expect(phaseSelect.locator('option', { hasText: 'Exit' })).toHaveCount(1);
    await expect(phaseSelect.locator('option')).toHaveCount(4);

    await expect(symptomSelect.locator('option', { hasText: 'Oversteer' })).toHaveCount(1);
    await expect(symptomSelect.locator('option', { hasText: 'Understeer' })).toHaveCount(1);
    await expect(symptomSelect.locator('option')).toHaveCount(3);
  });

  test('disables Phase when Everywhere is selected', async ({ page }) => {
    await page.getByRole('button', { name: '+ Add' }).click();

    const locationSelect = page.getByLabel('Location', { exact: true });
    const phaseSelect = page.getByLabel('Phase', { exact: true });

    await locationSelect.selectOption({ label: 'Everywhere' });

    await expect(phaseSelect).toBeDisabled();
    await expect(phaseSelect).toHaveValue('');
  });

  test('adds a new handling characteristic to the list and closes the modal when Save is clicked', async ({
    page,
  }) => {
    await addHandlingCharacteristic(page, 'Oversteer');

    await expect(page.getByRole('dialog')).not.toBeVisible();
    await expect(page.getByText('No handling characteristics added yet.')).not.toBeVisible();
    await expect(page.getByText('Everywhere')).toBeVisible();
    await expect(page.getByText('Oversteer')).toBeVisible();
  });

  test('closes the modal without saving when the X button is clicked', async ({ page }) => {
    await page.getByRole('button', { name: '+ Add' }).click();
    await page.getByLabel('Location', { exact: true }).selectOption({ label: 'Everywhere' });
    await page.getByLabel('Symptom', { exact: true }).selectOption({ label: 'Oversteer' });

    await page.getByRole('button', { name: 'Close' }).click();

    await expect(page.getByRole('dialog')).not.toBeVisible();
    await expect(page.getByText('No handling characteristics added yet.')).toBeVisible();
  });

  test('pre-fills the modal with the current values when editing', async ({ page }) => {
    await addHandlingCharacteristic(page, 'Oversteer');

    await page.getByRole('button', { name: `Edit ${DEFAULT_CHARACTERISTIC_LABEL}` }).click();

    await expect(page.getByLabel('Location', { exact: true })).toHaveValue('global');
    await expect(page.getByLabel('Phase', { exact: true })).toBeDisabled();
    await expect(page.getByLabel('Phase', { exact: true })).toHaveValue('');
    await expect(page.getByLabel('Symptom', { exact: true })).toHaveValue('oversteer');
  });

  test('updates the handling characteristic value when edited and saved', async ({ page }) => {
    await addHandlingCharacteristic(page, 'Oversteer');

    await editHandlingCharacteristic(page, 'Understeer');

    await expect(page.getByRole('dialog')).not.toBeVisible();
    await expect(page.getByText('Understeer')).toBeVisible();
    await expect(page.getByText('Oversteer')).not.toBeVisible();
  });

  test('leaves the value unchanged when editing is cancelled via the X button', async ({
    page,
  }) => {
    await addHandlingCharacteristic(page, 'Oversteer');

    await page.getByRole('button', { name: `Edit ${DEFAULT_CHARACTERISTIC_LABEL}` }).click();
    await page.getByLabel('Symptom', { exact: true }).selectOption({ label: 'Understeer' });
    await page.getByRole('button', { name: 'Close' }).click();

    await expect(page.getByRole('dialog')).not.toBeVisible();
    await expect(page.getByText('Oversteer')).toBeVisible();
    await expect(page.getByText('Understeer')).not.toBeVisible();
  });

  test('retains the handling characteristics list in local state after navigating away and back', async ({
    page,
  }) => {
    await addHandlingCharacteristic(page, 'Oversteer');

    await page.getByRole('button', { name: 'Back' }).click();
    await expect(page.getByRole('region', { name: 'New Session' })).toBeVisible();

    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByRole('region', { name: 'Current Session' })).toBeVisible();

    await expect(page.getByText('Oversteer')).toBeVisible();
  });
});

test.describe('Deleting handling characteristics', () => {
  test.beforeEach(async ({ page }) => {
    await mockVehicleOptions(page);
    await mockCreateWorkingSessionSuccess(page);

    await page.goto('http://localhost:5173');
    await page.getByRole('button', { name: 'New Session' }).click();
    await page.getByLabel('Car').selectOption({ label: 'Porsche 911 GT3 R' });
    await page.getByLabel('Track').selectOption({ label: 'Spa-Francorchamps' });
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByRole('region', { name: 'Current Session' })).toBeVisible();
    await addHandlingCharacteristic(page, 'Oversteer');
  });

  test('shows a delete button next to the edit button for a handling characteristic', async ({
    page,
  }) => {
    await expect(
      page.getByRole('button', { name: `Edit ${DEFAULT_CHARACTERISTIC_LABEL}` }),
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: `Delete ${DEFAULT_CHARACTERISTIC_LABEL}` }),
    ).toBeVisible();
  });

  test('opens a confirmation dialog showing the current value when delete is clicked', async ({
    page,
  }) => {
    await openDeleteConfirmation(page);

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText('Everywhere');
    await expect(dialog).toContainText('Oversteer');
  });

  test('keeps the handling characteristic when Cancel is clicked in the confirmation dialog', async ({
    page,
  }) => {
    await openDeleteConfirmation(page);

    await page.getByRole('dialog').getByRole('button', { name: 'Cancel' }).click();

    await expect(page.getByRole('dialog')).not.toBeVisible();
    await expect(page.getByText('Oversteer')).toBeVisible();
  });

  test('keeps the handling characteristic when the X button is clicked in the confirmation dialog', async ({
    page,
  }) => {
    await openDeleteConfirmation(page);

    await page.getByRole('dialog').getByRole('button', { name: 'Close' }).click();

    await expect(page.getByRole('dialog')).not.toBeVisible();
    await expect(page.getByText('Oversteer')).toBeVisible();
  });

  test('removes the handling characteristic and shows the empty state when Delete is confirmed', async ({
    page,
  }) => {
    await deleteHandlingCharacteristic(page);

    await expect(page.getByRole('dialog')).not.toBeVisible();
    await expect(page.getByText('No handling characteristics added yet.')).toBeVisible();
    await expect(page.getByText('Oversteer')).not.toBeVisible();
  });

  test('deleting one handling characteristic leaves other handling characteristics intact', async ({
    page,
  }) => {
    await addHandlingCharacteristic(page, 'Understeer', {
      location: 'High Speed Corners',
      phase: 'Entry',
    });

    const listItems = page.getByRole('listitem');
    await expect(listItems).toHaveCount(2);

    const understeerItem = listItems.filter({ hasText: 'Understeer' });
    await understeerItem
      .getByRole('button', { name: 'Delete High Speed Corners, Entry: Understeer' })
      .click();
    await page.getByRole('dialog').getByRole('button', { name: 'Delete' }).click();

    await expect(page.getByRole('dialog')).not.toBeVisible();
    await expect(page.getByRole('listitem')).toHaveCount(1);
    await expect(page.getByText('Oversteer')).toBeVisible();
    await expect(page.getByText('Understeer')).not.toBeVisible();
  });
});

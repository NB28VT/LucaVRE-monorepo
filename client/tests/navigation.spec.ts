import { test, expect } from '@playwright/test';
import { mockCreateWorkingSessionSuccess } from './helpers/workingSessionApi';
import { mockVehicleOptions } from './helpers/vehicleOptionsApi';
import { mockHandlingDeficitsList, mockCreateHandlingDeficitSuccess } from './helpers/handlingDeficitsApi';
import { addHandlingCharacteristic } from './helpers/handlingCharacteristics';
import { mockCreateDiagnosticSuccess } from './helpers/diagnosticApi';

test.describe('Page navigation', () => {
  test.beforeEach(async ({ page }) => {
    await mockVehicleOptions(page);
    await mockHandlingDeficitsList(page, 1, []);
    await mockCreateHandlingDeficitSuccess(page, 1);
    await mockCreateDiagnosticSuccess(page);

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

  test('shows a Submit button (not Next) on the New Session page', async ({ page }) => {
    await page.getByRole('button', { name: 'New Session' }).click();
    await expect(page.getByRole('region', { name: 'New Session' })).toBeVisible();

    await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Next' })).not.toBeVisible();
  });

  test('does not show the handling characteristics list on the New Session page', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'New Session' }).click();
    await expect(page.getByRole('region', { name: 'New Session' })).toBeVisible();

    await expect(page.getByRole('heading', { name: 'Handling Characteristics' })).not.toBeVisible();
  });

  test('navigates from New Session to Current Session via Submit', async ({ page }) => {
    await mockCreateWorkingSessionSuccess(page);

    await page.getByRole('button', { name: 'New Session' }).click();
    await page.getByLabel('Car').selectOption({ label: 'Porsche 911 GT3 R' });
    await page.getByLabel('Track').selectOption({ label: 'Spa-Francorchamps' });
    await page.getByRole('button', { name: 'Submit' }).click();

    await expect(page.getByRole('region', { name: 'Current Session' })).toBeVisible();
    await expect(page.getByRole('region', { name: 'New Session' })).not.toBeVisible();
    await expect(page.getByRole('heading', { name: 'Handling Characteristics' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Diagnose' })).toBeVisible();
  });

  test('navigates from Current Session back to New Session', async ({ page }) => {
    await mockCreateWorkingSessionSuccess(page);

    await page.getByRole('button', { name: 'New Session' }).click();
    await page.getByLabel('Car').selectOption({ label: 'Porsche 911 GT3 R' });
    await page.getByLabel('Track').selectOption({ label: 'Spa-Francorchamps' });
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByRole('region', { name: 'Current Session' })).toBeVisible();

    await page.getByRole('button', { name: 'Back' }).click();

    await expect(page.getByRole('region', { name: 'New Session' })).toBeVisible();
    await expect(page.getByRole('region', { name: 'Current Session' })).not.toBeVisible();
  });

  test('navigates from Current Session to Suggested Setup Changes via Diagnose', async ({
    page,
  }) => {
    await mockCreateWorkingSessionSuccess(page);

    await page.getByRole('button', { name: 'New Session' }).click();
    await page.getByLabel('Car').selectOption({ label: 'Porsche 911 GT3 R' });
    await page.getByLabel('Track').selectOption({ label: 'Spa-Francorchamps' });
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByRole('region', { name: 'Current Session' })).toBeVisible();
    await addHandlingCharacteristic(page, 'Oversteer');
    await page.getByRole('button', { name: 'Diagnose' }).click();

    await expect(page.getByRole('region', { name: 'Suggested Setup Changes' })).toBeVisible();
    await expect(page.getByRole('region', { name: 'Current Session' })).not.toBeVisible();
  });

  test('navigates from Suggested Setup Changes back to Current Session', async ({ page }) => {
    await mockCreateWorkingSessionSuccess(page);

    await page.getByRole('button', { name: 'New Session' }).click();
    await page.getByLabel('Car').selectOption({ label: 'Porsche 911 GT3 R' });
    await page.getByLabel('Track').selectOption({ label: 'Spa-Francorchamps' });
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByRole('region', { name: 'Current Session' })).toBeVisible();
    await addHandlingCharacteristic(page, 'Oversteer');
    await page.getByRole('button', { name: 'Diagnose' }).click();
    await expect(page.getByRole('region', { name: 'Suggested Setup Changes' })).toBeVisible();

    await page.getByRole('button', { name: 'Back' }).click();

    await expect(page.getByRole('region', { name: 'Current Session' })).toBeVisible();
    await expect(page.getByRole('region', { name: 'Suggested Setup Changes' })).not.toBeVisible();
  });

  test('preserves selected car, track, and handling characteristics across the full round trip', async ({
    page,
  }) => {
    await mockCreateWorkingSessionSuccess(page);

    await page.getByRole('button', { name: 'New Session' }).click();

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

  test('shows the session header with the selected car and track on the Current Session page', async ({
    page,
  }) => {
    await mockCreateWorkingSessionSuccess(page);

    await page.getByRole('button', { name: 'New Session' }).click();

    await page.getByLabel('Car').selectOption({ label: 'Porsche 911 GT3 R' });
    await page.getByLabel('Track').selectOption({ label: 'Spa-Francorchamps' });

    await page.getByRole('button', { name: 'Submit' }).click();

    const sessionHeader = page.getByRole('group', { name: 'Active session' });
    await expect(sessionHeader).toBeVisible();
    await expect(sessionHeader).toContainText('Current Session');
    await expect(sessionHeader).toContainText('Porsche 911 GT3 R');
    await expect(sessionHeader).toContainText('Spa-Francorchamps');
  });

  test('shows the session header with the selected car and track on the Suggested Setup Changes page', async ({
    page,
  }) => {
    await mockCreateWorkingSessionSuccess(page);

    await page.getByRole('button', { name: 'New Session' }).click();

    await page.getByLabel('Car').selectOption({ label: 'Ferrari 296 GT3' });
    await page.getByLabel('Track').selectOption({ label: 'Circuit de la Sarthe (Le Mans)' });

    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByRole('region', { name: 'Current Session' })).toBeVisible();
    await addHandlingCharacteristic(page, 'Understeer');
    await page.getByRole('button', { name: 'Diagnose' }).click();

    const sessionHeader = page.getByRole('group', { name: 'Active session' });
    await expect(sessionHeader).toBeVisible();
    await expect(sessionHeader).toContainText('Session Active');
    await expect(sessionHeader).toContainText('Ferrari 296 GT3');
    await expect(sessionHeader).toContainText('Circuit de la Sarthe (Le Mans)');
  });

  test('navigates from Suggested Setup Changes all the way back to Start Session via Work on Another Session', async ({
    page,
  }) => {
    await mockCreateWorkingSessionSuccess(page);

    await page.getByRole('button', { name: 'New Session' }).click();
    await page.getByLabel('Car').selectOption({ label: 'Porsche 911 GT3 R' });
    await page.getByLabel('Track').selectOption({ label: 'Spa-Francorchamps' });
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByRole('region', { name: 'Current Session' })).toBeVisible();
    await addHandlingCharacteristic(page, 'Oversteer');
    await page.getByRole('button', { name: 'Diagnose' }).click();
    await expect(page.getByRole('region', { name: 'Suggested Setup Changes' })).toBeVisible();

    await page.getByRole('button', { name: 'Work on Another Session' }).click();

    await expect(page.getByRole('region', { name: 'Start Session' })).toBeVisible();
    await expect(page.getByRole('region', { name: 'Suggested Setup Changes' })).not.toBeVisible();
  });

  test('shows the quick navigation split pill on the New Session page', async ({ page }) => {
    await page.getByRole('button', { name: 'New Session' }).click();
    const newSession = page.getByRole('region', { name: 'New Session' });

    await expect(newSession.getByRole('button', { name: 'New Session' })).toBeVisible();
    await expect(newSession.getByRole('button', { name: 'Home' })).toBeVisible();
  });

  test('navigates from Load Session to Start Session via Home', async ({ page }) => {
    await page.getByRole('button', { name: 'Load Session' }).click();
    await expect(page.getByRole('region', { name: 'Load Session' })).toBeVisible();

    await page.getByRole('region', { name: 'Load Session' }).getByRole('button', { name: 'Home' }).click();

    await expect(page.getByRole('region', { name: 'Start Session' })).toBeVisible();
    await expect(page.getByRole('region', { name: 'Load Session' })).not.toBeVisible();
  });

  test('navigates from Load Session to New Session via the quick navigation New Session button', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'Load Session' }).click();
    await expect(page.getByRole('region', { name: 'Load Session' })).toBeVisible();

    await page
      .getByRole('region', { name: 'Load Session' })
      .getByRole('button', { name: 'New Session' })
      .click();

    await expect(page.getByRole('region', { name: 'New Session' })).toBeVisible();
    await expect(page.getByRole('region', { name: 'Load Session' })).not.toBeVisible();
  });

  test('navigates from Current Session to Start Session via Home', async ({ page }) => {
    await mockCreateWorkingSessionSuccess(page);

    await page.getByRole('button', { name: 'New Session' }).click();
    await page.getByLabel('Car').selectOption({ label: 'Porsche 911 GT3 R' });
    await page.getByLabel('Track').selectOption({ label: 'Spa-Francorchamps' });
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByRole('region', { name: 'Current Session' })).toBeVisible();

    await page
      .getByRole('region', { name: 'Current Session' })
      .getByRole('button', { name: 'Home' })
      .click();

    await expect(page.getByRole('region', { name: 'Start Session' })).toBeVisible();
    await expect(page.getByRole('region', { name: 'Current Session' })).not.toBeVisible();
  });

  test('navigates from Current Session to New Session via the quick navigation New Session button', async ({
    page,
  }) => {
    await mockCreateWorkingSessionSuccess(page);

    await page.getByRole('button', { name: 'New Session' }).click();
    await page.getByLabel('Car').selectOption({ label: 'Porsche 911 GT3 R' });
    await page.getByLabel('Track').selectOption({ label: 'Spa-Francorchamps' });
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByRole('region', { name: 'Current Session' })).toBeVisible();

    await page
      .getByRole('region', { name: 'Current Session' })
      .getByRole('button', { name: 'New Session' })
      .click();

    await expect(page.getByRole('region', { name: 'New Session' })).toBeVisible();
    await expect(page.getByRole('region', { name: 'Current Session' })).not.toBeVisible();
  });

  test('navigates from Suggested Setup Changes to Start Session via Home', async ({ page }) => {
    await mockCreateWorkingSessionSuccess(page);

    await page.getByRole('button', { name: 'New Session' }).click();
    await page.getByLabel('Car').selectOption({ label: 'Porsche 911 GT3 R' });
    await page.getByLabel('Track').selectOption({ label: 'Spa-Francorchamps' });
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByRole('region', { name: 'Current Session' })).toBeVisible();
    await addHandlingCharacteristic(page, 'Oversteer');
    await page.getByRole('button', { name: 'Diagnose' }).click();
    await expect(page.getByRole('region', { name: 'Suggested Setup Changes' })).toBeVisible();

    await page
      .getByRole('region', { name: 'Suggested Setup Changes' })
      .getByRole('button', { name: 'Home' })
      .click();

    await expect(page.getByRole('region', { name: 'Start Session' })).toBeVisible();
    await expect(page.getByRole('region', { name: 'Suggested Setup Changes' })).not.toBeVisible();
  });

  test('navigates from Suggested Setup Changes to New Session via the quick navigation New Session button', async ({
    page,
  }) => {
    await mockCreateWorkingSessionSuccess(page);

    await page.getByRole('button', { name: 'New Session' }).click();
    await page.getByLabel('Car').selectOption({ label: 'Porsche 911 GT3 R' });
    await page.getByLabel('Track').selectOption({ label: 'Spa-Francorchamps' });
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByRole('region', { name: 'Current Session' })).toBeVisible();
    await addHandlingCharacteristic(page, 'Oversteer');
    await page.getByRole('button', { name: 'Diagnose' }).click();
    await expect(page.getByRole('region', { name: 'Suggested Setup Changes' })).toBeVisible();

    await page
      .getByRole('region', { name: 'Suggested Setup Changes' })
      .getByRole('button', { name: 'New Session' })
      .click();

    await expect(page.getByRole('region', { name: 'New Session' })).toBeVisible();
    await expect(page.getByRole('region', { name: 'Suggested Setup Changes' })).not.toBeVisible();
  });
});

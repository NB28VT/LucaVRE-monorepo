import { test, expect } from '@playwright/test';
import {
  mockCreateWorkingSessionSuccess,
  mockWorkingSessionsList,
} from './helpers/workingSessionApi';
import { mockVehicleOptions } from './helpers/vehicleOptionsApi';
import { mockHandlingDeficitsList } from './helpers/handlingDeficitsApi';

test.describe('Handling characteristics load', () => {
  test('shows the empty state when the deficits index returns an empty list after creating a session', async ({
    page,
  }) => {
    await mockVehicleOptions(page);
    await mockCreateWorkingSessionSuccess(page);
    await mockHandlingDeficitsList(page, 1, []);

    await page.goto('http://localhost:5173');
    await page.getByRole('button', { name: 'New Session' }).click();
    await page.getByLabel('Car').selectOption({ label: 'Porsche 911 GT3 R' });
    await page.getByLabel('Track').selectOption({ label: 'Spa-Francorchamps' });
    await page.getByRole('button', { name: 'Submit' }).click();

    await expect(page.getByRole('region', { name: 'Current Session' })).toBeVisible();
    await expect(page.getByText('No handling characteristics added yet.')).toBeVisible();
    await expect(page.getByRole('button', { name: '+ Add' })).toBeVisible();
  });

  test('renders handling characteristics returned by the deficits index after creating a session', async ({
    page,
  }) => {
    await mockVehicleOptions(page);
    await mockCreateWorkingSessionSuccess(page);
    await mockHandlingDeficitsList(page, 1, [
      {
        id: 10,
        workingSessionId: 1,
        location: 'global',
        phase: null,
        symptom: 'oversteer',
        createdAt: '2026-07-20T10:00:00.000Z',
      },
      {
        id: 11,
        workingSessionId: 1,
        location: 'high_speed',
        phase: 'entry',
        symptom: 'understeer',
        createdAt: '2026-07-20T10:05:00.000Z',
      },
    ]);

    await page.goto('http://localhost:5173');
    await page.getByRole('button', { name: 'New Session' }).click();
    await page.getByLabel('Car').selectOption({ label: 'Porsche 911 GT3 R' });
    await page.getByLabel('Track').selectOption({ label: 'Spa-Francorchamps' });
    await page.getByRole('button', { name: 'Submit' }).click();

    await expect(page.getByRole('region', { name: 'Current Session' })).toBeVisible();
    await expect(page.getByText('No handling characteristics added yet.')).not.toBeVisible();
    await expect(page.getByText('Everywhere')).toBeVisible();
    await expect(page.getByText('Oversteer')).toBeVisible();
    await expect(page.getByText('High Speed Corners')).toBeVisible();
    await expect(page.getByText('Phase: Entry')).toBeVisible();
    await expect(page.getByText('Understeer')).toBeVisible();
  });

  test('renders handling characteristics from the deficits index when resuming a saved session', async ({
    page,
  }) => {
    await mockWorkingSessionsList(page, [
      {
        id: 2,
        carId: 'ferrari_296_lmgt3',
        trackId: 'monza_grand_prix',
        createdAt: '2026-07-20T10:00:00.000Z',
        car: { id: 'ferrari_296_lmgt3', name: 'Ferrari 296 LMGT3' },
        track: { id: 'monza_grand_prix', name: 'Monza - Grand Prix' },
      },
    ]);
    await mockHandlingDeficitsList(page, 2, [
      {
        id: 20,
        workingSessionId: 2,
        location: 'low_speed',
        phase: 'exit',
        symptom: 'oversteer',
        createdAt: '2026-07-20T11:00:00.000Z',
      },
    ]);

    await page.goto('http://localhost:5173');
    await page.getByRole('button', { name: 'Load Session' }).click();
    await page.getByRole('button', { name: 'Resume' }).click();

    await expect(page.getByRole('region', { name: 'Current Session' })).toBeVisible();
    await expect(page.getByText('Low Speed Corners')).toBeVisible();
    await expect(page.getByText('Phase: Exit')).toBeVisible();
    await expect(page.getByText('Oversteer')).toBeVisible();
  });
});

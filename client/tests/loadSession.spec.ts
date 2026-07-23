import { test, expect } from '@playwright/test';
import { mockWorkingSessionsList } from './helpers/workingSessionApi';

test.describe('Load Session resume flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('resuming a saved session navigates to the Car Balance page', async ({ page }) => {
    await mockWorkingSessionsList(page, [
      {
        id: 1,
        carId: 'porsche_911_lmgt3_r_992',
        trackId: 'spa_francorchamps_gp',
        createdAt: '2026-07-20T10:00:00.000Z',
        car: { id: 'porsche_911_lmgt3_r_992', name: 'Porsche 911 LMGT3 R (992)' },
        track: { id: 'spa_francorchamps_gp', name: 'Spa-Francorchamps - Grand Prix' },
      },
    ]);

    await page.getByRole('button', { name: 'Load Session' }).click();
    await expect(page.getByRole('region', { name: 'Load Session' })).toBeVisible();

    await page.getByRole('button', { name: 'Resume' }).click();

    await expect(page.getByRole('region', { name: 'Car Balance' })).toBeVisible();
    await expect(page.getByRole('region', { name: 'Load Session' })).not.toBeVisible();
  });

  test("shows the resumed session's car and track in the session header", async ({ page }) => {
    await mockWorkingSessionsList(page, [
      {
        id: 1,
        carId: 'porsche_911_lmgt3_r_992',
        trackId: 'spa_francorchamps_gp',
        createdAt: '2026-07-20T10:00:00.000Z',
        car: { id: 'porsche_911_lmgt3_r_992', name: 'Porsche 911 LMGT3 R (992)' },
        track: { id: 'spa_francorchamps_gp', name: 'Spa-Francorchamps - Grand Prix' },
      },
    ]);

    await page.getByRole('button', { name: 'Load Session' }).click();
    await page.getByRole('button', { name: 'Resume' }).click();

    const sessionHeader = page.getByRole('group', { name: 'Active session' });
    await expect(sessionHeader).toBeVisible();
    await expect(sessionHeader).toContainText('Porsche 911 LMGT3 R (992)');
    await expect(sessionHeader).toContainText('Spa-Francorchamps - Grand Prix');
  });

  test('resumes the correct session when multiple saved sessions exist', async ({ page }) => {
    await mockWorkingSessionsList(page, [
      {
        id: 1,
        carId: 'aston_martin_vantage_amr_lmgt3',
        trackId: 'imola_grand_prix',
        createdAt: '2026-07-18T09:00:00.000Z',
        car: { id: 'aston_martin_vantage_amr_lmgt3', name: 'Aston Martin Vantage AMR LMGT3 Evo' },
        track: { id: 'imola_grand_prix', name: 'Imola - Grand Prix' },
      },
      {
        id: 2,
        carId: 'ferrari_296_lmgt3',
        trackId: 'monza_grand_prix',
        createdAt: '2026-07-20T10:00:00.000Z',
        car: { id: 'ferrari_296_lmgt3', name: 'Ferrari 296 LMGT3' },
        track: { id: 'monza_grand_prix', name: 'Monza - Grand Prix' },
      },
    ]);

    await page.getByRole('button', { name: 'Load Session' }).click();

    const secondSessionCard = page
      .getByRole('listitem')
      .filter({ hasText: 'Ferrari 296 LMGT3 @ Monza - Grand Prix' });
    await secondSessionCard.getByRole('button', { name: 'Resume' }).click();

    const sessionHeader = page.getByRole('group', { name: 'Active session' });
    await expect(sessionHeader).toContainText('Ferrari 296 LMGT3');
    await expect(sessionHeader).toContainText('Monza - Grand Prix');
    await expect(sessionHeader).not.toContainText('Aston Martin Vantage AMR LMGT3 Evo');
    await expect(sessionHeader).not.toContainText('Imola - Grand Prix');
  });
});

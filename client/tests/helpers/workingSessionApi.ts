import type { Page } from '@playwright/test';

export async function mockCreateWorkingSessionSuccess(page: Page): Promise<void> {
  await page.route('**/api/v1/working_sessions', async (route) => {
    if (route.request().method() !== 'POST') {
      await route.continue();
      return;
    }
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
}

export async function mockWorkingSessionsList(
  page: Page,
  sessions: Array<{
    id: number;
    carId: string;
    trackId: string;
    createdAt: string;
    car?: { id: string; name: string };
    track?: { id: string; name: string };
  }>,
): Promise<void> {
  await page.route('**/api/v1/working_sessions', async (route) => {
    if (route.request().method() !== 'GET') {
      await route.continue();
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(sessions),
    });
  });
}

export async function mockCreateWorkingSessionValidationError(
  page: Page,
  errors: { car_id?: string[]; track_id?: string[] },
): Promise<void> {
  await page.route('**/api/v1/working_sessions', async (route) => {
    if (route.request().method() !== 'POST') {
      await route.continue();
      return;
    }
    await route.fulfill({
      status: 422,
      contentType: 'application/json',
      body: JSON.stringify({ errors }),
    });
  });
}

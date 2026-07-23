import type { Page } from '@playwright/test';

export const MOCK_CARS = [
  { id: 'porsche-911-gt3', name: 'Porsche 911 GT3 R' },
  { id: 'ferrari-296-gt3', name: 'Ferrari 296 GT3' },
];

export const MOCK_TRACKS = [
  { id: 'le-mans', name: 'Circuit de la Sarthe (Le Mans)' },
  { id: 'spa-francorchamps', name: 'Spa-Francorchamps' },
];

export async function mockCarsList(page: Page): Promise<void> {
  await page.route('**/api/v1/cars', async (route) => {
    if (route.request().method() !== 'GET') {
      await route.continue();
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(MOCK_CARS),
    });
  });
}

export async function mockTracksList(page: Page): Promise<void> {
  await page.route('**/api/v1/tracks', async (route) => {
    if (route.request().method() !== 'GET') {
      await route.continue();
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(MOCK_TRACKS),
    });
  });
}

export async function mockVehicleOptions(page: Page): Promise<void> {
  await mockCarsList(page);
  await mockTracksList(page);
}

import type { Page } from '@playwright/test';

const DIAGNOSTIC_ROUTE = '**/api/v1/working_sessions/*/diagnostic';

const MOCK_RECOMMENDATIONS = {
  brakeBias: 52.0,
  frontArb: 5,
  tirePressures: 145,
};

async function fulfillDiagnostic(
  page: Page,
  status: number,
  body: unknown,
  beforeFulfill?: Promise<void>,
): Promise<void> {
  await page.route(DIAGNOSTIC_ROUTE, async (route) => {
    if (route.request().method() !== 'POST') {
      await route.continue();
      return;
    }

    if (beforeFulfill) {
      await beforeFulfill;
    }

    await route.fulfill({
      status,
      contentType: 'application/json',
      body: JSON.stringify(body),
    });
  });
}

export async function mockCreateDiagnosticSuccess(page: Page): Promise<void> {
  await fulfillDiagnostic(page, 200, { recommendations: MOCK_RECOMMENDATIONS });
}

export async function mockCreateDiagnosticEmpty(page: Page): Promise<void> {
  await fulfillDiagnostic(page, 200, { recommendations: {} });
}

export async function mockCreateDiagnosticError(page: Page): Promise<void> {
  await fulfillDiagnostic(page, 504, {
    errors: ['Setup recommendation request timed out'],
  });
}

export async function mockCreateDiagnosticHeld(page: Page): Promise<() => void> {
  let release = () => {};
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });

  await fulfillDiagnostic(page, 200, { recommendations: MOCK_RECOMMENDATIONS }, gate);

  return release;
}

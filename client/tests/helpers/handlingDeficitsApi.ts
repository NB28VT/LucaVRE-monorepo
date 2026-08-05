import type { Page } from '@playwright/test';

export type MockHandlingDeficit = {
  id: number;
  workingSessionId: number;
  location: string;
  phase: string | null;
  symptom: string;
  createdAt: string;
};

let nextCreateId = 100;

export async function mockHandlingDeficitsList(
  page: Page,
  workingSessionId: number,
  deficits: MockHandlingDeficit[],
): Promise<void> {
  await page.route(
    `**/api/v1/working_sessions/${workingSessionId}/handling_deficits`,
    async (route) => {
      if (route.request().method() !== 'GET') {
        await route.continue();
        return;
      }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(deficits),
      });
    },
  );
}

export async function mockCreateHandlingDeficitSuccess(
  page: Page,
  workingSessionId: number,
  deficit?: Partial<MockHandlingDeficit>,
): Promise<void> {
  await page.route(
    `**/api/v1/working_sessions/${workingSessionId}/handling_deficits`,
    async (route) => {
      if (route.request().method() !== 'POST') {
        await route.continue();
        return;
      }

      const postData = route.request().postDataJSON() as {
        handling_deficit?: {
          location?: string;
          phase?: string | null;
          symptom?: string;
        };
      };
      const payload = postData?.handling_deficit ?? {};
      const id = deficit?.id ?? nextCreateId++;

      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          id,
          workingSessionId: deficit?.workingSessionId ?? workingSessionId,
          location: deficit?.location ?? payload.location ?? 'global',
          phase: deficit?.phase !== undefined ? deficit.phase : (payload.phase ?? null),
          symptom: deficit?.symptom ?? payload.symptom ?? 'oversteer',
          createdAt: deficit?.createdAt ?? new Date().toISOString(),
        }),
      });
    },
  );
}

export async function mockCreateHandlingDeficitError(
  page: Page,
  workingSessionId: number,
  options: { status?: number; errors: string[] },
): Promise<void> {
  await page.route(
    `**/api/v1/working_sessions/${workingSessionId}/handling_deficits`,
    async (route) => {
      if (route.request().method() !== 'POST') {
        await route.continue();
        return;
      }
      await route.fulfill({
        status: options.status ?? 422,
        contentType: 'application/json',
        body: JSON.stringify({ errors: options.errors }),
      });
    },
  );
}

export async function mockUpdateHandlingDeficitSuccess(page: Page): Promise<void> {
  await page.route('**/api/v1/handling_deficits/*', async (route) => {
    if (route.request().method() !== 'PATCH') {
      await route.continue();
      return;
    }

    const url = route.request().url();
    const idMatch = url.match(/\/handling_deficits\/([^/?]+)/);
    const id = idMatch ? Number(idMatch[1]) : NaN;

    const postData = route.request().postDataJSON() as {
      handling_deficit?: {
        location?: string;
        phase?: string | null;
        symptom?: string;
      };
    };
    const payload = postData?.handling_deficit ?? {};

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: Number.isNaN(id) ? 1 : id,
        workingSessionId: 1,
        location: payload.location ?? 'global',
        phase: payload.phase ?? null,
        symptom: payload.symptom ?? 'oversteer',
        createdAt: new Date().toISOString(),
      }),
    });
  });
}

export async function mockUpdateHandlingDeficitError(
  page: Page,
  options: { status?: number; errors: string[] },
): Promise<void> {
  await page.route('**/api/v1/handling_deficits/*', async (route) => {
    if (route.request().method() !== 'PATCH') {
      await route.continue();
      return;
    }
    await route.fulfill({
      status: options.status ?? 422,
      contentType: 'application/json',
      body: JSON.stringify({ errors: options.errors }),
    });
  });
}

export async function mockDeleteHandlingDeficitSuccess(page: Page): Promise<void> {
  await page.route('**/api/v1/handling_deficits/*', async (route) => {
    if (route.request().method() !== 'DELETE') {
      await route.continue();
      return;
    }
    await route.fulfill({ status: 204 });
  });
}

export async function mockDeleteHandlingDeficitError(
  page: Page,
  options: { status?: number; errors: string[] },
): Promise<void> {
  await page.route('**/api/v1/handling_deficits/*', async (route) => {
    if (route.request().method() !== 'DELETE') {
      await route.continue();
      return;
    }
    await route.fulfill({
      status: options.status ?? 404,
      contentType: 'application/json',
      body: JSON.stringify({ errors: options.errors }),
    });
  });
}

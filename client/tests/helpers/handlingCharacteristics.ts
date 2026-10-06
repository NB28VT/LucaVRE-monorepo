import type { Page } from '@playwright/test';

export const DEFAULT_CHARACTERISTIC_LABEL = 'Everywhere: Oversteer';

export async function addHandlingCharacteristic(
  page: Page,
  symptomLabel: string,
  options?: { location?: string; phase?: string },
): Promise<void> {
  const location = options?.location ?? 'Everywhere';

  await page.getByRole('button', { name: '+ Add' }).click();
  await page.getByLabel('Location', { exact: true }).selectOption({ label: location });

  if (options?.phase) {
    await page.getByLabel('Phase', { exact: true }).selectOption({ label: options.phase });
  }

  await page.getByLabel('Symptom', { exact: true }).selectOption({ label: symptomLabel });
  await page.getByRole('button', { name: 'Save' }).click();
}

export async function editHandlingCharacteristic(
  page: Page,
  symptomLabel: string,
  characteristicLabel = DEFAULT_CHARACTERISTIC_LABEL,
): Promise<void> {
  await page.getByRole('button', { name: `Edit ${characteristicLabel}` }).click();
  await page.getByLabel('Symptom', { exact: true }).selectOption({ label: symptomLabel });
  await page.getByRole('button', { name: 'Save' }).click();
}

export async function openDeleteConfirmation(
  page: Page,
  characteristicLabel = DEFAULT_CHARACTERISTIC_LABEL,
): Promise<void> {
  await page.getByRole('button', { name: `Delete ${characteristicLabel}` }).click();
}

export async function deleteHandlingCharacteristic(
  page: Page,
  characteristicLabel = DEFAULT_CHARACTERISTIC_LABEL,
): Promise<void> {
  await openDeleteConfirmation(page, characteristicLabel);
  await page.getByRole('dialog').getByRole('button', { name: 'Delete' }).click();
}

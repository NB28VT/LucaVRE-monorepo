import type { SetupRecommendations } from '@/types/diagnostic.ts';

type RecommendationField = {
  key: keyof SetupRecommendations;
  label: string;
  format: (value: number) => string;
};

const RECOMMENDATION_FIELDS: RecommendationField[] = [
  { key: 'brakeBias', label: 'Brake bias', format: (value) => `${value.toFixed(1)}%` },
  { key: 'rearWing', label: 'Rear wing', format: (value) => `${value}` },
  { key: 'frontRideHeight', label: 'Front ride height', format: (value) => `${value} mm` },
  { key: 'rearRideHeight', label: 'Rear ride height', format: (value) => `${value} mm` },
  { key: 'frontArb', label: 'Front anti-roll bar', format: (value) => `${value}` },
  { key: 'rearArb', label: 'Rear anti-roll bar', format: (value) => `${value}` },
  { key: 'tirePressures', label: 'Tire pressures', format: (value) => `${value} kPa` },
  { key: 'tcCut', label: 'TC cut', format: (value) => `${value}` },
  { key: 'tcSlip', label: 'TC slip', format: (value) => `${value}` },
];

export function formatSetupRecommendations(recommendations: SetupRecommendations): string[] {
  return RECOMMENDATION_FIELDS.flatMap((field) => {
    const value = recommendations[field.key];
    if (value == null) {
      return [];
    }

    return [`${field.label}: ${field.format(value)}`];
  });
}

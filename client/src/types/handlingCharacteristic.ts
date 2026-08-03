export type Location = 'global' | 'high_speed' | 'mid_speed' | 'low_speed';
export type Phase = 'entry' | 'mid_corner' | 'exit';
export type Symptom = 'oversteer' | 'understeer';

export interface HandlingCharacteristic {
  id: string;
  location: Location;
  phase: Phase | null; // null only when location is 'global'
  symptom: Symptom;
}

export const LOCATION_OPTIONS: { value: Location; label: string }[] = [
  { value: 'global', label: 'Everywhere' },
  { value: 'high_speed', label: 'High Speed Corners' },
  { value: 'mid_speed', label: 'Medium Speed Corners' },
  { value: 'low_speed', label: 'Low Speed Corners' },
];

export const PHASE_OPTIONS: { value: Phase; label: string }[] = [
  { value: 'entry', label: 'Entry' },
  { value: 'mid_corner', label: 'Mid Corner' },
  { value: 'exit', label: 'Exit' },
];

export const SYMPTOM_OPTIONS: { value: Symptom; label: string }[] = [
  { value: 'oversteer', label: 'Oversteer' },
  { value: 'understeer', label: 'Understeer' },
];

export const LOCATION_LABELS: Record<Location, string> = {
  global: 'Everywhere',
  high_speed: 'High Speed Corners',
  mid_speed: 'Medium Speed Corners',
  low_speed: 'Low Speed Corners',
};

export const PHASE_LABELS: Record<Phase, string> = {
  entry: 'Entry',
  mid_corner: 'Mid Corner',
  exit: 'Exit',
};

export const SYMPTOM_LABELS: Record<Symptom, string> = {
  oversteer: 'Oversteer',
  understeer: 'Understeer',
};

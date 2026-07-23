  export interface ReportedSymptomOption {
    id: string;
    label: 'Oversteer' | 'Understeer' | 'Balanced';
  }

  export const MOCK_REPORTED_SYMPTOMS: ReportedSymptomOption[] = [
    { id: 'oversteer', label: 'Oversteer' },
    { id: 'understeer', label: 'Understeer' },
    { id: 'balanced', label: 'Balanced' }
  ];

  export const MOCK_SUGGESTED_SETUP_CHANGES: string[] = [
    'Stiffen the front anti-roll bar by one click to sharpen turn-in response',
    'Lower rear tire pressures by 1.5 psi to increase mid-corner contact patch',
    'Increase brake bias rearward by 2% to reduce entry understeer'
  ];
  
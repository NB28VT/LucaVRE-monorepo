  export interface CarSpec {
    id: string;
    name: string;
    class: 'Hypercar' | 'GT3' | 'LMP2';
    enginePlacement: 'Front' | 'Mid' | 'Rear';
  }
  
  export interface TrackSpec {
    id: string;
    name: string;
    gripLevel: 'High' | 'Medium' | 'Low';
    bumpiness: 'High' | 'Medium' | 'Low';
    characteristic: string;
  }

  export interface ReportedSymptomOption {
    id: string;
    label: 'Oversteer' | 'Understeer' | 'Balanced';
  }
  
  export const MOCK_CARS: CarSpec[] = [
    {
      id: 'porsche-911-gt3',
      name: 'Porsche 911 GT3 R',
      class: 'GT3',
      enginePlacement: 'Rear'
    },
    {
      id: 'ferrari-296-gt3',
      name: 'Ferrari 296 GT3',
      class: 'GT3',
      enginePlacement: 'Mid'
    }
  ];
  
  export const MOCK_TRACKS: TrackSpec[] = [
    {
      id: 'le-mans',
      name: 'Circuit de la Sarthe (Le Mans)',
      gripLevel: 'Medium',
      bumpiness: 'Medium',
      characteristic: 'Long straights, high top-speed zones, heavy braking markers'
    },
    {
      id: 'spa-francorchamps',
      name: 'Spa-Francorchamps',
      gripLevel: 'High',
      bumpiness: 'Low',
      characteristic: 'High-speed compression turns (Eau Rouge), flowing sectors'
    }
  ];

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
  
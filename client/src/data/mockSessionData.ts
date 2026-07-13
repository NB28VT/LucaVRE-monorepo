import type { SavedSession } from '@/types/session.ts';

export const MOCK_SAVED_SESSIONS: SavedSession[] = [
  {
    id: 'session-1',
    carName: 'Porsche 911 GT3 R',
    trackName: 'Spa-Francorchamps',
    savedDate: '2026-05-12',
  },
  {
    id: 'session-2',
    carName: 'Ferrari 296 GT3',
    trackName: 'Circuit de la Sarthe',
    savedDate: '2026-05-08',
  },
  {
    id: 'session-3',
    carName: 'BMW M4 GT3',
    trackName: 'Silverstone',
    savedDate: '2026-04-30',
  },
  {
    id: 'session-4',
    carName: 'Aston Martin Vantage GT3',
    trackName: 'Monza',
    savedDate: '2026-04-21',
  },
];

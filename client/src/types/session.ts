export type CurrentView = 'start' | 'load' | 'new' | 'balance' | 'results';

export interface SavedSession {
  id: string;
  carName: string;
  trackName: string;
  savedDate: string;
}

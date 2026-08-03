export type CurrentView = 'start' | 'load' | 'new' | 'session' | 'results';

export interface SavedSession {
  id: string;
  carName: string;
  trackName: string;
  savedDate: string;
}

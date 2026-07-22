export interface WorkingSessionCar {
  id: string;
  name: string;
}

export interface WorkingSessionTrack {
  id: string;
  name: string;
}

export interface WorkingSession {
  id: number;
  carId: string;
  trackId: string;
  createdAt: string;
  car?: WorkingSessionCar;
  track?: WorkingSessionTrack;
}

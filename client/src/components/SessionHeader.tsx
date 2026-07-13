import { MOCK_CARS, MOCK_TRACKS } from '@/data/mockVehicleData.ts';

interface SessionHeaderProps {
  selectedCarId: string;
  selectedTrackId: string;
}

function SessionHeader({ selectedCarId, selectedTrackId }: SessionHeaderProps) {
  const selectedCar = MOCK_CARS.find((car) => car.id === selectedCarId);
  const selectedTrack = MOCK_TRACKS.find((track) => track.id === selectedTrackId);

  return (
    <div className="hub-readout" role="group" aria-label="Active session">
      <p className="hub-readout-status">
        <span className="hub-readout-dot" aria-hidden="true" />
        Session Active
      </p>

      <div className="hub-readout-combo">
        <div className="hub-readout-item">
          <span className="hub-readout-label">Car</span>
          <span className="hub-readout-value">{selectedCar?.name ?? 'Not selected'}</span>
        </div>

        <div className="hub-readout-divider" aria-hidden="true" />

        <div className="hub-readout-item">
          <span className="hub-readout-label">Track</span>
          <span className="hub-readout-value">{selectedTrack?.name ?? 'Not selected'}</span>
        </div>
      </div>
    </div>
  );
}

export default SessionHeader;

import { useCars } from '@/hooks/useCars.ts';
import { useTracks } from '@/hooks/useTracks.ts';

interface NewSessionPageProps {
  selectedCarId: string;
  selectedTrackId: string;
  onSelectCarId: (carId: string) => void;
  onSelectTrackId: (trackId: string) => void;
  onBack: () => void;
  onNext: () => void;
}

function NewSessionPage({
  selectedCarId,
  selectedTrackId,
  onSelectCarId,
  onSelectTrackId,
  onBack,
  onNext,
}: NewSessionPageProps) {
  const { data: cars, isLoading: carsLoading, isError: carsError } = useCars();
  const { data: tracks, isLoading: tracksLoading, isError: tracksError } = useTracks();

  return (
    <section className="view view-new" aria-label="New Session">
      <button type="button" className="back-button" onClick={onBack}>
        <span aria-hidden="true">&#8592;</span> Back
      </button>

      <header className="view-header">
        <h2 className="view-title">New Session</h2>
      </header>

      <div className="session-detail-grid">
        <div className="detail-card">
          <label className="detail-card-label" htmlFor="car-select">
            Car
          </label>
          <select
            id="car-select"
            className="detail-select"
            value={selectedCarId}
            onChange={(event) => onSelectCarId(event.target.value)}
            disabled={carsLoading}
          >
            <option value="">Select a GT3 car&hellip;</option>
            {cars?.map((car) => (
              <option key={car.id} value={car.id}>
                {car.name}
              </option>
            ))}
          </select>
          {carsLoading && <p className="detail-card-value">Loading cars&hellip;</p>}
          {carsError && <p className="detail-card-value">Failed to load cars.</p>}
        </div>

        <div className="detail-card">
          <label className="detail-card-label" htmlFor="track-select">
            Track
          </label>
          <select
            id="track-select"
            className="detail-select"
            value={selectedTrackId}
            onChange={(event) => onSelectTrackId(event.target.value)}
            disabled={tracksLoading}
          >
            <option value="">Select a track&hellip;</option>
            {tracks?.map((track) => (
              <option key={track.id} value={track.id}>
                {track.name}
              </option>
            ))}
          </select>
          {tracksLoading && <p className="detail-card-value">Loading tracks&hellip;</p>}
          {tracksError && <p className="detail-card-value">Failed to load tracks.</p>}
        </div>
      </div>

      <button type="button" className="submit-button" onClick={onNext}>
        Next
      </button>
    </section>
  );
}

export default NewSessionPage;

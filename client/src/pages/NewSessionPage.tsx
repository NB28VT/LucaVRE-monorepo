import { useState } from 'react';
import { isAxiosError } from 'axios';
import { useCars } from '@/hooks/useCars.ts';
import { useTracks } from '@/hooks/useTracks.ts';
import { useCreateWorkingSession } from '@/hooks/useCreateWorkingSession.ts';
import type { WorkingSessionValidationErrors } from '@/types/workingSession.ts';

interface NewSessionPageProps {
  selectedCarId: string;
  selectedTrackId: string;
  onSelectCarId: (carId: string, carName: string) => void;
  onSelectTrackId: (trackId: string, trackName: string) => void;
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
  const { mutate: createWorkingSession, isPending: isSubmitting } = useCreateWorkingSession();

  const [carValidationError, setCarValidationError] = useState<string | null>(null);
  const [trackValidationError, setTrackValidationError] = useState<string | null>(null);

  function handleSelectCarId(carId: string): void {
    setCarValidationError(null);
    const carName = cars?.find((car) => car.id === carId)?.name ?? '';
    onSelectCarId(carId, carName);
  }

  function handleSelectTrackId(trackId: string): void {
    setTrackValidationError(null);
    const trackName = tracks?.find((track) => track.id === trackId)?.name ?? '';
    onSelectTrackId(trackId, trackName);
  }

  function handleSubmit(): void {
    setCarValidationError(null);
    setTrackValidationError(null);

    createWorkingSession(
      { carId: selectedCarId, trackId: selectedTrackId },
      {
        onSuccess: onNext,
        onError: (error) => {
          if (isAxiosError<{ errors?: WorkingSessionValidationErrors }>(error) && error.response?.status === 422) {
            const errors = error.response.data?.errors;
            if (errors?.car_id) {
              setCarValidationError('Please select a car.');
            }
            if (errors?.track_id) {
              setTrackValidationError('Please select a track.');
            }
          }
        },
      },
    );
  }

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
            onChange={(event) => handleSelectCarId(event.target.value)}
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
          {carValidationError && <p className="detail-card-error">{carValidationError}</p>}
        </div>

        <div className="detail-card">
          <label className="detail-card-label" htmlFor="track-select">
            Track
          </label>
          <select
            id="track-select"
            className="detail-select"
            value={selectedTrackId}
            onChange={(event) => handleSelectTrackId(event.target.value)}
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
          {trackValidationError && <p className="detail-card-error">{trackValidationError}</p>}
        </div>
      </div>

      <button type="button" className="submit-button" onClick={handleSubmit} disabled={isSubmitting}>
        Submit
      </button>
    </section>
  );
}

export default NewSessionPage;

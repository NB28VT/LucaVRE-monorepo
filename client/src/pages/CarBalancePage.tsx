import { MOCK_REPORTED_SYMPTOMS } from '@/data/mockVehicleData.ts';
import SessionHeader from '@/components/SessionHeader.tsx';

interface CarBalancePageProps {
  carName: string;
  trackName: string;
  selectedSymptomId: string;
  onSelectSymptomId: (symptomId: string) => void;
  onBack: () => void;
  onSubmit: () => void;
}

function CarBalancePage({
  carName,
  trackName,
  selectedSymptomId,
  onSelectSymptomId,
  onBack,
  onSubmit,
}: CarBalancePageProps) {
  return (
    <section className="view view-balance" aria-label="Car Balance">
      <button type="button" className="back-button" onClick={onBack}>
        <span aria-hidden="true">&#8592;</span> Back
      </button>

      <SessionHeader carName={carName} trackName={trackName} />

      <header className="view-header">
        <h2 className="view-title">Car Balance</h2>
      </header>

      <div className="session-detail-grid">
        <div className="detail-card detail-card-wide">
          <label className="detail-card-label" htmlFor="symptom-select">
            Reported Symptom
          </label>
          <select
            id="symptom-select"
            className="detail-select"
            value={selectedSymptomId}
            onChange={(event) => onSelectSymptomId(event.target.value)}
          >
            <option value="">Select a symptom&hellip;</option>
            {MOCK_REPORTED_SYMPTOMS.map((symptom) => (
              <option key={symptom.id} value={symptom.id}>
                {symptom.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button type="button" className="submit-button" onClick={onSubmit}>
        Submit
      </button>
    </section>
  );
}

export default CarBalancePage;

import { MOCK_SUGGESTED_SETUP_CHANGES } from '@/data/mockVehicleData.ts';
import SessionHeader from '@/components/SessionHeader.tsx';
import ViewTopBar from '@/components/ViewTopBar.tsx';

interface ResultsPageProps {
  carName: string;
  trackName: string;
  onBack: () => void;
  onNewSession: () => void;
  onGoHome: () => void;
  onWorkOnAnotherSession: () => void;
}

function ResultsPage({
  carName,
  trackName,
  onBack,
  onNewSession,
  onGoHome,
  onWorkOnAnotherSession,
}: ResultsPageProps) {
  return (
    <section className="view view-results" aria-label="Suggested Setup Changes">
      <ViewTopBar onBack={onBack} onNewSession={onNewSession} onGoHome={onGoHome} />

      <SessionHeader carName={carName} trackName={trackName} />

      <div className="suggestions-card">
        <div className="suggestions-card-header">
          <span className="suggestions-card-eyebrow">Priority Adjustments</span>
          <span className="suggestions-card-count">
            {MOCK_SUGGESTED_SETUP_CHANGES.length} Items
          </span>
        </div>
        <ul className="suggestions-list">
          {MOCK_SUGGESTED_SETUP_CHANGES.map((change, index) => (
            <li key={change} className="suggestion-item">
              <span className="suggestion-item-index" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="suggestion-item-text">{change}</span>
            </li>
          ))}
        </ul>
      </div>

      <button type="button" className="submit-button" onClick={onWorkOnAnotherSession}>
        Work on Another Session
      </button>
    </section>
  );
}

export default ResultsPage;

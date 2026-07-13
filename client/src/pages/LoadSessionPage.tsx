import { MOCK_SAVED_SESSIONS } from '@/data/mockSessionData.ts';
import type { SavedSession } from '@/types/session.ts';

interface LoadSessionPageProps {
  onBack: () => void;
  onResumeSession: (session: SavedSession) => void;
}

function LoadSessionPage({ onBack, onResumeSession }: LoadSessionPageProps) {
  return (
    <section className="view view-load" aria-label="Load Session">
      <button type="button" className="back-button" onClick={onBack}>
        <span aria-hidden="true">&#8592;</span> Back
      </button>

      <header className="view-header">
        <h2 className="view-title">Load Session</h2>
        <p className="view-subtitle">Pick up where you left off.</p>
      </header>

      <ul className="session-list">
        {MOCK_SAVED_SESSIONS.map((session) => (
          <li key={session.id} className="session-card">
            <div className="session-card-info">
              <p className="session-card-title">
                {session.carName} @ {session.trackName}
              </p>
              <p className="session-card-date">{session.savedDate}</p>
            </div>
            <button
              type="button"
              className="session-card-resume"
              onClick={() => onResumeSession(session)}
            >
              Resume
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default LoadSessionPage;

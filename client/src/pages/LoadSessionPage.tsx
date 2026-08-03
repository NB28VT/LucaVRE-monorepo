import ViewTopBar from '@/components/ViewTopBar.tsx';
import { useWorkingSessions } from '@/hooks/useWorkingSessions.ts';
import type { WorkingSession } from '@/types/workingSession.ts';
import type { SavedSession } from '@/types/session.ts';

interface LoadSessionPageProps {
  onBack: () => void;
  onNewSession: () => void;
  onGoHome: () => void;
  onResumeSession: (session: SavedSession) => void;
}

function toSavedSession(session: WorkingSession): SavedSession {
  return {
    id: String(session.id),
    carName: session.car?.name ?? 'Unknown car',
    trackName: session.track?.name ?? 'Unknown track',
    savedDate: session.createdAt,
  };
}

function LoadSessionPage({ onBack, onNewSession, onGoHome, onResumeSession }: LoadSessionPageProps) {
  const { data: workingSessions, isLoading, isError } = useWorkingSessions();

  return (
    <section className="view view-load" aria-label="Load Session">
      <ViewTopBar onBack={onBack} onNewSession={onNewSession} onGoHome={onGoHome} />

      <header className="view-header">
        <h2 className="view-title">Load Session</h2>
        <p className="view-subtitle">Pick up where you left off.</p>
      </header>

      {isLoading && <p className="view-status">Loading saved sessions...</p>}

      {isError && (
        <p className="view-status view-status-error">
          Something went wrong loading your saved sessions. Please try again.
        </p>
      )}

      {!isLoading && !isError && workingSessions?.length === 0 && (
        <p className="view-status">No saved sessions yet.</p>
      )}

      {!isLoading && !isError && workingSessions && workingSessions.length > 0 && (
        <ul className="session-list">
          {workingSessions.map((session) => {
            const carName = session.car?.name ?? 'Unknown car';
            const trackName = session.track?.name ?? 'Unknown track';

            return (
              <li key={session.id} className="session-card">
                <div className="session-card-info">
                  <p className="session-card-title">
                    {carName} @ {trackName}
                  </p>
                  <p className="session-card-date">{session.createdAt}</p>
                </div>
                <button
                  type="button"
                  className="session-card-resume"
                  onClick={() => onResumeSession(toSavedSession(session))}
                >
                  Resume
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export default LoadSessionPage;

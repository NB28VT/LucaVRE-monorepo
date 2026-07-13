interface StartPageProps {
  onStartNewSession: () => void;
  onOpenLoadSession: () => void;
}

function StartPage({ onStartNewSession, onOpenLoadSession }: StartPageProps) {
  return (
    <section className="view view-start" aria-label="Start Session">
      <header className="app-header">
        <p className="app-eyebrow">LucaVRE</p>
        <h1 className="app-title">Setup Assistant</h1>
        <p className="app-subtitle">
          Diagnose GT3 handling issues and dial in your car setup for Le Mans Ultimate.
        </p>
      </header>

      <div className="action-grid">
        <button
          type="button"
          className="action-card action-card-primary"
          onClick={onStartNewSession}
        >
          <span className="action-card-icon" aria-hidden="true">
            +
          </span>
          <span className="action-card-label">New Session</span>
          <span className="action-card-hint">Start a fresh setup diagnosis</span>
        </button>

        <button
          type="button"
          className="action-card action-card-secondary"
          onClick={onOpenLoadSession}
        >
          <span className="action-card-icon" aria-hidden="true">
            &#8635;
          </span>
          <span className="action-card-label">Load Session</span>
          <span className="action-card-hint">Resume a saved tuning session</span>
        </button>
      </div>
    </section>
  );
}

export default StartPage;

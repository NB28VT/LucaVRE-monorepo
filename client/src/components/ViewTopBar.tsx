interface ViewTopBarProps {
  onBack: () => void;
  onNewSession: () => void;
  onGoHome: () => void;
}

function ViewTopBar({ onBack, onNewSession, onGoHome }: ViewTopBarProps) {
  return (
    <div className="view-top-bar">
      <button type="button" className="back-button" onClick={onBack}>
        <span aria-hidden="true">&#8592;</span> Back
      </button>
      <div className="nav-split-pill" role="group" aria-label="Quick navigation">
        <button type="button" className="nav-split-pill-button" aria-label="New Session" onClick={onNewSession}>
          <span aria-hidden="true">+</span>
        </button>
        <span className="nav-split-pill-divider" aria-hidden="true" />
        <button type="button" className="nav-split-pill-button" aria-label="Home" onClick={onGoHome}>
          <span aria-hidden="true">&#8962;</span>
        </button>
      </div>
    </div>
  );
}

export default ViewTopBar;

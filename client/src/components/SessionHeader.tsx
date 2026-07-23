interface SessionHeaderProps {
  carName: string;
  trackName: string;
}

function SessionHeader({ carName, trackName }: SessionHeaderProps) {
  return (
    <div className="hub-readout" role="group" aria-label="Active session">
      <p className="hub-readout-status">
        <span className="hub-readout-dot" aria-hidden="true" />
        Session Active
      </p>

      <div className="hub-readout-combo">
        <div className="hub-readout-item">
          <span className="hub-readout-label">Car</span>
          <span className="hub-readout-value">{carName || 'Not selected'}</span>
        </div>

        <div className="hub-readout-divider" aria-hidden="true" />

        <div className="hub-readout-item">
          <span className="hub-readout-label">Track</span>
          <span className="hub-readout-value">{trackName || 'Not selected'}</span>
        </div>
      </div>
    </div>
  );
}

export default SessionHeader;

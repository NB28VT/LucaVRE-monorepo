interface SessionHeaderProps {
  carName: string;
  trackName: string;
  statusLabel?: string;
}

function SessionHeader({
  carName,
  trackName,
  statusLabel = 'Session Active',
}: SessionHeaderProps) {
  return (
    <div className="hub-readout" role="group" aria-label="Active session">
      <div className="hub-readout-top">
        <p className="hub-readout-status">
          <span className="hub-readout-dot" aria-hidden="true" />
          {statusLabel}
        </p>
      </div>

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

interface HandlingCharacteristicRequiredModalProps {
  onClose: () => void;
}

function HandlingCharacteristicRequiredModal({
  onClose,
}: HandlingCharacteristicRequiredModalProps) {
  return (
    <div className="modal-overlay" role="presentation" onClick={onClose}>
      <div
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="handling-characteristic-required-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <h3 id="handling-characteristic-required-modal-title" className="modal-title">
            Please add at least one handling characteristic
          </h3>
          <button type="button" className="modal-close" aria-label="Close" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="modal-actions">
          <button type="button" className="submit-button" onClick={onClose}>
            Ok
          </button>
        </div>
      </div>
    </div>
  );
}

export default HandlingCharacteristicRequiredModal;

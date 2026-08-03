interface DeleteConfirmationModalProps {
  itemLabel: string;
  valueLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function DeleteConfirmationModal({
  itemLabel,
  valueLabel,
  onConfirm,
  onCancel,
}: DeleteConfirmationModalProps) {
  return (
    <div className="modal-overlay" role="presentation" onClick={onCancel}>
      <div
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-confirmation-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <h3 id="delete-confirmation-modal-title" className="modal-title">
            Delete Handling Characteristic?
          </h3>
          <button type="button" className="modal-close" aria-label="Close" onClick={onCancel}>
            &times;
          </button>
        </div>

        <div className="modal-body">
          <p className="modal-message">
            Are you sure you want to delete &quot;{itemLabel}: {valueLabel}&quot;? This cannot be
            undone.
          </p>
        </div>

        <div className="modal-actions modal-actions-split">
          <button type="button" className="button-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="button-danger" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmationModal;

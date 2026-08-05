interface DeleteConfirmationModalProps {
  itemLabel: string;
  valueLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  deleteError?: string | null;
  isDeleting?: boolean;
}

function DeleteConfirmationModal({
  itemLabel,
  valueLabel,
  onConfirm,
  onCancel,
  deleteError = null,
  isDeleting = false,
}: DeleteConfirmationModalProps) {
  return (
    <div
      className="modal-overlay"
      role="presentation"
      onClick={isDeleting ? undefined : onCancel}
    >
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
          <button
            type="button"
            className="modal-close"
            aria-label="Close"
            onClick={onCancel}
            disabled={isDeleting}
          >
            &times;
          </button>
        </div>

        <div className="modal-body">
          <p className="modal-message">
            Are you sure you want to delete &quot;{itemLabel}: {valueLabel}&quot;? This cannot be
            undone.
          </p>

          {deleteError && <p className="detail-card-error">{deleteError}</p>}
        </div>

        <div className="modal-actions modal-actions-split">
          <button
            type="button"
            className="button-secondary"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="button-danger"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmationModal;

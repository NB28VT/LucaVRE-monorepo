import { useState } from 'react';
import SessionHeader from '@/components/SessionHeader.tsx';
import ViewTopBar from '@/components/ViewTopBar.tsx';
import HandlingCharacteristicModal from '@/components/HandlingCharacteristicModal.tsx';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal.tsx';
import { LOCATION_LABELS, PHASE_LABELS, SYMPTOM_LABELS } from '@/types/handlingCharacteristic.ts';
import type {
  HandlingCharacteristic,
  Location,
  Phase,
  Symptom,
} from '@/types/handlingCharacteristic.ts';

interface CurrentSessionPageProps {
  carName: string;
  trackName: string;
  handlingCharacteristics: HandlingCharacteristic[];
  onAddHandlingCharacteristic: (characteristic: Omit<HandlingCharacteristic, 'id'>) => void;
  onUpdateHandlingCharacteristic: (
    id: string,
    updates: Omit<HandlingCharacteristic, 'id'>,
  ) => void;
  onDeleteHandlingCharacteristic: (id: string) => void;
  onBack: () => void;
  onNewSession: () => void;
  onGoHome: () => void;
  onSubmit: () => void;
}

function formatLocationPhaseLabel(characteristic: HandlingCharacteristic): string {
  const locationLabel = LOCATION_LABELS[characteristic.location];

  if (!characteristic.phase) {
    return locationLabel;
  }

  const phaseLabel = PHASE_LABELS[characteristic.phase];
  return `${locationLabel}, ${phaseLabel}`;
}

function formatCharacteristicLabel(characteristic: HandlingCharacteristic): string {
  const locationPhaseLabel = formatLocationPhaseLabel(characteristic);
  const symptomLabel = SYMPTOM_LABELS[characteristic.symptom];
  return `${locationPhaseLabel}: ${symptomLabel}`;
}

function isDuplicateLocationPhase(
  characteristics: HandlingCharacteristic[],
  location: Location,
  phase: Phase | null,
  excludingId: string | null,
): boolean {
  return characteristics.some(
    (characteristic) =>
      characteristic.id !== excludingId &&
      characteristic.location === location &&
      characteristic.phase === phase,
  );
}

function CurrentSessionPage({
  carName,
  trackName,
  handlingCharacteristics,
  onAddHandlingCharacteristic,
  onUpdateHandlingCharacteristic,
  onDeleteHandlingCharacteristic,
  onBack,
  onNewSession,
  onGoHome,
  onSubmit,
}: CurrentSessionPageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCharacteristicId, setEditingCharacteristicId] = useState<string | null>(null);
  const [draftLocation, setDraftLocation] = useState<Location | ''>('');
  const [draftPhase, setDraftPhase] = useState<Phase | ''>('');
  const [draftSymptom, setDraftSymptom] = useState<Symptom | ''>('');
  const [deletingCharacteristic, setDeletingCharacteristic] =
    useState<HandlingCharacteristic | null>(null);

  const isPhaseRequired = draftLocation !== '' && draftLocation !== 'global';
  const hasCompleteDraftSelection =
    draftLocation !== '' && draftSymptom !== '' && (!isPhaseRequired || draftPhase !== '');
  const isDraftDuplicate =
    hasCompleteDraftSelection &&
    isDuplicateLocationPhase(
      handlingCharacteristics,
      draftLocation as Location,
      isPhaseRequired ? (draftPhase as Phase) : null,
      editingCharacteristicId,
    );

  function handleOpenAddModal(): void {
    setEditingCharacteristicId(null);
    setDraftLocation('');
    setDraftPhase('');
    setDraftSymptom('');
    setIsModalOpen(true);
  }

  function handleOpenEditModal(characteristic: HandlingCharacteristic): void {
    setEditingCharacteristicId(characteristic.id);
    setDraftLocation(characteristic.location);
    setDraftPhase(characteristic.phase ?? '');
    setDraftSymptom(characteristic.symptom);
    setIsModalOpen(true);
  }

  function handleCloseModal(): void {
    setIsModalOpen(false);
  }

  function handleDraftLocationChange(location: string): void {
    setDraftLocation(location as Location | '');
    if (location === 'global') {
      setDraftPhase('');
    }
  }

  function handleSaveModal(): void {
    if (!draftLocation || !draftSymptom) {
      return;
    }

    if (isPhaseRequired && !draftPhase) {
      return;
    }

    const location = draftLocation as Location;
    const phase = isPhaseRequired ? (draftPhase as Phase) : null;
    const symptom = draftSymptom as Symptom;

    if (isDuplicateLocationPhase(handlingCharacteristics, location, phase, editingCharacteristicId)) {
      return;
    }

    if (editingCharacteristicId) {
      onUpdateHandlingCharacteristic(editingCharacteristicId, { location, phase, symptom });
    } else {
      onAddHandlingCharacteristic({ location, phase, symptom });
    }

    setIsModalOpen(false);
  }

  function handleOpenDeleteConfirm(characteristic: HandlingCharacteristic): void {
    setDeletingCharacteristic(characteristic);
  }

  function handleCancelDelete(): void {
    setDeletingCharacteristic(null);
  }

  function handleConfirmDelete(): void {
    if (!deletingCharacteristic) {
      return;
    }

    onDeleteHandlingCharacteristic(deletingCharacteristic.id);
    setDeletingCharacteristic(null);
  }

  return (
    <section className="view view-session" aria-label="Current Session">
      <ViewTopBar onBack={onBack} onNewSession={onNewSession} onGoHome={onGoHome} />

      <SessionHeader
        carName={carName}
        trackName={trackName}
        statusLabel="Current Session"
      />

      <div className="handling-characteristics-card">
        <div className="handling-characteristics-header">
          <h3 className="handling-characteristics-title">Handling Characteristics</h3>
        </div>

        {handlingCharacteristics.length === 0 ? (
          <p className="handling-characteristics-empty">No handling characteristics added yet.</p>
        ) : (
          <ul className="handling-characteristic-list">
            {handlingCharacteristics.map((characteristic) => {
              const locationLabel = LOCATION_LABELS[characteristic.location];
              const phaseLabel = characteristic.phase ? PHASE_LABELS[characteristic.phase] : null;
              const symptomLabel = SYMPTOM_LABELS[characteristic.symptom];
              const characteristicLabel = formatCharacteristicLabel(characteristic);

              return (
                <li key={characteristic.id} className="handling-characteristic-item">
                  <span className="handling-characteristic-value">{locationLabel}</span>
                  <div className="handling-characteristic-row">
                    <div className="handling-characteristic-details">
                      {phaseLabel && (
                        <span className="handling-characteristic-phase">Phase: {phaseLabel}</span>
                      )}
                      <span className="handling-characteristic-symptom">
                        <span aria-hidden="true">&#10007;</span>
                        {symptomLabel}
                      </span>
                    </div>
                    <div className="handling-characteristic-actions">
                      <button
                        type="button"
                        className="handling-characteristic-edit"
                        aria-label={`Edit ${characteristicLabel}`}
                        onClick={() => handleOpenEditModal(characteristic)}
                      >
                        &#9998;
                      </button>
                      <button
                        type="button"
                        className="handling-characteristic-delete"
                        aria-label={`Delete ${characteristicLabel}`}
                        onClick={() => handleOpenDeleteConfirm(characteristic)}
                      >
                        &#128465;
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <button type="button" className="add-characteristic-button" onClick={handleOpenAddModal}>
          + Add
        </button>
      </div>

      <button type="button" className="submit-button" onClick={onSubmit}>
        Diagnose
      </button>

      {isModalOpen && (
        <HandlingCharacteristicModal
          location={draftLocation}
          phase={draftPhase}
          symptom={draftSymptom}
          onLocationChange={handleDraftLocationChange}
          onPhaseChange={(phase) => setDraftPhase(phase as Phase | '')}
          onSymptomChange={(symptom) => setDraftSymptom(symptom as Symptom | '')}
          onSave={handleSaveModal}
          onClose={handleCloseModal}
          isDuplicate={isDraftDuplicate}
        />
      )}

      {deletingCharacteristic && (
        <DeleteConfirmationModal
          itemLabel={formatLocationPhaseLabel(deletingCharacteristic)}
          valueLabel={SYMPTOM_LABELS[deletingCharacteristic.symptom]}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </section>
  );
}

export default CurrentSessionPage;

import { useEffect, useState } from 'react';
import { isAxiosError } from 'axios';
import SessionHeader from '@/components/SessionHeader.tsx';
import ViewTopBar from '@/components/ViewTopBar.tsx';
import HandlingCharacteristicModal from '@/components/HandlingCharacteristicModal.tsx';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal.tsx';
import HandlingCharacteristicRequiredModal from '@/components/HandlingCharacteristicRequiredModal.tsx';
import { useCreateHandlingDeficit } from '@/hooks/useCreateHandlingDeficit.ts';
import { useUpdateHandlingDeficit } from '@/hooks/useUpdateHandlingDeficit.ts';
import { useDeleteHandlingDeficit } from '@/hooks/useDeleteHandlingDeficit.ts';
import { useHandlingDeficits } from '@/hooks/useHandlingDeficits.ts';
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
  workingSessionId: number | null;
  handlingCharacteristics: HandlingCharacteristic[];
  onHandlingCharacteristicsLoaded: (characteristics: HandlingCharacteristic[]) => void;
  onAddHandlingCharacteristic: (characteristic: HandlingCharacteristic) => void;
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
  workingSessionId,
  handlingCharacteristics,
  onHandlingCharacteristicsLoaded,
  onAddHandlingCharacteristic,
  onUpdateHandlingCharacteristic,
  onDeleteHandlingCharacteristic,
  onBack,
  onNewSession,
  onGoHome,
  onSubmit,
}: CurrentSessionPageProps) {
  const {
    data: handlingDeficits,
    isLoading: isLoadingDeficits,
    isError: isDeficitsError,
  } = useHandlingDeficits(workingSessionId);
  const { mutate: createHandlingDeficit, isPending: isCreatingDeficit } =
    useCreateHandlingDeficit();
  const { mutate: updateHandlingDeficit, isPending: isUpdatingDeficit } =
    useUpdateHandlingDeficit();
  const { mutate: deleteHandlingDeficit, isPending: isDeletingDeficit } =
    useDeleteHandlingDeficit();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCharacteristicId, setEditingCharacteristicId] = useState<string | null>(null);
  const [draftLocation, setDraftLocation] = useState<Location | ''>('');
  const [draftPhase, setDraftPhase] = useState<Phase | ''>('');
  const [draftSymptom, setDraftSymptom] = useState<Symptom | ''>('');
  const [saveError, setSaveError] = useState<string | null>(null);
  const [deletingCharacteristic, setDeletingCharacteristic] =
    useState<HandlingCharacteristic | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isRequirementModalOpen, setIsRequirementModalOpen] = useState(false);

  useEffect(() => {
    if (!handlingDeficits) {
      return;
    }

    onHandlingCharacteristicsLoaded(handlingDeficits);
  }, [handlingDeficits, onHandlingCharacteristicsLoaded]);

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
    setSaveError(null);
    setIsModalOpen(true);
  }

  function handleOpenEditModal(characteristic: HandlingCharacteristic): void {
    setEditingCharacteristicId(characteristic.id);
    setDraftLocation(characteristic.location);
    setDraftPhase(characteristic.phase ?? '');
    setDraftSymptom(characteristic.symptom);
    setSaveError(null);
    setIsModalOpen(true);
  }

  function handleCloseModal(): void {
    setIsModalOpen(false);
    setSaveError(null);
  }

  function handleDraftLocationChange(location: string): void {
    setSaveError(null);
    setDraftLocation(location as Location | '');
    if (location === 'global') {
      setDraftPhase('');
    }
  }

  function handleDraftPhaseChange(phase: string): void {
    setSaveError(null);
    setDraftPhase(phase as Phase | '');
  }

  function handleDraftSymptomChange(symptom: string): void {
    setSaveError(null);
    setDraftSymptom(symptom as Symptom | '');
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
      if (workingSessionId == null) {
        return;
      }

      setSaveError(null);
      updateHandlingDeficit(
        { id: editingCharacteristicId, workingSessionId, location, phase, symptom },
        {
          onSuccess: (characteristic) => {
            onUpdateHandlingCharacteristic(characteristic.id, {
              location: characteristic.location,
              phase: characteristic.phase,
              symptom: characteristic.symptom,
            });
            setIsModalOpen(false);
            setSaveError(null);
          },
          onError: (error) => {
            if (
              isAxiosError<{ errors?: string[] }>(error) &&
              Array.isArray(error.response?.data?.errors)
            ) {
              setSaveError(error.response.data.errors.join(' '));
              return;
            }

            setSaveError('Failed to save handling characteristic.');
          },
        },
      );
      return;
    }

    if (workingSessionId == null) {
      return;
    }

    setSaveError(null);
    createHandlingDeficit(
      { workingSessionId, location, phase, symptom },
      {
        onSuccess: (characteristic) => {
          onAddHandlingCharacteristic(characteristic);
          setIsModalOpen(false);
          setSaveError(null);
        },
        onError: (error) => {
          if (isAxiosError<{ errors?: string[] }>(error) && Array.isArray(error.response?.data?.errors)) {
            setSaveError(error.response.data.errors.join(' '));
            return;
          }

          setSaveError('Failed to save handling characteristic.');
        },
      },
    );
  }

  function handleOpenDeleteConfirm(characteristic: HandlingCharacteristic): void {
    setDeleteError(null);
    setDeletingCharacteristic(characteristic);
  }

  function handleCancelDelete(): void {
    setDeletingCharacteristic(null);
    setDeleteError(null);
  }

  function handleDiagnoseAttempt(): void {
    if (handlingCharacteristics.length > 0) {
      return;
    }

    setIsRequirementModalOpen(true);
  }

  function handleConfirmDelete(): void {
    if (!deletingCharacteristic || workingSessionId == null) {
      return;
    }

    setDeleteError(null);
    deleteHandlingDeficit(
      { id: deletingCharacteristic.id, workingSessionId },
      {
        onSuccess: () => {
          onDeleteHandlingCharacteristic(deletingCharacteristic.id);
          setDeletingCharacteristic(null);
          setDeleteError(null);
        },
        onError: (error) => {
          if (
            isAxiosError<{ errors?: string[] }>(error) &&
            Array.isArray(error.response?.data?.errors)
          ) {
            setDeleteError(error.response.data.errors.join(' '));
            return;
          }

          setDeleteError('Failed to delete handling characteristic.');
        },
      },
    );
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

        {isLoadingDeficits && (
          <p className="handling-characteristics-empty">Loading handling characteristics...</p>
        )}

        {isDeficitsError && (
          <p className="handling-characteristics-empty">
            Failed to load handling characteristics.
          </p>
        )}

        {!isLoadingDeficits && !isDeficitsError && handlingCharacteristics.length === 0 ? (
          <p className="handling-characteristics-empty">No handling characteristics added yet.</p>
        ) : null}

        {!isLoadingDeficits && !isDeficitsError && handlingCharacteristics.length > 0 ? (
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
        ) : null}

        <button type="button" className="add-characteristic-button" onClick={handleOpenAddModal}>
          + Add
        </button>
      </div>

      <div className="diagnose-button-hit" onClick={handleDiagnoseAttempt}>
        <button
          type="button"
          className="submit-button diagnose-button"
          onClick={onSubmit}
          disabled={handlingCharacteristics.length === 0}
        >
          Diagnose
        </button>
      </div>

      {isRequirementModalOpen && (
        <HandlingCharacteristicRequiredModal onClose={() => setIsRequirementModalOpen(false)} />
      )}

      {isModalOpen && (
        <HandlingCharacteristicModal
          location={draftLocation}
          phase={draftPhase}
          symptom={draftSymptom}
          onLocationChange={handleDraftLocationChange}
          onPhaseChange={handleDraftPhaseChange}
          onSymptomChange={handleDraftSymptomChange}
          onSave={handleSaveModal}
          onClose={handleCloseModal}
          isDuplicate={isDraftDuplicate}
          saveError={saveError}
          isSaving={isCreatingDeficit || isUpdatingDeficit}
        />
      )}

      {deletingCharacteristic && (
        <DeleteConfirmationModal
          itemLabel={formatLocationPhaseLabel(deletingCharacteristic)}
          valueLabel={SYMPTOM_LABELS[deletingCharacteristic.symptom]}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          deleteError={deleteError}
          isDeleting={isDeletingDeficit}
        />
      )}
    </section>
  );
}

export default CurrentSessionPage;

import {
  LOCATION_OPTIONS,
  PHASE_OPTIONS,
  SYMPTOM_OPTIONS,
} from '@/types/handlingCharacteristic.ts';
import type { Location, Phase, Symptom } from '@/types/handlingCharacteristic.ts';

interface HandlingCharacteristicModalProps {
  location: Location | '';
  phase: Phase | '';
  symptom: Symptom | '';
  onLocationChange: (location: string) => void;
  onPhaseChange: (phase: string) => void;
  onSymptomChange: (symptom: string) => void;
  onSave: () => void;
  onClose: () => void;
  isDuplicate: boolean;
  saveError?: string | null;
  isSaving?: boolean;
}

function HandlingCharacteristicModal({
  location,
  phase,
  symptom,
  onLocationChange,
  onPhaseChange,
  onSymptomChange,
  onSave,
  onClose,
  isDuplicate,
  saveError = null,
  isSaving = false,
}: HandlingCharacteristicModalProps) {
  const isPhaseDisabled = location === 'global';
  const isPhaseRequired = location !== '' && !isPhaseDisabled;
  const canSave =
    location !== '' &&
    symptom !== '' &&
    (!isPhaseRequired || phase !== '') &&
    !isDuplicate &&
    !isSaving;

  return (
    <div className="modal-overlay" role="presentation" onClick={onClose}>
      <div
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="handling-characteristic-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <h3 id="handling-characteristic-modal-title" className="modal-title">
            Handling Characteristic
          </h3>
          <button type="button" className="modal-close" aria-label="Close" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="modal-body">
          <label className="detail-card-label" htmlFor="location-select">
            Location
          </label>
          <select
            id="location-select"
            className="detail-select"
            value={location}
            onChange={(event) => onLocationChange(event.target.value)}
          >
            <option value="">Select a location&hellip;</option>
            {LOCATION_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <label className="detail-card-label" htmlFor="phase-select">
            Phase
          </label>
          <select
            id="phase-select"
            className="detail-select"
            value={phase}
            disabled={isPhaseDisabled}
            onChange={(event) => onPhaseChange(event.target.value)}
          >
            <option value="">Select a phase&hellip;</option>
            {PHASE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <label className="detail-card-label" htmlFor="symptom-select">
            Symptom
          </label>
          <select
            id="symptom-select"
            className="detail-select"
            value={symptom}
            onChange={(event) => onSymptomChange(event.target.value)}
          >
            <option value="">Select a symptom&hellip;</option>
            {SYMPTOM_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {isDuplicate && (
            <p className="detail-card-error">
              This location and phase combination has already been added.
            </p>
          )}

          {saveError && <p className="detail-card-error">{saveError}</p>}
        </div>

        <div className="modal-actions">
          <button type="button" className="submit-button" onClick={onSave} disabled={!canSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default HandlingCharacteristicModal;

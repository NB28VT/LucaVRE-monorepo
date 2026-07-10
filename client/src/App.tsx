import { useState } from 'react';
import {
  MOCK_CARS,
  MOCK_TRACKS,
  MOCK_REPORTED_SYMPTOMS,
  MOCK_SUGGESTED_SETUP_CHANGES,
} from '@/data/mockVehicleData.ts';
import './App.css';

type CurrentView = 'start' | 'load' | 'new' | 'balance' | 'results';

interface SavedSession {
  id: string;
  carName: string;
  trackName: string;
  savedDate: string;
}

const MOCK_SAVED_SESSIONS: SavedSession[] = [
  {
    id: 'session-1',
    carName: 'Porsche 911 GT3 R',
    trackName: 'Spa-Francorchamps',
    savedDate: '2026-05-12',
  },
  {
    id: 'session-2',
    carName: 'Ferrari 296 GT3',
    trackName: 'Circuit de la Sarthe',
    savedDate: '2026-05-08',
  },
  {
    id: 'session-3',
    carName: 'BMW M4 GT3',
    trackName: 'Silverstone',
    savedDate: '2026-04-30',
  },
  {
    id: 'session-4',
    carName: 'Aston Martin Vantage GT3',
    trackName: 'Monza',
    savedDate: '2026-04-21',
  },
];

function App() {
  const [currentView, setCurrentView] = useState<CurrentView>('start');
  const [selectedCarId, setSelectedCarId] = useState<string>('');
  const [selectedTrackId, setSelectedTrackId] = useState<string>('');
  const [selectedSymptomId, setSelectedSymptomId] = useState<string>('');

  function handleStartNewSession(): void {
    setCurrentView('new');
  }

  function handleOpenLoadSession(): void {
    setCurrentView('load');
  }

  function handleReturnToStart(): void {
    setCurrentView('start');
  }

  function handleResumeSession(session: SavedSession): void {
    setCurrentView('new');
    void session;
  }

  function handleGoToCarBalance(): void {
    setCurrentView('balance');
  }

  function handleReturnToCarTrack(): void {
    setCurrentView('new');
  }

  function handleSubmitDiagnosis(): void {
    setCurrentView('results');
  }

  function handleReturnToSession(): void {
    setCurrentView('balance');
  }

  function handleWorkOnAnotherSession(): void {
    setSelectedCarId('');
    setSelectedTrackId('');
    setSelectedSymptomId('');
    setCurrentView('start');
  }

  function renderStartPage() {
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
            onClick={handleStartNewSession}
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
            onClick={handleOpenLoadSession}
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

  function renderLoadPage() {
    return (
      <section className="view view-load" aria-label="Load Session">
        <button type="button" className="back-button" onClick={handleReturnToStart}>
          <span aria-hidden="true">&#8592;</span> Back
        </button>

        <header className="view-header">
          <h2 className="view-title">Load Session</h2>
          <p className="view-subtitle">Pick up where you left off.</p>
        </header>

        <ul className="session-list">
          {MOCK_SAVED_SESSIONS.map((session) => (
            <li key={session.id} className="session-card">
              <div className="session-card-info">
                <p className="session-card-title">
                  {session.carName} @ {session.trackName}
                </p>
                <p className="session-card-date">{session.savedDate}</p>
              </div>
              <button
                type="button"
                className="session-card-resume"
                onClick={() => handleResumeSession(session)}
              >
                Resume
              </button>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  function renderNewPage() {
    return (
      <section className="view view-new" aria-label="New Session">
        <button type="button" className="back-button" onClick={handleReturnToStart}>
          <span aria-hidden="true">&#8592;</span> Back
        </button>

        <header className="view-header">
          <h2 className="view-title">New Session</h2>
        </header>

        <div className="session-detail-grid">
          <div className="detail-card">
            <label className="detail-card-label" htmlFor="car-select">
              Car
            </label>
            <select
              id="car-select"
              className="detail-select"
              value={selectedCarId}
              onChange={(event) => setSelectedCarId(event.target.value)}
            >
              <option value="">Select a GT3 car&hellip;</option>
              {MOCK_CARS.map((car) => (
                <option key={car.id} value={car.id}>
                  {car.name}
                </option>
              ))}
            </select>
          </div>

          <div className="detail-card">
            <label className="detail-card-label" htmlFor="track-select">
              Track
            </label>
            <select
              id="track-select"
              className="detail-select"
              value={selectedTrackId}
              onChange={(event) => setSelectedTrackId(event.target.value)}
            >
              <option value="">Select a track&hellip;</option>
              {MOCK_TRACKS.map((track) => (
                <option key={track.id} value={track.id}>
                  {track.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button type="button" className="submit-button" onClick={handleGoToCarBalance}>
          Next
        </button>
      </section>
    );
  }

  function renderSessionHeader() {
    const selectedCar = MOCK_CARS.find((car) => car.id === selectedCarId);
    const selectedTrack = MOCK_TRACKS.find((track) => track.id === selectedTrackId);

    return (
      <div className="hub-readout" role="group" aria-label="Active session">
        <p className="hub-readout-status">
          <span className="hub-readout-dot" aria-hidden="true" />
          Session Active
        </p>

        <div className="hub-readout-combo">
          <div className="hub-readout-item">
            <span className="hub-readout-label">Car</span>
            <span className="hub-readout-value">{selectedCar?.name ?? 'Not selected'}</span>
          </div>

          <div className="hub-readout-divider" aria-hidden="true" />

          <div className="hub-readout-item">
            <span className="hub-readout-label">Track</span>
            <span className="hub-readout-value">{selectedTrack?.name ?? 'Not selected'}</span>
          </div>
        </div>
      </div>
    );
  }

  function renderBalancePage() {
    return (
      <section className="view view-balance" aria-label="Car Balance">
        <button type="button" className="back-button" onClick={handleReturnToCarTrack}>
          <span aria-hidden="true">&#8592;</span> Back
        </button>

        {renderSessionHeader()}

        <header className="view-header">
          <h2 className="view-title">Car Balance</h2>
        </header>

        <div className="session-detail-grid">
          <div className="detail-card detail-card-wide">
            <label className="detail-card-label" htmlFor="symptom-select">
              Reported Symptom
            </label>
            <select
              id="symptom-select"
              className="detail-select"
              value={selectedSymptomId}
              onChange={(event) => setSelectedSymptomId(event.target.value)}
            >
              <option value="">Select a symptom&hellip;</option>
              {MOCK_REPORTED_SYMPTOMS.map((symptom) => (
                <option key={symptom.id} value={symptom.id}>
                  {symptom.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button type="button" className="submit-button" onClick={handleSubmitDiagnosis}>
          Submit
        </button>
      </section>
    );
  }

  function renderResultsPage() {
    return (
      <section className="view view-results" aria-label="Suggested Setup Changes">
        <button type="button" className="back-button" onClick={handleReturnToSession}>
          <span aria-hidden="true">&#8592;</span> Back
        </button>

        {renderSessionHeader()}

        <div className="suggestions-card">
          <div className="suggestions-card-header">
            <span className="suggestions-card-eyebrow">Priority Adjustments</span>
            <span className="suggestions-card-count">
              {MOCK_SUGGESTED_SETUP_CHANGES.length} Items
            </span>
          </div>
          <ul className="suggestions-list">
            {MOCK_SUGGESTED_SETUP_CHANGES.map((change, index) => (
              <li key={change} className="suggestion-item">
                <span className="suggestion-item-index" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="suggestion-item-text">{change}</span>
              </li>
            ))}
          </ul>
        </div>

        <button type="button" className="submit-button" onClick={handleWorkOnAnotherSession}>
          Work on Another Session
        </button>
      </section>
    );
  }

  function renderCurrentView() {
    switch (currentView) {
      case 'start':
        return renderStartPage();
      case 'load':
        return renderLoadPage();
      case 'new':
        return renderNewPage();
      case 'balance':
        return renderBalancePage();
      case 'results':
        return renderResultsPage();
      default:
        return renderStartPage();
    }
  }

  return (
    <div className="app-shell">
      <div className="app-container">{renderCurrentView()}</div>
    </div>
  );
}

export default App;

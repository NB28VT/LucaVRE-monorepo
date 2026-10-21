import { useRef, useState } from 'react';
import type { CurrentView, SavedSession } from '@/types/session.ts';
import type { HandlingCharacteristic } from '@/types/handlingCharacteristic.ts';
import type { SetupRecommendations } from '@/types/diagnostic.ts';
import type { WorkingSession } from '@/types/workingSession.ts';
import StartPage from '@/pages/StartPage.tsx';
import LoadSessionPage from '@/pages/LoadSessionPage.tsx';
import NewSessionPage from '@/pages/NewSessionPage.tsx';
import CurrentSessionPage from '@/pages/CurrentSessionPage.tsx';
import ResultsPage from '@/pages/ResultsPage.tsx';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState<CurrentView>('start');
  const [selectedCarId, setSelectedCarId] = useState<string>('');
  const [selectedCarName, setSelectedCarName] = useState<string>('');
  const [selectedTrackId, setSelectedTrackId] = useState<string>('');
  const [selectedTrackName, setSelectedTrackName] = useState<string>('');
  const [workingSessionId, setWorkingSessionId] = useState<number | null>(null);
  const [handlingCharacteristics, setHandlingCharacteristics] = useState<
    HandlingCharacteristic[]
  >([]);
  const [recommendations, setRecommendations] = useState<SetupRecommendations | null>(null);
  const seededSessionIdRef = useRef<number | null>(null);

  function handleSelectCarId(carId: string, carName: string): void {
    setSelectedCarId(carId);
    setSelectedCarName(carName);
  }

  function handleSelectTrackId(trackId: string, trackName: string): void {
    setSelectedTrackId(trackId);
    setSelectedTrackName(trackName);
  }

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
    const sessionId = Number(session.id);
    setSelectedCarName(session.carName);
    setSelectedTrackName(session.trackName);
    if (sessionId !== workingSessionId) {
      setHandlingCharacteristics([]);
      seededSessionIdRef.current = null;
    }
    setWorkingSessionId(sessionId);
    setCurrentView('session');
  }

  function handleGoToCurrentSession(session: WorkingSession): void {
    if (session.id !== workingSessionId) {
      setHandlingCharacteristics([]);
      seededSessionIdRef.current = null;
    }
    setWorkingSessionId(session.id);
    setCurrentView('session');
  }

  function handleReturnToCarTrack(): void {
    setCurrentView('new');
  }

  function handleSubmitDiagnosis(nextRecommendations: SetupRecommendations): void {
    setRecommendations(nextRecommendations);
    setCurrentView('results');
  }

  function handleReturnToSession(): void {
    setCurrentView('session');
  }

  function handleWorkOnAnotherSession(): void {
    setSelectedCarId('');
    setSelectedCarName('');
    setSelectedTrackId('');
    setSelectedTrackName('');
    setWorkingSessionId(null);
    setHandlingCharacteristics([]);
    setRecommendations(null);
    seededSessionIdRef.current = null;
    setCurrentView('start');
  }

  function handleHandlingCharacteristicsLoaded(
    characteristics: HandlingCharacteristic[],
  ): void {
    if (workingSessionId == null) {
      return;
    }
    if (seededSessionIdRef.current === workingSessionId) {
      return;
    }
    seededSessionIdRef.current = workingSessionId;
    setHandlingCharacteristics(characteristics);
  }

  function handleAddHandlingCharacteristic(characteristic: HandlingCharacteristic): void {
    setHandlingCharacteristics((characteristics) => [...characteristics, characteristic]);
  }

  function handleUpdateHandlingCharacteristic(
    id: string,
    updates: Omit<HandlingCharacteristic, 'id'>,
  ): void {
    setHandlingCharacteristics((characteristics) =>
      characteristics.map((characteristic) =>
        characteristic.id === id ? { id, ...updates } : characteristic,
      ),
    );
  }

  function handleDeleteHandlingCharacteristic(id: string): void {
    setHandlingCharacteristics((characteristics) =>
      characteristics.filter((characteristic) => characteristic.id !== id),
    );
  }

  function renderCurrentView() {
    switch (currentView) {
      case 'start':
        return (
          <StartPage
            onStartNewSession={handleStartNewSession}
            onOpenLoadSession={handleOpenLoadSession}
          />
        );
      case 'load':
        return (
          <LoadSessionPage
            onBack={handleReturnToStart}
            onNewSession={handleStartNewSession}
            onGoHome={handleReturnToStart}
            onResumeSession={handleResumeSession}
          />
        );
      case 'new':
        return (
          <NewSessionPage
            selectedCarId={selectedCarId}
            selectedTrackId={selectedTrackId}
            onSelectCarId={handleSelectCarId}
            onSelectTrackId={handleSelectTrackId}
            onBack={handleReturnToStart}
            onNewSession={handleStartNewSession}
            onGoHome={handleReturnToStart}
            onNext={handleGoToCurrentSession}
          />
        );
      case 'session':
        return (
          <CurrentSessionPage
            carName={selectedCarName}
            trackName={selectedTrackName}
            workingSessionId={workingSessionId}
            handlingCharacteristics={handlingCharacteristics}
            onHandlingCharacteristicsLoaded={handleHandlingCharacteristicsLoaded}
            onAddHandlingCharacteristic={handleAddHandlingCharacteristic}
            onUpdateHandlingCharacteristic={handleUpdateHandlingCharacteristic}
            onDeleteHandlingCharacteristic={handleDeleteHandlingCharacteristic}
            onBack={handleReturnToCarTrack}
            onNewSession={handleStartNewSession}
            onGoHome={handleReturnToStart}
            onSubmit={handleSubmitDiagnosis}
          />
        );
      case 'results':
        if (!recommendations) {
          return null;
        }

        return (
          <ResultsPage
            carName={selectedCarName}
            trackName={selectedTrackName}
            recommendations={recommendations}
            onBack={handleReturnToSession}
            onNewSession={handleStartNewSession}
            onGoHome={handleReturnToStart}
            onWorkOnAnotherSession={handleWorkOnAnotherSession}
          />
        );
      default:
        return (
          <StartPage
            onStartNewSession={handleStartNewSession}
            onOpenLoadSession={handleOpenLoadSession}
          />
        );
    }
  }

  return (
    <div className="app-shell">
      <div className="app-container">{renderCurrentView()}</div>
    </div>
  );
}

export default App;

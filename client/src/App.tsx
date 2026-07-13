import { useState } from 'react';
import type { CurrentView, SavedSession } from '@/types/session.ts';
import StartPage from '@/pages/StartPage.tsx';
import LoadSessionPage from '@/pages/LoadSessionPage.tsx';
import NewSessionPage from '@/pages/NewSessionPage.tsx';
import CarBalancePage from '@/pages/CarBalancePage.tsx';
import ResultsPage from '@/pages/ResultsPage.tsx';
import './App.css';

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
          <LoadSessionPage onBack={handleReturnToStart} onResumeSession={handleResumeSession} />
        );
      case 'new':
        return (
          <NewSessionPage
            selectedCarId={selectedCarId}
            selectedTrackId={selectedTrackId}
            onSelectCarId={setSelectedCarId}
            onSelectTrackId={setSelectedTrackId}
            onBack={handleReturnToStart}
            onNext={handleGoToCarBalance}
          />
        );
      case 'balance':
        return (
          <CarBalancePage
            selectedCarId={selectedCarId}
            selectedTrackId={selectedTrackId}
            selectedSymptomId={selectedSymptomId}
            onSelectSymptomId={setSelectedSymptomId}
            onBack={handleReturnToCarTrack}
            onSubmit={handleSubmitDiagnosis}
          />
        );
      case 'results':
        return (
          <ResultsPage
            selectedCarId={selectedCarId}
            selectedTrackId={selectedTrackId}
            onBack={handleReturnToSession}
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

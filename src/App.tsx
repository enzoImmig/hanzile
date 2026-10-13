import { useState, useEffect } from 'react';
import { useGame } from './hooks/useGame';
import { Header } from './components/Header';
import { CharacterSearch } from './components/CharacterSearch';
import { GameGrid } from './components/GameGrid';
import { HelpModal } from './components/HelpModal';
import { GameOverModal } from './components/GameOverModal';
import { StatsModal } from './components/StatsModal';
import { HskFilterBar } from './components/HskFilterBar';

export function App() {
  const {
    vocabulary,
    isLoading,
    mode,
    setMode,
    targetChar,
    guesses,
    status,
    stats,
    selectedHskLevels,
    setSelectedHskLevels,
    practicePoolCount,
    makeGuess,
    restartPractice,
  } = useGame();

  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isGameOverOpen, setIsGameOverOpen] = useState(false);

  // Aplica classe .dark no HTML
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [isDarkMode]);

  // Abre modal de fim de jogo após vitória ou derrota
  useEffect(() => {
    if (status === 'won' || status === 'lost') {
      const timer = setTimeout(() => {
        setIsGameOverOpen(true);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [status]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-canvas text-app-secondary flex flex-col items-center justify-center">
        <div className="font-cjk text-4xl text-accent-red font-bold animate-pulse mb-3">
          汉字乐
        </div>
        <p className="font-mono text-xs text-app-muted">Carregando ideogramas...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas text-app-primary flex flex-col transition-colors">
      {/* Cabeçalho */}
      <Header
        mode={mode}
        onModeChange={(newMode) => {
          setMode(newMode);
          setIsGameOverOpen(false);
        }}
        onOpenHelp={() => setIsHelpOpen(true)}
        onOpenStats={() => setIsStatsOpen(true)}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode((prev) => !prev)}
        onRestartPractice={restartPractice}
      />

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-3 py-6 flex flex-col items-center">
        {/* Barra de Status */}
        <div className="w-full flex justify-between items-center text-xs text-app-muted pb-3 mb-4 border-b border-app-border">
          <div>
            Modo:{' '}
            <strong className="text-app-secondary uppercase font-semibold">
              {mode === 'daily' ? 'Desafio Diário' : 'Treino Livre'}
            </strong>
          </div>
          <div>
            Tentativa{' '}
            <strong className="text-app-primary font-mono font-bold">
              {Math.min(6, guesses.length + (status === 'playing' ? 1 : 0))}
            </strong>{' '}
            de{' '}
            <strong className="text-app-primary font-mono font-bold">6</strong>
          </div>
        </div>

        {/* Filtros de HSK (exclusivo do Modo Treino) */}
        {mode === 'practice' && (
          <HskFilterBar
            selectedLevels={selectedHskLevels}
            onChangeLevels={setSelectedHskLevels}
            poolCount={practicePoolCount}
            onRestartPractice={restartPractice}
          />
        )}

        {/* Campo de Entrada de Chute */}
        <CharacterSearch
          vocabulary={vocabulary}
          onGuess={makeGuess}
          disabled={status !== 'playing'}
        />

        {/* Grade de 7 Colunas */}
        <GameGrid guesses={guesses} maxGuesses={6} />
      </main>

      {/* Modais */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      <StatsModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        stats={stats}
      />
      <GameOverModal
        isOpen={isGameOverOpen}
        onClose={() => setIsGameOverOpen(false)}
        status={status}
        targetChar={targetChar}
        guesses={guesses}
        mode={mode}
        onRestartPractice={restartPractice}
      />
    </div>
  );
}
export default App;

import React from 'react';
import { HelpCircle, BarChart2, Sun, Moon, RotateCcw } from 'lucide-react';
import { GameMode } from '../types/game';

interface HeaderProps {
  mode: GameMode;
  onModeChange: (mode: GameMode) => void;
  onOpenHelp: () => void;
  onOpenStats: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onRestartPractice?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  onModeChange,
  onOpenHelp,
  onOpenStats,
  isDarkMode,
  onToggleTheme,
  onRestartPractice,
}) => {
  return (
    <header className="h-14 border-b border-app-border bg-surface px-4 md:px-6 sticky top-0 z-40 flex items-center justify-between">
      {/* Lado Esquerdo: Ajuda e Modos */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenHelp}
          className="w-8 h-8 rounded border border-app-border text-app-secondary hover:text-app-primary hover:bg-surface-hover hover:border-app-border-strong flex items-center justify-center transition-colors"
          title="Como Jogar"
        >
          <HelpCircle className="w-4 h-4 stroke-[1.8]" />
        </button>

        <div className="bg-surface-elevated border border-app-border p-0.5 rounded flex gap-0.5 text-xs font-medium">
          <button
            onClick={() => onModeChange('daily')}
            className={`px-2.5 py-1 rounded transition-colors ${
              mode === 'daily'
                ? 'bg-accent-purple text-white font-semibold'
                : 'text-app-secondary hover:text-app-primary'
            }`}
          >
            Diário
          </button>
          <button
            onClick={() => onModeChange('practice')}
            className={`px-2.5 py-1 rounded transition-colors ${
              mode === 'practice'
                ? 'bg-accent-purple text-white font-semibold'
                : 'text-app-secondary hover:text-app-primary'
            }`}
          >
            Treino
          </button>
        </div>

        {mode === 'practice' && onRestartPractice && (
          <button
            onClick={onRestartPractice}
            className="w-8 h-8 rounded border border-app-border text-app-secondary hover:text-app-primary hover:bg-surface-hover flex items-center justify-center transition-colors ml-1"
            title="Novo Caractere (Treino)"
          >
            <RotateCcw className="w-4 h-4 stroke-[1.8]" />
          </button>
        )}
      </div>

      {/* Centro: Título Minimalista com Vermelho Cinábrio */}
      <div className="flex items-baseline gap-2 select-none">
        <span className="text-xl font-bold tracking-[0.16em] text-app-primary font-sans">
          HANZILE
        </span>
        <span className="font-cjk text-base font-bold text-accent-red tracking-wider">
          汉字乐
        </span>
      </div>

      {/* Lado Direito: Tema e Estatísticas */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleTheme}
          className="w-8 h-8 rounded border border-app-border text-app-secondary hover:text-app-primary hover:bg-surface-hover flex items-center justify-center transition-colors"
          title={isDarkMode ? 'Modo Claro' : 'Modo Escuro'}
        >
          {isDarkMode ? (
            <Sun className="w-4 h-4 stroke-[1.8]" />
          ) : (
            <Moon className="w-4 h-4 stroke-[1.8]" />
          )}
        </button>

        <button
          onClick={onOpenStats}
          className="w-8 h-8 rounded border border-app-border text-app-secondary hover:text-app-primary hover:bg-surface-hover flex items-center justify-center transition-colors"
          title="Estatísticas"
        >
          <BarChart2 className="w-4 h-4 stroke-[1.8]" />
        </button>
      </div>
    </header>
  );
};

import React from 'react';
import { X } from 'lucide-react';
import { GameStats } from '../types/game';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: GameStats;
}

export const StatsModal: React.FC<StatsModalProps> = ({ isOpen, onClose, stats }) => {
  if (!isOpen) return null;

  const winPercentage =
    stats.gamesPlayed > 0
      ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100)
      : 0;

  const maxFreq = Math.max(1, ...Object.values(stats.guessDistribution));

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-[2px] flex items-center justify-center p-4">
      <div className="bg-surface border border-app-border-strong rounded-lg max-w-sm w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-app-muted hover:text-app-primary"
        >
          <X className="w-5 h-5 stroke-[1.8]" />
        </button>

        <h3 className="text-base font-bold text-app-primary mb-4 text-center">
          Estatísticas
        </h3>

        {/* Indicadores Principais */}
        <div className="grid grid-cols-4 gap-2 text-center mb-6">
          <div className="bg-surface-elevated p-2 rounded border border-app-border">
            <div className="font-mono text-xl font-bold text-app-primary">
              {stats.gamesPlayed}
            </div>
            <div className="text-[10px] text-app-muted uppercase">Jogos</div>
          </div>

          <div className="bg-surface-elevated p-2 rounded border border-app-border">
            <div className="font-mono text-xl font-bold text-app-primary">
              {winPercentage}%
            </div>
            <div className="text-[10px] text-app-muted uppercase">Vitórias</div>
          </div>

          <div className="bg-surface-elevated p-2 rounded border border-app-border">
            <div className="font-mono text-xl font-bold text-app-primary">
              {stats.currentStreak}
            </div>
            <div className="text-[10px] text-app-muted uppercase">Sequência</div>
          </div>

          <div className="bg-surface-elevated p-2 rounded border border-app-border">
            <div className="font-mono text-xl font-bold text-app-primary">
              {stats.maxStreak}
            </div>
            <div className="text-[10px] text-app-muted uppercase">Melhor</div>
          </div>
        </div>

        {/* Gráfico de Distribuição */}
        <h4 className="text-xs font-semibold text-app-secondary uppercase tracking-wider mb-2">
          Distribuição de Tentativas
        </h4>
        <div className="space-y-1.5 font-mono text-xs">
          {[1, 2, 3, 4, 5, 6].map((attempt) => {
            const count = stats.guessDistribution[attempt] || 0;
            const percentage = Math.round((count / maxFreq) * 100);

            return (
              <div key={attempt} className="flex items-center gap-2">
                <span className="w-3 text-app-muted text-right">{attempt}</span>
                <div className="flex-1 bg-surface-elevated rounded h-5 flex items-center p-0.5 border border-app-border">
                  <div
                    className={`h-full rounded flex items-center justify-end px-2 text-[11px] font-bold text-white transition-all ${
                      count > 0 ? 'bg-accent-purple' : 'bg-transparent text-app-muted'
                    }`}
                    style={{ width: `${Math.max(8, percentage)}%` }}
                  >
                    {count}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

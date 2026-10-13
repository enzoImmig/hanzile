import React from 'react';
import { GuessFeedback } from '../types/game';
import { GuessRow } from './GuessRow';

interface GameGridProps {
  guesses: GuessFeedback[];
  maxGuesses?: number;
}

export const GameGrid: React.FC<GameGridProps> = ({ guesses, maxGuesses = 6 }) => {
  const emptyRowsCount = Math.max(0, maxGuesses - guesses.length);

  return (
    <div className="w-full max-w-[760px] overflow-x-auto pb-4">
      <div className="min-w-[620px] flex flex-col gap-2">
        {/* Cabeçalho das 7 Colunas */}
        <div className="grid grid-cols-[80px_repeat(6,1fr)] gap-1.5 md:gap-2 px-1 text-center font-mono text-[11px] font-semibold tracking-wider text-app-muted uppercase">
          <div>Hanzi</div>
          <div>Layout</div>
          <div>Componentes</div>
          <div>Pinyin</div>
          <div>Tom</div>
          <div>Traços</div>
          <div>HSK</div>
        </div>

        {/* Linhas de Chutes Realizados */}
        {guesses.map((guess, index) => (
          <GuessRow key={`${guess.char}-${index}`} guess={guess} />
        ))}

        {/* Linhas Restantes Vazias */}
        {Array.from({ length: emptyRowsCount }).map((_, i) => (
          <GuessRow key={`empty-${i}`} isEmpty />
        ))}
      </div>
    </div>
  );
};

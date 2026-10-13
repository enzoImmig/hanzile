import React from 'react';
import { GuessFeedback } from '../types/game';
import { FeedbackCell } from './FeedbackCell';

interface GuessRowProps {
  guess?: GuessFeedback;
  isEmpty?: boolean;
}

export const GuessRow: React.FC<GuessRowProps> = ({ guess, isEmpty = false }) => {
  if (isEmpty || !guess) {
    return (
      <div className="grid grid-cols-[80px_repeat(6,1fr)] gap-1.5 md:gap-2">
        <FeedbackCell isEmpty />
        <FeedbackCell isEmpty />
        <FeedbackCell isEmpty />
        <FeedbackCell isEmpty />
        <FeedbackCell isEmpty />
        <FeedbackCell isEmpty />
        <FeedbackCell isEmpty />
      </div>
    );
  }

  // Componentes com chips sutis
  const componentsNode = (
    <div className="flex items-center justify-center gap-1 flex-wrap">
      {guess.components.guessed.map((c, i) => {
        const isMatched = guess.components.matches.includes(c);
        return (
          <span
            key={i}
            className={`font-cjk text-lg font-bold px-1 rounded ${
              isMatched ? 'bg-white/25 text-white' : 'opacity-40'
            }`}
          >
            {c}
          </span>
        );
      })}
    </div>
  );

  return (
    <div className="grid grid-cols-[80px_repeat(6,1fr)] gap-1.5 md:gap-2">
      {/* 1. Hanzi em destaque */}
      <FeedbackCell
        isHanzi
        value={guess.char}
        subtext={guess.pinyinDisplay}
        delayIndex={0}
      />

      {/* 2. Layout IDC */}
      <FeedbackCell
        status={guess.layout.status}
        value={<span className="font-cjk text-xl">{guess.layout.value}</span>}
        delayIndex={1}
      />

      {/* 3. Componentes */}
      <FeedbackCell
        status={guess.components.status}
        value={componentsNode}
        delayIndex={2}
      />

      {/* 4. Pinyin */}
      <FeedbackCell
        status={guess.pinyin.status}
        value={guess.pinyin.value}
        delayIndex={3}
      />

      {/* 5. Tom */}
      <FeedbackCell
        status={guess.tone.status}
        direction={guess.tone.direction}
        value={guess.tone.value}
        delayIndex={4}
      />

      {/* 6. Traços */}
      <FeedbackCell
        status={guess.strokes.status}
        direction={guess.strokes.direction}
        value={guess.strokes.value}
        delayIndex={5}
      />

      {/* 7. HSK */}
      <FeedbackCell
        status={guess.hsk.status}
        direction={guess.hsk.direction}
        value={`HSK ${guess.hsk.value}`}
        delayIndex={6}
      />
    </div>
  );
};

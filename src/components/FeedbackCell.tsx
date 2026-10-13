import React from 'react';
import { FeedbackStatus, DirectionIndicator } from '../types/game';

interface FeedbackCellProps {
  status?: FeedbackStatus;
  direction?: DirectionIndicator;
  value?: React.ReactNode;
  isHanzi?: boolean;
  subtext?: string;
  delayIndex?: number;
  isEmpty?: boolean;
}

export const FeedbackCell: React.FC<FeedbackCellProps> = ({
  status,
  direction,
  value,
  isHanzi = false,
  subtext,
  delayIndex = 0,
  isEmpty = false,
}) => {
  if (isEmpty) {
    return (
      <div className="h-16 rounded border border-dashed border-app-border bg-transparent opacity-25 flex items-center justify-center select-none" />
    );
  }

  // Estilização do Hanzi (destaque amplo)
  if (isHanzi) {
    return (
      <div
        className="h-16 rounded border border-app-border-strong bg-surface-elevated flex flex-col items-center justify-center select-none animate-flip"
        style={{ animationDelay: `${delayIndex * 80}ms` }}
      >
        <span className="font-cjk text-3xl font-bold leading-none text-app-primary">
          {value}
        </span>
        {subtext && (
          <span className="font-mono text-[10px] text-app-secondary mt-1 leading-none">
            {subtext}
          </span>
        )}
      </div>
    );
  }

  // Estilização das 6 pistas analíticas
  let statusClasses = 'bg-surface border-app-border text-app-secondary';
  if (status === 'correct') {
    statusClasses = 'bg-feedback-correct border-feedback-correct-border text-white';
  } else if (status === 'partial') {
    statusClasses = 'bg-feedback-partial border-feedback-partial-border text-white';
  } else if (status === 'wrong') {
    statusClasses = 'bg-feedback-wrong border-feedback-wrong-border text-app-secondary';
  }

  return (
    <div
      className={`h-16 rounded border flex items-center justify-center select-none font-semibold text-lg transition-colors animate-flip ${statusClasses}`}
      style={{ animationDelay: `${delayIndex * 80}ms` }}
    >
      <div className="flex items-center gap-0.5">
        <span>{value}</span>
        {direction === 'higher' && (
          <span className="font-mono text-base font-bold opacity-90 ml-0.5">↑</span>
        )}
        {direction === 'lower' && (
          <span className="font-mono text-base font-bold opacity-90 ml-0.5">↓</span>
        )}
      </div>
    </div>
  );
};

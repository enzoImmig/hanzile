import React, { useEffect, useState } from 'react';
import { X, Copy, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { HanziEntry, GuessFeedback, GameStatus, GameMode } from '../types/game';

interface GameOverModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: GameStatus;
  targetChar: HanziEntry | null;
  guesses: GuessFeedback[];
  mode: GameMode;
  onRestartPractice?: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  onClose,
  status,
  targetChar,
  guesses,
  mode,
  onRestartPractice,
}) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && status === 'won') {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#3d8c68', '#c99738', '#8b6cd9', '#c84c4c'],
      });
    }
  }, [isOpen, status]);

  if (!isOpen || !targetChar) return null;

  const isWin = status === 'won';

  // Gerador de grade de emojis do resultado
  const generateShareText = () => {
    const attemptText = isWin ? `${guesses.length}/6` : 'X/6';
    const lines = guesses.map((g) => {
      // 1. Layout
      const layoutEmoji = g.layout.status === 'correct' ? '🟩' : '⬛';
      // 2. Componentes
      const compEmoji =
        g.components.status === 'correct'
          ? '🟩'
          : g.components.status === 'partial'
          ? '🟨'
          : '⬛';
      // 3. Pinyin
      const pinyinEmoji =
        g.pinyin.status === 'correct'
          ? '🟩'
          : g.pinyin.status === 'partial'
          ? '🟨'
          : '⬛';
      // 4. Tom
      const toneEmoji =
        g.tone.status === 'correct'
          ? '🟩'
          : g.tone.direction === 'higher'
          ? '↑'
          : '↓';
      // 5. Traços
      const strokeEmoji =
        g.strokes.status === 'correct'
          ? '🟩'
          : g.strokes.direction === 'higher'
          ? '↑'
          : '↓';
      // 6. HSK
      const hskEmoji =
        g.hsk.status === 'correct'
          ? '🟩'
          : g.hsk.direction === 'higher'
          ? '↑'
          : '↓';

      return `${layoutEmoji}${compEmoji}${pinyinEmoji}${toneEmoji}${strokeEmoji}${hskEmoji}`;
    });

    return `Hanzile (${mode === 'daily' ? 'Diário' : 'Treino'}) ${attemptText}\n\n${lines.join(
      '\n'
    )}`;
  };

  const handleCopy = () => {
    const text = generateShareText();
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-[2px] flex items-center justify-center p-4">
      <div className="bg-surface border border-app-border-strong rounded-lg max-w-sm w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-app-muted hover:text-app-primary"
        >
          <X className="w-5 h-5 stroke-[1.8]" />
        </button>

        <h3 className="text-base font-bold text-app-primary mb-3 text-center">
          {isWin ? 'Parabéns! Você acertou!' : 'Fim de Jogo!'}
        </h3>

        {/* Card do Caractere Revelado */}
        <div className="bg-surface-elevated border border-app-border-strong rounded p-4 text-center my-3">
          <div className="font-cjk text-6xl font-bold text-app-primary leading-none mb-2">
            {targetChar.char}
          </div>
          <div className="font-mono text-base font-semibold text-accent-yellow">
            {targetChar.pinyinDisplay}
          </div>
          <div className="text-xs text-app-secondary mt-1">
            {targetChar.meaning}
          </div>
          <div className="text-[11px] text-app-muted mt-2 border-t border-app-border pt-2 flex justify-center gap-3">
            <span>Layout: <strong>{targetChar.layout}</strong></span>
            <span>Traços: <strong>{targetChar.strokes}</strong></span>
            <span>HSK: <strong>{targetChar.hsk}</strong></span>
          </div>
        </div>

        <div className="text-xs text-center text-app-muted mb-4">
          {isWin ? (
            <span>
              Você descobriu em <strong>{guesses.length}</strong> de <strong>6</strong> tentativas.
            </span>
          ) : (
            <span>Não foi dessa vez. Continue praticando!</span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={handleCopy}
            className="w-full bg-accent-purple hover:bg-accent-purple-hover text-white py-2 px-3 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 stroke-[2]" />
                <span>Copiado para a área de transferência!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 stroke-[2]" />
                <span>Compartilhar Resultado</span>
              </>
            )}
          </button>

          {mode === 'practice' && onRestartPractice && (
            <button
              onClick={() => {
                onRestartPractice();
                onClose();
              }}
              className="w-full border border-app-border text-app-secondary hover:text-app-primary hover:bg-surface-elevated py-2 px-3 rounded text-xs font-semibold transition-colors cursor-pointer"
            >
              Jogar Novamente (Treino)
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

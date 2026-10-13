import { useState, useEffect, useCallback } from 'react';
import { HanziEntry, GuessFeedback, GameMode, GameStatus, GameStats } from '../types/game';
import { compareGuess } from '../logic/comparator';
import { getDailyCharacter, getRandomCharacter, getLocalDateString } from '../logic/dailySeed';

const STATS_STORAGE_KEY = 'hanzile_stats_v1';
const DAILY_STATE_STORAGE_KEY = 'hanzile_daily_state_v1';
const PRACTICE_HSK_STORAGE_KEY = 'hanzile_practice_hsk_v1';

const INITIAL_STATS: GameStats = {
  gamesPlayed: 0,
  gamesWon: 0,
  currentStreak: 0,
  maxStreak: 0,
  guessDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
};

export function useGame() {
  const [vocabulary, setVocabulary] = useState<HanziEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mode, setMode] = useState<GameMode>('daily');
  const [targetChar, setTargetChar] = useState<HanziEntry | null>(null);
  const [guesses, setGuesses] = useState<GuessFeedback[]>([]);
  const [status, setStatus] = useState<GameStatus>('playing');
  const [stats, setStats] = useState<GameStats>(INITIAL_STATS);

  // Níveis HSK ativos para o modo treino (padrão: [1] para iniciantes)
  const [selectedHskLevels, setSelectedHskLevelsState] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem(PRACTICE_HSK_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const valid = parsed.filter((n) => typeof n === 'number' && n >= 1 && n <= 6);
          if (valid.length > 0) return valid;
        }
      }
    } catch (e) {
      console.warn('Falha ao ler filtro HSK do localStorage:', e);
    }
    return [1];
  });

  // 1. Carrega vocabulário
  useEffect(() => {
    fetch('/data/hanzi-db.json')
      .then((res) => res.json())
      .then((data: HanziEntry[]) => {
        setVocabulary(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Erro ao carregar banco de ideogramas:', err);
        setIsLoading(false);
      });
  }, []);

  // 2. Carrega estatísticas salvas
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STATS_STORAGE_KEY);
      if (saved) {
        setStats(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Falha ao ler estatísticas do localStorage:', e);
    }
  }, []);

  // 3. Inicializa partida quando o vocabulário estiver pronto
  const initGame = useCallback(
    (gameMode: GameMode, vocab: HanziEntry[], levels?: number[]) => {
      if (!vocab || vocab.length === 0) return;

      const todayStr = getLocalDateString();

      if (gameMode === 'daily') {
        const dailyTarget = getDailyCharacter(vocab, todayStr);
        setTargetChar(dailyTarget);

        // Tenta recuperar estado da rodada diária salva
        try {
          const savedDaily = localStorage.getItem(DAILY_STATE_STORAGE_KEY);
          if (savedDaily) {
            const parsed = JSON.parse(savedDaily);
            if (parsed.dateStr === todayStr && parsed.targetChar?.char === dailyTarget.char) {
              setGuesses(parsed.guesses || []);
              setStatus(parsed.status || 'playing');
              return;
            }
          }
        } catch (e) {
          console.warn('Erro ao restaurar partida diária:', e);
        }

        // Nova rodada diária limpa
        setGuesses([]);
        setStatus('playing');
      } else {
        // Modo Treino Livre com filtro HSK
        const targetLevels = levels || selectedHskLevels;
        const randomTarget = getRandomCharacter(vocab, targetLevels);
        setTargetChar(randomTarget);
        setGuesses([]);
        setStatus('playing');
      }
    },
    [selectedHskLevels]
  );

  useEffect(() => {
    if (!isLoading && vocabulary.length > 0) {
      initGame(mode, vocabulary, selectedHskLevels);
    }
  }, [isLoading, vocabulary, mode]);

  // Atualiza estatísticas locais após vitória ou derrota
  const updateStatsOnEnd = useCallback((isWin: boolean, attemptCount: number) => {
    setStats((prev) => {
      const todayStr = getLocalDateString();
      if (prev.lastPlayedDate === todayStr && mode === 'daily') {
        return prev; // Já computou hoje
      }

      const gamesPlayed = prev.gamesPlayed + 1;
      const gamesWon = prev.gamesWon + (isWin ? 1 : 0);
      const currentStreak = isWin ? prev.currentStreak + 1 : 0;
      const maxStreak = Math.max(prev.maxStreak, currentStreak);
      const guessDistribution = { ...prev.guessDistribution };

      if (isWin && attemptCount >= 1 && attemptCount <= 6) {
        guessDistribution[attemptCount] = (guessDistribution[attemptCount] || 0) + 1;
      }

      const newStats: GameStats = {
        gamesPlayed,
        gamesWon,
        currentStreak,
        maxStreak,
        guessDistribution,
        lastPlayedDate: mode === 'daily' ? todayStr : prev.lastPlayedDate,
      };

      try {
        localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(newStats));
      } catch (e) {
        console.warn('Erro ao salvar estatísticas:', e);
      }

      return newStats;
    });
  }, [mode]);

  // Ação de fazer um chute
  const makeGuess = useCallback(
    (guessed: HanziEntry) => {
      if (status !== 'playing' || !targetChar) return;
      if (guesses.some((g) => g.char === guessed.char)) return; // já chutado

      const feedback = compareGuess(guessed, targetChar);
      const newGuesses = [...guesses, feedback];
      setGuesses(newGuesses);

      const isWin = feedback.isExactMatch;
      const isLoss = !isWin && newGuesses.length >= 6;

      let newStatus: GameStatus = 'playing';
      if (isWin) {
        newStatus = 'won';
        setStatus('won');
        updateStatsOnEnd(true, newGuesses.length);
      } else if (isLoss) {
        newStatus = 'lost';
        setStatus('lost');
        updateStatsOnEnd(false, newGuesses.length);
      }

      // Persiste estado diário
      if (mode === 'daily') {
        try {
          const todayStr = getLocalDateString();
          localStorage.setItem(
            DAILY_STATE_STORAGE_KEY,
            JSON.stringify({
              dateStr: todayStr,
              targetChar,
              guesses: newGuesses,
              status: newStatus,
            })
          );
        } catch (e) {
          console.warn('Erro ao persistir rodada diária:', e);
        }
      }
    },
    [status, targetChar, guesses, mode, updateStatsOnEnd]
  );

  // Atualiza níveis de HSK para treino e reinicia a rodada com novo alvo correspondente
  const setSelectedHskLevels = useCallback(
    (levels: number[]) => {
      const sanitized = Array.from(new Set(levels))
        .filter((n) => typeof n === 'number' && n >= 1 && n <= 6)
        .sort((a, b) => a - b);
      const finalLevels = sanitized.length > 0 ? sanitized : [1];

      setSelectedHskLevelsState(finalLevels);
      try {
        localStorage.setItem(PRACTICE_HSK_STORAGE_KEY, JSON.stringify(finalLevels));
      } catch (e) {
        console.warn('Erro ao salvar filtro HSK:', e);
      }

      if (mode === 'practice' && vocabulary.length > 0) {
        initGame('practice', vocabulary, finalLevels);
      }
    },
    [mode, vocabulary, initGame]
  );

  // Reinicia partida no modo treino
  const restartPractice = useCallback(
    (customLevels?: number[]) => {
      if (vocabulary.length > 0) {
        const levelsToUse = customLevels || selectedHskLevels;
        initGame('practice', vocabulary, levelsToUse);
      }
    },
    [vocabulary, selectedHskLevels, initGame]
  );

  // Quantidade de caracteres no pool ativo de treino
  const practicePoolCount = vocabulary.filter((item) =>
    selectedHskLevels.includes(item.hsk)
  ).length;

  return {
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
  };
}

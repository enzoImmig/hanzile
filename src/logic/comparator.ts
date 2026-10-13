import { HanziEntry, GuessFeedback, DirectionIndicator, FeedbackStatus } from '../types/game';

// Lista de iniciais (shengmu) padrão em Pinyin ordenadas por comprimento decrescente
const PINYIN_INITIALS = [
  'ch', 'sh', 'zh',
  'b', 'p', 'm', 'f', 'd', 't', 'n', 'l',
  'g', 'k', 'h', 'j', 'q', 'x', 'r', 'z', 'c', 's', 'y', 'w'
];

/**
 * Decompõe uma sílaba em pinyin em inicial (shengmu) e final (yunmu).
 */
export function splitPinyin(syllable: string = ''): { initial: string; final: string } {
  const s = syllable.toLowerCase();
  for (const init of PINYIN_INITIALS) {
    if (s.startsWith(init)) {
      return { initial: init, final: s.slice(init.length) };
    }
  }
  return { initial: '', final: s };
}

/**
 * Compara um chute do jogador com o caractere secreto nas 6 dimensões de pistas.
 */
export function compareGuess(guessed: HanziEntry, secret: HanziEntry): GuessFeedback {
  const isExactMatch = guessed.char === secret.char;

  // 1. Layout IDC
  const layoutCorrect = guessed.layout === secret.layout;

  // 2. Componentes (Radicais e Partes)
  const matches = guessed.components.filter((c) => secret.components.includes(c));
  let compStatus: FeedbackStatus = 'wrong';
  if (
    guessed.components.length === secret.components.length &&
    matches.length === secret.components.length
  ) {
    compStatus = 'correct';
  } else if (matches.length > 0) {
    compStatus = 'partial';
  }

  // 3. Pinyin (Sílaba sem tom)
  let pinyinStatus: FeedbackStatus = 'wrong';
  if (guessed.pinyin === secret.pinyin) {
    pinyinStatus = 'correct';
  } else {
    const guessedSplit = splitPinyin(guessed.pinyin);
    const secretSplit = splitPinyin(secret.pinyin);
    const initialMatch = guessedSplit.initial && guessedSplit.initial === secretSplit.initial;
    const finalMatch = guessedSplit.final && guessedSplit.final === secretSplit.final;
    if (initialMatch || finalMatch) {
      pinyinStatus = 'partial';
    }
  }

  // 4. Tom (1 a 5)
  const toneDiff = secret.tone - guessed.tone;
  const toneDirection: DirectionIndicator = toneDiff === 0 ? 'equal' : toneDiff > 0 ? 'higher' : 'lower';
  const toneStatus: FeedbackStatus = toneDiff === 0 ? 'correct' : 'wrong';

  // 5. Contagem de Traços (Strokes)
  const strokeDiff = secret.strokes - guessed.strokes;
  const strokeDirection: DirectionIndicator = strokeDiff === 0 ? 'equal' : strokeDiff > 0 ? 'higher' : 'lower';
  const strokeStatus: FeedbackStatus = strokeDiff === 0 ? 'correct' : 'wrong';

  // 6. Nível HSK (1 a 6)
  const hskDiff = secret.hsk - guessed.hsk;
  const hskDirection: DirectionIndicator = hskDiff === 0 ? 'equal' : hskDiff > 0 ? 'higher' : 'lower';
  const hskStatus: FeedbackStatus = hskDiff === 0 ? 'correct' : 'wrong';

  return {
    char: guessed.char,
    pinyinDisplay: guessed.pinyinDisplay,
    layout: {
      value: guessed.layout,
      status: layoutCorrect ? 'correct' : 'wrong',
    },
    components: {
      guessed: guessed.components,
      matches,
      status: compStatus,
    },
    pinyin: {
      value: guessed.pinyin,
      status: pinyinStatus,
    },
    tone: {
      value: guessed.tone,
      status: toneStatus,
      direction: toneDirection,
    },
    strokes: {
      value: guessed.strokes,
      status: strokeStatus,
      direction: strokeDirection,
    },
    hsk: {
      value: guessed.hsk,
      status: hskStatus,
      direction: hskDirection,
    },
    isExactMatch,
  };
}

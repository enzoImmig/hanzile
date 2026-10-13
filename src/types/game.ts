export type CharacterLayout =
  | '独'  // Componente único / indivisível
  | '⿰'  // Esquerda-Direita
  | '⿱'  // Cima-Baixo
  | '⿲'  // Esquerda-Centro-Direita
  | '⿳'  // Cima-Centro-Baixo
  | '⿴'  // Envolvimento completo
  | '⿵'  // Envolvimento superior
  | '⿶'  // Envolvimento inferior
  | '⿷'  // Envolvimento lateral esquerdo
  | '⿸'  // Envolvimento superior-esquerdo
  | '⿹'  // Envolvimento superior-direito
  | '⿺'  // Envolvimento inferior-esquerdo
  | '⿻'; // Sobreposto / entrelaçado

export interface HanziEntry {
  char: string;
  pinyin: string;           // Ex: "ming", "shang" (sem tom)
  pinyinDisplay: string;    // Ex: "míng", "shǎng" (com diacrítico tonal)
  tone: number;             // 1, 2, 3, 4 ou 5 (neutro)
  strokes: number;          // Contagem de traços (ex: 8)
  hsk: number;              // Nível HSK (1 a 6)
  layout: CharacterLayout;  // IDC Unicode ou '独'
  radical: string;          // Radical Kangxi
  components: string[];     // Radicais ou partes imediatas
  meaning: string;          // Definição em inglês
}

export type FeedbackStatus = 'correct' | 'partial' | 'wrong';
export type DirectionIndicator = 'equal' | 'higher' | 'lower';

export interface DimensionFeedback<T> {
  value: T;
  status: FeedbackStatus;
  direction?: DirectionIndicator; // Para atributos numéricos/ordinais (tom, traços, HSK)
}

export interface GuessFeedback {
  char: string;
  pinyinDisplay: string;
  layout: DimensionFeedback<CharacterLayout>;
  components: {
    guessed: string[];
    matches: string[];
    status: FeedbackStatus;
  };
  pinyin: DimensionFeedback<string>;
  tone: DimensionFeedback<number>;
  strokes: DimensionFeedback<number>;
  hsk: DimensionFeedback<number>;
  isExactMatch: boolean;
}

export type GameMode = 'daily' | 'practice';
export type GameStatus = 'playing' | 'won' | 'lost';

export interface GameState {
  mode: GameMode;
  targetChar: HanziEntry;
  guesses: GuessFeedback[];
  status: GameStatus;
  dateStr: string; // YYYY-MM-DD
}

export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  guessDistribution: Record<number, number>; // { 1: 0, 2: 3, 3: 5, ... }
  lastPlayedDate?: string;
}

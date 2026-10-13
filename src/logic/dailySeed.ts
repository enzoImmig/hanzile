import { HanziEntry } from '../types/game';

/**
 * Retorna uma semente inteira determinística a partir de uma data YYYY-MM-DD.
 */
export function getDailySeed(dateStr?: string): number {
  const ds = dateStr || getLocalDateString();
  let hash = 2166136261;
  for (let i = 0; i < ds.length; i++) {
    hash ^= ds.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

/**
 * Retorna a string da data local no formato YYYY-MM-DD.
 */
export function getLocalDateString(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * Gerador de números pseudo-aleatórios Mulberry32.
 */
export function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Seleciona o caractere diário do dia de forma determinística.
 * Dá preferência aos caracteres de HSK 1 a 4 para garantir que o jogo seja desafiador mas acessível.
 */
export function getDailyCharacter(vocabulary: HanziEntry[], dateStr?: string): HanziEntry {
  if (!vocabulary || vocabulary.length === 0) {
    throw new Error('Vocabulário vazio');
  }

  // Filtro de candidatos diários (HSK 1 a 4 são ideais para o desafio diário geral)
  const candidatePool = vocabulary.filter((item) => item.hsk <= 4);
  const pool = candidatePool.length > 0 ? candidatePool : vocabulary;

  const seed = getDailySeed(dateStr);
  const rng = mulberry32(seed);
  const index = Math.floor(rng() * pool.length);
  return pool[index];
}

/**
 * Seleciona um caractere aleatório para o modo treino livre,
 * com suporte a filtragem por lista de níveis HSK (ex: [1, 2] para iniciantes).
 */
export function getRandomCharacter(
  vocabulary: HanziEntry[],
  selectedHskLevels?: number[] | number
): HanziEntry {
  if (!vocabulary || vocabulary.length === 0) {
    throw new Error('Vocabulário vazio');
  }

  let pool = vocabulary;

  if (Array.isArray(selectedHskLevels) && selectedHskLevels.length > 0) {
    const filtered = vocabulary.filter((item) => selectedHskLevels.includes(item.hsk));
    if (filtered.length > 0) {
      pool = filtered;
    }
  } else if (typeof selectedHskLevels === 'number' && selectedHskLevels > 0) {
    const filtered = vocabulary.filter((item) => item.hsk <= selectedHskLevels);
    if (filtered.length > 0) {
      pool = filtered;
    }
  }

  const index = Math.floor(Math.random() * pool.length);
  return pool[index];
}

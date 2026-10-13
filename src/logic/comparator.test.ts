import { describe, it, expect } from 'vitest';
import { compareGuess, splitPinyin } from './comparator';
import { getDailySeed, getDailyCharacter } from './dailySeed';
import { HanziEntry } from '../types/game';

const MOCK_MING: HanziEntry = {
  char: '明',
  pinyin: 'ming',
  pinyinDisplay: 'míng',
  tone: 2,
  strokes: 8,
  hsk: 1,
  layout: '⿰',
  radical: '日',
  components: ['日', '月'],
  meaning: 'bright',
};

const MOCK_HAO: HanziEntry = {
  char: '好',
  pinyin: 'hao',
  pinyinDisplay: 'hǎo',
  tone: 3,
  strokes: 6,
  hsk: 1,
  layout: '⿰',
  radical: '女',
  components: ['女', '子'],
  meaning: 'good',
};

const MOCK_SHI: HanziEntry = {
  char: '时',
  pinyin: 'shi',
  pinyinDisplay: 'shí',
  tone: 2,
  strokes: 7,
  hsk: 1,
  layout: '⿰',
  radical: '日',
  components: ['日', '寸'],
  meaning: 'time',
};

describe('Motor de Comparação (comparator.ts)', () => {
  it('deve identificar acerto exato (isExactMatch)', () => {
    const feedback = compareGuess(MOCK_MING, MOCK_MING);
    expect(feedback.isExactMatch).toBe(true);
    expect(feedback.layout.status).toBe('correct');
    expect(feedback.components.status).toBe('correct');
    expect(feedback.pinyin.status).toBe('correct');
    expect(feedback.tone.status).toBe('correct');
    expect(feedback.strokes.status).toBe('correct');
    expect(feedback.hsk.status).toBe('correct');
  });

  it('deve identificar acerto parcial de componentes quando compartilha um radical', () => {
    // 时 compartilha '日' com 明
    const feedback = compareGuess(MOCK_SHI, MOCK_MING);
    expect(feedback.isExactMatch).toBe(false);
    expect(feedback.components.status).toBe('partial');
    expect(feedback.components.matches).toEqual(['日']);
  });

  it('deve indicar setas direcionais corretas para traços e tom', () => {
    // 好 (tone 3, strokes 6) vs 明 (tone 2, strokes 8)
    const feedback = compareGuess(MOCK_HAO, MOCK_MING);
    expect(feedback.tone.direction).toBe('lower'); // segredo tem tom menor (2 < 3)
    expect(feedback.strokes.direction).toBe('higher'); // segredo tem mais traços (8 > 6)
    expect(feedback.hsk.status).toBe('correct'); // ambos HSK 1
  });

  it('deve decompor corretamente o Pinyin em inicial e final', () => {
    expect(splitPinyin('ming')).toEqual({ initial: 'm', final: 'ing' });
    expect(splitPinyin('shang')).toEqual({ initial: 'sh', final: 'ang' });
    expect(splitPinyin('ai')).toEqual({ initial: '', final: 'ai' });
  });
});

describe('Semente Diária (dailySeed.ts)', () => {
  it('deve gerar o mesmo caractere para a mesma data', () => {
    const vocab = [MOCK_MING, MOCK_HAO, MOCK_SHI];
    const char1 = getDailyCharacter(vocab, '2026-10-12');
    const char2 = getDailyCharacter(vocab, '2026-10-12');
    expect(char1.char).toBe(char2.char);
  });

  it('deve gerar sementes distintas para datas distintas', () => {
    const s1 = getDailySeed('2026-10-12');
    const s2 = getDailySeed('2026-10-13');
    expect(s1).not.toBe(s2);
  });
});

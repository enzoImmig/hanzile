import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { HanziEntry } from '../types/game';
import { compareGuess } from './comparator';
import { getDailyCharacter, getRandomCharacter } from './dailySeed';

describe('Integração com Dataset Real (hanzi-db.json)', () => {
  const dbPath = path.resolve(__dirname, '../../public/data/hanzi-db.json');
  const raw = fs.readFileSync(dbPath, 'utf-8');
  const database: HanziEntry[] = JSON.parse(raw);

  it('deve conter exatamente 2.663 ideogramas', () => {
    expect(database.length).toBe(2663);
  });

  it('todos os caracteres devem possuir contagem de traços válida (strokes > 0)', () => {
    const invalid = database.filter((c) => !c.strokes || c.strokes < 1);
    expect(invalid.length).toBe(0);
  });

  it('todos os caracteres devem ter layout IDC ou 独', () => {
    const validLayouts = new Set(['独', '⿰', '⿱', '⿲', '⿳', '⿴', '⿵', '⿶', '⿷', '⿸', '⿹', '⿺', '⿻']);
    const invalid = database.filter((c) => !validLayouts.has(c.layout));
    expect(invalid.length).toBe(0);
  });

  it('deve selecionar um caractere diário estável e válido', () => {
    const daily = getDailyCharacter(database, '2026-10-12');
    expect(daily).toBeDefined();
    expect(daily.char).toBeTruthy();
    expect(daily.hsk).toBeLessThanOrEqual(4);
  });

  it('deve simular uma partida com vitória ao chutar o caractere correto', () => {
    const target = getDailyCharacter(database, '2026-10-12');
    const feedback = compareGuess(target, target);
    expect(feedback.isExactMatch).toBe(true);
    expect(feedback.layout.status).toBe('correct');
    expect(feedback.tone.status).toBe('correct');
    expect(feedback.strokes.status).toBe('correct');
    expect(feedback.hsk.status).toBe('correct');
  });

  it('modo treino deve selecionar caracteres válidos aleatórios', () => {
    const randomChar = getRandomCharacter(database);
    expect(randomChar).toBeDefined();
    expect(database.some((c) => c.char === randomChar.char)).toBe(true);
  });

  it('modo treino com filtro HSK1 deve sortear apenas caracteres de nível 1', () => {
    for (let i = 0; i < 20; i++) {
      const char = getRandomCharacter(database, [1]);
      expect(char.hsk).toBe(1);
    }
  });

  it('modo treino com filtro HSK1 e HSK2 deve sortear apenas caracteres de nível 1 ou 2', () => {
    for (let i = 0; i < 25; i++) {
      const char = getRandomCharacter(database, [1, 2]);
      expect([1, 2]).toContain(char.hsk);
    }
  });

  it('modo treino com filtro HSK5 e HSK6 deve sortear apenas caracteres avançados (5 ou 6)', () => {
    for (let i = 0; i < 20; i++) {
      const char = getRandomCharacter(database, [5, 6]);
      expect([5, 6]).toContain(char.hsk);
    }
  });

  it('modo treino com lista vazia de HSK deve fazer fallback seguro para o vocabulário geral', () => {
    const char = getRandomCharacter(database, []);
    expect(char).toBeDefined();
    expect(char.hsk).toBeGreaterThanOrEqual(1);
    expect(char.hsk).toBeLessThanOrEqual(6);
  });
});

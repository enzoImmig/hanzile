import React, { useState, useRef, useEffect, useMemo } from 'react';
import { HanziEntry } from '../types/game';

interface CharacterSearchProps {
  vocabulary: HanziEntry[];
  onGuess: (char: HanziEntry) => void;
  disabled?: boolean;
}

export const CharacterSearch: React.FC<CharacterSearchProps> = ({
  vocabulary,
  onGuess,
  disabled = false,
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedEntry, setSelectedEntry] = useState<HanziEntry | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filtragem rápida (apenas Pinyin e Hanzi direto)
  const filteredResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    // Se digitou o ideograma diretamente
    if (/[\u4e00-\u9fff]/.test(q)) {
      return vocabulary.filter((item) => item.char.includes(q)).slice(0, 10);
    }

    // Busca por Pinyin: prioriza os que começam com o termo digitado
    const starts = [];
    const contains = [];
    for (const item of vocabulary) {
      if (item.pinyin.startsWith(q)) {
        starts.push(item);
      } else if (item.pinyin.includes(q)) {
        contains.push(item);
      }
      if (starts.length >= 12) break;
    }
    return [...starts, ...contains].slice(0, 10);
  }, [query, vocabulary]);

  // Reseta índice selecionado quando muda o filtro
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredResults]);

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (item: HanziEntry) => {
    setSelectedEntry(item);
    setQuery(`${item.char} (${item.pinyinDisplay})`);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleSubmit = () => {
    if (disabled) return;

    if (selectedEntry) {
      onGuess(selectedEntry);
      setQuery('');
      setSelectedEntry(null);
      setIsOpen(false);
      return;
    }

    // Se o usuário digitou direto e tem 1 sugestão
    if (filteredResults.length > 0) {
      const choice = filteredResults[selectedIndex] || filteredResults[0];
      onGuess(choice);
      setQuery('');
      setSelectedEntry(null);
      setIsOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIsOpen(true);
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredResults.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setIsOpen(true);
      setSelectedIndex((prev) =>
        prev <= 0 ? Math.max(0, filteredResults.length - 1) : prev - 1
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="w-full max-w-[560px] relative mb-6">
      <div className="flex gap-2 bg-surface border border-app-border-strong rounded p-1 transition-all focus-within:border-accent-purple focus-within:ring-2 focus-within:ring-accent-purple/20">
        <input
          ref={inputRef}
          type="text"
          value={query}
          disabled={disabled}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedEntry(null);
            setIsOpen(true);
          }}
          onFocus={() => {
            if (query.trim()) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={
            disabled
              ? 'Partida finalizada'
              : 'Digite em Pinyin (ex: ming, hao) ou Hanzi...'
          }
          className="flex-1 bg-transparent border-none outline-none text-app-primary text-base px-3 py-1.5 placeholder:text-app-muted font-sans"
        />

        <button
          onClick={handleSubmit}
          disabled={disabled || (!selectedEntry && filteredResults.length === 0)}
          className="bg-accent-purple hover:bg-accent-purple-hover text-white text-xs font-semibold px-4 py-1.5 rounded flex items-center gap-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <span>Chutar</span>
          <span className="font-mono text-[10px] opacity-80">↵</span>
        </button>
      </div>

      {/* Dropdown de Sugestões */}
      {isOpen && filteredResults.length > 0 && !disabled && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-app-border-strong rounded shadow-xl max-h-64 overflow-y-auto z-50">
          {filteredResults.map((item, idx) => (
            <div
              key={`${item.char}-${idx}`}
              onClick={() => handleSelect(item)}
              onMouseEnter={() => setSelectedIndex(idx)}
              className={`px-3 py-2 flex items-center justify-between cursor-pointer border-b border-app-border last:border-b-0 transition-colors ${
                selectedIndex === idx ? 'bg-surface-hover' : ''
              }`}
            >
              <div className="flex items-baseline gap-3">
                <span className="font-cjk text-2xl font-bold text-app-primary leading-none">
                  {item.char}
                </span>
                <span className="font-mono text-sm font-semibold text-accent-yellow">
                  {item.pinyinDisplay}
                </span>
                <span className="text-xs text-app-secondary line-clamp-1 max-w-[220px]">
                  {item.meaning}
                </span>
              </div>
              <span className="font-mono text-[11px] font-semibold px-1.5 py-0.5 rounded bg-surface-elevated text-app-muted border border-app-border">
                HSK {item.hsk}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

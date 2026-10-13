import React, { useState } from 'react';
import { RefreshCw, Layers } from 'lucide-react';

interface HskFilterBarProps {
  selectedLevels: number[];
  onChangeLevels: (levels: number[]) => void;
  poolCount: number;
  totalCount?: number;
  onRestartPractice: () => void;
  disabled?: boolean;
}

const HSK_LEVELS = [1, 2, 3, 4, 5, 6] as const;

export const HskFilterBar: React.FC<HskFilterBarProps> = ({
  selectedLevels,
  onChangeLevels,
  poolCount,
  onRestartPractice,
  disabled = false,
}) => {
  // Permite alternar entre seleção direta de nível único e combinação de múltiplos níveis
  const [isMultiSelect, setIsMultiSelect] = useState(() => selectedLevels.length > 1 && selectedLevels.length < 6);

  const isAllSelected = selectedLevels.length === 6;

  const handleSelectLevel = (lvl: number) => {
    if (disabled) return;

    if (!isMultiSelect) {
      // Seleção direta de nível único: clique em HSK 1 seleciona exclusivamente HSK 1
      onChangeLevels([lvl]);
    } else {
      // Modo combinação / multi-seleção
      if (selectedLevels.includes(lvl)) {
        if (selectedLevels.length === 1) return; // Não permite deixar 0 níveis selecionados
        onChangeLevels(selectedLevels.filter((l) => l !== lvl));
      } else {
        onChangeLevels([...selectedLevels, lvl].sort((a, b) => a - b));
      }
    }
  };

  const handleSelectAll = () => {
    if (disabled) return;
    onChangeLevels([1, 2, 3, 4, 5, 6]);
  };

  return (
    <div className="w-full bg-surface border border-app-border rounded-lg p-3 mb-4 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        {/* Seleção Direta de Níveis */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-app-muted font-medium text-xs">
            <Layers className="w-3.5 h-3.5 text-accent-purple" />
            <span>Nível:</span>
          </div>

          <div className="flex items-center gap-1 flex-wrap">
            {HSK_LEVELS.map((lvl) => {
              const active = !isAllSelected && selectedLevels.includes(lvl);
              return (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => handleSelectLevel(lvl)}
                  disabled={disabled}
                  aria-pressed={active}
                  className={`px-2.5 py-1 rounded text-xs font-mono font-semibold transition-all ${
                    active
                      ? 'bg-accent-purple text-white shadow-sm ring-1 ring-accent-purple/50'
                      : 'bg-surface-elevated text-app-secondary hover:text-app-primary hover:bg-surface-hover border border-app-border'
                  }`}
                  title={`Selecionar nível HSK ${lvl}`}
                >
                  HSK {lvl}
                </button>
              );
            })}

            {/* Opção Todos */}
            <button
              type="button"
              onClick={handleSelectAll}
              disabled={disabled}
              aria-pressed={isAllSelected}
              className={`px-2.5 py-1 rounded text-xs font-sans transition-all ${
                isAllSelected
                  ? 'bg-accent-purple text-white shadow-sm ring-1 ring-accent-purple/50 font-semibold'
                  : 'bg-surface-elevated text-app-secondary hover:text-app-primary hover:bg-surface-hover border border-app-border'
              }`}
              title="Sortear caracteres de todos os níveis (HSK 1 a 6)"
            >
              Todos
            </button>
          </div>
        </div>

        {/* Quantidade no Pool e Botão de Novo Sorteio */}
        <div className="flex items-center justify-between sm:justify-end gap-2 text-xs">
          <span className="font-mono text-app-muted bg-surface-elevated px-2 py-1 rounded border border-app-border">
            <strong className="text-app-primary">{poolCount}</strong> chars
          </span>

          <button
            type="button"
            onClick={onRestartPractice}
            disabled={disabled}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-surface-elevated hover:bg-surface-hover border border-app-border text-app-secondary hover:text-app-primary transition-colors font-medium text-xs cursor-pointer"
            title="Sortear novo ideograma com o nível atual"
          >
            <RefreshCw className="w-3 h-3 stroke-[2]" />
            <span>Novo</span>
          </button>
        </div>
      </div>

      {/* Sub-barra: Indicação clara do nível ativo e opção opcional de combinar */}
      <div className="flex items-center justify-between pt-2 mt-2 border-t border-app-border/40 text-[11px] text-app-muted flex-wrap gap-2">
        <label className="flex items-center gap-1.5 cursor-pointer select-none hover:text-app-secondary">
          <input
            type="checkbox"
            checked={isMultiSelect}
            onChange={(e) => {
              const checked = e.target.checked;
              setIsMultiSelect(checked);
              if (!checked && selectedLevels.length > 1) {
                // Ao desligar multi-seleção, foca no primeiro nível ativo
                onChangeLevels([selectedLevels[0]]);
              }
            }}
            className="rounded border-app-border text-accent-purple focus:ring-accent-purple cursor-pointer"
          />
          <span>Combinar múltiplos níveis</span>
        </label>

        <span className="text-[11px] font-medium text-app-secondary">
          {isAllSelected
            ? 'Todos os níveis ativos (HSK 1 a 6)'
            : selectedLevels.length === 1
            ? `Apenas HSK ${selectedLevels[0]} ativo`
            : `HSK ${selectedLevels.join(' e ')} ativos`}
        </span>
      </div>
    </div>
  );
};

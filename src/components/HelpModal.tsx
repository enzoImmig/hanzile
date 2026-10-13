import React from 'react';
import { X } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-[2px] flex items-center justify-center p-4">
      <div className="bg-surface border border-app-border-strong rounded-lg max-w-md w-full p-6 relative max-h-[85vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-app-muted hover:text-app-primary"
        >
          <X className="w-5 h-5 stroke-[1.8]" />
        </button>

        <h3 className="text-lg font-bold text-app-primary mb-3">Como Jogar</h3>

        <div className="text-sm text-app-secondary leading-relaxed space-y-3">
          <p>
            Adivinhe o <strong>Hanzi (caractere em mandarim)</strong> secreto em até 6 tentativas.
          </p>

          <p>
            A cada chute, as 6 colunas retornam pistas sobre a estrutura, fonética e dificuldade do caractere:
          </p>

          <div className="space-y-2 pt-1">
            <div className="flex items-center gap-2.5">
              <span className="w-5 h-5 rounded bg-feedback-correct flex-shrink-0" />
              <span>
                <strong className="text-app-primary">Verde Jade:</strong> Atributo idêntico ao caractere secreto.
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-5 h-5 rounded bg-feedback-partial flex-shrink-0" />
              <span>
                <strong className="text-app-primary">Amarelo Ocre:</strong> Componente presente ou fonética parcial.
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-5 h-5 rounded bg-feedback-wrong flex-shrink-0" />
              <span>
                <strong className="text-app-primary">Escuro:</strong> Atributo incorreto ou ausente.
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-5 h-5 rounded bg-surface-elevated border border-app-border-strong flex items-center justify-center font-mono text-xs font-bold text-app-primary flex-shrink-0">
                ↑ / ↓
              </span>
              <span>
                <strong className="text-app-primary">Setas direcionais:</strong> Indicam se o atributo secreto é maior ou menor (tom, traços ou nível HSK).
              </span>
            </div>
          </div>

          <div className="bg-surface-elevated p-3 rounded border border-app-border mt-4 text-xs text-app-muted space-y-2">
            <div>
              <strong className="text-app-primary block mb-0.5">Dica de Digitação:</strong>
              Digite o Pinyin diretamente no campo de busca (ex: <code>ming</code> ou <code>hao</code>) para selecionar o ideograma desejado na lista. Não é necessário ter teclado em chinês instalado.
            </div>
            <div className="border-t border-app-border/60 pt-2">
              <strong className="text-app-primary block mb-0.5">Modo Treino Livre:</strong>
              No modo treino, você pode filtrar os níveis de HSK desejados (ex: apenas <strong>HSK 1 e 2</strong> para iniciantes) para sortear apenas palavras no seu nível de estudo.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import { useEffect, useMemo, useRef, useState } from 'react';
import { buildSolutionPlayback } from '../../game/solutionPlayback';
import type { SolutionResult } from '../../game/solver';
import type { Direction, LevelDefinition } from '../../game/types';
import { Board } from '../Board/Board';
import './Modal.css';

interface SolutionModalProps {
  level: LevelDefinition;
  levelName: string;
  solution: SolutionResult;
  onClose: () => void;
}

const DIRECTION_LABELS: Record<Direction, string> = {
  up: 'Cima',
  right: 'Direita',
  down: 'Baixo',
  left: 'Esquerda',
};

/**
 * Mostra uma solução calculada sobre uma cópia do mapa inicial. O índice muda
 * apenas o quadro exibido no modal; o tabuleiro e o progresso da partida seguem
 * completamente independentes desta demonstração.
 */
export function SolutionModal({ level, levelName, solution, onClose }: SolutionModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const playback = useMemo(
    () => (solution.status === 'solved' ? buildSolutionPlayback(level, solution.directions) : []),
    [level, solution],
  );
  const [currentStep, setCurrentStep] = useState(0);

  // O foco inicial e a restauração ao fechar evitam que o diálogo interrompa
  // a navegação do jogador pela página que abriu a demonstração.
  useEffect(() => {
    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeButtonRef.current?.focus();

    return () => previousFocusRef.current?.focus();
  }, []);

  // Escape encerra a demonstração e Tab nunca alcança os controles da partida
  // que permanecem visualmente cobertos pelo overlay do modal.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const key = event.key.toLowerCase();

      if (key === 'arrowleft') {
        event.preventDefault();
        setCurrentStep((step) => Math.max(0, step - 1));
        return;
      }

      if (key === 'arrowright') {
        event.preventDefault();
        setCurrentStep((step) => Math.min(Math.max(0, playback.length - 1), step + 1));
        return;
      }

      if (key === 'r') {
        event.preventDefault();
        setCurrentStep(0);
        return;
      }

      if (key === 'escape' || key === 'f') {
        if (event.repeat) return;
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab') return;
      const dialog = dialogRef.current;
      if (!dialog) return;

      const focusable = getFocusableElements(dialog);
      const first = focusable[0];
      const last = focusable.at(-1);
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose, playback.length]);

  if (solution.status !== 'solved') {
    return (
      <div className="modal-overlay">
        <div ref={dialogRef} className="modal modal--solution" role="dialog" aria-modal="true" aria-labelledby="solution-modal-title">
          <p className="modal__eyebrow">Solução ótima</p>
          <div className="solution-modal__heading">
            <h2 id="solution-modal-title" className="modal__title">
              {levelName}
            </h2>
            <span className="solution-modal__search-time">Busca: {formatSearchTime(solution.searchTimeMs)}</span>
          </div>
          <p className="solution-modal__message">
            {solution.status === 'limit-reached'
              ? 'A busca atingiu o limite de segurança antes de encontrar uma solução.'
              : 'Não foi encontrada uma solução para este mapa.'}
          </p>
          <div className="modal__actions modal__actions--solution">
            <button ref={closeButtonRef} type="button" className="btn btn--primary" onClick={onClose}>
              Fechar
            </button>
          </div>
        </div>
      </div>
    );
  }

  const current = playback[currentStep];
  const totalSteps = playback.length - 1;
  const isInitialStep = currentStep === 0;

  return (
    <div className="modal-overlay">
      <div ref={dialogRef} className="modal modal--solution" role="dialog" aria-modal="true" aria-labelledby="solution-modal-title">
        <p className="modal__eyebrow">Solução ótima</p>
        <div className="solution-modal__heading">
          <h2 id="solution-modal-title" className="modal__title">
            {levelName}
          </h2>
          <span className="solution-modal__search-time">Busca: {formatSearchTime(solution.searchTimeMs)}</span>
        </div>

        <div className="solution-modal__progress" aria-live="polite">
          <span>Passo {currentStep} de {totalSteps}</span>
          <strong>{isInitialStep ? 'Estado inicial' : DIRECTION_LABELS[current.direction!]}</strong>
        </div>

        <div className="solution-modal__board">
          <Board state={current.state} facing={current.facing} />
        </div>

        <div className="modal__actions modal__actions--solution">
          <button type="button" className="btn" onClick={() => setCurrentStep((step) => step - 1)} disabled={isInitialStep}>
            Anterior
          </button>
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => setCurrentStep((step) => step + 1)}
            disabled={currentStep === totalSteps}
          >
            Próximo
          </button>
          <button type="button" className="btn" onClick={() => setCurrentStep(0)} disabled={isInitialStep}>
            Reiniciar demonstração
          </button>
          <button ref={closeButtonRef} type="button" className="btn" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

function formatSearchTime(searchTimeMs: number): string {
  if (searchTimeMs < 1000) return `${Math.round(searchTimeMs)} ms`;

  return `${new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 }).format(searchTimeMs / 1000)} s`;
}

function getFocusableElements(dialog: HTMLElement): HTMLElement[] {
  return [...dialog.querySelectorAll<HTMLElement>('button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')]
    .filter((element) => !element.hasAttribute('disabled'));
}

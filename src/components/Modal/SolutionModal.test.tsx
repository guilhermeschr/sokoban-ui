/** @vitest-environment jsdom */
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import type { SolutionResult } from '../../game/solver';
import type { LevelDefinition } from '../../game/types';
import { SolutionModal } from './SolutionModal';

const level: LevelDefinition = {
  id: 'tiny',
  name: 'Labirinto Compacto',
  rows: ['#####', '#@$.#', '#####'],
};

afterEach(cleanup);

describe('SolutionModal', () => {
  it('exibe o tempo da busca em milissegundos ou segundos', () => {
    const solution = {
      status: 'solved',
      directions: [],
      expandedNodes: 1,
      searchTimeMs: 850,
    } as SolutionResult;

    const { rerender } = render(
      <SolutionModal level={level} levelName={level.name} solution={solution} onClose={() => {}} />,
    );

    expect(screen.getByText('Busca: 850 ms')).toBeTruthy();

    rerender(
      <SolutionModal
        level={level}
        levelName={level.name}
        solution={{ ...solution, searchTimeMs: 1250 }}
        onClose={() => {}}
      />,
    );

    expect(screen.getByText('Busca: 1,3 s')).toBeTruthy();
  });

  it('exibe o tempo mesmo quando não encontra solução', () => {
    const solution = {
      status: 'unsolved',
      expandedNodes: 1,
      searchTimeMs: 12,
    } as SolutionResult;

    render(<SolutionModal level={level} levelName={level.name} solution={solution} onClose={() => {}} />);

    expect(screen.getByText('Busca: 12 ms')).toBeTruthy();
  });

  it('exibe o tempo quando a busca atinge o limite', () => {
    const solution = {
      status: 'limit-reached',
      expandedNodes: 200_000,
      searchTimeMs: 1250,
    } as SolutionResult;

    render(<SolutionModal level={level} levelName={level.name} solution={solution} onClose={() => {}} />);

    expect(screen.getByText('Busca: 1,3 s')).toBeTruthy();
  });
});

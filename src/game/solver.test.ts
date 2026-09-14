import { describe, expect, it } from 'vitest';
import { isWin, move, parseLevel } from './engine';
import { LEVELS } from './levels';
import { calculateManhattanHeuristic, solve } from './solver';
import type { Direction, LevelDefinition } from './types';

function applyDirections(level: LevelDefinition, directions: Direction[]) {
  return directions.reduce((state, direction) => move(state, direction).state, parseLevel(level));
}

describe('calculateManhattanHeuristic', () => {
  it('soma a distância de cada destino até a caixa mais próxima', () => {
    const state = parseLevel({
      id: 'heuristica',
      name: 'Heurística',
      rows: ['#######', '#@ $  #', '#  . .#', '#######'],
    });

    expect(calculateManhattanHeuristic(state)).toBe(4);
  });
});

describe('solve', () => {
  it('retorna uma solução vazia para um mapa que já está concluído', () => {
    const state = parseLevel({
      id: 'concluido',
      name: 'Concluído',
      rows: ['#####', '#@* #', '#####'],
    });

    expect(solve(state)).toMatchObject({ status: 'solved', directions: [] });
  });

  it('encontra a menor sequência de movimentos para o primeiro nível', () => {
    const result = solve(parseLevel(LEVELS[0]));

    expect(result).toMatchObject({ status: 'solved', directions: ['right'] });
  });

  it('reconhece quando uma caixa começa em uma posição morta sem destino', () => {
    const state = parseLevel({
      id: 'sem-solucao',
      name: 'Sem solução',
      rows: ['#####', '#@  #', '#$# #', '# . #', '#####'],
    });

    expect(solve(state)).toMatchObject({ status: 'unsolved' });
  });

  it('informa quando o limite de expansões é atingido', () => {
    expect(solve(parseLevel(LEVELS[1]), 0)).toMatchObject({ status: 'limit-reached' });
  });

  it.each(LEVELS)('resolve %s sem ultrapassar o limite padrão', (level) => {
    const result = solve(parseLevel(level));

    expect(result.status).toBe('solved');
    if (result.status === 'solved') {
      expect(isWin(applyDirections(level, result.directions))).toBe(true);
    }
  });
});

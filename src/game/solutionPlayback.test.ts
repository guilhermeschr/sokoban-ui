import { describe, expect, it } from 'vitest';
import { isWin } from './engine';
import { buildSolutionPlayback } from './solutionPlayback';
import { LEVELS } from './levels';

describe('buildSolutionPlayback', () => {
  it('preserva o estado inicial e cria um estado para cada movimento da solução', () => {
    const playback = buildSolutionPlayback(LEVELS[0], ['right']);

    expect(playback).toHaveLength(2);
    expect(playback[0].facing).toBe('down');
    expect(playback[0].direction).toBeUndefined();
    expect(playback[1].facing).toBe('right');
    expect(playback[1].direction).toBe('right');
    expect(isWin(playback[1].state)).toBe(true);
  });
});

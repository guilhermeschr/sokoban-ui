import type { LevelDefinition } from './types';

// Níveis de exemplo para validar a interface (etapa 1 — sem resolução automática/A*).
// Todos foram verificados manualmente e possuem solução.
export const LEVELS: LevelDefinition[] = [
  {
    id: 'nivel-1',
    name: 'Primeiro Empurrão',
    rows: [
      '#####',
      '#@$.#',
      '#####',
    ],
  },
  {
    id: 'nivel-2',
    name: 'Contorno',
    rows: [
      '#######',
      '#     #',
      '#  $  #',
      '#     #',
      '#  .  #',
      '#     #',
      '#  @  #',
      '#######',
    ],
  },
  {
    id: 'nivel-3',
    name: 'Par',
    rows: [
      '########',
      '#      #',
      '# $  $ #',
      '#  ##  #',
      '# .  . #',
      '#   @  #',
      '########',
    ],
  },
  {
    id: 'nivel-4',
    name: 'Linha Dupla',
    rows: [
      '########',
      '#   .  #',
      '#   $  #',
      '#   $  #',
      '#  @   #',
      '#   .  #',
      '########',
    ],
  },
  {
    id: 'nivel-5',
    name: 'Separação',
    rows: [
      '########',
      '#      #',
      '# $$   #',
      '#  ##. #',
      '#   .@ #',
      '#      #',
      '########',
    ],
  },
  {
    id: 'nivel-6',
    name: 'Três Caixas',
    rows: [
      '#########',
      '#       #',
      '# $ $   #',
      '#   #   #',
      '# $ # . #',
      '#   . @ #',
      '#       #',
      '#########',
    ],
  },
  {
    id: 'nivel-7',
    name: 'O Obstáculo',
    rows: [
      '#########',
      '# .     #',
      '# $ $   #',
      '#   #   #',
      '#   # . #',
      '# @     #',
      '#########',
    ],
  },
  {
    id: 'nivel-8',
    name: 'Corredor',
    rows: [
      '##########',
      '# .      #',
      '# $ ###  #',
      '#   #    #',
      '# $ # $  #',
      '#   # .  #',
      '# @   .  #',
      '##########',
    ],
  },
  {
    id: 'nivel-9',
    name: 'Quatro Caixas',
    rows: [
      '#########',
      '# . .   #',
      '# $ $   #',
      '#   #   #',
      '#   #   #',
      '# $ $   #',
      '# @   . #',
      '#########',
    ],
  },
  {
    id: 'nivel-10',
    name: 'Pequeno Labirinto',
    rows: [
      '##########',
      '# .  .   #',
      '# $###   #',
      '#     #  #',
      '#  $  #  #',
      '#  @     #',
      '##########',
    ],
  },{
    id: 'nivel-11',
    name: 'Labirinto Compacto',
    rows: [
      '##############',
      '# .  #   .   #',
      '# $  #  $    #',
      '#    ##      #',
      '# .   $  .   #',
      '# ##   ## $  #',
      '# @          #',
      '##############',
    ],
  },
];
export function getLevelIndexById(id: string): number {
  return LEVELS.findIndex((level) => level.id === id);
}

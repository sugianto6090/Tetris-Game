/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum AnimalType {
  LION = '🦁',
  PANDA = '🐼',
  FROG = '🐸',
  CAT = '🐱',
  MONKEY = '🐵',
  RABBIT = '🐰',
  FOX = '🦊',
}

export type Point = {
  x: number;
  y: number;
};

export type Tetromino = {
  shape: number[][];
  color: string;
  animal: AnimalType;
  sound: string;
};

export const TETROMINOS: Record<string, Tetromino> = {
  I: {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    color: '#38bdf8', // Blue sky
    animal: AnimalType.CAT,
    sound: 'Meow!',
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: '#818cf8', // Indigo
    animal: AnimalType.MONKEY,
    sound: 'Uu Aa!',
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: '#fb923c', // Orange
    animal: AnimalType.FOX,
    sound: 'Awoo!',
  },
  O: {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: '#facc15', // Yellow
    animal: AnimalType.LION,
    sound: 'Roar!',
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    color: '#4ade80', // Green
    animal: AnimalType.FROG,
    sound: 'Kwak!',
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: '#c084fc', // Purple
    animal: AnimalType.PANDA,
    sound: 'Ha!',
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    color: '#f472b6', // Pink
    animal: AnimalType.RABBIT,
    sound: 'Boing!',
  },
};

export const COLS = 10;
export const ROWS = 20;
export const EMPTY = 0;

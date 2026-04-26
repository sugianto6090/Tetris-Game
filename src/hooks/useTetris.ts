/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { COLS, ROWS, TETROMINOS, Point, AnimalType } from '../types';

export const useTetris = () => {
  const [grid, setGrid] = useState<(string | null)[][]>(
    Array.from({ length: ROWS }, () => Array(COLS).fill(null))
  );
  const [activePiece, setActivePiece] = useState<{
    pos: Point;
    type: keyof typeof TETROMINOS;
    shape: number[][];
  } | null>(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Sound triggering function
  const playAnimalSound = useCallback((animal: AnimalType) => {
    const utterance = new SpeechSynthesisUtterance(animal);
    utterance.lang = 'id-ID'; // Bahasa Indonesia
    utterance.pitch = 1.5;
    utterance.rate = 1.2;
    window.speechSynthesis.speak(utterance);
  }, []);

  const getRandomPiece = useCallback(() => {
    const keys = Object.keys(TETROMINOS) as (keyof typeof TETROMINOS)[];
    const key = keys[Math.floor(Math.random() * keys.length)];
    return {
      pos: { x: Math.floor(COLS / 2) - 1, y: 0 },
      type: key,
      shape: TETROMINOS[key].shape,
    };
  }, []);

  const spawnPiece = useCallback(() => {
    const piece = getRandomPiece();
    if (checkCollision(piece.pos, piece.shape)) {
      setGameOver(true);
      return;
    }
    setActivePiece(piece);
    playAnimalSound(TETROMINOS[piece.type].animal);
  }, [getRandomPiece, playAnimalSound]);

  const checkCollision = (pos: Point, shape: number[][], currentGrid = grid) => {
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] !== 0) {
          const newX = pos.x + x;
          const newY = pos.y + y;
          if (
            newX < 0 ||
            newX >= COLS ||
            newY >= ROWS ||
            (newY >= 0 && currentGrid[newY][newX] !== null)
          ) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const rotate = () => {
    if (!activePiece || gameOver || isPaused) return;
    const newShape = activePiece.shape[0].map((_, index) =>
      activePiece.shape.map((col) => col[index]).reverse()
    );
    if (!checkCollision(activePiece.pos, newShape)) {
      setActivePiece({ ...activePiece, shape: newShape });
    }
  };

  const move = (dir: { x: number; y: number }) => {
    if (!activePiece || gameOver || isPaused) return;
    const newPos = { x: activePiece.pos.x + dir.x, y: activePiece.pos.y + dir.y };
    if (!checkCollision(newPos, activePiece.shape)) {
      setActivePiece({ ...activePiece, pos: newPos });
      return true;
    }
    return false;
  };

  const hardDrop = () => {
    if (!activePiece || gameOver || isPaused) return;
    let newY = activePiece.pos.y;
    while (!checkCollision({ x: activePiece.pos.x, y: newY + 1 }, activePiece.shape)) {
      newY++;
    }
    const finalPiece = { ...activePiece, pos: { x: activePiece.pos.x, y: newY } };
    lockPiece(finalPiece);
  };

  const lockPiece = (piece = activePiece) => {
    if (!piece) return;
    const newGrid = grid.map((row) => [...row]);
    piece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          const gridY = piece.pos.y + y;
          const gridX = piece.pos.x + x;
          if (gridY >= 0) {
            newGrid[gridY][gridX] = piece.type;
          }
        }
      });
    });

    // Check for cleared lines
    let clearedLines = 0;
    const finalGrid = newGrid.filter((row) => {
      const isFull = row.every((cell) => cell !== null);
      if (isFull) clearedLines++;
      return !isFull;
    });

    while (finalGrid.length < ROWS) {
      finalGrid.unshift(Array(COLS).fill(null));
    }

    if (clearedLines > 0) {
      const lineScores = [0, 100, 300, 500, 800];
      setScore((prev) => prev + lineScores[clearedLines] * level);
      const newLevel = Math.floor(score / 1000) + 1;
      if (newLevel > level) setLevel(newLevel);
    }

    setGrid(finalGrid);
    spawnPiece();
  };

  useEffect(() => {
    if (!activePiece && !gameOver) {
      spawnPiece();
    }
  }, [activePiece, gameOver, spawnPiece]);

  useInterval(
    () => {
      if (!move({ x: 0, y: 1 })) {
        lockPiece();
      }
    },
    isPaused || gameOver ? null : Math.max(100, 800 - (level - 1) * 100)
  );

  const resetGame = () => {
    setGrid(Array.from({ length: ROWS }, () => Array(COLS).fill(null)));
    setScore(0);
    setLevel(1);
    setGameOver(false);
    setIsPaused(false);
    setActivePiece(null);
  };

  return {
    grid,
    activePiece,
    score,
    level,
    gameOver,
    isPaused,
    setIsPaused,
    move,
    rotate,
    hardDrop,
    resetGame,
  };
};

function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay !== null) {
      const id = setInterval(() => savedCallback.current(), delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

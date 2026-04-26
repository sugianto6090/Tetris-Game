/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { TETROMINOS, AnimalType } from '../types';
import React from 'react';

interface AnimalBlockProps {
  type: string | null;
  animal?: AnimalType;
  isGhost?: boolean;
}

export const AnimalBlock: React.FC<AnimalBlockProps> = ({ type, animal, isGhost }) => {
  if (!type && !animal) {
    return <div className="w-full h-full bg-black/10 border border-white/5 rounded-sm" />;
  }

  const pieceInfo = type ? TETROMINOS[type] : null;
  const color = pieceInfo?.color || '#ffffff';
  const displayAnimal = animal || pieceInfo?.animal || '❓';

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: isGhost ? 0.3 : 1 }}
      className="w-full h-full relative border border-black/10 rounded-sm flex items-center justify-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] overflow-hidden"
      style={{ backgroundColor: color }}
    >
      <span className="text-xl sm:text-2xl select-none" style={{ filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.2))' }}>
        {displayAnimal}
      </span>
    </motion.div>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, ArrowDown, RotateCw, ChevronsDown } from 'lucide-react';

interface ControlsProps {
  onMove: (dir: { x: number; y: number }) => void;
  onRotate: () => void;
  onHardDrop: () => void;
  disabled?: boolean;
}

export const Controls = ({ onMove, onRotate, onHardDrop, disabled }: ControlsProps) => {
  const btnClass = "w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-full bg-white shadow-lg border-b-8 border-gray-300 active:translate-y-1 active:border-b-4 transition-all disabled:opacity-50 disabled:translate-y-0 disabled:border-b-8";
  const actionBtnClass = "w-20 h-20 sm:w-24 sm:h-24 flex flex-col items-center justify-center rounded-full bg-emerald-600 text-white shadow-xl border-b-8 border-emerald-800 active:translate-y-1 active:border-b-4 transition-all disabled:opacity-50";

  return (
    <footer className="w-full max-w-2xl px-6 py-8 flex justify-between items-center gap-4 select-none">
      <div className="flex gap-4">
        <button
          onClick={() => onMove({ x: -1, y: 0 })}
          disabled={disabled}
          className={`${btnClass} text-emerald-600`}
          aria-label="Left"
        >
          <ArrowLeft size={32} strokeWidth={3} />
        </button>
        <button
          onClick={() => onMove({ x: 1, y: 0 })}
          disabled={disabled}
          className={`${btnClass} text-emerald-600`}
          aria-label="Right"
        >
          <ArrowRight size={32} strokeWidth={3} />
        </button>
      </div>

      <div className="flex flex-col items-center">
        <button
          onClick={onRotate}
          disabled={disabled}
          className={actionBtnClass}
          aria-label="Rotate"
        >
          <RotateCw size={40} strokeWidth={3} />
        </button>
        <span className="mt-2 text-[10px] font-black text-emerald-700 uppercase tracking-widest hidden sm:block">Putar Hewan</span>
      </div>
      
      <div className="flex gap-4">
        <button
          onClick={() => onMove({ x: 0, y: 1 })}
          disabled={disabled}
          className={`${btnClass} text-blue-500`}
          aria-label="Down"
        >
          <ArrowDown size={32} strokeWidth={3} />
        </button>
        <button
          onClick={onHardDrop}
          disabled={disabled}
          className={`${btnClass} text-orange-500 hidden sm:flex`}
          aria-label="Hard Drop"
        >
          <ChevronsDown size={32} strokeWidth={3} />
        </button>
      </div>
    </footer>
  );
};

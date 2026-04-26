/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useTetris } from './hooks/useTetris';
import { AnimalBlock } from './components/AnimalBlock';
import { Controls } from './components/Controls';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RotateCcw, Trophy, Bird } from 'lucide-react';
import { useEffect } from 'react';
import { AnimalType } from './types';

export default function App() {
  const {
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
  } = useTetris();

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver || isPaused) return;
      switch (e.key) {
        case 'ArrowLeft': move({ x: -1, y: 0 }); break;
        case 'ArrowRight': move({ x: 1, y: 0 }); break;
        case 'ArrowDown': move({ x: 0, y: 1 }); break;
        case 'ArrowUp': rotate(); break;
        case ' ': hardDrop(); break;
        case 'p': setIsPaused(!isPaused); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [move, rotate, hardDrop, gameOver, isPaused, setIsPaused]);

  return (
    <div className="min-h-screen bg-emerald-50 text-emerald-900 font-sans overflow-hidden flex flex-col border-8 border-emerald-600 relative">
      {/* Header Panel */}
      <header className="w-full bg-emerald-600 p-4 sm:p-6 flex justify-between items-center shadow-lg z-20">
        <div className="flex items-center gap-4">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center text-2xl sm:text-4xl shadow-inner border-2 border-emerald-400"
          >
            🐘
          </motion.div>
          <div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase leading-none">
              RIMBA TETRIS <span className="text-yellow-300 text-xl sm:text-2xl font-medium">CERIA</span>
            </h1>
            <p className="text-emerald-200 text-[10px] sm:text-xs font-bold uppercase tracking-widest mt-1">Petualangan Edukatif Anak</p>
          </div>
        </div>
        
        <div className="hidden md:flex gap-4">
          <div className="bg-emerald-700 px-4 py-2 rounded-xl border border-emerald-500 shadow-sm">
            <p className="text-[10px] text-emerald-300 uppercase font-black leading-none mb-1">Status Game</p>
            <p className="text-sm font-bold text-yellow-300 italic">Offline Mode</p>
          </div>
        </div>
      </header>

      {/* Main Game Area */}
      <main className="flex-1 flex flex-col lg:flex-row gap-8 p-6 items-center justify-center z-10">
        {/* Left Stats */}
        <aside className="hidden lg:flex w-48 flex-col gap-6">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-2xl p-6 shadow-md border-b-4 border-gray-200"
          >
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Level</p>
            <p className="text-5xl font-black text-emerald-600">{level.toString().padStart(2, '0')}</p>
          </motion.div>
          
          <div className="bg-white rounded-2xl p-6 shadow-md border-b-4 border-gray-200">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Skor</p>
            <p className="text-3xl font-black text-blue-500 font-mono">{score.toLocaleString()}</p>
          </div>

          <div className="mt-auto bg-emerald-100 p-4 rounded-2xl border-2 border-dashed border-emerald-200">
             <div className="flex items-center gap-2">
                <span className="text-2xl">🐾</span>
                <p className="text-[10px] font-black text-emerald-800 leading-tight uppercase">Belajar Nama Hewan!</p>
             </div>
          </div>
        </aside>

        {/* Center: Game Board */}
        <section className="relative group">
          <div className="bg-emerald-900 p-2 sm:p-3 rounded-2xl border-8 border-emerald-800 shadow-2xl overflow-hidden">
            <div 
              className="grid gap-0.5 sm:gap-1" 
              style={{ 
                gridTemplateColumns: `repeat(${grid[0].length}, minmax(0, 1fr))`,
                width: 'min(75vw, 320px)',
                aspectRatio: '10/20'
              }}
            >
              {grid.map((row, y) => 
                row.map((type, x) => {
                  let activeType: string | null = type;
                  let animalChar: AnimalType | undefined = undefined;
                  if (activePiece) {
                    const pieceX = x - activePiece.pos.x;
                    const pieceY = y - activePiece.pos.y;
                    if (
                      pieceX >= 0 && pieceX < activePiece.shape[0].length &&
                      pieceY >= 0 && pieceY < activePiece.shape.length &&
                      activePiece.shape[pieceY][pieceX] !== 0
                    ) {
                      activeType = activePiece.type as string;
                    }
                  }
                  return <AnimalBlock key={`${y}-${x}`} type={activeType} animal={animalChar} />;
                })
              )}
            </div>
          </div>

          {/* Overlays */}
          <AnimatePresence>
            {(gameOver || isPaused) && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute inset-0 z-30 bg-emerald-950/90 backdrop-blur-md rounded-xl flex flex-col items-center justify-center text-center p-8 border-4 border-emerald-500/30"
              >
                {gameOver ? (
                  <>
                    <div className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center text-5xl mb-4 shadow-lg border-4 border-white">🏆</div>
                    <h2 className="text-3xl font-black text-white mb-2 leading-none">GAME OVER!</h2>
                    <p className="text-emerald-200 mb-8 font-bold uppercase tracking-widest text-sm">Skor Akhir: {score}</p>
                    <button 
                      onClick={resetGame}
                      className="bg-orange-500 hover:bg-orange-400 text-white font-black py-4 px-10 rounded-full shadow-[0_8px_0_rgb(194,65,12)] active:translate-y-1 active:shadow-[0_4px_0_rgb(194,65,12)] transition-all flex items-center gap-3 text-xl"
                    >
                      <RotateCcw strokeWidth={3} /> COBA LAGI
                    </button>
                  </>
                ) : (
                  <>
                    <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center text-5xl mb-6 shadow-lg border-4 border-white">⏸️</div>
                    <h2 className="text-3xl font-black text-white mb-8">PAUSE</h2>
                    <button 
                      onClick={() => setIsPaused(false)}
                      className="bg-emerald-500 hover:bg-emerald-400 text-white font-black py-4 px-10 rounded-full shadow-[0_8px_0_rgb(6,95,70)] active:translate-y-1 active:shadow-[0_4px_0_rgb(6,95,70)] transition-all flex items-center gap-3 text-xl"
                    >
                      <Play fill="currentColor" /> LANJUTKAN
                    </button>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Mobile Stats Bar */}
          <div className="lg:hidden mt-4 flex justify-between gap-4 w-full">
            <div className="bg-white px-4 py-2 rounded-xl shadow-md border-b-4 border-gray-200 flex-1 text-center">
              <span className="text-[10px] font-black text-gray-400 block">LEVEL</span>
              <span className="text-xl font-black text-emerald-600">{level}</span>
            </div>
            <div className="bg-white px-4 py-2 rounded-xl shadow-md border-b-4 border-gray-200 flex-1 text-center">
              <span className="text-[10px] font-black text-gray-400 block">SKOR</span>
              <span className="text-xl font-black text-blue-500">{score}</span>
            </div>
          </div>
        </section>

        {/* Right Info */}
        <aside className="hidden lg:flex w-48 flex-col gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-md border-b-4 border-gray-200 text-center">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Berikutnya</p>
            <div className="w-28 h-28 bg-emerald-50 rounded-2xl border-4 border-dashed border-emerald-200 flex items-center justify-center text-6xl shadow-inner mx-auto mb-2 relative overflow-hidden">
               {/* Show upcoming animal emoji here if available in logic, otherwise static panda for design sync */}
               <span className="relative z-10">🐼</span>
               <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/50 to-transparent" />
            </div>
            <p className="text-[10px] font-black text-emerald-800 uppercase tracking-tight">Panda Lucu</p>
          </div>
          
          <div className="bg-orange-500 rounded-2xl p-6 shadow-lg border-b-8 border-orange-700 text-white transform -rotate-1">
            <p className="text-[10px] font-black uppercase mb-1 opacity-90 tracking-widest">Target Skor</p>
            <p className="text-3xl font-black tabular-nums">{(level * 1000).toLocaleString()}</p>
          </div>
          
          <button 
            onClick={() => setIsPaused(!isPaused)}
            className="w-full bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-black py-4 rounded-2xl shadow-[0_6px_0_rgb(202,138,4)] active:translate-y-1 active:shadow-[0_2px_0_rgb(202,138,4)] transition-all flex items-center justify-center gap-2"
          >
            {isPaused ? <Play fill="currentColor" size={24} /> : <Pause fill="currentColor" size={24} />}
            {isPaused ? 'MAIN' : 'PAUSE'}
          </button>
        </aside>
      </main>

      {/* Footer Controls */}
      <Controls 
        onMove={move} 
        onRotate={rotate} 
        onHardDrop={hardDrop} 
        disabled={gameOver || isPaused}
      />
    </div>
  );
}

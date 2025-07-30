// app/tetris/page.tsx
"use client";

import TetrisBoard from "../components/TetrisBoard";
import Controls from "../components/Controls";
import GameOverModal from "../components/GameOverModal";
import { useTetris } from "../lib/useTetris";
import { AnimatePresence } from "framer-motion";

export default function TetrisPage() {
  const { grid, isRunning, setIsRunning, score, clearingRows } = useTetris();

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-2">Tetris</h1>
      <p className="text-xl mb-4">Pontuação: {score}</p>
      <TetrisBoard grid={grid} clearingRows={clearingRows} />
      <Controls onPause={() => setIsRunning(!isRunning)} />
      <AnimatePresence>
        {!isRunning && (
          <GameOverModal onRestart={() => window.location.reload()} />
        )}
      </AnimatePresence>
    </main>
  );
}

// app/tetris/page.tsx
"use client";

import TetrisBoard from "../components/TetrisBoard";
import Controls from "../components/Controls";
import GameOverModal from "../components/GameOverModal";
import { useTetris } from "../lib/useTetris";
import { AnimatePresence } from "framer-motion";

export default function TetrisPage() {
  const { grid, isRunning, setIsRunning } = useTetris();

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-6">Tetris</h1>
      <TetrisBoard grid={grid} />
      <Controls onPause={() => setIsRunning(!isRunning)} />

      <AnimatePresence>
        {!isRunning && (
          <GameOverModal onRestart={() => window.location.reload()} />
        )}
      </AnimatePresence>
    </main>
  );
}

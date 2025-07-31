"use client";

import TetrisBoard from "../components/TetrisBoard";
import Controls from "../components/Controls";
import GameOverModal from "../components/GameOverModal";
import NextPiece from "../components/NextPiece";
import { useTetris } from "../lib/useTetris";
import { AnimatePresence } from "framer-motion";

export default function TetrisPage() {
  const { grid, isRunning, setIsRunning, score, level, clearingRows, next } =
    useTetris();

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-2">Tetris</h1>
      <p className="text-xl mb-1">Pontuação: {score}</p>
      <p className="text-md mb-4">Nível: {level}</p>
      <div className="flex items-center justify-center ">
        <div className="">
          <TetrisBoard grid={grid} clearingRows={clearingRows} />
        </div>
        <div className="ml-8 flex flex-col items-center">
          <NextPiece piece={next} />
          <Controls onPause={() => setIsRunning(!isRunning)} />
        </div>
      </div>
      <AnimatePresence>
        {!isRunning && (
          <GameOverModal onRestart={() => window.location.reload()} />
        )}
      </AnimatePresence>
    </main>
  );
}

// app/tetris/components/GameOverModal.tsx
import { motion } from "framer-motion";

export default function GameOverModal({
  onRestart,
}: {
  onRestart: () => void;
}) {
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="bg-white p-8 rounded-xl shadow-xl text-center">
        <h2 className="text-2xl font-bold mb-4">Game Over</h2>
        <button
          onClick={onRestart}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Jogar Novamente
        </button>
      </div>
    </motion.div>
  );
}

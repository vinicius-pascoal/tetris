// app/tetris/components/TetrisBoard.tsx
import { Grid } from "../lib/useTetris";
import { motion } from "framer-motion";

export default function TetrisBoard({ grid }: { grid: Grid }) {
  return (
    <div className="grid grid-rows-20 grid-cols-10 gap-[1px] bg-gray-900 border-4 border-gray-700">
      {grid.flat().map((cell, idx) => (
        <motion.div
          key={idx}
          className={`w-6 h-6 ${cell ? "bg-blue-500" : "bg-gray-800"}`}
          layout
        />
      ))}
    </div>
  );
}

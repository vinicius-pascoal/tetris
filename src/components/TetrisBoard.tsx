// app/tetris/components/TetrisBoard.tsx
import { Grid } from "../lib/useTetris";
import { motion } from "framer-motion";

const colors = [
  "bg-transparent", // 0
  "bg-cyan-400", // 1 - I
  "bg-yellow-400", // 2 - O
  "bg-purple-500", // 3 - T
  "bg-green-500", // 4 - S
  "bg-red-500", // 5 - Z
  "bg-blue-500", // 6 - J
  "bg-orange-500", // 7 - L
];

export default function TetrisBoard({
  grid,
  clearingRows,
}: {
  grid: Grid;
  clearingRows: number[];
}) {
  return (
    <div
      className="grid grid-rows-20 grid-cols-10 gap-[1px] bg-gray-900 border-4 border-gray-700"
      style={{ width: "fit-content" }}
    >
      {grid.map((row, rowIdx) =>
        row.map((cell, colIdx) => {
          const isClearing = clearingRows.includes(rowIdx);
          return (
            <motion.div
              key={`${rowIdx}-${colIdx}`}
              className={`w-6 h-6 ${colors[cell]} rounded-sm shadow-inner`}
              animate={{
                opacity: isClearing ? 0 : 1,
                scale: isClearing ? 0.5 : 1,
              }}
              transition={{ duration: 0.3 }}
            />
          );
        })
      )}
    </div>
  );
}

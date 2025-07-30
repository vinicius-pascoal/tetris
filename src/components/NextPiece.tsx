import React from "react";
import { Tetromino } from "../lib/useTetris";

interface Props {
  piece: Tetromino;
}

const colors = [
  "bg-transparent",
  "bg-cyan-400",
  "bg-yellow-400",
  "bg-purple-500",
  "bg-green-500",
  "bg-red-500",
  "bg-blue-500",
  "bg-orange-500",
];

export default function NextPiece({ piece }: Props) {
  return (
    <div className="mt-4 text-center">
      <p className="mb-2 font-semibold text-white">Próxima peça</p>
      <div className="inline-block bg-gray-900 p-2 rounded">
        {piece.shape.map((row, y) => (
          <div key={y} className="flex justify-center">
            {row.map((cell, x) => (
              <div
                key={x}
                className={`w-4 h-4 m-0.5 rounded-sm ${
                  colors[cell] || "bg-gray-800"
                }`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// app/tetris/components/Controls.tsx
export default function Controls({ onPause }: { onPause: () => void }) {
  return (
    <div className="mt-4 flex justify-center gap-4">
      <button
        onClick={onPause}
        className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
      >
        Pausar
      </button>
    </div>
  );
}

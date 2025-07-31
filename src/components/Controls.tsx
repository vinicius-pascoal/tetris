// app/tetris/components/Controls.tsx
export default function Controls({ onPause }: { onPause: () => void }) {
  return (
    <div className="mt-4 flex justify-center gap-4 relative -bottom-40">
      <button
        onClick={onPause}
        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
      >
        fechar
      </button>
    </div>
  );
}

import type { Hint } from "../types/models";

interface HintBoxProps {
  hints: Hint[];
  revealedCount: number;
  onReveal: () => void;
}

export function HintBox({ hints, revealedCount, onReveal }: HintBoxProps) {
  const sorted = [...hints].sort((a, b) => a.order - b.order);
  const nextAvailable = revealedCount < sorted.length;

  return (
    <div className="rounded-lg border border-lab-violet/25 bg-lab-violet/10 p-3">
      <div className="flex items-center justify-between gap-2">
        <h4 className="text-sm font-semibold text-lab-violet">Hints</h4>
        <button
          type="button"
          onClick={onReveal}
          disabled={!nextAvailable}
          className="rounded border border-lab-violet/40 px-3 py-1.5 text-xs font-semibold text-lab-violet disabled:cursor-not-allowed disabled:opacity-40"
        >
          Reveal hint
        </button>
      </div>
      <div className="mt-3 space-y-2">
        {sorted.slice(0, revealedCount).map((hint) => (
          <p key={hint.id} className="rounded border border-white/10 bg-black/20 p-2 text-sm text-slate-200">
            {hint.text}
          </p>
        ))}
        {revealedCount === 0 ? <p className="text-sm text-slate-400">No hints revealed yet.</p> : null}
      </div>
    </div>
  );
}

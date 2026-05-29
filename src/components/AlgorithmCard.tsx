import { BookOpen, FlaskConical } from "lucide-react";
import type { Algorithm } from "../types/models";
import { DifficultyBadge } from "./DifficultyBadge";
import { SecurityBadge } from "./SecurityBadge";

interface AlgorithmCardProps {
  algorithm: Algorithm;
  selected?: boolean;
  onSelect: (id: string) => void;
  onStartLab?: (labId: string) => void;
}

export function AlgorithmCard({ algorithm, selected = false, onSelect, onStartLab }: AlgorithmCardProps) {
  return (
    <article
      className={`rounded-lg border bg-white/[0.045] p-4 transition hover:border-lab-cyan/60 hover:bg-white/[0.07] ${
        selected ? "border-lab-cyan/70 shadow-glow" : "border-white/10"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <button className="group text-left" type="button" onClick={() => onSelect(algorithm.id)}>
          <span className="inline-flex items-center gap-2 text-lg font-semibold text-white">
            <BookOpen className="h-4 w-4 text-lab-cyan" aria-hidden="true" />
            {algorithm.name}
          </span>
          <p className="mt-2 max-w-2xl text-sm text-slate-300">{algorithm.summary}</p>
        </button>
        <div className="flex flex-wrap gap-2">
          <DifficultyBadge difficulty={algorithm.difficulty} />
          <SecurityBadge status={algorithm.securityStatus} />
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onSelect(algorithm.id)}
          className="rounded border border-lab-cyan/40 px-3 py-2 text-sm font-semibold text-lab-cyan transition hover:bg-lab-cyan/10"
        >
          Open module
        </button>
        {algorithm.labId ? (
          <button
            type="button"
            onClick={() => onStartLab?.(algorithm.labId as string)}
            className="inline-flex items-center gap-2 rounded bg-lab-mint px-3 py-2 text-sm font-bold text-slate-950 transition hover:bg-lab-cyan"
          >
            <FlaskConical className="h-4 w-4" aria-hidden="true" />
            Start Lab
          </button>
        ) : null}
      </div>
    </article>
  );
}

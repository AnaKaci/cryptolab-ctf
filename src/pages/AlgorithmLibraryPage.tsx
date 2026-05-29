import { useMemo } from "react";
import { algorithmCategories, algorithms } from "../data/algorithms";
import type { AppMode } from "../types/models";
import { AlgorithmCard } from "../components/AlgorithmCard";
import { AlgorithmDetail } from "../components/AlgorithmDetail";

interface AlgorithmLibraryPageProps {
  mode: AppMode;
  selectedAlgorithmId: string;
  onSelectAlgorithm: (algorithmId: string) => void;
  onStartLab: (labId: string) => void;
}

export function AlgorithmLibraryPage({ mode, selectedAlgorithmId, onSelectAlgorithm, onStartLab }: AlgorithmLibraryPageProps) {
  const selected = algorithms.find((algorithm) => algorithm.id === selectedAlgorithmId) ?? algorithms[0];
  const grouped = useMemo(
    () =>
      algorithmCategories.map((category) => ({
        category,
        algorithms: algorithms.filter((algorithm) => algorithm.categoryId === category.id)
      })),
    []
  );

  return (
    <div className="mx-auto grid max-w-7xl gap-5 xl:grid-cols-[minmax(0,30rem)_minmax(0,1fr)]">
      <section className="space-y-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-lab-cyan">Algorithm Library</p>
          <h1 className="mt-2 text-3xl font-black text-white">Modules by category</h1>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Every module includes status, explanation, process, example, strengths, weaknesses, and a classroom activity idea.
          </p>
        </div>
        <div className="max-h-[calc(100vh-11rem)] space-y-5 overflow-y-auto pr-2 scrollbar-thin">
          {grouped.map(({ category, algorithms: categoryAlgorithms }) => (
            <section key={category.id}>
              <h2 className="mb-2 text-lg font-bold text-white">{category.title}</h2>
              <div className="grid gap-3">
                {categoryAlgorithms.map((algorithm) => (
                  <AlgorithmCard
                    key={algorithm.id}
                    algorithm={algorithm}
                    selected={selected.id === algorithm.id}
                    onSelect={onSelectAlgorithm}
                    onStartLab={onStartLab}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
      <AlgorithmDetail algorithm={selected} mode={mode} onStartLab={onStartLab} />
    </div>
  );
}

interface StepVisualizerProps {
  steps: string[];
}

export function StepVisualizer({ steps }: StepVisualizerProps) {
  return (
    <ol className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {steps.map((step, index) => (
        <li key={step} className="rounded-lg border border-white/10 bg-black/20 p-3">
          <span className="font-mono text-xs text-lab-cyan">STEP {String(index + 1).padStart(2, "0")}</span>
          <p className="mt-2 text-sm text-slate-200">{step}</p>
        </li>
      ))}
    </ol>
  );
}

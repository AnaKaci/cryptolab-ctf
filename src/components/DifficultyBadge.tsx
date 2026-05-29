import type { Difficulty } from "../types/models";

const styles: Record<Difficulty, string> = {
  Intro: "border-slate-500/50 bg-slate-500/15 text-slate-100",
  Easy: "border-lab-mint/50 bg-lab-mint/10 text-lab-mint",
  Medium: "border-lab-amber/60 bg-lab-amber/10 text-lab-amber",
  Hard: "border-lab-rose/60 bg-lab-rose/10 text-lab-rose"
};

interface DifficultyBadgeProps {
  difficulty: Difficulty;
}

export function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  return <span className={`rounded border px-2 py-1 text-xs font-semibold ${styles[difficulty]}`}>{difficulty}</span>;
}

import { Trophy } from "lucide-react";
import type { Challenge } from "../types/models";

interface ScoreboardProps {
  challenges: Challenge[];
  solvedIds: string[];
}

export function Scoreboard({ challenges, solvedIds }: ScoreboardProps) {
  const solved = challenges.filter((challenge) => solvedIds.includes(challenge.id));
  const total = challenges.reduce((sum, challenge) => sum + challenge.points, 0);
  const score = solved.reduce((sum, challenge) => sum + challenge.points, 0);

  return (
    <aside className="rounded-lg border border-lab-mint/25 bg-lab-mint/10 p-4">
      <div className="flex items-center gap-2">
        <Trophy className="h-5 w-5 text-lab-mint" aria-hidden="true" />
        <h3 className="text-lg font-bold text-white">Scoreboard</h3>
      </div>
      <p className="mt-4 text-4xl font-black text-lab-mint">{score}</p>
      <p className="text-sm text-slate-300">of {total} classroom points</p>
      <div className="mt-4 h-3 rounded-full bg-black/40">
        <div className="h-3 rounded-full bg-lab-mint" style={{ width: `${total === 0 ? 0 : (score / total) * 100}%` }} />
      </div>
      <p className="mt-3 text-sm text-slate-300">
        {solved.length} / {challenges.length} challenges solved
      </p>
    </aside>
  );
}

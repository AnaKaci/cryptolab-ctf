import { useState } from "react";
import { CheckCircle2, Lock, Send, ShieldQuestion } from "lucide-react";
import type { Challenge } from "../types/models";
import { DifficultyBadge } from "./DifficultyBadge";
import { HintBox } from "./HintBox";

interface ChallengeCardProps {
  challenge: Challenge;
  solved: boolean;
  locked: boolean;
  revealedHints: number;
  onRevealHint: (challengeId: string) => void;
  onSolve: (challengeId: string) => void;
}

export function ChallengeCard({ challenge, solved, locked, revealedHints, onRevealHint, onSolve }: ChallengeCardProps) {
  const [flag, setFlag] = useState("");
  const [message, setMessage] = useState("");

  const submit = () => {
    if (locked) {
      return;
    }

    if (flag.trim().toUpperCase() === challenge.flag.toUpperCase()) {
      onSolve(challenge.id);
      setMessage("Solved. Nice clean classroom work.");
      return;
    }

    setMessage("Not quite. Check the prompt and try another flag.");
  };

  return (
    <article className={`rounded-lg border p-4 ${solved ? "border-lab-mint/50 bg-lab-mint/10" : "border-white/10 bg-white/[0.045]"}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            {locked ? <Lock className="h-4 w-4 text-slate-500" aria-hidden="true" /> : null}
            {solved ? <CheckCircle2 className="h-4 w-4 text-lab-mint" aria-hidden="true" /> : <ShieldQuestion className="h-4 w-4 text-lab-cyan" aria-hidden="true" />}
            <h3 className="text-lg font-bold text-white">{challenge.title}</h3>
          </div>
          <p className="mt-1 text-sm text-slate-400">
            {challenge.category} · {challenge.points} points · {locked ? "Locked" : solved ? "Solved" : "Available"}
          </p>
        </div>
        <DifficultyBadge difficulty={challenge.difficulty} />
      </div>

      <p className="mt-4 rounded-lg border border-white/10 bg-black/20 p-3 text-sm leading-6 text-slate-200">{challenge.prompt}</p>

      <div className="mt-4">
        <HintBox hints={challenge.hints} revealedCount={revealedHints} onReveal={() => onRevealHint(challenge.id)} />
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <label className="sr-only" htmlFor={`flag-${challenge.id}`}>
          Flag for {challenge.title}
        </label>
        <input
          id={`flag-${challenge.id}`}
          value={flag}
          onChange={(event) => setFlag(event.target.value)}
          disabled={locked || solved}
          placeholder={locked ? "Locked" : solved ? "Solved" : "Enter flag"}
          className="min-h-11 flex-1 rounded-lg border border-white/10 bg-black/30 px-3 text-sm text-white placeholder:text-slate-500 disabled:opacity-60"
        />
        <button
          type="button"
          onClick={submit}
          disabled={locked || solved}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded bg-lab-cyan px-4 text-sm font-bold text-slate-950 transition hover:bg-lab-mint disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Send className="h-4 w-4" aria-hidden="true" />
          Submit
        </button>
      </div>
      {message ? <p className="mt-2 text-sm text-slate-300" role="status">{message}</p> : null}
    </article>
  );
}

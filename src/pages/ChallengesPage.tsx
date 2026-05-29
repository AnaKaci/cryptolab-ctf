import { challenges } from "../data/challenges";
import type { UserProgress } from "../types/models";
import { ChallengeCard } from "../components/ChallengeCard";
import { Scoreboard } from "../components/Scoreboard";
import { SafetyBanner } from "../components/SafetyBanner";

interface ChallengesPageProps {
  progress: UserProgress;
  onRevealHint: (challengeId: string) => void;
  onSolve: (challengeId: string) => void;
}

export function ChallengesPage({ progress, onRevealHint, onSolve }: ChallengesPageProps) {
  const isLocked = (challengeId: string): boolean => {
    const challenge = challenges.find((item) => item.id === challengeId);
    return Boolean(challenge?.unlockAfter?.some((required) => !progress.solvedChallengeIds.includes(required)));
  };

  return (
    <div className="mx-auto grid max-w-7xl gap-5 xl:grid-cols-[minmax(0,1fr)_20rem]">
      <section className="space-y-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-lab-cyan">Challenge Mode</p>
          <h1 className="mt-2 text-3xl font-black text-white">CryptoLab CTF</h1>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Solve local, toy-data challenges with progressive hints and browser-local scoring.
          </p>
        </div>
        <SafetyBanner />
        <div className="grid gap-4">
          {challenges.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              solved={progress.solvedChallengeIds.includes(challenge.id)}
              locked={isLocked(challenge.id)}
              revealedHints={progress.hintsRevealed[challenge.id] ?? 0}
              onRevealHint={onRevealHint}
              onSolve={onSolve}
            />
          ))}
        </div>
      </section>
      <div className="space-y-4 xl:sticky xl:top-6 xl:self-start">
        <Scoreboard challenges={challenges} solvedIds={progress.solvedChallengeIds} />
        <section className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
          <h2 className="font-bold text-white">Student Progress</h2>
          <p className="mt-2 text-sm text-slate-300">Hints are saved locally and can be reset from Lecturer Mode.</p>
        </section>
      </div>
    </div>
  );
}

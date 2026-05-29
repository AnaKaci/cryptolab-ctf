import { Download, RotateCcw } from "lucide-react";
import { algorithmCategories, algorithms } from "../data/algorithms";
import { challenges } from "../data/challenges";
import type { AppMode, UserProgress } from "../types/models";
import { SafetyBanner } from "../components/SafetyBanner";
import { SecurityBadge } from "../components/SecurityBadge";

interface LecturerPageProps {
  mode: AppMode;
  progress: UserProgress;
  onModeChange: (mode: AppMode) => void;
  onResetProgress: () => void;
}

export function LecturerPage({ mode, progress, onModeChange, onResetProgress }: LecturerPageProps) {
  const exportProgress = () => {
    const payload = JSON.stringify(progress, null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "cryptolab-progress.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const lecturerVisible = mode === "lecturer";

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-lab-violet">Lecturer Dashboard</p>
          <h1 className="mt-2 text-3xl font-black text-white">Classroom Control Panel</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
            Use this page for flow planning, talking points, answer keys, worked solutions, and local progress export.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onModeChange("lecturer")}
            className="rounded bg-lab-violet px-3 py-2 text-sm font-bold text-slate-950 hover:bg-lab-cyan"
          >
            Enable Lecturer Mode
          </button>
          <button type="button" onClick={exportProgress} className="inline-flex items-center gap-2 rounded border border-lab-mint/40 px-3 py-2 text-sm font-semibold text-lab-mint hover:bg-lab-mint/10">
            <Download className="h-4 w-4" aria-hidden="true" />
            Export progress JSON
          </button>
          <button type="button" onClick={onResetProgress} className="inline-flex items-center gap-2 rounded border border-lab-rose/50 px-3 py-2 text-sm font-semibold text-lab-rose hover:bg-lab-rose/10">
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Reset student progress
          </button>
        </div>
      </div>

      <SafetyBanner />

      {!lecturerVisible ? (
        <section className="rounded-lg border border-lab-amber/40 bg-lab-amber/10 p-4 text-sm text-slate-200">
          Answer keys and worked solutions are hidden in Student Mode. Switch to Lecturer Mode to display them.
        </section>
      ) : null}

      <section className="grid gap-4 xl:grid-cols-4">
        {["Caesar + modular arithmetic", "Vigenere + frequency signals", "Hashing + HMAC + avalanche", "AES-GCM + nonce discipline", "Toy RSA + DH + trust"].map((item, index) => (
          <article key={item} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <p className="font-mono text-xs text-lab-cyan">FLOW {index + 1}</p>
            <h2 className="mt-2 font-bold text-white">{item}</h2>
            <p className="mt-2 text-sm text-slate-400">Use a lab, then a CTF challenge, then a misconception check.</p>
          </article>
        ))}
      </section>

      <section className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
        <h2 className="text-xl font-black text-white">All Algorithms</h2>
        <div className="mt-4 grid gap-4 xl:grid-cols-2">
          {algorithmCategories.map((category) => (
            <div key={category.id} className="rounded-lg border border-white/10 bg-black/20 p-4">
              <h3 className="font-bold text-lab-cyan">{category.title}</h3>
              <div className="mt-3 space-y-3">
                {algorithms
                  .filter((algorithm) => algorithm.categoryId === category.id)
                  .map((algorithm) => (
                    <article key={algorithm.id} className="rounded border border-white/10 bg-white/[0.035] p-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4 className="font-semibold text-white">{algorithm.name}</h4>
                        <SecurityBadge status={algorithm.securityStatus} />
                      </div>
                      <p className="mt-2 text-sm text-slate-300">{algorithm.classroomActivity}</p>
                      {lecturerVisible ? (
                        <p className="mt-2 text-sm text-slate-400">
                          Misconception check: {algorithm.commonMistakes[0]}
                        </p>
                      ) : null}
                    </article>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
        <h2 className="text-xl font-black text-white">CTF Answer Keys and Worked Solutions</h2>
        <div className="mt-4 grid gap-3">
          {challenges.map((challenge) => (
            <article key={challenge.id} className="rounded-lg border border-white/10 bg-black/20 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-bold text-white">{challenge.title}</h3>
                <span className="rounded border border-lab-cyan/30 px-2 py-1 text-xs font-semibold text-lab-cyan">{challenge.points} pts</span>
              </div>
              <p className="mt-2 text-sm text-slate-300">{challenge.prompt}</p>
              {lecturerVisible ? (
                <div className="mt-3 grid gap-3 lg:grid-cols-2">
                  <div className="rounded border border-lab-mint/25 bg-lab-mint/10 p-3">
                    <h4 className="text-sm font-semibold text-lab-mint">Flag</h4>
                    <p className="mt-1 font-mono text-sm text-white">{challenge.flag}</p>
                  </div>
                  <div className="rounded border border-lab-violet/25 bg-lab-violet/10 p-3">
                    <h4 className="text-sm font-semibold text-lab-violet">Worked solution</h4>
                    <p className="mt-1 text-sm text-slate-200">{challenge.solution}</p>
                  </div>
                </div>
              ) : null}
              {lecturerVisible ? (
                <ul className="mt-3 grid gap-2 text-sm text-slate-300 lg:grid-cols-2">
                  {challenge.talkingPoints.map((point) => (
                    <li key={point} className="rounded border border-white/10 bg-white/[0.035] p-2">{point}</li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

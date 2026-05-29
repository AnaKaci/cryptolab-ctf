import { BarChart3, BookOpen, Flag, FlaskConical, GraduationCap, ShieldCheck } from "lucide-react";
import { algorithmCategories, algorithms, labExamples } from "../data/algorithms";
import { challenges } from "../data/challenges";
import type { AppMode, UserProgress } from "../types/models";
import type { PageId } from "../App";
import { DashboardCard } from "../components/DashboardCard";
import { DifficultyBadge } from "../components/DifficultyBadge";
import { SafetyBanner } from "../components/SafetyBanner";

interface DashboardPageProps {
  progress: UserProgress;
  mode: AppMode;
  onModeChange: (mode: AppMode) => void;
  onNavigate: (page: PageId) => void;
  onStartLab: (labId: string) => void;
}

export function DashboardPage({ progress, mode, onModeChange, onNavigate, onStartLab }: DashboardPageProps) {
  const solved = challenges.filter((challenge) => progress.solvedChallengeIds.includes(challenge.id));
  const totalPoints = challenges.reduce((sum, challenge) => sum + challenge.points, 0);
  const score = solved.reduce((sum, challenge) => sum + challenge.points, 0);
  const labRuns = Object.values(progress.labRuns).reduce((sum, count) => sum + count, 0);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="rounded-lg border border-lab-cyan/20 bg-black/25 p-6 shadow-glow">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-lab-cyan">Classroom crypto range</p>
            <h1 className="mt-3 text-4xl font-black text-white sm:text-5xl">CryptoLab CTF</h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
              A local-first teaching app for explaining cryptographic algorithms, running safe demonstrations, and guiding students
              through toy CTF challenges without touching real systems or third-party data.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => onStartLab("caesar")}
                className="inline-flex items-center gap-2 rounded bg-lab-cyan px-4 py-3 font-bold text-slate-950 transition hover:bg-lab-mint"
              >
                <FlaskConical className="h-5 w-5" aria-hidden="true" />
                Start Lab
              </button>
              <button
                type="button"
                onClick={() => onNavigate("ctf")}
                className="inline-flex items-center gap-2 rounded border border-lab-mint/40 px-4 py-3 font-semibold text-lab-mint transition hover:bg-lab-mint/10"
              >
                <Flag className="h-5 w-5" aria-hidden="true" />
                Open CTF
              </button>
            </div>
          </div>
          <section className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <h2 className="text-lg font-bold text-white">Mode</h2>
            <p className="mt-1 text-sm text-slate-400">Student mode hides answer keys. Lecturer mode reveals solutions and reset tools.</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {(["student", "lecturer"] as AppMode[]).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => onModeChange(item)}
                  className={`rounded-lg border p-4 text-left capitalize transition ${
                    mode === item ? "border-lab-cyan bg-lab-cyan/10 text-white" : "border-white/10 bg-black/20 text-slate-300 hover:bg-white/10"
                  }`}
                >
                  <span className="block text-lg font-bold">{item}</span>
                  <span className="mt-1 block text-xs text-slate-400">{item === "student" ? "Hints and progress" : "Keys and flow"}</span>
                </button>
              ))}
            </div>
          </section>
        </div>
      </section>

      <SafetyBanner />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DashboardCard title="Algorithms" value={String(algorithms.length)} detail="Grouped across classical, modern, hashing, and key-management modules." icon={<BookOpen className="h-5 w-5" />} />
        <DashboardCard title="Labs Run" value={String(labRuns)} detail="Local classroom activity count stored in this browser." icon={<FlaskConical className="h-5 w-5" />} />
        <DashboardCard title="CTF Score" value={`${score}/${totalPoints}`} detail={`${solved.length} of ${challenges.length} challenges solved.`} icon={<BarChart3 className="h-5 w-5" />} />
        <DashboardCard title="Current Mode" value={mode === "student" ? "Student" : "Lecturer"} detail="Switch any time from the sidebar or mode panel." icon={<GraduationCap className="h-5 w-5" />} />
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-2xl font-black text-white">Algorithm Categories</h2>
          <button type="button" onClick={() => onNavigate("library")} className="rounded border border-white/15 px-3 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10">
            View library
          </button>
        </div>
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {algorithmCategories.map((category) => {
            const count = algorithms.filter((algorithm) => algorithm.categoryId === category.id).length;
            return (
              <article key={category.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4 transition hover:border-lab-cyan/50">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-bold text-white">{category.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{category.description}</p>
                  </div>
                  <ShieldCheck className="h-5 w-5 text-lab-cyan" aria-hidden="true" />
                </div>
                <p className="mt-4 text-sm text-slate-400">{count} modules</p>
              </article>
            );
          })}
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-2xl font-black text-white">Recommended Labs</h2>
          <button type="button" onClick={() => onNavigate("labs")} className="rounded border border-white/15 px-3 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10">
            All labs
          </button>
        </div>
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
          {labExamples.slice(0, 4).map((lab) => (
            <article key={lab.id} className="rounded-lg border border-white/10 bg-black/20 p-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-bold text-white">{lab.title}</h3>
                <DifficultyBadge difficulty={lab.difficulty} />
              </div>
              <p className="mt-2 text-sm text-slate-400">{lab.description}</p>
              <button type="button" onClick={() => onStartLab(lab.id)} className="mt-4 rounded bg-lab-mint px-3 py-2 text-sm font-bold text-slate-950 hover:bg-lab-cyan">
                Start Lab
              </button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

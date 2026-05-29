import { BarChart3, BookOpen, Flag, FlaskConical, Home, ShieldCheck, UserRoundCog, Wrench } from "lucide-react";
import type { AppMode } from "../types/models";
import type { PageId } from "../App";

const navItems: Array<{ id: PageId; label: string; icon: typeof Home }> = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "library", label: "Algorithm Library", icon: BookOpen },
  { id: "labs", label: "Interactive Labs", icon: FlaskConical },
  { id: "cryptanalysis", label: "Cryptanalysis Tools", icon: Wrench },
  { id: "ctf", label: "CTF Challenges", icon: Flag },
  { id: "lecturer", label: "Lecturer Mode", icon: UserRoundCog }
];

interface SidebarProps {
  activePage: PageId;
  mode: AppMode;
  onNavigate: (page: PageId) => void;
  onModeChange: (mode: AppMode) => void;
}

export function Sidebar({ activePage, mode, onNavigate, onModeChange }: SidebarProps) {
  return (
    <aside className="flex h-full w-full flex-col border-r border-white/10 bg-black/25 p-4 backdrop-blur lg:fixed lg:inset-y-0 lg:left-0 lg:w-72">
      <div className="rounded-lg border border-lab-cyan/20 bg-lab-cyan/10 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded bg-lab-cyan text-slate-950">
            <ShieldCheck className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-lab-cyan">CryptoLab</p>
            <h1 className="text-xl font-black text-white">CTF</h1>
          </div>
        </div>
      </div>

      <nav className="mt-6 grid gap-2" aria-label="Primary">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = activePage === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition ${
                active ? "bg-lab-cyan text-slate-950" : "text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <section className="mt-6 rounded-lg border border-white/10 bg-white/[0.04] p-3" aria-label="Mode selector">
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-white">
          <BarChart3 className="h-4 w-4 text-lab-mint" aria-hidden="true" />
          Classroom Mode
        </div>
        <div className="grid grid-cols-2 gap-2">
          {(["student", "lecturer"] as AppMode[]).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onModeChange(item)}
              className={`rounded border px-2 py-2 text-sm font-semibold capitalize ${
                mode === item ? "border-lab-mint bg-lab-mint text-slate-950" : "border-white/10 text-slate-300 hover:bg-white/10"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      <p className="mt-auto pt-6 text-xs leading-5 text-slate-500">
        Local-only classroom progress. No network scanning, exploit automation, password cracking, or third-party targeting.
      </p>
    </aside>
  );
}

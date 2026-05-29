import { GraduationCap } from "lucide-react";
import type { LecturerNote } from "../types/models";

interface LecturerPanelProps {
  notes: LecturerNote[];
  commonMistakes: string[];
  visible: boolean;
}

export function LecturerPanel({ notes, commonMistakes, visible }: LecturerPanelProps) {
  if (!visible) {
    return null;
  }

  return (
    <section className="rounded-lg border border-lab-violet/25 bg-lab-violet/10 p-4">
      <div className="flex items-center gap-2">
        <GraduationCap className="h-5 w-5 text-lab-violet" aria-hidden="true" />
        <h3 className="text-lg font-bold text-white">Lecturer Notes</h3>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-lab-violet">Talking cues</h4>
          <ul className="mt-2 space-y-2 text-sm text-slate-200">
            {notes.map((note) => (
              <li key={`${note.title}-${note.body}`} className="rounded border border-white/10 bg-black/20 p-2">
                <strong>{note.title}:</strong> {note.body}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-lab-amber">Common misconceptions</h4>
          <ul className="mt-2 space-y-2 text-sm text-slate-200">
            {commonMistakes.map((mistake) => (
              <li key={mistake} className="rounded border border-white/10 bg-black/20 p-2">
                {mistake}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

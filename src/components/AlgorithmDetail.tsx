import { useMemo, useState } from "react";
import { Play, RotateCcw } from "lucide-react";
import type { Algorithm, AppMode } from "../types/models";
import { affineEncrypt, caesarEncrypt, vigenereEncrypt } from "../lib/crypto/classical";
import { CryptoInput } from "./CryptoInput";
import { CryptoOutput } from "./CryptoOutput";
import { DifficultyBadge } from "./DifficultyBadge";
import { FormulaBlock } from "./FormulaBlock";
import { LecturerPanel } from "./LecturerPanel";
import { SecurityBadge } from "./SecurityBadge";
import { StepVisualizer } from "./StepVisualizer";

interface AlgorithmDetailProps {
  algorithm: Algorithm;
  mode: AppMode;
  onStartLab?: (labId: string) => void;
}

export function AlgorithmDetail({ algorithm, mode, onStartLab }: AlgorithmDetailProps) {
  const defaultInput = useMemo(() => {
    if (algorithm.id === "caesar") {
      return "HELLO CLASS";
    }
    if (algorithm.id === "vigenere") {
      return "ATTACK AT DAWN";
    }
    if (algorithm.id === "affine") {
      return "AFFINE CIPHER";
    }
    return algorithm.example;
  }, [algorithm]);
  const [input, setInput] = useState(defaultInput);
  const [output, setOutput] = useState("");

  const runExample = () => {
    if (algorithm.id === "caesar") {
      setOutput(`Shift 3 -> ${caesarEncrypt(input, 3)}`);
      return;
    }
    if (algorithm.id === "vigenere") {
      setOutput(`Key KEY -> ${vigenereEncrypt(input, "KEY")}`);
      return;
    }
    if (algorithm.id === "affine") {
      setOutput(`a=5, b=8 -> ${affineEncrypt(input, 5, 8)}`);
      return;
    }

    setOutput(`${algorithm.example}\n\nClassroom note: open the full lab when this module has interactive arithmetic or Web Crypto behavior.`);
  };

  const reset = () => {
    setInput(defaultInput);
    setOutput("");
  };

  return (
    <article className="space-y-5 rounded-lg border border-white/10 bg-white/[0.045] p-5 shadow-glow">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-lab-cyan">{algorithm.categoryTitle}</p>
          <h2 className="mt-2 text-3xl font-black text-white">{algorithm.name}</h2>
          <p className="mt-2 max-w-3xl text-slate-300">{algorithm.summary}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <DifficultyBadge difficulty={algorithm.difficulty} />
          <SecurityBadge status={algorithm.securityStatus} />
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <section className="rounded-lg border border-white/10 bg-black/20 p-4">
          <h3 className="text-lg font-bold text-white">What it does</h3>
          <p className="mt-2 text-sm leading-6 text-slate-300">{algorithm.whatItDoes}</p>
        </section>
        <section className="rounded-lg border border-white/10 bg-black/20 p-4">
          <h3 className="text-lg font-bold text-white">How it works</h3>
          <p className="mt-2 text-sm leading-6 text-slate-300">{algorithm.howItWorks}</p>
        </section>
      </div>

      {algorithm.mathDefinition ? <FormulaBlock>{algorithm.mathDefinition}</FormulaBlock> : null}

      <section>
        <h3 className="mb-3 text-lg font-bold text-white">Step-by-step process</h3>
        <StepVisualizer steps={algorithm.process} />
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="rounded-lg border border-white/10 bg-black/20 p-4">
          <CryptoInput id={`quick-${algorithm.id}`} label="Classroom sample input" value={input} onChange={setInput} multiline />
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={runExample}
              className="inline-flex items-center gap-2 rounded bg-lab-cyan px-3 py-2 text-sm font-bold text-slate-950 transition hover:bg-lab-mint"
            >
              <Play className="h-4 w-4" aria-hidden="true" />
              Run Example
            </button>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-2 rounded border border-white/15 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Reset Example
            </button>
            {algorithm.labId ? (
              <button
                type="button"
                onClick={() => onStartLab?.(algorithm.labId as string)}
                className="rounded border border-lab-mint/40 px-3 py-2 text-sm font-semibold text-lab-mint transition hover:bg-lab-mint/10"
              >
                Open Full Lab
              </button>
            ) : null}
          </div>
        </div>
        <CryptoOutput label="Example output" value={output} />
      </section>

      <div className="grid gap-4 xl:grid-cols-3">
        <section className="rounded-lg border border-lab-mint/20 bg-lab-mint/10 p-4">
          <h3 className="font-bold text-lab-mint">Strengths</h3>
          <ul className="mt-2 space-y-2 text-sm text-slate-200">
            {algorithm.strengths.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
        <section className="rounded-lg border border-lab-rose/20 bg-lab-rose/10 p-4">
          <h3 className="font-bold text-lab-rose">Weaknesses</h3>
          <ul className="mt-2 space-y-2 text-sm text-slate-200">
            {algorithm.weaknesses.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
        <section className="rounded-lg border border-lab-amber/20 bg-lab-amber/10 p-4">
          <h3 className="font-bold text-lab-amber">Classroom activity</h3>
          <p className="mt-2 text-sm leading-6 text-slate-200">{algorithm.classroomActivity}</p>
        </section>
      </div>

      <LecturerPanel notes={algorithm.lecturerNotes} commonMistakes={algorithm.commonMistakes} visible={mode === "lecturer"} />
    </article>
  );
}

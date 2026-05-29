import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { AlertTriangle, Calculator, Network, ScanSearch } from "lucide-react";
import { SafetyBanner } from "../components/SafetyBanner";
import {
  estimateVigenereKeyLengths,
  findToyHashCollision,
  kasiskiRepeats,
  letterFrequencies,
  safeAffineSolver,
  safeCaesarSolver,
  toyHash
} from "../lib/crypto/analysis";
import { extendedGcd, gcd, isPrimeSmall, mod, modInverse, modPow } from "../lib/crypto/math";
import { factorSmallN } from "../lib/crypto/toyRsa";

export function CryptanalysisPage() {
  const [caesarText, setCaesarText] = useState("FUBSWR ODE");
  const [frequencyText, setFrequencyText] = useState("WKH TXLFN EURZQ IRA MXPSV RYHU WKH ODCB GRJ");
  const [vigenereText, setVigenereText] = useState("LXFOPVEFRNHRLXFOPVEFRNHR");
  const [affineText, setAffineText] = useState("IHHWVC");
  const [n, setN] = useState("187");
  const [a, setA] = useState("42");
  const [b, setB] = useState("201");
  const [m, setM] = useState("26");
  const [hashSeed, setHashSeed] = useState("classroom");

  const caesarRows = useMemo(() => safeCaesarSolver(caesarText), [caesarText]);
  const frequencies = useMemo(() => letterFrequencies(frequencyText), [frequencyText]);
  const estimates = useMemo(() => estimateVigenereKeyLengths(vigenereText, 12).slice(0, 6), [vigenereText]);
  const repeats = useMemo(() => kasiskiRepeats(vigenereText, 3), [vigenereText]);
  const affineRows = useMemo(() => safeAffineSolver(affineText).slice(0, 12), [affineText]);
  const factor = useMemo(() => factorSmallN(Number(n)), [n]);
  const egcd = useMemo(() => extendedGcd(Number(a), Number(b)), [a, b]);
  const inverse = useMemo(() => modInverse(Number(a), Number(m)), [a, m]);
  const collision = useMemo(() => findToyHashCollision(hashSeed), [hashSeed]);

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-lab-cyan">Safe Sandbox</p>
        <h1 className="mt-2 text-3xl font-black text-white">Cryptanalysis Tools</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
          These helpers operate only on text entered in the app or intentionally weak toy examples generated for classroom use.
        </p>
      </div>
      <SafetyBanner />

      <div className="grid gap-4 xl:grid-cols-2">
        <ToolPanel title="Caesar brute-force solver" icon={<ScanSearch className="h-5 w-5" />}>
          <ToolTextarea id="caesar-tool" label="Toy ciphertext" value={caesarText} onChange={setCaesarText} />
          <div className="mt-3 max-h-64 overflow-y-auto rounded border border-white/10 bg-black/25 p-3 font-mono text-xs scrollbar-thin">
            {caesarRows.map((row) => (
              <p key={row.shift} className="text-slate-200">
                shift {String(row.shift).padStart(2, "0")}: {row.plaintext}
              </p>
            ))}
          </div>
        </ToolPanel>

        <ToolPanel title="Frequency analysis" icon={<Calculator className="h-5 w-5" />}>
          <ToolTextarea id="freq-tool" label="Toy substitution-style text" value={frequencyText} onChange={setFrequencyText} />
          <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-xs sm:grid-cols-3">
            {frequencies.map((entry) => (
              <div key={entry.letter} className="grid grid-cols-[1.5rem_minmax(0,1fr)_2.5rem] items-center gap-2">
                <span className="font-mono text-lab-cyan">{entry.letter}</span>
                <div className="h-2 rounded bg-white/10">
                  <div className="h-2 rounded bg-lab-mint" style={{ width: `${entry.percent}%` }} />
                </div>
                <span className="text-right font-mono text-slate-400">{entry.count}</span>
              </div>
            ))}
          </div>
        </ToolPanel>

        <ToolPanel title="Vigenere key-length estimator" icon={<Network className="h-5 w-5" />}>
          <ToolTextarea id="vig-tool" label="Toy Vigenere ciphertext" value={vigenereText} onChange={setVigenereText} />
          <div className="mt-3 grid gap-2">
            {estimates.map((entry) => (
              <div key={entry.keyLength} className="grid grid-cols-[4rem_minmax(0,1fr)_4rem] items-center gap-2 text-sm">
                <span className="font-mono text-lab-cyan">k={entry.keyLength}</span>
                <div className="h-2 rounded bg-white/10">
                  <div className="h-2 rounded bg-lab-cyan" style={{ width: `${Math.min(entry.score * 1200, 100)}%` }} />
                </div>
                <span className="text-right font-mono text-slate-300">{entry.score.toFixed(3)}</span>
              </div>
            ))}
          </div>
        </ToolPanel>

        <ToolPanel title="Kasiski examination demo" icon={<ScanSearch className="h-5 w-5" />}>
          <p className="text-sm text-slate-300">Repeated trigrams and gaps can hint at a repeated key length.</p>
          <div className="mt-3 space-y-2">
            {repeats.length > 0 ? (
              repeats.map((repeat) => (
                <p key={`${repeat.sequence}-${repeat.positions.join("-")}`} className="rounded border border-white/10 bg-black/20 p-2 font-mono text-xs text-slate-200">
                  {repeat.sequence}: positions {repeat.positions.join(", ")} · gaps {repeat.gaps.join(", ")}
                </p>
              ))
            ) : (
              <p className="text-sm text-slate-400">No repeated trigrams found in this sample.</p>
            )}
          </div>
        </ToolPanel>

        <ToolPanel title="Affine brute-force solver" icon={<ScanSearch className="h-5 w-5" />}>
          <ToolInput id="affine-tool" label="Toy affine ciphertext" value={affineText} onChange={setAffineText} />
          <div className="mt-3 max-h-64 overflow-y-auto rounded border border-white/10 bg-black/25 p-3 font-mono text-xs scrollbar-thin">
            {affineRows.map((row) => (
              <p key={`${row.a}-${row.b}`} className="text-slate-200">
                a={row.a}, b={row.b}: {row.plaintext}
              </p>
            ))}
          </div>
        </ToolPanel>

        <ToolPanel title="Toy RSA small-n factorization" icon={<Calculator className="h-5 w-5" />}>
          <ToolInput id="rsa-factor" label="Intentionally weak n" value={n} onChange={setN} />
          <div className="mt-3 rounded border border-white/10 bg-black/20 p-3 font-mono text-sm text-slate-200">
            {factor ? (
              <p>
                n = {n} = {factor.p} * {factor.q}; phi = {(factor.p - 1) * (factor.q - 1)}
              </p>
            ) : (
              <p>No small factor found. Use classroom-sized composite numbers.</p>
            )}
          </div>
        </ToolPanel>

        <ToolPanel title="Modular arithmetic calculator" icon={<Calculator className="h-5 w-5" />}>
          <div className="grid gap-3 sm:grid-cols-3">
            <ToolInput id="mod-a" label="a" value={a} onChange={setA} />
            <ToolInput id="mod-b" label="b" value={b} onChange={setB} />
            <ToolInput id="mod-m" label="modulus m" value={m} onChange={setM} />
          </div>
          <div className="mt-3 grid gap-2 rounded border border-white/10 bg-black/20 p-3 font-mono text-sm text-slate-200">
            <p>a mod m = {mod(Number(a), Number(m) || 1)}</p>
            <p>a^b mod m = {modPow(Number(a), Math.max(Number(b), 0), Number(m) || 1)}</p>
            <p>gcd(a, b) = {gcd(Number(a), Number(b))}</p>
            <p>a^-1 mod m = {inverse ?? "none"}</p>
            <p>m is prime: {String(isPrimeSmall(Number(m)))}</p>
          </div>
        </ToolPanel>

        <ToolPanel title="Extended Euclidean visualizer" icon={<Calculator className="h-5 w-5" />}>
          <p className="text-sm text-slate-300">
            gcd({a}, {b}) = {egcd.gcd}; coefficients x={egcd.x}, y={egcd.y}
          </p>
          <div className="mt-3 max-h-56 overflow-y-auto rounded border border-white/10 bg-black/25 p-3 font-mono text-xs scrollbar-thin">
            {egcd.steps.map((step, index) => (
              <p key={`${step.a}-${step.b}-${index}`} className="text-slate-200">
                {step.a} = {step.quotient} * {step.b} + {step.remainder}
              </p>
            ))}
          </div>
        </ToolPanel>

        <ToolPanel title="Toy hash collision module" icon={<AlertTriangle className="h-5 w-5" />}>
          <ToolInput id="toy-hash" label="Toy hash seed" value={hashSeed} onChange={setHashSeed} />
          <div className="mt-3 rounded border border-lab-amber/25 bg-lab-amber/10 p-3 text-sm text-slate-200">
            <p>
              toyHash("{hashSeed}") = {toyHash(hashSeed)}
            </p>
            <p className="mt-2">
              Collision demo: "{collision.left}" and "{collision.right}" both map to {collision.hash} in the intentionally tiny 8-bit toy hash.
            </p>
          </div>
        </ToolPanel>

        <ToolPanel title="Padding-oracle concept explainer" icon={<AlertTriangle className="h-5 w-5" />}>
          <p className="text-sm leading-6 text-slate-300">
            This panel does not contact services or decrypt real data. It only shows the concept: if an app reveals different errors for
            padding failure versus authentication failure, that difference can leak information. Modern AEAD modes such as AES-GCM avoid
            exposing a padding step to application code.
          </p>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs font-semibold">
            <div className="rounded border border-white/10 bg-black/25 p-3">Ciphertext block</div>
            <div className="rounded border border-lab-amber/30 bg-lab-amber/10 p-3">Padding check</div>
            <div className="rounded border border-lab-mint/30 bg-lab-mint/10 p-3">Single generic reject</div>
          </div>
        </ToolPanel>
      </div>
    </div>
  );
}

function ToolPanel({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.045] p-4 shadow-glow">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-lab-cyan">{icon}</span>
        <h2 className="text-lg font-bold text-white">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function ToolInput({ id, label, value, onChange }: { id: string; label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block" htmlFor={id}>
      <span className="mb-2 block text-sm font-semibold text-slate-200">{label}</span>
      <input
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white"
      />
    </label>
  );
}

function ToolTextarea({ id, label, value, onChange }: { id: string; label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block" htmlFor={id}>
      <span className="mb-2 block text-sm font-semibold text-slate-200">{label}</span>
      <textarea
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-24 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white"
      />
    </label>
  );
}

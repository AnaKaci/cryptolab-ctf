import { useMemo, useState } from "react";
import { Binary, Check, KeyRound, LockKeyhole, Play, RotateCcw } from "lucide-react";
import { labExamples } from "../data/algorithms";
import { avalancheBits, dhSharedSecret, estimateVigenereKeyLengths, letterFrequencies } from "../lib/crypto/analysis";
import {
  caesarBruteForce,
  caesarDecrypt,
  caesarEncrypt,
  vigenereDecrypt,
  vigenereEncrypt
} from "../lib/crypto/classical";
import { gcd, isPrimeSmall, modInverse } from "../lib/crypto/math";
import {
  generateToyRsaKeys,
  rsaDecryptNumber,
  rsaEncryptNumber,
  rsaSignNumber,
  rsaVerifyNumber,
  type ToyRsaKeyPair
} from "../lib/crypto/toyRsa";
import { aesGcmDecrypt, aesGcmEncrypt, hmacSha256Hex, sha256Hex } from "../lib/crypto/webCrypto";
import { CryptoInput } from "./CryptoInput";
import { CryptoOutput } from "./CryptoOutput";
import { DifficultyBadge } from "./DifficultyBadge";
import { FormulaBlock } from "./FormulaBlock";
import { SafetyBanner } from "./SafetyBanner";

interface LabRunnerProps {
  activeLabId: string;
  onLabChange: (labId: string) => void;
  onRunLab: (labId: string) => void;
}

export function LabRunner({ activeLabId, onLabChange, onRunLab }: LabRunnerProps) {
  const activeLab = labExamples.find((lab) => lab.id === activeLabId) ?? labExamples[0];

  return (
    <div className="space-y-5">
      <SafetyBanner />
      <div className="grid gap-3 xl:grid-cols-[20rem_minmax(0,1fr)]">
        <aside className="rounded-lg border border-white/10 bg-white/[0.045] p-3">
          <h2 className="px-2 text-sm font-semibold uppercase tracking-[0.2em] text-lab-cyan">Interactive Labs</h2>
          <div className="mt-3 grid gap-2">
            {labExamples.map((lab) => (
              <button
                key={lab.id}
                type="button"
                onClick={() => onLabChange(lab.id)}
                className={`rounded-lg border p-3 text-left transition ${
                  lab.id === activeLab.id ? "border-lab-cyan bg-lab-cyan/10" : "border-white/10 bg-black/20 hover:bg-white/10"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-white">{lab.title}</span>
                  <DifficultyBadge difficulty={lab.difficulty} />
                </div>
                <p className="mt-2 text-sm text-slate-400">{lab.description}</p>
              </button>
            ))}
          </div>
        </aside>
        <section className="rounded-lg border border-white/10 bg-white/[0.045] p-4 shadow-glow">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-lab-mint">Lab workspace</p>
              <h2 className="mt-1 text-2xl font-black text-white">{activeLab.title}</h2>
            </div>
            <DifficultyBadge difficulty={activeLab.difficulty} />
          </div>
          <LabContent labId={activeLab.id} onRun={() => onRunLab(activeLab.id)} />
        </section>
      </div>
    </div>
  );
}

function LabContent({ labId, onRun }: { labId: string; onRun: () => void }) {
  if (labId === "caesar") return <CaesarLab onRun={onRun} />;
  if (labId === "vigenere") return <VigenereLab onRun={onRun} />;
  if (labId === "sha-256") return <Sha256Lab onRun={onRun} />;
  if (labId === "hmac") return <HmacLab onRun={onRun} />;
  if (labId === "aes-gcm") return <AesGcmLab onRun={onRun} />;
  if (labId === "rsa-toy") return <RsaToyLab onRun={onRun} />;
  if (labId === "diffie-hellman") return <DiffieHellmanLab onRun={onRun} />;
  return <BlockModeLab onRun={onRun} />;
}

function CaesarLab({ onRun }: { onRun: () => void }) {
  const [text, setText] = useState("FUBSWR ODE");
  const [shift, setShift] = useState(3);
  const [output, setOutput] = useState("");
  const bruteForce = useMemo(() => caesarBruteForce(text), [text]);

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <div className="space-y-4">
        <CryptoInput id="caesar-text" label="Text" value={text} onChange={setText} multiline />
        <label className="block" htmlFor="caesar-shift">
          <span className="mb-2 block text-sm font-semibold text-slate-200">Shift: {shift}</span>
          <input
            id="caesar-shift"
            type="range"
            min={0}
            max={25}
            value={shift}
            onChange={(event) => setShift(Number(event.target.value))}
            className="w-full accent-lab-cyan"
          />
        </label>
        <div className="flex flex-wrap gap-2">
          <LabButton onClick={() => { setOutput(caesarEncrypt(text, shift)); onRun(); }} label="Encrypt" />
          <LabButton onClick={() => { setOutput(caesarDecrypt(text, shift)); onRun(); }} label="Decrypt" />
          <ResetButton onClick={() => { setText("FUBSWR ODE"); setShift(3); setOutput(""); }} />
        </div>
      </div>
      <div className="space-y-4">
        <CryptoOutput label="Caesar result" value={output} />
        <section className="rounded-lg border border-lab-cyan/20 bg-lab-cyan/10 p-3">
          <h3 className="font-semibold text-lab-cyan">Brute-force classroom table</h3>
          <div className="mt-2 max-h-72 overflow-y-auto pr-1 scrollbar-thin">
            {bruteForce.map((row) => (
              <p key={row.shift} className="font-mono text-xs text-slate-200">
                shift {String(row.shift).padStart(2, "0")}: {row.plaintext}
              </p>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function VigenereLab({ onRun }: { onRun: () => void }) {
  const [text, setText] = useState("LXFOPVEFRNHR");
  const [key, setKey] = useState("LEMON");
  const [output, setOutput] = useState("");
  const estimates = useMemo(() => estimateVigenereKeyLengths(text, 10).slice(0, 5), [text]);
  const frequencies = useMemo(() => letterFrequencies(text), [text]);

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <div className="space-y-4">
        <CryptoInput id="vig-text" label="Text" value={text} onChange={setText} multiline />
        <CryptoInput id="vig-key" label="Keyword" value={key} onChange={setKey} />
        <div className="flex flex-wrap gap-2">
          <LabButton onClick={() => { setOutput(vigenereEncrypt(text, key)); onRun(); }} label="Encrypt" />
          <LabButton onClick={() => { setOutput(vigenereDecrypt(text, key)); onRun(); }} label="Decrypt" />
          <ResetButton onClick={() => { setText("LXFOPVEFRNHR"); setKey("LEMON"); setOutput(""); }} />
        </div>
        <CryptoOutput label="Vigenere result" value={output} />
      </div>
      <div className="space-y-4">
        <section className="rounded-lg border border-white/10 bg-black/20 p-3">
          <h3 className="font-semibold text-white">Key-length estimator</h3>
          <p className="mt-1 text-sm text-slate-400">Index of Coincidence scores; higher values can suggest a repeated-key period.</p>
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
        </section>
        <FrequencyBars frequencies={frequencies} />
      </div>
    </div>
  );
}

function Sha256Lab({ onRun }: { onRun: () => void }) {
  const [left, setLeft] = useState("CryptoLab classroom");
  const [right, setRight] = useState("CryptoLab classroom!");
  const [leftHash, setLeftHash] = useState("");
  const [rightHash, setRightHash] = useState("");
  const [error, setError] = useState("");

  const compare = leftHash && rightHash ? avalancheBits(leftHash, rightHash) : null;

  const run = async () => {
    try {
      setError("");
      const [a, b] = await Promise.all([sha256Hex(left), sha256Hex(right)]);
      setLeftHash(a);
      setRightHash(b);
      onRun();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Hashing failed.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-2">
        <CryptoInput id="sha-left" label="Message A" value={left} onChange={setLeft} multiline />
        <CryptoInput id="sha-right" label="Message B" value={right} onChange={setRight} multiline />
      </div>
      <div className="flex flex-wrap gap-2">
        <LabButton onClick={run} label="Hash and Compare" />
        <ResetButton onClick={() => { setLeft("CryptoLab classroom"); setRight("CryptoLab classroom!"); setLeftHash(""); setRightHash(""); setError(""); }} />
      </div>
      {error ? <p className="text-sm text-lab-rose">{error}</p> : null}
      <div className="grid gap-4 xl:grid-cols-2">
        <CryptoOutput label="SHA-256 A" value={leftHash} />
        <CryptoOutput label="SHA-256 B" value={rightHash} />
      </div>
      {compare ? (
        <section className="rounded-lg border border-lab-amber/25 bg-lab-amber/10 p-4">
          <h3 className="font-semibold text-lab-amber">Avalanche effect</h3>
          <p className="mt-2 text-sm text-slate-200">
            {compare.changed} of {compare.total} compared bits changed ({compare.percent.toFixed(1)}%).
          </p>
          <div className="mt-3 h-3 rounded-full bg-black/30">
            <div className="h-3 rounded-full bg-lab-amber" style={{ width: `${compare.percent}%` }} />
          </div>
        </section>
      ) : null}
    </div>
  );
}

function HmacLab({ onRun }: { onRun: () => void }) {
  const [message, setMessage] = useState("attendance=present&lab=crypto");
  const [key, setKey] = useState("class-secret");
  const [tag, setTag] = useState("");
  const [error, setError] = useState("");

  const run = async () => {
    try {
      setError("");
      setTag(await hmacSha256Hex(message, key));
      onRun();
    } catch (err) {
      setError(err instanceof Error ? err.message : "HMAC failed.");
    }
  };

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <div className="space-y-4">
        <CryptoInput id="hmac-message" label="Message" value={message} onChange={setMessage} multiline />
        <CryptoInput id="hmac-key" label="Shared secret key" value={key} onChange={setKey} />
        <div className="flex flex-wrap gap-2">
          <LabButton onClick={run} label="Generate HMAC" />
          <ResetButton onClick={() => { setMessage("attendance=present&lab=crypto"); setKey("class-secret"); setTag(""); setError(""); }} />
        </div>
        {error ? <p className="text-sm text-lab-rose">{error}</p> : null}
      </div>
      <CryptoOutput label="HMAC-SHA-256 tag" value={tag} />
    </div>
  );
}

function AesGcmLab({ onRun }: { onRun: () => void }) {
  const [plaintext, setPlaintext] = useState("Meet after class in the crypto lab.");
  const [key, setKey] = useState("");
  const [iv, setIv] = useState("");
  const [ciphertext, setCiphertext] = useState("");
  const [decrypted, setDecrypted] = useState("");
  const [error, setError] = useState("");

  const encrypt = async () => {
    try {
      setError("");
      const result = await aesGcmEncrypt(plaintext, key || undefined);
      setKey(result.keyBase64);
      setIv(result.ivBase64);
      setCiphertext(result.ciphertextBase64);
      setDecrypted("");
      onRun();
    } catch (err) {
      setError(err instanceof Error ? err.message : "AES-GCM encryption failed.");
    }
  };

  const decrypt = async () => {
    try {
      setError("");
      setDecrypted(await aesGcmDecrypt(ciphertext, key, iv));
      onRun();
    } catch {
      setError("Decryption failed. In AES-GCM, wrong key, IV, or modified ciphertext is rejected.");
    }
  };

  return (
    <div className="space-y-4">
      <FormulaBlock>AES-GCM requires a secret key plus a unique IV/nonce for every encryption under that key.</FormulaBlock>
      <CryptoInput id="aes-plaintext" label="Plaintext" value={plaintext} onChange={setPlaintext} multiline />
      <div className="flex flex-wrap gap-2">
        <LabButton onClick={encrypt} label="Encrypt" />
        <LabButton onClick={decrypt} label="Decrypt" />
        <ResetButton onClick={() => { setPlaintext("Meet after class in the crypto lab."); setKey(""); setIv(""); setCiphertext(""); setDecrypted(""); setError(""); }} />
      </div>
      {error ? <p className="text-sm text-lab-rose">{error}</p> : null}
      <div className="grid gap-4 xl:grid-cols-2">
        <CryptoOutput label="Key (base64, keep secret)" value={key} />
        <CryptoOutput label="IV / nonce (base64, store with ciphertext)" value={iv} />
        <CryptoOutput label="Ciphertext + tag (base64)" value={ciphertext} />
        <CryptoOutput label="Decrypted plaintext" value={decrypted} />
      </div>
    </div>
  );
}

function RsaToyLab({ onRun }: { onRun: () => void }) {
  const [p, setP] = useState("11");
  const [q, setQ] = useState("17");
  const [e, setE] = useState("7");
  const [message, setMessage] = useState("42");
  const [keyPair, setKeyPair] = useState<ToyRsaKeyPair | null>(null);
  const [ciphertext, setCiphertext] = useState("");
  const [plaintext, setPlaintext] = useState("");
  const [signature, setSignature] = useState("");
  const [verified, setVerified] = useState("");
  const [error, setError] = useState("");

  const generate = () => {
    try {
      setError("");
      const pair = generateToyRsaKeys(Number(p), Number(q), Number(e));
      setKeyPair(pair);
      setCiphertext("");
      setPlaintext("");
      setSignature("");
      setVerified("");
      onRun();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Toy RSA key generation failed.");
    }
  };

  const encrypt = () => {
    if (!keyPair) generate();
    const pair = keyPair ?? generateToyRsaKeys(Number(p), Number(q), Number(e));
    try {
      setCiphertext(String(rsaEncryptNumber(Number(message), pair.publicKey)));
      onRun();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Toy RSA encryption failed.");
    }
  };

  const decrypt = () => {
    if (!keyPair || ciphertext === "") return;
    setPlaintext(String(rsaDecryptNumber(Number(ciphertext), keyPair.privateKey)));
    onRun();
  };

  const sign = () => {
    if (!keyPair) return;
    const sig = rsaSignNumber(Number(message), keyPair.privateKey);
    setSignature(String(sig));
    setVerified(String(rsaVerifyNumber(Number(message), sig, keyPair.publicKey)));
    onRun();
  };

  const phi = keyPair?.privateKey.phi ?? (Number(p) - 1) * (Number(q) - 1);
  const inverse = modInverse(Number(e), phi);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-4">
        <CryptoInput id="rsa-p" label="Prime p" value={p} onChange={setP} />
        <CryptoInput id="rsa-q" label="Prime q" value={q} onChange={setQ} />
        <CryptoInput id="rsa-e" label="Public exponent e" value={e} onChange={setE} />
        <CryptoInput id="rsa-message" label="Message number" value={message} onChange={setMessage} />
      </div>
      <div className="flex flex-wrap gap-2">
        <LabButton onClick={generate} label="Generate Keys" />
        <LabButton onClick={encrypt} label="Encrypt" />
        <LabButton onClick={decrypt} label="Decrypt" />
        <LabButton onClick={sign} label="Sign and Verify" />
        <ResetButton onClick={() => { setP("11"); setQ("17"); setE("7"); setMessage("42"); setKeyPair(null); setCiphertext(""); setPlaintext(""); setSignature(""); setVerified(""); setError(""); }} />
      </div>
      {error ? <p className="text-sm text-lab-rose">{error}</p> : null}
      <div className="grid gap-4 xl:grid-cols-3">
        <CryptoOutput
          label="Key arithmetic"
          value={
            keyPair
              ? `n=${keyPair.publicKey.n}\nphi=${keyPair.privateKey.phi}\ne=${keyPair.publicKey.e}\nd=${keyPair.privateKey.d}`
              : `p prime: ${isPrimeSmall(Number(p))}\nq prime: ${isPrimeSmall(Number(q))}\ngcd(e, phi): ${gcd(Number(e), phi)}\ne inverse mod phi: ${inverse ?? "none"}`
          }
        />
        <CryptoOutput label="Ciphertext and plaintext" value={`ciphertext: ${ciphertext || "-"}\nplaintext: ${plaintext || "-"}`} />
        <CryptoOutput label="Signature" value={`signature: ${signature || "-"}\nverified: ${verified || "-"}`} />
      </div>
    </div>
  );
}

function DiffieHellmanLab({ onRun }: { onRun: () => void }) {
  const [prime, setPrime] = useState("23");
  const [base, setBase] = useState("5");
  const [alice, setAlice] = useState("6");
  const [bob, setBob] = useState("15");
  const [result, setResult] = useState("");

  const run = () => {
    const exchange = dhSharedSecret(Number(base), Number(prime), Number(alice), Number(bob));
    setResult(`Alice public A=${exchange.publicA}\nBob public B=${exchange.publicB}\nAlice secret=${exchange.secretA}\nBob secret=${exchange.secretB}\nMatch: ${exchange.matches}`);
    onRun();
  };

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <CryptoInput id="dh-p" label="Prime p" value={prime} onChange={setPrime} />
          <CryptoInput id="dh-g" label="Base g" value={base} onChange={setBase} />
          <CryptoInput id="dh-a" label="Alice private a" value={alice} onChange={setAlice} />
          <CryptoInput id="dh-b" label="Bob private b" value={bob} onChange={setBob} />
        </div>
        <div className="flex flex-wrap gap-2">
          <LabButton onClick={run} label="Compute Shared Secret" />
          <ResetButton onClick={() => { setPrime("23"); setBase("5"); setAlice("6"); setBob("15"); setResult(""); }} />
        </div>
      </div>
      <CryptoOutput label="Diffie-Hellman exchange" value={result} />
    </div>
  );
}

function BlockModeLab({ onRun }: { onRun: () => void }) {
  const [message, setMessage] = useState("CTF-CTF-CTF-CTF-DATA-DATA-DATA-DATA");
  const blocks = useMemo(() => chunkText(message, 4), [message]);
  const palette = ["#42f4ff", "#34f5a6", "#ffd166", "#ff5c8a", "#b68cff", "#7dd3fc"];
  const blockColor = (block: string) => palette[Math.abs(hashBlock(block)) % palette.length];

  return (
    <div className="space-y-4">
      <CryptoInput id="block-mode-message" label="Repeated-block classroom message" value={message} onChange={setMessage} multiline />
      <button
        type="button"
        onClick={onRun}
        className="inline-flex items-center gap-2 rounded bg-lab-cyan px-3 py-2 text-sm font-bold text-slate-950 transition hover:bg-lab-mint"
      >
        <Binary className="h-4 w-4" aria-hidden="true" />
        Refresh Visualization
      </button>
      <div className="grid gap-4 xl:grid-cols-2">
        <ModeBlocks title="ECB-style leakage" subtitle="Equal plaintext blocks create equal-looking ciphertext blocks." blocks={blocks} getColor={blockColor} />
        <ModeBlocks
          title="CBC/CTR/GCM-style concept"
          subtitle="Chaining, counters, IVs, or nonces prevent simple repeated-block patterns."
          blocks={blocks}
          getColor={(block, index) => palette[Math.abs(hashBlock(`${block}-${index}-nonce`)) % palette.length]}
        />
      </div>
    </div>
  );
}

function LabButton({ onClick, label }: { onClick: () => void | Promise<void>; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded bg-lab-cyan px-3 py-2 text-sm font-bold text-slate-950 transition hover:bg-lab-mint"
    >
      <Play className="h-4 w-4" aria-hidden="true" />
      {label}
    </button>
  );
}

function ResetButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded border border-white/15 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
    >
      <RotateCcw className="h-4 w-4" aria-hidden="true" />
      Reset
    </button>
  );
}

function FrequencyBars({ frequencies }: { frequencies: Array<{ letter: string; count: number; percent: number }> }) {
  return (
    <section className="rounded-lg border border-white/10 bg-black/20 p-3">
      <h3 className="font-semibold text-white">Frequency helper</h3>
      <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-xs md:grid-cols-3">
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
    </section>
  );
}

function ModeBlocks({
  title,
  subtitle,
  blocks,
  getColor
}: {
  title: string;
  subtitle: string;
  blocks: string[];
  getColor: (block: string, index: number) => string;
}) {
  return (
    <section className="rounded-lg border border-white/10 bg-black/20 p-4">
      <div className="flex items-center gap-2">
        {title.includes("ECB") ? <LockKeyhole className="h-4 w-4 text-lab-rose" aria-hidden="true" /> : <KeyRound className="h-4 w-4 text-lab-mint" aria-hidden="true" />}
        <h3 className="font-semibold text-white">{title}</h3>
      </div>
      <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
      <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-6">
        {blocks.map((block, index) => (
          <div
            key={`${block}-${index}`}
            className="flex aspect-square items-center justify-center rounded border border-white/15 text-center font-mono text-xs font-bold text-slate-950"
            style={{ backgroundColor: getColor(block, index) }}
            title={block}
          >
            {block || "pad"}
          </div>
        ))}
      </div>
    </section>
  );
}

const chunkText = (text: string, size: number): string[] => {
  const chunks: string[] = [];
  for (let index = 0; index < text.length; index += size) {
    chunks.push(text.slice(index, index + size).padEnd(size, "_"));
  }
  return chunks.length > 0 ? chunks : ["____"];
};

const hashBlock = (block: string): number =>
  [...block].reduce((sum, char, index) => sum + char.charCodeAt(0) * (index + 7), 0);

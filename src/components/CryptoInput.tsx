interface CryptoInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  placeholder?: string;
}

export function CryptoInput({ id, label, value, onChange, multiline = false, placeholder }: CryptoInputProps) {
  const className =
    "w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-lab-cyan";

  return (
    <label className="block" htmlFor={id}>
      <span className="mb-2 block text-sm font-semibold text-slate-200">{label}</span>
      {multiline ? (
        <textarea id={id} className={`${className} min-h-28 resize-y`} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
      ) : (
        <input id={id} className={className} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
      )}
    </label>
  );
}

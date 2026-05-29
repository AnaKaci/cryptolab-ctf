interface CryptoOutputProps {
  label: string;
  value: string;
}

export function CryptoOutput({ label, value }: CryptoOutputProps) {
  return (
    <section className="rounded-lg border border-lab-mint/25 bg-lab-mint/10 p-3" aria-label={label}>
      <h4 className="text-sm font-semibold text-lab-mint">{label}</h4>
      <pre className="mt-2 min-h-12 whitespace-pre-wrap break-words font-mono text-sm text-mint-50">{value || "Output will appear here."}</pre>
    </section>
  );
}

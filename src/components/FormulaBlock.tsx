interface FormulaBlockProps {
  children: string;
}

export function FormulaBlock({ children }: FormulaBlockProps) {
  return (
    <pre className="overflow-x-auto rounded-lg border border-lab-cyan/20 bg-black/35 p-3 font-mono text-sm text-cyan-50">
      <code>{children}</code>
    </pre>
  );
}

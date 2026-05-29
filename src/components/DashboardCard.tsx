import type { ReactNode } from "react";

interface DashboardCardProps {
  title: string;
  value: string;
  detail: string;
  icon?: ReactNode;
}

export function DashboardCard({ title, value, detail, icon }: DashboardCardProps) {
  return (
    <article className="rounded-lg border border-white/10 bg-white/[0.045] p-4 shadow-glow">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-medium text-slate-300">{title}</h3>
          <p className="mt-2 text-3xl font-bold text-white">{value}</p>
        </div>
        <div className="rounded-lg border border-lab-cyan/20 bg-lab-cyan/10 p-2 text-lab-cyan">{icon}</div>
      </div>
      <p className="mt-3 text-sm text-slate-400">{detail}</p>
    </article>
  );
}

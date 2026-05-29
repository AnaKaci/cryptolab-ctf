import type { SecurityStatus } from "../types/models";

const labels: Record<SecurityStatus, string> = {
  secure: "Secure for modern use",
  educational: "Educational only",
  deprecated: "Deprecated",
  broken: "Broken"
};

const styles: Record<SecurityStatus, string> = {
  secure: "border-lab-mint/60 bg-lab-mint/12 text-lab-mint",
  educational: "border-lab-cyan/60 bg-lab-cyan/12 text-lab-cyan",
  deprecated: "border-lab-amber/70 bg-lab-amber/12 text-lab-amber",
  broken: "border-lab-rose/70 bg-lab-rose/12 text-lab-rose"
};

interface SecurityBadgeProps {
  status: SecurityStatus;
}

export function SecurityBadge({ status }: SecurityBadgeProps) {
  return (
    <span className={`inline-flex items-center rounded border px-2 py-1 text-xs font-semibold uppercase tracking-wide ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

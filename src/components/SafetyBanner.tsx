import { ShieldAlert } from "lucide-react";

export function SafetyBanner() {
  return (
    <section className="rounded-lg border border-lab-amber/50 bg-lab-amber/10 p-4 text-sm text-amber-50 shadow-glow" aria-label="Safety scope">
      <div className="flex gap-3">
        <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-lab-amber" aria-hidden="true" />
        <p>
          <strong>Safety scope:</strong> These tools are for classroom learning on toy data only. They must not be used against real
          systems, real users, real password hashes, or third-party data.
        </p>
      </div>
    </section>
  );
}

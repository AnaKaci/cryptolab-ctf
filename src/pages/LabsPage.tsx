import { LabRunner } from "../components/LabRunner";

interface LabsPageProps {
  activeLabId: string;
  onLabChange: (labId: string) => void;
  onRunLab: (labId: string) => void;
}

export function LabsPage({ activeLabId, onLabChange, onRunLab }: LabsPageProps) {
  return (
    <div className="mx-auto max-w-7xl">
      <LabRunner activeLabId={activeLabId} onLabChange={onLabChange} onRunLab={onRunLab} />
    </div>
  );
}

import { useEffect, useState } from "react";
import { AppShell } from "./components/AppShell";
import { challenges } from "./data/challenges";
import { defaultProgress, loadProgress, resetProgressStorage, saveProgress, updateMode } from "./lib/storage";
import { AlgorithmLibraryPage } from "./pages/AlgorithmLibraryPage";
import { ChallengesPage } from "./pages/ChallengesPage";
import { CryptanalysisPage } from "./pages/CryptanalysisPage";
import { DashboardPage } from "./pages/DashboardPage";
import { LabsPage } from "./pages/LabsPage";
import { LecturerPage } from "./pages/LecturerPage";
import type { AppMode, UserProgress } from "./types/models";

export type PageId = "dashboard" | "library" | "labs" | "cryptanalysis" | "ctf" | "lecturer";

export default function App() {
  const [activePage, setActivePage] = useState<PageId>("dashboard");
  const [activeLabId, setActiveLabId] = useState("caesar");
  const [selectedAlgorithmId, setSelectedAlgorithmId] = useState("caesar");
  const [progress, setProgress] = useState<UserProgress>(() => {
    if (typeof localStorage === "undefined") {
      return defaultProgress();
    }
    return loadProgress();
  });

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const setMode = (mode: AppMode) => setProgress((current) => updateMode(current, mode));

  const startLab = (labId: string) => {
    setActiveLabId(labId);
    setActivePage("labs");
  };

  const recordLabRun = (labId: string) => {
    setProgress((current) => ({
      ...current,
      labRuns: { ...current.labRuns, [labId]: (current.labRuns[labId] ?? 0) + 1 }
    }));
  };

  const selectAlgorithm = (algorithmId: string) => {
    setSelectedAlgorithmId(algorithmId);
    setProgress((current) => ({
      ...current,
      visitedAlgorithms: current.visitedAlgorithms.includes(algorithmId)
        ? current.visitedAlgorithms
        : [...current.visitedAlgorithms, algorithmId]
    }));
  };

  const revealHint = (challengeId: string) => {
    const challenge = challenges.find((item) => item.id === challengeId);
    if (!challenge) {
      return;
    }
    setProgress((current) => ({
      ...current,
      hintsRevealed: {
        ...current.hintsRevealed,
        [challengeId]: Math.min((current.hintsRevealed[challengeId] ?? 0) + 1, challenge.hints.length)
      }
    }));
  };

  const solveChallenge = (challengeId: string) => {
    setProgress((current) => ({
      ...current,
      solvedChallengeIds: current.solvedChallengeIds.includes(challengeId)
        ? current.solvedChallengeIds
        : [...current.solvedChallengeIds, challengeId]
    }));
  };

  const resetProgress = () => {
    setProgress(resetProgressStorage());
  };

  const renderPage = () => {
    if (activePage === "library") {
      return (
        <AlgorithmLibraryPage
          mode={progress.mode}
          selectedAlgorithmId={selectedAlgorithmId}
          onSelectAlgorithm={selectAlgorithm}
          onStartLab={startLab}
        />
      );
    }
    if (activePage === "labs") {
      return <LabsPage activeLabId={activeLabId} onLabChange={setActiveLabId} onRunLab={recordLabRun} />;
    }
    if (activePage === "cryptanalysis") {
      return <CryptanalysisPage />;
    }
    if (activePage === "ctf") {
      return <ChallengesPage progress={progress} onRevealHint={revealHint} onSolve={solveChallenge} />;
    }
    if (activePage === "lecturer") {
      return <LecturerPage mode={progress.mode} progress={progress} onModeChange={setMode} onResetProgress={resetProgress} />;
    }
    return (
      <DashboardPage
        progress={progress}
        mode={progress.mode}
        onModeChange={setMode}
        onNavigate={setActivePage}
        onStartLab={startLab}
      />
    );
  };

  return (
    <AppShell activePage={activePage} mode={progress.mode} onNavigate={setActivePage} onModeChange={setMode}>
      {renderPage()}
    </AppShell>
  );
}

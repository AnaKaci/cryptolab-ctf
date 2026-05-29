import type { AppMode, UserProgress } from "../types/models";

const STORAGE_KEY = "cryptolab-ctf-progress-v1";

export const defaultProgress = (): UserProgress => ({
  mode: "student",
  solvedChallengeIds: [],
  hintsRevealed: {},
  labRuns: {},
  visitedAlgorithms: [],
  lastUpdated: new Date().toISOString()
});

export const loadProgress = (): UserProgress => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return defaultProgress();
    }

    return { ...defaultProgress(), ...JSON.parse(raw) } as UserProgress;
  } catch {
    return defaultProgress();
  }
};

export const saveProgress = (progress: UserProgress): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...progress, lastUpdated: new Date().toISOString() }));
};

export const resetProgressStorage = (): UserProgress => {
  const fresh = defaultProgress();
  saveProgress(fresh);
  return fresh;
};

export const updateMode = (progress: UserProgress, mode: AppMode): UserProgress => ({ ...progress, mode });

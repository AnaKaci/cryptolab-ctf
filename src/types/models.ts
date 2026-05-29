export type SecurityStatus = "secure" | "educational" | "deprecated" | "broken";

export type Difficulty = "Intro" | "Easy" | "Medium" | "Hard";

export type AppMode = "student" | "lecturer";

export interface AlgorithmCategory {
  id: string;
  title: string;
  description: string;
  accent: string;
}

export interface LecturerNote {
  title: string;
  body: string;
}

export interface Algorithm {
  id: string;
  name: string;
  categoryId: string;
  categoryTitle: string;
  difficulty: Difficulty;
  securityStatus: SecurityStatus;
  summary: string;
  whatItDoes: string;
  howItWorks: string;
  mathDefinition?: string;
  process: string[];
  example: string;
  strengths: string[];
  weaknesses: string[];
  classroomActivity: string;
  lecturerNotes: LecturerNote[];
  commonMistakes: string[];
  labId?: string;
}

export interface LabExample {
  id: string;
  algorithmId: string;
  title: string;
  description: string;
  difficulty: Difficulty;
}

export interface Hint {
  id: string;
  order: number;
  text: string;
}

export interface Challenge {
  id: string;
  title: string;
  category: string;
  difficulty: Difficulty;
  points: number;
  status: "locked" | "available" | "solved";
  prompt: string;
  hints: Hint[];
  flag: string;
  solution: string;
  talkingPoints: string[];
  unlockAfter?: string[];
}

export interface UserProgress {
  mode: AppMode;
  solvedChallengeIds: string[];
  hintsRevealed: Record<string, number>;
  labRuns: Record<string, number>;
  visitedAlgorithms: string[];
  lastUpdated: string;
}

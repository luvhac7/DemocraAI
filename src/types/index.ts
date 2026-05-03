export interface Candidate {
  id: string;
  name: string;
  party: string;
  image?: string;
  vision: string;
  votes?: number;
  percentage?: string;
}

export interface SimulationResult {
  timestamp: string;
  winner: Candidate;
  results: Candidate[];
  totalVotes: number;
}

export interface NewsRecord {
  id?: string;
  text: string;
  label: "Real" | "Fake" | "Misleading";
  confidence: number;
  reasoning: string;
  keyPoints?: string[];
  timestamp: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  civicScore: number;
  location?: string;
  age?: number;
}

export interface Score {
  total: number;
  accuracy: number;
  efficiency: number;
  exactAccuracy: number;
  partialAccuracy: number;
  wordLevelAccuracy: number;
  normalizedEditDistance: number;
}

export interface GameScore {
  id: number;
  User: string;
  Score: number;
  Response?: string;
  created_at: string;
  exactAccuracy: number;
  partialAccuracy: number;
  wordLevelAccuracy: number;
  normalizedEditDistance: number;
}

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
  User: string;
  Score: number;
  Response?: string;
  exactAccuracy: number;
  partialAccuracy: number;
  wordLevelAccuracy: number;
  normalizedEditDistance: number;
  id?: number;
  created_at?: string;
}

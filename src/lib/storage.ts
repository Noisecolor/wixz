import { type Score } from '../types';
import scores from '../data/scores.json';

interface ScoresData {
  scores: Score[];
}

let localScores: Score[] = scores.scores;

export const storage = {
  getScores(): Score[] {
    return localScores;
  },

  saveScore(score: Score): void {
    localScores.push(score);
    // Save to localStorage for persistence
    localStorage.setItem('scores', JSON.stringify({ scores: localScores }));
  },

  loadScores(): void {
    const savedScores = localStorage.getItem('scores');
    if (savedScores) {
      const data = JSON.parse(savedScores) as ScoresData;
      localScores = data.scores;
    }
  }
};

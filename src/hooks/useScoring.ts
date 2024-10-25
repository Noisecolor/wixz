import { type Score } from '../types';
import levenshtein from 'fast-levenshtein';
import { calculateEfficiency } from '../utils/parseUtils';

export function useScoring() {
  const calculateScore = (response: string, originalWords: string[], systemPrompt: string): Score => {
    try {
      console.log('Raw response:', response);
      console.log('Original words:', originalWords);
      console.log('System prompt:', systemPrompt);

      // Create expected sorted array from original words
      const expectedSorted = [...originalWords].sort((a, b) => 
        a.toLowerCase().localeCompare(b.toLowerCase())
      );

      // Split response into words
      const responseWords = response.split(',').map(word => word.trim());

      console.log('Expected sorted:', expectedSorted);
      console.log('Response words:', responseWords);

      // Calculate accuracy metrics
      const exactAccuracy = calculateExactAccuracy(expectedSorted, responseWords);
      const partialAccuracy = calculatePartialAccuracy(expectedSorted, responseWords);
      const wordLevelAccuracy = calculateWordLevelAccuracy(expectedSorted, responseWords);
      const editDistance = calculateEditDistance(expectedSorted, responseWords);

      console.log('Metrics:', {
        exactAccuracy,
        partialAccuracy,
        wordLevelAccuracy,
        editDistance
      });

      // Normalize edit distance to a 0-100 scale (inverse, as lower is better)
      const normalizedEditDistance = Math.max(0, 100 - (editDistance * 10));

      // Calculate efficiency based on system prompt only
      const efficiency = calculateEfficiency(systemPrompt);

      // Calculate accuracy score with new weights (40-20-20-20)
      const accuracyScore = Math.round(
        (exactAccuracy * 0.4 + 
         partialAccuracy * 0.2 + 
         wordLevelAccuracy * 0.2 + 
         normalizedEditDistance * 0.2) * 100
      );

      console.log('Component scores:', {
        accuracyScore,
        efficiency,
        normalizedEditDistance
      });

      // Calculate total score (weighted average of accuracy and efficiency)
      const total = Math.round((accuracyScore * 0.6 + efficiency * 0.4));

      console.log('Final score:', total);

      return {
        total,
        accuracy: accuracyScore,
        efficiency,
        exactAccuracy: Math.round(exactAccuracy * 100),
        partialAccuracy: Math.round(partialAccuracy * 100),
        wordLevelAccuracy: Math.round(wordLevelAccuracy * 100),
        normalizedEditDistance: Math.round(normalizedEditDistance)
      };
    } catch (error) {
      console.error('Error in calculateScore:', error);
      // Return default score on error
      return {
        total: 0,
        accuracy: 0,
        efficiency: 0,
        exactAccuracy: 0,
        partialAccuracy: 0,
        wordLevelAccuracy: 0,
        normalizedEditDistance: 0
      };
    }
  };

  // Exact accuracy (full match with partial credit for length mismatch)
  const calculateExactAccuracy = (expected: string[], actual: string[]): number => {
    try {
      const maxLength = Math.max(expected.length, actual.length);
      if (maxLength === 0) return 0;

      let correct = 0;
      const minLength = Math.min(expected.length, actual.length);
      
      for (let i = 0; i < minLength; i++) {
        if (expected[i].toLowerCase() === actual[i].toLowerCase()) {
          correct++;
        }
      }

      return correct / maxLength; // Normalize by max length to penalize length mismatches
    } catch (error) {
      console.error('Error in calculateExactAccuracy:', error);
      return 0;
    }
  };

  // Partial accuracy (percentage of words in correct relative position)
  const calculatePartialAccuracy = (expected: string[], actual: string[]): number => {
    try {
      if (expected.length <= 1 || actual.length <= 1) return 1; // Perfect score for single word or empty
      
      let correct = 0;
      const pairs = Math.min(expected.length - 1, actual.length - 1);
      
      for (let i = 0; i < pairs; i++) {
        // Check if relative ordering is maintained
        const expectedOrder = expected[i].toLowerCase().localeCompare(expected[i + 1].toLowerCase());
        const actualOrder = actual[i].toLowerCase().localeCompare(actual[i + 1].toLowerCase());
        if (Math.sign(expectedOrder) === Math.sign(actualOrder)) correct++;
      }

      return correct / pairs;
    } catch (error) {
      console.error('Error in calculatePartialAccuracy:', error);
      return 0;
    }
  };

  // Word-level accuracy (words present regardless of position)
  const calculateWordLevelAccuracy = (expected: string[], actual: string[]): number => {
    try {
      if (expected.length === 0) return 0;
      
      const expectedSet = new Set(expected.map(w => w.toLowerCase()));
      const actualSet = new Set(actual.map(w => w.toLowerCase()));
      
      let matchCount = 0;
      for (const word of expectedSet) {
        if (actualSet.has(word)) matchCount++;
      }

      return matchCount / expectedSet.size;
    } catch (error) {
      console.error('Error in calculateWordLevelAccuracy:', error);
      return 0;
    }
  };

  // Edit distance metric (normalized)
  const calculateEditDistance = (expected: string[], actual: string[]): number => {
    try {
      const expectedStr = expected.join(' ').toLowerCase();
      const actualStr = actual.join(' ').toLowerCase();
      const maxLength = Math.max(expectedStr.length, actualStr.length, 1);
      return levenshtein.get(expectedStr, actualStr) / maxLength;
    } catch (error) {
      console.error('Error in calculateEditDistance:', error);
      return 1; // Maximum distance on error
    }
  };

  return { calculateScore };
}

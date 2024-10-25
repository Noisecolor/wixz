import wordsData from '../data/words.csv?raw';

export function getRandomWords(count?: number): string[] {
  const words = wordsData.split('\n').filter(word => word.trim().length > 0);
  const shuffled = [...words].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count || words.length);
}

export function getTotalWordCount(): number {
  return wordsData.split('\n').filter(word => word.trim().length > 0).length;
}

export function sanitizeLLMResponse(response: string): string {
  // First check if it's already in the correct format
  // This regex checks if the string only contains words, commas, and whitespace
  const isCleanFormat = /^[\w\s,]+$/.test(response);
  
  if (isCleanFormat) {
    // Just clean up any extra whitespace and return
    return response.split(',')
      .map(word => word.trim())
      .filter(word => word.length > 0)
      .join(', ');
  }

  // If not in correct format, extract words and reconstruct
  // This will match any sequence of word characters (letters, numbers, underscores)
  const words = response.match(/\b\w+\b/g) || [];
  return words.join(', ');
}

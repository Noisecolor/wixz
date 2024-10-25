// Calculate efficiency based on response formatting
export function calculateEfficiency(response: string): number {
  try {
    let score = 100;

    // Penalize for unnecessary characters but allow some special characters
    const unnecessaryChars = /[^a-zA-Z0-9,\s\u00C0-\u00FF]/g; // Allow extended Latin characters
    const unnecessaryCount = (response.match(unnecessaryChars) || []).length;
    score -= unnecessaryCount * 2;

    // Penalize for multiple spaces or inconsistent formatting
    const formattingIssues = /(\s{2,}|,\s*,|\s+,|,\s*$)/g;
    const formattingCount = (response.match(formattingIssues) || []).length;
    score -= formattingCount * 5;

    // Enhanced penalty for long responses
    const optimalLength = 200; // Baseline optimal length
    const lengthPenalty = Math.max(0, response.length - optimalLength);
    score -= Math.pow(lengthPenalty / 50, 1.5); // Progressive penalty that grows faster

    return Math.max(0, Math.min(100, Math.round(score)));
  } catch (error) {
    console.error('Error in calculateEfficiency:', error);
    return 0;
  }
}

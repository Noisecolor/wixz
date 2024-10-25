import React from 'react';
import type { Score } from '../types';

interface ScoreCardProps {
  score: Score;
  prompt: string;
  response: string;
  originalWords: string[];
}

export default function ScoreCard({ score, prompt, response, originalWords }: ScoreCardProps) {
  const expectedSorted = [...originalWords].sort((a, b) => 
    a.toLowerCase().localeCompare(b.toLowerCase())
  );

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 space-y-6">
      {/* Total Score - Most Important */}
      <div className="text-center border-b border-purple-300/20 pb-6">
        <div className="text-6xl font-bold text-white mb-2">{score.total}</div>
        <div className="text-lg text-purple-200">Total Score</div>
      </div>

      {/* Main Components */}
      <div className="grid grid-cols-2 gap-6 border-b border-purple-300/20 pb-6">
        {/* Accuracy Group */}
        <div className="text-center">
          <div className="text-4xl font-bold text-white mb-2">{score.accuracy}</div>
          <div className="text-sm text-purple-200 mb-4">Accuracy Score</div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-xl font-bold text-white mb-1">{score.exactAccuracy}%</div>
              <div className="text-xs text-purple-200">Exact Match (40%)</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-xl font-bold text-white mb-1">{score.partialAccuracy}%</div>
              <div className="text-xs text-purple-200">Partial Match (20%)</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-xl font-bold text-white mb-1">{score.wordLevelAccuracy}%</div>
              <div className="text-xs text-purple-200">Word Level (20%)</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-xl font-bold text-white mb-1">{score.normalizedEditDistance}</div>
              <div className="text-xs text-purple-200">Edit Distance (20%)</div>
            </div>
          </div>
        </div>

        {/* Efficiency Group */}
        <div className="text-center">
          <div className="text-4xl font-bold text-white mb-2">{score.efficiency}</div>
          <div className="text-sm text-purple-200 mb-4">Efficiency Score</div>
          <div className="bg-white/5 rounded-lg p-4">
            <p className="text-sm text-purple-200">
              Based on response formatting, length, and clarity
            </p>
          </div>
        </div>
      </div>

      {/* Reference Information */}
      <div className="space-y-4 pt-2">
        <div>
          <h3 className="text-sm text-purple-200 mb-2">Expected Sorted Order</h3>
          <div className="bg-white/5 rounded-lg p-4 text-white">
            {expectedSorted.join(', ')}
          </div>
        </div>

        <div>
          <h3 className="text-sm text-purple-200 mb-2">AI Response</h3>
          <div className="bg-white/5 rounded-lg p-4 text-white">
            {response}
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import type { GameScore } from '../types';

interface LeaderBoardProps {
  scores: GameScore[];
}

export default function LeaderBoard({ scores }: LeaderBoardProps) {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
      <h2 className="text-2xl font-bold text-white mb-4">Leaderboard</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-purple-300/20">
              <th className="py-3 px-4 text-sm text-purple-200">Rank</th>
              <th className="py-3 px-4 text-sm text-purple-200">User</th>
              <th className="py-3 px-4 text-sm text-purple-200">Score</th>
              <th className="py-3 px-4 text-sm text-purple-200">Exact</th>
              <th className="py-3 px-4 text-sm text-purple-200">Partial</th>
              <th className="py-3 px-4 text-sm text-purple-200">Word Level</th>
              <th className="py-3 px-4 text-sm text-purple-200">Edit Dist</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((score, index) => (
              <tr 
                key={`score-${index}`}
                className="border-b border-purple-300/10 hover:bg-white/5"
              >
                <td className="py-3 px-4 text-white">{index + 1}</td>
                <td className="py-3 px-4 text-white">{score.User}</td>
                <td className="py-3 px-4 text-white">{score.Score}</td>
                <td className="py-3 px-4 text-white">{score.exactAccuracy}%</td>
                <td className="py-3 px-4 text-white">{score.partialAccuracy}%</td>
                <td className="py-3 px-4 text-white">{score.wordLevelAccuracy}%</td>
                <td className="py-3 px-4 text-white">{score.normalizedEditDistance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

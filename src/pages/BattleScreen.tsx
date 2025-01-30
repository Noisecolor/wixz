import React, { useState, useEffect } from 'react';
import { Swords } from 'lucide-react';
import LeaderBoard from '../components/LeaderBoard';
import ScoreCard from '../components/ScoreCard';
import PromptInput from '../components/PromptInput';
import { useScoring } from '../hooks/useScoring';
import { useGoogleAI } from '../hooks/useGoogleAI';
import { sanitizeLLMResponse } from '../utils/wordUtils';
import { storage } from '../lib/storage';
import { DebugLogger } from '../components/DebugConsole';
import type { Score, GameScore } from '../types';

export default function BattleScreen() {
  const username = localStorage.getItem('username');
  const [scores, setScores] = useState<GameScore[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { calculateScore } = useScoring();
  const { sendPrompt } = useGoogleAI();
  
  const [currentScore, setCurrentScore] = useState<Score>({
    total: 0,
    accuracy: 0,
    efficiency: 0,
    exactAccuracy: 0,
    partialAccuracy: 0,
    wordLevelAccuracy: 0,
    normalizedEditDistance: 0
  });
  const [lastPrompt, setLastPrompt] = useState<string>('');
  const [lastResponse, setLastResponse] = useState<string>('');
  const [originalWords, setOriginalWords] = useState<string[]>([]);

  useEffect(() => {
    DebugLogger.log('info', 'BattleScreen mounted', { username });
    try {
      storage.loadScores();
      const storedScores = storage.getScores();
      DebugLogger.log('debug', 'Loaded scores from storage', { storedScores });
      
      setScores(storedScores.map(score => ({
        User: username || 'Anonymous',
        Score: score.total,
        Response: '',
        exactAccuracy: score.exactAccuracy,
        partialAccuracy: score.partialAccuracy,
        wordLevelAccuracy: score.wordLevelAccuracy,
        normalizedEditDistance: score.normalizedEditDistance
      })));
    } catch (error) {
      DebugLogger.log('error', 'Error loading scores', { error });
    }
  }, [username]);

  const handleQualificationRun = async (systemPrompt: string, testWords: string[]) => {
    if (!systemPrompt || !username) {
      DebugLogger.log('error', 'Invalid qualification run parameters', {
        systemPrompt: !!systemPrompt,
        username: !!username
      });
      return;
    }
    
    setIsLoading(true);
    DebugLogger.log('info', 'Starting qualification run', {
      systemPrompt,
      testWordsCount: testWords.length,
      testWords
    });

    try {
      setLastPrompt(systemPrompt);
      setOriginalWords(testWords);
      
      // Convert test words to user prompt
      const userPrompt = testWords.join(', ');
      DebugLogger.log('debug', 'Sending prompt to AI', {
        systemPrompt,
        userPrompt
      });
      
      const aiResponse = await sendPrompt(systemPrompt, userPrompt);
      DebugLogger.log('debug', 'Received AI response', { aiResponse });
      
      const sanitizedResponse = sanitizeLLMResponse(aiResponse);
      DebugLogger.log('debug', 'Sanitized response', { sanitizedResponse });
      setLastResponse(sanitizedResponse);
      
      const score = calculateScore(sanitizedResponse, testWords, systemPrompt);
      DebugLogger.log('info', 'Calculated score', { score });
      setCurrentScore(score);

      storage.saveScore(score);
      DebugLogger.log('debug', 'Saved score to storage');
      
      // Update displayed scores
      const updatedScores = storage.getScores().map(score => ({
        User: username || 'Anonymous',
        Score: score.total,
        Response: '',
        exactAccuracy: score.exactAccuracy,
        partialAccuracy: score.partialAccuracy,
        wordLevelAccuracy: score.wordLevelAccuracy,
        normalizedEditDistance: score.normalizedEditDistance
      }));
      setScores(updatedScores);
      DebugLogger.log('debug', 'Updated displayed scores', { updatedScores });
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error');
      DebugLogger.log('error', 'Error during qualification run', {
        error: err.message,
        stack: err.stack
      });
      console.error('Error during qualification run:', error);
    } finally {
      setIsLoading(false);
      DebugLogger.log('info', 'Qualification run completed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-purple-900 to-blue-900 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Swords className="w-16 h-16 text-purple-300" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">Battle of the Alphabet</h1>
          <p className="text-xl text-purple-200">
            Create a prompt that instructs the AI to sort an array of strings in alphabetical order.
          </p>
        </header>

        <PromptInput 
          onSubmit={handleQualificationRun}
          isLoading={isLoading}
        />

        <ScoreCard 
          score={currentScore}
          prompt={lastPrompt}
          response={lastResponse}
          originalWords={originalWords}
        />
        
        <LeaderBoard scores={scores} />
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Swords } from 'lucide-react';
import { supabase } from '../lib/supabase';
import LeaderBoard from '../components/LeaderBoard';
import ScoreCard from '../components/ScoreCard';
import PromptInput from '../components/PromptInput';
import { useScoring } from '../hooks/useScoring';
import { useOpenAI } from '../hooks/useOpenAI';
import { sanitizeLLMResponse } from '../utils/wordUtils';
import type { Score, GameScore } from '../types';

export default function BattleScreen() {
  const username = localStorage.getItem('username');
  const [scores, setScores] = useState<GameScore[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { calculateScore } = useScoring();
  const { sendPrompt } = useOpenAI();
  
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

  const fetchScores = async () => {
    try {
      const { data, error } = await supabase
        .from('UserScore')
        .select('*')
        .order('Score', { ascending: false });
      
      if (error) throw error;
      setScores(data || []);
    } catch (error) {
      console.error('Error fetching scores:', error);
    }
  };

  useEffect(() => {
    fetchScores();
  }, []);

  const handleQualificationRun = async (systemPrompt: string, testWords: string[]) => {
    if (!systemPrompt || !username) return;
    
    setIsLoading(true);
    try {
      setLastPrompt(systemPrompt);
      setOriginalWords(testWords);
      
      // Convert test words to user prompt
      const userPrompt = testWords.join(', ');
      
      const aiResponse = await sendPrompt(systemPrompt, userPrompt);
      const sanitizedResponse = sanitizeLLMResponse(aiResponse);
      setLastResponse(sanitizedResponse);
      
      const score = calculateScore(sanitizedResponse, testWords, systemPrompt);
      setCurrentScore(score);

      const { error } = await supabase
        .from('UserScore')
        .insert([{ 
          User: username, 
          Score: score.total,
          Response: sanitizedResponse,
          exactAccuracy: score.exactAccuracy,
          partialAccuracy: score.partialAccuracy,
          wordLevelAccuracy: score.wordLevelAccuracy,
          normalizedEditDistance: score.normalizedEditDistance
        }]);

      if (error) throw error;
      await fetchScores();
    } catch (error) {
      console.error('Error during qualification run:', error);
    } finally {
      setIsLoading(false);
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

import React, { useState } from 'react';
import { getRandomWords } from '../utils/wordUtils';

interface PromptInputProps {
  onSubmit: (systemPrompt: string, testWords: string[]) => void;
  isLoading: boolean;
}

export default function PromptInput({ onSubmit, isLoading }: PromptInputProps) {
  const [userInput, setUserInput] = useState("Sort the following strings in alphabetical order: ");

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserInput(e.target.value);
  };

  const handleSubmit = () => {
    // Get exactly 100 words
    const testWords = getRandomWords(100);
    onSubmit(userInput, testWords);
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 space-y-4">
      <div className="space-y-2">
        <label className="block text-sm text-purple-200">
          System Prompt
        </label>
        <textarea
          value={userInput}
          onChange={handleInputChange}
          className="w-full h-32 p-4 bg-white/5 border border-purple-300/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
          placeholder="Enter your sorting instructions..."
        />
      </div>
      
      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Processing...' : 'Qualification Run'}
      </button>

      <p className="text-sm text-purple-200/70 italic">
        Note: When you submit, your instructions will be used as the system prompt, and 100 random test words will be sent as the user message.
      </p>
    </div>
  );
}

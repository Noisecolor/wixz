import { useState } from 'react';
import { DebugLogger } from '../components/DebugConsole';

export function useGoogleAI() {
  const [error, setError] = useState<Error | null>(null);

  const sendPrompt = async (systemPrompt: string, userPrompt: string): Promise<string> => {
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
    
    if (!apiKey) {
      const error = new Error('Missing Google API key');
      DebugLogger.log('error', 'API Key Missing', { error: error.message });
      throw error;
    }

    try {
      DebugLogger.log('debug', 'Sending request to Google AI API', {
        systemPrompt,
        userPrompt,
        endpoint: 'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent'
      });

      const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${systemPrompt}\n\nUser Input: ${userPrompt}\n\nReturn only the words separated with commas and nothing else`
            }]
          }],
          generationConfig: {
            temperature: 0,
            maxOutputTokens: 2000
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        DebugLogger.log('error', 'Google AI API request failed', {
          status: response.status,
          statusText: response.statusText,
          errorData
        });
        throw new Error(`Google AI API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      DebugLogger.log('debug', 'Received response from Google AI API', { data });
      
      if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error('Invalid response format from Google AI API');
      }

      return data.candidates[0].content.parts[0].text;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      DebugLogger.log('error', 'Error in sendPrompt', {
        error: error.message,
        stack: error.stack
      });
      setError(error);
      throw error;
    }
  };

  return { sendPrompt, error };
}

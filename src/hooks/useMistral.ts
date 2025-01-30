import { useState } from 'react';

export function useMistral() {
  const [error, setError] = useState<Error | null>(null);

  const sendPrompt = async (systemPrompt: string, userPrompt: string): Promise<string> => {
    const apiKey = import.meta.env.VITE_LLM_API_KEY;
    
    if (!apiKey) {
      throw new Error('Missing Mistral API key');
    }

    try {
      const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "mistral-tiny",
          messages: [
            {
              role: "system",
              content: `${systemPrompt}\n\nReturn only the words separated with commas and nothing else`
            },
            {
              role: "user",
              content: userPrompt
            }
          ],
          temperature: 0,
          max_tokens: 2000
        })
      });

      if (!response.ok) {
        throw new Error('Mistral API request failed');
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    }
  };

  return { sendPrompt, error };
}

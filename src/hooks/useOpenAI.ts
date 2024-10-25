import { useState } from 'react';

export function useOpenAI() {
  const [error, setError] = useState<Error | null>(null);

  const sendPrompt = async (systemPrompt: string, userPrompt: string): Promise<string> => {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    
    if (!apiKey) {
      throw new Error('Missing OpenAI API key');
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
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
        throw new Error('OpenAI API request failed');
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

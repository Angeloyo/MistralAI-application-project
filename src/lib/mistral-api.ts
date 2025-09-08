import { MistralModel } from '@/types/models';

export interface ModelResponse {
  model: MistralModel;
  response: string;
  error?: string;
  duration: number;
  judgeScore?: number;
  judgeError?: string;
  judge2Score?: number;
  judge2Error?: string;
}

export async function makeModelCall(
  model: MistralModel, 
  prompt: string, 
  apiKey: string
): Promise<ModelResponse> {
  const startTime = Date.now();
  
  try {
    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model.apiEndpoint,
        messages: [
          {
            role: 'system',
            content: 'Please respond in plain text only - do not use markdown formatting.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    const duration = Date.now() - startTime;

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content;
    
    if (!rawContent) {
      return {
        model,
        response: 'No response received',
        duration,
      };
    }

    // Handle reasoning models (content is an array of chunks)
    if (Array.isArray(rawContent)) {
      let finalAnswer = '';
      
      for (const chunk of rawContent) {
        if (chunk.type === 'text') {
          finalAnswer += chunk.text || '';
        }
        // Skip thinking chunks - we only want the final answer
      }
      
      return {
        model,
        response: finalAnswer || 'No final answer provided',
        duration,
      };
    }
    
    // Handle regular models (content is a string)
    if (typeof rawContent === 'string') {
      return {
        model,
        response: rawContent,
        duration,
      };
    }
    
    // Fallback for unexpected format
    return {
      model,
      response: 'Unexpected response format',
      duration,
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return {
      model,
      response: '',
      error: errorMessage,
      duration,
    };
  }
}

export async function judgeResponse(
  response: string,
  prompt: string,
  apiKey: string
): Promise<{ score: number; error?: string }> {
  try {
    const judgeResponse = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'mistral-medium-2508',
        messages: [
          {
            role: 'system',
            content: 'You are an expert judge for evaluating AI responses. Rate the response on a scale of 0-100 based on: accuracy, clarity, completeness, and helpfulness in answering the given prompt. Only return the numerical score, nothing else.',
          },
          {
            role: 'user',
            content: `Original prompt: "${prompt}"\n\nResponse to rate:\n${response}\n\nPlease rate how well this response answers the prompt (0-100):`,
          },
        ],
        max_tokens: 10,
        temperature: 0.1,
      }),
    });

    if (!judgeResponse.ok) {
      return { score: 0, error: 'Judge API call failed' };
    }

    const data = await judgeResponse.json();
    const rawContent = data.choices?.[0]?.message?.content;
    
    let scoreText = '';
    if (Array.isArray(rawContent)) {
      for (const chunk of rawContent) {
        if (chunk.type === 'text') {
          scoreText += chunk.text || '';
        }
      }
    } else if (typeof rawContent === 'string') {
      scoreText = rawContent;
    }

    const score = parseInt(scoreText.trim());
    if (isNaN(score) || score < 0 || score > 100) {
      return { score: 0, error: 'Invalid score format' };
    }

    return { score };
  } catch (error) {
    return { score: 0, error: 'Judge failed' };
  }
}

export async function judgeResponseWithContext(
  targetResponse: string,
  targetModel: string,
  allResponses: ModelResponse[],
  prompt: string,
  apiKey: string
): Promise<{ score: number; error?: string }> {
  try {
    // Build context with all responses
    const contextText = allResponses
      .filter(r => !r.error)
      .map(r => `${r.model.name}: ${r.response}`)
      .join('\n\n---\n\n');

    const judgeResponse = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'mistral-medium-2508',
        messages: [
          {
            role: 'system',
            content: 'You are an expert judge comparing AI responses. Rate the TARGET response on a scale of 0-100 based on: accuracy, clarity, completeness, and helpfulness in answering the given prompt, compared to the other responses. Only return the numerical score, nothing else.',
          },
          {
            role: 'user',
            content: `Original prompt: "${prompt}"\n\nHere are all the responses to compare:\n\n${contextText}\n\nPlease rate how well the response from ${targetModel} answers the prompt compared to others (0-100):`,
          },
        ],
        max_tokens: 10,
        temperature: 0.1,
      }),
    });

    if (!judgeResponse.ok) {
      return { score: 0, error: 'Judge 2 API call failed' };
    }

    const data = await judgeResponse.json();
    const rawContent = data.choices?.[0]?.message?.content;
    
    let scoreText = '';
    if (Array.isArray(rawContent)) {
      for (const chunk of rawContent) {
        if (chunk.type === 'text') {
          scoreText += chunk.text || '';
        }
      }
    } else if (typeof rawContent === 'string') {
      scoreText = rawContent;
    }

    const score = parseInt(scoreText.trim());
    if (isNaN(score) || score < 0 || score > 100) {
      return { score: 0, error: 'Invalid score format' };
    }

    return { score };
  } catch (error) {
    return { score: 0, error: 'Judge 2 failed' };
  }
}
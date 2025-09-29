import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import {config} from './config';

const apiKey = config.geminiApiKey;
console.log('API Key available:', !!apiKey); // Will log true/false without exposing the key
console.log('API Key length:', apiKey?.length || 0); // Log length of the key for validation

if (!apiKey) {
  throw new Error('GEMINI_API_KEY environment variable is not set');
}


let ai: ReturnType<typeof genkit>;

try {
  const plugin = googleAI({
    apiKey,
  });

  ai = genkit({
    plugins: [plugin],
    model: 'googleai/gemini-2.5-flash', // Using Gemini 2.5 Flash model
  });

  console.log('Genkit initialized successfully');
} catch (error: any) {
  console.error('Error initializing Genkit:', error?.message);
  throw error;
}

export { ai };

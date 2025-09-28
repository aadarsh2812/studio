'use server';
/**
 * @fileOverview A conversational chat flow for the Athlete Sentinel assistant.
 *
 * - chat - A function that handles the conversational chat process.
 * - ChatInput - The input type for the chat function.
 * - ChatOutput - The return type for the chat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatInputSchema = z.object({
  history: z.array(
    z.object({
      role: z.enum(['user', 'model']),
      content: z.string(),
    })
  ),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.string();
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

export async function chat(input: ChatInput): Promise<ChatOutput> {
  return chatFlow(input);
}

const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async ({ history }) => {
    const { output, usage } = await ai.generate({
      model: 'googleai/gemini-pro',
      prompt: {
        history: history,
        // The last message is the new user query
        // The history format provided by the client is already correct
      },
      system: `You are a helpful AI assistant named "Athlete Sentinel Assistant". Your role is to help users understand their athletic performance data. Your responses should be concise, informative, and encouraging.`,
    });

    if (!output) {
      return "I'm sorry, I don't have a response for that. Can I help with anything else?";
    }

    return output.text;
  }
);

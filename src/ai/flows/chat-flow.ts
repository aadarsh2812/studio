
import { ai } from '../genkit';
import { z } from 'genkit';

export type ChatInput = {
  history: Array<{
    role: 'user' | 'model' | 'system',
    content: { text: string }[]
  }>
};

export type ChatOutput = string;

const ChatInputSchema = z.object({
  history: z.array(z.object({
    role: z.enum(['user', 'model', 'system']),
    content: z.array(z.object({
      text: z.string()
    }))
  }))
});

const ChatOutputSchema = z.string();

export async function chat(input: ChatInput): Promise<ChatOutput> {
  return chatFlow(input);
}

const chatPrompt = ai.definePrompt({
  name: 'chatPrompt',
  input: { schema: ChatInputSchema },
  output: { schema: ChatOutputSchema },
  prompt: `You are a helpful AI assistant named "Athlete Sentinel Assistant". Your role is to help users understand their athletic performance data, provide training advice, and assist with injury prevention. Your responses should be concise, informative, and encouraging. Always maintain a professional and supportive tone.

{{#each history}}
{{#if (eq role "system")}}
System: {{content.0.text}}
{{/if}}
{{#if (eq role "user")}}
User: {{content.0.text}}
{{/if}}
{{#if (eq role "model")}}
Assistant: {{content.0.text}}
{{/if}}
{{/each}}

Please respond to the user's latest message:`,
});

const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async input => {
    try {
      const { output } = await chatPrompt(input);
      return output || "I apologize, but I'm having trouble processing your request. Please try again later.";
    } catch (error: any) {
      console.error('Gemini API error:', error?.message);
      return "I apologize, but I'm having trouble processing your request. Please try again later.";
    }
  }
);

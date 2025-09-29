
import axios from 'axios';

export type ChatInput = {
  history: Array<{
    role: 'user' | 'model' | 'system',
    content: { text: string }[]
  }>
};

export type ChatOutput = string;

export async function chat(input: ChatInput): Promise<ChatOutput> {
  try {
    const apiUrl = 'http://localhost:8000/v1/chat/completions';
    const apiKey = process.env.QWEN3_API_KEY || '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';
    const systemPrompt = `You are a helpful AI assistant named "Athlete Sentinel Assistant". Your role is to help users understand their athletic performance data, provide training advice, and assist with injury prevention. Your responses should be concise, informative, and encouraging. Always maintain a professional and supportive tone.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...input.history.map(msg => ({ role: msg.role, content: msg.content[0].text }))
    ];

    const response = await axios.post(apiUrl, {
      model: 'Qwen/Qwen3-Next-80B-A3B-Thinking',
      messages,
      max_tokens: 256
    }, {
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      }
    });

    const reply = response.data.choices?.[0]?.message?.content || '';
    return reply;
  } catch (error: any) {
    console.error('Qwen3 API error:', error?.response?.data || error?.message);
    if (error?.response?.status === 503) {
      return "The Qwen3 AI service is temporarily unavailable (503 error). Please try again in a few minutes.";
    }
    return "I apologize, but I'm having trouble processing your request. Please try again later.";
  }
}

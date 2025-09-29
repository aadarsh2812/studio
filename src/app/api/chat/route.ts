import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { history } = body;

    if (!history || !Array.isArray(history)) {
      return NextResponse.json(
        { error: 'Invalid request: history is required and must be an array' },
        { status: 400 }
      );
    }

    console.log('Processing chat request with history length:', history.length);

    // Use Gemini for dynamic responses (prefer 2.5 Flash, fall back if unavailable)
    if (process.env.GEMINI_API_KEY) {
      try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const candidateModels = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];

        let text: string | null = null;
        const systemPrompt = "You are an expert sports assistant (Athlete Sentinel). Answer concisely with practical, sport-specific guidance. Be encouraging and professional. If the user asks broad questions, proactively suggest useful next steps or clarifying options.";

        // Build conversation context from history
        let baseContext = systemPrompt + "\n\n";
        for (const msg of history) {
          if (msg.role === 'user') baseContext += `User: ${msg.content[0].text}\n`;
          if (msg.role === 'model') baseContext += `Assistant: ${msg.content[0].text}\n`;
        }
        baseContext += 'Assistant:';

        for (const modelId of candidateModels) {
          try {
            const model = genAI.getGenerativeModel({ model: modelId });
            const result = await model.generateContent(baseContext);
            text = result.response.text();
            console.log('Gemini responded with model:', modelId);
            break;
          } catch (innerErr) {
            console.warn('Model failed, trying next:', modelId, innerErr instanceof Error ? innerErr.message : innerErr);
          }
        }

        if (text) {
          return NextResponse.json({ response: text });
        }
      } catch (err) {
        console.error('Gemini generation failed, falling back:', err);
      }
    }

    // Fallback if Gemini is unavailable
    const latestMessage = history[history.length - 1];
    const q = latestMessage.content[0].text.toLowerCase();
    let response = 'I can help with sport performance, training plans, and injury prevention. Ask about workouts, recovery, or sport-specific tactics.';
    if (q.includes('injur')) response = 'To prevent injuries: warm up, progress gradually, build strength (especially stabilizers), and recover well. Flag pain early.';
    else if (q.includes('train')) response = 'Training tips: set clear goals, use periodization, mix intensity, include rest, and track metrics to adjust.';
    else if (q.includes('perform')) response = 'Performance: prioritize sleep, nutrition, and consistency. Use progressive overload and review session RPE and readiness.';
    return NextResponse.json({ response });
  } catch (error: any) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: `Internal server error: ${error.message}` },
      { status: 500 }
    );
  }
}

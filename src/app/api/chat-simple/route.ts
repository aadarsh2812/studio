import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('Chat API called');
    
    // Check if API key is set
    if (!process.env.GEMINI_API_KEY) {
      console.log('API key not set');
      return NextResponse.json(
        { error: 'GEMINI_API_KEY environment variable is not set' },
        { status: 500 }
      );
    }

    console.log('API key is set, parsing request body');
    const body = await request.json();
    console.log('Request body parsed:', body);
    
    const { history } = body;

    if (!history || !Array.isArray(history)) {
      console.log('Invalid history format');
      return NextResponse.json(
        { error: 'Invalid request: history is required and must be an array' },
        { status: 400 }
      );
    }

    console.log('History is valid, generating response');
    // Simple test response without Genkit
    const response = "Hello! I'm the Athlete Sentinel Assistant. I'm here to help you with athletic performance data, training advice, and injury prevention. How can I assist you today?";
    
    console.log('Response generated successfully');
    return NextResponse.json({ response });
  } catch (error: any) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: `Internal server error: ${error.message}` },
      { status: 500 }
    );
  }
}

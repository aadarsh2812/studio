import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: NextRequest) {
  try {
    console.log('Test API called');
    
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'No API key' }, { status: 500 });
    }

    console.log('API key found, length:', process.env.GEMINI_API_KEY.length);
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    console.log('Model created');
    
    const result = await model.generateContent("Hello, how are you?");
    const response = await result.response;
    const text = response.text();
    
    console.log('Response received:', text);
    
    return NextResponse.json({ response: text });
  } catch (error: any) {
    console.error('Test API error:', error);
    return NextResponse.json(
      { error: error.message, stack: error.stack },
      { status: 500 }
    );
  }
}


import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test if environment variable is loaded
    const hasApiKey = !!process.env.GEMINI_API_KEY;
    
    return NextResponse.json({ 
      message: 'Test endpoint working',
      hasApiKey,
      apiKeyLength: process.env.GEMINI_API_KEY?.length || 0
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}



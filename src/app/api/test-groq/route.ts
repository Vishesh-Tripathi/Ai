import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: 'GROQ_API_KEY not configured' }, { status: 500 });
    }

    // Test the API key and check available models
    const response = await fetch('https://api.groq.com/openai/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      return NextResponse.json({ 
        error: 'API test failed', 
        details: errorData,
        status: response.status 
      }, { status: response.status });
    }

    const data = await response.json();
    
    // Filter for TTS models
    const ttsModels = data.data?.filter((model: any) => 
      model.id.includes('tts') || 
      model.id.includes('playai') || 
      model.id.includes('speech')
    ) || [];

    return NextResponse.json({
      success: true,
      apiKeyConfigured: true,
      totalModels: data.data?.length || 0,
      ttsModels: ttsModels,
      allModels: data.data?.map((m: any) => m.id) || []
    });

  } catch (error) {
    console.error('API Test Error:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

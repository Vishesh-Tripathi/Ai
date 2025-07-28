import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { text, model = 'playai-tts' } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    if (!process.env.GROQ_API_KEY) {
      console.error('GROQ_API_KEY not found in environment');
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    // Try the Groq chat completion API to generate TTS
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'system',
            content: 'Convert the following text to speech.'
          },
          {
            role: 'user',
            content: text
          }
        ],
        stream: false
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('TTS API error:', response.status, errorData);
      
      // Fallback: Return the text for browser TTS
      return NextResponse.json({ 
        error: 'TTS generation failed, falling back to browser TTS', 
        fallback: true,
        text: text
      }, { status: 422 });
    }

    // If this works, we'll need to handle the response differently
    // For now, let's see what we get back
    const responseData = await response.json();
    console.log('TTS Response:', responseData);
    
    // Since this might not return audio, let's return an indicator to use browser TTS
    return NextResponse.json({ 
      error: 'TTS endpoint not available, using browser TTS', 
      fallback: true,
      text: text,
      response: responseData
    }, { status: 422 });

  } catch (error) {
    console.error('TTS Error:', error);
    return NextResponse.json({ 
      error: 'Internal server error, falling back to browser TTS', 
      fallback: true,
      text: request.body ? JSON.parse(await request.text()).text : ''
    }, { status: 422 });
  }
}

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    const model = formData.get('model') as string || 'whisper-large-v3';

    if (!audioFile) {
      return NextResponse.json({ error: 'Audio file is required' }, { status: 400 });
    }

    // Create a new FormData for the Groq API
    const groqFormData = new FormData();
    groqFormData.append('file', audioFile);
    groqFormData.append('model', model);
    groqFormData.append('response_format', 'json');

    const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: groqFormData,
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('STT API error:', errorData);
      return NextResponse.json({ error: 'STT transcription failed' }, { status: 500 });
    }

    const transcriptionData = await response.json();
    
    return NextResponse.json({
      text: transcriptionData.text || '',
      success: true
    });

  } catch (error) {
    console.error('STT Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

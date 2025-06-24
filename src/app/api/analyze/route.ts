import { analyzeResume } from '@/app/lib/groq';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { resumeText, role } = await req.json();
    const result = await analyzeResume(resumeText, role);
    console.log('Analysis result:', result);
    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('Groq API error:', error);
    return NextResponse.json({ success: false, error: 'Analysis failed' }, { status: 500 });
  }
}

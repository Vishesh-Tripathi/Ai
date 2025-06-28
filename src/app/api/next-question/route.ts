import { NextRequest } from 'next/server';
import { analyzeResume, getNextQuestion, evaluateAnswer } from '@/lib/interviewUtils';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    previousQuestion,
    userAnswer,
    resumeText,
    role,
    experienceLevel,
    conversationHistory = []
  } = body;

  if (!resumeText || !role || !experienceLevel) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
  }

  const resumeData = await analyzeResume(resumeText, role, experienceLevel);

  const question = await getNextQuestion({
    previousQuestion,
    userAnswer,
    role,
    level: experienceLevel,
    resumeData,
    historyLength: conversationHistory.length
  });

  if (question.source === 'conversation' && userAnswer) {
    const evaluation = await evaluateAnswer(previousQuestion, userAnswer, role, experienceLevel);
    Object.assign(question, evaluation);
  }

  return Response.json({
    ...question,
    resumeHighlights: resumeData
  });
}

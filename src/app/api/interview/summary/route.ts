import groq from '@/lib/grokClient';
import { prisma } from '@/lib/prisma';
import { 
  getFinalInterviewSummaryPrompt,
  getBatchQuestionAnalysisPrompt 
} from '@/lib/prompts';
import supabase from '@/lib/supabase';
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // Authentication check
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      );
    }

    // Request validation
    const { resumeText, role, experienceLevel, conversationHistory, jobDescription } = 
      await req.json();

    if (!resumeText?.trim() || !role?.trim() || !experienceLevel?.trim()) {
      return NextResponse.json(
        { error: 'Missing required fields: resumeText, role, or experienceLevel' },
        { status: 400 }
      );
    }

    if (!Array.isArray(conversationHistory) || conversationHistory.length === 0) {
      return NextResponse.json(
        { error: 'Conversation history must be a non-empty array' },
        { status: 400 }
      );
    }

    // 1. Get all question analyses in a single batch call
    const batchAnalysisPrompt = getBatchQuestionAnalysisPrompt({
      role,
      experienceLevel,
      conversationHistory
    });

    const batchResult = await groq.chat.completions.create({
      model: 'llama3-8b-8192',
      messages: [{ role: 'user', content: batchAnalysisPrompt }],
      response_format: { type: 'json_object' },
      temperature: 0.3,
      max_tokens: 4000 // Higher limit for batch processing
    });

    const batchContent = JSON.parse(batchResult.choices?.[0]?.message?.content || '{}');
    const questionAnalyses = batchContent.analyses || [];

    // 2. Get the overall summary
    const summaryPrompt = getFinalInterviewSummaryPrompt({
      role,
      experienceLevel,
      resumeText,
      jobDescription,
      conversationHistory
    });

    const summaryResult = await groq.chat.completions.create({
      model: 'llama3-8b-8192',
      messages: [{ role: 'user', content: summaryPrompt }],
      response_format: { type: 'json_object' },
      temperature: 0.5,
      max_tokens: 2000
    });

    const summaryContent = JSON.parse(summaryResult.choices?.[0]?.message?.content || '{}');

    // Combine results
    const fullAnalysis = {
      overallSummary: summaryContent,
      questionAnalyses: questionAnalyses.map((analysis: any, index: number) => ({
        ...analysis,
        position: index + 1,
        ofTotal: conversationHistory.length
      })),
      metadata: {
        role,
        experienceLevel,
        analyzedAt: new Date().toISOString(),
        totalQuestions: conversationHistory.length
      }
    };

    // Save to database
    // Save to Supabase
    const { data: analysisRecord, error: supabaseError } = await supabase
      .from('InterviewAnalysis')
      .insert([
      {
        id:userId,
        clerkId: userId,
        resultSummary: JSON.stringify(fullAnalysis)
      }
      ])
      .select('id, createdAt')
      .single();

    if (supabaseError) {
      throw new Error(supabaseError.message);
    }

    return NextResponse.json({
      success: true,
      data: JSON.stringify(fullAnalysis),
      analysisId: analysisRecord.id
    });

  } catch (error) {
    console.error('Interview analysis error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate interview analysis',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
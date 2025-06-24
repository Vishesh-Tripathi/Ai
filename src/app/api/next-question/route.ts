import { NextRequest } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  const { previousQuestion, userAnswer, resumeText, role, experienceLevel, conversationHistory = [] } = await req.json();

  if (!resumeText || !role || !experienceLevel) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
  }

  // Analyze resume to extract key components
  const resumeAnalysisPrompt = `
  Analyze this resume for a ${role} position at ${experienceLevel} level:
  ${resumeText}

  Extract:
  1. 2-3 most relevant technical skills
  2. 1-2 notable projects
  3. Work experience highlights
  4. Any certifications or education relevant to ${role}

  Return as JSON:
  {
    "skills": ["skill1", "skill2"],
    "projects": ["project1"],
    "experience": ["experience1"],
    "certifications": ["cert1"]
  }
  `;

  const resumeAnalysis = await groq.chat.completions.create({
    model: 'llama3-8b-8192',
    messages: [{ role: 'user', content: resumeAnalysisPrompt }],
    response_format: { type: "json_object" },
    temperature: 0.3
  });

  const resumeData = JSON.parse(resumeAnalysis.choices?.[0]?.message?.content || '{}');

  // Determine if we should continue current thread or ask from resume
  const shouldAskFromResume = 
    !previousQuestion || 
    conversationHistory.length >= 2 || 
    Math.random() < 0.3; // 30% chance to switch to resume

  let prompt;
  if (shouldAskFromResume) {
    // Select a random resume category to ask about
    const categories = Object.entries(resumeData)
      .filter(([_, value]) => Array.isArray(value) && value.length > 0);
    
    if (categories.length > 0) {
      const [category, items] = categories[Math.floor(Math.random() * categories.length)];
      const itemsArray = items as string[];
      const selectedItem = itemsArray[Math.floor(Math.random() * itemsArray.length)];
      
      prompt = `
      You're interviewing a ${experienceLevel} candidate for ${role}. 
      Their resume mentions this ${category}: "${selectedItem}"

      Ask ONE clear, technical question about this ${category} item that would assess:
      1. Their depth of knowledge
      2. How they applied this in practice
      3. Relevance to ${role}

      Return JSON with just the question:
      {
        "followUpQuestion": "your question here",
        "source": "resume"
      }
      `;
    }
  }

  // If not asking from resume, continue conversation thread
  if (!prompt) {
    prompt = `
    You're interviewing a ${experienceLevel} candidate for ${role}. 
    Previous question: ${previousQuestion || "Not asked yet"}
    Candidate response: ${userAnswer || "No response yet"}

    Do ONE of these:
    1. Ask a follow-up that probes deeper into their answer OR
    2. Challenge their perspective slightly OR 
    3. Ask them to elaborate on a specific part

    Keep it technical and relevant to ${role}. 
    Return JSON with question and context:
    {
      "followUpQuestion": "your question here",
      "source": "conversation"
    }
    `;
  }

  const result = await groq.chat.completions.create({
    model: 'llama3-8b-8192',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: "json_object" },
    temperature: 0.7
  });

  const content = result.choices?.[0]?.message?.content || '{}';
  const output = JSON.parse(content);

  // Add evaluation if continuing conversation thread
  if (output.source === 'conversation' && userAnswer) {
    const evaluationPrompt = `
    Evaluate this response for a ${experienceLevel} ${role} candidate:
    Q: ${previousQuestion}
    A: ${userAnswer}

    Provide brief feedback and 1-10 score. Return JSON:
    {
      "score": number,
      "feedback": "string"
    }
    `;
    
    const evaluation = await groq.chat.completions.create({
      model: 'llama3-8b-8192',
      messages: [{ role: 'user', content: evaluationPrompt }],
      response_format: { type: "json_object" },
      temperature: 0.5
    });

    const evalData = JSON.parse(evaluation.choices?.[0]?.message?.content || '{}');
    Object.assign(output, evalData);
  }

  return Response.json({ 
    ...output,
    resumeHighlights: resumeData // For client-side reference
  });
}
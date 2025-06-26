import axios from 'axios';

export interface ResumeAnalysis {
  atsScore: number;
  skillsMatchPercentage: number;
  skillsFound: string[];
  missingSkills: string[];
  strengths: string[];
  weaknesses: { text: string; reason: string }[];
  suggestions: string[];
  chartData: { labels: string[]; data: number[] };
  keywordDensity: { keyword: string; count: number; relevance: number }[];
  experienceRelevance: { role: string; relevanceScore: number; details: string }[];
  educationAlignment: { degree: string; relevance: number; details: string };
  certifications: { found: string[]; missing: string[] };
  softSkills: { found: string[]; missing: string[] };
  formatting: {
    readabilityScore: number;
    structureIssues: string[];
    lengthAppropriate: boolean;
    suggestions: string[];
  };
  sentimentAnalysis: {
    tone: string;
    confidence: number;
    details: string;
  };
}

export const analyzeResume = async (
  resumeText: string,
  roles: string[] = ['General'],
  jobDescription?: string
): Promise<ResumeAnalysis> => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not defined');
  }

  const endpoint = 'https://api.groq.com/openai/v1/chat/completions';

  const response = await axios.post(
    endpoint,
    {
      model: 'compound-beta',
      temperature: 0.2,
      max_tokens: 4096,
      messages: [
        {
          role: 'system',
          content: `You are an expert in ATS, resume analysis, and career coaching. Respond only in pure JSON format with no extra explanation or markdown formatting. Analyze the resume comprehensively for the provided job roles and optional job description.`
        },
        {
          role: 'user',
          content: `
Analyze the resume text below for the target job roles: ${JSON.stringify(roles)}${jobDescription ? ` and the job description: """${jobDescription}"""` : ''}.

Return a JSON object with the following structure:
- atsScore: number (0–100, overall compatibility with ATS systems)
- skillsMatchPercentage: number (0–100, based on role and job description)
- skillsFound: string[] (technical and role-specific skills identified)
- missingSkills: string[] (skills relevant to role(s) not found)
- strengths: string[] (key resume strengths)
- weaknesses: { text: string, reason: string }[] (specific issues with reasoning)
- suggestions: string[] (actionable improvement suggestions)
- chartData: { labels: string[], data: number[] } (3 metrics for visualization, e.g., skills, experience, education)
- keywordDensity: { keyword: string, count: number, relevance: number }[] (top keywords and their frequency/relevance)
- experienceRelevance: { role: string, relevanceScore: number, details: string }[] (relevance of past roles to target roles)
- educationAlignment: { degree: string, relevance: number, details: string } (education fit for roles)
- certifications: { found: string[], missing: string[] } (relevant certifications)
- softSkills: { found: string[], missing: string[] } (soft skills analysis)
- formatting: {
    readabilityScore: number (0–100),
    structureIssues: string[],
    lengthAppropriate: boolean,
    suggestions: string[]
  } (resume formatting and presentation analysis)
- sentimentAnalysis: {
    tone: string (e.g., confident, neutral, passive),
    confidence: number (0–100),
    details: string
  } (tone and sentiment of resume text)

Resume:
"""
${resumeText}
"""
`
        }
      ]
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    }
  );

  const raw = response.data.choices?.[0]?.message?.content;

  try {
    const jsonStart = raw.indexOf('{');
    const jsonEnd = raw.lastIndexOf('}');
    const jsonString = raw.substring(jsonStart, jsonEnd + 1);
    const parsed: ResumeAnalysis = JSON.parse(jsonString);
    return parsed;
  } catch (err) {
    console.error('❌ Failed to parse LLM JSON:', raw);
    throw new Error('Invalid JSON response from LLM');
  }
};
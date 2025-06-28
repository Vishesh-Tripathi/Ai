
import groq from './grokClient';
import {
  getResumeAnalysisPrompt,
  getQuestionFromResumePrompt,
  getConversationFollowUpPrompt,
  getEvaluationPrompt
} from './prompts';

export async function analyzeResume(resumeText: string, role: string, level: string) {
  const prompt = getResumeAnalysisPrompt(resumeText, role, level);

  const result = await groq.chat.completions.create({
    model: 'llama3-8b-8192',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    temperature: 0.3
  });

  return JSON.parse(result.choices?.[0]?.message?.content || '{}');
}

export async function getNextQuestion({
  previousQuestion,
  userAnswer,
  role,
  level,
  resumeData,
  historyLength,
}: {
  previousQuestion?: string;
  userAnswer?: string;
  role: string;
  level: string;
  resumeData: Record<string, string[]>;
  historyLength: number;
}) {
  const shouldAskFromResume = !previousQuestion || historyLength >= 2 || Math.random() < 0.3;

  let prompt = '';
  if (shouldAskFromResume) {
    const categories = Object.entries(resumeData).filter(([_, val]) => Array.isArray(val) && val.length);
    if (categories.length > 0) {
      const [category, items] = categories[Math.floor(Math.random() * categories.length)];
      const selectedItem = items[Math.floor(Math.random() * items.length)];
      prompt = getQuestionFromResumePrompt(category, selectedItem, role, level);
    }
  }

  if (!prompt) {
    prompt = getConversationFollowUpPrompt(previousQuestion || '', userAnswer || '', role, level);
  }

  const result = await groq.chat.completions.create({
    model: 'llama3-8b-8192',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    temperature: 0.7
  });

  return JSON.parse(result.choices?.[0]?.message?.content || '{}');
}

export async function evaluateAnswer(
  previousQuestion: string,
  userAnswer: string,
  role: string,
  level: string
) {
  const prompt = getEvaluationPrompt(previousQuestion, userAnswer, role, level);

  const result = await groq.chat.completions.create({
    model: 'llama3-8b-8192',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    temperature: 0.5
  });

  return JSON.parse(result.choices?.[0]?.message?.content || '{}');
}

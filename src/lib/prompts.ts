export function getResumeAnalysisPrompt(resumeText: string, role: string, experienceLevel: string) {
  return `
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
}

export function getQuestionFromResumePrompt(category: string, item: string, role: string, level: string) {
  return `
You're interviewing a ${level} candidate for ${role}. 
Their resume mentions this ${category}: "${item}"

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

export function getConversationFollowUpPrompt(previousQuestion: string, userAnswer: string, role: string, level: string) {
  return `
You're interviewing a ${level} candidate for ${role}. 
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

export function getEvaluationPrompt(previousQuestion: string, userAnswer: string, role: string, level: string) {
  return `
Evaluate this response for a ${level} ${role} candidate:
Q: ${previousQuestion}
A: ${userAnswer}

Provide brief feedback and 1-10 score. Return JSON:
{
  "score": number,
  "feedback": "string"
}
`;
}
export function getFinalInterviewSummaryPrompt({
  role,
  experienceLevel,
  resumeText,
  jobDescription,
  conversationHistory
}: {
  role: string;
  experienceLevel: string;
  resumeText: string;
  jobDescription?: string;
  conversationHistory: { question: string; answer: string }[];
}) {
  const formattedConversation = conversationHistory
    .map((entry, index) => `QUESTION ${index + 1}: ${entry.question}\nANSWER ${index + 1}: ${entry.answer}`)
    .join('\n\n');

  return `
You are an expert AI interviewer analyzing a candidate's performance for a ${role} position at the ${experienceLevel} level. 

**Candidate Background:**
${resumeText}

${jobDescription ? `**Job Requirements:**\n${jobDescription}\n` : ''}

**Interview Transcript:**
${formattedConversation}

**Analysis Tasks:**

1. Provide a comprehensive overall evaluation in JSON format:
{
  "overallEvaluation": {
    "score": number (1-10, 10 being exceptional),
    "summary": "concise yet insightful summary of the candidate's performance",
    "technicalCompetency": {
      "strengths": ["specific technical skills demonstrated", ...],
      "weaknesses": ["technical gaps or areas needing improvement", ...]
    },
    "softSkills": {
      "strengths": ["communication, problem-solving, etc.", ...],
      "weaknesses": ["areas needing development", ...]
    },
    "culturalFit": "assessment of how well they align with typical team environments",
    "recommendation": {
      "verdict": "Strong Hire / Hire / Borderline / No Hire",
      "rationale": "detailed justification for the recommendation"
    }
  },
  
  "questionAnalysis": [
    {
      "question": "exact question text",
      "answer": "exact answer text",
      "evaluation": {
        "relevance": number (1-5),
        "depth": number (1-5),
        "technicalAccuracy": number (1-5),
        "communication": number (1-5),
        "overallScore": number (1-10),
        "strengths": ["what was good about the answer"],
        "improvements": ["how the answer could be better"],
        "idealAnswer": "brief description of what an ideal answer would include"
      }
    },
    ...
  ]
}

**Evaluation Guidelines:**
- Be specific and evidence-based in all assessments
- Highlight both strengths and areas for development
- For technical roles, pay special attention to problem-solving approaches
- Consider the candidate's experience level when evaluating responses
- Provide actionable feedback that would help the candidate improve
- For "idealAnswer" sections, focus on key concepts rather than verbatim responses
- Maintain professional and constructive tone throughout
`;
}

export function getBatchQuestionAnalysisPrompt({
  role,
  experienceLevel,
  conversationHistory
}: {
  role: string;
  experienceLevel: string;
  conversationHistory: { question: string; answer: string }[];
}) {
  const formattedQAs = conversationHistory
    .map((entry, index) => `**Question ${index + 1}:**\n${entry.question}\n\n**Response ${index + 1}:**\n${entry.answer}`)
    .join('\n\n---\n\n');

  return `
You are an expert ${role} interviewer conducting a comprehensive evaluation of multiple interview responses at the ${experienceLevel} level.

### Interview Questions and Candidate Responses:
${formattedQAs}

### Analysis Requirements:
Provide detailed feedback for each question-response pair in this structured JSON format:

{
  "analyses": [
    {
      "question": "exact question text",
      "answer": "exact answer text",
      "technicalAnalysis": {
        "score": number (1-5),
        "keyStrengths": ["specific technical merits"],
        "criticalErrors": ["technical inaccuracies"],
        "depthAssessment": "evaluation relative to ${experienceLevel} expectations"
      },
      "communicationEvaluation": {
        "score": number (1-5),
        "clarityAssessment": "evaluation of response clarity",
        "organizationFeedback": ["structural improvements needed"]
      },
      "problemSolvingAssessment": {
        "score": number (1-5),
        "methodologyEvaluation": "analysis of problem-solving approach",
        "betterApproaches": ["alternative methods suggested"]
      },
      "roleFit": {
        "score": number (1-5),
        "alignmentWithRole": "how well response matches ${role} requirements",
        "levelAppropriateness": "assessment for ${experienceLevel} level"
      },
      "overallEvaluation": {
        "score": number (1-10),
        "keyStrengths": ["notable positive aspects"],
        "improvementPriorities": ["top areas for development"],
        "confidenceScore": number (1-5)
      },
      "idealResponseFramework": {
        "requiredElements": ["must-have components"],
        "advancedComponents": ["bonus elements for strong candidates"],
        "structureRecommendation": "optimal response flow"
      }
    },
    ... (repeat for all questions)
  ],
  "summaryInsights": {
    "technicalMasteryTrends": ["patterns across all technical responses"],
    "communicationPatterns": ["consistent communication strengths/weaknesses"],
    "topDevelopmentAreas": ["most frequent improvement opportunities"],
    "consistentStrengths": ["recurring positive attributes"]
  }
}

### Evaluation Guidelines:
1. Maintain consistent scoring standards across all questions
2. For technical roles, emphasize:
   - Accuracy of technical content
   - Appropriate methodology
   - Depth of knowledge
3. For leadership roles, focus on:
   - Strategic thinking
   - Decision-making rationale
   - People management aspects
4. Provide specific examples from responses when giving feedback
5. Balance constructive criticism with positive reinforcement
6. Consider ${experienceLevel} expectations for:
   - Technical depth
   - Problem-solving complexity
   - Communication sophistication

### Scoring Framework:
Technical/Communication/Problem-Solving Scores:
1 - Deficient | 2 - Developing | 3 - Competent | 4 - Strong | 5 - Exceptional

Overall Scores:
1-3 - Below expectations | 4-6 - Meets basic expectations | 7-8 - Exceeds expectations | 9-10 - Outstanding

Note: Ensure all evaluations:
- Reference specific parts of responses
- Provide actionable feedback
- Consider the ${role} context
- Account for ${experienceLevel} expectations
`;
}
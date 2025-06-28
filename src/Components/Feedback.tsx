import { CircleCheck } from 'lucide-react';

interface Evaluation {
  score?: number;
  summary?: string;
  technicalCompetency?: {
    strengths?: string[];
    weaknesses?: string[];
  };
  softSkills?: {
    strengths?: string[];
    weaknesses?: string[];
  };
  culturalFit?: string;
  recommendation?: {
    verdict?: string;
    rationale?: string;
  };
}

interface AnalysisData {
  overallSummary?: {
    overallEvaluation?: Evaluation;
  };
  questionAnalyses?: Array<{
    question?: string;
    answer?: string;
    overallEvaluation?: {
      score?: number;
      keyStrengths?: string[];
      improvementPriorities?: string[];
      confidenceScore?: number;
    };
  }>;
  metadata?: {
    role?: string;
    experienceLevel?: string;
    analyzedAt?: string;
    totalQuestions?: number;
  };
}

export function FeedbackCard({ analysisData }: { analysisData?: AnalysisData }) {

    console.log('Analysis Data:', analysisData);
  // Safe defaults for all data
  const overallEvaluation = analysisData?.overallSummary?.overallEvaluation || {
    score: 0,
    summary: 'No evaluation available',
    technicalCompetency: { strengths: [], weaknesses: [] },
    softSkills: { strengths: [], weaknesses: [] },
    culturalFit: '',
    recommendation: { verdict: '', rationale: '' }
  };
  console.log('Overall Evaluation:', overallEvaluation);

  const questionAnalyses = analysisData?.questionAnalyses || [];
  const metadata = analysisData?.metadata || {
    role: '',
    experienceLevel: '',
    analyzedAt: '',
    totalQuestions: 0
  };

  // Calculate average question score safely
  const averageQuestionScore = questionAnalyses.length > 0
    ? Math.round(
        questionAnalyses.reduce(
          (sum, q) => sum + (q.overallEvaluation?.score || 0), 0
        ) / questionAnalyses.length
      )
    : 0;

  if (!analysisData) {
    return (
      <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
        <p className="text-gray-300">No interview data available</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
      <h2 className="text-xl font-semibold flex items-center gap-2 text-white mb-4">
        <CircleCheck size={22} className="text-blue-400" /> 
        Interview Feedback
      </h2>
      
      <div className="space-y-6">
        {/* Overall Score */}
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-full ${
            (overallEvaluation.score || 0) >= 7 ? 'bg-green-900/30 text-green-400' : 
            (overallEvaluation.score || 0) >= 4 ? 'bg-amber-900/30 text-amber-400' : 
            'bg-red-900/30 text-red-400'
          }`}>
            <span className="text-xl font-bold">{overallEvaluation.score || 0}/10</span>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-200">Overall Score</h3>
            <p className="text-sm text-gray-400">
              {(overallEvaluation.score || 0) >= 7 ? 'Strong performance!' : 
               (overallEvaluation.score || 0) >= 4 ? 'Average performance' : 
               'Needs significant improvement'}
            </p>
          </div>
        </div>

        {/* Question Average Score */}
        {questionAnalyses.length > 0 && (
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-full ${
              averageQuestionScore >= 7 ? 'bg-green-900/30 text-green-400' : 
              averageQuestionScore >= 4 ? 'bg-amber-900/30 text-amber-400' : 
              'bg-red-900/30 text-red-400'
            }`}>
              <span className="text-xl font-bold">{averageQuestionScore}/10</span>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-200">Average Question Score</h3>
              <p className="text-sm text-gray-400">
                {averageQuestionScore >= 7 ? 'Consistently strong answers' : 
                 averageQuestionScore >= 4 ? 'Mixed performance' : 
                 'Most answers need work'}
              </p>
            </div>
          </div>
        )}

        {/* Summary Feedback */}
        <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
          <h3 className="text-lg font-medium text-blue-400 mb-2">Overall Assessment:</h3>
          <p className="text-gray-200 mb-4">{overallEvaluation.summary}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {/* Technical Skills */}
            <div className="bg-gray-800/50 p-3 rounded-lg">
              <h4 className="font-medium text-gray-300 mb-2">Technical Skills</h4>
              {(overallEvaluation.technicalCompetency?.strengths || []).length > 0 && (
                <div className="mb-3">
                  <p className="text-sm text-green-400 font-medium">Strengths:</p>
                  <ul className="text-sm text-gray-300 list-disc list-inside">
                    {overallEvaluation.technicalCompetency?.strengths?.map((strength, i) => (
                      <li key={`tech-strength-${i}`}>{strength}</li>
                    ))}
                  </ul>
                </div>
              )}
              {(overallEvaluation.technicalCompetency?.weaknesses || []).length > 0 && (
                <div>
                  <p className="text-sm text-red-400 font-medium">Areas to Improve:</p>
                  <ul className="text-sm text-gray-300 list-disc list-inside">
                    {overallEvaluation.technicalCompetency?.weaknesses?.map((weakness, i) => (
                      <li key={`tech-weakness-${i}`}>{weakness}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Soft Skills */}
            <div className="bg-gray-800/50 p-3 rounded-lg">
              <h4 className="font-medium text-gray-300 mb-2">Soft Skills</h4>
              {(overallEvaluation.softSkills?.strengths || []).length > 0 && (
                <div className="mb-3">
                  <p className="text-sm text-green-400 font-medium">Strengths:</p>
                  <ul className="text-sm text-gray-300 list-disc list-inside">
                    {overallEvaluation.softSkills?.strengths?.map((strength, i) => (
                      <li key={`soft-strength-${i}`}>{strength}</li>
                    ))}
                  </ul>
                </div>
              )}
              {(overallEvaluation.softSkills?.weaknesses || []).length > 0 && (
                <div>
                  <p className="text-sm text-red-400 font-medium">Areas to Improve:</p>
                  <ul className="text-sm text-gray-300 list-disc list-inside">
                    {overallEvaluation.softSkills?.weaknesses?.map((weakness, i) => (
                      <li key={`soft-weakness-${i}`}>{weakness}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recommendation */}
        <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
          <h3 className="text-lg font-medium text-blue-400 mb-2">Recommendation:</h3>
          <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-2 ${
            overallEvaluation.recommendation?.verdict === 'Hire' ? 'bg-green-900/30 text-green-400' :
            overallEvaluation.recommendation?.verdict === 'Borderline' ? 'bg-amber-900/30 text-amber-400' :
            'bg-red-900/30 text-red-400'
          }`}>
            {overallEvaluation.recommendation?.verdict || 'No recommendation'}
          </div>
          <p className="text-gray-200">
            {overallEvaluation.recommendation?.rationale || 'No rationale provided'}
          </p>
        </div>

        {/* Detailed Question Analysis */}
        {questionAnalyses.length > 0 && (
          <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
            <h3 className="text-lg font-medium text-blue-400 mb-2">Question-by-Question Analysis:</h3>
            <div className="space-y-4">
              {questionAnalyses.map((qa, index) => (
                <div key={`question-${index}`} className="bg-gray-800/50 p-3 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-300">Question {index + 1}:</h4>
                      <p className="text-gray-400 text-sm mb-2">{qa.question}</p>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs ${
                      (qa.overallEvaluation?.score || 0) >= 7 ? 'bg-green-900/30 text-green-400' :
                      (qa.overallEvaluation?.score || 0) >= 4 ? 'bg-amber-900/30 text-amber-400' :
                      'bg-red-900/30 text-red-400'
                    }`}>
                      {qa.overallEvaluation?.score || 0}/10
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <p className="text-gray-300 text-sm mb-1">Candidate's Response:</p>
                    <p className="text-gray-400 text-sm italic mb-3">{qa.answer}</p>
                  </div>

                  {(qa.overallEvaluation?.keyStrengths || []).length > 0 && (
                    <div className="mb-2">
                      <p className="text-green-400 text-sm font-medium">Strengths:</p>
                      <ul className="text-gray-300 text-sm list-disc list-inside">
                        {qa.overallEvaluation?.keyStrengths?.map((strength, i) => (
                          <li key={`q-strength-${index}-${i}`}>{strength}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {(qa.overallEvaluation?.improvementPriorities || []).length > 0 && (
                    <div>
                      <p className="text-red-400 text-sm font-medium">Areas to Improve:</p>
                      <ul className="text-gray-300 text-sm list-disc list-inside">
                        {qa.overallEvaluation?.improvementPriorities?.map((area, i) => (
                          <li key={`q-improve-${index}-${i}`}>{area}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
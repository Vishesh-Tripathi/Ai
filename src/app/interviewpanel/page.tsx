'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { parseLLMResponse } from '../lib/parsefeedback';
import { Wand2, Loader2, ChevronRight, Clipboard, CircleCheck, Clock, Mic, MicOff, Volume2, VolumeX, Play, Square } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton, useUser } from '@clerk/nextjs';
import { FeedbackCard } from '@/Components/Feedback';
import { useTTS } from '@/hooks/useTTS';
import { useSTT } from '@/hooks/useSTT';
type QAEntry = {
  question: string;
  answer: string;
};

type InterviewStage = 'setup' | 'interview' | 'completed';

export default function InterviewPanel() {
  const { isSignedIn, user, isLoaded } = useUser();
  const [stage, setStage] = useState<InterviewStage>('setup');
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState("");
  const [history, setHistory] = useState<any[]>([]);
  const [resumeText, setResumeText] = useState("");
  const [role, setRole] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [interviewDuration, setInterviewDuration] = useState(10);
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [conversationHistory, setConversationHistory] = useState<QAEntry[]>([]);
  const [summary, setSummary] = useState<any>({});
  
  // TTS and STT hooks
  const { speak, stop: stopTTS, isPlaying, isLoading: ttsLoading } = useTTS();
  const { 
    startRecording, 
    stopRecording, 
    clearTranscript, 
    isRecording, 
    isProcessing, 
    transcript 
  } = useSTT();

  // endInterview function (moved before timer effect)
  const endInterview = useCallback(async () => {
    // Stop timer and TTS immediately
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    stopTTS();
    
    // Set stage to completed first to stop the interview UI
    setStage('completed');

    // Calculate average score
    const currentAverageScore = questionsAnswered > 0 ? (totalScore / questionsAnswered).toFixed(1) : "0";

    try {
      const sum = await fetch('/api/interview/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText,
          role,
          experienceLevel,
          conversationHistory,
        })
      });
      
      if (sum.ok) {
        const summaryData = await sum.json();
        setSummary(summaryData.data);
        console.log('summary response:', summaryData.data);
      } else {
        console.error('Failed to get interview summary, but continuing with completion');
        // Set empty summary so the completion page still works
        setSummary({
          overallFeedback: "Interview completed successfully. Summary could not be generated at this time.",
          strengths: ["Completed the interview session"],
          improvements: ["Summary service temporarily unavailable"],
          score: currentAverageScore
        });
      }
    } catch (error) {
      console.error('Error getting interview summary:', error);
      // Set empty summary so the completion page still works
      setSummary({
        overallFeedback: "Interview completed successfully. Summary could not be generated at this time.",
        strengths: ["Completed the interview session"],
        improvements: ["Summary service temporarily unavailable"],
        score: currentAverageScore
      });
    }

    // Update interview count (non-blocking)
    try {
      const response = await fetch('/api/interview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'user-id': user?.id || ''
        },
        body: JSON.stringify({
          userId: user?.id,
          timestamp: new Date().toISOString(),
        }),
      });
      
      if (!response.ok) {
        console.error('Failed to update interview count');
      }
    } catch (error) {
      console.error('Error while calling interview update API:', error);
    }
  }, [resumeText, role, experienceLevel, conversationHistory, questionsAnswered, totalScore, user?.id, stopTTS]);

  // Timer countdown effect
  useEffect(() => {
    if (stage !== 'interview' || timeLeft <= 0) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 1;
        console.log('Timer update:', newTime, 'minutes remaining');
        
        if (newTime <= 0) {
          console.log('Time expired, ending interview');
          // End the interview when time runs out
          endInterview();
          return 0;
        }
        return newTime;
      });
    }, 60000); // 60000ms = 1 minute

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [stage, timeLeft, endInterview]);

  // Safety check: End interview if time reaches 0 (backup mechanism)
  useEffect(() => {
    if (stage === 'interview' && timeLeft <= 0) {
      console.log('Safety check: Time is 0, ending interview');
      endInterview();
    }
  }, [stage, timeLeft, endInterview]);

  // Auto-speak questions when they change
  useEffect(() => {
    if (currentQuestion && stage === 'interview') {
      console.log('Auto-speaking question:', currentQuestion);
      // Add a small delay to ensure the UI has updated
      const timer = setTimeout(() => {
        speak(currentQuestion);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [currentQuestion, stage, speak]);

  // Update answer when transcript changes
  useEffect(() => {
    if (transcript) {
      setAnswer(prev => prev ? `${prev} ${transcript}` : transcript);
    }
  }, [transcript]);

  // Authentication and loading state checks - moved after all hooks
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
        <div className="bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-700 text-center max-w-md">
          <Wand2 className="w-16 h-16 text-blue-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Authentication Required</h2>
          <p className="text-gray-400 mb-6">Please sign in to access the AI Interview Panel</p>
          <SignInButton mode="modal">
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all">
              Sign In to Continue
            </button>
          </SignInButton>
        </div>
      </div>
    );
  }

  const startInterview = () => {
    if (!resumeText || !role || !experienceLevel) {
      alert("Please provide resume text, role, and experience level.");
      return;
    }
    
    setStage('interview');
    setTimeLeft(interviewDuration);
    setTotalScore(0);
    setQuestionsAnswered(0);
    
    // Set the first question - this will trigger auto-speak via useEffect
    const firstQuestion = "Tell me about yourself and why you're interested in this role?";
    setCurrentQuestion(firstQuestion);
  };

  const handleSubmit = async () => {
    if (!answer.trim()) {
      alert("Please provide an answer before submitting.");
      return;
    }
    
    // Stop any playing TTS
    stopTTS();
    
    setConversationHistory(prev => [
    ...prev,
    {
      question: currentQuestion,
      answer: answer.trim(),
    }
  ]);

    const res = await fetch("/api/next-question", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        previousQuestion: currentQuestion,
        userAnswer: answer,
        resumeText,
        role,
        experienceLevel,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("API returned error response:", data);
      alert("Failed to get feedback. Please try again.");
      return;
    }

    const { score, feedback, followUpQuestion } = data;
    const numericScore = parseInt(score);
    
    setScore(score);
    setFeedback(feedback);
    
    // Stop any current TTS before setting new question
    stopTTS();
    
    // Set the new question (this will trigger auto-speak via useEffect)
    setCurrentQuestion(followUpQuestion);
    setHistory(prev => [...prev, { question: currentQuestion, answer, score, feedback }]);
    setAnswer("");
    clearTranscript(); // Clear the transcript for next question
    
    // Update total score
    setTotalScore(prev => prev + numericScore);
    setQuestionsAnswered(prev => prev + 1);
  };

  const handleVoiceInput = () => {
    if (isRecording) {
      stopRecording();
    } else {
      clearTranscript();
      startRecording();
    }
  };

  const handleSpeakQuestion = () => {
    if (isPlaying) {
      stopTTS();
    } else {
      speak(currentQuestion);
    }
  };

  const formatTime = (minutes: number) => {
    const mins = Math.floor(minutes);
    const secs = Math.floor((minutes - mins) * 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const averageScore = questionsAnswered > 0 ? (totalScore / questionsAnswered).toFixed(1) : "0";

  if (stage === 'setup') {
    return (
      <div className="mx-auto p-6 bg-gray-900 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center gap-3 text-blue-400">
              <Wand2 className="text-purple-400" size={36} />
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                AI Interview Coach
              </span>            </h1>
            {user && (
              <p className="text-blue-400 text-lg mb-2">
                Welcome back, {user.firstName || user.emailAddresses[0]?.emailAddress}!
              </p>
            )}
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Set up your mock interview session
            </p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
            <h2 className="text-xl font-semibold flex items-center gap-2 text-white mb-6">
              <Clipboard size={22} className="text-blue-400" /> 
              Interview Setup
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Paste Resume Text</label>
                <textarea
                  rows={5}
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 text-white p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder-gray-400"
                  placeholder="Paste your resume here..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Select Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 text-white p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    required
                  >
                    <option value="">Select a role</option>
                    <option>Frontend Developer</option>
                    <option>Backend Developer</option>
                    <option>Full Stack Developer</option>
                    <option>Data Scientist</option>
                    <option>DevOps Engineer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Experience Level</label>
                  <select
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 text-white p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    required
                  >
                    <option value="">Select experience level</option>
                    <option>Entry-level</option>
                    <option>Mid-level</option>
                    <option>Senior</option>
                    <option>Intern</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Interview Duration (5-15 minutes)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="5"
                    max="15"
                    value={interviewDuration}
                    onChange={(e) => setInterviewDuration(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-white font-medium w-16 text-center">
                    {interviewDuration} min
                  </span>
                </div>
              </div>

              <button
                onClick={startInterview}
                disabled={!resumeText || !role || !experienceLevel}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Start Interview
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'completed') {
    return (
      <div className="mx-auto p-6 bg-gray-900 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center gap-3 text-blue-400">
              <CircleCheck className="text-green-400" size={36} />
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Interview Completed
              </span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Here's your performance summary
            </p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                <h3 className="text-lg font-medium text-blue-400 mb-2">Questions Answered</h3>
                <p className="text-3xl font-bold text-white">{questionsAnswered}</p>
              </div>
              
              <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                <h3 className="text-lg font-medium text-blue-400 mb-2">Average Score</h3>
                <p className={`text-3xl font-bold ${
                  parseFloat(averageScore) >= 7 ? 'text-green-400' : 
                  parseFloat(averageScore) >= 4 ? 'text-amber-400' : 'text-red-400'
                }`}>
                  {averageScore}/10
                </p>
              </div>
              
              <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                <h3 className="text-lg font-medium text-blue-400 mb-2">Duration</h3>
                <p className="text-3xl font-bold text-white">{interviewDuration} min</p>
              </div>
            </div>
          </div>

          <div className="container mx-auto p-4 max-w-4xl">
      <FeedbackCard analysisData={summary} />
    </div>

        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto p-6 bg-gray-900 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center justify-center gap-3 text-blue-400">
            <Wand2 className="text-purple-400" size={28} />
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Interview in Progress
            </span>
          </h1>
          <div className="flex items-center justify-center gap-2 text-lg text-gray-400 mb-4">
            <Clock size={18} className="text-amber-400" />
            <span>Time remaining: {formatTime(timeLeft)}</span>
          </div>
          
          <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-blue-500 h-full transition-all" 
              style={{ width: `${(timeLeft / interviewDuration) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Question Section */}
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2 text-white">
                <Clipboard size={22} className="text-blue-400" /> 
                Current Question
                {isPlaying && (
                  <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full ml-2 flex items-center gap-1">
                    <Volume2 size={12} />
                    Speaking...
                  </span>
                )}
              </h2>
              <button
                onClick={handleSpeakQuestion}
                disabled={ttsLoading}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                  isPlaying 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                } disabled:opacity-50`}
              >
                {ttsLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : isPlaying ? (
                  <>
                    <Square size={16} />
                    Stop
                  </>
                ) : (
                  <>
                    <Volume2 size={16} />
                    Speak
                  </>
                )}
              </button>
            </div>
            
            <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
              <p className="text-gray-200">{currentQuestion}</p>
            </div>
          </div>

          {/* Answer Section */}
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
            <h2 className="text-xl font-semibold flex items-center gap-2 text-white mb-4">
              <Clipboard size={22} className="text-blue-400" /> 
              Your Response
            </h2>
            
            <div className="space-y-4">
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 text-white p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder-gray-400"
                placeholder="Type your answer here or use voice input..."
                rows={5}
              />
              
              {/* Voice Input Status */}
              {(isRecording || isProcessing) && (
                <div className="bg-blue-900/30 border border-blue-700 p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-400">
                    {isRecording && (
                      <>
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span>Recording... Speak now</span>
                      </>
                    )}
                    {isProcessing && (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Processing speech...</span>
                      </>
                    )}
                  </div>
                </div>
              )}
              
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleVoiceInput}
                  disabled={isProcessing}
                  className={`flex-1 ${
                    isRecording 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : 'bg-green-600 hover:bg-green-700'
                  } text-white px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50`}
                >
                  {isRecording ? (
                    <>
                      <MicOff size={18} />
                      Stop Recording
                    </>
                  ) : (
                    <>
                      <Mic size={18} />
                      Voice Input
                    </>
                  )}
                </button>
                
                <button
                  onClick={handleSubmit}
                  disabled={!answer.trim() || isProcessing}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Answer
                </button>
              </div>
            </div>
          </div>

          {/* Feedback Section */}
          {feedback && (
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
              <h2 className="text-xl font-semibold flex items-center gap-2 text-white mb-4">
                <CircleCheck size={22} className="text-blue-400" /> 
                Feedback
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full ${parseInt(score) >= 7 ? 'bg-green-900/30 text-green-400' : parseInt(score) >= 4 ? 'bg-amber-900/30 text-amber-400' : 'bg-red-900/30 text-red-400'}`}>
                    <span className="text-xl font-bold">{score}/10</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-200">Question Score</h3>
                    <p className="text-sm text-gray-400">
                      {parseInt(score) >= 7 ? 'Excellent!' : parseInt(score) >= 4 ? 'Good answer' : 'Needs improvement'}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                  <h3 className="text-lg font-medium text-blue-400 mb-2">Detailed Feedback:</h3>
                  <p className="text-gray-200">{feedback}</p>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={endInterview}
            className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
          >
            End Interview Early
          </button>
        </div>
      </div>
    </div>
  );
}
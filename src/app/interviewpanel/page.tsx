'use client';

import { useEffect, useState, useRef } from 'react';
import { parseLLMResponse } from '../lib/parsefeedback';
import { speakText } from '../lib/speak';
import { Mic, MicOff, Wand2, Loader2, ChevronRight, Clipboard, Check, CircleCheck, CircleAlert, Clock } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton, useUser } from '@clerk/nextjs';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

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
  const [listening, setListening] = useState(false);
  const [interviewDuration, setInterviewDuration] = useState(10); // Default 10 minutes
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalScore, setTotalScore] = useState(0);  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const recognitionRef = useRef<any>(null);
  const fullTranscriptRef = useRef("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Early return for authentication check
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
          <Mic className="w-16 h-16 text-blue-400 mx-auto mb-4" />
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

  // Timer countdown effect
  useEffect(() => {
    if (stage !== 'interview' || timeLeft <= 0) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endInterview();
          return 0;
        }
        return prev - 1;
      });
    }, 60000); // Update every minute

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [stage, timeLeft]);

  // Speak question when it changes
  useEffect(() => {
    if (currentQuestion && stage === 'interview') speakText(currentQuestion);
  }, [currentQuestion, stage]);

  // Setup speech recognition
  useEffect(() => {
    if (stage !== 'interview') return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Browser does not support SpeechRecognition");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        }
      }
      if (finalTranscript.trim()) {
        fullTranscriptRef.current += ' ' + finalTranscript.trim();
        setAnswer(fullTranscriptRef.current.trim());
      }
    };

    recognitionRef.current = recognition;
    return () => {
      recognition.stop();
    };
  }, [stage]);

  const startInterview = () => {
    if (!resumeText || !role || !experienceLevel) {
      alert("Please provide resume text, role, and experience level.");
      return;
    }
    
    setStage('interview');
    setTimeLeft(interviewDuration);
    setCurrentQuestion("Tell me about yourself and why you're interested in this role?");
    setTotalScore(0);
    setQuestionsAnswered(0);
  };

  const endInterview = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    recognitionRef.current?.stop();
    setListening(false);
    setStage('completed');
  };

  const startListening = () => {
    recognitionRef.current?.start();
    setListening(true);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  const handleSubmit = async () => {
    if (!answer.trim()) {
      alert("Please provide an answer before submitting.");
      return;
    }

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
    setCurrentQuestion(followUpQuestion);
    setHistory(prev => [...prev, { question: currentQuestion, answer, score, feedback }]);
    setAnswer("");
    fullTranscriptRef.current = "";
    
    // Update total score
    setTotalScore(prev => prev + numericScore);
    setQuestionsAnswered(prev => prev + 1);
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

          <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
            <h2 className="text-xl font-semibold flex items-center gap-2 text-white mb-6">
              <CircleCheck size={22} className="text-blue-400" /> 
              Final Feedback
            </h2>
            
            <div className="space-y-4">
              <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                <p className="text-gray-200">
                  {parseFloat(averageScore) >= 7 ? (
                    "Excellent performance! You demonstrated strong knowledge and communication skills. With this level of preparation, you're well positioned for real interviews."
                  ) : parseFloat(averageScore) >= 4 ? (
                    "Good effort! You have a solid foundation but could benefit from more practice in certain areas. Review the feedback and try to improve your responses."
                  ) : (
                    "Keep practicing! This was a good start but there's significant room for improvement. Focus on understanding the questions better and structuring your answers."
                  )}
                </p>
              </div>

              <button
                onClick={() => {
                  setStage('setup');
                  setFeedback("");
                  setScore("");
                  setHistory([]);
                }}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
              >
                Start New Interview
              </button>
            </div>
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
            <h2 className="text-xl font-semibold flex items-center gap-2 text-white mb-4">
              <Clipboard size={22} className="text-blue-400" /> 
              Current Question
            </h2>
            
            <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
              <p className="text-gray-200">{currentQuestion}</p>
            </div>
          </div>

          {/* Answer Section */}
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
            <h2 className="text-xl font-semibold flex items-center gap-2 text-white mb-4">
              <Mic size={22} className="text-blue-400" /> 
              Your Response
            </h2>
            
            <div className="space-y-4">
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 text-white p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder-gray-400"
                placeholder={listening ? "Listening... (speak now)" : "Type or speak your answer..."}
                rows={5}
              />
              
              <div className="flex flex-wrap gap-3">
                {!listening ? (
                  <button
                    onClick={startListening}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                  >
                    <Mic size={18} /> Start Speaking
                  </button>
                ) : (
                  <button
                    onClick={stopListening}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                  >
                    <MicOff size={18} /> Stop Speaking
                  </button>
                )}
                
                <button
                  onClick={handleSubmit}
                  disabled={!answer.trim()}
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
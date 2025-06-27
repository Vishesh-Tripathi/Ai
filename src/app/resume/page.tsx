'use client';

import { useState } from 'react';
import { FileText, Wand2, Loader2, ChevronRight, Clipboard, Check, CircleCheck, CircleAlert, Lightbulb } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton, useUser } from '@clerk/nextjs';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement
);

export default function ResumePage() {
  const { isSignedIn, user, isLoaded } = useUser();
  const [resumeText, setResumeText] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [role, setRole] = useState('');

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
          <FileText className="w-16 h-16 text-blue-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Authentication Required</h2>
          <p className="text-gray-400 mb-6">Please sign in to access the Resume Analyzer</p>
          <SignInButton mode="modal">
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all">
              Sign In to Continue
            </button>
          </SignInButton>
        </div>
      </div>
    );
  }

 const handleAnalyze = async () => {
  setLoading(true);
  setResult(null);
  setCopied(false);

  try {
    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resumeText, role }),
    });

    const data = await res.json();

    if (res.ok && data.success) {
      setResult(data.result);
    } else {
      // Handle specific error status codes
      if (res.status === 403) {
        setResult({ error: "You’ve reached your trial limit. Upgrade your plan to continue." });
      } else if (res.status === 401) {
        setResult({ error: "Please sign in to analyze your resume." });
      } else {
        setResult({ error: data.error || "Failed to analyze resume. Please try again." });
      }
    }
  } catch (error) {
    setResult({ error: "Network error. Please check your connection." });
  } finally {
    setLoading(false);
  }
};


  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(JSON.stringify(result, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  return (
    <>
     <div className="fixed inset-0 overflow-hidden z-0 pointer-events-none">
  <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-gradient-to-br from-blue-500 via-blue-400 to-blue-300 rounded-full opacity-50 blur-3xl animate-float brightness-125 saturate-150"></div>

  <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-br from-purple-500 via-purple-400 to-pink-300 rounded-full opacity-50 blur-3xl animate-float-delay brightness-125 saturate-150"></div>

  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-72 h-72 bg-gradient-to-br from-green-400 via-teal-400 to-cyan-300 rounded-full opacity-50 blur-3xl animate-float brightness-125 saturate-150"></div>
</div>
      <SignedOut>
        <div className="min-h-screen backdrop-blur-3xl border border-white/20 dark:border-gray-200/10 bg-gray-900 flex items-center justify-center p-6">
          <div className="bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-700 text-center max-w-md">
            <FileText className="w-16 h-16 text-blue-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Authentication Required</h2>
            <p className="text-gray-400 mb-6">Please sign in to access the Resume Analyzer</p>
            <SignInButton mode="modal">
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all">
                Sign In to Continue
              </button>
            </SignInButton>
          </div>
        </div>
      </SignedOut>
      
      <SignedIn>
        <div className=" mx-auto p-6   min-h-screen">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center gap-3 text-blue-400">
          <Wand2 className="text-purple-400" size={36} />
          <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Resume Wizard
          </span>        </h1>
        {user && (
          <p className="text-blue-400 text-lg mb-2">
            Welcome back, {user.firstName || user.emailAddresses[0]?.emailAddress}!
          </p>
        )}
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          AI-powered resume analysis with detailed insights and optimization suggestions
        </p>
      </div>

      <div className="grid grid-cols-1  lg:grid-cols-3 gap-8">
        {/* Input Section */}
        <div className="lg:col-span-1  space-y-6">
          <div className=" backdrop-blur-3xl border border-white/20 dark:border-gray-200/10 rounded-xl p-6 shadow-lg  ">
            <h2 className="text-xl font-semibold flex items-center gap-2 text-white mb-4">
              <FileText size={22} className="text-blue-400" /> 
              Resume Content
            </h2>
            
            <div className="space-y-5 ">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Target Role
                </label>
                <input
                  type="text"
                  placeholder="e.g. Senior Frontend Developer"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full  border    text-white p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder-gray-400"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Resume Text
                  </label>
                  <span className="text-xs text-gray-400">
                    {resumeText.length} characters
                  </span>
                </div>
                <textarea
                  rows={12}
                  className="w-full  border  text-white p-4 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder-gray-400"
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your resume text here..."
                />
              </div>

              <button
                onClick={handleAnalyze}
                disabled={loading || !resumeText.trim()}
                className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                  loading || !resumeText.trim()
                    ? 'border cursor-not-allowed text-gray-400'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Wand2 size={20} />
                    Analyze Resume
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-2  space-y-6">
          <div className="backdrop-blur-3xl  border-white/20 dark:border-gray-200/10 rounded-xl p-6 shadow-lg border ">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2 text-white">
                <Clipboard size={22} className="text-blue-400" /> 
                Analysis Results
              </h2>
              {result && !result.error && (
                <button
                  onClick={handleCopy}
                  className="text-sm flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check size={16} /> Copied!
                    </>
                  ) : (
                    <>
                      <Clipboard size={16} /> Copy JSON
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="h-full min-h-[200px]">
              {result ? (
                result.error ? (
                  <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 text-red-300">
                    <div className="flex items-center gap-2">
                      <CircleAlert className="text-red-400" />
                      <span>{result.error}</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {/* Score Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
                      {/* ATS Score */}
                      <div className=" p-5 rounded-xl shadow border border-gray-600 ">
                        <h3 className="font-semibold text-center mb-4 text-gray-200">ATS Compatibility</h3>
                        <div className="h-56 flex flex-col items-center">
                          <div className="w-40 h-40 relative">
                            <Doughnut
                              data={{
                                labels: ['ATS Score', 'Remaining'],
                                datasets: [{
                                  data: [result.atsScore, 100 - result.atsScore],
                                  backgroundColor: [
                                    result.atsScore > 70 ? '#4ade80' : 
                                    result.atsScore > 40 ? '#fbbf24' : '#f87171',
                                    '#374151'
                                  ],
                                  borderWidth: 0,
                                }]
                              }}
                              options={{
                                cutout: '70%',
                                plugins: {
                                  legend: { display: false },
                                  tooltip: { enabled: false }
                                }
                              }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className={`text-3xl font-bold ${
                                result.atsScore > 70 ? 'text-green-400' : 
                                result.atsScore > 40 ? 'text-amber-400' : 'text-red-400'
                              }`}>
                                {result.atsScore}%
                              </span>
                            </div>
                          </div>
                          <p className={`text-sm mt-3 ${
                            result.atsScore > 70 ? 'text-green-400' : 
                            result.atsScore > 40 ? 'text-amber-400' : 'text-red-400'
                          }`}>
                            {result.atsScore > 70 ? 'Excellent' : 
                             result.atsScore > 40 ? 'Good' : 'Needs Work'} ATS Score
                          </p>
                        </div>
                      </div>

                      {/* Skills Match */}
                      <div className=" p-5 rounded-xl shadow border border-gray-600">
                        <h3 className="font-semibold text-center mb-4 text-gray-200">Skills Match</h3>
                        <div className="h-56">
                          <Bar
                            data={{
                              labels: result.chartData.labels,
                              datasets: [{
                                label: 'Score',
                                data: result.chartData.data,
                                backgroundColor: [
                                  '#60a5fa',
                                  '#818cf8',
                                  '#a78bfa',
                                  '#c084fc',
                                  '#d946ef'
                                ],
                              }]
                            }}
                            options={{
                              responsive: true,
                              maintainAspectRatio: false,
                              scales: {
                                y: { 
                                  beginAtZero: true,
                                  max: 100,
                                  grid: {
                                    color: '#4b5563'
                                  },
                                  ticks: {
                                    color: '#9ca3af',
                                    callback: function(value) {
                                      return value + '%';
                                    }
                                  }
                                },
                                x: {
                                  grid: {
                                    color: '#4b5563'
                                  },
                                  ticks: {
                                    color: '#9ca3af'
                                  }
                                }
                              },
                              plugins: {
                                legend: {
                                  display: false
                                },
                                tooltip: {
                                  callbacks: {
                                    label: function(context) {
                                      return context.parsed.y + '%';
                                    }
                                  }
                                }
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Skills Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
                      {/* Present Skills */}
                      <div className="b  p-5 rounded-xl border border-gray-600">
                        <h3 className="font-semibold text-lg flex items-center gap-2 text-green-400 mb-3">
                          <CircleCheck size={18} /> Skills Found ({result.skillsMatchPercentage}% Match)
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {result.skillsFound.map((skill: string, i: number) => (
                            <span key={i} className="bg-green-900/30 text-green-400 px-3 py-1 rounded-full text-sm">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Missing Skills */}
                      <div className=" p-5 rounded-xl border border-gray-600">
                        <h3 className="font-semibold text-lg flex items-center gap-2 text-red-400 mb-3">
                          <CircleAlert size={18} /> Missing Skills
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {result.missingSkills.map((skill: string, i: number) => (
                            <span key={i} className="bg-red-900/30 text-red-400 px-3 py-1 rounded-full text-sm">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Insights Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Strengths */}
                      <div className=" p-5 rounded-xl border border-blue-600/30">
                        <h3 className="font-semibold text-lg flex items-center gap-2 text-blue-400 mb-3">
                          <CircleCheck size={18} /> Strengths
                        </h3>
                        <ul className="space-y-3">
                          {result.strengths.map((item: string, i: number) => (
                            <li key={i} className="flex items-start gap-2">
                              <ChevronRight className="flex-shrink-0 mt-1 text-blue-400" size={14} />
                              <span className="text-gray-200">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Weaknesses */}
                      <div className=" p-5 rounded-xl border border-red-600/30">
                        <h3 className="font-semibold text-lg flex items-center gap-2 text-red-400 mb-3">
                          <CircleAlert size={18} /> Weaknesses
                        </h3>
                        <ul className="space-y-3">
                          {result.weaknesses.map((item: any, i: number) => (
                            <li key={i} className="flex items-start gap-2">
                              <ChevronRight className="flex-shrink-0 mt-1 text-red-400" size={14} />
                              <span className="text-gray-200">
                                <span className="font-medium">{item.text}:</span> {item.reason}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Suggestions */}
                      <div className=" p-5 rounded-xl border border-purple-600/30">
                        <h3 className="font-semibold text-lg flex items-center gap-2 text-purple-400 mb-3">
                          <Lightbulb size={18} /> Suggestions
                        </h3>
                        <ul className="space-y-3">
                          {result.suggestions.map((item: string, i: number) => (
                            <li key={i} className="flex items-start gap-2">
                              <ChevronRight className="flex-shrink-0 mt-1 text-purple-400" size={14} />
                              <span className="text-gray-200">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Additional Sections */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Experience */}
                      <div className=" p-5 rounded-xl border border-gray-600">
                        <h3 className="font-semibold text-lg text-gray-200 mb-3">Experience Relevance</h3>
                        <div className="space-y-4">
                          {result.experienceRelevance.map((exp: any, i: number) => (
                            <div key={i} className=" p-3 rounded-lg">
                              <div className="flex justify-between items-start">
                                <span className="font-medium text-blue-400">{exp.role}</span>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                  exp.relevanceScore > 70 ? 'bg-green-900/30 text-green-400' :
                                  exp.relevanceScore > 40 ? 'bg-amber-900/30 text-amber-400' :
                                  'bg-red-900/30 text-red-400'
                                }`}>
                                  {exp.relevanceScore}% relevant
                                </span>
                              </div>
                              <p className="text-sm text-gray-400 mt-1">{exp.details}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Education */}
                      <div className=" p-5 rounded-xl border border-gray-600">
                        <h3 className="font-semibold text-lg text-gray-200 mb-3">Education Alignment</h3>
                        <div className=" p-4 rounded-lg">
                          <div className="flex justify-between items-start">
                            <span className="font-medium text-blue-400">{result.educationAlignment.degree}</span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              result.educationAlignment.relevance > 70 ? 'bg-green-900/30 text-green-400' :
                              result.educationAlignment.relevance > 40 ? 'bg-amber-900/30 text-amber-400' :
                              'bg-red-900/30 text-red-400'
                            }`}>
                              {result.educationAlignment.relevance}% relevant
                            </span>
                          </div>
                          <p className="text-sm text-gray-400 mt-1">{result.educationAlignment.details}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              ) : loading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="animate-spin text-blue-400" size={32} />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center text-gray-400">
                  <Wand2 size={40} className="mb-3 text-purple-400" />
                  <p className="text-lg">Your analysis results will appear here</p>
                  <p className="text-sm mt-1 text-gray-500">
                    {resumeText ? 'Click "Analyze Resume" to get started' : 'Enter your resume text first'}
                  </p>
                </div>              )}
            </div>
          </div>
        </div>
      </div>
    </div>
      </SignedIn>
    </>
  );
}
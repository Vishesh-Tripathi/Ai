'use client';

import {
  Clipboard,
  Check,
  CircleAlert,
  CircleCheck,
  ChevronRight,
  Lightbulb,
  Wand2,
  Loader2
} from 'lucide-react';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
} from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);
import { useState } from 'react';

type Weakness = { text: string; reason: string };
type Experience = { role: string; relevanceScore: number; details: string };
type Education = { degree: string; relevance: number; details: string };
type ChartData = { labels: string[]; data: number[] };

type Result = {
  atsScore: number;
  skillsMatchPercentage: number;
  skillsFound: string[];
  missingSkills: string[];
  strengths: string[];
  weaknesses: Weakness[];
  suggestions: string[];
  chartData: ChartData;
  experienceRelevance: Experience[];
  educationAlignment: Education;
  error?: string;
};

type Props = {
  result?: Result;
  loading?: boolean;
};

export default function RecentSkeleton({ result, loading }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="lg:col-span-2 space-y-6">
      <div className="backdrop-blur-3xl border-white/20 dark:border-gray-200/10 rounded-xl p-6 shadow-lg border">
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
                {/* ATS & Skills Charts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-5 rounded-xl shadow border border-gray-600">
                    <h3 className="font-semibold text-center mb-4 text-gray-200">ATS Compatibility</h3>
                    <div className="h-56 flex flex-col items-center">
                      <div className="w-40 h-40 relative">
                        <Doughnut
                          data={{
                            labels: ['ATS Score', 'Remaining'],
                            datasets: [
                              {
                                data: [result.atsScore, 100 - result.atsScore],
                                backgroundColor: [
                                  result.atsScore > 70
                                    ? '#4ade80'
                                    : result.atsScore > 40
                                    ? '#fbbf24'
                                    : '#f87171',
                                  '#374151'
                                ],
                                borderWidth: 0
                              }
                            ]
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
                          <span
                            className={`text-3xl font-bold ${
                              result.atsScore > 70
                                ? 'text-green-400'
                                : result.atsScore > 40
                                ? 'text-amber-400'
                                : 'text-red-400'
                            }`}
                          >
                            {result.atsScore}%
                          </span>
                        </div>
                      </div>
                      <p
                        className={`text-sm mt-3 ${
                          result.atsScore > 70
                            ? 'text-green-400'
                            : result.atsScore > 40
                            ? 'text-amber-400'
                            : 'text-red-400'
                        }`}
                      >
                        {result.atsScore > 70
                          ? 'Excellent'
                          : result.atsScore > 40
                          ? 'Good'
                          : 'Needs Work'}{' '}
                        ATS Score
                      </p>
                    </div>
                  </div>

                  {/* Skills Match */}
                  <div className="p-5 rounded-xl shadow border border-gray-600">
                    <h3 className="font-semibold text-center mb-4 text-gray-200">Skills Match</h3>
                    <div className="h-56">
                      <Bar
                        data={{
                          labels: result.chartData.labels,
                          datasets: [
                            {
                              label: 'Score',
                              data: result.chartData.data,
                              backgroundColor: ['#60a5fa', '#818cf8', '#a78bfa']
                            }
                          ]
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            y: {
                              beginAtZero: true,
                              max: 100,
                              grid: { color: '#4b5563' },
                              ticks: {
                                color: '#9ca3af',
                                callback: value => value + '%'
                              }
                            },
                            x: {
                              grid: { color: '#4b5563' },
                              ticks: { color: '#9ca3af' }
                            }
                          },
                          plugins: {
                            legend: { display: false },
                            tooltip: {
                              callbacks: {
                                label: context => context.parsed.y + '%'
                              }
                            }
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Skills Found / Missing */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-5 rounded-xl border border-gray-600">
                    <h3 className="font-semibold text-lg flex items-center gap-2 text-green-400 mb-3">
                      <CircleCheck size={18} /> Skills Found ({result.skillsMatchPercentage}% Match)
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {result.skillsFound.map((skill, i) => (
                        <span key={i} className="bg-green-900/30 text-green-400 px-3 py-1 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-5 rounded-xl border border-gray-600">
                    <h3 className="font-semibold text-lg flex items-center gap-2 text-red-400 mb-3">
                      <CircleAlert size={18} /> Missing Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {result.missingSkills.map((skill, i) => (
                        <span key={i} className="bg-red-900/30 text-red-400 px-3 py-1 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Strengths / Weaknesses / Suggestions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-5 rounded-xl border border-blue-600/30">
                    <h3 className="font-semibold text-lg flex items-center gap-2 text-blue-400 mb-3">
                      <CircleCheck size={18} /> Strengths
                    </h3>
                    <ul className="space-y-3">
                      {result.strengths.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <ChevronRight className="mt-1 text-blue-400" size={14} />
                          <span className="text-gray-200">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-5 rounded-xl border border-red-600/30">
                    <h3 className="font-semibold text-lg flex items-center gap-2 text-red-400 mb-3">
                      <CircleAlert size={18} /> Weaknesses
                    </h3>
                    <ul className="space-y-3">
                      {result.weaknesses.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <ChevronRight className="mt-1 text-red-400" size={14} />
                          <span className="text-gray-200">
                            <strong>{item.text}:</strong> {item.reason}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-5 rounded-xl border border-purple-600/30">
                    <h3 className="font-semibold text-lg flex items-center gap-2 text-purple-400 mb-3">
                      <Lightbulb size={18} /> Suggestions
                    </h3>
                    <ul className="space-y-3">
                      {result.suggestions.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <ChevronRight className="mt-1 text-purple-400" size={14} />
                          <span className="text-gray-200">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Experience & Education */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-5 rounded-xl border border-gray-600">
                    <h3 className="font-semibold text-lg text-gray-200 mb-3">Experience Relevance</h3>
                    <div className="space-y-4">
                      {result.experienceRelevance.map((exp, i) => (
                        <div key={i} className="p-3 rounded-lg">
                          <div className="flex justify-between items-start">
                            <span className="font-medium text-blue-400">{exp.role}</span>
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                exp.relevanceScore > 70
                                  ? 'bg-green-900/30 text-green-400'
                                  : exp.relevanceScore > 40
                                  ? 'bg-amber-900/30 text-amber-400'
                                  : 'bg-red-900/30 text-red-400'
                              }`}
                            >
                              {exp.relevanceScore}% relevant
                            </span>
                          </div>
                          <p className="text-sm text-gray-400 mt-1">{exp.details}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-5 rounded-xl border border-gray-600">
                    <h3 className="font-semibold text-lg text-gray-200 mb-3">Education Alignment</h3>
                    <div className="p-4 rounded-lg">
                      <div className="flex justify-between items-start">
                        <span className="font-medium text-blue-400">
                          {result.educationAlignment.degree}
                        </span>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            result.educationAlignment.relevance > 70
                              ? 'bg-green-900/30 text-green-400'
                              : result.educationAlignment.relevance > 40
                              ? 'bg-amber-900/30 text-amber-400'
                              : 'bg-red-900/30 text-red-400'
                          }`}
                        >
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
                Upload and analyze your resume to view results.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

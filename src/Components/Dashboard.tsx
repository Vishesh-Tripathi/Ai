'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { User, Calendar, Mail, Shield, Activity, BarChart3, FileText, Mic, Crown } from 'lucide-react';
import RecentSkeleton from './RecentSkeleton';
import { FeedbackCard } from './Feedback';

interface UserStats {
  resumeUsed: number;
  interviewUsed: number;
  totalTime: number;
  totalSessions: number;
  plan_type: string;
  subscription_status: string;
  createdAt: string;
  lastActivity: string;
}

export default function Dashboard() {
  const { user, isLoaded } = useUser();
  // Example
const [recentActivity, setRecentActivity] = useState({
  resume: [],
  interview: []
});

  const [openModal, setOpenModal] = useState(false);
  const [interviewModal, setInterviewModal] = useState(false);
const [selectedResume, setSelectedResume] = useState<any>(null);
const [selectedInterview, setSelectedInterview] = useState<any>(null);

  const [userStats, setUserStats] = useState<UserStats>({
    resumeUsed: 0,
    interviewUsed: 0,
    totalTime: 0,
    totalSessions: 0,
    plan_type: '',
    subscription_status: '',
    createdAt: '',
    lastActivity: 'Never'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && user) {
      fetchUserData();
      fetchRecentActivity();
    }
  }, [isLoaded, user]);

  const fetchRecentActivity = async () => {
    if (!user) return;

    try {
      // Fetch recent activity from API
      const response = await fetch('/api/user/recent');
      console.log("Ressssssssssssssssssss",response.body)
      const recentActivity = await response.json();
       setRecentActivity(recentActivity);
        console.log('Recent Activity:', recentActivity);
      
    } catch (error) {
      console.error('Error in fetchRecentActivity:', error);
    }
  }

  const fetchUserData = async () => {
    if (!user) return;

    try {
      // Fetch user stats from API
      const response = await fetch('/api/user/stats');
      if (response.ok) {
        const stats = await response.json();
        setUserStats(stats);
      } else {
        console.error('Failed to fetch user stats');
      }
    } catch (error) {
      console.error('Error in fetchUserData:', error);
    } finally {
      setLoading(false);
    }
  };
  console.log('userStats:', userStats);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getPlanBadge = (plan?: string) => {
    switch (plan) {
      case 'Pro':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
            <Crown className="w-4 h-4" />
            Pro
          </span>
        );
      case 'Enterprise':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">
            <Shield className="w-4 h-4" />
            Enterprise
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-800 text-sm font-medium rounded-full">
            <User className="w-4 h-4" />
            Free
          </span>
        );
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Not signed in</h2>
          <p className="text-gray-600 dark:text-gray-400">Please sign in to access your dashboard</p>
        </div>
      </div>
    );
  }

  return (

    <>
     {interviewModal && selectedInterview && (
  <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
     <button
        onClick={() => setInterviewModal(false)}
        className="absolute top-4 right-4 text-white hover:text-gray-400"
      >
        ✖
      </button>
    <div className="bg-[#0f172a] border border-gray-600 rounded-xl p-4 w-full max-w-6xl h-[90vh] overflow-y-auto relative shadow-xl">
     
      
      {/* Your Analysis Skeleton Component */}
      <FeedbackCard analysisData={selectedInterview} />
    </div>
  </div>
)}

    {openModal && selectedResume && (
  <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
     <button
        onClick={() => setOpenModal(false)}
        className="absolute top-4 right-4 text-white hover:text-gray-400"
      >
        ✖
      </button>
    <div className="bg-[#0f172a] border border-gray-600 rounded-xl p-4 w-full max-w-6xl h-[90vh] overflow-y-auto relative shadow-xl">
     
      
      {/* Your Analysis Skeleton Component */}
      <RecentSkeleton  result={selectedResume} />
    </div>
  </div>
)}

    <div className=" mt-8 min-h-screen bg-gray-50 dark:bg-gray-900 py-8">

    <div className="fixed inset-0 overflow-hidden z-0 pointer-events-none">
  <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-gradient-to-br from-blue-500 via-blue-400 to-blue-300 rounded-full opacity-50 blur-3xl animate-float brightness-125 saturate-150"></div>

  <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-br from-purple-500 via-purple-400 to-pink-300 rounded-full opacity-50 blur-3xl animate-float-delay brightness-125 saturate-150"></div>

  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-72 h-72 bg-gradient-to-br from-green-400 via-teal-400 to-cyan-300 rounded-full opacity-50 blur-3xl animate-float brightness-125 saturate-150"></div>
</div>




      <div className="max-w-7xl mx-auto mt-20 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user.firstName || user.emailAddresses[0]?.emailAddress}!
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Here's your career preparation overview
          </p>
        </div>

        {/* User Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Profile Card */}
          <div className="backdrop-blur-3xl border border-white/20 dark:border-gray-200/10  rounded-lg shadow p-6">
            <div className="flex items-center space-x-4">
              <img
                src={user.imageUrl}
                alt="Profile"
                className="w-16 h-16 rounded-full"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {user.fullName || 'User'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {user.emailAddresses[0]?.emailAddress}
                </p>
                <div className="mt-2">
                  {getPlanBadge(userStats?.plan_type)}
                </div>
              </div>
            </div>
          </div>

          {/* Account Info */}
          <div className="backdrop-blur-3xl border border-white/20 dark:border-gray-200/10  rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Account Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Clerk ID:</span>
                <span className="text-sm font-mono text-gray-900 dark:text-white">
                  {user.id.slice(0, 8)}...
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Member since:</span>
                <span className="text-gray-900 dark:text-white">
                  {userStats ? formatDate(userStats.createdAt) : 'Recently'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Status:</span>
                <span className="text-green-600 dark:text-green-400">Active</span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="backdrop-blur-3xl border border-white/20 dark:border-gray-200/10  rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Stats
            </h3>
            <div className="space-y-3 ">
              <div className="  flex items-center  justify-between">
                <span className="text-gray-600 dark:text-gray-400">Last Activity:</span>
                <span className="text-gray-900 dark:text-white">{userStats.lastActivity}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Total Sessions:</span>
                <span className="text-gray-900 dark:text-white">
                  {userStats.totalSessions}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Time Spent:</span>
                <span className="text-gray-900 dark:text-white">{userStats.totalTime} min</span>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="backdrop-blur-3xl border border-white/20 dark:border-gray-200/10  rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Resume Analyses</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{userStats.resumeUsed}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="backdrop-blur-3xl border border-white/20 dark:border-gray-200/10  rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Interview Sessions</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{userStats.interviewUsed}</p>
              </div>
              <Mic className="w-8 h-8 text-purple-600" />
            </div>
          </div>

          {/* <div className="backdrop-blur-3xl border border-white/20 dark:border-gray-200/10  rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Time</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{userStats.totalTime}m</p>
              </div>
              <Activity className="w-8 h-8 text-green-600" />
            </div>
          </div> */}

          <div className="backdrop-blur-3xl border border-white/20 dark:border-gray-200/10  rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Progress Score</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {Math.round((userStats.totalSessions / 20) * 100)}%
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-amber-600" />
            </div>
          </div>
        </div>

    
        {/* Recent Activity */}
<div className="backdrop-blur-3xl border border-white/20 dark:border-gray-200/10 p-4 rounded-lg shadow">
  <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
  </div>

  <div className="p-6 space-y-6">
    {/* === Resume Section === */}
    <div>
      <h4 className="text-md font-semibold text-gray-800 dark:text-gray-100 mb-2">Resume Analyses</h4>
      {(!recentActivity?.resume || recentActivity.resume.length === 0) ? (
        <p className="text-gray-500 dark:text-gray-400">No recent resume activity</p>
      ) : (
        recentActivity.resume.map((item: any) => {
          let summary;
          try {
            summary = JSON.parse(item.resultSummary);
          } catch {
            summary = null;
          }

          const formatExactDateTime = (dateString: string) => {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            });
          };

          return (
            <button
              key={item.id}
              onClick={() => {
                setSelectedResume(summary);
                setOpenModal(true);
              }}
              className="flex items-start space-x-3 w-full text-left hover:bg-white/5 p-3 rounded-md transition"
            >
              <FileText className="w-5 h-5 mt-1 text-blue-600" />
              <div>
                <p className="text-sm text-gray-900 dark:text-white font-medium">
                  Resume analysis completed
                  {summary?.atsScore !== undefined && (
                    <span className="ml-2 text-xs text-blue-400 font-semibold">
                      • ATS Score: {summary.atsScore}%
                    </span>
                  )}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {formatExactDateTime(item.createdAt)}
                </p>
              </div>
            </button>
          );
        })
      )}
    </div>

    {/* === Interview Section === */}
    <div>
      <h4 className="text-md font-semibold text-gray-800 dark:text-gray-100 mb-2">Interview Summaries</h4>
      {(!recentActivity?.interview || recentActivity.interview.length === 0) ? (
        <p className="text-gray-500 dark:text-gray-400">No recent interview activity</p>
      ) : (
        recentActivity.interview.map((item: any) => {
          let summary;
          try {
            summary = JSON.parse(item.resultSummary);
          } catch {
            summary = null;
          }

         


          function formatExactDateTime(dateString: string) {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            });
            }

          return (
            <button
              key={item.id}
              onClick={() => {
                setSelectedInterview(summary);
                setInterviewModal(true);
              }}
              className="flex items-start space-x-3 w-full text-left hover:bg-white/5 p-3 rounded-md transition"
            >
              <FileText className="w-5 h-5 mt-1 text-purple-500" />
              <div>
                <p className="text-sm text-gray-900 dark:text-white font-medium">
                  Interview summary available
                  {summary?.overallScore !== undefined && (
                    <span className="ml-2 text-xs text-purple-400 font-semibold">
                      • Score: {summary.overallScore}/10
                    </span>
                  )}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {formatExactDateTime(item.createdAt)}
                </p>
              </div>
            </button>
          );
        })
      )}
    </div>
  </div>
</div>


      </div>
    </div>
    </>
  );
}

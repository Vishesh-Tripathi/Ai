'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { User, Calendar, Mail, Shield, Activity, BarChart3, FileText, Mic, Crown } from 'lucide-react';

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
    }
  }, [isLoaded, user]);

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
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
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
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
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Stats
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Resume Analyses</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{userStats.resumeUsed}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Interview Sessions</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{userStats.interviewUsed}</p>
              </div>
              <Mic className="w-8 h-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Time</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{userStats.totalTime}m</p>
              </div>
              <Activity className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
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
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-gray-900 dark:text-white">Resume analysis completed</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mic className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-gray-900 dark:text-white">Mock interview session</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">1 day ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-gray-900 dark:text-white">Profile updated</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">3 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

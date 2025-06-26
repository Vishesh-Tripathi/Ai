'use client';

export const dynamic = "force-dynamic";


import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Loader2, ArrowRight, FileText, Mic } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function SuccessPage() {
  const { user } = useUser();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    
    if (sessionId) {
      // In a real application, you would verify the session with your backend
      setTimeout(() => {
        setSession({ id: sessionId });
        setLoading(false);
      }, 2000);
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Processing your payment...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-4">Payment session not found</p>
          <button
            onClick={() => router.push('/pricing')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all"
          >
            Return to Pricing
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-white mb-4">Payment Successful!</h1>
          <p className="text-gray-400 text-lg">
            Thank you for subscribing to CareerPrepAI Premium
          </p>
          {user && (
            <p className="text-blue-400 mt-2">
              Welcome to the premium experience, {user.firstName || user.emailAddresses[0]?.emailAddress}!
            </p>
          )}
        </div>

        <div className="bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-700 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">What's Next?</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <CheckCircle className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-white">Unlimited Resume Analysis</h3>
                <p className="text-gray-400">Get detailed AI-powered feedback on all your resumes</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <CheckCircle className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-white">Extended Interview Sessions</h3>
                <p className="text-gray-400">Practice with longer, more comprehensive mock interviews</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <CheckCircle className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-white">Priority Support</h3>
                <p className="text-gray-400">Get faster responses and dedicated assistance</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => router.push('/resume')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-6 rounded-xl transition-all flex items-center justify-between"
          >
            <div className="text-left">
              <FileText className="w-8 h-8 mb-2" />
              <h3 className="text-lg font-semibold">Analyze Resume</h3>
              <p className="text-sm opacity-90">Start optimizing your resume</p>
            </div>
            <ArrowRight className="w-6 h-6" />
          </button>

          <button
            onClick={() => router.push('/interviewpanel')}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white p-6 rounded-xl transition-all flex items-center justify-between"
          >
            <div className="text-left">
              <Mic className="w-8 h-8 mb-2" />
              <h3 className="text-lg font-semibold">Practice Interview</h3>
              <p className="text-sm opacity-90">Start your mock interview</p>
            </div>
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>

        <div className="text-center">
          <button
            onClick={() => router.push('/')}
            className="text-gray-400 hover:text-white transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

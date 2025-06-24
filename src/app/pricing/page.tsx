'use client';
import { Zap, Check, Clock, FileText, Mic, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PricingPage() {
  const router = useRouter();
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              Choose Your Plan
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Flexible token-based pricing for your career preparation needs
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Trial Plan */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Starter</h2>
                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-sm font-medium">
                  Free
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Try our basic features to get started
              </p>
              <div className="mb-8">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">₹0</span>
                <span className="text-gray-600 dark:text-gray-400">/forever</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300">1 resume analysis</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300">1 interview (5 minutes)</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300">Basic feedback</span>
                </li>
              </ul>
              <button
                onClick={() => router.push('/signup')}
                className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Get Started
              </button>
            </div>
          </div>

          {/* Paid Plan */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border-2 border-blue-500 dark:border-blue-400 relative">
            <div className="absolute top-0 right-0 bg-blue-600 dark:bg-blue-500 text-white px-4 py-1 text-sm font-medium rounded-bl-lg">
              Popular
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Professional</h2>
                <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-3 py-1 rounded-full text-sm font-medium">
                  Token-based
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Unlimited access with our token system
              </p>
              <div className="mb-8">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">₹2</span>
                <span className="text-gray-600 dark:text-gray-400">/token</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300">1 token = 1 feature use</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300">Unlimited resume analysis</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300">Unlimited interviews</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300">Detailed feedback</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300">Priority support</span>
                </li>
              </ul>
              <button
                onClick={() => router.push('/purchase-tokens')}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                Buy Tokens <Zap className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Token Usage Examples */}
        <div className="mt-16 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
            Token Usage Examples
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <FileText className="w-6 h-6 text-blue-500" />
                <h3 className="font-medium text-gray-800 dark:text-white">Resume Analysis</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Each complete resume review consumes 1 token
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Mic className="w-6 h-6 text-purple-500" />
                <h3 className="font-medium text-gray-800 dark:text-white">Mock Interview</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                1 token per 5 minutes of interview time
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                question: "How do I purchase tokens?",
                answer: "You can buy tokens in bulk through our secure payment system. Tokens never expire until used."
              },
              {
                question: "Can I switch between plans?",
                answer: "Yes, you can use the free plan as long as you want and purchase tokens whenever you need more features."
              },
              {
                question: "What happens if I run out of tokens?",
                answer: "You'll need to purchase more tokens to continue using premium features. Basic features remain available."
              }
            ].map((item, index) => (
              <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <button className="flex justify-between items-center w-full text-left">
                  <h3 className="font-medium text-gray-800 dark:text-white">{item.question}</h3>
                  <ChevronRight className="w-5 h-5 text-gray-500" />
                </button>
                <p className="mt-2 text-gray-600 dark:text-gray-400">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
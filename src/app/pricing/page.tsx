'use client';
import { Zap, Check, Clock, FileText, Mic, ChevronRight, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function PricingPage() {
  const router = useRouter();
  const { isSignedIn, user } = useUser();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscription = async (priceId: string, planName: string) => {
    if (!isSignedIn) {
      router.push('/sign-in');
      return;
    }

    setLoading(planName);
    
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: priceId,
          mode: 'subscription',
        }),
      });

      const { sessionId } = await response.json();
      
      const stripe = await stripePromise;
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId });
        if (error) {
          console.error('Error:', error);
        }
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
    } finally {
      setLoading(null);
    }
  };

  const handleOneTimePayment = async (priceId: string, planName: string) => {
    if (!isSignedIn) {
      router.push('/sign-in');
      return;
    }

    setLoading(planName);
    
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: priceId,
          mode: 'payment',
        }),
      });

      const { sessionId } = await response.json();
      
      const stripe = await stripePromise;
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId });
        if (error) {
          console.error('Error:', error);
        }
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
    } finally {
      setLoading(null);
    }
  };
  
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
        </div>        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Free Plan */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Free</h2>
                <span className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-3 py-1 rounded-full text-sm font-medium">
                  Forever Free
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Perfect for trying out our basic features
              </p>
              <div className="mb-8">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">$0</span>
                <span className="text-gray-600 dark:text-gray-400">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300">2 resume analyses per month</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300">2 interview sessions (5 min each)</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300">Basic feedback</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300">Community support</span>
                </li>
              </ul>
              <button
                onClick={() => router.push('/resume')}
                className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Get Started Free
              </button>
            </div>
          </div>

          {/* Pro Plan */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border-2 border-blue-500 dark:border-blue-400 relative">
            <div className="absolute top-0 right-0 bg-blue-600 dark:bg-blue-500 text-white px-4 py-1 text-sm font-medium rounded-bl-lg">
              Most Popular
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Pro</h2>
                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-sm font-medium">
                  Best Value
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Perfect for active job seekers
              </p>
              <div className="mb-8">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">$29</span>
                <span className="text-gray-600 dark:text-gray-400">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300">Unlimited resume analyses</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300">Unlimited interview sessions</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300">Extended interviews (up to 30 min)</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300">Detailed AI feedback</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300">Priority support</span>
                </li>
              </ul>              <button
                onClick={() => handleSubscription('price_1RdoqrH8EuYnXTB6RwSSZET1', 'Pro')}
                disabled={loading === 'Pro'}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading === 'Pro' ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>Subscribe to Pro <Zap className="w-5 h-5" /></>
                )}
              </button>
            </div>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Enterprise</h2>
                <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-3 py-1 rounded-full text-sm font-medium">
                  Custom
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                For teams and organizations
              </p>
              <div className="mb-8">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">$99</span>
                <span className="text-gray-600 dark:text-gray-400">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300">Everything in Pro</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300">Team dashboard</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300">Advanced analytics</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300">Custom integrations</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300">Dedicated support</span>
                </li>
              </ul>              <button
                onClick={() => handleSubscription('price_1RdoqrH8EuYnXTB6RwSSZET1', 'Enterprise')}
                disabled={loading === 'Enterprise'}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading === 'Enterprise' ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>Subscribe to Enterprise <Zap className="w-5 h-5" /></>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* One-time Purchase Option */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Prefer One-Time Purchase?
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Get lifetime access without recurring payments
            </p>
          </div>
          <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="text-center mb-4">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">$299</span>
              <span className="text-gray-600 dark:text-gray-400"> one-time</span>
            </div>
            <ul className="space-y-2 mb-6 text-sm">
              <li className="flex items-center">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                <span className="text-gray-700 dark:text-gray-300">Lifetime Pro access</span>
              </li>
              <li className="flex items-center">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                <span className="text-gray-700 dark:text-gray-300">All future updates included</span>
              </li>
              <li className="flex items-center">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                <span className="text-gray-700 dark:text-gray-300">No recurring charges</span>
              </li>
            </ul>            <button
              onClick={() => handleOneTimePayment('price_1RdoqrH8EuYnXTB6RwSSZET1', 'Lifetime')}
              disabled={loading === 'Lifetime'}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading === 'Lifetime' ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>Buy Lifetime Access</>
              )}
            </button>
          </div>
        </div>        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                question: "Can I cancel my subscription anytime?",
                answer: "Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your current billing period."
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept all major credit cards, debit cards, and other payment methods supported by Stripe, including Apple Pay and Google Pay."
              },
              {
                question: "Is there a refund policy?",
                answer: "We offer a 7-day money-back guarantee for all subscription plans. If you're not satisfied, contact us for a full refund."
              },
              {
                question: "Can I upgrade or downgrade my plan?",
                answer: "Yes, you can change your plan at any time. Upgrades take effect immediately, and downgrades will take effect at the next billing cycle."
              },
              {
                question: "Do you offer discounts for students?",
                answer: "Yes, we offer a 50% student discount on all plans. Contact our support team with your student ID for verification."
              }
            ].map((item, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-800 dark:text-white mb-2">{item.question}</h3>
                <p className="text-gray-600 dark:text-gray-400">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
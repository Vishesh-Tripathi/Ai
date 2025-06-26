// This file contains test price IDs for Stripe integration
// In production, you would create these products/prices in your Stripe dashboard

export const STRIPE_PRICES = {
  PRO_MONTHLY: 'price_1QWExample1', // Replace with actual test price ID
  ENTERPRISE_MONTHLY: 'price_1QWExample2', // Replace with actual test price ID
  LIFETIME: 'price_1QWExample3', // Replace with actual test price ID
};

// Test products configuration for Stripe CLI or dashboard setup
export const STRIPE_PRODUCTS = {
  pro: {
    name: 'CareerPrepAI Pro',
    description: 'Unlimited resume analysis and interview practice',
    price: 2900, // $29.00 in cents
    currency: 'usd',
    interval: 'month',
  },
  enterprise: {
    name: 'CareerPrepAI Enterprise',
    description: 'Pro features plus team dashboard and analytics',
    price: 9900, // $99.00 in cents
    currency: 'usd',
    interval: 'month',
  },
  lifetime: {
    name: 'CareerPrepAI Lifetime',
    description: 'One-time payment for lifetime Pro access',
    price: 29900, // $299.00 in cents
    currency: 'usd',
    // No interval for one-time payments
  },
};

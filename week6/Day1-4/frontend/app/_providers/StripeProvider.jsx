'use client';
import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

export default function StripeProvider({ children }) {
  const [stripePromise, setStripePromise] = useState(null);

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!key) {
      console.error('Stripe publishable key is missing!');
      return;
    }
    setStripePromise(loadStripe(key));
  }, []);

  if (!stripePromise) return null;

  return <Elements stripe={stripePromise}>{children}</Elements>;
}

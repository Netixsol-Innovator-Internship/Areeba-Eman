'use client'
import { useSearchParams } from 'next/navigation';

export default function SuccessPage() {
  const params = useSearchParams();
  const orderId = params.get('order');

  return (
    <div className="text-center p-16">
      <h1 className="text-3xl font-bold text-green-600">✅ Payment Successful!</h1>
      <p className="mt-4 text-lg">Your order <span className="font-mono">{orderId}</span> has been placed successfully.</p>
    </div>
  );
}

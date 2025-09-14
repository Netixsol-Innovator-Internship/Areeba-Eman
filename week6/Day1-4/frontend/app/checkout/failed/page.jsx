export default function FailedPage() {
  return (
    <div className="text-center p-16">
      <h1 className="text-3xl font-bold text-red-600">❌ Payment Failed</h1>
      <p className="mt-4 text-lg">Something went wrong while processing your payment. Please try again.</p>
    </div>
  );
}

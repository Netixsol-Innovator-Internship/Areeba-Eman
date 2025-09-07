'use client'
import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useVerifyOtpMutation, useResendOtpMutation } from '@/features/api/apiSlice'

export default function VerifyOtpPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''
  const [code, setCode] = useState('')
  const [message, setMessage] = useState(null)
  const [verifyOtp, { isLoading }] = useVerifyOtpMutation()
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation()
  const router = useRouter()

  const onSubmit = async (e) => {
    e.preventDefault()
    setMessage(null)
    try {
      const res = await verifyOtp({ email, code }).unwrap()
      setMessage(res.message || 'OTP verified successfully')
      setTimeout(() => router.push('/login'), 1500)
    } catch (err) {
      setMessage(err?.data?.message || 'Invalid or expired code')
    }
  }

  const handleResend = async () => {
    try {
      const res = await resendOtp({ email }).unwrap()
      setMessage(res.message || 'OTP resent successfully')
    } catch (err) {
      setMessage(err?.data?.message || 'Failed to resend OTP')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="p-6 border rounded-xl shadow bg-white">
        <h1 className="text-2xl font-bold mb-6">Verify OTP</h1>
        {message && <p className="text-sm mb-4 text-blue-600">{message}</p>}
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            className="w-full border p-2 rounded tracking-widest text-center"
            type="text"
            placeholder="Enter 6-digit code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            minLength={6}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded font-medium transition"
          >
            {isLoading ? 'Verifying…' : 'Verify Code'}
          </button>
        </form>
        <button
          onClick={handleResend}
          disabled={isResending}
          className="mt-4 w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded transition"
        >
          {isResending ? 'Resending…' : 'Resend Code'}
        </button>
      </div>
    </div>
  )
}

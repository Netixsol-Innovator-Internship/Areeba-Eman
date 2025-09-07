'use client'
import { useState } from 'react'
import { useSignupMutation } from '@/features/api/apiSlice'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignupPage() {
  const [form, setForm] = useState({
    username: '',
    fullName: '',
    email: '',
    password: '',
  })
  const [signup, { isLoading }] = useSignupMutation()
  const [message, setMessage] = useState(null)
  const router = useRouter()

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await signup(form).unwrap()
      setMessage(res.message || 'OTP sent to your email')
      router.push('/verify-otp?email=' + encodeURIComponent(form.email))
    } catch (err) {
      setMessage(err?.data?.message || 'Signup failed')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="p-6 border rounded-xl shadow bg-white">
        <h1 className="text-2xl font-bold mb-6">Sign Up</h1>
        {message && <p className="text-sm text-blue-600 mb-4">{message}</p>}
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            className="w-full border p-2 rounded"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />
          <input
            className="w-full border p-2 rounded"
            placeholder="Full Name"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            required
          />
          <input
            className="w-full border p-2 rounded"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            className="w-full border p-2 rounded"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-medium transition"
          >
            {isLoading ? 'Signing up…' : 'Sign Up'}
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}

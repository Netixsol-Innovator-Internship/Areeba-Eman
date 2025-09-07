'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLoginMutation, useProfileQuery } from '@/features/api/apiSlice'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { setCredentials } from '@/features/authSlice'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [login, { isLoading }] = useLoginMutation()
  const router = useRouter()
  const dispatch = useDispatch()
  const token = useSelector((s) => s.auth.token)

  // Only fetch profile if we have a token
  const { data: me } = useProfileQuery(undefined, { skip: !token })

  useEffect(() => {
    if (me?.role === 'admin' || me?.role === 'superadmin') {
      router.push('/dashboard')
    } else if (me) {
      router.push('/')
    }
  }, [me, router])

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await login(form).unwrap()
      console.log('Login response:', res)
      dispatch(setCredentials({ token: res.access_token }))
      router.push('/') // redirect after login
    } catch (err) {
      console.error('Login error:', err)
      alert(err?.data?.message || 'Invalid credentials')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="p-6 border rounded-xl shadow bg-white">
        <h1 className="text-2xl font-bold mb-6">Login</h1>
        <form onSubmit={onSubmit} className="space-y-4">
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
            {isLoading ? 'Logging in…' : 'Login'}
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-600">
          Don’t have an account?{' '}
          <Link href="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

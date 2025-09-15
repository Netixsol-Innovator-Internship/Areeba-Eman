// 'use client'
// import { useState, useEffect } from 'react'
// import Link from 'next/link'
// import { useLoginMutation, useProfileQuery } from '@/features/api/apiSlice'
// import { useRouter } from 'next/navigation'
// import { useDispatch, useSelector } from 'react-redux'
// import { setCredentials } from '@/features/authSlice'

// export default function LoginPage() {
//   const [form, setForm] = useState({ email: '', password: '' })
//   const [login, { isLoading }] = useLoginMutation()
//   const router = useRouter()
//   const dispatch = useDispatch()
//   const token = useSelector((s) => s.auth.token)

//   // Only fetch profile if we have a token
//   const { data: me } = useProfileQuery(undefined, { skip: !token })

//   useEffect(() => {
//     if (me?.role === 'admin' || me?.role === 'superadmin') {
//       router.push('/dashboard')
//     } else if (me) {
//       router.push('/')
//     }
//   }, [me, router])

//   const onSubmit = async (e) => {
//     e.preventDefault()
//     try {
//       const res = await login(form).unwrap()
//       console.log('Login response:', res)
//       dispatch(setCredentials({ token: res.access_token }))
//       router.push('/') // redirect after login
//     } catch (err) {
//       console.error('Login error:', err)
//       alert(err?.data?.message || 'Invalid credentials')
//     }
//   }

//   return (
//     <div className="max-w-md mx-auto mt-10">
//       <div className="p-6 border rounded-xl shadow bg-white">
//         <h1 className="text-2xl font-bold mb-6">Login</h1>
//         <form onSubmit={onSubmit} className="space-y-4">
//           <input
//             className="w-full border p-2 rounded"
//             type="email"
//             placeholder="Email"
//             value={form.email}
//             onChange={(e) => setForm({ ...form, email: e.target.value })}
//             required
//           />
//           <input
//             className="w-full border p-2 rounded"
//             type="password"
//             placeholder="Password"
//             value={form.password}
//             onChange={(e) => setForm({ ...form, password: e.target.value })}
//             required
//           />
//           <button
//             type="submit"
//             disabled={isLoading}
//             className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-medium transition"
//           >
//             {isLoading ? 'Logging in…' : 'Login'}
//           </button>
//         </form>
//         <p className="mt-4 text-sm text-gray-600">
//           Don’t have an account?{' '}
//           <Link href="/signup" className="text-blue-600 hover:underline">
//             Sign up
//           </Link>
//         </p>
//       </div>
//     </div>
//   )
// }
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
      dispatch(setCredentials({ token: res.access_token }))
      router.push('/')
    } catch (err) {
      alert(err?.data?.message || 'Invalid credentials')
    }
  }

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`
  }
  const loginWithGithub = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/github`;
  };

  const loginWithDiscord = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/discord`;
  };


  return (
    <div className="max-w-md mx-auto mt-10 space-y-6">
      <div className="p-6 border rounded-xl shadow bg-white space-y-4">
        <h1 className="text-2xl font-bold mb-6">Login</h1>

        {/* Email/Password Form */}
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

        {/* OAuth Login */}
        <div className="flex flex-col gap-3 mt-4">
  <button
    onClick={handleGoogleLogin}
    className="flex items-center justify-center gap-2 w-full bg-white hover:bg-gray-300 text-black py-2 border border-black rounded font-medium transition"
  >
    <img
      src="https://www.svgrepo.com/show/475656/google-color.svg"
      alt="Google"
      className="w-5 h-5"
    />
    Sign in with Google
  </button>
</div>

<div className="flex flex-col gap-3 mt-4">
  <button
    onClick={loginWithGithub}
    className="flex items-center justify-center gap-2 w-full bg-black hover:bg-gray-800 text-white py-2 rounded font-medium transition"
  >
    <img
      src="https://www.svgrepo.com/show/512317/github-142.svg"
      alt="GitHub"
      className="w-5 h-5 invert"
    />
    Sign in with GitHub
  </button>
</div>

<div className="flex flex-col gap-3 mt-4">
  <button
    onClick={loginWithDiscord}
    className="flex items-center justify-center gap-2 w-full bg-[#7289da] hover:bg-[#44579e] text-white py-2 rounded font-medium transition"
  >
    <img
      src="https://www.svgrepo.com/show/353655/discord-icon.svg"
      alt="Discord"
      className="w-5 h-5"
    />
    Login with Discord
  </button>
</div>


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

// login/page.jsx
"use client"

import { useState, FormEvent } from "react"
import { useRouter } from "next/navigation"
import { useDispatch } from "react-redux"
import { login } from "../../store/authSlice"


export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()
  const dispatch = useDispatch()
  

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")

    try {
      const res = await fetch("http://localhost:4000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      const data = await res.json()

      if (res.ok) {
        localStorage.setItem("token", data.access_token)
        dispatch(login(data.access_token)) // ✅ dispatch 'login' action
        router.push("/")
      } else {
        setError(data.message || "Login failed")
      }
    } catch (err) {
      console.error(err)
      setError("Something went wrong. Try again.")
    }
  }

  return (
    <div>
      <main className="flex justify-center items-center min-h-[70vh]">
        <div className="w-[400px] bg-white shadow-md rounded-lg border p-6">
          {/* Slider */}
          <div className="flex mb-6 rounded-lg border overflow-hidden">
            <a
              href="/login"
              className="flex-1 text-center py-2 font-semibold transition-colors duration-200 
                         bg-[#0b2c69] text-white"
            >
              Login
            </a>
            <a
              href="/register"
              className="flex-1 text-center py-2 font-semibold transition-colors duration-200 
                         bg-white text-[#0b2c69] hover:bg-gray-100"
            >
              Signup
            </a>
          </div>

          <form onSubmit={handleLogin}>
            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

            <input
              type="text"
              placeholder="Username"
              className="w-full mb-3 p-2 border rounded"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full mb-3 p-2 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="submit"
              className="w-full bg-[#0b2c69] text-white py-2 rounded"
            >
              Login
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}

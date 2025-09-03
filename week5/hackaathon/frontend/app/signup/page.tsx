"use client"

import React, { useState, FormEvent } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"

export default function SignupPage() {
  const [username, setUsername] = useState("")
  const [fullName, setFullName] = useState("")
  const [mobileNumber, setMobileNumber] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")

    try {
      const res = await fetch("http://localhost:4000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, fullName, password, mobileNumber }),
      })

      const data = await res.json()

      if (res.ok) {
        localStorage.setItem("token", data.access_token)
        router.push("/")
      } else {
        setError(data.message || "Registration failed")
      }
    } catch (err: any) {
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
            <Link
              href="/login"
              className="flex-1 text-center py-2 font-semibold transition-colors duration-200 
                         bg-white text-[#0b2c69] hover:bg-gray-100"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="flex-1 text-center py-2 font-semibold transition-colors duration-200 
                         bg-[#0b2c69] text-white"
            >
              Signup
            </Link>
          </div>

          {/* Form */}
          <form onSubmit={handleRegister}>
            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

            <input
              type="text"
              placeholder="Username"
              className="w-full mb-3 p-2 border rounded"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <input
              type="text"
              placeholder="Full Name"
              className="w-full mb-3 p-2 border rounded"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

            <input
              type="text"
              placeholder="Mobile Number"
              className="w-full mb-3 p-2 border rounded"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
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
              Create Account
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}

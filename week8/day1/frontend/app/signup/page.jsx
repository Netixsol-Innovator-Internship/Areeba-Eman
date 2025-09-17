"use client";

import { useState } from "react";
import { useSignupMutation } from "../../redux/apiSlice";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signup, { isLoading, error }] = useSignupMutation();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await signup({ email, password, name }).unwrap();
      console.log("Signed up:", data);
      router.push("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-black text-white">
      <h1 className="text-3xl font-bold mb-4">Sign Up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-2 rounded bg-gray-800 text-white"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 rounded bg-gray-800 text-white"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 rounded bg-gray-800 text-white"
          required
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-pink-500 hover:bg-pink-600 p-2 rounded font-bold"
        >
          Sign Up
        </button>
      </form>

      <button
        onClick={() => router.push("/login")}
        className="mt-4 text-sm text-gray-400 underline"
      >
        Already have an account? Login
      </button>

      {error && <p className="text-red-500 mt-2">Signup failed. Try again.</p>}
    </div>
  );
}

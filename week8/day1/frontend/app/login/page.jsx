"use client";

import { useState } from "react";
import { useLoginMutation } from "../../redux/apiSlice";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { isLoading, error }] = useLoginMutation();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login({ email, password }).unwrap();
      console.log("Logged in:", data);
      localStorage.setItem("token", data.access_token);
      router.push("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-black text-white">
      <h1 className="text-3xl font-bold mb-4">Login</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
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
          Login
        </button>
      </form>

      <button
        onClick={() => router.push("/signup")}
        className="mt-4 text-sm text-gray-400 underline"
      >
        Don’t have an account? Sign up
      </button>

      {error && <p className="text-red-500 mt-2">Login failed. Check credentials.</p>}
    </div>
  );
}

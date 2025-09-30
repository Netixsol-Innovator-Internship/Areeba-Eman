"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSignupMutation } from "@/features/auth/authApi";
import { motion } from "framer-motion";
import { User, Mail, Lock } from "lucide-react";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [signup, { isLoading }] = useSignupMutation();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await signup({ email, password, name }).unwrap();
      alert("Signup successful! Please login.");
      router.push("/login");
    } catch (err) {
      if (err && typeof err === "object" && "data" in err) {
        const apiError = err as { data?: { message?: string } };
        alert(apiError.data?.message || "Signup failed");
      } else {
        alert("Signup failed");
      }
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-r from-green-200 via-green-300 to-green-200">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white shadow-xl rounded-2xl p-10 w-96"
      >
        <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-2">
          Create Account
        </h1>
        <p className="text-center text-gray-500 mb-8">
          Sign up to get started 🚀
        </p>

        {/* Name Input */}
        <div className="flex items-center border rounded-lg px-3 py-3 mb-4 focus-within:ring-2 focus-within:ring-green-400">
          <User className="text-gray-400 mr-2" size={20} />
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full outline-none text-gray-700"
            required
          />
        </div>

        {/* Email Input */}
        <div className="flex items-center border rounded-lg px-3 py-3 mb-4 focus-within:ring-2 focus-within:ring-green-400">
          <Mail className="text-gray-400 mr-2" size={20} />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full outline-none text-gray-700"
            required
          />
        </div>

        {/* Password Input */}
        <div className="flex items-center border rounded-lg px-3 py-3 mb-6 focus-within:ring-2 focus-within:ring-green-400">
          <Lock className="text-gray-400 mr-2" size={20} />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full outline-none text-gray-700"
            required
          />
        </div>

        {/* Signup Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-green-400 to-green-500 text-white font-semibold py-3 rounded-lg shadow-md hover:from-green-500 hover:to-green-600 transition-all duration-200"
        >
          {isLoading ? "Signing up..." : "Sign Up"}
        </button>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <hr className="flex-1 border-gray-300" />
          <span className="px-2 text-gray-400 text-sm">or</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        {/* Login Redirect */}
        <p className="text-center text-gray-600">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-green-600 font-semibold hover:underline"
          >
            Login
          </a>
        </p>
      </motion.form>
    </div>
  );
}

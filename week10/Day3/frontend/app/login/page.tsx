"use client";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { setToken } from "@/features/auth/authSlice";
import { useLoginMutation } from "@/features/auth/authApi";
import { motion } from "framer-motion";
import { Lock, Mail } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setToken(res.access_token));
      router.push("/products");
    } catch (err) {
      if (err && typeof err === "object" && "data" in err) {
        const apiError = err as { data?: { message?: string } };
        alert(apiError.data?.message || "Login failed");
      } else {
        alert("Login failed");
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
          Welcome Back
        </h1>
        <p className="text-center text-gray-500 mb-8">
          Please login to continue
        </p>

        {/* Email Input */}
        <div className="flex items-center border rounded-lg px-3 py-3 mb-4 focus-within:ring-2 focus-within:ring-green-400">
          <Mail className="text-gray-400 mr-2" size={20} />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full outline-none text-gray-700"
            required
          />
        </div>

        {/* Password Input */}
        <div className="flex items-center border rounded-lg px-3 py-3 mb-4 focus-within:ring-2 focus-within:ring-green-400">
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

        {/* Forgot Password */}
        {/* <div className="text-right mb-6">
          <a href="/forgot-password" className="text-sm text-green-600 hover:underline">
            Forgot Password?
          </a>
        </div> */}

        {/* Login Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-green-400 to-green-500 text-white font-semibold py-3 rounded-lg shadow-md hover:from-green-500 hover:to-green-600 transition-all duration-200"
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <hr className="flex-1 border-gray-300" />
          <span className="px-2 text-gray-400 text-sm">or</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        {/* Signup Redirect */}
        <p className="text-center text-gray-600">
          Don’t have an account?{" "}
          <a
            href="/signup"
            className="text-green-600 font-semibold hover:underline"
          >
            Sign up
          </a>
        </p>
      </motion.form>
    </div>
  );
}

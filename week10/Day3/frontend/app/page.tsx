"use client";

import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function HomePage() {
  const token = useSelector((s: RootState) => s.auth.token);
  const [isClient, setIsClient] = useState(false);

  // This ensures we only check auth after the component is mounted on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  const isLoggedIn = Boolean(token);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-white to-green-50">
      <div className="max-w-xl w-full text-center p-10 rounded-3xl shadow-2xl bg-white">
        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-green-700 mb-6">
          Welcome to <span className="text-emerald-500">Healthcare Hub</span>
        </h1>
        <p className="text-gray-600 text-lg mb-10">
          Your personal AI-powered assistant for <br />
          <span className="text-green-600 font-semibold">
            healthcare advice & product recommendations.
          </span>
        </p>

        {/* CTA Button */}
        {isClient ? (
          isLoggedIn ? (
            <Link
              href="/products"
              className="px-8 py-4 text-lg rounded-full bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg transition"
            >
              Get Products
            </Link>
          ) : (
            <Link
              href="/login"
              className="px-8 py-4 text-lg rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold shadow-lg transition"
            >
              Get Started →
            </Link>
          )
        ) : (
          // render nothing or a placeholder during SSR
          <div className="h-12" />
        )}

        {/* Footer note */}
        {isClient && (
          <p className="mt-8 text-sm text-gray-500">
            {isLoggedIn
              ? "You're logged in — explore our curated healthcare products!"
              : "Create an account to unlock personalized recommendations."}
          </p>
        )}
      </div>
    </div>
  );
}

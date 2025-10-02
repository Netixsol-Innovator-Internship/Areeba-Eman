"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import Navbar from "../components/NavBar";

export default function HomePage() {
  const { token, user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex justify-center items-center flex-1">
        {token ? (
          <button
            onClick={() => router.push("/chat")}
            className="bg-green-500 text-white px-6 py-3 rounded-lg text-xl"
          >
            Let’s Chat 🚀
          </button>
        ) : (
          <div>
            <p className="mb-4">Welcome! Please log in or sign up to start chatting.</p>
            <div className="flex gap-4 justify-center">
              <button onClick={() => router.push("/login")} className="bg-blue-500 text-white px-4 py-2 rounded">
                Login
              </button>
              <button onClick={() => router.push("/signup")} className="bg-gray-500 text-white px-4 py-2 rounded">
                Signup
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

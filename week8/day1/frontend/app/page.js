"use client";

import Link from "next/link";
import Image from "next/image";
import landingImg from "../public/builder.jpg";
import { useGetUserQuery } from "../redux/apiSlice";
import { useDispatch } from "react-redux";
import { logout, setUser } from "../redux/userSlice";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { data: userData } = useGetUserQuery();
  const dispatch = useDispatch();
  const router = useRouter();

  // Sync RTK Query data to Redux
  useEffect(() => {
    if (userData) dispatch(setUser(userData));
  }, [userData, dispatch]);

  const handleLogout = () => {
    dispatch(logout()); 
    localStorage.removeItem("token"); 
    router.push("/login");
  };

  return (
    <div className="flex h-screen bg-black text-white">
      {/* Left side */}
      <div className="flex flex-col justify-center items-start p-16 w-1/2">
        {/* Logo */}
        <h2 className="text-2xl font-bold mb-16">MyResume</h2>

        <h1 className="text-5xl font-bold mb-4">A free and open-source resume builder</h1>
        <h4 className="text-gray-400 mb-8 text-lg">
          Simplifies the process of creating, updating, and sharing your resume.
        </h4>

        <div className="flex gap-4">
          {userData ? (
            <>
              <Link
                href="/dashboard"
                className="px-6 py-3 bg-white text-black rounded font-medium hover:bg-gray-300 transition"
              >
                Go to Dashboard 
              </Link>
              <button
                onClick={handleLogout}
                className="px-6 py-3 border border-white rounded font-medium hover:bg-white hover:text-black transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="px-6 py-3 bg-white text-black rounded font-medium hover:bg-gray-300 transition"
            >
              Get Started
            </Link>
          )}
        </div>
      </div>

      {/* Right side with hover zoom */}
      <div className="w-1/2 relative overflow-hidden">
        <Link href={userData ? "/dashboard" : "/login"}>
          <div className="relative w-full h-full group cursor-pointer">
            <Image
              src={landingImg}
              alt="Landing"
              fill
              className="object-cover transform transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </Link>
      </div>
    </div>
  );
}

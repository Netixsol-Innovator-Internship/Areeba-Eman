"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center p-4">
      <Link href="/">
        
      </Link>
      <div className="flex gap-4">
        <Link href="/login" className="px-4 py-2 border border-white rounded hover:bg-white hover:text-black transition">
          Login
        </Link>
        <Link href="/signup" className="px-4 py-2 border border-white rounded hover:bg-white hover:text-black transition">
          Sign Up
        </Link>
      </div>
    </nav>
  );
}

"use client";

import ResumeCard from "../../components/ResumeCard";
import Link from "next/link";
import { useGetCvsQuery } from "../../redux/apiSlice";

export default function Dashboard() {
  const { data: cvs, isLoading, error } = useGetCvsQuery();

  if (isLoading) return <p className="p-8 text-white">Loading...</p>;
  if (error) return <p className="p-8 text-red-500">Failed to load CVs.</p>;

  return (
    <div className="p-8 text-white">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Resumes</h1>
        <Link
          href="/builder"
          className="px-4 py-2 bg-white text-black rounded font-medium hover:bg-gray-300 transition"
        >
          Create New
        </Link>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {/* Add "Create" and "Import" cards first */}
        <Link
          href="/builder"
          className="bg-gray-700 opacity-60 hover:opacity-80 w-52 h-64 p-6 rounded-lg flex flex-col justify-center items-center cursor-pointer hover:bg-gray-800 transition"
        >
          <span className="text-4xl mb-2">+</span>
          <span className="text-center">Create a new resume</span>
          <span className="text-gray-400 text-sm text-center mt-1">
            Start building from scratch
          </span>
        </Link>

        <div className="bg-gray-700  opacity-60 hover:opacity-80 w-52 h-64 p-6 rounded-lg flex flex-col justify-center items-center cursor-pointer hover:bg-gray-800 transition">
          <span className="text-4xl mb-2">↓</span>
          <span className="text-center">Import an existing...</span>
          <span className="text-gray-400 text-sm text-center mt-1">
            LinkedIn, JSON Resume, etc.
          </span>
        </div>

        {/* Map through user's CVs */}
        {cvs?.map((cv) => (
          <Link key={cv._id} href={`/builder/${cv._id}`}>
            <ResumeCard resume={cv} />
          </Link>
        ))}
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { motion } from "framer-motion";
import { useAppSelector } from "../store/store";

export default function ResultsTable() {
  const { results, marksheet } = useAppSelector((s) => s.assignment);

  if (!results || results.length === 0) return null;

  const handleDownload = async () => {
    if (!marksheet) return;

    try {
      // ✅ Backend URL from env
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      const response = await fetch(`${baseUrl}assignment/download/${marksheet}`);

      if (!response.ok) throw new Error("Download failed");

      // ✅ Convert to blob and trigger download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = marksheet;
      a.click();
      a.remove();
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("Failed to download marksheet");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="p-8 bg-gradient-to-br from-white to-blue-50 text-gray-900 rounded-2xl shadow-lg w-full max-w-5xl mx-auto mt-10"
    >
      <h2 className="text-3xl font-extrabold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500">
        Evaluation Results
      </h2>

      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-100/70">
              <th className="p-3 border text-left font-semibold text-gray-800">
                Student Name
              </th>
              <th className="p-3 border text-left font-semibold text-gray-800">
                Roll Number
              </th>
              <th className="p-3 border text-left font-semibold text-gray-800">
                Score
              </th>
              <th className="p-3 border text-left font-semibold text-gray-800">
                Remarks
              </th>
            </tr>
          </thead>
          <tbody>
            {results.map((r: any, idx: number) => (
              <motion.tr
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="hover:bg-blue-50 transition-all duration-200"
              >
                <td className="p-3 border">{r.studentName}</td>
                <td className="p-3 border">{r.rollNumber}</td>
                <td className="p-3 border font-semibold text-blue-600">
                  {r.score}
                </td>
                <td className="p-3 border text-gray-700">{r.remarks}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {marksheet && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={handleDownload}
          className="block mt-6 mx-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition-all"
        >
          📄 Download Marksheet
        </motion.button>
      )}
    </motion.div>
  );
}

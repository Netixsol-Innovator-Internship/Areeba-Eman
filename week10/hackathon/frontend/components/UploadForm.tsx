"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../store/store";
import { uploadAssignments } from "../store/assignmentSlice";
import { FileUp, Loader2, UploadCloud, Download } from "lucide-react";

export default function UploadForm() {
  const dispatch = useAppDispatch();
  const { uploading, config, marksheet } = useAppSelector((s) => s.assignment);
  const [files, setFiles] = useState<File[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!config) return alert("⚠️ Please create an assignment first!");
    if (files.length === 0) return alert("Please select PDF files first!");
    dispatch(uploadAssignments(files));
  };

  // ✅ Function to trigger marksheet download (same as your ResultsTable logic)
  const handleDownload = async () => {
    if (!marksheet) return;

    try {
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
      className="p-8 bg-gradient-to-br from-green-50 to-green-100 rounded-3xl shadow-xl w-full max-w-3xl mx-auto mt-8 border border-green-200"
    >
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-3xl font-extrabold text-green-700 text-center mb-6 flex items-center justify-center gap-2"
      >
        <UploadCloud size={26} /> Upload Student PDFs
      </motion.h2>

      <form onSubmit={handleSubmit} className="space-y-4 text-gray-800">
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-green-300 rounded-2xl p-6 hover:border-green-500 transition-all cursor-pointer bg-white/50">
          <FileUp className="text-green-600 mb-3" size={32} />
          <label className="font-semibold text-gray-700 mb-2">
            Select PDF Files
          </label>
          <input
            type="file"
            multiple
            accept=".pdf"
            onChange={handleChange}
            className="w-full text-center text-sm text-gray-600 cursor-pointer"
          />
          {files.length > 0 && (
            <p className="text-sm text-green-700 mt-2">
              {files.length} file{files.length > 1 && "s"} selected
            </p>
          )}
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={uploading}
          className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold shadow-md hover:bg-green-700 transition-all flex items-center justify-center"
        >
          {uploading ? (
            <>
              <Loader2 className="animate-spin mr-2" size={20} />
              Evaluating...
            </>
          ) : (
            "Upload & Evaluate"
          )}
        </motion.button>
      </form>

      {/* ✅ Download Marksheet Button */}
      {marksheet && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 flex justify-center"
        >
          <motion.button
            onClick={handleDownload}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:bg-green-700 transition-all"
          >
            <Download size={20} /> Download Marksheet (XLSX)
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
}

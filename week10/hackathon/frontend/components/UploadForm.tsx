"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../store/store";
import { uploadAssignments } from "../store/assignmentSlice";
import { FileUp, Loader2, UploadCloud } from "lucide-react";

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
    dispatch(uploadAssignments(files));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="p-8 bg-gradient-to-br from-green-50 to-green-100 rounded-3xl shadow-xl w-full max-w-2xl mx-auto mt-8 border border-green-200"
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

      {marksheet && (
        <motion.a
          href={marksheet}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          className="block mt-6 text-center bg-white border border-green-300 text-green-700 font-medium py-2 rounded-xl shadow-sm hover:bg-green-50 transition-all"
        >
          📄 Download Marksheet
        </motion.a>
      )}
    </motion.div>
  );
}

"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../store/store";
import { createAssignment } from "../store/assignmentSlice";
import { Loader2, CheckCircle } from "lucide-react";

export default function AssignmentForm() {
  const dispatch = useAppDispatch();
  const { creating, config } = useAppSelector((s) => s.assignment);
  const [form, setForm] = useState({
    title: "",
    instructions: "",
    mode: "strict",
    minWords: 0,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, minWords: Number(form.minWords) };
    dispatch(createAssignment(payload));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl shadow-xl w-full max-w-2xl mx-auto border border-blue-200"
    >
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-3xl font-extrabold text-blue-700 text-center mb-6"
      >
        ✍️ Create Assignment
      </motion.h2>

      <form onSubmit={handleSubmit} className="space-y-4 text-gray-800">
        <div>
          <label className="block font-semibold mb-1">Title</label>
          <input
            type="text"
            name="title"
            placeholder="Enter assignment title..."
            className="w-full border-2 border-blue-200 focus:border-blue-500 focus:ring focus:ring-blue-100 p-3 rounded-lg transition-all outline-none"
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Instructions</label>
          <textarea
            name="instructions"
            placeholder="Describe what students should do..."
            className="w-full border-2 border-blue-200 focus:border-blue-500 focus:ring focus:ring-blue-100 p-3 rounded-lg transition-all outline-none h-28"
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1">Mode</label>
            <select
              name="mode"
              className="w-full border-2 border-blue-200 focus:border-blue-500 focus:ring focus:ring-blue-100 p-3 rounded-lg transition-all outline-none"
              onChange={handleChange}
            >
              <option value="strict">Strict</option>
              <option value="loose">Loose</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">Minimum Words</label>
            <input
              type="number"
              name="minWords"
              placeholder="e.g. 500"
              className="w-full border-2 border-blue-200 focus:border-blue-500 focus:ring focus:ring-blue-100 p-3 rounded-lg transition-all outline-none"
              onChange={handleChange}
            />
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={creating}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold shadow-md hover:bg-blue-700 transition-all flex items-center justify-center"
        >
          {creating ? (
            <>
              <Loader2 className="animate-spin mr-2" size={20} />
              Creating...
            </>
          ) : (
            "Create Assignment"
          )}
        </motion.button>
      </form>

      {config && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-2 mt-5 text-green-600 font-semibold"
        >
          <CheckCircle size={22} />
          <span>
            Assignment Created: <b>{(config as any).title}</b>
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}

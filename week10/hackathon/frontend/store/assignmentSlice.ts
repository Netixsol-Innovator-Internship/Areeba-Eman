"use client";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// ---- Thunks ----
export const createAssignment = createAsyncThunk(
  "assignment/create",
  async (data: any, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE_URL}assignment/create`, data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Error creating assignment");
    }
  }
);

export const uploadAssignments = createAsyncThunk(
  "assignment/upload",
  async (files: File[], { rejectWithValue }) => {
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));
      const res = await axios.post(`${BASE_URL}assignment/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data; // { results, marksheet: fileName }
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Error uploading assignments");
    }
  }
);

// ---- Slice ----
const assignmentSlice = createSlice({
  name: "assignment",
  initialState: {
    config: null,
    results: [],
    marksheet: null,
    creating: false,   // ✅ separate loading flag for creation
    uploading: false,  // ✅ separate loading flag for uploading
    error: null as string | null,
  },
  reducers: {
    reset: (state) => {
      state.config = null;
      state.results = [];
      state.marksheet = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- createAssignment ---
      .addCase(createAssignment.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(createAssignment.fulfilled, (state, action) => {
        state.creating = false;
        state.config = action.payload.config;
      })
      .addCase(createAssignment.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload as string;
      })

      // --- uploadAssignments ---
      .addCase(uploadAssignments.pending, (state) => {
        state.uploading = true;
        state.error = null;
      })
      .addCase(uploadAssignments.fulfilled, (state, action) => {
        state.uploading = false;
        state.results = action.payload.results;
        state.marksheet = action.payload.marksheet;
      })
      .addCase(uploadAssignments.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.payload as string;
      });
  },
});

export const { reset } = assignmentSlice.actions;
export default assignmentSlice.reducer;


"use client";

import React from "react";
import { Provider } from "react-redux";
import { store } from "../store/store";
import AssignmentForm from "../components/AssignmentForm";
import UploadForm from "../components/UploadForm";
import ResultsTable from "../components/ResultsTable";

export default function Page() {
  return (
    <Provider store={store}>
      <main className="min-h-screen bg-gray-50 p-8">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">📘 Assignment Evaluator</h1>
        <AssignmentForm />
        <UploadForm />
        <ResultsTable />
      </main>
    </Provider>
  );
}

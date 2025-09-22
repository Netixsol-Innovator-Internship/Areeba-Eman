'use client';

import { useState } from "react";
import { useAskQuestionMutation, useUploadDocumentMutation } from "../redux/researchApi";
import { ArrowUpFromLine } from "lucide-react";


export default function ResearchPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [trace, setTrace] = useState([]);
  const [activeStep, setActiveStep] = useState(null);
  const [upload, setUpload] = useState({ title: "", topic: "", content: "" });
  const [showUpload, setShowUpload] = useState(false); // toggle upload form

  const [askQuestion, { isLoading }] = useAskQuestionMutation();
  const [uploadDocument] = useUploadDocumentMutation();

  const handleAsk = async () => {
    if (!question) return;
    const data = await askQuestion(question).unwrap();
    setAnswer(data.finalAnswer);
    setTrace(data.trace || []);
    setQuestion(""); 
  };

  const handleUpload = async () => {
    if (!upload.title || !upload.topic || !upload.content) return alert("Fill all fields");
    await uploadDocument(upload).unwrap();
    alert("✅ Document uploaded!");
    setUpload({ title: "", topic: "", content: "" });
    setShowUpload(false); // hide form after upload
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Research Assistant</h1>
        <button
          onClick={() => setShowUpload(!showUpload)}
          className="bg-blue-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold hover:bg-blue-600 transition"
        >
          <ArrowUpFromLine />
          
        </button>
      </header>

      {/* Upload Section (Toggleable) */}
      {showUpload && (
        <div className="bg-white shadow-md p-4 flex flex-wrap gap-2 justify-between items-center">
          <div className="flex flex-wrap gap-2 flex-1">
            <input
              type="text"
              placeholder="Title"
              value={upload.title}
              onChange={(e) => setUpload({ ...upload, title: e.target.value })}
              className="border p-2 rounded-md flex-1 min-w-[120px] focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text"
              placeholder="Topic"
              value={upload.topic}
              onChange={(e) => setUpload({ ...upload, topic: e.target.value })}
              className="border p-2 rounded-md flex-1 min-w-[120px] focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text"
              placeholder="Content"
              value={upload.content}
              onChange={(e) => setUpload({ ...upload, content: e.target.value })}
              className="border p-2 rounded-md flex-2 min-w-[200px] focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
            onClick={handleUpload}
            className="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600 transition"
          >
            Save
          </button>
        </div>
      )}

      {/* Chat & Answer */}
      <div className="flex-1 overflow-auto p-4 flex flex-col gap-4">
        {answer && (
          <div className="bg-white p-4 rounded-lg shadow-md max-w-3xl w-full mx-auto">
            <h2 className="font-semibold mb-2 text-gray-700">Answer:</h2>
            <div className="whitespace-pre-wrap text-gray-800">{answer}</div>
          </div>
        )}

        {trace.length > 0 && (
          <div className="bg-white p-4 rounded-lg shadow-md max-w-3xl w-full mx-auto overflow-y-auto max-h-96">
            <h2 className="font-semibold mb-2 text-gray-700">Step-by-step Graph:</h2>
            <div className="space-y-2">
              {trace.map((item, index) => (
                <div key={index} className="border rounded-md overflow-hidden">
                  <button
                    className="w-full text-left p-2 bg-gray-100 font-medium hover:bg-gray-200 transition"
                    onClick={() =>
                      setActiveStep(activeStep === index ? null : index)
                    }
                  >
                    {item.step}
                  </button>
                  {activeStep === index && (
                    <div className="p-2 bg-white">
                      <pre className="whitespace-pre-wrap text-sm text-gray-700">
                        {JSON.stringify(item.output, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Question Input at Bottom */}
      <div className="bg-white shadow-md p-4 flex gap-2 items-center sticky bottom-0">
        <textarea
          placeholder="Ask your question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="border p-2 rounded-md flex-1 focus:ring-2 focus:ring-green-400 h-16 resize-none"
        />
        <button
          onClick={handleAsk}
          className="bg-green-500 text-white px-4 py-2 rounded-md shadow hover:bg-green-600 transition"
        >
          {isLoading ? "Thinking..." : "Ask"}
        </button>
      </div>
    </div>
  );
}

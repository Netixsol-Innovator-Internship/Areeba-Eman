1. 📘 Intro Notes

LangGraph Concepts

Graph – The overall workflow that connects different steps (nodes) together.

State – The shared memory/data that flows between nodes as the graph runs.
Nodes – Individual steps (functions) that do a specific task (like calling an AI model).
Edges – Connections between nodes that define the order of execution.

-- Why LangGraph > LangChain (for new projects)

Visual + modular: LangGraph represents your logic as a graph of steps, which is easier to design and debug.
Stateful: Maintains context (memory) between steps without extra boilerplate.
Lightweight: Simpler setup than complex LangChain chains/agents.
Streamlined control: Better for iterative, multi-step workflows like chatbots, planners, and tools.

2. 💻 Mini Project

A working chatbot with memory built using:
LangGraph (for state + graph)
Gemini API via @langchain/google-genai
Node.js terminal CLI

🗂️ File: main.js
Runs in your terminal using readline.
Maintains conversation history using LangGraph state.

Extra Work
I also created a cute HTML + Tailwind UI version as a browser-based demo.
Files: index.js, index.html (not required for submission but included).

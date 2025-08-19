import { useEffect, useState } from "react";
import axios from "axios";
import { Task } from "./types";

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");

  const API = axios.create({
    baseURL: "https://areeba-week4-day1-backend.vercel.app/api",
  });

  useEffect(() => {
    API.get("/tasks").then((res) => setTasks(res.data));
  }, []);

  const addTask = async () => {
    if (!title.trim()) return alert("Task title is required");

    const res = await API.post("/tasks", { title });
    setTasks([...tasks, res.data]);
    setTitle("");
  };

  const toggleTask = async (id: string) => {
    const res = await API.put(`/tasks/${id}`);
    setTasks(tasks.map((t) => (t.id === id ? res.data : t)));
  };

  const deleteTask = async (id: string) => {
    await API.delete(`/tasks/${id}`);
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = tasks.length - completedCount;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="w-full max-w-2xl bg-white border-2 border-gray-200 rounded-2xl shadow-2xl p-8">
        <h1 className="text-3xl font-extrabold text-center text-purple-700 mb-6">
          🚀 Task Manager
        </h1>

        {/* Input Section */}
        <div className="flex gap-3 mb-6">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="✍️ Add a new task..."
            className="flex-1 border-2 border-purple-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <button
            onClick={addTask}
            className="bg-purple-500 hover:bg-purple-600 text-white font-semibold px-6 py-2 rounded-xl shadow-md transition"
          >
            Add
          </button>
        </div>

        {/* Task List */}
        <ul className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="flex justify-between items-center bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl border shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`font-medium ${
                    task.completed
                      ? "line-through text-gray-400"
                      : "text-gray-800"
                  }`}
                >
                  {task.title}
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    task.completed
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {task.completed ? "Completed" : "Pending"}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => toggleTask(task.id)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium shadow-md transition ${
                    task.completed
                      ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                      : "bg-green-500 hover:bg-green-600 text-white"
                  }`}
                >
                  {task.completed ? "Undo" : "Mark Complete"}
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-medium shadow-md transition"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>

        {/* Stats */}
        <div className="mt-6 flex justify-between text-gray-700 font-semibold">
          <p className="bg-green-100 text-green-700 px-3 py-1 rounded-lg shadow-sm">
            ✅ Completed: {completedCount}
          </p>
          <p className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-lg shadow-sm">
            ⏳ Pending: {pendingCount}
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;

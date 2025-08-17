import { useEffect, useState } from "react";
import API from "../api";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  const fetchTasks = async () => {
    try {
      const res = await API.get("/api/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      await API.post("/api/tasks", { title });
      setTitle("");
      fetchTasks();
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  const toggleTask = async (id, completed) => {
    try {
      await API.put(`/api/tasks/${id}`, { completed: !completed });
      fetchTasks();
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await API.delete(`/api/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Tasks</h1>
      <form onSubmit={addTask} className="flex gap-2 mb-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded w-full"
          placeholder="New task"
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Add
        </button>
      </form>
      <ul className="space-y-2">
        {tasks.map((t) => (
          <li
            key={t._id}
            className="flex justify-between items-center border p-2 rounded"
          >
            <span
              onClick={() => toggleTask(t._id, t.completed)}
              className={`cursor-pointer ${
                t.completed ? "line-through text-gray-500" : ""
              }`}
            >
              {t.title}
            </span>
            <button
              onClick={() => deleteTask(t._id)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

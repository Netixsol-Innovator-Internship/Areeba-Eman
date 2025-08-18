import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      const res = await API.get("/api/tasks");
      setTasks(res.data); // backend sends array
    } catch (err) {
      console.error("Error fetching tasks:", err.response?.data || err.message);
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

  const handleLogout = () => {
    localStorage.removeItem("token"); // remove token
    navigate("/login"); // redirect to login page
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="p-6">
      {/* Header with Logout */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Tasks</h1>
        <button
          onClick={handleLogout}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Logout
        </button>
      </div>

      {/* Add Task Form */}
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

      {/* Task List */}
      <ul className="space-y-2">
        {Array.isArray(tasks) && tasks.length > 0 ? (
          tasks.map((t) => (
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
          ))
        ) : (
          <p className="text-gray-500">No tasks found or failed to load.</p>
        )}
      </ul>
    </div>
  );
}

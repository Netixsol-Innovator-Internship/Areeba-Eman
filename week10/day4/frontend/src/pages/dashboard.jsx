import { useEffect, useState } from "react";
import { getTodos, addTodo, completeTodo, deleteTodo } from "../api";

export default function Dashboard() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    refreshTodos();
  }, []);

  async function refreshTodos() {
    setTodos(await getTodos());
  }

  async function handleAdd() {
    await addTodo(text);
    setText("");
    refreshTodos();
  }

  async function handleComplete(id) {
    await completeTodo(id);
    refreshTodos();
  }

  async function handleDelete(id) {
    await deleteTodo(id);
    await refreshTodos();
  }

  return (
    <div>
      <h2>Dashboard</h2>
      <input
        placeholder="Enter todo"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={handleAdd}>Add Todo</button>

      <ul>
  {todos.map((t) => (
    <li key={t.id} data-testid={`todo-${t.id}`}>
      <span
        style={{ textDecoration: t.completed ? "line-through" : "none" }}
        data-testid={`todo-text-${t.id}`}
      >
        {t.text}
      </span>
      {!t.completed && (
        <button
          onClick={() => handleComplete(t.id)}
          data-testid={`complete-${t.id}`}
        >
          Complete
        </button>
      )}
      <button
        onClick={() => handleDelete(t.id)}
        data-testid={`delete-${t.id}`}
      >
        Delete
      </button>
    </li>
  ))}
</ul>

    </div>
  );
}

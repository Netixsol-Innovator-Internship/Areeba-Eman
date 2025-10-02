import { useState, useEffect } from "react";
import { getTodos, addTodo } from "../api";

export default function Dashboard() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    (async () => {
      setTodos(await getTodos());
    })();
  }, []);

  async function handleAdd() {
    if (!text.trim()) return;
    const newTodo = await addTodo(text);
    setTodos([...todos, newTodo]);
    setText("");
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
          <li key={t.id}>{t.text}</li>
        ))}
      </ul>
    </div>
  );
}

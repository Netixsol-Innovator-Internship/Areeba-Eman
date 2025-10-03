import { useState } from "react";
import { login } from "../api";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    try {
      const data = await login(username, password);
      onLogin(data.access_token);
      
    } catch (err) {
      alert("Invalid credentials");
    }
  }

  return (
    <div className="login-container">
      <h2>Login</h2>
      <input
        placeholder="username:admin"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="password:1234"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

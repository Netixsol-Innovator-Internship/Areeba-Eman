import { useState } from "react";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";

function App() {
  const [token, setToken] = useState(null);

  return (
    <div>
      {!token ? (
        <Login onLogin={setToken} />
      ) : (
        <Dashboard />
      )}
    </div>
  );
}

export default App;

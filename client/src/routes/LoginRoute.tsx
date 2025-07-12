import { useState } from "react";
import { usePocketbase } from "../hooks/usePocketbase";
import { useNavigate } from "react-router";

export function LoginRoute() {
  const nav = useNavigate();
  const [state, setState] = useState({
    email: "",
    password: "",
  });

  const { pb, login } = usePocketbase();

  const handleLogin = async () => {
    try {
      await login(state.email, state.password);

      nav("/", { replace: true });
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="container flex items-center justify-center h-screen">
      <div className="card w-96 bg-neutral shadow-sm">
        <div className="card-body">
          <h2 className="card-title">Login</h2>
          <p>Please enter your credentials to log in.</p>

          <input
            type="text"
            name="email"
            placeholder="Email"
            className="input"
            value={state.email}
            onChange={(e) => setState({ ...state, email: e.target.value })}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="input"
            value={state.password}
            onChange={(e) => setState({ ...state, password: e.target.value })}
          />

          <div className="justify-end card-actions">
            <button className="btn btn-primary" onClick={handleLogin}>
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Outlet, useNavigate } from "react-router";
import { useAuth } from "../hooks";

export function AuthLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const nav = useNavigate();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    nav("/login");
    return;
  }

  return (
    <div>
      <Outlet />
    </div>
  );
}

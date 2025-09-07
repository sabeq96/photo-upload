import { Outlet, useNavigate } from "react-router";
import { useAuth } from "../hooks";

export function PublicLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const nav = useNavigate();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    nav("/");
    return;
  }

  return (
    <div>
      <Outlet />
    </div>
  );
}

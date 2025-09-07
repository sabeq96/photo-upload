import { Outlet, useNavigate } from "react-router";
import { useAuth } from "../hooks";
import { useEffect } from "react";

export function AuthLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      nav("/login");
    }
  }, [isAuthenticated]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Outlet />
    </div>
  );
}

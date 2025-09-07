import { Outlet, useNavigate } from "react-router";
import { useAuth } from "../hooks";
import { useEffect } from "react";
import { Card } from "primereact/card";

export function AuthLayout() {
  const { isAuthenticated, isLoading, user } = useAuth();
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
      <Card>Hello {user?.name || user?.email}</Card>
      <Outlet />
    </div>
  );
}

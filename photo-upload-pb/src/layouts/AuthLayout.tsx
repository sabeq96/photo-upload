import { Outlet, useNavigate } from "react-router";
import { useAuth } from "../hooks";
import { useEffect } from "react";
import { Card } from "primereact/card";

export function AuthLayout() {
  const { query } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    if (!query.data) {
      nav("/login");
    }
  }, [query.data]);

  if (query.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Card>Hello {query.data?.name || query.data?.email}</Card>
      <Outlet />
    </div>
  );
}

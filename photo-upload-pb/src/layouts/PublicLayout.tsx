import { Outlet, useNavigate } from "react-router";
import { useAuth } from "../hooks";
import { useEffect } from "react";

export function PublicLayout() {
  const { query } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    if (query.data) {
      nav("/");
    }
  }, [query.data]);

  if (query.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Outlet />
    </div>
  );
}

import { Outlet, useNavigate } from "react-router";
import { useAuth } from "../hooks";
import { useEffect } from "react";

export function PublicLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const nav = useNavigate();

  console.log("isAuthenticated", isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      nav("/");
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

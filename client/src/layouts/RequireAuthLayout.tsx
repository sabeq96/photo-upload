import { Outlet, useNavigate } from "react-router";
import { usePocketbase } from "../hooks/usePocketbase";
import { useEffect } from "react";

export function AppLayout() {
  const { pb, me } = usePocketbase();
  const nav = useNavigate();

  useEffect(() => {
    if (!pb.authStore.isValid) {
      nav("/login", { replace: true });
    }
  }, [pb.authStore.isValid, nav]);

  return (
    <div className="container mx-auto">
      <h1>
        Hi, <b>{me?.email}</b>
      </h1>
      <Outlet />
    </div>
  );
}

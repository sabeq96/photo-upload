import { Link, Outlet, Navigate } from "react-router";
import { useAuth } from "../hooks";

export function PublicLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // Redirect to home if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-base-100">
      <nav className="navbar bg-base-300">
        <div className="navbar-start">
          <Link to="/login" className="btn btn-ghost text-xl">
            Photo Upload
          </Link>
        </div>
        <div className="navbar-end">
          <Link to="/login" className="btn btn-ghost">
            Login
          </Link>
        </div>
      </nav>
      <main className="container mx-auto p-4">
        <Outlet />
      </main>
    </div>
  );
}

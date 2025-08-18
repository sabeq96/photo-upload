import { Link, Outlet } from "react-router";

export function Layout() {
  return (
    <div className="min-h-screen bg-base-100">
      <nav className="navbar bg-base-300">
        <div className="navbar-start">
          <Link to="/" className="btn btn-ghost text-xl">
            Photo Upload
          </Link>
        </div>
        <div className="navbar-end">
          <Link to="/" className="btn btn-ghost">
            Home
          </Link>
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

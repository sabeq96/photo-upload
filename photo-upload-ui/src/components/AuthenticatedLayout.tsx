import { Link, Outlet, Navigate } from "react-router";
import { useAuth } from "../hooks";

export function AuthenticatedLayout() {
  const { user, logout, isAuthenticated, isLoading } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

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

          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost">
              {user?.first_name || user?.email || "User"}
              <svg
                width="12"
                height="12"
                className="ml-2 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1024 1024"
              >
                <path d="M831.872 340.864 512 652.672 192.128 340.864a30.592 30.592 0 0 0-42.752 0 29.12 29.12 0 0 0 0 41.6L489.664 721.792a32.256 32.256 0 0 0 44.672 0l340.288-339.328a29.12 29.12 0 0 0 0-41.6 30.592 30.592 0 0 0-42.752 0z" />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
            >
              <li>
                <button onClick={handleLogout} className="text-left">
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <main className="container mx-auto">
        <Outlet />
      </main>
    </div>
  );
}

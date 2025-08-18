import { useAuth } from "../hooks";

export function HomePage() {
  const { user } = useAuth();

  return (
    <div className="hero min-h-96 bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">
            Welcome back{user?.first_name ? `, ${user.first_name}` : ""}!
          </h1>
          <p className="py-6">
            You are now logged in and can start uploading your photos.
          </p>
          <button className="btn btn-primary">Upload Photos</button>
        </div>
      </div>
    </div>
  );
}

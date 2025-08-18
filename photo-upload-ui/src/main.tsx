import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import "./index.css";
import { HomePage, LoginPage } from "./pages";
import { AuthenticatedLayout, PublicLayout } from "./components";
import { DirectusProvider, AuthProvider } from "./hooks";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthenticatedLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
    ],
  },
  {
    path: "/login",
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <LoginPage />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DirectusProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </DirectusProvider>
  </StrictMode>
);

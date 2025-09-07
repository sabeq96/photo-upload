import { PrimeReactProvider } from "primereact/api";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import { PocketBaseProvider } from "./context";
import "./index.css";
import { HomePage, LoginPage } from "./pages";
import { AuthLayout, PublicLayout } from "./layouts";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout />,
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
    <PrimeReactProvider>
      <PocketBaseProvider>
        <RouterProvider router={router} />
      </PocketBaseProvider>
    </PrimeReactProvider>
  </StrictMode>
);

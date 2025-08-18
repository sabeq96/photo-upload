import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import "./index.css";
import { HomePage, LoginPage } from "./pages";
import { Layout } from "./components";
import { DirectusProvider } from "./hooks";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DirectusProvider>
      <RouterProvider router={router} />
    </DirectusProvider>
  </StrictMode>
);

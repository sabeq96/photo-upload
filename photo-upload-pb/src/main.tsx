import { PrimeReactProvider } from "primereact/api";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import { PocketBaseProvider } from "./context";
import "./index.css";
import { HomePage } from "./pages";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
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

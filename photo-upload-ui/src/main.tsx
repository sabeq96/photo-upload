import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import "./index.css";
import { HomePage, LoginPage, AlbumsPage, CreateAlbumPage } from "./pages";
import { AuthenticatedLayout, PublicLayout } from "./components";
import { DirectusProvider, AuthProvider } from "./providers";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <AuthenticatedLayout />,
      children: [
        {
          index: true,
          element: <HomePage />,
        },
        {
          path: "albums",
          element: <AlbumsPage />,
        },
        {
          path: "albums/create",
          element: <CreateAlbumPage />,
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
  ],
  { basename: "/spa" }
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DirectusProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </DirectusProvider>
  </StrictMode>
);

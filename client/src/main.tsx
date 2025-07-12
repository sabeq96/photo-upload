import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { PocketbaseProvider } from "./context/pocketbaseContext.tsx";
import "./index.css";
import { AppLayout } from "./layouts/RequireAuthLayout.tsx";
import { AppRoute, LoginRoute } from "./routes";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <PocketbaseProvider>
        <Routes>
          <Route path="/login" element={<LoginRoute />} />

          <Route path="/" element={<AppLayout />}>
            <Route path="/" element={<AppRoute />} />
          </Route>
        </Routes>
      </PocketbaseProvider>
    </BrowserRouter>
  </StrictMode>
);

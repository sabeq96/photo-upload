import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { PocketbaseProvider } from "./context/pocketbaseContext.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PocketbaseProvider>
      <App />
    </PocketbaseProvider>
  </StrictMode>
);
